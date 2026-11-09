# PA2-Q5 — Technical Feasibility Review and Open Issues

**Reviewer:** Tran Ha Anh Quan (Developer) | **Actual review date:** 2026-11-09 | **PA2-Q5 planned window:** 2026-11-01 to 2026-11-02
**Expected GitHub label:** pa2-review | **Review owner:** Vinh (PM)
**Evidence:** PA0/PA1, PA2 frozen ID Registry, kickoff decisions, Nguyên's FR/BR, Vinh's AC, supplied 24-task plan, local screen inventory and Quân's PA2 specs.

## Conclusion

The agreed React/Vite + Express/Node.js + PostgreSQL 16 stack is plausible for F01–F06. However, this is a documentation/architecture feasibility review, not an implementation validation: src/ has no application runtime, measured NFR test reports or working endpoints. Publication of a baseline tag requires all missing SRS sections, peer approvals and screen validation.

## Review issues (copy to GitHub Issues with label pa2-review)

| Ref | Priority | Issue / evidence | Proposed resolution | Decision owner | Status |
| --- | --- | --- | --- | --- | --- |
| Q-R01 | High | Direct Figma inspection denied by connector; SCR-01..12 are traceable only to pa/PA2/screen-inventory.md. | Ánh grants connector edit access or supplies verified exports; reviewer checks the actual frames, navigation and UI state annotations. | Ánh / Vinh | Open |
| Q-R02 | High | Supplied lane plan makes Quân owner of UC-02,04,07,08,09 and NFR, whereas frozen registry/kickoff originally assign UC specs to Nguyên and NFR authorship to Ánh. | PM records a short ownership amendment without changing UC/NFR IDs; named reviewers approve new file ownership. | Vinh / Team | Open |
| Q-R03 | Medium | Task plan calls UC-09 "Overdue", but frozen registry calls it Renew Book Loan. | Keep UC-09 as Renewal; cover Overdue by FR-F05-07 and UC-12. PM confirms nomenclature in RTM. | Vinh / Nguyên | Open |
| Q-R04 | High | BR file leaves Damaged/Lost, Maintenance, damaged return and Loan/Reservation status labels unresolved. | BA/PM approve canonical states and precise damaged-return handling before PA3 DDL; do not extend frozen BR IDs without CR. | Nguyên / Vinh | Open |
| Q-R05 | High | Held-copy cancellation and 72h expiry allocation may race with pickup; queue head may become ineligible. | Define transaction lock order, FIFO tie-breaker, revalidation/skip policy, idempotent expiry and state conflict behavior; test in PA4. | Nguyên / Quân | Open |
| Q-R06 | Medium | BR-02 is "14 calendar days from checkout" while AC-F05-01 describes "today +14 days"; renewal start point is not explicit. | Confirm cutoff timezone, timestamp vs date semantics and renewal extension origin; then document PA3 API behavior. | Nguyên / Vinh | Open |
| Q-R07 | Medium | NFR-08 says "full database schema restoration via seed scripts"; seed alone may not recreate schema. | Specify migrations+seeds or restore from backup; retain <5-minute frozen target until CR review. | Vinh / Quân | Open |
| Q-R08 | Medium | NFR-02 P90 LCP requires repeated measurements and a network profile; load-test error budget is not defined. | Fix NFR test environment and evidence protocol in PA4 without silently changing targets. | Vinh / Quân | Open |
| Q-R09 | High | Several SRS owner deliverables (prototype section, RTM, final review log, compiled PDF) were absent from the local checkout at review time. | Ask owners to merge approved sections; then run complete SRS/RTM gate before baseline tag. | Vinh / all | Open |
| Q-R10 | High | The frozen registry changelog/kickoff narrative reports 28 FR and 19 AC, but the actual unique identifiers are **32 FR and 20 AC** (verified by script). | Correct counts via approved PM documentation amendment; keep every frozen identifier and audit the RTM for all 32 FR / 20 AC. | Vinh / Nguyên | Open |

## Technical decisions that are already supported

- **Database transactions:** Use PostgreSQL ACID transactions and row-level locks for checkout, check-in, renewal and hold routing; validate and mutate in one transaction (NFR-05).
- **RBAC:** Enforce role permissions server-side on every protected endpoint; 401 for invalid authentication, 403 for insufficient role (NFR-04, BR-10).
- **Data model:** Distinguish Book Title, Book Copy, Loan and title-level Reservation. Enforce unique ISBN and Copy/Barcode ID, foreign keys, and one Active Loan per Copy.
- **Performance:** Search queries with pagination, indexes and 10,000 seeded titles are plausible, but must be measured at 100 concurrent users.
- **Scope:** No RFID scanner, payments, external email/SMS, e-books or native app; keep F07 Should.

## Sign-off gate for Q6

- [x] Quân's NFR and use-case documents created on separate branch.
- [x] PlantUML use-case diagram source and state model written.
- [x] All diagrams rendered and inspectable (PlantUML SVG produced and XML parsed).
- [ ] Other SRS owner sections merged and free of placeholders.
- [ ] All Must-have FRs traced through UC and SCR in Vinh's RTM.
- [ ] Figma/prototype visually verified with Ánh.
- [ ] Peer reviewer approvals and CI checks recorded.
- [ ] PM signs off on open issues or approved waivers.
- [ ] pa2-baseline tag created at approved merged commit.

**Do not create the pa2-baseline tag while these conditions remain open.** The untracked W03-status.docx in the local working tree is not part of Quân's PA2 changes and must remain untouched.

## Hand-off to PA3 and PA4

PA3 should freeze logical states and transition guards, then produce PostgreSQL schema/migrations and REST API contracts. PA4 should convert NFR and UC verification tables into executable tests, especially dual checkout, renewal-vs-reservation, pickup-vs-expiry, and copy decommission races. Record evidence and actual measurements later; do not mark them as passed now.
