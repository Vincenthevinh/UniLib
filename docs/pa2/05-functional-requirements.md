# 5.1 Functional Requirements

**Project:** UniLib – University Library Management System

**Phase:** PA2 – Software Requirements Specification

**Task:** PA2-N3

**Owner:** Nguyễn Thanh Thảo Nguyên (Business Analyst)

**Reviewer:** Vũ Thị Ánh

**Status:** Draft – Pending Review

**Baseline Reference:** PA1 Project Proposal & Plan; PA2 Master ID Registry v1.0.0-frozen

## Requirement Definition

The following Functional Requirements specify the expected behaviors of UniLib. Each requirement is grouped under its approved feature, assigned a frozen identifier, and classified using MoSCoW priorities.

The six core features (F01–F06) are Must-have. F07 is Should-have.

## F01 – User Authentication & Role-Based Access Control

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F01-01 | The system shall authenticate registered users using username/email and password credentials. | Must | PA0 §2.4; PA1 Baseline |
| FR-F01-02 | The system shall generate a secure JSON Web Token (JWT) after successful authentication and enforce role-based access control for Reader, Librarian, and Administrator endpoints. | Must | PA1 Baseline; ID Registry |
| FR-F01-03 | The system shall allow authenticated users to log out by invalidating the client-side session token. | Must | PA1 Baseline; ID Registry |
| FR-F01-04 | The system shall allow Administrators to create user accounts, assign roles, and activate or deactivate accounts. | Must | PA0 §2.3; PA1 Baseline |

## F02 – Book Catalog Management

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F02-01 | The system shall allow Librarians to create Book Title records containing a unique ISBN, Title, Author(s), Category, Publisher, and Publication Year. | Must | PA0 §2.4; PA1 Baseline |
| FR-F02-02 | The system shall allow Librarians to update metadata of existing Book Title records. | Must | PA0 §2.4; PA1 Baseline |
| FR-F02-03 | The system shall permit deletion or deactivation of a Book Title only when no physical Book Copies, active Loans, or pending Reservations are linked to it. | Must | PA1 Baseline; BR-09 |
| FR-F02-04 | The system shall display aggregated Book Copy statistics, including Total, Available, Borrowed, and Reserved counts, on the Book Title detail view. | Must | PA1 Baseline; ID Registry |

## F03 – Book Copy Inventory Management

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F03-01 | The system shall allow Librarians to register physical Book Copies with a unique Barcode/Copy ID and Shelf Location under an existing Book Title. | Must | PA0 §2.4; PA1 Baseline |
| FR-F03-02 | The system shall allow Librarians to update Book Copy metadata, including Shelf Location and physical condition notes. | Must | PA1 Baseline; ID Registry |
| FR-F03-03 | The system shall maintain Book Copy lifecycle states of Available, Borrowed, Reserved, and Damaged/Lost according to approved circulation transitions. | Must | PA0 §2.4; Frozen ID Registry |
| FR-F03-04 | The system shall allow Librarians to decommission a physical Book Copy only when its current status is Available or Damaged/Lost. | Must | PA1 Baseline; BR-09 |

## F04 – Book Search & Browse

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F04-01 | The system shall allow users to search Book Titles using Title, Author, Category, or ISBN keywords. | Must | PA0 §2.4; PA1 Baseline |
| FR-F04-02 | The system shall allow users to filter catalog results by Category and Availability Status, and sort results by Title or Publication Year. | Must | PA1 Baseline; ID Registry |
| FR-F04-03 | The system shall display current Available Book Copy counts and Shelf Locations in search results and Book Title detail views. | Must | PA0 §2.4; PA1 Baseline |
| FR-F04-04 | The system shall provide server-side pagination for catalog browsing with a default page size of 10 records. | Must | PA1 Baseline; ID Registry |

## F05 – Borrow & Return Management

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F05-01 | The system shall allow Librarians to create a Loan by selecting an active Reader ID and an Available Book Copy ID. | Must | PA0 §2.4; PA1 Baseline |
| FR-F05-02 | The system shall validate that a Reader has an active account, fewer than three active Loans, and no Overdue Loans before checkout. | Must | PA2 Kickoff D-PA2-01; BR-01; BR-04 |
| FR-F05-03 | The system shall calculate the Due Date as 14 calendar days after checkout and transition the selected Book Copy to Borrowed. | Must | PA2 Kickoff D-PA2-01; BR-02 |
| FR-F05-04 | The system shall allow Librarians to process a Book Copy return by recording the return timestamp and marking the Loan as Returned. | Must | PA0 §2.4; PA1 Baseline |
| FR-F05-05 | The system shall transition a returned Book Copy to Reserved for the first eligible Reader in the FIFO Queue when pending Reservations exist; otherwise, the copy shall transition to Available. | Must | PA0 §2.4; BR-07; BR-08 |
| FR-F05-06 | The system shall allow one 14-day Loan Renewal if the Loan is not Overdue and no pending Reservations exist for the corresponding Book Title. | Must | PA2 Kickoff D-PA2-01; BR-03 |
| FR-F05-07 | The system shall identify and flag Loans whose Due Dates have passed without return. | Must | PA0 §2.4; PA1 Baseline |

## F06 – Book Reservation (Hold Processing)

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F06-01 | The system shall allow an eligible Reader to place a Reservation for a Book Title only when zero associated Book Copies are Available. | Must | PA0 §2.4; BR-05 |
| FR-F06-02 | The system shall reject a Reservation when the Reader already has two active Reservations or an active Loan for the same Book Title. | Must | PA1 Baseline; BR-05; BR-06 |
| FR-F06-03 | The system shall maintain Reservations for each Book Title in First-In, First-Out order according to their creation timestamps. | Must | PA0 §2.4; BR-07 |
| FR-F06-04 | The system shall assign a 72-hour Pickup Window when a Book Copy transitions to Reserved for the designated Reader. | Must | PA2 Kickoff D-PA2-02; BR-08 |
| FR-F06-05 | The system shall allow Readers to cancel pending Reservations and automatically expire uncollected holds after 72 hours, advancing the FIFO Queue or releasing the Book Copy to Available. | Must | PA2 Kickoff D-PA2-02; BR-08 |
| FR-F06-06 | The system shall fulfill a Reservation when the designated Reader checks out the allocated Book Copy at the Circulation Desk. | Must | PA0 §2.4; PA1 Baseline |

## F07 – Reader Overdue & Loan Monitoring Dashboard

| ID | Functional Requirement | Priority | Source |
|---|---|---|---|
| FR-F07-01 | The system shall provide Readers with a personal dashboard displaying active Loans, Due Dates, eligible renewal actions, active Reservations, and queue positions. | Should | PA1 Scope §2.4; ID Registry |
| FR-F07-02 | The system shall display Overdue warnings and borrowing restriction notices on the Reader dashboard. | Should | PA1 Scope §2.4; ID Registry |
| FR-F07-03 | The system shall provide Librarians with an Overdue monitoring console showing Overdue Loans, days Overdue, Reader contact details, and related Book Copy information. | Should | PA1 Scope §2.4; ID Registry |

## Requirements Consistency Notes

- All requirement IDs are preserved from the frozen PA2 Master ID Registry.
- F01–F06 remain Must-have; F07 remains Should-have.
- Loan and Reservation policies reference BR-01 through BR-10.
- No new features are introduced beyond the approved PA2 scope.
- Compound behaviors within frozen FR-F01-02, FR-F01-04, FR-F05-03, FR-F05-05, and FR-F06-05 require reviewer consideration against the atomic requirement criterion. Any ID changes require PM approval.
- Book Copy state terminology follows the frozen registry. The earlier PA1 term Maintenance requires separate clarification.

## Verification and Review

- Review F05 and F06 against approved circulation rules and related Use Cases.
- Confirm that all requirements are consistent with the Master ID Registry.
- Confirm related screen mappings with the Designer.
- Record unresolved issues for formal review rather than modifying frozen IDs without approval.