import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { PortalNav } from '@/components/portal/PortalNav'
import { PortalFooter } from '@/components/portal/PortalFooter'
import '../(frontend)/styles.css'

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
    default: 'Portal | StrengthRX',
    template: '%s | StrengthRX Portal',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-neutral-950 font-sans antialiased">
        <PortalNav />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <PortalFooter />
      </body>
    </html>
  )
}
