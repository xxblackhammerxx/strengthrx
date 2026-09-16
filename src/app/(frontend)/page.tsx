import { Benefits } from '@/components/sections/Benefits'
import { CTA } from '@/components/sections/CTA'
import { FAQ } from '@/components/sections/FAQ'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Testimonials } from '@/components/sections/Testimonials'
import { businessConfig } from '@/lib/business.config'
import {
  generateJsonLdScript,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/schema'
import { getPrescriptionStateCodes } from '@/lib/prescription-states'
import type { Metadata } from 'next'

const homeTitle = 'TRT & Hormone Optimization Telehealth | StrengthRX'
const homeDescription =
  'StrengthRX provides provider-led telehealth for TRT, hormone optimization, peptides, weight loss, and performance protocols with labs and monitoring.'

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: businessConfig.urls.website,
  },
  openGraph: {
    url: businessConfig.urls.website,
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
}

export default async function HomePage() {
  const stateCodes = await getPrescriptionStateCodes()
  const organizationSchema = generateOrganizationSchema(stateCodes)
  const localBusinessSchema = generateLocalBusinessSchema(stateCodes)
  const websiteSchema = generateWebsiteSchema()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLdScript(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLdScript(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLdScript(websiteSchema),
        }}
      />

      {/* Page Content */}
      <div>
        <Hero />
        <ServicesGrid />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </div>
    </>
  )
}
