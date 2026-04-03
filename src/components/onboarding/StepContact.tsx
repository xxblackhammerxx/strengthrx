import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { Input } from '@/components/ui/Input'

interface StepContactProps {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

export function StepContact({ register, errors }: StepContactProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your contact information</h2>
      <p className="text-muted-foreground mb-6">We'll use this to set up your account</p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register('firstName')}
            label="First Name"
            error={errors.firstName?.message}
            required
            placeholder="John"
          />
          <Input
            {...register('lastName')}
            label="Last Name"
            error={errors.lastName?.message}
            required
            placeholder="Doe"
          />
        </div>
        <Input
          {...register('email')}
          label="Email"
          error={errors.email?.message}
          required
          type="email"
          placeholder="john@example.com"
        />
        <Input
          {...register('phone')}
          label="Phone"
          error={errors.phone?.message}
          type="tel"
          placeholder="(602) 555-0123"
        />
      </div>
    </div>
  )
}
