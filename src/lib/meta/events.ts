/**
 * Canonical Meta standard event names used by this site.
 *
 * Only events that can actually be fired from somewhere in the product belong
 * here — selecting an event in Events Manager that never fires just leaves an
 * empty column in reporting.
 */
export const MetaEvent = {
  /** Someone viewed a service / offer page. */
  ViewContent: 'ViewContent',
  /** Primary optimization event: a qualified inquiry was submitted. */
  Lead: 'Lead',
  /** Contact form submission. */
  Contact: 'Contact',
  /** Consultation booked on the GHL calendar. */
  Schedule: 'Schedule',
  /** Client account created via the Get Started flow. */
  CompleteRegistration: 'CompleteRegistration',
  /** Recurring membership started (wire up when billing moves on-site). */
  Subscribe: 'Subscribe',
  /** One-time payment (wire up when billing moves on-site). */
  Purchase: 'Purchase',
} as const

export type MetaEventName = (typeof MetaEvent)[keyof typeof MetaEvent]

/**
 * Events the browser is allowed to hand to /api/meta/track.
 *
 * Deliberately excludes Purchase and Subscribe — money events must originate
 * server-side from a verified billing webhook, never from a client that anyone
 * can call with curl.
 */
export const CLIENT_TRACKABLE_EVENTS: MetaEventName[] = [
  MetaEvent.ViewContent,
  MetaEvent.Lead,
  MetaEvent.Contact,
  MetaEvent.Schedule,
]
