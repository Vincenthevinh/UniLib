# 2.2 Glossary
**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-N2
**Owner:** Nguyễn Thanh Thảo Nguyên (Business Analyst)
**Reviewer:** Vũ Thị Ánh  
**Status:** Draft – Pending Review  
**Reference:** PA1 Baseline; Master ID Registry v1.0.0-frozen

## Domain Terminology

The following terminology standardizes the meaning of library entities, circulation processes, roles, and operational states used throughout the UniLib SRS.

| Term | Definition | Related Feature / Rule |
|---|---|---|
| Book Title | A bibliographic record representing a published book, identified by its ISBN and containing title, author, category, publisher, and publication year. | F02 |
| Book Copy | An individual physical inventory unit associated with a Book Title, identified by a unique Barcode / Copy ID. | F03 |
| ISBN | International Standard Book Number used to uniquely identify a Book Title within the UniLib catalog. | F02, FR-F02-01 |
| Barcode / Copy ID | A unique identifier assigned to each physical Book Copy; entered through the system interface without requiring a physical scanner. | F03 |
| Reader | An authorized library patron who can browse the catalog, view personal Loans, and place eligible Reservations. | F01, F04–F07 |
| Librarian | A staff user authorized to manage Book Titles, Book Copies, circulation transactions, and Reservation processing. | F01–F06 |
| Administrator | A privileged user responsible for account provisioning, role assignment, and account status management. | F01 |
| Role | An access classification determining which operations a user is authorized to perform within UniLib. | F01, BR-10 |
| Loan | A borrowing transaction linking a Reader to a physical Book Copy, with checkout date, Due Date, and applicable return information. | F05 |
| Due Date | The deadline for returning a borrowed Book Copy, calculated as 14 calendar days after checkout under the standard Loan policy. | F05, BR-02 |
| Loan Renewal | An authorized extension of an eligible Loan for an additional 14 days, permitted once when no Overdue condition or pending title Reservation exists. | F05, BR-03 |
| Overdue Loan | An active Loan whose Due Date has passed without the borrowed Book Copy being returned. | F05, BR-04 |
| Reservation | A title-level request created by an eligible Reader when no physical copies of the requested Book Title are Available. | F06, BR-05 |
| FIFO Queue | A First-In, First-Out ordering mechanism that processes Reservations chronologically according to their creation timestamps. | F06, BR-07 |
| Hold / Ready for Pickup | A Reservation allocation in which a returned Book Copy is placed in Reserved status for a designated Reader during the 72-hour pickup window. | F06, BR-08 |
| Pickup Window | The 72-hour period during which a reserved Book Copy is held for collection before automatic expiration. | F06, BR-08 |
| Circulation Desk | The Librarian-operated workflow used for Loan checkout, return processing, and Reservation fulfillment. | F05, F06 |
| Copy Availability | The current availability of physical Book Copies associated with a Book Title, derived from their operational statuses. | F03, F04 |
| Role-Based Access Control (RBAC) | The authorization mechanism restricting system operations according to Reader, Librarian, and Administrator roles. | F01, BR-10 |
| Loan Dashboard | A user interface showing a Reader's active Loans, Due Dates, Reservations, and Overdue warnings. | F07 |

## Book Copy State Definitions

The following Book Copy states are defined by the frozen Functional Requirements Registry, especially FR-F03-03.

| State | Definition | Circulation Eligibility |
|---|---|---|
| Available | The Book Copy is in inventory and eligible for normal checkout. | Eligible |
| Borrowed | The Book Copy is currently associated with an active borrowing transaction. | Not eligible |
| Reserved | The Book Copy has been allocated to a Reader through the Reservation process and is awaiting collection. | Restricted to the designated Reader |
| Damaged | The Book Copy is identified as damaged and is not available for normal circulation. | Not eligible |
| Lost | The Book Copy is recorded as missing or lost and is unavailable for circulation. | Not eligible |

**Terminology clarification:** PA1 also mentions *Maintenance*. However, the frozen PA2 registry specifies `Damaged`/`Lost`. Maintenance must not be introduced as an additional official Book Copy state without PM approval.

[TBD: Confirm whether Maintenance is a descriptive condition within the existing copy lifecycle or requires a formal Change Request.]

## Loan and Reservation Status Terminology

**Loan**

- **Active:** A Loan that has not been completed through return processing.
- **Returned:** A Loan completed when the borrowed Book Copy is checked in and the return timestamp is recorded.
- **Overdue:** A Loan for which the Due Date has passed without return.

[TBD: Confirm whether Overdue is stored as a separate Loan status or calculated from Active status and Due Date.]

**Reservation**

- **Pending:** A Reservation waiting in the FIFO queue for an eligible Book Copy.
- **Ready for Pickup:** A Reservation for which a Book Copy has been allocated and placed in Reserved status.
- **Fulfilled:** A Reservation completed through checkout of the held Book Copy.
- **Cancelled:** A Reservation cancelled by the Reader.
- **Expired:** A Reservation that has exceeded the permitted pickup window without collection.

[TBD: Confirm the canonical Reservation status values with the PM and state-transition specification. These labels describe proposed business states and do not introduce new feature IDs.]

## Terminology Governance

This glossary serves as the terminology reference for Functional Requirements, Business Rules, Use Case Specifications, wireframes, and traceability artifacts.

Any proposed change to frozen requirement identifiers or to the approved Book Copy state model must be submitted to the Project Manager for review and approval before baseline modification.