import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

const steps = [
  {
    step: '1',
    title: 'Free Consultation',
    description:
      'Schedule a virtual consultation to discuss your health goals and symptoms with our licensed providers.',
  },
  {
    step: '2',
    title: 'Labs & Assessment',
    description:
      'Complete comprehensive lab work and health assessment to create your personalized treatment plan.',
  },
  {
    step: '3',
    title: 'Start Protocol',
    description:
      'Begin your customized wellness protocol with ongoing medical supervision and support.',
  },
  {
    step: '4',
    title: 'Track & Optimize',
    description:
      'Regular monitoring and protocol adjustments to ensure optimal results and continued progress.',
  },
]

interface HowItWorksProps {
  variant?: 'default' | 'accent'
}

export function HowItWorks({ variant = 'default' }: HowItWorksProps) {
  const isAccent = variant === 'accent'

  return (
    <section className={`py-16 sm:py-24 ${isAccent ? 'bg-accent text-white' : ''}`}>
      <Container>
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className={`mb-4 ${isAccent ? 'text-white' : ''}`}>
            How It Works
          </Heading>
          <p
            className={`text-lg max-w-2xl mx-auto ${isAccent ? 'text-white/80' : 'text-muted-foreground'}`}
          >
            Our streamlined process makes it easy to start your wellness optimization journey with
            professional medical guidance every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="text-center relative">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 text-white rounded-full text-lg font-bold mb-4 ${
                  isAccent
                    ? index % 2 === 0
                      ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                      : 'bg-primary'
                    : index % 2 === 0
                      ? 'bg-primary'
                      : 'bg-accent'
                }`}
              >
                {step.step}
              </div>
              <Heading as="h3" size="md" className={`mb-2 ${isAccent ? 'text-white' : ''}`}>
                {step.title}
              </Heading>
              <p className={`text-sm ${isAccent ? 'text-white/80' : 'text-muted-foreground'}`}>
                {step.description}
              </p>

              {/* Arrow connector (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full">
                  <svg
                    className={`w-8 h-6 mx-auto ${isAccent ? 'text-white/40' : 'text-accent/40'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
