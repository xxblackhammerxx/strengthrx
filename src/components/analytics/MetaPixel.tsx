'use client'

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { META_PIXEL_ID } from '@/lib/meta/config'
import { MetaParamBuilder } from './MetaParamBuilder'

/**
 * App Router does a full page load only once, so the pixel's automatic
 * PageView fires a single time. Every client-side navigation after that needs
 * an explicit PageView or the whole funnel looks like one-page sessions.
 */
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // The base snippet already fires the first PageView — don't double count it.
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.fbq?.('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null

  return (
    <>
      {/*
        First: it runs in an effect, ahead of the afterInteractive pixel
        script, so `_fbc`/`_fbp` exist before the first PageView is sent and
        the browser and server halves agree on identity from the very first
        event.
      */}
      <MetaParamBuilder />
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
