"""
UniLib PA3 - Section 1: Objectives & Section 2: Member Contribution Assessment
Strictly matching PA3-SoftwareDesign-template.docx format
"""

from docx.shared import Inches, Pt, RGBColor
from scripts.build_pa3_full import (
    add_heading_styled, add_paragraph_styled, add_bullet_point,
    create_table_with_data
)

def build_section_objectives(doc):
    add_heading_styled(doc, "Objectives", level=1)
    add_paragraph_styled(doc, (
        "The objective of this Software Design Document (PA3) is to establish the complete architectural, "
        "object-oriented, data, and user interface design baseline for UniLib (University Library Management System). "
        "The design strictly realizes the frozen functional requirements (F01–F07), non-functional requirements (NFR-01–NFR-08), "
        "business rules (BR-01–BR-10), and use cases (UC-01–UC-12) approved in the Software Requirements Specification "
        "(PA2 Baseline v1.0.0, pa/PA2/T05-PA2.docx). This document serves as the authoritative blueprint for the implementation "
        "and verification phases (PA4/PA5)."
    ))
    add_paragraph_styled(doc, "This document focuses on the following key engineering topics:")
    add_bullet_point(doc, "Architectural Design: Defining the Layered Modular Monolith style, C4 models (System Context Level 1, Container Level 2, Component API), physical Deployment diagram, and 4 formal Architecture Decision Records (ADR-001 to ADR-004).")
    add_bullet_point(doc, "Object-Oriented Design: Detailing the conceptual Domain Model, design-level Class Model, formal Class Specifications for 8 core system classes, UML Sequence Diagrams for key circulation workflows, State Machine Diagrams, and applied Design Patterns.")
    add_bullet_point(doc, "Data Design: Formalizing the 3NF Relational Database Schema, Entity-Relationship Diagram (ERD), full Data Specifications across 5 tables, indexing strategy for NFR-01, and pessimistic concurrency controls for NFR-05.")
    add_bullet_point(doc, "User Interface & Experience Design: Constructing the full Screen Navigation Flow across 12 screens (SCR-01 to SCR-12), detailed input/event specifications for core views, and WCAG 2.1 AA Accessibility Checklist.")
    add_bullet_point(doc, "Traceability Update: Delivering a complete 6-layer forward Requirements Traceability Matrix (RTM) bridging requirements to code artifacts with 0 unmapped elements.")
    add_bullet_point(doc, "AI Usage Log: Consolidating verified AI tool usage logs across all four team members in full compliance with course policy.")

def build_section_contributions(doc):
    add_heading_styled(doc, "Member Contribution Assessment", level=1)
    add_paragraph_styled(doc, (
        "In strict adherence to the Team Contract (PA0 §3.1, §3.5) and project charter, Team T05 maintains an equal 25.0% "
        "workload and accountability allocation across all four members (totaling 100.0%). The total effort for PA3 is budgeted "
        "at 60 person-hours across Slots W1–W2 (15.0 person-hours per member). Every architectural artifact is assigned a single "
        "primary owner and an independent cross-reviewer. All claimed contributions are substantiated by tangible repository "
        "evidence (merged pull requests, technical handoff reports src/*-W1.md, and automated test execution)."
    ))
    
    headers = ["ID", "Name", "Role(s)", "Contribution (%)", "Evidence"]
    rows = [
        [
            "23127520",
            "Nguyễn Phan Thế Vinh",
            "Team Lead / PM · Backend / Tester",
            "25.0%",
            "Tasks V1–V5 (15.0h):\n• V1: Express bootstrap, error middleware, health endpoint, multi-package CI pipeline (PR #88).\n• V2: Section 1 Objectives & Section 2 Design Goals (01-contribution-goals.md).\n• V3: Traceability update linking 32 FRs, 8 NFRs, 10 BRs; UC-07/08 Sequence diagrams, ADR-01..04.\n• V4: API Dashboard/Overdue (F07), RBAC matrix test (41 routes), concurrency double-checkout test (unilib_test), 0 TBD in RTM (src/V4-W1.md, PR #113).\n• V5: Docx compilation, demo release tag v0.3-pa3-demo, handoff src/V5-W1.md."
        ],
        [
            "24127228",
            "Trần Hà Anh Quân",
            "Fullstack Developer / Tech Lead",
            "25.0%",
            "Tasks Q1–Q5 (15.0h):\n• Q1: C4 Context, Container, Component diagrams, initial DBML ERD (PR #111).\n• Q2: Catalog/copy/search services, initial JWT adapter, architecture note (architecture.md).\n• Q3: FIFO reservation transactions, hold allocation/expiry, UC-10 sequence diagram (component-reservation.md).\n• Q4: 3NF database schema, Prisma migration, 12 indexes specification, 9-user/30-title/80-copy seed (seed.js).\n• Q5: Docker Compose PostgreSQL 16 + API, live smoke suite (15 checks), DB audit (src/Q5-W1.md)."
        ],
        [
            "24127469",
            "Nguyễn Thanh Thảo Nguyên",
            "Business Analyst (BA)",
            "25.0%",
            "Tasks N1–N4 (15.0h):\n• N1: Object-oriented Domain Model, core entities (User, BookTitle, BookCopy, Loan, Reservation, HoldShelf).\n• N2: Class Specifications for 8 system classes C1–C8 (03-oo-design.md).\n• N3: Librarian circulation desk UI mock SCR-07/08/10/12, UC-01 sequence diagram, Design Patterns table (src/N3-W1.md).\n• N4: Staff/Admin real API integration, business error dictionary businessErrors.js, requirement changes register (08-changes-since-pa2.md, src/N4-W1.md)."
        ],
        [
            "24127324",
            "Vũ Thị Ánh",
            "UI/UX Designer / Frontend Architect",
            "25.0%",
            "Tasks A1–A5 (15.0h):\n• A1: Comprehensive Screen Navigation Flow Diagram across all 12 screens SCR-01..12 (06-ui-screen-flow.md).\n• A2: Detailed Screen Specifications for core views SCR-01, 05, 06, 09, 11 (06-ui-screen-specs.md).\n• A3: WCAG 2.1 AA Accessibility Checklist, contrast >= 4.5:1, keyboard focus, responsive layout.\n• A4: React + Vite + Vitest client skeleton (src/client), routing, auth context, mock toggle.\n• A5: Reader UI responsive polish (1024-1920px), live screenshots docs/design/screens/*.png, 3-min demo script (src/A5-W1.md)."
        ],
        [
            "Total",
            "Team T05 (4 members)",
            "—",
            "100.0%",
            "16 Work Packages across exactly 60.0 Person-Hours. All deliverables verified on repository main branch."
        ]
    ]
    widths = [Inches(0.9), Inches(1.3), Inches(1.3), Inches(0.9), Inches(2.4)]
    create_table_with_data(doc, headers, rows, col_widths=widths, font_size=8.0)

print("build_pa3_content loaded successfully.")
