'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { onboardingSchema, type OnboardingFormData, STEP_FIELDS } from '@/lib/schemas/onboarding'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { StepGoals } from '@/components/onboarding/StepGoals'
import { StepLabs } from '@/components/onboarding/StepLabs'
import { StepContact } from '@/components/onboarding/StepContact'
import { SuccessScreen } from '@/components/onboarding/SuccessScreen'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'

export function GetStartedForm() {
  const [currentStep, setCurrentStep] = useState(0)

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
    },
  })

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep])
    if (valid) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1))

  const onSubmit = async (data: OnboardingFormData) => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Submission failed')
    setCurrentStep(3)
  }

  return (
    <Container size="sm" className="py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        {currentStep < 3 ? (
          <>
            <Heading as="h1" size="2xl" className="mb-2 text-center">
              Get Started
            </Heading>
            <p className="text-muted-foreground text-center mb-8">
              Tell us about yourself so we can personalize your plan.
            </p>
            <StepIndicator currentStep={currentStep} />
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 0 && <StepGoals control={control} errors={errors} />}
              {currentStep === 1 && <StepLabs control={control} errors={errors} />}
              {currentStep === 2 && <StepContact register={register} errors={errors} />}

              <div className="mt-8 flex justify-between gap-4">
                {currentStep > 0 && (
                  <Button type="button" variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <div className={currentStep === 0 ? 'ml-auto' : ''}>
                  {currentStep < 2 ? (
                    <Button type="button" onClick={handleNext}>
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </>
        ) : (
          <SuccessScreen />
        )}
      </div>
    </Container>
  )
}
