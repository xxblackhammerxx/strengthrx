---
phase: 03-practice-better-api-spike
plan: 02
subsystem: api
tags: [practice-better, oauth2, token-caching, patient-creation, fetch, vitest, mocked-fetch]

# Dependency graph
requires:
  - phase: 03-practice-better-api-spike
    provides: "scripts/pb-spike.ts confirmed exact OAuth2 and patient creation field names"
provides:
  - "src/lib/practice-better.ts — production-ready Practice Better API client with OAuth2 token caching and patient creation"
  - "tests/int/practice-better.int.spec.ts — 6 unit tests with mocked fetch covering all paths"
affects:
  - 04-onboarding-route-handler

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "OAuth2 Client Credentials token cache pattern: module-level cache with safety-margin expiry check"
    - "vi.stubGlobal('fetch', mockFn) pattern for mocking global fetch in vitest"
    - "PracticeBetterError custom error class with status + body properties for typed API errors"

key-files:
  created:
    - src/lib/practice-better.ts
    - tests/int/practice-better.int.spec.ts
  modified: []

key-decisions:
  - "Request body uses { profile: { firstName, lastName, emailAddress } } — exact field names confirmed by spike (emailAddress not email)"
  - "Token cache safety margin is 60 seconds below expires_in (1200s TTL → 1140s effective)"
  - "resetTokenCache() exported for test isolation — not intended for production use"
  - "ID field is 'id' (MongoDB ObjectId string) as confirmed by spike, not '_id' or 'record_id'"

patterns-established:
  - "PracticeBetterError: custom Error subclass with status + body properties — use for all PB API failure paths"
  - "Module-level token cache: cachedToken + tokenExpiresAt guarded by Date.now() / 1000 comparison"
  - "TDD with vi.stubGlobal for fetch: mock each fetch call in sequence using mockResolvedValueOnce"

requirements-completed:
  - INTEG-05

# Metrics
duration: 12min
completed: 2026-04-03
---

# Phase 03 Plan 02: Practice Better Library Module Summary

**OAuth2 Client Credentials client library with 1140s token caching, patient creation via POST /consultant/records using spike-confirmed field names, and 6 unit tests with mocked fetch**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-03T14:40:00Z
- **Completed:** 2026-04-03T14:52:00Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files created:** 2

## Accomplishments

- Created `src/lib/practice-better.ts` with OAuth2 Client Credentials token fetch, 60s-safety-margin cache, and patient creation endpoint
- Request body uses spike-confirmed field names: `{ profile: { firstName, lastName, emailAddress } }` — not camelCase `email`
- `PracticeBetterError` custom error class carries `status` (number) and `body` (string) for typed error handling in Phase 4
- 6 unit tests pass with mocked fetch: success path, 401 token error, 422 create error, token caching (3 calls not 4), token expiry, error message content

## Task Commits

1. **Task 1 RED: failing tests** - `7dfaae1` (test)
2. **Task 1 GREEN: library implementation + test fix** - `be3b0c8` (feat)

## Files Created/Modified

- `src/lib/practice-better.ts` — OAuth2 Client Credentials client with token caching and patient creation
- `tests/int/practice-better.int.spec.ts` — 6 unit tests with mocked global fetch

## Decisions Made

- `emailAddress` (not `email`) is the correct field name in the `profile` object, per spike confirmation — critical to get right or patient creation silently creates records without email
- Token cache uses `Date.now() / 1000` (seconds) for comparison against `tokenExpiresAt` — consistent with `expires_in` in seconds from API response
- `resetTokenCache()` is exported purely for test isolation; Phase 4 should never call it in production code

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed double-call pattern in error test assertions**
- **Found during:** Task 1 GREEN (test run)
- **Issue:** Tests for 401 and 422 errors called `createPracticeBetterClient` twice in a single test (once for `.rejects.toThrow()` and once for `.rejects.toMatchObject()`) — second call consumed an undefined mock response causing TypeError
- **Fix:** Removed redundant `.rejects.toThrow()` assertion; single `.rejects.toMatchObject({ status: N })` covers both throw and status checks. Changed `mockResolvedValueOnce` to `mockResolvedValue` for 401 test to handle any re-fetch after cache reset.
- **Files modified:** `tests/int/practice-better.int.spec.ts`
- **Verification:** All 6 tests pass
- **Committed in:** `be3b0c8` (included in feat commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug in test mock setup)
**Impact on plan:** Minimal — test code fix only. Library implementation unchanged.

## Issues Encountered

Pre-existing test failures found in `tests/int/onboarding-form.int.spec.tsx` (4 tests): CSS class name mismatches between tests and current component implementation. Out of scope for this plan. Logged in `deferred-items.md`.

## Next Phase Readiness

- `src/lib/practice-better.ts` is ready for Phase 4 import: `import { createPracticeBetterClient } from '@/lib/practice-better'`
- Phase 4 calls: `const result = await createPracticeBetterClient({ firstName, lastName, email })` → `result.id` stored in `client.practiceBetterId`
- Error handling: catch `PracticeBetterError`, check `.status` and `.body` for retry logic
- Env vars `PRACTICE_BETTER_CLIENT_ID` and `PRACTICE_BETTER_CLIENT_SECRET` must be set in production `.env`

---
*Phase: 03-practice-better-api-spike*
*Completed: 2026-04-03*

## Self-Check: PASSED

- FOUND: src/lib/practice-better.ts
- FOUND: tests/int/practice-better.int.spec.ts
- FOUND: .planning/phases/03-practice-better-api-spike/03-02-SUMMARY.md
- FOUND: commit 7dfaae1 (test RED)
- FOUND: commit be3b0c8 (feat GREEN)
- FOUND: commit bbb3c75 (docs metadata)
