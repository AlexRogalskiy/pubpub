import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { apiFetch, getResizedUrl } from 'utilities';

require('./header.scss');

const propTypes = {
	locationData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,

	// userName: PropTypes.string,
	// userInitials: PropTypes.string,
	// userSlug: PropTypes.string,
	// userAvatar: PropTypes.string,
	// userIsAdmin: PropTypes.bool,

	smallHeaderLogo: PropTypes.string,
	largeHeaderLogo: PropTypes.string,
	largeHeaderDescription: PropTypes.string,
	largeHeaderBackground: PropTypes.string,

	// onLogout: PropTypes.func.isRequired,
	// isBasePubPub: PropTypes.bool,
	// isLandingPage: PropTypes.bool,

};

const defaultProps = {
	// userName: undefined,
	// userInitials: undefined,
	// userSlug: undefined,
	// userAvatar: undefined,
	// userIsAdmin: undefined,
	smallHeaderLogo: undefined,
	largeHeaderLogo: undefined,
	largeHeaderDescription: undefined,
	largeHeaderBackground: undefined,
	// isBasePubPub: false,
	// isLandingPage: false,
};

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: '',
		};
		this.handleLogout = this.handleLogout.bind(this);
	}

	componentDidMount() {
		if (window.location.pathname !== '/') {
			this.setState({
				redirect: `?redirect=${window.location.pathname}${window.location.search}`
			});
		}
	}
	handleLogout() {
		apiFetch('/api/logout')
		.then(()=> { window.location.href = '/'; });
	}

	render() {
		const loggedIn = !!this.props.loginData.slug;
		const isBasePubPub = this.props.locationData.isBasePubPub;
		const isLandingPage = this.props.locationData.path === '/';
		const showGradient = isLandingPage && !!this.props.largeHeaderBackground;
		const backgroundStyle = {};

		if (showGradient) {
			const resizedBackground = getResizedUrl(this.props.largeHeaderBackground, 'fit-in', '1500x600');
			backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
		}
		if (isBasePubPub && !isLandingPage) {
			backgroundStyle.boxShadow = '0 0 0 1px rgba(16, 22, 26, 0.1), 0 0 0 rgba(16, 22, 26, 0), 0 1px 1px rgba(16, 22, 26, 0.2)';
		}

		const resizedSmallHeaderLogo = getResizedUrl(this.props.smallHeaderLogo, 'fit-in', '0x50');
		const resizedLargeHeaderLogo = getResizedUrl(this.props.largeHeaderLogo, 'fit-in', '0x200');
		const useAccentsString = isBasePubPub ? '' : 'accent-background accent-color';
		return (
			<nav className={`header-component ${useAccentsString} ${this.props.largeHeaderBackground && isLandingPage ? 'has-image' : ''}`} style={backgroundStyle} >
				<div className={showGradient ? 'header-gradient' : ''}>
					<div className="container">
						<div className="row">
							<div className="col-12">

								{/* App Logo - do not show on homepage */}
								{(!isLandingPage || isBasePubPub) &&
									<div className="headerItems headerItemsLeft">
										<a href="/">
											<img alt="header logo" className="headerLogo" src={resizedSmallHeaderLogo} />
										</a>
									</div>
								}

								<div className="headerItems headerItemsRight">

									{/* Search button */}
									<a href="/search" role="button" tabIndex="0" className="pt-button pt-large pt-minimal pt-icon-search" />

									{/* Dashboard panel button */}
									{this.props.loginData.isAdmin &&
										<a href="/dashboard" className="pt-button pt-large pt-minimal pt-icon-page-layout" />
									}

									{/* User avatar and menu */}
									{loggedIn &&
										<Popover
											content={
												<Menu>
													<li>
														<a href={`/user/${this.props.loginData.slug}`} className="pt-menu-item pt-popover-dismiss">
															<div>{this.props.loginData.fullName}</div>
															<div className="subtext">View Profile</div>
														</a>
													</li>
													<MenuDivider />
													{!isBasePubPub &&
														<li>
															<a href="/pub/create" className="pt-menu-item pt-popover-dismiss">
																Create New Pub
															</a>
														</li>
													}
													{!isBasePubPub &&
														<MenuItem
															className="pt-popover-dismiss"
															href="/notifications"
															text="Notifications"
															label={this.props.loginData.notificationCount
																? <span className="notification-count">{this.props.loginData.notificationCount}</span>
																: null
															}
														/>
													}
													<MenuItem text="Logout" onClick={this.handleLogout} />
												</Menu>
											}
											interactionKind={PopoverInteractionKind.CLICK}
											position={Position.BOTTOM_RIGHT}
											transitionDuration={-1}
											inheritDarkTheme={false}
										>
											<button className="pt-button pt-large pt-minimal avatar-button">
												{!!this.props.loginData.notificationCount &&
													<div className="notification-count">{this.props.loginData.notificationCount}</div>
												}
												<Avatar
													userInitials={this.props.loginData.initials}
													userAvatar={this.props.loginData.avatar}
													width={30}
												/>
											</button>
										</Popover>
									}

									{/* Login or Signup button */}
									{!loggedIn &&
										<a href={`/login${this.state.redirect}`} className="pt-button pt-large pt-minimal">Login or Signup</a>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
				{isLandingPage && !isBasePubPub &&
					<div className="community-header">
						<div className="container">
							<div className="row">
								<div className="col-12">
									<img alt="community logo" className="logo" src={resizedLargeHeaderLogo} />
									<div className="description">{this.props.largeHeaderDescription}</div>
								</div>
							</div>
						</div>
					</div>
				}
			</nav>
		);
	}
}

Header.defaultProps = defaultProps;
Header.propTypes = propTypes;
export default Header;
