import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Alert } from '../components';
import api from '../api/endpoints';

function getRoleHomeRoute(role) {
  if (role === 'Reader') return '/reader/catalog';
  if (role === 'Librarian') return '/librarian';
  if (role === 'Administrator') return '/admin';
  return '/login';
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [genericError, setGenericError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateFields = () => {
    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Username or email is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenericError('');
    if (!validateFields()) return;

    const trimmed = identifier.trim();
    const payload = {
      username: trimmed,
      email: trimmed,
      password,
    };

    setSubmitting(true);
    try {
      const response = await api.auth.login(payload);
      const role = response?.user?.role || response?.role;
      const fromPath = location.state?.from?.pathname;
      const target =
        fromPath && !fromPath.startsWith('/login')
          ? fromPath
          : getRoleHomeRoute(role);
      navigate(target, { replace: true });
    } catch {
      // Generic message only — do not disclose whether identifier or password was wrong (AC-F01-02)
      setGenericError('Invalid username/email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="scr01-title" className="auth-container">
      <h1 id="scr01-title">SCR-01 · UniLib Sign In</h1>
      <p>Sign in with your username or email address and password.</p>

      {genericError && (
        <Alert variant="error" role="alert">
          {genericError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
        <Input
          id="login-identifier"
          label="Username or Email"
          type="text"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (fieldErrors.identifier) {
              setFieldErrors((prev) => ({ ...prev, identifier: '' }));
            }
          }}
          error={fieldErrors.identifier}
          autoComplete="username"
          disabled={submitting}
          required
        />

        <div className="password-input-group">
          <Input
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: '' }));
              }
            }}
            error={fieldErrors.password}
            autoComplete="current-password"
            disabled={submitting}
            required
          />

          <Button
            type="button"
            variant="secondary"
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={submitting}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </Button>
        </div>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </section>
  );
}