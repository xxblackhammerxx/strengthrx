import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { services } from '@/content/services'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Services - TRT, Peptides & Weight Loss | StrengthRX',
  description:
    'Comprehensive wellness services including testosterone replacement therapy, peptide protocols, weight loss programs, and performance optimization. Licensed providers, telehealth available.',
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Comprehensive Wellness Services
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Evidence-based protocols designed to optimize your health, performance, and quality of
              life through advanced medical interventions. All services delivered through convenient
              telehealth consultations.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <ServicesGrid />

      {/* Detailed Services */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <Container>
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Heading as="h2" size="2xl" className="mb-4">
                    {service.title}
                  </Heading>
                  <p className="text-muted-foreground mb-6">{service.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-accent mt-0.5 mr-3 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-foreground/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg"></div>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                      <p className="text-muted-foreground mb-6">
                        Get started with a personalized consultation and treatment plan.
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/contact">Book Consultation</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4 text-white">
              Ready to Start Your Wellness Journey?
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Our expert team is ready to help you achieve your health and performance goals with
              personalized protocols and ongoing support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-primary"
                asChild
              >
                <a href="tel:602-708-6487">Call: 602-708-6487</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
