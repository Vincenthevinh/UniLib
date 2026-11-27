"""
UniLib PA3 - Section 8: Traceability Update, Section 9: Changes Since PA2, Section 10: AI Usage Log
Strictly matching PA3-SoftwareDesign-template.docx format
"""

from docx.shared import Inches, Pt, RGBColor
from scripts.build_pa3_full import (
    add_heading_styled, add_paragraph_styled, add_bullet_point,
    create_table_with_data
)

def build_section_traceability(doc):
    add_heading_styled(doc, "Traceability Update", level=1)
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
        ["FR-F04-03", "UC-05", "SCR-05", "CatalogList.jsx", "CatalogService.getAvailableOnly", "GET /api/v1/books?availableOnly=true"],
        ["FR-F04-04", "UC-05", "SCR-05", "CatalogSort.jsx", "CatalogService.sortTitles", "GET /api/v1/books?sortBy=..."],
        ["FR-F04-05", "UC-05", "SCR-05", "Pagination.jsx", "CatalogService.paginateTitles", "GET /api/v1/books?page=1&limit=10"],
        # F05
        ["FR-F05-01", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.checkout", "POST /api/v1/loans"],
        ["FR-F05-02", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.calculateDueAt", "POST /api/v1/loans (14 days)"],
        ["FR-F05-03", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.checkLoanLimit", "POST /api/v1/loans (BR-01)"],
        ["FR-F05-04", "UC-07", "SCR-07", "CirculationBorrow.jsx", "LoanService.checkOverdueBlock", "POST /api/v1/loans (BR-04)"],
        ["FR-F05-05", "UC-08", "SCR-08", "CirculationReturn.jsx", "LoanService.returnBook", "POST /api/v1/loans/:id/return"],
        ["FR-F05-06", "UC-08", "SCR-08", "CirculationReturn.jsx", "LoanService.inspectCondition", "POST /api/v1/loans/:id/return"],
        ["FR-F05-07", "UC-08", "SCR-08", "CirculationReturn.jsx", "ReservationService.allocateNextHold", "POST /api/v1/loans/:id/return (BR-08)"],
        ["FR-F05-08", "UC-11", "SCR-11", "ReaderDashboard.jsx", "LoanService.renewLoan", "POST /api/v1/loans/:id/renew (BR-03)"],
        # F06
        ["FR-F06-01", "UC-10", "SCR-09", "ReserveModal.jsx", "ReservationService.placeReservation", "POST /api/v1/reservations"],
        ["FR-F06-02", "UC-10", "SCR-09", "ReserveModal.jsx", "ReservationService.checkZeroAvailability", "POST /api/v1/reservations (BR-05)"],
        ["FR-F06-03", "UC-10", "SCR-09", "ReserveModal.jsx", "ReservationService.getFIFOQueuePosition", "GET /api/v1/reservations/:id/position"],
        ["FR-F06-04", "UC-11", "SCR-10", "HoldShelf.jsx", "ReservationService.manageHoldShelf", "GET /api/v1/holds"],
        ["FR-F06-05", "UC-11", "SCR-11", "ReaderDashboard.jsx", "ReservationService.cancelReservation", "DELETE /api/v1/reservations/:id"],
        # F07
        ["FR-F07-01", "UC-12", "SCR-11", "ReaderDashboard.jsx", "DashboardService.getReaderDashboard", "GET /api/v1/dashboard/reader"],
        ["FR-F07-02", "UC-12", "SCR-12", "OverdueMonitoring.jsx", "DashboardService.getOverdueLoans", "GET /api/v1/dashboard/overdue"],
        # NFRs
        ["NFR-01", "UC-05", "SCR-05", "CatalogList.jsx", "CatalogService + GIN / B-Tree Indexes", "GET /api/v1/books"],
        ["NFR-02", "All", "All", "Vite Code Splitting + CDN", "Vercel Global Edge CDN", "Static Assets (LCP <= 2.5s)"],
        ["NFR-03", "UC-01", "SCR-01", "Login.jsx", "AuthService (bcrypt salt >= 10)", "POST /api/auth/login"],
        ["NFR-04", "All", "All", "AppRouter.jsx", "authenticate / authorize Middleware", "All Protected Endpoints"],
        ["NFR-05", "UC-07, 08", "SCR-07, 08", "Circulation Desk", "Prisma $transaction + Row Locks", "POST /api/v1/loans*"],
        ["NFR-06", "All", "All", "Semantic HTML & CSS", "WCAG 2.1 AA Checklist & Palette", "All Views (Score >= 96)"],
        ["NFR-07", "All", "All", "CSS Grid / Flexbox", "Cross-Browser Normalized Styles", "1024px to 1920px"],
        ["NFR-08", "All", "All", "ErrorBoundary.jsx", "errorHandler Middleware & seed.js", "Global Error Envelope"]
    ]
    rtm_widths = [Inches(0.9), Inches(0.7), Inches(0.7), Inches(1.3), Inches(1.6), Inches(1.6)]
    create_table_with_data(doc, rtm_headers, rtm_rows, col_widths=rtm_widths, font_size=7.5)

def build_section_changes(doc):
    add_heading_styled(doc, "Changes to the Requirements Since PA2", level=1)
    add_paragraph_styled(doc, (
        "In strict compliance with software configuration management rules, no frozen functional requirements, "
        "business rules, or use case boundaries from the approved PA2 Baseline (v1.0.0) were altered. "
        "Four technical clarifications emerged during the architectural realization phase and were formally approved by the PM:"
    ))

    chg_headers = ["#", "Change", "Reason", "Affected items"]
    chg_rows = [
        [
            "1",
            "Added explicit GET /api/health endpoint returning database connection status and server timestamp.",
            "Enables automated container health probes on cloud hosting (Render) and pre-demo warm-up verification.",
            "NFR-08; Deployment Diagram; src/server/src/app.js"
        ],
        [
            "2",
            "Refined reservation queue cancellation behavior: If a patron cancels a reservation in Ready state, the allocated copy is immediately reassigned to the next FIFO patron.",
            "Eliminates wasted hold shelf capacity and guarantees fair book circulation under BR-07 and BR-08.",
            "F06; BR-07, BR-08; UC-10, UC-11; ReservationService"
        ],
        [
            "3",
            "Formalized CopyStatus enum values as Available, Borrowed, Reserved, Damaged, Lost; physical damage details stored in conditionNotes text.",
            "Provides clean relational enum while preserving descriptive qualitative feedback from Librarian check-in.",
            "F03, F05; UC-04, 08; SCR-04, 08; book_copies table"
        ],
        [
            "4",
            "Deploy functional Hold Shelf view (SCR-10) displaying Ready holds and Pending FIFO queues without manual reordering.",
            "Fulfills UC-11 requirements and ensures complete UI coverage across all 12 frozen screens in PA2 inventory.",
            "SCR-10, UC-11, F06; HoldShelf.jsx"
        ]
    ]
    chg_widths = [Inches(0.5), Inches(2.6), Inches(2.4), Inches(1.3)]
    create_table_with_data(doc, chg_headers, chg_rows, col_widths=chg_widths, font_size=8.0)

def build_section_ai_usage(doc):
    add_heading_styled(doc, "AI Usage Log", level=1)
    add_paragraph_styled(doc, (
        "In compliance with the Course Generative AI Policy, all four team members maintain a transparent, verifiable "
        "log of AI tool usage across the software design lifecycle. AI outputs were treated strictly as preliminary drafts "
        "and were systematically subjected to human verification, code-level testing, and architectural cross-review."
    ))

    ai_headers = ["#", "Member", "Tool", "Task / purpose", "How the output was verified and changed"]
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
    ai_widths = [Inches(0.4), Inches(1.4), Inches(1.1), Inches(1.9), Inches(2.0)]
    create_table_with_data(doc, ai_headers, ai_rows, col_widths=ai_widths, font_size=8.0)

print("build_pa3_part5 loaded successfully.")
