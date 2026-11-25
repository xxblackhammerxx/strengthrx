import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { Benefits } from '@/components/sections/Benefits'
import { CTA } from '@/components/sections/CTA'
import { FAQ } from '@/components/sections/FAQ'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Testimonials } from '@/components/sections/Testimonials'
import {
  generateJsonLdScript,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/schema'
import { getPrescriptionStateCodes } from '@/lib/prescription-states'

export default async function HomePage() {
  const stateCodes = await getPrescriptionStateCodes()
  const organizationSchema = generateOrganizationSchema(stateCodes)
  const localBusinessSchema = generateLocalBusinessSchema(stateCodes)
  const websiteSchema = generateWebsiteSchema()

  return (
    <>
      {/*
        Mounted on this page, not in the layout: the layout also wraps
        /get-started and the clinical service pages, which must stay untracked.
      */}
      <GoogleAnalytics />
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
