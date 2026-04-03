---
phase: 3
slug: practice-better-api-spike
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.3 |
| **Config file** | `vitest.config.mts` |
| **Quick run command** | `pnpm test:int` |
| **Full suite command** | `pnpm test:int` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test:int`
- **After every plan wave:** Run `pnpm test:int`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | INTEG-05 | integration | `grep 'createPatient' src/lib/practice-better.ts` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | INTEG-05 | spike | `npx tsx scripts/pb-spike.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Spike script to verify live API behavior before library implementation

*Spike script serves as Wave 0 verification — no separate test scaffolding needed for an API spike.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OAuth2 token retrieval | INTEG-05 | Requires live API credentials | Run spike script with real PB_CLIENT_ID and PB_CLIENT_SECRET |
| Patient creation response | INTEG-05 | Requires live API | Verify patient appears in Practice Better dashboard |
| Invite email behavior | INTEG-05 | Must observe email delivery | Check if test patient receives invite email |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
