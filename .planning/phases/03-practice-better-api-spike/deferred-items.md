# Deferred Items — Phase 03

## Pre-existing Test Failures (Out of Scope)

Found during Plan 03-02 execution. These failures existed before this plan and are in unrelated files.

### `tests/int/onboarding-form.int.spec.tsx` — 4 failing tests

1. `StepGoals > toggles goal selection on click — card gets selected border class`
   - Expected class `border-border` not found on clicked card
2. `StepLabs > selects a labs option on click — card gets selected border class`
   - Expected class `border-border` not found on clicked card
3. `StepIndicator > highlights the active step with ring classes`
   - Expected class `ring-2` not found on active step element
4. `GetStartedForm > shows step 1 (goals) by default`
   - Test expects text `/what are your health goals/i` but rendered text is "What are you looking to achieve?"

These appear to be CSS class name mismatches between tests written against an older design and the current component implementation. Should be addressed in Phase 4 or as a standalone fix.
