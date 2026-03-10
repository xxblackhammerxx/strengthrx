import { redirect } from 'next/navigation'
import { getAuthenticatedPartner } from '@/lib/auth'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

export default async function PartnerSettingsPage() {
  const auth = await getAuthenticatedPartner()

  if (!auth) {
    redirect('/signup/partner')
  }

  return (
    <Container className="py-12">
      <Heading as="h1" className="mb-8 text-white">
        Settings
      </Heading>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
        <p className="text-neutral-400">Settings page coming soon.</p>
      </div>
    </Container>
  )
}
