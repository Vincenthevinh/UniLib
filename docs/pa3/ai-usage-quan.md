# PA3 - AI Usage Log: Tran Ho Anh Quan (W1)

Date: 2026-11-23. Tool: ChatGPT coding agent through connected local repository tooling.

| Area | AI-assisted contribution | Human verification/review still required |
|---|---|---|
| Q1 | Inspected PA2 SRS and repo; generated Prisma schema, SQL migration, DBML/ERD PNG, Data Specification. | Confirm provisional state names, inspect ERD, approve schema with BA/PM. |
| Q2 | Drafted catalog/copy/search service and routes, temporary JWT/RBAC adapter, C4 diagrams and architecture note. | Vinh integrates authoritative F01; Nguyen/Anh confirm field names and screens. |
| Q3 | Drafted FIFO/72h reservation transactions, expiry/cancel helpers, sequence/component diagrams and tests. | Vinh integrates return/checkout; PM decides skip policy for newly ineligible queued readers. |
| Q4 | Drafted 9-user/30-title/80-copy demo seed, index/3NF docs, deployment plan and API contract. | Team confirms demo labels and external deployment/secrets. |
| Q5 | Built local Docker PostgreSQL/API, ran migrations, seed, Jest twice, live smoke/concurrent hold tests and data-model consistency check. | Reviewer reruns evidence and approves PR; end-to-end UI and F01/F05/F07 still require owners. |

Verification performed by the agent: Prisma validate/generate; PostgreSQL migration deploy; Docker compose health; 16 Jest/Supertest tests twice; 15 live smoke checks; ERD/Prisma/DB 5-table/44-column/12-index match; reset+seed in 7.12 seconds.

No automated output should be accepted as human sign-off. This log records assistance, not a claim that Quân personally wrote or reviewed every generated line.