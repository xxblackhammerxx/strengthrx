import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hormone Replacement Therapy - StrengthRX',
  description:
    'Optimize your hormones with StrengthRX comprehensive hormone replacement therapy. Our medical approach addresses testosterone, thyroid, and other hormonal imbalances for enhanced vitality and performance.',
  alternates: {
    canonical: '/hormone-therapy',
  },
}

export default function HormoneTherapyPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Hormone Replacement Therapy
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Restore optimal hormone levels and reclaim your vitality with our comprehensive
              hormone replacement therapy programs designed for lasting wellness.
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
                The Science of Hormone Optimization
              </Heading>
              <div className="prose max-w-none">
                <p>
                  Hormones are the chemical messengers that regulate virtually every function in
                  your body, from energy and mood to muscle mass and sexual function. As we age,
                  hormone production naturally declines, leading to symptoms that significantly
                  impact quality of life.
                </p>
                <p>
                  At StrengthRX, we use comprehensive testing and evidence-based hormone replacement
                  protocols to restore optimal levels safely and effectively. Our approach goes
                  beyond simply replacing hormones – we optimize your entire endocrine system for
                  peak performance and longevity.
                </p>
                <p>
                  Whether you're dealing with low testosterone, thyroid dysfunction, adrenal
                  fatigue, or other hormonal imbalances, our medical team provides personalized care
                  to help you feel like yourself again.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Comprehensive Testing</h3>
                  <p className="text-muted-foreground">
                    Detailed hormone panels to identify imbalances
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Bioidentical Hormones</h3>
                  <p className="text-muted-foreground">
                    Natural hormones identical to what your body produces
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized Protocols</h3>
                  <p className="text-muted-foreground">
                    Customized treatment plans for optimal results
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Ongoing Monitoring</h3>
                  <p className="text-muted-foreground">
                    Regular adjustments and medical supervision
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hormone Types Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Hormone Replacement Therapies
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive hormone optimization addressing all aspects of your endocrine system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Testosterone Replacement</h3>
              <p className="text-muted-foreground mb-4">
                Restore optimal testosterone levels for enhanced energy, muscle mass, libido, and
                overall vitality.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Increased energy and stamina
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved muscle mass and strength
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced libido and sexual function
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better mood and mental clarity
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Thyroid Optimization</h3>
              <p className="text-muted-foreground mb-4">
                Balance thyroid hormones (T3, T4, TSH) to optimize metabolism, energy, and overall
                metabolic function.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved metabolism and weight management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced energy levels
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better temperature regulation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved hair, skin, and nail health
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-3">Estrogen & Progesterone</h3>
              <p className="text-muted-foreground mb-4">
                Balance female hormones to address menopause symptoms, mood, bone health, and
                overall well-being.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Reduced hot flashes and night sweats
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved mood stability
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better sleep quality
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced bone density
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Growth Hormone</h3>
              <p className="text-muted-foreground mb-4">
                Optimize growth hormone levels for improved recovery, body composition, and
                anti-aging benefits.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced muscle development
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved recovery and healing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better sleep quality
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Youthful skin and appearance
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-3">Adrenal Support</h3>
              <p className="text-muted-foreground mb-4">
                Address adrenal fatigue and cortisol imbalances to improve stress response and
                energy levels.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better stress management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved energy stability
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced immune function
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Better sleep patterns
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
              </div>
              <h3 className="text-xl font-semibold mb-3">Insulin Optimization</h3>
              <p className="text-muted-foreground mb-4">
                Improve insulin sensitivity and glucose metabolism for better energy and weight
                management.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Stable blood sugar levels
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Improved weight management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Enhanced energy stability
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Reduced cravings
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Symptoms Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Signs You May Need Hormone Optimization
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recognize the symptoms of hormonal imbalance and take action to restore your vitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Common Symptoms in Men</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <span>Low energy and fatigue</span>
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
                      <span>Decreased libido</span>
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
                      <span>Muscle mass loss</span>
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
                      <span>Weight gain, especially belly fat</span>
                    </li>
                  </ul>
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
                      <span>Mood changes and irritability</span>
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
                      <span>Sleep disturbances</span>
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
                      <span>Mental fog and concentration issues</span>
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
                      <span>Erectile dysfunction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Common Symptoms in Women</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <span>Hot flashes and night sweats</span>
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
                      <span>Irregular periods</span>
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
                      <span>Mood swings and anxiety</span>
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
                      <span>Weight gain and bloating</span>
                    </li>
                  </ul>
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
                      <span>Low energy and fatigue</span>
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
                      <span>Hair thinning or loss</span>
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
                      <span>Sleep disturbances</span>
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
                      <span>Decreased libido</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Your Hormone Optimization Journey
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive, medically supervised approach to restoring optimal hormone levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Comprehensive Assessment
              </Heading>
              <p className="text-muted-foreground">
                Detailed medical history, symptom evaluation, and goal setting with our hormone
                specialists.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Advanced Testing
              </Heading>
              <p className="text-muted-foreground">
                Comprehensive hormone panels to identify imbalances and establish baseline values.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Personalized Protocol
              </Heading>
              <p className="text-muted-foreground">
                Customized hormone replacement plan designed for your unique needs and health
                profile.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Ongoing Optimization
              </Heading>
              <p className="text-muted-foreground">
                Regular monitoring, adjustments, and support to ensure optimal results and safety.
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
              Benefits of Hormone Optimization
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the transformative effects of balanced hormones on your health and
              vitality.
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
                Increased Energy
              </Heading>
              <p className="text-muted-foreground">
                Sustained energy levels throughout the day with improved stamina and vitality.
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
                Enhanced Mood
              </Heading>
              <p className="text-muted-foreground">
                Improved emotional stability, reduced anxiety, and better overall mental well-being.
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
                Better Body Composition
              </Heading>
              <p className="text-muted-foreground">
                Increased muscle mass, reduced body fat, and improved metabolic function.
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
                Improved Sleep
              </Heading>
              <p className="text-muted-foreground">
                Better sleep quality, easier time falling asleep, and more restorative rest.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Safety Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heading as="h2" size="3xl" className="mb-4">
                Safety & Medical Oversight
              </Heading>
              <p className="text-lg text-muted-foreground">
                Your safety is our priority. All hormone replacement protocols include comprehensive
                monitoring and medical supervision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Medical Standards</h3>
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
                    <span>Licensed healthcare provider supervision</span>
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
                    <span>FDA-approved bioidentical hormones</span>
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
                    <span>Sterile compounding pharmacy sourcing</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Monitoring Protocol</h3>
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
                    <span>Dose adjustments based on results</span>
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
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4 text-white">
              Optimize Your Hormones Today
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Stop living with the symptoms of hormonal imbalance. Schedule a consultation to learn
              how hormone optimization can transform your health and vitality.
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
