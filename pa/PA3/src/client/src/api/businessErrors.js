// N4: UI text mapping only. Backend error.code/status is authoritative.
// Exact F01/F05/F07 error names need Vinh's contract review.
export const ERROR_MESSAGES = Object.freeze({
  LOAN_LIMIT_REACHED: 'BR-01: Reader has reached 3 active loans. Return a copy before borrowing.',
  LOAN_LIMIT: 'BR-01: Reader has reached 3 active loans. Return a copy before borrowing.',
  READER_HAS_OVERDUE: 'BR-04: Reader has an overdue loan. Return overdue copies before borrowing.',
  READER_OVERDUE: 'BR-04: Reader has an overdue loan. Return overdue copies before borrowing.',
  READER_INACTIVE: 'Reader account is inactive. Ask an Administrator to reactivate it.',
  ISBN_DUPLICATE: 'ISBN already exists. Check the catalog before creating another Book Title.',
  TITLE_IN_USE: 'BR-09: This Book Title has associated copies or active holds and cannot be deactivated.',
  COPY_NOT_AVAILABLE: 'This copy is not Available. Refresh its status before retrying.',
  COPY_IN_USE: 'This copy is Borrowed or Reserved and cannot be modified or decommissioned.',
  COPY_HAS_HISTORY: 'BR-09: This copy has circulation history and cannot be deleted.',
  COPY_AVAILABLE: 'BR-05: At least one copy is available. Borrow it instead of placing a hold.',
  NO_CIRCULATING_COPY: 'No circulating copy exists for this title.',
  RESERVATION_LIMIT: 'BR-06: Maximum two active Reservations. Cancel an existing hold first.',
  RESERVATION_DUPLICATE: 'An active Reservation for this title already exists.',
  TITLE_ALREADY_BORROWED: 'This Reader already has an active Loan for the selected title.',
  RESERVATION_NOT_ACTIVE: 'This Reservation is no longer active. Refresh the queue.',
  HOLD_NOT_ELIGIBLE: 'BR-08: This hold is owned by another Reader or its 72-hour pickup window has expired.',
  CONCURRENT_MODIFICATION: 'The record changed while processing. Refresh and retry.',
  UNAUTHORIZED: 'Session expired or missing. Sign in again.',
  FORBIDDEN: 'Your account does not have permission for this operation.',
  VALIDATION_ERROR: 'Please correct the highlighted fields and try again.',
  NETWORK_ERROR: 'Cannot reach the API. Check the backend connection and retry.',
  INVALID_RESPONSE: 'Unexpected API response. Contact the development team.',
  NOT_FOUND: 'The requested record was not found. Refresh the list and check the ID.',
});
export function formatBusinessError(err) {
  const code = String(err?.code || `HTTP_${err?.status || 0}`);
  const help = ERROR_MESSAGES[code] ||
    (err?.status === 401 ? ERROR_MESSAGES.UNAUTHORIZED :
     err?.status === 403 ? ERROR_MESSAGES.FORBIDDEN :
     err?.status === 409 ? 'Record conflict. Refresh the data before retrying.' :
     err?.status === 422 ? 'Business rule violation. Check eligibility and retry.' :
     err?.message || 'Request failed. Please retry.');
  return `${code}: ${help}`;
}
