import { describe, expect, it } from 'vitest'
import { businessConfig } from '@/lib/business.config'
import { metadata } from '@/app/(frontend)/page'

describe('homepage metadata', () => {
  it('defines a unique crawlable homepage title and description', () => {
    expect(metadata.title).toBe('TRT & Hormone Optimization Telehealth | StrengthRX')
    expect(metadata.description).toBe(
      'StrengthRX provides provider-led telehealth for TRT, hormone optimization, peptides, weight loss, and performance protocols with labs and monitoring.',
    )
  })

  it('canonicalizes the homepage to the configured www host', () => {
    expect(metadata.alternates?.canonical).toBe(businessConfig.urls.website)
  })
})
