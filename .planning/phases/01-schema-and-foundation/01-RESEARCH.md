# Phase 1: Schema and Foundation - Research

**Researched:** 2026-04-03
**Domain:** Payload CMS 3 collection fields, migrations, and form library installation
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCHMA-01 | Clients collection stores selected health goals (multi-select field) | Payload `select` field with `hasMany: true` maps directly to PostgreSQL array column; `pnpm payload migrate:create` generates the migration |
| SCHMA-02 | Clients collection stores labs status | New `labsStatus` `select` field (single-value) alongside the existing `labStatus` operational field |
| SCHMA-03 | Clients collection stores Practice Better patient ID | New `practiceBetterId` `text` field |
| SCHMA-04 | Clients collection stores Practice Better sync status | New `practiceBetterSyncStatus` `select` field with `synced` / `failed` / `pending` values |
</phase_requirements>

---

## Summary

Phase 1 is a pure schema-extension and dependency-installation phase — no new pages, no UI beyond what Payload admin generates automatically. The Clients collection in `src/collections/Clients.ts` needs four new fields added to its `fields` array. Payload CMS 3 with `@payloadcms/db-postgres` handles the database side: once fields are added to the collection config, running `pnpm payload migrate:create` generates a Drizzle migration file, and `pnpm payload migrate` applies it. `pnpm generate:types` then regenerates `src/payload-types.ts` to match.

The three form libraries — `react-hook-form`, `zod` (pinned to v3), and `@hookform/resolvers` — are absent from `package.json` right now and must be installed with `pnpm`. They are consumed by Phase 2 but must be present and importable as a Phase 1 success criterion.

The only naming subtlety to watch: the Clients collection already has a field called `labStatus` (an operational status tracking lab orders). The new field required by SCHMA-02 captures the onboarding question "have you had labs in the last 30 days?" and must be named distinctly — `labsStatus` is the name agreed in the roadmap success criteria and avoids collision.

**Primary recommendation:** Add four fields to `src/collections/Clients.ts`, run the Payload migration commands in sequence, then install the three form packages.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| payload | 3.61.1 | CMS framework, collection definitions, migration runner | Already installed; this is the version in use |
| @payloadcms/db-postgres | 3.61.1 | PostgreSQL adapter (Drizzle under the hood) | Already installed; generates SQL migrations from collection config |
| react-hook-form | ^7.x (latest stable) | Form state management for multi-step form | Standard choice for React; lightweight, uncontrolled, composable |
| zod | 3.x (pinned — do NOT upgrade to v4) | Schema validation | Project decision locks this to v3; v4 has breaking changes (issue #4923) |
| @hookform/resolvers | ^3.x | Bridge between react-hook-form and zod | Official resolver package; required for `zodResolver()` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| typescript | 5.7.3 | Already installed | Types regenerated after schema change |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `select` with `hasMany` | `array` field | `array` adds a join table and is for complex objects; `select + hasMany` is correct for a flat list of string values |
| `select` for labsStatus | `checkbox` (boolean) | `select` is more explicit and extensible; a boolean can't capture "unsure" if needed later |

### Installation
```bash
pnpm add react-hook-form zod@^3 @hookform/resolvers
```

---

## Architecture Patterns

### Recommended Project Structure
No new directories required for Phase 1. All changes are within existing files:

```
src/
├── collections/
│   └── Clients.ts          # Add 4 new fields here
└── payload-types.ts        # Regenerated — do not edit manually
```

### Pattern 1: Payload `select` Field with `hasMany` for Multi-Value Goals
**What:** A `select` field with `hasMany: true` stores an array of string values in PostgreSQL. In the Payload admin UI it renders as a multi-select/checkbox widget.
**When to use:** Flat list of predefined string options where multiple selections are valid — exactly the goals use case.

```typescript
// Source: Payload CMS 3 official field docs
{
  name: 'goals',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'More Energy', value: 'more_energy' },
    { label: 'Less Burnout', value: 'less_burnout' },
    { label: 'Build Muscle', value: 'build_muscle' },
    { label: 'Improve Sexual Wellness', value: 'sexual_wellness' },
    { label: 'Other', value: 'other' },
  ],
  admin: {
    description: 'Health goals selected during onboarding',
  },
},
```

### Pattern 2: Single-Value `select` for labsStatus
**What:** A standard `select` field (no `hasMany`) capturing the onboarding labs question response.
**When to use:** The answer is exactly one of a predefined set.

```typescript
{
  name: 'labsStatus',
  type: 'select',
  options: [
    { label: 'Yes — labs done in last 30 days', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
  admin: {
    description: 'Whether client has had full labs in the last 30 days (onboarding question)',
  },
},
```

### Pattern 3: Practice Better Integration Fields
**What:** Two fields supporting Phase 4 PB sync — a text ID store and a status tracker.

```typescript
{
  name: 'practiceBetterId',
  type: 'text',
  admin: {
    description: 'Practice Better patient ID — set after successful sync',
  },
},
{
  name: 'practiceBetterSyncStatus',
  type: 'select',
  defaultValue: 'pending',
  options: [
    { label: 'Pending', value: 'pending' },
    { label: 'Synced', value: 'synced' },
    { label: 'Failed', value: 'failed' },
  ],
  admin: {
    description: 'Sync status with Practice Better — admin can retry on failure',
  },
},
```

### Pattern 4: Payload Migration Workflow
**What:** The standard sequence after changing any collection field.
**When to use:** Every time the collection config changes — required before running the app or tests.

```bash
# 1. Create migration file from schema diff
pnpm payload migrate:create

# 2. Apply migration to the database
pnpm payload migrate

# 3. Regenerate TypeScript types
pnpm generate:types
```

The migration file is written to a `migrations/` directory at the project root (or src-level, Payload detects the location). Confirm the file was created and review it before applying.

### Anti-Patterns to Avoid
- **Editing `payload-types.ts` manually:** It is auto-generated — changes are overwritten on next `generate:types`.
- **Skipping the migration step:** Adding fields to the collection config without running migrations causes runtime errors when Payload tries to query columns that don't exist in the database.
- **Using `array` field for goals:** An `array` field creates a separate join table and is designed for complex sub-objects. For a flat list of string values, `select + hasMany: true` is the correct Payload primitive.
- **Naming the new labs field `labStatus`:** The Clients collection already has a `labStatus` field (operational lab tracking). The new onboarding field must be `labsStatus` (note the 's') to avoid collision.
- **Installing zod v4:** The project has an explicit decision locking zod to v3 (STATE.md decision log). `pnpm add zod@^3` not `pnpm add zod`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-value field storage | Custom array serialization | `select` with `hasMany: true` | Payload + Drizzle handle the PostgreSQL array column, querying, and admin UI automatically |
| Database schema sync | Manual SQL `ALTER TABLE` | `pnpm payload migrate:create && pnpm payload migrate` | Payload generates type-safe Drizzle migration from the config diff |
| TypeScript types for new fields | Manually extending `Client` interface | `pnpm generate:types` | Auto-generates from live config; manual edits are immediately overwritten |

---

## Common Pitfalls

### Pitfall 1: `labStatus` vs `labsStatus` Naming Collision
**What goes wrong:** Adding a field named `labStatus` when one already exists silently replaces the existing field definition or causes a type collision.
**Why it happens:** Easy to copy-paste the existing field name.
**How to avoid:** The new onboarding field must be named `labsStatus` — matches roadmap success criteria and avoids collision.
**Warning signs:** TypeScript type errors in payload-types.ts showing duplicate property names, or unexpected admin UI behavior.

### Pitfall 2: Migration Not Run After Collection Change
**What goes wrong:** Dev server starts, appears to work, then crashes on any query touching the new columns with a "column does not exist" database error.
**Why it happens:** The collection config and the database schema are out of sync.
**How to avoid:** Always run `pnpm payload migrate:create` then `pnpm payload migrate` immediately after adding fields.
**Warning signs:** Payload startup logs warning about pending migrations; database errors on collection queries.

### Pitfall 3: Types Not Regenerated
**What goes wrong:** TypeScript compilation passes but runtime behavior is wrong; IDE auto-complete shows old field list; Phase 2 code referencing the new fields fails type-checking.
**Why it happens:** `payload-types.ts` is stale after a schema change.
**How to avoid:** Run `pnpm generate:types` as the last step in the schema workflow.
**Warning signs:** The `Client` interface in `payload-types.ts` does not include `goals`, `labsStatus`, `practiceBetterId`, or `practiceBetterSyncStatus`.

### Pitfall 4: Zod v4 Installation
**What goes wrong:** `@hookform/resolvers` version mismatch, breaking type errors from changed Zod API surface.
**Why it happens:** `pnpm add zod` without a version pin installs v4 (latest as of 2026).
**How to avoid:** `pnpm add zod@^3` — explicit v3 range.
**Warning signs:** `pnpm add zod` installs 4.x; check `package.json` after install.

---

## Code Examples

### Verified: Payload `select` Field Type Signature
```typescript
// Source: Payload CMS 3 field types — SelectField interface
import type { SelectField } from 'payload'

const field: SelectField = {
  name: 'goals',
  type: 'select',
  hasMany: true,         // enables array storage, multi-select UI
  options: [
    { label: 'Display Label', value: 'stored_value' },
  ],
}
```

### Verified: Payload Migration Commands (pnpm)
```bash
# From project root
pnpm payload migrate:create   # reads payload.config.ts, diffs against DB, writes migration file
pnpm payload migrate          # applies pending migration files
pnpm generate:types           # regenerates src/payload-types.ts
```

### Verified: Correct Install for Zod v3
```bash
pnpm add react-hook-form zod@^3 @hookform/resolvers
```

### Verified: Import Check (all three libraries must resolve after install)
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Payload 2 `migrate` via `payload migrate` CLI | Payload 3 same CLI but via `pnpm payload migrate` | Payload 3 launch | Same command, invoked through pnpm scripts |
| Manual SQL migrations | Drizzle-generated migrations from collection config diff | Payload 3 + db-postgres | No raw SQL needed |

**Deprecated/outdated:**
- Zod v4 API: `z.string().email()` and other validators changed in v4 — project is locked to v3, do not reference v4 docs.

---

## Open Questions

1. **Goal option values — final list**
   - What we know: Requirements say "lose weight, more energy, less burnout, etc." — the "etc." is undefined.
   - What's unclear: The exact option set is not specified in requirements.
   - Recommendation: Use the values implied by the requirements (`lose_weight`, `more_energy`, `less_burnout`) plus reasonable additions (`build_muscle`, `sexual_wellness`, `other`). The planner can add a task note flagging this for product confirmation before Phase 2 ships the UI labels.

2. **`labsStatus` default value**
   - What we know: No default specified in requirements.
   - What's unclear: Whether a non-answer (user skips or field is not yet set) should default to `null` or `'no'`.
   - Recommendation: Leave `defaultValue` unset (field is `null` until onboarding populates it) — this clearly distinguishes "not yet asked" from "asked and answered no".

3. **Migration directory location**
   - What we know: Payload 3 with `@payloadcms/db-postgres` writes migrations to a configurable path; default is typically `src/migrations/` or project-root `migrations/`.
   - What's unclear: No migrations directory exists yet in this project — the first `migrate:create` will create it.
   - Recommendation: Accept the Payload default; verify the created path after running `migrate:create` and document it for the team.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.3 |
| Config file | `vitest.config.mts` |
| Quick run command | `pnpm test:int` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCHMA-01 | `goals` field exists on Client, accepts array of strings | unit/integration | `pnpm test:int` | Wave 0 — new test needed |
| SCHMA-02 | `labsStatus` field exists on Client, accepts `yes`/`no` | unit/integration | `pnpm test:int` | Wave 0 — new test needed |
| SCHMA-03 | `practiceBetterId` field exists on Client, stores text | unit/integration | `pnpm test:int` | Wave 0 — new test needed |
| SCHMA-04 | `practiceBetterSyncStatus` field exists, accepts `synced`/`failed`/`pending` | unit/integration | `pnpm test:int` | Wave 0 — new test needed |

### Sampling Rate
- **Per task commit:** `pnpm test:int`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/int/clients-schema.int.spec.ts` — Vitest integration tests verifying new fields are present and writable on the `clients` collection via the Payload local API. Covers SCHMA-01 through SCHMA-04.

The existing `tests/int/api.int.spec.ts` only exercises `users`. A new spec file is needed; the existing file provides the exact pattern to follow (import `getPayload`, initialize in `beforeAll`, call `payload.create` / `payload.findByID`).

---

## Sources

### Primary (HIGH confidence)
- Payload CMS 3 collection config + field types — verified against installed source at `node_modules/payload` version 3.61.1
- `src/collections/Clients.ts` — read directly; field names, existing types, and current state confirmed
- `package.json` — confirmed react-hook-form, zod, @hookform/resolvers are NOT currently installed
- `src/payload-types.ts` — confirmed `Client` interface does not yet include goals/labsStatus/practiceBetterId/practiceBetterSyncStatus fields
- `.planning/STATE.md` — confirmed zod pinned to v3 decision

### Secondary (MEDIUM confidence)
- Payload 3 migration workflow (`migrate:create` → `migrate` → `generate:types`) — consistent with Payload 3.x documentation pattern and matches existing `pnpm` script setup in `package.json`

### Tertiary (LOW confidence)
- Final goal option list — inferred from requirements prose; not formally specified

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — package.json and installed node_modules verified directly
- Architecture (field patterns): HIGH — Payload source code and existing collection patterns confirmed
- Migration workflow: HIGH — matches `package.json` scripts and Payload 3 CLI conventions
- Goal option values: LOW — "etc." in requirements is ambiguous; recommended set is reasonable but unconfirmed

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable stack — Payload 3.x minor versions are non-breaking for collection fields)
