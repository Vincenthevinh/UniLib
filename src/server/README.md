# UniLib backend W1 (Quan + integration seams)

Requirements: Node.js 22, Docker Engine with PostgreSQL 16.

From repository root:
1. docker compose up -d db
2. cd src/server
3. Copy .env.example to .env; set JWT_SECRET to at least 32 random characters.
4. npm ci
5. npm run db:generate
6. npm run db:migrate
7. npm run db:seed (demo data only; avoid production)
8. npm start

Docker: from the repository root, run docker compose up --build -d, then docker compose exec api npm run db:seed. API host port is http://127.0.0.1:18081; PostgreSQL host port is 55432 (internal ports 3001 and 5432).

Demo account usernames: admin, librarian1, librarian2, reader1 through reader6. Default local demo password: UniLibDemo!2026 (override DEMO_PASSWORD in your private environment). All accounts are synthetic. Do not expose on a public server.

npm test runs Jest + Supertest contract tests using mocked Prisma. With the Docker demo running, set DATABASE_URL to localhost:55432, JWT_SECRET to the compose demo value, and API_BASE_URL to http://127.0.0.1:18081, then run npm run design:check and npm run smoke. Smoke mutates demo circulation state; run db:reset afterward.

Reservation return/check-out integration is not yet wired to Vinh's F05 LoanService; use exported functions from services/reservations.js as described in docs/design/api.md.

Warning: npm run db:reset DESTROYS the local database schema/data and reseeds demo content. Use only on disposable development data.