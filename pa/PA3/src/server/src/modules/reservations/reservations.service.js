import { AppError } from '../../middlewares/errorHandler.js';

export const reservationsService = {
  async placeReservation({ readerId, bookId }) {
    if (!readerId || !bookId) {
      throw new AppError('readerId and bookId are required to place a reservation (FR-F06-01)', 400, 'VALIDATION_ERROR');
    }

    // Mock policy checks matching PA2 business rules
    if (bookId === 'book_with_available_copies') {
      throw new AppError('Reservation rejected: Copies are currently Available on shelf (BR-05, AC-F06-02)', 400, 'RESERVATION_NOT_ALLOWED');
    }
    if (readerId === 'reader_with_2_reservations') {
      throw new AppError('Reservation limit exceeded: Reader already has 2 active reservations (BR-06)', 400, 'RESERVATION_LIMIT_EXCEEDED');
    }

    return {
      reservationId: `res_${Date.now()}`,
      readerId,
      bookId,
      status: 'PENDING',
      queuePosition: 1, // FIFO per BR-07
      createdAt: new Date().toISOString(),
    };
  },

  async listReservations(query = {}) {
    const readerId = query.readerId || null;
    const items = [
      {
        reservationId: 'res_001',
        readerId: 'usr_003',
        bookId: 'book_002',
        bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        status: 'READY_FOR_PICKUP',
        pickupDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        queuePosition: 1,
      },
    ];
    const filtered = readerId ? items.filter((r) => r.readerId === readerId) : items;
    return { items: filtered, total: filtered.length };
  },

  async cancelReservation(id) {
    return {
      reservationId: id,
      status: 'CANCELLED',
      message: 'Reservation cancelled successfully (FR-F06-05)',
    };
  },

  async pickupReservation(id) {
    return {
      reservationId: id,
      status: 'FULFILLED',
      message: 'Reservation fulfilled: copy checked out to reader (FR-F06-06)',
    };
  },
};

export default reservationsService;
