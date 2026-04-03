# Roadmap: StrengthRX — v1.0 UserOnboarding

## Overview

Four phases take the project from an updated database schema through a complete, tested UI, through a verified third-party API integration, to a working end-to-end onboarding flow. The schema must ship first because all downstream code references the new fields. The form UI ships second because it has no external dependencies and can be validated against stub data. The Practice Better API spike ships third because it is the only genuine unknown that could force a rewrite of the integration code. The API route and wire-up ship last, with all dependencies resolved.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Schema and Foundation** - Extend Clients collection with onboarding fields and install dependencies
- [ ] **Phase 2: Onboarding Form UI** - Build the complete multi-step form at /get-started with stub submission
- [ ] **Phase 3: Practice Better API Spike** - Verify PB auth scheme and field names against live API before writing integration code
- [ ] **Phase 4: API Route and Integration** - Implement /api/onboarding, wire up form, connect homepage CTA

## Phase Details

### Phase 1: Schema and Foundation
**Goal**: The Clients collection stores all onboarding data and the project has the required packages installed
**Depends on**: Nothing (first phase)
**Requirements**: SCHMA-01, SCHMA-02, SCHMA-03, SCHMA-04
**Success Criteria** (what must be TRUE):
  1. The Clients collection has a goals field that accepts multiple checkbox values
  2. The Clients collection has a labsStatus field that stores the labs question answer
  3. The Clients collection has practiceBetterId and practiceBetterSyncStatus fields visible in Payload admin
  4. Payload migrations have run without error and regenerated types are in sync with the schema
  5. react-hook-form, zod (v3), and @hookform/resolvers are installed and importable
**Plans**: TBD

### Phase 2: Onboarding Form UI
**Goal**: A visitor can navigate the complete four-step onboarding flow at /get-started with full UX and stub submission
**Depends on**: Phase 1
**Requirements**: ONBRD-01, ONBRD-02, ONBRD-03, ONBRD-04, ONBRD-05, ONBRD-06, ONBRD-07, ONBRD-08, ONBRD-09, ONBRD-10
**Success Criteria** (what must be TRUE):
  1. Clicking "Get Started" on the homepage navigates to /get-started and shows step 1
  2. User can select health goals, answer the labs question, and enter contact info across three steps with a progress indicator showing the current step
  3. User can navigate back to any previous step and their answers are preserved
  4. Inline validation errors appear before the user can advance to the next step
  5. The form is fully usable on a mobile device and shows a loading state then a success screen on submit
**Plans**: TBD

### Phase 3: Practice Better API Spike
**Goal**: The Practice Better authentication scheme, endpoint path, required field names, and invite-email behavior are verified against the live API
**Depends on**: Phase 1
**Requirements**: INTEG-05
**Success Criteria** (what must be TRUE):
  1. The correct auth scheme (HMAC-SHA256 or OAuth2 Bearer) is confirmed and documented with the exact header format
  2. The correct endpoint path for patient creation is confirmed (POST /v2/clients vs POST /consultant/records)
  3. The required field names for patient creation are verified against the live Swagger docs
  4. It is known whether creating a patient triggers an invite email to the patient (and how to suppress it if so)
**Plans**: TBD

### Phase 4: API Route and Integration
**Goal**: Submitting the onboarding form creates a Payload client account, logs the user in, creates a Practice Better patient record, and shows the Rupa Health lab ordering link
**Depends on**: Phase 2, Phase 3
**Requirements**: INTEG-01, INTEG-02, INTEG-03, INTEG-04, POST-01, POST-02
**Success Criteria** (what must be TRUE):
  1. Completing the form creates a client record in Payload and the user is automatically logged into the client portal
  2. A Practice Better patient record is created (or marked pending-sync) and the practiceBetterSyncStatus field reflects the outcome
  3. A visitor who arrived with a ?ref= URL parameter has their referral code attributed to the new client record
  4. The success screen displays the Rupa Health store link so the user can order labs immediately
  5. The onboarding API route rejects submissions that fail reCAPTCHA validation
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Schema and Foundation | 0/? | Not started | - |
| 2. Onboarding Form UI | 0/? | Not started | - |
| 3. Practice Better API Spike | 0/? | Not started | - |
| 4. API Route and Integration | 0/? | Not started | - |
