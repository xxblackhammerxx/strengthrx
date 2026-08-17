'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

/**
 * Persists ad attribution to a first-party cookie on arrival.
 *
 * Mounted in the ad-path layout so params are captured the moment a visitor
 * lands, before they navigate to the booking page or scroll to the form.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])

  return null
}
