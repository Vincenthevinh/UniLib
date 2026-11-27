"""
UniLib PA3 - Section 5: Object-Oriented Design
Strictly matching PA3-SoftwareDesign-template.docx format
"""

from docx.shared import Inches, Pt, RGBColor
from scripts.build_pa3_full import (
    add_heading_styled, add_paragraph_styled, add_bullet_point,
    add_figure_image, create_table_with_data
)

def build_section_oo_design(doc):
    add_heading_styled(doc, "Object-Oriented Design", level=1)
    
    add_heading_styled(doc, "Domain Model", level=2)
    add_paragraph_styled(doc, (
        "The conceptual Domain Model captures the core business entities of UniLib and their relationships in the problem domain. "
        "It reflects the frozen terminology and domain rules established in the PA2 glossary. The model comprises 6 primary concepts: "
        "User (with roles Reader, Librarian, Administrator), BookTitle (bibliographic catalog metadata identified by unique ISBN), "
        "BookCopy (physical inventory items identified by unique Barcode), Loan (circulation borrowing records), "
        "Reservation (patron title-level hold requests), and HoldShelf (staging area for allocated ready-for-pickup copies)."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/domain-model.png",
        "Figure 4.1: UniLib Conceptual Domain Model — Source: docs/design/uml/domain-model.dot"
    )

    add_heading_styled(doc, "Class Diagram", level=2)
    add_paragraph_styled(doc, (
        "The Design-Level Class Model translates domain concepts into software abstractions within the Layered Modular Monolith. "
        "Entity classes represent persistent state mapped to PostgreSQL tables via Prisma. Service classes encapsulate transaction-bound "
        "domain policies, while Controller classes mediate HTTP interactions."
    ))
    add_bullet_point(doc, "Entity Classes: User, BookTitle, BookCopy, Loan, Reservation.")
    add_bullet_point(doc, "Circulation Boundaries: A BookTitle aggregates 1..* BookCopies. A BookCopy participates in 0..* historical Loans and at most 1 active Loan. A Reader holds 0..3 active Loans (BR-01) and 0..2 active Reservations (BR-06).")
    add_bullet_point(doc, "Hold Queue Management: A Reservation is placed at the BookTitle level; when a copy is returned, it is conditionally linked to a specific heldCopyId and assigned to the HoldShelf for 72 hours (BR-08).")

    add_heading_styled(doc, "Class Specifications", level=2)
    add_paragraph_styled(doc, "Detailed specifications are provided for the 8 core classes governing system execution:")

    # C1: User
    add_heading_styled(doc, "Class C1: User", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Represents an authenticated system actor. Governs role-based authorization (BR-10) and account active status.")
    c1_attr_headers = ["#", "Attribute", "Type", "Visibility", "Constraint", "Description"]
    c1_attr_rows = [
        ["1", "id", "UUID", "private", "PK, default uuid()", "Unique global identifier for the user record."],
        ["2", "username", "String", "private", "UNIQUE, NOT NULL", "Unique alphanumeric user handle for authentication."],
        ["3", "email", "String", "private", "UNIQUE, NOT NULL", "Valid university email address."],
        ["4", "passwordHash", "String", "private", "NOT NULL", "Bcrypt hash (salt >= 10); never exposed in DTO responses."],
        ["5", "role", "Role (Enum)", "private", "Reader | Librarian | Admin", "System role defining permissions under RBAC."],
        ["6", "isActive", "Boolean", "private", "default true", "Account status flag; false blocks all logins and requests."]
    ]
    create_table_with_data(doc, c1_attr_headers, c1_attr_rows, col_widths=[Inches(0.4), Inches(1.1), Inches(1.0), Inches(0.8), Inches(1.3), Inches(2.2)], font_size=8.0)
    
    c1_op_headers = ["#", "Operation", "Parameters / return", "Visibility", "Description"]
    c1_op_rows = [
        ["1", "validatePassword", "password: string -> boolean", "public", "Compares raw password against passwordHash using bcryptjs."],
        ["2", "canBorrow", "loansCount: number, hasOverdue: boolean -> boolean", "public", "Evaluates BR-01 (count < 3) and BR-04 (!hasOverdue && isActive)."]
    ]
    create_table_with_data(doc, c1_op_headers, c1_op_rows, col_widths=[Inches(0.4), Inches(1.4), Inches(2.0), Inches(0.8), Inches(2.2)], font_size=8.0)

    # C2: BookTitle
    add_heading_styled(doc, "Class C2: BookTitle", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Represents a bibliographic catalog title. Tracks aggregated physical copy counts across all lifecycle states.")
    c2_attr_headers = ["#", "Attribute", "Type", "Visibility", "Constraint", "Description"]
    c2_attr_rows = [
        ["1", "id", "UUID", "private", "PK, default uuid()", "Unique identifier for the catalog entry."],
        ["2", "isbn", "String", "private", "UNIQUE, 10 or 13 digits", "International Standard Book Number."],
        ["3", "title", "String", "private", "NOT NULL", "Full title of the publication."],
        ["4", "author", "String", "private", "NOT NULL", "Author or primary contributor name(s)."],
        ["5", "category", "String", "private", "NOT NULL", "Academic subject classification."],
        ["6", "publicationYear", "Integer", "private", "SMALLINT, NOT NULL", "Year of publication."],
        ["7", "isActive", "Boolean", "private", "default true", "Catalog listing flag; deactivation blocked if active copies exist."]
    ]
    create_table_with_data(doc, c2_attr_headers, c2_attr_rows, col_widths=[Inches(0.4), Inches(1.1), Inches(1.0), Inches(0.8), Inches(1.3), Inches(2.2)], font_size=8.0)

    # C3: BookCopy
    add_heading_styled(doc, "Class C3: BookCopy", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Represents a physical circulating inventory item associated with a specific BookTitle.")
    c3_attr_headers = ["#", "Attribute", "Type", "Visibility", "Constraint", "Description"]
    c3_attr_rows = [
        ["1", "id", "UUID", "private", "PK, default uuid()", "Unique copy identifier."],
        ["2", "barcode", "String", "private", "UNIQUE, NOT NULL", "Physical barcode scanned at circulation desk."],
        ["3", "titleId", "UUID", "private", "FK -> BookTitle.id", "Reference to parent catalog record (onDelete: Restrict)."],
        ["4", "shelfLocation", "String", "private", "NOT NULL", "Physical shelf location code (e.g., QA76.73 .J39)."],
        ["5", "status", "CopyStatus", "private", "Enum, default Available", "Available | Borrowed | Reserved | Damaged | Lost."],
        ["6", "conditionNotes", "String?", "private", "Nullable text", "Librarian inspection remarks regarding physical wear."]
    ]
    create_table_with_data(doc, c3_attr_headers, c3_attr_rows, col_widths=[Inches(0.4), Inches(1.1), Inches(1.0), Inches(0.8), Inches(1.3), Inches(2.2)], font_size=8.0)

    # C4: Loan
    add_heading_styled(doc, "Class C4: Loan", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Records a circulation loan transaction linking a Reader and a BookCopy.")
    c4_attr_headers = ["#", "Attribute", "Type", "Visibility", "Constraint", "Description"]
    c4_attr_rows = [
        ["1", "id", "UUID", "private", "PK, default uuid()", "Unique loan transaction identifier."],
        ["2", "readerId", "UUID", "private", "FK -> User.id", "Borrowing reader (onDelete: Restrict)."],
        ["3", "copyId", "UUID", "private", "FK -> BookCopy.id", "Borrowed physical item (onDelete: Restrict)."],
        ["4", "checkedOutAt", "DateTime", "private", "timestamptz(3)", "Checkout instant (start of loan)."],
        ["5", "dueAt", "DateTime", "private", "timestamptz(3)", "Enforced deadline (checkedOutAt + 14 days under BR-02)."],
        ["6", "returnedAt", "DateTime?", "private", "Nullable timestamptz(3)", "Check-in instant; null denotes currently active loan."],
        ["7", "renewedAt", "DateTime?", "private", "Nullable timestamptz(3)", "Timestamp of single permitted renewal under BR-03."]
    ]
    create_table_with_data(doc, c4_attr_headers, c4_attr_rows, col_widths=[Inches(0.4), Inches(1.1), Inches(1.0), Inches(0.8), Inches(1.3), Inches(2.2)], font_size=8.0)

    # C5: Reservation
    add_heading_styled(doc, "Class C5: Reservation", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Represents a patron hold request queued at the BookTitle level with FIFO ordering.")
    c5_attr_headers = ["#", "Attribute", "Type", "Visibility", "Constraint", "Description"]
    c5_attr_rows = [
        ["1", "id", "UUID", "private", "PK, default uuid()", "Unique reservation record identifier."],
        ["2", "readerId", "UUID", "private", "FK -> User.id", "Patron placing hold (onDelete: Restrict)."],
        ["3", "titleId", "UUID", "private", "FK -> BookTitle.id", "Reserved catalog title (onDelete: Restrict)."],
        ["4", "heldCopyId", "UUID?", "private", "FK -> BookCopy.id", "Allocated copy when Ready; null while Pending."],
        ["5", "status", "ResStatus", "private", "Enum, default Pending", "Pending, Ready, Fulfilled, Cancelled, Expired."],
        ["6", "createdAt", "DateTime", "private", "timestamptz(3)", "Placement timestamp defining FIFO order (BR-07)."],
        ["7", "expiresAt", "DateTime?", "private", "Nullable timestamptz(3)", "Deadline for pickup (readyAt + 72 hours under BR-08)."]
    ]
    create_table_with_data(doc, c5_attr_headers, c5_attr_rows, col_widths=[Inches(0.4), Inches(1.1), Inches(1.0), Inches(0.8), Inches(1.3), Inches(2.2)], font_size=8.0)

    # C6: AuthService
    add_heading_styled(doc, "Class C6: AuthService", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Orchestrates user authentication, JWT generation, and account validation.")
    c6_op_headers = ["#", "Operation", "Parameters / return", "Visibility", "Description"]
    c6_op_rows = [
        ["1", "login", "usernameOrEmail, password -> {token, user}", "public", "Validates credentials, checks isActive, returns signed JWT."],
        ["2", "verifyToken", "token: string -> jwtPayload", "public", "Decodes HS256 JWT and verifies expiration timestamp."],
        ["3", "hashPassword", "plainText: string -> hash: string", "public", "Executes bcrypt salt rounds >= 10 hashing."]
    ]
    create_table_with_data(doc, c6_op_headers, c6_op_rows, col_widths=[Inches(0.4), Inches(1.4), Inches(2.0), Inches(0.8), Inches(2.2)], font_size=8.0)

    # C7: LoanService
    add_heading_styled(doc, "Class C7: LoanService", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Encapsulates circulation desk workflows and atomic state transitions for borrowing, returning, and renewals.")
    c7_op_headers = ["#", "Operation", "Parameters / return", "Visibility", "Description"]
    c7_op_rows = [
        ["1", "checkout", "readerId, barcode, librarianId -> Loan", "public", "Locks copy row, checks BR-01/02/04, fulfills ready hold if held, creates loan, marks copy Borrowed."],
        ["2", "returnBook", "barcode, condition -> {loan, copy, holdResult}", "public", "Locks loan & copy, sets returnedAt, inspects condition, calls allocateNextHold, updates copy status."],
        ["3", "renewLoan", "loanId, readerId -> Loan", "public", "Validates BR-03 (not overdue, !isRenewed, no pending reservations), extends dueAt by 14 days."]
    ]
    create_table_with_data(doc, c7_op_headers, c7_op_rows, col_widths=[Inches(0.4), Inches(1.4), Inches(2.0), Inches(0.8), Inches(2.2)], font_size=8.0)

    # C8: ReservationService
    add_heading_styled(doc, "Class C8: ReservationService", level=3)
    add_paragraph_styled(doc, "Superclass: None. Responsibility: Manages title-level reservation queuing, FIFO position tracking, hold allocation, and expiration sweeps.")
    c8_op_headers = ["#", "Operation", "Parameters / return", "Visibility", "Description"]
    c8_op_rows = [
        ["1", "placeReservation", "readerId, titleId -> {reservation, queuePosition}", "public", "Verifies BR-04/05/06, locks title row, inserts Pending reservation, computes FIFO position."],
        ["2", "allocateNextHold", "tx, titleId, copyId -> holdResult", "public", "Within return transaction, selects earliest Pending hold (createdAt ASC), sets Ready, expiresAt=now+72h, copy=Reserved."],
        ["3", "cancelReservation", "reservationId, readerId -> Reservation", "public", "Verifies patron ownership, transitions to Cancelled; if Ready, reallocates copy to next patron."],
        ["4", "sweepExpiredHolds", "now() -> expiredCount", "public", "Background timer job; sweeps Ready holds past expiresAt, reassigns copy to next FIFO patron or Available."]
    ]
    create_table_with_data(doc, c8_op_headers, c8_op_rows, col_widths=[Inches(0.4), Inches(1.4), Inches(2.0), Inches(0.8), Inches(2.2)], font_size=8.0)

    add_heading_styled(doc, "Sequence Diagrams", level=2)
    add_paragraph_styled(doc, (
        "Sequence Diagrams formalize the dynamic message exchanges between boundary controllers, domain services, "
        "and the Prisma data layer for 4 key circulation use cases (including alternative error and validation flows):"
    ))

    # UC-01
    add_heading_styled(doc, "UC-01: User Login & Token Issuance", level=3)
    add_paragraph_styled(doc, (
        "Illustrates credential verification, password hash comparison via bcrypt, and stateless JWT token generation. "
        "Alternative flow handles invalid credentials, returning a generic 401 error envelope with zero username enumeration leakage."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/seq-uc01.png",
        "Figure 4.2: UML Sequence Diagram for UC-01 (Authentication & JWT Issuance) — Source: docs/design/uml/seq-uc01.puml"
    )

    # UC-07
    add_heading_styled(doc, "UC-07: Borrow Book (Circulation Checkout)", level=3)
    add_paragraph_styled(doc, (
        "Traces checkout execution at the circulation desk. Enforces BR-01 (<= 3 active loans) and BR-04 (zero overdue loans). "
        "Under a PostgreSQL transaction, it verifies copy availability, creates a Loan record, and marks BookCopy as Borrowed."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/seq-uc07.png",
        "Figure 4.3: UML Sequence Diagram for UC-07 (Circulation Desk Checkout) — Source: docs/design/uml/seq-uc07.puml"
    )

    # UC-08
    add_heading_styled(doc, "UC-08: Return Book (Circulation Check-in & Auto-Hold Trigger)", level=3)
    add_paragraph_styled(doc, (
        "Demonstrates the atomic coordination between LoanService and ReservationService during return. "
        "When a physical copy is returned, the transaction locks the copy and title, evaluates condition notes, "
        "and automatically assigns the copy to the earliest Pending reservation in FIFO order (setting 72h hold under BR-08)."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/seq-uc08.png",
        "Figure 4.4: UML Sequence Diagram for UC-08 (Circulation Check-in & Auto-Hold Allocation) — Source: docs/design/uml/seq-uc08.puml"
    )

    # UC-10
    add_heading_styled(doc, "UC-10: Reserve Book Title (FIFO Queue Placement)", level=3)
    add_paragraph_styled(doc, (
        "Details the reservation placement workflow. Confirms that availableCopyCount === 0 (BR-05), patron has no overdue loans (BR-04), "
        "and active reservations < 2 (BR-06). Operates under a PostgreSQL transaction locking Reader and Title rows."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/seq-uc10.png",
        "Figure 4.5: UML Sequence Diagram for UC-10 (Book Title Reservation & FIFO Placement) — Source: docs/design/sequence-uc10.mmd"
    )

    add_heading_styled(doc, "State Machine Diagrams", level=2)
    add_paragraph_styled(doc, "State Machine Diagrams formalize the permissible status lifecycles and trigger events for core circulation entities:")

    # BookCopy State Machine
    add_heading_styled(doc, "BookCopy Lifecycle State Machine", level=3)
    add_paragraph_styled(doc, (
        "Models transitions between Available, Borrowed, Reserved, Damaged, and Lost. "
        "A copy transitions to Borrowed upon checkout, to Reserved if an active hold exists upon check-in (BR-08), or back to Available if no hold is queued. "
        "Marking a copy Damaged or Lost transitions it to a non-circulating terminal state."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/state-book-copy.png",
        "Figure 4.6: State Machine Diagram for BookCopy Lifecycle — Source: docs/design/uml/state-book-copy.mmd"
    )

    # Loan State Machine
    add_heading_styled(doc, "Loan Lifecycle State Machine", level=3)
    add_paragraph_styled(doc, (
        "Models transitions from Active to Renewed (eligible under BR-03) or Returned. "
        "Overdue is derived dynamically when now() > due_at and returned_at is null. "
        "Returning an overdue copy transitions it to Returned and removes the patron's BR-04 borrowing suspension."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/state-loan.png",
        "Figure 4.7: State Machine Diagram for Loan Lifecycle — Source: docs/design/uml/state-loan.mmd"
    )

    # Reservation State Machine
    add_heading_styled(doc, "Reservation Lifecycle State Machine", level=3)
    add_paragraph_styled(doc, (
        "Models transitions from Pending to Ready (upon copy allocation at check-in), and subsequently to Fulfilled (upon checkout within 72h), "
        "Expired (after 72 hours unclaimed, reassigning to next patron), or Cancelled (by patron request)."
    ))
    add_figure_image(
        doc,
        "docs/design/uml/state-reservation.png",
        "Figure 4.8: State Machine Diagram for Reservation Lifecycle — Source: docs/design/uml/state-reservation.mmd"
    )

    add_heading_styled(doc, "Design Principles and Patterns", level=2)
    add_paragraph_styled(doc, "The software design systematically applies standard software engineering principles and architectural patterns:")
    pat_headers = ["Principle / pattern", "Where it is applied", "Why"]
    pat_rows = [
        [
            "Layered Architecture",
            "Across all 7 modules in src/server/src/modules/ (routes -> controllers -> services -> DAL)",
            "Enforces strict separation of concerns; keeps business rules independent of HTTP transport and enables isolated unit testing."
        ],
        [
            "Repository Pattern",
            "Prisma Client abstraction (src/server/src/db.js) and database access delegates",
            "Decouples domain services from raw SQL queries, provides type-safe query interfaces, and facilitates test database mocking."
        ],
        [
            "Singleton Pattern",
            "PrismaClient instance in db.js and Express app instance in app.js",
            "Prevents connection exhaustion on PostgreSQL by sharing a single managed connection pool across all request handlers."
        ],
        [
            "Error Envelope Pattern",
            "Centralized errorHandler middleware (src/server/src/middlewares/errorHandler.js)",
            "Uniform API error response format {error:{code,message,details}}; ensures zero sensitive stack trace leakage in responses (NFR-08)."
        ],
        [
            "Guard Clauses",
            "At start of service mutation methods (checkout, return, renew, placeReservation)",
            "Fail-fast execution verifying business rule prerequisites (BR-01, BR-04, BR-05, BR-06) before initiating database transactions."
        ],
        [
            "Dependency Injection",
            "Passing database transaction context (tx) into helper methods (allocateNextHold)",
            "Enables multiple cohesive service methods to execute within a single atomic PostgreSQL transaction boundary."
        ]
    ]
    pat_widths = [Inches(1.5), Inches(2.3), Inches(3.0)]
    create_table_with_data(doc, pat_headers, pat_rows, col_widths=pat_widths, font_size=8.0)

print("build_pa3_part3 loaded successfully.")
