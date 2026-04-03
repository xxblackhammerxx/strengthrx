---
phase: 01-schema-and-foundation
plan: 01
subsystem: schema
tags: [payload, postgresql, migrations, form-libraries, schema]
dependency_graph:
  requires: []
  provides: [clients-onboarding-fields, form-libraries]
  affects: [02-onboarding-form-ui, 03-practice-better-spike, 04-api-and-admin]
tech_stack:
  added: [react-hook-form@7.72.1, zod@3.25.76, "@hookform/resolvers@5.2.2"]
  patterns: [payload-collection-fields, payload-migrations, drizzle-idempotent-migration]
key_files:
  created:
    - src/migrations/20260403_184248.ts
    - tests/int/clients-schema.int.spec.ts
  modified:
    - src/collections/Clients.ts
    - src/payload-types.ts
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Zod pinned to v3.x (not v4) — per project decision in STATE.md to avoid breaking changes"
  - "Migration written as incremental (not full-schema) using DO...EXCEPTION WHEN blocks to be idempotent"
  - "Database was in Payload dev-mode state (no prior migrations) — first migration bootstraps new fields only"
metrics:
  duration: 8 minutes
  completed: "2026-04-03"
  tasks_completed: 3
  files_changed: 6
---

# Phase 01 Plan 01: Schema and Foundation Summary

**One-liner:** Four onboarding fields (goals, labsStatus, practiceBetterId, practiceBetterSyncStatus) added to Clients collection with idempotent PostgreSQL migration, regenerated types, and form libraries installed at zod v3.

## What Was Built

Extended the Clients Payload collection with four fields required by downstream phases:

1. **`goals`** — `type: 'select'` with `hasMany: true`, 6 options (lose_weight, more_energy, less_burnout, build_muscle, sexual_wellness, other)
2. **`labsStatus`** — `type: 'select'`, yes/no options (note: distinct from existing `labStatus`)
3. **`practiceBetterId`** — `type: 'text'`, stores Practice Better patient ID after sync
4. **`practiceBetterSyncStatus`** — `type: 'select'`, pending/synced/failed with `defaultValue: 'pending'`

Migration `20260403_184248.ts` created and applied. Types regenerated. Form libraries installed for Phase 2.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Add onboarding fields + migrations | 6ca362d | src/collections/Clients.ts, src/migrations/20260403_184248.ts, src/payload-types.ts |
| 2 | Install form libraries | e37c44a | package.json, pnpm-lock.yaml |
| 3 | Integration tests (TDD) | e3570f9 | tests/int/clients-schema.int.spec.ts |

## Verification Results

All success criteria met:

- `grep` confirms all 4 field names in src/collections/Clients.ts
- `grep` confirms all 4 field names in src/payload-types.ts
- `grep '"zod"' package.json` returns `"^3.25.76"` (not v4)
- `node -e "require(...)"` exits 0 for all three packages
- `pnpm test:int` — 6 tests pass (5 new + 1 existing)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Migration needed to be incremental, not full-schema**

- **Found during:** Task 1
- **Issue:** `pnpm payload migrate:create` generated a full initial schema migration (including all existing tables) because the database was in Payload dev-mode state. Running this would fail with "type already exists" errors on pre-existing enums/tables.
- **Fix:** Rewrote the migration to only include the 4 new fields: CREATE TYPE with DO...EXCEPTION WHEN blocks for idempotency, CREATE TABLE IF NOT EXISTS for clients_goals, ALTER TABLE ADD COLUMN with DO...EXCEPTION WHEN blocks for the 3 scalar columns.
- **Files modified:** src/migrations/20260403_184248.ts
- **Commit:** 6ca362d

**2. [Rule 3 - Blocking] Worktree had no node_modules**

- **Found during:** Task 1 (initial `pnpm payload migrate:create` attempt)
- **Issue:** The git worktree did not have node_modules installed, causing `cross-env: command not found`.
- **Fix:** Symlinked main project's node_modules to the worktree. For package installation (Task 2), ran `pnpm add` from the main project directory and copied updated package.json/pnpm-lock.yaml to worktree.
- **Files modified:** node_modules (symlink), package.json, pnpm-lock.yaml

## Self-Check

Files verified:
- src/collections/Clients.ts — FOUND
- src/migrations/20260403_184248.ts — FOUND
- src/payload-types.ts — FOUND (contains all 4 field names)
- tests/int/clients-schema.int.spec.ts — FOUND
- package.json (react-hook-form, zod ^3, @hookform/resolvers) — FOUND

Commits verified:
- 6ca362d — FOUND
- e37c44a — FOUND
- e3570f9 — FOUND

## Self-Check: PASSED
