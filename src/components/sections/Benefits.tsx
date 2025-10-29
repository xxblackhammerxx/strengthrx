import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

const benefits = [
  {
    title: 'Clinical Guidance',
    description:
      'Licensed healthcare providers with specialized expertise in hormone optimization and performance enhancement.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Personalized Protocols',
    description:
      'Customized treatment plans based on comprehensive lab work, health history, and individual goals.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    description:
      'Clear, upfront pricing with no hidden fees. Direct-pay model ensures personalized attention and faster service.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
  },
  {
    title: 'Telehealth Convenience',
    description:
      'Virtual consultations and ongoing support from the comfort of your home. Available across 8 states.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
]

export function Benefits() {
  return (
    <section className="py-16 sm:py-24 bg-linear-to-br from-accent via-accent to-accent-700">
      <Container>
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-4 text-white">
            Why Choose StrengthRX?
          </Heading>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We combine medical expertise with modern convenience to deliver exceptional results in
            hormone optimization and wellness enhancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4 group-hover:bg-white/20 transition-all">
                {benefit.icon}
              </div>
              <Heading as="h3" size="md" className="mb-2 text-white">
                {benefit.title}
              </Heading>
              <p className="text-white/80 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
