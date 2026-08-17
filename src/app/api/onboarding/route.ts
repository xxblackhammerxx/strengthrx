import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPracticeBetterClient } from '@/lib/practice-better'
import { captureConsent, resolveAttribution, syncLeadToGhl } from '@/lib/ghl/leads'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      goals,
      labsStatus,
      smsConsent,
    } = body

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
        /*
         * COMPLIANCE-LOAD-BEARING. The intake form carries the HIPAA Notice of
         * Privacy Practices acknowledgement, signed before any service is
         * provided. That signature is how we satisfy 45 CFR 164.520(c)(2)(ii);
         * /notice-of-privacy-practices only covers electronic availability.
         *
         * Removing or swapping this ID silently stops collecting the
         * acknowledgement — no error, no failed status, patients just never
         * sign it. Confirm the replacement form still contains it first.
         */
        formIds: [
          '69d43a44815b5d896fce824e', // StrengthRx Intake Form
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

    // Into the CRM so account creations appear in the acquisition pipeline
    // alongside landing-page leads. Deliberately no goals/labsStatus — those
    // are health data and stay in Practice Better.
    await syncLeadToGhl({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      source: 'get-started',
      tags: ['get-started', 'account-created'],
      attribution: resolveAttribution(request),
      // Explicit opt-in only — see the note in /api/contact. Having an account
      // is not consent to be texted marketing.
      consent: captureConsent(request, smsConsent === true),
      createOpportunity: true,
    })

    /*
     * No Meta CAPI event here. This is deliberate — do not add one back.
     *
     * The previous version was careful to keep goals/labsStatus out of
     * custom_data, but that is not the part that matters. A CompleteRegistration
     * carrying email, phone, name and externalId tells Meta that a specific,
     * identifiable person became a patient of a hormone prescriber. Under HHS
     * OCR's tracking-technology guidance that fact is itself PHI, regardless of
     * how thin the custom_data is and regardless of hashing. Meta will not sign
     * a BAA covering it.
     *
     * The campaign does not lose attribution as a result: ad traffic converts
     * on Meta Instant Forms, which Meta attributes in-platform without any
     * event from us. This route serves organic /get-started traffic.
     */

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

    // No applyMetaCookies either — persisting _fbc/_fbp from this route would
    // stamp a Meta advertising identity onto the onboarding session.
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
