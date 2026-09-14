import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { GET, POST } from '@/app/api/contact-submissions/route'
import { getPayload } from 'payload'

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(),
  }
})

const mockedGetPayload = vi.mocked(getPayload)

describe('contact submissions collection', () => {
  it('registers a private contact-submissions collection for portal leads', () => {
    expect(ContactSubmissions.slug).toBe('contact-submissions')
    expect(ContactSubmissions.admin?.group).toBe('Forms')
    expect(ContactSubmissions.access?.read?.({ req: {} } as never)).toBe(false)
    expect(ContactSubmissions.access?.read?.({ req: { user: { id: 1 } } } as never)).toBe(true)

    const fields = JSON.stringify(ContactSubmissions.fields)
    expect(fields).toContain('name')
    expect(fields).toContain('email')
    expect(fields).toContain('message')
    expect(fields).toContain('utmSource')
  })
})

describe('/api/contact-submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 rather than 404 for unauthenticated GET requests', async () => {
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user: null }),
    } as never)

    const response = await GET(new NextRequest('https://example.test/api/contact-submissions'))
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
  })

  it('lists submissions for an authenticated portal request', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0, page: 1, totalPages: 1 })
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user: { id: 1, collection: 'users' } }),
      find,
    } as never)

    const response = await GET(
      new NextRequest('https://example.test/api/contact-submissions?limit=250&sort=bad&status=new'),
    )

    expect(response.status).toBe(200)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'contact-submissions',
        limit: 100,
        sort: '-createdAt',
        overrideAccess: false,
      }),
    )
  })

  it('stores a validated POST without exposing private details in the response', async () => {
    const create = vi.fn().mockResolvedValue({ id: 123 })
    mockedGetPayload.mockResolvedValueOnce({ create } as never)

    const response = await POST(
      new NextRequest('https://example.test/api/contact-submissions', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Person',
          email: 'TEST@example.com',
          phone: '(602) 555-0100',
          state: 'General',
          message: 'I have a question about scheduling.',
          utm_source: 'newsletter',
        }),
      }),
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Contact submission received successfully',
      id: 123,
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'contact-submissions',
        data: expect.objectContaining({
          email: 'test@example.com',
          subject: 'General',
          status: 'new',
          utmSource: 'newsletter',
        }),
      }),
    )
  })
})
