# PA3 - Data Diagram and Data Specification

Owner: Tran Ho Anh Quan (W1-Q1, W1-Q4).
Source: src/server/prisma/schema.prisma.
ERD source: docs/design/erd.dbml, export: docs/design/erd.png.

## Entities and relationships

- User: one Reader can have many Loans and Reservations; Librarian/Administrator are represented by Role.
- BookTitle: one title has many BookCopies and title-level Reservations.
- BookCopy: one copy has many historical Loans and optional historical held Reservations. The database enforces at most one current loan and one Ready hold per copy.
- Reservation: request joins one Reader and one BookTitle; heldCopyId is null until the first returned copy is allocated.

## Columns and types

| Table | PK | Unique | FKs | Important columns |
|---|---|---|---|---|
| users | id UUID | username, email | - | fullName, passwordHash, role, isActive |
| book_titles | id UUID | isbn | - | title, author, category, publisher?, publicationYear, isActive |
| book_copies | id UUID | barcode | titleId -> book_titles | shelfLocation, conditionNotes?, status |
| loans | id UUID | active copy (partial) | readerId -> users, copyId -> book_copies | checkedOutAt, dueAt, returnedAt?, renewedAt? |
| reservations | id UUID | one active title per reader; one Ready copy (partial) | readerId -> users, titleId -> book_titles, heldCopyId? -> book_copies | status, createdAt, readyAt?, expiresAt?, fulfilledAt?, cancelledAt? |

All business timestamps are PostgreSQL timestamptz(3), interpreted as UTC instants. Loan overdue is derived (returnedAt is null and dueAt earlier than now), not redundantly stored.

## State assumptions requiring BA/PM confirmation

CopyStatus: Available, Borrowed, Reserved, Damaged, Lost. PA2 combines the last two as Damaged/Lost.
ReservationStatus: Pending, Ready, Fulfilled, Cancelled, Expired. Ready represents PA2 Ready for Pickup.
These are implementation names, not a change to frozen BR/FR/UC/SCR IDs. Final approval for Q-R04 is still pending.

## Integrity and concurrency

All FKs use RESTRICT; deletes are blocked when referenced. Partial unique SQL indexes prevent duplicate active Loans on a Copy, duplicate Ready hold allocation for a Copy, and duplicate active Reservations for a Reader and Title. These indexes are in the initial migration because Prisma cannot declare partial indexes. Mutation services must also lock affected PostgreSQL rows inside transactions (NFR-05).

## Data quality constraints

ISBN and barcode are unique. Publication year is stored as SMALLINT. Nullable optional fields avoid empty-string sentinels. Credentials are bcrypt hashes, never plaintext. No derived availableCopyCount column is stored: it is aggregated from BookCopy at read time.

## Open decisions

- Confirm canonical state labels and damaged-return handling with BA/PM.
- Confirm 14-day due date interpretation (UTC instant vs local calendar cutoff).
- Confirm soft-inactivation policy for title with historical references.