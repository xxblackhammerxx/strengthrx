import { describe, it, expect } from 'vitest'
import {
  mergeAttribution,
  parseAttributionCookie,
  readAttributionParams,
} from '@/lib/attribution'

describe('attribution capture', () => {
  it('reads every UTM, click ID and partner code off the query string', () => {
    const params = new URLSearchParams(
      'utm_source=facebook&utm_medium=paid&utm_campaign=tof-symptoms-first-aug26' +
        '&utm_content=symptoms-first&utm_term=x&fbclid=IwAR-abc&ad_id=123&ref=KENDON10',
    )

    expect(readAttributionParams(params)).toEqual({
      utm_source: 'facebook',
      utm_medium: 'paid',
      utm_campaign: 'tof-symptoms-first-aug26',
      // Carries the creative angle — this is what makes CAC-per-angle work.
      utm_content: 'symptoms-first',
      utm_term: 'x',
      fbclid: 'IwAR-abc',
      ad_id: '123',
      partner_id: 'KENDON10',
    })
  })

  it('ignores params that are not attribution', () => {
    const params = new URLSearchParams('foo=bar&utm_source=google')
    expect(readAttributionParams(params)).toEqual({ utm_source: 'google' })
  })

  it('lets a newer campaign click take credit', () => {
    const existing = { utm_source: 'facebook', utm_campaign: 'old', first_seen: '2026-01-01' }
    const incoming = { utm_source: 'google', utm_campaign: 'new' }

    const merged = mergeAttribution(existing, incoming)
    expect(merged.utm_source).toBe('google')
    expect(merged.utm_campaign).toBe('new')
    // First-touch metadata survives.
    expect(merged.first_seen).toBe('2026-01-01')
  })

  it('does not wipe attribution on an ordinary internal navigation', () => {
    const existing = { utm_source: 'facebook', utm_campaign: 'aug26', fbclid: 'IwAR-abc' }
    const merged = mergeAttribution(existing, { entry_path: '/book' })

    expect(merged.utm_source).toBe('facebook')
    expect(merged.utm_campaign).toBe('aug26')
    expect(merged.fbclid).toBe('IwAR-abc')
  })

  it('never lets a retargeting click steal a partner commission', () => {
    const existing = { partner_id: 'KENDON10', utm_source: 'partner' }
    const merged = mergeAttribution(existing, { utm_source: 'facebook', partner_id: 'OTHER' })

    expect(merged.partner_id).toBe('KENDON10')
    expect(merged.utm_source).toBe('facebook')
  })

  it('keeps the original entry path across sessions', () => {
    const merged = mergeAttribution(
      { entry_path: '/lp/mens-performance' },
      { entry_path: '/book', utm_source: 'facebook' },
    )
    expect(merged.entry_path).toBe('/lp/mens-performance')
  })

  it('survives a corrupted cookie without throwing', () => {
    expect(parseAttributionCookie('not-json')).toEqual({})
    expect(parseAttributionCookie(undefined)).toEqual({})
    expect(parseAttributionCookie('"a string"')).toEqual({})
  })

  it('round-trips a real cookie value', () => {
    const attribution = { utm_source: 'facebook', partner_id: 'KENDON10' }
    const encoded = encodeURIComponent(JSON.stringify(attribution))
    expect(parseAttributionCookie(encoded)).toEqual(attribution)
  })

  it('truncates absurdly long values', () => {
    const params = new URLSearchParams(`utm_campaign=${'x'.repeat(5000)}`)
    expect(readAttributionParams(params).utm_campaign!.length).toBe(300)
  })
})
