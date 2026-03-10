import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Users, Handshake } from 'lucide-react'

export default function LoginPage() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Heading as="h1" size="3xl" className="mb-4">
            Sign In
          </Heading>
          <p className="mb-12 text-gray-600">Choose your account type to continue</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Client Login Card */}
          <Link
            href="/login/client"
            className="group rounded-2xl border border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Client Login</h2>
            <p className="text-sm text-gray-600">
              Access your health portal, appointments, and treatment plans.
            </p>
          </Link>

          {/* Partner Login Card */}
          <Link
            href="/login/partner"
            className="group rounded-2xl border border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
              <Handshake className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Partner Login</h2>
            <p className="text-sm text-gray-600">
              Manage your referrals, track earnings, and access marketing materials.
            </p>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  )
}
