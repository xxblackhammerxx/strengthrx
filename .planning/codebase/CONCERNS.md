# Codebase Concerns

**Analysis Date:** 2026-04-03

## Tech Debt

**Incomplete Stripe Integration:**
- Issue: Stripe customer ID field exists in schema but integration not implemented
- Files: `src/collections/Clients.ts` (line 56-61)
- Impact: Billing/payment functionality cannot be completed; stripeCustomerId field in database serves no purpose currently
- Fix approach: Either implement full Stripe integration with webhook handlers, or remove the field entirely from schema

**Large Component Files:**
- Issue: Multiple portal content components exceed 700+ lines with complex nested logic
- Files: `src/app/(portals)/client-portal/ClientPortalContent.tsx` (1012 lines), `src/app/(frontend)/(marketing)/peptides/page.tsx` (715 lines), `src/app/(frontend)/(marketing)/hormone-therapy/page.tsx` (711 lines)
- Impact: Difficult to maintain, test, and debug; high cognitive complexity; reusability issues
- Fix approach: Break into smaller, composable sub-components with clear responsibilities. Extract mock data and helper functions out of component files.

**Hardcoded Credentials in Seed File:**
- Issue: Test passwords stored in plain text in seed data
- Files: `src/seed.ts` (lines 5-7)
- Impact: If seed file is accidentally committed to a shared branch or exposed, default credentials are known
- Fix approach: Move seed credentials to environment variables; only load from env in development

**Global State Without Provider Wrapper:**
- Issue: Mock data defined at module level in ClientPortalContent (progressData, appointmentHistory, documents, treatmentSchedule)
- Files: `src/app/(portals)/client-portal/ClientPortalContent.tsx` (lines 39-91)
- Impact: Mock data persists across re-renders; no easy way to test different states; data cannot be fetched from real backend
- Fix approach: Move to useState or fetch from API; separate mock data from component logic

## Known Bugs

**Referral Code Case Sensitivity Inconsistency:**
- Symptoms: Signup route accepts referral code in any case and converts to uppercase before lookup, but frontend does not enforce this pattern
- Files: `src/app/api/signup/route.ts` (line 24), `src/app/api/verify-referral/route.ts` (line 21)
- Trigger: User enters lowercase referral code on signup page with manual text input
- Workaround: Frontend should normalize input to uppercase before submission, or document case requirement

**Missing Error Handling in Email Sending:**
- Symptoms: If Resend API is unavailable or GOOGLE_PRIVATE_KEY is malformed, contact form will fail with vague error message
- Files: `src/app/api/contact/route.ts` (lines 86-92)
- Trigger: Submit contact form when reCAPTCHA passes but Google Cloud credentials are misconfigured
- Workaround: Check browser console for detailed error; check server logs for actual error

**reCAPTCHA Token Expiry Not Handled:**
- Symptoms: If token expires between generation and API call, form submission fails silently with 403 error
- Files: `src/app/(frontend)/(marketing)/contact/page.tsx` (lines 85-96), `src/app/api/contact/route.ts` (lines 86-92)
- Trigger: Long delay between form load and submission (tokens valid for 2 minutes)
- Workaround: User must refresh and resubmit form

## Security Considerations

**HTML Email Injection Risk:**
- Risk: User input (name, email, message, state) inserted directly into HTML email template without escaping
- Files: `src/app/api/contact/route.ts` (lines 110-141)
- Current mitigation: Resend handles some escaping, but not guaranteed
- Recommendations: Use proper email templating library (e.g., React Email) or manually escape HTML entities in all user-supplied fields

**Public Referral Code Enumeration:**
- Risk: /api/verify-referral endpoint allows any client to enumerate valid referral codes
- Files: `src/app/api/verify-referral/route.ts` (lines 5-45)
- Current mitigation: None; endpoint returns different responses for valid vs invalid codes
- Recommendations: Add rate limiting; consider hiding exact error message; require authentication for this endpoint or move to internal-only endpoint

**Weak Cookie Configuration in Development:**
- Risk: In non-production environments, secure flag is false, allowing cookie theft over HTTP
- Files: `src/app/api/signup/route.ts` (line 114), `src/app/api/login/route.ts` (line 42), `src/app/api/signup/partner/route.ts` (similar pattern)
- Current mitigation: Conditional check for NODE_ENV, but still vulnerable in staging environments
- Recommendations: Always set secure=true in production; consider using sameSite='strict' instead of 'lax'

**Missing CSRF Protection:**
- Risk: All POST endpoints (signup, login, contact, account update) lack CSRF token validation
- Files: `src/app/api/**/*.ts` all endpoints
- Current mitigation: None; relies on SameSite cookies
- Recommendations: Implement CSRF tokens using Next.js middleware or add explicit token validation to forms

**JSON.stringify() in Email Template:**
- Risk: If reCAPTCHA score or other sensitive data is logged/exposed in email
- Files: `src/app/api/contact/route.ts` (line 135 shows score in email)
- Current mitigation: Score is exposed only to admin email (not public)
- Recommendations: Consider not exposing reCAPTCHA score in user-facing emails

**Private Key String Replacement:**
- Risk: Simple string replacement for newlines in private key could fail with edge cases
- Files: `src/app/api/contact/route.ts` (line 21)
- Current mitigation: Code handles common case of escaped newlines
- Recommendations: Use proper dotenv parsing; validate private key format on startup

## Performance Bottlenecks

**Payload CMS Client Initialization on Every Request:**
- Problem: `getPayload()` called on every API route request; may create new connection
- Files: All files in `src/app/api/**/*.ts`
- Cause: No connection pooling or client singleton across requests
- Improvement path: Implement a cached payload client using Node.js module-level singleton pattern; set pool.max in postgres adapter config

**Inefficient Referral Lookup:**
- Problem: Partner lookup in signup route does two separate queries (find partners, then findByID)
- Files: `src/app/api/signup/route.ts` (lines 19-36, 62-65)
- Cause: Unnecessary second fetch of partner data
- Improvement path: Reuse partner data from first query instead of fetching again

**No Database Query Optimization:**
- Problem: No indication of indexes on frequently queried fields (referralCode, email, status)
- Files: All collections in `src/collections/**/*.ts`
- Cause: Missing index configuration in Payload collection configs
- Improvement path: Add `index: true` to referralCode, email, and status fields in all collections; verify query plans in PostgreSQL

**Unused Import Overhead:**
- Problem: 26+ Lucide icons imported in ClientPortalContent but many not used
- Files: `src/app/(portals)/client-portal/ClientPortalContent.tsx` (lines 5-26)
- Cause: Icon library is tree-shakeable but unnecessary imports still reduce maintainability
- Improvement path: Remove unused imports; consider extracting icon constants to separate file

## Fragile Areas

**Portal Content Component's State Management:**
- Files: `src/app/(portals)/client-portal/ClientPortalContent.tsx`
- Why fragile: All UI state (progress, appointments, documents, schedules) hardcoded as constants; no connection to real data or API; changing mock data breaks entire component
- Safe modification: Extract all mock data to separate constants file; add prop drilling or context for real data when ready
- Test coverage: Likely minimal; component cannot test different data states or error conditions

**Client Signup with Referral Logic:**
- Files: `src/app/api/signup/route.ts`, `src/app/(frontend)/signup/client/page.tsx`
- Why fragile: Referral code verification scattered across frontend and backend; error handling for referral creation swallows errors silently (line 80-83); if referral creation fails, user doesn't know
- Safe modification: Create dedicated referral service; make referral creation non-optional or explicit in UI; add logging/monitoring
- Test coverage: Missing integration tests for referral flow with various error scenarios

**Contact Form with Multiple Integrations:**
- Files: `src/app/api/contact/route.ts`, `src/app/(frontend)/(marketing)/contact/page.tsx`
- Why fragile: Depends on three external services (reCAPTCHA, Google Cloud, Resend); failure in any one fails entire form; minimal error context returned to user
- Safe modification: Add circuit breaker pattern for each service; implement graceful degradation (e.g., send email even if reCAPTCHA fails); add proper error telemetry
- Test coverage: No unit tests for API endpoint; needs mocked versions of external services

**Login Route Error Handling:**
- Files: `src/app/api/login/route.ts`
- Why fragile: Generic catch-all error handler returns same message for all errors (line 52), making debugging impossible
- Safe modification: Add specific error handling for auth errors vs database errors; log full error server-side with request context
- Test coverage: No tests for various failure modes (bad credentials, database down, malformed request)

**Unvalidated Type Casting:**
- Files: `src/app/api/account/update/route.ts` (line 23)
- Why fragile: Casts user.collection to 'any' then checks specific value; type system provides no safety
- Safe modification: Define proper User type with collection field; use type guards instead of string checks
- Test coverage: No tests for requests from wrong user collection type

## Scaling Limits

**PostgreSQL Connection Pool:**
- Current capacity: Default connection pooling not explicitly configured
- Limit: Payload adapter using default pool size; will exhaust connections under moderate load (>50 concurrent users)
- Scaling path: Configure pool.min and pool.max in payload.config.ts (lines 36-39); implement connection pooling middleware; consider separating read/write connections

**Embedded Google Calendar Iframe:**
- Current capacity: Single Google Calendar scheduling widget hardcoded to one user's calendar
- Limit: Cannot scale to multiple appointment slots, staff calendars, or timezone handling; no API integration for availability
- Scaling path: Replace with proper appointment scheduling API (Calendly, Acuity, or custom backend); implement availability logic; handle timezone selection

**Mock Data in Components:**
- Current capacity: Hardcoded data serves up to ~50 UI elements without performance issue
- Limit: Cannot display real patient data; no pagination or lazy loading; data never updates
- Scaling path: Implement real API endpoints for all portal data; add pagination for appointment history and documents; add real-time updates

**reCAPTCHA Enterprise Costs:**
- Current capacity: ~500 requests/month free tier (assumption)
- Limit: Enterprise pricing kicks in at scale; no fallback mechanism if service fails
- Scaling path: Monitor usage; implement rate limiting on contact form; consider v3 classic if costs become prohibitive

## Dependencies at Risk

**Next.js 15.4.10:**
- Risk: Major version (15); next release may include breaking changes
- Impact: TypeScript strict mode incompatibilities; API route changes; image optimization overhaul
- Migration plan: Pin to 15.x minor version; monitor release notes; test major upgrades in staging before deploying

**Payload CMS 3.61.1:**
- Risk: Version 3 is relatively new; rapid iteration with potential API breaking changes
- Impact: Collections schema may not be forward-compatible; plugin API changes
- Migration plan: Review changelog before upgrading; maintain detailed collection configurations for easy recreation

**@google-cloud/recaptcha-enterprise 6.4.0:**
- Risk: Google frequently updates client libraries; network/API changes possible
- Impact: Token validation may fail with new API versions
- Migration plan: Pin to specific minor version; test Google Cloud library updates in staging

**No TypeScript Strict Mode:**
- Risk: Codebase uses loose type checking, allowing 'any' casts and implicit undefined
- Impact: Runtime errors at scale; refactoring becomes riskier; new contributors make unsafe changes
- Migration plan: Enable strict mode incrementally; fix high-risk areas first (API routes, auth logic)

## Missing Critical Features

**Database Connection Validation:**
- Problem: No health check for database on startup; connection pooling may silently fail
- Blocks: Cannot reliably monitor if application can reach database
- Workaround: Check Payload Cloud logs manually

**Request Authentication Audit Trail:**
- Problem: No logging of login/signup attempts with source IP, timestamp, success/failure
- Blocks: Cannot investigate unauthorized access; no alerting for brute force attempts
- Workaround: Manually query database for recent logins

**Error Tracking/Monitoring:**
- Problem: No integration with Sentry, DataDog, or similar; console.error() calls only go to server logs
- Blocks: Cannot proactively identify errors in production; no error rate alerts
- Workaround: SSH into production server and tail logs manually

**Feature Flags:**
- Problem: No way to enable/disable features without code deployment
- Blocks: Cannot A/B test referral flow; cannot disable contact form if Resend is down
- Workaround: Manual code changes and redeploy

**API Rate Limiting:**
- Problem: No rate limiting on any endpoints; /verify-referral can be hammered to enumerate codes
- Blocks: Application vulnerable to DoS; brute force attacks on login not prevented
- Workaround: Implement at infrastructure level (CDN, WAF) but requires manual config

**Seed Data Isolation:**
- Problem: Seed file creates real data in any environment if accidentally run
- Blocks: Easy to corrupt production data if seed script is deployed to production
- Workaround: Remove seed command from production deployments or require explicit env flag

## Test Coverage Gaps

**API Routes (POST/PATCH Endpoints):**
- What's not tested: All critical business logic (signup, login, contact form, account updates)
- Files: `src/app/api/**/*.ts`
- Risk: Cannot safely refactor endpoints; authentication/authorization bugs only caught in production
- Priority: High - these are user-facing critical paths

**Referral Code Verification:**
- What's not tested: Valid code lookup, invalid code handling, case sensitivity, active/inactive partner filtering
- Files: `src/app/api/verify-referral/route.ts`, `src/app/api/signup/route.ts`
- Risk: Referral flow may fail silently; business logic for partner tracking is untested
- Priority: High - core business revenue path

**Frontend Form Validation:**
- What's not tested: Client-side validation logic, error message display, reCAPTCHA integration, successful submission
- Files: `src/app/(frontend)/(marketing)/contact/page.tsx`, `src/app/(frontend)/signup/**/*.tsx`
- Risk: Users may see cryptic errors; form state may be incorrect after errors
- Priority: Medium - affects user experience

**Authentication & Authorization:**
- What's not tested: Login cookie setting, CSRF attacks, collection-based access control
- Files: `src/app/api/login/route.ts`, `src/app/api/account/update/route.ts`
- Risk: Unauthorized users may access protected endpoints; cookie configuration bugs undetected
- Priority: High - security-critical

**Portal Components State Management:**
- What's not tested: Progress chart rendering with different data, appointment status styling, document list display
- Files: `src/app/(portals)/**/page.tsx`
- Risk: UI may break with real data; edge cases (empty lists, long names, future dates) not handled
- Priority: Low - currently mock data only

**Email Sending:**
- What's not tested: Email template rendering, HTML injection, Resend API failure handling
- Files: `src/app/api/contact/route.ts`
- Risk: Emails may be malformed or missing in production; user input may break HTML
- Priority: Medium - customer communication critical

---

*Concerns audit: 2026-04-03*
