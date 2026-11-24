import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const ADMIN_NAV = [
  { to: '/admin/users', label: 'User Management', code: 'SCR-02' },
];

export default function AdminLayout() {
  return (
    <div className="shell-wrapper">
      <aside className="shell-sidebar" aria-label="Administrator Navigation">
        <div>
          <div
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderBottom: '1px solid var(--color-border-default)',
            }}
          >
            <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
              UniLib Admin
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Account & RBAC Control
            </div>
          </div>

          <nav className="nav-list">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item--active' : ''}`
                }
              >
                <span>{item.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                  {item.code}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div
          style={{
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>Role: Administrator (Preview)</span>
          <Link to="/login" style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>
            Switch / Sign Out (SCR-01)
          </Link>
        </div>
      </aside>

      <div className="shell-main-area">
        <header className="shell-topbar">
          <div>
            <strong>User Management</strong>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Administration
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-status-borrowed-bg)',
                color: 'var(--color-status-borrowed-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
              }}
            >
              AD
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Administrator</span>
          </div>
        </header>
        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}