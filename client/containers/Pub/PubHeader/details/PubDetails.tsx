import React from 'react';
import dateFormat from 'dateformat';

import { collectionUrl } from 'utils/canonicalUrls';
import { getPubPublishedDate, getPubUpdatedDate, getPubCreatedDate } from 'utils/pub/pubDates';
import { ClickToCopyButton, ContributorsList } from 'components';
import { getAllPubContributors } from 'utils/contributors';
import { usePageContext } from 'utils/hooks';

import { Pub } from 'types';
import SmallHeaderButton from '../SmallHeaderButton';
import CitationsPreview from '../CitationsPreview';

require('./pubDetails.scss');

type Props = {
	pubData: Pub;
	onCloseHeaderDetails: (...args: any[]) => any;
	communityData: {};
};

const PubDetails = (props: Props) => {
	const { communityData, onCloseHeaderDetails, pubData } = props;
	const { collectionPubs } = pubData;
	const contributors = getAllPubContributors(pubData);
	const { scopeData } = usePageContext();
	const { canView } = scopeData.activePermissions;

	const createdAt = getPubCreatedDate(pubData);
	const publishedAt = getPubPublishedDate(pubData);
	const updatedAt = getPubUpdatedDate({ pub: pubData });

	return (
		<div className="pub-details-component">
			<h3 className="pub-title">{pubData.title}</h3>
			<SmallHeaderButton
				className="mobile-close-details-button"
				onClick={onCloseHeaderDetails}
				icon="cross"
			/>
			<div className="sections-wrapper">
				<div className="section contributors">
					<h6 className="pub-header-themed-secondary">
						Contributors ({contributors.length})
					</h6>
					<ContributorsList attributions={contributors} />
				</div>
				<div className="section publication-dates">
					{canView && (
						<React.Fragment>
							<h6 className="pub-header-themed-secondary">Created</h6>
							<div className="full-height-date">
								{dateFormat(createdAt, 'mmm dd, yyyy')}
							</div>
						</React.Fragment>
					)}
					<h6 className="pub-header-themed-secondary">Published</h6>
					<div className="full-height-date">
						{publishedAt ? dateFormat(publishedAt, 'mmm dd, yyyy') : <i>Unpublished</i>}
					</div>
					{updatedAt && updatedAt !== publishedAt && (
						<React.Fragment>
							<h6 className="pub-header-themed-secondary">Updated</h6>
							<div className="full-height-date">
								{dateFormat(updatedAt, 'mmm dd, yyyy')}
							</div>
						</React.Fragment>
					)}
				</div>
				<div className="section citation-and-doi">
					{pubData.doi && (
						<React.Fragment>
							<h6 className="pub-header-themed-secondary">DOI</h6>{' '}
							<ClickToCopyButton
								copyString={`https://doi.org/${pubData.doi}`}
								className="click-to-copy"
								beforeCopyPrompt="Copy doi.org link"
							>
								{pubData.doi}
							</ClickToCopyButton>
						</React.Fragment>
					)}
					<CitationsPreview pubData={pubData} />
				</div>
				<div className="section collections">
					<h6 className="pub-header-themed-secondary">
						{/* @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'. */}
						Appears in Collections ({collectionPubs.length})
					</h6>
					<div className="collection-list">
						{/* @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'. */}
						{collectionPubs.length === 0 && (
							<i className="collection-list-entry">
								This pub doesn't belong to any collections.
							</i>
						)}
						{/* @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'. */}
						{collectionPubs.map((collectionPub) => {
							const { collection } = collectionPub;
							if (collection) {
								return (
									<a
										className="collection-list-entry hoverline"
										href={collectionUrl(communityData, collection)}
									>
										{collection.title}
									</a>
								);
							}
							return null;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
export default PubDetails;
