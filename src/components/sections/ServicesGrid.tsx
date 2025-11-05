import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { services } from '@/content/services'
import Link from 'next/link'

interface ServicesGridProps {
  variant?: 'default' | 'accent'
}

export function ServicesGrid({ variant = 'default' }: ServicesGridProps) {
  const isAccent = variant === 'accent'

  return (
    <section
      className={`py-16 sm:py-24 ${isAccent ? 'bg-accent text-white' : 'bg-neutral-800 text-white'}`}
    >
      <Container>
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className={`mb-4 ${isAccent ? 'text-white' : 'text-white'}`}>
            Comprehensive Wellness Solutions
          </Heading>
          <p
            className={`text-lg max-w-2xl mx-auto ${isAccent ? 'text-white/80' : 'text-gray-300'}`}
          >
            Evidence-based protocols designed to optimize your health, performance, and quality of
            life through advanced medical interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 ${
                isAccent
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15'
                  : 'bg-neutral-700 shadow-sm border border-neutral-600 hover:shadow-lg hover:bg-neutral-600'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <Heading
                  as="h3"
                  size="lg"
                  className={`mb-2 ${isAccent ? 'text-white' : 'text-white'}`}
                >
                  {service.title}
                </Heading>
                <p className={`text-sm ${isAccent ? 'text-white/80' : 'text-gray-300'}`}>
                  {service.description}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {service.benefits.slice(0, 3).map((benefit, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start text-sm ${isAccent ? 'text-white/90' : 'text-gray-300'}`}
                  >
                    <svg
                      className={`h-4 w-4 mt-0.5 mr-2 shrink-0 text-accent`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant={'primary'} asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
