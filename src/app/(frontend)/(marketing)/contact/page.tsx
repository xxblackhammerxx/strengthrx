'use client'

import { Button } from '@/components/ui/Button'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useState } from 'react'

// Note: This would be defined in layout.tsx or page.tsx in a real app
// export const metadata: Metadata = {
//   title: 'Contact StrengthRX - Book Your Free Consultation',
//   description: 'Schedule a free consultation with StrengthRX. Licensed providers ready to help with TRT, peptides, and wellness optimization. Call 602-708-6487 or book online.',
//   alternates: {
//     canonical: '/contact',
//   },
// }

const states = [
  { code: 'AZ', name: 'Arizona' },
  { code: 'CO', name: 'Colorado' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IA', name: 'Iowa' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'UT', name: 'Utah' },
  { code: 'WY', name: 'Wyoming' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about your health goals'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      // Get reCAPTCHA Enterprise token
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (!siteKey) {
        throw new Error('reCAPTCHA site key is not configured')
      }

      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, {
              action: 'CONTACT_FORM',
            })
            resolve(token)
          } catch (err) {
            reject(err)
          }
        })
      })

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit form')
      }

      setSubmitSuccess(true)

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        state: '',
        message: '',
      })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(
        'Sorry, there was an error submitting your form. Please try again or call us directly.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Book Your Free Consultation
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ready to optimize your health and performance? Schedule a consultation with our
              licensed providers to discuss your goals and create a personalized treatment plan.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            {/* Google Calendar Scheduling */}
            <section className="pb-16 sm:pb-24">
              <Container>
                <div className="text-center mb-8">
                  <Heading as="h2" size="2xl" className="mb-4">
                    Schedule Your Appointment
                  </Heading>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Book your consultation directly through our calendar below
                  </p>
                </div>
                <div className="bg-white  rounded-2xl p-4 shadow-sm border border-border">
                  {/* Google Calendar Appointment Scheduling begin */}
                  <iframe
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ27vS2exHF_EnBY-IPJQSiN8q6f24Pl_yBYZGjGg986c7mNX1qV0N60TLYNJndsclHEDKq_Rzvw?gv=true"
                    style={{ border: 0 }}
                    width="100%"
                    height="1100"
                    frameBorder="0"
                  />
                  {/* end Google Calendar Appointment Scheduling */}
                </div>
              </Container>
            </section>

            {/* Contact Form & Contact Information */}
            <div className="space-y-8">
              {/* Contact Form */}
              <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-border">
                <Heading as="h2" size="xl" className="mb-6">
                  Have Questions? Get In Touch
                </Heading>

                {submitSuccess ? (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="rounded-full bg-green-500/20 p-3">
                        <svg
                          className="h-6 w-6 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="font-semibold text-green-400">Message sent!</p>
                    <p className="mt-1 text-sm text-green-400/80">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours to
                      schedule your consultation.
                    </p>
                  </div>
                ) : (
                  <>
                    {submitError && (
                      <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <p className="text-sm text-red-400">{submitError}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter your full name"
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        required
                        placeholder="your.email@example.com"
                      />

                      <div>
                        <label
                          htmlFor="products"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Products/Services Interested In
                        </label>
                        <select
                          id="products"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Select a product/service</option>
                          <option value="TRT">Testosterone Replacement Therapy (TRT)</option>
                          <option value="Peptides">Peptides</option>
                          <option value="Weight Loss">Weight Loss</option>
                          <option value="Sexual Wellness">Sexual Wellness</option>
                          <option value="Hormone Therapy">Hormone Therapy</option>
                          <option value="General">General Inquiry</option>
                        </select>
                      </div>

                      <Textarea
                        label="Your Message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        error={errors.message}
                        required
                        placeholder="Tell us about your questions or how we can help you..."
                        rows={4}
                      />

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        We'll get back to you within 24 hours. For urgent matters, please call us
                        directly.
                      </p>
                    </form>
                  </>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Direct Contact */}
                <div className="bg-muted/30 rounded-2xl p-8">
                  <Heading as="h3" size="lg" className="mb-4">
                    Prefer to Call?
                  </Heading>
                  <p className="text-muted-foreground mb-6">
                    Speak directly with our team to schedule your consultation or get immediate
                    answers to your questions.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-primary mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <a
                          href={businessConfig.phone.href}
                          className="text-primary hover:underline"
                        >
                          {businessConfig.phone.display}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-primary mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Email</p>
                        <a
                          href={businessConfig.email.href}
                          className="text-primary hover:underline"
                        >
                          {businessConfig.email.display}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-primary mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">{businessConfig.location.display}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="bg-primary text-white rounded-2xl p-8">
                  <Heading as="h3" size="lg" className="mb-4 text-white">
                    Have Questions?
                  </Heading>
                  <p className="text-white/90 mb-6">
                    Check out our frequently asked questions or schedule a call to speak with our
                    team about your specific situation.
                  </p>
                  <div className="space-y-3">
                    <Button variant="accent" className="w-full" asChild>
                      <a href={businessConfig.email.href}>Email Us Your Questions</a>
                    </Button>
                    <Button variant="white" className="w-full" asChild>
                      <a href="/get-started">Get Started</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
