import { describe, expect, it } from 'vitest'
import { businessConfig } from '@/lib/business.config'
import { metadata } from '@/app/(frontend)/page'

describe('homepage metadata', () => {
  it('defines a unique crawlable homepage title and description', () => {
    expect(metadata.title).toBe('Physician-Focused Financial Education & Coaching | StrengthRX')
    expect(metadata.description).toBe(
      'StrengthRX provides physician-focused financial education, trusted connections, guided accountability coaching, and community support.',
    )
  })

  it('canonicalizes the homepage to the configured www host', () => {
    expect(metadata.alternates?.canonical).toBe(businessConfig.urls.website)
  })
})
