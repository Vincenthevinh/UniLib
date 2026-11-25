import React, { useState } from 'react';
import { Modal, Button, Alert } from './index';
import api from '../api/endpoints';

export default function ReserveModal({
  isOpen,
  onClose,
  book,
  isBorrowRestricted = false,
  restrictionReason = '',
  onReserved,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !book) return null;

  const titleId = book.id ?? book.titleId;
  const bookTitle = book.title ?? book.bookTitle ?? 'Book Title';
  const estimatedLocation =
    book.shelfLocation ||
    book.copies?.[0]?.shelfLocation ||
    'Reference Shelf / Circulation Desk';

  const handleConfirm = async () => {
    setErrorMsg('');

    if (isBorrowRestricted) {
      setErrorMsg(
        restrictionReason ||
          'Your account is restricted from borrowing or reserving due to overdue books (BR-04).'
      );
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.reservations.create(titleId);
      onReserved?.(created);
    } catch (err) {
      setErrorMsg(
        err?.error?.message ||
          err?.message ||
          'Unable to create reservation due to business rule constraints (BR-05/BR-06).'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SCR-09 · Confirm Book Reservation"
    >
      <p>
        <strong>Book Title:</strong> {bookTitle}
      </p>
      <p>
        <strong>Estimated Location:</strong> {estimatedLocation}
      </p>
      <p>
        <strong>72-Hour Hold Rule:</strong> Once a copy is held for your reservation, the library holds it for <strong>72 hours</strong> from notification. If not picked up within 72 hours, the reservation expires.
      </p>

      {errorMsg && (
        <Alert variant="error" role="alert">
          {errorMsg}
        </Alert>
      )}

      <div className="modal-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? 'Confirming...' : 'Confirm Reservation'}
        </Button>
      </div>
    </Modal>
  );
}