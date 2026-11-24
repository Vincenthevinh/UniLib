import React from 'react';
import { Button } from './Button';

const ALERT_STYLES = {
  info: {
    bg: 'var(--color-brand-primary-soft)',
    border: '#bfdbfe',
    color: 'var(--color-status-borrowed-text)',
  },
  success: {
    bg: 'var(--color-status-available-bg)',
    border: '#bbf7d0',
    color: 'var(--color-status-available-text)',
  },
  warning: {
    bg: 'var(--color-status-damaged-bg)',
    border: '#fde68a',
    color: 'var(--color-status-damaged-text)',
  },
  error: {
    bg: 'var(--color-status-lost-bg)',
    border: '#fecaca',
    color: 'var(--color-status-lost-text)',
  },
};

export function Alert({ variant = 'info', title, message, onDismiss }) {
  const palette = ALERT_STYLES[variant] || ALERT_STYLES.info;

  return (
    <div
      role="status"
      className="ui-alert"
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.color,
      }}
    >
      <div>
        {title && <div style={{ fontWeight: 'var(--font-semibold)' }}>{title}</div>}
        {message && <div>{message}</div>}
      </div>
      {onDismiss && (
        <Button variant="secondary" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  );
}