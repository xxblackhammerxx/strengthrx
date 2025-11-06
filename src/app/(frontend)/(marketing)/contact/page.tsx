'use client'

import { Button } from '@/components/ui/Button'
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state'
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

    try {
      // TODO: Replace with actual form submission logic
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message or redirect
      alert(
        'Thank you for your message! We will contact you within 24 hours to schedule your consultation.',
      )

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
      alert('Sorry, there was an error submitting your form. Please try again or call us directly.')
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
            <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-border">
              <Heading as="h2" size="xl" className="mb-6">
                Schedule Your Consultation
              </Heading>

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

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                  placeholder="(555) 123-4567"
                />

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Select your state</option>
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-2 text-sm text-destructive">{errors.state}</p>}
                </div>

                <Textarea
                  label="Tell us about your health goals"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={errors.message}
                  required
                  placeholder="What health or performance goals would you like to achieve? Any specific symptoms or concerns?"
                  rows={4}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Book Free Consultation'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you consent to be contacted by StrengthRX about our
                  services. We respect your privacy and will never share your information with third
                  parties.
                </p>
              </form>
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
                      <a href="tel:602-708-6487" className="text-primary hover:underline">
                        602-708-6487
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
                        href="mailto:Yourstrengthrx@gmail.com"
                        className="text-primary hover:underline"
                      >
                        Yourstrengthrx@gmail.com
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
                      <p className="text-muted-foreground">Phoenix, Arizona</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gray-700 rounded-2xl p-8 shadow-sm border border-border">
                <Heading as="h3" size="lg" className="mb-4">
                  Consultation Hours
                </Heading>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 7:00 PM MST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM MST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Same-day appointments available!</strong> Most consultations can be
                    scheduled within 24-48 hours.
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-primary text-white rounded-2xl p-8">
                <Heading as="h3" size="lg" className="mb-4 text-white">
                  Have Questions?
                </Heading>
                <p className="text-white/90 mb-6">
                  Check out our frequently asked questions or schedule a call to speak with our team
                  about your specific situation.
                </p>
                <div className="space-y-3">
                  <Button variant="accent" className="w-full" asChild>
                    <a href="mailto:Yourstrengthrx@gmail.com">Email Us Your Questions</a>
                  </Button>
                  <Button variant="white" className="w-full" asChild>
                    <a href="tel:602-708-6487">Call Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
