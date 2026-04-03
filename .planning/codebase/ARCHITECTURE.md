# Architecture

**Analysis Date:** 2026-04-03

## Pattern Overview

**Overall:** Next.js Full-Stack Application with Payload CMS Integration

**Key Characteristics:**
- Server-side rendering with Next.js App Router and layout-based page organization
- Payload CMS backend for content, collections (Users, Admins, Partners, Clients, Referrals), and globals
- Three parallel route groups enabling multi-portal architecture: frontend (marketing), admin panel, and user portals (client/partner/admin)
- REST API and GraphQL endpoints via Payload integration
- Server components by default with selective client-side interactivity for specific UI sections

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Location: `src/components/`, `src/app/(frontend)/`, `src/app/(portals)/`
- Contains: React components, page layouts, section components, portal-specific UI
- Depends on: UI library components, hooks, lib utilities
- Used by: Next.js routing system

**Route/Page Layer:**
- Purpose: Next.js page routing and layout composition
- Location: `src/app/` (all subdirectories)
- Contains: Next.js App Router pages, layouts, and route handlers
- Depends on: Payload config, auth utilities, API calls
- Used by: Browser navigation and request handling

**API Layer:**
- Purpose: Request handling, business logic, and external service integration
- Location: `src/app/api/` (custom API routes), `src/app/(payload)/api/` (Payload GraphQL/REST)
- Contains: POST/GET handlers, authentication logic, email/reCAPTCHA integration
- Depends on: Payload SDK, Resend email client, Google Cloud reCAPTCHA, business config
- Used by: Frontend forms and portal requests

**Data/CMS Layer:**
- Purpose: Data models, persistence, and content management
- Location: `src/collections/`, `src/globals/`, `src/payload.config.ts`
- Contains: Collection configs (Users, Admins, Partners, Clients, Referrals, Media), globals (PrescriptionStates, SiteSettings)
- Depends on: Payload framework, PostgreSQL database adapter
- Used by: API layer and Payload admin panel

**Library/Utility Layer:**
- Purpose: Shared logic, configuration, and helper functions
- Location: `src/lib/`, `src/hooks/`, `src/types/`
- Contains: Authentication helpers, schema/SEO generators, business config, custom hooks
- Depends on: Payload SDK, Next.js utilities
- Used by: Pages, API routes, components

**Content Layer:**
- Purpose: Static content and data for frontend sections
- Location: `src/content/`
- Contains: FAQ, testimonials, services, hormone therapies data structures
- Depends on: None (pure data)
- Used by: Frontend section components

## Data Flow

**User Registration Flow:**

1. Frontend form (signup page) collects user data
2. Sends POST request to `/api/signup` or `/api/signup/partner`
3. API validates input, checks referral codes against Partners collection
4. Creates user in Clients/Partners collection via Payload SDK
5. Returns success response with user profile data
6. Frontend stores auth token in cookie (set server-side)

**Portal Authentication Flow:**

1. User accesses portal routes (`/client-portal`, `/partner-portal`, `/admin-portal`)
2. Portal layout calls `getAuthenticatedClient()`, `getAuthenticatedPartner()`, or `getAuthenticatedAdmin()` from `src/lib/auth.ts`
3. Auth utility retrieves Payload instance and checks authentication headers
4. Validates user belongs to correct collection
5. Returns user object or null (conditional rendering)
6. Portal components access user via props/context

**Contact Form Flow:**

1. Frontend contact page renders form with reCAPTCHA Enterprise integration
2. On submit, calls `/api/contact` with form data + reCAPTCHA token
3. API validates reCAPTCHA token via Google Cloud reCAPTCHA Enterprise
4. Fetches email settings from Payload global `site-settings`
5. Sends formatted HTML email via Resend email service
6. Returns success/error response to frontend

**State and Content Flow:**

1. Prescription states are stored in Payload global `PrescriptionStates`
2. Homepage calls `getPrescriptionStateCodes()` to fetch available states
3. States are passed to schema generation functions for structured data
4. Content data (FAQ, testimonials, services) imported from `src/content/` at build time
5. Section components render content with structured data (JSON-LD) in head

## Key Abstractions

**Authentication Wrapper Functions:**
- Purpose: Type-safe authentication for different user roles
- Examples: `src/lib/auth.ts` - `getAuthenticatedClient()`, `getAuthenticatedPartner()`, `getAuthenticatedAdmin()`
- Pattern: Each function checks Payload auth state and validates collection membership before returning typed user object

**Portal Content Components:**
- Purpose: Role-specific dashboard and account management
- Examples: `src/app/(portals)/client-portal/ClientPortalContent.tsx`, `src/app/(portals)/partner-portal/PartnerPortalContent.tsx`
- Pattern: Client components that fetch and render portal-specific data with charts, progress tracking, and account details

**UI Component System:**
- Purpose: Consistent, reusable UI building blocks with variant support
- Examples: `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Table.tsx`
- Pattern: React forwardRef components with TypeScript props, Tailwind CSS classes, and class merging via `cn()` utility

**Section Components:**
- Purpose: Modular marketing page sections
- Examples: `src/components/sections/Hero.tsx`, `src/components/sections/Services.tsx`, `src/components/sections/CTA.tsx`
- Pattern: Server or client components that compose UI components and import static content from `src/content/`

**Schema Generation Functions:**
- Purpose: Dynamic structured data (JSON-LD) generation for SEO
- Examples: `src/lib/schema.ts` - `generateOrganizationSchema()`, `generateLocalBusinessSchema()`, `generateFAQPageSchema()`
- Pattern: Pure functions that accept service areas/content and return schema objects, injected into page head

## Entry Points

**Frontend Entry Point:**
- Location: `src/app/(frontend)/page.tsx`
- Triggers: User visits root domain
- Responsibilities: Fetches prescription states, generates structured data schemas, composes homepage sections (Hero, Benefits, HowItWorks, Services, CTA, Testimonials, FAQ)

**Payload Admin Entry Point:**
- Location: `src/app/(payload)/layout.tsx`
- Triggers: User navigates to `/admin`
- Responsibilities: Initializes Payload CMS admin UI with server functions for client/collection operations

**API Entry Points:**
- `/api/login` - POST handler for user authentication (accepts collection parameter)
- `/api/signup` - POST handler for client registration
- `/api/signup/partner` - POST handler for partner registration
- `/api/contact` - POST handler for contact form submissions (with reCAPTCHA verification)
- `/api/account/update` - PUT/PATCH handler for account updates
- `/api/verify-referral` - GET handler for partner referral code verification

**Portal Entry Points:**
- `src/app/(portals)/client-portal/page.tsx` - Client dashboard
- `src/app/(portals)/partner-portal/page.tsx` - Partner dashboard
- `src/app/(portals)/admin-portal/page.tsx` - Admin dashboard

## Error Handling

**Strategy:** Try-catch blocks at API route handlers with typed error responses

**Patterns:**
- API routes wrap async logic in try-catch and return NextResponse with appropriate status codes (400 for validation, 401 for auth, 403 for reCAPTCHA fail, 500 for server errors)
- Client-side form handlers check response status and display user-friendly error messages
- Payload operations (login, find, create) may throw errors; caught and converted to API responses
- reCAPTCHA assessment failures return 403 with descriptive message; server logs score and reasons for debugging
- Email sending failures (Resend) return 500 with generic error message to prevent information leakage

## Cross-Cutting Concerns

**Logging:** 
- Console.error() and console.log() for API routes and reCAPTCHA assessment results
- Payload CMS logs stored in database

**Validation:** 
- API routes validate required fields (email, password, name, etc.) before processing
- Payload collection configs enforce field requirements via `required: true`
- reCAPTCHA token and score validation in contact form handler
- Referral code validation in signup handler (checks if partner with code exists)

**Authentication:** 
- Payload built-in auth system handles password hashing and session management
- Auth cookies set server-side in POST handlers with `httpOnly: true`, `secure` (production only), `sameSite: lax`
- Auth header validation in portal pages via `getAuthenticatedX()` functions (reads from request headers)
- Collection-based access control: clients can only access client-specific endpoints, partners can only access partner routes

**Business Logic:**
- Partner-client relationships established via referral codes during signup
- Email settings and contact form recipients fetched from Payload global `site-settings` at request time
- Prescription state availability stored in Payload global for dynamic state list generation
