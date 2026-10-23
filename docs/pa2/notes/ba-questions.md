# PA2-N1 — Business Analysis Domain Questions

**Project:** UniLib – University Library Management System
**Team:** T05 – 2 girls 2 cúp
**Task:** PA2-N1
**Author:** Nguyễn Thanh Thảo Nguyên (Business Analyst)
**Reviewer:** Vũ Thị Ánh
**Status:** Draft – Pending Review

## 1. Document Review Summary

The following points are derived from the PA1 scope and PA2 SRS materials:

1. UniLib supports three main user roles: Reader, Librarian, and Administrator.
2. F01–F06 are Must-have features, while F07 is a Should-have feature.
3. The library system manages physical Book Titles, Book Copies, Loans, and Reservations.
4. Business rules must define borrowing eligibility, copy availability, loan renewal, reservation priority, and hold expiration.
5. Functional Requirements, Business Rules, and Use Cases must remain traceable through consistent identifiers.

## 2. Domain Questions and Proposed Defaults

The following questions are prepared for the PA2 kickoff meeting. Proposed defaults require confirmation by the Project Manager and team.

| ID | Domain Question | Proposed Default | Related Feature |
|---|---|---|---|
| DQ-01 | What is the maximum number of active Loans per Reader? | Maximum 3 active Loans | F05 |
| DQ-02 | How long may a Reader borrow a Book Copy? | 14 calendar days | F05 |
| DQ-03 | Can a Reader renew an active Loan? | One renewal of 14 days, provided the Loan is not Overdue and no Reservation is pending | F05 |
| DQ-04 | How long should a reserved Book Copy remain available for pickup? | 72 hours after the copy is allocated | F05, F06 |
| DQ-05 | How should multiple Reservations for the same Book Title be prioritized? | First-In, First-Out (FIFO) by reservation timestamp | F06 |
| DQ-06 | When may a Reader create a Reservation? | When no Book Copy of the requested Book Title is Available | F03, F06 |
| DQ-07 | What should happen when a borrowed Book Copy is returned? | Set to Reserved for the next eligible Reader if a Reservation exists; otherwise set to Available | F03, F05, F06 |
| DQ-08 | What happens when a Reservation expires? | Release the held copy to the next eligible Reader or restore Available status | F03, F06 |
| DQ-09 | Can a Book Title be deleted while physical Book Copies exist? | No. Prevent deletion until related copies have been removed according to business rules | F02, F03 |
| DQ-10 | How should damaged or unavailable Book Copies be represented? | Use a non-circulating condition/status; confirm whether Maintenance is a distinct state or part of Damaged/Lost | F03 |
| DQ-11 | Can a Reader borrow books while having an Overdue Loan? | No new Loans or Reservations until overdue items are returned | F05, F06, F07 |
| DQ-12 | May two Book Titles share the same ISBN? | Reject duplicate ISBN records for the same catalog identity; allow multiple physical Book Copies under one Book Title | F02, F03 |
| DQ-13 | What is the maximum number of active Reservations per Reader? | Maximum 2 active Reservations | F06 |

## 3. Copy, Loan, and Reservation State Clarifications

The following state-related questions must be addressed before finalizing Business Rules and Use Case Specifications.

### Book Copy States

- **Available:** The Book Copy is eligible for checkout.
- **Borrowed:** The Book Copy is associated with an active Loan.
- **Reserved:** The Book Copy is allocated to an eligible Reader for pickup.
- **Maintenance:** [TBD: Should Maintenance be an independent Copy state or be represented through Damaged/Lost?]

### Loan States

- **Active:** The Book Copy has been borrowed and not returned.
- **Returned:** The Loan transaction has been completed.
- **Overdue:** The due date has passed without return.

**Clarification:** [TBD: Is Overdue stored as a distinct Loan state or derived from the due date and return status?]

### Reservation States

Proposed states include Pending, Ready for Pickup, Fulfilled, Cancelled, and Expired.

**Clarification:** [TBD: Confirm the official Reservation status values and transitions in the state model.]

## 4. Preliminary Feature-to-FR Breakdown

This table provides input for the Master ID Registry. It does not authorize changes to any frozen identifiers.

| Feature | Functional Requirement Groups | Priority |
|---|---|---|
| F01 – Authentication & Roles | Login, session management, role-based access control, user account administration | Must |
| F02 – Book Catalog Management | Create, update, deactivate Book Title, display catalog metadata | Must |
| F03 – Book Copy Management | Register physical copies, update metadata, manage copy states, decommission copies | Must |
| F04 – Search & Browse | Keyword search, filtering, availability display, pagination | Must |
| F05 – Borrow & Return | Borrowing eligibility, checkout, due date calculation, return, renewal, overdue detection | Must |
| F06 – Book Reservation | Reservation eligibility, limits, FIFO processing, hold assignment, cancellation and expiry | Must |
| F07 – Reader Overdue & Loan Dashboard | Personal Loan dashboard, overdue notifications within the application, Librarian overdue monitoring | Should |

All FR identifiers must be aligned with the frozen Master ID Registry before requirements are finalized.

## 5. Open Items for Kickoff

1. Confirm borrowing limits and loan duration.
2. Confirm the Reservation pickup window.
3. Confirm whether Maintenance and Damaged/Lost represent separate or combined Book Copy states.
4. Confirm whether Overdue is stored or calculated.
5. Confirm the approved Reservation state names.
6. Confirm ISBN uniqueness and deletion restrictions.

No additional features beyond the approved PA1 scope are proposed.

## 6. Reviewer and PM Handoff

**For Ánh (Reviewer):**
- Review the clarity of domain questions and state terminology.
- Identify ambiguities affecting future UI flows and Use Case Specifications.

**For Vinh (Project Manager):**
- Confirm decisions during the PA2 kickoff.
- Record approved policies and unresolved questions in the decision log.
- Ensure the Feature-to-FR breakdown is consistent with the Master ID Registry.

**For PA2-N3:**
- Use confirmed domain policies to derive Functional Requirements and Business Rules.
- Avoid introducing unsupported business rules or modifying frozen IDs.

## 7. AI Usage Log

**Tool:** OpenAI ChatGPT
**Purpose:** Assisted in organizing domain questions, proposed defaults, and the preliminary F01–F07 functional requirement breakdown.
**Verification:** Draft compared with the supplied PA2 SRS and project scope; pending manual comparison with PA0/PA1, the ID Registry, and kickoff decisions.