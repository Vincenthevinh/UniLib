import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const READER_NAV = [
  { to: '/reader/dashboard', label: 'My Dashboard', code: 'SCR-11' },
  { to: '/reader/catalog', label: 'Catalog Search', code: 'SCR-05' },
  { to: '/reader/books/BK-001', label: 'Book Details', code: 'SCR-06' },
  { to: '/reader/reservations/confirm', label: 'Reserve Hold', code: 'SCR-09' },
];

export default function ReaderLayout() {
  return (
    <div className="shell-wrapper">
      <aside className="shell-sidebar" aria-label="Reader Navigation">
        <div>
          <div
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderBottom: '1px solid var(--color-border-default)',
            }}
          >
            <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
              UniLib Reader
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Patron Portal · PA2 Baseline
            </div>
          </div>

          <nav className="nav-list">
            {READER_NAV.map((item) => (
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
          <span style={{ color: 'var(--color-text-secondary)' }}>Role: Reader (Preview)</span>
          <Link to="/login" style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>
            Switch / Sign Out (SCR-01)
          </Link>
        </div>
      </aside>

      <div className="shell-main-area">
        <header className="shell-topbar">
          <strong>University Library Management System — Reader</strong>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            A1-W1 App Shell
          </span>
        </header>
        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}