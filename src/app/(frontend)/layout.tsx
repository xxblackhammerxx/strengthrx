import { SiteFooter } from '@/components/footer/SiteFooter'
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
  description:
    'Professional wellness optimization through TRT, peptides, and performance protocols. We serve all 50 states. Prescription services currently available in select states and expanding.',
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
  metadataBase: new URL('https://mystrengthrx.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mystrengthrx.com',
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
