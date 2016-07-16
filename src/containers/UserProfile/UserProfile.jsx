import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {getUser} from './actions';
import {NavContentWrapper} from 'components';

import UserProfilePubs from './UserProfilePubs';
import UserProfileJournals from './UserProfileJournals';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const UserProfile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getUser(routerParams.username));
		}
	},

	render: function() {
		const profileData = safeGetInToJS(this.props.profileData, ['profileData']) || {};
		const ownProfile = safeGetInToJS(this.props.loginData, ['userData', 'username']) === this.props.username;
		const metaData = {
			title: (profileData.name || profileData.username) + ' · PubPub',
		};
		
		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: 'Follow', action: this.followUserToggle },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const ownProfileItems = ownProfile
		? [
			{ type: 'spacer' },
			{ type: 'link', text: 'Settings', link: '/settings'}
		]
		: [];
		const navItems = [
			{ type: 'link', text: 'Pubs', link: '/user/' + this.props.username, active: this.props.mode === undefined},
			// { type: 'link', text: 'Groups', link: '/user/' + this.props.username + '/groups', active: this.props.mode === 'groups'},
			{ type: 'link', text: 'Journals', link: '/user/' + this.props.username + '/journals', active: this.props.mode === 'journals'},
			...ownProfileItems,
		];

		
		return (
			<div>

				<Helmet {...metaData} />

				<div className={'profile-header section'}>
					<div style={styles.headerImageWrapper}>
						<img src={'https://jake.pubpub.org/unsafe/150x150/' + profileData.image} />
					</div>
					<div style={styles.headerTextWrapper}>
						<h1>{profileData.name}</h1>
						<p>{profileData.bio}</p>
						<p>{profileData.links}</p>
					</div>
				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
					{(() => {
						switch (this.props.mode) {
						case 'journals':
							return (
								<UserProfileJournals
									profileData={profileData}
									ownProfile={ownProfile}/>
							);
						default:
							return (
								<UserProfilePubs
									profileData={profileData}
									ownProfile={ownProfile} />
							);
						}
					})()}
				</NavContentWrapper>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		profileData: state.user,
		username: state.router.params.username,
		mode: state.router.params.mode,
	};
})( Radium(UserProfile) );

styles = {
	headerImageWrapper: {
		textAlign: 'center',
		display: 'table-cell',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	headerTextWrapper: {
		padding: '0em 1em',
		display: 'table-cell',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			textAlign: 'center',
			padding: '0em',
		}
	},
};
