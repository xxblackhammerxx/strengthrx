# Requirements: StrengthRX

**Defined:** 2026-04-03
**Core Value:** Prospective patients can go from "interested" to "patient with labs ordered" in a single guided session.

## v1.0 Requirements

Requirements for UserOnboarding milestone. Each maps to roadmap phases.

### Onboarding Form

- [x] **ONBRD-01**: User can click "Get Started" on homepage to begin onboarding
- [x] **ONBRD-02**: User can select health goals from checkbox options (lose weight, more energy, less burnout, etc.)
- [x] **ONBRD-03**: User can indicate whether they've had full labs done in the last 30 days
- [x] **ONBRD-04**: User can enter contact info (first name, last name, phone, email)
- [x] **ONBRD-05**: User sees a progress indicator showing current step
- [x] **ONBRD-06**: User can navigate back to previous steps without losing data
- [x] **ONBRD-07**: User sees inline validation errors before advancing steps
- [x] **ONBRD-08**: User sees loading state during form submission
- [x] **ONBRD-09**: User sees success screen with next steps after completing onboarding
- [x] **ONBRD-10**: Onboarding form is mobile-responsive

### Schema

- [x] **SCHMA-01**: Clients collection stores selected health goals (multi-select field)
- [x] **SCHMA-02**: Clients collection stores labs status
- [x] **SCHMA-03**: Clients collection stores Practice Better patient ID
- [x] **SCHMA-04**: Clients collection stores Practice Better sync status

### Integration

- [ ] **INTEG-01**: Onboarding submission creates a Payload client record
- [ ] **INTEG-02**: User is automatically logged in after account creation
- [ ] **INTEG-03**: Onboarding flow supports optional referral code attribution
- [ ] **INTEG-04**: Onboarding submission is protected by reCAPTCHA
- [ ] **INTEG-05**: Practice Better patient creation calls real API during onboarding
- [ ] **INTEG-06**: Admin can retry failed Practice Better syncs from admin portal

### Post-Onboarding

- [ ] **POST-01**: User is shown Rupa Health store link for lab ordering
- [ ] **POST-02**: User is redirected to existing client portal after onboarding

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Practice Better Enhancements

- **INTEG-07**: Practice Better patient record is updated when client info changes

### Post-Onboarding Experience

- **POST-03**: User receives confirmation email after onboarding
- **POST-04**: User receives email drip sequence post-signup
- **POST-05**: Custom welcome page replaces direct portal redirect

### Partner Onboarding

- **PARTN-01**: Partners see guided onboarding for referral tools
- **PARTN-02**: Partners receive onboarding email sequence

## Out of Scope

| Feature | Reason |
|---------|--------|
| Rupa Health API integration | Link handoff only — no API calls needed |
| Payment processing during onboarding | Handled externally via Rupa Health / Practice Better |
| Health intake questionnaires | Separate future milestone — onboarding captures goals only |
| Email drip sequences | Future milestone — v1.0 focuses on the form flow |
| Custom post-onboarding welcome page | v1.0 lands on existing client portal |
| PB record updates on client info change | Adds complexity; creation is sufficient for v1.0 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHMA-01 | Phase 1 | Complete |
| SCHMA-02 | Phase 1 | Complete |
| SCHMA-03 | Phase 1 | Complete |
| SCHMA-04 | Phase 1 | Complete |
| ONBRD-01 | Phase 2 | Complete |
| ONBRD-02 | Phase 2 | Complete |
| ONBRD-03 | Phase 2 | Complete |
| ONBRD-04 | Phase 2 | Complete |
| ONBRD-05 | Phase 2 | Complete |
| ONBRD-06 | Phase 2 | Complete |
| ONBRD-07 | Phase 2 | Complete |
| ONBRD-08 | Phase 2 | Complete |
| ONBRD-09 | Phase 2 | Complete |
| ONBRD-10 | Phase 2 | Complete |
| INTEG-05 | Phase 4 | Pending |
| INTEG-06 | Phase 4 | Pending |
| INTEG-01 | Phase 4 | Pending |
| INTEG-02 | Phase 4 | Pending |
| INTEG-03 | Phase 4 | Pending |
| INTEG-04 | Phase 4 | Pending |
| POST-01 | Phase 4 | Pending |
| POST-02 | Phase 4 | Pending |

**Coverage:**
- v1.0 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after roadmap creation*
