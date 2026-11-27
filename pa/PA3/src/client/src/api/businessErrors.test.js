import { describe, expect, it } from 'vitest';
import { formatBusinessError } from './businessErrors.js';

describe('N4 business error mapping', () => {
  it.each([
    [{ code: 'LOAN_LIMIT_REACHED' }, 'BR-01'],
    [{ code: 'READER_HAS_OVERDUE' }, 'BR-04'],
    [{ code: 'ISBN_DUPLICATE' }, 'ISBN'],
    [{ code: 'COPY_NOT_AVAILABLE' }, 'Available'],
    [{ code: 'HOLD_NOT_ELIGIBLE' }, 'BR-08'],
    [{ status: 401 }, 'Sign in'],
  ])('shows guidance for %j', (error, text) => {
    expect(formatBusinessError(error)).toContain(text);
  });
});
