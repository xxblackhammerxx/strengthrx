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

    const fields = JSON.stringify(ContactSubmissions.fields)
    expect(fields).toContain('name')
    expect(fields).toContain('email')
    expect(fields).toContain('message')
    expect(fields).toContain('utmSource')
  })

  it('restricts read/update/delete access to privileged admin/staff users', () => {
    const deniedUsers = [
      undefined,
      { id: 1, collection: 'clients' },
      { id: 2, collection: 'partners' },
      { id: 3, collection: 'admins', role: 'cnp' },
      { id: 4, collection: 'external-users' },
    ]
    const allowedUsers = [
      { id: 5, collection: 'users' },
      { id: 6, collection: 'admins', role: 'owner' },
      { id: 7, collection: 'admins', role: 'staff' },
    ]

    for (const user of deniedUsers) {
      const req = user ? { user } : {}
      expect(ContactSubmissions.access?.read?.({ req } as never)).toBe(false)
      expect(ContactSubmissions.access?.update?.({ req } as never)).toBe(false)
      expect(ContactSubmissions.access?.delete?.({ req } as never)).toBe(false)
    }

    for (const user of allowedUsers) {
      const req = { user }
      expect(ContactSubmissions.access?.read?.({ req } as never)).toBe(true)
      expect(ContactSubmissions.access?.update?.({ req } as never)).toBe(true)
      expect(ContactSubmissions.access?.delete?.({ req } as never)).toBe(true)
    }
  })
})

describe('/api/contact-submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 rather than 404 for unauthenticated GET requests before querying leads', async () => {
    const find = vi.fn()
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user: null }),
      find,
    } as never)

    const response = await GET(new NextRequest('https://example.test/api/contact-submissions'))
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
    expect(find).not.toHaveBeenCalled()
  })

  it.each([
    ['client', { id: 1, collection: 'clients' }],
    ['partner', { id: 2, collection: 'partners' }],
    ['general authenticated user', { id: 3, collection: 'external-users' }],
  ])('returns 403 for %s accounts before querying leads', async (_label, user) => {
    const find = vi.fn()
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user }),
      find,
    } as never)

    const response = await GET(new NextRequest('https://example.test/api/contact-submissions'))
    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({ error: 'Forbidden' })
    expect(find).not.toHaveBeenCalled()
  })

  it('lists submissions for a privileged staff user', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0, page: 1, totalPages: 1 })
    const staffUser = { id: 1, collection: 'admins', role: 'staff' }
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user: staffUser }),
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
        user: staffUser,
      }),
    )
  })

  it('keeps Payload admin users compatible with the portal leads endpoint', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0, page: 1, totalPages: 1 })
    const payloadAdminUser = { id: 9, collection: 'users' }
    mockedGetPayload.mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({ user: payloadAdminUser }),
      find,
    } as never)

    const response = await GET(new NextRequest('https://example.test/api/contact-submissions'))

    expect(response.status).toBe(200)
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ user: payloadAdminUser }))
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
