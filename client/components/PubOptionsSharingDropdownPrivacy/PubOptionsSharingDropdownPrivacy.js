import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';

const propTypes = {
	value: PropTypes.string,
	isDraft: PropTypes.bool,
	onChange: PropTypes.func
};
const defaultProps = {
	value: 'private',
	isDraft: false,
	onChange: ()=>{},
};

const PubOptionsDropdownPrivacy = function(props) {
	const keySuffix = Math.round(Math.random() * 25000);
	const items = {
		private: {
			value: 'private',
			title: 'Private',
			icon: 'pt-icon-lock2',
			onClick: ()=>{ props.onChange('private'); },
		},
		publicView: {
			value: props.isDraft ? 'publicView' : 'public',
			title: props.isDraft ? 'Public View' : 'Public',
			icon: props.isDraft ? 'pt-icon-eye-open' : 'pt-icon-globe',
			onClick: ()=>{ props.onChange(props.isDraft ? 'publicView' : 'public'); },
		},
		publicEdit: {
			value: 'publicEdit',
			title: 'Public Edit',
			icon: 'pt-icon-edit2',
			onClick: ()=>{ props.onChange('publicEdit'); },
		},
	};
	return (
		<div className="pub-options-dropdown-privacy-component">
			<DropdownButton
				label={items[props.value].title}
				icon={items[props.value].icon}
			>
				<ul className="pub-options-dropdown pt-menu">
					{Object.keys(items).filter((item, index)=> {
						return props.isDraft || index < 2;
					}).map((key)=> {
						const item = items[key];
						return (
							<li key={`${item.value}-option-${keySuffix}`}>
								<button
									className={`pt-menu-item pt-popover-dismiss ${item.icon}`}
									onClick={item.onClick}
									type="button"
								>
									<div className="title">{item.title}</div>
								</button>
							</li>
						);
					})}
				</ul>
			</DropdownButton>
		</div>
	);
};

PubOptionsDropdownPrivacy.propTypes = propTypes;
PubOptionsDropdownPrivacy.defaultProps = defaultProps;
export default PubOptionsDropdownPrivacy;
