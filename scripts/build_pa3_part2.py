"""
UniLib PA3 - Part 2: Design Overview & Architectural Design
Team T05 (HCMUS FIT)
"""

from docx.shared import Inches, Pt, RGBColor
from scripts.build_pa3_full import (
    add_heading_styled, add_paragraph_styled, add_bullet_point,
    add_figure_image, create_table_with_data
)

def build_section_design_overview(doc):
    add_heading_styled(doc, "2. Design Overview", level=1)
    add_heading_styled(doc, "2.1 Design Goals and Constraints", level=2)
    add_paragraph_styled(doc, (
        "The software architecture and detailed design of UniLib are directly governed by the architecturally "
        "significant requirements established in the frozen Software Requirements Specification (PA2 Baseline v1.0.0). "
        "All 8 Non-Functional Requirements (NFRs), 7 Functional Requirement modules (F01–F07), and 10 Business Rules (BR-01–BR-10) "
        "form the immutable boundary of this software release."
    ))

    add_heading_styled(doc, "Non-Functional Requirements Registry (NFR-01 to NFR-08)", level=3)
    nfr_headers = ["NFR ID", "Category", "Measurable Requirement (Frozen PA2)", "Architectural Realization & Verification"]
    nfr_rows = [
        [
            "NFR-01",
            "Performance (Search)",
            "Under 100 concurrent users, catalog search queries shall return payloads in <= 1.0s at P95 across 10,000 records.",
            "B-tree index on isbn, composite index on (category, publication_year), and GIN trigram index on (title, author). Server-side pagination with default 10 records/page."
        ],
        [
            "NFR-02",
            "Performance (Page Load)",
            "Initial application load time shall achieve Largest Contentful Paint (LCP) <= 2.5s at P90 on standard broadband / 4G.",
            "Vite bundle optimization, dynamic import() code splitting, static asset CDN compression via Vercel Edge. Verified by Lighthouse Performance Audit."
        ],
        [
            "NFR-03",
            "Security (Hashing)",
            "Passwords hashed using bcrypt with salt rounds >= 10; plaintext credentials never logged or returned in responses.",
            "Node.js bcryptjs implementation (10 salt rounds) before persistence. Prisma select explicitly excludes passwordHash field. Verified by auth.test.js."
        ],
        [
            "NFR-04",
            "Security (RBAC)",
            "All protected REST API endpoints validate JWT claims; unauthenticated returns 401; unauthorized role returns 403.",
            "Stateless JWT middleware (HS256) extracts userId and role (Reader, Librarian, Administrator). 100% of write routes covered. Verified by rbac.test.js (41 endpoints)."
        ],
        [
            "NFR-05",
            "Data Integrity (Concurrency)",
            "Circulation state transitions (checkout, check-in, hold allocation) execute within atomic transactions with row locks, guaranteeing 0 race conditions.",
            "PostgreSQL transactions (SERIALIZABLE / READ COMMITTED) combined with row-level locking (SELECT FOR UPDATE). Verified by db.integration.test.js on PostgreSQL 16 (unilib_test)."
        ],
        [
            "NFR-06",
            "Usability & Accessibility",
            "Google Lighthouse Accessibility score >= 85, color contrast >= 4.5:1, full keyboard navigation, and aria-labels.",
            "Semantic HTML, high-contrast palette (#1F497D / #FFFFFF), explicit aria-labels, visible :focus-visible outlines. Verified by Lighthouse Accessibility Audit."
        ],
        [
            "NFR-07",
            "Compatibility",
            "Render correctly across evergreen desktop browsers (Chrome 120+, Firefox 120+, Edge 120+, Safari 17+) from 1024px to 1920px.",
            "Responsive CSS Grid and Flexbox layouts without vendor-specific hacks; breakpoints at 1024px, 1440px, 1920px. Verified in Chrome, Firefox, and Edge."
        ],
        [
            "NFR-08",
            "Reliability & Recovery",
            "Centralized error handling without stack trace leakage; database schema restoration via seed script in < 5 minutes.",
            "Express centralized errorHandler returning structured {error:{code,message,details}}. Deterministic seed script (seed.js) restores DB in ~7.12 seconds."
        ]
    ]
    nfr_widths = [Inches(0.9), Inches(1.3), Inches(2.2), Inches(2.1)]
    create_table_with_data(doc, nfr_headers, nfr_rows, col_widths=nfr_widths, font_size=8.0)

    add_heading_styled(doc, "2.2 High-Priority Functional Requirements (F01–F07)", level=2)
    add_paragraph_styled(doc, "The software design realizes 7 functional feature modules:")
    add_bullet_point(doc, "F01: User Authentication & RBAC (Must-have): Credential authentication, stateless JWT issuance, secure client logout, and Administrator user management (SCR-01, SCR-02, UC-01, UC-02).")
    add_bullet_point(doc, "F02: Book Catalog Management (Must-have): Librarian creation and editing of title metadata, copy counters aggregation, and deletion protection for active copies (SCR-03, SCR-06, UC-03, UC-06).")
    add_bullet_point(doc, "F03: Book Copy Inventory Management (Must-have): Registration of physical copies with unique Barcode ID, shelf locations, condition notes, and copy lifecycle state transitions (SCR-04, UC-04).")
    add_bullet_point(doc, "F04: Book Search & Browse (Must-have): Keyword search across Title/Author/ISBN/Category, dynamic category filtering, available-only toggle, multi-attribute sorting, and server-side pagination (SCR-05, UC-05).")
    add_bullet_point(doc, "F05: Borrow & Return Management (Must-have): Circulation desk checkout with 14-day duration, 3-loan limit, overdue borrowing block; check-in workflow with physical condition inspection and automatic hold triggering (SCR-07, SCR-08, UC-07, UC-08).")
    add_bullet_point(doc, "F06: Book Reservation (Must-have): Title-level reservation when 0 copies available, FIFO queue position calculation, automatic 72-hour pickup hold allocation, and patron cancellation (SCR-09, SCR-10, UC-10, UC-11).")
    add_bullet_point(doc, "F07: Dashboard & Overdue Monitoring (Should-have): Personal dashboard for Readers (active loans, due dates, renewal eligibility, reservations, queue position) and Librarian overdue monitoring with late-day tracking and patron contact info (SCR-11, SCR-12, UC-12).")

    add_heading_styled(doc, "2.3 Business Rules Realization (BR-01 to BR-10)", level=2)
    add_paragraph_styled(doc, "All 10 Business Rules from PA2 are enforced through server-side domain services and database constraints:")
    add_bullet_point(doc, "BR-01 (Max Active Loans): Readers cannot hold more than 3 active loans simultaneously (LoanService.checkout).")
    add_bullet_point(doc, "BR-02 (Standard Loan Duration): Standard loan period is exactly 14 calendar days from checkout instant.")
    add_bullet_point(doc, "BR-03 (Single Renewal): A loan can be renewed once for an additional 14 days, provided it is not overdue and no pending reservations exist.")
    add_bullet_point(doc, "BR-04 (Overdue Borrowing Suspension): Any patron with an overdue unreturned loan is strictly blocked from borrowing and reserving.")
    add_bullet_point(doc, "BR-05 (Zero-Availability Hold Rule): Reservation can only be placed when availableCopyCount === 0 for the requested title.")
    add_bullet_point(doc, "BR-06 (Reservation Limit): A Reader may have at most 2 active reservations simultaneously.")
    add_bullet_point(doc, "BR-07 (FIFO Hold Order): Reservations are served strictly in order of placement timestamp (createdAt ASC, id ASC).")
    add_bullet_point(doc, "BR-08 (72-Hour Hold Expiry): A copy allocated to a reservation is held on the Hold Shelf for exactly 72 hours; if unclaimed, it reallocates to the next FIFO patron or becomes Available.")
    add_bullet_point(doc, "BR-09 (Referential Integrity): Title/Copy deletion is strictly blocked if referenced by active loans or reservations (onDelete: Restrict).")
    add_bullet_point(doc, "BR-10 (Strict Role RBAC): Operations are strictly restricted by authenticated user role (Reader, Librarian, Administrator).")

def build_section_architecture(doc):
    add_heading_styled(doc, "3. Architectural Design", level=1)
    
    add_heading_styled(doc, "3.1 Architectural Style", level=2)
    add_paragraph_styled(doc, (
        "UniLib adopts the Layered Modular Monolith architectural style combined with a Client-Server Single Page Application (SPA) "
        "pattern. The system is decomposed into four discrete architectural layers:"
    ))
    add_bullet_point(doc, "Presentation Layer (Client SPA): Built with React 18 and Vite, running entirely in the user's web browser. It renders views SCR-01 to SCR-12, manages UI state via React Context, and communicates with the backend exclusively via HTTPS/RESTful JSON with Bearer JWT tokens.")
    add_bullet_point(doc, "HTTP API & Routing Layer (Express): Built with Node.js 22 and Express.js (ESM). It handles HTTP request routing, input parsing, security headers (Helmet), CORS validation, request tracing (RequestId), centralized authentication (authenticate), and role authorization (authorize).")
    add_bullet_point(doc, "Application / Domain Layer (Modular Services): Organized into 7 cohesive business modules (auth, users, books, copies, loans, reservations, dashboard). Each module encapsulates business rules (BR-01..10) and operates independently of HTTP transport.")
    add_bullet_point(doc, "Data Access & Persistence Layer: Implemented via Prisma ORM 6.x connected to PostgreSQL 16. It manages typed queries, database migrations, interactive transactions, and pessimistic row locks.")
    add_paragraph_styled(doc, (
        "Architectural Justification: For a university library system within the PA2 scope (F01–F07), a Modular Monolith provides the optimal "
        "trade-off between engineering velocity, transactional integrity, and operational simplicity. Crucially, circulation workflows "
        "(such as checking in a book, transitioning its status to Reserved, and allocating it to the head of the FIFO queue) execute "
        "within a single local ACID transaction in PostgreSQL. This eliminates the catastrophic failure modes of distributed transactions "
        "(e.g., dual writes, partial failures, split-brain queues) inherent to microservice architectures, while maintaining clean separation "
        "of concerns across module boundaries."
    ))

    add_heading_styled(doc, "3.2 System Context Diagram (C4 Level 1)", level=2)
    add_paragraph_styled(doc, (
        "The System Context Diagram defines the UniLib system boundary, the human actors interacting with it, and its external interfaces. "
        "In strict accordance with the approved PA2 scope, UniLib is entirely self-contained: it manages its own user identity and book data, "
        "and explicitly does NOT connect to external payment gateways, SMS/email relays, RFID hardware, or third-party AI recommendation engines."
    ))
    add_figure_image(
        doc,
        "docs/design/c4/system-context.png",
        "Figure 3.1: UniLib System Context Diagram (C4 Level 1) — Source: docs/design/c4/system-context.mmd"
    )

    add_heading_styled(doc, "3.3 Container Diagram (C4 Level 2)", level=2)
    add_paragraph_styled(doc, (
        "The Container Diagram decomposes the UniLib system into its high-level executable units, showing communication protocols and data stores. "
        "The system comprises three primary runtime containers: the React/Vite Single Page Application (Web SPA), the Node.js 22 / Express REST API "
        "container, and the PostgreSQL 16 Relational Database. Additionally, an internal background Expiry Timer runs inside the API container "
        "to periodically sweep expired hold reservations every 60 seconds."
    ))
    add_figure_image(
        doc,
        "docs/design/c4/container.png",
        "Figure 3.2: UniLib Container Diagram (C4 Level 2) — Source: docs/design/c4/container.mmd"
    )

    add_heading_styled(doc, "3.4 Component Diagram", level=2)
    add_paragraph_styled(doc, (
        "The Component Diagram illustrates the internal modular decomposition of the Node.js 22 / Express API container. "
        "Incoming HTTP requests pass through security middleware (JWT/RBAC) before reaching modular route controllers. "
        "Controllers delegate domain operations to specialized services (CatalogService, ReservationService, LoanService, DashboardService, AuthService), "
        "which coordinate multi-entity business rules and persist changes through the unified Prisma Data Access Layer."
    ))
    add_figure_image(
        doc,
        "docs/design/component-api.png",
        "Figure 3.3: UniLib API Component Decomposition Diagram — Source: docs/design/component-api.mmd"
    )

    add_heading_styled(doc, "3.5 Deployment Diagram", level=2)
    add_paragraph_styled(doc, (
        "The Deployment Diagram depicts the physical mapping of software containers onto cloud hosting infrastructure and the local demonstration "
        "environment. The production deployment leverages a decoupled cloud architecture: the React/Vite frontend is deployed to Vercel's Global "
        "Edge CDN, while the Express API and PostgreSQL 16 database run on Render.com in the same geographic region (Singapore) to ensure sub-10ms "
        "database query latency. For local development and academic evaluation, Docker Compose orchestrates PostgreSQL 16 and the API container from a single command."
    ))
    add_figure_image(
        doc,
        "docs/design/deployment.png",
        "Figure 3.4: UniLib Deployment Diagram (Cloud Hosting & Local Demo) — Source: docs/design/deployment.mmd"
    )

    add_heading_styled(doc, "3.6 Architecture Decision Records (ADRs)", level=2)
    add_paragraph_styled(doc, "Four comprehensive Architecture Decision Records govern the system's foundational design:")

    # ADR-001
    add_heading_styled(doc, "ADR-001: Selection of PostgreSQL 16 and Prisma ORM", level=3)
    adr1_headers = ["Attribute", "Specification"]
    adr1_rows = [
        ["Decision ID", "ADR-001"],
        ["Date & Status", "2026-11-24 | Accepted (Officially Approved)"],
        ["Author & Reviewer", "Nguyễn Phan Thế Vinh (Lead) | Trần Hà Anh Quân (Tech Lead)"],
        ["Traceability", "FR-F01..06, BR-01..10, NFR-05 (Data Integrity & Concurrency)"],
        ["Context", "Need for ACID transactional guarantees, partial indexes, foreign key enforcement (BR-09), and type-safe data access for 5 interrelated entities."],
        ["Decision", "PostgreSQL 16 selected as sole RDBMS; Prisma ORM 6.x chosen as Data Access Layer. All PKs use UUID v4; timestamps in UTC timestamptz(3); onDelete: Restrict on all foreign keys; pessimistic row-level locking (SELECT FOR UPDATE) in circulation transactions."],
        ["Consequences", "Guarantees zero double-checkout races and zero orphaned copies. Requires Docker/local DB for integration testing, mitigated by comprehensive Jest mocks for unit/API isolation."]
    ]
    create_table_with_data(doc, adr1_headers, adr1_rows, col_widths=[Inches(1.8), Inches(4.7)], font_size=8.5)

    # ADR-002
    add_heading_styled(doc, "ADR-002: Stateless JWT Authentication and Role-Based Access Control (RBAC)", level=3)
    adr2_headers = ["Attribute", "Specification"]
    adr2_rows = [
        ["Decision ID", "ADR-002"],
        ["Date & Status", "2026-11-24 | Accepted (Officially Approved)"],
        ["Author & Reviewer", "Nguyễn Phan Thế Vinh (Lead) | Trần Hà Anh Quân (Tech Lead)"],
        ["Traceability", "FR-F01-01..04, BR-10, NFR-03 (Password Hashing), NFR-04 (RBAC)"],
        ["Context", "Decoupled React SPA and Express REST API serving 3 distinct user roles (Reader, Librarian, Administrator) with strict access boundaries and zero plaintext credential leakage."],
        ["Decision", "Stateless authentication via JSON Web Token (HS256). Password hashing via bcryptjs (10 salt rounds). Two-tier middleware: authenticate verifies signature and checks user.isActive in DB; authorize(...roles) enforces RBAC matrix. Client-side logout."],
        ["Consequences", "Zero server session memory overhead; clean 401 Unauthenticated vs 403 Forbidden semantics. Immediate revocation of deactivated accounts verified via active status check on each protected request."]
    ]
    create_table_with_data(doc, adr2_headers, adr2_rows, col_widths=[Inches(1.8), Inches(4.7)], font_size=8.5)

    # ADR-003
    add_heading_styled(doc, "ADR-003: Layered Modular Monolith Architecture on Express.js", level=3)
    adr3_headers = ["Attribute", "Specification"]
    adr3_rows = [
        ["Decision ID", "ADR-003"],
        ["Date & Status", "2026-11-24 | Accepted (Officially Approved)"],
        ["Author & Reviewer", "Nguyễn Phan Thế Vinh (Lead) | Trần Hà Anh Quân (Tech Lead)"],
        ["Traceability", "F01–F07, UC-01..12, SCR-01..12, NFR-01, NFR-02, NFR-08"],
        ["Context", "4-member student team with 5-week schedule and $0 budget. High cross-domain transaction coupling between book returns, copy status transitions, and FIFO reservation allocation."],
        ["Decision", "Layered Modular Monolith: 3 layers (Presentation, Application/Domain, Data Access) across 7 feature modules in src/server/src/modules/*. Centralized Error Envelope returning structured {error:{code,message,details}} with zero stack trace leakage (NFR-08)."],
        ["Consequences", "Rapid local development, zero network overhead between modules, atomic single-database transactions for complex workflows. Modularity enforced by peer review against api.md contracts."]
    ]
    create_table_with_data(doc, adr3_headers, adr3_rows, col_widths=[Inches(1.8), Inches(4.7)], font_size=8.5)

    # ADR-004
    add_heading_styled(doc, "ADR-004: Cloud Hosting on Vercel CDN and Render Web Services", level=3)
    adr4_headers = ["Attribute", "Specification"]
    adr4_rows = [
        ["Decision ID", "ADR-004"],
        ["Date & Status", "2026-11-24 | Accepted (Officially Approved)"],
        ["Author & Reviewer", "Nguyễn Phan Thế Vinh (Lead) | Trần Hà Anh Quân (Tech Lead)"],
        ["Traceability", "NFR-01, NFR-02, NFR-03, NFR-06, NFR-07, PA3/PA5 Deployment"],
        ["Context", "Requirement for live interactive demonstration and evaluator grading under strict $0.00 financial budget constraint."],
        ["Decision", "Frontend React/Vite SPA hosted on Vercel Edge CDN with automatic HTTPS. Backend API container and managed PostgreSQL 16 hosted on Render.com in same geographic region. GET /api/health used as health check probe."],
        ["Consequences", "Strict $0.00 cost compliance, automated CI/CD pipeline from Git merges. Free-tier cold start (30-50s) mitigated by scheduled health probe pings prior to demo evaluation."]
    ]
    create_table_with_data(doc, adr4_headers, adr4_rows, col_widths=[Inches(1.8), Inches(4.7)], font_size=8.5)

print("Part 2 definitions loaded.")
