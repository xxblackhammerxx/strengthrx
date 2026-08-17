import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/schemas/lead'
import { getLandingPage } from '@/content/landing-pages'
import {
  captureConsent,
  isLicensedState,
  resolveAttribution,
  syncLeadToGhl,
} from '@/lib/ghl/leads'
import { applyMetaCookies, getMetaRequestContext, sendMetaEvent } from '@/lib/meta/capi'
import { MetaEvent } from '@/lib/meta/events'
import { valueParams } from '@/lib/meta/value'

/**
 * Landing-page lead capture — the single entry point for all three ad
 * destinations. Adds the signals the browser cannot be trusted for (IP,
 * consent timestamp), gates on licensure, then fans out to GHL and Meta.
 */

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Please check the form and try again.' },
      { status: 400 },
    )
  }

  const lead = parsed.data
  const page = getLandingPage(lead.landingPage)
  const state = lead.state.toUpperCase()

  // Read before any early return so the click and browser IDs are persisted
  // even on paths that do not convert.
  const metaContext = getMetaRequestContext(request)

  // Honeypot: a hidden field only an automated form-filler would populate.
  // Answer 200 so the bot believes it succeeded and does not retry, but write
  // nothing — spam in GHL wastes setter time and spam Leads in Meta teach
  // delivery to find more bots.
  if (lead.website) {
    console.warn('[leads] Honeypot triggered — discarded.')
    return NextResponse.json({ success: true, waitlisted: false })
  }

  const attribution = resolveAttribution(request, lead.attribution)
  const consent = captureConsent(request, true)

  // Licensure gate. Booking someone we cannot legally see wastes a setter slot
  // and creates a bad first impression, so out-of-state goes to the waitlist.
  //
  // Read from the static list rather than the CMS on purpose: Payload exits the
  // process when Postgres is unreachable, which would turn a database blip into
  // silently dropped paid leads while the static landing pages kept serving and
  // spend kept flowing. Adding a state means updating DEFAULT_PRESCRIPTION_STATES.
  const isLicensed = isLicensedState(state)

  const { contactId } = await syncLeadToGhl({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    state,
    source: `landing-page:${lead.landingPage}`,
    tags: [isLicensed ? 'new-lead' : 'waitlist', `lp-${lead.landingPage}`],
    attribution: { ...attribution, entry_path: lead.landingPage },
    assessmentType: page?.assessmentType,
    consent,
    // Out-of-state contacts must not enter the acquisition pipeline — they are
    // tagged for the waitlist workflow instead of reaching a setter.
    createOpportunity: isLicensed,
  })

  // Meta conversion. Licensed states only: optimizing toward leads we cannot
  // serve teaches delivery to find more of them.
  if (isLicensed && lead.metaEventIds.lead) {
    await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: lead.metaEventIds.lead,
      userData: {
        email: lead.email,
        phone: lead.phone,
        firstName: lead.firstName,
        lastName: lead.lastName,
        state,
        country: 'us',
        externalId: contactId,
      },
      // Deliberately no assessment_type — a treatment interest tied to a
      // matchable identifier is health data Meta's terms prohibit receiving.
      customData: {
        content_name: `Landing Page: ${lead.landingPage}`,
        ...valueParams(MetaEvent.Lead),
      },
      context: metaContext,
    })
  }

  return applyMetaCookies(
    NextResponse.json({ success: true, waitlisted: !isLicensed }),
    metaContext,
  )
}
