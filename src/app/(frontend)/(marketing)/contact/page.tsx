import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact StrengthRX to ask questions or request a consultation with a licensed provider.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
