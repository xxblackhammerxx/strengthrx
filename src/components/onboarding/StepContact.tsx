import { Controller, type Control, type UseFormRegister, type FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { Input } from '@/components/ui/Input'
import { SmsConsent } from '@/components/forms/SmsConsent'
import { User, Mail, Phone } from 'lucide-react'

interface StepContactProps {
  register: UseFormRegister<OnboardingFormData>
  control: Control<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

export function StepContact({ register, control, errors }: StepContactProps) {
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

        {/*
          A2P 10DLC opt-in. Not `required`: the phone field is optional, and
          gating account creation on agreeing to be texted would make consent a
          condition of service — which is exactly what the language under it
          says it is not.
        */}
        <Controller
          name="smsConsent"
          control={control}
          render={({ field }) => (
            <SmsConsent
              id="onboarding-sms-consent"
              checked={Boolean(field.value)}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  )
}
