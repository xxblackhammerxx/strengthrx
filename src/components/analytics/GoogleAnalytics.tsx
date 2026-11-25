'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { GA4_MEASUREMENT_ID, ga4BootstrapScript, isGa4AllowedPath } from '@/lib/analytics/ga4'

/**
 * Google Analytics 4, for the homepage and the ad landing pages only.
 *
 * Renders nothing on any other path, so gtag.js is never requested from a
 * page it must not see (the request itself would carry the page URL to Google
 * as the referrer). Once loaded, the bootstrap script keeps it silent on every
 * other page the visitor reaches without a reload. See lib/analytics/ga4.ts.
 *
 * Advertising features are off: this is traffic measurement, not an ad pixel.
 */
export function GoogleAnalytics() {
  const pathname = usePathname()
  if (!GA4_MEASUREMENT_ID || !isGa4AllowedPath(pathname)) return null

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {ga4BootstrapScript(GA4_MEASUREMENT_ID)}
      </Script>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
      />
    </>
  )
}
