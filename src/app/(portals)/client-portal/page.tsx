import { redirect } from 'next/navigation'
import { getAuthenticatedClient } from '@/lib/auth'
import type { ClientPortalData } from '@/lib/portal-types'
import ClientPortalContent from './ClientPortalContent'

export default async function ClientPortalPage() {
  const auth = await getAuthenticatedClient()

  if (!auth) {
    redirect('/signup/client')
  }

  const { user } = auth

  const clientData: ClientPortalData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    memberSince: user.createdAt,
    paperworkStatus: user.paperworkStatus,
    labStatus: user.labStatus,
    medicalReviewStatus: user.medicalReviewStatus,
  }

  return <ClientPortalContent clientData={clientData} />
}
