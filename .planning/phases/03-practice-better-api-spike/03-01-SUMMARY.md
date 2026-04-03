---
phase: 03-practice-better-api-spike
plan: 01
subsystem: api
tags: [practice-better, oauth2, spike, api-integration]

# Dependency graph
requires: []
provides:
  - "scripts/pb-spike.ts — runnable spike script for live PB API verification"
  - ".env.example updated with PRACTICE_BETTER_CLIENT_ID and PRACTICE_BETTER_CLIENT_SECRET"
affects: [03-02-practice-better-library]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Spike script pattern: standalone npx tsx script for live API verification before library implementation"

key-files:
  created:
    - scripts/pb-spike.ts
  modified:
    - .env.example

key-decisions:
  - "Spike script uses OAuth2 Client Credentials (grant_type=client_credentials) per Swagger spec — not HMAC-SHA256 from third-party guides"
  - "Script logs full response bodies to capture exact field names and token shape for Plan 02"

patterns-established:
  - "Spike-before-library: verify live API behavior with a throwaway script before writing the production module"

requirements-completed:
  - INTEG-05

# Metrics
duration: CHECKPOINT — awaiting human verification
completed: PENDING
---

# Phase 03 Plan 01: Practice Better API Spike Script Summary

**OAuth2 spike script at scripts/pb-spike.ts that tests token fetch and patient creation against live Practice Better API, logging all response shapes for library implementation**

## Status

CHECKPOINT REACHED — Task 2 requires human execution of the spike script.
Plan will be finalized after user runs the script and reports findings.

## Performance

- **Duration:** In progress (checkpoint at Task 2)
- **Started:** 2026-04-03
- **Completed:** PENDING
- **Tasks completed:** 1 of 2
- **Files modified:** 2

## Accomplishments

- Created `scripts/pb-spike.ts` — standalone spike script that tests OAuth2 token fetch and patient creation
- Script logs full response bodies for both requests to capture exact field names
- Script prints formatted `=== SPIKE FINDINGS ===` summary with token status, ID field detection, and invite email reminder
- Updated `.env.example` with Practice Better credential placeholders

## Task Commits

1. **Task 1: Create spike script and update env vars** - `836dd3a` (feat)
2. **Task 2: Run spike script** - PENDING (human checkpoint)

## Files Created/Modified

- `scripts/pb-spike.ts` — Spike script that tests OAuth2 + patient creation against live PB API
- `.env.example` — Added `PRACTICE_BETTER_CLIENT_ID` and `PRACTICE_BETTER_CLIENT_SECRET` placeholders

## Decisions Made

- OAuth2 Client Credentials is the correct auth scheme per Swagger spec (not HMAC-SHA256 from third-party PHP guide)
- Script checks multiple candidate ID field names (`id`, `_id`, `client_id`, `record_id`) since exact name is unknown until live test
- Script provides fallback advice for `api_key`/`api_secret` field names in case `client_id`/`client_secret` are rejected

## Deviations from Plan

None — plan executed exactly as written for Task 1.

## Spike Findings (PENDING)

These will be filled in after the user runs the spike script:

- **Token response fields:** TBD
- **expires_in value:** TBD
- **Patient creation HTTP status:** TBD
- **Patient creation response body / ID field name:** TBD
- **Invite email sent:** TBD (yes/no)

## Next Phase Readiness

- Blocked: Plan 02 (`src/lib/practice-better.ts`) requires the spike findings above before exact field names are known
- Once user reports spike output, Plan 02 can proceed with confirmed field names

---
*Phase: 03-practice-better-api-spike*
*Completed: PENDING (checkpoint)*
