# Phase 2: Onboarding Form UI - Research

**Researched:** 2026-04-03
**Domain:** Multi-step form UI with react-hook-form, zod v3, Next.js App Router, dark theme Tailwind v4
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ONBRD-01 | User can click "Get Started" on homepage to begin onboarding | Hero.tsx needs a Link button to /get-started; Button + Link pattern already exists in Hero |
| ONBRD-02 | User can select health goals from checkbox options | goals field: 6 options in Clients.ts; implement as visual checkbox cards, not native checkboxes |
| ONBRD-03 | User can indicate whether they've had full labs in the last 30 days | labsStatus field: yes/no; implement as two large radio-style button cards |
| ONBRD-04 | User can enter contact info (first name, last name, phone, email) | Existing Input component supports label/error props; mirrors signup page pattern |
| ONBRD-05 | User sees a progress indicator showing current step | Client-side step state (0-indexed); render a step bar above each step panel |
| ONBRD-06 | User can navigate back to previous steps without losing data | react-hook-form getValues persists across re-renders; Back button decrements step counter |
| ONBRD-07 | User sees inline validation errors before advancing steps | react-hook-form trigger() validates specific fields per step before advancing |
| ONBRD-08 | User sees loading state during form submission | formState.isSubmitting drives disabled + Loader2 spinner (lucide-react already installed) |
| ONBRD-09 | User sees success screen with next steps after completing onboarding | Replace step panel with success JSX when submission completes; stub returns { ok: true } |
| ONBRD-10 | Onboarding form is mobile-responsive | Container sm, Tailwind responsive classes; checkbox cards use grid-cols-1 sm:grid-cols-2 |
</phase_requirements>

---

## Summary

Phase 2 builds a four-panel client-side stepper at `/get-started`. The three data-gathering steps are: (1) goal selection with checkboxes, (2) labs yes/no question, (3) contact info. Step 4 is a success screen shown after a stub POST to `/api/onboarding`. All form state lives in a single `useForm` instance in the page component; child step components receive `register`, `control`, and `formState` as props.

The project already has react-hook-form 7.72, zod 3.25, @hookform/resolvers 5.2, lucide-react, and a full dark-theme Tailwind v4 UI kit. No new packages are needed. The dark theme uses `--color-background: #111827`, `--color-primary: #b52c29` (red), and `--color-accent: #3c62a0` (blue) — note: the additional context above said "gold (#D4A843) accents" but the actual styles.css uses blue (#3c62a0) as accent. Follow the real codebase colors.

**Primary recommendation:** Single `'use client'` page at `src/app/(frontend)/get-started/page.tsx` with a `currentStep` state integer, a single `useForm` instance with zodResolver, and three step sub-components. The stub submission handler POSTs to `/api/onboarding` and returns a placeholder 200; the real handler ships in Phase 4.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.72.1 | Form state, validation trigger, submission | Already installed; Phase 1 decision |
| zod | ^3.25.76 | Schema validation — PINNED to v3, not v4 | Project decision — do not upgrade |
| @hookform/resolvers | ^5.2.2 | Connects zod schema to useForm | Already installed |
| lucide-react | (existing) | Loader2 spinner, CheckCircle2, icons | Already used in signup page |
| next/navigation | Next.js 15 | `useRouter` for post-success redirect | App Router standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx / tailwind-merge | (existing) | `cn()` helper for conditional classes | All conditional className expressions |
| next/link | Next.js 15 | Prefetched navigation | "Get Started" CTA in Hero |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Single useForm at page level | useForm per step | Per-step loses data on unmount; single instance is correct for back-navigation |
| Custom checkbox UI | Native `<input type="checkbox">` | Native checkboxes cannot be styled to match dark theme card design |
| Multi-route steps (/get-started/step/1) | Client-side stepper | Multi-route adds URL complexity; single-page stepper is simpler and the project decision |

**Installation:** No new packages needed. All dependencies installed in Phase 1.

---

## Architecture Patterns

### Recommended File Structure
```
src/app/(frontend)/get-started/
└── page.tsx                    # Single 'use client' page — stepper + form controller

src/components/onboarding/
├── StepIndicator.tsx           # Progress bar: step labels + active/complete styling
├── StepGoals.tsx               # Step 1 — checkbox goal cards
├── StepLabs.tsx                # Step 2 — yes/no labs radio cards
├── StepContact.tsx             # Step 3 — first/last/phone/email inputs
└── SuccessScreen.tsx           # Step 4 — success confirmation panel
```

The step components live in `src/components/onboarding/` to keep the page file clean and follow the existing `src/components/sections/` pattern.

### Pattern 1: Single-Form Multi-Step Stepper

**What:** One `useForm` at the top of the page. Step index stored in `useState`. Each step component receives `control`, `register`, and `formState.errors` as props. Advancing calls `trigger(fieldNamesForCurrentStep)` — only valid if that step's fields pass. Back simply decrements step.

**When to use:** Any multi-step form where back-navigation must preserve data. This is the standard react-hook-form pattern for wizards.

**Example:**
```typescript
// Source: react-hook-form docs — https://react-hook-form.com/docs/useform/trigger
const { register, control, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<OnboardingFormData>({
  resolver: zodResolver(onboardingSchema),
  mode: 'onTouched',
})

const handleNext = async () => {
  const fieldsForStep: Record<number, (keyof OnboardingFormData)[]> = {
    0: ['goals'],
    1: ['labsStatus'],
    2: ['firstName', 'lastName', 'email', 'phone'],
  }
  const valid = await trigger(fieldsForStep[currentStep])
  if (valid) setCurrentStep((s) => s + 1)
}
```

### Pattern 2: Zod v3 Schema (NOT v4)

**What:** Define the full form schema with zod v3 syntax. v4 introduced breaking changes (z.string().min() error message API changed). Keep all zod imports from 'zod' at v3.

```typescript
// Source: zod v3 docs — https://zod.dev (v3)
import { z } from 'zod'

export const onboardingSchema = z.object({
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  labsStatus: z.enum(['yes', 'no'], { required_error: 'Please answer the labs question' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
```

### Pattern 3: Multi-Select Checkbox Cards (Goals Step)

**What:** Render goal options as styled `<button>` or `<label>` card elements. Use react-hook-form `Controller` with a controlled value array. Toggle items in/out of the array on click.

```typescript
// Pattern established from existing UI kit + react-hook-form Controller docs
import { Controller } from 'react-hook-form'

<Controller
  name="goals"
  control={control}
  render={({ field }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {GOAL_OPTIONS.map((goal) => {
        const selected = field.value?.includes(goal.value)
        return (
          <button
            key={goal.value}
            type="button"
            onClick={() => {
              const next = selected
                ? field.value.filter((v: string) => v !== goal.value)
                : [...(field.value ?? []), goal.value]
              field.onChange(next)
            }}
            className={cn(
              'rounded-lg border-2 p-4 text-left transition-colors',
              selected
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-muted text-muted-foreground hover:border-primary/50'
            )}
          >
            {goal.label}
          </button>
        )
      })}
    </div>
  )}
/>
```

### Pattern 4: Yes/No Radio Cards (Labs Step)

```typescript
// Same Controller pattern, single-select
<Controller
  name="labsStatus"
  control={control}
  render={({ field }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { value: 'yes', label: 'Yes — labs done in last 30 days' },
        { value: 'no', label: 'No' },
      ].map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => field.onChange(opt.value)}
          className={cn(
            'rounded-lg border-2 p-6 text-center font-medium transition-colors',
            field.value === opt.value
              ? 'border-primary bg-primary/10 text-foreground'
              : 'border-border bg-muted text-muted-foreground hover:border-primary/50'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )}
/>
```

### Pattern 5: Step Indicator

```typescript
// Simple numbered/labeled progress bar
const STEP_LABELS = ['Your Goals', 'Lab History', 'Contact Info']

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex flex-1 flex-col items-center">
          <div className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold',
            i < currentStep && 'bg-primary text-white',
            i === currentStep && 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-background',
            i > currentStep && 'bg-muted text-muted-foreground',
          )}>
            {i < currentStep ? <CheckIcon className="h-4 w-4" /> : i + 1}
          </div>
          <span className="mt-1 text-xs text-muted-foreground hidden sm:block">{label}</span>
          {i < STEP_LABELS.length - 1 && (
            <div className={cn('h-0.5 w-full mt-4', i < currentStep ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
```

### Pattern 6: Stub Submission Handler

Phase 2 uses a stub route at `/api/onboarding` that returns `{ ok: true }`. The real implementation ships in Phase 4. The stub keeps the form fully testable end-to-end in Phase 2 without Payload writes.

```typescript
// src/app/api/onboarding/route.ts (stub — Phase 2 only)
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

### Pattern 7: Get Started CTA in Hero

Hero currently links to `/contact`. A "Get Started" button needs to link to `/get-started`. Follow the existing Button + Link pattern in Hero.tsx:

```typescript
// Add alongside or replace "Book Free Consult" in Hero.tsx
import Link from 'next/link'
<Button size="lg" asChild>
  <Link href="/get-started">Get Started</Link>
</Button>
```

### Anti-Patterns to Avoid

- **Per-step useForm instances:** Each useForm creates independent state. Unmounting a step destroys its values. Always hoist to page level.
- **`mode: 'onChange'` globally:** Triggers on every keystroke; prefer `'onTouched'` for initial validation, then errors show inline on blur/change after first touch.
- **Calling `handleSubmit` to advance steps:** `handleSubmit` validates the entire schema. Use `trigger(fieldNames)` to validate only the current step's fields.
- **Importing from 'zod/v4' or upgrading zod:** Project is pinned to v3. Do not upgrade.
- **Using `<input type="checkbox">` or `<input type="radio">` for goal/labs cards:** Native inputs are hard to style in dark theme; use button-based Controller pattern above.
- **Putting 'use client' on step components:** Only the page needs it. Step components receive props and do not need their own directive unless they use hooks independently.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Step-level field validation before advancing | Custom validation logic | `react-hook-form trigger(fieldNames)` | Handles async validators, integrates with zod resolver |
| Error display per field | Custom error state | `formState.errors.fieldName.message` from useForm | Already wired through zodResolver |
| Loading spinner during submit | Custom spinner | `Loader2` from lucide-react + `formState.isSubmitting` | Already used in signup page |
| Class merging with conditionals | Custom classname logic | `cn()` from `src/lib/utils.ts` | Project standard |
| Checkbox/radio value management | Manual checked state | `Controller` + array toggle | Integrates with form validation |

**Key insight:** All form complexity (validation, errors, loading state, controlled inputs) is already solved by the installed libraries. The phase is purely about wiring them together with the right UI.

---

## Common Pitfalls

### Pitfall 1: `useSearchParams` Requires Suspense Boundary
**What goes wrong:** `useSearchParams()` in a client component throws a build error without a `<Suspense>` wrapper.
**Why it happens:** Next.js 15 App Router requires Suspense around `useSearchParams` at the page level.
**How to avoid:** Wrap the form content component in `<Suspense>` in the page export (same pattern as the existing signup page).
**Warning signs:** Build error mentioning "useSearchParams() should be wrapped in a suspense boundary".

### Pitfall 2: `goals` Field Initializes as `undefined`, Not `[]`
**What goes wrong:** `field.value?.includes(...)` throws when value is undefined; zod `.min(1)` check fails unexpectedly.
**Why it happens:** react-hook-form `defaultValues` omission leaves array fields as `undefined`.
**How to avoid:** Always include `defaultValues: { goals: [], labsStatus: undefined, ... }` in useForm config.

### Pitfall 3: `trigger()` Returns `false` for Untouched Required Fields
**What goes wrong:** User clicks Next without touching any field; trigger returns false but no error appears because errors only display after the field is touched.
**Why it happens:** `mode: 'onTouched'` does not show errors until interaction, but trigger() does set them.
**How to avoid:** After `trigger()` returns false, errors ARE set in `formState.errors` — display them unconditionally from `formState.errors`, not from a touched state check.

### Pitfall 4: Dark Theme Color Mismatch
**What goes wrong:** Using hardcoded color values (e.g., `bg-gray-800`, `text-gray-300`) instead of design tokens.
**Why it happens:** Habit from non-themed projects.
**How to avoid:** Use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `text-primary`, `text-accent`. All defined in styles.css `@theme` block.

### Pitfall 5: Button `asChild` Wraps in `<span>`, Not `<a>`
**What goes wrong:** `<Button asChild>` renders a `<span>` — not a `<a>` tag — so keyboard navigation and SEO for the CTA link is broken.
**Why it happens:** The current Button implementation uses `<span {...props} />` for asChild, not Radix Slot.
**How to avoid:** For the Hero CTA, use `<Button asChild><Link href="/get-started">...</Link></Button>` — Next.js Link renders the anchor; the span wrapper is acceptable here since Link handles the href. OR add the href directly to the button as a styled link. Verify visually in browser that clicking navigates correctly.

### Pitfall 6: Zod v3 vs v4 API Differences
**What goes wrong:** Copying zod examples from docs that use v4 syntax (e.g., `z.string().check()`, new `.brand()` changes, `ZodMiniType`).
**Why it happens:** zod v4 was released 2025; many 2025+ blog posts reference v4.
**How to avoid:** Pin all zod usage to v3 docs. The installed version is `^3.25.76`. The `z.object`, `z.string`, `z.enum`, `z.array` APIs are stable in v3 and will work correctly.

---

## Code Examples

Verified patterns from official sources and project codebase:

### Full Page Shell
```typescript
// src/app/(frontend)/get-started/page.tsx
'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { GetStartedForm } from '@/components/onboarding/GetStartedForm'

export default function GetStartedPage() {
  return (
    <Suspense fallback={
      <Container className="py-24">
        <div className="mx-auto max-w-lg text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    }>
      <GetStartedForm />
    </Suspense>
  )
}
```

### useForm Initialization
```typescript
// Source: react-hook-form docs — https://react-hook-form.com/docs/useform
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, type OnboardingFormData } from '@/lib/schemas/onboarding'

const form = useForm<OnboardingFormData>({
  resolver: zodResolver(onboardingSchema),
  mode: 'onTouched',
  defaultValues: {
    goals: [],
    labsStatus: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
})
```

### Step Advance with Per-Step Validation
```typescript
// Source: react-hook-form trigger() docs
const STEP_FIELDS: Record<number, (keyof OnboardingFormData)[]> = {
  0: ['goals'],
  1: ['labsStatus'],
  2: ['firstName', 'lastName', 'email'],
}

const handleNext = async () => {
  const valid = await form.trigger(STEP_FIELDS[currentStep])
  if (valid) setCurrentStep((prev) => prev + 1)
}
```

### Submission Handler (Stub)
```typescript
const onSubmit = async (data: OnboardingFormData) => {
  const res = await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Submission failed')
  setCurrentStep(3) // show success screen
}
```

### Input with Error Display (using existing Input component)
```typescript
// Input component already supports error prop — pass from formState.errors
<Input
  {...register('firstName')}
  label="First Name"
  error={errors.firstName?.message}
  required
  placeholder="John"
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Multi-page form routes | Single-page client stepper | Phase 2 architecture decision | No URL changes between steps; simpler state |
| `useState` for form data | react-hook-form | Phase 1 — library installed | Validation, errors, loading state all handled |
| Separate error state | `formState.errors` from useForm | Phase 1 decision | Single source of truth for validation state |

**Deprecated/outdated:**
- `formState.isValid` as a step guard: Do not disable Next button based on `isValid` — it reflects the whole form, not the current step. Use `trigger()` instead.

---

## Open Questions

1. **Does the success screen need a "next steps" list or just a confirmation message?**
   - What we know: ONBRD-09 says "success screen with next steps"; Phase 4 will add Rupa Health link (POST-01)
   - What's unclear: What "next steps" content to show in Phase 2 (stub phase, no real API)
   - Recommendation: Show a generic "We'll be in touch" message and a placeholder for the Rupa Health link (disabled/placeholder link with a TODO comment). Phase 4 replaces this.

2. **Does the Hero "Get Started" button replace or sit alongside "Book Free Consult"?**
   - What we know: ONBRD-01 says user can click Get Started on homepage; Hero has "Book Free Consult" + "Call Now"
   - What's unclear: Whether to replace "Book Free Consult" or add a third button
   - Recommendation: Add "Get Started" as the primary (left) button; move "Book Free Consult" to secondary or remove it. This is a UI decision for the planner/developer.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.3 (jsdom) + Playwright 1.54.1 (e2e) |
| Config file | `vitest.config.mts` (unit/int), `playwright.config.ts` (e2e) |
| Quick run command | `pnpm test:int` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ONBRD-01 | /get-started page exists and renders | e2e | `pnpm test:e2e` | ❌ Wave 0 |
| ONBRD-02 | Goal checkboxes render all 6 options; selecting updates form value | unit | `pnpm test:int -- StepGoals` | ❌ Wave 0 |
| ONBRD-03 | Labs yes/no options render and update form | unit | `pnpm test:int -- StepLabs` | ❌ Wave 0 |
| ONBRD-04 | Contact fields render and bind to form | unit | `pnpm test:int -- StepContact` | ❌ Wave 0 |
| ONBRD-05 | StepIndicator shows correct active step | unit | `pnpm test:int -- StepIndicator` | ❌ Wave 0 |
| ONBRD-06 | Back button decrements step without clearing previous values | unit | `pnpm test:int -- GetStartedForm` | ❌ Wave 0 |
| ONBRD-07 | Clicking Next without data shows validation errors per step | unit | `pnpm test:int -- GetStartedForm` | ❌ Wave 0 |
| ONBRD-08 | Loading spinner appears during submission | unit | `pnpm test:int -- GetStartedForm` | ❌ Wave 0 |
| ONBRD-09 | Success screen appears after stub submission | unit | `pnpm test:int -- GetStartedForm` | ❌ Wave 0 |
| ONBRD-10 | Form is mobile-responsive (viewport meta, grid classes) | manual/e2e | `pnpm test:e2e` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test:int`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/int/onboarding-form.int.spec.ts` — covers ONBRD-02 through ONBRD-09 (unit tests with jsdom + @testing-library/react)
- [ ] `tests/e2e/onboarding.e2e.spec.ts` — covers ONBRD-01, ONBRD-10 (Playwright)
- [ ] `@testing-library/user-event` — NOT installed; needed for user interaction tests. Install: `pnpm add -D @testing-library/user-event`
- Note: `@testing-library/react@16.3.0` already installed (verified from package.json)

---

## Sources

### Primary (HIGH confidence)
- Project codebase — `src/components/ui/`, `src/app/(frontend)/signup/client/page.tsx`, `src/components/sections/Hero.tsx`, `src/app/(frontend)/styles.css` — direct inspection
- `src/collections/Clients.ts` — exact field names, option values, and types
- `.planning/phases/01-schema-and-foundation/01-01-SUMMARY.md` — confirmed installed packages and versions
- `package.json` — exact versions: react-hook-form 7.72.1, zod 3.25.76, @hookform/resolvers 5.2.2

### Secondary (MEDIUM confidence)
- react-hook-form docs (https://react-hook-form.com/docs/useform/trigger) — `trigger(fieldNames)` pattern for step-by-step validation
- zod v3 docs (https://zod.dev) — schema API stable since v3.x

### Tertiary (LOW confidence)
- None — all critical claims verified from codebase or package.json directly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and SUMMARY.md
- Architecture: HIGH — verified from existing signup page and UI kit patterns in codebase
- Pitfalls: HIGH — verified from Next.js 15 docs (Suspense requirement) and direct code inspection (Button asChild span implementation)
- Color tokens: HIGH — verified from styles.css @theme block directly

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable stack; zod/react-hook-form APIs do not change rapidly)
