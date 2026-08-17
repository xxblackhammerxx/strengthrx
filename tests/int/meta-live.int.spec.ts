import { describe, it, expect } from 'vitest'
import { MetaEvent } from '@/lib/meta/events'
import { valueParams } from '@/lib/meta/value'

/**
 * Live smoke test against Meta's Conversions API.
 *
 * Skipped unless META_TEST_EVENT_CODE is set, so it never runs in CI and never
 * writes live conversions. Grab a code from Events Manager -> Test Events,
 * then:
 *
 *   META_TEST_EVENT_CODE=TEST12345 pnpm test:int
 *
 * Watch the events appear in the Test Events tab as it runs.
 */

const testCode = process.env.META_TEST_EVENT_CODE
const hasCredentials = Boolean(
  (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.STRENGTHRX_PIXEL_ID) &&
    process.env.DATASET_QUALITY_API,
)

/**
 * Wraps fetch so Meta's response body is visible. A 200 alone does not prove
 * the parameters were understood — Meta reports unusable values as warnings in
 * the body while still accepting the request.
 */
async function withMetaResponseLogged<T>(run: () => Promise<T>): Promise<T> {
  const realFetch = globalThis.fetch
  globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
    const response = await realFetch(...args)
    const clone = response.clone()
    console.log('[meta-live] response:', await clone.text())
    return response
  }) as typeof fetch
  try {
    return await run()
  } finally {
    globalThis.fetch = realFetch
  }
}

describe.runIf(testCode && hasCredentials)('Meta CAPI — live', () => {
  it('accepts parameters produced by Meta’s own parameter builder', async () => {
    const { NextRequest } = await import('next/server')
    const { getMetaRequestContext, sendMetaEvent } = await import('@/lib/meta/capi')

    // A realistic ad click: fbclid in the URL, no cookies yet, real-looking IP.
    const request = new NextRequest(
      'https://www.yourstrengthrx.com/lp/mens-performance?fbclid=IwAR-live-smoke',
      {
        headers: new Headers({
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15',
          'x-forwarded-for': '198.51.100.7',
        }),
      },
    )

    const context = getMetaRequestContext(request)

    // Every value must carry the 8-character library appendix, which is how
    // Meta credits the integration for using the parameter builder.
    expect(context.fbc).toMatch(/\.[A-Za-z0-9_-]{8}$/)
    expect(context.fbp).toMatch(/\.[A-Za-z0-9_-]{8}$/)
    expect(context.clientIpAddress).toMatch(/\.[A-Za-z0-9_-]{8}$/)

    const result = await withMetaResponseLogged(() =>
      sendMetaEvent({
        eventName: MetaEvent.Lead,
        eventId: `live-smoke-parambuilder-${Date.now()}`,
        userData: {
          email: 'smoke-test@example.com',
          phone: '(657) 338-6004',
          firstName: 'Smoke',
          lastName: 'Test',
          state: 'Arizona',
          country: 'us',
          externalId: 'smoke-test-1',
        },
        customData: { content_name: 'Live Smoke Test', ...valueParams(MetaEvent.Lead) },
        context,
      }),
    )

    expect(result.ok).toBe(true)
  })

  it('accepts a fully-populated Lead with value', async () => {
    const { sendMetaEvent } = await import('@/lib/meta/capi')

    const result = await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: `live-smoke-lead-${Date.now()}`,
      userData: {
        email: 'smoke-test@example.com',
        phone: '6573386004',
        firstName: 'Smoke',
        lastName: 'Test',
        state: 'Arizona',
        country: 'us',
        externalId: 'smoke-test-1',
      },
      customData: { content_name: 'Live Smoke Test', ...valueParams(MetaEvent.Lead) },
      context: {
        fbp: 'fb.1.1700000000.1234567890',
        clientIpAddress: '198.51.100.7',
        clientUserAgent: 'StrengthRX-Smoke/1.0',
        eventSourceUrl: 'https://www.yourstrengthrx.com/book',
      },
    })

    expect(result.ok).toBe(true)
  })

  it('accepts every event in the value table', async () => {
    const { sendMetaEvents } = await import('@/lib/meta/capi')

    const result = await sendMetaEvents(
      Object.values(MetaEvent).map((eventName, i) => ({
        eventName,
        eventId: `live-smoke-${eventName}-${Date.now()}-${i}`,
        userData: { email: 'smoke-test@example.com', country: 'us' },
        customData: { content_name: 'Live Smoke Test', ...valueParams(eventName) },
        context: { clientUserAgent: 'StrengthRX-Smoke/1.0' },
      })),
    )

    expect(result.ok).toBe(true)
  })
})
