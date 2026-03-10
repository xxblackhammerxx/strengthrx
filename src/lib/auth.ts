import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

type AuthResult<T> = { payload: Payload; user: T }

export async function getAuthenticatedClient(): Promise<AuthResult<{
  id: number
  email: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phone?: string | null
  paperworkStatus: string
  labStatus: string
  medicalReviewStatus: string
  createdAt: string
}> | null> {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()

  const { user } = await payload.auth({ headers })
  if (!user) return null

  // Verify user belongs to clients collection
  if ((user as any).collection !== 'clients') return null

  return {
    payload,
    user: user as any,
  }
}

export async function getAuthenticatedPartner(): Promise<AuthResult<{
  id: number
  email: string
  fullName: string
  referralCode: string
  commissionRate: number
  status: string
  totalEarnings: number
  createdAt: string
}> | null> {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()

  const { user } = await payload.auth({ headers })
  if (!user) return null

  if ((user as any).collection !== 'partners') return null

  return {
    payload,
    user: user as any,
  }
}

export async function getAuthenticatedAdmin(): Promise<AuthResult<{
  id: number
  email: string
  name: string
  role: string
  createdAt: string
}> | null> {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()

  const { user } = await payload.auth({ headers })
  if (!user) return null

  if ((user as any).collection !== 'admins') return null

  return {
    payload,
    user: user as any,
  }
}
