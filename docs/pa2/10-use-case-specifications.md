# 7. Use Case Specifications (PA2)

**Project:** UniLib | **Phase:** PA2 SRS
**Author of this index:** Tran Ha Anh Quan (Developer) | **Review:** Vinh / Nguyen
**Authority:** pa/PA2/00-id-registry.md, frozen v1.0.0.

The registry identifies 12 use cases, six of which are the official core detailed specifications (UC-01, UC-03, UC-05, UC-07, UC-08, UC-10). The extended group task plan allocates additional specifications so the team can achieve broader traceability. The files here are authored separately to preserve single-owner responsibilities.

| Use case | Purpose | Assigned author under supplied lane plan | File status in this branch |
| --- | --- | --- | --- |
| UC-01 | Log In & Manage Session | Nguyen | Not present locally; owner handoff |
| UC-02 | Manage User Accounts | Quan | [Draft for peer review](uc/UC-02.md) |
| UC-03 | Manage Book Catalog | Nguyen | Not present locally; owner handoff |
| UC-04 | Manage Book Copies | Quan | [Draft for peer review](uc/UC-04.md) |
| UC-05 | Search & Browse | Nguyen | Not present locally; owner handoff |
| UC-06 | View Book Details | Nguyen (UC-05 linkage) | Coverage to be checked with UC-05 owner |
| UC-07 | Borrow Book (Checkout) | Quan | [Draft for peer review](uc/UC-07.md) |
| UC-08 | Return Book (Check-in) | Quan | [Draft for peer review](uc/UC-08.md) |
| UC-09 | Renew Book Loan | Quan | [Draft for peer review](uc/UC-09.md) |
| UC-10 | Reserve Book Title | Nguyen | Not present locally; owner handoff |
| UC-11 | Cancel / Expire Reservation | Nguyen | Not present locally; owner handoff |
| UC-12 | Dashboard / Overdue Desk | Anh | Not present locally; owner handoff |

**Important:** The frozen registry/kickoff ownership assignments differ from the later group task plan; Vinh must confirm that the task allocations are formally accepted. In particular UC-09 remains **Renew Book Loan**; Overdue is addressed by FR-F05-07 and the monitoring aspects of UC-12. No UC identifier is changed.

Each completed specification must identify actors, triggers, preconditions, step-numbered main success flow, alternate/error flows, postconditions, FR/BR/NFR/AC traceability and screen IDs. The developer-owned specifications follow this structure. See the [circulation state transitions](diagrams/state-transitions.md) and [use case model](09-use-case-model.md) for shared semantics.

This table intentionally distinguishes **file exists** from **review approved**. None of the new developer drafts is represented as formally merged or baselined before a teammate approves its PR.
