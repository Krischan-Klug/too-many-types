# Too Many Types

A minimal & pragmatic local-first ERP foundation built with **Fastify + PostgreSQL + Prisma** (API) and **Vite + React** (Web).

---

## ✨ Features (MVP)

- **Auth**: Register, Login, JWT sessions
- **Roles**: `admin`, `user` (seeded at API start)
- **API**: Fastify v5 + Zod validation, modular routes
- **DB**: PostgreSQL + Prisma (schema versioned with migrations)
- **Web**: Vite + React (TS) minimal UI for login/register
- **Modules**: Load Fastify plugins listed in `MODULES` env var (see `packages/example-module`)
- **CI**: GitHub Actions with Postgres service (builds API & Web)

---

## 🧰 Tech Stack

- **Backend**: Fastify v5, @fastify/jwt, @fastify/cors, Prisma
- **Database**: PostgreSQL 16+
- **Frontend**: Vite + React (TypeScript)
- **Tooling**: TypeScript, dotenv-cli, GitHub Actions
- **Monorepo**: npm workspaces

---

## 📦 Repository Layout

```
too-many-types/
├─ apps/
│  ├─ api/                 # Fastify + Prisma (schema in apps/api/prisma)
│  └─ web/                 # Vite + React
├─ packages/
│  ├─ example-module/      # sample Fastify plugin module
│  └─ shared/              # (future) shared types/schemas/ui
├─ .env                    # local dev env (not committed)
├─ package.json            # root (workspaces, aggregate scripts)
└─ .github/workflows/ci.yml
```

---

## ⚙️ Prerequisites

- **Node.js** 20+
- **PostgreSQL** 16+ running locally
- A database and user that match your `.env` (see below)

### PostgreSQL (pgAdmin 4 — click path)

1. Open **pgAdmin 4** and connect to your local server.
2. Create **Login/Group Role** → Name: `erp`, Password: `erp`, _Can login_ ✓ _(optionally “Create DB” for dev)_.
3. Create **Database** → Name: `erp`, Owner: `erp`.
4. Test with Query Tool: `SELECT version();`

**psql alternative**

```sql
-- as postgres superuser:
CREATE ROLE erp WITH LOGIN PASSWORD 'erp';
ALTER ROLE erp CREATEDB;       -- optional for local dev
CREATE DATABASE erp OWNER erp;
```

---

## 🔐 Environment

Create a file **`.env`** in the repo root:

```env
DATABASE_URL="postgresql://erp:erp@localhost:5432/erp"
JWT_SECRET="change_me_to_a_long_random_value"
API_HOST="0.0.0.0"
API_PORT=4000
CORS_ORIGINS="http://localhost:5173"
MODULES="example-module-1","example-module-2","example-module-3"
```

> The API scripts load this root `.env` via **dotenv-cli**. No need to duplicate it.

---

## 🧩 Modules

Modules are separate npm packages under `packages/`. List their package names in the `MODULES` environment variable and the API will load them at startup. The `packages/example-module` workspace demonstrates a minimal Fastify plugin.

---

## 🚀 Setup & Run (like we discussed)

From the **repo root**:

```bash
# 1) Install all workspace deps
npm i

# 2) Migrate DB & start API
cd apps/api
npm run prisma:generate
npm run prisma:migrate
npm run dev    # http://localhost:4000

# 3) Start the web app
cd ../../apps/web
npm run dev    # http://localhost:5173
```

Open `http://localhost:5173`, register a user (role `user`), then log in.  
Your token is stored in LocalStorage, `/me` shows your roles.

---

## 👑 Promote first admin

In pgAdmin Query Tool (replace email):

```sql
WITH u AS (SELECT id FROM "User" WHERE email = 'you@example.com'),
     r AS (SELECT id FROM "Role" WHERE name = 'admin')
INSERT INTO "UserRole" ("userId","roleId")
SELECT u.id, r.id FROM u, r
ON CONFLICT ("userId","roleId") DO NOTHING;
```

Test with your JWT: `GET http://localhost:4000/admin/only` should return 200 for admins.

---

## 📚 API Endpoints (MVP)

- `POST /auth/register` → `{ email, displayName, password }`
- `POST /auth/login` → `{ email, password }` → `{ token, user }`
- `GET  /me` (Authorization: `Bearer <token>`)
- `GET  /admin/only` (JWT + `admin` role) → example protected route
- `GET  /healthz` → `{ ok: true }`

> Zod validates request payloads. Extend with more routes/modules as you grow.

---

## 🧪 CI (GitHub Actions)

- Workflow: `.github/workflows/ci.yml`
- **API job**: starts a Postgres 16 service, runs Prisma generate + migrate deploy, builds API
- **Web job**: installs & builds the Vite app
- Use env vars in CI instead of `.env` files

---

## 🧭 Development Workflow

- **Branching**: `main` (stable), feature branches (`feat/...`, `fix/...`)
- **PRs**: One PR per feature; API + Web changes together are welcome

---

## 🐛 Troubleshooting

- **`missing secret` at startup** → Ensure `JWT_SECRET` is set in root `.env`. API is started with `dotenv -e ../../.env`.
- **Prisma can’t find schema** → It’s at `apps/api/prisma/schema.prisma`. Use the provided npm scripts only.
- **`@prisma/client did not initialize`** → Run `npm run prisma:generate` inside `apps/api`.
- **CORS errors** → Confirm `CORS_ORIGINS="http://localhost:5173"` in `.env` and restart API.
- **pg connection refused** → Ensure PostgreSQL is running on `localhost:5432`, and DB/user exist.

---

## 📄 License

```
MIT © 2025 Too Many Types
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
