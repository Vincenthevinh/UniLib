# PA3 - Normalisation and Indexes (W1-Q4)

Owner: Tran Ho Anh Quan. Relational source: src/server/prisma/schema.prisma and initial migration SQL.

## Normalisation to 3NF

The five tables each represent one logical entity with a stable UUID primary key. Non-key attributes are dependent on the full key and not on other non-key attributes:
- users: role and active flag depend on user id; role is an enum, no duplicated role description.
- book_titles: ISBN, author, category, publisher, publication year depend on title id, not on physical copy.
- book_copies: barcode, shelf and condition/status depend on copy id; title metadata is referenced by title_id rather than repeated.
- loans: reader, copy, checked-out/due/returned/renewed timestamps depend on loan id. Overdue is derived and not persisted.
- reservations: Reader and Title foreign keys plus FIFO/hold lifecycle depend on reservation id; availability counts and queue position are derived, not persisted.

All attributes are atomic for PA2; author is a single display field because multiple-author search management is outside the agreed model. No transitive dependency between non-key attributes is intentionally stored. Separate status enum types constrain the state domains.

## Referential integrity

- users.username and users.email UNIQUE, book_titles.isbn UNIQUE, book_copies.barcode UNIQUE.
- book_copies.title_id REFERENCES book_titles; loans.reader_id REFERENCES users; loans.copy_id REFERENCES book_copies; reservations.reader_id/title_id/held_copy_id REFERENCES corresponding records.
- ON DELETE RESTRICT preserves loan/hold history. Service logic enforces BR-09 before deactivation or deletion.
- Partial unique indexes: only one unreturned loan per copy; only one Ready reservation per held copy; only one active reservation per Reader/Title.

## Index inventory and workload

| Index | Why |
|---|---|
| book_titles.isbn UNIQUE | F02 duplicate prevention and ISBN lookup |
| book_copies.barcode UNIQUE | F03 inventory and F05 checkout scan |
| book_copies(title_id,status) | F02/F04 available counters, F06 zero-Available check |
| loans(reader_id,returned_at) | BR-01 active loan count and overdue checks |
| loans(copy_id,returned_at) | F05 current copy loan lookup |
| loans(due_at,returned_at) | F07 overdue monitoring |
| reservations(title_id,created_at) | BR-07 FIFO queue |
| reservations(title_id,status,created_at) | F06 pending queue selection |
| reservations(reader_id,status) | BR-06 active hold limit |
| reservations(status,expires_at) | BR-08 expiry sweep |
| book_titles(category,publication_year), book_titles(title) | F04 filtering and sorting |
| GIN trigram title/author/category/isbn | F04 case-insensitive substring lookup when large seed is used |

GIN trigram indexes require pg_trgm extension in the migration. Actual P95 under 100 concurrent users on 10,000 books (NFR-01) remains a measurement gate, not a claim based on these indexes.

## Concurrency

Serializable transactions plus row locks and partial uniqueness defend against duplicate holds/loans. A 409 CONCURRENT_MODIFICATION is retryable after re-reading current state. Do not perform a separate read-then-write without a transaction for F05/F06 mutations.