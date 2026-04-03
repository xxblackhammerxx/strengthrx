# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StrengthRX (`yourstrengthrx`) is a wellness/telehealth business site built with **Next.js 15** and **Payload CMS 3** using PostgreSQL. It provides marketing pages for TRT, peptides, weight loss, and sexual wellness services, plus authenticated portals for clients, partners (trainers), and admins.

## Commands

- **Dev server:** `pnpm dev` (runs on localhost:3000)
- **Dev server (clean):** `pnpm devsafe` (clears `.next` first)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Integration tests:** `pnpm test:int` (vitest, tests in `tests/int/**/*.int.spec.ts`)
- **E2E tests:** `pnpm test:e2e` (Playwright, tests in `tests/e2e/`)
- **All tests:** `pnpm test`
- **Generate Payload types:** `pnpm generate:types` (outputs to `src/payload-types.ts`)
- **Generate import map:** `pnpm generate:importmap`
- **Seed data:** `pnpm seed`

## Architecture

### Route Groups (Next.js App Router)

The app uses three route groups under `src/app/`:

- **`(frontend)`** — Public marketing site with `MainNav` + `SiteFooter` layout. Marketing pages live under `(frontend)/(marketing)/`. Has its own root layout with fonts, metadata, and reCAPTCHA script.
- **`(portals)`** — Authenticated dashboards (`client-portal/`, `partner-portal/`, `admin-portal/`) with `PortalNav` + `PortalFooter` layout. Not indexed by search engines.
- **`(payload)`** — Payload CMS admin panel at `/admin` and API/GraphQL endpoints.

### Payload CMS Collections & Globals

Defined in `src/collections/` and `src/globals/`. Config is in `src/payload.config.ts`.

- **Collections:** Users, Admins, Partners, Clients, Referrals, Media
- **Globals:** PrescriptionStates (manages which US states have available services), SiteSettings (contact form recipient, email sender config)

Three separate auth-enabled collections (Admins, Partners, Clients) — authentication helpers in `src/lib/auth.ts` check `user.collection` to determine role.

### Referral System

Partners (trainers) have referral codes. Clients sign up via referral links. The Referrals collection tracks the pipeline: `lead_created` → `consult_booked` → `qualified` → `converted` (or `disqualified`). Referral verification API at `/api/verify-referral`.

### Key Libraries

- **Database:** `@payloadcms/db-postgres` (PostgreSQL via Drizzle under the hood)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/forms` and `@tailwindcss/typography`
- **UI utilities:** `class-variance-authority`, `clsx`, `tailwind-merge` (combined in `src/lib/utils.ts`)
- **Email:** Resend
- **Spam protection:** Google reCAPTCHA Enterprise
- **Charts:** Recharts (portal dashboards)
- **Icons:** lucide-react

### Content & Config

- `src/content/` — Static content data (services, testimonials, FAQ, hormone therapies)
- `src/lib/business.config.ts` — Business contact info, phone, email, URLs (single source of truth)
- `src/lib/seo.ts` — SEO/structured data helpers
- `src/lib/schema.ts` — JSON-LD schema generation

## Environment Variables

See `.env.example`. Key vars: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`.
