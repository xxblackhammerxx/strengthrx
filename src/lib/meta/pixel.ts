'use client'

import { CLIENT_TRACKABLE_EVENTS, type MetaEventName } from './events'
import { valueParams } from './value'

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] }
  }
}

/** Generates the shared ID that lets Meta dedupe the browser and server copies. */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

/** The pixel's first-party identifiers, forwarded to the server for CAPI. */
export function getMetaBrowserIds() {
  return { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') }
}

/**
 * Fires the browser-side copy of an event.
 *
 * The canonical value/currency is merged in here so callers cannot forget it,
 * and so this copy matches what the server stamps on the CAPI copy.
 */
export function trackPixel(
  eventName: MetaEventName,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === 'undefined' || !window.fbq) return
  const payload = { ...params, ...valueParams(eventName) }
  window.fbq('track', eventName, payload, eventId ? { eventID: eventId } : undefined)
}

type ServerTrackPayload = {
  eventName: MetaEventName
  eventId: string
  customData?: Record<string, unknown>
  userData?: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    state?: string
  }
}

/** Fires the server-side copy via our CAPI bridge. */
async function trackServer(payload: ServerTrackPayload) {
  try {
    await fetch('/api/meta/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ...getMetaBrowserIds(), sourceUrl: window.location.href }),
      keepalive: true,
    })
  } catch {
    // Analytics failures are never surfaced to the user.
  }
}

/**
 * Fires an event through both the browser pixel and the Conversions API using
 * one shared event_id, so Meta counts it once but can fall back to the server
 * copy when the browser call is blocked.
 *
 * Use this for events the browser originates. Events that already have a
 * server route (signup, contact) send their server copy from that route
 * instead — pass the same eventId to `trackPixel` there.
 */
export async function trackEvent(
  eventName: MetaEventName,
  options: {
    params?: Record<string, unknown>
    userData?: ServerTrackPayload['userData']
    eventId?: string
  } = {},
) {
  const eventId = options.eventId ?? newEventId()

  trackPixel(eventName, options.params ?? {}, eventId)

  if (CLIENT_TRACKABLE_EVENTS.includes(eventName)) {
    await trackServer({
      eventName,
      eventId,
      customData: options.params,
      userData: options.userData,
    })
  }

  return eventId
}
