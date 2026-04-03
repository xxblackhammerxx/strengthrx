---
phase: 4
slug: api-route-and-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.3 |
| **Config file** | `vitest.config.mts` |
| **Quick run command** | `pnpm test:int` |
| **Full suite command** | `pnpm test:int` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test:int`
- **After every plan wave:** Run `pnpm test:int`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | INTEG-01..05 | integration | `pnpm test:int` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | POST-01 | grep | `grep 'rupaHealthStoreUrl' src/globals/SiteSettings.ts` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 2 | INTEG-06 | grep | `grep 'retry' src/app` | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Integration test stubs for onboarding API route

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Auto-login after submission | INTEG-02 | Requires browser cookie | Complete form, verify redirect to client portal logged in |
| Referral attribution with ?ref= | INTEG-03 | Requires referral code in URL | Navigate to /get-started?ref=VALIDCODE, complete form, verify referral created |
| reCAPTCHA rejection | INTEG-04 | Requires bypassing reCAPTCHA | Verify API returns 400 without valid reCAPTCHA token |
| PB sync status on failure | INTEG-05 | Requires PB API unavailability | Temporarily use invalid PB credentials, verify syncStatus = 'failed' |
| Admin retry UI | INTEG-06 | Requires admin login | Log in as admin, find failed sync client, click retry |
| Rupa Health link | POST-01 | Requires SiteSettings configured | Set URL in admin, complete form, verify link on success screen |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
