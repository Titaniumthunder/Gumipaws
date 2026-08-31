# 🐾 GumiPaws

A full-stack web app for **GumiPaws**, a boutique dog grooming spa:

- **Public marketing + booking site** (`/`) — a single warm, boutique landing page with a 5-step booking wizard. No login required for customers.
- **Customer self-service** (`/booking/manage/[token]`) — cancel a booking via an unguessable link emailed at confirmation. No account needed.
- **Staff dashboard** (`/admin`) — PIN-based login with three roles (Worker / Manager / Admin), each seeing progressively more: mark bookings paid/complete, edit and cancel, manage staff, and retry failed integrations.

Payment is **not** collected online — the app shows an **estimated price** during booking and payment happens in person at pickup.

## Stack

| Concern    | Choice                                                          |
| ---------- | -------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router) + TypeScript                            |
| Styling    | Tailwind CSS (brand tokens in `tailwind.config.ts`)            |
| Database   | PostgreSQL via Prisma ORM (Azure Flexible Server, Neon, or Supabase — one `DATABASE_URL`) |
| Auth       | Auth.js / NextAuth v5, custom Credentials (numeric **PIN**), bcrypt, roles, IP rate-limiting |
| Calendar   | Google Calendar API via a **service account** (one shared calendar) |
| Email      | Azure Communication Services (transactional confirmation + business notification) |
| Deploy     | Azure App Service (see [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)); any host works — everything is env-driven |

---

## Quick start (local)

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
#    …then fill in the values (see "Environment variables" below).
#    To just run the site + booking + admin, you only strictly need
#    DATABASE_URL, NEXTAUTH_SECRET, ADMIN_NAME, ADMIN_PIN.
#    Calendar + email are optional and fail gracefully if unset.

# 3. Create the database schema
npx prisma migrate deploy      # applies the bundled migration
#   (or `npx prisma migrate dev` while developing)

# 4. Seed the initial admin (reads ADMIN_NAME / ADMIN_PIN)
npx prisma db seed

# 5. Run
npm run dev
# → http://localhost:3000        (public site)
# → http://localhost:3000/admin  (staff dashboard → redirects to login)
```

---

## Environment variables

All secrets/config are read from the environment so the same code runs on
Vercel, Netlify, or a VPS. See `.env.example` for the full list.

### `DATABASE_URL` (and optional `DIRECT_URL`) — Postgres

Use a free hosted Postgres. **No local Postgres required.**

**Neon** (recommended)

1. Create a project at <https://neon.tech>.
2. Copy the **pooled** connection string into `DATABASE_URL`.
3. Copy the **direct** (non-pooled) string into `DIRECT_URL` — Prisma uses it for
   migrations. (If you skip it, migrations still work but may warn.)

**Supabase**

1. Create a project at <https://supabase.com>.
2. Project → **Settings → Database → Connection string → URI**.
3. Use the **connection pooler** URI (port `6543`, `?pgbouncer=true`) for
   `DATABASE_URL` and the direct URI (port `5432`) for `DIRECT_URL`.

### `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — Auth.js

```bash
openssl rand -base64 32   # → NEXTAUTH_SECRET
```

`NEXTAUTH_URL` is the full origin: `http://localhost:3000` locally,
`https://your-app.vercel.app` in production.

### `ADMIN_NAME` / `ADMIN_PIN` — the initial admin staff member

Staff log in with a **numeric PIN only** — no email or password. Used by
`npx prisma db seed` to create the first `ADMIN` staff member; the PIN is
bcrypt-hashed before storage. `ADMIN_PIN` must be 3–10 digits.

Once logged in as that admin, add the rest of your team from **`/admin/staff`** —
each new staff member gets an **auto-generated 4-digit PIN shown once** on
creation (write it down and hand it over). Roles: **Worker**, **Manager**,
**Admin** (see "Staff dashboard & roles" below).

> **Rate limiting:** because PINs are short, the login route locks out an IP
> after **5 failed attempts within 10 minutes** (in-memory sliding window in
> [`src/lib/auth/rate-limit.ts`](src/lib/auth/rate-limit.ts)). For a multi-instance
> deployment, back this with the DB or Redis — the API surface stays the same.

### Google Calendar (service account)

Bookings are written to **one shared business calendar** using a Google Cloud
service account — no per-user OAuth.

1. Go to <https://console.cloud.google.com> → create/select a project.
2. **APIs & Services → Library →** enable **Google Calendar API**.
3. **APIs & Services → Credentials → Create credentials → Service account.**
   Give it a name; no roles needed.
4. Open the service account → **Keys → Add key → Create new key → JSON.**
   Download it.
5. From the JSON, set:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = the `client_email` field.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = the `private_key` field (keep the
     `-----BEGIN…-----` / `-----END…-----` lines; literal `\n` escapes are fine —
     the code un-escapes them).
6. In **Google Calendar** (calendar.google.com), open the target calendar's
   **Settings → Share with specific people → Add** the service account email
   with **"Make changes to events"**.
7. In the same settings, copy **Calendar ID** into `GOOGLE_CALENDAR_ID`
   (it looks like an email or `...@group.calendar.google.com`).

> If these are unset, booking still succeeds — the admin dashboard flags the
> calendar sync as skipped/failed and offers a **Retry sync** button.

### Azure Communication Services (email)

1. In the Azure portal, create a **Communication Services** resource and an
   **Email Communication Services** resource (see
   [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) step 3 for the full walkthrough).
2. Provision a domain on the email resource (the **Azure Managed Domain** is
   instant) and connect it to the Communication Services resource.
3. Copy the connection string from the Communication Services **Keys** blade
   into `AZURE_COMMUNICATION_CONNECTION_STRING`.
4. Set `EMAIL_FROM` to the sender address the domain gives you, e.g.
   `DoNotReply@<random>.azurecomm.net` or `hello@yourdomain.com` on a verified
   custom domain.
5. Set `BUSINESS_NOTIFICATION_EMAIL` to the inbox that should receive a copy of
   every new booking.

> Email also fails gracefully — a send failure never blocks a booking; it's
> logged on the record and retryable from the admin dashboard.

### Optional

- `BUSINESS_TIME_ZONE` — IANA zone for calendar events (default
  `America/Los_Angeles`).
- `ADMIN_NAME` — display name for the seeded admin (default "GumiPaws Admin").

---

## Pricing logic

The price table lives in [`src/lib/booking/pricing.ts`](src/lib/booking/pricing.ts) as plain
constants. `computeEstimate(packageId, addOnIds, size)` is the **single source of
truth**:

- A booking has **at most one package** plus any number of flat **add-ons**:
  `estimatedTotal = package price (0 if skipped) + sum of add-ons`.
- The breed determines a **coat type** (`coatTypeForBreed`): curly/doodle breeds
  (Poodle, Goldendoodle, Labradoodle, Bernedoodle, Cockapoo, Sheepadoodle,
  Shih Tzu, Bichon Frise, …) → `curly`; everything else, including Mixed/Other →
  `standard`.
- Package options for the selected size + coat:
  - **Bath** (both coats) — priced by size.
  - The **full-service** package — `Full Groom` for standard coats, or
    `Poodles & Oodles` for curly coats. These are alternatives; only the
    coat-appropriate one is ever offered (not an extra choice).
- **Add-ons** (10, flat): de-shedding, mat removal, ear cleaning, blueberry
  facial, flea & tick shampoo, nail trim & buff, teeth brushing, anal gland
  expression, paw balm & pad trim, bow/bandana or cologne.
- Bath's posted price varies by coat length; since the wizard doesn't ask, the
  estimate uses the short-hair column (the "from" price).

The booking API **recomputes** the total server-side and validates the package is
allowed for the breed's coat type — the client-sent price is never trusted, and a
mismatched package (e.g. a curly dog priced as `Full Groom`) is rejected.

The wizard is a **6-step flow** (Breed & size → Package → Add-ons → Groomer &
time → Contact → Review) with a **live running total** shown from step 2 onward.

## How a booking flows

1. `POST /api/bookings` validates the payload (Zod), recomputes
   `estimatedTotal`, and creates a `Booking` with status `confirmed`.
2. It then runs integrations ([`booking/sync.ts`](src/lib/booking/sync.ts)):
   creates a Google Calendar event (saving `googleCalendarEventId`) and sends
   confirmation emails (Azure Communication Services) to the customer and business.
3. **Third-party failures never block the customer** — any error is written to
   `calendarSyncError` / `emailSyncError` on the booking so the admin dashboard
   can flag it and offer **Retry sync**.
4. The customer is redirected to `/booking/success?id=…`, which reads the booking
   from the DB (survives refresh).

The confirmation email includes a **"Cancel this booking"** link. A
`cancellationToken` (random UUID) is generated at creation and stored on the
booking; the customer email links to `/booking/manage/[token]`.

## Customer self-service cancellation

- **`/booking/manage/[token]`** — public page. Looks the booking up strictly by
  its `cancellationToken`. If `confirmed`, it shows a summary and a **two-step**
  cancel button (confirm before cancelling). If already `cancelled`/`completed`,
  it shows that status. Unknown tokens get a generic "not found" — we never
  reveal whether a token almost matched.
- **`POST /api/bookings/[id]/cancel`** — verifies the supplied token matches that
  booking (never trusts the id alone), sets status `cancelled`, deletes the
  Google Calendar event, and emails a cancellation confirmation. All third-party
  steps are best-effort.
- Rescheduling isn't part of this flow — the page tells customers to call.

## Staff dashboard & roles

Login is a **numeric PIN pad** (`/admin/login`, tablet-friendly). On success,
Workers land on `/admin/today`; Managers/Admins land on `/admin`. Middleware
protects every `/admin/*` route: unauthenticated → redirect to login;
authenticated-but-wrong-role → **403**.

| Capability                                   | Worker | Manager | Admin |
| -------------------------------------------- | :----: | :-----: | :---: |
| `/admin/today` — today's bookings, big cards |   ✓    |    ✓    |   ✓   |
| Mark `completed` / toggle paid-at-pickup     |   ✓    |    ✓    |   ✓   |
| `/admin` — all bookings, filters, sort, totals |      |    ✓    |   ✓   |
| `/admin/bookings/[id]` — edit status, cancel |        |    ✓    |   ✓   |
| Retry failed Calendar/email sync             |        |         |   ✓   |
| `/admin/staff` — add/remove staff, set roles, PINs |  |         |   ✓   |

The last remaining Admin can't be demoted or removed (safety guard).

---

## Deploying to Vercel

1. Push this repo to GitHub and **Import** it at <https://vercel.com/new>.
2. Add all environment variables from `.env.example` in
   **Project → Settings → Environment Variables**. Set `NEXTAUTH_URL` to your
   Vercel URL. Paste the Google private key as-is (Vercel preserves newlines; the
   code also handles `\n`-escaped keys).
3. The `build` script runs `prisma generate && next build`. Run the migration and
   seed against your production DB once:
   ```bash
   # locally, with the production DATABASE_URL exported:
   npx prisma migrate deploy
   npx prisma db seed
   ```
   (Or add `prisma migrate deploy` to a Vercel deploy hook / build command.)
4. Deploy. The site is static-first; admin and API routes run on-demand.

> Works on Netlify or a VPS too — nothing is Vercel-specific; only the env vars
> change.

## Scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Local dev server                         |
| `npm run build`     | `prisma generate` + production build     |
| `npm start`         | Run the production build                 |
| `npm run db:migrate`| `prisma migrate dev`                     |
| `npm run db:deploy` | `prisma migrate deploy` (prod)           |
| `npm run db:seed`   | Seed the admin user                      |
| `npm run db:studio` | Open Prisma Studio                       |

## Project structure

Two things are worth knowing before you go looking for anything:

- **`src/content/site.ts` holds everything you would want to reword or reprice** —
  business details, service blurbs, the price tables, and the gallery. It is plain
  data with no logic, and it is the only file most day-to-day edits touch.
- **`src/lib/` is grouped by concern** (`booking/`, `integrations/`, `auth/`), so
  the folder name tells you what is inside rather than making you open ten files.

```
assets/                    # source files, NOT served to visitors
  brand/
    gumipaws-logo-original.png  # full-res master (1254px)
prisma/
  schema.prisma            # Booking (package + addOns, cancellationToken) + StaffUser
  migrations/              # bundled initial migration
  seed.ts                  # seeds the initial ADMIN from ADMIN_NAME/ADMIN_PIN
public/                    # served at the site root, so public/brand/x.png is /brand/x.png
  brand/
    gumipaws-logo.png      # 256px copy used in the nav (renders at 32–40px)
  gallery/                 # grooming photos & clips — see scripts/prep-photos.sh
scripts/
  prep-photos.sh           # resize/convert phone photos into public/gallery/
src/
  content/
    site.ts                # ALL editable copy, prices, and gallery entries
  app/
    page.tsx               # public marketing page (assembles sections)
    booking/success/       # DB-backed confirmation page
    booking/manage/[token] # customer self-service cancel page
    admin/login            # numeric PIN pad
    admin/today            # all roles — today's bookings, touch cards
    admin                  # Manager/Admin — full bookings table
    admin/bookings/[id]    # Manager/Admin — detail (Admin: retry sync)
    admin/staff            # Admin — staff & PIN management
    api/
      bookings/            # POST create, [id]/cancel
      admin/               # bookings PATCH, retry-sync, staff CRUD, login-status
      auth/[...nextauth]   # NextAuth handlers
  components/
    marketing/             # Nav, Hero, Services, Pricing, Gallery, …
    booking/               # BookingWizard (5-step), CancelBooking
    admin/                 # header, controls, paid toggle, today card, staff mgr
  lib/
    booking/
      pricing.ts           # price table + computeEstimate (source of truth)
      schema.ts            # Zod validation for the API
      constants.ts         # groomers, time slots
      sync.ts              # runs calendar+email, records the outcome on the row
    integrations/
      google-calendar.ts   # service-account calendar create + delete
      email.ts             # ACS emails (confirm, cancel, business)
    auth/
      access.ts            # roles + per-path access rules (edge-safe)
      rate-limit.ts        # per-IP login lockout
    prisma.ts              # the shared Prisma client
  auth.ts / auth.config.ts # NextAuth PIN setup (edge-safe split, role in JWT)
  middleware.ts            # protects /admin with role-based 403s
  types/next-auth.d.ts     # session/user role typing
```
