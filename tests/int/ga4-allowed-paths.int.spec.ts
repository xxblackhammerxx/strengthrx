import { describe, expect, it } from 'vitest'
import vm from 'node:vm'
import { ga4BootstrapScript, isGa4AllowedPath } from '@/lib/analytics/ga4'

const ALLOWED = ['/', '/book', '/book/', '/book/thanks', '/lp/energy', '/lp/energy/']
const BLOCKED = [
  '/get-started',
  '/get-started/',
  '/peptides',
  '/hormone-therapy',
  '/sexual-wellness',
  '/weight-loss',
  '/services',
  '/contact',
  '/about',
  '/login',
  '/signup/client',
  '/client-portal',
  '/partner-portal/marketing',
  '/admin-portal',
  '/booking',
  '/lp',
]

describe('Google Analytics page allow-list', () => {
  it('allows only the homepage and the ad landing pages', () => {
    for (const p of ALLOWED) expect(isGa4AllowedPath(p), p).toBe(true)
    for (const p of BLOCKED) expect(isGa4AllowedPath(p), p).toBe(false)
    expect(isGa4AllowedPath(null)).toBe(false)
  })

  it('the in-browser kill switch follows the current URL with the same list', () => {
    const window: Record<string, unknown> & { location: { pathname: string } } = {
      location: { pathname: '/' },
    }
    vm.runInNewContext(ga4BootstrapScript('G-TEST'), { window })

    for (const p of ALLOWED) {
      window.location.pathname = p
      expect(window['ga-disable-G-TEST'], p).toBe(false)
    }
    for (const p of BLOCKED) {
      window.location.pathname = p
      expect(window['ga-disable-G-TEST'], p).toBe(true)
    }
  })

  it('cannot be switched back on by assignment', () => {
    const window: Record<string, unknown> & { location: { pathname: string } } = {
      location: { pathname: '/get-started' },
    }
    vm.runInNewContext(ga4BootstrapScript('G-TEST'), { window })
    window['ga-disable-G-TEST'] = false
    expect(window['ga-disable-G-TEST']).toBe(true)
  })

  it('turns advertising features off', () => {
    const script = ga4BootstrapScript('G-TEST')
    expect(script).toContain('allow_google_signals:false')
    expect(script).toContain('allow_ad_personalization_signals:false')
  })
})
