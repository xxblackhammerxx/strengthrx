import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHash } from 'crypto'
import { MetaEvent } from '@/lib/meta/events'
import {
  EVENT_VALUE,
  MEMBER_LTV,
  PRICING,
  AVG_MEMBERSHIP_MONTHS,
  membershipValueParams,
  valueParams,
} from '@/lib/meta/value'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PIXEL_ID = 'test-pixel-123'
const TOKEN = 'test-token-abc'

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')

/**
 * Meta's parameter builder appends an 8-character appendix to every value it
 * produces (`<sha256>.<appendix>`). That suffix is how Meta attributes match
 * quality back to the library, so its presence is asserted rather than
 * stripped — but the bytes encode the SDK version, so the exact string is not
 * pinned or a dependency bump would fail the suite for no reason.
 */
function expectHashOf(actual: string[] | undefined, plaintext: string) {
  expect(actual).toBeDefined()
  const [hash, appendix] = actual![0].split('.')
  expect(hash).toBe(sha256(plaintext))
  expect(appendix).toHaveLength(8)
}

/** Builds a real NextRequest so the cookie/header APIs behave as in production. */
async function makeRequest(
  url: string,
  init: { headers?: Record<string, string>; cookies?: Record<string, string> } = {},
) {
  const { NextRequest } = await import('next/server')
  const headers = new Headers(init.headers ?? {})
  if (init.cookies && Object.keys(init.cookies).length) {
    headers.set(
      'cookie',
      Object.entries(init.cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; '),
    )
  }
  return new NextRequest(url, { headers })
}

/** Loads capi.ts fresh so it re-reads the mocked env at module scope. */
async function loadCapi() {
  vi.resetModules()
  process.env.NEXT_PUBLIC_META_PIXEL_ID = PIXEL_ID
  process.env.DATASET_QUALITY_API = TOKEN
  delete process.env.META_TEST_EVENT_CODE
  return import('@/lib/meta/capi')
}

function mockFetchOk() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: async () => '{"events_received":1}',
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** The JSON body of the most recent CAPI call. */
const lastBody = (fetchMock: ReturnType<typeof vi.fn>) =>
  JSON.parse(fetchMock.mock.calls.at(-1)![1].body)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Meta event values', () => {
  it('derives member LTV from monthly price and retention', () => {
    expect(MEMBER_LTV).toBe(PRICING.membershipMonthly * AVG_MEMBERSHIP_MONTHS)
  })

  it('sends no value on ViewContent so Meta cannot optimize toward cheap traffic', () => {
    expect(EVENT_VALUE[MetaEvent.ViewContent]).toBeNull()
    expect(valueParams(MetaEvent.ViewContent)).toEqual({})
  })

  it('values a booked consult well above a raw lead', () => {
    const lead = EVENT_VALUE[MetaEvent.Lead]!
    const schedule = EVENT_VALUE[MetaEvent.Schedule]!
    expect(schedule).toBeGreaterThan(lead)
    // A booking should be worth meaningfully more, not marginally more.
    expect(schedule / lead).toBeGreaterThan(2)
  })

  it('keeps every upper-funnel value below full member LTV', () => {
    for (const event of [
      MetaEvent.Lead,
      MetaEvent.Contact,
      MetaEvent.Schedule,
      MetaEvent.CompleteRegistration,
    ]) {
      expect(EVENT_VALUE[event]!).toBeLessThan(MEMBER_LTV)
      expect(EVENT_VALUE[event]!).toBeGreaterThan(0)
    }
  })

  it('uses real prices for the two money events', () => {
    expect(EVENT_VALUE[MetaEvent.Subscribe]).toBe(PRICING.membershipMonthly)
    expect(EVENT_VALUE[MetaEvent.Purchase]).toBe(PRICING.labPanel)
  })

  it('attaches predicted LTV to a started membership', () => {
    expect(membershipValueParams()).toEqual({
      value: 350,
      currency: 'USD',
      predicted_ltv: MEMBER_LTV,
    })
  })

  it('emits value and currency together or not at all', () => {
    for (const event of Object.values(MetaEvent)) {
      const params = valueParams(event)
      expect('value' in params).toBe('currency' in params)
    }
  })
})

describe('Conversions API payload', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hashes email, phone and name with Meta normalization', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()

    await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: 'evt-1',
      userData: {
        email: '  Bobby.Wolfe@Example.COM ',
        // 10-digit US number: must gain a 1 prefix or matching fails.
        phone: '(657) 338-6004',
        firstName: "O'Brien",
        lastName: ' Hatch ',
        state: 'Arizona',
      },
    })

    const { user_data: userData } = lastBody(fetchMock).data[0]

    expectHashOf(userData.em, 'bobby.wolfe@example.com')
    // Meta's SDK strips a phone to bare digits and never adds a country code,
    // so we normalize to E.164 first. Without the leading 1 this hashes to a
    // value Meta holds no record of and the match silently fails.
    expectHashOf(userData.ph, '16573386004')
    expectHashOf(userData.fn, 'obrien')
    expectHashOf(userData.ln, 'hatch')
    // Full state names must collapse to the 2-letter abbreviation.
    expectHashOf(userData.st, 'az')
  })

  it('accepts an already-hashed identifier without double-hashing it', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()
    const preHashed = sha256('kendon@example.com')

    await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: 'evt-prehashed',
      userData: { email: preHashed },
    })

    const { user_data: userData } = lastBody(fetchMock).data[0]
    expectHashOf(userData.em, 'kendon@example.com')
  })

  it('never transmits raw PII', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()

    await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: 'evt-2',
      userData: { email: 'leak@example.com', phone: '6573386004', firstName: 'Kendon' },
    })

    const raw = fetchMock.mock.calls.at(-1)![1].body as string
    expect(raw).not.toContain('leak@example.com')
    expect(raw).not.toContain('6573386004')
    expect(raw).not.toContain('Kendon')
  })

  it('omits identifiers that were not supplied rather than hashing empty strings', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()

    await sendMetaEvent({
      eventName: MetaEvent.Lead,
      eventId: 'evt-3',
      userData: { email: 'a@b.com', phone: '', firstName: null, lastName: undefined },
    })

    const { user_data: userData } = lastBody(fetchMock).data[0]
    expect(userData.em).toBeDefined()
    expect(userData).not.toHaveProperty('ph')
    expect(userData).not.toHaveProperty('fn')
    expect(userData).not.toHaveProperty('ln')
  })

  it('passes browser match signals through un-hashed', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()

    await sendMetaEvent({
      eventName: MetaEvent.Schedule,
      eventId: 'evt-4',
      context: {
        fbp: 'fb.1.1700000000.123456',
        fbc: 'fb.1.1700000000.IwAR-test',
        clientIpAddress: '203.0.113.9',
        clientUserAgent: 'Mozilla/5.0',
        eventSourceUrl: 'https://www.yourstrengthrx.com/book/thanks',
      },
    })

    const event = lastBody(fetchMock).data[0]
    expect(event.user_data.fbp).toBe('fb.1.1700000000.123456')
    expect(event.user_data.fbc).toBe('fb.1.1700000000.IwAR-test')
    expect(event.user_data.client_ip_address).toBe('203.0.113.9')
    expect(event.event_source_url).toBe('https://www.yourstrengthrx.com/book/thanks')
  })

  it('sends the event_id needed to dedupe against the browser pixel', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvents } = await loadCapi()

    await sendMetaEvents([
      { eventName: MetaEvent.CompleteRegistration, eventId: 'shared-id-1' },
      { eventName: MetaEvent.Lead, eventId: 'shared-id-2' },
    ])

    const { data } = lastBody(fetchMock)
    expect(data).toHaveLength(1 + 1)
    expect(data.map((d: { event_id: string }) => d.event_id)).toEqual([
      'shared-id-1',
      'shared-id-2',
    ])
    expect(data[0].action_source).toBe('website')
    expect(typeof data[0].event_time).toBe('number')
  })

  it('posts to the configured pixel with the access token', async () => {
    const fetchMock = mockFetchOk()
    const { sendMetaEvent } = await loadCapi()

    await sendMetaEvent({ eventName: MetaEvent.Lead, eventId: 'evt-5' })

    const [url] = fetchMock.mock.calls.at(-1)!
    expect(url).toContain(`/${PIXEL_ID}/events`)
    expect(lastBody(fetchMock).access_token).toBe(TOKEN)
    // No test code configured, so events must count as live.
    expect(lastBody(fetchMock)).not.toHaveProperty('test_event_code')
  })

  it('swallows API failures so a signup can never be broken by analytics', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => '{"error":{"message":"bad"}}',
    })
    vi.stubGlobal('fetch', fetchMock)
    const { sendMetaEvent } = await loadCapi()

    await expect(sendMetaEvent({ eventName: MetaEvent.Lead, eventId: 'evt-6' })).resolves.toEqual({
      ok: false,
    })
  })

  it('swallows network errors too', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')))
    const { sendMetaEvent } = await loadCapi()

    await expect(sendMetaEvent({ eventName: MetaEvent.Lead, eventId: 'evt-7' })).resolves.toEqual({
      ok: false,
    })
  })

  it('does not call Meta at all when credentials are missing', async () => {
    const fetchMock = mockFetchOk()
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID
    delete process.env.STRENGTHRX_PIXEL_ID
    delete process.env.DATASET_QUALITY_API
    const { sendMetaEvent } = await import('@/lib/meta/capi')

    await sendMetaEvent({ eventName: MetaEvent.Lead, eventId: 'evt-8' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('browser pixel', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('merges the canonical value into the fbq call', async () => {
    const fbq = vi.fn()
    vi.stubGlobal('fbq', fbq)
    vi.resetModules()
    const { trackPixel } = await import('@/lib/meta/pixel')

    trackPixel(MetaEvent.Schedule, { content_name: 'Consultation Booked' }, 'evt-abc')

    expect(fbq).toHaveBeenCalledWith(
      'track',
      'Schedule',
      {
        content_name: 'Consultation Booked',
        value: EVENT_VALUE[MetaEvent.Schedule],
        currency: 'USD',
      },
      { eventID: 'evt-abc' },
    )
  })

  it('sends ViewContent without a value', async () => {
    const fbq = vi.fn()
    vi.stubGlobal('fbq', fbq)
    vi.resetModules()
    const { trackPixel } = await import('@/lib/meta/pixel')

    trackPixel(MetaEvent.ViewContent, { content_name: 'Booking Page' }, 'evt-vc')

    const params = fbq.mock.calls[0][2]
    expect(params).not.toHaveProperty('value')
    expect(params).not.toHaveProperty('currency')
  })
})

describe('/api/meta/track guard rails', () => {
  const post = async (body: unknown) => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_META_PIXEL_ID = PIXEL_ID
    process.env.DATASET_QUALITY_API = TOKEN
    const { NextRequest } = await import('next/server')
    const { POST } = await import('@/app/api/meta/track/route')
    const request = new NextRequest('https://www.yourstrengthrx.com/api/meta/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'UA' },
      body: JSON.stringify(body),
    })
    return POST(request)
  }

  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('ignores a client-supplied value and stamps the canonical one', async () => {
    const fetchMock = mockFetchOk()

    const response = await post({
      eventName: 'Lead',
      eventId: 'evt-spoof',
      customData: { value: 1_000_000, currency: 'BTC', content_name: 'Contact Form' },
    })

    expect(response.status).toBe(200)
    const { custom_data: customData } = lastBody(fetchMock).data[0]
    expect(customData.value).toBe(EVENT_VALUE[MetaEvent.Lead])
    expect(customData.currency).toBe('USD')
  })

  it('rejects money events that must originate server-side', async () => {
    const fetchMock = mockFetchOk()

    for (const eventName of ['Purchase', 'Subscribe']) {
      const response = await post({ eventName, eventId: 'evt-money' })
      expect(response.status).toBe(400)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects unknown events and missing event IDs', async () => {
    const fetchMock = mockFetchOk()

    expect((await post({ eventName: 'Fabricated', eventId: 'x' })).status).toBe(400)
    expect((await post({ eventName: 'Lead' })).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('drops arbitrary custom fields a caller tries to inject', async () => {
    const fetchMock = mockFetchOk()

    await post({
      eventName: 'Lead',
      eventId: 'evt-inject',
      customData: { content_name: 'Contact Form', injected_field: 'nope' },
    })

    const { custom_data: customData } = lastBody(fetchMock).data[0]
    expect(customData.content_name).toBe('Contact Form')
    expect(customData).not.toHaveProperty('injected_field')
  })
})

describe('Meta parameter builder', () => {
  /** `fb.<subdomain_index>.<timestamp>.<payload>.<appendix>` */
  const COOKIE_SHAPE = /^fb\.\d+\.\d+\..+\.[A-Za-z0-9_-]{8}$/

  it('builds fbc from the click param when no cookie exists yet', async () => {
    const { getMetaRequestContext } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/lp/mens-performance?fbclid=IwAR-abc123', {
        headers: { 'user-agent': 'UA', 'x-forwarded-for': '198.51.100.7, 10.0.0.1' },
      }),
    )

    expect(context.fbc).toMatch(COOKIE_SHAPE)
    expect(context.fbc).toContain('IwAR-abc123')
    // Only the client IP, never the proxy hop behind it. The trailing appendix
    // is the library's own marker and Meta strips it on receipt.
    expect(context.clientIpAddress).toMatch(/^198\.51\.100\.7\.[A-Za-z0-9_-]{8}$/)
  })

  it('mints an fbp so events still carry a browser ID when the pixel is blocked', async () => {
    const { getMetaRequestContext } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/lp/plateau-breaker'),
    )

    expect(context.fbp).toMatch(COOKIE_SHAPE)
    // And it must be persisted, or the next request mints a different one and
    // one visitor looks like several browsers.
    expect(context.cookiesToSet?.map((c) => c.name)).toContain('_fbp')
  })

  it('reuses an existing fbp rather than replacing the visitor identity', async () => {
    const { getMetaRequestContext } = await loadCapi()
    const existing = 'fb.1.1700000000.1116446470.AQQABAMD'

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/book', { cookies: { _fbp: existing } }),
    )

    expect(context.fbp).toBe(existing)
    expect(context.cookiesToSet?.map((c) => c.name)).not.toContain('_fbp')
  })

  it('keeps the stored fbc when the visitor returns without a new click', async () => {
    const { getMetaRequestContext } = await loadCapi()
    const existing = 'fb.1.1700000000.IwAR-original.AQQABAMD'

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/book', { cookies: { _fbc: existing } }),
    )

    expect(context.fbc).toBe(existing)
  })

  it('refreshes fbc when a newer ad click arrives', async () => {
    const { getMetaRequestContext } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/lp/mens-performance?fbclid=IwAR-newer', {
        cookies: { _fbc: 'fb.1.1700000000.IwAR-older.AQQABAMD' },
      }),
    )

    expect(context.fbc).toContain('IwAR-newer')
    expect(context.cookiesToSet?.map((c) => c.name)).toContain('_fbc')
  })

  it('recovers the click ID from the referer on an API route', async () => {
    const { getMetaRequestContext } = await loadCapi()

    // A POST to /api/leads carries no fbclid of its own — only the landing
    // page URL in the Referer header.
    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/api/leads', {
        headers: {
          referer: 'https://www.yourstrengthrx.com/lp/mens-performance?fbclid=IwAR-ref',
        },
      }),
    )

    expect(context.fbc).toContain('IwAR-ref')
    // Reporting must attribute to the landing page, not to the API endpoint.
    expect(context.eventSourceUrl).toContain('/lp/mens-performance')
  })

  it('ignores private and loopback addresses in the forwarded chain', async () => {
    const { getMetaRequestContext } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/book', {
        headers: { 'x-forwarded-for': '10.0.0.5, 198.51.100.7' },
      }),
    )

    expect(context.clientIpAddress).not.toBe('10.0.0.5')
  })

  it('prefers the CDN client IP header over a spoofable forwarded chain', async () => {
    const { getMetaRequestContext } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/book', {
        headers: {
          'cf-connecting-ip': '198.51.100.20',
          'x-forwarded-for': '203.0.113.99, 198.51.100.20',
        },
      }),
    )

    expect(context.clientIpAddress).toMatch(/^198\.51\.100\.20\./)
  })

  it('carries the builder identifiers through to the CAPI payload', async () => {
    const fetchMock = mockFetchOk()
    const { getMetaRequestContext, sendMetaEvent } = await loadCapi()

    const context = getMetaRequestContext(
      await makeRequest('https://www.yourstrengthrx.com/lp/mens-performance?fbclid=IwAR-payload', {
        headers: { 'user-agent': 'Mozilla/5.0', 'x-forwarded-for': '198.51.100.7' },
      }),
    )

    await sendMetaEvent({ eventName: MetaEvent.Lead, eventId: 'evt-ctx', context })

    const { user_data: userData } = lastBody(fetchMock).data[0]
    expect(userData.fbc).toBe(context.fbc)
    expect(userData.fbp).toBe(context.fbp)
    expect(userData.client_ip_address).toMatch(/^198\.51\.100\.7\./)
    expect(userData.client_user_agent).toBe('Mozilla/5.0')
  })
})
