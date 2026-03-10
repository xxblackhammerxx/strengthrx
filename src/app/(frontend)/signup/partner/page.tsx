'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function PartnerSignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    phone: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

    if (!formData.referralCode.trim()) {
      setError('Please choose a referral code')
      setLoading(false)
      return
    }

    // Referral code format validation
    const codeRegex = /^[A-Z0-9_-]{3,20}$/
    if (!codeRegex.test(formData.referralCode.toUpperCase())) {
      setError(
        'Referral code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores',
      )
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode.toUpperCase(),
          phone: formData.phone || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)

      // Redirect to partner portal after 2 seconds
      setTimeout(() => {
        router.push('/partner-portal')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
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
            Partner Account Created!
          </Heading>
          <p className="text-gray-600">
            Your account is pending approval. Redirecting you to your dashboard...
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Heading as="h1" size="3xl" className="mb-4">
            Partner Sign Up
          </Heading>
          <p className="mb-8 text-gray-600">
            Join our referral program and earn commissions for every client you refer
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Smith"
            />
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
              placeholder="jane@example.com"
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
            <label htmlFor="referralCode" className="mb-2 block text-sm font-medium text-gray-700">
              Your Referral Code *
            </label>
            <Input
              id="referralCode"
              name="referralCode"
              type="text"
              required
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="e.g. TRAINERJANE"
              className="uppercase"
            />
            <p className="mt-1 text-xs text-gray-500">
              Choose a unique code your clients will use when signing up. Letters, numbers, hyphens,
              and underscores only.
            </p>
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
                Creating Partner Account...
              </>
            ) : (
              'Create Partner Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>

          <p className="text-center text-sm text-gray-600">
            Looking to sign up as a client?{' '}
            <a href="/signup/client" className="font-medium text-blue-600 hover:text-blue-700">
              Client sign up
            </a>
          </p>
        </form>
      </div>
    </Container>
  )
}
