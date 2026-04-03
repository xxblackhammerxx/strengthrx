# Phase 3: Practice Better API Spike - Research

**Researched:** 2026-04-03
**Domain:** Practice Better REST API — authentication, patient creation endpoint, field schema, email behavior
**Confidence:** MEDIUM — Swagger spec confirms OAuth2 + endpoint path; field schema is unverified (swagger truncated); invite email behavior is unknown

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTEG-05 | Practice Better patient creation calls real API during onboarding | Auth scheme confirmed (OAuth2 Client Credentials via swagger.json); endpoint confirmed (POST /consultant/records via swagger.json); required fields partially verified (first_name, last_name, email confirmed pattern; exact schema truncated); working lib/practice-better.ts module must be written and manually tested against live API |
</phase_requirements>

---

## Summary

This is a spike phase with a single deliverable: a working `src/lib/practice-better.ts` module that authenticates against the real Practice Better API and creates a patient record, returning the patient ID. The spike exists because the milestone research found conflicting auth information across sources, and the exact field names for patient creation were not fully documented in any public source.

**Auth conflict resolved:** The Swagger spec at `https://api-docs.practicebetter.io/swagger.json` is the authoritative source and confirms OAuth2 Client Credentials flow. The HMAC-SHA256 pattern documented in the Rollout PHP integration guide refers to an older or alternative v2 API. The Swagger spec uses `POST /oauth2/token` with `grant_type=client_credentials` and Bearer token auth on all protected endpoints. The base URL is `https://api.practicebetter.io` (no version prefix in the Swagger spec; the `/v2/` and `/v1/` patterns appear in third-party guides only). The patient creation endpoint is `POST /consultant/records`.

**What remains unknown:** The exact field names and which fields are required in the `ClientRecordCreateFragment` request body cannot be determined from public sources — the Swagger definitions section is truncated before reaching the schema. The invite email behavior is undocumented in any publicly accessible source. Both of these must be verified by calling the live API with the project's actual credentials.

**Primary recommendation:** Implement the OAuth2 token fetch and `POST /consultant/records` call using the confirmed patterns. Use a manual spike script to test against the real API, then inspect the Swagger UI at `https://api-docs.practicebetter.io/#/` while authenticated to read the full `ClientRecordCreateFragment` schema. Document findings before writing the final library.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Native `fetch` | Node built-in | HTTP calls to Practice Better API | Node 18+ / Next.js 15 include native fetch. No additional HTTP client needed for a single external API. |
| `crypto` | Node built-in | HMAC-SHA256 (kept as fallback) | Part of Node.js stdlib — zero install cost. May be needed if auth scheme needs to fall back to X-PB headers. |

### No Additional Packages Required

The project already has everything needed:
- `vitest` for testing
- `zod@^3.x` for validating API responses
- Native `fetch` for HTTP

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `fetch` | `axios` | Axios adds ~13KB for no meaningful gain over native fetch with a single external API target |
| Module-level token cache | Redis / external cache | Overkill for a single-tenant server-side module; module-level variable with expiry timestamp is the standard pattern |

---

## Confirmed API Details (HIGH confidence from Swagger spec)

### Authentication: OAuth2 Client Credentials

**Confirmed by:** `https://api-docs.practicebetter.io/swagger.json` — security definitions section.

```
POST https://api.practicebetter.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

Response contains an access token. All protected endpoints require:
```
Authorization: Bearer {access_token}
```

**Auth scheme in Swagger:** `oauth2` type, `clientCredentials` flow, token URL `/oauth2/token`, required scopes `read` and `write`.

**Why not HMAC-SHA256:** The Rollout PHP guide documenting `X-PB-API-KEY` / `X-PB-TIMESTAMP` / `X-PB-SIGNATURE` headers references a v2 base URL (`https://api.practicebetter.io/v2/`) and was last substantively updated in 2023. The Swagger spec is the canonical machine-readable API contract. When they conflict, the Swagger spec wins. The user's API key from Practice Better settings is the `client_id` (or `client_secret`); the exact mapping must be confirmed with the live credential response.

**Note on API key vs OAuth credentials:** Practice Better's help docs describe generating an "API key and secret" from Settings. These map to `client_id` and `client_secret` in the OAuth2 client credentials flow. The Swagger confirms this is the correct grant type — no user-facing redirect (authorization code flow) is involved.

### Patient Creation Endpoint

**Confirmed by:** `https://api-docs.practicebetter.io/swagger.json` — `POST /consultant/records`.

```
POST https://api.practicebetter.io/consultant/records
Authorization: Bearer {access_token}
Content-Type: application/json

{body: ClientRecordCreateFragment}
```

Response: `ClientRecord` (200 OK) — contains the created patient record including its ID.

**Base URL:** `https://api.practicebetter.io` (no `/v2/` or `/v1/` prefix on this endpoint per the Swagger spec).

### Rate Limits (MEDIUM confidence — from third-party sources, not Swagger)

- 5 requests/second
- 20-request burst
- 10,000 requests/day

These were documented in the milestone stack research from third-party integration guides. Not confirmed in the Swagger spec (which was truncated before reaching any rate limit documentation).

---

## Unresolved Questions Requiring Live API Testing

### 1. Exact Required Fields for `ClientRecordCreateFragment`

**What we know:** The Swagger spec defines `POST /consultant/records` with a required body parameter referencing `ClientRecordCreateFragment`. The definitions section was truncated and did not include the schema.

**Best hypothesis (LOW confidence):** Based on Practice Better's own UI fields and standard EHR patterns across multiple third-party integration schemas:
- `first_name` (string, likely required)
- `last_name` (string, likely required)
- `email` (string, likely required)
- `phone` (string, optional)
- `date_of_birth` (string, format unknown — could be ISO 8601 `YYYY-MM-DD`)

**How to verify:** Two methods:
1. Navigate to `https://api-docs.practicebetter.io/#/` while logged in as a Practice Better account holder — the Swagger UI renders the full interactive schema including `ClientRecordCreateFragment` definitions. Inspect the "Try it out" form to see all fields and which are marked required.
2. Send a minimal POST with only `{ "email": "...", "first_name": "...", "last_name": "..." }` and inspect the 422/400 error body — Practice Better will return validation errors listing missing required fields.

### 2. Invite Email Behavior

**What we know:** Practice Better's UI documentation describes two separate flows — "Add client" (creates a record, no email) vs "Invite client" (sends a portal invitation email). The API endpoint `POST /consultant/records` most likely maps to the "Add" flow, not the "Invite" flow.

**Risk:** If `POST /consultant/records` automatically sends an invitation email to the patient, the patient receives a Practice Better portal invite during StrengthRX onboarding — confusing branding, unexpected communication. This could conflict with a future onboarding confirmation email from StrengthRX itself.

**How to verify:** During the spike, create a test patient record via the API using a test email address (one you control). Monitor whether an invitation email arrives. If yes, check the `ClientRecordCreateFragment` schema for a `send_invite` or `skip_invitation` boolean field.

### 3. Token Lifespan

**What we know:** Not documented in any accessible public source.

**Implementation decision:** Implement a module-level token cache with expiry. Set expiry to `(token.expires_in - 60)` seconds if the response includes `expires_in`. If not, default to 3600 seconds (1 hour). This is the standard defensive pattern for OAuth2 client credentials.

### 4. API Key vs Client ID Mapping

**What we know:** Practice Better generates an "API key" and "secret" from their settings UI. The OAuth2 grant uses `client_id` and `client_secret`. These almost certainly map 1:1, but the exact parameter names in the token request must be confirmed with a live test.

**Fallback:** If `client_id` / `client_secret` are rejected, try `api_key` / `api_secret` as form field names in the token request.

---

## Architecture Patterns

### Recommended File: `src/lib/practice-better.ts`

This is a server-only utility module. It must never be imported in client components. Following the existing `src/lib/` pattern (e.g., `src/lib/auth.ts`, `src/lib/prescription-states.ts`).

**File location:** `src/lib/practice-better.ts`

**Module responsibilities:**
1. Fetch and cache an OAuth2 access token
2. Expose a `createPracticeBetterClient()` function that POSTs to `/consultant/records`
3. Return the created patient's ID
4. Throw typed errors that the caller (Phase 4's `/api/onboarding`) can catch and map to sync status

### Pattern 1: OAuth2 Token with Module-Level Cache

```typescript
// src/lib/practice-better.ts
// NOTE: Server-only. Do not import in client components.

const PB_BASE_URL = 'https://api.practicebetter.io'

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  const now = Date.now() / 1000
  if (cachedToken && now < tokenExpiresAt) return cachedToken

  const response = await fetch(`${PB_BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PRACTICE_BETTER_CLIENT_ID!,
      client_secret: process.env.PRACTICE_BETTER_CLIENT_SECRET!,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Practice Better token fetch failed ${response.status}: ${body}`)
  }

  const data = await response.json()
  cachedToken = data.access_token
  // Default to 55-minute expiry if expires_in not provided
  tokenExpiresAt = now + (data.expires_in ? data.expires_in - 60 : 3300)
  return cachedToken!
}
```

### Pattern 2: `createPracticeBetterClient` Function Signature

```typescript
// Source: Swagger spec (confirmed endpoint); field names are hypothesized until spike confirms them

export interface PracticeBetterClientInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string  // Verify format: 'YYYY-MM-DD' or 'MM/DD/YYYY'
}

export interface PracticeBetterClientResult {
  id: string  // The Practice Better patient ID — store in Clients.practiceBetterId
}

export async function createPracticeBetterClient(
  input: PracticeBetterClientInput,
): Promise<PracticeBetterClientResult> {
  const token = await getAccessToken()

  const response = await fetch(`${PB_BASE_URL}/consultant/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // FIELD NAMES MUST BE VERIFIED AGAINST LIVE SWAGGER OR API ERROR RESPONSE
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      ...(input.phone && { phone: input.phone }),
      ...(input.dateOfBirth && { date_of_birth: input.dateOfBirth }),
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      `Practice Better client creation failed ${response.status}: ${JSON.stringify(error)}`,
    )
  }

  const record = await response.json()
  // Verify the response shape — the ID field name may differ (id, _id, client_id, record_id)
  const id = record.id ?? record._id ?? record.client_id ?? record.record_id
  if (!id) throw new Error(`Practice Better response missing ID: ${JSON.stringify(record)}`)
  return { id: String(id) }
}
```

### Pattern 3: Spike Test Script

The recommended way to verify the API before writing the full library is a standalone Node.js script run locally with real credentials. This is not a vitest test — it hits the live API.

```typescript
// scripts/pb-spike.ts — run with: npx tsx scripts/pb-spike.ts
// DELETE this file before shipping Phase 4

import 'dotenv/config'

const PB_BASE_URL = 'https://api.practicebetter.io'

async function spike() {
  // Step 1: Fetch token
  console.log('Fetching token...')
  const tokenResponse = await fetch(`${PB_BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PRACTICE_BETTER_CLIENT_ID!,
      client_secret: process.env.PRACTICE_BETTER_CLIENT_SECRET!,
    }),
  })
  const tokenData = await tokenResponse.json()
  console.log('Token response:', JSON.stringify(tokenData, null, 2))

  if (!tokenData.access_token) {
    console.error('No access_token in response. Check credential field names.')
    return
  }

  // Step 2: Create a test patient
  console.log('\nCreating test patient...')
  const createResponse = await fetch(`${PB_BASE_URL}/consultant/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: 'Test',
      last_name: 'Spike',
      email: 'spike-test@example.com',  // USE A TEST EMAIL YOU CONTROL
    }),
  })
  const createData = await createResponse.json()
  console.log('Create response status:', createResponse.status)
  console.log('Create response body:', JSON.stringify(createData, null, 2))
}

spike().catch(console.error)
```

### Anti-Patterns to Avoid

- **Hard-coding `X-PB-API-KEY` HMAC headers:** The Swagger spec shows OAuth2. HMAC is documented only in a third-party PHP guide that may be outdated. Start with OAuth2.
- **Calling `/v2/clients`:** This endpoint path appears only in third-party guides. The Swagger spec confirms `/consultant/records`. Use the Swagger-confirmed path.
- **Ignoring token caching:** Fetching a new token on every `createPracticeBetterClient()` call will hit rate limits quickly and adds 100-200ms latency to every onboarding submission. Cache the token.
- **Throwing on non-fatal PB errors:** The Phase 3 library should throw, but Phase 4's `onboarding/route.ts` should catch and set `practiceBetterSyncStatus: 'failed'` rather than failing the user's onboarding.
- **Logging patient data:** Never `console.log` the input object or response body in production code — it contains PHI (name, email, DOB).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OAuth2 token refresh | Custom token management library | Module-level cache variable with `Date.now()` expiry check | OAuth2 client credentials is two lines of fetch — no library needed at this scale |
| HTTP client | Custom retry/timeout wrapper | Native `fetch` with simple try-catch | One API endpoint, single mutation — no polling, no complex retry logic needed in Phase 3 |
| API response validation | Custom type guard | `zod` schema matching project convention | Already installed; parse the response shape to get type safety on the ID field |

**Key insight:** The Practice Better integration is a single POST operation per onboarding. Libraries like `openapi-typescript-codegen` are overkill for one endpoint. A 50-line module is the right solution.

---

## Common Pitfalls

### Pitfall 1: Auth Scheme Mismatch (HMAC vs OAuth2)

**What goes wrong:** Developer implements HMAC-SHA256 headers based on the Rollout PHP guide. All requests return 401. Hours are lost debugging.

**Why it happens:** Two different auth patterns exist in documentation — HMAC in a 2023 third-party guide, OAuth2 in the current Swagger spec. The Swagger spec is authoritative.

**How to avoid:** Start with OAuth2 Client Credentials as documented in the Swagger spec. Only fall back to HMAC if the live token endpoint returns errors that suggest the credentials are API-key style rather than OAuth client credentials.

**Warning signs:** Token endpoint returns 400 with "unsupported_grant_type" — this may indicate the account's credentials are in a different format than expected.

### Pitfall 2: Wrong Base URL or Endpoint Path

**What goes wrong:** Code POSTs to `https://api.practicebetter.io/v2/clients` (from third-party guides) — 404. Or uses `https://api.practicebetter.io/v1/...` — 404.

**How to avoid:** The Swagger spec confirms the endpoint is `/consultant/records` with no version prefix in the path. Use `https://api.practicebetter.io/consultant/records`.

### Pitfall 3: Unexpected Invitation Email

**What goes wrong:** `POST /consultant/records` sends a Practice Better portal invite to the test patient email. During production onboarding, real patients receive a Practice Better invite alongside StrengthRX's own communication flow — duplicate/confusing emails.

**How to avoid:** Test with an email address you control during the spike. Document whether an invite email fires. If yes, look for a `send_invite: false` field in the request body.

### Pitfall 4: Token Endpoint Field Name Mismatch

**What goes wrong:** Practice Better generates credentials labeled "API Key" and "Secret" in their UI. The OAuth2 spec uses `client_id` and `client_secret`. These may or may not map 1:1 by exact string.

**How to avoid:** The spike script logs the full token response. If `client_id` / `client_secret` fails with a 400, the error body will indicate the expected parameter names. Try `api_key` / `api_secret` as an alternative.

### Pitfall 5: Response ID Field Name Unknown

**What goes wrong:** Code assumes `response.id` contains the patient ID. Practice Better returns `_id`, `record_id`, or `client_id` instead — the field is silently `undefined`, and `practiceBetterId` is stored as `null`.

**How to avoid:** Log the full `POST /consultant/records` response body during the spike. Check the actual field name. The library's `createPracticeBetterClient()` should check multiple candidate field names and throw explicitly if none is found (as shown in the code example above).

---

## Code Examples

### Verified Patterns (from official Swagger spec)

**Token Request:**
```
POST https://api.practicebetter.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={id}&client_secret={secret}
```
Source: `https://api-docs.practicebetter.io/swagger.json` — securityDefinitions, tokenUrl `/oauth2/token`

**Patient Create Request:**
```
POST https://api.practicebetter.io/consultant/records
Authorization: Bearer {access_token}
Content-Type: application/json

{ClientRecordCreateFragment body — exact fields TBD from spike}
```
Source: `https://api-docs.practicebetter.io/swagger.json` — `POST /consultant/records` operation

### Environment Variables Required

Add to `.env.local` and `.env.example`:

```bash
# Practice Better API (OAuth2 Client Credentials)
PRACTICE_BETTER_CLIENT_ID=your_api_key_from_practice_better
PRACTICE_BETTER_CLIENT_SECRET=your_api_secret_from_practice_better
```

The field names (`PRACTICE_BETTER_CLIENT_ID`, `PRACTICE_BETTER_CLIENT_SECRET`) are project conventions. The actual Practice Better credentials page calls them "API Key" and "Secret" — map them accordingly.

---

## What Already Exists in the Codebase (Do Not Re-Create)

From reading `src/collections/Clients.ts`:

- `practiceBetterId` — text field, already exists
- `practiceBetterSyncStatus` — select field (`pending` / `synced` / `failed`), already exists
- `goals`, `labsStatus` — both already exist from Phase 1

No schema changes are required for Phase 3. The `lib/practice-better.ts` module can be built and tested without touching any collection schema.

From reading `src/app/api/onboarding/route.ts`:
- The stub route already exists at `src/app/api/onboarding/route.ts`
- Phase 3 does NOT modify this route — that is Phase 4's job
- Phase 3 only creates `src/lib/practice-better.ts` and verifies it works

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| HMAC-SHA256 custom headers (X-PB-API-KEY, X-PB-TIMESTAMP, X-PB-SIGNATURE) | OAuth2 Client Credentials Bearer token | HMAC pattern appears in 2023 Rollout guide; Swagger spec (authoritative) uses OAuth2 |
| `/v2/clients` endpoint path | `/consultant/records` endpoint path | v2 path appears in third-party guides; Swagger spec confirms `/consultant/records` |
| API labeled as beta | Still beta as of April 2026 | No GA announcement found; treat as unstable for SLA purposes |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest 3.2.3 |
| Config file | `vitest.config.mts` |
| Quick run command | `pnpm test:int` |
| Full suite command | `pnpm test:int && pnpm test:e2e` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTEG-05 (auth confirmed) | OAuth2 token fetch succeeds with real credentials | manual-only | `npx tsx scripts/pb-spike.ts` | Wave 0 (spike script) |
| INTEG-05 (endpoint confirmed) | POST /consultant/records returns a patient ID | manual-only | `npx tsx scripts/pb-spike.ts` | Wave 0 (spike script) |
| INTEG-05 (lib module) | `createPracticeBetterClient()` resolves with `{ id: string }` shape | unit (mocked) | `pnpm test:int -- --testPathPattern practice-better` | Wave 0 |
| INTEG-05 (error handling) | `createPracticeBetterClient()` throws on 4xx with descriptive message | unit (mocked) | `pnpm test:int -- --testPathPattern practice-better` | Wave 0 |

**Note:** INTEG-05's core success criteria (real API call) is inherently manual during the spike. The unit tests mock the fetch responses and verify the module's behavior — they run in CI. The spike script is the live verification step and is deleted before Phase 4 ships.

### Sampling Rate

- **Per task commit:** `pnpm test:int` (unit tests for the lib module, mocked)
- **Phase gate:** Spike script executed against live API, output documented before Phase 4 begins

### Wave 0 Gaps

- [ ] `tests/int/practice-better.int.spec.ts` — unit tests for `createPracticeBetterClient()` with mocked fetch (covers error paths, token caching behavior, ID extraction)
- [ ] `scripts/pb-spike.ts` — manual spike script for live API verification (deleted before Phase 4)
- [ ] `.env.local` entry for `PRACTICE_BETTER_CLIENT_ID` and `PRACTICE_BETTER_CLIENT_SECRET` — must be added before spike script runs

---

## Open Questions

1. **Exact `ClientRecordCreateFragment` field names**
   - What we know: endpoint confirmed, schema definition truncated in public Swagger
   - What's unclear: required vs optional fields, exact snake_case names, date format
   - Recommendation: Read the Swagger UI at `https://api-docs.practicebetter.io/#/` while logged in, or send a minimal POST and read the 422 validation error

2. **Invite email behavior on `POST /consultant/records`**
   - What we know: Practice Better's UI distinguishes "Add" from "Invite"; API endpoint name suggests "add"
   - What's unclear: whether the API endpoint silently sends an invite email
   - Recommendation: Test with a controlled email address during the spike before writing any production code

3. **Token response `expires_in` field presence**
   - What we know: Standard OAuth2 responses include `expires_in`; not confirmed for Practice Better
   - What's unclear: Whether Practice Better includes it, and the actual token lifespan
   - Recommendation: Log the full token response in the spike script; default to 55-minute cache if field is absent

4. **Response body shape — which field contains the patient ID?**
   - What we know: Swagger references `ClientRecord` as the response type; definition truncated
   - What's unclear: Whether the ID field is `id`, `_id`, `client_id`, or something else
   - Recommendation: Log the full create response in the spike script; hardcode the confirmed field name in the library

5. **`PRACTICE_BETTER_CLIENT_ID` vs `PRACTICE_BETTER_API_KEY` naming**
   - What we know: Practice Better UI shows "API Key" and "Secret" — these map to OAuth2 client credentials
   - What's unclear: Whether the token endpoint expects `client_id`/`client_secret` or `api_key`/`api_secret` as form field names
   - Recommendation: Try `client_id`/`client_secret` first (standard OAuth2); if 400, check the error body for expected parameter names

---

## Sources

### Primary (HIGH confidence)
- `https://api-docs.practicebetter.io/swagger.json` — Auth scheme: OAuth2 Client Credentials, token URL `/oauth2/token`, patient create endpoint `POST /consultant/records`, base URL `https://api.practicebetter.io`

### Secondary (MEDIUM confidence)
- [Rollout: Reading and Writing Data Using the Practice Better API](https://rollout.com/integration-guides/practice-better/reading-and-writing-data-using-the-practice-better-api) — Bearer token pattern confirmed; base URL `/v1/` referenced (contradicts Swagger `/consultant/records` path)
- [Rollout: Building a Practice Better API integration in PHP](https://rollout.com/integration-guides/practice-better/sdk/step-by-step-guide-to-building-a-practice-better-api-integration-in-php) — HMAC-SHA256 headers pattern and `/v2/` base URL (conflicts with Swagger OAuth2 — older documentation)
- [Practice Better Help: Getting Started with the Practice Better API (Beta)](https://help.practicebetter.io/hc/en-us/articles/16637584053275-Getting-Started-with-the-Practice-Better-API-Beta) — API key generation confirmed; 403 blocked full read
- Existing codebase: `src/collections/Clients.ts` — practiceBetterId and practiceBetterSyncStatus fields confirmed present from Phase 1

### Tertiary (LOW confidence)
- Third-party integration guides (Keragon, Portable.io) — field name hypotheses (`first_name`, `last_name`, `email`) based on EHR conventions; not verified against Swagger definitions

---

## Metadata

**Confidence breakdown:**
- Auth scheme (OAuth2 Client Credentials): HIGH — confirmed in Swagger spec
- Endpoint path (`POST /consultant/records`): HIGH — confirmed in Swagger spec
- Field names (`first_name`, `last_name`, `email`): LOW — hypothesized from EHR conventions; Swagger definitions truncated
- Invite email behavior: LOW — no public documentation found; must be tested
- Token lifespan: LOW — no public documentation found

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (Practice Better API is labeled beta — verify before implementing if more than 30 days have passed)
