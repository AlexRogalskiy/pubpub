import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Checkbox, Icon, Popover, Radio } from '@blueprintjs/core';

import { toTitleCase, joinOxford } from 'utils/strings';

import { Mode, allFilters, filterToPlural } from './constants';

require('./pubEdgeListingControls.scss');

const propTypes = {
	accentColor: PropTypes.string.isRequired,
	filters: PropTypes.arrayOf(PropTypes.string).isRequired,
	mode: PropTypes.string.isRequired,
	showFilterMenu: PropTypes.bool,
	onNextClick: PropTypes.func.isRequired,
	onBackClick: PropTypes.func.isRequired,
	onModeChange: PropTypes.func.isRequired,
	onFilterToggle: PropTypes.func.isRequired,
	onAllFilterToggle: PropTypes.func.isRequired,
	carouselControlsDisabled: PropTypes.bool,
};

const defaultProps = {
	showFilterMenu: false,
	carouselControlsDisabled: false,
};

const PubEdgeListingControls = (props) => {
	const {
		accentColor,
		carouselControlsDisabled,
		filters,
		mode,
		showFilterMenu,
		onNextClick,
		onBackClick,
		onModeChange,
		onFilterToggle,
		onAllFilterToggle,
	} = props;
	const setCarousel = useCallback(() => onModeChange(Mode.Carousel), [onModeChange]);
	const setList = useCallback(() => onModeChange(Mode.List), [onModeChange]);
	const filterMenuItems = allFilters
		.map((filter) => {
			const checked = filters.indexOf(filter) > -1;

			return (
				<Checkbox key={filter} checked={checked} onChange={() => onFilterToggle(filter)}>
					{toTitleCase(filter)} items of this pub
				</Checkbox>
			);
		})
		.concat(
			<Checkbox
				key="all"
				onChange={onAllFilterToggle}
				checked={filters.length === allFilters.length}
			>
				All related items
			</Checkbox>,
		);

	const menu = (
		<div
			className="pub-edge-listing-controls-component-menu"
			style={{ border: `1px solid ${accentColor}` }}
		>
			<h6>Include:</h6>
			{filterMenuItems}
			<h6>Show as:</h6>
			<Radio checked={mode === Mode.Carousel} onChange={setCarousel}>
				Carousel
			</Radio>
			<Radio checked={mode === Mode.List} onChange={setList}>
				List
			</Radio>
		</div>
	);

	const carouselControlColor = carouselControlsDisabled ? '#a1a1a1' : accentColor;

	return (
		<nav className="pub-edge-listing-controls-component">
			<span className="filters">
				{filters.length > 0 && joinOxford(filters.map(filterToPlural))}
			</span>
			<ButtonGroup minimal>
				{mode === Mode.Carousel && (
					<>
						<Button
							onClick={onBackClick}
							minimal
							small
							aria-label="Previous connection"
							disabled={carouselControlsDisabled}
						>
							<Icon icon="circle-arrow-left" color={carouselControlColor} />
						</Button>
						<Button
							onClick={onNextClick}
							minimal
							small
							aria-label="Next connection"
							disabled={carouselControlsDisabled}
						>
							<Icon icon="circle-arrow-right" color={carouselControlColor} />
						</Button>
					</>
				)}

				{showFilterMenu && (
					<Popover content={menu} minimal>
						<Button
							color={accentColor}
							minimal
							small
							aria-label="Show filtering options"
						>
							<Icon icon="filter" color={accentColor} />
						</Button>
					</Popover>
				)}
			</ButtonGroup>
		</nav>
	);
};

PubEdgeListingControls.propTypes = propTypes;
PubEdgeListingControls.defaultProps = defaultProps;
export default PubEdgeListingControls;
