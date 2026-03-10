import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, dateOfBirth, phone, referralCode } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if partner exists if referral code provided
    let partnerId: number | null = null
    if (referralCode) {
      const partners = await payload.find({
        collection: 'partners',
        where: {
          referralCode: {
            equals: referralCode.toUpperCase(),
          },
          status: {
            equals: 'active',
          },
        },
        limit: 1,
      })

      if (partners.docs.length > 0) {
        partnerId = partners.docs[0].id as number
      }
    }

    // Create the client
    const client = await payload.create({
      collection: 'clients',
      data: {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phone: phone || undefined,
        assignedTrainer: partnerId || undefined,
        paperworkStatus: 'not_started',
        labStatus: 'not_ordered',
        medicalReviewStatus: 'pending',
      },
    })

    // If partner exists, create a referral record
    if (partnerId) {
      try {
        // Generate a unique public ID
        const publicId = `REF-${Math.floor(1000 + Math.random() * 9000)}`

        // Get partner commission rate
        const partner = await payload.findByID({
          collection: 'partners',
          id: partnerId,
        })

        await payload.create({
          collection: 'referrals',
          data: {
            trainer: partnerId,
            client: client.id,
            publicId,
            status: 'lead_created',
            commissionSnapshot: 0,
            marketingSource: referralCode,
          },
        })

        console.log(`Created referral ${publicId} for partner ${partnerId} and client ${client.id}`)
      } catch (referralError) {
        console.error('Error creating referral:', referralError)
        // Don't fail the signup if referral creation fails
      }
    }

    // Log the user in automatically
    const token = await payload.login({
      collection: 'clients',
      data: {
        email,
        password,
      },
    })

    // Create response with auth token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
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
    console.error('Signup error:', error)

    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }
}
