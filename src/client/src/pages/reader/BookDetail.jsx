import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Badge, Button, Alert, EmptyState } from '../../components';
import ReserveModal from '../../components/ReserveModal';
import api from '../../services/endpoints';

function getCopyCounts(book) {
  const copies = Array.isArray(book?.copies) ? book.copies : [];
  if (copies.length > 0) {
    let available = 0;
    let borrowed = 0;
    let reserved = 0;
    for (const copy of copies) {
      if (copy.status === 'Available') available += 1;
      else if (copy.status === 'Borrowed') borrowed += 1;
      else if (copy.status === 'Reserved') reserved += 1;
    }
    return {
      total: copies.length,
      available,
      borrowed,
      reserved,
    };
  }
  return {
    total: book?.totalCopies ?? book?.total ?? 0,
    available: book?.availableCopies ?? book?.available ?? 0,
    borrowed: book?.borrowedCopies ?? book?.borrowed ?? 0,
    reserved: book?.reservedCopies ?? book?.reserved ?? 0,
  };
}

export default function BookDetail() {
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [overdueStatus, setOverdueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  const loadBookDetail = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [detailRes, reservationsRes, overdueRes] = await Promise.all([
        api.books.get(bookId),
        api.reservations.mine().catch(() => ({ items: [] })),
        api.dashboard.overdue().catch(() => null),
      ]);

      const titleData = detailRes?.title || detailRes;
      const reservationList = Array.isArray(reservationsRes)
        ? reservationsRes
        : reservationsRes?.items || reservationsRes?.reservations || [];

      setBook(titleData);
      setMyReservations(reservationList);
      setOverdueStatus(overdueRes);
    } catch (err) {
      setErrorMsg(
        err?.error?.message || err?.message || 'Failed to load book details.'
      );
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBookDetail();
  }, [loadBookDetail]);

  if (loading) {
    return (
      <section aria-live="polite" aria-busy="true">
        <p>Loading book details...</p>
      </section>
    );
  }

  if (errorMsg) {
    return (
      <section>
        <Alert variant="error" role="alert">
          <span>{errorMsg}</span>
          <Button type="button" variant="secondary" onClick={loadBookDetail}>
            Retry
          </Button>
        </Alert>
      </section>
    );
  }

  if (!book) {
    return (
      <EmptyState
        title="Book title not found"
        description="The requested book title does not exist."
      />
    );
  }

  const counts = getCopyCounts(book);
  const activeReservations = myReservations.filter((r) =>
    ['Pending', 'Ready', 'Queued', 'ReadyForPickup'].includes(r.status)
  );
  const hasReservationForTitle = activeReservations.some(
    (r) => String(r.titleId ?? r.title?.id) === String(book.id ?? bookId)
  );
  const hasOverdue =
    Boolean(overdueStatus?.hasOverdue) ||
    (Array.isArray(overdueStatus?.items) && overdueStatus.items.length > 0);

  // BR-05: "Reserve" button is enabled only when Available = 0
  let reserveDisabledReason = '';
  if (counts.available > 0) {
    reserveDisabledReason =
      'Reservation is only available when Available = 0 (BR-05).';
  } else if (hasOverdue) {
    reserveDisabledReason =
      'Borrowing and reservations are restricted while you have overdue books (BR-04).';
  } else if (hasReservationForTitle) {
    reserveDisabledReason =
      'You already have an active reservation for this title (BR-06).';
  } else if (activeReservations.length >= 2) {
    reserveDisabledReason =
      'You have reached the maximum of 2 active reservations (BR-06).';
  }

  const canReserve = counts.available === 0 && !reserveDisabledReason;

  const copyColumns = [
    {
      key: 'barcode',
      header: 'Barcode',
      render: (row) => row.barcode ?? row.id ?? '—',
    },
    {
      key: 'shelfLocation',
      header: 'Shelf Location',
      render: (row) => row.shelfLocation ?? row.shelf ?? '—',
    },
    {
      key: 'status',
      header: 'Copy Status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
  ];

  return (
    <section aria-labelledby="scr06-title">
      <Link to="/reader/catalog">← Back to Catalog</Link>
      <h1 id="scr06-title">SCR-06 · {book.title}</h1>
      <p>
        <strong>Author:</strong> {book.author || '—'}
      </p>
      <p>
        <strong>Category:</strong> {book.category || '—'} ·{' '}
        <strong>Publication Year:</strong>{' '}
        {book.publicationYear ?? book.year ?? '—'} · <strong>ISBN:</strong>{' '}
        {book.isbn || '—'}
      </p>
      {book.description && <p>{book.description}</p>}

      <div className="copy-summary" aria-label="Copy availability summary">
        <span>
          Total: <strong>{counts.total}</strong>
        </span>
        <span>
          Available: <strong>{counts.available}</strong>
        </span>
        <span>
          Borrowed: <strong>{counts.borrowed}</strong>
        </span>
        <span>
          Reserved: <strong>{counts.reserved}</strong>
        </span>
      </div>

      {successMsg && (
        <Alert variant="success" role="status">
          {successMsg}
        </Alert>
      )}

      <div className="reserve-action">
        <span title={reserveDisabledReason || 'Reserve this book title'}>
          <Button
            type="button"
            variant="primary"
            disabled={!canReserve}
            aria-describedby="reserve-status-note"
            onClick={() => setIsReserveModalOpen(true)}
          >
            Reserve
          </Button>
        </span>
        <p id="reserve-status-note" className="reserve-note">
          {canReserve
            ? 'No copies are currently available (Available = 0). You can place a reservation.'
            : reserveDisabledReason}
        </p>
      </div>

      <h2>Copies & Shelf Locations</h2>
      <Table
        columns={copyColumns}
        data={book.copies || []}
        rowKey={(row, idx) => row.id ?? row.barcode ?? idx}
      />

      <ReserveModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        book={book}
        isBorrowRestricted={hasOverdue}
        restrictionReason={
          hasOverdue
            ? 'Your account has overdue loans (BR-04). Please return overdue books before reserving.'
            : ''
        }
        onReserved={(created) => {
          setIsReserveModalOpen(false);
          const pos = created?.queuePosition;
          setSuccessMsg(
            `Reservation created for "${book.title}"${
              pos != null ? ` (Queue position #${pos})` : ''
            }.`
          );
          loadBookDetail();
        }}
      />
    </section>
  );
}