**Introduction to Software Engineering**

**Table of Contents**  
**Right-click here and choose “Update Field” to build the table of contents.**

**Project Proposal & Plan**

# **Objectives**

This document focus on the following topics:

* Completing the Project Proposal & Plan document with the following sections:  
  * Vision  
  * Proposed Solution  
  * Project Plan  
  * Risk Management  
  * Tools & Collaboration Setup  
* Including an AI usage log for this phase  
* Understanding the Project Proposal & Plan document.

1. # **Member Contribution Assessment**

*\[List every member. Contribution (%) must add up to 100%. Evidence: links to tasks on the board, commits or pull requests.\]*

| ID | Name | Role(s) | Contribution (%) | Evidence |
| :---- | :---- | :---- | :---- | :---- |
| 23127520 | Nguyễn Phan Thế Vinh | Team lead / PM, Tester | 25% | Tasks V1–V3 on task board; PA1 project plan, phase gates, WBS & QA strategy |
| 24127469 | Nguyễn Thanh Thảo Nguyên | Business analyst | 25% | Tasks N1–N2 on task board; Vision, problem statement, scope definition & stakeholder needs |
| 24127324 | Vũ Thị Ánh | Designer / Architect | 25% | Tasks A1–A2 on task board; Preliminary architecture, tech stack evaluation & Gantt schedule |
| 24127228 | Trần Hà Anh Quân | Developer | 25% | Tasks Q1–Q2 on task board; Repository setup, GitHub Projects board & tooling configuration |

2. # **Vision**

   1. ## **Preliminary Problem Statement**

*\[Provide an approximately 1–2 page business description of the software problem, including the operating environment (e.g., web browser supporting HTML5, cloud server) and design & implementation constraints (e.g., programming language, database, documentation standards). State the problem at a preliminary level; the detailed problem statement is presented in PA2.\]*

* *Examples: https\://hackmd.io/@nndkhoa9/se-onlineauction-spec*  
* *https\://hackmd.io/@nndkhoa9/se-healthmonitor-spec*

  2. ## **Product Position Statement**

| *Element* | Content |
| :---- | :---- |
| *For* | *\<target customer\>* |
| *Who* | *\<statement of the need or opportunity\>* |
| *The (product name)* | *\<product category\>* |
| *That* | *\<key benefit, compelling reason to use it\>* |
| *Unlike* | *\<primary competitive alternative / current way of working\>* |
| *Our product* | *\<statement of primary differentiation\>* |

  3. ## **Stakeholders and Users**

| \# | Stakeholder / user | Description | Main interests |
| :---- | :---- | :---- | :---- |
| 1 | *\<Project sponsor\>* |  |  |
| 2 | *\<End user\>* |  |  |
|  |  |  |  |
|  |  |  |  |

  4. ## **Scope and Key Features**

*\[List the main features with a MoSCoW priority. Only Must-have features are required to be fully implemented in PA5. State clearly what is out of scope.\]*

| ID | Feature | Description | Priority (M/S/C/W) |
| :---- | :---- | :---- | :---- |
| F01 |  |  | Must |
| F02 |  |  | Should |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

**Out of scope:**

* *\<feature or activity that will not be delivered in this project\>*

3. # **Proposed Solution**

   1. ## **Preliminary Architecture**

*\[Draw a C4 System Context diagram: the system, its users and external systems (payment gateway, email service, …). Detailed architecture is presented in PA3.\]*

2. ## **Technology Stack**

| Layer | Technology | Reason for choice |
| :---- | :---- | :---- |
| Front end | React with JavaScript and Vite | Reusable components suit the Reader, Librarian, and Administrator screens. Vite provides a React development/build workflow; a browser-based application matches PA0 without a native mobile client. |
| Back end | Node.js with Express, REST/JSON API | JavaScript across client and server reduces language switching for the student team. Express routing and middleware support the six feature modules, input validation, authorization, and consistent error handling. |
| Database | PostgreSQL | Relational constraints and transactions suit users, book titles, physical copies, loans, and reservations. Borrow/return operations need coordinated updates; detailed schema and concurrency rules belong to PA3. |
| Hosting / deployment | Vercel for the React frontend; Render for the Express API and PostgreSQL | Retains the PA0 proposal and separates static frontend delivery from the API/database. Hosting is planned for PA5; budget, database retention, and service limits must be checked before provisioning. |
| Testing & CI | Vitest + React Testing Library for frontend tests; Jest + Supertest for backend tests; GitHub Actions for CI | Matches WBS 4.1.2: component tests cover user interactions, API tests cover authorization and circulation rules, and CI provides repeatable checks. PA1 currently runs repository checks only; test setup is scheduled for PA4 and application test execution for PA5. |

**Decision status:** Proposal prepared by Quân for PA1-Q2; review by Ánh and team confirmation are pending. This preserves PA0's proposed core stack and F01–F06 scope. No application packages, detailed schema, or deployment are introduced in PA1.

**Implementation constraints:** Select supported, mutually compatible versions when the application is initialized and record them in manifests/lockfiles. The current repository CI uses Node.js 22; Vite currently requires Node.js 20.19+ or 22.12+, so verify the chosen toolchain before setup. Render's free web services can spin down after inactivity and free PostgreSQL databases expire after 30 days; Vinh must include a viable demo/data-retention plan in the cost estimate rather than assume free hosting lasts the entire course.

**References:** [Vite setup](https://vite.dev/guide/), [Express middleware](https://expressjs.com/guide/using-middleware/), [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite), [Render free-service limits](https://render.com/docs/free), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Supertest](https://github.com/forwardemail/supertest).

   3. ## **Hardware and Operating Environment**

*\[Describe the hardware, devices and environments needed to develop, test and run the software.\]*

4. # **Project Plan**

   1. ## **Process and Phase Gates**

The project follows the waterfall model. Each phase ends with a phase gate (a PA submission). After a PA is submitted it becomes a baseline; later changes must be updated in the document and listed in the next PA.

| PA | Phase | Due | Exit criteria (fill in) |
| :---- | :---- | :---- | :---- |
| PA1 | Initiation & planning | End of week 3 | • Project Proposal & Plan approved and submitted (Vision, Scope, Solution architecture overview, 3-level WBS, Schedule/Gantt baseline, Roles & Responsibilities, Risk Management).<br>• Git repository structure (`/src`, `/docs`, `/pa`) initialized; `main` branch protection configured; GitHub Projects task board populated with all WBS work packages.<br>• Baseline agreed by all 4 members and verified compliant with PA0 constraints. |
| PA2 | Requirements | End of week 5 | • Software Requirements Specification (SRS) completed and baselined, specifying functional requirements for all 6 Must-have features (F01–F06) and non-functional requirements.<br>• Complete Use Case specifications and Use Case diagram delivered for Reader, Librarian, and Administrator actors.<br>• Low-fidelity UI wireframes for all core user workflows reviewed and approved by BA and PM.<br>• Requirements Traceability Matrix (RTM) established mapping business needs to functional requirements. |
| PA3 | Design | End of week 7 | • Software Architecture Document (SAD) completed with C4 System Context and Container diagrams.<br>• Relational database schema (PostgreSQL) designed with 3NF normalized tables, constraints, and ERD for Book Titles, Copies, Loans, Reservations, and Users/Roles.<br>• RESTful API specification (endpoints, HTTP methods, request/response JSON schemas, error codes) documented and reviewed.<br>• High-fidelity UI mockups and design tokens finalized; Architectural Decision Records (ADRs) recorded. |
| PA4 | Test planning | End of week 8 | • Master Test Plan finalized defining test scope, test levels, defect classification, and environment criteria.<br>• Detailed test cases designed for all 6 Must-have features (F01–F06), covering positive paths, boundary conditions, and state transitions (Loans/Reservations).<br>• Requirements-to-test traceability matrix completed with 100% Must-have coverage.<br>• Automated test framework setup and verified in repository. |
| PA5 | Implementation, testing & deployment | End of week 10 | • All 6 Must-have features (F01–F06) implemented in React (FE) and Express/PostgreSQL (BE) with passing unit and integration tests.<br>• All code merged to `main` via pull requests with required peer review approvals and conventional commit history.<br>• Full system test execution completed with 0 critical or high-severity open defects; Test Summary Report published.<br>• Web application successfully deployed to cloud hosting (Vercel for FE, Render for BE/DB) with verified staging/production smoke tests. |
| Final | Presentation & demo | Week 11 | • End-to-end live demonstration of all 6 Must-have library workflows executed smoothly without critical failure.<br>• Final presentation slide deck delivered and rehearsed by all team members.<br>• Final project repository, documentation baselines, individual contribution assessments, and project retrospective submitted. |

2. ## **Work Breakdown Structure (WBS)**

The UniLib project is structured using a hierarchical Work Breakdown Structure (WBS) with 3 levels of decomposition:
* **Level 1 (Phase):** Aligned with the project life cycle gates (PA1 to Final).
* **Level 2 (Deliverable / Sub-phase):** Major milestones or functional groupings.
* **Level 3 (Work Package):** Atomic, manageable work packages sized between 2 and 8 person-hours, each assigned to exactly one owner and trackable as an issue on GitHub Projects.

All 6 Must-have features (**F01 Authentication & Roles**, **F02 Book Catalog Management**, **F03 Book Copy Management**, **F04 Search & Browse**, **F05 Borrow & Return**, **F06 Book Reservation**) are systematically addressed across PA2 through PA5.

### **WBS Master Dictionary Table**

| WBS ID | Work Package Name | Description & Key Deliverables | Owner | Effort (h) | Stream / Feature |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **1.0** | **PA1 Initiation & Planning** | **Project kickoff, baseline scope, planning document, and tooling** | **Vinh** | **54** | **Management** |
| 1.1.1 | Project Kickoff Meeting & Charter Sign-off | Conduct kickoff meeting, agree on working rules, internal deadlines, and finalize kickoff meeting minutes. | Vinh | 3 | Management |
| 1.1.2 | Governance & Roles Alignment | Formalize main/backup role assignments, conflict resolution workflow, and decision-making protocol. | Vinh | 2 | Management |
| 1.2.1 | Preliminary Vision & Problem Statement | Draft business problem description, target user profiles, and product positioning statement. | Nguyên | 5 | Vision |
| 1.2.2 | Stakeholder Needs & MoSCoW Scope | Define stakeholder profiles and categorize features into MoSCoW priority, strictly establishing out-of-scope boundaries. | Nguyên | 4 | Scope |
| 1.2.3 | Preliminary Architecture & Technology Justification | Construct preliminary C4 context diagram and evaluate stack suitability (React, Express, PostgreSQL, Vercel/Render). | Ánh | 4 | Architecture |
| 1.2.4 | Hardware & Operating Environment Specification | Specify developer machines, browser support targets, and cloud hosting constraints. | Ánh | 3 | Architecture |
| 1.2.5 | Process Gates & Exit Criteria Definition | Define phase gate milestones (PA1 to Final) with specific, verifiable exit criteria. | Vinh | 3 | Planning |
| 1.2.6 | Work Breakdown Structure (WBS) Authoring | Structure hierarchical 3-level WBS (phases, deliverables, work packages of 2–8h) with single ownership. | Vinh | 6 | Planning |
| 1.2.7 | Effort & Cost Estimation Baseline | Calculate person-hour estimates and formulate human resource/tooling cost model. | Vinh | 4 | Planning |
| 1.2.8 | Project Schedule & Critical Path Mapping | Build schedule network, identify milestone dependencies, critical path, and initial Gantt chart. | Ánh | 5 | Planning |
| 1.2.9 | Project Risk Identification & Mitigation | Identify at least 5 key risks across technical, people, and organizational categories; calculate RE (P × L) and define contingency plans. | Vinh | 4 | Risk |
| 1.3.1 | Version Control & Repository Structure Setup | Initialize GitHub repository with standard structure (`/src`, `/docs`, `/pa`), README, .gitignore, and branch protection rules. | Quân | 3 | Infrastructure |
| 1.3.2 | Task Board & Tracking Configuration | Set up GitHub Projects board, configure kanban columns, labels, milestones, and import initial WBS tasks. | Quân | 4 | Infrastructure |
| 1.3.3 | PA1 Document Compilation & Review | Consolidate individual contributions into PA1 markdown, perform peer review, and finalize submission baseline. | Vinh | 4 | Management |
| **2.0** | **PA2 Requirements Engineering** | **Software Requirements Specification (SRS), Use Cases, Wireframes & RTM** | **Nguyên** | **60** | **Requirements** |
| 2.1.1 | Domain Modeling & Glossary Definition | Analyze library circulation domain; define standardized glossary (Book Title, Book Copy, Loan, Reservation, Overdue). | Nguyên | 4 | Domain |
| 2.1.2 | System Use Case Modeling | Construct system-level Use Case diagram for Reader, Librarian, and Administrator actors. | Nguyên | 4 | Domain |
| 2.2.1 | F01 User Authentication & Roles Specification | Detail functional requirements, login flows, role-based authorization rules (Reader, Librarian, Admin), and use case specs. | Nguyên | 4 | F01 Auth |
| 2.2.2 | F02 Book Catalog Management Specification | Specify functional requirements and use cases for adding, editing, and viewing book titles, ISBNs, authors, and categories. | Nguyên | 5 | F02 Catalog |
| 2.2.3 | F03 Book Copy Management Specification | Specify requirements for tracking physical copies, copy IDs/barcodes, and Available/Borrowed/Reserved state transitions. | Nguyên | 5 | F03 Copy |
| 2.2.4 | F04 Search & Browse Specification | Specify search queries (title, author, category, ISBN), multi-attribute filtering, and real-time availability display. | Nguyên | 4 | F04 Search |
| 2.2.5 | F05 Borrow & Return Management Specification | Detail use case flows for loan checkout, due date calculation, return processing, copy state updates, and overdue tracking rules. | Nguyên | 6 | F05 Loan |
| 2.2.6 | F06 Book Reservation Specification | Specify reservation queue rules, title reservation when all copies are borrowed, reservation priority, and pickup hold states. | Nguyên | 5 | F06 Reservation |
| 2.2.7 | Non-Functional Requirements & Constraints | Detail performance, security, data integrity, usability, and browser support requirements. | Ánh | 4 | NFR |
| 2.3.1 | Reader/Student Workflow Wireframes | Create UI wireframes for search/browse, book detail, reservation placement, and personal loan/reservation views. | Ánh | 5 | UI/UX |
| 2.3.2 | Librarian & Admin Management Wireframes | Create UI wireframes for catalog CRUD, copy inventory, circulation desk (borrow/return/overdue), and user administration. | Ánh | 6 | UI/UX |
| 2.4.1 | Requirements Traceability Matrix (RTM) Baseline | Construct RTM linking user needs to functional requirements (F01–F06) and establish test verification methods. | Vinh | 4 | QA / Traceability |
| 2.4.2 | PA2 Document Review & Verification | Conduct team walkthrough of SRS, resolve requirement ambiguities, verify against PA1 baseline, and submit PA2. | Vinh | 4 | Management |
| **3.0** | **PA3 Architecture & Detailed Design** | **System Architecture (C4), Relational Schema (PostgreSQL), REST API & UI Mockups** | **Ánh** | **56** | **Design** |
| 3.1.1 | C4 Architecture Modeling (Context & Container) | Create C4 Context and Container diagrams specifying React SPA, Node.js/Express REST API, and PostgreSQL DB. | Ánh | 5 | Architecture |
| 3.1.2 | Architectural Decision Records (ADRs) | Author ADRs for JWT authentication, database access patterns, API error handling, and state management strategy. | Quân | 4 | Architecture |
| 3.2.1 | Conceptual & Logical Data Modeling (ERD) | Design Entity-Relationship Diagram covering Users, Roles, BookTitles, BookCopies, Loans, and Reservations. | Ánh | 5 | Database |
| 3.2.2 | Physical Database Schema & DDL Scripts | Write normalized 3NF PostgreSQL DDL schema with primary/foreign keys, indexes, check constraints, and seed data scripts. | Quân | 5 | Database |
| 3.3.1 | API Specification for F01 Auth & User Management | Specify RESTful API endpoints, request/response JSON schemas, and HTTP status codes for auth and users. | Quân | 4 | F01 Auth |
| 3.3.2 | API Specification for F02 Catalog & F03 Copy Management | Specify REST endpoints for book titles CRUD, copy additions, and inventory queries. | Quân | 5 | F02 & F03 |
| 3.3.3 | API Specification for F04 Search & Browse | Specify endpoints for catalog search with query parameters, filtering, pagination, and copy counts. | Quân | 4 | F04 Search |
| 3.3.4 | API Specification for F05 Borrow & Return | Specify endpoints for loan checkout, check-in, loan renewal/due date, and overdue loan listings. | Quân | 5 | F05 Loan |
| 3.3.5 | API Specification for F06 Book Reservation | Specify endpoints for creating reservations, viewing queue status, cancellation, and pickup fulfillment. | Quân | 4 | F06 Reservation |
| 3.4.1 | UI Design System & Component Library | Design reusable UI components (buttons, modals, tables, badges, form inputs), color scheme, and typography tokens. | Ánh | 5 | UI/UX |
| 3.4.2 | High-Fidelity Mockups for Key Workflows | Produce high-fidelity mockups for Reader search/reserve and Librarian circulation desk. | Ánh | 6 | UI/UX |
| 3.5.1 | Design Review & Traceability Verification | Inspect API and DB designs against SRS functional requirements; update RTM and compile PA3 deliverable. | Vinh | 4 | Management |
| **4.0** | **PA4 Test Planning & QA Setup** | **Master Test Plan, Test Cases for F01–F06, Test Environment & Automated Setup** | **Vinh** | **41** | **Testing** |
| 4.1.1 | Master Test Plan Authoring | Define test strategy, test levels (unit, integration, system), environment configuration, entry/exit criteria, and defect severity levels. | Vinh | 5 | QA Strategy |
| 4.1.2 | Test Automation Framework Setup | Configure backend testing tools (Jest, Supertest) and frontend testing tools (Vitest/React Testing Library) with sample test cases. | Quân | 4 | QA Setup |
| 4.2.1 | Test Cases for F01 Authentication & Roles | Author detailed test cases for login validation, password hashing, role-based route guards, and token expiry. | Vinh | 5 | F01 Auth |
| 4.2.2 | Test Cases for F02 Catalog & F03 Copy Management | Author test cases for book title CRUD, ISBN uniqueness, copy status updates (Available/Borrowed/Reserved), and deletions. | Vinh | 5 | F02 & F03 |
| 4.2.3 | Test Cases for F04 Search & Browse | Author test cases for keyword search, filtering by category/author, pagination, and availability counter accuracy. | Vinh | 4 | F04 Search |
| 4.2.4 | Test Cases for F05 Borrow & Return | Author test cases for loan creation, due date setting, return processing, copy status transitions, and overdue loan detection. | Vinh | 6 | F05 Loan |
| 4.2.5 | Test Cases for F06 Book Reservation | Author test cases for reserving unavailable books, reservation queue FIFO, hold status on return, and user cancellation. | Vinh | 5 | F06 Reservation |
| 4.3.1 | Test Traceability Matrix & Test Data Specification | Map test cases to SRS requirements (F01–F06) in RTM and document mock test datasets. | Nguyên | 4 | QA / Traceability |
| 4.3.2 | PA4 Document Review & Baseline | Review test cases for completeness with Developer and BA; finalize and submit PA4. | Vinh | 3 | Management |
| **5.0** | **PA5 Implementation, Testing & Deployment** | **Frontend (React), Backend (Express), PostgreSQL, Integration & Cloud Deployment** | **Quân** | **91** | **Development** |
| 5.1.1 | Backend Boilerplate & DB Connection Setup | Initialize Express app, configure PostgreSQL connection pool, migration scripts, and error-handling middleware. | Quân | 5 | Dev Infrastructure |
| 5.1.2 | Frontend Boilerplate & Layout Setup | Initialize React app, configure router, global state/context for auth, and common layout shell (navbar, sidebar). | Quân | 5 | Dev Infrastructure |
| 5.2.1 | F01 Authentication & Role-Based Access Control | Implement JWT auth endpoints, password hashing (bcrypt), login UI, and role-protected routes (Reader, Librarian, Admin). | Quân | 6 | F01 Auth |
| 5.2.2 | F02 Book Catalog Management Module | Implement backend CRUD endpoints and Librarian UI to add, edit, and delete book titles. | Quân | 6 | F02 Catalog |
| 5.2.3 | F03 Book Copy Management Module | Implement backend copy endpoints and UI to register physical copies with barcode IDs and manage Available/Borrowed status. | Quân | 5 | F03 Copy |
| 5.2.4 | F04 Search & Browse Books Module | Implement catalog search API with multi-attribute filtering and responsive Reader UI with availability tags. | Ánh | 6 | F04 Search |
| 5.2.5 | F05 Borrow & Return Management Module | Implement circulation API/UI for loan checkout, return check-in, copy status sync, and Librarian overdue list. | Quân | 8 | F05 Loan |
| 5.2.6 | F06 Book Reservation Module | Implement reservation placement when copies are unavailable, queue ordering, and hold transition on copy return. | Quân | 7 | F06 Reservation |
| 5.2.7 | Reader Dashboard & Active Loans View | Implement Reader dashboard displaying current borrowed books, due dates, overdue notices, and active reservations. | Ánh | 5 | UI / Reader |
| 5.3.1 | Automated Unit & Integration Testing | Implement automated API tests for auth, circulation rules, copy status transitions, and reservation constraints. | Quân | 6 | QA Automation |
| 5.3.2 | Manual System Testing & Bug Logging | Execute PA4 test suite against integrated web app; log bugs with steps and severity on GitHub Issues. | Vinh | 7 | System Testing |
| 5.3.3 | Bug Fixing & Regression Verification | Fix reported defects in frontend and backend; verify resolved issues and perform regression testing. | Quân | 6 | Bug Fixing |
| 5.3.4 | Test Summary Report & QA Sign-off | Compile test execution metrics, defect resolution stats, and finalize Test Summary Report. | Vinh | 4 | QA Sign-off |
| 5.4.1 | Cloud DB & Backend Deployment on Render | Provision PostgreSQL database on Render, run production migrations, deploy Express API, and configure environment variables. | Quân | 4 | Deployment |
| 5.4.2 | Frontend Cloud Deployment on Vercel | Deploy React frontend to Vercel, configure production API base URL, CORS, and custom build scripts. | Quân | 4 | Deployment |
| 5.4.3 | Production Smoke Testing & Deployment Documentation | Perform live smoke testing across all 6 features on production URLs; document deployment instructions in README. | Vinh | 4 | Deployment |
| 5.4.4 | PA5 Submission & Code Baseline | Review final repository status, verify deployment health, package artifacts, and submit PA5. | Vinh | 3 | Management |
| **6.0** | **Final Presentation, Demo & Closeout** | **End-to-End System Demo, Presentation Slide Deck, Contribution Report & Retrospective** | **Vinh** | **16** | **Final** |
| 6.1.1 | Demo Scenario Scripting & Seed Data Preparation | Prepare comprehensive demonstration script and realistic seed data covering all 6 Must-haves and edge cases. | Nguyên | 4 | Demo |
| 6.1.2 | Demo Rehearsal & Backup Recording | Conduct full team dry run of live demonstration and record backup video walkthrough of core workflows. | Vinh | 3 | Demo |
| 6.2.1 | Presentation Slide Deck Creation | Author final presentation slides detailing project vision, architecture, demo, metrics, and teamwork reflection. | Ánh | 5 | Presentation |
| 6.2.2 | Final Contribution Assessment & Project Retrospective | Compile individual contribution evidence, calculate final percentages, document retrospective lessons, and submit final package. | Vinh | 4 | Closeout |
| **Total** | **Project Total Estimated Effort** | **Full project life cycle across 11 weeks (4 members)** | **All** | **318** | **All Streams** |

3. ## **Estimation**

### **4.3.1 Estimation Methodology & Principles**
Effort estimation for the UniLib project is conducted using a bottom-up technique based on the 3-level Work Breakdown Structure (WBS). To ensure rigorous, realistic, and defensible effort allocations, the team applies the **Three-Point Estimation technique (PERT)** combined with **Expert Judgement** and **Analogy** from previous academic and professional software engineering benchmarks.

For each of the 69 atomic work packages, three estimates are established in person-hours:
* **Optimistic ($O$):** Effort required assuming optimal conditions, familiar tools, minimal defect discovery, and immediate peer review turnaround.
* **Most Likely ($M$):** Realistic effort expected under normal student working conditions, accounting for typical syntax debugging and testing overhead.
* **Pessimistic ($P$):** Effort required under unfavorable scenarios, including subtle asynchronous state bugs, database constraint conflicts, or cloud deployment configuration friction.

The expected person-hour effort ($E$) is calculated using the standard PERT weighted formula:
$$E = \frac{O + 4M + P}{6}$$

### **4.3.2 Key Estimation Assumptions**
1. **Team Bandwidth & Course Constraints:** The project spans 11 academic weeks with 4 team members. Each member commits 6–8 person-hours per week according to the course rules, yielding a total team capacity of 264–352 person-hours.
2. **Scope Containment:** Strict adherence to the 6 Must-have features (F01–F06) approved in PA0. Out-of-scope capabilities (hardware barcode scanners, payment gateways, mobile apps, e-book readers) require zero effort.
3. **Unified JavaScript Stack:** Using React (Vite) on the frontend and Node.js (Express) on the backend significantly reduces context-switching penalties between client and server development.
4. **Buffer Allocation:** Sizable buffers (up to 40% variance between $O$ and $P$) are allocated to PA5 implementation (91 person-hours), automated integration testing, and cloud deployment on Render/Vercel to guard against student-schedule compression.

### **4.3.3 WBS Effort Reconciliation & Team Capacity Alignment**
During preliminary proposal drafting, coarse placeholder totals (274h) were tentatively noted. The detailed bottom-up decomposition across all 69 level-3 work packages yields exactly **318 person-hours**. Distributed over the 11-week life cycle across 4 members, this represents:
$$\frac{318\text{ hours}}{4\text{ members} \times 11\text{ weeks}} = 7.23\text{ person-hours/member/week}$$
This aligns precisely with the 6–8 hours/week capacity commitment, confirming that the project plan is fully achievable without requiring overtime.

### **Master Work Package Estimation Table**

| WBS ID | Work Package Name | Owner | Effort (person-hours) | Method / Assumptions |
| :---- | :---- | :---- | :---- | :---- |
| **PA1** | **Phase PA1 Work Packages Subtotal** | **Team** | **54 h** | **Subtotal of all level-3 packages in Phase PA1** |
| 1.1.1 | Project Kickoff Meeting & Charter Sign-off | Vinh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; 4 members present; agenda prepared; 1.25h meeting + 1.75h minutes documentation |
| 1.1.2 | Governance & Roles Alignment | Vinh | 2 h (O:1, M:2, P:3) | Three-point (PERT) & expert judgement; Formalizing primary/backup role matrix and escalation rules based on Team Contract |
| 1.2.1 | Preliminary Vision & Problem Statement | Nguyên | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Analyzing small/university library operational pains; writing business problem statement |
| 1.2.2 | Stakeholder Needs & MoSCoW Scope | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; MoSCoW classification fixing F01–F06 as Must-have; confirming strict out-of-scope boundaries |
| 1.2.3 | Preliminary Architecture & Technology Justification | Ánh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Evaluating React/Node/Express/PostgreSQL against student skillset and deployment feasibility |
| 1.2.4 | Hardware & Operating Environment Specification | Ánh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Documenting modern evergreen browser targets (Chrome/Firefox/Edge) and Node.js 22 LTS runtime |
| 1.2.5 | Process Gates & Exit Criteria Definition | Vinh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Establishing rigorous, verifiable exit criteria for PA1 through Final demo |
| 1.2.6 | Work Breakdown Structure (WBS) Authoring | Vinh | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Decomposing 6 phases into 69 atomic packages (2–8h) with single ownership |
| 1.2.7 | Effort & Cost Estimation Baseline | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Applying PERT three-point estimation; reconciling 318h against 6–8h/wk capacity; costing junior rate |
| 1.2.8 | Project Schedule & Critical Path Mapping | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Mapping calendar dependencies, determining critical path, scheduling PA milestones |
| 1.2.9 | Project Risk Identification & Mitigation | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Assessing 5+ risk scenarios across tech, people, and schedule; calculating Risk Exposure (RE = P x L) |
| 1.3.1 | Version Control & Repository Structure Setup | Quân | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Git init with /src, /docs, /pa skeletons, .gitignore, branch protection rules for main |
| 1.3.2 | Task Board & Tracking Configuration | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; GitHub Projects board setup with Backlog/Todo/In Progress/Review/Done columns and issue mapping |
| 1.3.3 | PA1 Document Compilation & Review | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Consolidating all contributions, performing team review, verifying formatting and baseline submission |
| **PA2** | **Phase PA2 Work Packages Subtotal** | **Team** | **60 h** | **Subtotal of all level-3 packages in Phase PA2** |
| 2.1.1 | Domain Modeling & Glossary Definition | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Domain analysis for circulation; standardizing terms: Book Title, Book Copy, Loan, Reservation, Overdue |
| 2.1.2 | System Use Case Modeling | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; UML Use Case diagram modeling Reader, Librarian, and Administrator boundaries |
| 2.2.1 | F01 User Authentication & Roles Specification | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying authentication, credential validation, RBAC route guards for 3 roles |
| 2.2.2 | F02 Book Catalog Management Specification | Nguyên | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Specifying book title catalog metadata (title, author, ISBN, category, publisher, year) |
| 2.2.3 | F03 Book Copy Management Specification | Nguyên | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Specifying physical copy tracking with unique copy barcode/ID and Available/Borrowed/Reserved states |
| 2.2.4 | F04 Search & Browse Specification | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying keyword search, multi-field filters, pagination, and real-time copy availability counter |
| 2.2.5 | F05 Borrow & Return Management Specification | Nguyên | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Circulation logic: loan checkout, return check-in, loan period calculation, overdue detection rules |
| 2.2.6 | F06 Book Reservation Specification | Nguyên | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; FIFO reservation queue specification; auto-hold assignment on copy return; reservation cancellation |
| 2.2.7 | Non-Functional Requirements & Constraints | Ánh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying response time (<2s), concurrent user targets (20), data integrity, security constraints |
| 2.3.1 | Reader/Student Workflow Wireframes | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Low-fidelity wireframes for Reader search, catalog view, title reservation, and my-loans dashboard |
| 2.3.2 | Librarian & Admin Management Wireframes | Ánh | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Low-fidelity wireframes for Librarian catalog CRUD, physical copy inventory, circulation desk, overdue list |
| 2.4.1 | Requirements Traceability Matrix (RTM) Baseline | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Mapping stakeholder needs to functional requirements F01–F06 and test verification methods |
| 2.4.2 | PA2 Document Review & Verification | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Team walkthrough of SRS, resolving requirement gaps, verifying compliance with PA1 baseline |
| **PA3** | **Phase PA3 Work Packages Subtotal** | **Team** | **56 h** | **Subtotal of all level-3 packages in Phase PA3** |
| 3.1.1 | C4 Architecture Modeling (Context & Container) | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; C4 System Context & Container diagrams defining React SPA, Express REST API, and PostgreSQL DB |
| 3.1.2 | Architectural Decision Records (ADRs) | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Documenting ADRs for JWT auth, PostgreSQL connection pool, REST API conventions, error handling |
| 3.2.1 | Conceptual & Logical Data Modeling (ERD) | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Conceptual and logical ERD covering Users, Roles, BookTitles, BookCopies, Loans, Reservations |
| 3.2.2 | Physical Database Schema & DDL Scripts | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Normalized 3NF PostgreSQL DDL script with foreign keys, check constraints, unique ISBN/copy IDs, seed data |
| 3.3.1 | API Specification for F01 Auth & User Management | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying REST endpoints /api/auth/login, /api/auth/me, /api/users with JSON schemas and status codes |
| 3.3.2 | API Specification for F02 Catalog & F03 Copy Management | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Specifying REST endpoints for book titles CRUD (/api/books) and copy inventory (/api/books/:id/copies) |
| 3.3.3 | API Specification for F04 Search & Browse | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying query parameters (q, category, author, isbn, page, limit) and response schema with copy availability |
| 3.3.4 | API Specification for F05 Borrow & Return | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Specifying circulation endpoints (/api/loans/checkout, /api/loans/:id/return, /api/loans/overdue) with atomic updates |
| 3.3.5 | API Specification for F06 Book Reservation | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Specifying reservation endpoints (/api/reservations, /api/reservations/:id/cancel) and queue transition specs |
| 3.4.1 | UI Design System & Component Library | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Establishing UI design tokens (color palette, typography, spacing) and reusable component specs in Figma |
| 3.4.2 | High-Fidelity Mockups for Key Workflows | Ánh | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; High-fidelity mockups for key circulation and catalog workflows for Reader, Librarian, Admin |
| 3.5.1 | Design Review & Traceability Verification | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Traceability check linking API/DB design to SRS; consolidating Software Architecture Document (SAD) |
| **PA4** | **Phase PA4 Work Packages Subtotal** | **Team** | **41 h** | **Subtotal of all level-3 packages in Phase PA4** |
| 4.1.1 | Master Test Plan Authoring | Vinh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Authoring Master Test Plan: defining unit, integration, system test levels, entry/exit criteria, bug severity |
| 4.1.2 | Test Automation Framework Setup | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Configuring Jest + Supertest (backend) and Vitest + React Testing Library (frontend) config files in repo |
| 4.2.1 | Test Cases for F01 Authentication & Roles | Vinh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Designing test cases for auth: valid login, wrong password, role route access, expired token |
| 4.2.2 | Test Cases for F02 Catalog & F03 Copy Management | Vinh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Designing test cases for catalog CRUD: duplicate ISBN, mandatory fields, copy addition, state validation |
| 4.2.3 | Test Cases for F04 Search & Browse | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Designing test cases for catalog search: query matches, multi-filter, pagination, availability display |
| 4.2.4 | Test Cases for F05 Borrow & Return | Vinh | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Designing test cases for loan checkout (available copy only), due date calculation, return check-in, overdue tracking |
| 4.2.5 | Test Cases for F06 Book Reservation | Vinh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Designing test cases for reservation: placing hold on 0 available copies, FIFO queue order, hold status on return |
| 4.3.1 | Test Traceability Matrix & Test Data Specification | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Updating RTM to ensure 100% test case coverage for F01–F06 and defining mock test fixtures |
| 4.3.2 | PA4 Document Review & Baseline | Vinh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Team inspection of test cases, cross-verification with Developer, compiling and submitting PA4 deliverable |
| **PA5** | **Phase PA5 Work Packages Subtotal** | **Team** | **91 h** | **Subtotal of all level-3 packages in Phase PA5** |
| 5.1.1 | Backend Boilerplate & DB Connection Setup | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Express server setup, node-postgres connection pool, migration scripts, error handling middleware |
| 5.1.2 | Frontend Boilerplate & Layout Setup | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; React 18 + Vite setup, react-router-dom, AuthContext, UI layout shell (navbar, footer, sidebar) |
| 5.2.1 | F01 Authentication & Role-Based Access Control | Quân | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Implementing JWT auth backend (bcrypt hashing, token generation) and React login form with route guards |
| 5.2.2 | F02 Book Catalog Management Module | Quân | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Implementing book title CRUD API and Librarian catalog management UI tables/forms |
| 5.2.3 | F03 Book Copy Management Module | Quân | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Implementing physical copy registration API and UI with copy barcode and Available/Borrowed status |
| 5.2.4 | F04 Search & Browse Books Module | Ánh | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Implementing search API with SQL ILIKE/indexes and Reader catalog browsing UI with real-time availability badges |
| 5.2.5 | F05 Borrow & Return Management Module | Quân | 8 h (O:6, M:8, P:10) | Three-point (PERT) & expert judgement; Implementing circulation API/UI: loan creation with transaction, return check-in, overdue tracking list |
| 5.2.6 | F06 Book Reservation Module | Quân | 7 h (O:5, M:7, P:9) | Three-point (PERT) & expert judgement; Implementing reservation queue logic in SQL transaction, hold state transition on copy return, reservation cancellation |
| 5.2.7 | Reader Dashboard & Active Loans View | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Implementing Reader personal dashboard: active loans list, due dates, overdue notices, and reservation queue status |
| 5.3.1 | Automated Unit & Integration Testing | Quân | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Writing automated integration tests for circulation rules, copy status transitions, reservation constraints via Supertest |
| 5.3.2 | Manual System Testing & Bug Logging | Vinh | 7 h (O:5, M:7, P:9) | Three-point (PERT) & expert judgement; Executing PA4 test suite against integrated app; logging defects with reproduction steps on GitHub Issues |
| 5.3.3 | Bug Fixing & Regression Verification | Quân | 6 h (O:4, M:6, P:8) | Three-point (PERT) & expert judgement; Fixing reported defects in React UI and Express backend; running regression test suite to verify 0 critical bugs |
| 5.3.4 | Test Summary Report & QA Sign-off | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Compiling test pass rate metrics, defect resolution stats, and publishing Test Summary Report |
| 5.4.1 | Cloud DB & Backend Deployment on Render | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Provisioning PostgreSQL on Render, running DDL migration scripts, deploying Express API web service |
| 5.4.2 | Frontend Cloud Deployment on Vercel | Quân | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Deploying React frontend to Vercel, configuring production environment variables (VITE_API_URL) and CORS |
| 5.4.3 | Production Smoke Testing & Deployment Documentation | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Executing live production smoke tests across all 6 Must-haves; documenting deployment steps in README |
| 5.4.4 | PA5 Submission & Code Baseline | Vinh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Final repository check, verifying live deployed links, tagging PA5 release, submitting PA5 deliverable |
| **Final** | **Phase Final Work Packages Subtotal** | **Team** | **16 h** | **Subtotal of all level-3 packages in Phase Final** |
| 6.1.1 | Demo Scenario Scripting & Seed Data Preparation | Nguyên | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Writing detailed demo script covering end-to-end library workflow and seeding realistic mock library data |
| 6.1.2 | Demo Rehearsal & Backup Recording | Vinh | 3 h (O:2, M:3, P:4) | Three-point (PERT) & expert judgement; Dry run demo with all 4 members; recording backup video demonstration to mitigate live presentation risks |
| 6.2.1 | Presentation Slide Deck Creation | Ánh | 5 h (O:3, M:5, P:7) | Three-point (PERT) & expert judgement; Creating slide deck: problem, architecture, demo walkthrough, test results, lessons learned |
| 6.2.2 | Final Contribution Assessment & Project Retrospective | Vinh | 4 h (O:3, M:4, P:5) | Three-point (PERT) & expert judgement; Compiling final contribution assessment (25% each), team retrospective report, and final course closeout |
| **Total** | **Project Total Estimated Effort** | **All Members** | **318 h** | **Complete 11-week lifecycle effort: 7.23 h/person/week average across 4 members** |

4. ## **Schedule**

### **4.4.1 Schedule Architecture: Effort versus Duration**
A fundamental project management principle applied in UniLib is the explicit distinction between Work Effort and Task Duration:
* **Effort (person-hours):** The actual net labor time required to execute the deliverable (totaling 318 person-hours across all 69 packages).
* **Duration (calendar days/weeks):** The elapsed calendar time from task inception to completion. Because team members are university students balancing other coursework with an allocation of 6–8 hours/week, a 6-hour work package typically spans 3–4 calendar days.

The project follows a linear Waterfall progression structured into 6 major lifecycle phases and anchored by strict Phase Gate Milestones. Work package dependencies are modeled using Finish-to-Start (FS) logic with predecessor constraints.

### **4.4.2 Project Phase Gate Milestones Table**

| Milestone | Phase | Key Deliverables & Exit Criteria | Target Baseline Date | Critical Path? |
| :---- | :---- | :---- | :---- | :---- |
| **M1** | PA1 | Project Proposal & Plan baselined, repo structure protected, GitHub Projects board populated with 69 WBS tasks. | 2026-10-25 (End of W3) | **Yes [CP]** |
| **M2** | PA2 | SRS completed with detailed specs for F01–F06, Use Case model, wireframes, and RTM baseline. | 2026-11-08 (End of W5) | **Yes [CP]** |
| **M3** | PA3 | C4 architecture (Context/Container), 3NF PostgreSQL schema DDL, REST API specs for F01–F06, and UI mockups. | 2026-11-22 (End of W7) | **Yes [CP]** |
| **M4** | PA4 | Master Test Plan, detailed test cases for F01–F06 with 100% requirements coverage, and automated test setup. | 2026-11-29 (End of W8) | **Yes [CP]** |
| **M5** | PA5 | Full implementation of F01–F06, automated test suite passing, 100% critical bugs resolved, deployed to Vercel/Render. | 2026-12-13 (End of W10) | **Yes [CP]** |
| **M6** | Final | Live system demo of all 6 Must-haves, final slide deck, peer contribution assessments, and project retrospective. | 2026-12-20 (Week 11) | **Yes [CP]** |

### **4.4.3 Master Project Schedule & Gantt Data Table**

| WBS ID | Task / Work Package Name | Owner | Effort | Duration | Start Date | End Date | Predecessors | CP? |
| :---- | :---- | :---- | :----: | :----: | :----: | :----: | :---- | :----: |
| **PA1** | **Phase PA1 Timeline** | **Team** | **54h** | **-** | **2026-10-15** | **2026-10-24** | **-** | **[CP]** |
| 1.1.1 | Project Kickoff Meeting & Charter Sign-off | Vinh | 3h | 1d | 2026-10-15 | 2026-10-15 | None | **[CP]** |
| 1.1.2 | Governance & Roles Alignment | Vinh | 2h | 2d | 2026-10-15 | 2026-10-16 | 1.1.1 | - |
| 1.2.1 | Preliminary Vision & Problem Statement | Nguyên | 5h | 4d | 2026-10-16 | 2026-10-19 | 1.1.1 | **[CP]** |
| 1.2.2 | Stakeholder Needs & MoSCoW Scope | Nguyên | 4h | 3d | 2026-10-18 | 2026-10-20 | 1.2.1 | **[CP]** |
| 1.2.3 | Preliminary Architecture & Technology Justification | Ánh | 4h | 4d | 2026-10-17 | 2026-10-20 | 1.2.1 | - |
| 1.2.4 | Hardware & Operating Environment Specification | Ánh | 3h | 3d | 2026-10-19 | 2026-10-21 | 1.2.3 | - |
| 1.2.5 | Process Gates & Exit Criteria Definition | Vinh | 3h | 3d | 2026-10-16 | 2026-10-18 | 1.1.2 | - |
| 1.2.6 | Work Breakdown Structure (WBS) Authoring | Vinh | 6h | 3d | 2026-10-18 | 2026-10-20 | 1.2.2, 1.2.5 | **[CP]** |
| 1.2.7 | Effort & Cost Estimation Baseline | Vinh | 4h | 3d | 2026-10-20 | 2026-10-22 | 1.2.3, 1.2.6 | - |
| 1.2.8 | Project Schedule & Critical Path Mapping | Ánh | 5h | 3d | 2026-10-20 | 2026-10-22 | 1.2.6, 1.2.7 | **[CP]** |
| 1.2.9 | Project Risk Identification & Mitigation | Vinh | 4h | 3d | 2026-10-21 | 2026-10-23 | 1.2.6, 1.2.7 | - |
| 1.3.1 | Version Control & Repository Structure Setup | Quân | 3h | 3d | 2026-10-16 | 2026-10-18 | 1.1.1 | - |
| 1.3.2 | Task Board & Tracking Configuration | Quân | 4h | 4d | 2026-10-19 | 2026-10-22 | 1.2.6, 1.3.1 | - |
| 1.3.3 | PA1 Document Compilation & Review | Vinh | 4h | 3d | 2026-10-22 | 2026-10-24 | 1.2.4, 1.2.8, 1.2.9, 1.3.2 | **[CP]** |
| **PA2** | **Phase PA2 Timeline** | **Team** | **60h** | **-** | **2026-10-26** | **2026-11-08** | **-** | **[CP]** |
| 2.1.1 | Domain Modeling & Glossary Definition | Nguyên | 4h | 3d | 2026-10-26 | 2026-10-28 | M1 (PA1) | **[CP]** |
| 2.1.2 | System Use Case Modeling | Nguyên | 4h | 4d | 2026-10-28 | 2026-10-31 | 2.1.1 | **[CP]** |
| 2.2.1 | F01 User Authentication & Roles Specification | Nguyên | 4h | 4d | 2026-10-31 | 2026-11-03 | 2.1.2 | - |
| 2.2.2 | F02 Book Catalog Management Specification | Nguyên | 5h | 4d | 2026-10-31 | 2026-11-03 | 2.1.2 | - |
| 2.2.3 | F03 Book Copy Management Specification | Nguyên | 5h | 4d | 2026-11-01 | 2026-11-04 | 2.2.2 | - |
| 2.2.4 | F04 Search & Browse Specification | Nguyên | 4h | 4d | 2026-11-01 | 2026-11-04 | 2.2.2, 2.2.3 | - |
| 2.2.5 | F05 Borrow & Return Management Specification | Nguyên | 6h | 4d | 2026-11-02 | 2026-11-05 | 2.2.3 | **[CP]** |
| 2.2.6 | F06 Book Reservation Specification | Nguyên | 5h | 4d | 2026-11-03 | 2026-11-06 | 2.2.5 | **[CP]** |
| 2.2.7 | Non-Functional Requirements & Constraints | Ánh | 4h | 4d | 2026-11-02 | 2026-11-05 | 2.1.2 | - |
| 2.3.1 | Reader/Student Workflow Wireframes | Ánh | 5h | 4d | 2026-11-03 | 2026-11-06 | 2.2.4, 2.2.6 | - |
| 2.3.2 | Librarian & Admin Management Wireframes | Ánh | 6h | 4d | 2026-11-03 | 2026-11-06 | 2.2.2, 2.2.3, 2.2.5 | - |
| 2.4.1 | Requirements Traceability Matrix (RTM) Baseline | Vinh | 4h | 3d | 2026-11-05 | 2026-11-07 | 2.2.1, 2.2.2, 2.2.3, 2.2.4, 2.2.5, 2.2.6 | **[CP]** |
| 2.4.2 | PA2 Document Review & Verification | Vinh | 4h | 3d | 2026-11-06 | 2026-11-08 | 2.3.1, 2.3.2, 2.4.1 | **[CP]** |
| **PA3** | **Phase PA3 Timeline** | **Team** | **56h** | **-** | **2026-11-09** | **2026-11-22** | **-** | **[CP]** |
| 3.1.1 | C4 Architecture Modeling (Context & Container) | Ánh | 5h | 4d | 2026-11-09 | 2026-11-12 | M2 (PA2) | **[CP]** |
| 3.1.2 | Architectural Decision Records (ADRs) | Quân | 4h | 4d | 2026-11-11 | 2026-11-14 | 3.1.1 | - |
| 3.2.1 | Conceptual & Logical Data Modeling (ERD) | Ánh | 5h | 4d | 2026-11-11 | 2026-11-14 | 3.1.1 | **[CP]** |
| 3.2.2 | Physical Database Schema & DDL Scripts | Quân | 5h | 4d | 2026-11-14 | 2026-11-17 | 3.2.1 | **[CP]** |
| 3.3.1 | API Specification for F01 Auth & User Management | Quân | 4h | 4d | 2026-11-14 | 2026-11-17 | 3.1.1, 3.2.1 | - |
| 3.3.2 | API Specification for F02 Catalog & F03 Copy Management | Quân | 5h | 4d | 2026-11-15 | 2026-11-18 | 3.2.2 | - |
| 3.3.3 | API Specification for F04 Search & Browse | Quân | 4h | 4d | 2026-11-16 | 2026-11-19 | 3.3.2 | - |
| 3.3.4 | API Specification for F05 Borrow & Return | Quân | 5h | 4d | 2026-11-16 | 2026-11-19 | 3.2.2, 3.3.2 | **[CP]** |
| 3.3.5 | API Specification for F06 Book Reservation | Quân | 4h | 4d | 2026-11-17 | 2026-11-20 | 3.3.4 | **[CP]** |
| 3.4.1 | UI Design System & Component Library | Ánh | 5h | 5d | 2026-11-12 | 2026-11-16 | M2 (PA2) | - |
| 3.4.2 | High-Fidelity Mockups for Key Workflows | Ánh | 6h | 5d | 2026-11-16 | 2026-11-20 | 3.4.1 | - |
| 3.5.1 | Design Review & Traceability Verification | Vinh | 4h | 4d | 2026-11-19 | 2026-11-22 | 3.1.2, 3.2.2, 3.3.1, 3.3.4, 3.3.5, 3.4.2 | **[CP]** |
| **PA4** | **Phase PA4 Timeline** | **Team** | **41h** | **-** | **2026-11-23** | **2026-11-29** | **-** | **[CP]** |
| 4.1.1 | Master Test Plan Authoring | Vinh | 5h | 3d | 2026-11-23 | 2026-11-25 | M3 (PA3) | **[CP]** |
| 4.1.2 | Test Automation Framework Setup | Quân | 4h | 4d | 2026-11-23 | 2026-11-26 | M3 (PA3) | - |
| 4.2.1 | Test Cases for F01 Authentication & Roles | Vinh | 5h | 3d | 2026-11-24 | 2026-11-26 | 4.1.1 | - |
| 4.2.2 | Test Cases for F02 Catalog & F03 Copy Management | Vinh | 5h | 3d | 2026-11-24 | 2026-11-26 | 4.1.1 | - |
| 4.2.3 | Test Cases for F04 Search & Browse | Vinh | 4h | 3d | 2026-11-25 | 2026-11-27 | 4.2.2 | - |
| 4.2.4 | Test Cases for F05 Borrow & Return | Vinh | 6h | 3d | 2026-11-25 | 2026-11-27 | 4.1.1, 4.2.2 | **[CP]** |
| 4.2.5 | Test Cases for F06 Book Reservation | Vinh | 5h | 3d | 2026-11-26 | 2026-11-28 | 4.2.4 | **[CP]** |
| 4.3.1 | Test Traceability Matrix & Test Data Specification | Nguyên | 4h | 3d | 2026-11-26 | 2026-11-28 | 4.2.1, 4.2.2, 4.2.3, 4.2.4, 4.2.5 | **[CP]** |
| 4.3.2 | PA4 Document Review & Baseline | Vinh | 3h | 3d | 2026-11-27 | 2026-11-29 | 4.1.2, 4.3.1 | **[CP]** |
| **PA5** | **Phase PA5 Timeline** | **Team** | **91h** | **-** | **2026-11-30** | **2026-12-13** | **-** | **[CP]** |
| 5.1.1 | Backend Boilerplate & DB Connection Setup | Quân | 5h | 3d | 2026-11-30 | 2026-12-02 | M3 (PA3), M4 (PA4) | **[CP]** |
| 5.1.2 | Frontend Boilerplate & Layout Setup | Quân | 5h | 3d | 2026-11-30 | 2026-12-02 | M3 (PA3) | - |
| 5.2.1 | F01 Authentication & Role-Based Access Control | Quân | 6h | 3d | 2026-12-01 | 2026-12-03 | 5.1.1, 5.1.2 | **[CP]** |
| 5.2.2 | F02 Book Catalog Management Module | Quân | 6h | 4d | 2026-12-02 | 2026-12-05 | 5.2.1 | **[CP]** |
| 5.2.3 | F03 Book Copy Management Module | Quân | 5h | 4d | 2026-12-03 | 2026-12-06 | 5.2.2 | **[CP]** |
| 5.2.4 | F04 Search & Browse Books Module | Ánh | 6h | 4d | 2026-12-04 | 2026-12-07 | 5.2.2, 5.2.3 | - |
| 5.2.5 | F05 Borrow & Return Management Module | Quân | 8h | 4d | 2026-12-05 | 2026-12-08 | 5.2.3 | **[CP]** |
| 5.2.6 | F06 Book Reservation Module | Quân | 7h | 4d | 2026-12-06 | 2026-12-09 | 5.2.5 | **[CP]** |
| 5.2.7 | Reader Dashboard & Active Loans View | Ánh | 5h | 3d | 2026-12-07 | 2026-12-09 | 5.2.4, 5.2.5, 5.2.6 | - |
| 5.3.1 | Automated Unit & Integration Testing | Quân | 6h | 4d | 2026-12-07 | 2026-12-10 | 5.2.1, 5.2.2, 5.2.3, 5.2.5, 5.2.6 | **[CP]** |
| 5.3.2 | Manual System Testing & Bug Logging | Vinh | 7h | 4d | 2026-12-08 | 2026-12-11 | 5.2.7, 5.3.1 | **[CP]** |
| 5.3.3 | Bug Fixing & Regression Verification | Quân | 6h | 4d | 2026-12-09 | 2026-12-12 | 5.3.2 | **[CP]** |
| 5.3.4 | Test Summary Report & QA Sign-off | Vinh | 4h | 3d | 2026-12-11 | 2026-12-13 | 5.3.3 | - |
| 5.4.1 | Cloud DB & Backend Deployment on Render | Quân | 4h | 3d | 2026-12-10 | 2026-12-12 | 5.3.1, 5.3.3 | **[CP]** |
| 5.4.2 | Frontend Cloud Deployment on Vercel | Quân | 4h | 3d | 2026-12-10 | 2026-12-12 | 5.4.1 | **[CP]** |
| 5.4.3 | Production Smoke Testing & Deployment Documentation | Vinh | 4h | 3d | 2026-12-11 | 2026-12-13 | 5.4.2 | **[CP]** |
| 5.4.4 | PA5 Submission & Code Baseline | Vinh | 3h | 2d | 2026-12-12 | 2026-12-13 | 5.3.4, 5.4.3 | **[CP]** |
| **Final** | **Phase Final Timeline** | **Team** | **16h** | **-** | **2026-12-14** | **2026-12-20** | **-** | **[CP]** |
| 6.1.1 | Demo Scenario Scripting & Seed Data Preparation | Nguyên | 4h | 3d | 2026-12-14 | 2026-12-16 | M5 (PA5) | **[CP]** |
| 6.1.2 | Demo Rehearsal & Backup Recording | Vinh | 3h | 3d | 2026-12-16 | 2026-12-18 | 6.1.1 | **[CP]** |
| 6.2.1 | Presentation Slide Deck Creation | Ánh | 5h | 4d | 2026-12-15 | 2026-12-18 | M5 (PA5) | - |
| 6.2.2 | Final Contribution Assessment & Project Retrospective | Vinh | 4h | 3d | 2026-12-18 | 2026-12-20 | 6.1.2, 6.2.1 | **[CP]** |

### **4.4.4 Critical Path Analysis & Schedule Risk Management**
The Critical Path (CP) represents the sequence of dependent work packages that directly dictates the overall project completion timeline. A delay in any critical path package directly delays the project phase gate milestone. In UniLib, the critical path rigorously flows through:

* **Phase 1 (Initiation):** 1.1.1 (Kickoff) → 1.2.1 (Vision) → 1.2.2 (Scope) → 1.2.6 (WBS) → 1.2.8 (Schedule) → 1.3.3 (PA1 Baseline Review) → **Milestone M1 (Oct 25)**.
* **Phase 2 (Requirements):** 2.1.1 (Domain Glossary) → 2.1.2 (Use Case Model) → 2.2.5 (F05 Borrow/Return Spec) → 2.2.6 (F06 Reservation Spec) → 2.4.1 (RTM Baseline) → 2.4.2 (PA2 Review) → **Milestone M2 (Nov 08)**.
* **Phase 3 (Architecture & Design):** 3.1.1 (C4 Architecture) → 3.2.1 (ERD) → 3.2.2 (Physical DDL Schema) → 3.3.4 (F05 Circulation API) → 3.3.5 (F06 Reservation API) → 3.5.1 (PA3 Review) → **Milestone M3 (Nov 22)**.
* **Phase 4 (Test Planning):** 4.1.1 (Master Test Plan) → 4.2.4 (F05 Circulation Test Cases) → 4.2.5 (F06 Reservation Test Cases) → 4.3.1 (Test Traceability) → 4.3.2 (PA4 Review) → **Milestone M4 (Nov 29)**.
* **Phase 5 (Implementation & Deployment):** 5.1.1 (Backend & DB Setup) → 5.2.1 (F01 Auth & RBAC) → 5.2.2 (F02 Catalog) → 5.2.3 (F03 Copy Inventory) → 5.2.5 (F05 Borrow & Return Module) → 5.2.6 (F06 Reservation Module) → 5.3.1 (Integration Testing) → 5.3.2 (System Testing) → 5.3.3 (Bug Fixing) → 5.4.1 (Render DB Deploy) → 5.4.2 (Vercel Deploy) → 5.4.3 (Smoke Testing) → 5.4.4 (PA5 Submission) → **Milestone M5 (Dec 13)**.
* **Phase 6 (Final Demo & Closeout):** 6.1.1 (Demo Script & Seed Data) → 6.1.2 (Demo Rehearsal) → 6.2.2 (Final Retrospective & Submission) → **Milestone M6 (Dec 20)**.

**Float / Slack Analysis:** Non-critical paths possess flexible schedule float to absorb variances:
* Hardware & Environment (1.2.4): 2 days float.
* Wireframes (2.3.1, 2.3.2): 2 days float before PA2 review.
* UI Design System & Mockups (3.4.1, 3.4.2): 2 days float before design baseline.
* Reader Dashboard (5.2.7): 3 days float before system test freeze.
* Presentation Slides (6.2.1): 2 days float before final delivery.

**Total Critical Path Duration:** 67 calendar days across the 11-week academic period.

5. ## **Roles and Responsibilities**

| Role | Main | Backup | Responsibilities |
| :---- | :---- | :---- | :---- |
| Team lead / Project manager | Nguyễn Phan Thế Vinh | Trần Hà Anh Quân | Overall project planning, schedule monitoring, task tracking on GitHub Projects, risk management, internal team meetings, weekly status reports, primary communication point with TA/Lecturer. |
| Business analyst | Nguyễn Thanh Thảo Nguyên | Vũ Thị Ánh | Eliciting and documenting functional/non-functional requirements (SRS), defining domain entities, use case modeling, business rules specification (Loan, Reservation, Overdue), maintaining requirements traceability matrix. |
| Designer / Architect | Vũ Thị Ánh | Nguyễn Thanh Thảo Nguyên | System architecture design (C4 diagrams), UI/UX wireframes and high-fidelity mockups, relational database schema modeling (PostgreSQL ERD), design consistency, and component styling. |
| Developers | Trần Hà Anh Quân | Nguyễn Phan Thế Vinh | Frontend (React) and backend (Node.js/Express) implementation, database schema migrations, REST API development, unit testing, CI/CD pipeline, cloud deployment (Vercel/Render), and code review. |
| Tester | Nguyễn Phan Thế Vinh | Nguyễn Thanh Thảo Nguyên | Master Test Plan development, test case design for all Must-have features (F01–F06), test execution (functional, integration, system), defect tracking on GitHub Issues, and test summary reporting. |

   6. ## **Human Resources and Cost Estimate**

### **4.6.1 Human Resources & Labor Cost Model**
The project human resource cost is computed based on bottom-up estimated effort and a realistic junior software engineer / QA tester market hourly rate in Vietnam. A standard benchmark rate of **100,000 VND/hour** (equivalent to approximately **$4.00 USD/hour** at an exchange rate of 1 USD = 25,000 VND) is applied across all team members.

| Team Member | Primary Role(s) | Estimated Effort (h) | Hourly Rate | Labor Cost (VND) | Labor Cost (USD) |
| :---- | :---- | :----: | :----: | :----: | :----: |
| Nguyễn Phan Thế Vinh | Team Lead / PM, Tester | 96 | 100,000 VND/h | 9,600,000 VND | $384.00 |
| Nguyễn Thanh Thảo Nguyên | Business Analyst | 54 | 100,000 VND/h | 5,400,000 VND | $216.00 |
| Vũ Thị Ánh | Designer / Architect | 64 | 100,000 VND/h | 6,400,000 VND | $256.00 |
| Trần Hà Anh Quân | Developer | 104 | 100,000 VND/h | 10,400,000 VND | $416.00 |
| **Total Labor Cost** | **Entire Team (4 Members)** | **318** | **100,000 VND/h** | **31,800,000 VND** | **$1,272.00** |

### **4.6.2 Tools, Hosting & Infrastructure Costs**
The project prioritizes free and open-source tooling for development and CI/CD. However, to guarantee reliable live demonstration without spin-down latency and to guard against Render's 30-day PostgreSQL database expiration, a dedicated hosting buffer is provisioned for Weeks 9–11 (approx. 1 month).

| Tool / Service | Tier / Plan | Purpose / Usage | Cost (VND) | Cost (USD) |
| :---- | :---- | :---- | :----: | :----: |
| GitHub | Free Tier | Private repository, GitHub Projects task board, GitHub Actions (2,000 free CI minutes/mo) | 0 VND | $0.00 |
| Vercel | Hobby (Free) | React frontend continuous deployment, global CDN, automated PR preview deployments | 0 VND | $0.00 |
| Render (Development) | Free Tier | Express backend API web service and PostgreSQL testing instance (W1–W8) | 0 VND | $0.00 |
| Render Starter Provisioning | Paid Starter ($7/mo + $7/mo) | Production deployment buffer for Weeks 9–11: dedicated instance to avoid 50s cold-start spin-down and prevent 30-day database deletion during demo grading | 350,000 VND | $14.00 |
| **Total Tooling & Hosting** | **Combined Infrastructure** | **Complete development, CI/CD, and production deployment infrastructure** | **350,000 VND** | **$14.00** |

### **4.6.3 Total Project Cost Summary & Contingency Reserve**
To mitigate technical and estimation risks (such as unexpected bug fixing or integration rework during PA5), a 10% Contingency Reserve is incorporated into the overall financial model.

| Cost Category | Description | Cost (VND) | Cost (USD) | % of Total |
| :---- | :---- | :----: | :----: | :----: |
| Direct Labor Cost | 318 person-hours @ 100,000 VND/hour across 4 team members | 31,800,000 VND | $1,272.00 | 89.9% |
| Tooling & Hosting | GitHub, Vercel, and Render production demo instance buffer | 350,000 VND | $14.00 | 1.0% |
| Contingency Reserve | 10% management reserve for defect fixing and integration buffers | 3,215,000 VND | $128.60 | 9.1% |
| **Total Estimated Budget** | **Comprehensive UniLib project investment baseline** | **35,365,000 VND** | **$1,414.60** | **100.0%** |

5. # **Risk Management**

*\[Identify at least 5 project risks (technology, people, organisational, requirements, estimation). Risk exposure RE \= Probability × Loss (use the scales from the Project Management lecture).\]*

| ID | Risk | Type | Probability | Loss | RE | Mitigation / contingency | Owner |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| R1 | *\<Key member unavailable during PA5\>* | People |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

6. # **Tools & Collaboration Setup**

One of the main goals of the project is to practise teamwork for professional software development. The use of tools is monitored and graded (teamwork component). The team must use:

* Moodle – announcements and PA submissions.  
* Communication – Slack, MS Teams or Discord: one channel per team; the TA is a member.  
* Task board – GitHub Projects (recommended) or Jira: every WBS work package is a task with an owner and due date.  
* Git repository – GitHub (recommended), GitLab or Bitbucket; the instructor and TA have access:  
  * main branch is protected; changes are merged through pull requests with at least one review  
  * README (description, setup), .gitignore; never commit secrets (.env, API keys, passwords)  
  * commit messages follow the Conventional Commits style (feat:, fix:, docs:, test:, …)  
* Weekly status meeting (15 minutes) and weekly status report (template provided), committed to /docs/management/weekly every week from week 2 to week 10\. The team chooses its weekly deadline and states it here.

**Repository structure:**

| Folder | Content |
| :---- | :---- |
| /src | Source code |
| /docs/management | Project plan; weekly status reports in /docs/management/weekly |
| /docs/requirements | Vision, SRS, use cases, mockups |
| /docs/design | Architecture (C4), ADRs, UML models, UI design |
| /docs/test | Test plan, test cases, test reports |
| /docs/ai-usage | AI usage logs |
| /pa/PA1 … /pa/PA5 | One sub-folder per PA submission (PDF \+ source files) |

7. # **AI Usage Log**

*\[Required in every PA (course GenAI policy). List each significant use of AI tools. Write “No AI tools were used” if none. Undisclosed AI use is treated as an academic integrity violation.\]*

| # | Member | Tool | Task / purpose | How the output was verified and changed |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Nguyễn Phan Thế Vinh | Google DeepMind Agent (Antigravity AI) | Structured the 3-level WBS, drafted phase gate exit criteria, and formulated kickoff meeting minutes. | Verified against PA0 Must-have features (F01–F06), aligned effort hours (2–8h per package), and ensured role assignments strictly reflect the Team Contract. |
| 2 | Trần Hà Anh Quân | OpenAI Codex | Prepared README, repository CI, PR template, Dependabot configuration, Copilot instructions, Section 3.2 Technology Stack proposal, and WBS GitHub issues for Q1–Q2 / ACT-08. | Automated local checks executed CI shell checks, verified relative doc links, and scanned conflict markers. Stack proposed pending Ánh's review; GitHub Projects board created with 69 WBS issues with due dates pending V2 schedule. |
| 3 | Nguyễn Phan Thế Vinh | Google DeepMind Agent (Antigravity AI) | Formulated PERT three-point estimates, scheduled 69 WBS packages across 11 weeks, identified critical path, and calculated human resource and tooling cost model for PA1-V2 / ACT-05. | Reconciled 318 person-hours across team capacity (7.23 h/person/week within 6–8h guideline), verified milestone dates against course calendar (PA1–PA5 and Final demo), ensured critical path logic aligns with architecture dependencies, and verified hosting cost against Render/Vercel pricing models. Technical estimates reviewed by Developer (Quân). |

