# 4. Stakeholders and Users

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V2  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Status:** Draft – Pending Review  
**Reference:** PA1 Baseline; Master ID Registry v1.0.0-frozen; docs/pa2/02-glossary.md  

---

## 4.1 Overview of Stakeholders

Stakeholders represent any individual, group, or organization actively involved in the project, impacted by system execution, or possessing authority over system acceptance. In UniLib, stakeholders are classified into five major groups spanning academic governance, patron end-users, operational library personnel, technical system administrators, and the internal software engineering development and quality assurance team.

The following diagram illustrates the relationship between these stakeholders and the UniLib system boundary:

```
+---------------------------------------------------------------------------------------+
|                               ACADEMIC COURSE GOVERNANCE                              |
|                Project Sponsor & Evaluators (Lecturers, Teaching Assistants)          |
+-------------------------------------------+-------------------------------------------+
                                            | Evaluates Standards & Lifecycle Gates
                                            v
+---------------------------------------------------------------------------------------+
|                                  UNILIB SYSTEM BOUNDARY                               |
|                                                                                       |
|   +-------------------+       +-----------------------+       +-------------------+   |
|   |   Reader / Patron |       |  Librarian / Staff    |       |   Administrator   |   |
|   | (Students/Faculty)|       |  (Circulation Desk)   |       |  (IT / Security)  |   |
|   +---------+---------+       +-----------+-----------+       +---------+---------+   |
|             |                             |                             |             |
|             | Search / Reserve / Track    | Checkout / Check-in / Route | Provision   |
|             v                             v                             v             |
|   +-------------------------------------------------------------------------------+   |
|   |               UniLib Web Application (React + Express + PostgreSQL)           |   |
|   +-------------------------------------------------------------------------------+   |
|                                           ^                                           |
+-------------------------------------------|-------------------------------------------+
                                            | Designs, Implements, Tests, Verifies
+-------------------------------------------+-------------------------------------------+
|                          SOFTWARE ENGINEERING TEAM (T05)                              |
|                    Development & QA Team (Vinh, Nguyên, Ánh, Quân)                    |
+---------------------------------------------------------------------------------------+
```

---

## 4.2 Detailed Stakeholder Profiles

### 4.2.1 Project Sponsor & Academic Evaluators
* **Stakeholder Group:** Academic Governance & Course Oversight
* **Key Representatives:** Course Instructor and Teaching Assistants, Faculty of Information Technology (FIT), Ho Chi Minh City University of Science (HCMUS).
* **Role & Organizational Context:** External evaluators responsible for monitoring academic compliance, grading phase deliverables, validating software engineering best practices, and ensuring adherence to the course syllabus.
* **Access Mode & Touchpoints:** Document inspection (SRS, SAD, Test Plan), GitHub repository audits (PRs, commits, CI results), and live functional demonstrations during milestone presentations.
* **Key Interests and Concerns:**
  1. **Strict Adherence to Process Gates:** Verifying that the team strictly respects the Waterfall development lifecycle milestones (PA1 Initiation & Planning $\rightarrow$ PA2 Requirements Engineering $\rightarrow$ PA3 Architecture & Design $\rightarrow$ PA4 Test Planning $\rightarrow$ PA5 Implementation & Cloud Deployment) without skipping verification checkpoints.
  2. **Requirements Traceability & Verification Rigor:** Ensuring 100% bidirectional traceability from business needs and problem statements to functional requirements (`FR-F01-01` to `FR-F07-03`), Use Cases (`UC-01` to `UC-12`), Acceptance Criteria (`AC-F01-01` to `AC-F07-02`), and subsequent test cases.
  3. **Academic Integrity & Equitable Teamwork:** Ensuring that individual member contribution percentages reflect verifiable work on the task board and Git commit history, and that all GenAI tool usage is transparently declared and rigorously verified.
  4. **Strict Scope Containment:** Confirming that the system adheres to the approved Must-have scope (F01–F06) and that out-of-scope boundaries (e.g., no payment gateways, no physical RFID hardware) are respected.

---

### 4.2.2 Reader / Student Patron
* **Stakeholder Group:** Primary End-Users (Direct Consumers of Library Resources)
* **Primary System Actor:** `Reader`
* **Key Representatives:** Undergraduate and graduate students, faculty lecturers, and academic researchers enrolled at or employed by the university.
* **Profile & Technical Competency:** Varied computer literacy ranging from basic smartphone/browser usage to advanced research capabilities. Accesses UniLib using desktop workstations in the library or personal laptops over campus Wi-Fi.
* **Operational Goals:** Rapidly locate course textbooks and research reference materials, verify immediate physical availability, place holds on unavailable volumes, and monitor personal loan due dates to avoid academic penalties.
* **Key Interests and Concerns:**
  1. **Catalog Search Velocity & Real-Time Availability:** The ability to execute immediate multi-attribute searches across Book Title, Author, Category, and ISBN with real-time, accurate display of physical copy counts (`Available Now` vs `All Borrowed`) and exact shelf locations (`NFR-01`, `FR-F04-03`).
  2. **Fair & Transparent Reservation Queue:** A strictly objective, First-In, First-Out (FIFO) queuing protocol (`BR-07`) when books are in high demand, ensuring no favoritism or queue skipping. Patrons require predictable 72-hour hold collection windows (`BR-08`) with transparent position tracking.
  3. **Self-Service Dashboard & Timely Overdue Alerts:** A consolidated personal dashboard (`SCR-11`, `FR-F07-01`) displaying active borrowings, calculated due dates, 1-click eligible renewals (`BR-03`), and prominent visual warnings when loans approach or exceed the due date, preventing borrowing suspensions (`BR-04`).
  4. **Borrowing Privacy & Account Integrity:** Confidence that borrowing history and personal reading records remain confidential, with protected session management (`FR-F01-02`) preventing unauthorized patron access.

---

### 4.2.3 Librarian / Circulation Desk Staff
* **Stakeholder Group:** Operational Staff (Primary System Operators)
* **Primary System Actor:** `Librarian`
* **Key Representatives:** Full-time library circulation officers, cataloging specialists, and student library assistants managing circulation counters and book stacks.
* **Profile & Technical Competency:** High domain expertise in library science, cataloging standards (ISBN, Dewey/LC classification), and circulation rules; intermediate software literacy. Operates dedicated desktop computers at the library circulation desk.
* **Operational Goals:** Rapidly execute checkout and return transactions during peak class intervals, maintain accurate physical copy inventories, track item damage, route returned items to holding patrons, and identify delinquent borrowers.
* **Key Interests and Concerns:**
  1. **High-Throughput Circulation Workflows:** Circulation checkout (`UC-07`, `SCR-07`) and check-in (`UC-08`, `SCR-08`) must be intuitive, requiring minimal keystrokes and executing in $\le 1.0$s without lag, enabling staff to handle long patron queues between academic lectures.
  2. **Automated Business Rule Enforcement:** System must automatically enforce borrowing rules without requiring manual policy calculation: validating reader active loan limits ($\le 3$ active loans per `BR-01`), computing 14-day due dates (`BR-02`), blocking checkout for readers with overdue loans (`BR-04`), and verifying renewal eligibility (`BR-03`).
  3. **Physical Copy Inventory & Lifecycle Tracking:** Clear management of discrete physical copies per title (`FR-F03-01`), including shelf location tracking and clear status transitions (`Available`, `Borrowed`, `Reserved`, `Damaged`/`Lost`), with safeguards preventing accidental deletion of items in circulation (`BR-09`).
  4. **Automated Hold Routing & Overdue Monitoring:** Upon check-in of a reserved book, the system must immediately alert staff to place the copy on the hold shelf (`FR-F05-05`, `BR-08`) rather than reshelving it. A dedicated overdue console (`SCR-12`, `FR-F07-03`) is needed to track days overdue and patron contact details for inventory recovery.

---

### 4.2.4 Library System Administrator
* **Stakeholder Group:** Technical Operations & Governance
* **Primary System Actor:** `Administrator`
* **Key Representatives:** University IT department personnel, library systems administrator, and security officers.
* **Profile & Technical Competency:** Advanced technical literacy in systems administration, network security, user authentication, and relational database management.
* **Operational Goals:** Manage user identities and role assignments, safeguard system availability and security boundaries, preserve data consistency during concurrent operations, and configure operational parameters.
* **Key Interests and Concerns:**
  1. **Strict Role-Based Access Control (RBAC):** Rigorous separation of privileges (`BR-10`, `NFR-04`) ensuring that Readers cannot access staff circulation desks or catalog modification endpoints, and staff cannot perform unauthorized user privilege escalation.
  2. **Secure Credential Lifecycle & Password Security:** Enforcing industry-standard password hashing using bcrypt with salt rounds $\ge 10$ (`NFR-03`), secure JWT transmission, and administrative capability to promptly deactivate compromised, graduated, or terminated accounts (`FR-F01-04`).
  3. **Concurrency Data Integrity & ACID Transactions:** Absolute prevention of race conditions or double-allocation errors when multiple patrons or librarians simultaneously attempt to checkout the last available copy or place reservations (`NFR-05`), enforced via database row-level locking (`SELECT ... FOR UPDATE`).
  4. **System Maintainability & Disaster Recovery:** Straightforward maintenance workflows, including full database schema restoration via reproducible seed scripts in $< 5$ minutes (`NFR-08`) and clean environment variable management across deployment stages.

---

### 4.2.5 Software Engineering Development & QA Team
* **Stakeholder Group:** Internal Engineering Team (System Builders & Quality Verifiers)
* **Team Identity:** Team T05 — 2 girls 2 cúp, Introduction to Software Engineering.
* **Key Representatives:**
  - **Nguyễn Phan Thế Vinh:** Team Lead / Project Manager · Software Tester (Student ID: 23127520)
  - **Nguyễn Thanh Thảo Nguyên:** Business Analyst (Student ID: 24127469)
  - **Vũ Thị Ánh:** Designer / Software Architect (Student ID: 24127324)
  - **Trần Hà Anh Quân:** Software Developer (Student ID: 24127228)
* **Profile & Technical Competency:** Student software engineers proficient in React, Node.js, Express, PostgreSQL, Git collaboration, and automated testing frameworks (Vitest, Jest, Supertest).
* **Operational Goals:** Transform business problems and PA1 proposals into formal requirements specifications (PA2), robust architectural models (PA3), comprehensive test plans (PA4), and a verified, cloud-deployed web application (PA5) within the 318 person-hour budget.
* **Key Interests and Concerns:**
  1. **Unambiguous, Frozen Requirements Baseline:** Ensuring all functional requirements, non-functional metrics, and business rules are completely specified and frozen in the Master ID Registry (`00-id-registry.md`) to prevent scope creep, architectural rework, or conflicting team assumptions.
  2. **Scope Containment within Student Bandwidth:** Strict preservation of the 6 Must-have boundaries (F01–F06) and exclusion of complex external dependencies (no third-party payment gateways, no SMS/email APIs, no hardware barcode devices), ensuring feasibility within the 60h PA2 allocation and 91h PA5 coding timebox.
  3. **End-to-End Traceability & Testability:** Establishing clear, verifiable Given-When-Then Acceptance Criteria (`AC-F01-01` to `AC-F07-02`) mapped directly to Functional Requirements and Use Cases, enabling rapid generation of automated integration tests in PA4/PA5.
  4. **Equitable Workload & Collaborative Transparency:** Maintaining an objective, verifiable division of labor across all slots (S1–S6), adhering to the single-owner + single-reviewer matrix, and meeting internal deadlines 2 days prior to formal course submission (Team Contract §3.5).

---

## 4.3 Stakeholder Needs & Concerns Summary Matrix

The following matrix synthesizes the operational profiles, core functional needs, critical concerns, and primary SRS reference sections across all five stakeholder groups:

| Stakeholder Group | Primary Actor | Core Functional Needs | Critical Concerns & Constraints | Key SRS Sections |
| :--- | :--- | :--- | :--- | :--- |
| **Project Sponsor & Evaluators** | Academic Authority | Verification of software engineering methodology, phase gate deliverables, and academic rigor. | Waterfall process compliance, complete RTM traceability, valid contribution evidence, AI usage transparency. | §1, §2, §3, §9, §10, §11 |
| **Reader / Student Patron** | `Reader` | Search/browse catalog, check copy availability, place FIFO reservations, view personal loans/due dates. | Real-time copy visibility (`NFR-01`), objective FIFO hold queue (`BR-07`), timely overdue warnings (`FR-F07-02`), data privacy. | §2.2, §5.1 (F04, F06, F07), §6, §7 (UC-05, 10), §8 |
| **Librarian / Circulation Staff** | `Librarian` | Catalog CRUD, copy inventory tracking, circulation checkout/check-in, hold fulfillment, overdue desk. | High-speed checkout/return, automated policy enforcement (`BR-01` to `BR-04`), shelf auditability, hold routing (`BR-08`). | §2.2, §5.1 (F02, F03, F05, F07), §5.3, §7 (UC-03, 07, 08), §8 |
| **Library System Administrator** | `Administrator` | User account provisioning, role assignment, account deactivation, security monitoring. | Strict RBAC enforcement (`BR-10`, `NFR-04`), bcrypt password protection (`NFR-03`), atomic transactions & concurrency (`NFR-05`). | §2.2, §5.1 (F01), §5.2 (NFR-03, 04, 05), §7 (UC-01, 02), §8 |
| **Development & QA Team (T05)** | Internal Team | Clear functional and technical baseline for architecture, test planning, coding, and deployment. | Frozen scope (F01–F06 Must, F07 Should), hardware-free stack, testable acceptance criteria, equitable 25% workload. | Entire SRS Document (§1 through §11) |

---

## 4.4 Stakeholder Touchpoints across Feature Modules (F01–F07)

The interaction of each stakeholder group across the seven UniLib feature modules is detailed below, denoting their operational relationship with each capability:

* **M (Manage):** Authorizes, configures, or administers the functional module.
* **O (Operate):** Directly executes operational business transactions within the module.
* **C (Consume):** Interacts with, queries, or benefits from the module as an end-user.
* **V (Verify):** Inspects, tests, or evaluates the module against requirements and engineering standards.

| Feature ID | Feature Name | Sponsor / Evaluator | Reader | Librarian | Administrator | Dev & QA Team |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **F01** | User Authentication & RBAC | **V** | **C** | **C** | **M / O** | **M / V** |
| **F02** | Book Catalog Management | **V** | **C** | **M / O** | — | **M / V** |
| **F03** | Book Copy Inventory Management | **V** | **C** | **M / O** | — | **M / V** |
| **F04** | Book Search & Browse | **V** | **C** | **C** | — | **M / V** |
| **F05** | Borrow & Return Management | **V** | **C** | **O** | — | **M / V** |
| **F06** | Book Reservation (Hold Processing) | **V** | **C / O** | **O** | — | **M / V** |
| **F07** | Reader Overdue & Loan Dashboard | **V** | **C** | **O** | — | **M / V** |

---

## 4.5 Traceability to Downstream Deliverables

The stakeholder definitions and concerns articulated in this section directly drive downstream requirements artifacts:
1. **Use Case Modeling (Section 6 & 7):** Primary actors (`Reader`, `Librarian`, `Administrator`) map directly to the 12 system use cases (`UC-01` to `UC-12`) and their step-by-step specifications.
2. **Non-Functional Requirements (Section 5.2):** Concerns raised by Administrators (security, concurrency) and Readers (search latency, accessibility) establish the quantitative metrics for `NFR-01` through `NFR-08`.
3. **Screen Inventory (Section 8):** Operational workflows for Readers and Librarians govern the layout and interaction design across screens `SCR-01` to `SCR-12`.
4. **Acceptance Criteria & Master Test Plan (Section 5.4 & PA4):** Verification requirements specified by Evaluators and the QA Lead directly translate into testable Given-When-Then scenarios (`AC-F01-01` to `AC-F07-02`).
