'use client'

import { Suspense } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { GhlCalendarEmbed, type CalendarPrefill } from '@/components/booking/GhlCalendarEmbed'
import { GoogleCalendarEmbed } from '@/components/booking/GoogleCalendarEmbed'
import { businessConfig } from '@/lib/business.config'

const CALENDAR_ID = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID

/**
 * The calendar, shown in place of the lead form the moment a lead is captured.
 *
 * The alternative — "thanks, we'll call you shortly" — hands the booking to a
 * setter and loses everyone who does not answer the phone. Showing the calendar
 * while intent is at its peak is the difference between a lead and a booked
 * consultation, and the lead is already saved either way, so nothing is at risk
 * if they close the tab.
 *
 * Deliberately not an account signup. Creating a password before a first
 * conversation asks for commitment nobody has made yet.
 */
export function InlineScheduler({ prefill }: { prefill: CalendarPrefill }) {
  return (
    <div className="rounded-2xl border border-neutral-700/40 bg-neutral-900/50 p-5 shadow-2xl shadow-black/20 sm:p-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-primary" />
        <h3 className="font-heading text-xl font-bold">You&apos;re in. Pick your time.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400">
          Choose a slot below and you&apos;re booked — nothing else to fill out. Prefer we call you
          instead? Leave this page and a member of our team will reach out shortly.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl">
        {CALENDAR_ID ? (
          <Suspense
            fallback={
              <div className="flex h-[700px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            {/* Prefilled from what they just typed — see CalendarPrefill. */}
            <GhlCalendarEmbed calendarId={CALENDAR_ID} prefill={prefill} minHeight={700} />
          </Suspense>
        ) : (
          <GoogleCalendarEmbed minHeight={700} />
        )}
      </div>

      <p className="mt-4 text-center text-xs text-neutral-500">
        Rather talk now? Call{' '}
        <a href={businessConfig.phone.href} className="text-primary hover:underline">
          {businessConfig.phone.display}
        </a>
        .
      </p>
    </div>
  )
}
