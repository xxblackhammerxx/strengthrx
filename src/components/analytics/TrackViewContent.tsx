'use client'

import { useEffect, useRef } from 'react'
import { MetaEvent } from '@/lib/meta/events'
import { trackEvent } from '@/lib/meta/pixel'

type Props = {
  /**
   * A generic, non-identifying label for the page.
   *
   * Keep these coarse ("Service Page", "Membership"). Do not pass a specific
   * condition or treatment name — pairing a health interest with a matchable
   * identifier is exactly the data Meta's terms prohibit sending.
   */
  contentName: string
  contentCategory?: string
}

/**
 * Drop into a server-rendered marketing page to fire ViewContent on mount,
 * through both the pixel and the Conversions API.
 */
export function TrackViewContent({ contentName, contentCategory = 'Service' }: Props) {
  const hasFired = useRef(false)

  useEffect(() => {
    // React 18 StrictMode mounts effects twice in dev — guard against a double send.
    if (hasFired.current) return
    hasFired.current = true

    void trackEvent(MetaEvent.ViewContent, {
      params: { content_name: contentName, content_category: contentCategory },
    })
  }, [contentName, contentCategory])

  return null
}
