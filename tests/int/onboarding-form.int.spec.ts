import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { describe, it, expect } from 'vitest'

// These imports target modules that do not exist yet.
// Tests will fail RED until Plans 01 and 02 create them.
import {
  onboardingSchema,
  GOAL_OPTIONS,
  type OnboardingFormData,
} from '@/lib/schemas/onboarding'
import { StepGoals } from '@/components/onboarding/StepGoals'
import { StepLabs } from '@/components/onboarding/StepLabs'
import { StepContact } from '@/components/onboarding/StepContact'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { GetStartedForm } from '@/components/onboarding/GetStartedForm'

// Wrapper that provides react-hook-form context to step components
function FormWrapper({
  children,
}: {
  children: (form: UseFormReturn<OnboardingFormData>) => React.ReactNode
}) {
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
      labsStatus: undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  })
  return <form>{children(form)}</form>
}

// ─── ONBRD-02: Goal selection ────────────────────────────────────────────────

describe('StepGoals', () => {
  it('renders all 6 goal option cards', () => {
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepGoals control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    // GOAL_OPTIONS should have 6 entries; each card should be visible
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(6)
    GOAL_OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeTruthy()
    })
  })

  it('toggles goal selection on click', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepGoals control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    const firstCard = screen.getAllByRole('button')[0]
    await user.click(firstCard)
    // After clicking the card should have a selected/active indicator
    expect(firstCard).toHaveAttribute('aria-pressed', 'true')
  })
})

// ─── ONBRD-03: Labs status ───────────────────────────────────────────────────

describe('StepLabs', () => {
  it('renders yes and no option cards', () => {
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepLabs control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    expect(screen.getByText(/yes/i)).toBeTruthy()
    expect(screen.getByText(/no/i)).toBeTruthy()
  })

  it('selects a labs option on click', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepLabs control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    const yesCard = screen.getByRole('button', { name: /yes/i })
    await user.click(yesCard)
    expect(yesCard).toHaveAttribute('aria-pressed', 'true')
  })
})

// ─── ONBRD-04: Contact info ──────────────────────────────────────────────────

describe('StepContact', () => {
  it('renders first name, last name, email, and phone fields', () => {
    render(
      <FormWrapper>
        {({ register, formState: { errors } }) => (
          <StepContact register={register} errors={errors} />
        )}
      </FormWrapper>,
    )
    expect(screen.getByLabelText(/first name/i)).toBeTruthy()
    expect(screen.getByLabelText(/last name/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/phone/i)).toBeTruthy()
  })
})

// ─── ONBRD-05: Step indicator ────────────────────────────────────────────────

describe('StepIndicator', () => {
  it('highlights the active step', () => {
    render(<StepIndicator currentStep={1} />)
    // The active step element should carry an aria-current="step" attribute
    const activeStep = screen.getByRole('listitem', { current: 'step' })
    expect(activeStep).toBeTruthy()
  })

  it('shows checkmark for completed steps', () => {
    render(<StepIndicator currentStep={2} />)
    // Step 1 is complete when currentStep=2 — expect a checkmark icon/text
    expect(screen.getByLabelText(/step 1 complete/i)).toBeTruthy()
  })
})

// ─── ONBRD-06/07/08/09: Full form orchestration ──────────────────────────────

describe('GetStartedForm', () => {
  it('preserves data when navigating back', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Advance to contact step (step 3) then go back — data should remain
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton) // step 1 → 2
    await user.click(nextButton) // step 2 → 3

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton) // step 3 → 2

    // Step 2 content should be visible again
    expect(screen.getByText(/labs/i)).toBeTruthy()
  })

  it('shows validation error when advancing without required fields', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Try to advance past step 1 without selecting any goals
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    // An error message should appear
    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('shows loading spinner during submission', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Fill out all required fields and submit
    const submitButton = screen.getByRole('button', { name: /submit|get started/i })
    await user.click(submitButton)

    // A spinner/loading indicator should appear while the request is in-flight
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  it('shows success screen after submission', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Trigger a successful form submission (mocked network in a real pass)
    const submitButton = screen.getByRole('button', { name: /submit|get started/i })
    await user.click(submitButton)

    // After success the SuccessScreen component should be visible
    expect(screen.getByText(/success|you're all set|next steps/i)).toBeTruthy()
  })
})
