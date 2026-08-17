'use client'

import { useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { readAttributionCookie } from '@/lib/attribution'

/** Attribution params forwarded into the booking widget. */
const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'fbclid',
  'gclid',
  'ad_id',
  'adset_id',
  'campaign_id',
  'partner_id',
] as const

/** Contact fields the GHL booking widget accepts as query prefill. */
export type CalendarPrefill = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

type Props = {
  calendarId: string
  /** Minimum height before the resize script takes over. */
  minHeight?: number
  /**
   * Pre-populates the widget's contact fields.
   *
   * Set when the calendar is shown straight after a lead form: asking someone to
   * type their name, email and phone a second time is the largest single drop-off
   * between capturing a lead and getting a booked consultation.
   */
  prefill?: CalendarPrefill
}

/**
 * Embeds a GoHighLevel booking calendar.
 *
 * The iframe is cross-origin, so nothing inside it is readable from here —
 * that is why the conversion event is fired on the redirect target
 * (/book/thanks) rather than by listening to the widget.
 */
export function GhlCalendarEmbed({ calendarId, minHeight = 750, prefill }: Props) {
  const searchParams = useSearchParams()
  // GHL's resize script keys off an id of the form `<calendarId>_<unique>`.
  // Generated after mount so server and client markup match.
  const [frameId, setFrameId] = useState<string>()

  useEffect(() => {
    setFrameId(`${calendarId}_${Date.now()}`)
  }, [calendarId])

  const src = useMemo(() => {
    const url = new URL(`https://api.leadconnectorhq.com/widget/booking/${calendarId}`)

    // Params in the current URL win, but most visitors reach this page from a
    // landing page with a bare /book link — so fall back to the attribution
    // cookie captured on arrival. Without this, every booking that involved a
    // click between landing and calendar loses its campaign attribution.
    const stored = readAttributionCookie() as Record<string, string | undefined>

    for (const key of TRACKED_PARAMS) {
      const value = searchParams.get(key) ?? stored[key]
      if (value) url.searchParams.set(key, value)
    }

    // GHL reads these as the widget's contact prefill.
    if (prefill?.firstName) url.searchParams.set('first_name', prefill.firstName)
    if (prefill?.lastName) url.searchParams.set('last_name', prefill.lastName)
    if (prefill?.email) url.searchParams.set('email', prefill.email)
    if (prefill?.phone) url.searchParams.set('phone', prefill.phone)

    return url.toString()
  }, [calendarId, searchParams, prefill])

  return (
    <>
      <iframe
        // Remount when attribution changes so the widget picks up the params.
        key={src}
        id={frameId}
        src={src}
        title="Book your consultation"
        scrolling="no"
        style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight }}
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  )
}
