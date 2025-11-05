import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import Link from 'next/link'
import AnimatedSection from './AnimatedSection'

export function Hero() {
  return (
    <AnimatedSection>
      <section
        className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/barbell.jpg')",
        }}
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Heading as="h1" size="4xl" className="animate-fade-in-up text-white">
              Strong body, strong minds, destroying mediocrity.
            </Heading>

            <AnimatedSection delay={200}>
              <p className="mt-6 text-lg text-gray-200  max-w-2xl mx-auto animate-fade-in-up">
                Professional wellness optimization through testosterone replacement therapy, peptide
                protocols, and performance enhancement. Sustainable results backed by science and
                delivered through convenient telehealth services.
              </p>
            </AnimatedSection>
            {/* Pricing emphasis */}
            <AnimatedSection delay={300}>
              <div
                className="mt-6 bg-accent/90 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border-2 border-accent/30 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="text-white text-center">
                  <div className="text-3xl font-bold">$89</div>
                  <div className="text-lg font-medium">Lab Tests & Consultation</div>
                  <div className="text-sm opacity-90 mt-1">Complete wellness assessment</div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={400}>
              <div
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Button size="lg" asChild>
                  <Link href="/contact">Book Free Consult</Link>
                </Button>
                <Button variant="white" size="lg" asChild>
                  <a href="tel:602-708-6487">Call Now: 602-708-6487</a>
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={600}>
              <div
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center animate-fade-in-up"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-sm text-gray-300">States Served</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-accent">100%</div>
                  <div className="text-sm text-gray-300">Telehealth</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-primary">2022</div>
                  <div className="text-sm text-gray-300">Founded</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-accent">24/7</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-bounce-gentle"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-bounce-gentle"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/4 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-15 animate-bounce-gentle"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      </section>
    </AnimatedSection>
  )
}
