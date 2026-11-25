# PA3 §4 — Object-Oriented Design (N1-W1 Draft)

**Project:** UniLib — University Library Management System
**Owner:** Nguyễn Thanh Thảo Nguyên — BA / Frontend (Staff/Admin)
**Scope:** F01–F07, UC-01–UC-12. **Status:** Draft for architectural review, not a final PA3 baseline.

## 4.1 Domain Model

![UniLib conceptual domain model](../design/uml/domain-model.png)

**Editable diagram:** [domain-model.puml](../design/uml/domain-model.puml).

### Entities and relationships

| Concept | Source of truth | Cardinality / constraint |
|---|---|---|
| User / Reader / Librarian / Administrator | Single `users` table; `role` enum | Roles are *logical specializations*, not separate database tables. |
| BookTitle–BookCopy | `book_copies.title_id -> book_titles.id` | One title to zero or many copies; each copy has exactly one title. |
| Reader–Loan | `loans.reader_id -> users.id` | One Reader to zero or many historical loans; each loan has one Reader. |
| BookCopy–Loan | `loans.copy_id -> book_copies.id` | One copy to zero or many historical loans; no simultaneous active loans for one copy. |
| Reader–Reservation | `reservations.reader_id -> users.id` | One Reader to zero or many historical holds; at most two active holds (BR-06). |
| BookTitle–Reservation | `reservations.title_id -> book_titles.id` | One title to zero or many reservation history records. |
| BookCopy–Reservation | Nullable `reservations.held_copy_id` | Each hold refers to zero or one allocated copy; a copy can appear in historical reservations; not multiple concurrent active holds. |

**State conventions:** `Role = Reader | Librarian | Administrator`; `CopyStatus = Available | Borrowed | Reserved | Damaged | Lost`; `ReservationStatus = Pending | Ready | Fulfilled | Cancelled | Expired`. `Overdue` is derived from `dueAt` and `returnedAt` rather than stored as an enum. The actual Q1 database has five tables: `users`, `book_titles`, `book_copies`, `loans`, `reservations`.

**PA2 business rules preserved:** Maximum 3 active Loans (BR-01), 14-day checkout (BR-02), one eligible renewal (BR-03), overdue restrictions (BR-04), zero Available copies required for Reservation (BR-05), maximum 2 active Reservations (BR-06), FIFO (BR-07), 72-hour Pickup Window (BR-08), referential/deletion safety (BR-09), role separation (BR-10).

## 4.2 Class Diagram — Initial Design Draft

The diagram below is a **draft class-level decomposition** for PA3, not a claim that corresponding database tables or JavaScript classes already exist. The actual Prisma entity models remain those in Q1.

```mermaid
classDiagram
  namespace auth {
    class User {
      +UUID id
      +String username
      +String email
      +Role role
      +Boolean isActive
    }
    class AuthService {
      +login(credentials)
      +verifyJwt(token)
      +requireRole(role)
    }
  }
  namespace catalog {
    class BookTitle {
      +UUID id
      +String isbn
      +String title
      +String author
      +Number publicationYear
    }
    class BookCopy {
      +UUID id
      +UUID titleId
      +String barcode
      +CopyStatus status
      +String shelfLocation
    }
    class CatalogService {
      +search(filters)
      +getDetails(titleId)
      +updateBookTitle(titleId, patch)
    }
  }
  namespace circulation {
    class Loan {
      +UUID id
      +UUID readerId
      +UUID copyId
      +Date checkedOutAt
      +Date dueAt
      +Date returnedAt
      +Date renewedAt
    }
    class LoansController {
      +checkout(req, res, next)
      +returnBook(req, res, next)
      +renew(req, res, next)
      +listOverdue(req, res, next)
    }
    class LoanService {
      +checkout(readerId, barcode)
      +returnBook(barcode, conditionNotes)
      +renewLoan(loanId, actor)
      +listOverdue()
    }
  }
  namespace reservation {
    class Reservation {
      +UUID id
      +UUID readerId
      +UUID titleId
      +UUID heldCopyId
      +ReservationStatus status
    }
    class ReservationService {
      +placeReservation(readerId, titleId)
      +allocateNextHold(tx, titleId, copyId, now)
      +fulfillHeldReservation(tx, readerId, copyId, now)
    }
  }
  User "1" --> "0..*" Loan : borrows
  User "1" --> "0..*" Reservation : places
  BookTitle "1" --> "0..*" BookCopy : owns
  BookTitle "1" --> "0..*" Reservation : requested
  BookCopy "1" --> "0..*" Loan : history
  BookCopy "0..1" --> "0..*" Reservation : allocated
  CatalogService ..> BookTitle
  CatalogService ..> BookCopy
  LoansController ..> AuthService
  LoansController ..> LoanService
  LoanService ..> Loan
  LoanService ..> BookCopy
  LoanService ..> User
  LoanService ..> ReservationService
  ReservationService ..> Reservation
  AuthService ..> User
```

**Boundary between components:** React/Vite calls the HTTP API using `client.js` and `endpoints.js`; Express controllers and services own authentication, authorisation, transactions and business rule enforcement. The browser does not query Prisma or PostgreSQL directly. `ReservationService.allocateNextHold()` and `fulfillHeldReservation()` are backend responsibilities; the frontend only consumes corresponding API outcomes.

### Mapping to Q1 ERD

| Design concept | Q1 table | Important mapping |
|---|---|---|
| User + three roles | `users` | `id`, `role`, `is_active`; one user table |
| BookTitle | `book_titles` | `isbn`, `publication_year`, `is_active` |
| BookCopy | `book_copies` | `title_id`, `barcode`, `shelf_location`, `status` |
| Loan | `loans` | `reader_id`, `copy_id`, `checked_out_at`, `due_at`, `returned_at`, `renewed_at` |
| Reservation | `reservations` | `reader_id`, `title_id`, `held_copy_id`, `ready_at`, `expires_at`, status |

### Review dependencies and unresolved decisions

- [ ] Quân to approve exact ERD relationship notation and diagram multiplicities, especially historic `heldCopyId` relationships.
- [ ] Vinh to confirm F01/F05/F07 endpoint paths and response envelopes before production API mode.
- [ ] Confirm `AGENTS.md` and `.github/copilot-instructions.md` code conventions in current repository.
- [ ] Integrate class operations with the final PA3 sequence diagrams and 6–8 class specifications.

**N1 scope note:** Section 4.3 class specifications, 4.4 sequence diagrams and 4.5 state machines are not claimed as completed by this draft.

## 4.3 Class Specifications — N2-W1 Draft

**Status:** Design draft. The entity attributes below are traced to Quân's W1 DBML. A service operation marked **Proposed / verify** is not asserted to exist in the backend; no class method should be presented as implemented until Vinh/Quân review the actual service source. In Prisma, entities are data models rather than necessarily JavaScript classes.

### C1 — User (auth)
**Responsibility:** Represents an account and its single active RBAC role. Reader, Librarian and Administrator are role values in `users.role`, not separate database tables.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| id | UUID | public | PK | Account identity |
| username | String | public | UNIQUE, required | Sign-in name |
| email | String | public | UNIQUE, required | Contact address |
| fullName | String | public | Required | Account display name |
| passwordHash | String | private | Required | Server-only bcrypt hash, never exposed in client mock |
| role | Role | public | Reader / Librarian / Administrator | Authorized role |
| isActive | Boolean | public | Required | Account lifecycle flag |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| createUser | userData → User | service-side | Proposed / verify with Vinh's F01 service; admin workflow UC-02 |
| updateUser | userId, patch → User | service-side | Proposed / verify; role/active updates only for Administrator |

### C2 — BookTitle (catalog)
**Responsibility:** Holds bibliographic metadata and aggregates availability of Book Copies.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| id | UUID | public | PK | Title identifier |
| isbn | String | public | UNIQUE, required | Published work identifier |
| title | String | public | Required | Work title |
| author | String | public | Required | Author(s), one string in Q1 schema |
| category | String | public | Required | Category |
| publisher | String? | public | Optional | Publisher |
| publicationYear | Integer | public | Required | Publication year |
| isActive | Boolean | public | Required | Catalog availability flag |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| createTitle | metadata → BookDetail | service-side | Proposed / verify with Quân; implemented external REST contract: POST /api/books |
| updateTitle | titleId, patch → BookDetail | service-side | Proposed / verify; REST: PATCH /api/books/:id |
| deactivateTitle | titleId → BookDetail | service-side | Proposed / verify; REST DELETE /api/books/:id enforces BR-09 |

### C3 — BookCopy (catalog)
**Responsibility:** Represents one physical unit and its inventory lifecycle.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| id | UUID | public | PK | Copy identifier |
| titleId | UUID | public | FK, required | Parent BookTitle |
| barcode | String | public | UNIQUE, required | Virtual/manual copy ID (not RFID scanner) |
| shelfLocation | String | public | Required | Physical shelf |
| conditionNotes | String? | public | Optional | Physical condition |
| status | CopyStatus | public | Available, Borrowed, Reserved, Damaged, Lost | Lifecycle |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| registerCopy | titleId, copyData → Copy | service-side | Proposed / verify; REST: POST /api/books/:id/copies |
| updateCopy | copyId, patch → Copy | service-side | Proposed / verify; REST: PATCH /api/copies/:id |
| decommissionCopy | copyId → void | service-side | Proposed / verify; REST: DELETE /api/copies/:id with BR-09 checks |

### C4 — Loan (circulation)
**Responsibility:** Stores a Reader's checkout and eventual return of one physical Book Copy. Overdue is computed dynamically from `dueAt`, `returnedAt` and current time.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| id | UUID | public | PK | Loan identifier |
| readerId | UUID | public | FK → User | Borrower |
| copyId | UUID | public | FK → BookCopy | Circulating copy |
| checkedOutAt | DateTime | public | Required | Checkout timestamp |
| dueAt | DateTime | public | Required | 14-day due date |
| returnedAt | DateTime? | public | Optional | Return completion |
| renewedAt | DateTime? | public | Optional | One-time renewal record |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| isOverdue | now → Boolean | derived | Design computation: returnedAt is null and dueAt precedes current date/time; verify calendar-day semantics against BR-04 |

### C5 — Reservation (reservation)
**Responsibility:** Captures a Reader's title-level FIFO hold and optional allocated physical copy.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| id | UUID | public | PK | Hold identifier |
| readerId | UUID | public | FK → User | Requesting Reader |
| titleId | UUID | public | FK → BookTitle | Requested title |
| heldCopyId | UUID? | public | Nullable FK → BookCopy | Allocated copy, if Ready |
| status | ReservationStatus | public | Pending/Ready/Fulfilled/Cancelled/Expired | Reservation state |
| createdAt | DateTime | public | Required | FIFO ordering, tie-break by ID |
| readyAt | DateTime? | public | Optional | Allocation time |
| expiresAt | DateTime? | public | Optional | Ready window ends 72 h later |
| fulfilledAt | DateTime? | public | Optional | Hold checkout time |
| cancelledAt | DateTime? | public | Optional | Cancellation time |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| queuePosition | reservations → Integer | derived | Pending position is 1-based; Ready/history = 0 (confirmed API contract) |

### C6 — AuthService (auth)
**Responsibility:** Authenticates users and enforces JWT/RBAC for protected API operations.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| jwtSecret | String | private | Backend environment only | Never exposed in SPA |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| login | credentials → JWT/session | service | Proposed / verify with Vinh's F01 code |
| verifyJwt | token → claims | service | Proposed / verify: `sub` + `role` claims (confirmed contract) |
| requireRole | user, role → authorization result | service | Proposed / verify; missing JWT 401, forbidden role 403 |

### C7 — LoanService & LoansController (circulation)
**Responsibility:** Executes checkout, return, and renewal under BR-01 through BR-04, coordinating allocated holds atomically via transaction injection (`tx`) without circular dependency with `ReservationService`.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| prisma | PrismaClient | private | Transaction + `SELECT ... FOR UPDATE` | Server-owned ACID data persistence |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| LoansController.checkout | req, res, next → 201 JSON | public | Verified in `src/modules/loans/loans.controller.js`; HTTP POST `/api/loans/checkout` |
| LoansController.returnBook | req, res, next → 200 JSON | public | Verified in `src/modules/loans/loans.controller.js`; HTTP POST `/api/loans/return` |
| LoansController.renew | req, res, next → 200 JSON | public | Verified in `src/modules/loans/loans.controller.js`; HTTP POST `/api/loans/:id/renew` |
| LoansController.listOverdue | req, res, next → 200 JSON | public | Verified in `src/modules/loans/loans.controller.js`; HTTP GET `/api/loans/overdue` |
| LoanService.checkout | readerId, barcode → Loan | public | Verified in `src/modules/loans/loans.service.js`; locks User → BookTitle → BookCopy, enforces BR-01/02/04 and FR-F06-06 |
| LoanService.returnBook | barcode, conditionNotes → ReturnResult | public | Verified in `src/modules/loans/loans.service.js`; closes loan and calls `ReservationService.allocateNextHold(tx, ...)` |
| LoanService.renewLoan | loanId, actor → Loan | public | Verified in `src/modules/loans/loans.service.js`; enforces BR-03 (max 1 renewal, not overdue, no pending holds) |
| LoanService.listOverdue | now → {items, total} | public | Verified in `src/modules/loans/loans.service.js`; FR-F05-07 / FR-F07-03 |

### C8 — ReservationService (reservation)
**Responsibility:** Maintains FIFO reservations and ensures allocation/fulfillment in safe database transactions.

| Attribute | Type | Visibility | Constraint | Description |
|---|---|---|---|---|
| prisma | PrismaClient | private | Transaction-aware | PostgreSQL 16 / Prisma integration |

| Operation | Parameters / Return | Visibility | Description / verification |
|---|---|---|---|
| placeReservation | readerId, titleId → reservation,queuePosition | public | Verified in `services/reservations.js` |
| allocateNextHold | tx, titleId, copyId, now → allocation | public | **Confirmed named integration export** in `services/reservations.js` |
| fulfillHeldReservation | tx, readerId, copyId, now → fulfillment | public | **Confirmed named integration export** in `services/reservations.js` |

### 4.3.9 Traceability and Review Notes

| Screen | Use Case | Primary entities/services | Verified contract |
|---|---|---|---|
| SCR-02 | UC-02 | User, AuthService | F01 endpoints **provisional until Vinh confirmation** |
| SCR-03 | UC-03 | BookTitle, BookCopy | POST/PATCH/DELETE /api/books (Quân confirmed) |
| SCR-04 | UC-04 | BookCopy | GET/POST /api/books/:id/copies; PATCH/DELETE /api/copies/:id (Quân confirmed) |

**Design caveats:** F01 `api.users.*` is provisional in the N1 API adapter. The UI's Authors field maps to the Q1 schema's single `author` string (not a separate authors table). The physical scanner remains out of scope. Account password management, status transition enforcement and atomic circulation decisions remain on the backend. Exact backend method names in C1–C7 require review of source before final baseline.

## 4.4 Sequence Diagrams

### 4.4.1 UC-01 Login (N3-W1)

- Diagram source: `docs/design/uml/seq-uc01.mmd`.
- Export: `docs/design/uml/seq-uc01.png`.
- Participants: User, SCR-01 Login UI, AuthController, AuthService, Prisma/PostgreSQL.
- Main flow: credentials -> authentication -> JWT -> role-specific landing.
- Alternative flows: incorrect password and inactive account.
- F01 verified in V2-W1 (`POST /api/auth/login`, `GET /api/auth/me`): JWT claims `sub` and `role`; authorization is verified against the persisted User record per request. No password hash is returned to frontend.

### 4.4.2 UC-07 Borrow Book (Checkout) — V3-W1

- Diagram source: [seq-uc07.puml](../design/uml/seq-uc07.puml)
- Exported image: [seq-uc07.png](../design/uml/seq-uc07.png)

![UC-07 Borrow Sequence Diagram](../design/uml/seq-uc07.png)

- **Main flow:** Authenticated Librarian submits `{readerId, barcode}` → `LoansController.checkout()` verifies JWT & `Librarian` role via `AuthService` → `LoanService.checkout()` opens a PostgreSQL transaction and locks rows in canonical order (`User` → `BookTitle` → `BookCopy` via `SELECT ... FOR UPDATE`), verifies active Reader, `< 3` active loans (BR-01), `0` overdue loans (BR-04), sets `dueAt = now + 14 days` (BR-02), inserts `Loan`, updates `BookCopy.status = Borrowed`, and commits.
- **Alt 1 — Reader không đủ điều kiện (BR-01 / BR-04 / Inactive):** Transaction rolls back with HTTP `422` (`READER_INACTIVE`, `LOAN_LIMIT_EXCEEDED`, or `READER_OVERDUE`); no loan or copy change is persisted.
- **Alt 2 / Opt — Copy đang `Reserved` (FR-F06-06):** `LoanService` passes `tx` to `ReservationService.fulfillHeldReservation(tx, readerId, copyId, now)` inside the same transaction. Matching active hold transitions to `Fulfilled`; wrong reader or expired hold rolls back with HTTP `409`.

### 4.4.3 UC-08 Return Book (Check-in) — V3-W1

- Diagram source: [seq-uc08.puml](../design/uml/seq-uc08.puml)
- Exported image: [seq-uc08.png](../design/uml/seq-uc08.png)

![UC-08 Return Sequence Diagram](../design/uml/seq-uc08.png)

- **Main flow (no waiting queue):** Authenticated Librarian submits `{barcode, conditionNotes}` → `LoansController.returnBook()` verifies JWT & `Librarian` role → `LoanService.returnBook()` locks `BookTitle` → `BookCopy` → `Loan` via `SELECT ... FOR UPDATE`, sets `Loan.returnedAt = now`, calls `ReservationService.allocateNextHold(tx, titleId, copyId, now)`, restores `BookCopy.status = Available`, and commits.
- **Alt — Có hàng chờ Pending (BR-07, BR-08):** `allocateNextHold` selects the earliest `Pending` reservation (`ORDER BY createdAt ASC, id ASC`), updates it to `Ready` with `heldCopyId = copyId` and `expiresAt = now + 72 hours`, and transitions `BookCopy.status = Reserved` atomically.

### 4.4.4 Sequence-to-Class Operation Traceability (UC-07 & UC-08)

| Sequence Diagram | Caller → Callee | Message | Class Diagram Operation |
|---|---|---|---|
| UC-07 | UI → `LoansController` | `checkout(req, res, next)` | `LoansController.checkout(req, res, next)` |
| UC-07, UC-08 | `LoansController` → `AuthService` | `verifyJwt(token)` | `AuthService.verifyJwt(token)` |
| UC-07, UC-08 | `AuthService` → `AuthService` | `requireRole("Librarian")` | `AuthService.requireRole(role)` |
| UC-07 | `LoansController` → `LoanService` | `checkout(readerId, barcode)` | `LoanService.checkout(readerId, barcode)` |
| UC-07 | `LoanService` → `ReservationService` | `fulfillHeldReservation(tx, readerId, copyId, now)` | `ReservationService.fulfillHeldReservation(tx, readerId, copyId, now)` |
| UC-08 | UI → `LoansController` | `returnBook(req, res, next)` | `LoansController.returnBook(req, res, next)` |
| UC-08 | `LoansController` → `LoanService` | `returnBook(barcode, conditionNotes)` | `LoanService.returnBook(barcode, conditionNotes)` |
| UC-08 | `LoanService` → `ReservationService` | `allocateNextHold(tx, titleId, copyId, now)` | `ReservationService.allocateNextHold(tx, titleId, copyId, now)` |

## 4.6 Design Principles and Patterns (N3-W1)

| Principle / Pattern | Where in code | Rationale and status |
|---|---|---|
| Layered architecture | `src/client/src/pages/librarian/{Borrow,Return,HoldShelf,Overdue}.jsx` -> `src/client/src/api/endpoints.js` -> `src/client/src/api/client.js` -> Express route/service -> Prisma | Pages render results; backend owns domain changes. Confirmed Q2 architectural style. |
| Repository / Data Mapper (Prisma) | `src/server/prisma/schema.prisma`; Prisma Client used by server services | Encapsulates database operations behind service layer; details of implementation require source review. |
| Service layer | `src/server/services/reservations.js` (`allocateNextHold`, `fulfillHeldReservation` confirmed integration names); Vinh-owned F05 circulation service | Keeps BR-01/02/04/07/08 state changes transactional; F05 exact method names require verification. |
| Middleware chain | `src/server/middleware/auth.js` (temporary) and Express route chain | Authentication 401 and RBAC 403 separated; replace temporary adapter with Vinh's authoritative F01. |
| Strategy (design proposal) | `[TBD: locate actual borrowing policy strategy module]`; future policy helper inside LoanService, **not implemented by N3** | Could separate policy evaluation without expanding F01–F07. Do not claim an implemented Strategy class. |
| Observer / Scheduler (timer polling, not GoF Observer) | Quân's W1 60-second reservation expiry process in API; `[TBD: exact file path]` | Expires Ready holds after 72h. Timer polling is scheduler logic, not proof of a GoF Observer implementation. |
| UI adapter / error mapping | `src/client/src/pages/librarian/circulationUtils.js`, `src/client/src/api/client.js` | Converts standardized `{error:{code,message}}` into actionable BR-specific messages. |

**Status / risks:** F05 and F07 frontend paths are provisional. SCR-10 is a functional mock design draft awaiting Ánh's approval, not approved Figma. Browser-only availability/eligibility previews are advisory; backend revalidates in a transaction. Copy lookup by enumerating catalog copies is suitable only for W1 mock demonstrations and must be replaced with an agreed barcode lookup API before live use. No SMS/email integration is included.
