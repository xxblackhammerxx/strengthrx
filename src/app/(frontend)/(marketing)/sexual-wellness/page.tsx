import { Button } from '@/components/ui/Button'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { DetailCard } from '@/components/ui/DetailCard'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sexual Wellness - StrengthRX',
  description:
    'Restore confidence and vitality with StrengthRX sexual wellness programs. Our medical approach addresses erectile dysfunction, low libido, and sexual performance through evidence-based treatments.',
  alternates: {
    canonical: '/sexual-wellness',
  },
}

export default function SexualWellnessPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Sexual Wellness & Performance
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Reclaim your confidence and vitality with our comprehensive sexual wellness programs
              designed to address the root causes of sexual health concerns.
            </p>
          </div>
        </Container>
      </section>

      {/* Approach Section */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="2xl" className="mb-6">
                A Medical Approach to Sexual Health
              </Heading>
              <div className="prose max-w-none">
                <p>
                  Sexual wellness is a critical component of overall health and quality of life. At
                  StrengthRX, we understand that sexual health concerns can significantly impact
                  confidence, relationships, and well-being.
                </p>
                <p>
                  Our comprehensive approach addresses the complex factors that influence sexual
                  function, including hormonal imbalances, cardiovascular health, psychological
                  factors, and lifestyle influences. We provide discreet, professional care with
                  evidence-based treatments tailored to your specific needs.
                </p>
                <p>
                  Whether you're dealing with erectile dysfunction, low libido, performance anxiety,
                  or other sexual health concerns, our medical team is here to help you restore
                  confidence and vitality.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Confidential Care</h3>
                  <p className="text-muted-foreground">
                    Discreet, professional treatment in a judgment-free environment
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Root Cause Analysis</h3>
                  <p className="text-muted-foreground">
                    Comprehensive testing to identify underlying factors
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Evidence-Based Treatments</h3>
                  <p className="text-muted-foreground">
                    Proven therapies backed by clinical research
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Holistic Approach</h3>
                  <p className="text-muted-foreground">
                    Address physical, hormonal, and psychological factors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Common Concerns Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Common Sexual Health Concerns
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive care for a wide range of sexual wellness issues affecting
              both men and women.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DetailCard
              title="Erectile Dysfunction"
              description="Difficulty achieving or maintaining erections sufficient for satisfactory sexual performance."
              benefits={[
                'Performance anxiety',
                'Cardiovascular factors',
                'Hormonal imbalances',
                'Medication side effects',
              ]}
            />

            <DetailCard
              title="Low Libido"
              description="Decreased interest in sexual activity that may affect quality of life and relationships."
              benefits={[
                'Hormonal changes',
                'Stress and fatigue',
                'Relationship factors',
                'Medical conditions',
              ]}
            />

            <DetailCard
              title="Performance Issues"
              description="Concerns about sexual performance that can create anxiety and impact intimate relationships."
              benefits={[
                'Premature ejaculation',
                'Delayed ejaculation',
                'Performance anxiety',
                'Confidence issues',
              ]}
            />

            <DetailCard
              title="Hormonal Factors"
              description="Hormonal imbalances that significantly impact sexual desire, performance, and satisfaction."
              benefits={[
                'Low testosterone',
                'Estrogen imbalances',
                'Thyroid dysfunction',
                'Adrenal issues',
              ]}
            />

            <DetailCard
              title="Age-Related Changes"
              description="Natural changes in sexual function that occur with aging, affecting both men and women."
              benefits={[
                'Decreased sensitivity',
                'Reduced blood flow',
                'Hormonal decline',
                'Physical changes',
              ]}
            />

            <DetailCard
              title="Relationship Impact"
              description="Sexual health concerns that affect intimate relationships and overall quality of life."
              benefits={[
                'Communication barriers',
                'Intimacy concerns',
                'Partner satisfaction',
                'Emotional connection',
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Treatment Options Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Treatment Options
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive treatment approaches tailored to address your specific sexual wellness
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DetailCard
              title="Medication Therapy"
              description="Medications for erectile dysfunction, premature ejaculation, and other sexual health concerns."
              benefits={[
                'PDE5 inhibitors (Sildenafil, Tadalafil)',
                'Topical treatments and compounded formulations',
                'Injectable therapies for enhanced effectiveness',
                'Customized dosing for optimal results',
              ]}
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              }
            />

            <DetailCard
              title="Hormone Optimization"
              description="Comprehensive hormone testing and replacement therapy to address underlying hormonal factors affecting sexual function."
              benefits={[
                'Testosterone replacement therapy',
                'Estrogen and progesterone balancing',
                'Thyroid and adrenal support',
                'Regular monitoring and adjustments',
              ]}
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />

            <DetailCard
              title="Lifestyle Optimization"
              description="Comprehensive lifestyle interventions to support sexual health through improved overall wellness."
              benefits={[
                'Cardiovascular health optimization',
                'Stress management techniques',
                'Exercise and fitness recommendations',
                'Nutritional guidance for sexual health',
              ]}
              icon={
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
            />

          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Your Sexual Wellness Journey
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A confidential, comprehensive approach to restoring your sexual health and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Confidential Consultation
              </Heading>
              <p className="text-muted-foreground">
                Private discussion of your concerns, medical history, and goals in a judgment-free
                environment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Comprehensive Assessment
              </Heading>
              <p className="text-muted-foreground">
                Detailed testing to identify physical, hormonal, and psychological factors affecting
                sexual health.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Personalized Treatment
              </Heading>
              <p className="text-muted-foreground">
                Customized treatment plan addressing your specific needs and preferences for optimal
                results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Ongoing Support
              </Heading>
              <p className="text-muted-foreground">
                Continuous monitoring, adjustments, and support to ensure sustained improvement and
                satisfaction.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Benefits of Sexual Wellness Optimization
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive sexual health care can transform multiple aspects of your life and
              relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                Restored Confidence
              </Heading>
              <p className="text-muted-foreground">
                Regain self-assurance in intimate situations and overall life confidence.
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Enhanced Intimacy
              </Heading>
              <p className="text-muted-foreground">
                Improved physical performance and emotional connection with your partner.
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Better Relationships
              </Heading>
              <p className="text-muted-foreground">
                Stronger communication and deeper connections through improved sexual wellness.
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Overall Wellness
              </Heading>
              <p className="text-muted-foreground">
                Improved physical and mental health through comprehensive sexual wellness care.
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
              Reclaim Your Confidence
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Take the first step toward restored sexual wellness and confidence. Schedule a
              confidential consultation with our experienced medical team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link href="/contact">Book Confidential Consultation</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-primary"
                asChild
              >
                <a href={businessConfig.phone.href}>Call: {businessConfig.phone.display}</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
