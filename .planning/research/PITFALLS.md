# Pitfalls Research

**Domain:** Multi-step onboarding form with external API integration (Next.js 15 + Payload CMS 3 + Practice Better)
**Researched:** 2026-04-03
**Confidence:** MEDIUM — Practice Better API docs are behind auth walls; gotchas inferred from the Rollout integration guide, authentication pattern research, and direct codebase analysis. Core Next.js/Payload pitfalls are HIGH confidence from official sources.

---

## Critical Pitfalls

### Pitfall 1: Partial Creation — Payload Client Created, Practice Better Call Fails

**What goes wrong:**
The onboarding API route creates a Payload `clients` record successfully, then calls the Practice Better API to create the patient record. The Practice Better call fails (network timeout, bad credentials, rate limit, duplicate email). The Payload record now exists but has no corresponding Practice Better patient ID. The user gets an error screen, retries, and hits a duplicate email error from Payload. They cannot complete onboarding and have no path forward.

**Why it happens:**
The existing `src/app/api/signup/route.ts` follows a sequential create-then-augment pattern without compensation logic. Adding a Practice Better call to the end of this chain extends the failure surface without adding any rollback path. Since Payload's Local API does not wrap multi-step operations in a distributed transaction, there is no automatic undo if the external call fails.

**How to avoid:**
Store the Practice Better patient ID as a nullable field on the Clients collection (`practiceBetterPatientId`). Treat its absence as an "onboarding incomplete" state that can be retried separately. On the API route:
1. Create Payload client first (fast, reliable, owned system)
2. Attempt Practice Better creation — if it fails, log the error, set a `practiceBetterSyncStatus: 'pending'` field, and still return success to the user
3. Implement a background retry mechanism (or admin-triggerable re-sync) for clients with `practiceBetterSyncStatus: 'pending'`

Never block the user's ability to proceed based on a third-party API call they have no control over.

**Warning signs:**
- Error handling in Practice Better call throws synchronously and returns 500 to the user
- No `practiceBetterPatientId` field exists on the Clients schema when development starts
- No `practiceBetterSyncStatus` field on the Clients schema to track sync state

**Phase to address:**
Phase that implements the Practice Better API integration. Must design the schema additions and async/compensating pattern before writing any API call code.

---

### Pitfall 2: Multi-Step Form State Lost on Browser Back / Tab Refresh

**What goes wrong:**
User fills in goal selection (step 1), lab status (step 2), reaches contact info (step 3), hits the browser back button or accidentally refreshes. All form state is gone. They start over. A percentage of users will drop off at this friction point; telehealth onboarding users are often older and less tolerant of confusing re-entry.

**Why it happens:**
React component state (`useState`) does not survive unmount. If each step is a separate route segment (e.g., `/onboard/goals`, `/onboard/labs`, `/onboard/contact`), navigating away unmounts the component and destroys state. Even within a single page, a hard refresh destroys in-memory state. Developers default to `useState` because it's simple, then discover the problem during QA when someone clicks back.

**How to avoid:**
Choose one of these architectures and commit to it before writing a single form step:

- **Single-page stepper with local state** — All steps render in one page at `/onboard`; a `currentStep` state controls which step is visible. State is in-memory only, survives forward/back within the same page session, but not a hard refresh. Simplest option; acceptable for a 3-step form if steps complete quickly.

- **URL-encoded state (nuqs)** — Use `nuqs` library for type-safe URL query parameter state. Each field value is encoded in the URL. Back button restores URL-encoded values. Survives hard refresh if user copies the URL. Slightly more complexity; URL becomes long with many fields.

- **sessionStorage persistence** — Serialize form state to `sessionStorage` on every change; rehydrate on mount. Survives browser back and tab refresh within the same session. Does not survive closing the tab. Straightforward middle ground.

For a 3-step form (goals, labs, contact), the single-page stepper with sessionStorage backup is the least risky approach given the existing codebase architecture.

**Warning signs:**
- Steps implemented as separate route segments (`/onboard/step-1`, etc.) without shared state
- No state serialization or URL encoding in place
- No explicit decision documented about state persistence strategy before implementation starts

**Phase to address:**
Phase that scaffolds the onboarding form UI. Architecture decision must be documented and agreed before any step components are built.

---

### Pitfall 3: Auth Cookie Not Set After Programmatic Login in API Route

**What goes wrong:**
The onboarding form creates a Payload client record and calls `payload.login()`, but the cookie is never set on the browser. The user hits the client portal and is shown a login screen instead of their new account. This is intermittent — it works locally but fails in specific deployment configurations (Cloudflare Workers, certain edge runtimes, or when using server actions vs. API routes inconsistently).

**Why it happens:**
The current signup route at `src/app/api/signup/route.ts` sets the cookie correctly via `NextResponse.cookies.set()` (line 112). This pattern works because it's a standard Next.js API route. The pitfall occurs if the new onboarding endpoint is implemented as a **Next.js server action** instead of an API route — server actions have known issues with Payload CMS cookie auth in some environments (confirmed open GitHub issue: `payloadcms/payload#14656` — "Server Actions lose authentication in Cloudflare Workers environment"). Additionally, if `payload.login()` is called via Local API without passing a Response object, Payload cannot set the cookie; you must capture `token.token` from the return value and set it manually.

**How to avoid:**
- Implement the final onboarding submission as a **standard Next.js API route** (`src/app/api/onboard/route.ts`), not a server action. Mirror the exact cookie pattern from the existing `signup/route.ts`.
- After creating the client, call `payload.login()` via Local API, capture `token.token`, and set it explicitly via `response.cookies.set('payload-token', token.token, {...})`.
- After the API route returns, call `router.refresh()` on the client to sync server components with the new auth state.
- Do not use `cookies()` from `next/headers` inside this route — it conflicts with the `NextResponse` cookies API pattern already established.

**Warning signs:**
- Onboarding submission implemented as a `'use server'` server action
- No explicit `response.cookies.set('payload-token', ...)` call in the onboarding API route
- `router.refresh()` not called client-side after successful submission response

**Phase to address:**
Phase that implements the onboarding form submission API route. Must replicate the exact auth cookie pattern from `signup/route.ts` before adding Practice Better integration on top.

---

### Pitfall 4: Referral Code Race Condition — Two Users Submit Same Code Simultaneously

**What goes wrong:**
Two users both enter the same referral code during concurrent onboarding sessions. Both hit `/api/onboard` within milliseconds of each other. Both `payload.find()` queries return the partner as valid. Both proceed to create Referral records linked to the same partner and same potential client duplicates. The partner's referral count inflates; duplicate or orphaned Referral records appear in the admin.

**Why it happens:**
The existing referral lookup in `signup/route.ts` (lines 19-36) is a read-then-write pattern with no locking between the check and the creation. Under concurrent load, both requests pass the validity check before either has written a Referral record. PostgreSQL allows this unless explicit row-level locking or a unique constraint prevents it.

**How to avoid:**
- Add a **unique constraint** on the `client` field of the Referrals collection — each client can have at most one referral record. Payload enforces this at the database level, so a duplicate insert fails cleanly and can be caught.
- The error should be caught gracefully (swallowed or logged) rather than failing the entire onboarding, consistent with the existing pattern on line 80-83 of `signup/route.ts`.
- This is a low-probability event for early-stage scale, but the schema-level constraint costs nothing and prevents data corruption.

**Warning signs:**
- No `unique: true` constraint on `client` field in the Referrals collection
- Referral creation errors swallowed with `console.error` but no deduplication guard
- `publicId` generation uses `Math.random()` without collision checking (existing pattern, line 59 of `signup/route.ts`)

**Phase to address:**
Phase that adapts the existing signup flow for the new onboarding route. Add the unique constraint to Referrals when creating the new API route — do not wait for it to become a problem.

---

### Pitfall 5: Practice Better API Is Still in Beta — Undocumented Breaking Changes

**What goes wrong:**
Practice Better's Open API is explicitly labeled "Beta" in all help documentation as of the research date. Beta APIs can change field names, deprecate endpoints, alter authentication schemes, or introduce new required fields without following standard semver guarantees. An update to the API could silently break patient creation with no advance notice, failing all new onboarding attempts.

**Why it happens:**
Beta APIs are not production-stable by definition. The authentication scheme has already been documented inconsistently across third-party sources — one source describes HMAC (`X-PB-API-KEY` + `X-PB-SIGNATURE` headers) while another describes OAuth 2.0 Bearer tokens. This inconsistency indicates the auth mechanism may have changed during the beta period and older documentation was not updated.

**How to avoid:**
- Before building the integration, obtain actual API credentials from Practice Better and test the auth flow directly. Do not rely on third-party integration guides for authentication scheme — verify against the official Swagger docs at `api-docs.practicebetter.io`.
- Wrap all Practice Better API calls in a single, isolated service module (`src/services/practiceBetter.ts`). All changes to the integration are localized there; the onboarding API route calls the service, not the API directly.
- Store the Practice Better API version in an environment variable (`PRACTICE_BETTER_API_VERSION`) so version pinning is explicit.
- Implement the `practiceBetterSyncStatus` field approach (from Pitfall 1) so an API change does not block onboarding — it degrades gracefully.

**Warning signs:**
- Practice Better API calls scattered directly in the onboarding route handler rather than behind a service abstraction
- No environment variable for API version
- Integration built against third-party PHP tutorial rather than verified against the actual API docs

**Phase to address:**
Pre-implementation spike: verify Practice Better API auth scheme and client creation endpoint against live credentials before writing the integration phase. This should gate the integration phase of the roadmap.

---

### Pitfall 6: Duplicate Email Handling — Payload Throws, Practice Better Also Has Unique Email Constraint

**What goes wrong:**
A user starts onboarding, gets partway through, closes the tab. They return and start again with the same email. The Payload `clients` create call fails with a duplicate key error. But the error surface is different in onboarding (no password field yet, email-first flow) vs. the existing signup page. Users see a generic "Failed to create account" message rather than "You already have an account — log in."

There is a second edge: if Payload accepts the create (e.g., the previous attempt partially failed), but Practice Better already has a patient with that email, Practice Better will return a 409 or similar error. Now you have a Payload client with no Practice Better patient ID, and the reverse — a Practice Better patient with no linked Payload client.

**Why it happens:**
The existing duplicate email check in `signup/route.ts` (lines 126-130) is a broad string match on `error.message.includes('duplicate')` — it works for the Payload duplicate but will not differentiate a Practice Better duplicate conflict. The onboarding flow's email-first multi-step design means the email is collected mid-flow, not at submission time, creating a gap between validation and use.

**How to avoid:**
- At the email collection step (step 3 of onboarding), validate the email uniqueness against Payload **before** proceeding to the submission step. A lightweight `payload.find({ collection: 'clients', where: { email: { equals: email } } })` check in the step's onChange or onBlur is sufficient. Return a specific, actionable error: "An account with this email exists. Log in instead."
- For Practice Better duplicates: the service module should detect 409 responses and attempt a lookup to retrieve the existing patient ID rather than treating it as a hard failure.
- Do not rely solely on the catch-all error handler in the API route for differentiated messaging.

**Warning signs:**
- No email uniqueness pre-check at the email input step
- Practice Better API error responses not mapped to specific error types
- Generic "Failed to create account. Please try again." message returned for duplicate email (same pattern as current `signup/route.ts` line 134)

**Phase to address:**
Phase that implements the contact info step (email collection) and the onboarding API route submission logic.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Calling Practice Better API inline in the API route without a service wrapper | Ships faster | Any API change requires hunting through the route; impossible to mock in tests | Never — one service file costs 30 minutes |
| Storing referral code in component state only | Simple implementation | Lost on back-navigation; referral attribution drops off | Never — URL param or sessionStorage costs nothing |
| Not adding `practiceBetterPatientId` to Clients schema from day one | Avoids schema migration | Must do a migration later anyway; cannot track sync state without it | Never — add the field in the same PR as the integration |
| Using `Math.random()` for `publicId` generation (inherited pattern) | Works at current scale | ~0.4% collision probability per 9000 IDs; no uniqueness check | Acceptable for MVP if a unique constraint exists as the safety net |
| Skipping reCAPTCHA on the onboarding form | Avoids complexity | Medical onboarding is a high-value bot target (spam patient records in Practice Better) | Never for production — existing reCAPTCHA setup is already in the codebase |
| Hardcoding the Rupa Health store URL | Works immediately | URL changes require a code deploy; admin cannot update it | Acceptable for MVP if stored in an env variable; never hardcode directly in component |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Practice Better API | Assuming HMAC auth from older docs — newer OAuth2 Bearer token flow may apply | Verify against live `api-docs.practicebetter.io` with actual credentials before writing auth code |
| Practice Better API | Not handling the "invite vs. create" distinction — the API may send an invitation email to the patient, which is unexpected during programmatic creation | Check API endpoint behavior: does `POST /clients` send an email? If yes, determine if that email conflicts with your own onboarding confirmation email |
| Practice Better API | Treating a 4xx response as a hard failure that blocks onboarding | Map 4xx to a `practiceBetterSyncStatus: 'failed'` state; let onboarding succeed; retry separately |
| Practice Better API | Not storing the returned patient ID (`id` or `client_id` from the response) before the response variable goes out of scope | Write the returned ID to the Clients record atomically with the create call; never discard it |
| Payload Local API | Calling `payload.login()` in a server action instead of an API route | Use the API route pattern from `signup/route.ts`; set cookie via `NextResponse.cookies.set()` |
| Payload Local API | Multiple `getPayload({ config })` calls within one request lifecycle | Cache the payload instance at module level or use the singleton pattern; not doing this is an existing concern in CONCERNS.md |
| Rupa Health | Building API integration "just in case" | Out of scope per PROJECT.md — link handoff only. Store the URL in an env variable; do not build API calls |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Synchronous Practice Better API call blocks response | Onboarding submission hangs for 2-5 seconds during PB API latency; user sees spinner; some users resubmit | Treat PB call as fire-and-forget with status tracking, or move to background job | From day one — even one slow call at P99 is user-facing |
| Multiple `getPayload()` instantiations per request | Connection pool exhaustion under load; `>50 concurrent users` per CONCERNS.md | Module-level payload singleton (existing concern) — fix before shipping onboarding with external API calls | ~30-50 concurrent onboarding sessions |
| `payload.find()` for referral code lookup without index | Slow partner lookup as Partners table grows | `referralCode` field already has `index: true` in Partners collection — preserve this; do not add new lookup fields without indexes | ~1000+ partner records |
| No rate limiting on `/api/onboard` endpoint | Bot flood creates thousands of fake Payload clients and Practice Better patients; PB API rate limit triggers, blocking legitimate users | Add rate limiting middleware at the route level; reCAPTCHA on the form is a prerequisite | From day one for production |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing Practice Better API key/secret in client-side code | Full Practice Better account compromise; attacker can create/delete all patients | API calls must be server-side only (API route); credentials only in server environment variables |
| Not sanitizing user inputs before forwarding to Practice Better API | Stored XSS or injection in Practice Better patient records; violates BAA obligations | Sanitize all fields before constructing the PB API payload; use a schema validator (Zod) on the server |
| Referral code enumeration via `/api/verify-referral` (existing bug) | Attacker brute-forces valid partner codes; inflates referral counts with fake signups | Rate limit `/api/verify-referral`; this is an existing concern in CONCERNS.md but becomes higher risk when onboarding funnels traffic to it |
| No CSRF protection on the onboarding submit endpoint | CSRF attack creates fake patient records if a logged-in admin visits a malicious page | Onboarding is for unauthenticated users (no auth cookie yet), so CSRF risk is lower; still add `SameSite: lax` cookie and verify Origin header |
| Logging PHI (name, DOB, email) in server console on error | HIPAA exposure in log aggregation services | Never log patient data in error handlers; log event types and IDs only |
| Storing Practice Better patient ID without access controls | Any authenticated Payload user can read PB patient IDs via the API | Mark `practiceBetterPatientId` with `access: { read: ({ req }) => isAdmin(req) }` in the Clients collection |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress indicator across steps | Users don't know how many steps remain; abandonment increases at unknown-length flows | Show "Step X of 3" with visual progress bar; telehealth patients are often anxious |
| Submitting to Practice Better triggers an unexpected invitation email to the patient | User receives two emails (onboarding confirmation + PB invite); confusing branding | Determine if PB API's create endpoint sends email; if yes, configure to suppress or ensure branding is consistent |
| Referral code field not pre-populated from URL parameter | Partner shares a referral link with `?ref=CODE`; user lands on onboarding; code is not auto-filled; user doesn't know to enter it | Read `?ref=` query param on page load and pre-populate the referral code field (read-only or editable) |
| Generic error on Practice Better failure returns "something went wrong" | User thinks their signup failed; they try again; create a duplicate Payload account | If Payload creation succeeded but PB failed, show success with a specific message: "Your account is created. Our team will complete your profile setup within 24 hours." |
| No loading state during the multi-second API submission | User double-clicks submit; creates two Payload clients | Disable submit button immediately on first click; show spinner; prevent double submission at the UI level |
| Rupa Health link opens in same tab | User navigates away from the portal before completing lab ordering; loses context | Open Rupa Health link in a new tab (`target="_blank"` with `rel="noopener noreferrer"`) |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Practice Better integration:** Appears done when `payload.create()` succeeds — verify the PB patient ID was actually stored on the Clients record
- [ ] **Referral attribution:** Appears done when Referral record is created — verify the `trainer` relationship points to the correct partner and the `client` relationship points to the new client
- [ ] **Auth cookie after onboarding:** Appears done when redirect to portal occurs — verify the `payload-token` cookie is present in browser DevTools under Application > Cookies
- [ ] **Email uniqueness check:** Appears done when server returns 409 on duplicate — verify the error message is user-actionable ("Log in instead") not generic ("Please try again")
- [ ] **Referral code from URL:** Appears done when field appears pre-filled — verify the code is still submitted even if user doesn't touch the field (uncontrolled vs controlled input edge case)
- [ ] **reCAPTCHA on onboarding form:** Appears done when contact form works — verify the new onboarding API route validates the reCAPTCHA token, not just the contact form route
- [ ] **Practice Better sync status field:** Appears done when schema migration runs — verify failed PB calls actually write `practiceBetterSyncStatus: 'failed'` and don't silently stay as `null`
- [ ] **sessionStorage state rehydration:** Appears done when back button works in dev — verify it works after a hard refresh (Cmd+Shift+R) in production build

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Payload client exists, no PB patient | LOW | Query all clients where `practiceBetterPatientId IS NULL` AND `createdAt > onboarding_launch_date`; build admin action to re-trigger PB creation for each; or build admin button in Payload admin UI |
| Duplicate Referral records created | LOW | Query duplicates via `client` field; keep the first; delete subsequent records; add unique constraint to prevent recurrence |
| Auth cookie not set — user stuck logged out | LOW | User logs in via `/login` with credentials created during onboarding; this path already exists |
| Practice Better API auth scheme changed | MEDIUM | All new patient creations fail silently (if using `practiceBetterSyncStatus` pattern); update service module auth headers; re-run sync for all `status: 'failed'` records |
| Multi-step form state lost — user abandoned mid-flow | LOW (per user) | No recovery needed per user; fix the state persistence architecture; consider adding email capture at step 1 for re-engagement |
| Bot flood created fake Payload + PB records | HIGH | Delete fake clients from Payload (manual or scripted); contact Practice Better support to delete fake patients; implement rate limiting immediately; audit referral records for fake attributions |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Partial creation (Payload created, PB fails) | Practice Better integration phase — schema design step | Clients collection has `practiceBetterPatientId` and `practiceBetterSyncStatus` fields before any API call code is written |
| Multi-step form state loss | Onboarding form UI phase — architecture decision | State persistence strategy documented and implemented before second step is built |
| Auth cookie not set after programmatic login | Onboarding API route phase | Manual test: complete onboarding, check `payload-token` cookie exists, refresh portal page without redirect |
| Referral race condition | Onboarding API route phase — schema migration | Unique constraint on `client` field in Referrals collection verified in PostgreSQL |
| Practice Better API beta instability | Pre-integration spike (before integration phase begins) | Auth flow verified against live credentials; client creation endpoint returns expected shape |
| Duplicate email mid-flow | Contact info step phase | Email field validates against Payload on blur; returns "Log in instead" message for existing accounts |
| No reCAPTCHA on onboarding | Onboarding API route phase | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` consumed on form; token validated server-side in `/api/onboard` |
| PHI logging in error handlers | Onboarding API route phase | Code review checklist item: no `console.log(email)`, `console.log(body)`, or similar in catch blocks |
| Unexpected PB invitation email | Practice Better integration spike | Manually test PB client creation in sandbox; document whether invite email fires; decide suppression strategy |

---

## Sources

- Practice Better API integration guide (auth headers, endpoint structure): [How to build a Practice Better API integration - Rollout](https://rollout.com/integration-guides/practice-better/sdk/step-by-step-guide-to-building-a-practice-better-api-integration-in-php)
- Practice Better reading/writing data: [Reading and Writing Data Using the Practice Better API - Rollout](https://rollout.com/integration-guides/practice-better/reading-and-writing-data-using-the-practice-better-api)
- Practice Better API beta status: [Getting Started with the Practice Better API (Beta)](https://help.practicebetter.io/hc/en-us/articles/16637584053275-Getting-Started-with-the-Practice-Better-API-Beta)
- Payload CMS cookie auth in Next.js: [Payload CMS Cookie Auth: 7 Troubleshooting Secrets - Build with Matija](https://www.buildwithmatija.com/blog/payload-cms-cookie-auth-nextjs)
- Payload server action auth loss (Cloudflare): [Server Actions lose authentication in Cloudflare Workers - GitHub Issue #14656](https://github.com/payloadcms/payload/issues/14656)
- Payload auth operations and cookie handling: [Authentication with Payload CMS and Next.js - DEV Community](https://dev.to/aaronksaunders/authentication-with-payload-cms-and-nextjs-client-vs-server-approaches-c5a)
- Multi-step form state management patterns: [Managing State in a multi-step form - Bird Eats Bug](https://birdeatsbug.com/blog/managing-state-in-a-multi-step-form)
- External API transaction rollback (Sagas pattern): [Handling external API errors: A transactional approach - Thoughtbot](https://thoughtbot.com/blog/handling-external-api-errors-a-transactional-approach)
- Race condition vulnerabilities in APIs: [Race Condition Vulnerabilities in APIs - APIsec](https://www.apisec.ai/blog/race-condition-vulnerabilities-in-apis)
- Next.js URL state management (nuqs): [Stop Fighting Next.js Search Params: Use nuqs - DEV Community](https://dev.to/tphilus/stop-fighting-nextjs-search-params-use-nuqs-for-type-safe-url-state-2a0h)
- Codebase analysis: `src/app/api/signup/route.ts`, `src/collections/Clients.ts`, `src/collections/Referrals.ts`, `.planning/codebase/CONCERNS.md`

---
*Pitfalls research for: StrengthRX v1.0 UserOnboarding milestone*
*Researched: 2026-04-03*
