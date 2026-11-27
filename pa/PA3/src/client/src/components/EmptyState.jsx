import React from 'react';
import { Button } from './Button';

export function EmptyState({
  title = 'No records found',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="ui-empty-state">
      <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-lg)' }}>
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 var(--space-4)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}