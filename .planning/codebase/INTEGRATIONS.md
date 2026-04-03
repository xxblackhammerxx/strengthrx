# External Integrations

**Analysis Date:** 2026-04-03

## APIs & External Services

**Bot Protection & Validation:**
- Google reCAPTCHA Enterprise - Prevents spam and bot abuse on contact forms
  - SDK/Client: `@google-cloud/recaptcha-enterprise` (v6.4.0)
  - Auth: Service account credentials via `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY`
  - Usage: `src/app/api/contact/route.ts`
  - Creates assessments on contact form submissions with action `CONTACT_FORM`
  - Risk score threshold: 0.5 for acceptance

**Email Delivery:**
- Resend - Transactional email service
  - SDK/Client: `resend` (v6.9.3)
  - Auth: `RESEND_API_KEY` environment variable
  - Usage: `src/app/api/contact/route.ts`
  - Sends contact form emails to admin inbox
  - Supports HTML email templates with inline styling
  - From address configured via `SiteSettings` global or env var `RESEND_DEFAULT_FROM_ADDRESS`

**Content Delivery:**
- GraphQL API - Payload CMS provides GraphQL endpoint
  - SDK/Client: `graphql` (v16.8.1)
  - Access point: `src/app/(payload)/api/graphql/route.ts`
  - Playground available at: `src/app/(payload)/api/graphql-playground/route.ts`
  - Used for querying collections and globals from frontend

## Data Storage

**Databases:**
- PostgreSQL - Primary relational database
  - Connection: `DATABASE_URI` environment variable (e.g., `postgresql://user:pass@host/dbname`)
  - Client: `@payloadcms/db-postgres` (v3.61.1)
  - Adapter location: `src/payload.config.ts`
  - Collections: Users, Media, Admins, Partners, Clients, Referrals
  - Globals: PrescriptionStates, SiteSettings

**File Storage:**
- Local filesystem - Media files stored locally
  - Managed by Payload Media collection: `src/collections/Media.ts`
  - Upload configuration: `upload: true` in Media collection
  - Image optimization via Sharp library for Next.js image handling

**Caching:**
- None configured - Standard Next.js caching applied

## Authentication & Identity

**Auth Provider:**
- Custom via Payload CMS - Built-in authentication system
  - Implementation: Token-based with HTTP-only cookies
  - Collections with auth enabled:
    - `Clients` - End users accessing client portal
    - `Partners` - Trainers/affiliates accessing partner portal
    - `Admins` - Administrative users accessing admin panel
  - Token storage: `payload-token` HTTP-only cookie
  - Cookie settings:
    - Max age: 7 days (604,800 seconds)
    - Same-site: lax
    - Secure: true in production, false in development
    - Path: /
  - Login endpoints:
    - `src/app/api/login/route.ts` - Generic login for all collections
    - Auto-login on signup: `src/app/api/signup/route.ts`, `src/app/api/signup/partner/route.ts`
  - Helper functions: `src/lib/auth.ts`
    - `getAuthenticatedClient()` - Get authenticated client user
    - `getAuthenticatedPartner()` - Get authenticated partner user
    - `getAuthenticatedAdmin()` - Get authenticated admin user

## Monitoring & Observability

**Error Tracking:**
- None configured - Console logging only
  - Errors logged to console in API routes
  - reCAPTCHA assessment results logged for debugging

**Logs:**
- Console-based logging via `console.log()` and `console.error()`
- Key logged events:
  - reCAPTCHA validation scores and reasons: `src/app/api/contact/route.ts`
  - Referral creation: `src/app/api/signup/route.ts`
  - Login errors: `src/app/api/login/route.ts`
  - Partner signup errors: `src/app/api/signup/partner/route.ts`

## CI/CD & Deployment

**Hosting:**
- Docker-based deployment supported
  - Dockerfile: `Dockerfile` (Node 22.17.0-alpine base)
  - Multi-stage build: deps → builder → runner
  - Output: Standalone Next.js server
  - Port: 3000
  - Default package manager: pnpm
  - Environment-specific configuration via `.env` file

**Local Development:**
- Docker Compose support: `docker-compose.yml`
  - Services: Node.js app (port 3000) + MongoDB (port 27017)
  - Volumes: Node modules persistence, database persistence
  - Note: Docker Compose currently configured with MongoDB, but codebase uses PostgreSQL
  - PostgreSQL service commented out - requires manual uncommenting for local Postgres setup

**CI Pipeline:**
- None detected - No GitHub Actions or CI configuration files

## Environment Configuration

**Required env vars:**
- `DATABASE_URI` - PostgreSQL connection string
- `PAYLOAD_SECRET` - CMS authentication secret
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise site key (public, safe to expose)
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA Enterprise secret key
- `RESEND_API_KEY` - Email service API key
- `GOOGLE_CLIENT_EMAIL` - Google Cloud service account email
- `GOOGLE_PRIVATE_KEY` - Google Cloud service account private key
- `NODE_ENV` - Environment (development/production)

**Optional env vars:**
- `RESEND_DEFAULT_FROM_ADDRESS` - Default email "from" address (defaults to `info@gainzmarketing.com`)
- `RESEND_DEFAULT_FROM_NAME` - Default email "from" name (defaults to `StrengthRX`)

**Secrets location:**
- `.env` file (gitignored, never committed)
- Reference template: `.env.example`
- Payload CMS also stores configurable settings in `SiteSettings` global:
  - `contactFormRecipient` - Email for contact form submissions
  - `fromEmail` - Email sender address (must be verified in Resend)
  - `fromName` - Email sender display name

## Webhooks & Callbacks

**Incoming:**
- Contact form submission: `POST /api/contact` - Receives form data and reCAPTCHA token
- User signup: `POST /api/signup` - Receives client registration data
- Partner signup: `POST /api/signup/partner` - Receives partner registration data
- Login: `POST /api/login` - Receives credentials and collection type
- Account update: `POST /api/account/update` - Receives account changes
- Referral verification: `POST /api/verify-referral` - Verifies referral codes

**Outgoing:**
- Email notifications via Resend - Contact form submissions trigger admin email
- GraphQL queries - Frontend can query Payload CMS for content

---

*Integration audit: 2026-04-03*
