// Display helpers only; server is authoritative for BR checks and state transitions.
export const formatDate = (value) => value ? new Date(value).toLocaleString() : '—';
export const errorMessage = (err) => {
  const hints = {
    LOAN_LIMIT: 'BR-01: Maximum 3 active Loans. Return a book first.',
    READER_OVERDUE: 'BR-04: Return overdue Loans before borrowing.',
    READER_INACTIVE: 'BR-10: Reader account must be active.',
    COPY_IN_USE: 'F05: This Book Copy is not available for checkout.',
    HOLD_NOT_ELIGIBLE: 'BR-08: Hold belongs to another Reader or pickup window expired.',
    NOT_FOUND: 'Check the ID or barcode and try again.',
  };
  return `${err?.code || 'REQUEST_FAILED'}: ${hints[err?.code] || err?.message || 'Please check the form and retry.'}`;
};
export const daysLate = (date, now = Date.now()) => Math.max(0, Math.ceil((now - new Date(date).getTime()) / 86400000));
export const findCopyByBarcode = async (api, barcode) => {
  const target = barcode.trim().toLowerCase();
  if (!target) throw new Error('Enter a Book Copy barcode.');
  // Adapter: Catalog contract exposes title/copy lists, but NO barcode lookup endpoint.
  // Client-side lookup is W1 demo-only, requires server barcode endpoint for production scaling.
  let page = 1, totalPages = 1;
  do {
    const result = await api.books.search({ page, pageSize: 100 });
    totalPages = result.pagination?.totalPages || 1;
    for (const title of result.items || []) {
      const copies = await api.copies.list(title.id);
      const copy = (copies.items || []).find((c) => String(c.barcode).toLowerCase() === target);
      if (copy) return { ...copy, titleId: title.id, titleName: title.title };
    }
    page += 1;
  } while (page <= totalPages);
  throw Object.assign(new Error('Barcode not found. Check and try again.'), { code: 'COPY_NOT_FOUND' });
};
