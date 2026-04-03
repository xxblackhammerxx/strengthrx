import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { describe, it, expect, vi, beforeEach } from 'vitest'

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

  it('toggles goal selection on click — card gets selected border class', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepGoals control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    const firstCard = screen.getAllByRole('button')[0]
    // Before click — card has unselected border
    expect(firstCard.className).toContain('border-border')
    await user.click(firstCard)
    // After click — card should have selected border class
    expect(firstCard.className).toContain('border-primary')
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
    expect(screen.getByText(/yes, i have recent labs/i)).toBeTruthy()
    expect(screen.getByText(/no, i need labs/i)).toBeTruthy()
  })

  it('selects a labs option on click — card gets selected border class', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        {({ control, formState: { errors } }) => (
          <StepLabs control={control} errors={errors} />
        )}
      </FormWrapper>,
    )
    const yesCard = screen.getByRole('button', { name: /yes, i have recent labs/i })
    expect(yesCard.className).toContain('border-border')
    await user.click(yesCard)
    expect(yesCard.className).toContain('border-primary')
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
  it('highlights the active step with ring classes', () => {
    render(<StepIndicator currentStep={1} />)
    // The active step element has ring classes (ring-2 ring-primary)
    const stepDivs = document.querySelectorAll('.rounded-full')
    // Step index 1 (second) should have ring class
    const activeDiv = stepDivs[1]
    expect(activeDiv.className).toContain('ring-2')
  })

  it('shows check icon for completed steps', () => {
    render(<StepIndicator currentStep={2} />)
    // Steps 0 and 1 are complete — Check icon rendered via lucide-react
    // Check icons are SVGs inside the step circles
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })
})

// ─── ONBRD-06/07/08/09: Full form orchestration ──────────────────────────────

describe('GetStartedForm', () => {
  beforeEach(() => {
    // Mock fetch for form submission tests
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => ({ ok: true }) }))
  })

  it('shows step 1 (goals) by default', () => {
    render(<GetStartedForm />)
    expect(screen.getByText(/what are your health goals/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /continue/i })).toBeTruthy()
  })

  it('shows validation error when advancing without required fields', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Try to advance past step 1 without selecting any goals
    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    // An error message should appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/select at least one goal/i)).toBeTruthy()
    })
  })

  it('advances to step 2 after selecting a goal', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Select the first goal card
    const goalCards = screen.getAllByRole('button').filter((b) => b.type === 'button')
    await user.click(goalCards[0]) // select first goal

    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    // Should advance to step 2 (labs)
    await waitFor(() => {
      expect(screen.getByText(/have you had full labs done/i)).toBeTruthy()
    })
  })

  it('shows Back button on step 2', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Advance to step 2
    const goalCards = screen.getAllByRole('button')
    await user.click(goalCards[0])
    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeTruthy()
    })
  })

  it('shows success screen after valid submission', async () => {
    const user = userEvent.setup()
    render(<GetStartedForm />)

    // Step 1: select a goal
    const goalCards = screen.getAllByRole('button')
    await user.click(goalCards[0])
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 2: select labs option
    await waitFor(() => screen.getByText(/have you had full labs done/i))
    const yesCard = screen.getByRole('button', { name: /yes, i have recent labs/i })
    await user.click(yesCard)
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 3: fill contact info
    await waitFor(() => screen.getByLabelText(/first name/i))
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // After success the SuccessScreen should show
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeTruthy()
    })
  })
})
