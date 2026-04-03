import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import { GOAL_OPTIONS } from '@/lib/schemas/onboarding'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { cn } from '@/lib/utils'
import {
  Check,
  Flame,
  Zap,
  Brain,
  Dumbbell,
  Heart,
  Sparkles,
} from 'lucide-react'

const GOAL_ICONS: Record<string, React.ElementType> = {
  lose_weight: Flame,
  more_energy: Zap,
  less_burnout: Brain,
  build_muscle: Dumbbell,
  sexual_wellness: Heart,
  other: Sparkles,
}

interface StepGoalsProps {
  control: Control<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

export function StepGoals({ control, errors }: StepGoalsProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-1 tracking-tight">
        What are you looking to achieve?
      </h2>
      <p className="text-neutral-400 mb-8 text-sm">Select everything that applies to you</p>
      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const selected = field.value?.includes(goal.value)
              const Icon = GOAL_ICONS[goal.value] ?? Sparkles

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
                    'group relative flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-300',
                    'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
                    selected
                      ? 'border-primary/60 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent text-foreground shadow-[0_0_24px_rgba(181,44,41,0.12)]'
                      : 'border-neutral-700/60 bg-neutral-800/40 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/70',
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                      selected
                        ? 'bg-primary/20 text-primary-400'
                        : 'bg-neutral-700/50 text-neutral-500 group-hover:text-neutral-400',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Label */}
                  <span className="text-sm font-medium">{goal.label}</span>

                  {/* Checkmark */}
                  <div
                    className={cn(
                      'ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
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
      {errors.goals && (
        <p className="mt-4 text-sm text-destructive flex items-center gap-1.5">
          <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
          {errors.goals.message}
        </p>
      )}
    </div>
  )
}
