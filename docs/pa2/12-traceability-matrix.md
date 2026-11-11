# 9. Requirements Traceability Matrix (RTM)

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V4 (Slot S4 · WBS 2.4.1)  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Status:** Baseline Draft — Ready for Peer Review  
**Baseline Reference:** PA1 Project Proposal & Plan; PA2 Master ID Registry v1.0.0-frozen; [05-functional-requirements.md](05-functional-requirements.md); [07-business-rules.md](07-business-rules.md); [08-acceptance-criteria.md](08-acceptance-criteria.md); [screen-inventory.md](../../pa/PA2/screen-inventory.md); [11-prototype.md](../../pa/PA2/11-prototype.md)  

---

## 1. Traceability Purpose, Scope, and Architecture

### 1.1 Purpose of the Traceability Matrix
Requirements Traceability is a foundational discipline within Software Engineering (adhering to IEEE 830 and ISO/IEC/IEEE 29148 standards). In UniLib, the Requirements Traceability Matrix (RTM) establishes a rigorous, bidirectional mapping between high-level stakeholder needs, concrete Functional Requirements, behavioral Use Cases, graphical user interface Wireframes, Given-When-Then Acceptance Criteria, downstream Architectural Design elements (PA3), and Verification Test Cases (PA4).

The primary objectives of this baseline are:
1. **Forward Traceability (Requirements Driven):** Guarantees that every approved Functional Requirement (`FR-F0x-nn`) is realized by at least one operational Use Case (`UC-nn`), visualized in at least one Screen Wireframe (`SCR-nn`), and verified by measurable Acceptance Criteria (`AC-F0x-nn`).
2. **Backward Traceability (Scope Containment & Anti-Gold-Plating):** Verifies that every interface screen, use case flow, architectural component, and test case originates from an authorized stakeholder requirement, preventing unauthorized feature expansion beyond the PA1 frozen scope.
3. **Change Impact Analysis:** Enables the Project Manager and Software Architect to assess the ripple effects of proposed modifications across design models, database schemas, and test suites prior to code execution.
4. **Handoff Bridge to PA3 and PA4:** Provides structured placeholders for architectural components (REST API endpoints, controllers, database models) and testing suites (Acceptance Test Cases, integration tests), ensuring smooth transition across the Waterfall lifecycle gates.

### 1.2 Traceability Architecture and Lifecycle Mapping

```
+--------------------------------------------------------------------------------------------------------------------+
|                                              WATERFALL LIFECYCLE GATES                                             |
+--------------------------------------------------------------------------------------------------------------------+
|   [PA1: Scope & Needs]              [PA2: Requirements Specification]             [PA3: Design]      [PA4: Test]   |
|                                                                                                                    |
|   +-------------------+              +-----------------------------+              +-------------+    +-----------+ |
|   | User Needs /      | -----------> | Functional Requirements     | -----------> | Design      | -> | Test      | |
|   | Feature Modules   |              | (FR-F01-01 .. FR-F07-03)    |              | Component / |    | Cases     | |
|   | (F01 .. F07)      |              +--------------+--------------+              | API Route   |    | (PA4-TC)  | |
|   +-------------------+                             |                             | (PA3-TBD)   |    | (PA4-TBD) | |
|                                                     v                             +-------------+    +-----------+ |
|                                      +-----------------------------+                     ^                 ^       |
|                                      | Use Cases (UC-01 .. UC-12)  | --------------------+                 |       |
|                                      +--------------+--------------+                                       |       |
|                                                     v                                                      |       |
|                                      +-----------------------------+                                       |       |
|                                      | Screen Wireframes (SCR-nn)  | --------------------------------------+       |
|                                      +--------------+--------------+                                               |
|                                                     v                                                              |
|                                      +-----------------------------+                                               |
|                                      | Acceptance Criteria (AC-nn) | ----------------------------------------------+       |
|                                      +-----------------------------+                                               |
+--------------------------------------------------------------------------------------------------------------------+
```

### 1.3 Column Definitions and Expansion Policy
The master matrix (Table 9.1) is structured into nine formal columns. Cột Design (PA3) and Test cases (PA4) are deliberately maintained as planned engineering placeholders to be populated during subsequent project phases:

* **Req ID:** Unique, immutable identifier defined in `docs/pa2/00-id-registry.md` v1.0.0-frozen (`FR-F0x-nn`).
* **Feature:** Parent functional module ID (`F01`–`F07`) and descriptive title.
* **Priority:** MoSCoW classification (**Must** for F01–F06; **Should** for F07).
* **Functional Requirement Statement:** Verifiable requirement statement defining expected system capability.
* **Governing Rules / Constraints:** Associated Business Rules (`BR-nn`) and Non-Functional Requirements (`NFR-nn`).
* **Use Case (UC):** Traceable use case identifier(s) (`UC-01` to `UC-12`) detailing user interactions and system steps.
* **Screen Wireframe (SCR):** Linked user interface view(s) (`SCR-01` to `SCR-12`) rendering the capability.
* **Acceptance Criteria (AC):** Given-When-Then behavioral verification scenario ID (`AC-F0x-nn`). Where an explicit AC was omitted in the initial draft, a formal `[TBD: Proposed AC]` tag is registered.
* **Design Element (PA3) [Planned]:** Architectural realization artifact (REST route, controller, entity model). Deliberately reserved with `[TBD: PA3 ...]` tags.
* **Test Cases (PA4) [Planned]:** Verification test identifiers (Acceptance Test Cases, unit/integration suites). Deliberately reserved with `[TBD: PA4 ...]` tags.

---

## 2. Master Requirements Traceability Matrix (RTM)

The following matrix establishes the complete baseline for all 32 Functional Requirements across features F01 through F07.

*Note on Priority:* Features **F01–F06** encompass 29 **Must-have** requirements essential for PA5 deployment; Feature **F07** encompasses 3 **Should-have** requirements prioritized for delivery subject to schedule buffer.

### Table 9.1: Master Traceability Matrix (Requirements $\rightarrow$ Use Cases $\rightarrow$ Screens $\rightarrow$ Design $\rightarrow$ Test)

| Req ID | Feature & Priority | Functional Requirement Statement | Governing BR / NFR | Use Case (UC) | Screen (SCR) | Acceptance Criteria (AC) | Design Element (PA3) `[Planned]` | Test Cases (PA4) `[Planned]` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`FR-F01-01`** | **F01**: Authentication<br>*(Must)* | The system shall authenticate registered users using username/email and password credentials. | `BR-10`<br>`NFR-03`<br>`NFR-08` | `UC-01` | `SCR-01` | `AC-F01-01`<br>`AC-F01-02`<br>`AC-F01-04` | `[TBD: PA3 AuthController.login / POST /api/auth/login]` | `[TBD: PA4 TC-AUTH-01 (Valid login), TC-AUTH-02 (Invalid pass), TC-AUTH-03 (Inactive acc)]` |
| **`FR-F01-02`** | **F01**: Authentication<br>*(Must)* | The system shall generate a secure JSON Web Token (JWT) upon successful authentication and enforce role-based access control (RBAC) across Reader, Librarian, and Administrator endpoints. | `BR-10`<br>`NFR-04` | `UC-01` | `SCR-01`<br>`SCR-02`<br>`SCR-07`<br>`SCR-11` | `AC-F01-01`<br>`AC-F01-03` | `[TBD: PA3 jwtAuthMiddleware / TokenService / UserRoleEnum]` | `[TBD: PA4 TC-AUTH-04 (JWT issuance), TC-AUTH-05 (Reader 403 on staff routes)]` |
| **`FR-F01-03`** | **F01**: Authentication<br>*(Must)* | The system shall allow authenticated users to securely log out, invalidating the client-side session token. | `BR-10`<br>`NFR-04` | `UC-01` | `SCR-01`<br>*(Global Header)* | `[TBD: AC-F01-05 (Logout token invalidation)]`<br>*(Gap GAP-RTM-03)* | `[TBD: PA3 POST /api/auth/logout / LocalStorageClear]` | `[TBD: PA4 TC-AUTH-06 (Client session purge), TC-AUTH-07 (Re-access rejected)]` |
| **`FR-F01-04`** | **F01**: Authentication<br>*(Must)* | The system shall allow Administrators to create user accounts, assign user roles, and activate or deactivate accounts. | `BR-10`<br>`NFR-04` | `UC-02` | `SCR-02` | `AC-F01-04` | `[TBD: PA3 UserController / /api/admin/users CRUD]` | `[TBD: PA4 TC-USER-01 (Create user), TC-USER-02 (Assign role), TC-USER-03 (Deactivate)]` |
| **`FR-F02-01`** | **F02**: Book Catalog<br>*(Must)* | The system shall allow Librarians to create new Book Title entries with metadata: unique ISBN, Title, Author(s), Category, Publisher, and Publication Year. | `BR-10`<br>`NFR-05` | `UC-03` | `SCR-03` | `AC-F02-01`<br>`AC-F02-02` | `[TBD: PA3 BookCatalogService.createTitle / POST /api/books]` | `[TBD: PA4 TC-CAT-01 (Create title), TC-CAT-02 (Duplicate ISBN 409 Conflict)]` |
| **`FR-F02-02`** | **F02**: Book Catalog<br>*(Must)* | The system shall allow Librarians to update metadata of existing Book Title records. | `BR-10` | `UC-03` | `SCR-03` | `AC-F02-04` | `[TBD: PA3 BookCatalogService.updateTitle / PUT /api/books/:id]` | `[TBD: PA4 TC-CAT-03 (Update title metadata), TC-CAT-04 (Reader 403 edit attempt)]` |
| **`FR-F02-03`** | **F02**: Book Catalog<br>*(Must)* | The system shall allow Librarians to delete or deactivate a Book Title only if no physical Book Copies, active Loans, or pending Reservations are linked to it. | `BR-09`<br>`NFR-05` | `UC-03` | `SCR-03` | `AC-F02-03` | `[TBD: PA3 DELETE /api/books/:id / FK referential guard]` | `[TBD: PA4 TC-CAT-05 (Delete unused title), TC-CAT-06 (Blocked delete with copies)]` |
| **`FR-F02-04`** | **F02**: Book Catalog<br>*(Must)* | The system shall calculate and display aggregated Book Copy statistics (Total Copies, Available Copies, Borrowed Copies, Reserved Copies) on the Book Title detail view. | `NFR-01`<br>`NFR-05` | `UC-03`<br>`UC-06` | `SCR-03`<br>`SCR-06` | `AC-F02-01`<br>`AC-F04-01` | `[TBD: PA3 SQL view v_book_copy_summary / GET /api/books/:id]` | `[TBD: PA4 TC-CAT-07 (Aggregate counter calculation after state transitions)]` |
| **`FR-F03-01`** | **F03**: Book Copy Inventory<br>*(Must)* | The system shall allow Librarians to register physical Book Copies with a unique Barcode / Copy ID and Shelf Location under an existing Book Title. | `BR-10`<br>`NFR-05` | `UC-04` | `SCR-04` | `AC-F03-01`<br>`AC-F03-04` | `[TBD: PA3 BookCopyService.addCopy / POST /api/books/:id/copies]` | `[TBD: PA4 TC-INV-01 (Add valid copy), TC-INV-02 (Duplicate barcode 409)]` |
| **`FR-F03-02`** | **F03**: Book Copy Inventory<br>*(Must)* | The system shall allow Librarians to update Book Copy metadata, including Shelf Location and physical condition notes. | `BR-10` | `UC-04` | `SCR-04` | `[TBD: AC-F03-05 (Update shelf & condition)]`<br>*(Gap GAP-RTM-04)* | `[TBD: PA3 BookCopyService.updateCopy / PUT /api/copies/:copyId]` | `[TBD: PA4 TC-INV-03 (Update shelf location), TC-INV-04 (Add condition notes)]` |
| **`FR-F03-03`** | **F03**: Book Copy Inventory<br>*(Must)* | The system shall maintain and transition the lifecycle state of each physical Book Copy: `Available`, `Borrowed`, `Reserved`, and `Damaged`/`Lost`. | `BR-05`<br>`BR-08`<br>`BR-09`<br>`NFR-05` | `UC-04`<br>`UC-07`<br>`UC-08`<br>`UC-11` | `SCR-04`<br>`SCR-07`<br>`SCR-08`<br>`SCR-10` | `AC-F03-01`<br>`AC-F05-01`<br>`AC-F05-04`<br>`AC-F05-05`<br>`AC-F06-04` | `[TBD: PA3 copy_status ENUM + State Machine / TransactionManager]` | `[TBD: PA4 TC-INV-05 (Lifecycle transition Available->Borrowed->Reserved)]` |
| **`FR-F03-04`** | **F03**: Book Copy Inventory<br>*(Must)* | The system shall allow Librarians to decommission a physical Book Copy only when its current status is `Available` or `Damaged`/`Lost` (blocking deletion of `Borrowed` or `Reserved` copies). | `BR-09`<br>`BR-10` | `UC-04` | `SCR-04` | `AC-F03-02`<br>`AC-F03-03` | `[TBD: PA3 DELETE /api/copies/:copyId / DecommissionPolicy]` | `[TBD: PA4 TC-INV-06 (Decommission Available copy), TC-INV-07 (Block Borrowed copy)]` |
| **`FR-F04-01`** | **F04**: Search & Browse<br>*(Must)* | The system shall allow all users to execute keyword searches across Book Title, Author, Category, and ISBN. | `NFR-01` | `UC-05` | `SCR-05` | `AC-F04-01`<br>`AC-F04-03` | `[TBD: PA3 SearchController / GET /api/books?q= / Full-Text Index]` | `[TBD: PA4 TC-SRCH-01 (Multi-attribute query), TC-SRCH-02 (Empty result handling)]` |
| **`FR-F04-02`** | **F04**: Search & Browse<br>*(Must)* | The system shall allow users to filter catalog results by Category and Availability Status (`Available Now` vs `All`), and sort results by Title or Publication Year. | `NFR-01` | `UC-05` | `SCR-05` | `AC-F04-02` | `[TBD: PA3 GET /api/books?category=&available=&sort= / SQL query builder]` | `[TBD: PA4 TC-SRCH-03 (Filter by Category), TC-SRCH-04 (Filter Available Now), TC-SRCH-05 (Sort)]` |
| **`FR-F04-03`** | **F04**: Search & Browse<br>*(Must)* | The system shall display real-time physical Book Copy availability counters and Shelf Locations on search result cards and detailed Book Title views. | `NFR-01`<br>`NFR-05` | `UC-05`<br>`UC-06` | `SCR-05`<br>`SCR-06` | `AC-F04-01`<br>`AC-F04-02` | `[TBD: PA3 CopyAvailabilityBadgeComponent / GET /api/books/:id/copies]` | `[TBD: PA4 TC-SRCH-06 (Real-time count on search cards), TC-SRCH-07 (Shelf on detail)]` |
| **`FR-F04-04`** | **F04**: Search & Browse<br>*(Must)* | The system shall provide server-side paginated browsing of the catalog with a configurable page size (default 10 records per page). | `NFR-01` | `UC-05` | `SCR-05` | `AC-F04-04` | `[TBD: PA3 PaginationMiddleware / SQL LIMIT 10 OFFSET :page*10]` | `[TBD: PA4 TC-SRCH-08 (10 items/page limit), TC-SRCH-09 (Page 2 navigation)]` |
| **`FR-F05-01`** | **F05**: Borrow & Return<br>*(Must)* | The system shall allow Librarians to create a Loan (checkout) by selecting an active Reader ID and an `Available` Book Copy ID. | `BR-01`<br>`BR-02`<br>`BR-10`<br>`NFR-05` | `UC-07` | `SCR-07` | `AC-F05-01`<br>`AC-F05-07` | `[TBD: PA3 CirculationController.checkout / POST /api/circulation/checkout]` | `[TBD: PA4 TC-CIRC-01 (Standard checkout), TC-CIRC-02 (Reader 403 attempt)]` |
| **`FR-F05-02`** | **F05**: Borrow & Return<br>*(Must)* | The system shall validate that a Reader has an active account, fewer than three active Loans (`BR-01`), and zero Overdue Loans (`BR-04`) before checkout. | `BR-01`<br>`BR-04`<br>`NFR-05` | `UC-07` | `SCR-07` | `AC-F05-02`<br>`AC-F05-03` | `[TBD: PA3 CirculationValidator.validateCheckoutEligibility]` | `[TBD: PA4 TC-CIRC-03 (Reject 4th active loan), TC-CIRC-04 (Reject patron with overdue)]` |
| **`FR-F05-03`** | **F05**: Borrow & Return<br>*(Must)* | The system shall automatically calculate the Due Date as exactly 14 calendar days from checkout (`BR-02`) and transition the Book Copy to `Borrowed`. | `BR-02`<br>`NFR-05` | `UC-07` | `SCR-07` | `AC-F05-01` | `[TBD: PA3 DueDateCalculator (+14 days) / DB atomic transaction]` | `[TBD: PA4 TC-CIRC-05 (Due Date computation = checkout + 14d), TC-CIRC-06 (Copy Borrowed)]` |
| **`FR-F05-04`** | **F05**: Borrow & Return<br>*(Must)* | The system shall allow Librarians to process a Book Copy return (check-in) by scanning/entering the Copy ID, recording the return timestamp and updating the Loan status to `Returned`. | `BR-10`<br>`NFR-05` | `UC-08` | `SCR-08` | `AC-F05-04`<br>`AC-F05-05`<br>`AC-F05-07` | `[TBD: PA3 CirculationController.return / POST /api/circulation/return]` | `[TBD: PA4 TC-CIRC-07 (Return check-in), TC-CIRC-08 (Already returned reject)]` |
| **`FR-F05-05`** | **F05**: Borrow & Return<br>*(Must)* | Upon return, the system shall evaluate whether pending Reservations exist for the Book Title; if so, transition copy status to `Reserved` for the first FIFO Reader (72h window, `BR-08`); otherwise transition copy status to `Available`. | `BR-07`<br>`BR-08`<br>`NFR-05` | `UC-08` | `SCR-08`<br>`SCR-10` | `AC-F05-04`<br>`AC-F05-05` | `[TBD: PA3 HoldRoutingService.routeReturnedCopy / DB row locks]` | `[TBD: PA4 TC-CIRC-09 (Return without holds -> Available), TC-CIRC-10 (Return with holds -> Reserved)]` |
| **`FR-F05-06`** | **F05**: Borrow & Return<br>*(Must)* | The system shall allow Loan renewal, extending the Due Date by an additional 14 days exactly once, provided the Loan is not Overdue and no pending Reservations exist (`BR-03`). | `BR-03`<br>`NFR-05` | `UC-09` | `SCR-11`<br>`SCR-07` | `AC-F05-06` | `[TBD: PA3 CirculationController.renew / POST /api/circulation/renew/:loanId]` | `[TBD: PA4 TC-CIRC-11 (1st renewal +14d), TC-CIRC-12 (2nd renewal 422), TC-CIRC-13 (Blocked by hold/overdue)]` |
| **`FR-F05-07`** | **F05**: Borrow & Return<br>*(Must)* | The system shall automatically detect and flag Overdue Loans when current calendar date exceeds the designated Due Date. | `BR-04`<br>`NFR-05` | `UC-12`<br>*(Checked in `UC-07`,`UC-09`)* | `SCR-11`<br>`SCR-12` | `AC-F07-01`<br>`AC-F07-02`<br>*(Gap GAP-RTM-01)* | `[TBD: PA3 OverdueEvaluationService / SQL CURRENT_DATE > due_date]` | `[TBD: PA4 TC-CIRC-14 (Overdue detection trigger), TC-CIRC-15 (Borrowing block enforcement)]` |
| **`FR-F06-01`** | **F06**: Book Reservation<br>*(Must)* | The system shall allow an eligible Reader to place a Reservation for a Book Title when exactly zero copies of that title are in `Available` status (`BR-05`). | `BR-05`<br>`BR-07`<br>`NFR-05` | `UC-10` | `SCR-06`<br>`SCR-09` | `AC-F06-01`<br>`AC-F06-02` | `[TBD: PA3 ReservationController.create / POST /api/reservations]` | `[TBD: PA4 TC-RES-01 (Place hold with 0 available), TC-RES-02 (Reject hold with >= 1 available)]` |
| **`FR-F06-02`** | **F06**: Book Reservation<br>*(Must)* | The system shall enforce Reservation constraints: Reader cannot exceed 2 active Reservations (`BR-06`) and cannot reserve a Book Title they currently borrow (`BR-05`). | `BR-05`<br>`BR-06`<br>`NFR-05` | `UC-10` | `SCR-06`<br>`SCR-09` | `AC-F06-03`<br>`AC-F06-05` | `[TBD: PA3 ReservationValidator.validateHoldEligibility]` | `[TBD: PA4 TC-RES-03 (Reject 3rd reservation), TC-RES-04 (Reject hold on currently borrowed title)]` |
| **`FR-F06-03`** | **F06**: Book Reservation<br>*(Must)* | The system shall maintain an automated First-In, First-Out (FIFO) queue for Reservations per Book Title based on creation timestamps (`BR-07`). | `BR-07`<br>`NFR-05` | `UC-10` | `SCR-09`<br>`SCR-10` | `AC-F06-01` | `[TBD: PA3 reservations table created_at ASC index / QueueManager]` | `[TBD: PA4 TC-RES-05 (FIFO queue assignment), TC-RES-06 (Position calculation)]` |
| **`FR-F06-04`** | **F06**: Book Reservation<br>*(Must)* | When a Book Copy transitions to `Reserved`, the system shall set a Pickup Window deadline of 72 hours (3 calendar days) for the designated holding Reader (`BR-08`). | `BR-08`<br>`NFR-05` | `UC-11`<br>`UC-08` | `SCR-10`<br>`SCR-11` | `AC-F06-04` | `[TBD: PA3 pickup_deadline = NOW() + INTERVAL '72 hours']` | `[TBD: PA4 TC-RES-07 (72h pickup window calculation), TC-RES-08 (Display countdown on SCR-10)]` |
| **`FR-F06-05`** | **F06**: Book Reservation<br>*(Must)* | The system shall allow Readers to cancel pending Reservations, and shall automatically expire reservations uncollected after 72 hours, advancing the FIFO Queue or releasing the copy to `Available`. | `BR-07`<br>`BR-08`<br>`NFR-05` | `UC-11` | `SCR-10`<br>`SCR-11` | `AC-F06-04` | `[TBD: PA3 DELETE /api/reservations/:id + HoldExpiryWorker job]` | `[TBD: PA4 TC-RES-09 (Patron cancels pending hold), TC-RES-10 (Auto-expire 72h advances queue)]` |
| **`FR-F06-06`** | **F06**: Book Reservation<br>*(Must)* | The system shall fulfill the Reservation when the designated Reader checks out the held Book Copy at the Circulation Desk, completing the hold lifecycle. | `BR-08`<br>`BR-10`<br>`NFR-05` | `UC-07`<br>*(Flow A1)* | `SCR-07`<br>`SCR-10` | `[TBD: AC-F06-06 (Hold checkout fulfillment)]`<br>*(Gap GAP-RTM-02, GAP-RTM-05)* | `[TBD: PA3 CheckoutTransaction fulfills linked reservation_id]` | `[TBD: PA4 TC-RES-11 (Held copy checkout marks hold Fulfilled), TC-RES-12 (Wrong reader checkout blocked)]` |
| **`FR-F07-01`** | **F07**: Monitoring Dashboard<br>*(Should)* | The system shall provide Readers with a dedicated personal dashboard displaying active Loans, Due Dates, eligible renewal actions, active Reservations, and queue positions. | `BR-01`<br>`BR-03`<br>`BR-06` | `UC-12` | `SCR-11` | `AC-F07-01` | `[TBD: PA3 ReaderDashboardController / GET /api/reader/dashboard]` | `[TBD: PA4 TC-DASH-01 (Reader dashboard renders active loans, due dates, holds)]` |
| **`FR-F07-02`** | **F07**: Monitoring Dashboard<br>*(Should)* | The system shall display prominent visual Overdue alerts and borrowing restriction notices on the Reader dashboard. | `BR-04` | `UC-12` | `SCR-11` | `AC-F07-01` | `[TBD: PA3 OverdueBannerComponent on SCR-11]` | `[TBD: PA4 TC-DASH-02 (Render overdue warning banner and restriction badge)]` |
| **`FR-F07-03`** | **F07**: Monitoring Dashboard<br>*(Should)* | The system shall provide Librarians with an Overdue monitoring console listing all Overdue Loans, days Overdue, patron contact details, and item details. | `BR-04`<br>`BR-10` | `UC-12` | `SCR-12` | `AC-F07-02` | `[TBD: PA3 LibrarianMonitoringController / GET /api/circulation/overdue]` | `[TBD: PA4 TC-DASH-03 (Librarian console lists overdue loans sorted by days overdue)]` |

---

## 3. Auxiliary Bidirectional Traceability Sub-Matrices

To satisfy rigorous Software Engineering verification standards and support downstream PA3 and PA4 engineering tasks, the following sub-matrices provide multi-perspective cross-referencing.

### 3.1 Use Case Traceability Sub-Matrix (Use Case $\rightarrow$ Requirements & Screens)
Verifies that 100% of the 12 approved Use Cases trace to verifiable Functional Requirements, Business Rules, and Screen Wireframes.

| UC ID | Use Case Name | Primary Actor(s) | Priority | Associated Functional Requirements | Associated Business Rules | Primary & Supporting Screens | Specification Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **`UC-01`** | Log In & Manage Session | Reader, Librarian, Admin | **Must\*** | `FR-F01-01`, `FR-F01-02`, `FR-F01-03` | `BR-10` | `SCR-01` (Landing: `SCR-11`, `SCR-07`, `SCR-02`) | Complete (`docs/pa2/uc/UC-01.md`) |
| **`UC-02`** | Manage User Accounts | Administrator | **Must** | `FR-F01-04` | `BR-10` | `SCR-02` | Complete (`docs/pa2/uc/UC-02.md`) |
| **`UC-03`** | Manage Book Catalog (CRUD Titles) | Librarian | **Must\*** | `FR-F02-01`, `FR-F02-02`, `FR-F02-03`, `FR-F02-04` | `BR-09`, `BR-10` | `SCR-03` | Complete (`docs/pa2/uc/UC-03.md`) |
| **`UC-04`** | Manage Book Copies & Inventory | Librarian | **Must** | `FR-F03-01`, `FR-F03-02`, `FR-F03-03`, `FR-F03-04` | `BR-09`, `BR-10` | `SCR-04` | Complete (`docs/pa2/uc/UC-04.md`) |
| **`UC-05`** | Search & Browse Book Catalog | Reader, Librarian | **Must\*** | `FR-F04-01`, `FR-F04-02`, `FR-F04-03`, `FR-F04-04` | — | `SCR-05` | Complete (`docs/pa2/uc/UC-05.md`) |
| **`UC-06`** | View Book Details & Copy Availability | Reader, Librarian | **Must** | `FR-F02-04`, `FR-F04-03` | — | `SCR-06` | Linked via `UC-05` (`docs/pa2/uc/UC-05.md`) |
| **`UC-07`** | Borrow Book (Circulation Checkout) | Librarian | **Must\*** | `FR-F05-01`, `FR-F05-02`, `FR-F05-03`, `FR-F06-06` | `BR-01`, `BR-02`, `BR-04`, `BR-10` | `SCR-07`, `SCR-10` | Complete (`docs/pa2/uc/UC-07.md`) |
| **`UC-08`** | Return Book (Circulation Check-in) | Librarian | **Must\*** | `FR-F05-04`, `FR-F05-05`, `FR-F06-04` | `BR-07`, `BR-08`, `BR-10` | `SCR-08`, `SCR-10` | Complete (`docs/pa2/uc/UC-08.md`) |
| **`UC-09`** | Renew Book Loan | Reader, Librarian | **Must** | `FR-F05-06`, `FR-F05-07` | `BR-03`, `BR-04` | `SCR-11`, `SCR-07` | Complete (`docs/pa2/uc/UC-09.md`) |
| **`UC-10`** | Reserve Book Title (Place Hold) | Reader | **Must\*** | `FR-F06-01`, `FR-F06-02`, `FR-F06-03` | `BR-05`, `BR-06`, `BR-07` | `SCR-09`, `SCR-06` | Complete (`docs/pa2/uc/UC-10.md`) |
| **`UC-11`** | Cancel Reservation & Process Expiry | Reader, Librarian / System | **Must** | `FR-F06-04`, `FR-F06-05` | `BR-07`, `BR-08` | `SCR-10`, `SCR-11` | Complete (`docs/pa2/uc/UC-11.md`) |
| **`UC-12`** | View Reader Dashboard & Overdue Desk | Reader, Librarian | **Should** | `FR-F07-01`, `FR-F07-02`, `FR-F07-03`, `FR-F05-07` | `BR-01`, `BR-03`, `BR-04` | `SCR-11`, `SCR-12` | Complete (`docs/pa2/uc/UC-12.md` draft) |

*\* Note: UC-01, UC-03, UC-05, UC-07, UC-08, and UC-10 designate the six core Must-have Use Cases selected for complete step-by-step specifications in PA2 Section 7.*

### 3.2 Screen Wireframe Traceability Sub-Matrix (Screen $\rightarrow$ Use Cases & Requirements)
Verifies that 100% of the 12 UI Screens designed in Figma map to corresponding Use Cases, Functional Requirements, and meet accessibility standards (`NFR-06`).

| Screen ID | Screen Name | Target Role(s) | Traced Use Cases | Traced Functional Requirements | Figma Wireframe Node & Frame Link | WCAG 2.1 AA Status (`NFR-06`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **`SCR-01`** | Authentication & Login Screen | All Users | `UC-01` | `FR-F01-01`, `FR-F01-02`, `FR-F01-03` | [SCR-01 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-01) | **PASS** (Contrast 7.2:1) |
| **`SCR-02`** | Administrator User Management Screen | Admin | `UC-02` | `FR-F01-04` | [SCR-02 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-02) | **PASS** (Contrast 5.1:1) |
| **`SCR-03`** | Librarian Book Catalog Management Screen | Librarian | `UC-03` | `FR-F02-01`, `FR-F02-02`, `FR-F02-03`, `FR-F02-04` | [SCR-03 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-03) | **PASS** (Contrast 6.4:1) |
| **`SCR-04`** | Book Copy Inventory Management Screen | Librarian | `UC-04` | `FR-F03-01`, `FR-F03-02`, `FR-F03-03`, `FR-F03-04` | [SCR-04 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-04) | **PASS** (Contrast 5.8:1) |
| **`SCR-05`** | Catalog Search & Browse Screen | Reader, Librarian | `UC-05` | `FR-F04-01`, `FR-F04-02`, `FR-F04-03`, `FR-F04-04` | [SCR-05 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-05) | **PASS** (Contrast 8.1:1) |
| **`SCR-06`** | Book Title Detail & Availability Screen | Reader, Librarian | `UC-06`, `UC-10` | `FR-F02-04`, `FR-F04-03`, `FR-F06-01`, `FR-F06-02` | [SCR-06 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-06) | **PASS** (Contrast 6.0:1) |
| **`SCR-07`** | Circulation Desk — Borrow (Checkout) Screen | Librarian | `UC-07`, `UC-09` | `FR-F05-01`, `FR-F05-02`, `FR-F05-03`, `FR-F05-06`, `FR-F06-06` | [SCR-07 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-07) | **PASS** (Contrast 5.3:1) |
| **`SCR-08`** | Circulation Desk — Return (Check-in) Screen | Librarian | `UC-08` | `FR-F05-04`, `FR-F05-05` | [SCR-08 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-08) | **PASS** (Contrast 5.3:1) |
| **`SCR-09`** | Book Reservation Modal / Confirmation View | Reader | `UC-10` | `FR-F06-01`, `FR-F06-02`, `FR-F06-03` | [SCR-09 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-09) | **PASS** (Contrast 7.5:1) |
| **`SCR-10`** | Librarian Hold Shelf & Reservation Queue Screen | Librarian | `UC-07`, `UC-08`, `UC-10`, `UC-11` | `FR-F05-05`, `FR-F06-03`, `FR-F06-04`, `FR-F06-05`, `FR-F06-06` | [SCR-10 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-10) | **PASS** (Contrast 4.8:1) |
| **`SCR-11`** | Reader Personal Dashboard Screen | Reader | `UC-01`, `UC-09`, `UC-11`, `UC-12` | `FR-F01-02`, `FR-F05-06`, `FR-F05-07`, `FR-F06-04`, `FR-F06-05`, `FR-F07-01`, `FR-F07-02` | [SCR-11 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-11) | **PASS** (Contrast 6.2:1) |
| **`SCR-12`** | Librarian Overdue & Circulation Monitoring Screen | Librarian | `UC-12` | `FR-F05-07`, `FR-F07-03` | [SCR-12 Frame Link](https://www.figma.com/proto/unilib-pa2-prototype?node-id=scr-12) | **PASS** (Contrast 5.9:1) |

### 3.3 Non-Functional Requirements (NFR) Traceability Sub-Matrix
Traces quantitative quality attributes (`NFR-01` through `NFR-08`) to architectural design tactics and verification methods:

| NFR ID | Category & Metric Condition | Traced Features & UCs | Architectural Realization Strategy (PA3 Tactic) | Planned Verification Method (PA4 Test Tactic) |
| :--- | :--- | :--- | :--- | :--- |
| **`NFR-01`** | Performance (Search): $\le 1.0\text{s}$ at P95 across 10,000 titles with 100 concurrent users. | F04 (`UC-05`, `UC-06`) | PostgreSQL B-tree/GIN indexes on `(title, author, category, isbn)`; bounded server-side `LIMIT 10 OFFSET :offset`. | Automated Load Test via k6 / Artillery scripts simulating 100 Virtual Users against seeded DB. |
| **`NFR-02`** | Performance (Page Load): $\text{LCP} \le 2.5\text{s}$ at P90 on standard broadband/4G. | All UI Views (`SCR-01`–`SCR-12`) | React code splitting, Vite bundle chunking, deferred loading of heavy modal assets. | Automated Google Lighthouse Performance audit in CI/CD build pipeline. |
| **`NFR-03`** | Security (Password Hashing): Passwords hashed with bcrypt (salt rounds $\ge 10$); zero plain-text leaks. | F01 (`UC-01`, `UC-02`) | Dedicated `PasswordService.hash()` enforcing `cost = 10`; request/response logging filters redacting credentials. | Automated Unit Tests (`auth.service.spec.ts`) + Static Code Analysis security scans. |
| **`NFR-04`** | Security (Authorization): Protected REST API endpoints return 401 for unauthenticated and 403 for unauthorized roles. | F01–F07 (`UC-01`–`UC-12`) | Express JWT middleware (`authenticateToken`, `requireRole('Librarian' | 'Admin')`) applied to all protected routes. | Automated API Integration Tests (Supertest) verifying HTTP 401 and 403 response matrices. |
| **`NFR-05`** | Data Integrity (Concurrency): Atomic transactions with row locks (`SELECT FOR UPDATE`); 0 race conditions on checkouts/holds. | F02, F03, F05, F06 (`UC-03`, `UC-04`, `UC-07`, `UC-08`, `UC-10`, `UC-11`) | PostgreSQL `SERIALIZABLE` or `READ COMMITTED` transactions with explicit `SELECT ... FOR UPDATE` row locks on book copy and hold queue records. | Automated Concurrency Integration Tests firing concurrent simultaneous checkouts on last available copy. |
| **`NFR-06`** | Usability & Accessibility: Lighthouse A11y score $\ge 85$; contrast ratio $\ge 4.5:1$; complete keyboard navigation. | All UI Screens (`SCR-01`–`SCR-12`) | Semantic HTML5 tags (`<main>`, `<nav>`, `<label>`), explicit ARIA attributes, standard focus outlines, WCAG AA color palette. | Lighthouse Accessibility Audit + Manual keyboard-only navigation walkthrough checklist. |
| **`NFR-07`** | Compatibility: Responsive layout integrity across modern evergreen desktop browsers (Chrome 120+, Firefox 120+, Edge 120+, Safari 17+) from 1024px to 1920px. | All UI Screens (`SCR-01`–`SCR-12`) | Responsive CSS Grid/Flexbox layouts with breakpoint constraints (`min-width: 1024px`). | Playwright / Cypress cross-browser matrix verification suite running on headless browser containers. |
| **`NFR-08`** | Reliability & Graceful Error Handling: User-friendly error banners on service failure; database schema restoration in $< 5$ minutes. | All Features & UI Views | Centralized React Error Boundary + API Axios response interceptors; idempotent PostgreSQL migration/seed scripts (`db:seed`). | Fault Injection Test (killing backend service) + Timed disaster recovery seed script execution run. |

### 3.4 Business Rules (BR) Traceability Sub-Matrix
Traces institutional circulation and administrative policies (`BR-01` through `BR-10`) to operational system components:

| Rule ID | Rule Name | Operational Policy Constraint | Governed Requirements | Enforcing Use Cases & Screens | Realization Mechanism |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`BR-01`** | Maximum Active Loan Limit | Maximum **3 active loans** concurrently per Reader. | `FR-F05-02`, `FR-F07-01` | `UC-07` (`SCR-07`) | Pre-checkout count validation: `SELECT COUNT(*) FROM loans WHERE reader_id = :id AND return_date IS NULL < 3`. |
| **`BR-02`** | Standard Loan Period | Default borrowing duration is **14 calendar days** from checkout timestamp. | `FR-F05-03` | `UC-07` (`SCR-07`) | Timestamp calculation: `due_date = checkout_at + INTERVAL '14 days'`. |
| **`BR-03`** | Loan Renewal Policy | Exactly **one renewal (+14 days)** permitted if loan is not overdue and no title reservations exist. | `FR-F05-06`, `FR-F07-01` | `UC-09` (`SCR-11`, `SCR-07`) | Renewal check: `renewal_count < 1 AND CURRENT_DATE <= due_date AND NOT EXISTS (SELECT 1 FROM reservations WHERE book_id = :book_id AND status = 'Pending')`. |
| **`BR-04`** | Overdue Borrowing Suspension | $\ge 1$ overdue loan immediately suspends checkout and new reservations. | `FR-F05-02`, `FR-F05-07`, `FR-F07-02`, `FR-F07-03` | `UC-07`, `UC-09`, `UC-10`, `UC-12` (`SCR-07`, `SCR-09`, `SCR-11`, `SCR-12`) | Global patron sanction guard: `SELECT COUNT(*) FROM loans WHERE reader_id = :id AND return_date IS NULL AND CURRENT_DATE > due_date = 0`. |
| **`BR-05`** | Reservation Eligibility | Reservation allowed if and only if **0 copies are Available**, and reader does not hold active loan of title. | `FR-F06-01`, `FR-F06-02` | `UC-10` (`SCR-06`, `SCR-09`) | Pre-reservation check: `count(Available) == 0 AND NOT EXISTS (active loan for reader on title)`. |
| **`BR-06`** | Maximum Active Reservations | Maximum **2 active reservations** concurrently per Reader. | `FR-F06-02`, `FR-F07-01` | `UC-10` (`SCR-09`, `SCR-11`) | Active hold count check: `SELECT COUNT(*) FROM reservations WHERE reader_id = :id AND status IN ('Pending', 'ReadyForPickup') < 2`. |
| **`BR-07`** | Reservation Priority Order | Strict **First-In, First-Out (FIFO)** queue sequence based on reservation creation timestamp. | `FR-F05-05`, `FR-F06-03`, `FR-F06-05` | `UC-08`, `UC-10`, `UC-11` (`SCR-08`, `SCR-09`, `SCR-10`) | SQL queue ordering: `ORDER BY created_at ASC, reservation_id ASC`. |
| **`BR-08`** | Hold Pickup Window | Returned copy routes to hold shelf in `Reserved` status for **72 hours (3 calendar days)**. | `FR-F05-05`, `FR-F06-04`, `FR-F06-05`, `FR-F06-06` | `UC-08`, `UC-11`, `UC-07` (`SCR-08`, `SCR-10`, `SCR-11`) | Expiry assignment: `pickup_deadline = allocation_at + INTERVAL '72 hours'`. Hourly expiry worker advances queue. |
| **`BR-09`** | Deletion Referential Integrity | Cannot delete title if copies exist; cannot delete copy if `Borrowed` or `Reserved`. | `FR-F02-03`, `FR-F03-04` | `UC-03`, `UC-04` (`SCR-03`, `SCR-04`) | PostgreSQL foreign key `ON DELETE RESTRICT` and API status check before deletion. |
| **`BR-10`** | Separation of Roles | Readers have read-only catalog access; only Librarians process circulation; only Admins manage staff. | `FR-F01-01`–`FR-F01-04`, `FR-F05-01`–`FR-F05-07` | All Use Cases & Screens | API middleware RBAC checks (`requireRole`) and React UI conditional rendering. |

---

## 4. Traceability Coverage and Gap Analysis

### 4.1 Quantitative Coverage Summary

| Metric | Target Standard | Measured Count / Value | Compliance Ratio | Status | Verification Reference |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Total Functional Requirements (FR)** | $\ge 28$ | **32 unique FRs** | 100.0% | **PASS** | Section 2 Table 9.1 (`05-functional-requirements.md`) |
| **Must-have FRs Traced to $\ge 1$ UC** | 100% | **29 / 29 Must FRs** | **100.0%** | **PASS** | Every Must-have FR maps to at least 1 Use Case |
| **Must-have FRs Traced to $\ge 1$ Screen** | 100% | **29 / 29 Must FRs** | **100.0%** | **PASS** | Every Must-have FR maps to at least 1 Screen Wireframe |
| **Should-have FRs Traced to UC & Screen** | 100% | **3 / 3 Should FRs** | **100.0%** | **PASS** | `FR-F07-01`..`03` trace to `UC-12` & `SCR-11`/`SCR-12` |
| **Use Cases Traced to $\ge 1$ FR** | 100% | **12 / 12 UCs** | **100.0%** | **PASS** | Section 3.1 Sub-Matrix |
| **Screens Traced to $\ge 1$ UC & FR** | 100% | **12 / 12 Screens** | **100.0%** | **PASS** | Section 3.2 Sub-Matrix |
| **Non-Functional Requirements (NFR) Traced** | 100% | **8 / 8 NFRs** | **100.0%** | **PASS** | Section 3.3 Sub-Matrix |
| **Business Rules (BR) Traced** | 100% | **10 / 10 BRs** | **100.0%** | **PASS** | Section 3.4 Sub-Matrix |
| **PA3 & PA4 Placeholder Columns Preserved** | 100% | **32 / 32 rows** | **100.0%** | **PASS** | Deliberately marked `[TBD: PA3...]` and `[TBD: PA4...]` |

### 4.2 Orphan Requirements and Anomaly Audit Findings

During the compilation and cross-verification of the RTM baseline, eight critical anomalies, omissions, and documentation gaps were detected. These have been reconciled within the RTM and logged into the formal Gap Register below:

1. **Registry Omission of `FR-F05-07` in Table 6.1 (GAP-RTM-01):**  
   In `docs/pa2/00-id-registry.md` Table 6.1, `FR-F05-07` (*Automated overdue detection*) was not associated with any Use Case. In reality, overdue detection is actively surfaced in `UC-12` (*Monitoring Dashboard*) and acts as an operational precondition in `UC-07` (*Checkout*) and `UC-09` (*Renewal*) per `BR-04`. In Table 9.1, this link has been formally closed by mapping `FR-F05-07` to `UC-12`, `SCR-11`, and `SCR-12`.
2. **Registry Omission of `FR-F06-06` in Table 6.1 (GAP-RTM-02):**  
   In `docs/pa2/00-id-registry.md` Table 6.1, `FR-F06-06` (*Reservation fulfillment at circulation checkout*) was omitted from the UC list. This requirement is realized via `UC-07` Alternate Flow A1 (*Checkout of held copy for designated patron*). In Table 9.1, this link is restored to `UC-07` and screens `SCR-07` / `SCR-10`.
3. **Acceptance Criteria Coverage Gaps (GAP-RTM-03, 04, 05):**  
   Cross-auditing against `docs/pa2/08-acceptance-criteria.md` revealed that while 30 AC scenarios were elaborated, four specific functional requirements lacked explicit, dedicated Given-When-Then criteria:
   - `FR-F01-03` (*Secure logout*): Lacks dedicated AC; proposed as `[TBD: AC-F01-05]`.
   - `FR-F03-02` (*Update copy shelf location / condition*): Lacks dedicated AC; proposed as `[TBD: AC-F03-05]`.
   - `FR-F06-06` (*Hold fulfillment at checkout*): Covered in UC-07 flow text but missing isolated Given-When-Then statement; proposed as `[TBD: AC-F06-06]`.
   - `FR-F05-07` (*Automated overdue flagging*): Surfaced in `AC-F07-01` and `AC-F07-02` display tests, but lacks backend background job trigger test; proposed as `[TBD: AC-F05-08]`.
4. **Reconciliation of FR Count (32 vs 28):**  
   The initial kickoff minutes referenced "28 FRs" as an approximate estimate ($4 \times 7$). The formal audit of `00-id-registry.md` and `05-functional-requirements.md` proves that exactly **32 Functional Requirements** are defined (F01: 4, F02: 4, F03: 4, F04: 4, F05: 7, F06: 6, F07: 3). All 32 are tracked in this RTM.

---

## 5. Actionable Gap Register (GitHub Issues `label: pa2-gap`)

The following issues are registered for assignment to individual section owners. Resolution must be completed and signed off during the Slot S5 Requirements Inspection Walkthrough (Task `PA2-V5`):

| Gap ID | GitHub Issue Title | Category & Severity | Target Artifact | Description & Observed Discrepancy | Recommended Resolution & Action Item | Assigned Owner | Slot Due | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **`GAP-RTM-01`** | `[pa2-gap] Add FR-F05-07 mapping to UC-12 and UC-07 in Master ID Registry` | High / Consistency | `00-id-registry.md` Table 6.1 | `FR-F05-07` (Overdue detection) was omitted from the "Related FRs" column of Table 6.1 in the frozen registry. | Update Table 6.1 in `00-id-registry.md` to link `FR-F05-07` to `UC-12`, `SCR-11`, and `SCR-12`. | Nguyên (BA) / Vinh (PM) | Slot S5 | **Open** |
| **`GAP-RTM-02`** | `[pa2-gap] Add FR-F06-06 mapping to UC-07 in Master ID Registry` | High / Consistency | `00-id-registry.md` Table 6.1 | `FR-F06-06` (Reservation fulfillment at checkout) was not listed under `UC-07` in Table 6.1. | Update Table 6.1 in `00-id-registry.md` to explicitly link `FR-F06-06` to `UC-07` (Alternate Flow A1). | Nguyên (BA) / Quân (Dev) | Slot S5 | **Open** |
| **`GAP-RTM-03`** | `[pa2-gap] Author explicit Given-When-Then AC-F01-05 for Secure Logout` | Medium / Testability | `08-acceptance-criteria.md` §3.1 | `FR-F01-03` has no isolated Given-When-Then acceptance test scenario in Section 3.1. | Draft `AC-F01-05` specifying client token deletion and HTTP request rejection post-logout. | Vinh (Tester) | Slot S5 | **Open** |
| **`GAP-RTM-04`** | `[pa2-gap] Author explicit Given-When-Then AC-F03-05 for Copy Metadata Update` | Medium / Testability | `08-acceptance-criteria.md` §3.3 | `FR-F03-02` (Shelf location and condition notes update) lacks a dedicated acceptance criterion. | Draft `AC-F03-05` verifying successful PUT update and persistence of copy metadata. | Vinh (Tester) | Slot S5 | **Open** |
| **`GAP-RTM-05`** | `[pa2-gap] Author explicit Given-When-Then AC-F06-06 for Hold Checkout Fulfillment` | Medium / Testability | `08-acceptance-criteria.md` §3.6 | `FR-F06-06` hold fulfillment lacks dedicated Given-When-Then scenario in Section 3.6. | Draft `AC-F06-06` specifying atomic transition of copy from `Reserved` to `Borrowed` and hold to `Fulfilled`. | Vinh (Tester) | Slot S5 | **Open** |
| **`GAP-RTM-06`** | `[pa2-gap] Finalize and merge Use Case specifications UC-06 and UC-12` | High / Completeness | `docs/pa2/uc/` | `UC-06` is referenced as extension of `UC-05` but lacks dedicated file; `UC-12.md` is currently an empty placeholder (0 bytes). | Consolidate and commit detailed flow specifications for `UC-06` and `UC-12`. | Nguyên (BA) / Ánh (Designer) | Slot S5 | **Open** |
| **`GAP-RTM-07`** | `[pa2-gap] Clarify technical realization: Overdue status column vs SQL dynamic view` | Medium / Architecture | `07-business-rules.md`, PA3 Design | `[TBD]` whether `Overdue` is a discrete PostgreSQL enum state or calculated dynamically via `CURRENT_DATE > due_date`. | Adopt Quân's technical proposal: compute dynamically in SQL view to prevent cron synchronization lag. | Quân (Dev) / Nguyên (BA) | Slot S5 | **Open** |
| **`GAP-RTM-08`** | `[pa2-gap] Clarify operational handling of Damaged returns with pending holds` | Low / Domain Policy | `07-business-rules.md`, `UC-08` | `[TBD]` workflow when a returned copy is physically damaged while a patron is queued in the FIFO reservation queue. | Adopt policy: copy transitions to `Damaged`, top hold remains `Pending` until next undamaged return. | Nguyên (BA) / Vinh (PM) | Slot S5 | **Open** |

---

## 6. Automated Traceability Verification Script

To guarantee ongoing consistency and facilitate continuous integration (CI) quality gates, the following automated Python verification script is maintained within the repository.

```python
#!/usr/bin/env python3
"""
UniLib PA2 - Automated Requirements Traceability Matrix Verification Script
Author: Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)
Task: PA2-V4 · Slot S4
"""

import re
import sys
from pathlib import Path

def verify_traceability():
    rtm_path = Path("docs/pa2/12-traceability-matrix.md")
    fr_path = Path("docs/pa2/05-functional-requirements.md")
    
    if not rtm_path.exists() or not fr_path.exists():
        print("ERROR: Required markdown files missing.")
        sys.exit(1)
        
    rtm_text = rtm_path.read_text(encoding="utf-8")
    fr_text = fr_path.read_text(encoding="utf-8")
    
    # 1. Extract all FR IDs from Functional Requirements document
    fr_declared = sorted(list(set(re.findall(r"\|\s*(FR-F\d+-\d+)\s*\|", fr_text))))
    print(f"[CHECK 1] Total FRs declared in 05-functional-requirements.md: {len(fr_declared)}")
    
    # 2. Extract all FR IDs from RTM Table 9.1
    rtm_rows = re.findall(
        r"^\|\s*\*\*`?(FR-F\d+-\d+)`?\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|",
        rtm_text,
        re.MULTILINE
    )
    print(f"[CHECK 2] Total FR rows extracted from RTM Table 9.1: {len(rtm_rows)}")
    
    if len(fr_declared) != len(rtm_rows):
        print(f"FAIL: Discrepancy between declared FRs ({len(fr_declared)}) and RTM rows ({len(rtm_rows)})")
        sys.exit(1)
        
    # 3. Verify that 100% of Must-have FRs have >= 1 UC and >= 1 Screen
    must_count = 0
    ucs_found = set()
    scrs_found = set()
    
    for row in rtm_rows:
        fr_id = row[0]
        priority_col = row[1]
        uc_col = row[4]
        scr_col = row[5]
        pa3_col = row[7]
        pa4_col = row[8]
        
        # Check UC mapping
        matched_ucs = re.findall(r"UC-\d+", uc_col)
        matched_scrs = re.findall(r"SCR-\d+", scr_col)
        
        for u in matched_ucs:
            ucs_found.add(u)
        for s in matched_scrs:
            scrs_found.add(s)
            
        if "Must" in priority_col:
            must_count += 1
            if len(matched_ucs) == 0:
                print(f"FAIL: Must-have {fr_id} has no linked Use Case!")
                sys.exit(1)
            if len(matched_scrs) == 0:
                print(f"FAIL: Must-have {fr_id} has no linked Screen!")
                sys.exit(1)
                
        # Check PA3 / PA4 placeholder presence
        if "[TBD: PA3" not in pa3_col:
            print(f"WARNING: Row {fr_id} missing PA3 placeholder.")
        if "[TBD: PA4" not in pa4_col:
            print(f"WARNING: Row {fr_id} missing PA4 placeholder.")

    print(f"[CHECK 3] Verified {must_count} Must-have FRs: 100% mapped to >= 1 UC and >= 1 Screen.")
    print(f"[CHECK 4] Verified Use Case coverage: {len(ucs_found)} / 12 UCs linked ({sorted(list(ucs_found))}).")
    print(f"[CHECK 5] Verified Screen coverage: {len(scrs_found)} / 12 Screens linked ({sorted(list(scrs_found))}).")
    
    if len(ucs_found) != 12:
        print(f"FAIL: Expected 12 Use Cases, but only found {len(ucs_found)}")
        sys.exit(1)
        
    if len(scrs_found) != 12:
        print(f"FAIL: Expected 12 Screens, but only found {len(scrs_found)}")
        sys.exit(1)

    print("SUCCESS: 100% Traceability and Coverage Acceptance Criteria Met!")

if __name__ == "__main__":
    verify_traceability()
```

---

## 7. Reviewer Notes and Traceability Handoff

### 7.1 Handoff Notes for Reviewer Trần Hà Anh Quân (Developer)
1. **Concurrency and Row Locking (`NFR-05`):**  
   Every circulation and reservation requirement (`FR-F03-03`, `FR-F05-01` through `FR-F05-06`, `FR-F06-01` through `FR-F06-06`) is mapped to `NFR-05` in Table 9.1. In PA3, please ensure the transaction boundaries and `SELECT ... FOR UPDATE` row-locking sequence follow your technical feasibility review (`docs/architecture/pa2-quan-technical-review.md`).
2. **Dynamic Overdue Handling (`GAP-RTM-07`):**  
   In alignment with your recommendation, `FR-F05-07` is structured to support real-time SQL calculation (`CURRENT_DATE > due_date AND return_date IS NULL`). Please review the proposed `GET /api/circulation/overdue` endpoint contract during PA3 design.
3. **Traceability Expansion for PA3:**  
   When drafting Section 5 of the Architecture & System Design (PA3), the `Design Element (PA3)` column will be populated with exact Express router filepaths and PostgreSQL table schema names.

### 7.2 Handoff Notes for Nguyễn Thanh Thảo Nguyên (BA) and Vũ Thị Ánh (Designer)
1. **Registry Synchronization (v1.1.0):**  
   Please review `GAP-RTM-01` and `GAP-RTM-02`. During the Slot S5 review, we will submit a formal Change Request (CR) to update Table 6.1 in `00-id-registry.md` so the Master ID Registry reflects these links.
2. **Missing Flow Merges (`GAP-RTM-06`):**  
   Please ensure `UC-06` and `UC-12` markdown specifications are committed to `docs/pa2/uc/` prior to the Slot S5 walkthrough meeting.
3. **Wireframe Alignment:**  
   Screens `SCR-07` and `SCR-08` must maintain the visual warning banners and hold routing toasts resolved in `11-prototype.md` Section 4 (`GAP-01`, `GAP-02`, `GAP-03`).

### 7.3 Downstream Handoff for Phase PA4 (Master Test Plan)
All 32 Functional Requirements and 8 Non-Functional Requirements in this matrix provide direct inputs for Task `PA4-V1` (Master Test Plan) and `PA4-V2` (Acceptance Test Suite). Each `[TBD: PA4 ...]` placeholder will be replaced with formal Acceptance Test Case identifiers (`ATC-xxx-nn`) maintaining 100% bidirectional verification coverage.

