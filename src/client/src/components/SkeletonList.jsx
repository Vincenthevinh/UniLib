import React from 'react';
import { Alert, Button } from './index';

export function SkeletonList({ rows = 4, label = 'Loading content' }) {
  return (
    <div
      className="skeleton-list"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="skeleton-row" aria-hidden="true">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
      ))}
    </div>
  );
}

export function NetworkErrorBanner({ message, onRetry, retrying = false }) {
  if (!message) return null;
  return (
    <Alert variant="error" role="alert">
      <div className="network-error-banner">
        <span>{message}</span>
        {typeof onRetry === 'function' && (
          <Button
            type="button"
            variant="secondary"
            disabled={retrying}
            onClick={onRetry}
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </Button>
        )}
      </div>
    </Alert>
  );
}