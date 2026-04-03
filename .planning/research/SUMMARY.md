# Project Research Summary

**Project:** StrengthRX — v1.0 UserOnboarding Milestone
**Domain:** Telehealth / Wellness — Multi-step patient onboarding with third-party EHR integration
**Researched:** 2026-04-03
**Confidence:** MEDIUM — Core Next.js/Payload patterns are HIGH confidence; Practice Better API integration details are MEDIUM-LOW due to auth-gated documentation

---

## Executive Summary

StrengthRX needs a guided onboarding flow that takes a visitor from the homepage through goal selection, labs question, and contact info collection, then atomically creates a Payload CMS client account and a Practice Better patient record before delivering a Rupa Health lab order link. This is a well-understood domain — telehealth onboarding wizards are built to the same pattern by Hims/Hers, Roman, and Calibrate — and the existing StrengthRX codebase already contains most of the building blocks: referral code handling, Payload client creation, cookie-based auth, and a working signup flow. The new onboarding feature is primarily an assembly job with one genuinely new integration.

The recommended approach is a single-page client-side stepper at `/get-started` using `useReducer` for accumulated state, a new `/api/onboarding` Route Handler for atomic server-side submission, and a thin `src/lib/practice-better.ts` service module isolating the Practice Better API. Only three npm packages need to be added (`react-hook-form`, `zod@^3`, `@hookform/resolvers`). The entire flow submits once at the final step — no per-step server calls, no external state store. This matches the existing `/signup/client` pattern and is the fastest path to a working product.

The primary risk is the Practice Better API. It is explicitly labeled Beta, its documentation is behind auth-gated Swagger, and research surfaced a conflict between third-party sources about the authentication scheme (OAuth2 Bearer vs. HMAC-SHA256). Before writing integration code, credentials must be obtained and auth flow verified against the live Swagger docs. The second risk is partial-failure handling: if Practice Better fails after Payload succeeds, the user must still land on a success screen. This requires a `practiceBetterSyncStatus` field on the Clients collection and a non-blocking try-catch in the API route. Both risks are solvable — neither blocks the overall approach.

---

## Key Findings

### Recommended Stack

The existing codebase (Next.js 15, React 19, Payload CMS 3, Tailwind v4, Postgres) requires only three additions for this milestone. `react-hook-form@^7.72.1` handles per-step validation with uncontrolled inputs and minimal re-renders. `zod@^3.24.0` — pinned to v3, not v4, which has documented breaking changes in issue #4923 — provides TypeScript-first schema validation per step via `@hookform/resolvers`. No global state library (Zustand, Redux) is warranted for a 4-step bounded wizard; a `useReducer` accumulator in the wizard container handles it cleanly.

The Practice Better integration requires only native `fetch` in a server-side module. No HTTP client library is needed. All Practice Better calls must be server-side to protect OAuth credentials; a Route Handler is the correct pattern, not a Server Action, which has known Payload CMS auth cookie issues in some deployment environments.

**Core technologies:**
- `react-hook-form@^7.72.1`: Per-step form state and validation — uncontrolled inputs, works natively with App Router client components
- `zod@^3.24.0`: Schema validation per step — TypeScript-first, stable, explicitly avoid v4 until it stabilizes
- `@hookform/resolvers@^3.9.0`: Bridge between react-hook-form and Zod — required adapter
- Native `fetch` (built-in): Practice Better API client — no axios or ky needed for a single integration
- `useReducer` + React state: Multi-step form accumulator — Zustand and Redux are not justified at this scale

### Expected Features

The 4-step onboarding flow maps cleanly to the following feature set. All table stakes features are low-complexity; the only medium-complexity item is the Practice Better integration itself.

**Must have (table stakes):**
- Progress indicator ("Step X of 4") — abandonment increases significantly without it
- Goal selection step with multi-select checkbox grid (TRT, weight loss, peptides, sexual wellness)
- Labs question step (yes / no / not sure) with contextual confirmation copy
- Contact info step (first name, last name, email, DOB, phone, password) — this is account creation
- Back navigation that preserves state across all steps
- Disabled/loading state on submit to prevent double-submission
- Success screen with Rupa Health store link
- Referral code passthrough from `?ref=` URL param to final submit
- Trust/privacy callout near PHI fields
- "Already have an account?" link to `/login`
- Mobile-responsive layout at every step

**Should have (competitive):**
- Contextual labs messaging based on yes/no/not sure answer — differentiates the experience
- Referral attribution banner when a valid `?ref=` code is present — pattern already exists in `/signup/client`
- Immediate Rupa Health link on confirmation — zero handoff friction, patient can order labs in same session

**Defer (v2+):**
- Save-and-resume across sessions — 4 steps takes under 2 minutes; adds HIPAA surface area
- Email verification before record creation — blocking step that kills conversion
- Inline appointment scheduling — requires Practice Better calendar/availability API
- Health questionnaire — significant scope; Practice Better supports form-requests API for this later
- Email drip sequence — explicitly out of scope per PROJECT.md

### Architecture Approach

The recommended architecture uses a single client component at `/get-started` (inside the existing `(frontend)` route group to inherit the marketing layout), with all step state accumulated in `useReducer` locally. On final submit, a single `POST` to `/api/onboarding` handles Payload client creation, programmatic login/cookie-set, Practice Better patient creation (fire-and-forget with status tracking), and referral record creation. The Practice Better API client lives exclusively in `src/lib/practice-better.ts` and is never imported by client-side code.

The build order is explicit: Clients collection schema extension first (new `goals`, `labsStatus`, `practiceBetterId`, `practiceBetterSyncStatus` fields + migration), then the PB service module, then the API route, then step UI components, then `OnboardingForm` assembly, then the `/get-started` page wrapper, and finally the `Hero.tsx` CTA change. This sequencing avoids building UI against a schema that hasn't been migrated.

**Major components:**
1. `OnboardingForm.tsx` — Step state machine (`useReducer`), navigation, and single-submit handler; `'use client'`
2. `StepGoals / StepLabs / StepContact / StepConfirmation` — Pure UI sub-components; no direct API calls
3. `/api/onboarding/route.ts` — Atomic Route Handler: Payload create + login + PB create + referral create; server-only
4. `src/lib/practice-better.ts` — Practice Better API client (auth headers, request construction, error handling); server-only
5. `src/collections/Clients.ts` (modified) — Add `goals`, `labsStatus`, `practiceBetterId`, `practiceBetterSyncStatus` fields
6. `src/app/(frontend)/get-started/page.tsx` — Thin page wrapper; renders `OnboardingForm` inside existing layout

### Critical Pitfalls

1. **Partial creation (Payload created, Practice Better fails)** — The Practice Better API is Beta and can be unavailable. If the PB call throws after the Payload record is created, the user must still succeed. Wrap the PB call in try-catch, add `practiceBetterSyncStatus: 'pending' | 'synced' | 'failed'` to Clients, return success regardless. Never block the user on a third-party call they cannot control.

2. **Auth cookie not set after programmatic login** — Implementing the onboarding submission as a Server Action instead of a Route Handler causes known Payload CMS auth cookie failures (GitHub issue #14656). Must mirror the exact `NextResponse.cookies.set('payload-token', token.token, {...})` pattern from the existing `signup/route.ts`. Call `router.refresh()` client-side after success.

3. **Practice Better API beta instability / auth scheme conflict** — Research found conflicting documentation: some sources describe HMAC-SHA256 (`X-PB-API-KEY` + `X-PB-SIGNATURE`), others describe OAuth2 Bearer tokens. Do not build against third-party guides. Obtain credentials and verify against the live Swagger at `api-docs.practicebetter.io` before writing any integration code. This is a required pre-implementation spike.

4. **Duplicate email mid-flow** — Email collected at step 3, used at submit. Pre-check against Payload on the email field's onBlur; return "An account with this email exists — log in instead" rather than a generic error at submit time. For PB duplicate responses (409), look up the existing patient ID rather than treating as failure.

5. **Multi-step form state lost on browser back / hard refresh** — Implement sessionStorage persistence as a backup to in-memory `useReducer` state. Decision must be made before any step component is built, not discovered in QA.

6. **No reCAPTCHA on the onboarding API route** — The existing reCAPTCHA setup is already in the codebase. Medical onboarding is a high-value bot target (fake patients in Practice Better, PB rate limit consumption). Apply reCAPTCHA validation to `/api/onboarding` — do not ship without it.

---

## Implications for Roadmap

Based on combined research, a 4-phase roadmap is recommended. The critical insight is that the Practice Better API verification must happen as a pre-phase spike before integration work begins — it is the only genuine unknown that could force a mid-implementation architecture change.

### Phase 1: Schema and Foundation

**Rationale:** Everything downstream depends on the Clients collection having the new fields. Migrations are safest to do first, before any application code references the new schema. This phase also installs the three new packages and establishes the `useReducer` state shape that all subsequent phases will build on.

**Delivers:** Updated Clients schema (`goals`, `labsStatus`, `practiceBetterId`, `practiceBetterSyncStatus`), migration applied, regenerated Payload types, `react-hook-form` + `zod` + `@hookform/resolvers` installed, `OnboardingState` type and reducer defined.

**Addresses:** Goals field (P1-blocking from FEATURES.md), PB record ID field, sync status field.

**Avoids:** Pitfall 1 (partial creation) — the sync status field is the mitigation; must exist before integration code is written.

### Phase 2: Onboarding Form UI (Steps 1–4)

**Rationale:** Pure UI work with no external dependencies. Can be built and tested with stub data while the Practice Better spike runs in parallel (or before it). Confirms the step flow works end-to-end with a mock API response before live credentials are needed.

**Delivers:** `/get-started/page.tsx`, `OnboardingForm.tsx` with `useReducer` + sessionStorage rehydration, all four step components (StepGoals, StepLabs, StepContact, StepConfirmation), progress indicator, back navigation, mobile layout, referral code pre-population from URL param.

**Addresses:** All P1 table-stakes UX features from FEATURES.md.

**Avoids:** Pitfall 2 (state loss) — sessionStorage persistence implemented from the start; Pitfall UX (no progress indicator, no loading state, no privacy callout).

### Phase 3: Practice Better Integration Spike (Gate)

**Rationale:** This must complete before Phase 4. The authentication scheme is unverified (HMAC vs OAuth2 conflict in research). Building the integration against unverified docs risks throwing away the `/api/onboarding` route implementation. The spike costs one day and eliminates the largest technical unknown.

**Delivers:** Verified auth scheme (HMAC or OAuth2), confirmed endpoint (`POST /clients` or `/consultant/records`), confirmed required field names, documented PB invite-email behavior (does creating a patient send an email to the patient?), decision on API version env variable.

**Addresses:** Research gap on Practice Better API field schema (LOW confidence flag in STACK.md and FEATURES.md).

**Avoids:** Pitfall 5 (beta instability / building against wrong auth scheme).

**Research flag:** This phase IS the research. No `/gsd:research-phase` needed — it is a direct credential-verification spike against the live API.

### Phase 4: Onboarding API Route and Integration

**Rationale:** With schema ready (Phase 1), UI ready (Phase 2), and PB API verified (Phase 3), this phase has no unknowns. Implement `/api/onboarding/route.ts` mirroring the existing `/api/signup/route.ts` pattern, implement `src/lib/practice-better.ts` with verified auth headers, wire up the form submission in `OnboardingForm.tsx`, add reCAPTCHA validation, and connect the Hero CTA.

**Delivers:** Working end-to-end onboarding flow — goal selection through Practice Better patient creation through Rupa Health link display. Auth cookie set correctly. Referral attribution. reCAPTCHA protection on the route.

**Uses:** `src/lib/practice-better.ts` (verified in Phase 3), Route Handler pattern from `signup/route.ts`, reCAPTCHA from existing setup.

**Implements:** Full integration between Payload, Practice Better, and the referral system.

**Avoids:** Pitfall 1 (non-blocking PB call with sync status), Pitfall 3 (correct cookie pattern), Pitfall 4 (duplicate email pre-check), Pitfall 6 (reCAPTCHA required).

### Phase Ordering Rationale

- Schema first because all application code references it and migrations in Payload require deliberate sequencing.
- UI second because it has zero external dependencies and generates immediate feedback on the user flow.
- PB spike gates the integration phase because the auth conflict is the one remaining unknown that could force a rewrite.
- Integration last because it has the most dependencies (schema, UI, verified API) and is the highest-risk phase.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Practice Better Spike):** Credentials required to verify auth scheme, field names, and invite email behavior. Cannot be researched without live API access. Flag as a gate: integration phase cannot begin until spike is complete and documented.
- **Phase 4 (Rupa Health URL):** Rupa Health is migrating to Fullscript throughout 2026. The store URL source (env variable vs Payload global vs Rupa account) needs a decision before the confirmation screen is built. Low effort to resolve, but must be decided.

Phases with standard patterns (no additional research needed):
- **Phase 1 (Schema):** Payload collection field additions and migrations are well-documented; exact syntax is in ARCHITECTURE.md.
- **Phase 2 (UI):** Multi-step form with `useReducer` + sessionStorage is a well-established pattern; code skeleton is in ARCHITECTURE.md.
- **Phase 4 (API Route):** The `/api/signup/route.ts` is the direct template; integration pattern is confirmed.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Three packages with verified npm versions; Zod v3 pinning rationale documented with issue number; all alternatives considered and rejected with reasoning |
| Features | HIGH | UX patterns confirmed from competitor analysis and telehealth UX research; all features are low complexity and mapped to existing codebase patterns |
| Architecture | HIGH | Based primarily on the existing codebase, which is the most reliable source. Component boundaries, file paths, and build order are specific and validated against the codebase structure |
| Pitfalls | MEDIUM | Core Next.js/Payload pitfalls are HIGH confidence from official docs and open GitHub issues. Practice Better-specific pitfalls are MEDIUM — inferred from the auth scheme conflict and beta status, not from hands-on testing |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Practice Better auth scheme:** Two sources conflict (HMAC-SHA256 vs OAuth2 Bearer). Must be resolved in Phase 3 spike before writing `src/lib/practice-better.ts`. Do not build against either assumption.
- **Practice Better required field names:** The Swagger content was truncated and could not be fully read. Fields `first_name`, `last_name`, `email`, `phone`, `date_of_birth` are inferred with MEDIUM confidence. Verify in spike.
- **Practice Better invite email behavior:** Unknown whether `POST /clients` triggers an email to the patient. If it does, this conflicts with the onboarding confirmation email and must be suppressed or coordinated. Verify in spike.
- **Rupa Health / Fullscript URL:** Rupa is migrating to Fullscript in 2026. The practice's current store URL source must be confirmed before the confirmation screen displays it. Store as env variable in the interim.
- **Practice Better API endpoint path conflict:** STACK.md references `POST /consultant/records` while ARCHITECTURE.md references `POST /v2/clients`. These may reflect different API versions or different endpoint structures. Resolve in spike.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase (`src/app/api/signup/route.ts`, `src/collections/Clients.ts`, `src/app/(frontend)/signup/client/page.tsx`, `.planning/codebase/CONCERNS.md`) — auth patterns, referral logic, Payload collection structure
- `https://www.npmjs.com/package/react-hook-form` — v7.72.1 current
- `https://www.npmjs.com/package/zod` — v4 is now default; v3 remains maintained at `^3.24.x`
- `https://github.com/colinhacks/zod/issues/4923` — Zod v4 breaking changes on minor upgrade
- `https://github.com/payloadcms/payload/issues/14656` — Server Actions cookie auth loss in Cloudflare / certain environments

### Secondary (MEDIUM confidence)
- `https://api-docs.practicebetter.io/swagger.json` — OAuth2 client credentials flow, base URL, rate limits (content truncated)
- `https://rollout.com/integration-guides/practice-better/` — HMAC-SHA256 auth pattern (conflicts with OAuth2 source; needs resolution)
- `https://help.practicebetter.io/hc/en-us/articles/16637584053275` — Practice Better API Getting Started (Beta)
- `https://ata-nexus.org/telehealth-ui-ux-how-to-create-the-best-patient-experience-for-virtual-care/` — Telehealth UX patterns
- `https://www.webstacks.com/blog/multi-step-form` — Multi-step form best practices

### Tertiary (LOW confidence — needs validation)
- Practice Better `ClientRecordCreateFragment` exact field names — inferred from Swagger endpoint list (truncated) and Practice Better UI; verify against live docs with credentials
- Rupa Health store URL status — Rupa migrating to Fullscript in 2026; current URL for the practice must be confirmed directly

---

*Research completed: 2026-04-03*
*Ready for roadmap: yes — Phase 3 (PB spike) must gate Phase 4 in the roadmap*
