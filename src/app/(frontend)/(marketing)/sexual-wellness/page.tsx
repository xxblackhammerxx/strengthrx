import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
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
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Erectile Dysfunction</h3>
              <p className="text-muted-foreground mb-4">
                Difficulty achieving or maintaining erections sufficient for satisfactory sexual
                performance.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Performance anxiety
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Cardiovascular factors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Hormonal imbalances
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Medication side effects
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Low Libido</h3>
              <p className="text-muted-foreground mb-4">
                Decreased interest in sexual activity that may affect quality of life and
                relationships.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Hormonal changes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Stress and fatigue
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Relationship factors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Medical conditions
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Performance Issues</h3>
              <p className="text-muted-foreground mb-4">
                Concerns about sexual performance that can create anxiety and impact intimate
                relationships.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Premature ejaculation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Delayed ejaculation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Performance anxiety
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Confidence issues
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Hormonal Factors</h3>
              <p className="text-muted-foreground mb-4">
                Hormonal imbalances that significantly impact sexual desire, performance, and
                satisfaction.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Low testosterone
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Estrogen imbalances
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Thyroid dysfunction
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Adrenal issues
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Age-Related Changes</h3>
              <p className="text-muted-foreground mb-4">
                Natural changes in sexual function that occur with aging, affecting both men and
                women.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Decreased sensitivity
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Reduced blood flow
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Hormonal decline
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Physical changes
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Relationship Impact</h3>
              <p className="text-muted-foreground mb-4">
                Sexual health concerns that affect intimate relationships and overall quality of
                life.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Communication barriers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Intimacy concerns
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Partner satisfaction
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Emotional connection
                </li>
              </ul>
            </div>
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
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                <h3 className="text-xl font-semibold">Medication Therapy</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                FDA-approved medications for erectile dysfunction, premature ejaculation, and other
                sexual health concerns.
              </p>
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
                  <span>PDE5 inhibitors (Sildenafil, Tadalafil)</span>
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
                  <span>Topical treatments and compounded formulations</span>
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
                  <span>Injectable therapies for enhanced effectiveness</span>
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
                  <span>Customized dosing for optimal results</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                <h3 className="text-xl font-semibold">Hormone Optimization</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Comprehensive hormone testing and replacement therapy to address underlying hormonal
                factors affecting sexual function.
              </p>
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
                  <span>Testosterone replacement therapy</span>
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
                  <span>Estrogen and progesterone balancing</span>
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
                  <span>Thyroid and adrenal support</span>
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
                  <span>Regular monitoring and adjustments</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                <h3 className="text-xl font-semibold">Lifestyle Optimization</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Comprehensive lifestyle interventions to support sexual health through improved
                overall wellness.
              </p>
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
                  <span>Cardiovascular health optimization</span>
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
                  <span>Stress management techniques</span>
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
                  <span>Exercise and fitness recommendations</span>
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
                  <span>Nutritional guidance for sexual health</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Support & Counseling</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Professional guidance to address psychological factors and relationship dynamics
                affecting sexual wellness.
              </p>
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
                  <span>Performance anxiety counseling</span>
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
                  <span>Relationship communication strategies</span>
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
                  <span>Confidence building techniques</span>
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
                  <span>Ongoing emotional support</span>
                </li>
              </ul>
            </div>
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
                <a href="tel:602-708-6487">Call: 602-708-6487</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
