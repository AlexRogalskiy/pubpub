import React from 'react';
import PropTypes from 'prop-types';
import { getJSON } from '@pubpub/editor';

require('./pubSideToc.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	activeContent: PropTypes.object,
	editorChangeObject: PropTypes.object.isRequired,
};

const defaultProps = {
	activeContent: undefined,
};

const PubSideToc = function(props) {
	/* activeContent will be defined on saved versions */
	/* editorChangeObject will be defined and used on working drafts */
	if (!props.activeContent && !props.editorChangeObject.view) { return null; }

	const docJson = props.activeContent || getJSON(props.editorChangeObject.view);

	const headings = docJson.content.filter((item)=> {
		return item.type === 'heading' && item.attrs.level < 3;
	}).map((item, index)=> {
		const textContent = item.content && item.content.filter((node)=> {
			/* Filter to remove inline non-text nodes: e.g. equations */
			return node.type === 'text';
		}).reduce((prev, curr)=> {
			return `${prev}${curr.text}`;
		}, '');
		return {
			title: textContent,
			level: item.attrs.level,
			href: textContent && textContent.trim().toLowerCase().replace(/ /gi, '-').replace(/[^a-zA-Z0-9-]/gi, ''),
			index: index,
		};
	}).filter((item)=> {
		/* Filter out empty headers */
		return item.title;
	});

	if (!headings.length) { return null; }

	return (
		<div className="pub-side-toc-component">
			{headings.map((item)=> {
				return (
					<a
						href={`#${item.href}`}
						className={`subsection-${item.level - 1}`}
						key={`subsection-${item.index}`}
						onClick={(evt)=> {
							/* In the working draft, don't use anchor tags for nav since we have */
							/* a fixed header bar. Plus, the URL with an anchor tag will behave */
							/* unexpectedly on reload given the async loading of doc. Instead, */
							/* manually scroll to the position and offset by fixed header height. */
							if (props.pubData.isDraft) {
								evt.preventDefault();
								document.getElementById(item.href).scrollIntoView();
								const currentTop = document.body.scrollTop || document.documentElement.scrollTop;
								document.body.scrollTop = document.documentElement.scrollTop = currentTop - 75;
							}
						}}
					>
						{item.title}
					</a>
				);
			})}
		</div>
	);
};

PubSideToc.propTypes = propTypes;
PubSideToc.defaultProps = defaultProps;
export default PubSideToc;
