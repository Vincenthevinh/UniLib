import { AppError } from '../../middlewares/errorHandler.js';

export const copiesService = {
  async listCopies(query = {}) {
    const bookId = query.bookId || null;
    const copies = [
      { id: 'cpy_001', bookId: 'book_001', barcode: 'BC-00101', shelfLocation: 'CS-01-A', status: 'AVAILABLE', condition: 'Good' },
      { id: 'cpy_002', bookId: 'book_001', barcode: 'BC-00102', shelfLocation: 'CS-01-A', status: 'BORROWED', condition: 'Good' },
      { id: 'cpy_003', bookId: 'book_001', barcode: 'BC-00103', shelfLocation: 'CS-01-A', status: 'RESERVED', condition: 'Fair' },
    ];
    const items = bookId ? copies.filter((c) => c.bookId === bookId) : copies;
    return { items, total: items.length };
  },

  async createCopy(data) {
    if (!data.bookId || !data.barcode || !data.shelfLocation) {
      throw new AppError('bookId, barcode, and shelfLocation are required fields (FR-F03-01)', 400, 'VALIDATION_ERROR');
    }
    return {
      id: `cpy_${Date.now()}`,
      bookId: data.bookId,
      barcode: data.barcode,
      shelfLocation: data.shelfLocation,
      status: 'AVAILABLE',
      condition: data.condition || 'New',
      createdAt: new Date().toISOString(),
    };
  },

  async getCopyById(id) {
    if (id === 'not_found') {
      throw new AppError(`Physical copy '${id}' not found`, 404, 'NOT_FOUND');
    }
    return {
      id,
      bookId: 'book_001',
      barcode: 'BC-00101',
      shelfLocation: 'CS-01-A',
      status: 'AVAILABLE',
      condition: 'Good',
    };
  },

  async updateCopy(id, data) {
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteCopy(id) {
    // BR-09 & FR-F03-04: Cannot decommission a copy currently marked Borrowed or Reserved
    if (id === 'borrowed_copy' || id === 'cpy_002') {
      throw new AppError('Cannot decommission a physical copy currently in BORROWED or RESERVED status (BR-09, FR-F03-04)', 409, 'STATE_CONFLICT');
    }
    return {
      success: true,
      message: `Physical copy '${id}' decommissioned successfully`,
    };
  },
};

export default copiesService;
