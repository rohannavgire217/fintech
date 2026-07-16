import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/input';
import Modal from '../components/common/model';

const createInitials = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'NA';
  }

  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
};

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('rohan.navgire@finatech.local');
  const [password, setPassword] = useState('finatech123');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [fullName, setFullName] = useState('Rohan Navgire');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin?.({
      email,
      password,
      name: fullName,
      team: 'Mumbai HQ',
      initials: createInitials(fullName),
    });
  };

  const openSignUp = () => {
    setSignUpError('');
    setSignUpEmail(email);
    setSignUpPassword('');
    setConfirmPassword('');
    setIsSignUpOpen(true);
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
    setSignUpError('');
  };

  const openForgotPassword = () => {
    setForgotEmail(email || '');
    setForgotMessage('');
    setIsForgotOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotOpen(false);
    setForgotMessage('');
  };

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotMessage('Please enter your email address.');
      return;
    }

    setForgotMessage(`Password reset link sent to ${forgotEmail}. Check your inbox for next steps.`);
    setTimeout(() => {
      closeForgotPassword();
    }, 2400);
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();

    if (!fullName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setSignUpError('Please complete all sign-up fields.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    onLogin?.({
      email: signUpEmail,
      password: signUpPassword,
      name: fullName.trim(),
      team: 'New workspace',
      initials: createInitials(fullName),
    });
    closeSignUp();
  };

  return (
    <div className="login-screen">
      <div className="login-screen__orb login-screen__orb--one" />
      <div className="login-screen__orb login-screen__orb--two" />

      <section className="login-card">
        <div className="login-card__panel login-card__panel--brand">
          <div className="login-brand">
            <div className="sidebar__mark login-brand__mark">F</div>
            <div>
              <span className="eyebrow">Welcome back</span>
              <h1>Finatech</h1>
            </div>
          </div>

          <p className="login-card__lead">
            Sign in to your animated wealth cockpit and open the dashboard in one click.
          </p>

          <div className="login-feature-grid">
            <div>
              <strong>Live net worth</strong>
              <span>Track every portfolio move in real time.</span>
            </div>
            <div>
              <strong>Smart planning</strong>
              <span>Budgets, goals, and taxes in one place.</span>
            </div>
            <div>
              <strong>Secure access</strong>
              <span>Responsive sign-in with a polished flow.</span>
            </div>
          </div>
        </div>

        <form className="login-card__panel login-card__panel--form" onSubmit={handleSubmit}>
          <span className="eyebrow">Sign in</span>
          <h2>Open your financial workspace.</h2>
          <p>Enter your details and jump into the full dashboard experience.</p>

          <div className="login-form">
            <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" />
            <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </div>

          <div className="login-card__actions">
            <Button type="submit" variant="primary">Sign in</Button>
            <Button type="button" variant="outline" onClick={openForgotPassword}>Forgot password?</Button>
          </div>
          <div className="login-card__divider" /> 
          <Button type="button" variant="secondary" onClick={openSignUp}>Don't have an account? Sign up</Button>
        </form>
      </section>

      <Modal isOpen={isSignUpOpen} onClose={closeSignUp} title="Create your Finatech account">
        <form className="signup-form" onSubmit={handleSignUpSubmit}>
          <p className="signup-form__lead">
            Set up a fresh workspace and jump straight into your dashboard.
          </p>

          <div className="signup-form__grid">
            <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Anand Kumar" />
            <Input label="Email" type="email" value={signUpEmail} onChange={(event) => setSignUpEmail(event.target.value)} placeholder="name@company.com" />
            <Input label="Password" type="password" value={signUpPassword} onChange={(event) => setSignUpPassword(event.target.value)} placeholder="Create a password" />
            <Input label="Confirm password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" />
          </div>

          {signUpError ? <div className="signup-form__error" role="alert">{signUpError}</div> : null}

          <div className="signup-form__actions">
            <Button type="button" variant="outline" onClick={closeSignUp}>Cancel</Button>
            <Button type="submit" variant="primary">Create account</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isForgotOpen} onClose={closeForgotPassword} title="Reset your password">
        <form className="forgotpass-form" onSubmit={handleForgotPasswordSubmit}>
          <p className="forgotpass-form__lead">
            Enter the email address associated with your Finatech account, and we'll send you a link to reset your password.
          </p>

          <div className="forgotpass-form__grid">
            <Input label="Email address" type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="name@company.com" />
          </div>

          {forgotMessage ? (
            <div className="forgotpass-form__message" role="status">{forgotMessage}</div>
          ) : null}

          <div className="forgotpass-form__actions">
            <Button type="button" variant="outline" onClick={closeForgotPassword}>Cancel</Button>
            <Button type="submit" variant="primary">Send reset link</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LoginPage;