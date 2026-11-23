# 5.2 Non-Functional Requirements (NFR)

**Project:** UniLib | **Phase:** PA2 SRS | **Task:** PA2-Q3
**Owner:** Tran Ha Anh Quan (Developer) | **Reviewer:** Nguyen Phan The Vinh (PM/Tester)
**Status:** Ready for review | **Source of truth:** pa/PA2/00-id-registry.md v1.0.0-frozen

The eight numbered requirements below reproduce the frozen quantitative targets. Their verification plans specify the environment, evidence and pass criteria to be implemented in PA4/PA5. A proposed test is not a passing test: UniLib currently has no application runtime in src/.

| ID | Category | Measurable requirement (frozen baseline) | How it will be verified |
| --- | --- | --- | --- |
| **NFR-01** | Search performance | Under 100 concurrent simulated users, catalog search queries shall return response payloads in **1.0 second or less at P95**, against **10,000 seeded Book Title records**. | Seed 10,000 titles with representative categories/authors; run k6/Artillery 100 virtual users using real search terms, filters and pagination. Export latency histogram and P95; pass when P95 <= 1000 ms and requests are successful. Record API and database timings separately. |
| **NFR-02** | Initial page performance | Initial application load must achieve **LCP <= 2.5 seconds at P90** under agreed standard broadband/4G profiles. | Run repeated Lighthouse traces (one cold-load per run) with documented device, network and cache settings. Compute P90 from multiple LCP samples; pass <= 2500 ms. A single Lighthouse score does not establish P90. |
| **NFR-03** | Password hashing and confidentiality | Passwords must be hashed using **bcrypt cost >= 10** before persistence; raw passwords must not appear in API response payloads or logs. | Inspect password service and persistence path; unit-test stored hashes and bcrypt verification. Send invalid and valid logins and inspect sanitized structured logs / responses for raw secrets. Fail if plaintext or password hash is leaked in a response. |
| **NFR-04** | API authorization | Protected REST endpoints must validate JWT claims; unauthenticated requests return **401**, insufficient roles return **403**. | Jest + Supertest matrix for every protected route with missing, malformed, expired and valid tokens of Reader/Librarian/Admin; pass only when authn/authz status codes and resource isolation match the role matrix. |
| **NFR-05** | Transaction integrity | Checkout, check-in and hold allocation must be atomic PostgreSQL transactions with row locks (**SELECT FOR UPDATE**) and produce **zero observed duplicate/conflicting loan or hold states** under the concurrency test suite. | Launch simultaneous checkouts for the final available copy, return-vs-reserve races, two holds for the same title, and expiration-vs-pickup races. Inspect committed rows: at most one active loan per copy, one allocated hold per copy, FIFO maintained, rollback on failure. Review service transaction boundaries and locking order. |
| **NFR-06** | Accessibility | Lighthouse Accessibility score **>= 85**, normal-text contrast ratio **>= 4.5:1**, and keyboard access to all form controls. | Lighthouse audit of SCR-01..SCR-12 as available, contrast inspection of text states, manual Tab/Shift+Tab/Enter/Escape walkthrough; record focus order, labels, validation and error handling. Pass thresholds and no keyboard traps. |
| **NFR-07** | Browser compatibility | Correct responsive operation on **Chrome 120+, Firefox 120+, Edge 120+, Safari 17+**, at viewport widths **1024–1920 px**. | Execute same smoke flows for login, search, checkout, return and reservation across browser matrix at 1024, 1366 and 1920 px. Capture any cropped elements, overlap, horizontal overflow or broken controls; fail on functional or critical layout regression. |
| **NFR-08** | Failure handling and recovery | On network/API outage, UI must show a clear error without crashing; full database schema restoration using documented migration and seed workflow must take **under 5 minutes**. | Disconnect network / force API 5xx and time the user-visible error; reload and verify stable UI. Start from a fresh isolated database, run schema migrations and seed scripts, check expected tables/constraints/records, and record elapsed recovery time < 300 seconds. |

## Verification contract for PA4/PA5

**Test data:** 10,000 seeded title records for NFR-01; enough copies, readers, loans and holds to exercise three active loans, two reservations, overdue restrictions and FIFO allocation. Use synthetic data only; never log production credentials.

**Evidence:** Keep command, tool version, commit SHA, timestamp, dataset size, environment, result, raw report path, and reviewer for each NFR. Mark requirements as Not Tested before a runnable implementation exists.

**Boundary:** NFR-01 measures API response P95, while NFR-02 measures browser LCP P90; they are different user experiences and must not be conflated.

## Technical feasibility and risks

- **NFR-01:** PostgreSQL indexes and paginated queries are plausible for 10,000 titles, but do not claim the target until measured.
- **NFR-02:** React/Vite route splitting and deliberate bundle size support this target. Test real production builds rather than Vite dev mode.
- **NFR-03/04:** Central password hashing, JWT verification, least-privilege route guards and redaction are required across all protected endpoints.
- **NFR-05:** Enforce a consistent lock order across Reader, Copy, Loan and Reservation rows; lock and validate within one transaction to prevent time-of-check/time-of-use races.
- **NFR-06/07:** Ánh's prototype and final browser UI must be reviewed independently; static wireframes do not prove the score or navigation behavior.
- **NFR-08:** Frozen wording says "full database schema restoration via seed scripts"; schema restoration generally also needs migrations or a schema backup. Record this as a review ambiguity without changing the locked requirement. The five-minute claim requires a timed restore run.

## Open items for the requirements review

1. Confirm the exact broadband and 4G Lighthouse network profiles / test device for NFR-02.
2. Define deterministic workload, allowed error rate and CI environment for NFR-01 and NFR-05.
3. Decide whether NFR-08 means schema migrations plus seeds or a verified database restore.
4. Review prototype accessibility with Ánh after the linked Figma file becomes accessible to reviewers.

See [technical review](../architecture/pa2-quan-technical-review.md) and [circulation transitions](diagrams/state-transitions.md). These notes refine verification methods, not the frozen acceptance thresholds.
