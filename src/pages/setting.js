import React from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/input';
import Modal from '../components/common/model';
import { useAuth } from '../hooks/UseAuth';
import { setFinanceState } from '../store/useFinanceStore';

function Settings() {
	const { user } = useAuth();
	const [showSecurity, setShowSecurity] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [saved, setSaved] = React.useState(false);

	const [name, setName] = React.useState(user.name || '');
	const [email, setEmail] = React.useState(user.email || '');
	const [timezone, setTimezone] = React.useState('Asia/Kolkata');

	return (
		<div className="page-stack">
			<section className="page-hero card panel">
				<div>
					<span className="eyebrow">Settings</span>
					<h2>Profile, security, and workspace controls.</h2>
					<p>Keep the account profile, alerting, and access policies aligned with your workflow.</p>
				</div>
				<div className="profile-chip">
					<div className="avatar avatar--large">{user.initials}</div>
					<div>
						<strong>{user.name}</strong>
						<span>{user.email}</span>
					</div>
				</div>
			</section>

			<section className="page-grid page-grid--2">
				<article className="card panel">
					<span className="eyebrow">Profile</span>
					<div className="form-grid">
						<Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
						<Input label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
					</div>
					<div className="panel-actions">
						<Button
							variant="primary"
							onClick={() => {
								setSaving(true);
								setFinanceState((prev) => ({
									...prev,
									profile: {
										...prev.profile,
										name: name,
										email: email,
										team: prev.profile.team,
										initials: (name || '').split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase(),
									},
								}));

								// Simulate save latency
								setTimeout(() => {
									setSaving(false);
									setSaved(true);
									setTimeout(() => setSaved(false), 2500);
								}, 400);
							}}
						>
							{saving ? 'Saving…' : 'Save profile'}
						</Button>
						<Button variant="secondary" onClick={() => setShowSecurity(true)}>Security options</Button>
					</div>
					{saved && <div className="toast toast--success">Profile saved</div>}
				</article>

				<article className="card panel">
					<span className="eyebrow">Preferences</span>
					<div className="preference-list">
						<div className="preference-row">
							<div>
								<strong>Daily market digest</strong>
								<p>Email the morning summary at 8:30 AM.</p>
							</div>
							<span className="toggle-pill toggle-pill--on">On</span>
						</div>
						<div className="preference-row">
							<div>
								<strong>Risk alerts</strong>
								<p>Notify when allocation drifts beyond target.</p>
							</div>
							<span className="toggle-pill toggle-pill--on">On</span>
						</div>
						<div className="preference-row">
							<div>
								<strong>Tax reminders</strong>
								<p>Reminder before quarter-end review.</p>
							</div>
							<span className="toggle-pill">Scheduled</span>
						</div>
					</div>
				</article>
			</section>

			<Modal isOpen={showSecurity} onClose={() => setShowSecurity(false)} title="Security controls">
				<p>Enable password rotation, two-factor authentication, and recovery contacts for the workspace.</p>
				<div className="modal-actions">
					<Button variant="primary" onClick={() => setShowSecurity(false)}>Enable 2FA</Button>
					<Button variant="outline" onClick={() => setShowSecurity(false)}>Close</Button>
				</div>
			</Modal>
		</div>
	);
}

export default Settings;
