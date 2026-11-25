import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Button } from './index';

function defaultRouteForRole(role) {
  if (role === 'Reader') return '/reader/catalog';
  if (role === 'Librarian') return '/librarian';
  if (role === 'Administrator') return '/admin';
  return '/login';
}

export default function RequireRole({ allowedRoles = [], children }) {
  const { user, isAuthenticated, initializing, logout } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <section aria-live="polite" aria-busy="true">
        <p>Checking session permissions...</p>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <section aria-labelledby="forbidden-heading">
        <h1 id="forbidden-heading">403 · Access Forbidden</h1>
        <Alert variant="error" role="alert">
          Your role ({user.role}) does not have permission to view this page.
        </Alert>
        <div className="forbidden-actions">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              window.location.assign(defaultRouteForRole(user.role));
            }}
          >
            Go to my workspace
          </Button>
          <Button type="button" variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
      </section>
    );
  }

  return children;
}