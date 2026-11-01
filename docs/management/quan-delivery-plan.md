# Quân Delivery Plan — PA1 to PA5

**Owner:** Trần Hà Anh Quân (Developer)  
**Plan date:** 2026-11-01  
**Source:** `docs/management/pa1-wbs-board.json`, PA2 kickoff WBS, and the frozen PA2 registry.

This plan covers every WBS package assigned to Quân. The PA1 repository and task-board packages are already represented in the repository; the remaining work is the PA3 design, PA4 test setup, and PA5 implementation/deployment path.

## Delivery rules

Work in dependency order: decisions and schema first, API contracts second, shared runtime setup third, features in risk order, then automated tests and deployment. Each package is delivered through a branch and pull request with the issue linked. A package is complete only when its artifact exists, the relevant checks pass, and a teammate has reviewed it.

## PA3 — architecture, schema, and API contracts

**Target window:** 2026-11-03 to 2026-11-16  
**Exit condition:** database design and endpoint contracts are reviewable and traceable to the frozen FR/NFR/BR/UC/SCR IDs.

| WBS | Sequence and work | Deliverable | Verification |
| --- | --- | --- | --- |
| 3.1.2 | 1. Record ADRs for JWT/RBAC, PostgreSQL access/transactions, API error format, and frontend state ownership. | `docs/architecture/adr-*.md` | Each ADR names the rejected alternatives and links to affected requirements. |
| 3.2.2 | 2. Model users, book titles, copies, loans, reservations, and audit fields in 3NF. Add unique/FK/check constraints, indexes, migrations, and seed data. | `db/migrations/*`, `db/seed/*`, schema diagram | Migration up/down, seed restore, and constraint checks on PostgreSQL 16. |
| 3.3.1 | 3. Specify authentication and user-management routes, JWT claims, expiry, role matrix, validation, and 401/403 responses. | `docs/api/auth.md` | Map every route to FR-F01 and NFR-03/04. |
| 3.3.2 | 4. Specify title and copy CRUD routes, lifecycle transitions, deletion conflicts, and availability aggregation. | `docs/api/catalog.md` | Map to FR-F02/F03 and BR-09. |
| 3.3.3 | 5. Specify search parameters, filtering, sorting, pagination, response shape, and availability counters. | `docs/api/search.md` | Query plan targets NFR-01 and default page size 10. |
| 3.3.4 | 6. Specify checkout, check-in, renewal, overdue listing, transaction boundaries, and conflict responses. | `docs/api/circulation.md` | Include `FOR UPDATE` order and FR-F05/BR-01…04. |
| 3.3.5 | 7. Specify reservation creation, FIFO queue, cancellation, expiry, pickup, and hold routing. | `docs/api/reservations.md` | Include BR-05…08 and 72-hour expiry behavior. |

**PA3 review gate:** Nguyên reviews domain semantics; Vinh reviews traceability/testability; Ánh reviews screen/API alignment. Resolve review comments before starting PA5 feature coding.

## PA4 — test automation foundation

**Target window:** 2026-11-17 to 2026-11-22  
**WBS:** 4.1.2, 4 hours.

Set up the backend test runner (Jest + Supertest), frontend runner (Vitest + React Testing Library), test database configuration, deterministic seed/reset commands, coverage output, and CI scripts. Add one meaningful smoke test for health/auth and one transaction test proving two checkout attempts cannot borrow the same last copy.

**Exit condition:** a clean checkout can install dependencies, create/reset the test database, run unit and API tests, and report failures with nonzero exit status.

## PA5 — implementation

**Target window:** 2026-11-23 to 2026-12-08  
**Exit condition:** F01–F06 work end-to-end, tests pass, and deployed environments can be restored from migrations and seed scripts.

| WBS | Sequence and work | Deliverable | Verification |
| --- | --- | --- | --- |
| 5.1.1 | 1. Create Express app, config validation, PostgreSQL pool, migrations, health endpoint, structured errors, logging redaction, and CORS. | Backend bootstrap | Health/API smoke test and env validation. |
| 5.1.2 | 2. Create React/Vite shell, router, auth context, API client, navigation, loading/error states, and responsive layout. | Frontend bootstrap | Build succeeds; keyboard navigation smoke check. |
| 5.2.1 | 3. Implement bcrypt auth, JWT login/logout, RBAC middleware, admin user CRUD/status changes, and login UI. | F01 | 401/403, inactive user, invalid credentials, and role landing tests. |
| 5.2.2 | 4. Implement librarian title CRUD, ISBN uniqueness, protected delete/deactivate rules, and catalog UI. | F02 | FR-F02 acceptance tests and referential-integrity conflicts. |
| 5.2.3 | 5. Implement copy registration/update, barcode uniqueness, shelf/condition fields, lifecycle transitions, and inventory UI. | F03 | State transition and decommission restrictions. |
| 5.2.5 | 6. Implement atomic checkout/check-in/renewal, due dates, overdue detection, and librarian monitoring UI. | F05 | Last-copy race test, 14-day due date, one-renewal rule, overdue suspension. |
| 5.2.6 | 7. Implement title reservations, max-two rule, FIFO queue, 72-hour hold expiry, cancellation, and pickup checkout. | F06 | Concurrent reservation/return tests and queue advancement tests. |
| 5.3.1 | 8. Expand unit/API/integration coverage for auth, catalog, copies, search, circulation, and reservations. | Automated test suite | Required checks and coverage threshold agreed with team. |
| 5.3.3 | 9. Triage failures, fix defects, run regression, Lighthouse, accessibility, and load checks. | Defect log and verification report | NFR-01…08 evidence; no unresolved Must-feature defects. |
| 5.4.1 | 10. Provision Render PostgreSQL/API, configure migrations, secrets, CORS, health checks, and rollback instructions. | Backend deployment | Production smoke test and timed restore run. |
| 5.4.2 | 11. Deploy Vercel frontend, set API base URL, verify browser matrix and production flows. | Frontend deployment | Chrome/Firefox/Edge/Safari checks at agreed viewports. |

## Weekly execution checkpoints

| Date | Checkpoint | Evidence required |
| --- | --- | --- |
| 2026-11-02 | PA2 hand-off | Technical review, unresolved SRS items assigned, branch/PR strategy confirmed. |
| 2026-11-09 | PA3 architecture/schema draft | ADRs, schema draft, migration plan, API outline. |
| 2026-11-16 | PA3 contract freeze | Reviewed DDL and all F01–F06 API contracts. |
| 2026-11-22 | PA4 ready | Test commands work from a clean checkout and CI is green. |
| 2026-11-29 | Foundation + F01 | Backend/frontend bootstrap and authentication integrated. |
| 2026-12-05 | F02/F03/F05/F06 complete | End-to-end Must features and concurrency tests pass. |
| 2026-12-08 | Release candidate | Regression/NFR evidence, Render/Vercel deployments, restore run, and final review. |

## Risks and controls

- **Concurrency defects:** implement circulation service methods before UI polish; require the last-copy race test before merging F05/F06.
- **Schema/API drift:** treat PA3 documents as contracts; update migration and API docs in the same pull request as breaking changes.
- **Schedule compression:** F07 remains outside Quân's Must-feature implementation list; prioritize F01, F02, F03, F05, and F06.
- **Deployment surprises:** deploy a staging environment as soon as the backend bootstrap works; never wait until the final day to test migrations and secrets.

