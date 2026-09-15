import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  SMS_CONSENT_TEXT,
  SMS_CONSENT_LINKS,
  SMS_CONSENT_VERSION,
  BRAND_NAME,
} from '@/lib/consent'

/**
 * A2P 10DLC / TCPA guard rails.
 *
 * Carriers reject campaigns for a missing element and rarely say which one, so
 * each required element is asserted separately — a failure here names the thing
 * to fix. The consent *language* is only half of it; the other half is that the
 * site never records consent nobody gave, which is what the source-level checks
 * at the bottom are for.
 */

const root = join(__dirname, '../..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('SMS consent language', () => {
  it('names the brand doing the messaging', () => {
    expect(SMS_CONSENT_TEXT).toContain(BRAND_NAME)
  })

  it('describes what the messages are about', () => {
    expect(SMS_CONSENT_TEXT).toMatch(/appointment reminders|scheduling|follow-ups/i)
  })

  it('states message frequency', () => {
    expect(SMS_CONSENT_TEXT).toMatch(/message frequency varies/i)
  })

  it('states that rates may apply', () => {
    expect(SMS_CONSENT_TEXT).toMatch(/message and data rates may apply/i)
  })

  it('gives both STOP and HELP keywords', () => {
    expect(SMS_CONSENT_TEXT).toMatch(/\bSTOP\b/)
    expect(SMS_CONSENT_TEXT).toMatch(/\bHELP\b/)
  })

  it('states consent is not a condition of purchase', () => {
    expect(SMS_CONSENT_TEXT).toMatch(/not a condition of purchase/i)
  })

  it('links the two pages a carrier will open', () => {
    const hrefs = SMS_CONSENT_LINKS.map((link) => link.href)
    expect(hrefs).toContain('/privacy')
    expect(hrefs).toContain('/sms-terms')
  })

  it('carries a version so a stored record ties back to what was shown', () => {
    expect(SMS_CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('the pages a carrier verifies', () => {
  it('ships an SMS terms page', () => {
    const src = read('src/app/(frontend)/(marketing)/sms-terms/page.tsx')
    expect(src).toMatch(/\bSTOP\b/)
    expect(src).toMatch(/\bHELP\b/)
    expect(src).toMatch(/message frequency varies/i)
  })

  it('leaves the SMS terms page indexable', () => {
    const src = read('src/app/(frontend)/(marketing)/sms-terms/page.tsx')
    // /privacy and /terms are noindex on this site. This one must not be —
    // a carrier that cannot reach it during review rejects the campaign.
    expect(src).toMatch(/robots:\s*\{\s*index:\s*true/)
  })

  it('states in the privacy policy that mobile data is never shared for marketing', () => {
    const src = read('src/app/(frontend)/(marketing)/privacy/page.tsx')
    expect(src).toMatch(
      /do not share or sell mobile information[\s\S]{0,200}for marketing purposes/i,
    )
  })
})

describe('consent is never manufactured', () => {
  const routes = [
    'src/app/api/contact/route.ts',
    'src/app/api/onboarding/route.ts',
    'src/app/api/leads/route.ts',
  ]

  it('never derives SMS consent from the presence of a phone number', () => {
    for (const route of routes) {
      // `captureConsent(request, Boolean(phone))` marked every lead with a phone
      // number as opted in, on forms that never asked. That is a TCPA exposure
      // and grounds for a carrier to kill the 10DLC campaign.
      expect(read(route)).not.toMatch(/captureConsent\([^)]*Boolean\(\s*phone\s*\)/)
    }
  })

  it('takes consent from an explicit field on every capture point', () => {
    for (const route of routes) {
      expect(read(route)).toMatch(/captureConsent\(\s*request,\s*(smsConsent === true|true)\s*\)/)
    }
  })

  it('never pre-checks the box', () => {
    const consentComponent = read('src/components/forms/SmsConsent.tsx')
    expect(consentComponent).not.toMatch(/checked\s*=\s*\{?\s*true/)

    // Every form's consent state must start false.
    expect(read('src/components/landing/LeadForm.tsx')).toMatch(/useState\(false\)/)
    expect(read('src/app/(frontend)/(marketing)/contact/ContactPageClient.tsx')).toMatch(
      /const \[smsConsent, setSmsConsent\] = useState\(false\)/,
    )
    expect(read('src/components/onboarding/GetStartedForm.tsx')).toMatch(/smsConsent: false/)
  })

  it('renders the shared component rather than a retyped variation', () => {
    // Three forms drifting apart is how the language a carrier approved stops
    // matching the language a lead saw.
    for (const form of [
      'src/components/landing/LeadForm.tsx',
      'src/app/(frontend)/(marketing)/contact/ContactPageClient.tsx',
      'src/components/onboarding/StepContact.tsx',
    ]) {
      expect(read(form)).toContain('SmsConsent')
    }
  })
})

describe('the ad path does not require an account', () => {
  it('books the calendar inline instead of sending people to signup', () => {
    const leadForm = read('src/components/landing/LeadForm.tsx')
    expect(leadForm).toContain('InlineScheduler')
    expect(leadForm).not.toContain('/get-started')
  })

  it('offers no calendar to leads in states we are not licensed in', () => {
    const leadForm = read('src/components/landing/LeadForm.tsx')
    // The waitlist branch must return before the scheduler is reached.
    const waitlistIndex = leadForm.indexOf('result.waitlisted')
    const schedulerIndex = leadForm.indexOf('<InlineScheduler')
    expect(waitlistIndex).toBeGreaterThan(-1)
    expect(schedulerIndex).toBeGreaterThan(waitlistIndex)
  })
})
