import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { GetStartedForm } from '@/components/onboarding/GetStartedForm'

export default function GetStartedPage() {
  return (
    <Suspense
      fallback={
        <Container size="sm" className="py-16 sm:py-24">
          <div className="mx-auto max-w-lg text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      }
    >
      <GetStartedForm />
    </Suspense>
  )
}
