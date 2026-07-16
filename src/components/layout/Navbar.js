import React from 'react';
import Input from '../common/input';
import Modal from '../common/model';
import { useAuth } from '../../hooks/UseAuth';
import { useMarketData } from '../../hooks/Usemarketdata';
import { formatCompactCurrency, formatPercent } from '../../utils/formatter';
import { setFinanceState } from '../../store/useFinanceStore';

const defaultNotifications = [
	{ id: 1, title: 'SIP order completed', detail: 'Your monthly SIP of INR 125,000 was executed successfully.', time: '5m ago' },
	{ id: 2, title: 'Budget threshold reached', detail: 'Family category has reached 94% of its monthly budget.', time: '42m ago' },
	{ id: 3, title: 'Dividend credited', detail: 'A dividend of INR 68,000 has been credited to your account.', time: '2h ago' },
];

function Navbar({ title, subtitle, onToggleSidebar, isSidebarOpen }) {
	const { user } = useAuth();
	const { data: marketData, error: marketError, isRefreshing, lastUpdated, loading, refreshCount, refreshMarketData } = useMarketData();
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [searchFocused, setSearchFocused] = React.useState(false);
	const [notificationHovered, setNotificationHovered] = React.useState(false);
	const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);
	const [notifications] = React.useState(defaultNotifications);
	const unreadCount = Number(user.notifications) || 0;

	function handleSignOut() {
		setFinanceState((prev) => ({ ...prev, isAuthenticated: false }));
		setMenuOpen(false);
	}

	function handleOpenNotifications() {
		setIsNotificationModalOpen(true);
	}

	function handleCloseNotifications() {
		setIsNotificationModalOpen(false);
	}

	function handleMarkAllAsRead() {
		setFinanceState((prev) => ({
			...prev,
			profile: {
				...prev.profile,
				notifications: 0,
			},
		}));
	}

	const formattedTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

	return (
		<header className="topbar">
			<div className="topbar__backdrop"></div>
			<div className="topbar__content">
				<button
					type="button"
					className={`topbar__menu-button ${isSidebarOpen ? 'is-open' : ''}`}
					onClick={onToggleSidebar}
					aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
				>
					<span />
					<span />
					<span />
				</button>

				<div className="topbar__brand">
					<span className="topbar__eyebrow">{user.team}</span>
					<div className="topbar__brand-info">
						<h1>{title}</h1>
						<span className="topbar__status-indicator"></span>
					</div>
					<p className="topbar__subtitle">{subtitle}</p>
				</div>

				<div className="topbar__spacer"></div>

				<div className="topbar__actions">
					<button
						type="button"
						className={`market-chip ${marketData && marketData.change >= 0 ? 'is-up' : 'is-down'} ${isRefreshing ? 'is-refreshing' : ''}`}
						onClick={refreshMarketData}
						aria-label="Refresh live market snapshot"
						title="Refresh live market snapshot"
					>
						<div className="market-chip__header">
							<span className="market-chip__name">{marketData?.name || ' FINTECH PULSE'}</span>
							<small className="market-chip__live">
								<span className="market-chip__dot"></span>{isRefreshing ? 'Syncing' : 'Live'}
							</small>
						</div>
						<strong className="market-chip__value">{marketData ? formatCompactCurrency(marketData.value) : 'Loading'}</strong>
						<div className="market-chip__footer">
							<small className={`market-chip__change ${marketData && marketData.change >= 0 ? 'positive' : 'negative'}`}>
								{loading && !marketData ? 'Live' : marketError ? 'Fallback' : `${marketData.change >= 0 ? '+' : ''}${formatPercent(marketData.changePercent)}`}
							</small>
							<small className="market-chip__time">{formattedTime} · {refreshCount}</small>
						</div>
					</button>

					<Input 
						className={`topbar__search ${searchFocused ? 'is-focused' : ''}`} 
						placeholder="Search accounts, assets, notes"
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setSearchFocused(false)}
					/>

					<button 
						type="button" 
						className={`icon-button topbar__notification ${notificationHovered || unreadCount > 0 ? 'has-notifications' : ''}`}
						aria-label="Notifications" 
						title="View notifications"
						onMouseEnter={() => setNotificationHovered(true)}
						onMouseLeave={() => setNotificationHovered(false)}
						onClick={handleOpenNotifications}
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
							<path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" fill="currentColor" />
							<path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
						</svg>
						{unreadCount > 0 && (
							<>
								<span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
							</>
						)}
					</button>

					<div className="topbar__profile">
						<button
							className={`avatar avatar--clickable ${menuOpen ? 'is-active' : ''}`}
							type="button"
							aria-haspopup="true"
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((v) => !v)}
							title={`${user.name}'s profile`}
						>
							<span className="avatar__letter">{user.initials}</span>
							{menuOpen && <span className="avatar__indicator"></span>}
						</button>

						{menuOpen && (
							<div className="profile-menu" role="menu">
								<div className="profile-menu__header">
									<div className="profile-menu__avatar">{user.initials}</div>
									<div className="profile-menu__text">
										<strong>{user.name}</strong>
										<span>{user.email}</span>
									</div>
								</div>
								<div className="profile-menu__divider"></div>
								<button type="button" role="menuitem" className="profile-menu__item profile-menu__item--profile" onClick={() => { setMenuOpen(false); /* navigate to profile */ }}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</svg>
									<span>Profile</span>
									<svg className="profile-menu__item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<polyline points="9 18 15 12 9 6"></polyline>
									</svg>
								</button>
								<button type="button" role="menuitem" className="profile-menu__item profile-menu__item--signout" onClick={handleSignOut}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
										<polyline points="16 17 21 12 16 7"></polyline>
										<line x1="21" y1="12" x2="9" y2="12"></line>
									</svg>
									<span>Sign out</span>
									<svg className="profile-menu__item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<polyline points="9 18 15 12 9 6"></polyline>
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<Modal isOpen={isNotificationModalOpen} onClose={handleCloseNotifications} title="Notifications">
				<div className="notification-modal">
					<div className="notification-modal__header">
						<p>{unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}</p>
						{unreadCount > 0 && (
							<button type="button" className="notification-modal__mark-read" onClick={handleMarkAllAsRead}>
								Mark all as read
							</button>
						)}
					</div>

					<div className="notification-modal__list">
						{notifications.map((item) => (
							<article key={item.id} className="notification-item">
								<div className="notification-item__dot" aria-hidden="true" />
								<div>
									<h4>{item.title}</h4>
									<p>{item.detail}</p>
									<small>{item.time}</small>
								</div>
							</article>
						))}
					</div>
				</div>
			</Modal>
		</header>
	);
}

export default Navbar;
