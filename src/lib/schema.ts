interface ContactInfo {
  telephone: string
  email: string
  address: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
}

interface Service {
  name: string
  description: string
  url?: string
}

const contactInfo: ContactInfo = {
  telephone: '+1-602-708-6487',
  email: 'Yourstrengthrx@gmail.com',
  address: {
    addressLocality: 'Phoenix',
    addressRegion: 'AZ',
    addressCountry: 'US',
  },
}

const serviceAreas = ['AZ', 'ID', 'WY', 'IA', 'UT', 'NM', 'NV', 'CO']

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://mystrengthrx.com/#organization',
    name: 'StrengthRX',
    alternateName: 'StrengthRX',
    url: 'https://mystrengthrx.com',
    logo: 'https://mystrengthrx.com/logo.png',
    description:
      'Professional wellness optimization through testosterone replacement therapy, peptide protocols, and performance enhancement. Telehealth services across 8 states.',
    foundingDate: '2022-02-01',
    telephone: contactInfo.telephone,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactInfo.address.addressLocality,
      addressRegion: contactInfo.address.addressRegion,
      addressCountry: contactInfo.address.addressCountry,
    },
    sameAs: [
      // Add social media URLs when available
      // 'https://www.facebook.com/strengthrx',
      // 'https://www.instagram.com/strengthrx',
      // 'https://www.linkedin.com/company/strengthrx',
    ],
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://mystrengthrx.com/#localbusiness',
    name: 'StrengthRX',
    image: 'https://mystrengthrx.com/og-image.jpg',
    description:
      'Professional wellness optimization through testosterone replacement therapy, peptide protocols, and performance enhancement.',
    url: 'https://mystrengthrx.com',
    telephone: contactInfo.telephone,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactInfo.address.addressLocality,
      addressRegion: contactInfo.address.addressRegion,
      addressCountry: contactInfo.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.4484', // Phoenix, AZ coordinates
      longitude: '-112.0740',
    },
    areaServed: serviceAreas.map((state) => ({
      '@type': 'State',
      name: state,
    })),
    serviceArea: serviceAreas,
    priceRange: '$$',
    openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-17:00'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wellness Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalTherapy',
            name: 'Testosterone Replacement Therapy (TRT)',
            description:
              'Comprehensive testosterone replacement therapy with ongoing monitoring and optimization.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalTherapy',
            name: 'Peptide Therapies',
            description:
              'Advanced peptide protocols for recovery, performance, and anti-aging benefits.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalTherapy',
            name: 'Weight Loss Programs',
            description:
              'Medically supervised weight management with GLP-1 medications and lifestyle coaching.',
          },
        },
      ],
    },
  }
}

export function generateMedicalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': 'https://mystrengthrx.com/#medicalorganization',
    name: 'StrengthRX',
    url: 'https://mystrengthrx.com',
    logo: 'https://mystrengthrx.com/logo.png',
    description:
      'Telehealth wellness optimization services specializing in hormone therapy, peptides, and performance enhancement.',
    telephone: contactInfo.telephone,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactInfo.address.addressLocality,
      addressRegion: contactInfo.address.addressRegion,
      addressCountry: contactInfo.address.addressCountry,
    },
    areaServed: serviceAreas,
    medicalSpecialty: [
      'Hormone Replacement Therapy',
      'Peptide Therapy',
      'Weight Management',
      'Performance Optimization',
      'Telehealth Services',
    ],
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Testosterone Replacement Therapy',
        description: 'Comprehensive TRT with medical supervision and ongoing monitoring.',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Peptide Therapy',
        description: 'Advanced peptide protocols for recovery and performance enhancement.',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Weight Loss Programs',
        description: 'Medically supervised weight management programs.',
      },
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mystrengthrx.com/#website',
    url: 'https://mystrengthrx.com',
    name: 'StrengthRX',
    description:
      'Professional wellness optimization through TRT, peptides, and performance protocols.',
    inLanguage: 'en-US',
    publisher: {
      '@id': 'https://mystrengthrx.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mystrengthrx.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateServiceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@id': 'https://mystrengthrx.com/#organization',
    },
    areaServed: serviceAreas.map((state) => ({
      '@type': 'State',
      name: state,
    })),
    serviceType: 'Medical Service',
    category: 'Healthcare',
    ...(service.url && { url: `https://mystrengthrx.com${service.url}` }),
  }
}

export function generateFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact StrengthRX',
    description: 'Contact StrengthRX for wellness optimization consultations and services.',
    url: 'https://mystrengthrx.com/contact',
    mainEntity: {
      '@type': 'ContactPoint',
      telephone: contactInfo.telephone,
      email: contactInfo.email,
      contactType: 'Customer Service',
      areaServed: serviceAreas,
      availableLanguage: 'English',
      hoursAvailable: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '17:00',
        },
      ],
    },
  }
}

// Utility function to generate JSON-LD string
export function generateJsonLdScript(data: object) {
  return JSON.stringify(data, null, 2)
}
