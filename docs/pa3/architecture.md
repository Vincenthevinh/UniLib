# PA3 - Architecture (W1-Q2)

Owner: Tran Ho Anh Quan. Frozen scope: F01-F07, UC-01..12, SCR-01..12.

## Architectural Style

UniLib follows a layered modular monolith with a client-server boundary:
- Presentation layer: React/Vite SPA (Reader, Librarian, Administrator views).
- HTTP API layer: Express routes/controllers, authentication/RBAC and uniform HTTP errors.
- Application layer: catalog, inventory, circulation and reservation services; domain policy checks.
- Data access layer: Prisma Client plus PostgreSQL transaction/row-lock SQL where needed.
- Persistence layer: PostgreSQL 16 with foreign keys and state-uniqueness constraints.

Justification: the W1 design goal is a small, demonstrable F01-F07 system, not microservice operations. One API process keeps circulation/hold operations in the same ACID transaction, avoids distributed state races, and reduces student-team deployment and debugging cost. Stateless JWT enables browser/API separation. A typed relational schema supports traceability and integrity. Costs: API modules share a release, and a DB outage affects all features. A separate timer worker can be extracted later, but not during W1.

## C4-L1 System Context

Source diagram: docs/design/c4/system-context.mmd.
Actors: Reader browses, reserves, monitors; Librarian maintains titles/copies and desk operations; Administrator manages users. UniLib owns its PostgreSQL data. There are no external payment, SMS/email, RFID, e-book or AI recommendation systems in the approved PA2 boundary.

## C4-L2 Containers

Source diagram: docs/design/c4/container.mmd.
- Web SPA (React/Vite) served separately, speaks HTTPS JSON with Bearer JWT.
- API (Node.js 22, Express, Prisma) enforces RBAC and applies F01-F07 rules.
- PostgreSQL 16 persists users, titles, physical copies, loans and reservations.
- Reservation expiry timer runs inside the API process for the W1 demo; a single instance avoids duplicate scheduling. With multiple replicas, the DB transaction and idempotent state guards remain authoritative.

## Main design goals and constraints

- Correctness first: BR-01..BR-10 and NFR-05 state transitions use transactions/locks.
- Security: NFR-03 bcrypt hashes and NFR-04 JWT 401 vs RBAC 403.
- Search UX: FR-F04-01..04 filter, paginate and include real-time counters.
- Reproducibility: migration, deterministic seed, compose and stable error codes.
- Compatibility: routes must preserve the frozen PA2 FR/UC/SCR identifiers; changed API field names require team notification and docs/design/api.md update.

## Integration responsibilities

Vinh owns authoritative Express/Auth/RBAC/Circulation F01/F05/F07. The current app.js and middleware/auth.js are minimal bootstrap/adapters only because the repository started with no server. Quans owned modules are Prisma, catalog/copy/search, reservation, seed and architecture/data docs. When Vinh supplies his implementation, integrate routes without replacing his files or weakening his RBAC.