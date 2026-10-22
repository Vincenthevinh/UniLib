# UniLib — Software Requirements Specification (SRS)
## Master ID Registry & Traceability Baseline (Frozen)

* **Project:** UniLib – University Library Management System
* **Phase:** PA2 — Software Requirements Specification
* **Baseline Version:** 1.0.0-frozen
* **Freeze Date:** Friday, October 23, 2026 · 21:00 ICT
* **Governance / Authority:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)
* **Change Policy:** After freeze, any ID modification or addition requires formal PM Change Request (CR) sign-off and must be recorded in the Changelog (§8).

---

## 1. Naming & Numbering Conventions

| Prefix | Category | Format | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| **F** | Feature Module | `F0x` | High-level functional modules approved in PA0/PA1 | `F01`, `F05` |
| **FR** | Functional Requirement | `FR-F0x-nn` | Individual verifiable functional requirement scoped by feature `F0x` | `FR-F01-01`, `FR-F05-04` |
| **NFR** | Non-Functional Requirement | `NFR-nn` | Verifiable quality attribute, performance metric, or architectural constraint | `NFR-01`, `NFR-05` |
| **BR** | Business Rule | `BR-nn` | Domain constraint, circulation policy, or administrative library rule | `BR-01`, `BR-08` |
| **UC** | Use Case | `UC-nn` | End-to-end user goal or system workflow specification | `UC-01`, `UC-07` |
| **SCR** | User Interface Screen | `SCR-nn` | Wireframe, mockup, or UI view corresponding to use cases | `SCR-01`, `SCR-07` |
| **AC** | Acceptance Criteria | `AC-F0x-nn` | Testable Given-When-Then acceptance condition mapped to feature `F0x` | `AC-F01-01`, `AC-F05-02` |

---

## 2. Feature Inventory (F01–F07)

| Feature ID | Feature Name | Priority | Scope Summary | Section Owner | Peer Reviewer |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **F01** | User Authentication & Role-Based Access Control | **Must** | Credential login, JWT session management, logout, RBAC for Reader, Librarian, and Administrator actors. | Nguyên (BA) | Quân (Dev) |
| **F02** | Book Catalog Management | **Must** | Catalog CRUD for book titles, metadata (ISBN, title, author, category, year), copy availability aggregation. | Nguyên (BA) | Quân (Dev) |
| **F03** | Book Copy Inventory Management | **Must** | Physical copy inventory tracking, unique copy/barcode IDs, shelf location, copy status transitions. | Nguyên (BA) | Quân (Dev) |
| **F04** | Book Search & Browse | **Must** | Keyword search across multi-attributes, category/year filtering, paginated browsing, real-time availability display. | Nguyên (BA) | Ánh (Designer) |
| **F05** | Borrow & Return Management (Circulation Desk) | **Must** | Loan checkout, due date assignment (14 days), return check-in, condition check, hold queue routing, loan renewal. | Nguyên (BA) | Vinh (Tester) |
| **F06** | Book Reservation (Hold Processing) | **Must** | Title-level reservation when 0 copies available, FIFO queue, hold shelf transition (72h pickup window), expiry/cancellation. | Nguyên (BA) | Vinh (Tester) |
| **F07** | Reader Overdue & Loan Monitoring Dashboard | **Should** | Reader self-service active loans/reservations dashboard, overdue notifications, Librarian overdue tracking desk. | Nguyên (BA) | Ánh (Designer) |

*Note: F01–F06 are mandatory Must-have features required for PA5 implementation. F07 is a prioritized Should-have feature.*

---

## 3. Functional Requirements Registry (FR-F0x-nn)

### Feature F01: User Authentication & Role-Based Access Control
* **`FR-F01-01`**: The system shall authenticate users using username/email and password credentials.
* **`FR-F01-02`**: The system shall generate a secure JSON Web Token (JWT) upon successful authentication and enforce role-based access control (RBAC) across Reader, Librarian, and Administrator endpoints.
* **`FR-F01-03`**: The system shall allow authenticated users to securely log out, invalidating the client-side session token.
* **`FR-F01-04`**: The system shall provide Administrator capabilities to create user accounts, assign user roles, and deactivate compromised or inactive accounts.

### Feature F02: Book Catalog Management
* **`FR-F02-01`**: The system shall allow Librarians to create new book title entries with metadata: ISBN (unique), Title, Author(s), Category, Publisher, and Publication Year.
* **`FR-F02-02`**: The system shall allow Librarians to edit metadata of existing book titles.
* **`FR-F02-03`**: The system shall allow Librarians to deactivate/delete a book title only if no physical copies, active loans, or pending reservations are linked to it.
* **`FR-F02-04`**: The system shall calculate and display aggregated copy statistics (Total Copies, Available Copies, Borrowed Copies, Reserved Copies) on the book title detail view.

### Feature F03: Book Copy Inventory Management
* **`FR-F03-01`**: The system shall allow Librarians to register physical copies for an existing book title, assigning each a unique Barcode / Copy ID and Shelf Location.
* **`FR-F03-02`**: The system shall allow Librarians to update physical copy metadata (Shelf Location, physical condition notes).
* **`FR-F03-03`**: The system shall maintain and transition the lifecycle state of each physical copy: `Available`, `Borrowed`, `Reserved`, and `Damaged`/`Lost`.
* **`FR-F03-04`**: The system shall allow Librarians to decommission a physical copy only when its current status is `Available` or `Damaged`/`Lost` (blocking deletion of `Borrowed` or `Reserved` copies).

### Feature F04: Book Search & Browse
* **`FR-F04-01`**: The system shall allow all users to execute keyword searches across Book Title, Author, Category, and ISBN.
* **`FR-F04-02`**: The system shall allow users to filter search results by Category, Availability Status (`Available Now` vs `All`), and sort results by Title or Publication Year.
* **`FR-F04-03`**: The system shall display real-time physical copy availability counters and shelf locations on both search result cards and detailed book view.
* **`FR-F04-04`**: The system shall support server-side paginated browsing of the catalog with a configurable page size (default 10 items/page).

### Feature F05: Borrow & Return Management (Circulation Desk)
* **`FR-F05-01`**: The system shall allow Librarians to issue a book loan (checkout) by specifying an active Reader ID and an `Available` Copy ID.
* **`FR-F05-02`**: The system shall validate borrowing eligibility before checkout: Reader must have active account status, fewer than 3 active loans (`BR-01`), and zero overdue loans (`BR-04`).
* **`FR-F05-03`**: The system shall automatically compute the loan due date exactly 14 calendar days from the checkout date (`BR-02`) and transition the copy status to `Borrowed`.
* **`FR-F05-04`**: The system shall allow Librarians to process a book return (check-in) by scanning/entering the Copy ID, recording the return timestamp and updating the loan status to `Returned`.
* **`FR-F05-05`**: Upon return processing, the system shall evaluate whether pending reservations exist for the book title; if so, transition the copy status to `Reserved` for the first reader in the FIFO queue; otherwise transition copy status to `Available`.
* **`FR-F05-06`**: The system shall allow loan renewal, extending the loan duration by an additional 14 days exactly once, provided the loan is not overdue and no reservations are pending for the title (`BR-03`).
* **`FR-F05-07`**: The system shall automatically detect and flag overdue loans when current calendar date exceeds the designated due date.

### Feature F06: Book Reservation (Hold Processing)
* **`FR-F06-01`**: The system shall allow an eligible Reader to place a reservation for a book title when exactly zero copies of that title are in `Available` status (`BR-05`).
* **`FR-F06-02`**: The system shall enforce reservation constraints: Reader cannot exceed 2 active reservations (`BR-06`) and cannot reserve a title they currently have checked out on an active loan.
* **`FR-F06-03`**: The system shall maintain an automated First-In, First-Out (FIFO) queue for reservations per book title (`BR-07`).
* **`FR-F06-04`**: When an item transitions to `Reserved`, the system shall set a pickup window deadline of 72 hours (3 calendar days) for the holding reader (`BR-08`).
* **`FR-F06-05`**: The system shall allow Readers to cancel their pending reservations, and shall automatically expire reservations uncollected after 72 hours, advancing the hold to the next reader in queue or releasing the copy to `Available`.
* **`FR-F06-06`**: The system shall fulfill the reservation when the designated reader checks out the held copy at the circulation desk, completing the hold lifecycle.

### Feature F07: Reader Overdue & Loan Monitoring Dashboard
* **`FR-F07-01`**: The system shall provide Readers a dedicated dashboard displaying their active loans, due dates, renewal actions, active reservations, and queue positions.
* **`FR-F07-02`**: The system shall display prominent visual overdue alerts and borrowing restriction notices on the Reader dashboard.
* **`FR-F07-03`**: The system shall provide Librarians an overdue monitoring console listing all overdue loans, days overdue, patron contact details, and item details.

---

## 4. Non-Functional Requirements Registry (NFR-nn)

| NFR ID | Category | Measurable Requirement & Conditions | Verification Method |
| :--- | :--- | :--- | :--- |
| **`NFR-01`** | Performance (Search) | Under a load of 100 concurrent simulated users, catalog search queries shall return response payloads in ≤ 1.0 second at P95 across 10,000 seeded book records. | Automated Load Test (k6 / Artillery) |
| **`NFR-02`** | Performance (Page Load) | Initial application load time shall achieve Largest Contentful Paint (LCP) ≤ 2.5 seconds at P90 on standard broadband / 4G network profiles. | Lighthouse Performance Audit |
| **`NFR-03`** | Security (Password Hashing) | User passwords shall be hashed using bcrypt with salt rounds ≥ 10 prior to database persistence; plain-text credentials shall never be logged or transmitted in response payloads. | Code Review & Unit Test Inspection |
| **`NFR-04`** | Security (Authorization) | All protected REST API endpoints shall validate JWT claims; unauthenticated requests shall return HTTP 401 Unauthorized; unauthorized roles shall return HTTP 403 Forbidden. | Automated API Integration Tests (Jest + Supertest) |
| **`NFR-05`** | Data Integrity (Concurrency) | Circulation state transitions (checkout, check-in, hold allocation) shall execute within atomic database transactions with row-level locks (`SELECT FOR UPDATE`), guaranteeing 0 race conditions or duplicate loan/hold states under concurrent requests. | Concurrency Integration Test Script |
| **`NFR-06`** | Usability & Accessibility | The user interface shall achieve a Google Lighthouse Accessibility score of ≥ 85, maintain a minimum color contrast ratio of 4.5:1 for normal text, and support full keyboard navigation across form controls. | Lighthouse Accessibility Audit & Manual Keyboard Walkthrough |
| **`NFR-07`** | Compatibility | The web application shall render correctly and maintain responsive layout integrity across modern evergreen desktop browsers (Chrome 120+, Firefox 120+, Edge 120+, Safari 17+) on viewport widths from 1024px to 1920px. | Cross-browser Verification & Responsive Emulation |
| **`NFR-08`** | Reliability & Graceful Error Handling | In the event of network failure or backend service unavailability, the frontend application shall display user-friendly error banners without crashing, and system shall support full database schema restoration via seed scripts in < 5 minutes. | Fault Injection Test & Recovery Run |

---

## 5. Business Rules Registry (BR-nn)

| Rule ID | Rule Title | Detailed Policy & Operational Constraint | Source / Authority |
| :--- | :--- | :--- | :--- |
| **`BR-01`** | Maximum Active Loan Limit | A Reader is strictly limited to a maximum of **3 concurrently active (unreturned) book loans** across the entire library system. | Library Circulation Policy §2.1 (Confirmed Kickoff 23/10) |
| **`BR-02`** | Standard Loan Period | The default borrowing duration is **14 calendar days** from the checkout timestamp. The return due date is calculated automatically at checkout. | Academic Calendar & Loan Rules §3.2 (Confirmed Kickoff 23/10) |
| **`BR-03`** | Loan Renewal Policy | A loan may be renewed **exactly once for an additional 14 calendar days**, provided that: (a) the loan is not currently overdue, and (b) there are zero pending reservations on that book title. | Circulation Renewal Policy §3.4 |
| **`BR-04`** | Overdue Borrowing Suspension | Any Reader possessing **at least one overdue loan** is immediately blocked from checking out additional copies and cannot place new reservations until all overdue items are returned. | Circulation Sanction Rule §4.1 |
| **`BR-05`** | Reservation Eligibility | A Reader may place a reservation for a book title if and only if **zero physical copies of that title are currently in `Available` status** (all copies are either `Borrowed` or `Reserved`), and the reader does not already hold an active loan of the title. | Reservation Policy §5.1 |
| **`BR-06`** | Maximum Active Reservations | A Reader may hold a maximum of **2 active reservations** concurrently across the system. | Reservation Policy §5.2 |
| **`BR-07`** | Reservation Priority Order | Book reservations are queued and processed in strict **First-In, First-Out (FIFO)** chronological sequence based on the reservation creation timestamp. | Reservation Queue Protocol §5.3 |
| **`BR-08`** | Reservation Hold Pickup Window | When a returned copy is routed to fulfill a reservation, it is placed on the hold shelf with status `Reserved` for **exactly 3 calendar days (72 hours)**. If uncollected after 72 hours, the reservation automatically expires, and the copy is transferred to the next queued patron or restored to `Available`. | Hold Policy §5.4 (Confirmed Kickoff 23/10) |
| **`BR-09`** | Deletion Referential Integrity | A book title cannot be deleted if physical copies exist in the inventory. A physical copy cannot be removed or decommissioned if its current status is `Borrowed` or `Reserved`. | Database Integrity Standard & Catalog Policy §6.1 |
| **`BR-10`** | Separation of Roles | Readers have read-only access to catalog data and personal records; only Librarians may perform circulation desk checkout/check-in operations; only Administrators may manage staff credentials. | Security Access Policy §1.3 |

---

## 6. Use Cases & Screen Registry (UC-01…UC-12 & SCR-01…SCR-12)

### 6.1 Use Cases Inventory (UC-01…UC-12)

| UC ID | Use Case Name | Primary Actor | Priority | Related FRs | Primary Screen | Specification Owner |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **`UC-01`** | Log In & Manage Session | Reader, Librarian, Admin | **Must\*** | `FR-F01-01`, `FR-F01-02`, `FR-F01-03` | `SCR-01` | Nguyên (BA) |
| **`UC-02`** | Manage User Accounts | Administrator | **Must** | `FR-F01-04` | `SCR-02` | Nguyên (BA) |
| **`UC-03`** | Manage Book Catalog (CRUD Titles) | Librarian | **Must\*** | `FR-F02-01`, `FR-F02-02`, `FR-F02-03`, `FR-F02-04` | `SCR-03` | Nguyên (BA) |
| **`UC-04`** | Manage Book Copies & Inventory | Librarian | **Must** | `FR-F03-01`, `FR-F03-02`, `FR-F03-03`, `FR-F03-04` | `SCR-04` | Nguyên (BA) |
| **`UC-05`** | Search & Browse Book Catalog | Reader, Librarian | **Must\*** | `FR-F04-01`, `FR-F04-02`, `FR-F04-03`, `FR-F04-04` | `SCR-05` | Nguyên (BA) |
| **`UC-06`** | View Book Details & Copy Availability | Reader, Librarian | **Must** | `FR-F04-03`, `FR-F02-04` | `SCR-06` | Nguyên (BA) |
| **`UC-07`** | Borrow Book (Circulation Checkout) | Librarian | **Must\*** | `FR-F05-01`, `FR-F05-02`, `FR-F05-03` | `SCR-07` | Nguyên (BA) |
| **`UC-08`** | Return Book (Circulation Check-in) | Librarian | **Must\*** | `FR-F05-04`, `FR-F05-05` | `SCR-08` | Nguyên (BA) |
| **`UC-09`** | Renew Book Loan | Reader, Librarian | **Must** | `FR-F05-06`, `BR-03` | `SCR-11`, `SCR-07` | Nguyên (BA) |
| **`UC-10`** | Reserve Book Title (Place Hold) | Reader | **Must\*** | `FR-F06-01`, `FR-F06-02`, `FR-F06-03` | `SCR-09`, `SCR-06` | Nguyên (BA) |
| **`UC-11`** | Cancel Reservation & Process Expiry | Reader, System / Librarian | **Must** | `FR-F06-04`, `FR-F06-05`, `BR-08` | `SCR-10`, `SCR-11` | Nguyên (BA) |
| **`UC-12`** | View Reader Dashboard & Overdue Desk | Reader, Librarian | **Should** | `FR-F07-01`, `FR-F07-02`, `FR-F07-03` | `SCR-11`, `SCR-12` | Nguyên (BA) |

*\* Denotes the 6 core Must-have Use Cases selected for complete step-by-step flow specifications in PA2 Section 7 (UC-01, UC-03, UC-05, UC-07, UC-08, UC-10).*

### 6.2 Screens Inventory (SCR-01…SCR-12)

| Screen ID | Screen Name | Target Actor | Description & Core UI Elements | Related Use Cases | Wireframe Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SCR-01`** | Authentication & Login Screen | All Users | Username/email and password inputs, role-based landing redirect, error alert banners. | `UC-01` | Ánh (Designer) |
| **`SCR-02`** | Administrator User Management Screen | Admin | User account table, role filter, create user modal, account status toggles (`Active`/`Inactive`). | `UC-02` | Ánh (Designer) |
| **`SCR-03`** | Librarian Book Catalog Management Screen | Librarian | Catalog data table, search/filter bar, Add/Edit Book Title modals, copy count badges, delete actions. | `UC-03` | Ánh (Designer) |
| **`SCR-04`** | Book Copy Inventory Management Screen | Librarian | Copy list per title, barcode generator/input, shelf location field, status selector (`Available`/`Damaged`). | `UC-04` | Ánh (Designer) |
| **`SCR-05`** | Catalog Search & Browse Screen | Reader, Librarian | Prominent search bar, category dropdown, availability filter chips, responsive book result cards. | `UC-05` | Ánh (Designer) |
| **`SCR-06`** | Book Title Detail & Availability Screen | Reader, Librarian | Complete book metadata, copy inventory status table (shelf, status), conditional "Reserve Book" button. | `UC-06`, `UC-10` | Ánh (Designer) |
| **`SCR-07`** | Circulation Desk — Borrow (Checkout) Screen | Librarian | Reader lookup with eligibility badge (loans/overdue count), copy barcode input, loan confirmation modal. | `UC-07` | Ánh (Designer) |
| **`SCR-08`** | Circulation Desk — Return (Check-in) Screen | Librarian | Copy barcode scanner input, returned loan summary, condition assessment notes, hold routing banner. | `UC-08` | Ánh (Designer) |
| **`SCR-09`** | Book Reservation Modal / Confirmation View | Reader | Hold confirmation prompt, queue position estimate, notification disclaimer (in-app status). | `UC-10` | Ánh (Designer) |
| **`SCR-10`** | Librarian Hold Shelf & Reservation Queue Screen | Librarian | Active reservation queue list, FIFO order badges, hold expiry countdown timers, pickup fulfillment button. | `UC-10`, `UC-11` | Ánh (Designer) |
| **`SCR-11`** | Reader Personal Dashboard Screen | Reader | Active borrowings table with due-date progress bars, "Renew" action button, active reservations tab. | `UC-09`, `UC-11`, `UC-12` | Ánh (Designer) |
| **`SCR-12`** | Librarian Overdue & Circulation Monitoring Screen | Librarian | Overdue patrons table, days-overdue badges, reader contact details, export/filter by days late. | `UC-12` | Ánh (Designer) |

---

## 7. Acceptance Criteria Registry (AC-F0x-nn)

| AC ID | Target Feature | Scenario / Acceptance Test Condition (Given / When / Then) | Related FR / BR |
| :--- | :---: | :--- | :--- |
| **`AC-F01-01`** | F01 | **Given** a registered user with valid credentials, **When** they submit login credentials, **Then** the system authenticates the user, returns a valid JWT, and navigates to the role-specific landing page. | `FR-F01-01`, `FR-F01-02` |
| **`AC-F01-02`** | F01 | **Given** invalid or mismatched credentials, **When** the user attempts to log in, **Then** the system displays a descriptive error message and prevents session creation. | `FR-F01-01` |
| **`AC-F01-03`** | F01 | **Given** an authenticated user with `Reader` role, **When** they attempt to access `/admin/users` or staff circulation endpoints, **Then** the system denies access returning HTTP 403 Forbidden. | `FR-F01-02`, `NFR-04` |
| **`AC-F02-01`** | F02 | **Given** unique ISBN and complete metadata, **When** a Librarian creates a new book title, **Then** the record is successfully saved in the catalog and appears in search results. | `FR-F02-01` |
| **`AC-F02-02`** | F02 | **Given** an existing ISBN in the catalog, **When** a Librarian attempts to create another title with that ISBN, **Then** the system rejects the operation with a duplicate ISBN error. | `FR-F02-01` |
| **`AC-F02-03`** | F02 | **Given** a book title with physical copies registered, **When** a Librarian attempts deletion, **Then** the system blocks deletion and instructs removal of copies first (`BR-09`). | `FR-F02-03`, `BR-09` |
| **`AC-F03-01`** | F03 | **Given** a valid book title and unique Barcode ID, **When** a Librarian registers a physical copy, **Then** the copy is initialized with status `Available` and assigned to shelf location. | `FR-F03-01`, `FR-F03-03` |
| **`AC-F03-02`** | F03 | **Given** a physical copy currently marked `Borrowed`, **When** a Librarian attempts deletion, **Then** the deletion is blocked with a state conflict error. | `FR-F03-04`, `BR-09` |
| **`AC-F04-01`** | F04 | **Given** a search query matching a title or author keyword, **When** the user executes the search, **Then** the system returns matching book titles in ≤ 1.0s (`NFR-01`) with real-time available copy counts. | `FR-F04-01`, `NFR-01` |
| **`AC-F04-02`** | F04 | **Given** active catalog filters (e.g. Category = Computer Science), **When** filtered, **Then** only books matching the criteria are rendered. | `FR-F04-02` |
| **`AC-F05-01`** | F05 | **Given** a Reader with < 3 active loans and 0 overdue loans, **When** a Librarian checks out an `Available` copy, **Then** a loan record is created with due date = today + 14 days, and copy status becomes `Borrowed`. | `FR-F05-01`, `FR-F05-03`, `BR-01`, `BR-02` |
| **`AC-F05-02`** | F05 | **Given** a Reader with 3 active loans (`BR-01`) or at least 1 overdue loan (`BR-04`), **When** checkout is initiated, **Then** the system rejects checkout and displays the policy block reason. | `FR-F05-02`, `BR-01`, `BR-04` |
| **`AC-F05-03`** | F05 | **Given** a borrowed copy returned with no pending reservations, **When** check-in is confirmed, **Then** loan status changes to `Returned`, return date is logged, and copy status becomes `Available`. | `FR-F05-04`, `FR-F05-05` |
| **`AC-F05-04`** | F05 | **Given** a returned copy of a book title with pending reservations, **When** check-in is confirmed, **Then** copy transitions to `Reserved` and hold pickup window starts (72h) for the top FIFO reader. | `FR-F05-05`, `BR-08` |
| **`AC-F05-05`** | F05 | **Given** a current active loan that is not overdue and has no title reservations, **When** renewal is requested, **Then** due date is extended by 14 days (maximum 1 renewal). | `FR-F05-06`, `BR-03` |
| **`AC-F06-01`** | F06 | **Given** a book title with 0 `Available` copies, **When** an eligible Reader confirms reservation, **Then** the reservation is recorded at the end of the FIFO queue. | `FR-F06-01`, `BR-05`, `BR-07` |
| **`AC-F06-02`** | F06 | **Given** a book title with ≥ 1 `Available` copy, **When** a Reader attempts to place a reservation, **Then** the system rejects reservation and prompts them to borrow the available copy. | `FR-F06-01`, `BR-05` |
| **`AC-F06-03`** | F06 | **Given** a held copy not collected within 72 hours (`BR-08`), **When** hold expiration is processed, **Then** reservation status changes to `Expired` and copy routes to the next FIFO patron or becomes `Available`. | `FR-F06-04`, `FR-F06-05`, `BR-08` |
| **`AC-F07-01`** | F07 | **Given** a logged-in Reader, **When** viewing their dashboard, **Then** all active loans, due dates, overdue warnings, and active reservation statuses are rendered accurately. | `FR-F07-01`, `FR-F07-02` |
| **`AC-F07-02`** | F07 | **Given** overdue loans in the system, **When** a Librarian views the overdue dashboard, **Then** all overdue loans are sorted by days overdue with reader contact details. | `FR-F07-03` |

---

## 8. Changelog & Governance Log

| Version | Date | Author / PM | Description of Change | Approved By | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **v1.0.0-draft** | 2026-10-22 | Vinh (PM) | Initial registry compilation based on PA0/PA1 scope and team proposal inputs. | Team T05 | Proposed |
| **v1.0.0-frozen** | 2026-10-23 | Vinh (PM) | Formally frozen during Kickoff meeting: F01–F07, 28 FRs, 8 NFRs, 10 BRs, 12 UCs, 12 SCRs, 19 ACs. Loan limit (3) and pickup window (72h) locked. | 4/4 Members (ACK) | **FROZEN** |

### Policy for Proposing Changes Post-Freeze
1. **No direct edits:** Any team member proposing a change to an existing ID or adding a new ID must submit a formal Change Request (CR) on the GitHub repository or Zalo discussion.
2. **Review & Impact Assessment:** PM and the affected section owners review impact on downstream tasks (Use Case specs, wireframes, test plan, DB schema).
3. **PM Sign-off:** Only PM (Vinh) updates `00-id-registry.md` with incremented version (`v1.1.0`), rationale, and date.
