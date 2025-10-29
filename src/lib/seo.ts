import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
}

const siteConfig = {
  name: 'StrengthRX',
  url: 'https://mystrengthrx.com',
  description:
    'Professional wellness optimization through TRT, peptides, and performance protocols. Telehealth services available across AZ, ID, WY, IA, UT, NM, NV, CO.',
  tagline: 'Strong body, strong minds, destroying mediocrity.',
  defaultOgImage: '/og-image.jpg',
  twitterHandle: '@strengthrx',
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  keywords = [],
  canonical,
  noIndex = false,
  ogImage = siteConfig.defaultOgImage,
  ogType = 'website',
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`

  const canonicalUrl = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url

  return {
    title: fullTitle,
    description,
    keywords: [
      'TRT',
      'testosterone replacement therapy',
      'peptides',
      'weight loss',
      'performance optimization',
      'telehealth',
      'Phoenix AZ',
      'hormone therapy',
      'wellness',
      'mens health',
      ...keywords,
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Professional Wellness Optimization`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generatePageJsonLd({
  type = 'WebPage',
  name,
  description,
  url,
  datePublished,
  dateModified,
}: {
  type?: 'WebPage' | 'Article' | 'FAQPage'
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}) {
  const baseJsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: `${siteConfig.url}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  }

  return baseJsonLd
}

export function generateBreadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${siteConfig.url}${item.url}` }),
    })),
  }
}

export { siteConfig }
