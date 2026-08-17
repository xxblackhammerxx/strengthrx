import { MetadataRoute } from 'next'
import { businessConfig } from '@/lib/business.config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/features/', '*.pdf$'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
    ],
    sitemap: `${businessConfig.urls.website}/sitemap.xml`,
    host: businessConfig.urls.website,
  }
}
