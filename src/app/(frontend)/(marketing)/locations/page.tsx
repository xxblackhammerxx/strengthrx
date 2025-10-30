import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Service Areas - Telehealth Across 8 States | StrengthRX',
  description:
    'StrengthRX provides telehealth services across Arizona, Idaho, Wyoming, Iowa, Utah, New Mexico, Nevada, and Colorado. Licensed providers in each state.',
  alternates: {
    canonical: '/locations',
  },
}

const serviceAreas = [
  { code: 'AZ', name: 'Arizona', description: 'Phoenix and surrounding areas' },
  { code: 'ID', name: 'Idaho', description: 'Boise and statewide coverage' },
  { code: 'WY', name: 'Wyoming', description: 'Cheyenne and statewide coverage' },
  { code: 'IA', name: 'Iowa', description: 'Des Moines and statewide coverage' },
  { code: 'UT', name: 'Utah', description: 'Salt Lake City and statewide coverage' },
  { code: 'NM', name: 'New Mexico', description: 'Albuquerque and statewide coverage' },
  { code: 'NV', name: 'Nevada', description: 'Las Vegas and statewide coverage' },
  { code: 'CO', name: 'Colorado', description: 'Denver and statewide coverage' },
]

export default function LocationsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Telehealth Services Across 8 States
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Convenient, professional wellness optimization services delivered directly to you
              through secure telehealth consultations. Licensed providers in each state we serve.
            </p>
          </div>
        </Container>
      </section>

      {/* Service Areas Grid */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {serviceAreas.map((area, index) => (
              <div
                key={area.code}
                className="bg-white rounded-lg p-6 shadow-sm border border-border text-center hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Badge size="lg" className="mb-3">
                  {area.code}
                </Badge>
                <h3 className="font-semibold text-foreground mb-1">{area.name}</h3>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/contact">Check Availability in Your Area</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Telehealth Benefits */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="3xl" className="mb-6">
                Why Choose Telehealth?
              </Heading>
              <p className="text-muted-foreground mb-8">
                Our telehealth model provides the same high-quality care you'd receive in a
                traditional office setting, with the added benefits of convenience, accessibility,
                and personalized attention.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent mt-1 mr-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Convenient Scheduling</h4>
                    <p className="text-muted-foreground text-sm">
                      Book appointments that work with your schedule, including evenings and
                      weekends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent mt-1 mr-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">No Travel Required</h4>
                    <p className="text-muted-foreground text-sm">
                      Consultations from the comfort of your home or office - no commute, no waiting
                      rooms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent mt-1 mr-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Secure & Private</h4>
                    <p className="text-muted-foreground text-sm">
                      HIPAA-compliant video consultations with encrypted communications and secure
                      data handling.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent mt-1 mr-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Personalized Attention</h4>
                    <p className="text-muted-foreground text-sm">
                      More time with providers and direct access to your care team throughout your
                      journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Heading as="h3" size="xl" className="mb-4">
                  Getting Started is Easy
                </Heading>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 shrink-0">
                      1
                    </div>
                    <span className="text-sm">Schedule your free consultation online</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 shrink-0">
                      2
                    </div>
                    <span className="text-sm">Complete health assessment and lab work</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 shrink-0">
                      3
                    </div>
                    <span className="text-sm">Meet with licensed provider via video</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 shrink-0">
                      4
                    </div>
                    <span className="text-sm">Begin personalized treatment protocol</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/contact">Start Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* State-Specific Information */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Licensed in Every State We Serve
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our healthcare providers are properly licensed and credentialed in each state where we
              offer services, ensuring compliance with local regulations and standards of care.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-blue-600 mt-0.5 mr-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Note</h3>
                <p className="text-blue-800 text-sm">
                  We are continuously expanding our service areas. If your state is not currently
                  listed, please contact us as we may be adding new locations soon. We're also happy
                  to provide referrals to trusted providers in your area.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Ready to get started? Book a free consultation to discuss your health goals and
              determine the best treatment approach for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="tel:602-708-6487">Call: 602-708-6487</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
