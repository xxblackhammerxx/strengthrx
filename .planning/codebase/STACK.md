# Technology Stack

**Analysis Date:** 2026-04-03

## Languages

**Primary:**
- TypeScript 5.7.3 - Core language for frontend and backend code
- JavaScript (JSX/TSX) - React component development

**Secondary:**
- GraphQL - Query language for API via Payload CMS

## Runtime

**Environment:**
- Node.js 18.20.2+ or 20.9.0+
- Next.js 15.4.10 - React framework for SSR/SSG and API routes

**Package Manager:**
- pnpm 9.x or 10.x - Package management with lockfile support
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- Next.js 15.4.10 - Full-stack framework with App Router
- React 19.1.0 - UI library for components
- React DOM 19.1.0 - React rendering for web
- Payload CMS 3.61.1 - Headless CMS backend with admin panel

**Testing:**
- Vitest 3.2.3 - Unit and integration test runner
- @playwright/test 1.54.1 - End-to-end testing framework
- Playwright 1.54.1 - Browser automation
- @testing-library/react 16.3.0 - React component testing utilities
- jsdom 26.1.0 - DOM implementation for tests

**Build/Dev:**
- Tailwind CSS 4.1.16 - Utility-first CSS framework
- PostCSS 8.5.6 - CSS transformation tool
- Autoprefixer 10.4.21 - Vendor prefixing for CSS
- Webpack - Built into Next.js for bundling
- TypeScript 5.7.3 - Type checking and compilation
- ESLint 9.16.0 - Code linting with Next.js config
- Prettier 3.4.2 - Code formatting
- Sharp 0.34.2 - Image optimization library

## Key Dependencies

**Critical:**
- @payloadcms/next 3.61.1 - Next.js integration with Payload CMS
- @payloadcms/db-postgres 3.61.1 - PostgreSQL database adapter for Payload
- @payloadcms/richtext-lexical 3.61.1 - Rich text editor for Payload
- @payloadcms/ui 3.61.1 - Payload admin UI components
- @payloadcms/payload-cloud 3.61.1 - Cloud deployment plugin
- payload 3.61.1 - Core Payload CMS package

**Infrastructure:**
- @google-cloud/recaptcha-enterprise 6.4.0 - Bot protection and validation
- Resend 6.9.3 - Email delivery service
- GraphQL 16.8.1 - GraphQL query language implementation
- dotenv 16.4.7 - Environment variable management

**UI/UX:**
- lucide-react 0.563.0 - Icon library
- recharts 3.7.0 - Charting library for data visualization
- clsx 2.1.1 - Utility for conditional classNames
- tailwind-merge 3.3.1 - Merge Tailwind CSS classes intelligently
- class-variance-authority 0.7.1 - Type-safe CSS class generation

**Dev Tools:**
- @vitejs/plugin-react 4.5.2 - Vite plugin for React
- vite-tsconfig-paths 5.1.4 - TypeScript path aliases in Vite
- cross-env 7.0.3 - Cross-platform environment variables
- @types/node 22.5.4 - Node.js type definitions
- @types/react 19.1.8 - React type definitions
- @types/react-dom 19.1.6 - React DOM type definitions
- eslint-config-next 15.4.4 - Next.js ESLint config

## Configuration

**Environment:**
- Variables stored in `.env` file (gitignored)
- Required environment variables listed in `.env.example`
- Key configurations:
  - `DATABASE_URI` - PostgreSQL connection string
  - `PAYLOAD_SECRET` - CMS secret key
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise public key
  - `RECAPTCHA_SECRET_KEY` - reCAPTCHA Enterprise secret key
  - `RESEND_API_KEY` - Email service API key
  - `GOOGLE_CLIENT_EMAIL` - Google Cloud service account email
  - `GOOGLE_PRIVATE_KEY` - Google Cloud service account private key
  - `RESEND_DEFAULT_FROM_ADDRESS` - Default email sender address
  - `RESEND_DEFAULT_FROM_NAME` - Default email sender display name
  - `NODE_ENV` - Environment (development/production)

**Build:**
- `tsconfig.json` - TypeScript compiler configuration with path aliases
  - Base path: `./src`
  - Alias: `@/*` maps to `./src/*`
  - Alias: `@payload-config` maps to `./src/payload.config.ts`
- `next.config.mjs` - Next.js configuration with Webpack extension
- `.prettierrc.json` - Code formatting rules (single quotes, trailing commas, 100 char width)
- `eslint.config.mjs` - ESLint configuration extending Next.js core rules
- `vitest.config.mts` - Vitest configuration with jsdom environment
- `playwright.config.ts` - E2E test configuration
- `postcss.config.js` - PostCSS/Tailwind configuration
- `payload.config.ts` - Payload CMS configuration
  - Database: PostgreSQL adapter
  - Collections: Users, Media, Admins, Partners, Clients, Referrals
  - Globals: PrescriptionStates, SiteSettings
  - Editor: Lexical rich text editor
  - Sharp image processing library

## Platform Requirements

**Development:**
- Node.js 18.20.2+ or 20.9.0+
- pnpm 9.x or 10.x
- Docker (optional, for local PostgreSQL via docker-compose)
- PostgreSQL database connection (local or remote)

**Production:**
- Node.js runtime compatible with Next.js 15
- PostgreSQL database
- Google Cloud project (for reCAPTCHA Enterprise)
- Resend account (for email delivery)
- Environment variables configured as shown in `.env.example`
- Docker deployment supported (Dockerfile provided using Node 22.17.0-alpine)

---

*Stack analysis: 2026-04-03*
