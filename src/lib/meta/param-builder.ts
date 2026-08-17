import 'server-only'

import { ParamBuilder, PlainDataObject, PII_DATA_TYPE } from 'capi-param-builder-nodejs'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Thin typed wrapper around Meta's official Conversions API parameter builder
 * (`capi-param-builder-nodejs`).
 *
 * Meta flagged our integration for weak parameters. Hand-rolled `fbc`/`fbp`
 * handling loses match quality in ways that are invisible from our side:
 *
 *  - `fbp` was only ever read, never created. If the pixel script was blocked
 *    (ad blockers, iOS content blockers, tracking protection) no `_fbp` cookie
 *    existed and every CAPI event for that visitor shipped without a browser
 *    ID. The SDK mints one server-side so the identifier survives.
 *  - `fbc` was synthesized as `fb.1.<ts>.<fbclid>` with a hardcoded subdomain
 *    index of 1. The correct index is derived from the eTLD+1, and the value
 *    must persist to a cookie so later events in the session reuse the *same*
 *    timestamp rather than minting a new one per request.
 *  - Every parameter now carries Meta's 8-character appendix, which is how
 *    they attribute match-quality improvements back to the library. Without it
 *    the integration is not recognized as using the parameter builder at all.
 *
 * The builder is stateful per request (it stores fbc/fbp/ip on the instance),
 * so a new one is constructed per call — never share a module-level singleton.
 */

/**
 * Domains that share our first-party cookies, used to compute the eTLD+1 and
 * therefore the `subdomain_index` embedded in `_fbc`/`_fbp`.
 *
 * Passing this explicitly matters: without a domain list the SDK falls back to
 * "strip the first label", which turns `www.yourstrengthrx.com` into the right
 * answer by luck but would break on any deeper subdomain (`go.lp.example.com`).
 */
const COOKIE_DOMAINS = (process.env.META_COOKIE_DOMAINS || 'yourstrengthrx.com')
  .split(',')
  .map((domain) => domain.trim())
  .filter(Boolean)

/** Cookie written by the SDK to carry the client IP between requests. */
const IP_COOKIE = '_fbi'

export type MetaCookieToSet = {
  name: string
  value: string
  maxAge: number
  domain?: string
}

export type MetaParams = {
  /** Click ID, appendix-suffixed. Sent to Meta un-hashed. */
  fbc?: string
  /** Browser ID, appendix-suffixed. Sent to Meta un-hashed. */
  fbp?: string
  /** Best available client IP — IPv6 preferred over IPv4 by the SDK. */
  clientIpAddress?: string
  clientUserAgent?: string
  eventSourceUrl?: string
  /**
   * Cookies the SDK wants persisted (a newly minted `_fbp`, a refreshed
   * `_fbc`, or an existing cookie upgraded to the current appendix format).
   *
   * These MUST be written to the response or the values are regenerated on
   * every request, which looks to Meta like a brand new browser each time.
   */
  cookiesToSet: MetaCookieToSet[]
}

/** Meta's supported PII types, re-exported so callers avoid a raw string. */
export const PiiType = PII_DATA_TYPE

/**
 * Normalizes and SHA-256 hashes a customer identifier using Meta's own rules,
 * returning the hash with the library appendix appended.
 *
 * Returns undefined for empty or unnormalizable input — sending a hash of an
 * empty string is worse than sending nothing, because it matches no one while
 * still counting against the parameter's coverage rate.
 */
export function hashPii(
  value: string | number | null | undefined,
  type: (typeof PII_DATA_TYPE)[keyof typeof PII_DATA_TYPE],
): string | undefined {
  if (value === null || value === undefined) return undefined
  const raw = String(value).trim()
  if (!raw) return undefined
  return new ParamBuilder(COOKIE_DOMAINS).getNormalizedAndHashedPII(raw, type) ?? undefined
}

/**
 * Reads every Meta matching signal off an inbound request.
 *
 * Note on API routes: a POST to `/api/leads` has no `?fbclid=` of its own, but
 * the browser sends the landing page as `Referer` and the SDK recovers the
 * click ID from there — so a first-touch conversion still attributes even when
 * the cookie has not been written yet.
 */
export function readMetaParams(request: NextRequest): MetaParams {
  const builder = new ParamBuilder(COOKIE_DOMAINS)

  const cookies: Record<string, string> = {}
  for (const cookie of request.cookies.getAll()) {
    cookies[cookie.name] = cookie.value
  }

  const queryParams: Record<string, string> = {}
  request.nextUrl.searchParams.forEach((value, key) => {
    queryParams[key] = value
  })

  const headers = request.headers
  const host = headers.get('host') || request.nextUrl.host

  // `x-real-ip` stands in for the socket address. Next.js does not expose the
  // raw connection, and behind Vercel/Cloudflare the socket would be the proxy
  // anyway — the SDK discards private ranges, so a bad value cannot poison it.
  const remoteAddress = headers.get('x-real-ip')

  builder.processRequestFromContext(
    new PlainDataObject(
      host,
      queryParams,
      cookies,
      headers.get('referer'),
      // Cloudflare hands us the true client IP directly; prefer it over the
      // XFF chain, which a proxy can prepend spoofed entries to.
      headers.get('cf-connecting-ip') || headers.get('x-forwarded-for'),
      remoteAddress,
      request.nextUrl.protocol.replace(':', '') || 'https',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    ),
  )

  const cookiesToSet: MetaCookieToSet[] = builder.getCookiesToSet().map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    maxAge: cookie.maxAge,
    domain: cookie.domain || undefined,
  }))

  const clientIpAddress = builder.getClientIpAddress() || undefined

  // The SDK resolves the best IP but does not queue it for persistence. Cache
  // it so a later request that arrives without a usable IP — or with a worse
  // IPv4 when we already had IPv6 — can still reuse the better value.
  if (clientIpAddress && cookies[IP_COOKIE] !== clientIpAddress) {
    cookiesToSet.push({
      name: IP_COOKIE,
      value: clientIpAddress,
      maxAge: 90 * 24 * 3600,
      domain: undefined,
    })
  }

  return {
    fbc: builder.getFbc() || undefined,
    fbp: builder.getFbp() || undefined,
    clientIpAddress,
    clientUserAgent: headers.get('user-agent') || undefined,
    // The SDK rebuilds this from scheme + host + URI. On an API route that is
    // the API path, which is useless for URL-level reporting, so the referer
    // (the actual page the visitor was on) wins when present.
    eventSourceUrl: headers.get('referer') || builder.getEventSourceUrl() || undefined,
    cookiesToSet,
  }
}

/**
 * Persists the SDK's cookies onto an outgoing response.
 *
 * Not httpOnly on purpose: the Meta pixel and the client-side parameter
 * builder both read `_fbc`/`_fbp` from `document.cookie`, and hiding them
 * would leave the browser and server halves disagreeing about identity.
 */
export function applyMetaCookies<T extends NextResponse>(
  response: T,
  params: { cookiesToSet?: MetaCookieToSet[] },
): T {
  for (const cookie of params.cookiesToSet ?? []) {
    // A Domain attribute scopes the cookie to the apex so www and any
    // subdomain share one identity. Omitted for dotless hosts — browsers
    // reject `Domain=localhost`, which would drop the cookie in development.
    const scopeToDomain = cookie.domain?.includes('.')

    response.cookies.set(cookie.name, cookie.value, {
      maxAge: cookie.maxAge,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      ...(scopeToDomain ? { domain: cookie.domain } : {}),
    })
  }
  return response
}
