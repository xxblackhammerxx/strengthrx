import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const VALID_COLLECTIONS = ['clients', 'partners', 'admins'] as const
type AuthCollection = (typeof VALID_COLLECTIONS)[number]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, collection } = body

    if (!email || !password || !collection) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, collection' },
        { status: 400 },
      )
    }

    if (!VALID_COLLECTIONS.includes(collection as AuthCollection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const result = await payload.login({
      collection: collection as AuthCollection,
      data: { email, password },
    })

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
      },
      { status: 200 },
    )

    if (result.token) {
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
}
