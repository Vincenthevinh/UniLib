# PA3 §8 — Changes to the Requirements Since PA2

**Project:** UniLib | **Task:** N4-W1 | **Status:** Draft — PM approval required

This register distinguishes **clarifications/implementation decisions** from **changes to the frozen PA2 requirement baseline**. Do not mark any entry as an approved SRS change until Vinh (PM) explicitly approves the change request (CR). No FR/BR/UC/SCR identifier is renumbered.

| # | Proposed clarification / candidate change | Reason and evidence | Affected items | Type | Approval |
|---|---|---|---|---|---|
| CHG-01 | Derive Overdue at query time (`returnedAt` absent and `dueAt` in the past), rather than persisting a Loan status enum. | Q1 DBML has no LoanStatus enum; review V5 already discussed derived overdue. | F05, F07; BR-04; UC-07, UC-12; SCR-12 | Design clarification, not necessarily SRS change | PM to classify/confirm |
| CHG-02 | Reservation statuses are `Pending`, `Ready`, `Fulfilled`, `Cancelled`, `Expired`; Ready hold expires 72h after allocation. | Q1 DBML / Quân F06 API contract. | F06; BR-07/08; UC-10/11; SCR-10 | Design clarification of existing hold policy | PM to confirm baseline wording |
| CHG-03 | Physical Book Copy uses enum `Available`, `Borrowed`, `Reserved`, `Damaged`, `Lost`; condition notes are descriptive text. | Q1 DBML: `status` and `condition_notes`; no `Maintenance` enum. | F03, F05; UC-04/08; SCR-04/08 | Design mapping clarification | PM to confirm meaning of Maintenance if used in PA2 |
| CHG-04 | SCR-10 Hold Shelf functional view added pending approved Figma frame; page displays Ready holds and Pending FIFO without manual queue changes. | N3 task / missing PA2 screen image; frozen SCR-10 identifier must be preserved. | SCR-10, UC-11, F06 | UI design coverage; possible documentation change | Ánh UI review, PM approval if requirements change |

## Governance

- F01–F07 scope and frozen IDs remain unchanged; no payment, RFID, SMS/email, e-books or AI recommendations.
- If a proposal changes externally observable behavior, record a change request with before/after text, impact analysis and PM sign-off before changing the SRS or PA3 submitted document.
- Do not represent these rows as approved changes without approval evidence.
- F01/F05/F07 route paths and error-code names must be verified against Vinh's merged implementation.
