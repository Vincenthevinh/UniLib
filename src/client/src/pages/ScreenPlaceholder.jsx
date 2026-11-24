import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button } from '../components';

export default function ScreenPlaceholder({
  screenId,
  screenName,
  primaryActor,
  feature,
  useCases,
  notes,
}) {
  return (
    <section aria-labelledby="screen-placeholder-title">
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              padding: '2px var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-brand-primary-soft)',
              color: 'var(--color-brand-primary-hover)',
            }}
          >
            {screenId}
          </span>
          <Badge status="available" label={`Actor: ${primaryActor}`} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Feature: {feature} · Use Cases: {useCases}
          </span>
        </div>

        <h1
          id="screen-placeholder-title"
          style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-2xl)' }}
        >
          {screenName}
        </h1>

        <p style={{ margin: '0 0 var(--space-4)', color: 'var(--color-text-secondary)' }}>
          {notes ||
            'A1-W1 structural placeholder screen. Full interactive workflows and API integration are scheduled in subsequent tasks.'}
        </p>

        <Alert
          variant="info"
          title="A1-W1 Shell Placeholder"
          message={`Route skeleton registered for ${screenId} (${screenName}) within the PA2 F01–F07 scope.`}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-5)',
          }}
        >
          <Link to="/login">
            <Button variant="secondary" size="sm">SCR-01 Login</Button>
          </Link>
          <Link to="/reader/dashboard">
            <Button variant="secondary" size="sm">SCR-11 Reader Dashboard</Button>
          </Link>
          <Link to="/librarian/borrow">
            <Button variant="secondary" size="sm">SCR-07 Borrow Book</Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="secondary" size="sm">SCR-02 Admin Users</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}