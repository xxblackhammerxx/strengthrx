import { Button } from '@/components/ui/Button'
import { businessConfig } from '@/lib/business.config'
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
  const peptideCatalog = [
    {
      name: 'BPC-157',
      description:
        'Supports healing and recovery by reducing inflammation, helping blood vessels grow, and repairing muscles, tendons, and ligaments.',
    },
    {
      name: 'TB-500 (Thymosin Beta-4)',
      description:
        'Enhances tissue repair and recovery, boosts new blood vessel growth, and directs repair cells to injured areas.',
    },
    {
      name: '5-Amino-1MQ',
      description:
        'Improves metabolism and energy use by blocking NNMT, supporting weight management, cellular energy, and overall metabolic health.',
    },
    {
      name: 'Cagrilintide',
      description:
        'Helps control appetite, slow gastric emptying, and promote steady weight loss and metabolic balance.',
    },
    {
      name: 'CJC-1295',
      description:
        'Stimulates natural growth hormone release, supporting muscle growth, fat metabolism, recovery, and overall performance.',
    },
    {
      name: 'Dihexa',
      description:
        'Supports brain health by enhancing connections between neurons, promoting new cell growth, and improving memory and cognitive function.',
    },
    {
      name: 'DSIP (Delta Sleep-Inducing Peptide)',
      description:
        'Promotes deep, restorative sleep, reduces nighttime awakenings, and supports relaxation, stress balance, and recovery.',
    },
    {
      name: 'Enclomiphene',
      description:
        'Supports healthy testosterone levels by stimulating natural production, maintaining fertility, and improving energy, mood, and body composition.',
    },
    {
      name: 'Epithalon',
      description:
        'Promotes healthy aging and cellular repair by supporting telomere length, cell regeneration, and protection from oxidative stress.',
    },
    {
      name: 'FOXO4-DRI',
      description:
        'Targets and removes damaged senescent cells, supporting tissue repair, energy, and healthy aging.',
    },
    {
      name: 'GHK-Cu',
      description:
        'Supports skin, tissue, and body repair by promoting collagen production, reducing inflammation, and regenerating cells.',
    },
    {
      name: 'Gonadorelin',
      description:
        'Stimulates natural release of LH and FSH, supporting reproductive health, fertility, testosterone, and hormone balance.',
    },
    {
      name: 'Humanin',
      description:
        'Protects cells from stress, supports mitochondrial function, and promotes healthy aging and overall vitality.',
    },
    {
      name: 'IGF-1 LR3',
      description:
        'Supports muscle growth, repair, and recovery by promoting cell growth, protein synthesis, and tissue regeneration.',
    },
    {
      name: 'Ibutamoren (MK-677)',
      description:
        'Boosts natural growth hormone levels, supporting muscle growth, fat metabolism, recovery, and healthy aging.',
    },
    {
      name: 'Ipamorelin',
      description:
        'Stimulates growth hormone release, aiding muscle growth, fat metabolism, recovery, and overall energy and performance.',
    },
    {
      name: 'Kisspeptin',
      description:
        'Supports reproductive hormone health by stimulating LH and FSH release, improving fertility, testosterone, and overall hormone balance.',
    },
    {
      name: 'Larazotide',
      description:
        'Strengthens the intestinal lining, reduces gut inflammation, improves nutrient absorption, and supports digestive health.',
    },
    {
      name: 'LL-37 MDV',
      description:
        'Enhances immune defense, fights infections, reduces inflammation, and promotes tissue repair and overall health.',
    },
    {
      name: 'Melanotan',
      description:
        'Stimulates melanin production, supporting skin pigmentation and protection against sun damage.',
    },
    {
      name: 'Melanotan II',
      description:
        'Boosts skin tanning, may influence appetite and sexual function, and supports appearance and wellness.',
    },
    {
      name: 'Methylene Blue',
      description:
        'Supports cellular energy and brain function by improving mitochondrial performance and protecting against oxidative stress.',
    },
    {
      name: 'MOTS-c',
      description:
        'Enhances metabolism and cellular energy, improves fat metabolism and insulin sensitivity, and supports overall vitality.',
    },
    {
      name: 'NAD+',
      description:
        'Boosts cellular energy, supports DNA repair, and maintains healthy metabolism, improving energy, mental clarity, and healthy aging.',
    },
    {
      name: 'Naltrexone (low dose)',
      description:
        'Modulates opioid receptors, supporting immune health, metabolism, and healthy weight management.',
    },
    {
      name: 'Pentosan Polysulfate Sodium (PPS)',
      description:
        'Supports joint and connective tissue health by reducing inflammation, protecting cartilage, and improving mobility.',
    },
    {
      name: 'Pinealon',
      description:
        'Protects neurons, improves memory, learning, focus, and overall cognitive function.',
    },
    {
      name: 'PT-141 (Bremelanotide)',
      description:
        'Enhances sexual arousal and desire by stimulating nervous system receptors, improving libido and sexual wellness.',
    },
    {
      name: 'Selank',
      description:
        'Reduces anxiety, improves focus, and supports mental clarity, emotional balance, and overall well-being.',
    },
    {
      name: 'Semax',
      description:
        'Enhances brain health, memory, focus, and concentration while supporting neuroprotection and mental performance.',
    },
    {
      name: 'SS-31 (Elamipretide)',
      description:
        'Protects mitochondria, boosts cellular energy, reduces oxidative stress, and supports healthy aging and recovery.',
    },
    {
      name: 'Rapamycin',
      description:
        'Regulates cell growth, promotes repair, and protects against age-related decline, supporting longevity and overall wellness.',
    },
    {
      name: 'Sermorelin',
      description:
        'Stimulates growth hormone release, supporting muscle growth, fat metabolism, recovery, and healthy aging.',
    },
    {
      name: 'Tadalafil',
      description:
        'Improves blood flow and erectile function, enhancing sexual performance, confidence, and vascular health.',
    },
    {
      name: 'Thymosin Alpha-1',
      description:
        'Strengthens the immune system, reduces inflammation, and promotes recovery and overall wellness.',
    },
    {
      name: 'Tesamorelin',
      description:
        'Stimulates growth hormone release to reduce abdominal fat, support muscle growth, improve metabolism, and enhance body composition.',
    },
  ]

  const peptideCategories = [
    {
      title: 'Brain Health & Cognitive Function',
      peptides: [
        {
          name: 'Dihexa',
          description:
            'Enhances neuron connections, promotes new cell growth, and improves memory and cognitive function.',
        },
        {
          name: 'Pinealon',
          description:
            'Protects neurons, improves memory, learning, focus, and overall cognitive function.',
        },
        {
          name: 'Selank',
          description:
            'Reduces anxiety, improves focus, and supports mental clarity, emotional balance, and overall well-being.',
        },
        {
          name: 'Semax',
          description:
            'Enhances brain health, memory, focus, and concentration while supporting neuroprotection.',
        },
        {
          name: 'Methylene Blue',
          description:
            'Supports cellular energy and brain function, improving mitochondrial performance and mental clarity.',
        },
        {
          name: 'Humanin',
          description:
            'Protects cells from stress, supports mitochondrial function, and promotes healthy aging and vitality.',
        },
      ],
    },
    {
      title: 'Muscle, Tissue & Recovery',
      peptides: [
        {
          name: 'BPC-157',
          description:
            'Supports healing by reducing inflammation, repairing muscles, tendons, and ligaments.',
        },
        {
          name: 'TB-500 (Thymosin Beta-4)',
          description:
            'Enhances tissue repair, boosts blood vessel growth, and directs repair cells to injuries.',
        },
        {
          name: 'GHK-Cu',
          description:
            'Promotes collagen production, reduces inflammation, and regenerates cells for skin and tissue repair.',
        },
        {
          name: 'IGF-1 LR3',
          description: 'Promotes muscle growth, protein synthesis, and tissue regeneration.',
        },
        {
          name: 'CJC-1295',
          description:
            'Stimulates natural growth hormone release for muscle growth, fat metabolism, recovery, and performance.',
        },
        {
          name: 'Ipamorelin',
          description:
            'Stimulates growth hormone release, supporting muscle growth, fat metabolism, and recovery.',
        },
        {
          name: 'Sermorelin',
          description:
            'Stimulates growth hormone release, aiding muscle growth, fat metabolism, and recovery.',
        },
        {
          name: 'Tesamorelin',
          description:
            'Stimulates growth hormone release to reduce abdominal fat, support muscle growth, and improve body composition.',
        },
        {
          name: 'DSIP (Delta Sleep-Inducing Peptide)',
          description:
            'Supports restorative sleep, which is essential for tissue repair and recovery.',
        },
        {
          name: 'SS-31 (Elamipretide)',
          description:
            'Protects mitochondria, boosts cellular energy, and supports recovery.',
        },
        {
          name: 'FOXO4-DRI',
          description: 'Clears damaged senescent cells, improving tissue repair and energy.',
        },
      ],
    },
    {
      title: 'Metabolism, Weight Management & Overall Health',
      peptides: [
        {
          name: '5-Amino-1MQ',
          description:
            'Improves metabolism, cellular energy, and supports healthy weight management.',
        },
        {
          name: 'Cagrilintide',
          description: 'Controls appetite, slows gastric emptying, and promotes steady weight loss.',
        },
        {
          name: 'Ibutamoren (MK-677)',
          description:
            'Boosts growth hormone, supporting metabolism, fat loss, recovery, and energy.',
        },
        {
          name: 'MOTS-c',
          description:
            'Enhances metabolism, improves fat metabolism, and supports overall vitality.',
        },
        {
          name: 'NAD+',
          description: 'Boosts cellular energy, supports DNA repair, and maintains healthy metabolism.',
        },
        {
          name: 'Naltrexone (low dose)',
          description: 'Supports immune health, metabolism, and weight management.',
        },
        {
          name: 'Pentosan Polysulfate Sodium (PPS)',
          description: 'Reduces joint inflammation and protects connective tissue.',
        },
        {
          name: 'Epithalon',
          description: 'Promotes healthy aging, telomere support, and cellular repair.',
        },
        {
          name: 'Rapamycin',
          description:
            'Regulates cell growth, promotes repair, and protects against age-related decline.',
        },
        {
          name: 'Thymosin Alpha-1',
          description: 'Strengthens the immune system and promotes recovery and overall wellness.',
        },
        {
          name: 'Larazotide',
          description:
            'Supports gut health by strengthening the intestinal lining and reducing inflammation.',
        },
      ],
    },
    {
      title: 'Sexual Health & Hormonal Function',
      peptides: [
        {
          name: 'Enclomiphene',
          description:
            'Stimulates natural testosterone production, supporting fertility, energy, and body composition.',
        },
        {
          name: 'Gonadorelin',
          description:
            'Stimulates LH and FSH release, supporting reproductive health, fertility, and testosterone.',
        },
        {
          name: 'Kisspeptin',
          description:
            'Supports reproductive hormone health by stimulating LH and FSH release.',
        },
        {
          name: 'PT-141 (Bremelanotide)',
          description:
            'Enhances sexual arousal and desire, improving libido and sexual wellness.',
        },
        {
          name: 'Tadalafil',
          description:
            'Improves blood flow and erectile function, enhancing sexual performance and vascular health.',
        },
        {
          name: 'Melanotan',
          description: 'Stimulates melanin production for skin pigmentation and sun protection.',
        },
        {
          name: 'Melanotan II',
          description: 'Boosts tanning, may influence appetite and sexual function.',
        },
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

      {/* Peptide Catalog Section */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Peptide Catalog
            </Heading>
            <p className="text-lg max-w-2xl mx-auto">
              Explore our full list of peptide therapies and their targeted wellness applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peptideCatalog.map((peptide) => (
              <div key={peptide.name} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl font-semibold mb-3">{peptide.name}</h3>
                <p className="text-muted-foreground">{peptide.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Category Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              Peptides by Goal
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find therapies grouped by the outcomes you want to prioritize.
            </p>
          </div>

          <div className="space-y-8">
            {peptideCategories.map((category) => (
              <div key={category.title} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <Heading as="h3" size="xl" className="mb-5">
                  {category.title}
                </Heading>
                <ul className="space-y-3">
                  {category.peptides.map((peptide) => (
                    <li key={peptide.name} className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{peptide.name}</span> –{' '}
                      {peptide.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                <a href={businessConfig.phone.href}>Call: {businessConfig.phone.display}</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
