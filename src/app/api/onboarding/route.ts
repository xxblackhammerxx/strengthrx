import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPracticeBetterClient } from '@/lib/practice-better'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, phone, goals, labsStatus } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Create patient in Practice Better (sends invitation email)
    let practiceBetterId: string | undefined
    try {
      const pbResult = await createPracticeBetterClient({
        profile: {
          firstName,
          lastName,
          emailAddress: email,
          mobilePhone: phone || undefined,
        },
        isActive: true,
        sendInvitation: true,
        formIds: [
          '683e38def62334e95624b18a', // GLP1 intake form
          '67609a7d515838f1ef653dd3', // Nandrolone Decanoate Consent
          '683e35eaf62334e9562483ae', // TRT Intake Form
          '675b9628be32223028195f5d', // Consent to Treat StrengthRX
          '675b9b4cbe3222302819a5fb', // Telemedicine Consent
          '68014d139352db01b9621f47', // Compounded GLP-1 Waiver
          '675b9f5c81625ca0524c94b1', // Weight loss consent form
          '675b9c92be3222302819c733', // Peptide consent
        ],
      })
      practiceBetterId = pbResult.id
    } catch (pbError) {
      console.error('Practice Better sync failed:', pbError)
      // Don't block onboarding — client can be synced later
    }

    // Create the client in Payload
    const client = await payload.create({
      collection: 'clients',
      data: {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth: '1990-01-01', // Placeholder — collected later during intake
        phone: phone || undefined,
        goals: goals || [],
        labsStatus: labsStatus || undefined,
        paperworkStatus: 'not_started',
        labStatus: 'not_ordered',
        medicalReviewStatus: 'pending',
        practiceBetterId: practiceBetterId || undefined,
        practiceBetterSyncStatus: practiceBetterId ? 'synced' : 'failed',
      },
    })

    // Log the user in automatically
    const token = await payload.login({
      collection: 'clients',
      data: { email, password },
    })

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
        },
      },
      { status: 201 },
    )

    if (token.token) {
      response.cookies.set('payload-token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Onboarding error:', error)

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
