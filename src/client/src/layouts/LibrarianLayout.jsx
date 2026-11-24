import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const LIBRARIAN_NAV = [
  { to: '/librarian/catalog', label: 'Book Catalog', code: 'SCR-03' },
  { to: '/librarian/copies', label: 'Copy Inventory', code: 'SCR-04' },
  { to: '/librarian/search', label: 'Catalog Lookup', code: 'SCR-05' },
  { to: '/librarian/books/BK-001', label: 'Book Details', code: 'SCR-06' },
  { to: '/librarian/borrow', label: 'Borrow Book', code: 'SCR-07' },
  { to: '/librarian/return', label: 'Return Book', code: 'SCR-08' },
  { to: '/librarian/holds', label: 'Hold Shelf & Queue', code: 'SCR-10' },
  { to: '/librarian/overdue', label: 'Overdue Monitoring', code: 'SCR-12' },
];

export default function LibrarianLayout() {
  return (
    <div className="shell-wrapper">
      <aside className="shell-sidebar shell-sidebar--navy" aria-label="Librarian Navigation">
        <div>
          <div
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
            }}
          >
            <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
              UniLib Staff
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-sidebar-muted)' }}>
              Library Operations
            </div>
          </div>

          <nav className="nav-list">
            {LIBRARIAN_NAV.map((item) => (
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
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span>Role: Librarian (Preview)</span>
          <Link to="/login" style={{ color: '#93c5fd', fontWeight: 600 }}>
            Switch / Sign Out (SCR-01)
          </Link>
        </div>
      </aside>

      <div className="shell-main-area">
        <header className="shell-topbar">
          <strong>University Library Management — Librarian Operations</strong>
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