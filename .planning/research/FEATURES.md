# Feature Research

**Domain:** Telehealth / Wellness — Guided Patient Onboarding Flow
**Researched:** 2026-04-03
**Confidence:** MEDIUM — UX patterns HIGH confidence from multiple sources; Practice Better API field schema LOW confidence (docs are behind auth-gated Swagger UI; all known fields inferred from the Swagger endpoint list retrieved at api-docs.practicebetter.io plus the existing Clients collection schema)

---

## Scope Note

This research covers only the NEW onboarding milestone features. Existing features
(auth, portals, referrals, marketing) are already shipped and excluded.

The onboarding flow is:
```
Homepage "Get Started" → Goal Selection → Labs Question → Contact Info → Create User + Practice Better Patient → Rupa Health link
```

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Progress indicator (step X of N) | Users need to know how long the form is; absence causes abandonment | LOW | Simple step counter or progress bar; must update on each step |
| Back navigation between steps | Users will want to correct answers from earlier steps | LOW | Must preserve state across backward navigation |
| In-line field validation with error messages | Healthcare forms are high-stakes; users need immediate feedback on mistakes | LOW | Validate on blur, not on submit only |
| Mobile-responsive layout | Majority of signups happen on mobile; telehealth conversion research confirms this | LOW | Already handled by Tailwind; needs testing at each step |
| Disabled/loading state on submit | Prevents double-submit on patient creation API call | LOW | Spinner on final CTA while Payload + Practice Better calls run |
| Success confirmation screen | Users need confirmation their record was created | LOW | Final step — show success and Rupa Health link |
| Password creation in contact step | Required to log in to client portal post-onboarding | LOW | Reuse existing Payload auth requirements (min 8 chars) |
| Referral code passthrough | Flow originates from partner-referred links; code must survive all steps | LOW | Read from URL param on step 1, carry through state to final submit |
| Trust signals / privacy callout | Medical data collection requires explicit reassurance | LOW | One-line note near phone/DOB fields: "Your info is kept private and never sold." |
| "Already have an account?" link | Some users land on onboarding after already signing up | LOW | Link to /login on first or last step |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not expected, but drive completion rates.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Contextual labs messaging based on answer | If user says "yes, I have labs" vs "no" — show different copy and different next step | LOW | Conditional text only, no routing change; aligns with PROJECT.md decision that goals are informational |
| Goal selection as checkbox grid (not dropdown) | Visual checkbox cards feel more like a quiz than a form; higher engagement and faster completion | LOW | Multi-select checkboxes; 4–6 wellness goals (TRT, weight loss, peptides, sexual wellness, etc.) |
| Referral attribution banner | Show partner name when a valid referral code is present ("Referred by [Partner Name]") | LOW | Already implemented in existing /signup/client — pattern can be reused |
| Immediate Rupa Health link on completion | Patient can order labs within the same session; zero handoff friction | LOW | Static URL — no API call needed per PROJECT.md decision |
| Single-session "interested → patient" flow | Core value proposition; entire journey in one sitting without returning later | MEDIUM | Depends on Practice Better API call succeeding synchronously; needs error handling if PB call fails |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Save & resume across sessions | Seen on complex intake forms | Overkill for a 4-step flow; adds session/token storage complexity, HIPAA surface area grows | Keep steps short enough that users finish in one session; 4 steps takes under 2 minutes |
| Email verification before record creation | Feels "secure" | Adds a blocking step that dramatically increases abandonment; telehealth signups need momentum | Create Payload record immediately on submit; email can be verified post-onboarding if needed |
| Inline appointment scheduling | Some platforms combine intake + booking | Out of scope for v1.0; requires Practice Better availability/slots API, calendar UI, consultant lookup | Defer to future milestone; link to contact page if booking is needed |
| Real-time duplicate email check (on blur) | Prevents duplicate accounts | Requires an authenticated API call on every keystroke blur; slows the form down | Check for duplicate email only at final submit when creating Payload record; return a clear error |
| Health questionnaire / intake forms | Patients expect to fill medical history | High complexity, HIPAA considerations, significant scope growth | Explicitly deferred to future milestone per PROJECT.md; Practice Better supports form-requests API for this later |
| SMS verification / OTP | Adds perceived security | Adds a blocking asynchronous step; significantly drops conversion | No evidence this is needed for v1.0; patient identity is verified downstream by the provider |
| Payment collection in flow | Some platforms monetize at signup | Out of scope per PROJECT.md; handled externally | Payment is managed outside the platform for v1.0 |

---

## Practice Better API — Patient Creation Workflow

**Authentication:** OAuth 2.0 Client Credentials flow
- Token endpoint: `POST https://api.practicebetter.io/oauth/token`
- Grant type: `client_credentials`
- Credentials: Client ID + Client Secret (obtained from Practice Better account settings)
- Tokens are short-lived; must be refreshed before expiry
- Rate limits: 5 req/sec, 20 burst cap, 10,000 req/day

**Patient Creation Endpoint:**
- `POST https://api.practicebetter.io/consultant/records`
- Requires `write` OAuth scope
- Creates a new client record in the Practice Better practice

**Known fields for patient record** (MEDIUM confidence — inferred from Swagger endpoint list, Clients collection schema, and Practice Better help docs; exact field names need verification against live API docs once credentials are available):

| Field | Type | Required | Source of inference |
|-------|------|----------|---------------------|
| `first_name` | string | Likely required | PB UI requires first name; help docs show it as mandatory |
| `last_name` | string | Likely required | PB UI requires last name |
| `email` | string | Likely required | PB docs note clients can be added without email (edge case article); normally required |
| `phone` | string | Optional | Shown in PB client record UI |
| `date_of_birth` | string (ISO 8601) | Likely required for medical platform | Clients collection has it as required; PB records medical DOB |
| `status` | string | Optional | API supports `pendingcreate` or `created` — may default to `created` |

**Field naming convention:** The Practice Better API uses `snake_case` (confirmed from Swagger endpoint list parameters: `modified_gte`, `modified_lte`). Field names in the request body should use snake_case, not camelCase.

**Workflow for patient creation at end of onboarding:**

```
1. Collect data across onboarding steps (goals, labs status, first/last name, email, DOB, phone, password)
2. On final submit:
   a. Create Payload Clients record (existing pattern — /api/signup route)
   b. Obtain PB OAuth token (server-side API route, credentials never in client)
   c. POST to /consultant/records with patient data
   d. Store PB record ID on Payload Clients record (for future reference)
3. If PB call fails:
   a. Payload record already exists — user is registered
   b. Log the failure, queue for retry or manual fix
   c. Do NOT block user from proceeding; show success screen
4. Redirect to Rupa Health store link on success screen
```

**Implementation note:** The Practice Better API call must happen server-side (Next.js API route) to keep OAuth credentials out of the browser. A new `/api/onboarding` route should handle both Payload record creation and the Practice Better call atomically from the user's perspective, even if PB creation is fire-and-forget with error logging.

**Credential availability:** Practice Better API credentials must be obtained before this integration goes live. The Swagger UI at `api-docs.practicebetter.io` requires account login to see full schema. **Flag: field names need verification against live API docs once credentials are available.**

---

## Feature Dependencies

```
[Contact Info Step]
    └──requires──> [Goal Selection Step] (steps are sequential; prior state needed)
    └──requires──> [Labs Question Step]  (prior state needed for labs status on Payload record)

[Practice Better Patient Creation]
    └──requires──> [Contact Info Step]   (first name, last name, email, DOB, phone)
    └──requires──> [Server-side OAuth token management]

[Rupa Health Link Display]
    └──requires──> [Practice Better Patient Creation] (shown on success screen after creation)

[Referral Attribution Banner]
    └──enhances──> [Contact Info Step]   (banner shown if ?ref= code present)

[Payload Client Record Creation]
    └──requires──> [Contact Info Step]
    └──depends-on──> [Existing /api/signup route] (can be adapted or replaced)

[Practice Better Patient Creation]
    └──should-not-block──> [Payload Client Record Creation]
    (PB failure must not prevent user from completing signup)
```

### Dependency Notes

- **Contact Info step requires prior steps:** The Payload record creation needs goals and lab status data; collect all in prior steps and pass forward in component state.
- **Practice Better requires server-side secrets:** OAuth client credentials must never reach the browser; a dedicated Next.js API route is required.
- **Rupa Health link is independent:** It is a static URL — no API call, no dependency on PB success. It can always be shown.
- **Referral code integration:** The existing `/api/verify-referral` endpoint and the referral creation logic in `/api/signup/route.ts` can be reused directly. The onboarding flow needs to pass the referral code through all steps to the final submit.

---

## MVP Definition

### Launch With (v1.0)

Minimum viable product — what's needed to validate the concept.

- [ ] Progress indicator showing current step (e.g., "Step 2 of 4") — baseline UX requirement
- [ ] Step 1: Goal selection — multi-select checkboxes for wellness goals (TRT, weight loss, peptides, sexual wellness); stored on Clients record
- [ ] Step 2: Labs question — single yes/no/not sure question; drives contextual copy on completion screen; stored as labStatus on Clients record
- [ ] Step 3: Contact info — first name, last name, email, DOB, phone, password; this is account creation
- [ ] Step 4: Success screen — confirmation, Rupa Health store link, next-steps copy
- [ ] Payload Clients record creation on Step 3 submit (reuse existing /api/signup logic)
- [ ] Practice Better patient creation via server-side API route (fire-and-forget with error logging)
- [ ] Referral code passthrough from URL param (?ref=CODE) to final submit
- [ ] Back navigation preserving state on all steps
- [ ] Mobile-responsive at each step

### Add After Validation (v1.x)

Features to add once core flow is working.

- [ ] Goals field on Payload Clients collection — add `goals` multi-select field to store what was selected (needed before the onboarding flow can be shipped; technically v1.0 but worth calling out as a schema change)
- [ ] Practice Better record ID stored on Clients collection — enables future record updates and status sync
- [ ] Retry mechanism for failed Practice Better calls — currently log-only; add admin notification or queue

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Practice Better form-requests API — send intake paperwork to patient post-signup
- [ ] Email drip sequence after signup — explicitly out of scope per PROJECT.md
- [ ] Lab result sync from Rupa Health via Practice Better lab-requests API
- [ ] Appointment scheduling integration (availability/slots endpoint)
- [ ] Health questionnaire during onboarding

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Progress indicator | HIGH | LOW | P1 |
| Goal selection step | HIGH | LOW | P1 |
| Labs question step | HIGH | LOW | P1 |
| Contact info + account creation | HIGH | LOW (pattern exists) | P1 |
| Success screen + Rupa Health link | HIGH | LOW | P1 |
| Practice Better patient creation | HIGH | MEDIUM (OAuth, server route, error handling) | P1 |
| Referral code passthrough | MEDIUM | LOW (pattern exists) | P1 |
| Back navigation with state preservation | HIGH | LOW | P1 |
| Contextual labs messaging | MEDIUM | LOW | P2 |
| Referral attribution banner | LOW | LOW | P2 |
| Goals stored on Clients schema | HIGH | LOW (schema change) | P1 — blocking |
| PB record ID on Clients schema | MEDIUM | LOW (schema change) | P2 |
| Mobile optimization / QA | HIGH | LOW | P1 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | Hims/Hers / Roman | Calibrate / Found | Our Approach |
|---------|-------------------|-------------------|--------------|
| Goal/symptom selection | Checkbox quiz early in flow | Symptom quiz as first step | Checkbox grid on step 1 |
| Labs question | "Have you had recent labs?" with branching | Labs ordered after signup | Yes/No/Not sure question with contextual messaging |
| Account creation timing | After goal/symptom collection | After goal/symptom collection | Step 3 (after goals + labs) — same pattern |
| Progress indicator | Visible on all steps | Visible on all steps | Step counter on all steps |
| Post-signup action | Provider match or prescription flow | Lab order link | Rupa Health store link |
| Referral tracking | Affiliate codes in URL | Not prominent | ?ref= URL param, banner shown if valid |

---

## Existing Code to Reuse

The following patterns from the existing codebase should be directly adapted (not rebuilt):

| Existing Pattern | Location | Reuse In |
|-----------------|----------|---------|
| Referral code URL param + verification | `/signup/client/page.tsx` + `/api/verify-referral` | Step 1 — read ?ref= from URL |
| Payload client creation | `/api/signup/route.ts` | Final submit — adapt for onboarding flow |
| Referral record creation | `/api/signup/route.ts` | Final submit — keep same logic |
| Form state + error handling pattern | `/signup/client/page.tsx` | All steps |
| Partner attribution banner UI | `/signup/client/page.tsx` | Step 1 or persistent header |
| Payload auth (email + password) | Clients collection | Contact info step — password field |

---

## Sources

- Practice Better API endpoint list (retrieved from api-docs.practicebetter.io Swagger JSON): [https://api-docs.practicebetter.io/](https://api-docs.practicebetter.io/)
- Practice Better API Getting Started: [https://help.practicebetter.io/hc/en-us/articles/16637584053275](https://help.practicebetter.io/hc/en-us/articles/16637584053275)
- Practice Better API Release Notes (Open API): [https://help.practicebetter.io/hc/en-us/articles/20535616140315](https://help.practicebetter.io/hc/en-us/articles/20535616140315)
- Multi-step form best practices: [https://www.webstacks.com/blog/multi-step-form](https://www.webstacks.com/blog/multi-step-form)
- Telehealth UX best practices: [https://ata-nexus.org/telehealth-ui-ux-how-to-create-the-best-patient-experience-for-virtual-care/](https://ata-nexus.org/telehealth-ui-ux-how-to-create-the-best-patient-experience-for-virtual-care/)
- HealthTech onboarding patterns: [https://userguiding.com/blog/healthtech-onboarding](https://userguiding.com/blog/healthtech-onboarding)
- Practice Better OAuth2 token endpoint (via Rollout integration guide): [https://rollout.com/integration-guides/practice-better/reading-and-writing-data-using-the-practice-better-api](https://rollout.com/integration-guides/practice-better/reading-and-writing-data-using-the-practice-better-api)
- Existing codebase: `/src/collections/Clients.ts`, `/src/app/(frontend)/signup/client/page.tsx`, `/src/app/api/signup/route.ts`

---

*Feature research for: StrengthRX onboarding flow (v1.0 UserOnboarding milestone)*
*Researched: 2026-04-03*
