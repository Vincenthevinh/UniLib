# PA3 - Component Diagram and UC-10 Reservation Sequence

Owner: Tran Ho Anh Quan (W1-Q3).
Sources: docs/design/component-api.mmd and docs/design/sequence-uc10.mmd.

## Component decomposition

API entrypoints are thin Express route modules. The temporary F01 JWT/RBAC middleware verifies role and active account; Vinh will replace/integrate it with authoritative Auth. CatalogService owns title/copy writes and search. ReservationService owns place/cancel/FIFO allocation/expiry/fulfillment lifecycle. LoanService (Vinh) owns checkout/return/renew and must call ReservationService allocation/fulfillment within the same PostgreSQL transaction. Prisma is the single persistence adapter; row locking is used for mutation paths. UI has no database access.

## UC-10 Reserve Book Title

POST /api/reservations takes titleId and derives readerId only from JWT. A serializable transaction locks the Reader row then BookTitle row, checks BR-04/05/06/07 and FR-F06-02, then creates Pending reservation. A position within that title's FIFO queue is returned. An available copy, overdue Reader, duplicate loan/title reservation, inactive Reader or two active reservations causes a 422 business error. Invalid tokens return 401 and wrong roles 403.

## Hold lifecycle (UC-11 and F05 integration)

On return, Vinh's LoanService locks copy/loan/title and calls allocateNextHold(transaction, titleId, copyId, timestamp). It selects the earliest Pending reservation by createdAt then id, sets Ready, associates the returned copy, sets expiresAt exactly 72 hours later, and transitions the copy to Reserved. With no pending entry, the copy becomes Available.

The API process runs sweepExpiredHolds periodically. A due Ready reservation is rechecked under a locked title/copy transaction, marked Expired, and the next FIFO entry gets a fresh 72 hours or the copy becomes Available. Cancellation follows the same allocation path. For checkout of a Reserved copy, Vinh must call fulfillHeldReservation(transaction, readerId, copyId) and only create Loan/change copy state on success. A held copy cannot be checked out by a different Reader or after expiry.

## Concurrency contract

- PostgreSQL SERIALIZABLE for placing, cancelling and sweeping; 409 on P2034 retryable conflict.
- Lock Reader then BookTitle for placement/cancellation. Hold routing locks the BookTitle before selecting queue head and locks Copy for mutation.
- Partial unique indexes provide a second line of defense for active Loans and Ready holds.
- Expiry job is idempotent; rows whose status changed since scanning are ignored.
- One API replica for W1 timer; additional replicas require an operational lease or advisory job lock, though the transaction guard prevents duplicate state assignment.

## Known open decision

PA2 issue Q-R05 does not define whether a patron who becomes overdue or inactive after reservation placement should be skipped at hold assignment. To preserve strict BR-07 FIFO and avoid silently cancelling holds, W1 allocates to the oldest Pending reservation without revalidating account status. PM/BA should decide the skip/cancel policy before release.