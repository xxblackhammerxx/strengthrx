import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarCheck } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { BookingConfirmed } from './BookingConfirmed'

export const metadata: Metadata = {
  title: 'Your Consultation Is Booked',
  robots: { index: false, follow: false },
}

export default function BookingThanksPage() {
  return (
    <Container size="sm" className="py-16 sm:py-24">
      <Suspense fallback={null}>
        <BookingConfirmed />
      </Suspense>

      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CalendarCheck className="h-7 w-7 text-primary" />
        </div>

        <Heading as="h1" size="2xl">
          You&apos;re on the calendar
        </Heading>
        <p className="text-neutral-400 mt-3">
          Check your email for the confirmation and calendar invite. We&apos;ll send a reminder
          before your call — add us to your contacts so it doesn&apos;t get filtered.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link href="/get-started">Create your account</Link>
          </Button>
          <p className="mt-3 text-xs text-neutral-500">
            Setting it up now means less to cover on the call.
          </p>
        </div>
      </div>
    </Container>
  )
}
