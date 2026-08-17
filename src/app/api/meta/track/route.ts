import { NextRequest, NextResponse } from 'next/server'
import { applyMetaCookies, getMetaRequestContext, sendMetaEvent } from '@/lib/meta/capi'
import { CLIENT_TRACKABLE_EVENTS, type MetaEventName } from '@/lib/meta/events'
import { valueParams } from '@/lib/meta/value'

/**
 * Server-side companion for browser-originated events.
 *
 * The browser fires the pixel copy and calls this with the same event_id;
 * Meta collapses the pair. This exists so events still land when a content
 * blocker or ITP kills the pixel request — typically 15-30% of paid traffic.
 *
 * Money events (Purchase, Subscribe) are deliberately not accepted here:
 * anything this endpoint will send, an attacker can also send.
 */

const MAX_STRING = 200

const clean = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, MAX_STRING) : undefined
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName = body.eventName as MetaEventName
  const eventId = clean(body.eventId)

  if (!eventName || !CLIENT_TRACKABLE_EVENTS.includes(eventName)) {
    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 })
  }
  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
  }

  const context = getMetaRequestContext(request)

  // Prefer the cookies the browser actually read; fall back to request cookies.
  const fbp = clean(body.fbp) ?? context.fbp
  const fbc = clean(body.fbc) ?? context.fbc
  const eventSourceUrl = clean(body.sourceUrl) ?? context.eventSourceUrl

  const rawUserData = (body.userData ?? {}) as Record<string, unknown>

  // Only fields the browser legitimately holds; everything else is ignored.
  const userData = {
    email: clean(rawUserData.email),
    phone: clean(rawUserData.phone),
    firstName: clean(rawUserData.firstName),
    lastName: clean(rawUserData.lastName),
    state: clean(rawUserData.state),
    country: 'us',
  }

  const rawCustom = (body.customData ?? {}) as Record<string, unknown>
  const customData: Record<string, unknown> = {}
  for (const key of ['content_name', 'content_category', 'content_type']) {
    const value = clean(rawCustom[key])
    if (value) customData[key] = value
  }

  // The monetary value is stamped from the server-side table, never taken from
  // the request — otherwise anyone could post a $1,000,000 Lead and poison
  // value-based bidding. This is also what keeps the pixel and CAPI copies of
  // a deduplicated pair carrying identical values.
  Object.assign(customData, valueParams(eventName))

  await sendMetaEvent({
    eventName,
    eventId,
    userData,
    customData: Object.keys(customData).length ? customData : undefined,
    context: { ...context, fbp, fbc, eventSourceUrl },
  })

  // Persist any identifier the builder minted, so the next event in the
  // session reuses it instead of looking like a different browser.
  return applyMetaCookies(NextResponse.json({ success: true }), context)
}
