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

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()
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
