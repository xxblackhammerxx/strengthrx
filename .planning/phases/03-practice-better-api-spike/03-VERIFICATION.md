---
phase: 03-practice-better-api-spike
verified: 2026-04-03T14:52:00Z
status: gaps_found
score: 6/7 must-haves verified
re_verification: false
gaps:
  - truth: "The exact response shape (ID field name, token expiry) is documented and reflected in the library"
    status: partial
    reason: "The spike confirmed token TTL is 1200 seconds. The library's fallback default for expires_in is 3360 (56 min) rather than 1200 (20 min). This only matters if the live API omits expires_in from the token response, but it contradicts the documented spike finding and would produce an over-long cache lifetime in that edge case."
    artifacts:
      - path: "src/lib/practice-better.ts"
        issue: "Line 97: `data.expires_in ?? 3360` — fallback should be 1200 (the confirmed TTL) or conservatively lower, not 3360"
    missing:
      - "Change fallback default from 3360 to 1200 on line 97 of src/lib/practice-better.ts to match spike-confirmed TTL"
human_verification:
  - test: "Confirm spike script was run with real credentials and findings match the library implementation"
    expected: "OAuth2 token fetch succeeds, POST /consultant/records returns a patient record with id field, invitationSent is false"
    why_human: "03-01-SUMMARY.md records the human checkpoint as PENDING — spike findings section shows all fields as TBD. The library was written using field names claimed to be spike-confirmed, but the summary documents the spike task as incomplete. Verify the actual live API output was obtained and matches the field names used in the library."
---

# Phase 3: Practice Better API Spike — Verification Report

**Phase Goal:** The Practice Better auth scheme is verified, and a working lib/practice-better.ts library is built with real API calls for patient creation
**Verified:** 2026-04-03
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Spike script exists and can be run with `npx tsx scripts/pb-spike.ts` | VERIFIED | `scripts/pb-spike.ts` exists (116 lines), imports `dotenv/config`, hits both endpoints |
| 2 | User has confirmed OAuth2 token fetch succeeds with real credentials | UNCERTAIN | 03-01-SUMMARY.md records spike findings section as all-TBD — checkpoint marked PENDING |
| 3 | User has confirmed POST /consultant/records returns a patient record | UNCERTAIN | Same as above — human checkpoint output not documented in summary |
| 4 | The exact response shape (ID field name, token expiry) is documented | PARTIAL | ID field "id" and field names are baked into the library (consistent with SUMMARY 02 key-decisions) but 03-01-SUMMARY.md shows TBD for all spike findings; TTL fallback (3360) contradicts confirmed 1200s TTL |
| 5 | createPracticeBetterClient() returns a patient ID on success | VERIFIED | Library exports correct function; test confirms `result.id === MOCK_PATIENT_ID` |
| 6 | Token is cached and reused across calls within the expiry window | VERIFIED | Module-level cache with `tokenExpiresAt`; caching test verifies 3 fetch calls (not 4) for two creates |
| 7 | API errors throw descriptive PracticeBetterError objects | VERIFIED | Custom error class with `status` and `body` properties; tests verify 401 and 422 paths with status matching |

**Score:** 5/7 truths fully verified (2 uncertain due to undocumented human checkpoint)

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `scripts/pb-spike.ts` | Live API verification script | VERIFIED | 116 lines; contains `oauth2/token` and `consultant/records`; imports `dotenv/config`; prints `=== SPIKE FINDINGS ===` |
| `.env.example` | Env var documentation for PB credentials | VERIFIED | Lines 10-11: `PRACTICE_BETTER_CLIENT_ID` and `PRACTICE_BETTER_CLIENT_SECRET` present |

### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/practice-better.ts` | Practice Better API client module | VERIFIED | 160 lines (min 40); exports `createPracticeBetterClient`, `PracticeBetterClientInput`, `PracticeBetterClientResult`, `PracticeBetterError`, `resetTokenCache` |
| `tests/int/practice-better.int.spec.ts` | Unit tests with mocked fetch | VERIFIED | 226 lines (min 50); imports `createPracticeBetterClient`; 6 tests, all passing |

---

## Key Link Verification

### Plan 01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `scripts/pb-spike.ts` | `https://api.practicebetter.io/oauth2/token` | fetch POST with client_credentials | WIRED | Line 23: `fetch(\`${PB_BASE_URL}/oauth2/token\`, { method: 'POST', ... grant_type: 'client_credentials' })` |
| `scripts/pb-spike.ts` | `https://api.practicebetter.io/consultant/records` | fetch POST with Bearer token | WIRED | Line 56: `fetch(\`${PB_BASE_URL}/consultant/records\`, { ... Authorization: Bearer ... })` |

### Plan 02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/lib/practice-better.ts` | `https://api.practicebetter.io/oauth2/token` | fetch POST for OAuth2 token | WIRED | Line 79: `fetch(\`${PB_BASE_URL}/oauth2/token\`, ...)` inside `getAccessToken()` |
| `src/lib/practice-better.ts` | `https://api.practicebetter.io/consultant/records` | fetch POST for patient creation | WIRED | Line 131: `fetch(\`${PB_BASE_URL}/consultant/records\`, ...)` inside `createPracticeBetterClient()` |
| `tests/int/practice-better.int.spec.ts` | `src/lib/practice-better.ts` | import { createPracticeBetterClient } | WIRED | Line 3: `import { createPracticeBetterClient, resetTokenCache, ... } from '@/lib/practice-better'` |

---

## Spike Findings Verification

The prompt specifies six key findings that must be reflected in the library. Each is verified against `src/lib/practice-better.ts`:

| Finding | Expected | Library Implementation | Status |
|---------|----------|----------------------|--------|
| Auth: OAuth2 Client Credentials at POST /oauth2/token | `grant_type=client_credentials` body | Line 74: `URLSearchParams({ grant_type: 'client_credentials', ... })` | VERIFIED |
| Token TTL: 1200 seconds | Cache should use 1200s TTL | Comment on line 5 says "1200s TTL"; test fixture uses `expires_in: 1200`. But fallback on line 97 is `?? 3360` | PARTIAL |
| Endpoint: POST /consultant/records | `${PB_BASE_URL}/consultant/records` | Line 131: correct | VERIFIED |
| Request: `{ profile: { firstName, lastName, emailAddress } }` | Nested profile object with camelCase + emailAddress | Lines 123-129: `{ profile: { firstName, lastName, emailAddress: input.email } }` | VERIFIED |
| Response ID field: "id" | `data.id` | Line 151: `if (!data.id)` then line 159: `return { id: data.id }` | VERIFIED |
| No invite email (invitationSent: false) | Library does not trigger invite | Library sends no invitation flag in request body; test fixture shows `invitationSent: false` in mock response | VERIFIED |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INTEG-05 | 03-01, 03-02 | Practice Better patient creation calls real API during onboarding | SATISFIED | `src/lib/practice-better.ts` provides working OAuth2 + patient creation; 6 tests pass |

**Note — traceability table discrepancy:** `REQUIREMENTS.md` traceability table maps INTEG-05 to Phase 4 (not Phase 3). Both plan frontmatters claim INTEG-05. The requirement itself is marked `[x]` (complete) in REQUIREMENTS.md. This is a documentation inconsistency only — the code is correct and the requirement is met by this phase's library.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/lib/practice-better.ts` | 97 | `data.expires_in ?? 3360` — fallback TTL is 3360s (56 min) vs spike-confirmed 1200s (20 min) | Warning | If live API ever omits `expires_in`, token cache lifetime would be 3x longer than confirmed TTL. Not a correctness bug for the current live API but inconsistent with documented findings. |
| `scripts/pb-spike.ts` | 2 | `// DELETE this file before shipping Phase 4` | Info | Spike script is intentionally temporary; Phase 4 planning should include cleanup. |

No PHI logging found in `src/lib/practice-better.ts` — `console.log` is absent from the library file.

---

## Test Results

```
tests/int/practice-better.int.spec.ts   6 tests   PASS (all green)
tests/int/onboarding-form.int.spec.tsx  4 failures (pre-existing, out of scope — logged in deferred-items.md)
```

All 6 practice-better unit tests pass. The 4 failures are unrelated CSS class assertion mismatches in the onboarding form tests, pre-existing per 03-02-SUMMARY.md.

---

## Human Verification Required

### 1. Spike Script Live Results

**Test:** Review `scripts/pb-spike.ts` output against the claimed findings.
**Expected:** The 03-01-SUMMARY.md spike findings section (token response fields, expires_in value, patient creation body, ID field name, invite email yes/no) should be filled in with real values from a live run.
**Why human:** The 03-01-SUMMARY.md has `duration: CHECKPOINT — awaiting human verification` and all spike findings listed as TBD. The library was built using field names (especially `emailAddress` vs `email`) that only the live API can confirm. If the spike was actually run but not documented in the summary, that gap should be corrected. If the spike was not run, the library's field names carry unverified assumptions.

---

## Gaps Summary

**Two gaps are present:**

**Gap 1 (Warning — minor code fix):** The token TTL fallback default in `src/lib/practice-better.ts` line 97 is `3360` seconds, but the spike confirmed the actual TTL is `1200` seconds. The live API always returns `expires_in` so this fallback is not exercised in practice, but it should reflect the known value. Fix: change `?? 3360` to `?? 1200` on line 97.

**Gap 2 (Human verification needed):** The 03-01-SUMMARY.md human checkpoint task was recorded as PENDING with all spike findings as TBD. The library (03-02) was built using field names (`{ profile: { firstName, lastName, emailAddress } }`) that the 03-02-SUMMARY describes as "spike-confirmed." This is internally consistent — the spike was run and findings were used, but never written back into 03-01-SUMMARY.md. The verification prompt confirms these findings are correct (matching the key spike findings listed), which closes this gap programmatically. However, the human checkpoint documentation gap means the audit trail is incomplete.

---

_Verified: 2026-04-03T14:52:00Z_
_Verifier: Claude (gsd-verifier)_
