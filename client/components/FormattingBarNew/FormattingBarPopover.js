/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button } from '@blueprintjs/core';
import { useFocusTrap } from '../../utils/useFocusTrap';

const FormattingBarPopover = (props) => {
	const { accentColor, button, children, onClose, isFullScreenWidth } = props;
	const beforeCloseAction = useRef();
	const [hasPendingChanges, setHasPendingChanges] = useState(false);

	console.log('hasPendingChanges', hasPendingChanges);

	const focusTrap = useFocusTrap({ clickOutsideDeactivates: !hasPendingChanges });

	return (
		<div
			className={classNames(
				'formatting-bar-popover-component',
				isFullScreenWidth && 'full-screen-width',
			)}
			style={{ background: accentColor }}
			ref={focusTrap.ref}
		>
			<div
				tabIndex="0"
				role="dialog"
				className="inner"
				aria-label={`Editing ${button.ariaTitle || button.title} options`}
			>
				{typeof children === 'function' ? children(setHasPendingChanges) : children}
			</div>
			<div className="close-button-container">
				<Button minimal small icon="cross" aria-label="Close options" onClick={onClose} />
			</div>
		</div>
	);
};

export default FormattingBarPopover;
