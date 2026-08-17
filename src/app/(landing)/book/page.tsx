import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { GhlCalendarEmbed } from '@/components/booking/GhlCalendarEmbed'
import { GoogleCalendarEmbed } from '@/components/booking/GoogleCalendarEmbed'
import { TrackViewContent } from '@/components/analytics/TrackViewContent'
import { businessConfig } from '@/lib/business.config'

export const metadata: Metadata = {
  title: 'Book Your Consultation',
  description:
    'Book a free consultation with StrengthRX. Talk through your goals, labs, and options with our team.',
  alternates: { canonical: '/book' },
  // Paid-traffic destination — keep it out of the index so it does not compete
  // with the service pages for organic queries.
  robots: { index: false, follow: true },
}

const CALENDAR_ID = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID

export default function BookPage() {
  return (
    <Container size="md" className="py-12 sm:py-16">
      <TrackViewContent contentName="Booking Page" contentCategory="Booking" />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-3">
          Free Consultation
        </p>
        <Heading as="h1" size="3xl">
          Book Your Consultation
        </Heading>
        <p className="text-neutral-400 mt-3 text-sm sm:text-base">
          Pick a time that works for you. We&apos;ll review your goals, walk you through the
          process, and answer every question before you commit to anything.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-700/40 bg-neutral-900/50 p-2 sm:p-4 shadow-2xl shadow-black/20">
        {/* Prefer GoHighLevel once it is configured — it is the only one of the
            two that can redirect on completion, which is what fires Schedule.
            Kendon's Google schedule keeps the page functional until then. */}
        {CALENDAR_ID ? (
          <Suspense
            fallback={
              <div className="flex h-[750px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <GhlCalendarEmbed calendarId={CALENDAR_ID} />
          </Suspense>
        ) : (
          <GoogleCalendarEmbed />
        )}
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Prefer to talk now? Call{' '}
        <a href={businessConfig.phone.href} className="text-primary hover:underline">
          {businessConfig.phone.display}
        </a>
        .
      </p>
      <p className="mt-3 text-center text-[11px] text-neutral-600">
        Your information is encrypted and never shared with third parties.
      </p>
    </Container>
  )
}
