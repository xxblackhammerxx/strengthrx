import { redirect } from 'next/navigation'
import { getAuthenticatedPartner } from '@/lib/auth'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

export default async function PartnerAccountPage() {
  const auth = await getAuthenticatedPartner()

  if (!auth) {
    redirect('/signup/partner')
  }

  const { user } = auth

  return (
    <Container className="py-12">
      <Heading as="h1" className="mb-8 text-white">
        Account
      </Heading>
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Profile Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-neutral-500">Name</p>
              <p className="text-white">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Referral Code</p>
              <p className="text-white">{user.referralCode}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Member Since</p>
              <p className="text-white">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
