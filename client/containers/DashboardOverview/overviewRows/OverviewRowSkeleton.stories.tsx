import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Icon } from '@blueprintjs/core';

import OverviewRowSkeleton from './OverviewRowSkeleton';

storiesOf('containers/DashboardOverview/OverviewRowSkeleton', module).add('default', () => (
	<OverviewRowSkeleton
		title="Machine Learning with Statistical Imputation for Predicting Drug Approvals"
		byline={<div>by Andrew W. Lo, Kien Wei Siah, and Chi Heem Wong</div>}
		href="#"
		leftIcon="pubDoc"
		iconLabelPairs={[
			{ icon: 'globe', label: 'Published 12 days ago' },
			{ icon: 'chat', label: '65' },
		]}
		rightElement={
			<Button icon={<Icon icon="circle-arrow-right" iconSize={20} />} minimal large />
		}
	/>
));
