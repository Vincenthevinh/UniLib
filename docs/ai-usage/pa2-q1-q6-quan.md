# PA2 AI usage — Quân Q1–Q6

- **Member:** Trần Hà Anh Quân (Developer)
- **Phase:** PA2
- **Purpose:** Review technical feasibility, concurrency constraints, NFR measurability, state transitions, and repository readiness for PA3/PA5.

## Work completed

The technical review in [`docs/architecture/pa2-quan-technical-review.md`](../architecture/pa2-quan-technical-review.md) consolidates Q1–Q6 evidence. It records the PostgreSQL transaction/locking contract, copy state transitions, NFR hand-off checks, and two remaining SRS follow-ups (wireframe links and blank use-case specification content).

## Verification

The review was checked against the frozen registry, PA2 kickoff decisions, and the current repository tree. Since `src/` contains only `.gitkeep`, runtime performance and concurrency measurements are intentionally marked as PA3/PA5 hand-offs rather than reported as completed tests.


## PA2-Q1..Q6 schedule (planned vs actual)

The original team plan defines these **planned** delivery windows. They are not
Git creation, commit or push timestamps, and no retroactive completion is claimed.

| Task | Planned window (ICT, UTC+07) | Deliverable | Actual record |
| --- | --- | --- | --- |
| PA2-Q1 | 2026-10-22 to 2026-10-23 | Docs skeleton, PR checklist | Authored and pushed with developer branch on 2026-11-09 |
| PA2-Q2 | 2026-10-24 to 2026-10-26 | Use-case model, PlantUML diagram and SVG | Authored and pushed with developer branch on 2026-11-09 |
| PA2-Q3 | 2026-10-27 to 2026-10-29 | Measurable NFR-01..08 | Authored and pushed with developer branch on 2026-11-09 |
| PA2-Q4 | 2026-10-30 to 2026-10-31 | UC-04/07/08, state transitions | Authored and pushed with developer branch on 2026-11-09 |
| PA2-Q5 | 2026-11-01 to 2026-11-02 | UC-02/09, technical review notes | Authored and pushed with developer branch on 2026-11-09 |
| PA2-Q6 | 2026-11-03 to 2026-11-04 | Review fixes, diagrams, merge and PA2 baseline | Branch publishing done 2026-11-09; peer review, merge and baseline tag still pending |

**Audit note:** Git commit metadata reflects actual execution rather than the
planned windows above. GitHub records actual server-side push events separately;
changing commit messages or dates does not change those server-side events.

## 2026-11-09 — Quân PA2 documentation completion

- **Tool:** ChatGPT (GPT-6), using the Ag1 coding connector for the local UniLib checkout; PlantUML 1.2026.9 for diagram rendering.
- **Purpose:** Draft the missing Quân-owned SRS files (NFR-01..08, UC-02/04/07/08/09, use-case model, state models, feasibility findings), update the repo PR checklist, and produce an executable document-consistency check.
- **Human-source alignment:** Cross-checked PA0/PA1, 23 October PA2 kickoff, frozen Master ID Registry, Nguyên FR/BR files, Vinh AC file, and the local screen inventory. Kept frozen IDs unchanged.
- **Verification performed:** Ran the PlantUML renderer; verified the SVG is valid XML without a syntax-error banner; ran docs/pa2/scripts/verify_quan.py (PASS: 12 authored files, 12 UCs, 8 NFRs and only known IDs); reviewed Git diff/whitespace before committing.
- **Important corrections flagged for human review:** Registry text says 28 FR and 19 AC, but actual IDs count 32 FR and 20 AC; the task plan and frozen registry differ on author ownership and UC-09's title. No silent ID change was made.
- **Limitation:** The linked Figma file could not be read by the connected Figma account because access was denied. Screen mappings therefore rely on pa/PA2/screen-inventory.md until Ánh confirms the actual frames. There is no application runtime yet, so proposed performance/security/concurrency tests have not been executed.
- **Human verification required:** Vinh/Nguyên review specs and discrepancies; Ánh confirms screen mappings and prototype; PM approves final baseline/PR and creates the pa2-baseline tag after other owners deliver.