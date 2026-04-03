---
phase: 2
slug: onboarding-form-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.3 + @testing-library/react 16.3.0 |
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
| 2-01-01 | 01 | 1 | ONBRD-01 | component | `grep 'get-started' src/components/sections/Hero.tsx` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | ONBRD-02 | component | `pnpm test:int` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 1 | ONBRD-03 | component | `pnpm test:int` | ❌ W0 | ⬜ pending |
| 2-01-04 | 01 | 1 | ONBRD-04 | component | `pnpm test:int` | ❌ W0 | ⬜ pending |
| 2-01-05 | 01 | 1 | ONBRD-05..10 | visual | manual mobile check | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for onboarding form components
- [ ] @testing-library/user-event may need installation for interaction tests

*Test infrastructure exists; component test files need creation during execution.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile responsiveness | ONBRD-10 | Visual layout check | Open /get-started on mobile viewport, verify all steps usable |
| Progress indicator visual | ONBRD-05 | Visual design check | Verify step indicators show current/completed/upcoming states |
| Loading state animation | ONBRD-08 | Visual timing check | Submit form, verify spinner/disabled state appears |
| Success screen content | ONBRD-09 | Content review | Verify success message and next steps are clear |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
