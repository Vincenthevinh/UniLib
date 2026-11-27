import React from 'react';
import { Button } from './Button';

export function Modal({ isOpen, title, onClose, children, footer }) {
  if (!isOpen) return null;

  return (
    <div
      className="ui-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="ui-modal">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{title}</h2>
          <Button variant="secondary" size="sm" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        <div>{children}</div>
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-6)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}