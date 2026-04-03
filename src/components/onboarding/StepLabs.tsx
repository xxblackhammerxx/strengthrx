import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'
import { Check, FileCheck, FlaskConical } from 'lucide-react'

interface StepLabsProps {
  control: Control<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

const LAB_OPTIONS = [
  {
    value: 'yes' as const,
    label: 'Yes, I have recent labs',
    description: 'You can upload them in your patient portal',
    icon: FileCheck,
  },
  {
    value: 'no' as const,
    label: 'No, I need labs',
    description: "No worries — we'll help you get them ordered",
    icon: FlaskConical,
  },
]

export function StepLabs({ control, errors }: StepLabsProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-1 tracking-tight">
        Have you had full labs done recently?
      </h2>
      <p className="text-neutral-400 mb-8 text-sm">Within the last 30 days</p>
      <Controller
        name="labsStatus"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-3">
            {LAB_OPTIONS.map((opt) => {
              const selected = field.value === opt.value
              const Icon = opt.icon

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'group relative flex items-center gap-4 rounded-xl border p-5 text-left transition-all duration-300',
                    'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
                    selected
                      ? 'border-primary/60 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent shadow-[0_0_24px_rgba(181,44,41,0.12)]'
                      : 'border-neutral-700/60 bg-neutral-800/40 hover:border-neutral-600 hover:bg-neutral-800/70',
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                      selected
                        ? 'bg-primary/20 text-primary-400'
                        : 'bg-neutral-700/50 text-neutral-500 group-hover:text-neutral-400',
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <span
                      className={cn(
                        'block text-sm font-semibold transition-colors duration-300',
                        selected ? 'text-foreground' : 'text-neutral-300',
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {opt.description}
                    </span>
                  </div>

                  {/* Checkmark */}
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                      selected
                        ? 'border-primary bg-primary text-white scale-100'
                        : 'border-neutral-600 bg-transparent scale-90 opacity-40',
                    )}
                  >
                    <Check
                      className={cn(
                        'h-3.5 w-3.5 transition-all duration-300',
                        selected ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                      )}
                      strokeWidth={3}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      />
      {errors.labsStatus && (
        <p className="mt-4 text-sm text-destructive flex items-center gap-1.5">
          <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
          {errors.labsStatus.message}
        </p>
      )}
    </div>
  )
}
