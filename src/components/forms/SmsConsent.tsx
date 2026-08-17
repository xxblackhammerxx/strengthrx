'use client'

import { SMS_CONSENT_LINKS, SMS_CONSENT_TEXT } from '@/lib/consent'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Marks the field required. Off where a phone number is optional. */
  required?: boolean
  id?: string
  className?: string
}

/**
 * A2P 10DLC opt-in checkbox.
 *
 * Used by every form on the site that collects a phone number, so the wording a
 * carrier reviews is the wording every lead saw. The copy itself lives in
 * `@/lib/consent` — do not inline a variation here.
 *
 * Never pre-checked. `checked` must start `false` in the parent; a default of
 * `true` would make the opt-in a formality rather than an affirmative act, which
 * is the single most common reason a 10DLC campaign is rejected.
 */
export function SmsConsent({ checked, onChange, required = false, id = 'sms-consent', className = '' }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-neutral-400">
        <input
          id={id}
          name="smsConsent"
          type="checkbox"
          required={required}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-600 bg-neutral-950 text-primary focus:ring-primary"
        />
        <span>{SMS_CONSENT_TEXT}</span>
      </label>

      <p className="mt-2 pl-7 text-[11px] text-neutral-600">
        {SMS_CONSENT_LINKS.map((link, index) => (
          <span key={link.href}>
            {index > 0 && <span aria-hidden="true"> · </span>}
            <a href={link.href} className="underline hover:text-neutral-400" target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  )
}
