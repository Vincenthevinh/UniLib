import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-surface)',
      }}
    >
      <header
        style={{
          height: 'var(--topbar-height)',
          padding: '0 var(--space-6)',
          borderBottom: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/login"
          style={{
            fontWeight: 'var(--font-bold)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-brand-navy)',
          }}
        >
          UniLib
        </Link>
        <nav aria-label="Quick role preview" style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
          <Link to="/reader/dashboard">Reader Shell</Link>
          <Link to="/librarian/borrow">Librarian Shell</Link>
          <Link to="/admin/users">Admin Shell</Link>
        </nav>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}