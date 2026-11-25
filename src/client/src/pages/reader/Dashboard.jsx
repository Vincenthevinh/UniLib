import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Table, EmptyState } from '../../components';
import api from '../../api/endpoints';

function getDaysRemaining(loan) {
  if (typeof loan.daysRemaining === 'number') return loan.daysRemaining;
  const rawDue = loan.dueAt || loan.dueDate;
  if (!rawDue) return null;
  const dueMs = new Date(rawDue).getTime();
  if (Number.isNaN(dueMs)) return null;
  return Math.ceil((dueMs - Date.now()) / (1000 * 60 * 60 * 24));
}

function checkIsOverdue(loan, daysRemaining) {
  if (loan.overdue === true || loan.status === 'Overdue') return true;
  if (typeof daysRemaining === 'number' && daysRemaining < 0 && !loan.returnedAt) {
    return true;
  }
  return false;
}

function LoanStatusBadge({ loan, daysRemaining }) {
  if (loan.returnedAt || loan.status === 'Returned') {
    return <Badge status="Inactive">Returned</Badge>;
  }
  if (checkIsOverdue(loan, daysRemaining)) {
    return <Badge status="Lost">Overdue</Badge>;
  }
  return <Badge status="Available">Active</Badge>;
}

function ReservationStatusBadge({ status }) {
  if (status === 'ReadyForPickup' || status === 'Ready') {
    return <Badge status="Available">{status} (Ready for pickup)</Badge>;
  }
  if (status === 'Fulfilled') {
    return <Badge status="Borrowed">{status}</Badge>;
  }
  if (status === 'Cancelled' || status === 'Expired') {
    return <Badge status="Inactive">{status}</Badge>;
  }
  return <Badge status="Reserved">{status || 'Queued'}</Badge>;
}

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [dashboardRes, reservationsRes] = await Promise.all([
        api.dashboard.reader().catch(() => null),
        api.reservations.mine().catch(() => ({ items: [] })),
      ]);

      const loanList = Array.isArray(dashboardRes?.loans)
        ? dashboardRes.loans
        : Array.isArray(dashboardRes)
        ? dashboardRes
        : [];

      const reservationList = Array.isArray(reservationsRes)
        ? reservationsRes
        : reservationsRes?.items ||
          reservationsRes?.reservations ||
          (Array.isArray(dashboardRes?.reservations)
            ? dashboardRes.reservations
            : []);

      setLoans(loanList);
      setReservations(reservationList);
      setOverdueCount(
        typeof dashboardRes?.overdueCount === 'number'
          ? dashboardRes.overdueCount
          : loanList.filter((l) => checkIsOverdue(l, getDaysRemaining(l))).length
      );
    } catch (err) {
      setErrorMsg(
        err?.error?.message ||
          err?.message ||
          'Failed to load Reader Dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const hasOverdue =
    overdueCount > 0 ||
    loans.some((loan) => checkIsOverdue(loan, getDaysRemaining(loan)));

  const getRenewalState = (loan, daysRemaining) => {
    if (loan.returnedAt || loan.status === 'Returned') {
      return {
        disabled: true,
        reason: 'Returned loans cannot be renewed.',
      };
    }
    if (checkIsOverdue(loan, daysRemaining)) {
      return {
        disabled: true,
        reason: 'Overdue loans cannot be renewed.',
      };
    }
    if (loan.renewedAt) {
      return {
        disabled: true,
        reason: 'This loan has already been renewed.',
      };
    }
    if (
      typeof loan.renewalCount === 'number' &&
      typeof loan.maxRenewals === 'number' &&
      loan.renewalCount >= loan.maxRenewals
    ) {
      return {
        disabled: true,
        reason: `Maximum renewals reached (${loan.maxRenewals}/${loan.maxRenewals}).`,
      };
    }
    if (loan.hasActiveReservationOnTitle) {
      return {
        disabled: true,
        reason: 'Another reader has an active reservation for this title.',
      };
    }
    return {
      disabled: false,
      reason: 'Renew loan',
    };
  };

  const handleRenew = async (loan) => {
    const loanId = loan.id ?? loan.loanId;
    setStatusMsg('');
    setErrorMsg('');
    setBusyId(String(loanId));
    try {
      await api.circulation.renew(loanId);
      setStatusMsg(
        `Renewed loan for "${loan.bookTitle ?? loan.title ?? loanId}".`
      );
      await loadDashboard();
    } catch (err) {
      setErrorMsg(
        err?.error?.message || err?.message || 'Failed to renew loan.'
      );
    } finally {
      setBusyId('');
    }
  };

  const handleCancelReservation = async (reservation) => {
    const resId = reservation.id ?? reservation.reservationId;
    setStatusMsg('');
    setErrorMsg('');
    setBusyId(String(resId));
    try {
      await api.reservations.cancel(resId);
      setStatusMsg(
        `Cancelled reservation for "${
          reservation.bookTitle ?? reservation.title?.title ?? resId
        }".`
      );
      await loadDashboard();
    } catch (err) {
      setErrorMsg(
        err?.error?.message || err?.message || 'Failed to cancel reservation.'
      );
    } finally {
      setBusyId('');
    }
  };

  const loanColumns = [
    {
      key: 'bookTitle',
      header: 'Book Title',
      render: (row) => row.bookTitle ?? row.title?.title ?? row.title ?? '—',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => {
        const raw = row.dueAt || row.dueDate;
        if (!raw) return '—';
        const dt = new Date(raw);
        return Number.isNaN(dt.getTime()) ? String(raw) : dt.toLocaleDateString();
      },
    },
    {
      key: 'daysRemaining',
      header: 'Days Remaining',
      render: (row) => {
        const days = getDaysRemaining(row);
        if (typeof days !== 'number') return '—';
        return days < 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days`;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <LoanStatusBadge loan={row} daysRemaining={getDaysRemaining(row)} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        const loanId = String(row.id ?? row.loanId);
        const days = getDaysRemaining(row);
        const renewal = getRenewalState(row, days);
        return (
          <span title={renewal.reason}>
            <Button
              type="button"
              variant="secondary"
              disabled={renewal.disabled || busyId === loanId}
              aria-label={
                renewal.disabled
                  ? `Renew disabled: ${renewal.reason}`
                  : `Renew loan ${row.bookTitle ?? loanId}`
              }
              onClick={() => handleRenew(row)}
            >
              {busyId === loanId ? 'Renewing...' : 'Renew'}
            </Button>
          </span>
        );
      },
    },
  ];

  const reservationColumns = [
    {
      key: 'bookTitle',
      header: 'Book Title',
      render: (row) => row.bookTitle ?? row.title?.title ?? row.title ?? '—',
    },
    {
      key: 'queuePosition',
      header: 'Queue Position',
      render: (row) =>
        row.queuePosition != null ? `#${row.queuePosition}` : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <ReservationStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        const resId = String(row.id ?? row.reservationId);
        const canCancel = [
          'Pending',
          'Ready',
          'Queued',
          'ReadyForPickup',
        ].includes(row.status);
        return (
          <Button
            type="button"
            variant="secondary"
            disabled={!canCancel || busyId === resId}
            aria-label={`Cancel reservation ${row.bookTitle ?? resId}`}
            onClick={() => handleCancelReservation(row)}
          >
            {busyId === resId ? 'Cancelling...' : 'Cancel'}
          </Button>
        );
      },
    },
  ];

  return (
    <section aria-labelledby="scr11-title">
      <h1 id="scr11-title">SCR-11 · Reader Dashboard</h1>
      <p>
        <Link to="/reader/catalog">Back to Catalog (SCR-05)</Link>
      </p>

      {hasOverdue && (
        <Alert variant="error" role="alert">
          <strong>Overdue Warning:</strong> You currently have overdue loans. New borrowing and reservations are restricted under <strong>BR-04</strong> until overdue items are returned.
        </Alert>
      )}

      {statusMsg && (
        <Alert variant="success" role="status">
          {statusMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="error" role="alert">
          <span>{errorMsg}</span>
          <Button type="button" variant="secondary" onClick={loadDashboard}>
            Retry
          </Button>
        </Alert>
      )}

      {loading ? (
        <p aria-live="polite" aria-busy="true">
          Loading loans and reservations...
        </p>
      ) : (
        <>
          <h2>Active & Historical Loans</h2>
          {loans.length === 0 ? (
            <EmptyState
              title="No loans found"
              description="You do not have any loans on your account."
            />
          ) : (
            <Table
              columns={loanColumns}
              data={loans}
              rowKey={(row, idx) => row.id ?? row.loanId ?? idx}
            />
          )}

          <h2>Reservations</h2>
          {reservations.length === 0 ? (
            <EmptyState
              title="No reservations found"
              description="You do not have any reservations on your account."
            />
          ) : (
            <Table
              columns={reservationColumns}
              data={reservations}
              rowKey={(row, idx) => row.id ?? row.reservationId ?? idx}
            />
          )}
        </>
      )}
    </section>
  );
}