import { CheckCircle2 } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'

export function SuccessScreen() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
        <CheckCircle2 className="h-8 w-8 text-green-400" />
      </div>
      <Heading as="h2" size="2xl" className="mb-4">
        You&apos;re all set!
      </Heading>
      <p className="text-muted-foreground mb-4">
        Your information has been submitted. We'll be in touch soon with next steps.
      </p>
      {/* TODO: Phase 4 — replace with real Rupa Health store link */}
      <p className="text-sm text-muted-foreground">
        You'll receive instructions for ordering your lab tests shortly.
      </p>
    </div>
  )
}
