# UniLib — Screen Inventory

## 1. Purpose

This document defines the baseline inventory of 12 user interface screens for the UniLib University Library Management System. Screen IDs and names follow `docs/pa2/00-id-registry.md`.

## 2. Scope

The inventory covers the approved feature modules F01–F07. F01–F06 are Must-have features, while F07 is a Should-have feature.

The wireframes are low-fidelity and support requirements analysis and use-case validation. No out-of-scope features are introduced.

## 3. Screen Inventory

| Screen ID | Screen Name                                       | Primary Actor     | Related Feature(s) | Related Use Case(s) |
| --------- | ------------------------------------------------- | ----------------- | ------------------ | ------------------- |
| SCR-01    | Authentication & Login Screen                     | All Users         | F01                | UC-01               |
| SCR-02    | Administrator User Management Screen              | Administrator     | F01                | UC-02               |
| SCR-03    | Librarian Book Catalog Management Screen          | Librarian         | F02                | UC-03               |
| SCR-04    | Book Copy Inventory Management Screen             | Librarian         | F03                | UC-04               |
| SCR-05    | Catalog Search & Browse Screen                    | Reader, Librarian | F04                | UC-05               |
| SCR-06    | Book Title Detail & Availability Screen           | Reader, Librarian | F02, F04, F06      | UC-06, UC-10        |
| SCR-07    | Circulation Desk — Borrow (Checkout) Screen       | Librarian         | F05                | UC-07               |
| SCR-08    | Circulation Desk — Return (Check-in) Screen       | Librarian         | F05, F06           | UC-08               |
| SCR-09    | Book Reservation Modal / Confirmation View        | Reader            | F06                | UC-10               |
| SCR-10    | Librarian Hold Shelf & Reservation Queue Screen   | Librarian         | F06                | UC-10, UC-11        |
| SCR-11    | Reader Personal Dashboard Screen                  | Reader            | F05, F06, F07      | UC-09, UC-11, UC-12 |
| SCR-12    | Librarian Overdue & Circulation Monitoring Screen | Librarian         | F07                | UC-12               |

## 4. Accessibility Considerations

- Maintain a minimum 4.5:1 contrast ratio for normal text.
- Provide visible labels for all form controls.
- Ensure interactive elements can be reached in a logical keyboard order.
- Use text labels in addition to color to communicate statuses.
- Provide loading, empty, and error states where applicable.

## 5. Out-of-Scope Items

The wireframes do not include online payment, e-book/DRM, inter-library loan, AI recommendations, real SMS/email delivery, barcode/RFID integration, or a native mobile application.

## 6. Open Questions

- [TBD: Confirm whether the team requires a separate screen-to-feature mapping table in the final SRS.]
- [TBD: Confirm final Figma view-link permissions with all four team members.]

## 7. Review Status

Status: Draft — pending reviewer confirmation.

Reviewer: Nguyên.
