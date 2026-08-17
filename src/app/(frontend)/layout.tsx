import { SiteFooter } from '@/components/footer/SiteFooter'
import { formatStateNames } from '@/lib/licensed-states'
import { businessConfig } from '@/lib/business.config'
import { MainNav } from '@/components/header/MainNav'
import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import './styles.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'StrengthRX | Strong body, strong minds, destroying mediocrity',
    template: '%s | StrengthRX',
  },
  // Names the licensed states outright. The previous copy claimed "We serve
  // all 50 states" and hedged prescription access to "select states" — a
  // reader, and a state board, reasonably concludes from that that we can
  // treat them anywhere.
  description: `Professional wellness optimization through TRT, peptides, and performance protocols. Prescription services available in ${formatStateNames()}.`,
  keywords: [
    'TRT',
    'testosterone replacement therapy',
    'peptides',
    'weight loss',
    'performance optimization',
    'telehealth',
    'Phoenix AZ',
  ],
  authors: [{ name: 'StrengthRX' }],
  creator: 'StrengthRX',
  metadataBase: new URL(businessConfig.urls.website),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: businessConfig.urls.website,
    title: 'StrengthRX | Strong body, strong minds, destroying mediocrity',
    description:
      'Professional wellness optimization through TRT, peptides, and performance protocols.',
    siteName: 'StrengthRX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StrengthRX - Professional Wellness Optimization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StrengthRX | Strong body, strong minds, destroying mediocrity',
    description:
      'Professional wellness optimization through TRT, peptides, and performance protocols.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </head>
      {/*
        No MetaPixel here, and nothing else that reports to an ad platform.

        This layout wraps /get-started, whose first step asks the user to check
        health goals ("Improve Sexual Wellness") and whose second step collects
        lab history. That is health information tied to an identifiable person,
        and a PageView carries the URL and referrer to Meta. Meta will not sign
        a BAA covering it, so the only safe payload is no payload — not a
        reduced one.

        It also wraps /peptides, /hormone-therapy and /sexual-wellness, which
        exist for organic search and carry the clinical vocabulary listed in
        lib/compliance.ts.

        Ad traffic never lands here. It lands in the (landing) group, which has
        its own pixel, no site nav, and copy screened against BANNED_TERMS.
        Keep the two paths separate.
      */}
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <MainNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
