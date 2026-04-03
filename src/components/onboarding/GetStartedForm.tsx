'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { onboardingSchema, type OnboardingFormData, STEP_FIELDS } from '@/lib/schemas/onboarding'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { StepGoals } from '@/components/onboarding/StepGoals'
import { StepLabs } from '@/components/onboarding/StepLabs'
import { StepContact } from '@/components/onboarding/StepContact'
import { StepPassword } from '@/components/onboarding/StepPassword'
import { Container } from '@/components/ui/Container'

const TOTAL_STEPS = 4

export function GetStartedForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      goals: [],
      labsStatus: undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep])
    if (valid) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1))

  const onSubmit = async (data: OnboardingFormData) => {
    setSubmitError('')
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setSubmitError(body.error || 'Something went wrong. Please try again.')
      return
    }

    router.push('/client-portal')
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isBeforeLastStep = currentStep < TOTAL_STEPS - 1

  return (
    <Container size="sm" className="py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-3">
            Start Your Journey
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Get Started
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Tell us about yourself so we can personalize your plan.
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* Form card */}
        <div className="rounded-2xl border border-neutral-700/40 bg-neutral-900/50 backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 0 && <StepGoals control={control} errors={errors} />}
            {currentStep === 1 && <StepLabs control={control} errors={errors} />}
            {currentStep === 2 && <StepContact register={register} errors={errors} />}
            {currentStep === 3 && <StepPassword register={register} errors={errors} />}

            {submitError && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-foreground transition-colors duration-200 cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {isBeforeLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(181,44,41,0.3)] active:scale-[0.98] cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(181,44,41,0.3)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust signal */}
        <p className="mt-6 text-center text-[11px] text-neutral-600">
          Your information is encrypted and never shared with third parties.
        </p>
      </div>
    </Container>
  )
}
