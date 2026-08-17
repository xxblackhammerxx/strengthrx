'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { MetaEvent } from '@/lib/meta/events'
import { trackEvent } from '@/lib/meta/pixel'

/**
 * Fires Schedule once the booking widget has redirected here.
 *
 * The calendar itself lives in a cross-origin iframe, so its internal
 * confirmation is unreadable — the redirect is the only trustworthy signal
 * that a booking completed. Configure the GHL calendar to redirect here on
 * success, and pass the booker's details through as query params so the
 * server copy has identifiers to match on.
 */
export function BookingConfirmed() {
  const searchParams = useSearchParams()
  const hasFired = useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    void trackEvent(MetaEvent.Schedule, {
      params: { content_name: 'Consultation Booked', content_category: 'Booking' },
      userData: {
        email: searchParams.get('email') ?? undefined,
        phone: searchParams.get('phone') ?? undefined,
        firstName: searchParams.get('first_name') ?? undefined,
        lastName: searchParams.get('last_name') ?? undefined,
      },
    })
  }, [searchParams])

  return null
}
