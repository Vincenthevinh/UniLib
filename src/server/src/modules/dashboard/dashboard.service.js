import { prisma } from '../../../db.js';
import { HttpError, requireUuid } from '../../../lib/errors.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ACTIVE_LOANS = 3;
const MAX_ACTIVE_RESERVATIONS = 2;

function computeLateDays(dueAt, now) {
  if (dueAt.getTime() >= now.getTime()) return 0;
  return Math.max(1, Math.ceil((now.getTime() - dueAt.getTime()) / DAY_MS));
}

export const dashboardService = {
  /**
   * FR-F07-01, FR-F07-02 / UC-12 / SCR-11:
   * Return the authenticated Reader's active loans (with dueDate & canRenew),
   * active reservations (with FIFO queuePosition), overdue flags, and BR-01/04/06 restrictions.
   */
  async getReaderDashboard(readerId, now = new Date()) {
    const validReaderId = requireUuid(readerId, 'readerId');

    const [reader, rawLoans, rawReservations] = await Promise.all([
      prisma.user.findUnique({
        where: { id: validReaderId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      }),
      prisma.loan.findMany({
        where: { readerId: validReaderId, returnedAt: null },
        orderBy: [{ dueAt: 'asc' }, { checkedOutAt: 'asc' }],
        include: {
          copy: {
            select: {
              id: true,
              titleId: true,
              barcode: true,
              shelfLocation: true,
              status: true,
              title: {
                select: { id: true, isbn: true, title: true, author: true, category: true },
              },
            },
          },
        },
      }),
      prisma.reservation.findMany({
        where: { readerId: validReaderId, status: { in: ['Pending', 'Ready'] } },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: {
          title: {
            select: { id: true, isbn: true, title: true, author: true, category: true },
          },
          heldCopy: {
            select: { id: true, barcode: true, shelfLocation: true, status: true },
          },
        },
      }),
    ]);

    if (!reader) {
      throw new HttpError(404, 'READER_NOT_FOUND', 'Reader not found');
    }

    // Batch lookup of pending holds for titles currently borrowed by this reader (for BR-03 canRenew)
    const borrowedTitleIds = [
      ...new Set(rawLoans.map((loan) => loan.copy?.titleId).filter(Boolean)),
    ];
    const pendingTitleIdsSet = new Set();
    if (borrowedTitleIds.length > 0) {
      const pendingForBorrowed = await prisma.reservation.findMany({
        where: { titleId: { in: borrowedTitleIds }, status: 'Pending' },
        select: { titleId: true },
      });
      for (const row of pendingForBorrowed) {
        pendingTitleIdsSet.add(row.titleId);
      }
    }

    // Batch lookup of FIFO Pending queues for this reader's Pending reservations (for BR-07 queuePosition)
    const pendingResTitleIds = [
      ...new Set(
        rawReservations.filter((r) => r.status === 'Pending').map((r) => r.titleId)
      ),
    ];
    const queueMap = new Map();
    if (pendingResTitleIds.length > 0) {
      const allPending = await prisma.reservation.findMany({
        where: { titleId: { in: pendingResTitleIds }, status: 'Pending' },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true, titleId: true },
      });
      for (const row of allPending) {
        const list = queueMap.get(row.titleId) || [];
        list.push(row.id);
        queueMap.set(row.titleId, list);
      }
    }

    const loans = rawLoans.map((loan) => {
      const titleId = loan.copy?.titleId ?? loan.copy?.title?.id ?? null;
      const isOverdue = loan.dueAt.getTime() < now.getTime();
      const lateDays = computeLateDays(loan.dueAt, now);
      const daysRemaining = isOverdue
        ? -lateDays
        : Math.ceil((loan.dueAt.getTime() - now.getTime()) / DAY_MS);
      const alreadyRenewed = loan.renewedAt !== null;
      const hasPendingHold = titleId ? pendingTitleIdsSet.has(titleId) : false;
      const canRenew = !alreadyRenewed && !isOverdue && !hasPendingHold;

      let renewBlockReason = null;
      if (alreadyRenewed) renewBlockReason = 'RENEWAL_LIMIT_EXCEEDED';
      else if (isOverdue) renewBlockReason = 'OVERDUE_RENEWAL_DENIED';
      else if (hasPendingHold) renewBlockReason = 'PENDING_RESERVATION_EXISTS';

      return {
        id: loan.id,
        loanId: loan.id,
        copyId: loan.copyId,
        barcode: loan.copy?.barcode ?? null,
        shelfLocation: loan.copy?.shelfLocation ?? null,
        titleId,
        bookTitle: loan.copy?.title?.title ?? null,
        author: loan.copy?.title?.author ?? null,
        isbn: loan.copy?.title?.isbn ?? null,
        checkedOutAt: loan.checkedOutAt,
        checkoutDate: loan.checkedOutAt,
        dueAt: loan.dueAt,
        dueDate: loan.dueAt,
        renewedAt: loan.renewedAt,
        renewalsCount: alreadyRenewed ? 1 : 0,
        isOverdue,
        overdue: isOverdue,
        lateDays,
        daysOverdue: lateDays,
        daysRemaining,
        canRenew,
        renewBlockReason,
        copy: loan.copy
          ? {
              id: loan.copy.id,
              barcode: loan.copy.barcode,
              shelfLocation: loan.copy.shelfLocation,
              title: loan.copy.title || null,
            }
          : null,
      };
    });

    const reservations = rawReservations.map((reservation) => {
      const queue = queueMap.get(reservation.titleId) || [];
      const queuePosition =
        reservation.status === 'Pending' ? queue.indexOf(reservation.id) + 1 : 0;

      return {
        id: reservation.id,
        reservationId: reservation.id,
        titleId: reservation.titleId,
        bookTitle: reservation.title?.title ?? null,
        author: reservation.title?.author ?? null,
        isbn: reservation.title?.isbn ?? null,
        title: reservation.title || null,
        heldCopyId: reservation.heldCopyId,
        heldCopy: reservation.heldCopy || null,
        status: reservation.status,
        createdAt: reservation.createdAt,
        readyAt: reservation.readyAt,
        expiresAt: reservation.expiresAt,
        pickupDeadline: reservation.expiresAt,
        queuePosition,
      };
    });

    const overdueLoans = loans.filter((l) => l.isOverdue);
    const overdueCount = overdueLoans.length;
    const hasOverdue = overdueCount > 0;
    const maxLateDays = hasOverdue
      ? Math.max(...overdueLoans.map((l) => l.lateDays))
      : 0;

    const overdueFlags = {
      hasOverdue,
      overdueCount,
      maxLateDays,
      overdueLoanIds: overdueLoans.map((l) => l.id),
    };

    const activeLoansCount = loans.length;
    const activeReservationsCount = reservations.length;
    const borrowingBlocked = hasOverdue || activeLoansCount >= MAX_ACTIVE_LOANS;
    const reservingBlocked = hasOverdue || activeReservationsCount >= MAX_ACTIVE_RESERVATIONS;

    const reasons = [];
    if (hasOverdue) {
      reasons.push({
        code: 'READER_OVERDUE',
        rule: 'BR-04',
        message: 'Borrowing and new reservations are suspended while you have overdue loans.',
      });
    }
    if (activeLoansCount >= MAX_ACTIVE_LOANS) {
      reasons.push({
        code: 'LOAN_LIMIT_EXCEEDED',
        rule: 'BR-01',
        message: 'Maximum active loan limit (3) has been reached.',
      });
    }
    if (activeReservationsCount >= MAX_ACTIVE_RESERVATIONS) {
      reasons.push({
        code: 'RESERVATION_LIMIT',
        rule: 'BR-06',
        message: 'Maximum active reservation limit (2) has been reached.',
      });
    }

    const restrictions = {
      borrowingBlocked,
      reservingBlocked,
      canBorrow: !borrowingBlocked,
      canReserve: !reservingBlocked,
      activeLoansCount,
      maxActiveLoans: MAX_ACTIVE_LOANS,
      activeReservationsCount,
      maxActiveReservations: MAX_ACTIVE_RESERVATIONS,
      reasons,
    };

    const alerts = [];
    if (hasOverdue) {
      alerts.push({
        type: 'OVERDUE_WARNING',
        severity: 'error',
        message: `You have ${overdueCount} overdue loan(s). Return overdue items to restore borrowing privileges.`,
      });
    }
    for (const hold of reservations) {
      if (hold.status === 'Ready') {
        alerts.push({
          type: 'HOLD_READY',
          severity: 'info',
          reservationId: hold.id,
          titleId: hold.titleId,
          bookTitle: hold.bookTitle,
          expiresAt: hold.expiresAt,
          message: `"${hold.bookTitle}" is ready for pickup until ${hold.expiresAt?.toISOString?.() ?? hold.expiresAt}.`,
        });
      }
    }

    return {
      readerId: validReaderId,
      reader,
      loans,
      activeLoans: loans,
      reservations,
      activeReservations: reservations,
      overdueCount,
      hasOverdue,
      overdueFlags,
      restrictions,
      alerts,
      generatedAt: now.toISOString(),
    };
  },

  /**
   * FR-F07-03 / UC-12 / SCR-12 / AC-F07-02:
   * List all unreturned overdue loans sorted by lateDays descending (earliest dueAt first),
   * including Reader contact info and BookCopy / BookTitle details.
   */
  async getLibrarianOverdue(now = new Date()) {
    const overdueLoans = await prisma.loan.findMany({
      where: {
        returnedAt: null,
        dueAt: { lt: now },
      },
      orderBy: [{ dueAt: 'asc' }, { id: 'asc' }],
      include: {
        reader: {
          select: { id: true, username: true, fullName: true, email: true },
        },
        copy: {
          select: {
            id: true,
            barcode: true,
            shelfLocation: true,
            status: true,
            title: {
              select: { id: true, isbn: true, title: true, author: true, category: true },
            },
          },
        },
      },
    });

    const items = overdueLoans.map((loan) => {
      const lateDays = computeLateDays(loan.dueAt, now);
      return {
        id: loan.id,
        loanId: loan.id,
        readerId: loan.readerId,
        copyId: loan.copyId,
        checkedOutAt: loan.checkedOutAt,
        dueAt: loan.dueAt,
        dueDate: loan.dueAt,
        renewedAt: loan.renewedAt,
        lateDays,
        daysOverdue: lateDays,
        readerName: loan.reader?.fullName ?? null,
        readerEmail: loan.reader?.email ?? null,
        readerUsername: loan.reader?.username ?? null,
        barcode: loan.copy?.barcode ?? null,
        bookTitle: loan.copy?.title?.title ?? null,
        reader: loan.reader
          ? {
              id: loan.reader.id,
              username: loan.reader.username,
              fullName: loan.reader.fullName,
              email: loan.reader.email,
            }
          : null,
        copy: loan.copy
          ? {
              id: loan.copy.id,
              barcode: loan.copy.barcode,
              shelfLocation: loan.copy.shelfLocation,
              status: loan.copy.status,
            }
          : null,
        title: loan.copy?.title
          ? {
              id: loan.copy.title.id,
              isbn: loan.copy.title.isbn,
              title: loan.copy.title.title,
              author: loan.copy.title.author,
              category: loan.copy.title.category,
            }
          : null,
      };
    });

    return {
      items,
      total: items.length,
      generatedAt: now.toISOString(),
    };
  },

  async getLibrarianDashboard(now = new Date()) {
    const [
      totalTitles,
      totalCopies,
      availableCopies,
      borrowedCopies,
      reservedCopies,
      activeLoans,
      activeReservations,
      overdue,
    ] = await Promise.all([
      prisma.bookTitle.count({ where: { isActive: true } }),
      prisma.bookCopy.count(),
      prisma.bookCopy.count({ where: { status: 'Available' } }),
      prisma.bookCopy.count({ where: { status: 'Borrowed' } }),
      prisma.bookCopy.count({ where: { status: 'Reserved' } }),
      prisma.loan.count({ where: { returnedAt: null } }),
      prisma.reservation.count({ where: { status: { in: ['Pending', 'Ready'] } } }),
      this.getLibrarianOverdue(now),
    ]);

    return {
      metrics: {
        totalTitles,
        totalCopies,
        availableCopies,
        borrowedCopies,
        reservedCopies,
        activeLoans,
        overdueLoans: overdue.total,
        activeReservations,
      },
      overdueItems: overdue.items,
      generatedAt: now.toISOString(),
    };
  },
};

export default dashboardService;
