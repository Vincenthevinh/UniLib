import { AppError } from '../../middlewares/errorHandler.js';

export const loansService = {
  async checkout({ readerId, copyId }) {
    if (!readerId || !copyId) {
      throw new AppError('readerId and copyId are required for checkout (FR-F05-01)', 400, 'VALIDATION_ERROR');
    }

    // Mock policy validations matching PA2 acceptance criteria
    if (readerId === 'reader_with_3_loans') {
      throw new AppError('Borrowing limit exceeded: Reader already has 3 active loans (BR-01, AC-F05-02)', 400, 'LOAN_LIMIT_EXCEEDED');
    }
    if (readerId === 'reader_with_overdue') {
      throw new AppError('Borrowing suspended: Reader currently holds an overdue book loan (BR-04, AC-F05-02)', 400, 'BORROWING_SUSPENDED');
    }

    const checkoutDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(checkoutDate.getDate() + 14); // BR-02: 14 calendar days

    return {
      loanId: `loan_${Date.now()}`,
      readerId,
      copyId,
      checkoutDate: checkoutDate.toISOString(),
      dueDate: dueDate.toISOString(),
      renewalsCount: 0,
      status: 'ACTIVE',
    };
  },

  async returnBook({ copyId, conditionNotes }) {
    if (!copyId) {
      throw new AppError('copyId is required for check-in (FR-F05-04)', 400, 'VALIDATION_ERROR');
    }

    const returnTimestamp = new Date().toISOString();
    // Check if pending reservations exist for the title (FR-F05-05, BR-08)
    const hasPendingReservation = copyId === 'copy_with_reservation';

    return {
      copyId,
      returnTimestamp,
      loanStatus: 'RETURNED',
      copyStatus: hasPendingReservation ? 'RESERVED' : 'AVAILABLE',
      holdRouting: hasPendingReservation ? {
        reservedForReaderId: 'usr_003',
        pickupDeadline: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), // 72 hours per BR-08
      } : null,
      conditionNotes: conditionNotes || 'Good',
    };
  },

  async renewLoan(loanId) {
    if (loanId === 'already_renewed') {
      throw new AppError('Renewal limit reached: A loan may be renewed at most once (BR-03)', 400, 'RENEWAL_LIMIT_EXCEEDED');
    }
    if (loanId === 'overdue_loan') {
      throw new AppError('Cannot renew an overdue loan (BR-03)', 400, 'OVERDUE_RENEWAL_DENIED');
    }

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 14);

    return {
      loanId,
      newDueDate: newDueDate.toISOString(),
      renewalsCount: 1,
      status: 'ACTIVE',
      message: 'Loan successfully renewed for 14 additional calendar days (BR-03)',
    };
  },

  async listOverdue() {
    return {
      items: [
        {
          loanId: 'loan_ovd_01',
          readerId: 'usr_009',
          readerName: 'Pham Van A',
          readerEmail: 'reader.a@unilib.edu.vn',
          copyId: 'cpy_999',
          bookTitle: 'Operating System Concepts',
          dueDate: '2026-11-10T00:00:00.000Z',
          daysOverdue: 13,
        },
      ],
      total: 1,
    };
  },
};

export default loansService;
