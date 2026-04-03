import { z } from 'zod'

export const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'more_energy', label: 'More Energy' },
  { value: 'less_burnout', label: 'Less Burnout' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'sexual_wellness', label: 'Improve Sexual Wellness' },
  { value: 'other', label: 'Other' },
] as const

export const onboardingSchema = z.object({
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  labsStatus: z.enum(['yes', 'no'], { required_error: 'Please answer the labs question' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>

export const STEP_FIELDS: Record<number, (keyof OnboardingFormData)[]> = {
  0: ['goals'],
  1: ['labsStatus'],
  2: ['firstName', 'lastName', 'email'],
}

export const STEP_LABELS = ['Your Goals', 'Lab History', 'Contact Info']
