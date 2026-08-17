import 'server-only'

import type { NextRequest } from 'next/server'
import { createGhlOpportunity, isGhlConfigured, upsertGhlContact } from './client'
import { parseAttributionCookie, ATTRIBUTION_COOKIE, type Attribution } from '@/lib/attribution'
import { isLicensedState as isLicensed } from '@/lib/licensed-states'

/**
 * Shared lead → GHL sync for every capture point on the site.
 *
 * Landing pages, the contact form and the Get Started flow all funnel through
 * here so one contact record accumulates touchpoints instead of three systems
 * disagreeing, and so attribution is mapped identically everywhere.
 *
 * PHI boundary: acquisition data only. Nothing clinical is ever written.
 */

export type LeadSyncInput = {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  /** Two-letter code. Sent as a standard GHL property, not a custom field. */
  state?: string
  /** e.g. `landing-page:mens-performance`, `contact-form`, `get-started`. */
  source: string
  /** Extra tags on top of the ones derived from attribution. */
  tags?: string[]
  attribution?: Attribution
  /** Pre-sale interest only. Never a protocol or a treatment. */
  packageInterest?: string
  assessmentType?: string
  consent?: { sms: boolean; timestamp: string; ip: string }
  /** Opportunities fire WF-1, so only create one for genuine new inquiries. */
  createOpportunity?: boolean
}

/** Normalizes to E.164, which is what GHL and 10DLC expect. */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+${digits}`
}

export const isLicensedState = (state?: string) => isLicensed(state)

/**
 * Reads attribution from the request cookie and merges the browser-supplied
 * copy over it. The cookie is the fallback for when the browser could not read
 * its own copy — neither alone is reliable.
 */
export function resolveAttribution(
  request: NextRequest,
  fromClient: Attribution = {},
): Attribution {
  return {
    ...parseAttributionCookie(request.cookies.get(ATTRIBUTION_COOKIE)?.value),
    ...Object.fromEntries(Object.entries(fromClient).filter(([, value]) => value)),
  }
}

/** TCPA evidence, captured server-side so a client cannot forge it. */
export function captureConsent(request: NextRequest, sms: boolean) {
  return {
    sms,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
  }
}

export function deriveLeadSourceType(attribution: Attribution): string {
  if (attribution.partner_id) return 'Partner'
  if (attribution.utm_source) return 'Paid'
  return 'Organic'
}

/**
 * Never throws. A CRM outage must not cost us a lead that has already been
 * captured — failures are logged and the caller carries on.
 */
export async function syncLeadToGhl(input: LeadSyncInput): Promise<{ contactId?: string }> {
  if (!isGhlConfigured()) {
    console.warn(`[ghl] Not configured — "${input.source}" lead captured but not synced.`)
    return {}
  }

  const attribution = input.attribution ?? {}
  const leadSourceType = deriveLeadSourceType(attribution)

  const tags = [
    ...(input.tags ?? []),
    attribution.partner_id ? 'partner-referral' : leadSourceType.toLowerCase(),
    ...(input.state ? [input.state.toLowerCase()] : []),
  ].filter(Boolean)

  try {
    const { contactId } = await upsertGhlContact({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ? toE164(input.phone) : undefined,
      // Standard GHL property — a custom field named `state` cannot exist.
      state: input.state,
      source: input.source,
      tags: [...new Set(tags)],
      customFields: {
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
        fbclid: attribution.fbclid,
        // `gclid` collides with a standard field the upsert will not populate.
        google_click_id: attribution.gclid,
        lead_source_type: leadSourceType,
        partner_id: attribution.partner_id,
        landing_page: attribution.entry_path,
        assessment_type: input.assessmentType,
        package_interest: input.packageInterest,
        consent_sms: input.consent ? String(input.consent.sms) : undefined,
        consent_timestamp: input.consent?.timestamp,
        consent_ip: input.consent?.ip,
      },
    })

    if (input.createOpportunity) {
      await createGhlOpportunity({
        contactId,
        name: `${input.firstName} ${input.lastName ?? ''}`.trim() || input.email,
        source: input.source,
      })
    }

    return { contactId }
  } catch (error) {
    console.error(`[ghl] Sync failed for "${input.source}" lead:`, error)
    return {}
  }
}
