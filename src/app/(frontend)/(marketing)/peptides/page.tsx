import { Button } from '@/components/ui/Button'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * This page deliberately names no compounds.
 *
 * It previously published a 36-item formulary — BPC-157, TB-500, Ipamorelin,
 * Kisspeptin, CJC-1295, Epithalon, MOTS-c, Selank, Semax, Thymosin Alpha-1 and
 * others — each with an efficacy claim attached ("helps blood vessels grow",
 * "boosts natural growth hormone levels"). Several of those appear on FDA's
 * list of bulk drug substances that may present significant safety risks, and
 * a published menu of unapproved drugs paired with therapeutic claims is the
 * fact pattern in essentially every FTC and FDA enforcement action in this
 * category.
 *
 * Which compounds are appropriate is a clinical decision that belongs in the
 * consult, after labs and an evaluation — not on a public web page. Do not
 * reintroduce compound names, mechanism claims, or outcome claims here without
 * written sign-off from healthcare regulatory counsel against the current 503A
 * bulks list.
 */
export const metadata: Metadata = {
  title: 'Peptide Therapy',
  description:
    'How peptide therapy works at StrengthRX: comprehensive labs, evaluation by a licensed provider, and an individualized protocol dispensed by a licensed 503A compounding pharmacy.',
  alternates: {
    canonical: '/peptides',
  },
}

export default function PeptidesPage() {
  const process = [
    {
      title: 'Consultation',
      description:
        'A telehealth visit with our licensed nurse practitioner to review your history, your symptoms, and what you are trying to accomplish.',
    },
    {
      title: 'Lab Testing',
      description:
        'Comprehensive bloodwork to establish your baseline. We do not build a protocol from a questionnaire.',
    },
    {
      title: 'Individualized Protocol',
      description:
        'If therapy is clinically appropriate for you, your provider determines what to prescribe, at what dose, and for how long, based on your labs and your evaluation.',
    },
    {
      title: 'Monitoring and Adjustment',
      description:
        'Follow-up labs and visits to see how you are responding. Protocols change, pause, or stop based on what the results show.',
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
              Provider-led, lab-based care. What is appropriate for you is determined during your
              consultation — not chosen from a menu beforehand.
            </p>
          </div>
        </Container>
      </section>

      {/* What This Is Section */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h2" size="2xl" className="mb-6">
                How We Approach It
              </Heading>
              <div className="prose max-w-none">
                <p>
                  Peptides are short chains of amino acids that act as signaling molecules in the
                  body. In a clinical setting they are prescribed individually, for a specific
                  person, based on that person&apos;s labs, history, and goals.
                </p>
                <p>
                  We do not publish a catalog of compounds, and we would encourage you to be
                  cautious of any provider who does. Deciding what — if anything — is appropriate
                  for you is the entire purpose of the evaluation. Publishing a menu invites people
                  to self-select a therapy before anyone has looked at their bloodwork, which is
                  neither how prescribing works nor how it should work.
                </p>
                <p>
                  If your provider determines that peptide therapy is clinically appropriate, they
                  will discuss the specific options, the evidence behind them, the dosing, the
                  monitoring involved, and the risks with you directly during your consultation.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Labs First</h3>
                  <p className="text-muted-foreground">
                    Bloodwork before any protocol, not after
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Individually Prescribed</h3>
                  <p className="text-muted-foreground">
                    Determined by your provider for you specifically
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Licensed Pharmacy</h3>
                  <p className="text-muted-foreground">
                    Dispensed by a licensed 503A compounding pharmacy
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Monitored</h3>
                  <p className="text-muted-foreground">
                    Follow-up labs determine whether therapy continues
                  </p>
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
              How It Works
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four steps, in this order, every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {i + 1}
                </div>
                <Heading as="h3" size="lg" className="mb-3">
                  {step.title}
                </Heading>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Safety Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heading as="h2" size="3xl" className="mb-4">
                Safety and Sourcing
              </Heading>
              <p className="text-lg text-muted-foreground">
                Anything prescribed to you is dispensed by a licensed 503A compounding pharmacy —
                never research-grade material.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Sourcing</h3>
                <ul className="space-y-3">
                  {[
                    'Licensed 503A compounding pharmacy — not research grade',
                    'Sterile compounding standards',
                    'Dispensed only against a prescription written for you',
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Clinical Oversight</h3>
                <ul className="space-y-3">
                  {[
                    'Prescribed by a licensed nurse practitioner',
                    'Baseline and follow-up lab monitoring',
                    'Protocols adjusted or discontinued based on results',
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/*
              Required context, not boilerplate. Compounded preparations are not
              FDA-approved products, and saying so plainly is both accurate and
              the thing that distinguishes a legitimate prescriber from the
              gray-market vendors in this category.
            */}
            <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
              <h3 className="font-semibold mb-2">About compounded medications</h3>
              <p className="text-sm text-muted-foreground">
                Compounded preparations are not FDA-approved and are not reviewed by the FDA for
                safety or effectiveness. They are prepared by a licensed pharmacy for an individual
                patient pursuant to a prescription. Whether any therapy is appropriate for you is a
                clinical decision made by your provider after evaluation and lab work. This page is
                general information about our process and is not medical advice, a recommendation,
                or an offer to prescribe any particular medication. Individual results vary.
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
              Start With a Consultation
            </Heading>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Book a visit with our licensed provider to review your labs and find out whether this
              is an appropriate option for you.
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
                <a href={businessConfig.phone.href}>Call: {businessConfig.phone.display}</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

function CheckIcon() {
  return (
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
  )
}
