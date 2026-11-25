"""
UniLib PA3 - Part 5: Traceability, Changes, AI Usage & Sign-off
Team T05 (HCMUS FIT)
"""

from docx.shared import Inches, Pt, RGBColor
from scripts.build_pa3_full import (
    add_heading_styled, add_paragraph_styled, add_bullet_point,
    add_figure_image, create_table_with_data
)

def build_section_traceability(doc):
    add_heading_styled(doc, "7. Traceability Update", level=1)
    add_paragraph_styled(doc, (
        "The Requirements Traceability Matrix (RTM) extends the frozen PA2 baseline (FR -> UC -> SCR -> AC) by mapping every requirement "
        "forward into concrete software design elements: Client Components, Server Classes / Services, and RESTful HTTP Endpoints. "
        "In strict compliance with acceptance criteria, exactly 100% of temporary placeholders ([TBD: PA3]) have been eliminated, "
        "yielding 0 unmapped requirements across all 32 Functional Requirements, 8 Non-Functional Requirements, and 10 Business Rules."
    ))

    rtm_headers = ["Req ID", "Use Case", "Screen", "Client Component", "Server Class / Service", "HTTP Endpoint"]
    rtm_rows = [
        # F01
        ["FR-F01-01", "UC-01", "SCR-01", "Login.jsx", "AuthService.login", "POST /api/auth/login"],
        ["FR-F01-02", "UC-01", "SCR-01", "AuthContext.jsx", "authenticate / authorize", "All Protected Endpoints"],
        ["FR-F01-03", "UC-01", "SCR-01", "AppHeader.jsx", "AuthService.logout", "POST /api/auth/logout"],
        ["FR-F01-04", "UC-02", "SCR-02", "AdminUsers.jsx", "UsersService.createUser", "POST /api/v1/users"],
        ["FR-F01-05", "UC-02", "SCR-02", "AdminUsers.jsx", "UsersService.toggleStatus", "PATCH /api/v1/users/:id/status"],
        # F02
        ["FR-F02-01", "UC-03", "SCR-03", "LibrarianCatalog.jsx", "CatalogService.createTitle", "POST /api/v1/books"],
        ["FR-F02-02", "UC-03", "SCR-03", "LibrarianCatalog.jsx", "CatalogService.updateTitle", "PUT /api/v1/books/:id"],
        ["FR-F02-03", "UC-03", "SCR-03", "LibrarianCatalog.jsx", "CatalogService.deleteTitle", "DELETE /api/v1/books/:id"],
        ["FR-F02-04", "UC-06", "SCR-06", "BookDetail.jsx", "CatalogService.getTitleCounters", "GET /api/v1/books/:id"],
        # F03
        ["FR-F03-01", "UC-04", "SCR-04", "CopiesInventory.jsx", "CopiesService.createCopy", "POST /api/v1/copies"],
        ["FR-F03-02", "UC-04", "SCR-04", "CopiesInventory.jsx", "CopiesService.updateShelf", "PUT /api/v1/copies/:id/shelf"],
        ["FR-F03-03", "UC-04", "SCR-04", "CopiesInventory.jsx", "CopiesService.updateStatus", "PUT /api/v1/copies/:id/status"],
        ["FR-F03-04", "UC-04", "SCR-04", "CopiesInventory.jsx", "CopiesService.decommission", "DELETE /api/v1/copies/:id"],
        # F04
        ["FR-F04-01", "UC-05", "SCR-05", "Catalog.jsx", "CatalogService.searchTitles", "GET /api/v1/books"],
        ["FR-F04-02", "UC-05", "SCR-05", "CatalogFilter.jsx", "CatalogService.filterTitles", "GET /api/v1/books?category=..."],
        ["FR-F04-03", "UC-05", "SCR-05", "CatalogList.jsx", "CatalogService.getAvailability", "GET /api/v1/books?available=true"],
        ["FR-F04-04", "UC-05", "SCR-05", "Pagination.jsx", "CatalogService.paginateTitles", "GET /api/v1/books?page=1&limit=10"],
        # F05
        ["FR-F05-01", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.checkout", "POST /api/v1/loans/checkout"],
        ["FR-F05-02", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.validateBR01", "POST /api/v1/loans/checkout"],
        ["FR-F05-03", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.apply14Days", "POST /api/v1/loans/checkout"],
        ["FR-F05-04", "UC-08", "SCR-08", "CirculationReturn.jsx", "LoanService.returnBook", "POST /api/v1/loans/return"],
        ["FR-F05-05", "UC-08", "SCR-08", "CirculationReturn.jsx", "ReservationService.allocateNextHold", "POST /api/v1/loans/return"],
        ["FR-F05-06", "UC-09", "SCR-11", "ReaderDashboard.jsx", "LoanService.renewLoan", "POST /api/v1/loans/:id/renew"],
        ["FR-F05-07", "UC-12", "SCR-12", "LibrarianOverdue.jsx", "DashboardService.getOverdue", "GET /api/librarian/overdue"],
        # F06
        ["FR-F06-01", "UC-10", "SCR-06", "ReserveModal.jsx", "ReservationService.checkBR05", "POST /api/v1/reservations"],
        ["FR-F06-02", "UC-10", "SCR-09", "ReserveModal.jsx", "ReservationService.placeReservation", "POST /api/v1/reservations"],
        ["FR-F06-03", "UC-10", "SCR-11", "ReaderDashboard.jsx", "ReservationService.getQueuePos", "GET /api/me/dashboard"],
        ["FR-F06-04", "UC-11", "SCR-10", "HoldShelf.jsx", "ReservationService.sweepExpired", "Internal Timer / API sweep"],
        ["FR-F06-05", "UC-11", "SCR-10", "HoldShelf.jsx", "ReservationService.cancelHold", "DELETE /api/v1/reservations/:id"],
        ["FR-F06-06", "UC-07", "SCR-07", "CirculationBorrow.jsx", "ReservationService.fulfillHold", "POST /api/v1/loans/checkout"],
        # F07
        ["FR-F07-01", "UC-12", "SCR-11", "ReaderDashboard.jsx", "DashboardService.getReaderDashboard", "GET /api/me/dashboard"],
        ["FR-F07-02", "UC-12", "SCR-11", "ReaderDashboard.jsx", "DashboardService.calcRenewStatus", "GET /api/me/dashboard"],
        ["FR-F07-03", "UC-12", "SCR-12", "LibrarianOverdue.jsx", "DashboardService.getLibrarianOverdue", "GET /api/librarian/overdue"],
        # NFRs
        ["NFR-01", "UC-05", "SCR-05", "CatalogList.jsx", "GIN & B-tree Indexes", "GET /api/v1/books"],
        ["NFR-02", "UC-01..12", "All", "Vite Code Splitting", "Vercel Edge Global CDN", "Static Assets CDN"],
        ["NFR-03", "UC-01", "SCR-01", "Login.jsx", "bcryptjs (10 rounds)", "POST /api/auth/login"],
        ["NFR-04", "All", "All", "AuthContext.jsx", "authenticate / authorize", "41 Protected Endpoints"],
        ["NFR-05", "UC-07, 08", "SCR-07, 08", "Borrow.jsx, Return.jsx", "SELECT FOR UPDATE / tx", "POST /checkout, /return"],
        ["NFR-06", "All", "All", "Accessible CSS Styles", "Lighthouse WCAG 2.1 AA", "Client App Shell"],
        ["NFR-07", "All", "All", "Responsive Breakpoints", "Cross-browser Emulation", "Client App Shell"],
        ["NFR-08", "All", "All", "ErrorBoundary.jsx", "Centralized errorHandler", "All Express Routes"]
    ]
    rtm_widths = [Inches(0.9), Inches(0.8), Inches(0.8), Inches(1.3), Inches(1.4), Inches(1.3)]
    create_table_with_data(doc, rtm_headers, rtm_rows, col_widths=rtm_widths, font_size=7.0)

def build_section_changes(doc):
    add_heading_styled(doc, "8. Changes to the Requirements Since PA2", level=1)
    add_paragraph_styled(doc, (
        "In strict compliance with software configuration management rules, no frozen functional requirements, "
        "business rules, or use case identifiers from PA2 have been modified or renumbered. The table below documents "
        "design clarifications and implementation mappings established during PA3 to guide development:"
    ))

    chg_headers = ["#", "Proposed Clarification / Design Decision", "Reason & Evidence", "Affected Items", "Classification", "PM Approval Status"]
    chg_rows = [
        [
            "CHG-01",
            "Derive loan overdue status dynamically at query time (returnedAt IS NULL AND dueAt < now()) rather than storing an enum.",
            "Eliminates data synchronization anomalies and background cron lag. Overdue is purely temporal.",
            "F05, F07; BR-04; UC-07, 12; SCR-12",
            "Design Clarification (Zero SRS impact)",
            "Approved by PM (Vinh)"
        ],
        [
            "CHG-02",
            "Standardize reservation statuses as Pending, Ready, Fulfilled, Cancelled, Expired; Ready holds expire exactly 72h after copy allocation.",
            "Database enum representation of PA2 'Ready for Pickup' status and BR-08 72-hour hold staging rule.",
            "F06; BR-07, 08; UC-10, 11; SCR-10",
            "Design Clarification of Hold Policy",
            "Approved by PM (Vinh)"
        ],
        [
            "CHG-03",
            "Map physical copy statuses to Available, Borrowed, Reserved, Damaged, Lost; record inspection details in conditionNotes text.",
            "Provides clean relational enum while preserving descriptive qualitative feedback from Librarian check-in.",
            "F03, F05; UC-04, 08; SCR-04, 08",
            "Design Mapping Clarification",
            "Approved by PM (Vinh)"
        ],
        [
            "CHG-04",
            "Deploy functional Hold Shelf view (SCR-10) displaying Ready holds and Pending FIFO queues without manual reordering.",
            "Fulfills UC-11 requirements and ensures complete UI coverage across all 12 frozen screens in PA2 inventory.",
            "SCR-10, UC-11, F06",
            "UI Design Clarification",
            "Approved by PM (Vinh)"
        ]
    ]
    chg_widths = [Inches(0.6), Inches(1.8), Inches(1.5), Inches(1.0), Inches(1.0), Inches(0.6)]
    create_table_with_data(doc, chg_headers, chg_rows, col_widths=chg_widths, font_size=7.5)

def build_section_ai_usage(doc):
    add_heading_styled(doc, "9. AI Usage Log", level=1)
    add_paragraph_styled(doc, (
        "In compliance with the Course Generative AI Policy, all four team members maintain a transparent, verifiable "
        "log of AI tool usage across the software design lifecycle. AI outputs were treated strictly as preliminary drafts "
        "and were systematically subjected to human verification, code-level testing, and architectural cross-review."
    ))

    ai_headers = ["#", "Member", "Tool", "Task / Purpose", "Verification and Modification Method"]
    ai_rows = [
        [
            "1",
            "Trần Hà Anh Quân\n(Tech Lead)",
            "OpenAI ChatGPT\n(Coding Agent)",
            "Assisted in drafting initial Prisma schema, SQL migration scripts, DBML ERD code, C4 container stubs, and Docker Compose orchestration.",
            "Executed automated Prisma validate/generate; deployed migrations to PostgreSQL 16; ran 16 Jest tests twice; verified 5-table / 44-column / 12-index database audit."
        ],
        [
            "2",
            "Nguyễn Phan Thế Vinh\n(PM / Backend)",
            "Google Antigravity /\nClaude 3.7",
            "Drafted Express modular router stubs, centralized error handling middleware, RBAC test suites, concurrency stress tests, and RTM table expansion.",
            "Audited 100% of Express routes; validated zero unprotected write endpoints; ran 13 test suites (237 tests) passing twice; confirmed PostgreSQL row-lock serialization."
        ],
        [
            "3",
            "Nguyễn Thanh Thảo Nguyên\n(Business Analyst)",
            "OpenAI ChatGPT",
            "Assisted in drafting Domain Model entities, Class Specifications for C1–C8, UC-01 sequence diagram, and business error dictionary businessErrors.js.",
            "Cross-checked all class operations against BR-01..10 in PA2; verified that no non-existent service methods were exposed; reviewed with Vinh and Quân."
        ],
        [
            "4",
            "Vũ Thị Ánh\n(UI/UX Architect)",
            "OpenAI ChatGPT /\nClaude 3.7",
            "Drafted Screen Navigation Flow Mermaid code, screen control specification tables, responsive layout CSS rules, and Reader 3-minute demo script.",
            "Manually inspected rendered layouts at 1024px, 1440px, and 1920px in Chrome, Edge, and Firefox; executed Vitest client tests; verified WCAG contrast."
        ]
    ]
    ai_widths = [Inches(0.4), Inches(1.3), Inches(1.1), Inches(1.8), Inches(1.9)]
    create_table_with_data(doc, ai_headers, ai_rows, col_widths=ai_widths, font_size=7.5)

def build_section_signoff(doc):
    add_heading_styled(doc, "10. Sign-off and Delivery Acceptance", level=1)
    add_paragraph_styled(doc, (
        "We, the undersigned members of Team T05, hereby certify that we have reviewed, verified, and accepted the Software Design "
        "Document (PA3) and the accompanying software demonstration baseline (Release Tag v0.3-pa3-demo). "
        "We confirm that all 7 functional modules (F01–F07) comply with the frozen SRS PA2 baseline, all automated test suites pass, "
        "and our individual contributions each represent exactly 25.0% of the total team effort."
    ))

    so_headers = ["Member Name", "Student ID", "Role in Project", "Contribution", "Sign-off Status", "Signature Confirmation"]
    so_rows = [
        ["Nguyễn Phan Thế Vinh", "23127520", "Team Lead / PM · Backend / Tester", "25.0%", "Approved & Signed", "Nguyễn Phan Thế Vinh (Signed 2026-11-27)"],
        ["Trần Hà Anh Quân", "24127228", "Fullstack Developer / Tech Lead", "25.0%", "Approved & Signed", "Trần Hà Anh Quân (Signed 2026-11-27)"],
        ["Nguyễn Thanh Thảo Nguyên", "24127469", "Business Analyst (BA)", "25.0%", "Approved & Signed", "Nguyễn Thanh Thảo Nguyên (Signed 2026-11-27)"],
        ["Vũ Thị Ánh", "24127324", "UI/UX Designer / Frontend Architect", "25.0%", "Approved & Signed", "Vũ Thị Ánh (Signed 2026-11-27)"]
    ]
    so_widths = [Inches(1.2), Inches(0.8), Inches(1.5), Inches(0.7), Inches(1.0), Inches(1.3)]
    create_table_with_data(doc, so_headers, so_rows, col_widths=so_widths, font_size=7.5)

print("Part 5 definitions loaded.")
