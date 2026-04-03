---
phase: 04-api-route-and-integration
plan: "01"
subsystem: api
tags: [payload-cms, recaptcha, practice-better, oauth2, next.js]

# Dependency graph
requires:
  - phase: 03-practice-better-spike
    provides: createPracticeBetterClient() with OAuth2 token cache and confirmed field names
  - phase: 02-onboarding-form-ui
    provides: stub /api/onboarding route and onboarding form that POSTs to it
  - phase: 01-schema-and-foundation
    provides: Clients collection with goals, labsStatus, practiceBetterSyncStatus fields
provides:
  - Full POST /api/onboarding handler replacing stub
  - src/lib/recaptcha.ts reusable createAssessment(token, expectedAction) helper
  - dateOfBirth field made optional in Clients collection schema
affects:
  - 04-02 (admin retry UI will read practiceBetterSyncStatus set by this route)
  - 04-03 (success screen reads client portal post-login state set by auto-login cookie)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Fire-and-forget async pattern: build response first, trigger PB sync after, never await
    - Extracted shared reCAPTCHA module with expectedAction param for multi-form reuse
    - Auto-generated password via crypto.randomUUID() + immediate payload.login for seamless UX

key-files:
  created:
    - src/lib/recaptcha.ts
    - src/app/api/onboarding/route.ts (replaced stub)
  modified:
    - src/collections/Clients.ts
    - src/app/api/contact/route.ts

key-decisions:
  - "reCAPTCHA extracted to shared module with expectedAction param so contact and onboarding can reuse with different action strings"
  - "PB sync is fire-and-forget (not awaited) so client is not blocked by external API latency or failures"
  - "dateOfBirth made optional because onboarding flow does not collect it — existing signup/client flow can still provide it"

patterns-established:
  - "Fire-and-forget pattern: build NextResponse, fire .then/.catch chain, return response — user never waits for PB"
  - "Reusable reCAPTCHA helper: import createAssessment from @/lib/recaptcha, pass expectedAction string"
  - "Onboarding password: crypto.randomUUID() auto-generated, used immediately for payload.login, never exposed to client"

requirements-completed: [INTEG-01, INTEG-02, INTEG-03, INTEG-04, INTEG-05]

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 04 Plan 01: API Route and Integration Summary

**POST /api/onboarding with Payload client creation, auto-login cookie, referral attribution, and non-blocking Practice Better patient sync**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T21:17:43Z
- **Completed:** 2026-04-03T21:19:20Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Extracted reCAPTCHA logic from contact/route.ts into reusable `src/lib/recaptcha.ts` module with `createAssessment(token, expectedAction)` — now usable by any route with different action strings
- Made `dateOfBirth` optional in Clients schema to allow onboarding without it
- Replaced stub `/api/onboarding` with full handler: reCAPTCHA gate, Payload client creation (goals + labsStatus + auto-generated password), auto-login via httpOnly cookie, optional referral attribution, and fire-and-forget Practice Better sync updating `practiceBetterSyncStatus` to `synced` or `failed`

## Task Commits

Each task was committed atomically:

1. **Task 1: Make dateOfBirth optional and extract reCAPTCHA helper** - `3516de0` (feat)
2. **Task 2: Implement the /api/onboarding POST route** - `ed683aa` (feat)

## Files Created/Modified

- `src/lib/recaptcha.ts` - Shared reCAPTCHA Enterprise helper with cached client singleton and `createAssessment(token, expectedAction)`
- `src/app/api/onboarding/route.ts` - Full POST handler replacing stub; reCAPTCHA validation, Payload create + login, referral attribution, fire-and-forget PB sync
- `src/collections/Clients.ts` - Removed `required: true` from `dateOfBirth` field
- `src/app/api/contact/route.ts` - Updated to import `createAssessment` from `@/lib/recaptcha` with `'CONTACT_FORM'` action arg

## Decisions Made

- reCAPTCHA extracted to shared module with `expectedAction` param so contact and onboarding routes can reuse with different action strings without duplicating the Google client setup and scoring logic
- PB sync is fire-and-forget (not awaited) so the HTTP response is returned immediately — external API latency or failures do not block the user
- dateOfBirth made optional because the onboarding flow does not collect it; existing signup/client form can still provide it

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Worktree branch `worktree-agent-aa338b1a` was behind `main` at execution start (missing `practice-better.ts`, `onboarding/route.ts`, `.planning/` directory). Merged main fast-forward before executing. No conflicts.

## User Setup Required

None - no external service configuration required beyond what Phase 3 spike already established.

## Next Phase Readiness

- `/api/onboarding` is fully operational and ready for the frontend form to POST to it
- `practiceBetterSyncStatus` is set to `pending` on create and updated to `synced`/`failed` async — Phase 04-02 admin retry UI can read this field
- Auto-login cookie is set on successful registration — client portal is immediately accessible post-onboarding

---
*Phase: 04-api-route-and-integration*
*Completed: 2026-04-03*
