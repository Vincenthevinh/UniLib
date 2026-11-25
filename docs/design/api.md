# UniLib W1 REST API Contract

Owner: Quan for F02-F04/F06; Vinh owns F01/F05/F07 integration. Base path: /api.
All JSON errors use { "error": { "code": "SOME_CODE", "message": "Human-readable message" } }.
401 = missing/invalid JWT, 403 = authenticated but forbidden role, 400 = malformed request, 404 = missing resource, 409 = uniqueness/state race, 422 = business rule failure.

## Auth contract (integration with Vinh)

Authorization: Bearer JWT with claims sub (User UUID) and role (Reader, Librarian, Administrator). Active status and role are verified against database per request. The temporary middleware in src/server/middleware/auth.js is replaceable when Vinh merges F01. Do not trust readerId supplied by the client.

## F02-F04 Catalog and Inventory

| Method / path | Role | Request | Response |
|---|---|---|---|
| GET /books | Public | q?, category?, available=true/false/all, sort=title/year, page=1, pageSize=10 (max 100) | 200 {items: BookSummary[], pagination:{page,pageSize,total,totalPages}} |
| GET /books/:id | Public | UUID title id | 200 BookDetail (includes copies) |
| POST /books | Librarian | {isbn,title,author,category,publicationYear,publisher?} | 201 BookDetail |
| PATCH /books/:id | Librarian | Partial title metadata or {isActive:false} | 200 BookDetail |
| DELETE /books/:id | Librarian | none | 200 deactivated BookDetail; blocked if any copies or active holds |
| GET /books/:id/copies | Public | UUID title id | 200 {items: Copy[]} |
| POST /books/:id/copies | Librarian | {barcode,shelfLocation,conditionNotes?} | 201 Copy |
| PATCH /copies/:id | Librarian | {shelfLocation?,conditionNotes?,status?} | 200 Copy |
| DELETE /copies/:id | Librarian | none | 204; blocked for Borrowed/Reserved or historical circulation |

BookSummary = {id,isbn,title,author,category,publisher,publicationYear,isActive,createdAt,updatedAt,totalCopies,availableCopies,borrowedCopies,reservedCopies,damagedCopies,lostCopies,shelfLocations}.
BookDetail adds copies[] where Copy = {id,barcode,status,shelfLocation,conditionNotes}.
Searching is case-insensitive across title, author, category, ISBN. Category match is case-insensitive exact. available=true means at least one Available copy; false/all do not filter. sort=title alphabetical or sort=year publication year descending. No match is 200 with items=[].

## F06 Reservations

| Method / path | Role | Request | Response |
|---|---|---|---|
| POST /reservations | Reader | {titleId} | 201 {reservation,queuePosition} |
| GET /reservations/me | Reader | none | 200 {items: ReservationWithTitleAndQueuePosition[]} |
| GET /reservations/queue | Librarian | titleId? | 200 {items: ReservationWithReaderTitleCopy[]} |
| DELETE /reservations/:id | Reader owner | UUID reservation id | 200 cancelled Reservation |

Reservation = {id,readerId,titleId,heldCopyId,status,createdAt,readyAt,expiresAt,fulfilledAt,cancelledAt}. Status values are Pending, Ready, Fulfilled, Cancelled, Expired. Pending queuePosition is 1-based; Ready and history get 0. Ready expiresAt is exactly 72 hours after allocation.

Common 422 codes: COPY_AVAILABLE, NO_CIRCULATING_COPY, READER_OVERDUE, TITLE_ALREADY_BORROWED, RESERVATION_DUPLICATE, RESERVATION_LIMIT, READER_INACTIVE.
409 codes: TITLE_IN_USE, COPY_IN_USE, COPY_HAS_HISTORY, RESERVATION_NOT_ACTIVE, HOLD_NOT_ELIGIBLE, CONCURRENT_MODIFICATION.

## F05 Circulation (Loans — Vinh V3-W1)

| Method / path | Role | Request | Response |
|---|---|---|---|
| POST /loans/checkout | Librarian | {readerId, barcode} | 201 {id, loanId, readerId, copyId, checkedOutAt, dueAt, dueDate, copy, fulfilledReservation, data} |
| POST /loans/return | Librarian | {barcode, conditionNotes?, condition?} | 200 {id, loanId, copyId, barcode, returnedAt, loanStatus, copyStatus, copy, hold, data} |
| POST /loans/:id/renew | Reader (owner) / Librarian | none (loan UUID in :id) | 200 {id, loanId, dueAt, newDueDate, renewedAt, renewalsCount, status, data} |
| GET /loans/overdue | Librarian | none | 200 {items, total, data} |

F05 error codes:
- `422 READER_INACTIVE`, `422 READER_OVERDUE` (BR-04), `422 LOAN_LIMIT_EXCEEDED` (BR-01), `422 RENEWAL_LIMIT_EXCEEDED` (BR-03), `422 OVERDUE_RENEWAL_DENIED` (BR-03), `422 PENDING_RESERVATION_EXISTS` (BR-03).
- `409 COPY_NOT_AVAILABLE`, `409 COPY_NOT_BORROWED`, `409 LOAN_ALREADY_RETURNED`, `409 HOLD_NOT_FOUND`, `409 HOLD_NOT_ELIGIBLE`.

## F05 integration exports for Vinh

Import allocateNextHold(tx,titleId,copyId,now) from services/reservations.js when return is committed. Must be invoked inside same PostgreSQL transaction after title and copy locks; changes copy to Reserved with Ready hold or to Available.
Import fulfillHeldReservation(tx,readerId,copyId,now) for held checkout. It rejects when hold owner differs or pickup deadline passed; LoanService then changes copy to Borrowed and creates Loan in same transaction.
Lock order must be consistent: BookTitle before BookCopy before Loan/Reservation mutation on hold paths; coordinate with existing F05 checkout/return logic to avoid deadlocks.

## Infrastructure and CORS

GET /health queries PostgreSQL and returns 200 {status:"ok"} only when connected. CLIENT_ORIGIN controls the single allowed browser origin (default http://localhost:5173). The server accepts application/json request bodies up to 50 KiB.

Any API field or error-code change requires notifying Anh, Nguyen and Vinh and updating this document before disabling frontend mocks.