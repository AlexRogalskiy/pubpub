import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import {
	chooseCollectionForPub,
	createReadingParamUrl,
	getNeighborsInCollectionPub,
	useCollectionPubs,
} from 'utils/collections';
import { pubDataProps } from 'types/pub';
import { pubUrl } from 'shared/utils/canonicalUrls';
import { GridWrapper } from 'components';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import PubPreview from 'components/PubPreview/PubPreview';

const propTypes = {
	pubData: pubDataProps.isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const PubReadNext = (props) => {
	const { pubData, updateLocalData } = props;
	const { locationData, communityData } = useContext(PageContext);
	const currentCollection = chooseCollectionForPub(pubData, locationData);
	const { pubs } = useCollectionPubs(updateLocalData, currentCollection);
	const { nextPub } = getNeighborsInCollectionPub(pubs, pubData);
	const { readNextPreviewSize = 'choose-best' } = currentCollection || {};
	if (readNextPreviewSize === 'none') {
		return null;
	}
	if (!nextPub) {
		return null;
	}
	const useImage = !!pubData.avatar;
	const size =
		readNextPreviewSize === 'choose-best'
			? useImage
				? 'medium'
				: 'minimal'
			: readNextPreviewSize;
	return (
		<div className="pub-read-next-component">
			<GridWrapper containerClassName="pub">
				<h2>Read next from {currentCollection.title}</h2>
				<PubPreview
					size={size}
					pubData={nextPub}
					customPubUrl={createReadingParamUrl(
						pubUrl(communityData, nextPub),
						currentCollection,
					)}
				/>
			</GridWrapper>
		</div>
	);
};

PubReadNext.propTypes = propTypes;
export default PubReadNext;