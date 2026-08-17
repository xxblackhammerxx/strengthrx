/**
 * Ad attribution capture.
 *
 * Params land on the ad destination but the form is often submitted a page or
 * two later, so they are persisted to a first-party cookie the moment a
 * visitor arrives. The cookie is readable by the browser (to populate hidden
 * form fields) and by the server (as a fallback when the browser copy is
 * missing), which is what keeps attribution intact across navigation.
 */

export const ATTRIBUTION_COOKIE = 'srx_attr'
const MAX_AGE_DAYS = 90
const MAX_VALUE_LENGTH = 300

export type Attribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_id?: string
  fbclid?: string
  gclid?: string
  /** Meta ad hierarchy, when passed through by the ad URL template. */
  ad_id?: string
  adset_id?: string
  campaign_id?: string
  /** Partner referral code — the `?ref=` convention used by partner links. */
  partner_id?: string
  /** Where the visitor first entered the site. */
  entry_path?: string
  /** External referrer of the first visit. */
  referrer?: string
  first_seen?: string
}

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
] as const

const CLICK_ID_KEYS = ['fbclid', 'gclid', 'ad_id', 'adset_id', 'campaign_id'] as const

const truncate = (value: string) => value.trim().slice(0, MAX_VALUE_LENGTH)

/** Reads attribution params out of a query string. */
export function readAttributionParams(params: URLSearchParams): Attribution {
  const attribution: Attribution = {}

  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = params.get(key)
    if (value) attribution[key] = truncate(value)
  }

  // Partner links use ?ref=, matching the existing referral-link convention.
  const ref = params.get('ref') || params.get('partner_id')
  if (ref) attribution.partner_id = truncate(ref)

  return attribution
}

export function parseAttributionCookie(raw: string | undefined): Attribution {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    return typeof parsed === 'object' && parsed !== null ? (parsed as Attribution) : {}
  } catch {
    return {}
  }
}

/**
 * Merges a new visit into whatever was already stored.
 *
 * Last-touch wins for campaign params: if someone clicks a second ad, that ad
 * deserves the credit, and it matches how Meta attributes its own conversions.
 * Entry path, referrer and first-seen are first-touch and never overwritten,
 * so the original source survives. A partner code is also never overwritten —
 * a partner who sourced a lead does not lose the commission because the lead
 * later clicked a retargeting ad.
 */
export function mergeAttribution(existing: Attribution, incoming: Attribution): Attribution {
  const hasNewCampaign = UTM_KEYS.some((key) => incoming[key]) || Boolean(incoming.fbclid)

  return {
    ...existing,
    ...(hasNewCampaign ? incoming : { ...incoming, ...stripEmpty(existing) }),
    partner_id: existing.partner_id ?? incoming.partner_id,
    entry_path: existing.entry_path ?? incoming.entry_path,
    referrer: existing.referrer ?? incoming.referrer,
    first_seen: existing.first_seen ?? incoming.first_seen,
  }
}

const stripEmpty = (attribution: Attribution): Attribution =>
  Object.fromEntries(Object.entries(attribution).filter(([, v]) => v)) as Attribution

// ─── Browser helpers ──────────────────────────────────────────────────────────

export function readAttributionCookie(): Attribution {
  if (typeof document === 'undefined') return {}
  const match = document.cookie.match(new RegExp(`(?:^|; )${ATTRIBUTION_COOKIE}=([^;]*)`))
  return parseAttributionCookie(match?.[1])
}

function writeAttributionCookie(attribution: Attribution) {
  const value = encodeURIComponent(JSON.stringify(attribution))
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${ATTRIBUTION_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

/**
 * Call once per page load. Safe to call repeatedly — merging is idempotent
 * when there are no new params in the URL.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  const incoming = readAttributionParams(new URLSearchParams(window.location.search))
  incoming.entry_path = window.location.pathname
  incoming.first_seen = new Date().toISOString()

  // Only record an external referrer; internal navigation is not a source.
  if (document.referrer && !document.referrer.includes(window.location.host)) {
    incoming.referrer = truncate(document.referrer)
  }

  const merged = mergeAttribution(readAttributionCookie(), incoming)
  writeAttributionCookie(merged)
  return merged
}
