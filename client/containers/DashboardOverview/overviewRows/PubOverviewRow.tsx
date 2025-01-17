import React from 'react';
import classNames from 'classnames';
import { AnchorButton } from '@blueprintjs/core';

import { PubByline } from 'components';
import { DefinitelyHas, Pub as BasePub } from 'types';
import { pubUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';
import { usePageContext } from 'utils/hooks';

import OverviewRowSkeleton from './OverviewRowSkeleton';
import { getPubReleasedStateLabel, getScopeSummaryLabels } from './labels';

type Pub = DefinitelyHas<BasePub, 'attributions'>;

type Props = {
	leftIconElement?: React.ReactNode;
	rightElement?: React.ReactNode;
	className?: string;
	pub: Pub;
	inCollection?: boolean;
};

const PubOverviewRow = (props: Props) => {
	const {
		pub,
		className,
		inCollection,
		leftIconElement = null,
		rightElement: providedRightElement,
	} = props;
	const { communityData } = usePageContext();
	const rightElement = providedRightElement || (
		<AnchorButton
			minimal
			icon="circle-arrow-right"
			href={pubUrl(communityData, pub)}
			target="_blank"
		/>
	);
	return (
		<OverviewRowSkeleton
			className={classNames('pub-overview-row-component', className)}
			href={getDashUrl({ pubSlug: pub.slug })}
			title={pub.title}
			byline={<PubByline pubData={pub} linkToUsers={false} truncateAt={8} />}
			iconLabelPairs={[
				...getScopeSummaryLabels(pub.scopeSummary),
				getPubReleasedStateLabel(pub),
			]}
			leftIcon={leftIconElement || 'pubDoc'}
			rightElement={rightElement}
			darkenRightIcons={inCollection}
		/>
	);
};

export default PubOverviewRow;
