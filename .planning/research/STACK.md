# Stack Research

**Domain:** Multi-step onboarding form + third-party API integration (telehealth)
**Researched:** 2026-04-03
**Confidence:** MEDIUM — Practice Better API schema fields not fully verified (swagger truncated); auth mechanism confirmed HIGH confidence

## Context: What Already Exists

Do NOT re-add these. They are already in `package.json`:

- Next.js 15.4.10, React 19.1.0 (App Router)
- Payload CMS 3.61.1 + `@payloadcms/db-postgres`
- Tailwind CSS v4, `tailwind-merge`, `clsx`, `class-variance-authority`
- `lucide-react`, `resend`, `@google-cloud/recaptcha-enterprise`

---

## Recommended Stack Additions

### Core: Form Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-hook-form | ^7.72.1 | Per-step form state + validation | Industry standard for React forms. Uncontrolled inputs = minimal re-renders. `mode: "onBlur"` per step lets you trigger Zod validation only when moving forward. Works natively with Next.js App Router client components. ~25KB. |
| zod | ^3.24.0 | Schema validation per step | Use v3, not v4. Zod v4 was very recently promoted to the `zod` package default (as of early 2026) and has known breaking changes on minor upgrades. v3 remains stable and `zod@^3.24.0` resolves to the last stable v3 release. Use `@hookform/resolvers` to connect to react-hook-form. |
| @hookform/resolvers | ^3.9.0 | Bridge react-hook-form to Zod schemas | Required adapter. `zodResolver(schema)` per step. Version 3.x is compatible with react-hook-form v7 and zod v3. |

### State Persistence Across Steps

Do NOT add Zustand or Redux for this feature. The onboarding flow is 4-5 steps max with shallow data (goals, labs status, name, email, phone). Recommendation:

- Use a single parent `useState` object in the wizard container component to accumulate step data
- Pass down via props or a minimal React Context (no external library)
- On final step submit, send all accumulated data in one server action

This is the established pattern for small bounded wizards in Next.js App Router. Zustand adds bundle weight and indirection that is not justified for a contained onboarding flow.

### Practice Better API Client

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Native `fetch` (built-in) | N/A | HTTP calls to Practice Better API | Node.js 18+ and Next.js 15 have native fetch. No axios or ky needed. The Practice Better API is simple OAuth2 client credentials + one POST endpoint. A thin wrapper module is sufficient. |

No additional HTTP client library is needed. Write a small `src/lib/practiceBetter.ts` server-side module.

---

## Practice Better API: Verified Details

**Authentication:** OAuth2 Client Credentials Flow (MEDIUM confidence — confirmed via swagger.json + third-party integration guide)

**Token endpoint:**
```
POST https://api.practicebetter.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET
```

**Patient creation endpoint:**
```
POST https://api.practicebetter.io/consultant/records
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Token lifespan:** Short-lived (exact duration undocumented in public sources — implement token caching with expiry check).

**Required scopes:** `read` and `write`

**Rate limits:** 5 req/sec, 20-request burst, 10,000 req/day

**Record status:** New clients created with `pendingcreate` status (prospective); transitions to `created` (active) within Practice Better.

**ClientRecordCreateFragment fields:** The exact required field list is not fully documented in public sources (swagger content was truncated). Based on Practice Better's UI and standard EHR patterns, expect: `first_name`, `last_name`, `email`, `phone` (optional), `date_of_birth` (optional). **Verify against the live swagger spec at `https://api-docs.practicebetter.io` before implementing.** LOW confidence on exact field names.

**Implementation pattern for Next.js:**
- Create a Next.js Server Action or Route Handler (`src/app/api/practice-better/route.ts`)
- Never expose credentials to the client — all Practice Better calls must be server-side
- Cache the OAuth token in a module-level variable with expiry timestamp (avoid re-fetching on every request)
- Store `PRACTICE_BETTER_CLIENT_ID` and `PRACTICE_BETTER_CLIENT_SECRET` in `.env.local`

---

## Rupa Health: Important Status

**Rupa Health is migrating to Fullscript throughout 2026.** All Rupa accounts are moving to Fullscript labs ordering. The "Labshops" co-branded store URL feature is NOT available on Fullscript at this time.

**Implication for this project:** The "Rupa Health store link" handoff (link-only, no API) needs clarification on whether:
1. The practice is staying on Rupa for now (use existing Rupa store URL)
2. The practice is migrating to Fullscript (the URL changes)

No additional npm dependency is needed either way — this is a stored URL string, not an API integration. Store the Rupa/Fullscript store URL as an environment variable or admin-configurable Payload global.

---

## Installation

```bash
# Add to existing project
pnpm add react-hook-form zod @hookform/resolvers
```

That is the complete addition. Three packages.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `react-hook-form` | Formik | Formik uses controlled inputs (more re-renders), smaller community momentum, slower maintenance cadence in 2025-2026 |
| `react-hook-form` | Plain React `useState` per field | Works for simple forms, but per-step validation and error messaging becomes manual work; RHF solves this cleanly |
| `zod` v3 | `zod` v4 | v4 was promoted to the default `zod` package very recently; GitHub issue #4923 shows breaking changes on minor upgrades; v3 is stable and battle-tested |
| `zod` | `yup` | zod is TypeScript-first with better inference; yup requires more verbose type casting |
| Module-level `useState` accumulator | Zustand | A 4-step form does not justify a global state store. Zustand adds 3.3KB and an abstraction layer with no benefit at this scale. |
| Native `fetch` | `axios` | Axios adds ~13KB for a single API integration with no meaningful benefit over native fetch in Node 18+ |
| Server Action / Route Handler | Client-side API call | Practice Better credentials must never reach the browser. Server-side call is mandatory. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Zustand / Redux / Jotai | Overkill for a bounded 4-step wizard; adds bundle weight and indirection | `useState` accumulator in wizard container + React Context if needed |
| Axios / ky | Unnecessary for a single external API integration when native fetch is available in Node 18+ | Native `fetch` in a server-side module |
| `react-query` / `swr` for Practice Better | One-time mutation on form submit; no polling or cache invalidation needed | Direct `fetch` call in Server Action |
| Zod v4 (`zod@latest` as of April 2026) | Too new; breaking change risk on minor upgrades documented in issue #4923 | Pin to `zod@^3.24.0` until v4 stabilizes |
| `next-auth` / any auth library | Payload CMS auth already handles the Clients collection — adding another auth layer creates conflicts | Use Payload's built-in auth (already implemented) |

---

## Integration with Existing Payload Auth

The onboarding flow creates a Payload `Clients` collection entry AND a Practice Better patient record. Order of operations:

1. Collect all form data client-side (react-hook-form accumulator)
2. Submit to a Next.js Server Action
3. Server Action: Create Payload `Clients` record (uses Payload local API — already implemented pattern in the codebase)
4. Server Action: Call `POST /consultant/records` on Practice Better with patient data
5. Server Action: Log Practice Better record ID back to the Payload `Clients` record
6. Return Rupa/Fullscript store URL to client for display
7. Log in the new client via Payload's `loginWithEmailPassword` or redirect to `/login`

Store the Practice Better record ID (`pb_record_id`) on the `Clients` collection — add a text field. This enables future lookups without re-querying by email.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-hook-form@^7.72.1 | React 19.1.0 | RHF v7 explicitly supports React 18+; works with React 19 (confirmed in community) |
| zod@^3.24.0 | react-hook-form via @hookform/resolvers@^3.9.0 | resolvers v3.x bridges RHF v7 + Zod v3 |
| @hookform/resolvers@^3.9.0 | zod@^3.x | Use `zodResolver` from `@hookform/resolvers/zod` |
| All new packages | Next.js 15 App Router | Client components only (multi-step form is client-side); Server Actions handle API calls |

---

## Sources

- `https://api-docs.practicebetter.io/swagger.json` — OAuth2 Client Credentials flow confirmed, base URL `https://api.practicebetter.io`, endpoint `POST /consultant/records`, rate limits (MEDIUM confidence — content truncated)
- `https://rollout.com/integration-guides/practice-better/reading-and-writing-data-using-the-practice-better-api` — Bearer token pattern `Authorization: Bearer {token}`, base URL v1 also referenced (MEDIUM confidence)
- `https://www.npmjs.com/package/react-hook-form` — v7.72.1 current as of 2026-04-03 (HIGH confidence)
- `https://www.npmjs.com/package/zod` — v4 is now default; v3 still maintained at `^3.24.x` (HIGH confidence)
- `https://github.com/colinhacks/zod/issues/4923` — Breaking changes in Zod v4 on minor upgrade, reason to pin v3 (HIGH confidence)
- `https://www.npmjs.com/package/zustand` — v5.0.12 current; dropped for this feature as unnecessary (HIGH confidence)
- `https://www.rupahealth.com/` + `https://help.practicebetter.io/hc/en-us/articles/5028357874843-Setting-up-your-Rupa-Health-Integration` — Rupa Health migrating to Fullscript in 2026; Labshops not available on Fullscript (MEDIUM confidence)
- `https://www.buildwithmatija.com/blog/master-multi-step-forms-build-a-dynamic-react-form-in-6-simple-steps` — RHF + Zustand + Zod multi-step pattern (reference only; Zustand rejected for this scale)

---
*Stack research for: StrengthRX v1.0 UserOnboarding milestone*
*Researched: 2026-04-03*
