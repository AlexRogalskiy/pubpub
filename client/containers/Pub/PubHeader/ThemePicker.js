import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Color from 'color';
import { Button } from 'reakit';
import { Card } from '@blueprintjs/core';

import { ColorInput, ImageUpload } from 'components';
import PubHeaderBackground from './PubHeaderBackground';

require('./themePicker.scss');

const propTypes = {};

const TextStyleChoice = React.forwardRef(
	({ label, className, onClick, selected, style, pubData, communityData }, ref) => {
		return (
			<Button
				className={classNames('text-style-choice')}
				onClick={onClick}
				ref={ref}
				title={label}
			>
				<PubHeaderBackground
					pubData={pubData}
					communityData={communityData}
					blur={true}
					className={classNames(
						'example',
						className,
						'selectable',
						selected && 'selected',
					)}
					style={style || {}}
				>
					<div className="example-text">Aa</div>
				</PubHeaderBackground>
				<div className="label">{label}</div>
			</Button>
		);
	},
);

const TintChoice = React.forwardRef(({ label, onClick, color, selected }, ref) => {
	return (
		<Button className="tint-choice" onClick={onClick} ref={ref} title={label}>
			<div className="example">
				<div className="transparency" />
				<div
					className={classNames('inner', 'selectable', selected && 'selected')}
					style={{ backgroundColor: color }}
				/>
			</div>
			<div className="label">{label}</div>
		</Button>
	);
});

const setBackgroundTypeImage = (backgroundType, hasImage) => {
	switch (backgroundType) {
		case 'color':
		case 'color-and-image':
			return hasImage ? 'color-and-image' : 'color';
		case 'image':
		default:
			return hasImage ? 'image' : null;
	}
};

const setBackgroundTypeColor = (backgroundType, hasColor) => {
	switch (backgroundType) {
		case 'image':
		case 'color-and-image':
			return hasColor ? 'color-and-image' : 'image';
		case 'color':
		default:
			return hasColor ? 'color' : null;
	}
};

const ThemePicker = React.forwardRef((props, ref) => {
	const { updateLocalData, pubData, communityData } = props;
	const { headerBackgroundColor, headerBackgroundImage, headerStyle } = pubData;

	const updatePubBackgroundColor = (color) => {
		updateLocalData('pub', {
			headerBackgroundColor: color,
		});
	};

	const updatePubHeaderStyle = (style) => {
		updateLocalData('pub', {
			headerStyle: style,
		});
	};

	const updatePubHeaderImage = (image) => {
		updateLocalData('pub', {
			headerBackgroundImage: image,
		});
	};

	return (
		<Card className="theme-picker-component" elevation={2}>
			<div className="section">
				<div className="title">Background image</div>
				<ImageUpload
					defaultImage={headerBackgroundImage}
					onNewImage={updatePubHeaderImage}
					width={150}
					canClear={true}
					helperText={<span>Suggested minimum dimensions: 1200px x 800px.</span>}
				/>
			</div>
			<div className="section">
				<div className="title">Background tint</div>
				<div className="section-row">
					<TintChoice
						label="None"
						onClick={() => updatePubBackgroundColor(null)}
						selected={!headerBackgroundColor}
					/>
					<TintChoice
						label="Community accent color"
						color={Color(communityData.accentColorDark).alpha(0.75)}
						onClick={() => updatePubBackgroundColor('community')}
						selected={headerBackgroundColor === 'community'}
					/>
					<ColorInput
						value={headerBackgroundColor || 'black'}
						onChange={(color) => {
							const hexWithAlpha =
								color.hex + Math.round(color.rgb.a * 255).toString(16);
							updatePubBackgroundColor(hexWithAlpha);
						}}
					>
						{(color) => (
							<TintChoice
								label="Custom"
								className="light"
								color={color}
								selected={
									headerBackgroundColor && headerBackgroundColor !== 'community'
								}
							/>
						)}
					</ColorInput>
				</div>
			</div>
			<div className="section">
				<div className="title">Text style</div>
				<div className="section-row">
					<TextStyleChoice
						pubData={pubData}
						communityData={communityData}
						label="Light"
						className="light"
						onClick={() => updatePubHeaderStyle('light')}
						selected={!headerStyle || headerStyle === 'light'}
					/>
					<TextStyleChoice
						pubData={pubData}
						communityData={communityData}
						label="Dark"
						className="dark"
						onClick={() => updatePubHeaderStyle('dark')}
						selected={headerStyle === 'dark'}
					/>
					<TextStyleChoice
						pubData={pubData}
						communityData={communityData}
						label="White Blocks"
						className="white-blocks"
						onClick={() => updatePubHeaderStyle('white-blocks')}
						selected={headerStyle === 'white-blocks'}
					/>
					<TextStyleChoice
						pubData={pubData}
						communityData={communityData}
						label="Black Blocks"
						className="black-blocks"
						onClick={() => updatePubHeaderStyle('black-blocks')}
						selected={headerStyle === 'black-blocks'}
					/>
				</div>
			</div>
		</Card>
	);
});

ThemePicker.propTypes = propTypes;
export default ThemePicker;
