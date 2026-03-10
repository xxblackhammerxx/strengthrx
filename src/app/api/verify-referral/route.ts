import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find partner with this referral code
    const partners = await payload.find({
      collection: 'partners',
      where: {
        referralCode: {
          equals: code.toUpperCase(),
        },
        status: {
          equals: 'active',
        },
      },
      limit: 1,
    })

    if (partners.docs.length === 0) {
      return NextResponse.json({ valid: false, error: 'Invalid referral code' }, { status: 404 })
    }

    const partner = partners.docs[0]

    return NextResponse.json({
      valid: true,
      partnerName: partner.fullName,
      partnerId: partner.id,
    })
  } catch (error) {
    console.error('Error verifying referral code:', error)
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 })
  }
}
