# InfraDev Website

Next.js 15 (App Router) + Tailwind CSS (light theme) + Prisma/SQLite, with an admin panel for site settings.

## Local development

```bash
cp .env.example .env
npm install
npm run db:setup     # apply migrations + first-run data (settings, logo/favicon import, admin user)
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (default `admin` / `ChangeMe123!` – change it after first login)

## First-run data

`prisma/migrations` creates the tables; `prisma/seed.mjs` (idempotent, runs on every container start) then:

- inserts default settings from `prisma/seed-data.json` (only keys that do not exist yet)
- copies `data/logo.png` and `data/favicon.ico` into `storage/uploads` and registers them in the settings
- creates the first admin user from `ADMIN_USERNAME` / `ADMIN_PASSWORD`

## Quotations & invoices

Admin > *Quotations & Invoices*. Numbers are generated automatically as `PREFIX-YYYYMMDDNN` (e.g. `INV-2026091401`, daily sequence); prefixes, NTN, business address/email/phone, regards, bank details, default terms and the company stamp are in *Site settings*.
Documents can be edited but never deleted (no delete UI/action, plus a SQLite trigger blocks `DELETE`); use the status (e.g. Cancelled) instead. Open a document and use *Print / Save PDF* for the A4 layout.
Dates and numbers use the server time zone (`TZ`, default `Asia/Karachi` in Docker).

## Docker

```bash
docker compose up -d --build
```

Site on http://localhost (set `HTTP_PORT` to change). All state (SQLite DB, uploads, session secret) lives in the `infradev-data` volume.
Optional environment variables: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `HTTP_PORT`.
Serve behind HTTPS with a reverse proxy that sets `X-Forwarded-Proto: https` so session cookies are marked `Secure`.
