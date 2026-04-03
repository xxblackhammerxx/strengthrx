import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import { GOAL_OPTIONS } from '@/lib/schemas/onboarding'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'

interface StepGoalsProps {
  control: Control<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

export function StepGoals({ control, errors }: StepGoalsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">What are your health goals?</h2>
      <p className="text-muted-foreground mb-6">Select all that apply</p>
      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const selected = field.value?.includes(goal.value)
              return (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? field.value.filter((v: string) => v !== goal.value)
                      : [...(field.value ?? []), goal.value]
                    field.onChange(next)
                  }}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-colors',
                    selected
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-muted text-muted-foreground hover:border-primary/50',
                  )}
                >
                  {goal.label}
                </button>
              )
            })}
          </div>
        )}
      />
      {errors.goals && (
        <p className="mt-3 text-sm text-destructive">{errors.goals.message}</p>
      )}
    </div>
  )
}
