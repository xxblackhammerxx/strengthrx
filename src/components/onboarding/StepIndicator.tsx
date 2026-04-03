import { Check } from 'lucide-react'
import { STEP_LABELS } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      {/* Progress bar background */}
      <div className="relative mx-auto max-w-sm">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-700/50" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-primary via-primary to-accent transition-all duration-700 ease-out"
          style={{ width: `${(currentStep / (STEP_LABELS.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {STEP_LABELS.map((label, i) => {
            const isComplete = i < currentStep
            const isActive = i === currentStep
            const isUpcoming = i > currentStep

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500',
                    isComplete &&
                      'bg-primary text-white shadow-[0_0_12px_rgba(181,44,41,0.4)]',
                    isActive &&
                      'bg-gradient-to-br from-primary to-primary-600 text-white shadow-[0_0_20px_rgba(181,44,41,0.5)] scale-110',
                    isUpcoming && 'bg-neutral-800 text-neutral-500 border border-neutral-700',
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2.5 text-[11px] font-medium tracking-wide uppercase transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-neutral-500',
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
