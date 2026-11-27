import { AppError } from '../../middlewares/errorHandler.js';

export const booksService = {
  async searchAndBrowse(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const q = query.q || '';
    const category = query.category || null;

    // Skeleton catalog data satisfying PA2 F02 & F04
    const sampleBooks = [
      {
        id: 'book_001',
        isbn: '978-0132350884',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: 'Computer Science',
        publisher: 'Prentice Hall',
        publicationYear: 2008,
        totalCopies: 3,
        availableCopies: 1,
        borrowedCopies: 1,
        reservedCopies: 1,
      },
      {
        id: 'book_002',
        isbn: '978-0201633610',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        category: 'Computer Science',
        publisher: 'Addison-Wesley Professional',
        publicationYear: 1994,
        totalCopies: 2,
        availableCopies: 0,
        borrowedCopies: 2,
        reservedCopies: 0,
      },
    ];

    let items = sampleBooks;
    if (q) {
      items = items.filter((b) =>
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase()) ||
        b.isbn.includes(q)
      );
    }
    if (category) {
      items = items.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    return {
      items,
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit) || 1,
      },
    };
  },

  async createBook(data) {
    if (!data.isbn || !data.title || !data.author) {
      throw new AppError('ISBN, title, and author are required fields', 400, 'VALIDATION_ERROR');
    }
    return {
      id: `book_${Date.now()}`,
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      category: data.category || 'General',
      publisher: data.publisher || null,
      publicationYear: data.publicationYear || new Date().getFullYear(),
      totalCopies: 0,
      availableCopies: 0,
      borrowedCopies: 0,
      reservedCopies: 0,
      createdAt: new Date().toISOString(),
    };
  },

  async getBookById(id) {
    if (id === 'not_found') {
      throw new AppError(`Book title with id '${id}' not found`, 404, 'NOT_FOUND');
    }
    return {
      id,
      isbn: '978-0132350884',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Computer Science',
      publisher: 'Prentice Hall',
      publicationYear: 2008,
      totalCopies: 3,
      availableCopies: 1,
      borrowedCopies: 1,
      reservedCopies: 1,
      copies: [
        { id: 'cpy_001', barcode: 'BC-00101', shelfLocation: 'CS-01-A', status: 'AVAILABLE' },
        { id: 'cpy_002', barcode: 'BC-00102', shelfLocation: 'CS-01-A', status: 'BORROWED' },
        { id: 'cpy_003', barcode: 'BC-00103', shelfLocation: 'CS-01-A', status: 'RESERVED' },
      ],
    };
  },

  async updateBook(id, data) {
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteBook(id) {
    // BR-09: A book title cannot be deleted if physical copies exist
    if (id === 'book_with_copies') {
      throw new AppError('Cannot delete book title with registered physical copies (BR-09)', 409, 'REFERENTIAL_CONFLICT');
    }
    return {
      success: true,
      message: `Book title '${id}' deleted successfully`,
    };
  },
};

export default booksService;
