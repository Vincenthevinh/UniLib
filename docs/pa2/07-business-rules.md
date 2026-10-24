# 5.3 Domain Requirements and Business Rules

**Project:** UniLib – University Library Management System

**Phase:** PA2 – Software Requirements Specification

**Task:** PA2-N3

**Owner:** Nguyễn Thanh Thảo Nguyên (Business Analyst)

**Reviewer:** Vũ Thị Ánh

**Status:** Draft – Pending Review

**Baseline Reference:** PA2 Master ID Registry v1.0.0-frozen

## Purpose

This section defines the library circulation policies, reservation constraints, role permissions, and referential integrity rules governing UniLib.

Each Business Rule retains its frozen BR identifier and is linked to the corresponding functional modules.

## Business Rules Registry

| Rule ID | Rule Name | Business Rule | Related Features | Source |
|---|---|---|---|---|
| BR-01 | Maximum Active Loan Limit | A Reader may have no more than 3 concurrently active, unreturned Loans across the library system. | F05 | Library Circulation Policy §2.1; PA2 Kickoff |
| BR-02 | Standard Loan Period | The standard Loan duration is 14 calendar days from checkout. The system calculates the Due Date automatically. | F05 | Academic Calendar & Loan Rules §3.2; PA2 Kickoff |
| BR-03 | Loan Renewal Policy | An eligible Loan may be renewed once for an additional 14 calendar days, provided the Loan is not Overdue and no pending Reservation exists for its Book Title. | F05 | Circulation Renewal Policy §3.4; Frozen Registry |
| BR-04 | Overdue Borrowing Suspension | A Reader with at least one Overdue Loan is prohibited from creating new Loans or Reservations until all Overdue items are returned. | F05, F06, F07 | Circulation Sanction Rule §4.1; Frozen Registry |
| BR-05 | Reservation Eligibility | A Reader may reserve a Book Title only when no associated Book Copy is Available and the Reader has no active Loan for that Book Title. | F03, F06 | Reservation Policy §5.1; Frozen Registry |
| BR-06 | Maximum Active Reservations | A Reader may have no more than 2 active Reservations simultaneously. | F06 | Reservation Policy §5.2; Frozen Registry |
| BR-07 | Reservation Priority Order | Reservations for each Book Title must be processed chronologically using First-In, First-Out order based on creation timestamp. | F06 | Reservation Queue Protocol §5.3; Frozen Registry |
| BR-08 | Reservation Hold Pickup Window | A returned Book Copy allocated to a Reservation remains Reserved for 72 hours. When the Pickup Window expires, the hold expires and the copy is assigned to the next eligible Reader in the queue or becomes Available. | F03, F05, F06 | Hold Policy §5.4; PA2 Kickoff |
| BR-09 | Deletion Referential Integrity | A Book Title cannot be deleted while physical Book Copies exist. A Book Copy cannot be removed or decommissioned while Borrowed or Reserved. | F02, F03 | Database Integrity Standard & Catalog Policy §6.1 |
| BR-10 | Separation of Roles | Readers may view catalog and personal records; Librarians manage catalog data and circulation operations; Administrators manage user credentials and role assignments. | F01, F02, F03, F05 | Security Access Policy §1.3; Frozen Registry |

## Circulation Constraints

### Loan Processing

Before checkout, the system verifies Reader account status, active Loan count, Overdue Loans, and Book Copy availability.

Successful checkout creates a Loan, assigns a Due Date according to BR-02, and transitions the Book Copy from Available to Borrowed.

When a Book Copy is returned, the Loan is marked Returned. The subsequent Book Copy state depends on whether pending Reservations exist.

### Reservation Processing

A Reservation is associated with a Book Title rather than an arbitrary available physical Book Copy.

When a returned Book Copy becomes available to fulfill an existing Reservation, the system allocates it to the first eligible Reader in the FIFO Queue.

A held Book Copy remains Reserved for 72 hours. Upon expiration, the system advances the queue or releases the Book Copy to Available.

### Integrity and Access Control

Book Title and Book Copy deletion restrictions prevent removal of resources that remain involved in circulation activities.

Role-Based Access Control restricts Reader, Librarian, and Administrator operations according to BR-10.

## Open Clarifications

- [TBD: Confirm whether Maintenance remains descriptive metadata or requires a formally approved Copy state.]
- [TBD: Confirm the exact canonical Loan and Reservation status labels used by the state-transition model.]
- [TBD: Clarify how a physically Damaged Book Copy is handled during return when a pending Reservation exists.]
- [TBD: Clarify whether Overdue should be stored as a state or calculated from Due Date and return status.]

These questions do not modify any frozen Business Rule or Functional Requirement.

## Traceability and Handoff

BR-01 through BR-04 support borrowing eligibility, Due Date calculations, renewals, and Overdue restrictions.

BR-05 through BR-08 support Reservation eligibility, FIFO ordering, pickup allocation, and expiration.

BR-09 protects catalog and inventory referential integrity.

BR-10 supports role-based authorization.

The approved Business Rules will be referenced by Use Case Specifications, circulation state-transition documentation, and subsequent test cases.

## Review Status

Draft prepared for PA2-N3 peer review.

Reviewer: Vũ Thị Ánh.

Circulation walkthrough participants: Nguyễn Phan Thế Vinh and Trần Hà Anh Quân.

Final baseline approval: Pending.