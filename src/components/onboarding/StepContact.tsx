import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { Input } from '@/components/ui/Input'
import { User, Mail, Phone } from 'lucide-react'

interface StepContactProps {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

export function StepContact({ register, errors }: StepContactProps) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-1 tracking-tight">
        How can we reach you?
      </h2>
      <p className="text-neutral-400 mb-8 text-sm">We&apos;ll use this to set up your account</p>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-[38px] text-neutral-500">
              <User className="h-4 w-4" />
            </div>
            <Input
              {...register('firstName')}
              label="First Name"
              error={errors.firstName?.message}
              required
              placeholder="John"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-[38px] text-neutral-500">
              <User className="h-4 w-4" />
            </div>
            <Input
              {...register('lastName')}
              label="Last Name"
              error={errors.lastName?.message}
              required
              placeholder="Doe"
              className="pl-10"
            />
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-[38px] text-neutral-500">
            <Mail className="h-4 w-4" />
          </div>
          <Input
            {...register('email')}
            label="Email"
            error={errors.email?.message}
            required
            type="email"
            placeholder="john@example.com"
            className="pl-10"
          />
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-[38px] text-neutral-500">
            <Phone className="h-4 w-4" />
          </div>
          <Input
            {...register('phone')}
            label="Phone"
            error={errors.phone?.message}
            type="tel"
            placeholder="(602) 555-0123"
            className="pl-10"
          />
        </div>
      </div>
    </div>
  )
}
