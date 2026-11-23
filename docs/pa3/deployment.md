# PA3 - Deployment Diagram (W1-Q4)

Owner: Tran Ho Anh Quan. Diagram source: docs/design/deployment.mmd.

## Target deployment

- Browser runs the React/Vite SPA, hosted as static assets on Vercel.
- Node.js 22/Express API container runs on Render (or equivalent). The deployment must set DATABASE_URL, JWT_SECRET, CLIENT_ORIGIN and PORT from secure host settings.
- PostgreSQL 16 is managed separately with persistent volume/backups. Prisma migrations run before the API accepts traffic.
- The W1 job scheduler is inside the API process and checks hold expiry every 60 seconds. For horizontal scaling, add distributed leader election/scheduled worker; database transactions still enforce one transition.

## Local demonstration

docker-compose.yml starts PostgreSQL 16 with a persistent volume and the API service in one command. The API container waits for database health, then runs Prisma migration deploy and starts Express. Browser client is a teammate-owned Vite app on localhost:5173 and is not yet present.

## Operational risks

Default compose credentials are local-demo-only and must not be reused in cloud hosting. Production should disable public DB port, use TLS and secret storage, and schedule backups. The demo seed has a production guard. NFR-08 restore under 5 minutes is not proven without an actual timed reset/seed run.