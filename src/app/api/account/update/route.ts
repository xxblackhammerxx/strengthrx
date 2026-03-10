import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName } = body

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 })
    }

    const collection = (user as any).collection
    if (collection !== 'clients') {
      return NextResponse.json({ error: 'Not supported for this account type' }, { status: 403 })
    }

    const updated = await payload.update({
      collection: 'clients',
      id: user.id,
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        firstName: updated.firstName,
        lastName: updated.lastName,
      },
    })
  } catch (error) {
    console.error('Account update error:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
