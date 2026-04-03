import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'

interface StepLabsProps {
  control: Control<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

const LAB_OPTIONS = [
  { value: 'yes', label: 'Yes, I have recent labs' },
  { value: 'no', label: 'No, I need labs' },
] as const

export function StepLabs({ control, errors }: StepLabsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Have you had full labs done in the last 30 days?
      </h2>
      <p className="text-muted-foreground mb-6">This helps us determine your next steps</p>
      <Controller
        name="labsStatus"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LAB_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => field.onChange(opt.value)}
                className={cn(
                  'rounded-lg border-2 p-6 text-center font-medium transition-colors',
                  field.value === opt.value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-muted text-muted-foreground hover:border-primary/50',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      />
      {errors.labsStatus && (
        <p className="mt-3 text-sm text-destructive">{errors.labsStatus.message}</p>
      )}
    </div>
  )
}
