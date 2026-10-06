# ResQNet

ResQNet is a full-stack emergency response and resource coordination platform. It includes:

- Next.js web app for dispatch, citizen reporting, dashboards, and analytics
- Express + TypeScript API with JWT auth and RBAC
- PostgreSQL schema via Prisma with seeded demo data
- AI-assisted incident triage with deterministic fallback logic
- Socket.IO real-time incident and alert updates
- Notification and file-upload services with local/demo fallbacks

## Stack

- Frontend: Next.js 16, React 19, TypeScript
- Backend: Express, TypeScript, Prisma, Socket.IO, Zod
- Database: PostgreSQL
- Auth: JWT + bcrypt
- AI: demo/local deterministic engine when no provider key is configured

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (for local development or Docker)

## Quick start

1. Start PostgreSQL locally or with Docker:
   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```
2. Install dependencies:
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Initialize the database and seed demo users/data:
   ```bash
   npm run db:init --prefix backend
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

The frontend runs on http://localhost:3000 and the API runs on http://localhost:4000.

## Default demo accounts

- admin@resqnet.local / Admin123!
- dispatcher@resqnet.local / Dispatch123!
- responder@resqnet.local / Responder123!
- hospital@resqnet.local / Hospital123!
- citizen@resqnet.local / Citizen123!

## Web workspaces

- `/` is the public information page. Sign-in and emergency-report links navigate to their own routes.
- `/login` authenticates against the API and opens the requested page after sign-in, or the dashboard by default.
- `/dashboard` and `/incidents` show records available to the signed-in role; citizen, responder, and hospital incident access is scoped on the API.
- `/incidents/new` submits a database-backed report and returns the reporter to its incident record.
- `/analytics` is available to dispatchers, administrators, and emergency authorities.
- Secure pages include role-specific navigation, a back button, and sign-out.

## Core commands

```bash
npm run build
npm test
npm run lint
npm run dev
```

For backend only:

```bash
npm run db:generate --prefix backend
npm run db:push --prefix backend
npm run db:seed --prefix backend
npm run test --prefix backend
npm run build --prefix backend
```

## Production deployment

1. Set secure environment values in a production `.env` file.
2. Build the application:
   ```bash
   npm run build
   ```
3. Run the API and frontend server with a process manager or container orchestrator.
4. Ensure PostgreSQL is reachable and migrations have been applied.

## API docs

See [docs/API.md](docs/API.md).

## Project structure

- `backend/` — API, Prisma schema, auth, analytics, AI, WebSockets, seed data
- `frontend/` — Next.js app and UI screens
- `docker/` — Docker Compose setup for PostgreSQL
- `docs/` — API and deployment documentation

## Support notes

- If no AI API key is configured, the app automatically uses a deterministic local triage engine.
- If external notification providers are not configured, in-app notifications remain active.
- The application is designed to operate with demo defaults without breaking the core emergency workflow.
