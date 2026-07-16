import React from 'react';
import { setFinanceState } from '../../store/useFinanceStore';

const links = [
	{ key: 'dashboard', label: 'Dashboard', note: 'Overview' },
	{ key: 'investments', label: 'Investments', note: 'Portfolio' },
	{ key: 'planning', label: 'Planning', note: 'Goals & tax' },
	{ key: 'settings', label: 'Settings', note: 'Profile' },
];

function Sidebar({ activePage = 'dashboard', onNavigate, isOpen = false, onClose }) {
	return (
		<aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
			<div className="sidebar__mobile-header">
				<strong>Finatech</strong>
				<button type="button" className="sidebar__close-button" onClick={onClose} aria-label="Close navigation">
					×
				</button>
			</div>

			<div>
				<div className="sidebar__brand">
					<div className="sidebar__mark">F</div>
					<div>
						<strong>Finatech</strong>
					</div>
				</div>

				<nav className="sidebar__nav" aria-label="Primary">
					{links.map((link) => (
						<button
							key={link.key}
							type="button"
							className={`sidebar__item ${activePage === link.key ? 'sidebar__item--active' : ''}`}
							onClick={() => onNavigate?.(link.key)}
							aria-current={activePage === link.key ? 'page' : undefined}
						>
							<span className="sidebar__item-label">{link.label}</span>
							<small className="sidebar__item-note">{link.note}</small>
						</button>
					))}
				</nav>
			</div>

			<div className="sidebar__footer">
				<div style={{marginBottom:12}}>
					<span className="sidebar__label">Next review</span>
					<strong>Friday, 10:30 AM</strong>
					<p>Portfolio, tax, and liquidity review.</p>
				</div>

				<div className="sidebar__signout">
					<button
						type="button"
						className="button button--outline"
						onClick={() => {
							// mark user as signed out
							setFinanceState((prev) => ({ ...prev, isAuthenticated: false }));
							// close drawer if provided
							onClose?.();
						}}
					>
						Sign out
					</button>
				</div>
			</div>
		</aside>
	);
}

export default Sidebar;
