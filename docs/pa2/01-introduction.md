# 2. Introduction

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V2  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Status:** Draft – Pending Review  
**Reference:** PA1 Baseline; Master ID Registry v1.0.0-frozen; docs/pa2/02-glossary.md  

---

## 2.1 Purpose of the Document

This Software Requirements Specification (SRS) document provides a comprehensive, unambiguous, and verifiable specification of the functional, non-functional, and domain requirements for the UniLib (University Library Management System) web application.

The primary purposes of this document are:
1. **Contractual Baseline:** Establish a formal, frozen baseline agreed upon by all stakeholders—including course instructors, teaching assistants (TAs), student patrons, library operational staff, and the development team (Team T05)—governing the expected system capabilities and operational boundaries.
2. **Authoritative Input for Downstream Phases:** Serve as the definitive technical and architectural foundation for subsequent project phases under the Waterfall lifecycle model:
   - **PA3 (Architecture & Detailed Design):** Guides the C4 system context and container architecture, relational PostgreSQL database schema (DDL and normalization), and RESTful API endpoint contracts.
   - **PA4 (Test Planning & QA Setup):** Governs the Master Test Plan, test scenarios, Given-When-Then acceptance criteria, and traceability coverage.
   - **PA5 (Implementation, Testing & Deployment):** Sets acceptance boundaries for full frontend (React + Vite) and backend (Node.js + Express) code delivery and cloud staging.
3. **Traceability Anchor:** Provide unique, frozen identifiers across all features, functional requirements, non-functional requirements, business rules, use cases, screen wireframes, and acceptance criteria to ensure complete forward and backward traceability through the Requirements Traceability Matrix (RTM).
4. **Verification & Acceptance Criteria:** Define precise, measurable conditions under which the software system will be evaluated, inspected, tested, and validated prior to final release.

---

## 2.2 Product Scope

### 2.2.1 Product Overview
UniLib is a centralized, responsive web-based library management platform engineered for small to medium-sized university and departmental libraries. The platform eliminates the inefficiencies, data discrepancies, and administrative overhead associated with manual paper logbooks and fragmented spreadsheets. It empowers readers with self-service catalog discovery and fair reservation mechanisms, while streamlining book copy inventory management, circulation desk workflows (checkout and check-in), due date tracking, and overdue monitoring for library staff.

### 2.2.2 In-Scope Functional Modules (F01–F07)
The system scope is defined by seven core features decomposed into six mandatory **Must-have** features (committed for complete implementation and verification in PA5) and one prioritized **Should-have** feature:

| Feature ID | Feature Name | Priority | Operational Scope & Requirements Perspective |
| :--- | :--- | :---: | :--- |
| **F01** | User Authentication & Role-Based Access Control | **Must** | Provides credential authentication (username/email and password), secure session management via JSON Web Tokens (JWT), client-side session termination (logout), and strict Role-Based Access Control (RBAC) across Reader, Librarian, and Administrator actors. Enables Administrators to provision user accounts, assign roles, and deactivate compromised or inactive patrons. |
| **F02** | Book Catalog Management | **Must** | Enables Librarians to perform bibliographic cataloging operations (create, view, edit) for book titles with comprehensive metadata (unique ISBN, Title, Author, Category, Publisher, Publication Year). Enforces referential integrity by prohibiting deletion of titles with existing physical copies, active loans, or pending reservations. Computes real-time aggregated copy inventory statistics. |
| **F03** | Book Copy Inventory Management | **Must** | Tracks physical book copies as discrete inventory units linked to book titles. Allows Librarians to register physical copies with unique Barcode / Copy IDs and shelf locations, update physical condition notes, and maintain copy lifecycle states (`Available`, `Borrowed`, `Reserved`, `Damaged`/`Lost`). Blocks decommissioning of copies actively in circulation. |
| **F04** | Book Search & Browse | **Must** | Provides public and authenticated catalog search across Title, Author, Category, and ISBN keywords. Supports multi-attribute filtering (category, real-time availability), sorting (title, publication year), and server-side paginated browsing with fast response times (P95 ≤ 1.0s under 100 concurrent users). Renders real-time copy availability counters and shelf locations. |
| **F05** | Borrow & Return Management (Circulation Desk) | **Must** | Automates circulation desk operations for Librarians. Governs loan checkout with patron eligibility validation (fewer than 3 active loans, zero overdue loans), automatically computes standard 14-calendar-day due dates, and transitions copy status to `Borrowed`. Processes returns, records check-in timestamps, evaluates title reservation queues to transition returned copies to `Reserved` for holding or restore to `Available`, and manages a single 14-day loan renewal. |
| **F06** | Book Reservation (Hold Processing) | **Must** | Allows eligible Readers to place title-level reservations when exactly zero copies of a title are in `Available` status. Enforces a maximum limit of 2 active reservations per reader and manages a strict First-In, First-Out (FIFO) queue. Upon copy check-in, routes the copy to the hold shelf in `Reserved` status for a 72-hour pickup window, with automated hold expiration and cancellation handling. |
| **F07** | Reader Overdue & Loan Monitoring Dashboard | **Should** | Delivers dedicated visibility into circulation statuses. Provides Readers with a self-service dashboard to track active borrowings, calculated due dates, renewal actions, active reservations, and prominent overdue alerts. Equips Librarians with an operational overdue monitoring desk listing delinquent loans, days overdue, and patron contact details. |

*Note: Features F01–F06 constitute the mandatory baseline required for PA5 implementation. Feature F07 is prioritized as Should-have and will be implemented subject to team schedule performance in PA5.*

---

### 2.2.3 Scope Boundaries & Out-of-Scope Items
To ensure project feasibility within the academic course timeline (318 total person-hours across 11 weeks) and maintain strict compliance with the approved project proposal (PA0 §2.7 and PA1 §2.4), specific capabilities are explicitly designated as **Out-of-Scope**. The following seven boundaries are strictly maintained:

1. **E-Book Reading & Digital Rights Management (DRM):**
   - *Boundary:* UniLib is dedicated exclusively to the administration and circulation of physical library holdings. The platform does not host, stream, render, or distribute digital publications (EPUB, PDF), nor does it implement DRM copy protection, digital watermarking, or electronic reader interfaces.
   - *Requirements Rationale:* Eliminates external digital content licensing complexities, large binary asset storage overhead, and specialized reader client requirements, keeping focus squarely on physical circulation rules.
2. **Online Payment Processing & Fine Transactions:**
   - *Boundary:* The system does not integrate with electronic payment gateways, banking APIs, or digital wallets (e.g., VNPay, MoMo, ZaloPay, Stripe) for monetary transactions, library fee collections, or overdue fine payments. Overdue enforcement is handled administratively via borrowing suspensions (`BR-04`), not monetary penalties.
   - *Requirements Rationale:* Removes PCI-DSS security compliance burdens, payment gateway sandbox dependencies, and financial reconciliation liabilities from student development scope.
3. **Physical Hardware Scanners (RFID & Optical Barcode Scanners):**
   - *Boundary:* The system does not communicate with proprietary peripheral drivers, hardware barcode scanning guns, or RFID smart shelf antennas. All Barcode / Copy ID identifiers are recorded, queried, and verified through responsive standard web form inputs (manual keyboard / virtual UI entry).
   - *Requirements Rationale:* Guarantees complete hardware independence, enabling the application to run seamlessly on standard personal computers and modern web browsers without physical lab hardware constraints.
4. **Inter-Library Loans & Multi-Campus Operations:**
   - *Boundary:* UniLib is tailored for a single, centralized university library or departmental resource facility. It does not accommodate inter-library loan networks, cross-institutional lending protocols, distributed catalog federation (e.g., Z39.50), or multi-branch logistics tracking.
   - *Requirements Rationale:* Preserves a unified, centralized relational database schema and avoids distributed transaction latency or complex inter-organization transport workflows.
5. **AI-Based Recommendation Systems:**
   - *Boundary:* Catalog discovery is strictly deterministic and query-driven via keyword search, attribute filtering, and metadata sorting. The platform does not incorporate machine learning recommendation models, collaborative filtering algorithms, or generative AI user profiling.
   - *Requirements Rationale:* Ensures deterministic and repeatable test verification, maintains predictable search query response latencies (`NFR-01`), and avoids data training overhead.
6. **Production SMS & External Email Gateways:**
   - *Boundary:* The system does not interface with third-party telecommunications infrastructure or paid messaging APIs (e.g., Twilio, SendGrid, Amazon SES) for sending external cellular SMS messages or production emails. All patron notifications—including due date reminders, hold readiness alerts, and overdue warnings—are rendered directly via responsive in-app dashboard views (`FR-F07-02`) and status indicators.
   - *Requirements Rationale:* Eliminates recurring cloud API service charges, delivery latency failures outside system control, and mock gateway dependencies during evaluation.
7. **Native Mobile Applications (iOS & Android):**
   - *Boundary:* UniLib is architected exclusively as a responsive web application optimized for modern desktop and laptop web browsers (Chrome, Firefox, Edge, Safari at viewport widths from 1024px to 1920px). No native mobile client binaries (.apk, .ipa) or mobile-specific app store packages will be developed.
   - *Requirements Rationale:* Directs full engineering effort into delivering a single, robust, accessible, and high-performance React + Express web codebase without multi-platform SDK fragmentation.

---

## 2.3 Document Conventions & Master ID Registry Alignment

This document adheres to rigorous documentation conventions and uses standardized terminology and frozen identifiers. 

### 2.3.1 Requirement Identifier Conventions
All requirements, rules, use cases, screens, and test criteria are referenced by unique, frozen identifiers established in the Master ID Registry (`docs/pa2/00-id-registry.md` v1.0.0-frozen):
- `F0x`: High-level feature modules approved in PA0/PA1 (`F01` to `F07`).
- `FR-F0x-nn`: Individual verifiable Functional Requirements scoped by feature module (`FR-F01-01` to `FR-F07-03`).
- `NFR-nn`: Verifiable Non-Functional Requirements and quality attributes (`NFR-01` to `NFR-08`).
- `BR-nn`: Business circulation rules and administrative domain policies (`BR-01` to `BR-10`).
- `UC-nn`: System use cases spanning all user goals and circulation desk operations (`UC-01` to `UC-12`).
- `SCR-nn`: User interface screens and wireframe views (`SCR-01` to `SCR-12`).
- `AC-F0x-nn`: Verifiable Given-When-Then Acceptance Criteria mapped to features (`AC-F01-01` to `AC-F07-02`).

### 2.3.2 Baseline Governance Policy
As established during the PA2 Kickoff on October 23, 2026 (`meetings/2026-10-23-kickoff.md`), all identifiers are formally frozen. No individual team member may alter, renumber, or delete an existing identifier. Any proposed change requires a formal PM Change Request (CR) evaluated for downstream impact on architecture (PA3), test planning (PA4), and traceability before sign-off.

### 2.3.3 Domain Terminology Consistency
All entity names, circulation statuses, and domain definitions used in this document strictly align with the domain glossary established in `docs/pa2/02-glossary.md`. Key terms include:
- **Book Title:** Bibliographic record uniquely identified by ISBN.
- **Book Copy:** Individual physical inventory unit tracked by Barcode / Copy ID and shelf location.
- **Copy States:** Strictly maintained as `Available`, `Borrowed`, `Reserved`, and `Damaged`/`Lost` (per `FR-F03-03`).
- **Circulation Transactions:** Defined by `Loan` (14 calendar days per `BR-02`), `Loan Renewal` (max 1 renewal per `BR-03`), `Overdue Loan` (triggers borrowing suspension per `BR-04`), and `Reservation` (FIFO queue per `BR-07`, 72-hour pickup window per `BR-08`).

---

## 2.4 Intended Audience & Reading Guide

This document is structured to serve diverse stakeholder groups with distinct technical and operational perspectives. Readers are advised to consult the sections most relevant to their responsibilities as outlined in the following reading guide:

```
+--------------------------------------------------------------------------------------------------+
|                                    UNI-LIB SRS READING GUIDE                                     |
+------------------------------------+------------------------------------+------------------------+
| Stakeholder Group                  | Primary Focus Sections             | Purpose of Reading     |
+------------------------------------+------------------------------------+------------------------+
| Course Instructors & TAs           | §1, §2, §3, §4, §9, §10, §11       | Academic evaluation    |
| Business Analyst (Nguyên)          | §2.2, §3, §5.1, §5.3, §6, §7       | Domain rules & UCs     |
| System Architect & Designer (Ánh)  | §2.2, §3.4, §5.2, §6, §8           | UI wireframes & NFRs   |
| Developer (Quân)                   | §2.2, §3.4, §5.1, §5.2, §5.3, §7   | DB schema & API logic  |
| Software Tester & QA Lead (Vinh)   | §5.1, §5.2, §5.4, §7, §9           | Verification & test AC |
| End Users (Readers, Librarians)    | §2.2, §3, §4, §6.2, §8             | Workflows & screens    |
+------------------------------------+------------------------------------+------------------------+
```

### Detailed Reading Guidance by Stakeholder Group

1. **Course Instructors, Teaching Assistants, and Academic Evaluators (FIT - HCMUS):**
   - **Recommended Sections:** Section 1 (Member Contribution Assessment), Section 2 (Introduction & Scope), Section 3 (Problem Statement), Section 9 (Requirements Traceability Matrix), Section 10 (Requirements Review Log), and Section 11 (Consolidated AI Usage Log).
   - **Guidance:** Focus on verifying compliance with course requirements, pedagogical rigor, adherence to Waterfall process gates, strict traceability from user needs to functional requirements, equitable workload allocation, and transparency in AI tool usage.
2. **Business Analyst (BA — Nguyễn Thanh Thảo Nguyên):**
   - **Recommended Sections:** Section 2.2 (Glossary & Conventions), Section 3 (Problem Statement), Section 5.1 (Functional Requirements), Section 5.3 (Business Rules), Section 6 (Use Case Model), and Section 7 (Use Case Specifications).
   - **Guidance:** Ensure that functional requirements comprehensively capture patron and circulation staff needs, that business rules (`BR-01` to `BR-10`) are consistently mapped into use case main, alternative, and exception flows, and that no domain ambiguity remains unresolved.
3. **System Architect & UI/UX Designer (Vũ Thị Ánh):**
   - **Recommended Sections:** Section 2.2 (Scope Boundaries), Section 3.4 (Operating Environment), Section 5.2 (Non-Functional Requirements), Section 6 (Use Case Model & Actors), and Section 8 (Prototype & Screen Inventory).
   - **Guidance:** Map all actor interactions and use case flows into concrete screen wireframes (`SCR-01` to `SCR-12`); ensure layout responsive constraints (1024px to 1920px) and accessibility standards (`NFR-06`) are embedded into UI specifications; extract architectural constraints for C4 modeling in PA3.
4. **Developer (Trần Hà Anh Quân):**
   - **Recommended Sections:** Section 2.2 (Feature Scope & Boundaries), Section 3.4 (Technical Stack Constraints), Section 5.1 (Functional Requirements), Section 5.2 (Non-Functional Requirements), Section 5.3 (Business Rules), and Section 7 (Use Case Detailed Steps).
   - **Guidance:** Examine data entities, relationships, and state transitions (`FR-F03-03`, `BR-09`) to prepare the PostgreSQL schema for PA3; analyze RESTful API endpoint contracts; plan database transaction locking mechanisms (`SELECT ... FOR UPDATE` per `NFR-05`) for concurrency control; verify JWT RBAC boundaries (`NFR-04`).
5. **Software Tester & QA Lead (Nguyễn Phan Thế Vinh):**
   - **Recommended Sections:** Section 5.1 (Functional Requirements), Section 5.2 (Non-Functional Requirements), Section 5.4 (Acceptance Criteria), Section 7 (Alternative & Exception Flows), and Section 9 (Requirements Traceability Matrix).
   - **Guidance:** Analyze Given-When-Then acceptance criteria statements (`AC-F01-01` to `AC-F07-02`) to construct the Master Test Plan and test cases for PA4; verify boundary conditions (e.g., 3-loan maximum, 14-day duration, 72-hour hold window); confirm complete coverage across all 6 Must-have features.
6. **Library Operational Staff & Patron End Users (Librarians, Administrators, Readers):**
   - **Recommended Sections:** Section 2.2 (System Capabilities), Section 3 (Problem Statement), Section 4 (Stakeholders & User Personas), Section 6.2 (Use Case Inventory), and Section 8 (Prototype Wireframes).
   - **Guidance:** Review circulation desk workflows (checkout, return, renewal, hold shelf routing) and reader interactions to confirm that the proposed system accurately reflects practical library operational practices and patron expectations.
