import { describe, expect, it } from 'vitest'
import { businessConfig } from '@/lib/business.config'
import { metadata } from '@/app/(frontend)/page'

describe('homepage metadata', () => {
  it('defines a unique crawlable homepage title and description', () => {
    expect(metadata.title).toBe('Telehealth Wellness Optimization, TRT & Peptides | StrengthRX')
    expect(metadata.description).toBe(
      'StrengthRX offers provider-led TRT, peptide and performance wellness programs with lab-based protocols, telehealth check-ins and ongoing support.',
    )
    expect(metadata.description).not.toMatch(/physician/i)
  })

  it('canonicalizes the homepage to the configured www host', () => {
    expect(metadata.alternates?.canonical).toBe(businessConfig.urls.website)
  })
})
