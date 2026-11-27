import { prisma } from '../../../db.js';
import { HttpError, requireField, requireUuid } from '../../../lib/errors.js';
import {
  allocateNextHold,
  fulfillHeldReservation,
} from '../../../services/reservations.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const LOAN_DAYS = 14;
const MAX_ACTIVE_LOANS = 3;

async function lockUser(tx, readerId) {
  await tx.$queryRawUnsafe(
    'SELECT id FROM "users" WHERE id = $1::uuid FOR UPDATE',
    readerId
  );
}

async function lockTitle(tx, titleId) {
  await tx.$queryRawUnsafe(
    'SELECT id FROM "book_titles" WHERE id = $1::uuid FOR UPDATE',
    titleId
  );
}

async function lockCopy(tx, copyId) {
  await tx.$queryRawUnsafe(
    'SELECT id FROM "book_copies" WHERE id = $1::uuid FOR UPDATE',
    copyId
  );
}

async function lockLoan(tx, loanId) {
  await tx.$queryRawUnsafe(
    'SELECT id FROM "loans" WHERE id = $1::uuid FOR UPDATE',
    loanId
  );
}

async function resolveCopyLookup({ barcode, copyId }) {
  if (barcode !== undefined && barcode !== null && String(barcode).trim() !== '') {
    const cleanBarcode = requireField(barcode, 'barcode', 80);
    const copy = await prisma.bookCopy.findUnique({
      where: { barcode: cleanBarcode },
      select: { id: true, titleId: true, barcode: true },
    });
    if (!copy) {
      throw new HttpError(404, 'COPY_NOT_FOUND', 'Book copy not found');
    }
    return copy;
  }

  if (copyId !== undefined && copyId !== null && String(copyId).trim() !== '') {
    const cleanCopyId = requireUuid(copyId, 'copyId');
    const copy = await prisma.bookCopy.findUnique({
      where: { id: cleanCopyId },
      select: { id: true, titleId: true, barcode: true },
    });
    if (!copy) {
      throw new HttpError(404, 'COPY_NOT_FOUND', 'Book copy not found');
    }
    return copy;
  }

  throw new HttpError(
    400,
    'VALIDATION_ERROR',
    'barcode is required for circulation operation'
  );
}

export const loansService = {
  /**
   * UC-07 / FR-F05-01..03 / FR-F06-06:
   * Atomically check out a physical BookCopy to an eligible Reader.
   * Lock order: User -> BookTitle -> BookCopy to prevent deadlocks with ReservationService.
   */
  async checkout({ readerId, barcode, copyId } = {}, now = new Date()) {
    const validReaderId = requireUuid(readerId, 'readerId');
    const copyLookup = await resolveCopyLookup({ barcode, copyId });

    return prisma.$transaction(async (tx) => {
      await lockUser(tx, validReaderId);
      await lockTitle(tx, copyLookup.titleId);
      await lockCopy(tx, copyLookup.id);

      const reader = await tx.user.findUnique({
        where: { id: validReaderId },
        select: { id: true, username: true, fullName: true, role: true, isActive: true },
      });
      if (!reader) {
        throw new HttpError(404, 'READER_NOT_FOUND', 'Reader not found');
      }
      if (reader.role !== 'Reader' || !reader.isActive) {
        throw new HttpError(
          422,
          'READER_INACTIVE',
          'Only active Reader accounts may borrow books'
        );
      }

      const [activeLoansCount, overdueLoansCount, copy] = await Promise.all([
        tx.loan.count({ where: { readerId: validReaderId, returnedAt: null } }),
        tx.loan.count({
          where: { readerId: validReaderId, returnedAt: null, dueAt: { lt: now } },
        }),
        tx.bookCopy.findUnique({
          where: { id: copyLookup.id },
          include: { title: { select: { id: true, title: true, isbn: true, isActive: true } } },
        }),
      ]);

      if (!copy) {
        throw new HttpError(404, 'COPY_NOT_FOUND', 'Book copy not found');
      }

      // BR-04: Overdue borrowing suspension
      if (overdueLoansCount > 0) {
        throw new HttpError(
          422,
          'READER_OVERDUE',
          'Checkout suspended: Reader has overdue book loans (BR-04)'
        );
      }

      // BR-01: Maximum 3 concurrently active loans
      if (activeLoansCount >= MAX_ACTIVE_LOANS) {
        throw new HttpError(
          422,
          'LOAN_LIMIT_EXCEEDED',
          'Checkout blocked: Reader has reached the maximum limit of 3 active loans (BR-01)'
        );
      }

      let fulfilledReservation = null;
      if (copy.status === 'Reserved') {
        // FR-F06-06: Fulfill Ready hold belonging to this Reader (tx-injected, no circular import)
        fulfilledReservation = await fulfillHeldReservation(tx, validReaderId, copy.id, now);
      } else if (copy.status !== 'Available') {
        throw new HttpError(
          409,
          'COPY_NOT_AVAILABLE',
          `Book copy is currently ${copy.status} and cannot be checked out`
        );
      }

      const existingActiveLoan = await tx.loan.findFirst({
        where: { copyId: copy.id, returnedAt: null },
        select: { id: true },
      });
      if (existingActiveLoan) {
        throw new HttpError(
          409,
          'COPY_NOT_AVAILABLE',
          'Book copy already has an active loan'
        );
      }

      // BR-02: Standard loan duration is 14 calendar days
      const dueAt = new Date(now.getTime() + LOAN_DAYS * DAY_MS);

      const loan = await tx.loan.create({
        data: {
          readerId: validReaderId,
          copyId: copy.id,
          checkedOutAt: now,
          dueAt,
          returnedAt: null,
          renewedAt: null,
        },
      });

      const updatedCopy = await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: 'Borrowed' },
      });

      return {
        ...loan,
        loanId: loan.id,
        checkoutDate: loan.checkedOutAt,
        dueDate: loan.dueAt,
        renewalsCount: 0,
        status: 'ACTIVE',
        copy: {
          id: updatedCopy.id,
          barcode: updatedCopy.barcode,
          status: updatedCopy.status,
          titleId: updatedCopy.titleId,
          title: copy.title?.title ?? null,
        },
        fulfilledReservation,
      };
    }, { timeout: 10000, maxWait: 10000 });
  },

  /**
   * UC-08 / FR-F05-04..05 / BR-07..08:
   * Atomically close the active Loan for a returned BookCopy and route the copy
   * to the next FIFO Ready hold (72h window) via ReservationService.allocateNextHold
   * or restore it to Available.
   * Lock order: BookTitle -> BookCopy -> Loan.
   */
  async returnBook({ barcode, copyId, conditionNotes, condition } = {}, now = new Date()) {
    const copyLookup = await resolveCopyLookup({ barcode, copyId });
    const rawNotes = conditionNotes !== undefined ? conditionNotes : condition;
    const hasNotes = rawNotes !== undefined && rawNotes !== null && String(rawNotes).trim() !== '';
    const damagedOrLost = condition === 'Damaged' || condition === 'Lost';

    return prisma.$transaction(async (tx) => {
      await lockTitle(tx, copyLookup.titleId);
      await lockCopy(tx, copyLookup.id);

      const copy = await tx.bookCopy.findUnique({
        where: { id: copyLookup.id },
        include: { title: { select: { id: true, title: true, isbn: true } } },
      });
      if (!copy) {
        throw new HttpError(404, 'COPY_NOT_FOUND', 'Book copy not found');
      }

      const activeLoan = await tx.loan.findFirst({
        where: { copyId: copy.id, returnedAt: null },
      });
      if (copy.status !== 'Borrowed' || !activeLoan) {
        throw new HttpError(
          409,
          'COPY_NOT_BORROWED',
          'Book copy is not currently borrowed or loan has already been returned'
        );
      }

      await lockLoan(tx, activeLoan.id);

      const closedLoan = await tx.loan.update({
        where: { id: activeLoan.id },
        data: { returnedAt: now },
      });

      if (hasNotes) {
        await tx.bookCopy.update({
          where: { id: copy.id },
          data: { conditionNotes: String(rawNotes).trim() },
        });
      }

      let hold = null;
      let resultingStatus;
      if (damagedOrLost) {
        const updated = await tx.bookCopy.update({
          where: { id: copy.id },
          data: { status: condition },
        });
        resultingStatus = updated.status;
      } else {
        hold = await allocateNextHold(tx, copy.titleId, copy.id, now);
        resultingStatus = hold ? 'Reserved' : 'Available';
      }

      return {
        id: closedLoan.id,
        loanId: closedLoan.id,
        readerId: closedLoan.readerId,
        copyId: copy.id,
        barcode: copy.barcode,
        returnedAt: closedLoan.returnedAt,
        returnTimestamp: closedLoan.returnedAt,
        loanStatus: 'RETURNED',
        copyStatus: resultingStatus,
        copy: {
          id: copy.id,
          barcode: copy.barcode,
          status: resultingStatus,
          titleId: copy.titleId,
          title: copy.title?.title ?? null,
          conditionNotes: hasNotes ? String(rawNotes).trim() : copy.conditionNotes,
        },
        hold: hold
          ? {
              id: hold.id,
              readerId: hold.readerId,
              titleId: hold.titleId,
              heldCopyId: hold.heldCopyId,
              status: hold.status,
              readyAt: hold.readyAt,
              expiresAt: hold.expiresAt,
            }
          : null,
      };
    }, { timeout: 10000, maxWait: 10000 });
  },

  /**
   * UC-09 / FR-F05-06 / BR-03:
   * Renew an active Loan once for +14 calendar days when not overdue and no pending reservation exists.
   * Lock order: BookTitle -> Loan.
   */
  async renewLoan(loanId, actor = null, now = new Date()) {
    const validLoanId = requireUuid(loanId, 'loanId');

    const lookup = await prisma.loan.findUnique({
      where: { id: validLoanId },
      include: { copy: { select: { id: true, titleId: true, barcode: true } } },
    });
    if (!lookup) {
      throw new HttpError(404, 'LOAN_NOT_FOUND', 'Loan not found');
    }
    if (actor?.role === 'Reader' && lookup.readerId !== actor.id) {
      throw new HttpError(403, 'FORBIDDEN', 'Readers may only renew their own loans');
    }

    return prisma.$transaction(async (tx) => {
      await lockTitle(tx, lookup.copy.titleId);
      await lockLoan(tx, validLoanId);

      const loan = await tx.loan.findUnique({
        where: { id: validLoanId },
        include: { copy: { select: { id: true, titleId: true, barcode: true } } },
      });
      if (!loan) {
        throw new HttpError(404, 'LOAN_NOT_FOUND', 'Loan not found');
      }
      if (actor?.role === 'Reader' && loan.readerId !== actor.id) {
        throw new HttpError(403, 'FORBIDDEN', 'Readers may only renew their own loans');
      }
      if (loan.returnedAt !== null) {
        throw new HttpError(
          409,
          'LOAN_ALREADY_RETURNED',
          'Cannot renew a loan that has already been returned'
        );
      }

      // BR-03: Maximum 1 renewal per loan
      if (loan.renewedAt !== null) {
        throw new HttpError(
          422,
          'RENEWAL_LIMIT_EXCEEDED',
          'Loan renewal limit reached: A loan may be renewed at most once (BR-03)'
        );
      }

      // BR-03: Overdue loans cannot be renewed
      if (loan.dueAt < now) {
        throw new HttpError(
          422,
          'OVERDUE_RENEWAL_DENIED',
          'Cannot renew an overdue loan (BR-03)'
        );
      }

      // BR-03: Pending reservation on parent BookTitle blocks renewal
      const pendingReservations = await tx.reservation.count({
        where: { titleId: loan.copy.titleId, status: 'Pending' },
      });
      if (pendingReservations > 0) {
        throw new HttpError(
          422,
          'PENDING_RESERVATION_EXISTS',
          'Cannot renew loan while pending reservations exist for this book title (BR-03)'
        );
      }

      const newDueAt = new Date(loan.dueAt.getTime() + LOAN_DAYS * DAY_MS);
      const updated = await tx.loan.update({
        where: { id: validLoanId },
        data: {
          dueAt: newDueAt,
          renewedAt: now,
        },
      });

      return {
        ...updated,
        loanId: updated.id,
        newDueDate: updated.dueAt,
        dueDate: updated.dueAt,
        renewalsCount: 1,
        status: 'ACTIVE',
        message: 'Loan successfully renewed for 14 additional calendar days (BR-03)',
      };
    }, { timeout: 10000, maxWait: 10000 });
  },

  /**
   * FR-F05-07 / FR-F07-03:
   * List active loans whose dueAt has passed without return.
   */
  async listOverdue(now = new Date()) {
    const overdueLoans = await prisma.loan.findMany({
      where: {
        returnedAt: null,
        dueAt: { lt: now },
      },
      orderBy: { dueAt: 'asc' },
      include: {
        reader: { select: { id: true, username: true, fullName: true, email: true } },
        copy: {
          select: {
            id: true,
            barcode: true,
            title: { select: { id: true, title: true, isbn: true } },
          },
        },
      },
    });

    const items = overdueLoans.map((loan) => ({
      id: loan.id,
      loanId: loan.id,
      readerId: loan.readerId,
      readerName: loan.reader?.fullName ?? null,
      readerEmail: loan.reader?.email ?? null,
      copyId: loan.copyId,
      barcode: loan.copy?.barcode ?? null,
      bookTitle: loan.copy?.title?.title ?? null,
      dueAt: loan.dueAt,
      dueDate: loan.dueAt,
      daysOverdue: Math.max(1, Math.ceil((now.getTime() - loan.dueAt.getTime()) / DAY_MS)),
    }));

    return { items, total: items.length };
  },
};

export default loansService;
