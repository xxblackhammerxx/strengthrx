import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - StrengthRX Professional Wellness Optimization',
  description:
    'Founded in February 2022, StrengthRX is dedicated to helping individuals achieve optimal health through evidence-based hormone optimization and performance enhancement protocols.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              About Us
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Dedicated to destroying mediocrity through disciplined wellness optimization and
              evidence-based medical interventions.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="2xl" className="mb-6">
                Our Mission: Strong Body, Strong Minds
              </Heading>
              <div className="prose max-w-none">
                <p>
                  Founded in February 2022, StrengthRX emerged from a simple yet powerful belief:
                  that optimal health is the foundation for achieving excellence in every aspect of
                  life. We specialize in evidence-based wellness optimization through hormone
                  therapy, peptide protocols, and performance enhancement strategies.
                </p>
                <p>
                  Our approach combines cutting-edge medical science with personalized care,
                  delivered through convenient telehealth services across eight states. We believe
                  in empowering individuals to take control of their health journey with
                  professional guidance, transparent processes, and sustainable protocols.
                </p>
                <p>
                  At StrengthRX, we don't just treat symptoms – we optimize systems. Our
                  comprehensive approach addresses the interconnected nature of hormonal health,
                  metabolic function, and overall wellness to help you achieve peak performance in
                  work, relationships, and life.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Founded</h3>
                  <p className="text-muted-foreground">February 2022</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground">Phoenix, Arizona</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Service Areas</h3>
                  <p className="text-muted-foreground">AZ, ID, WY, IA, UT, NM, NV, CO</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Service Model</h3>
                  <p className="text-muted-foreground">100% Telehealth</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Founder Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="2xl" className="mb-6">
                Meet Our Founders
              </Heading>
              <div className="text-center mb-8">
                <div className="mb-6 h-[200px] w-[200px] rounded-full overflow-hidden mx-auto">
                  <Image
                    src="/bobby-profile.png"
                    alt="Bobby Wolfe, FNP - Founder of StrengthRX"
                    width={200}
                    height={200}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Bobby Wolfe, FNP</h3>
                  <p>
                    Bobby Wolfe is a Family Nurse Practitioner and one of the founders and lead
                    practitioners of StrengthRx, a performance and wellness clinic built on one
                    mission—helping men and women feel like themselves again. With a passion for
                    fitness, hormone optimization, peptides, and overall wellness, Bobby takes a
                    personal, results-driven approach to helping every patient boost energy,
                    confidence, and strength from the inside out.
                  </p>
                  <p>
                    When he's not working with patients, you'll find him cheering on the Iowa
                    Hawkeyes, out fishing with his boys, or spending time with family—recharging the
                    same way he encourages others to.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/40 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Credentials</h3>
                  <p className="text-muted-foreground">Family Nurse Practitioner (FNP)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Specializations</h3>
                  <p className="text-muted-foreground">
                    Hormone Optimization, Peptide Therapy, Performance Enhancement
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Interests</h3>
                  <p className="text-muted-foreground">
                    Iowa Hawkeyes, Fishing, Family Time, Fitness
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mission</h3>
                  <p className="text-muted-foreground">
                    Helping men and women feel like themselves again
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Co-Founder Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-muted/40 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Role</h3>
                  <p className="text-muted-foreground">Co-Founder & Business Operations Director</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Primary Focus</h3>
                  <p className="text-muted-foreground">
                    Business Operations, Sales Strategy, Client Experience
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Partnership</h3>
                  <p className="text-muted-foreground">
                    Works closely with Bobby to deliver exceptional patient care
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mission</h3>
                  <p className="text-muted-foreground">
                    Ensuring seamless operations and outstanding client experiences
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-center mb-8">
                <div className="mb-6 h-[200px] w-[200px] rounded-full overflow-hidden mx-auto">
                  <Image
                    src="/kendon-profile.jpg"
                    alt="Kendon Hatch - Co-Founder of StrengthRX"
                    width={200}
                    height={200}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Kendon Hatch</h3>
                  <p>
                    Kendon Hatch is the Co-Founder and Business Operations Director at StrengthRX,
                    where he plays a crucial role in driving the company's growth and ensuring
                    exceptional client experiences. Working closely with Bobby Wolfe, Kendon focuses
                    on the operational excellence that allows StrengthRX to deliver world-class
                    wellness optimization services.
                  </p>
                  <p>
                    With a keen eye for business strategy and sales operations, Kendon ensures that
                    every aspect of the patient journey is seamless, from initial consultation
                    through ongoing treatment protocols. His dedication to operational excellence
                    and client satisfaction helps StrengthRX maintain its reputation for destroying
                    mediocrity in healthcare delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Our Core Values
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our approach to wellness optimization and patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Evidence-Based
              </Heading>
              <p className="text-muted-foreground">
                All our protocols are grounded in current medical research and clinical evidence,
                ensuring safe and effective treatments.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Personalized Care
              </Heading>
              <p className="text-muted-foreground">
                Every treatment plan is customized based on individual health history, lab results,
                and personal goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Excellence
              </Heading>
              <p className="text-muted-foreground">
                We're committed to destroying mediocrity in healthcare by setting new standards for
                patient outcomes and experience.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Safety & Oversight Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heading as="h2" size="3xl" className="mb-4">
                Safety & Medical Oversight
              </Heading>
              <p className="text-lg text-muted-foreground">
                Your safety is our top priority. Our approach emphasizes careful monitoring,
                responsible protocols, and professional oversight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Licensed Providers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
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
                    <span>Board-certified healthcare professionals</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Specialized training in hormone optimization</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Licensed in all states we serve</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Comprehensive Monitoring</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
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
                    <span>Regular lab work and health assessments</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Ongoing protocol adjustments as needed</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>24/7 access to medical support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important Medical Disclaimer:</strong> The information provided by
                StrengthRX on this website is for educational purposes only and should not be considered medical
                advice. All treatments are provided under the supervision of licensed healthcare
                providers. Individual results may vary. Please consult with our medical team to
                determine if our services are appropriate for your individual health needs.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4 text-white">
              Ready to Learn More?
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Schedule a consultation to discuss your health goals and learn how our evidence-based
              approach can help you achieve optimal wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link href="/contact">Book Consultation</Link>
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
