# StrengthRX

## What This Is

A telehealth wellness platform offering TRT, peptides, weight loss, and sexual wellness services across US states. Includes marketing site, client/partner/admin portals, referral tracking system, and Payload CMS admin. Built with Next.js 15 and Payload CMS 3 on PostgreSQL.

## Core Value

Prospective patients can go from "interested" to "patient with labs ordered" in a single guided session — no friction, no confusion.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing codebase. -->

- ✓ Client signup and login with email/password — v0
- ✓ Partner signup and login with referral code generation — v0
- ✓ Admin portal with overview dashboard — v0
- ✓ Client portal with account management and settings — v0
- ✓ Partner portal with referral tracking and marketing materials — v0
- ✓ Referral pipeline tracking (lead → consult → qualified → converted) — v0
- ✓ Marketing pages (services, about, contact, locations, terms, privacy) — v0
- ✓ Contact form with reCAPTCHA Enterprise spam protection — v0
- ✓ Email sending via Resend — v0
- ✓ Prescription states management (admin-configurable) — v0
- ✓ SEO with structured data and sitemap — v0
- ✓ Clients collection stores onboarding data (goals, labsStatus, practiceBetterId, practiceBetterSyncStatus) — Phase 1
- ✓ Form libraries installed (react-hook-form, zod v3, @hookform/resolvers) — Phase 1

### Active

<!-- Current scope. Building toward these in v1.0 UserOnboarding milestone. -->

- [ ] Guided multi-step onboarding form from homepage
- [ ] Goal selection (stored on user record)
- [ ] Labs status question with contextual messaging
- [ ] Contact info collection and user record creation
- [ ] Practice Better API integration for patient creation (live, not stubbed)
- [ ] Admin retry for failed Practice Better syncs
- [ ] Rupa Health store link for lab ordering
- [ ] Referral code support in onboarding flow

### Out of Scope

<!-- Explicit boundaries. -->

- Rupa Health deep API integration — link handoff only, no API calls needed
- Email drip sequences post-signup — future milestone
- Partner onboarding flow — future milestone
- Intake health questionnaires — future milestone
- Payment processing during onboarding — handled externally

## Context

- Practice Better is the practice management system; API docs at api-docs.practicebetter.io
- Rupa Health is used for lab ordering; patients get a link to their store
- Three auth-enabled Payload collections (Admins, Partners, Clients) with role-based access
- Existing signup flows at `/signup/client` and `/signup/partner`
- Referral system uses codes on Partners collection, tracked in Referrals collection
- Tailwind CSS v4 with Inter (body) and Montserrat (headings) fonts

## Constraints

- **Tech stack**: Next.js 15 + Payload CMS 3 + PostgreSQL — no stack changes
- **External API**: Practice Better API credentials needed before patient creation can go live
- **Styling**: Must match existing dark theme with gold (#D4A843) accents
- **Auth**: Must use existing Payload auth system (Clients collection)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Goals are informational only | Don't change routing or treatment — stored for provider context | — Pending |
| Rupa Health is link handoff | No API integration needed, just provide store URL | — Pending |
| Land on existing client portal | Avoids building new post-onboarding UI for v1.0 | — Pending |
| Referral codes optional in flow | Flow works with or without — supports partner referrals when present | — Pending |

## Current Milestone: v1.0 UserOnboarding

**Goal:** Create a guided multi-step onboarding flow from homepage to patient creation with Practice Better integration and Rupa Health lab ordering link.

**Target features:**
- "Get Started" button on homepage leading to multi-step form
- Goal selection, labs question, contact info collection
- User record creation + Practice Better patient creation (live API)
- Admin retry for failed PB syncs
- Rupa Health store link for lab ordering
- Optional referral code support

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after Phase 1 completion*
