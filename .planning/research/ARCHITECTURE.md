# Architecture Research

**Domain:** Multi-step onboarding form — Next.js 15 App Router integration
**Researched:** 2026-04-03
**Confidence:** HIGH (existing codebase is the primary source; external API details are MEDIUM due to Practice Better docs requiring auth to access)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  (frontend) Route Group                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /get-started  (new page)                            │   │
│  │  'use client' — OnboardingForm component             │   │
│  │  Manages step state locally (useState/useReducer)    │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                          │ POST /api/onboarding              │
│  ┌───────────────────────▼───────────────────────────────┐  │
│  │  /api/onboarding  (new route handler)                 │  │
│  │  1. Validate input                                    │  │
│  │  2. payload.create({ collection: 'clients', ... })   │  │
│  │  3. payload.login() → set payload-token cookie       │  │
│  │  4. POST to Practice Better API /v2/clients          │  │
│  │  5. payload.update() → store practiceBetterId        │  │
│  │  6. Return success                                    │  │
│  └──────────┬────────────────────────┬────────────────────┘  │
│             │                        │                       │
│  ┌──────────▼──────────┐  ┌──────────▼───────────────────┐  │
│  │  Payload (Clients)  │  │  Practice Better API         │  │
│  │  PostgreSQL         │  │  api.practicebetter.io/v2    │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│                                                              │
│  On success → redirect to /client-portal                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `Hero.tsx` (modified) | Replace "Book Free Consult" button with "Get Started" → `/get-started` | Existing server component, minimal change |
| `/get-started/page.tsx` (new) | Onboarding entry point; renders OnboardingForm | Client component page, `(frontend)` group |
| `OnboardingForm.tsx` (new) | Multi-step form state machine; step rendering and navigation | `'use client'`, local `useReducer` state |
| `OnboardingStep*.tsx` (new, 3–4 files) | Individual step UI (goals, labs, contact info, confirmation) | Client sub-components of OnboardingForm |
| `/api/onboarding/route.ts` (new) | Atomic: create Payload client + Practice Better patient + set cookie | Route handler, server-only |
| `src/lib/practice-better.ts` (new) | Practice Better API client (auth, create patient, error handling) | Server-side utility, never imported client-side |
| `src/collections/Clients.ts` (modified) | Add `goals`, `labsStatus`, `practiceBetterId` fields | Payload collection schema extension |

## Recommended Project Structure

New files and the specific modifications needed:

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── get-started/
│   │   │   └── page.tsx              # NEW — onboarding entry, renders OnboardingForm
│   │   └── ... (existing unchanged)
│   └── api/
│       └── onboarding/
│           └── route.ts              # NEW — atomic onboarding submission handler
├── components/
│   └── onboarding/                   # NEW directory
│       ├── OnboardingForm.tsx        # NEW — step machine, state, navigation
│       ├── StepGoals.tsx             # NEW — goal selection step
│       ├── StepLabs.tsx              # NEW — labs status + contextual messaging
│       ├── StepContact.tsx           # NEW — contact info + referral code
│       └── StepConfirmation.tsx      # NEW — success screen, Rupa Health link
├── collections/
│   └── Clients.ts                    # MODIFIED — add goals, practiceBetterId fields
└── lib/
    └── practice-better.ts            # NEW — Practice Better API client (server-only)
```

### Structure Rationale

- **`(frontend)/get-started/`:** Sits inside the `(frontend)` route group so it inherits the existing marketing layout (header, footer, fonts). No new layout needed.
- **`components/onboarding/`:** Isolated from `components/sections/` (homepage sections) and `components/portal/` (portal UI). This separation makes the onboarding components easy to find, test, and eventually replace.
- **`lib/practice-better.ts`:** Centralizing the Practice Better API client in `src/lib/` matches the existing pattern (`src/lib/prescription-states.ts`, `src/lib/auth.ts`). Keeping it in `lib/` rather than inside the API route prevents accidental client-side imports of server secrets.
- **`api/onboarding/route.ts`:** One endpoint, one atomic operation. Follows the existing pattern of one endpoint per business action (`/api/signup`, `/api/contact`, `/api/login`).

## Architectural Patterns

### Pattern 1: Single Page with Client-Side Steps (Recommended)

**What:** One URL (`/get-started`), one client component, step index managed in local React state. No URL changes between steps.

**When to use:** When steps are short (3–4 steps), all data submits as one atomic payload at the final step, and there is no requirement to deep-link to a specific step.

**Why chosen over multi-route:** The onboarding flow collects data across all steps and submits it once at the end. Multiple routes would require either temporary server storage between steps or passing all state through URL params — both add complexity without benefit for a 3–4 step flow. The existing `signup/client/page.tsx` uses the same single-page client pattern and it is the established codebase convention.

**Trade-offs:**
- Pro: Simpler state management, no inter-route data passing, single API call at submission
- Pro: Consistent with existing signup pattern in the codebase
- Con: Refresh loses form progress (acceptable for 3–4 short steps; could add `sessionStorage` if needed)
- Con: No shareable per-step URL (not required per PROJECT.md)

**Example:**
```typescript
// components/onboarding/OnboardingForm.tsx
'use client'

type Step = 'goals' | 'labs' | 'contact' | 'confirmation'

interface OnboardingState {
  step: Step
  goals: string[]
  labsStatus: 'have_labs' | 'need_labs' | 'unsure'
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  password: string
  referralCode: string
}

type Action =
  | { type: 'SET_GOALS'; goals: string[] }
  | { type: 'SET_LABS'; labsStatus: OnboardingState['labsStatus'] }
  | { type: 'SET_CONTACT'; data: Partial<OnboardingState> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }

const STEP_ORDER: Step[] = ['goals', 'labs', 'contact', 'confirmation']

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'SET_GOALS':
      return { ...state, goals: action.goals }
    case 'NEXT_STEP': {
      const idx = STEP_ORDER.indexOf(state.step)
      return { ...state, step: STEP_ORDER[idx + 1] ?? state.step }
    }
    // ...
  }
}
```

### Pattern 2: API Route as Integration Orchestrator

**What:** The `/api/onboarding` route handler performs multiple operations atomically: create Payload client, auto-login, call Practice Better API, store the returned Practice Better ID back on the client record.

**When to use:** When submission involves multiple backend systems that must all succeed (or fail together with meaningful error handling).

**Why not Server Actions:** The existing codebase uses Route Handlers for all form submissions (`/api/signup`, `/api/contact`, `/api/login`). Introducing Server Actions would be an inconsistent pattern. Route Handlers also allow returning custom HTTP status codes and setting cookies, both of which are needed here.

**Trade-offs:**
- Pro: Consistent with existing patterns; explicit HTTP semantics (201, 409, 500)
- Pro: The Practice Better API call stays server-side — credentials never reach the browser
- Con: Slightly more boilerplate than a Server Action for the simple case
- Con: Practice Better failure after Payload success requires careful partial-failure handling

**Example:**
```typescript
// app/api/onboarding/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()

  // 1. Create Payload client (same pattern as /api/signup)
  const client = await payload.create({ collection: 'clients', data: { ... } })

  // 2. Auto-login, set cookie (same pattern as /api/signup)
  const token = await payload.login({ collection: 'clients', data: { email, password } })

  // 3. Fire Practice Better patient creation — non-blocking on failure
  try {
    const pbClient = await createPracticeBetterClient({ firstName, lastName, email, phone, dateOfBirth })
    await payload.update({
      collection: 'clients',
      id: client.id,
      data: { practiceBetterId: pbClient.id },
    })
  } catch (pbError) {
    // Log for manual retry — do NOT fail onboarding if PB is unavailable
    console.error('Practice Better patient creation failed:', pbError)
  }

  // 4. Return success — client account exists regardless of PB status
  return NextResponse.json({ success: true }, { status: 201 })
}
```

### Pattern 3: Practice Better API Client as Server-Only Utility

**What:** A dedicated `src/lib/practice-better.ts` module encapsulates Practice Better authentication (HMAC-SHA256 signature), request construction, and error handling. Only imported by server-side code (route handlers, not components).

**When to use:** Always — API credentials must never reach the browser.

**Trade-offs:**
- Pro: Centralizes credential management and auth header generation
- Pro: Testable in isolation
- Pro: Follows existing `src/lib/` utility pattern

**Example:**
```typescript
// lib/practice-better.ts
// NOTE: This file must only be imported in server-side code (route handlers, lib functions)
import crypto from 'crypto'

const PB_BASE_URL = 'https://api.practicebetter.io/v2'

function buildAuthHeaders(): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = crypto
    .createHmac('sha256', process.env.PRACTICE_BETTER_API_SECRET!)
    .update(timestamp)
    .digest('hex')
  return {
    'X-PB-API-KEY': process.env.PRACTICE_BETTER_API_KEY!,
    'X-PB-TIMESTAMP': timestamp,
    'X-PB-SIGNATURE': signature,
    'Content-Type': 'application/json',
  }
}

export async function createPracticeBetterClient(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth: string
}): Promise<{ id: string }> {
  const response = await fetch(`${PB_BASE_URL}/clients`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.dateOfBirth,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Practice Better API error ${response.status}: ${JSON.stringify(error)}`)
  }

  return response.json()
}
```

## Data Flow

### Onboarding Submission Flow

```
User fills steps 1–3 in OnboardingForm
    ↓
User submits on step 3 (contact info)
    ↓
OnboardingForm.handleSubmit()
    → POST /api/onboarding { goals, labsStatus, firstName, lastName,
                              email, phone, dateOfBirth, password, referralCode }
    ↓
/api/onboarding route.ts
    → Validate required fields
    → Check referralCode against Partners collection (existing pattern)
    → payload.create({ collection: 'clients', data: { ...fields, goals, labsStatus } })
    → payload.login() → set payload-token cookie
    → [optional] payload.create({ collection: 'referrals', ... })
    → lib/practice-better.ts createPracticeBetterClient(...)
        → POST https://api.practicebetter.io/v2/clients
        → On success: payload.update({ ..., practiceBetterId: pb.id })
        → On failure: log error, continue (non-fatal)
    → Return { success: true }
    ↓
OnboardingForm receives success
    → Advance to StepConfirmation (show Rupa Health link)
    → router.push('/client-portal') after delay (same pattern as signup)
```

### State Management Flow

```
OnboardingForm (useReducer)
    ↓ dispatch({ type: 'SET_GOALS', goals })
StepGoals → user selects goals → calls onNext(goals)
    ↓ dispatch({ type: 'NEXT_STEP' })
StepLabs → user answers labs question → calls onNext(labsStatus)
    ↓ dispatch({ type: 'NEXT_STEP' })
StepContact → user fills contact form → calls onSubmit(contactData)
    ↓ single POST to /api/onboarding with full accumulated state
StepConfirmation → shows Rupa Health link, then redirects
```

### Key Data Flows

1. **Referral code propagation:** Read from URL query param `?ref=CODE` on `/get-started` (same as existing signup flow), passed through `OnboardingState`, sent to `/api/onboarding`.
2. **Cookie setting:** `/api/onboarding` sets `payload-token` cookie server-side, matching exactly the pattern in `/api/signup/route.ts`. The client portal page reads this cookie via `getAuthenticatedClient()` from `src/lib/auth.ts` — no changes needed to portal auth.
3. **Practice Better ID storage:** After successful PB patient creation, `practiceBetterId` is written back to the Payload Clients record. This requires adding the field to `src/collections/Clients.ts` and re-running `payload generate:types`.

## Integration Points

### New vs Modified Components

| File | Status | What Changes |
|------|--------|--------------|
| `src/components/sections/Hero.tsx` | MODIFIED | Replace "Book Free Consult" `<Link>` with "Get Started" `<Link href="/get-started">` |
| `src/app/(frontend)/get-started/page.tsx` | NEW | Page wrapper with Suspense, renders `OnboardingForm` |
| `src/components/onboarding/OnboardingForm.tsx` | NEW | Step machine, state, submission handler |
| `src/components/onboarding/StepGoals.tsx` | NEW | Goal selection UI (checkbox/button cards) |
| `src/components/onboarding/StepLabs.tsx` | NEW | Labs status question + conditional messaging |
| `src/components/onboarding/StepContact.tsx` | NEW | Name, email, phone, DOB, password, referral code |
| `src/components/onboarding/StepConfirmation.tsx` | NEW | Success UI, Rupa Health link, redirect countdown |
| `src/app/api/onboarding/route.ts` | NEW | Atomic POST handler (Payload + Practice Better) |
| `src/lib/practice-better.ts` | NEW | Practice Better API client (server-only) |
| `src/collections/Clients.ts` | MODIFIED | Add `goals` (array/JSON), `labsStatus` (select), `practiceBetterId` (text) fields |
| `src/payload-types.ts` | REGENERATED | Run `payload generate:types` after Clients.ts changes |
| `.env.example` | MODIFIED | Add `PRACTICE_BETTER_API_KEY`, `PRACTICE_BETTER_API_SECRET` |

### Build Order (Dependency-Aware)

1. **Clients collection schema extension** — Everything downstream depends on new fields existing in the DB. Do this first, run migration.
2. **`payload generate:types`** — Regenerate types so TypeScript is aware of new fields.
3. **`src/lib/practice-better.ts`** — Server utility with no UI dependencies. Easiest to build and test in isolation with mock credentials.
4. **`src/app/api/onboarding/route.ts`** — Depends on updated Clients types and `practice-better.ts`. Follows the exact pattern of `/api/signup/route.ts` — adapt that file rather than writing from scratch.
5. **Step components** (`StepGoals`, `StepLabs`, `StepContact`, `StepConfirmation`) — Pure UI, can be stubbed and iterated on without a working API.
6. **`OnboardingForm.tsx`** — Assembles step components; depends on all step components existing (even as stubs).
7. **`/get-started/page.tsx`** — Thin wrapper; depends on `OnboardingForm`.
8. **`Hero.tsx` modification** — One-line change; do last to avoid routing to a broken page during development.

### External Services

| Service | Integration Pattern | Auth Method | Notes |
|---------|---------------------|-------------|-------|
| Practice Better API | Server-side POST from `/api/onboarding` via `lib/practice-better.ts` | HMAC-SHA256: `X-PB-API-KEY`, `X-PB-TIMESTAMP`, `X-PB-SIGNATURE` | API is Beta; exact client creation fields need verification against live docs at `api-docs.practicebetter.io`. Base URL: `https://api.practicebetter.io/v2` |
| Rupa Health | Link handoff only — no API | None | Store URL is a static link shown on `StepConfirmation`. Out of scope per PROJECT.md. |
| Payload CMS | Server-side via `getPayload({ config })` | Internal (same process) | Identical pattern to existing `/api/signup/route.ts` |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `OnboardingForm` → `/api/onboarding` | `fetch` POST with JSON body | Single submission at final step, not per-step |
| `/api/onboarding` → `lib/practice-better.ts` | Direct function call (server-side import) | Never imported in client components |
| `/api/onboarding` → Payload | `getPayload({ config })` then `payload.create/update/login` | Identical to existing API routes |
| `OnboardingForm` → step sub-components | Props: `state`, `onNext`, `onBack`, `onSubmit` | No context needed at this scale |
| `/get-started` → `/client-portal` | `router.push('/client-portal')` after success | Portal auth reads `payload-token` cookie; no changes to `src/lib/auth.ts` needed |

## Anti-Patterns

### Anti-Pattern 1: Per-Step API Calls

**What people do:** Submit each step to the server separately, storing partial state in a database between steps.

**Why it's wrong for this project:** The form has 3–4 short steps. Server-side partial state requires a "draft" data model, complicates cleanup of abandoned flows, and adds round-trip latency between steps. The existing signup pattern submits everything at once.

**Do this instead:** Accumulate all form state client-side (local `useReducer`), make a single API call on the final step. The state is tiny (name, email, goals, labs answer) — there is no justification for server-side step persistence.

### Anti-Pattern 2: Calling Practice Better API Directly from the Client

**What people do:** Call Practice Better from client-side `fetch` to avoid an extra server hop.

**Why it's wrong:** Exposes API keys in the browser. Practice Better credentials would be visible in network requests and JavaScript bundles.

**Do this instead:** All Practice Better calls happen exclusively in `/api/onboarding/route.ts` using `src/lib/practice-better.ts`. The client only talks to `/api/onboarding`.

### Anti-Pattern 3: Blocking Onboarding Completion on Practice Better Success

**What people do:** Return an error to the user if Practice Better API call fails.

**Why it's wrong:** The Practice Better API is Beta and may be unavailable. The patient's Payload account (their actual login credential) should always be created successfully. Failing the user because a downstream API is having issues destroys a high-intent conversion.

**Do this instead:** Wrap the Practice Better call in a try-catch inside the route handler. Log failures for manual retry or monitoring. The Payload client account creation is the authoritative success condition.

### Anti-Pattern 4: Separate Routes per Step

**What people do:** Create `/get-started/goals`, `/get-started/labs`, `/get-started/contact` as separate pages, passing data via URL query params or server session.

**Why it's wrong for this project:** URL params are visible and editable; session storage adds infrastructure. The existing codebase has no session middleware. With only 3–4 steps and no requirement for shareable step URLs, this is pure overhead.

**Do this instead:** Single `/get-started` page, client-side step state, submit once at the end.

## Payload Collection Changes (Detail)

The following fields need to be added to `src/collections/Clients.ts`:

```typescript
// Add to fields array in Clients.ts
{
  name: 'goals',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Testosterone Replacement Therapy', value: 'trt' },
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Peptide Protocols', value: 'peptides' },
    { label: 'Sexual Wellness', value: 'sexual_wellness' },
  ],
  admin: {
    description: 'Goals selected during onboarding — informational only',
  },
},
{
  name: 'labsStatus',
  type: 'select',
  options: [
    { label: 'Have Recent Labs', value: 'have_labs' },
    { label: 'Need Labs Ordered', value: 'need_labs' },
    { label: 'Unsure', value: 'unsure' },
  ],
  admin: {
    description: 'Labs status at time of onboarding',
  },
},
{
  name: 'practiceBetterId',
  type: 'text',
  admin: {
    description: 'Practice Better patient ID — set automatically on registration',
    readOnly: true,
  },
},
```

After adding these fields, run:
```bash
npx payload migrate:create
npx payload migrate
npx payload generate:types
```

## Practice Better API (Confidence: MEDIUM)

The Practice Better API documentation is behind authentication and could not be fully verified. Based on third-party integration guides:

- **Base URL:** `https://api.practicebetter.io/v2`
- **Authentication:** HMAC-SHA256 with three headers: `X-PB-API-KEY`, `X-PB-TIMESTAMP`, `X-PB-SIGNATURE`
- **Create client endpoint:** `POST /clients` (inferred from API structure; confirmed endpoint path needs verification against live docs)
- **Known fields:** `first_name`, `last_name`, `email`, `phone`, `date_of_birth` (inferred from Portable.io integration schema and Practice Better UI field names)
- **Action required:** Verify exact request body schema in the live docs at `api-docs.practicebetter.io` before implementing `lib/practice-better.ts`. The HMAC auth pattern is confirmed from multiple independent sources.

## Sources

- Existing codebase: `src/app/api/signup/route.ts`, `src/collections/Clients.ts`, `src/app/(frontend)/signup/client/page.tsx`
- Practice Better API auth pattern: [Rollout integration guide](https://rollout.com/integration-guides/practice-better/sdk/step-by-step-guide-to-building-a-practice-better-api-integration-in-php) — MEDIUM confidence
- Practice Better base URL `https://api.practicebetter.io/v2`: Confirmed across multiple third-party sources — MEDIUM confidence
- Next.js multi-step form patterns: [benorloff/nextjs-multi-step-form-tutorial](https://github.com/benorloff/nextjs-multi-step-form-tutorial), [Elena Marinaki — multi-step form with Next.js](https://elenamarinaki.hashnode.dev/building-a-multi-step-form-with-nextjs-part-1)
- Server Actions vs Route Handlers: [Wisp CMS comparison](https://www.wisp.blog/blog/server-actions-vs-api-routes-in-nextjs-15-which-should-i-use)
- State management: [State management in 2025 — DEV Community](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)

---
*Architecture research for: StrengthRX onboarding flow integration*
*Researched: 2026-04-03*
