import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, referralCode, phone } = body

    // Validate required fields
    if (!fullName || !email || !password || !referralCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate referral code format
    const codeRegex = /^[A-Z0-9_-]{3,20}$/
    if (!codeRegex.test(referralCode.toUpperCase())) {
      return NextResponse.json(
        {
          error:
            'Referral code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores',
        },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Check if referral code is already taken
    const existingCode = await payload.find({
      collection: 'partners',
      where: {
        referralCode: {
          equals: referralCode.toUpperCase(),
        },
      },
      limit: 1,
    })

    if (existingCode.docs.length > 0) {
      return NextResponse.json(
        { error: 'This referral code is already taken. Please choose a different one.' },
        { status: 409 },
      )
    }

    // Create the partner
    const partner = await payload.create({
      collection: 'partners',
      data: {
        fullName,
        email,
        password,
        referralCode: referralCode.toUpperCase(),
        commissionRate: 10,
        status: 'pending',
        totalEarnings: 0,
      },
    })

    // Log the user in automatically
    const token = await payload.login({
      collection: 'partners',
      data: {
        email,
        password,
      },
    })

    // Create response with auth token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Partner account created successfully',
        user: {
          id: partner.id,
          email: partner.email,
          fullName: (partner as any).fullName,
          referralCode: (partner as any).referralCode,
        },
      },
      { status: 201 },
    )

    // Set auth cookie if token exists
    if (token.token) {
      response.cookies.set('payload-token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Partner signup error:', error)

    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'Failed to create partner account. Please try again.' },
      { status: 500 },
    )
  }
}
