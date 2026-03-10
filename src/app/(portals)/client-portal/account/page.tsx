import { redirect } from 'next/navigation'
import { getAuthenticatedClient } from '@/lib/auth'
import ClientAccountContent from './ClientAccountContent'

export default async function ClientAccountPage() {
  const auth = await getAuthenticatedClient()

  if (!auth) {
    redirect('/signup/client')
  }

  const { user } = auth

  return (
    <ClientAccountContent
      data={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        memberSince: user.createdAt,
      }}
    />
  )
}
