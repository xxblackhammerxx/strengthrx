'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { readAttributionCookie } from '@/lib/attribution'
import { MetaEvent } from '@/lib/meta/events'
import { newEventId, trackPixel } from '@/lib/meta/pixel'
import { SmsConsent } from '@/components/forms/SmsConsent'
import { InlineScheduler } from '@/components/landing/InlineScheduler'
import type { PrescriptionState } from '@/lib/prescription-states'

type Props = {
  landingPage: string
  ctaLabel: string
  footnote: string
  /** Licensed states, from the PrescriptionStates global. */
  states: PrescriptionState[]
}

type Fields = {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
}

const EMPTY: Fields = { firstName: '', lastName: '', email: '', phone: '', state: '' }

/** Formats as (602) 555-0142 while typing — fewer malformed numbers for the setter to fix. */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

const inputClass =
  'w-full rounded-xl border border-neutral-700 bg-neutral-950/60 px-4 py-3 text-sm text-foreground ' +
  'placeholder:text-neutral-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

export function LeadForm({ landingPage, ctaLabel, footnote, states }: Props) {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ waitlisted: boolean }>()
  // Honeypot — hidden from real users; only bots fill it.
  const [website, setWebsite] = useState('')

  const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = key === 'phone' ? formatPhone(event.target.value) : event.target.value
    setFields((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Shared with the server's CAPI copy so Meta dedupes them into one Lead.
    const metaEventIds = { lead: newEventId() }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          website,
          consentSms: consent,
          landingPage,
          attribution: readAttributionCookie(),
          metaEventIds,
        }),
      })

      const body = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(body.error || 'Something went wrong. Please try again.')
        return
      }

      // Out-of-state leads are not conversions — firing here would teach Meta
      // to find more people we cannot legally see.
      if (!body.waitlisted) {
        trackPixel(
          MetaEvent.Lead,
          { content_name: `Landing Page: ${landingPage}` },
          metaEventIds.lead,
        )
      }

      setResult({ waitlisted: Boolean(body.waitlisted) })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    // Out of state: no calendar. Booking a consultation we cannot legally
    // follow through on wastes their time and a slot on Kendon's calendar.
    if (result.waitlisted) {
      return (
        <div className="rounded-2xl border border-neutral-700/40 bg-neutral-900/50 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="font-heading text-xl font-bold">You&apos;re on the waitlist</h3>
          <p className="mt-2 text-sm text-neutral-400">
            We&apos;re not able to see clients in your state just yet. We&apos;ve saved your spot and
            will reach out the moment that changes.
          </p>
        </div>
      )
    }

    return (
      <InlineScheduler
        prefill={{
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
        }}
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-700/40 bg-neutral-900/50 p-6 shadow-2xl shadow-black/20 sm:p-7"
    >
      {/* Honeypot. Hidden from people and from screen readers, visible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          className={inputClass}
          placeholder="First name"
          autoComplete="given-name"
          value={fields.firstName}
          onChange={set('firstName')}
        />
        <input
          className={inputClass}
          placeholder="Last name"
          autoComplete="family-name"
          value={fields.lastName}
          onChange={set('lastName')}
        />
      </div>

      <input
        required
        type="email"
        className={`${inputClass} mt-3`}
        placeholder="Email address"
        autoComplete="email"
        value={fields.email}
        onChange={set('email')}
      />

      <input
        required
        type="tel"
        className={`${inputClass} mt-3`}
        placeholder="Phone number"
        autoComplete="tel"
        value={fields.phone}
        onChange={set('phone')}
      />

      <select
        required
        className={`${inputClass} mt-3`}
        value={fields.state}
        onChange={set('state')}
        aria-label="State"
      >
        <option value="">Select your state</option>
        {states.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
        <option value="XX">My state isn&apos;t listed</option>
      </select>

      {/* A2P 10DLC: never pre-checked. The server records timestamp and IP. */}
      <SmsConsent className="mt-4" checked={consent} onChange={setConsent} required />

      <p className="mt-3 text-[11px] leading-relaxed text-neutral-600">
        By submitting you agree we may contact you by phone about your assessment.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? 'Sending...' : ctaLabel}
      </button>

      <p className="mt-3 text-center text-[11px] text-neutral-600">{footnote}</p>
    </form>
  )
}
