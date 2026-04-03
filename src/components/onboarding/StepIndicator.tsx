import { Check } from 'lucide-react'
import { STEP_LABELS } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold',
                i < currentStep && 'bg-primary text-white',
                i === currentStep &&
                  'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-background',
                i > currentStep && 'bg-muted text-muted-foreground',
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="mt-1 text-xs text-muted-foreground hidden sm:block">{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={cn('h-0.5 flex-1 mx-2', i < currentStep ? 'bg-primary' : 'bg-border')}
            />
          )}
        </div>
      ))}
    </div>
  )
}
