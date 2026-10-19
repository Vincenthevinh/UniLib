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
| **1.0** | **PA1 Initiation & Planning** | **Project kickoff, baseline scope, planning document, and tooling** | **Vinh** | **45** | **Management** |
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
| **2.0** | **PA2 Requirements Engineering** | **Software Requirements Specification (SRS), Use Cases, Wireframes & RTM** | **Nguyên** | **48** | **Requirements** |
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
| **3.0** | **PA3 Architecture & Detailed Design** | **System Architecture (C4), Relational Schema (PostgreSQL), REST API & UI Mockups** | **Ánh** | **48** | **Design** |
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
| **4.0** | **PA4 Test Planning & QA Setup** | **Master Test Plan, Test Cases for F01–F06, Test Environment & Automated Setup** | **Vinh** | **37** | **Testing** |
| 4.1.1 | Master Test Plan Authoring | Define test strategy, test levels (unit, integration, system), environment configuration, entry/exit criteria, and defect severity levels. | Vinh | 5 | QA Strategy |
| 4.1.2 | Test Automation Framework Setup | Configure backend testing tools (Jest, Supertest) and frontend testing tools (Vitest/React Testing Library) with sample test cases. | Quân | 4 | QA Setup |
| 4.2.1 | Test Cases for F01 Authentication & Roles | Author detailed test cases for login validation, password hashing, role-based route guards, and token expiry. | Vinh | 5 | F01 Auth |
| 4.2.2 | Test Cases for F02 Catalog & F03 Copy Management | Author test cases for book title CRUD, ISBN uniqueness, copy status updates (Available/Borrowed/Reserved), and deletions. | Vinh | 5 | F02 & F03 |
| 4.2.3 | Test Cases for F04 Search & Browse | Author test cases for keyword search, filtering by category/author, pagination, and availability counter accuracy. | Vinh | 4 | F04 Search |
| 4.2.4 | Test Cases for F05 Borrow & Return | Author test cases for loan creation, due date setting, return processing, copy status transitions, and overdue loan detection. | Vinh | 6 | F05 Loan |
| 4.2.5 | Test Cases for F06 Book Reservation | Author test cases for reserving unavailable books, reservation queue FIFO, hold status on return, and user cancellation. | Vinh | 5 | F06 Reservation |
| 4.3.1 | Test Traceability Matrix & Test Data Specification | Map test cases to SRS requirements (F01–F06) in RTM and document mock test datasets. | Nguyên | 4 | QA / Traceability |
| 4.3.2 | PA4 Document Review & Baseline | Review test cases for completeness with Developer and BA; finalize and submit PA4. | Vinh | 3 | Management |
| **5.0** | **PA5 Implementation, Testing & Deployment** | **Frontend (React), Backend (Express), PostgreSQL, Integration & Cloud Deployment** | **Quân** | **83** | **Development** |
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
| **Total** | **Project Total Estimated Effort** | **Full project life cycle across 11 weeks (4 members)** | **All** | **274** | **All Streams** |

3. ## **Estimation**

*\[Estimate the effort of each work package (person-hours) and explain the method used (expert judgement, three-point estimate, analogy).\]*

| WBS ID | Work package | Owner | Effort (person-hours) | Method / assumptions |
| :---- | :---- | :---- | :---- | :---- |
| 1.1 |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

4. ## **Schedule**

*\[Present a Gantt chart with task dependencies and milestones (the PA deadlines). Identify the critical path. Remember: effort ≠ duration.\]*

5. ## **Roles and Responsibilities**

| Role | Main | Backup | Responsibilities |
| :---- | :---- | :---- | :---- |
| Team lead / Project manager | Nguyễn Phan Thế Vinh | Trần Hà Anh Quân | Overall project planning, schedule monitoring, task tracking on GitHub Projects, risk management, internal team meetings, weekly status reports, primary communication point with TA/Lecturer. |
| Business analyst | Nguyễn Thanh Thảo Nguyên | Vũ Thị Ánh | Eliciting and documenting functional/non-functional requirements (SRS), defining domain entities, use case modeling, business rules specification (Loan, Reservation, Overdue), maintaining requirements traceability matrix. |
| Designer / Architect | Vũ Thị Ánh | Nguyễn Thanh Thảo Nguyên | System architecture design (C4 diagrams), UI/UX wireframes and high-fidelity mockups, relational database schema modeling (PostgreSQL ERD), design consistency, and component styling. |
| Developers | Trần Hà Anh Quân | Nguyễn Phan Thế Vinh | Frontend (React) and backend (Node.js/Express) implementation, database schema migrations, REST API development, unit testing, CI/CD pipeline, cloud deployment (Vercel/Render), and code review. |
| Tester | Nguyễn Phan Thế Vinh | Nguyễn Thanh Thảo Nguyên | Master Test Plan development, test case design for all Must-have features (F01–F06), test execution (functional, integration, system), defect tracking on GitHub Issues, and test summary reporting. |

   6. ## **Human Resources and Cost Estimate**

*\[Estimate the total cost: effort × hourly rate (assume a realistic junior-developer rate) \+ tools, hosting and other costs.\]*

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
| 2 | Trần Hà Anh Quân | OpenAI Codex | Prepared README, repository CI, PR template, Dependabot configuration, Copilot instructions, and PA1 tooling setup documentation for Q1–Q2 / ACT-08. | Automated local checks executed the three CI shell checks successfully, verified relative documentation links, and scanned new files for conflict markers. Stack remains proposed pending Ánh's confirmation. Human review and GitHub Actions/Copilot verification are pending; no application tests or deployment were performed. |

