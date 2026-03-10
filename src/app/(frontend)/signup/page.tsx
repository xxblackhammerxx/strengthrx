import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Users, Handshake } from 'lucide-react'

export default function SignupPage() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Heading as="h1" size="3xl" className="mb-4">
            Create Your Account
          </Heading>
          <p className="mb-12 text-gray-600">Choose the type of account that fits you best</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Client Signup Card */}
          <Link
            href="/signup/client"
            className="group rounded-2xl border border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Client</h2>
            <p className="text-sm text-gray-600">
              Sign up to begin your health optimization journey with personalized TRT, peptides, and
              wellness protocols.
            </p>
          </Link>

          {/* Partner Signup Card */}
          <Link
            href="/signup/partner"
            className="group rounded-2xl border border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
              <Handshake className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Referral Partner</h2>
            <p className="text-sm text-gray-600">
              Join our referral program, get your own unique code, and earn commissions for every
              client you refer.
            </p>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Sign in
          </a>
        </p>
      </div>
    </Container>
  )
}
