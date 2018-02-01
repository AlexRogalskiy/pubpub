import React from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./notifications.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	notificationsData: PropTypes.object.isRequired,
};

const Notifications = (props)=> {
	const notificationsData = props.notificationsData;

	return (
		<div id="notifications-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
				hideNav={props.locationData.isBasePubPub}
			>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>Notifications</h1>

							{!notificationsData.results.length &&
								<NonIdealState
									visual="notifications"
									title="No Notifications"
								/>
							}

							{!!notificationsData.results.length &&
								<div className="notifications-list">
									{notificationsData.results.sort((foo, bar)=> {
										if (foo.updatedAt > bar.updatedAt) { return 1; }
										if (foo.updatedAt < bar.updatedAt) { return -1; }
										return 0;
									}).map((result)=> {
										return (
											<div>{result.verb}</div>
										);
									})}
									{JSON.stringify(notificationsData, null, 2)}
								</div>
							}
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Notifications.propTypes = propTypes;
export default Notifications;

hydrateWrapper(Notifications);
