---
phase: 1
slug: schema-and-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 1 — Validation Strategy

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
| 1-01-01 | 01 | 1 | SCHMA-01 | schema | `pnpm generate:types && grep 'goals' src/payload-types.ts` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | SCHMA-02 | schema | `grep 'labsStatus' src/payload-types.ts` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | SCHMA-03 | schema | `grep 'practiceBetterId' src/payload-types.ts` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 1 | SCHMA-04 | schema | `grep 'practiceBetterSyncStatus' src/payload-types.ts` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | — | dependency | `node -e "require('react-hook-form')"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing test infrastructure covers schema verification via type generation
- [ ] No new test files needed — validation is via `pnpm generate:types` output and Payload admin inspection

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fields visible in Payload admin | SCHMA-01..04 | Requires running admin UI | Start dev server, navigate to /admin, create a client, verify all 4 new fields appear |
| Migration runs without error | SCHMA-01..04 | Database-dependent | Run `pnpm payload migrate` and verify no errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
