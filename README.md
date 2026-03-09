# Banner Analytics (BannerScoreAI)

Banner Analytics is a Next.js web app for **AI-assisted banner / ad creative analysis**. The goal is to let users upload a banner, get a score + recommendations, and track analysis history and token usage in a dashboard.

## What it does (today)

- **Landing page**: Marketing-style homepage describing the product concept (`/`).
- **Auth**: Supabase auth flows with UI for login/signup, password reset, and a 2FA step-up page (`/auth/*`).
- **Dashboard shell**: Dashboard layout + overview UI with charts/table currently powered by **mock/sample data** (`/dashboard`).
- **Settings shell**: Settings routes exist (profile/billing/security) but are currently minimal/stubbed (`/settings/*`).

## Project stage

**Stage: UI + auth scaffolding (early MVP).**

Implemented:
- Supabase email/password auth via Next.js server actions (`lib/user-actions.ts`)
- Auth routing rules (logged-in/out, MFA step-up) (`lib/auth/auth-routing.ts`)
- Dashboard layout, navigation, and reusable UI components (charts, tables, image upload)

In progress / missing:
- Real “upload banner → analyze → persist results” pipeline (no server/API for AI analysis yet)
- Dashboard pages beyond the overview (`/dashboard/analytics`, `/dashboard/history`, `/dashboard/billing` are placeholders)
- Route protection middleware is drafted in `proxy.ts` but **not wired into Next.js** (Next expects `middleware.ts`)
- Payments/token purchasing integration (UI only)

## Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Ant Design** (+ `@ant-design/nextjs-registry`)
- **Tailwind CSS**
- **Supabase** (`@supabase/ssr`)
- **GSAP** (animations)

## Running locally

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment variables

Create a `.env.local` (recommended) with at least:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)

If you enable OAuth providers in Supabase (e.g. LinkedIn), ensure the provider redirect/callback URLs match:
- `${NEXT_PUBLIC_SITE_URL}/auth/callback`

### 3) Start dev server

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Useful scripts

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # run production server
npm run lint   # eslint
```

## Routes (current)

- **Public**
  - `/` – landing page
  - `/auth/login`, `/auth/signup`
  - `/auth/forgot-password`, `/auth/reset-password`, `/auth/reset-callback`
  - `/auth/check-email`, `/auth/callback`, `/auth/error`
- **App**
  - `/dashboard` – overview (mock data)
  - `/dashboard/analytics` – placeholder
  - `/dashboard/history` – placeholder
  - `/dashboard/billing` – placeholder
  - `/settings/profile` – minimal
  - `/settings/billing`, `/settings/security` – minimal/stubbed

## Repo layout

- `app/` – Next.js routes (App Router)
- `components/` – UI + page components
- `lib/` – Supabase clients, auth routing, server actions

## Contributing notes

- Keep secrets out of git. Prefer `.env.local` and do not commit real Supabase keys.
- When implementing new routes, keep auth rules in sync with `lib/auth/auth-routing.ts`.
