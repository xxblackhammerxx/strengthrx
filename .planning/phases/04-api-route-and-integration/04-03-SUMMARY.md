---
phase: 04-api-route-and-integration
plan: 03
subsystem: api
tags: [payload, practice-better, admin-portal, retry, oauth2]

# Dependency graph
requires:
  - phase: 04-01
    provides: POST /api/onboarding route with PB integration and practiceBetterSyncStatus tracking
  - phase: 03-02
    provides: practice-better.ts library with createPracticeBetterClient
provides:
  - Admin-only POST /api/admin/retry-pb-sync endpoint for retrying failed PB syncs
  - FailedPbSyncClient interface and AdminPortalData.failedPbSyncs field in portal-types.ts
  - Admin portal UI section showing failed PB syncs with per-row retry buttons
affects: [admin-portal, practice-better, api-admin]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline payload.auth() check in Route Handlers (not getAuthenticatedAdmin which is for Server Components)"
    - "Optimistic UI updates for retry state: idle -> retrying -> success/error without page reload"
    - "Partial-success guard: if practiceBetterId already exists, skip PB creation and mark synced"

key-files:
  created:
    - src/app/api/admin/retry-pb-sync/route.ts
  modified:
    - src/lib/portal-types.ts
    - src/app/(portals)/admin-portal/page.tsx
    - src/app/(portals)/admin-portal/AdminPortalContent.tsx

key-decisions:
  - "Use inline payload.auth() in Route Handler instead of getAuthenticatedAdmin (designed for Server Components with next/headers)"
  - "Skip PB creation if practiceBetterId already exists — prevents duplicate records when sync partially succeeded"
  - "Optimistic per-row status (idle/retrying/success/error) avoids full page reload after retry"
  - "Section hidden when failedPbSyncs.length === 0 — no visual noise for admins when no failures exist"

patterns-established:
  - "Admin Route Handler auth: getPayload -> headers from nextHeaders() -> payload.auth({ headers }) -> check collection === 'admins'"
  - "FailedSyncRow as co-located client component handles its own retry state"

requirements-completed: [INTEG-06]

# Metrics
duration: 3min
completed: 2026-04-03
---

# Phase 04 Plan 03: Admin Retry PB Sync Summary

**Admin-only POST /api/admin/retry-pb-sync endpoint with duplicate-guard and optimistic retry UI in the admin portal**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-03T21:24:25Z
- **Completed:** 2026-04-03T21:27:12Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created POST /api/admin/retry-pb-sync with admin auth, status validation, and partial-success edge case handling
- Extended AdminPortalData type with failedPbSyncs and added parallel Payload query for failed sync clients
- Added FailedSyncRow component to admin portal with per-row optimistic retry UI (idle/retrying/success/error states)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create admin retry-pb-sync API route** - `63d0a36` (feat)
2. **Task 2: Add failed PB syncs section to admin portal** - `b9c1f06` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/app/api/admin/retry-pb-sync/route.ts` - Admin-only retry endpoint; authenticates via payload.auth, validates status, handles partial-success, calls createPracticeBetterClient
- `src/lib/portal-types.ts` - Added FailedPbSyncClient interface and failedPbSyncs field to AdminPortalData
- `src/app/(portals)/admin-portal/page.tsx` - Added parallel query for clients with practiceBetterSyncStatus=failed; maps to FailedPbSyncClient[]
- `src/app/(portals)/admin-portal/AdminPortalContent.tsx` - Added FailedSyncRow component and Failed Practice Better Syncs section (hidden when empty)

## Decisions Made
- Used inline `payload.auth({ headers })` in the Route Handler rather than `getAuthenticatedAdmin` — the helper calls `nextHeaders()` internally which is designed for Server Components; Route Handlers should get headers from `nextHeaders()` themselves for consistency with the rest of the API routes in this project
- Added partial-success guard: if `practiceBetterId` already exists on a failed-status client, skip PB creation and just mark synced — prevents creating duplicate PB records when a timeout caused the status to be set to failed but the PB call actually succeeded
- FailedSyncRow uses local component state for retry status so each row tracks independently without lifting state

## Deviations from Plan

None - plan executed exactly as written. The merge from main was needed to bring in `practice-better.ts` and other Phase 3/4 work that the worktree was missing.

## Issues Encountered
- Worktree was based on an older commit (2ef6423) before Phase 3 and 4 work existed — merged main to bring in `src/lib/practice-better.ts` and other dependencies before executing tasks.

## User Setup Required
None - no external service configuration required beyond what was set up in Phase 03.

## Next Phase Readiness
- Admin retry feature complete — INTEG-06 satisfied
- All three Phase 04 plans now complete: onboarding route (04-01), success screen redirect (04-02 via 7b4b86f), and admin retry (04-03)
- Phase 04 (api-route-and-integration) is done

---
*Phase: 04-api-route-and-integration*
*Completed: 2026-04-03*
