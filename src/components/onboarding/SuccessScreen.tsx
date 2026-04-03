import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'

export function SuccessScreen() {
  return (
    <div className="text-center animate-fade-in-up">
      {/* Animated success icon with glow */}
      <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
          <CheckCircle2 className="h-10 w-10 text-green-400" strokeWidth={1.5} />
        </div>
      </div>

      <Heading as="h2" size="2xl" className="mb-3">
        You&apos;re all set!
      </Heading>
      <p className="text-neutral-400 mb-8 max-w-sm mx-auto leading-relaxed">
        Your information has been submitted successfully. We&apos;ll be in touch soon with your personalized next steps.
      </p>

      {/* TODO: Phase 4 — replace with real Rupa Health store link */}
      <div className="mx-auto max-w-sm rounded-xl border border-neutral-700/60 bg-neutral-800/40 p-5">
        <p className="text-sm font-medium text-foreground mb-1">What happens next?</p>
        <p className="text-xs text-neutral-500 mb-4">
          You&apos;ll receive instructions for ordering your lab tests shortly.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary-400">
          <span>Check your email for details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}
