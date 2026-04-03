# Phase 4: API Route and Integration — Research

**Researched:** 2026-04-03
**Domain:** Next.js Route Handler, Payload CMS auth, Practice Better API, reCAPTCHA Enterprise, admin retry UI
**Confidence:** HIGH — all findings sourced from live codebase; no external APIs introduced

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTEG-01 | Onboarding submission creates a Payload client record | `payload.create({ collection: 'clients', data: {...} })` — exact pattern in `/api/signup/route.ts` |
| INTEG-02 | User is automatically logged in after account creation | `payload.login(...)` + `response.cookies.set('payload-token', ...)` — exact pattern in `/api/signup/route.ts` |
| INTEG-03 | Onboarding flow supports optional referral code attribution | `?ref=` URL param → `payload.find({ collection: 'partners', where: { referralCode: { equals: code } } })` → `payload.create({ collection: 'referrals', ... })` — exact pattern in `/api/signup/route.ts` |
| INTEG-04 | Onboarding submission is protected by reCAPTCHA | `createAssessment()` with action `ONBOARDING_FORM` — exact pattern in `/api/contact/route.ts`; client-side token via `window.grecaptcha.enterprise.execute` |
| INTEG-05 | Practice Better patient creation calls real API during onboarding | `createPracticeBetterClient({ firstName, lastName, email })` from `src/lib/practice-better.ts` — non-blocking, update `practiceBetterSyncStatus` to `synced` or `failed` |
| INTEG-06 | Admin can retry failed Practice Better syncs from admin portal | New `POST /api/admin/retry-pb-sync` route + UI section added to `AdminPortalContent.tsx` |
| POST-01 | User is shown Rupa Health store link for lab ordering | Update `SuccessScreen.tsx` with real Rupa Health URL (currently `TODO` placeholder); URL must be confirmed by client — use SiteSettings global or hardcode if confirmed |
| POST-02 | User is redirected to existing client portal after onboarding | After successful submission, frontend navigates to `/client-portal` — user has session cookie from INTEG-02 |
</phase_requirements>

---

## Summary

Phase 4 assembles all prior phases into a working end-to-end onboarding route. The reference implementation for this phase already exists in the codebase: `src/app/api/signup/route.ts` handles Payload client creation, auto-login cookie, and referral attribution. The `/api/contact/route.ts` handles reCAPTCHA Enterprise validation. The `src/lib/practice-better.ts` library (built in Phase 3) handles PB patient creation. Phase 4 replaces the stub `/api/onboarding/route.ts` with a handler that combines all three patterns.

The most important architectural decision already made (in STATE.md) is that the PB call must be **non-blocking** — user should not be blocked by PB failures. The route creates the Payload client, logs in, fires PB creation, updates `practiceBetterSyncStatus` to `synced` or `failed`, and returns. The success screen must show a Rupa Health link (POST-01), and the form must redirect to `/client-portal` on success (POST-02).

The admin retry feature (INTEG-06) requires a new API route (`POST /api/admin/retry-pb-sync`) and a new UI section in `AdminPortalContent.tsx` that shows clients with `practiceBetterSyncStatus: 'failed'` and a "Retry Sync" button per row.

**Primary recommendation:** Model the onboarding route directly on `/api/signup/route.ts`. Wrap the PB call in try/catch after the Payload create+login completes, so PB failure degrades gracefully. The onboarding form already submits `{ goals, labsStatus, firstName, lastName, email, phone }` — the route receives this plus a `recaptchaToken` field that must be added to `GetStartedForm.tsx`.

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| payload | 3.x | CMS — `payload.create`, `payload.login`, `payload.update` | Project's data and auth layer |
| next | 15.x | Route Handler (`src/app/api/**`) | Project framework |
| @google-cloud/recaptcha-enterprise | installed | reCAPTCHA Enterprise assessment | Used in `/api/contact/route.ts` |
| zod | 3.x (pinned) | Request body validation | PINNED to v3 — do not upgrade |
| src/lib/practice-better.ts | N/A | PB OAuth2 + patient creation | Built in Phase 3 |

### No New Dependencies Required

All required packages are already installed. Phase 4 is pure implementation work connecting existing modules.

---

## Architecture Patterns

### Route Handler Structure

The `/api/onboarding` route follows the same shape as `/api/signup/route.ts`. The execution order is:

```
1. Parse + validate request body (required fields check)
2. Validate reCAPTCHA token (reject with 403 if fails)
3. getPayload({ config })
4. [Optional] Look up referral code → get partnerId
5. payload.create({ collection: 'clients', data: { ...onboardingFields, practiceBetterSyncStatus: 'pending' } })
6. [Optional] payload.create({ collection: 'referrals', ... }) — wrapped in try/catch, never blocks
7. payload.login({ collection: 'clients', data: { email, password } }) → get token
8. Build NextResponse with success payload
9. Set payload-token cookie on response
10. [Non-blocking] createPracticeBetterClient(...) → payload.update({ practiceBetterSyncStatus: 'synced' | 'failed' })
11. Return response
```

The PB call (step 10) must happen AFTER the response is built and returned to the user, or fire-and-forget using `.catch()` to avoid blocking.

### Pattern 1: Payload Client Create + Auto-Login

Exact pattern from `/api/signup/route.ts` — copy this verbatim, adding the new fields:

```typescript
// Source: src/app/api/signup/route.ts
const client = await payload.create({
  collection: 'clients',
  data: {
    firstName,
    lastName,
    email,
    password,            // Payload auth collections require password
    // onboarding-specific fields:
    goals,
    labsStatus,
    phone: phone || undefined,
    practiceBetterSyncStatus: 'pending',
    assignedTrainer: partnerId || undefined,
    paperworkStatus: 'not_started',
    labStatus: 'not_ordered',
    medicalReviewStatus: 'pending',
  },
})

const token = await payload.login({
  collection: 'clients',
  data: { email, password },
})

const response = NextResponse.json({ success: true, ... }, { status: 201 })

if (token.token) {
  response.cookies.set('payload-token', token.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}
```

**Important:** The onboarding form schema (`src/lib/schemas/onboarding.ts`) does NOT include a `password` field — but Payload's `clients` collection has `auth: true` which requires a password. The route must **generate a random password** during account creation (crypto.randomUUID() or similar). The user logs in via cookie — they never type this password.

### Pattern 2: reCAPTCHA Enterprise Validation

Exact pattern from `/api/contact/route.ts`:

```typescript
// Source: src/app/api/contact/route.ts
const RECAPTCHA_ACTION = 'ONBOARDING_FORM'  // new action name for this form

const recaptchaResult = await createAssessment(recaptchaToken)
if (!recaptchaResult.success) {
  return NextResponse.json(
    { error: 'reCAPTCHA verification failed. Please try again.' },
    { status: 403 },
  )
}
```

The `createAssessment` helper (currently in `contact/route.ts`) should either be duplicated or extracted to `src/lib/recaptcha.ts` for reuse. Copy the cached `RecaptchaEnterpriseServiceClient` singleton pattern.

**Client-side:** `GetStartedForm.tsx` must call `window.grecaptcha.enterprise.execute(siteKey, { action: 'ONBOARDING_FORM' })` before `fetch('/api/onboarding', ...)`. Pattern exists in `src/app/(frontend)/(marketing)/contact/page.tsx` lines 85-96.

### Pattern 3: Non-Blocking PB Sync

```typescript
// Fire-and-forget AFTER response is built
const response = NextResponse.json({ success: true, ... }, { status: 201 })
// set cookie...

// Non-blocking: user is NOT waiting for this
createPracticeBetterClient({ firstName, lastName, email })
  .then(async (pbResult) => {
    await payload.update({
      collection: 'clients',
      id: client.id,
      data: {
        practiceBetterId: pbResult.id,
        practiceBetterSyncStatus: 'synced',
      },
    })
  })
  .catch(async (err) => {
    console.error('PB sync failed (non-blocking):', err)
    await payload.update({
      collection: 'clients',
      id: client.id,
      data: { practiceBetterSyncStatus: 'failed' },
    })
  })

return response  // returned BEFORE PB call resolves
```

### Pattern 4: Referral Attribution

Direct copy from `/api/signup/route.ts`. The referral code comes from the form body (the form reads it from `?ref=` on page load). The `onboarding` schema does not currently include `referralCode` — it must be added as an optional field.

```typescript
// Source: src/app/api/signup/route.ts (lines 18-83)
let partnerId: number | null = null
if (referralCode) {
  const partners = await payload.find({
    collection: 'partners',
    where: {
      referralCode: { equals: referralCode.toUpperCase() },
      status: { equals: 'active' },
    },
    limit: 1,
  })
  if (partners.docs.length > 0) {
    partnerId = partners.docs[0].id as number
  }
}
```

### Pattern 5: Admin Retry API Route

New route: `src/app/api/admin/retry-pb-sync/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // 1. Authenticate admin via getAuthenticatedAdmin()
  // 2. Parse { clientId } from body
  // 3. getPayload({ config })
  // 4. Fetch client record — verify practiceBetterSyncStatus === 'failed'
  // 5. Call createPracticeBetterClient({ firstName, lastName, email })
  // 6. Update client: practiceBetterId, practiceBetterSyncStatus: 'synced'
  // 7. Return { success: true }
  // On error: update practiceBetterSyncStatus: 'failed', return 500
}
```

### Pattern 6: Admin Retry UI

`AdminPortalContent.tsx` is a Client Component (`'use client'`). The admin portal page (`page.tsx`) is a Server Component that fetches data and passes it as props. For the retry UI:

- The server component (`admin-portal/page.tsx`) needs to query clients with `practiceBetterSyncStatus: 'failed'` and pass them down
- `AdminPortalContent.tsx` renders a new "Failed PB Syncs" table section with a "Retry Sync" button per row
- The button makes a `fetch('POST /api/admin/retry-pb-sync', { clientId })` call
- On success, the button updates its state (optimistic UI — hide the row or show "Synced")

The `AdminPortalData` type in `src/lib/portal-types.ts` must be extended with a `failedPbSyncs` field.

### Recommended Project Structure (new files)

```
src/
├── app/api/
│   ├── onboarding/route.ts          # Replace stub — main Phase 4 deliverable
│   └── admin/
│       └── retry-pb-sync/route.ts   # New admin-only retry endpoint
├── lib/
│   └── recaptcha.ts                 # Extract createAssessment() for reuse (optional)
├── components/onboarding/
│   └── SuccessScreen.tsx            # Update: add real Rupa Health link
└── app/(portals)/admin-portal/
    ├── page.tsx                     # Update: query failedPbSyncs
    ├── AdminPortalContent.tsx       # Update: add FailedPbSyncs section
    └── components/
        └── FailedPbSyncs.tsx        # New component (or inline in AdminPortalContent)
```

### Anti-Patterns to Avoid

- **Blocking on PB:** Never await the PB call before returning the response. PB is external — any network hiccup would break onboarding for the user.
- **Storing plaintext passwords:** Use `crypto.randomUUID()` for the generated password. Payload hashes it automatically.
- **Generating password in client:** Generate it server-side in the route handler. Never send a generated password to the client.
- **Duplicating reCAPTCHA client instantiation:** The `RecaptchaEnterpriseServiceClient` must be a singleton (module-level cached instance), as in `contact/route.ts`. If extracted to `lib/recaptcha.ts`, keep that pattern.
- **Checking `user.collection` in the retry route via getAuthenticatedAdmin():** Already handled by the existing `getAuthenticatedAdmin()` helper — always use that, not manual collection checks.
- **Upgrading Zod:** Zod is pinned to v3. Do not upgrade. v4 has breaking changes tracked in issue #4923.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth cookie on login | Manual JWT handling | `payload.login()` + `response.cookies.set('payload-token', ...)` | Payload manages token format/expiry — see signup route lines 87-119 |
| reCAPTCHA validation | Custom score logic | `createAssessment()` pattern from contact route | Handles token validity + action match + score threshold (0.5) |
| PB OAuth2 token fetch | Custom token cache | `createPracticeBetterClient()` from `lib/practice-better.ts` | Token cache with 60s safety margin already built and tested |
| Duplicate email check | Manual UNIQUE query | Catch `error.message.includes('duplicate')` from `payload.create` | Postgres constraint already on email field; see signup route line 126 |
| Admin auth check | Manual cookie parse | `getAuthenticatedAdmin()` from `src/lib/auth.ts` | Collection check included |

---

## Common Pitfalls

### Pitfall 1: Missing `password` in Payload Client Create

**What goes wrong:** `payload.create({ collection: 'clients', data: { ...noPassword } })` throws because `clients` has `auth: true` which requires a password field.

**Why it happens:** The onboarding schema intentionally omits password — users don't set one during onboarding. But Payload auth collections need a password hash to function.

**How to avoid:** Generate a random password server-side before `payload.create`. Use `crypto.randomUUID()` (Node built-in, no import needed) or a similar CSPRNG approach. Payload will hash it. The user never needs to know it — they access the portal via session cookie.

**Warning signs:** `payload.create` throws with a validation error mentioning `password`.

### Pitfall 2: reCAPTCHA Action Mismatch

**What goes wrong:** Server rejects valid submissions with "reCAPTCHA action mismatch" because client-side `execute` uses a different action string than server-side `createAssessment`.

**Why it happens:** The action string must match exactly (case-sensitive). The contact route uses `'CONTACT_FORM'`. The onboarding route must define its own action and the client must use the same string.

**How to avoid:** Define `const RECAPTCHA_ACTION = 'ONBOARDING_FORM'` in the route AND use the same string in `GetStartedForm.tsx`'s `grecaptcha.enterprise.execute` call. Consider exporting it as a shared constant.

**Warning signs:** 403 responses from `/api/onboarding` with valid user input.

### Pitfall 3: PB Sync Updates Payload After Response Sent — Payload Instance

**What goes wrong:** The non-blocking PB `.then()` callback tries to call `payload.update()` but `payload` is out of scope or garbage-collected.

**Why it happens:** In Next.js Route Handlers, the `payload` variable is in the handler's closure. If the route returns and the request context closes, the `payload` instance may no longer be valid.

**How to avoid:** Either (a) re-call `getPayload({ config })` inside the `.then()/.catch()` callback, or (b) verify that closures keep the instance alive in Next.js 15 serverless contexts. The safer approach is re-calling `getPayload` in the async callback since it's cheap (cached singleton).

**Warning signs:** `practiceBetterSyncStatus` never updates from `'pending'` to `'synced'`/`'failed'`.

### Pitfall 4: `GetStartedForm` Submits Without reCAPTCHA Token

**What goes wrong:** The current `onSubmit` in `GetStartedForm.tsx` (line 44-52) does not include a `recaptchaToken` field. If Phase 4 adds reCAPTCHA server-side validation but does not update the form, every submission will 403.

**Why it happens:** The stub route returned `{ ok: true }` unconditionally, so no token was needed before. Phase 4 must update both the route AND the form simultaneously.

**How to avoid:** Update `GetStartedForm.tsx` `onSubmit` to call `window.grecaptcha.enterprise.execute` before `fetch`. Pass the token in the request body as `recaptchaToken`. Pattern: `src/app/(frontend)/(marketing)/contact/page.tsx` lines 85-107.

**Warning signs:** 403 from `/api/onboarding` in browser, even with valid form data.

### Pitfall 5: `SuccessScreen` Has No Props — Rupa Health URL

**What goes wrong:** `SuccessScreen.tsx` is a static component with no props. The Rupa Health URL is currently a TODO placeholder. If the URL is hardcoded in the component, it requires a code deploy to update.

**Why it happens:** The URL was not available when Phase 2 shipped. STATE.md documents: "Rupa Health store URL must be confirmed before success screen is built (migration to Fullscript in 2026)."

**How to avoid:** Two options — (a) add a `rupaHealthUrl` field to `SiteSettings` global and read it server-side before passing to `SuccessScreen` as a prop, or (b) hardcode the URL if the client confirms it and it's stable. Option (a) is preferred for maintainability and is consistent with how `contactFormRecipient` is managed in SiteSettings. The URL needs to be obtained from the client before the plan can finalize this.

**Warning signs:** No Rupa Health link visible on the success screen after submission.

### Pitfall 6: Admin Retry Route Must Verify Admin Auth

**What goes wrong:** The `/api/admin/retry-pb-sync` route is callable by anyone if auth is not checked, allowing unauthenticated callers to trigger PB API calls.

**Why it happens:** Easy to forget auth on internal admin routes.

**How to avoid:** Call `getAuthenticatedAdmin()` at the top of the route handler and return 401 if null. Pattern already established across the portal pages.

### Pitfall 7: Duplicate PB Patient on Retry

**What goes wrong:** Admin retries a failed sync for a client who already has a `practiceBetterId` from a partially-successful first attempt — creating a duplicate PB record.

**Why it happens:** The initial PB call might succeed (PB creates the record) but the `payload.update` to set `practiceBetterId` fails, leaving the client with `syncStatus: 'failed'` but a PB record that exists.

**How to avoid:** The retry route should check if `practiceBetterId` is already set. If it is, skip the PB creation and just update `syncStatus` to `'synced'`. If not, call `createPracticeBetterClient` and set both fields.

---

## Code Examples

### Onboarding Route — Full Skeleton

```typescript
// src/app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPracticeBetterClient } from '@/lib/practice-better'
// reCAPTCHA: either import from lib/recaptcha or inline the pattern from contact/route.ts

const RECAPTCHA_ACTION = 'ONBOARDING_FORM'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goals, labsStatus, firstName, lastName, email, phone, referralCode, recaptchaToken } = body

    // 1. Validate required fields
    if (!goals?.length || !labsStatus || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. reCAPTCHA validation (pattern from contact/route.ts)
    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }
    const recaptchaResult = await createAssessment(recaptchaToken)
    if (!recaptchaResult.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 403 })
    }

    const payload = await getPayload({ config })

    // 3. Optional referral code lookup
    let partnerId: number | null = null
    if (referralCode) {
      // ... same as signup/route.ts
    }

    // 4. Generate password — user never sees this
    const generatedPassword = crypto.randomUUID()

    // 5. Create Payload client
    const client = await payload.create({
      collection: 'clients',
      data: {
        firstName, lastName, email,
        password: generatedPassword,
        phone: phone || undefined,
        goals,
        labsStatus,
        assignedTrainer: partnerId || undefined,
        practiceBetterSyncStatus: 'pending',
        paperworkStatus: 'not_started',
        labStatus: 'not_ordered',
        medicalReviewStatus: 'pending',
      },
    })

    // 6. Optional referral record (try/catch, non-blocking)
    if (partnerId) { /* ... same as signup/route.ts */ }

    // 7. Auto-login
    const token = await payload.login({
      collection: 'clients',
      data: { email, password: generatedPassword },
    })

    // 8. Build response
    const response = NextResponse.json({ success: true, user: { id: client.id, email } }, { status: 201 })
    if (token.token) {
      response.cookies.set('payload-token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    // 9. Non-blocking PB sync
    const clientId = client.id
    createPracticeBetterClient({ firstName, lastName, email })
      .then(async (pbResult) => {
        const p = await getPayload({ config })  // fresh instance in callback
        await p.update({
          collection: 'clients',
          id: clientId,
          data: { practiceBetterId: pbResult.id, practiceBetterSyncStatus: 'synced' },
        })
      })
      .catch(async (err) => {
        console.error('Practice Better sync failed (non-blocking):', err)
        const p = await getPayload({ config })
        await p.update({
          collection: 'clients',
          id: clientId,
          data: { practiceBetterSyncStatus: 'failed' },
        })
      })

    return response

  } catch (error) {
    console.error('Onboarding error:', error)
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
  }
}
```

### GetStartedForm — reCAPTCHA Addition

```typescript
// src/components/onboarding/GetStartedForm.tsx — onSubmit update
const onSubmit = async (data: OnboardingFormData) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey) throw new Error('reCAPTCHA site key not configured')

  const recaptchaToken = await new Promise<string>((resolve, reject) => {
    window.grecaptcha.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha.enterprise.execute(siteKey, {
          action: 'ONBOARDING_FORM',
        })
        resolve(token)
      } catch (err) {
        reject(err)
      }
    })
  })

  const res = await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, recaptchaToken, referralCode: refCode }),
  })
  if (!res.ok) throw new Error('Submission failed')
  setCurrentStep(3)  // show SuccessScreen
}
```

The `refCode` value should be read from URL search params on mount via `useSearchParams()` and stored in component state.

### Admin Portal — FailedPbSyncs Section

```typescript
// AdminPortalContent.tsx addition
// New prop type in portal-types.ts:
interface FailedPbSyncClient {
  id: number
  name: string
  email: string
  createdAt: string
}

// In AdminPortalContent, add a section below recentClients:
function FailedPbSyncs({ clients }: { clients: FailedPbSyncClient[] }) {
  const [retrying, setRetrying] = useState<Record<number, boolean>>({})
  const [retried, setRetried] = useState<Record<number, boolean>>({})

  const handleRetry = async (clientId: number) => {
    setRetrying(prev => ({ ...prev, [clientId]: true }))
    try {
      const res = await fetch('/api/admin/retry-pb-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
      if (res.ok) setRetried(prev => ({ ...prev, [clientId]: true }))
    } finally {
      setRetrying(prev => ({ ...prev, [clientId]: false }))
    }
  }
  // render table...
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server Actions for form submit | Route Handlers (API routes) | Phase 1 decision | Avoids Payload auth cookie failures — GitHub #14656 |
| HMAC-SHA256 for PB auth | OAuth2 Client Credentials | Phase 3 confirmed | `POST /oauth2/token` with `client_credentials` grant |

---

## Open Questions

1. **Rupa Health Store URL**
   - What we know: The success screen needs a real URL. STATE.md notes: "migration to Fullscript in 2026" is a concern. The URL is not in `businessConfig` or `SiteSettings`.
   - What's unclear: Whether the current Rupa Health link is still valid, or whether StrengthRX has migrated to Fullscript.
   - Recommendation: Block the SuccessScreen plan on client confirmation of the URL. Add a `rupaHealthStoreUrl` field to `SiteSettings` global so it can be updated without a deploy. The plan should include a SiteSettings migration to add this field.

2. **`referralCode` in Onboarding Form**
   - What we know: The form currently has no `referralCode` field. The onboarding schema (`onboarding.ts`) does not include it. The signup route reads it from `body.referralCode`.
   - What's unclear: Is the referral code passed via query param (`?ref=XXXX`) and read in the form, or does the user enter it manually?
   - Recommendation: Based on the signup flow pattern, read `?ref=` from the URL on page load via `useSearchParams()` and include it in the API call body as an optional field. Do not add it to the Zod schema (it bypasses user input validation). Update `GetStartedForm.tsx` to capture it on mount.

3. **`dateOfBirth` field requirement**
   - What we know: The `clients` collection has `dateOfBirth: { type: 'date', required: true }`. The onboarding schema does not include DOB.
   - What's unclear: Is DOB collected during onboarding, or is it set later?
   - Recommendation: The `required: true` on DOB in the Payload schema will likely block `payload.create` if DOB is not provided. Either (a) remove `required: true` from the `dateOfBirth` field in `Clients.ts` (with a migration), or (b) accept a default value (null/undefined). Check whether Payload enforces `required` on `date` fields during programmatic `payload.create`. If enforced, the route must either omit the field and see if Payload allows null, or the schema must be relaxed. This needs to be resolved before writing the plan — it may require a Clients.ts schema update + migration.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.x |
| Config file | `vitest.config.mts` |
| Quick run command | `pnpm test:int` |
| Full suite command | `pnpm test` |
| E2E command | `pnpm test:e2e` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTEG-01 | `payload.create` called with correct client fields | unit | `pnpm test:int -- --grep "onboarding route"` | ❌ Wave 0 |
| INTEG-02 | Response has `payload-token` cookie set | unit | `pnpm test:int -- --grep "onboarding route"` | ❌ Wave 0 |
| INTEG-03 | Referral code attribution creates referral record | unit | `pnpm test:int -- --grep "referral"` | ❌ Wave 0 |
| INTEG-04 | Submissions without recaptchaToken return 403 | unit | `pnpm test:int -- --grep "recaptcha"` | ❌ Wave 0 |
| INTEG-05 | `createPracticeBetterClient` called; syncStatus updated | unit | `pnpm test:int -- --grep "pb sync"` | ❌ Wave 0 |
| INTEG-06 | Retry route updates syncStatus to synced on success | unit | `pnpm test:int -- --grep "retry"` | ❌ Wave 0 |
| POST-01 | SuccessScreen renders Rupa Health link | unit/component | `pnpm test:int -- --grep "SuccessScreen"` | ❌ Wave 0 |
| POST-02 | Form navigates to /client-portal after submit | e2e | `pnpm test:e2e` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm test:int`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/int/onboarding-route.int.spec.ts` — covers INTEG-01, INTEG-02, INTEG-03, INTEG-04, INTEG-05
- [ ] `tests/int/retry-pb-sync.int.spec.ts` — covers INTEG-06
- [ ] `tests/int/success-screen.int.spec.tsx` — covers POST-01 (component render test)
- [ ] E2E additions to `tests/e2e/onboarding.e2e.spec.ts` — covers POST-02 (redirect to /client-portal)

---

## Sources

### Primary (HIGH confidence)

All findings are sourced directly from the live codebase — no external research required for this phase.

- `src/app/api/signup/route.ts` — Reference for Payload create + login + referral + cookie pattern
- `src/app/api/contact/route.ts` — Reference for reCAPTCHA Enterprise validation pattern
- `src/lib/practice-better.ts` — Phase 3 PB library; `createPracticeBetterClient` signature and error types
- `src/collections/Clients.ts` — Field names, types, and access control for client creation
- `src/collections/Referrals.ts` — Referral record structure
- `src/lib/schemas/onboarding.ts` — Form schema: `{ goals, labsStatus, firstName, lastName, email, phone }`
- `src/components/onboarding/GetStartedForm.tsx` — Current form submission flow; missing reCAPTCHA + referralCode
- `src/components/onboarding/SuccessScreen.tsx` — TODO placeholder for Rupa Health link
- `src/app/(portals)/admin-portal/AdminPortalContent.tsx` — Existing admin portal structure
- `src/app/(portals)/admin-portal/page.tsx` — Payload query patterns for admin data
- `src/lib/portal-types.ts` — `AdminPortalData` type requiring extension
- `src/lib/auth.ts` — `getAuthenticatedAdmin()` for retry route auth
- `src/app/(frontend)/(marketing)/contact/page.tsx` — Client-side reCAPTCHA execute pattern
- `src/types/recaptcha.d.ts` — `window.grecaptcha` type declarations

### Secondary (MEDIUM confidence)

- STATE.md decision: "PB call should be non-blocking" — architectural constraint from project decisions log
- STATE.md decision: "Use Route Handler pattern (not Server Action)" — avoids Payload auth cookie failure (GitHub #14656)
- STATE.md concern: "Rupa Health store URL must be confirmed before success screen is built (migration to Fullscript in 2026)"

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries already installed and in use
- Architecture: HIGH — direct reference implementations exist in codebase
- Pitfalls: HIGH — derived from existing code structure and documented STATE.md decisions
- Open questions: HIGH confidence that these ARE open (not speculative) — DOB required field, Rupa Health URL, referral code source

**Research date:** 2026-04-03
**Valid until:** Stable — no external APIs in scope; only changes if Payload or Next.js version bumps occur (estimate 90 days)
