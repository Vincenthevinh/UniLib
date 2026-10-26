# PA2 Technical Review — Quân (Q1–Q6)

**Project:** UniLib  
**Phase:** PA2 — Software Requirements Specification  
**Owner:** Trần Hà Anh Quân (Developer)  
**Review date:** 2026-11-01  
**Baseline reviewed:** `pa/PA2/00-id-registry.md`, `pa/PA2/PA2-SoftwareRequirementsSpecification.docx`, and the PA2 kickoff minutes.

## Review outcome

The PA2 requirements are technically deliverable with the agreed React/Vite, Express/Node.js 22, and PostgreSQL 16 stack. The highest implementation risk is concurrent circulation activity. Checkout, check-in, reservation allocation, and hold expiry must use one database transaction and row locks; application-level checks alone are insufficient.

The repository is still a planning skeleton (`src/.gitkeep`). No PA3 or PA5 runtime code exists yet, so the checks below are a feasibility and hand-off baseline rather than an implementation test result.

## Q1 — repository and stack baseline

| Area | Decision | PA3 hand-off requirement |
| --- | --- | --- |
| Frontend | React + Vite, browser target Chrome/Firefox/Edge 120+ and Safari 17+ | Keep API access behind a small client module; do not put circulation rules in UI components. |
| Backend | Node.js 22 LTS + Express REST API | Validate input at the route boundary and map domain conflicts to stable HTTP errors. |
| Database | PostgreSQL 16 | Use foreign keys, unique constraints, check constraints, and indexes for circulation queries. |
| Authentication | Password hash with bcrypt (cost ≥ 10), short-lived JWT | Never return password hashes or log credentials. Enforce role checks on every protected route. |
| Deployment | Vercel frontend, Render API/database | Keep secrets in environment variables and provide a repeatable migration/seed command. |

## Q2/Q4 — circulation state and transaction contract

The following preconditions and transitions are required by `FR-F03-03`, `FR-F05-01`…`FR-F05-07`, and `FR-F06-01`…`FR-F06-06`.

| Operation | Locked rows | Preconditions | Atomic changes |
| --- | --- | --- | --- |
| Checkout an available copy | Reader, selected copy, and relevant active holds | Reader is active, has < 3 active loans, has no overdue loan; copy is `Available` (or the reader owns its `Reserved` hold). | Insert active loan with due date `checkout_at + 14 days`; set copy to `Borrowed`; fulfill owned hold if present. |
| Check-in | Loan and copy; oldest pending reservation for the title | Loan is active and copy is `Borrowed`. | Mark loan returned; route copy to the oldest pending reservation as `Reserved` with `pickup_deadline = now + 72 hours`, otherwise set `Available`. |
| Place reservation | Reader and title availability aggregate | Reader has no overdue loan, has < 2 active reservations, no active loan for title, and title has zero `Available` copies. | Insert pending hold with monotonic creation order. |
| Expire a hold | Reserved copy and the expired hold | `pickup_deadline <= now` and hold is still pending pickup. | Expire hold; route copy to next FIFO hold or `Available`. |
| Renew a loan | Loan and title's pending-hold set | Loan is active, not overdue, and has not been renewed; no pending hold exists for the title. | Extend due date by exactly 14 days and set `renewed_at`. |

Each operation must run in `BEGIN … COMMIT` and lock mutable rows with `SELECT … FOR UPDATE` in a consistent order. A failed precondition must roll back every write. The API should return `409 Conflict` for a state race and allow the client to retry after reloading current availability.

### Copy state model

```text
Available  --checkout--> Borrowed --check-in/no hold--> Available
Borrowed   --check-in/hold--> Reserved --pickup checkout--> Borrowed
Reserved   --72h expiry--> Available or Reserved(next FIFO hold)
Available  --librarian decommission--> Damaged/Lost (or removed)
```

`Borrowed` and `Reserved` copies cannot be decommissioned. A title cannot be deleted while any copy, active loan, or pending hold references it. These invariants need both database constraints and service-level checks.

## Q3 — NFR technical review

| ID | Review result and implementation note |
| --- | --- |
| NFR-01 | Achievable with indexed search columns, bounded page size, and a measured query plan. Seed 10,000 titles before the k6/Artillery check; record P95 and database timing separately. |
| NFR-02 | Achievable if the initial bundle is split and catalog data is fetched after shell render. Verify with Lighthouse on the agreed broadband/4G profile. |
| NFR-03 | Enforce bcrypt cost ≥ 10 in one password service; redact passwords and tokens from request/response logs. |
| NFR-04 | Middleware must distinguish missing/invalid JWT (`401`) from insufficient role (`403`). Apply it to every protected route, including future routes. |
| NFR-05 | Requires transaction boundaries and `FOR UPDATE` locks described above. A concurrency test must attempt two checkouts against the last available copy. |
| NFR-06 | Use semantic form controls, visible focus styles, keyboard-only flows, and contrast checks in the UI review. |
| NFR-07 | Keep layout responsive from 1024px to 1920px and run the browser matrix before PA5 sign-off. |
| NFR-08 | Centralize API error mapping into a user-safe banner and provide `db:migrate`/`db:seed`/restore documentation with a timed recovery run. |

## Q5 — feasibility sign-off

| Check | Status | Evidence / next action |
| --- | --- | --- |
| All Must features map to the agreed stack | **Pass** | F01–F06 are represented in the frozen registry and PA2 SRS. |
| F07 scope is implementable as Should-have | **Pass** | Dashboard reads existing loan, hold, and overdue data; defer polish if schedule is tight. |
| Concurrency rules are explicit | **Pass** | NFR-05 plus the transaction contract in this review. |
| NFR verification is measurable | **Pass with hand-off** | Metrics exist; PA4/PA5 must produce measurements. |
| Runtime implementation exists in this repository | **Pending** | `src/` is a placeholder; PA3 must add migrations, API contracts, and tests. |
| Prototype links resolve to committed assets | **Needs follow-up** | The SRS lists Figma-style paths, but no `docs/design/wireframes.md` exists in the current tree. Ánh should commit or update those links before final PA2 packaging. |
| Use-case specifications are complete | **Needs follow-up** | The supplied SRS template still contains a blank UC-01 specification block. Nguyên/Vinh should populate the six required detailed UCs before final submission. |

## Q6 — repository verification

The repository currently has the expected PA2 evidence and no generated application artifacts. Before the PA2 baseline is tagged, run:

```powershell
git status --short
git diff --check
rg --files pa/PA2 docs/architecture docs/ai-usage
```

The baseline tag should be created only after the team reviews this note and resolves the two follow-up items above:

```powershell
git tag -a pa2-baseline -m "PA2 SRS and technical review baseline"
git show --stat --oneline pa2-baseline
```

Branch protection and required CI checks are hosted-repository settings and cannot be verified from the local checkout. The owner should capture a GitHub settings screenshot or URL in the final PA2 review record.

## Traceability

This review provides the developer-side evidence for `PA2-Q1` through `PA2-Q6`, and directly supports `NFR-03`, `NFR-04`, `NFR-05`, `NFR-08`, `BR-01`…`BR-09`, and the circulation acceptance criteria in `pa/PA2/00-id-registry.md`.

