import React from 'react';
import classNames from 'classnames';

import { usePageContext } from 'utils/hooks';
import { useSticky } from 'client/utils/useSticky';
import { FormattingBar, buttons } from 'components/FormattingBar';
import PubHeaderCollaborators from './PubHeaderCollaborators';

require('./pubHeaderFormatting.scss');

type Props = {
	collabData: any;
	disabled: boolean;
	editorWrapperRef: React.RefObject<HTMLDivElement>;
};

const PubHeaderFormatting = (props: Props) => {
	const { collabData, disabled, editorWrapperRef } = props;
	const { scopeData } = usePageContext();
	const { canEdit, canEditDraft } = scopeData.activePermissions;

	useSticky({
		target: '.pub-draft-header-component',
		isActive: !disabled,
		offset: 37,
	});

	if (!(canEdit || canEditDraft)) {
		return null;
	}

	return (
		<div className={classNames('pub-draft-header-component', disabled && 'disabled')}>
			<FormattingBar
				buttons={buttons.fullButtonSet}
				editorChangeObject={props.collabData.editorChangeObject || {}}
				controlsConfiguration={{
					container: editorWrapperRef.current!,
					isAbsolutelyPositioned: true,
					isFullScreenWidth: true,
				}}
			/>
			<div className="right-content">
				<PubHeaderCollaborators collabData={props.collabData} />
				<span className={`collab-status ${collabData.status}`}>
					{collabData.status}
					{collabData.status === 'saving' || collabData.status === 'connecting'
						? '...'
						: ''}
				</span>
			</div>
		</div>
	);
};
export default PubHeaderFormatting;
