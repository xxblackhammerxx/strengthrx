import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Weight Loss Programs - StrengthRX',
  description:
    'Achieve sustainable weight loss with StrengthRX comprehensive programs. Our medical approach combines GLP-1 therapy, metabolic optimization, and personalized nutrition guidance.',
  alternates: {
    canonical: '/weight-loss',
  },
}

export default function WeightLossPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container>
          <div className="text-center">
            <Heading as="h1" size="4xl" className="mb-4">
              Medical Weight Loss Programs
            </Heading>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transform your relationship with weight management through our evidence-based medical
              programs designed for sustainable, long-term success.
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
                A Medical Approach to Weight Loss
              </Heading>
              <div className="prose max-w-none">
                <p>
                  At StrengthRX, we understand that sustainable weight loss goes beyond simple
                  "calories in, calories out." Our medical approach addresses the complex hormonal,
                  metabolic, and physiological factors that influence weight management.
                </p>
                <p>
                  Using FDA-approved medications like GLP-1 receptor agonists, comprehensive
                  metabolic testing, and personalized nutrition protocols, we help you achieve and
                  maintain your ideal weight while optimizing overall health.
                </p>
                <p>
                  Our programs are designed for individuals who have struggled with traditional diet
                  and exercise approaches, providing the medical support needed for lasting
                  transformation.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Medical Supervision</h3>
                  <p className="text-muted-foreground">
                    Licensed providers guide your entire journey
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">FDA-Approved Medications</h3>
                  <p className="text-muted-foreground">Proven therapies for weight management</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Comprehensive Testing</h3>
                  <p className="text-muted-foreground">
                    Identify root causes and optimize metabolism
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Sustainable Results</h3>
                  <p className="text-muted-foreground">
                    Long-term success through lifestyle integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* GLP-1 Therapy Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              GLP-1 Receptor Agonist Therapy
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary FDA-approved medications that work with your body's natural systems to
              promote healthy weight loss.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">How GLP-1 Therapy Works</h3>
                  <p className="text-muted-foreground">
                    GLP-1 (glucagon-like peptide-1) is a naturally occurring hormone that regulates
                    blood sugar and appetite. Our GLP-1 medications mimic this hormone, helping to:
                  </p>
                </div>

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
                    <span>Slow gastric emptying, promoting satiety</span>
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
                    <span>Reduce appetite and food cravings</span>
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
                    <span>Improve insulin sensitivity</span>
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
                    <span>Support healthy blood sugar levels</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Expected Results</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                  <span className="font-medium">Average Weight Loss</span>
                  <span className="text-accent font-bold">15-20%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                  <span className="font-medium">Timeframe</span>
                  <span className="text-accent font-bold">6-12 months</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                  <span className="font-medium">A1C Improvement</span>
                  <span className="text-accent font-bold">1-2 points</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                  <span className="font-medium">Success Rate</span>
                  <span className="text-accent font-bold">85%+</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Comprehensive Approach Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Comprehensive Weight Loss Solutions
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our multi-faceted approach addresses all aspects of weight management for optimal
              results.
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Metabolic Testing</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive lab work to identify hormonal imbalances, insulin resistance, thyroid
                function, and other metabolic factors affecting weight.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Thyroid panel (TSH, T3, T4)</li>
                <li>• Insulin and glucose levels</li>
                <li>• Hormone assessment</li>
                <li>• Metabolic markers</li>
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
              <h3 className="text-xl font-semibold mb-3">Medication Management</h3>
              <p className="text-muted-foreground mb-4">
                Personalized medication protocols including GLP-1 agonists, appetite suppressants,
                and metabolic enhancers as appropriate.
              </p>
              <ul className="text-sm space-y-1">
                <li>• GLP-1 receptor agonists</li>
                <li>• Appetite suppressants</li>
                <li>• Metabolic support compounds</li>
                <li>• Hormone optimization</li>
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4m6 0a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Nutrition Guidance</h3>
              <p className="text-muted-foreground mb-4">
                Evidence-based nutrition protocols tailored to your metabolic profile, food
                preferences, and lifestyle requirements.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Personalized meal planning</li>
                <li>• Macronutrient optimization</li>
                <li>• Supplement recommendations</li>
                <li>• Behavioral strategies</li>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exercise Optimization</h3>
              <p className="text-muted-foreground mb-4">
                Customized exercise recommendations based on your fitness level, preferences, and
                metabolic needs for maximum fat loss.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Strength training protocols</li>
                <li>• Cardiovascular optimization</li>
                <li>• Activity level guidance</li>
                <li>• Recovery strategies</li>
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
              <h3 className="text-xl font-semibold mb-3">Progress Monitoring</h3>
              <p className="text-muted-foreground mb-4">
                Regular check-ins, lab monitoring, and protocol adjustments to ensure continued
                progress and optimal results.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Weekly progress reviews</li>
                <li>• Body composition tracking</li>
                <li>• Lab result analysis</li>
                <li>• Protocol adjustments</li>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ongoing Support</h3>
              <p className="text-muted-foreground mb-4">
                Continuous medical guidance, lifestyle coaching, and maintenance strategies for
                long-term weight management success.
              </p>
              <ul className="text-sm space-y-1">
                <li>• 24/7 medical support</li>
                <li>• Lifestyle coaching</li>
                <li>• Maintenance planning</li>
                <li>• Community support</li>
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
              Your Weight Loss Journey
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured, medically supervised approach to achieving and maintaining your weight
              loss goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Initial Assessment
              </Heading>
              <p className="text-muted-foreground">
                Comprehensive health evaluation, medical history review, and goal setting with our
                medical team.
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
                Detailed metabolic testing to identify underlying factors affecting weight and
                overall health.
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
                Personalized weight loss plan including medications, nutrition guidance, and
                lifestyle modifications.
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
                Regular monitoring, adjustments, and support throughout your weight loss journey and
                maintenance.
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
              Benefits Beyond Weight Loss
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach improves multiple aspects of your health and well-being.
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Improved Energy
              </Heading>
              <p className="text-muted-foreground">
                Enhanced metabolism and better blood sugar control lead to sustained energy levels.
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
                Better Sleep
              </Heading>
              <p className="text-muted-foreground">
                Weight loss and metabolic improvements often lead to better sleep quality and
                duration.
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
                Enhanced Confidence
              </Heading>
              <p className="text-muted-foreground">
                Achieving weight loss goals builds confidence and improves overall quality of life.
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Heading as="h3" size="lg" className="mb-3">
                Health Improvements
              </Heading>
              <p className="text-muted-foreground">
                Reduced risk of diabetes, heart disease, and other weight-related health conditions.
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
              Start Your Weight Loss Journey
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Ready to achieve sustainable weight loss with medical support? Schedule a consultation
              to discuss your goals and learn about your options.
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
