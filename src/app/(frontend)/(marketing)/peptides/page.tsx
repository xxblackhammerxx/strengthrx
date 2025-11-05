import { DetailCard } from '@/components/ui/DetailCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Peptide Therapy - StrengthRX',
  description:
    'Discover the power of peptide therapy at StrengthRX. Our evidence-based peptide protocols help optimize recovery, performance, and overall wellness through targeted biological pathways.',
  alternates: {
    canonical: '/peptides',
  },
}

export default function PeptidesPage() {
  const peptideTherapies = [
    {
      title: 'GLP-1 Agonists',
      description:
        'Support healthy blood sugar regulation, weight management, and appetite control through enhanced insulin sensitivity.',
      benefits: ['Weight management support', 'Blood sugar optimization', 'Appetite regulation'],
    },
    {
      title: 'Growth Hormone Peptides',
      description:
        'Stimulate natural growth hormone production for enhanced recovery, muscle development, and anti-aging benefits.',
      benefits: ['Enhanced recovery', 'Improved sleep quality', 'Anti-aging support'],
    },
    {
      title: 'Healing & Recovery',
      description:
        'Accelerate tissue repair, reduce inflammation, and optimize recovery from injury or intense training.',
      benefits: ['Tissue repair acceleration', 'Inflammation reduction', 'Joint health support'],
    },
    {
      title: 'Cognitive Enhancement',
      description:
        'Support mental clarity, focus, memory, and overall cognitive function through neuroprotective pathways.',
      benefits: ['Mental clarity improvement', 'Enhanced focus', 'Memory support'],
    },
    {
      title: 'Metabolic Optimization',
      description:
        'Enhance metabolic function, energy production, and cellular efficiency for optimal performance.',
      benefits: ['Energy enhancement', 'Fat metabolism support', 'Cellular optimization'],
    },
    {
      title: 'Longevity & Anti-Aging',
      description:
        'Support cellular health, DNA repair, and longevity pathways for healthy aging and vitality.',
      benefits: [
        'Cellular health support',
        'DNA repair enhancement',
        'Longevity pathway activation',
      ],
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Peptide Therapy
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unlock your body's natural healing and optimization potential with our
              scientifically-backed peptide protocols designed for enhanced recovery, performance,
              and longevity.
            </p>
          </div>
        </Container>
      </section>

      {/* What Are Peptides Section */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="2xl" className="mb-6">
                What Are Peptides?
              </Heading>
              <div className="prose max-w-none">
                <p>
                  Peptides are short chains of amino acids that serve as signaling molecules in the
                  body, directing various biological functions. These naturally occurring compounds
                  play crucial roles in hormone production, tissue repair, immune function, and
                  metabolic processes.
                </p>
                <p>
                  At StrengthRX, we utilize therapeutic peptides that have been extensively
                  researched for their ability to optimize specific physiological pathways. Unlike
                  synthetic drugs, peptides work with your body's existing systems to enhance
                  natural processes safely and effectively.
                </p>
                <p>
                  Our peptide therapy protocols are personalized based on your individual health
                  goals, lab results, and response patterns, ensuring optimal outcomes with minimal
                  side effects.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Natural Action</h3>
                  <p className="text-muted-foreground">Work with your body's existing pathways</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Targeted Results</h3>
                  <p className="text-muted-foreground">Address specific biological functions</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Research-Backed</h3>
                  <p className="text-muted-foreground">Supported by extensive clinical studies</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized</h3>
                  <p className="text-muted-foreground">
                    Customized protocols for your unique needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Popular Peptides Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Popular Peptide Therapies
            </Heading>
            <p className="text-lg max-w-2xl mx-auto">
              Our most effective peptide protocols for optimization and wellness enhancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {peptideTherapies.map((therapy, index) => (
              <DetailCard
                key={index}
                title={therapy.title}
                description={therapy.description}
                benefits={therapy.benefits}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Benefits of Peptide Therapy
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the transformative effects of optimized peptide protocols.
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
                Enhanced Energy
              </Heading>
              <p className="text-muted-foreground">
                Sustained energy levels throughout the day without crashes or dependency.
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
                Faster Recovery
              </Heading>
              <p className="text-muted-foreground">
                Accelerated healing from workouts, injuries, and daily stressors.
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
                Mental Clarity
              </Heading>
              <p className="text-muted-foreground">
                Improved focus, memory, and cognitive performance for peak mental function.
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
                Longevity Support
              </Heading>
              <p className="text-muted-foreground">
                Anti-aging benefits and cellular health optimization for long-term vitality.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Our Peptide Therapy Process
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive approach to peptide optimization tailored to your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Consultation
              </Heading>
              <p className="text-muted-foreground">
                Comprehensive health assessment and goal discussion with our medical team.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Lab Testing
              </Heading>
              <p className="text-muted-foreground">
                Detailed laboratory analysis to establish baseline values and identify optimization
                opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Custom Protocol
              </Heading>
              <p className="text-muted-foreground">
                Personalized peptide protocol designed specifically for your health profile and
                goals.
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
                Regular monitoring, adjustments, and medical guidance throughout your journey.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Safety Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heading as="h2" size="3xl" className="mb-4">
                Safety & Quality Assurance
              </Heading>
              <p className="text-lg text-muted-foreground">
                Your safety is our top priority. All peptide protocols are carefully monitored by
                licensed healthcare professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Quality Standards</h3>
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
                    <span>FDA-registered pharmacy sourcing</span>
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
                    <span>Third-party purity testing</span>
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
                    <span>Sterile compounding standards</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Medical Oversight</h3>
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
                    <span>Licensed provider supervision</span>
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
                    <span>Regular health monitoring</span>
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
                    <span>24/7 medical support access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4 text-white">
              Start Your Peptide Journey
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Discover how peptide therapy can optimize your health, performance, and quality of
              life. Schedule a consultation with our medical team today.
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
