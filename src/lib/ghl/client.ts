import 'server-only'

/**
 * GoHighLevel v2 API client.
 *
 * Acquisition data only. Per the build runbook's PHI boundary, nothing
 * clinical may ever be written here — no lab values, no protocols, no
 * symptoms, no medications. GHL has no BAA in this architecture, and one
 * clinical field turns it into a PHI system of record and forces the
 * permanent $297/mo HIPAA add-on.
 */

const API_BASE = 'https://services.leadconnectorhq.com'
const API_VERSION = '2021-07-28'

const GHL_TOKEN = process.env.GHL_PRIVATE_INTEGRATION_TOKEN || ''
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || ''
const GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID || ''
const GHL_NEW_LEAD_STAGE_ID = process.env.GHL_NEW_LEAD_STAGE_ID || ''

/**
 * HighLevel has shipped custom fields in two shapes across v2 revisions:
 * `{ key, field_value }` and `{ id, value }`.
 *
 * VERIFIED against this live sub-account: the `key` shape works and must use
 * the BARE key (`utm_source`). Sending the fully-qualified key that the field
 * -creation endpoint returns (`contact.utm_source`) is accepted with HTTP 201
 * and then silently discarded — no error, no data.
 */
const CUSTOM_FIELD_SHAPE = (process.env.GHL_CUSTOM_FIELD_SHAPE || 'key') as 'key' | 'id'

export const isGhlConfigured = () => Boolean(GHL_TOKEN && GHL_LOCATION_ID)

export type GhlContactInput = {
  firstName?: string
  lastName?: string
  email: string
  /** E.164 preferred. */
  phone?: string
  source?: string
  tags?: string[]
  /**
   * Standard GHL contact property — NOT a custom field. HighLevel refuses to
   * create a custom field named `state` because it collides with this one.
   */
  state?: string
  /** Bare custom field API keys, e.g. `utm_source` (never `contact.utm_source`). */
  customFields?: Record<string, string | undefined>
}

function buildCustomFields(fields: Record<string, string | undefined> = {}) {
  return Object.entries(fields)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) =>
      CUSTOM_FIELD_SHAPE === 'key'
        ? { key, field_value: value }
        : { id: key, value },
    )
}

async function ghlFetch(path: string, body: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GHL_TOKEN}`,
      Version: API_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  })

  const text = await response.text()
  let parsed: unknown
  try {
    parsed = text ? JSON.parse(text) : {}
  } catch {
    parsed = { raw: text }
  }

  if (!response.ok) {
    throw new Error(`GHL ${path} failed (${response.status}): ${text.slice(0, 400)}`)
  }

  return parsed as Record<string, unknown>
}

/**
 * Creates or updates a contact.
 *
 * Uses upsert rather than create so someone who fills out two landing pages
 * becomes one contact with two touchpoints, not two contacts a setter calls
 * twice. Note this honors the location's "Allow Duplicate Contact" setting —
 * confirm it is set to disallow duplicates.
 */
export async function upsertGhlContact(input: GhlContactInput): Promise<{ contactId: string }> {
  const result = await ghlFetch('/contacts/upsert', {
    locationId: GHL_LOCATION_ID,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    state: input.state,
    source: input.source,
    tags: input.tags,
    customFields: buildCustomFields(input.customFields),
  })

  const contact = (result.contact ?? result) as Record<string, unknown>
  const contactId = (contact.id ?? contact._id) as string | undefined

  if (!contactId) {
    throw new Error(`GHL upsert returned no contact id: ${JSON.stringify(result).slice(0, 300)}`)
  }

  return { contactId }
}

/** Creates an opportunity at the New Lead stage, which is what fires WF-1. */
export async function createGhlOpportunity(params: {
  contactId: string
  name: string
  source?: string
  monetaryValue?: number
}): Promise<{ opportunityId: string | undefined }> {
  if (!GHL_PIPELINE_ID || !GHL_NEW_LEAD_STAGE_ID) {
    console.warn('[ghl] Pipeline or stage ID not configured — skipping opportunity creation.')
    return { opportunityId: undefined }
  }

  const result = await ghlFetch('/opportunities/', {
    locationId: GHL_LOCATION_ID,
    pipelineId: GHL_PIPELINE_ID,
    pipelineStageId: GHL_NEW_LEAD_STAGE_ID,
    contactId: params.contactId,
    name: params.name,
    status: 'open',
    source: params.source,
    monetaryValue: params.monetaryValue,
  })

  const opportunity = (result.opportunity ?? result) as Record<string, unknown>
  return { opportunityId: (opportunity.id ?? opportunity._id) as string | undefined }
}
