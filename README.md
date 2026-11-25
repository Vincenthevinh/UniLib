# UniLib — University Library Management System

Final project for Introduction to Software Engineering course · FIT HCMUS · 2026

[![CI - Test & Lint](https://github.com/Vincenthevinh/UniLib/actions/workflows/ci.yml/badge.svg)](https://github.com/Vincenthevinh/UniLib/actions)
[![Release Demo](https://img.shields.io/badge/Release-v0.3--pa3--demo-blue)](https://github.com/Vincenthevinh/UniLib/releases/tag/v0.3-pa3-demo)
[![PA3 Software Design](https://img.shields.io/badge/PA3-Software%20Design%20v1.0.0-success)](pa/PA3/PA3-SoftwareDesign.docx)

UniLib là Hệ thống Quản lý Thư viện Đại học (University Library Management System) được phát triển bởi **Nhóm T05** (Lớp Nhập môn Công nghệ Phần mềm — HK1/2026-2027, Khoa CNTT, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + JavaScript (SPA) |
| UI & Styling | TailwindCSS + CSS Grid / Flexbox + Responsive Breakpoints (1024px–1920px) |
| State / Routing | React Context (`AuthContext`) + React Router v6 |
| Backend | Node.js 22 LTS + Express.js (ESM) |
| Database | PostgreSQL 16 + Prisma ORM 6.x |
| Auth & Security | Stateless JWT (HS256) + bcryptjs (salt >= 10) + Helmet + CORS |
| Concurrency Control | PostgreSQL Interactive Transactions + Row-Level Locking (`SELECT FOR UPDATE`) |
| Logging & Errors | Centralized `errorHandler` + structured Error Envelope `{error:{code,message,details}}` |
| Testing | Jest + Supertest (Backend 13 suites, 237 tests) + Vitest (Frontend 8 tests) |
| API Specification | RESTful JSON API (`docs/design/api.md`) |
| Deploy | Vercel (FE Edge CDN) + Render (BE Web Service) + Render Managed PostgreSQL (DB) |

---

## Prerequisites

Make sure the following are installed before getting started:

- [Node.js 20+](https://nodejs.org) (Recommended: Node.js 22 LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)
- [npm](https://www.npmjs.com) (>= 10.x)

---

## Installation & Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Vincenthevinh/UniLib.git
cd UniLib
```

### 2. Start the database (and full API stack via Docker)

```bash
docker compose up -d
```

Verify containers are running:

```bash
docker compose ps
# unilib_db    running   0.0.0.0:55432->5432/tcp
# unilib_api   running   0.0.0.0:18081->3001/tcp
```

### 3. Set up Backend

```bash
cd src/server
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm ci
```

### 4. Set up Frontend

```bash
cd ../client
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm ci
```

### 5. Migrate database & Seed data

```bash
cd ../server
npx prisma migrate deploy
npm run db:seed
```

After seeding completes you should see:

```
🎉 Seed completed! (9 users, 30 titles, 80 copies, 5 active loans, 2 pending holds)
  Admin:       admin       / UniLibDemo!2026
  Librarian:   librarian1  / UniLibDemo!2026
  Librarian:   librarian2  / UniLibDemo!2026
  Reader:      reader1     / UniLibDemo!2026
  Reader:      reader2..6  / UniLibDemo!2026
```

### 6. Run the servers

Open **2 separate terminals**:

```bash
# Terminal 1 — Backend API
cd src/server
npm run dev
# → http://localhost:3001 (or http://localhost:18081 if running in Docker)
```

```bash
# Terminal 2 — Frontend Client
cd src/client
npm run dev
# → http://localhost:5173
```

### 7. Verify

| URL | Expected result |
|---|---|
| http://localhost:3001/api/health | `{"status":"ok","database":"connected"}` |
| http://localhost:5173 | UniLib React Client SPA is running (`SCR-01` Login) |
| http://localhost:5555 | Prisma Studio (run `npx prisma studio` in `src/server`) |

---

## Environment Variables

### `src/server/.env`

```env
NODE_ENV=development
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/unilib
JWT_SECRET=unilib_super_secret_jwt_key_at_least_32_chars_long
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
RESERVATION_SWEEP_MS=60000
```

### `src/client/.env`

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK=false
```

---

## W1 Release Demo Features (F01–F07 Scope)

- **F01 (Authentication & RBAC):** Credential sign-in, stateless JWT tokens, client logout, admin user management (`SCR-01`, `SCR-02`).
- **F02 (Catalog Management):** 30 seeded titles, metadata creation/editing, real-time copy counters (`SCR-03`, `SCR-06`).
- **F03 (Copy Inventory):** 80 physical copies, unique barcodes, shelf locations, condition inspection (`SCR-04`).
- **F04 (Search & Browse):** Multi-attribute search (title, author, ISBN, category), category filter, available-only toggle, sorting, server-side pagination (10 items/page, `NFR-01`) (`SCR-05`).
- **F05 (Circulation Desk):** 14-day checkout duration (`BR-02`), 3-loan limit (`BR-01`), overdue borrowing block (`BR-04`), return check-in with condition inspection and auto-hold trigger (`SCR-07`, `SCR-08`).
- **F06 (Reservation & Holds):** Zero-available reservation placement (`BR-05`), FIFO queuing (`BR-07`), 72-hour hold shelf allocation (`BR-08`), patron cancellation (`SCR-09`, `SCR-10`).
- **F07 (Dashboard & Overdue):** Reader personal dashboard (loans, renewal status `BR-03`, queue position) and Librarian overdue monitoring (`SCR-11`, `SCR-12`).

### Reader 3-Minute Demo Walkthrough (`docs/pa3/demo-script.md`)

1. **0:00–0:30 · Sign In & Role Routing (`SCR-01`):** Show generic error on bad credentials (prevent enumeration, `AC-F01-02`); sign in as `reader1` and redirect to catalog.
2. **0:30–1:15 · Search, Filter & Pagination (`SCR-05`):** Search by keyword, filter by category, toggle `Available now`, sort by title/year, paginate.
3. **1:15–2:00 · Book Detail & Reserve Modal (`SCR-06` $\rightarrow$ `SCR-09`):** Select title with `Available = 0` (`BR-05`), review 72-hour hold rule (`BR-08`), submit reservation.
4. **2:00–2:45 · Personal Dashboard (`SCR-11`):** Verify `Queue Position: 1` (`BR-07`), check loan due dates and renewal button disabled reasons (`BR-03`).
5. **2:45–3:00 · Responsive Verification (`NFR-07`):** Verify clean layout across 1024px, 1440px, and 1920px viewports without console errors.

---

## Scripts

### Root

```bash
npm test              # Run full test suite across server and client
npm run lint          # Run ESLint across server and client
```

### Backend (`src/server`)

```bash
npm run dev           # Run development API server with nodemon
npm run start         # Run production API server
npm run db:migrate    # Deploy Prisma migrations
npm run db:seed       # Seed sample library dataset
npm run db:reset      # Reset and re-seed database (destructive)
npm run test          # Run Jest + Supertest suites (13 suites, 237 tests)
npm run lint          # Run ESLint on backend code
```

### Frontend (`src/client`)

```bash
npm run dev           # Run Vite development server (localhost:5173)
npm run build         # Build production bundle to dist/
npm run test          # Run Vitest client tests
npm run lint          # Run ESLint on frontend code
```

---

## Project Structure

```text
UniLib/
├── .github/                  CI/CD workflows, issue templates, PR template
├── docs/
│   ├── design/               Design assets, ADRs, C4, UML, ERD, screens
│   │   ├── a11y/             Lighthouse audit & color contrast inspection evidence
│   │   ├── adr/              4 Architecture Decision Records (ADR-001..004)
│   │   ├── c4/               C4 Context (L1) and Container (L2) models
│   │   ├── screens/          Screen captures for SCR-01 to SCR-12 (A5)
│   │   └── uml/              Domain model, Sequence diagrams, State machines
│   ├── pa3/                  PA3 detailed design work package markdown files
│   └── management/           Meeting minutes, weekly reports, WBS tracking
├── pa/
│   ├── PA2/                  SRS Baseline v1.0.0 (T05-PA2.docx)
│   └── PA3/                  PA3 Software Design Deliverables:
│                             ├── PA3-SoftwareDesign.docx
│                             └── PA3-SoftwareDesign.pdf
├── src/
│   ├── client/               Frontend Single Page Application (React 18 + Vite)
│   │   ├── src/
│   │   │   ├── api/          API client, endpoints, business error mapper
│   │   │   ├── components/   Shared UI components, Modal, AppHeader
│   │   │   ├── context/      AuthContext (JWT session management)
│   │   │   ├── pages/        Role-based screen views (reader, librarian, admin)
│   │   │   └── styles/       CSS layouts and responsive polish (NFR-07)
│   ├── server/               Backend REST API (Node.js 22 LTS + Express.js)
│   │   ├── prisma/           schema.prisma (5 models), migrations, seed.js
│   │   ├── src/
│   │   │   ├── middlewares/  authenticate, authorize, errorHandler, requestId
│   │   │   └── modules/      auth, users, books, copies, loans, reservations, dashboard
│   │   └── tests/            13 Jest test suites (237 tests)
│   └── V5-W1.md              Gate W1 Handoff Report & Release v0.3 documentation
├── docker-compose.yml        Docker orchestration for PostgreSQL 16 + Express API
└── README.md                 Project documentation and setup guide
```

---

## Test Accounts

All accounts use the common demo password: **`UniLibDemo!2026`**

| Role | Username | Target Screen | Responsibility |
|---|---|---|---|
| Administrator | `admin` | `/admin/users` (`SCR-02`) | User account management, role assignment, account activation |
| Librarian | `librarian1` | `/librarian/borrow` (`SCR-07, 08`) | Circulation desk checkout, return, condition inspection |
| Librarian | `librarian2` | `/librarian/catalog` (`SCR-03, 04`) | Catalog title creation, copy inventory, overdue tracking |
| Reader | `reader1` | `/reader/catalog` (`SCR-05, 06`) | Catalog browse, book reservation, personal dashboard |
| Reader | `reader2` | `/reader/catalog` (`SCR-05, 11`) | FIFO queue progression testing (position 2) |
| Reader | `reader3`..`6` | `/reader/catalog` (`SCR-05, 11`) | Multi-user hold contention and overdue suspension testing |

---

## Git Workflow

```text
main                        ← production-ready, protected baseline
feature/V*-W1, Q*-W1        ← individual work packages
```

**Process:**

1. Pick an assigned task from the GitHub Project board ([UniLib Board](https://github.com/users/Vincenthevinh/projects/1)).
2. Create a branch from `main`: `git checkout -b feature/V5-W1-gate-release`.
3. Implement code/docs and commit using Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
4. Push branch and open a Pull Request into `main`.
5. PR triggers GitHub Actions CI (`repository-checks`: Jest test suites, Vitest, ESLint).
6. Request at least one human peer review according to the Peer Review Matrix.
7. Merge into `main` after all CI checks pass and reviewer approval is received.

---

## Troubleshooting

**`P1001: Can't reach database server`**
```bash
docker compose up -d
# Ensure container is healthy on port 55432
```

**`Port 5432 or 3001 already in use`**
- UniLib maps PostgreSQL to host port `55432` and Express API to host port `18081` in `docker-compose.yml` to avoid host conflicts. Update `DATABASE_URL` or `PORT` in `.env` if custom binding is needed.

**`VITE_USE_MOCK warning in Client`**
- Ensure `src/client/.env` has `VITE_USE_MOCK=false` so the frontend interacts directly with the live Express backend.

**`Prisma schema out of sync`**
```bash
cd src/server
npx prisma generate
npx prisma migrate deploy
```
