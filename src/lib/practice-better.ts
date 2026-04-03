/**
 * Practice Better API client module
 *
 * Handles OAuth2 Client Credentials authentication and patient record creation.
 * Token is cached in-memory with a safety margin below the 1200s TTL.
 *
 * IMPORTANT: Never log patient data — PHI concern.
 */

const PB_BASE_URL = 'https://api.practicebetter.io'

// ─── Exported types ───────────────────────────────────────────────────────────

export interface PracticeBetterClientInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface PracticeBetterClientResult {
  id: string
}

export class PracticeBetterError extends Error {
  status: number
  body: string

  constructor(message: string, status: number, body: string) {
    super(message)
    this.name = 'PracticeBetterError'
    this.status = status
    this.body = body
    // Maintain proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, PracticeBetterError.prototype)
  }
}

// ─── Token cache (module-level, NOT exported) ─────────────────────────────────

let cachedToken: string | null = null
let tokenExpiresAt: number = 0

/**
 * Resets the token cache. Exported for testing purposes only.
 */
export function resetTokenCache(): void {
  cachedToken = null
  tokenExpiresAt = 0
}

/**
 * Returns a valid access token, fetching a new one if expired or absent.
 */
async function getAccessToken(): Promise<string> {
  const nowSeconds = Date.now() / 1000

  if (cachedToken && nowSeconds < tokenExpiresAt) {
    return cachedToken
  }

  const clientId = process.env.PRACTICE_BETTER_CLIENT_ID
  const clientSecret = process.env.PRACTICE_BETTER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new PracticeBetterError(
      'Practice Better credentials not configured (PRACTICE_BETTER_CLIENT_ID / PRACTICE_BETTER_CLIENT_SECRET)',
      0,
      'Missing env vars',
    )
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch(`${PB_BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new PracticeBetterError(
      `Practice Better token fetch failed with status ${response.status}`,
      response.status,
      text,
    )
  }

  const data = await response.json()
  const expiresIn: number = data.expires_in ?? 1200
  // Cache with 60-second safety margin
  const safetyMarginSeconds = 60
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() / 1000 + expiresIn - safetyMarginSeconds

  return cachedToken as string
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Creates a patient record in Practice Better and returns the patient ID.
 *
 * Uses exact field names confirmed by the 03-01 spike:
 *   - Request body: { profile: { firstName, lastName, emailAddress } }
 *   - Response: { id: "<MongoDB ObjectId>" }
 *
 * Throws PracticeBetterError on any non-2xx response.
 * Never logs patient data (PHI).
 */
export async function createPracticeBetterClient(
  input: PracticeBetterClientInput,
): Promise<PracticeBetterClientResult> {
  const token = await getAccessToken()

  const requestBody: Record<string, unknown> = {
    profile: {
      firstName: input.firstName,
      lastName: input.lastName,
      emailAddress: input.email,
    },
  }

  const response = await fetch(`${PB_BASE_URL}/consultant/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new PracticeBetterError(
      `Practice Better patient creation failed with status ${response.status}`,
      response.status,
      text,
    )
  }

  const data = await response.json()

  if (!data.id) {
    throw new PracticeBetterError(
      'Practice Better patient creation succeeded but response missing "id" field',
      200,
      JSON.stringify(data),
    )
  }

  return { id: data.id as string }
}
