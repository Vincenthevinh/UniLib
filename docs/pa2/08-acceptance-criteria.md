# 5.4 Acceptance Criteria

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V3  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Status:** Draft – Pending Review  
**Baseline Reference:** PA1 Project Proposal & Plan; PA2 Master ID Registry v1.0.0-frozen; docs/pa2/02-glossary.md; docs/pa2/05-functional-requirements.md; docs/pa2/07-business-rules.md  

---

## 1. Introduction and Testing Perspective

This section specifies the formal Acceptance Criteria (AC) for the core functional modules of the UniLib system, focusing on the six mandatory Must-have features (**F01–F06**) and the prioritized Should-have feature (**F07**).

From the perspective of Software Quality Assurance and Testing (Shift-Left Testing):
1. **Direct Input for PA4 Test Planning:** These criteria are structured so that they map directly to Acceptance Test Cases (ATCs) in PA4 without requiring re-interpretation of requirements.
2. **Early Boundary and Edge Case Identification:** By defining explicit boundary conditions (e.g., loan limit saturation, duplicate unique keys, hold expiration windows) during the SRS phase, the engineering team eliminates requirement ambiguities before architectural design (PA3) and implementation (PA5).
3. **Behavioral Black-Box Verification:** Every acceptance criterion specifies verifiable system behaviors in terms of inputs, pre-conditions, and observable outcomes, strictly avoiding implementation-specific assumptions (such as internal database table schemas or specific frontend state management libraries).
4. **Concrete Pass Criteria:** Each criterion defines unambiguous conditions answering: *"When does this test PASS?"*

---

## 2. Specification Format and Test Classification

All acceptance criteria are formulated using the standardized **Given / When / Then** format:
- **Given [Context / Preconditions]:** The initial system state, database fixtures, authenticated user identity, role privileges, and domain constraints prior to test execution.
- **When [Action / Trigger]:** The specific event, user action, input submission, or background scheduled routine being tested.
- **Then [Observable Outcome]:** The measurable, verifiable response of the system, including UI updates, domain state transitions, data persistence, and error/status notifications.

### Test Classification Categories
- **Happy Path:** Normal operational workflows executing with valid inputs under standard conditions.
- **Negative Path:** System handling of invalid inputs, unauthorized actions, policy violations, or error conditions with descriptive user feedback.
- **Boundary Condition:** Verification of operational limits (e.g., maximum active loans = 3, maximum reservations = 2, renewal limit = 1, hold window = 72 hours, pagination size = 10).
- **Role & Permission (RBAC):** Enforcement of Role-Based Access Control restrictions across Reader, Librarian, and Administrator actors per `BR-10` and `NFR-04`.
- **State Transition:** Automated or manual lifecycle status progression for Book Copies, Loans, and Reservations.

---

## 3. Acceptance Criteria by Feature (F01–F07)

### 3.1 Feature F01: User Authentication & Role-Based Access Control

* **Scope:** Credential login, JWT session issuance, logout, user account status, and role-based endpoint protection for Reader, Librarian, and Administrator actors.
* **Target Requirements:** `FR-F01-01`, `FR-F01-02`, `FR-F01-03`, `FR-F01-04`.
* **Related Business Rules / Constraints:** `BR-10`, `NFR-03`, `NFR-04`.
* **Primary Screens:** `SCR-01` (Login), `SCR-02` (User Management), `SCR-11` (Reader Dashboard).

---

#### `AC-F01-01`: Valid Credential Authentication & Role-Based Session Redirection
* **Test Category:** Happy Path / Authentication
* **Related Requirements:** `FR-F01-01`, `FR-F01-02`, `BR-10`
* **Related Screen:** `SCR-01` $\rightarrow$ `SCR-11`
* **Specification:**
  * **Given** a registered user exists in the system with active account status, username `"reader_john"`, role `Reader`, and valid password `"Secret@123"`.
  * **When** the user navigates to the Login Screen (`SCR-01`), inputs username `"reader_john"` and password `"Secret@123"`, and clicks the "Sign In" button.
  * **Then** the system authenticates the user credentials against securely hashed storage (`NFR-03`), generates a signed JSON Web Token (JWT) containing the user ID and `Reader` role claim (`FR-F01-02`), stores the session token on the client, and automatically redirects the user to the Reader Personal Dashboard (`SCR-11`).
* **Test PASS Condition:** Authentication succeeds with HTTP 200, a valid JWT containing the `Reader` role claim is stored, and the user interface successfully navigates to `SCR-11` displaying the reader's welcome greeting.

---

#### `AC-F01-02`: Rejection of Invalid or Mismatched Credentials
* **Test Category:** Negative Path / Security
* **Related Requirements:** `FR-F01-01`, `NFR-03`, `NFR-08`
* **Related Screen:** `SCR-01`
* **Specification:**
  * **Given** an unauthenticated visitor on the Login Screen (`SCR-01`).
  * **When** the visitor submits an incorrect password for an existing account, or enters an unregistered username/email `"unknown_user@university.edu"`.
  * **Then** the system rejects authentication, refuses to generate a JWT session token, returns HTTP 401 Unauthorized, and displays a user-friendly generic error alert banner: `"Invalid username or password"`.
* **Test PASS Condition:** System returns HTTP 401 Unauthorized, client storage contains no authentication token, the login form remains visible with an error banner, and the message does not reveal whether the username or password was the invalid field (`NFR-03`).

---

#### `AC-F01-03`: Role-Based Access Control Denial on Protected Staff Endpoints
* **Test Category:** Role & Permission / Authorization
* **Related Requirements:** `FR-F01-02`, `BR-10`, `NFR-04`
* **Related Screen:** `SCR-02`, `SCR-07`, `SCR-08`
* **Specification:**
  * **Given** an authenticated user currently logged in with the `Reader` role.
  * **When** the user attempts to directly navigate to the Administrator User Management Screen (`SCR-02` / `/admin/users`) or issues a direct HTTP request to staff circulation endpoints (`POST /api/circulation/checkout`).
  * **Then** the system intercepts the request, verifies the JWT claims, detects insufficient role permissions (`BR-10`), denies access with HTTP 403 Forbidden (`NFR-04`), and redirects the browser to an Access Denied view without exposing administrative data or staff action controls.
* **Test PASS Condition:** API returns HTTP 403 Forbidden, no privileged data or actions are exposed, and the client displays an unauthorized access notice.

---

#### `AC-F01-04`: Authentication Rejection for Deactivated / Inactive User Accounts
* **Test Category:** Negative Path / Account Management
* **Related Requirements:** `FR-F01-01`, `FR-F01-04`
* **Related Screen:** `SCR-01`, `SCR-02`
* **Specification:**
  * **Given** a registered user account whose status has been transitioned to `Inactive` / deactivated by an Administrator via `SCR-02`.
  * **When** this deactivated user attempts to log in on `SCR-01` using their correct username and password.
  * **Then** the system verifies credentials but detects that account status is `Inactive`, blocks session creation, returns HTTP 403 Forbidden, and displays an account suspension alert: `"Your account has been deactivated. Please contact the library administration."`
* **Test PASS Condition:** No JWT session is issued, authentication fails, and the user interface explicitly communicates the account deactivation notice.

---

### 3.2 Feature F02: Book Catalog Management

* **Scope:** Catalog CRUD for Book Title bibliographic records (ISBN, Title, Author, Category, Publisher, Year), aggregate copy counts, and deletion referential integrity.
* **Target Requirements:** `FR-F02-01`, `FR-F02-02`, `FR-F02-03`, `FR-F02-04`.
* **Related Business Rules / Constraints:** `BR-09`, `BR-10`.
* **Primary Screens:** `SCR-03` (Catalog Management), `SCR-05` (Search & Browse), `SCR-06` (Book Details).

---

#### `AC-F02-01`: Librarian Creates New Book Title Record with Complete Metadata
* **Test Category:** Happy Path / Catalog CRUD
* **Related Requirements:** `FR-F02-01`, `FR-F02-04`, `BR-10`
* **Related Screen:** `SCR-03`
* **Specification:**
  * **Given** an authenticated Librarian viewing the Book Catalog Management Screen (`SCR-03`).
  * **When** the Librarian inputs a unique 13-digit ISBN (`"978-0132350884"`), Title (`"Clean Code"`), Author (`"Robert C. Martin"`), Category (`"Computer Science"`), Publisher (`"Prentice Hall"`), and Publication Year (`2008`), and clicks "Save Title".
  * **Then** the system validates the metadata fields, persists the new Book Title in the catalog database, displays a success confirmation toast notification, adds the record to the catalog list table, and initializes the aggregated copy statistics to Total: `0`, Available: `0`, Borrowed: `0`, Reserved: `0` (`FR-F02-04`).
* **Test PASS Condition:** System returns HTTP 201 Created, the Book Title appears in catalog searches on `SCR-05`, and the detail view on `SCR-06` displays identical bibliographic metadata with all copy counters initialized to 0.

---

#### `AC-F02-02`: Rejection of Duplicate ISBN Registration
* **Test Category:** Negative Path / Data Integrity
* **Related Requirements:** `FR-F02-01`
* **Related Screen:** `SCR-03`
* **Specification:**
  * **Given** an existing Book Title record already registered in the catalog with ISBN `"978-0132350884"`.
  * **When** a Librarian attempts to register another Book Title using the identical ISBN `"978-0132350884"` on `SCR-03`.
  * **Then** the system detects the unique constraint conflict on the ISBN field, aborts record creation, returns HTTP 409 Conflict, and displays an inline validation error: `"A book title with this ISBN already exists in the catalog."`
* **Test PASS Condition:** System returns HTTP 409 Conflict, no duplicate record is created in the database, the original catalog entry remains untouched, and an explanatory validation error is rendered on the form.

---

#### `AC-F02-03`: Deletion Rejection for Book Title with Existing Physical Copies
* **Test Category:** Boundary / Referential Integrity
* **Related Requirements:** `FR-F02-03`, `BR-09`
* **Related Screen:** `SCR-03`
* **Specification:**
  * **Given** an existing Book Title that has one or more registered physical Book Copies in inventory (e.g., 2 physical copies, whether in `Available`, `Damaged`, or other states).
  * **When** an authenticated Librarian clicks the "Delete" action button for this Book Title on `SCR-03`.
  * **Then** the system checks referential integrity per `BR-09`, blocks the deletion transaction, returns HTTP 409 Conflict, and displays an error modal: `"Cannot delete book title: Active physical copies exist in inventory. Decommission or delete all associated book copies before removing this title."`
* **Test PASS Condition:** Deletion transaction is aborted, the Book Title remains fully intact in the database and catalog, and the user interface prevents cascading deletion.

---

#### `AC-F02-04`: Unauthorized Catalog Modification Attempt by Reader
* **Test Category:** Role & Permission / Authorization
* **Related Requirements:** `FR-F02-01`, `FR-F02-02`, `BR-10`
* **Related Screen:** `SCR-03`
* **Specification:**
  * **Given** an authenticated user logged in with the `Reader` role.
  * **When** the user attempts to send an HTTP POST, PUT, or DELETE request to the catalog management API (`/api/catalog/titles`).
  * **Then** the system denies the request, returns HTTP 403 Forbidden per `BR-10`, and makes no modifications to catalog data.
* **Test PASS Condition:** HTTP 403 Forbidden is returned, database remains unmodified, and the reader web client exposes no catalog editing or deletion interface elements.

---

### 3.3 Feature F03: Book Copy Inventory Management

* **Scope:** Physical copy inventory registration, unique barcode assignment, shelf location tracking, copy condition notes, lifecycle state management (`Available`, `Borrowed`, `Reserved`, `Damaged`/`Lost`), and decommissioning restrictions.
* **Target Requirements:** `FR-F03-01`, `FR-F03-02`, `FR-F03-03`, `FR-F03-04`.
* **Related Business Rules / Constraints:** `BR-09`, `BR-10`.
* **Primary Screens:** `SCR-04` (Book Copy Inventory), `SCR-06` (Book Details).

---

#### `AC-F03-01`: Librarian Registers Physical Book Copy with Unique Barcode
* **Test Category:** Happy Path / Copy Registration
* **Related Requirements:** `FR-F03-01`, `FR-F03-03`, `FR-F02-04`, `BR-10`
* **Related Screen:** `SCR-04`
* **Specification:**
  * **Given** an existing Book Title in the catalog and an authenticated Librarian on the Book Copy Management Screen (`SCR-04`).
  * **When** the Librarian inputs a unique Barcode / Copy ID `"BC-CS-00101"`, selects Shelf Location `"Floor 2, Shelf A-03"`, inputs optional condition notes `"Brand new copy"`, and clicks "Add Copy".
  * **Then** the system persists the physical copy linked to the parent Book Title, initializes its lifecycle status as `Available` (`FR-F03-03`), displays the new copy in the inventory table, and increments the parent title's Total Copies and Available Copies counters by exactly 1 (`FR-F02-04`).
* **Test PASS Condition:** System returns HTTP 201 Created, the copy is stored with status `Available` and assigned shelf location, and copy counters for the title increment by 1.

---

#### `AC-F03-02`: Decommissioning Blocked on Borrowed or Reserved Book Copy
* **Test Category:** Negative Path / State Conflict
* **Related Requirements:** `FR-F03-04`, `BR-09`
* **Related Screen:** `SCR-04`
* **Specification:**
  * **Given** a physical Book Copy currently in `Borrowed` status (linked to an active loan) or in `Reserved` status (allocated to a holding reader).
  * **When** an authenticated Librarian attempts to delete or decommission this Book Copy on `SCR-04`.
  * **Then** the system evaluates copy lifecycle status per `BR-09`, disables/rejects the decommission operation, returns HTTP 409 Conflict, and displays an alert: `"Cannot decommission copy: This copy is currently in circulation (Borrowed or Reserved) and cannot be removed until returned or released."`
* **Test PASS Condition:** The decommissioning request is rejected with HTTP 409, the copy record remains unchanged in the database, and its active circulation relationship is preserved.

---

#### `AC-F03-03`: Unauthorized Copy Inventory Modification by Reader
* **Test Category:** Role & Permission / Authorization
* **Related Requirements:** `FR-F03-01`, `BR-10`
* **Related Screen:** `SCR-04`
* **Specification:**
  * **Given** an authenticated user logged in with the `Reader` role.
  * **When** the user attempts to navigate to the Book Copy Inventory Management Screen (`SCR-04`) or submits an HTTP POST/PUT/DELETE request to `/api/catalog/copies`.
  * **Then** the system rejects the operation, returns HTTP 403 Forbidden per `BR-10`, and leaves copy inventory records unchanged.
* **Test PASS Condition:** HTTP 403 Forbidden is returned, no copy inventory data is modified, and the reader UI does not display copy administration controls.

---

#### `AC-F03-04`: Rejection of Duplicate Barcode / Copy ID Registration
* **Test Category:** Boundary / Negative Path / Uniqueness Constraint
* **Related Requirements:** `FR-F03-01`
* **Related Screen:** `SCR-04`
* **Specification:**
  * **Given** an existing Book Copy already registered in the system with Barcode / Copy ID `"BC-CS-00101"`.
  * **When** a Librarian attempts to register a new Book Copy under any Book Title using the identical Barcode / Copy ID `"BC-CS-00101"` on `SCR-04`.
  * **Then** the system detects a barcode uniqueness collision, rejects the registration, returns HTTP 409 Conflict, and displays a validation message: `"Barcode / Copy ID already exists. Each physical copy must possess a unique identifier."`
* **Test PASS Condition:** HTTP 409 Conflict is returned, no duplicate copy is created, and the total copy count in the system remains unchanged.

---

### 3.4 Feature F04: Book Search & Browse

* **Scope:** Multi-attribute keyword search (Title, Author, Category, ISBN), filtering (Category, Real-time Availability), sorting (Title, Year), server-side pagination, and real-time copy availability counts.
* **Target Requirements:** `FR-F04-01`, `FR-F04-02`, `FR-F04-03`, `FR-F04-04`.
* **Related Business Rules / Constraints:** `NFR-01`, `NFR-07`, `NFR-08`.
* **Primary Screens:** `SCR-05` (Search & Browse), `SCR-06` (Book Details).

---

#### `AC-F04-01`: Multi-Attribute Keyword Search with Real-Time Copy Counters
* **Test Category:** Happy Path / Search Performance
* **Related Requirements:** `FR-F04-01`, `FR-F04-03`, `NFR-01`
* **Related Screen:** `SCR-05`
* **Specification:**
  * **Given** a seeded catalog containing up to 10,000 book records and any visitor (Reader, Librarian, or Guest) on the Search & Browse Screen (`SCR-05`).
  * **When** the user inputs a keyword matching a Title (`"Algorithms"`), Author (`"Cormen"`), Category (`"Computer Science"`), or ISBN (`"978-0262033848"`) and clicks "Search".
  * **Then** the system queries the catalog, returns matching Book Title records within $\le 1.0$ second at P95 (`NFR-01`), and renders book cards on `SCR-05` displaying Title, Author, Category, Publication Year, Shelf Location, and real-time Available Copy counts.
* **Test PASS Condition:** Response payload returns within $\le 1000\text{ ms}$, matching records contain the searched keyword, and displayed available copy counts accurately reflect active copy statuses in the database.

---

#### `AC-F04-02`: Multi-Criteria Filtering by Category and Availability Status
* **Test Category:** Happy Path / Catalog Filtering
* **Related Requirements:** `FR-F04-02`, `FR-F04-03`
* **Related Screen:** `SCR-05`
* **Specification:**
  * **Given** search results displaying books across various categories and availability states on `SCR-05`.
  * **When** the user selects Category filter `"Database Systems"` and toggles the Availability filter chip to `"Available Now"`.
  * **Then** the system filters catalog records and re-renders the result list displaying exclusively books belonging to `"Database Systems"` that have Available Copies $\ge 1$, filtering out books with 0 available copies.
* **Test PASS Condition:** All rendered book cards match Category `"Database Systems"`, each card displays Available Copies $\ge 1$, and titles with zero available copies are excluded from the view.

---

#### `AC-F04-03`: Graceful Handling of Zero-Result Search Queries
* **Test Category:** Negative Path / Usability
* **Related Requirements:** `FR-F04-01`, `NFR-08`
* **Related Screen:** `SCR-05`
* **Specification:**
  * **Given** a user searching the catalog on `SCR-05`.
  * **When** the user executes a search query with terms that do not match any bibliographic catalog records (e.g., `"XYZNonExistentKeyword999"`).
  * **Then** the system completes the query cleanly, returns HTTP 200 with an empty data payload (`[]`), renders a clear empty state message on `SCR-05`: `"No books found matching your criteria. Try adjusting your keywords or clearing active filters."`, and does not crash or throw unhandled exceptions (`NFR-08`).
* **Test PASS Condition:** HTTP 200 is returned with empty result array, the user interface displays the designated empty-state component, and browser console displays zero JavaScript runtime errors.

---

#### `AC-F04-04`: Server-Side Pagination Boundary at 10 Records Per Page
* **Test Category:** Boundary / Pagination
* **Related Requirements:** `FR-F04-04`, `NFR-01`
* **Related Screen:** `SCR-05`
* **Specification:**
  * **Given** a catalog query that yields exactly 25 matching Book Titles.
  * **When** the user views the Search & Browse Screen (`SCR-05`).
  * **Then** the system requests and displays page 1 containing exactly 10 records (records 1–10 per `FR-F04-04`), displays pagination controls showing `"Page 1 of 3 (25 results)"`, and upon clicking "Page 2", fetches and renders exactly records 11–20 without full page reload.
* **Test PASS Condition:** Initial API payload contains `page=1`, `limit=10`, exactly 10 records are rendered, and navigation to page 2 fetches the next 10 items without client-side lag.

---

### 3.5 Feature F05: Borrow & Return Management (Circulation Desk)

* **Scope:** Librarian checkout, loan limit enforcement (max 3), overdue borrowing suspension, automatic 14-day due date calculation, return check-in, routing to FIFO hold shelf (72h pickup window) or restoring to Available, and single 14-day loan renewal.
* **Target Requirements:** `FR-F05-01`, `FR-F05-02`, `FR-F05-03`, `FR-F05-04`, `FR-F05-05`, `FR-F05-06`, `FR-F05-07`.
* **Related Business Rules / Constraints:** `BR-01`, `BR-02`, `BR-03`, `BR-04`, `BR-07`, `BR-08`, `BR-10`, `NFR-05`.
* **Primary Screens:** `SCR-07` (Circulation Borrow), `SCR-08` (Circulation Return), `SCR-11` (Reader Dashboard).

---

#### `AC-F05-01`: Standard Loan Checkout and Due Date Calculation
* **Test Category:** Happy Path / Circulation Checkout
* **Related Requirements:** `FR-F05-01`, `FR-F05-03`, `BR-01`, `BR-02`, `BR-10`
* **Related Screen:** `SCR-07`
* **Specification:**
  * **Given** an authenticated Librarian on `SCR-07`, an active Reader with fewer than 3 active loans (`0`, `1`, or `2`) and zero overdue loans, and a physical Book Copy with status `Available`.
  * **When** the Librarian inputs the Reader ID and scans/enters the Copy Barcode ID, and clicks "Confirm Checkout".
  * **Then** the system creates an active Loan record, sets Due Date exactly equal to checkout date $+$ 14 calendar days (`BR-02`), transitions the Book Copy lifecycle status from `Available` to `Borrowed`, and increments the Reader's active loan count by 1.
* **Test PASS Condition:** HTTP 201 Created is returned, the new Loan record has status `Active`, calculated Due Date is checkout date $+ 14$ days, copy status in the database is `Borrowed`, and copy Available count decrements by 1.

---

#### `AC-F05-02`: Checkout Rejection at Maximum Loan Limit Boundary (Limit = 3)
* **Test Category:** Boundary / Business Rule Enforcement
* **Related Requirements:** `FR-F05-02`, `BR-01`
* **Related Screen:** `SCR-07`
* **Specification:**
  * **Given** an active Reader who currently holds exactly 3 active (unreturned) loans (the maximum active loan threshold established by `BR-01`).
  * **When** a Librarian attempts to checkout a 4th Book Copy for this Reader on `SCR-07`.
  * **Then** the system checks reader loan eligibility, detects loan saturation ($3 \ge 3$), aborts the transaction, returns HTTP 422 Unprocessable Entity, displays an error alert: `"Checkout blocked: Reader has reached the maximum borrowing limit of 3 active loans per BR-01"`, and keeps the requested Book Copy in `Available` status.
* **Test PASS Condition:** Transaction is rejected with HTTP 422, no loan record is created, the reader's active loan count remains 3, and the physical copy remains `Available`.

---

#### `AC-F05-03`: Checkout Rejection Due to Overdue Borrowing Suspension
* **Test Category:** Negative Path / Circulation Policy
* **Related Requirements:** `FR-F05-02`, `BR-04`
* **Related Screen:** `SCR-07`
* **Specification:**
  * **Given** an active Reader who has at least one active Loan where the current date exceeds the Due Date (an Overdue loan per `BR-04`), and a Book Copy with status `Available`.
  * **When** a Librarian initiates checkout for this Reader on `SCR-07`.
  * **Then** the system evaluates patron delinquency status, rejects checkout, returns HTTP 422 Unprocessable Entity, displays a suspension banner: `"Checkout suspended: Reader has overdue book loans. All overdue items must be returned before new loans can be issued per BR-04"`, and leaves the Book Copy in `Available` status.
* **Test PASS Condition:** Checkout fails with HTTP 422, the reader is flagged with borrowing suspension on `SCR-07`, and no loan record is generated.

---

#### `AC-F05-04`: Book Return Processing without Pending Reservations
* **Test Category:** Happy Path / Circulation Return
* **Related Requirements:** `FR-F05-04`, `FR-F05-05`
* **Related Screen:** `SCR-08`
* **Specification:**
  * **Given** an active Loan for a physical Book Copy where the parent Book Title has zero pending reservations in its FIFO queue.
  * **When** an authenticated Librarian enters the Copy Barcode ID on `SCR-08` and confirms return check-in.
  * **Then** the system updates the Loan record status to `Returned`, records the check-in timestamp, transitions the Book Copy status from `Borrowed` to `Available` (`FR-F05-05`), decrements the reader's active loan count by 1, and displays a success notification: `"Book returned successfully. Status restored to Available."`
* **Test PASS Condition:** Loan status updates to `Returned`, return timestamp is persisted, Book Copy status transitions to `Available`, and title's Available Copies count increments by 1.

---

#### `AC-F05-05`: Book Return Processing with Pending FIFO Reservation (72-Hour Hold Routing)
* **Test Category:** Happy Path / State Transition / Hold Routing
* **Related Requirements:** `FR-F05-04`, `FR-F05-05`, `BR-07`, `BR-08`
* **Related Screen:** `SCR-08`, `SCR-10`
* **Specification:**
  * **Given** an active Loan for a physical Book Copy where the parent Book Title has 1 or more pending reservations in its FIFO queue (`BR-07`).
  * **When** a Librarian processes the return check-in for this copy on `SCR-08`.
  * **Then** the system marks the current Loan as `Returned`, transitions the Book Copy lifecycle status from `Borrowed` to `Reserved` (not `Available`), allocates the copy to the first Reader in the FIFO queue, sets the Hold Pickup Deadline equal to return timestamp $+$ 72 hours (3 calendar days per `BR-08`), and displays a hold shelf routing instruction: `"Hold Shelf Routing: Place book on hold shelf for Reader [Reader Name] (Hold expires in 72 hours)."`
* **Test PASS Condition:** Copy status transitions to `Reserved`, the top reservation updates from `Pending` to `Ready for Pickup`, pickup window deadline equals return timestamp $+ 72\text{ hours}$, and general circulation checkout of this copy is blocked for other patrons.

---

#### `AC-F05-06`: Loan Renewal Permitted Exactly Once and Blocked on Subsequent Attempt
* **Test Category:** Boundary / Loan Renewal Policy
* **Related Requirements:** `FR-F05-06`, `BR-03`
* **Related Screen:** `SCR-07`, `SCR-11`
* **Specification:**
  * **Given** an active Loan that is not overdue, has renewal count = 0, and has zero pending reservations on its parent Book Title (`BR-03`).
  * **When** the Reader (on `SCR-11`) or Librarian (on `SCR-07`) submits a renewal request.
  * **Then** the system extends the Due Date by exactly 14 calendar days (new Due Date = current Due Date $+ 14$ days), increments renewal count to 1, and updates the display; AND if a second renewal is attempted on the same loan record, the system rejects the request with HTTP 422 and displays: `"Loan renewal limit reached: Maximum 1 renewal permitted per loan per BR-03."`
* **Test PASS Condition:** First renewal succeeds, extending Due Date by 14 days and recording renewal count = 1; second renewal attempt is blocked with HTTP 422 error banner.

---

#### `AC-F05-07`: Unauthorized Circulation Desk Operations Attempted by Reader
* **Test Category:** Role & Permission / Authorization
* **Related Requirements:** `FR-F05-01`, `FR-F05-04`, `BR-10`
* **Related Screen:** `SCR-07`, `SCR-08`
* **Specification:**
  * **Given** an authenticated user logged in with the `Reader` role.
  * **When** the user attempts to directly call circulation desk checkout (`POST /api/circulation/checkout`) or return (`POST /api/circulation/return`) API endpoints.
  * **Then** the system blocks the request, returns HTTP 403 Forbidden per `BR-10`, and performs zero loan or copy state modifications.
* **Test PASS Condition:** HTTP 403 Forbidden is returned, database remains unmodified, and reader client provides no access to circulation desk interfaces.

---

### 3.6 Feature F06: Book Reservation (Hold Processing)

* **Scope:** Title-level reservation when 0 copies available, max 2 active reservations limit, strict FIFO queue ordering, 72-hour pickup window assignment, hold expiration, and cancellation.
* **Target Requirements:** `FR-F06-01`, `FR-F06-02`, `FR-F06-03`, `FR-F06-04`, `FR-F06-05`, `FR-F06-06`.
* **Related Business Rules / Constraints:** `BR-04`, `BR-05`, `BR-06`, `BR-07`, `BR-08`, `BR-10`.
* **Primary Screens:** `SCR-06` (Book Details), `SCR-09` (Reservation Modal), `SCR-10` (Hold Shelf Management), `SCR-11` (Reader Dashboard).

---

#### `AC-F06-01`: Eligible Reader Places Reservation on Title with Zero Available Copies
* **Test Category:** Happy Path / Reservation Creation
* **Related Requirements:** `FR-F06-01`, `FR-F06-03`, `BR-05`, `BR-07`
* **Related Screen:** `SCR-06` $\rightarrow$ `SCR-09`
* **Specification:**
  * **Given** an active Reader with fewer than 2 active reservations, 0 overdue loans, and no active loan for Book Title `"Database Systems"`, where the Book Title currently has Total Copies $\ge 1$ and Available Copies $= 0$ (all copies are `Borrowed` or `Reserved`).
  * **When** the Reader views the Book Detail Screen (`SCR-06`), clicks the enabled "Reserve Book" button, and confirms the request on the Reservation Modal (`SCR-09`).
  * **Then** the system creates a Reservation record with status `Pending`, appends the record to the end of the FIFO queue based on creation timestamp (`BR-07`), increments the reader's active reservation count by 1, and displays a confirmation message with the assigned queue position (e.g., `"Reservation confirmed. You are #1 in line for this title."`).
* **Test PASS Condition:** HTTP 201 Created is returned, a `Pending` reservation record exists with timestamp, and reader's active reservation count increments by 1.

---

#### `AC-F06-02`: Reservation Request Rejection When Available Copies Exist on Shelf
* **Test Category:** Negative Path / Policy Enforcement
* **Related Requirements:** `FR-F06-01`, `BR-05`
* **Related Screen:** `SCR-06`
* **Specification:**
  * **Given** a Book Title that currently has Available Copies $\ge 1$ (at least one physical copy is present on the library shelf with status `Available`).
  * **When** a Reader views `SCR-06` or attempts to submit an API reservation request for this Book Title.
  * **Then** the system disables the "Reserve Book" button on `SCR-06` (or returns HTTP 422 on API submission), and displays an informational message: `"Reservation not permitted: Physical copies are available on the shelf. Please borrow directly at the circulation desk per BR-05."`
* **Test PASS Condition:** Reservation creation is blocked, HTTP 422 is returned upon direct API attempt, and no reservation record is inserted.

---

#### `AC-F06-03`: Reservation Rejection at Maximum Active Reservations Boundary (Limit = 2)
* **Test Category:** Boundary / Reservation Limit
* **Related Requirements:** `FR-F06-02`, `BR-06`
* **Related Screen:** `SCR-06`, `SCR-09`
* **Specification:**
  * **Given** an active Reader who currently holds exactly 2 active reservations (status `Pending` or `Ready for Pickup` per `BR-06`).
  * **When** the Reader attempts to place a reservation on a 3rd zero-availability Book Title on `SCR-09`.
  * **Then** the system checks active reservation counts, detects limit saturation ($2 \ge 2$), rejects the request with HTTP 422 Unprocessable Entity, and displays an alert: `"Reservation blocked: You have reached the maximum limit of 2 active reservations per BR-06."`
* **Test PASS Condition:** System returns HTTP 422, no new reservation record is created, and the reader's active reservation count remains 2.

---

#### `AC-F06-04`: Hold Window Expiration After 72 Hours Advances FIFO Queue or Restores Availability
* **Test Category:** Boundary / Lifecycle State Progression
* **Related Requirements:** `FR-F06-04`, `FR-F06-05`, `BR-07`, `BR-08`
* **Related Screen:** `SCR-10`
* **Specification:**
  * **Given** a physical Book Copy in `Reserved` status on the hold shelf with an assigned pickup deadline that has passed (current timestamp $>$ pickup deadline $=$ allocation timestamp $+ 72\text{ hours}$ per `BR-08`).
  * **When** the automated hold expiration routine executes (or Librarian triggers expiration on `SCR-10`).
  * **Then** the system marks the delinquent patron's reservation as `Expired`, and:
    * **Scenario A (Waiting Queue Non-Empty):** If other patrons are waiting in the FIFO queue for this Book Title, the system allocates the copy to the next patron in line, transitions their reservation to `Ready for Pickup`, and resets the pickup window to a fresh 72 hours; OR
    * **Scenario B (Waiting Queue Empty):** If no other reservations exist for this Book Title, the system transitions the Book Copy lifecycle status from `Reserved` to `Available`, restoring general circulation eligibility.
* **Test PASS Condition:** Delinquent reservation status updates to `Expired`, and the Book Copy either advances to the next FIFO patron with a new 72-hour window or transitions to `Available`.

---

#### `AC-F06-05`: Reservation Rejection for Book Title Already Borrowed by Reader
* **Test Category:** Negative Path / Policy Conflict
* **Related Requirements:** `FR-F06-02`, `BR-05`
* **Related Screen:** `SCR-06`, `SCR-09`
* **Specification:**
  * **Given** an active Reader who currently holds an active (unreturned) Loan for a copy of Book Title `"Software Architecture in Practice"`.
  * **When** this Reader attempts to place a reservation for the same Book Title `"Software Architecture in Practice"` on `SCR-06` / `SCR-09`.
  * **Then** the system detects that the user currently possesses an active borrowing of this title, rejects the reservation request, returns HTTP 422 Unprocessable Entity, and displays a conflict message: `"You cannot reserve a book title you currently have on loan per BR-05."`
* **Test PASS Condition:** System returns HTTP 422, no reservation record is inserted, and patron cannot place duplicate claims on titles they currently possess.

---

### 3.7 Feature F07: Reader Overdue & Loan Monitoring Dashboard (Should-Have)

* **Scope:** Reader self-service dashboard for active loans, due dates, renewal actions, active reservations, and overdue warnings; Librarian overdue tracking console.
* **Target Requirements:** `FR-F07-01`, `FR-F07-02`, `FR-F07-03`.
* **Related Business Rules / Constraints:** `BR-01`, `BR-03`, `BR-04`, `BR-06`.
* **Primary Screens:** `SCR-11` (Reader Dashboard), `SCR-12` (Librarian Overdue Monitoring).

---

#### `AC-F07-01`: Reader Dashboard Renders Active Circulation Statuses and Overdue Alerts
* **Test Category:** Happy Path / Self-Service Dashboard
* **Related Requirements:** `FR-F07-01`, `FR-F07-02`
* **Related Screen:** `SCR-11`
* **Specification:**
  * **Given** an authenticated Reader with 2 active loans (one standard, one overdue) and 1 pending reservation.
  * **When** the Reader opens their Personal Dashboard (`SCR-11`).
  * **Then** the system renders an Active Loans table showing Book Titles, checkout dates, due dates, and remaining days, renders a prominent red warning banner for the overdue loan, disables borrowing indicators per `BR-04`, and renders an Active Reservations tab displaying title, queue position, and status.
* **Test PASS Condition:** All active loans and reservations appear accurately on `SCR-11`, the overdue loan is highlighted with prominent visual alert, and borrowing restriction notice is rendered.

---

#### `AC-F07-02`: Librarian Overdue Console Displays Delinquent Loans Sorted by Days Overdue
* **Test Category:** Happy Path / Administrative Monitoring
* **Related Requirements:** `FR-F07-03`
* **Related Screen:** `SCR-12`
* **Specification:**
  * **Given** an authenticated Librarian viewing the Overdue Monitoring Screen (`SCR-12`) and several loans whose Due Dates have passed without return check-in.
  * **When** the screen loads or the Librarian applies the "All Overdue" filter.
  * **Then** the system queries all unreturned loans where current date $>$ Due Date, calculates days overdue for each record, and displays the delinquent records in descending order of days overdue, showing Reader Name, Student ID, Email, Book Title, Copy Barcode, and original Due Date.
* **Test PASS Condition:** Screen renders all active loans with Due Date $<$ today, sorted by days overdue descending, with complete patron contact details and copy identifiers.

---

## 4. Master Acceptance Criteria Summary Table

The following matrix consolidates all acceptance criteria, cross-referencing feature modules, test categories, functional requirements, business rules, and pass verification criteria.

| AC ID | Feature | Test Category | Target Actor | Summary Description | Related FRs | Related BRs / NFRs | Pass Verification Criterion |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **`AC-F01-01`** | F01 | Happy Path | Reader | Valid login returns JWT and navigates to Reader Dashboard | `FR-F01-01`, `FR-F01-02` | `BR-10`, `NFR-03` | HTTP 200, JWT returned, lands on `SCR-11` |
| **`AC-F01-02`** | F01 | Negative Path | Visitor | Invalid credentials rejected with generic error | `FR-F01-01` | `NFR-03`, `NFR-08` | HTTP 401, no token issued, error banner |
| **`AC-F01-03`** | F01 | Role & Permission | Reader | Reader denied access to Admin/Circulation endpoints | `FR-F01-02` | `BR-10`, `NFR-04` | HTTP 403 Forbidden, staff UI inaccessible |
| **`AC-F01-04`** | F01 | Negative / Boundary | Deactivated | Deactivated user account login blocked | `FR-F01-01`, `FR-F01-04` | `NFR-04` | HTTP 403/401, suspension notice displayed |
| **`AC-F02-01`** | F02 | Happy Path | Librarian | Librarian creates Book Title with complete metadata | `FR-F02-01`, `FR-F02-04` | `BR-10` | HTTP 201, title in catalog, counters = 0 |
| **`AC-F02-02`** | F02 | Negative Path | Librarian | Duplicate ISBN creation rejected | `FR-F02-01` | Data Integrity | HTTP 409 Conflict, duplicate blocked |
| **`AC-F02-03`** | F02 | Boundary / Integrity | Librarian | Title deletion blocked while physical copies exist | `FR-F02-03` | `BR-09` | HTTP 409 Conflict, title record preserved |
| **`AC-F02-04`** | F02 | Role & Permission | Reader | Reader prohibited from mutating catalog titles | `FR-F02-01`, `FR-F02-02` | `BR-10`, `NFR-04` | HTTP 403 Forbidden, no catalog mutation |
| **`AC-F03-01`** | F03 | Happy Path | Librarian | Register physical copy with unique barcode & shelf | `FR-F03-01`, `FR-F03-03` | `FR-F02-04`, `BR-10` | HTTP 201, copy status `Available`, count +1 |
| **`AC-F03-02`** | F03 | Negative Path | Librarian | Decommissioning blocked on Borrowed or Reserved copy | `FR-F03-04` | `BR-09` | HTTP 409 Conflict, copy status intact |
| **`AC-F03-03`** | F03 | Role & Permission | Reader | Reader prohibited from modifying copy inventory | `FR-F03-01` | `BR-10`, `NFR-04` | HTTP 403 Forbidden, inventory unaffected |
| **`AC-F03-04`** | F03 | Boundary / Negative | Librarian | Duplicate Barcode / Copy ID registration rejected | `FR-F03-01` | Unique Key | HTTP 409 Conflict, barcode duplicate error |
| **`AC-F04-01`** | F04 | Happy Path | All Users | Multi-attribute search returns results in $\le 1.0\text{s}$ | `FR-F04-01`, `FR-F04-03` | `NFR-01` | Response $\le 1000\text{ ms}$, real-time copy counts |
| **`AC-F04-02`** | F04 | Happy Path / Filter | All Users | Category and "Available Now" filters filter results | `FR-F04-02`, `FR-F04-03` | Search Filter | Rendered items match category & available $\ge 1$ |
| **`AC-F04-03`** | F04 | Negative Path | All Users | Non-matching search displays empty state without error | `FR-F04-01` | `NFR-08` | HTTP 200, empty list `[]`, UI empty banner |
| **`AC-F04-04`** | F04 | Boundary | All Users | Server pagination enforces 10 items/page limit | `FR-F04-04` | `NFR-01` | Exactly 10 items/page, page 2 loads 11–20 |
| **`AC-F05-01`** | F05 | Happy Path | Librarian | Standard checkout creates loan with Due Date $= +14\text{d}$ | `FR-F05-01`, `FR-F05-03` | `BR-01`, `BR-02` | HTTP 201, copy `Borrowed`, Due Date $+14\text{d}$ |
| **`AC-F05-02`** | F05 | Boundary / Negative | Librarian | 4th checkout blocked when active loans $= 3$ | `FR-F05-02` | `BR-01` | HTTP 422, loan count remains 3, copy free |
| **`AC-F05-03`** | F05 | Negative Path | Librarian | Checkout blocked when reader has $\ge 1$ overdue loan | `FR-F05-02` | `BR-04` | HTTP 422, suspension message, copy free |
| **`AC-F05-04`** | F05 | Happy Path | Librarian | Book return updates loan to Returned and copy to Available | `FR-F05-04`, `FR-F05-05` | Circulation | Loan `Returned`, copy `Available`, loan count -1 |
| **`AC-F05-05`** | F05 | State Transition | Librarian | Returned copy with holds routes to hold shelf (72h) | `FR-F05-04`, `FR-F05-05` | `BR-07`, `BR-08` | Copy `Reserved`, hold window $= 72\text{h}$, top FIFO |
| **`AC-F05-06`** | F05 | Boundary | Reader/Staff | Loan renewed once (+14d); 2nd renewal blocked | `FR-F05-06` | `BR-03` | 1st renewal Due Date $+14\text{d}$; 2nd returns HTTP 422 |
| **`AC-F05-07`** | F05 | Role & Permission | Reader | Reader prohibited from performing checkout/check-in | `FR-F05-01`, `FR-F05-04` | `BR-10`, `NFR-04` | HTTP 403 Forbidden, circulation blocked |
| **`AC-F06-01`** | F06 | Happy Path | Reader | Reservation placed on title with 0 available copies | `FR-F06-01`, `FR-F06-03` | `BR-05`, `BR-07` | HTTP 201, `Pending` record, FIFO position assigned |
| **`AC-F06-02`** | F06 | Negative Path | Reader | Reservation blocked when available copies $\ge 1$ | `FR-F06-01` | `BR-05` | HTTP 422, reservation action disabled |
| **`AC-F06-03`** | F06 | Boundary / Negative | Reader | 3rd reservation blocked when active reservations $= 2$ | `FR-F06-02` | `BR-06` | HTTP 422, reservation count remains 2 |
| **`AC-F06-04`** | F06 | Boundary / Lifecycle | System/Staff | Uncollected hold expires after 72h, advancing queue | `FR-F06-04`, `FR-F06-05` | `BR-07`, `BR-08` | Delinquent hold `Expired`; next patron gets 72h or `Available` |
| **`AC-F06-05`** | F06 | Negative Path | Reader | Reader cannot reserve title they currently borrow | `FR-F06-02` | `BR-05` | HTTP 422, duplicate title hold rejected |
| **`AC-F07-01`** | F07 | Happy Path | Reader | Reader dashboard renders active loans and overdue alerts | `FR-F07-01`, `FR-F07-02` | `BR-04` | `SCR-11` displays loans, due dates, alerts |
| **`AC-F07-02`** | F07 | Happy Path | Librarian | Overdue console renders delinquent loans sorted by days | `FR-F07-03` | `BR-04` | `SCR-12` lists overdue loans sorted descending |

---

## 5. Open Clarifications and Traceability Handoff

### 5.1 Open Clarifications (`[TBD]`)
The following operational clarifications have been identified during acceptance criteria formulation and will be reviewed during the Slot S3 internal review with BA (Nguyên) and Developer (Quân):
1. **`[TBD: Handling of Damaged Returns with Pending Holds]`**: When a physical Book Copy is returned in physically damaged condition (`Damaged`) but pending reservations exist in the FIFO queue, should the system route the damaged copy to maintenance and notify the next patron of a delay, or automatically route the reservation to the next available copy? *(Default proposed: copy transitions to `Damaged`, remaining unavailable for pickup, and reservation remains `Pending` until an undamaged copy is returned).*
2. **`[TBD: Overdue Calculation vs Database State]`**: Confirm whether `Overdue` is stored as an enumerated `loan_status` column in PostgreSQL updated by a daily cron job, or dynamically computed whenever `CURRENT_DATE > due_date AND return_date IS NULL`. *(Technical recommendation from Quân: compute dynamically in SQL view to guarantee real-time accuracy without cron synchronization lag).*
3. **`[TBD: Hold Expiration Trigger Mechanism]`**: Confirm whether hold pickup window expiration after 72 hours (`BR-08`) is triggered by a background timer worker, evaluated on-demand during circulation desk queries, or both. *(Technical recommendation: on-demand state evaluation upon copy query backed by an hourly cleanup job).*

### 5.2 Traceability and Next Steps
- **Forward Traceability to PA4:** The 30 acceptance criteria specified in this document provide the direct baseline for the Master Test Plan and Acceptance Test Case Suite in Phase PA4 (Tasks `PA4-V1` to `PA4-V4`).
- **Traceability to Master RTM (Task PA2-V4):** In Task `PA2-V4`, PM/Tester Vinh will map each `AC-F0x-nn` to its corresponding User Needs, Functional Requirements (`FR-F0x-nn`), Business Rules (`BR-nn`), and Screen Wireframes (`SCR-nn`).
- **Registry Synchronization:** The 11 newly elaborated acceptance criteria (`AC-F01-04`, `AC-F02-04`, `AC-F03-03`, `AC-F03-04`, `AC-F04-03`, `AC-F04-04`, `AC-F05-06`, `AC-F05-07`, `AC-F06-04`, `AC-F06-05`, and split boundary definitions) are proposed to the PM to increment `00-id-registry.md` to baseline version `v1.1.0`.

