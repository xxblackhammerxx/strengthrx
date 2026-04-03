import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createPracticeBetterClient,
  resetTokenCache,
  type PracticeBetterClientInput,
  type PracticeBetterClientResult,
} from '@/lib/practice-better'

// ─── Test fixtures ────────────────────────────────────────────────────────────

const MOCK_CLIENT_ID = 'test-client-id'
const MOCK_CLIENT_SECRET = 'test-client-secret'
const MOCK_ACCESS_TOKEN = 'mock-access-token-abc123'
const MOCK_PATIENT_ID = '69d025470326b4dd7277626e'

const validInput: PracticeBetterClientInput = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@example.com',
  },
  isActive: true,
  sendInvitation: true,
}

function makeTokenResponse(overrides?: Partial<{ access_token: string; token_type: string; expires_in: number }>) {
  return {
    access_token: MOCK_ACCESS_TOKEN,
    token_type: 'bearer',
    expires_in: 1200,
    ...overrides,
  }
}

function makePatientResponse(overrides?: Partial<{ id: string }>) {
  return {
    id: MOCK_PATIENT_ID,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@example.com',
      patientAccountNumber: 'P001',
    },
    isChildRecord: false,
    isActive: false,
    invitationSent: false,
    status: 'created',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

function mockFetchSuccess() {
  return vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => makeTokenResponse(),
      text: async () => JSON.stringify(makeTokenResponse()),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => makePatientResponse(),
      text: async () => JSON.stringify(makePatientResponse()),
    })
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetTokenCache()
  process.env.PRACTICE_BETTER_CLIENT_ID = MOCK_CLIENT_ID
  process.env.PRACTICE_BETTER_CLIENT_SECRET = MOCK_CLIENT_SECRET
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('createPracticeBetterClient', () => {
  it('returns { id: string } on successful patient creation', async () => {
    vi.stubGlobal('fetch', mockFetchSuccess())

    const result: PracticeBetterClientResult = await createPracticeBetterClient(validInput)

    expect(result).toBeDefined()
    expect(result.id).toBe(MOCK_PATIENT_ID)
    expect(typeof result.id).toBe('string')
  })

  it('throws PracticeBetterError with status on token fetch failure (401)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    }))

    await expect(createPracticeBetterClient(validInput)).rejects.toMatchObject({
      status: 401,
    })
  })

  it('throws PracticeBetterError with status on patient creation failure (422)', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse(),
        text: async () => JSON.stringify(makeTokenResponse()),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () => 'Unprocessable Entity',
      })
    )

    await expect(createPracticeBetterClient(validInput)).rejects.toMatchObject({
      status: 422,
    })
  })

  it('caches the token — fetch is called 3 times (1 token + 2 creates) not 4 on two calls', async () => {
    const mockFetch = vi.fn()
      // First call: token
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse(),
        text: async () => JSON.stringify(makeTokenResponse()),
      })
      // Second call: first patient create
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makePatientResponse({ id: 'patient-id-1' }),
        text: async () => JSON.stringify(makePatientResponse({ id: 'patient-id-1' })),
      })
      // Third call: second patient create (no token fetch because it's cached)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makePatientResponse({ id: 'patient-id-2' }),
        text: async () => JSON.stringify(makePatientResponse({ id: 'patient-id-2' })),
      })

    vi.stubGlobal('fetch', mockFetch)

    const result1 = await createPracticeBetterClient(validInput)
    const result2 = await createPracticeBetterClient(validInput)

    expect(result1.id).toBe('patient-id-1')
    expect(result2.id).toBe('patient-id-2')
    // Token fetched once, two patient creates = 3 total (not 4)
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('re-fetches token after expiry (mock Date.now past expiry window)', async () => {
    const realDateNow = Date.now

    // Set initial time
    vi.spyOn(Date, 'now').mockReturnValue(0)

    const mockFetch = vi.fn()
      // First token fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse({ expires_in: 100 }),
        text: async () => JSON.stringify(makeTokenResponse({ expires_in: 100 })),
      })
      // First patient create
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makePatientResponse({ id: 'patient-id-1' }),
        text: async () => JSON.stringify(makePatientResponse({ id: 'patient-id-1' })),
      })
      // Second token fetch (after expiry)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makeTokenResponse({ expires_in: 100 }),
        text: async () => JSON.stringify(makeTokenResponse({ expires_in: 100 })),
      })
      // Second patient create
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => makePatientResponse({ id: 'patient-id-2' }),
        text: async () => JSON.stringify(makePatientResponse({ id: 'patient-id-2' })),
      })

    vi.stubGlobal('fetch', mockFetch)

    await createPracticeBetterClient(validInput)

    // Advance time past the expiry (expires_in=100, safety margin=60, so effective TTL=40s)
    // With Date.now() returning ms, advance 200,000ms (200s) past expiry
    vi.spyOn(Date, 'now').mockReturnValue(200_000)

    await createPracticeBetterClient(validInput)

    // Should have fetched token twice (expired), plus 2 patient creates = 4 total
    expect(mockFetch).toHaveBeenCalledTimes(4)

    vi.spyOn(Date, 'now').mockRestore()
  })

  it('error message includes HTTP status and response body text', async () => {
    const errorBody = 'Invalid credentials — client_id not found'

    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => errorBody,
    }))

    try {
      await createPracticeBetterClient(validInput)
      expect.fail('Should have thrown')
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error)
      const pbErr = err as { status: number; body: string; message: string }
      expect(pbErr.status).toBe(401)
      expect(pbErr.body).toBe(errorBody)
      expect(pbErr.message).toContain('401')
    }
  })
})
