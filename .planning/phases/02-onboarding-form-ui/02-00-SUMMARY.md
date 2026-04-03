---
phase: 02-onboarding-form-ui
plan: "00"
subsystem: testing
tags: [vitest, playwright, testing-library, react-hook-form, zod, tdd]

requires:
  - phase: 01-db-schema-and-form-libs
    provides: "react-hook-form, zod, @hookform/resolvers installed; Clients collection with onboarding fields"

provides:
  - "Failing-first integration test scaffold for all onboarding UI components (ONBRD-02 through ONBRD-09)"
  - "Failing-first e2e test scaffold for /get-started page navigation and mobile responsiveness (ONBRD-01, ONBRD-10)"
  - "@testing-library/user-event installed as dev dependency"

affects:
  - 02-01-onboarding-components
  - 02-02-get-started-page

tech-stack:
  added:
    - "@testing-library/user-event@14.6.1 (dev)"
  patterns:
    - "TDD RED-GREEN: tests written before components to force failure, verified by Plans 01 and 02"
    - "FormWrapper helper pattern for providing react-hook-form context in unit tests"
    - "Playwright test.describe with viewport override for mobile responsiveness tests"

key-files:
  created:
    - tests/int/onboarding-form.int.spec.ts
    - tests/e2e/onboarding.e2e.spec.ts
  modified:
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Tests import real component paths (no mocks/stubs) to guarantee RED state until implementation exists"
  - "FormWrapper helper provides useForm context inline — avoids provider boilerplate per test"

patterns-established:
  - "Integration tests for form step components use FormWrapper to provide react-hook-form context"
  - "E2E mobile test sets viewport with page.setViewportSize() and checks scrollWidth vs innerWidth for overflow"

requirements-completed: [ONBRD-01, ONBRD-02, ONBRD-03, ONBRD-04, ONBRD-05, ONBRD-06, ONBRD-07, ONBRD-08, ONBRD-09, ONBRD-10]

duration: 6min
completed: 2026-04-03
---

# Phase 02 Plan 00: Onboarding Test Scaffolds Summary

**Failing-first TDD test harness for all 10 onboarding requirements using @testing-library/user-event and Playwright, with RED tests confirmed by missing component imports**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-03T13:20:36Z
- **Completed:** 2026-04-03T13:26:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Installed `@testing-library/user-event` as dev dependency (was missing from project)
- Created 10 failing integration tests covering StepGoals, StepLabs, StepContact, StepIndicator, and GetStartedForm components
- Created 3 failing e2e tests covering /get-started navigation and iPhone SE viewport responsiveness
- Confirmed RED state: `pnpm test:int` fails on missing module imports from `src/components/onboarding/` and `src/lib/schemas/onboarding`

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @testing-library/user-event and create integration test scaffold** - `08661bf` (test)
2. **Task 2: Create e2e test scaffold for page navigation and mobile** - `dafe72a` (test)

## Files Created/Modified
- `tests/int/onboarding-form.int.spec.ts` - 10 failing-first integration tests for ONBRD-02 through ONBRD-09
- `tests/e2e/onboarding.e2e.spec.ts` - 3 failing-first e2e tests for ONBRD-01 and ONBRD-10
- `package.json` - Added @testing-library/user-event@14.6.1 to devDependencies
- `pnpm-lock.yaml` - Updated lock file

## Decisions Made
- Tests import real component paths (no mocks/stubs) — this ensures the RED state is genuine: tests must fail because the implementation doesn't exist, not because of test harness issues
- Used a `FormWrapper` helper component inline in the test file to provide react-hook-form context to step components without a separate provider setup

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. `@testing-library/react` was already installed; only `user-event` was missing. Tests confirm RED state with esbuild transform errors on unresolvable module imports.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Integration test harness ready for Plans 01 and 02 to target with real implementations
- `pnpm test:int` can be used as the verification command in subsequent plans
- Plans 01 and 02 should turn these tests GREEN by creating `src/lib/schemas/onboarding.ts` and `src/components/onboarding/`

---
*Phase: 02-onboarding-form-ui*
*Completed: 2026-04-03*
