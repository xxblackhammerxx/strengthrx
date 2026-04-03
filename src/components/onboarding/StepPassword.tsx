'use client'

import { useState } from 'react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { OnboardingFormData } from '@/lib/schemas/onboarding'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepPasswordProps {
  register: UseFormRegister<OnboardingFormData>
  errors: FieldErrors<OnboardingFormData>
}

function PasswordField({
  label,
  show,
  onToggle,
  error,
  ...inputProps
}: {
  label: string
  show: boolean
  onToggle: () => void
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) {
  const { ref, ...rest } = inputProps as any
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        <span className="text-destructive ml-1">*</span>
      </label>
      <div className="relative">
        <div className="flex gap-1">
          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            className={cn(
              'flex h-12 w-full rounded-lg border border-input bg-background pl-10 pr-12 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              error && 'border-destructive focus:ring-destructive',
            )}
            {...rest}
          />

          <button
            type="button"
            onClick={onToggle}
            className="flex items-center justify-center w-12 h-12 rounded-lg border border-input bg-neutral-800/50 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function StepPassword({ register, errors }: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-1 tracking-tight">
        Create your password
      </h2>
      <p className="text-neutral-400 mb-8 text-sm">
        You&apos;ll use this to access your patient portal
      </p>
      <div className="space-y-5">
        <PasswordField
          label="Password"
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          error={errors.password?.message}
          placeholder="At least 8 characters"
          {...register('password')}
        />
        <PasswordField
          label="Confirm Password"
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          error={errors.confirmPassword?.message}
          placeholder="Re-enter your password"
          {...register('confirmPassword')}
        />
      </div>
    </div>
  )
}
