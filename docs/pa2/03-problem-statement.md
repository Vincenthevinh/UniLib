# 3. Problem Statement

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-N2  
**Owner:** Nguyễn Thanh Thảo Nguyên (Business Analyst)  
**Reviewer:** Vũ Thị Ánh
**Status:** Draft – Pending Review

## 3.1 Business Context and Current Situation

Small and medium-sized university libraries and departmental resource centers manage physical academic books, reference materials, and circulation activities for students, faculty members, and library staff.

As identified in the PA1 problem statement, traditional workflows may depend on paper logbooks, spreadsheets, or disconnected record-keeping systems. This creates difficulties in maintaining accurate Book Title information, tracking physical Book Copies, recording Loans, and coordinating Reservations.

Readers may need to contact a Librarian or visit the circulation desk to verify whether a Book Title has an Available Copy. Librarians must manually reconcile inventory records with checkout and return transactions, while Administrators need reliable control over user accounts and permissions.

## 3.2 Business Problems

UniLib addresses the following business problems within the agreed project scope.

### Inconsistent Catalog and Inventory Records

Book Title metadata and physical Book Copy information may be maintained separately. This can produce inconsistencies between recorded and actual availability, complicating inventory management and resource discovery.

### Inefficient Borrowing and Returning

Manual Loan records make it difficult to apply borrowing limits, calculate Due Dates consistently, process returns, and identify Overdue Loans.

### Limited Search and Availability Visibility

Readers may be unable to search across Title, Author, Category, and ISBN or determine current Book Copy availability without assistance from library staff.

### Unstructured Reservation Processing

When all Book Copies of a title are unavailable, informal requests may lack a transparent priority mechanism. Without a defined FIFO Queue and Pickup Window, Reservation processing can become inconsistent.

### Manual Access Administration

Managing Reader, Librarian, and Administrator privileges without centralized role-based authorization can introduce operational inefficiencies and inappropriate access risks.

## 3.3 Project Goals

UniLib aims to provide a centralized web-based Library Management System supporting the following observable outcomes:

1. Readers can search Book Titles and inspect physical Book Copy availability through a web browser without contacting library staff.
2. Librarians can maintain Book Title records and track individual Book Copies through controlled inventory statuses.
3. Loan checkout and return workflows automatically enforce approved borrowing policies, calculate Due Dates, and update Book Copy status.
4. Eligible Readers can place Reservations when zero copies of a Book Title are Available, with requests processed according to FIFO priority.
5. Administrators can manage user accounts and enforce role-based permissions.
6. Readers and Librarians can access Loan and Overdue monitoring information through the prioritized Should-have dashboard feature, subject to implementation scope.

These goals are linked to the approved feature set F01–F07 and will be verified through functional requirements and acceptance criteria rather than assumed operational improvement percentages.

## 3.4 Operating Environment

**Client Environment**

UniLib is a browser-based application intended for modern HTML5-compliant web browsers, including Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari. The PA2 compatibility baseline specifies Chrome 120+, Firefox 120+, Edge 120+, and Safari 17+ for viewport widths of 1024–1920 pixels.

**Application Environment**

- Frontend: React with Vite.
- Backend: Node.js with Express, exposing REST/JSON APIs.
- Database: PostgreSQL relational database.
- Version Control: Git and GitHub.
- Proposed Frontend Hosting: Vercel.
- Proposed Backend and Database Hosting: Render.

The system is intended for the centralized management of physical library resources and does not require specialized library hardware.

## 3.5 Design and Implementation Constraints

### Functional Scope

The six Must-have features are:

- F01 – User Authentication & Role-Based Access Control
- F02 – Book Catalog Management
- F03 – Book Copy Inventory Management
- F04 – Book Search & Browse
- F05 – Borrow & Return Management
- F06 – Book Reservation

F07 – Reader Overdue & Loan Monitoring Dashboard is classified as Should-have.

### Circulation Rules

The system must conform to the frozen PA2 Business Rules Registry, including:

- Maximum three active Loans per Reader (BR-01).
- Standard 14-calendar-day Loan period (BR-02).
- One eligible 14-day renewal (BR-03).
- Borrowing restrictions for Readers with Overdue Loans (BR-04).
- Reservation eligibility and a limit of two active Reservations (BR-05, BR-06).
- FIFO Reservation processing (BR-07).
- A 72-hour pickup window (BR-08).
- Restrictions on deleting Book Titles and Book Copies with dependent records or active circulation states (BR-09).
- Separation of user roles and privileges (BR-10).

### Technical and Documentation Constraints

The system shall use the agreed React, Express, and PostgreSQL technology stack. Detailed data modeling and implementation decisions belong to subsequent project phases.

Requirements and supporting documents must follow the academic SRS template, the agreed terminology, and the frozen Master ID Registry. Any baseline changes require formal Project Manager approval.

### Out-of-Scope Boundaries

UniLib excludes:

- E-book reading and Digital Rights Management.
- Online payment processing and payment gateways.
- Physical RFID and barcode scanner integrations.
- Inter-library loans and distributed multi-campus operations.
- AI-based recommendation systems.
- Production SMS and email notification services.
- Native Android or iOS mobile applications.

Manual Barcode / Copy ID input and in-app status information remain within the approved scope.

## 3.6 Assumptions and Clarifications

The initial target environment is a small or medium-sized academic library with a centralized collection of physical books.

The following issues require confirmation before the requirements baseline is finalized:

- [TBD: Confirm whether Maintenance is a distinct Book Copy state or a physical condition handled through the approved state model.]
- [TBD: Confirm the official Reservation status values and the distinction between a Pending Reservation and a Ready-for-Pickup Hold.]
- [TBD: Confirm whether Overdue is derived from the Due Date or persisted as a separate Loan status.]

These open questions do not authorize changes to the frozen identifiers or approved feature scope.