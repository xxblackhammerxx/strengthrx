import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import Link from 'next/link'
import AnimatedSection from './AnimatedSection'

export function Hero() {
  return (
    <AnimatedSection>
      <section className="relative bg-linear-to-br from-primary/90 via-white to-accent/90 pt-16 pb-20 sm:pt-24 sm:pb-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Heading as="h1" size="4xl" className="animate-fade-in-up text-accent-700">
              Strong body, strong minds, destroying mediocrity.
            </Heading>
            <AnimatedSection delay={500}>
              <p
                className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                Professional wellness optimization through testosterone replacement therapy, peptide
                protocols, and performance enhancement. Sustainable results backed by science and
                delivered through convenient telehealth services.
              </p>
            </AnimatedSection>

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

            <div
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="bg-white/50 backdrop-blur rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">States Served</div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Telehealth</div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary">2022</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
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
