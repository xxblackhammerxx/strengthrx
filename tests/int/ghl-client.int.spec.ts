import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const TOKEN = 'pit-test-token'
const LOCATION = 'loc-123'

async function loadClient(overrides: Record<string, string> = {}) {
  vi.resetModules()
  process.env.GHL_PRIVATE_INTEGRATION_TOKEN = TOKEN
  process.env.GHL_LOCATION_ID = LOCATION
  process.env.GHL_PIPELINE_ID = 'pipe-1'
  process.env.GHL_NEW_LEAD_STAGE_ID = 'stage-new-lead'
  process.env.GHL_CUSTOM_FIELD_SHAPE = 'key'
  Object.assign(process.env, overrides)
  return import('@/lib/ghl/client')
}

function mockFetch(response: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    text: async () => JSON.stringify(response),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const lastCall = (fetchMock: ReturnType<typeof vi.fn>) => {
  const [url, init] = fetchMock.mock.calls.at(-1)!
  return { url: url as string, init, body: JSON.parse(init.body) }
}

describe('GHL contact upsert', () => {
  beforeEach(() => vi.unstubAllGlobals())
  afterEach(() => vi.unstubAllGlobals())

  it('posts to the upsert endpoint with auth and version headers', async () => {
    const fetchMock = mockFetch({ contact: { id: 'contact-1' } })
    const { upsertGhlContact } = await loadClient()

    const result = await upsertGhlContact({ email: 'a@b.com', firstName: 'Bobby' })

    const { url, init, body } = lastCall(fetchMock)
    expect(url).toBe('https://services.leadconnectorhq.com/contacts/upsert')
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`)
    // The version header is required; omitting it fails the request.
    expect(init.headers.Version).toBe('2021-07-28')
    expect(body.locationId).toBe(LOCATION)
    expect(result.contactId).toBe('contact-1')
  })

  it('sends custom fields in the { key, field_value } shape by default', async () => {
    const fetchMock = mockFetch({ contact: { id: 'c' } })
    const { upsertGhlContact } = await loadClient()

    await upsertGhlContact({
      email: 'a@b.com',
      customFields: { utm_source: 'facebook', utm_content: 'symptoms-first' },
    })

    expect(lastCall(fetchMock).body.customFields).toEqual([
      { key: 'utm_source', field_value: 'facebook' },
      { key: 'utm_content', field_value: 'symptoms-first' },
    ])
  })

  it('switches to the { id, value } shape via env, with no code change', async () => {
    const fetchMock = mockFetch({ contact: { id: 'c' } })
    const { upsertGhlContact } = await loadClient({ GHL_CUSTOM_FIELD_SHAPE: 'id' })

    await upsertGhlContact({ email: 'a@b.com', customFields: { utm_source: 'facebook' } })

    expect(lastCall(fetchMock).body.customFields).toEqual([
      { id: 'utm_source', value: 'facebook' },
    ])
  })

  it('sends state as a standard property, never as a custom field', async () => {
    const fetchMock = mockFetch({ contact: { id: 'c' } })
    const { upsertGhlContact } = await loadClient()

    await upsertGhlContact({ email: 'a@b.com', state: 'AZ' })

    const { body } = lastCall(fetchMock)
    // GHL refuses to create a custom field named `state` — it collides with
    // this standard one, and the value only persists at the top level.
    expect(body.state).toBe('AZ')
    expect(body.customFields).toEqual([])
  })

  it('uses bare custom field keys, never the dotted form', async () => {
    const fetchMock = mockFetch({ contact: { id: 'c' } })
    const { upsertGhlContact } = await loadClient()

    await upsertGhlContact({ email: 'a@b.com', customFields: { utm_source: 'facebook' } })

    // Verified against the live sub-account: `contact.utm_source` is accepted
    // with HTTP 201 and then silently discarded. Only the bare key persists.
    const [field] = lastCall(fetchMock).body.customFields
    expect(field.key).toBe('utm_source')
    expect(field.key).not.toContain('contact.')
  })

  it('omits empty custom fields instead of sending blanks', async () => {
    const fetchMock = mockFetch({ contact: { id: 'c' } })
    const { upsertGhlContact } = await loadClient()

    await upsertGhlContact({
      email: 'a@b.com',
      customFields: { utm_source: 'facebook', partner_id: undefined, gclid: '' },
    })

    expect(lastCall(fetchMock).body.customFields).toEqual([
      { key: 'utm_source', field_value: 'facebook' },
    ])
  })

  it('throws with the API message when GHL rejects the call', async () => {
    mockFetch({ message: 'Invalid custom field key' }, false, 422)
    const { upsertGhlContact } = await loadClient()

    await expect(upsertGhlContact({ email: 'a@b.com' })).rejects.toThrow(/422/)
  })

  it('throws when the response carries no contact id', async () => {
    mockFetch({ contact: {} })
    const { upsertGhlContact } = await loadClient()

    await expect(upsertGhlContact({ email: 'a@b.com' })).rejects.toThrow(/no contact id/)
  })
})

describe('GHL opportunity creation', () => {
  beforeEach(() => vi.unstubAllGlobals())

  it('creates at the New Lead stage, which is what fires WF-1', async () => {
    const fetchMock = mockFetch({ opportunity: { id: 'opp-1' } })
    const { createGhlOpportunity } = await loadClient()

    const result = await createGhlOpportunity({ contactId: 'c-1', name: 'Bobby Wolfe' })

    const { url, body } = lastCall(fetchMock)
    expect(url).toBe('https://services.leadconnectorhq.com/opportunities/')
    expect(body.pipelineStageId).toBe('stage-new-lead')
    expect(body.contactId).toBe('c-1')
    expect(body.status).toBe('open')
    expect(result.opportunityId).toBe('opp-1')
  })

  it('skips gracefully when the pipeline is not configured yet', async () => {
    const fetchMock = mockFetch({})
    const { createGhlOpportunity } = await loadClient({
      GHL_PIPELINE_ID: '',
      GHL_NEW_LEAD_STAGE_ID: '',
    })

    const result = await createGhlOpportunity({ contactId: 'c-1', name: 'X' })
    expect(result.opportunityId).toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('configuration guard', () => {
  it('reports unconfigured when credentials are absent', async () => {
    vi.resetModules()
    delete process.env.GHL_PRIVATE_INTEGRATION_TOKEN
    delete process.env.GHL_LOCATION_ID
    const { isGhlConfigured } = await import('@/lib/ghl/client')
    expect(isGhlConfigured()).toBe(false)
  })
})
