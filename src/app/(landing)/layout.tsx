import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Image from 'next/image'
import Script from 'next/script'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { AttributionCapture } from '@/components/analytics/AttributionCapture'
import { businessConfig } from '@/lib/business.config'
import '../(frontend)/styles.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

/**
 * Root layout for ad destinations.
 *
 * Deliberately has NO MainNav and NO SiteFooter. The site navigation links to
 * /peptides, /hormone-therapy and /sexual-wellness — all of which contain
 * vocabulary that gets a Meta ad account flagged. Meta crawls the landing page
 * and everything reachable from it, so an ad-linked page carrying the normal
 * nav is enough to put the ad account at risk even when the ad copy is clean.
 *
 * The only outbound links here are the logo (non-linked), a phone number, and
 * the legal pages. Keep it that way.
 */
export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.urls.website),
  robots: { index: false, follow: false },
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <MetaPixel />
        <AttributionCapture />

        <div className="flex min-h-screen flex-col">
          {/* Not a link — a nav-less page keeps ad traffic on one action. */}
          <header className="border-b border-neutral-800">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
              <Image src="/logo.png" alt="StrengthRX" width={110} height={55} priority />
              <a
                href={businessConfig.phone.href}
                className="text-sm font-semibold text-neutral-300 hover:text-primary transition-colors"
              >
                {businessConfig.phone.display}
              </a>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-neutral-800 py-8">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
              <p className="text-xs text-neutral-600">
                &copy; {new Date().getFullYear()} StrengthRX. Provider-led telehealth.
                Individual results vary.
              </p>
              <p className="mt-2 text-xs text-neutral-600">
                <a href="/privacy" className="hover:text-neutral-400">
                  Privacy Policy
                </a>
                <span className="mx-2">·</span>
                <a href="/notice-of-privacy-practices" className="hover:text-neutral-400">
                  Privacy Practices
                </a>
                <span className="mx-2">·</span>
                <a href="/terms" className="hover:text-neutral-400">
                  Terms
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
