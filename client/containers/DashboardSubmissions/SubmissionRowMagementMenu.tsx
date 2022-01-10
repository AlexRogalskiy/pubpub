import React from 'react';
import { Button, Dialog } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';
import { Icon, IconName, DialogLauncher } from 'client/components';

const submissionManagementOptions = [
	{
		icon: 'cross',
		actionTitle: 'Delete',
		actionHelpText: 'Would you like to delete this Submission?',
		onSubmit: (submission) => () => {
			apiFetch('/api/submissions', {
				method: 'DELETE',
				body: JSON.stringify(submission),
			});
		},
	},
	{
		icon: 'thumbs-down',
		actionTitle: 'Decline',
		actionHelpText: 'Would you like to decline this Submission?',
		onSubmit: (submission) => () => {
			apiFetch('/api/submissions', {
				method: 'PUT',
				body: JSON.stringify({
					id: submission.id,
					status: 'declined',
				}),
			});
		},
	},
	{
		icon: 'endorsed',
		actionTitle: 'Accept',
		actionHelpText: 'Would you like to accept this Submission?',
		onSubmit: (submission) => () => {
			apiFetch('/api/submissions', {
				method: 'PUT',
				body: JSON.stringify({
					id: submission.id,
					status: 'accepted',
				}),
			});
		},
	},
];

type Props = {
	pub: any;
};

type DialogProps = {
	isOpen: boolean;
	actionTitle: string;
	actionHelpText: string;
	handleSubmission: (...args: any[]) => any;
	onClose: (...args: any[]) => any;
};

const SubmissionManageDialog = (props: DialogProps) => {
	const { isOpen, onClose, actionTitle, actionHelpText, handleSubmission } = props;
	return (
		<Dialog
			lazy={true}
			title={`${actionTitle} this submission`}
			className="submissionManagementDialog"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>{actionHelpText}</div>
			<Button minimal onClick={handleSubmission}>
				{actionTitle}
			</Button>
		</Dialog>
	);
};

const SubmissionRowManagementMenu = (props: Props) => {
	const { pub } = props;
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gridTemplateRows: '1fr',
				gridColumnGap: '40px',
			}}
		>
			{submissionManagementOptions.map((option, index) => {
				return (
					<div style={{ gridColumn: index + 1 }} key={option.actionTitle}>
						<DialogLauncher
							renderLauncherElement={({ openDialog }) => (
								<Button
									minimal
									small
									icon={<Icon icon={option.icon as IconName} iconSize={20} />}
									onClick={openDialog}
								/>
							)}
						>
							{({ isOpen, onClose }) => (
								<SubmissionManageDialog
									handleSubmission={option.onSubmit(pub.submission)}
									actionTitle={option.actionTitle}
									isOpen={isOpen}
									onClose={onClose}
									actionHelpText={option.actionHelpText}
								/>
							)}
						</DialogLauncher>
					</div>
				);
			})}
		</div>
	);
};

export default SubmissionRowManagementMenu;
