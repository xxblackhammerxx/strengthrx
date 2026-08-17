'use client'

import { useEffect } from 'react'

/**
 * Runs Meta's client-side Conversions API parameter builder on arrival.
 *
 * This is the half the pixel script cannot cover. It writes the `_fbc`, `_fbp`
 * and `_fbi` first-party cookies directly, so the identifiers exist even when
 * `fbevents.js` is blocked — which on a health-adjacent funnel is a meaningful
 * share of traffic. Every later conversion, browser or server, then reuses the
 * same IDs instead of arriving unidentified.
 *
 * It also recovers the backup click ID that the Facebook and Instagram in-app
 * browsers expose in place of a normal `fbclid`. Most ad traffic never leaves
 * those webviews, so without this the click ID is missing exactly where the
 * paid clicks are.
 *
 * Loaded dynamically: the bundle is only needed after paint, and keeping it
 * out of the initial chunk protects landing-page load time, which is itself an
 * ad-cost input.
 */
export function MetaParamBuilder() {
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const builder = await import('meta-capi-param-builder-clientjs')
        if (cancelled) return
        await builder.processAndCollectAllParams(window.location.href, getClientIp)
      } catch (error) {
        // Never let a measurement library break a landing page.
        console.warn('[meta-params] Parameter builder failed:', error)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}

/**
 * Optional IP resolver.
 *
 * Meta recommends looking the IP up from the browser so an IPv6 address is
 * captured even when the request to our own origin arrived over IPv4. Doing so
 * requires calling a third-party echo service, which means disclosing visitor
 * IPs from a health-adjacent landing page to a vendor we have no agreement
 * with — so it is off unless NEXT_PUBLIC_META_IP_LOOKUP_URL is deliberately
 * set.
 *
 * With it unset the server still supplies `client_ip_address` from the request
 * itself, which is already IPv6 for visitors whose connection to us used IPv6.
 */
const IP_LOOKUP_URL = process.env.NEXT_PUBLIC_META_IP_LOOKUP_URL

const getClientIp = IP_LOOKUP_URL
  ? async () => {
      const response = await fetch(IP_LOOKUP_URL, {
        signal: AbortSignal.timeout(2000),
      })
      return (await response.text()).trim()
    }
  : undefined
