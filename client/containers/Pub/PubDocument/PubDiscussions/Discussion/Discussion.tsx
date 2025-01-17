import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from '@blueprintjs/core';

import { Icon } from 'components';
import { apiFetch } from 'client/utils/apiFetch';
import { usePageContext } from 'utils/hooks';

import { PubPageData, PubPageDiscussion } from 'types';
import { discussionMatchesSearchTerm } from '../discussionUtils';
import DiscussionInput from './DiscussionInput';
import LabelList from './LabelList';
import ManageTools, { SortType } from './ManageTools';
import ThreadComment from './ThreadComment';

require('./discussion.scss');

type PubPageThreadComment = PubPageDiscussion['thread']['comments'][number];

type Props = {
	pubData: PubPageData;
	discussionData: PubPageDiscussion;
	updateLocalData: (kind: string, patch: any) => unknown;
	canPreview?: boolean;
	searchTerm?: string;
};

const sortThreadComments = (threadComments: PubPageThreadComment[], sortType: SortType) => {
	if (sortType === 'alphabetical') {
		return threadComments
			.concat()
			.sort((a, b) => (a.author.lastName > b.author.lastName ? 1 : -1));
	}
	return threadComments.concat().sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
};

const isPreviewExpandedByHash = (discussionId: string) => {
	return window.location.hash === `#discussion-${discussionId}`;
};

const Discussion = (props: Props) => {
	const {
		pubData,
		discussionData,
		canPreview = false,
		searchTerm = null,
		updateLocalData,
	} = props;
	const { communityData, scopeData, locationData, loginData } = usePageContext();
	const { canView, canCreateDiscussions, canAdmin } = scopeData.activePermissions;
	const [previewExpanded, setPreviewExpanded] = useState(false);
	const [emphasized, setEmphasized] = useState(false);
	const [sortType, setSortType] = useState<SortType>('chronological');
	const isPreview = canPreview && !previewExpanded;
	const canReply = canView || canCreateDiscussions;
	const isDiscussionAuthor = loginData.id === discussionData.userId;
	const showManageTools = canAdmin || (isDiscussionAuthor && !discussionData.isClosed);
	const discussionId = discussionData.id;

	useEffect(() => {
		if (isPreviewExpandedByHash(discussionId)) {
			setPreviewExpanded(true);
			setEmphasized(true);
		}
	}, [discussionId]);

	const renderPreviewDiscussionsAndOverflow = (threadComments, minShown) => {
		let shownDiscussionsCount = 0;
		let pendingHiddenCount = 0;
		const elements: React.ReactNode[] = [];

		const flushPendingCount = (threadCommentId: string) => {
			if (pendingHiddenCount > 0) {
				elements.push(
					<div key={threadCommentId} className="overflow-listing">
						{' '}
						+ {pendingHiddenCount} more...
					</div>,
				);
			}
			pendingHiddenCount = 0;
		};

		threadComments.forEach((threadComment, index) => {
			const isRootThread = index === 0;
			const meetsMinimum = shownDiscussionsCount < minShown;
			const matchesSearch = discussionMatchesSearchTerm(threadComment, searchTerm);
			const isPreviewDiscussion = isRootThread || !matchesSearch;
			if (isRootThread || meetsMinimum || matchesSearch) {
				++shownDiscussionsCount;
				flushPendingCount(threadComment.id);
				elements.push(
					<ThreadComment
						key={threadComment.id}
						discussionData={discussionData}
						isPreview={isPreviewDiscussion}
						updateLocalData={updateLocalData}
						threadCommentData={threadComment}
						pubData={pubData}
					/>,
				);
			} else {
				++pendingHiddenCount;
			}
		});

		flushPendingCount('root');
		return elements;
	};

	const handleUpdateDiscussion = (discussionUpdates) => {
		return apiFetch('/api/discussions', {
			method: 'PUT',
			body: JSON.stringify({
				...discussionUpdates,
				accessHash: locationData.query.access,
				discussionId: discussionData.id,
				pubId: pubData.id,
				communityId: communityData.id,
			}),
		}).then((updatedDiscussionData) => {
			updateLocalData('pub', {
				discussions: pubData.discussions.map((discussion) => {
					if (discussion.id === discussionData.id) {
						return {
							...discussion,
							...updatedDiscussionData, // Hack to get thread edits in place
						};
					}
					return discussion;
				}),
			});
		});
	};

	const renderAnchorText = () => {
		const { anchors } = discussionData;
		if (anchors) {
			const [firstAnchor] = anchors.sort((a, b) => a.historyKey - b.historyKey);
			if (firstAnchor) {
				const { originalTextPrefix, originalText, originalTextSuffix } = firstAnchor;
				return (
					<div className="anchor-text">
						{originalTextPrefix}
						<span className="exact">{originalText}</span>
						{originalTextSuffix}
					</div>
				);
			}
		}
		return null;
	};

	const renderDiscussions = () => {
		const filteredThreadComments = discussionData.thread.comments;
		if (isPreview) {
			return renderPreviewDiscussionsAndOverflow(filteredThreadComments, 2);
		}
		return sortThreadComments(filteredThreadComments, sortType).map((item) => {
			return (
				<ThreadComment
					key={item.id}
					discussionData={discussionData}
					updateLocalData={updateLocalData}
					threadCommentData={item}
					isPreview={isPreview}
					pubData={pubData}
				/>
			);
		});
	};

	const renderInput = () => {
		if (!canReply) {
			return null;
		}
		return (
			<DiscussionInput
				key={discussionData.thread.comments.length}
				discussionData={discussionData}
			/>
		);
	};

	return (
		<div
			tabIndex={-1}
			role="button"
			id={`discussion-${discussionData.id}`}
			className={classNames(
				'discussion-component',
				isPreview && 'preview',
				previewExpanded && 'expanded-preview',
				showManageTools && 'has-manage-tools',
				emphasized && 'emphasized',
			)}
			onClick={() => {
				setEmphasized(false);
				if (isPreview) {
					setPreviewExpanded(isPreview);
				}
			}}
		>
			{canPreview && !isPreview && (
				<Button
					minimal
					small
					className="collapse-button"
					onClick={() => setPreviewExpanded(false)}
					icon={
						<Icon
							icon="collapse-all"
							iconSize={12}
							color={communityData.accentColorDark}
						/>
					}
				/>
			)}
			<LabelList pubData={pubData} discussionData={discussionData} />
			{!isPreview && (
				<>
					{showManageTools && (
						<ManageTools
							pubData={pubData}
							discussionData={discussionData}
							onUpdateDiscussion={handleUpdateDiscussion}
							sortType={sortType}
							setSortType={setSortType}
						/>
					)}
					{renderAnchorText()}
				</>
			)}
			{renderDiscussions()}
			{!isPreview && renderInput()}
		</div>
	);
};

export default Discussion;
