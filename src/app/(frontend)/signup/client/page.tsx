'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function ClientSignupPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-24">
          <div className="mx-auto max-w-md text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          </div>
        </Container>
      }
    >
      <ClientSignupContent />
    </Suspense>
  )
}

function ClientSignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
  })

  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifyingRef, setVerifyingRef] = useState(!!referralCode)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Verify referral code on mount
  useEffect(() => {
    if (referralCode) {
      verifyReferralCode(referralCode)
    }
  }, [referralCode])

  const verifyReferralCode = async (code: string) => {
    try {
      const response = await fetch(`/api/verify-referral?code=${code}`)
      const data = await response.json()

      if (response.ok && data.valid) {
        setPartnerName(data.partnerName)
      } else {
        setError('Invalid referral code')
      }
    } catch (err) {
      console.error('Error verifying referral code:', err)
      setError('Could not verify referral code')
    } finally {
      setVerifyingRef(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)

      // Redirect to client portal after 2 seconds
      setTimeout(() => {
        router.push('/client-portal')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  if (verifyingRef) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Verifying referral code...</p>
        </div>
      </Container>
    )
  }

  if (success) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <Heading as="h2" size="2xl" className="mb-4">
            Account Created Successfully!
          </Heading>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Heading as="h1" size="3xl" className="mb-4">
            Client Sign Up
          </Heading>
          {partnerName && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Referred by:</strong> {partnerName}
              </p>
            </div>
          )}
          <p className="mb-8 text-gray-600">Start your journey to optimal health</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(602) 555-0123"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="mb-2 block text-sm font-medium text-gray-700">
              Date of Birth *
            </label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password *
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </Container>
  )
}
