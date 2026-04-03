import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-16 sm:py-24 bg-primary text-white">
      <Container>
        <div className="text-center">
          <Heading as="h2" size="3xl" className="mb-4 text-white">
            Ready to Upgrade Your Health?
          </Heading>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Take the first step toward optimized wellness. Schedule your free consultation today and
            discover how StrengthRX can help you achieve your health and performance goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-white/80">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Free initial consultation
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Licensed medical providers
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Same-day appointments available
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
