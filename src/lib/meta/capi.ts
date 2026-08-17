import 'server-only'

import type { NextRequest } from 'next/server'
import type { MetaEventName } from './events'
import { hashPii, PiiType, readMetaParams, type MetaCookieToSet } from './param-builder'

const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v23.0'

/**
 * The pixel ID is also exposed publicly for the browser snippet; STRENGTHRX_PIXEL_ID
 * is the server-side fallback so both halves stay in sync from one source.
 */
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.STRENGTHRX_PIXEL_ID || ''

/** Server-only Conversions API access token. */
const META_CAPI_TOKEN = process.env.DATASET_QUALITY_API || ''

/**
 * When set, events land in the "Test Events" tab in Events Manager instead of
 * counting as live conversions. Leave unset in production.
 */
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || undefined

const isCapiConfigured = () => Boolean(META_PIXEL_ID && META_CAPI_TOKEN)

/**
 * Raw, un-hashed customer identifiers. Everything here is normalized and
 * SHA-256 hashed before it leaves the server — plaintext PII is never sent.
 *
 * The number of these fields you can populate is what drives Event Match
 * Quality, which is the score the Dataset Quality API reports on.
 */
export type MetaUserData = {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  /** Stable internal ID (e.g. Payload client id). Hashed, never sent raw. */
  externalId?: string | number | null
}

/** Signals read off the incoming request — sent un-hashed, per Meta's spec. */
export type MetaRequestContext = {
  /** _fbp cookie — the pixel's first-party browser ID. */
  fbp?: string
  /** _fbc cookie, or one derived from an fbclid query param or referer. */
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
  eventSourceUrl?: string
  /**
   * Cookies Meta's parameter builder wants persisted. Pass the context to
   * `applyMetaCookies(response, context)` before returning, or the identifiers
   * are regenerated on the next request and the visitor looks brand new.
   */
  cookiesToSet?: MetaCookieToSet[]
}

export type MetaCapiEvent = {
  eventName: MetaEventName
  /**
   * Must match the event_id used by the browser pixel for the same action.
   * This is what lets Meta deduplicate the browser and server copies.
   */
  eventId: string
  /** Unix seconds. Defaults to now. Meta rejects events older than 7 days. */
  eventTime?: number
  userData?: MetaUserData
  customData?: Record<string, unknown>
  actionSource?: 'website' | 'system_generated'
  context?: MetaRequestContext
}

/**
 * Meta's SDK reduces a phone to bare digits and drops leading zeros — it does
 * NOT add a country code. A US number handed over raw hashes as `6025550101`
 * while Meta stores `16025550101`, so the match silently fails.
 *
 * Pre-normalizing to E.164 digits here fixes that; the SDK's own digit strip
 * is then a no-op over the result.
 */
export const toMetaPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10) return `1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return digits
  return digits.replace(/^0+/, '')
}

/**
 * Builds the `user_data` block.
 *
 * Every identifier is normalized and hashed by Meta's parameter builder, so
 * the normalization rules stay in step with theirs rather than drifting from a
 * copy of the docs, and each value carries the library appendix that tells
 * Meta the parameter builder produced it.
 */
function buildUserData(userData: MetaUserData | undefined, context: MetaRequestContext | undefined) {
  const payload: Record<string, string | string[]> = {}

  const set = (key: string, hash: string | undefined) => {
    if (hash) payload[key] = [hash]
  }

  set('em', hashPii(userData?.email, PiiType.EMAIL))
  set('ph', hashPii(userData?.phone ? toMetaPhone(String(userData.phone)) : null, PiiType.PHONE))
  set('fn', hashPii(userData?.firstName, PiiType.FIRST_NAME))
  set('ln', hashPii(userData?.lastName, PiiType.LAST_NAME))
  set('ct', hashPii(userData?.city, PiiType.CITY))
  set('st', hashPii(userData?.state, PiiType.STATE))
  set('zp', hashPii(userData?.zip, PiiType.ZIP_CODE))
  set('country', hashPii(userData?.country, PiiType.COUNTRY))
  set('external_id', hashPii(userData?.externalId, PiiType.EXTERNAL_ID))

  // These are matching signals, not PII — Meta requires them un-hashed.
  if (context?.fbp) payload.fbp = context.fbp
  if (context?.fbc) payload.fbc = context.fbc
  if (context?.clientIpAddress) payload.client_ip_address = context.clientIpAddress
  if (context?.clientUserAgent) payload.client_user_agent = context.clientUserAgent

  return payload
}

/**
 * Pulls the matching signals Meta cares about off an inbound request.
 *
 * Delegates to Meta's parameter builder, which mints a `_fbp` when none exists
 * (so events still carry a browser ID when the pixel script is blocked),
 * recovers `fbclid` from the query string or the referer, computes the correct
 * subdomain index, and picks the best client IP with IPv6 preferred.
 *
 * The returned `cookiesToSet` must be applied to the response — see
 * `applyMetaCookies`.
 */
export function getMetaRequestContext(request: NextRequest): MetaRequestContext {
  return readMetaParams(request)
}

export { applyMetaCookies } from './param-builder'

/**
 * Sends one or more events to the Conversions API.
 *
 * Never throws: analytics must not be able to fail a signup or a contact form.
 * Failures are logged and swallowed.
 */
export async function sendMetaEvents(events: MetaCapiEvent[]): Promise<{ ok: boolean }> {
  if (!isCapiConfigured()) {
    console.warn('[meta-capi] Skipped — pixel ID or access token is not configured.')
    return { ok: false }
  }
  if (!events.length) return { ok: true }

  const data = events.map((event) => ({
    event_name: event.eventName,
    event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: event.eventId,
    action_source: event.actionSource ?? 'website',
    ...(event.context?.eventSourceUrl ? { event_source_url: event.context.eventSourceUrl } : {}),
    user_data: buildUserData(event.userData, event.context),
    ...(event.customData ? { custom_data: event.customData } : {}),
  }))

  const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data,
        access_token: META_CAPI_TOKEN,
        ...(META_TEST_EVENT_CODE ? { test_event_code: META_TEST_EVENT_CODE } : {}),
      }),
      // Analytics should never hold a user request open.
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`[meta-capi] ${response.status} sending ${data.map((d) => d.event_name).join(', ')}: ${body}`)
      return { ok: false }
    }

    return { ok: true }
  } catch (error) {
    console.error('[meta-capi] Request failed:', error)
    return { ok: false }
  }
}

/** Convenience wrapper for the common single-event case. */
export const sendMetaEvent = (event: MetaCapiEvent) => sendMetaEvents([event])
