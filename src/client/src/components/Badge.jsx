import React from 'react';

const STATUS_MAP = {
  available: { label: 'Available', className: 'ui-badge--available' },
  borrowed: { label: 'Borrowed', className: 'ui-badge--borrowed' },
  reserved: { label: 'Reserved', className: 'ui-badge--reserved' },
  damaged: { label: 'Damaged', className: 'ui-badge--damaged' },
  lost: { label: 'Lost', className: 'ui-badge--lost' },
  inactive: { label: 'Inactive', className: 'ui-badge--inactive' },
};

export function Badge({ status = 'available', label }) {
  const normalized = String(status).toLowerCase();
  const config = STATUS_MAP[normalized] || STATUS_MAP.available;

  return (
    <span className={`ui-badge ${config.className}`}>
      {label || config.label}
    </span>
  );
}