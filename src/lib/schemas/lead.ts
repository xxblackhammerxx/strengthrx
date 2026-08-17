import { z } from 'zod'
import { LANDING_SLUGS } from '@/content/landing-pages'

/** Attribution travels as free-form strings; the server sanitizes lengths. */
const attributionValue = z.string().trim().max(300).optional()

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Enter a valid email address').max(200),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(25)
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a valid phone number'),
  state: z.string().trim().length(2, 'Select your state'),

  /** TCPA: must be explicitly checked, never pre-checked in the UI. */
  consentSms: z.literal(true, {
    errorMap: () => ({ message: 'Please agree to be contacted so we can reach you' }),
  }),

  landingPage: z.enum(LANDING_SLUGS as [string, ...string[]]),

  /**
   * Honeypot. Hidden from real users and never populated by them; automated
   * form-fillers fill every field they find. Named `website` because that is
   * what bots look for.
   */
  website: z.string().max(200).optional(),

  attribution: z
    .object({
      utm_source: attributionValue,
      utm_medium: attributionValue,
      utm_campaign: attributionValue,
      utm_content: attributionValue,
      utm_term: attributionValue,
      utm_id: attributionValue,
      fbclid: attributionValue,
      gclid: attributionValue,
      ad_id: attributionValue,
      adset_id: attributionValue,
      campaign_id: attributionValue,
      partner_id: attributionValue,
      entry_path: attributionValue,
      referrer: attributionValue,
      first_seen: attributionValue,
    })
    .optional()
    .default({}),

  /** Shared with the browser pixel copy for deduplication. */
  metaEventIds: z
    .object({ lead: z.string().max(100).optional() })
    .optional()
    .default({}),
})

export type LeadFormData = z.infer<typeof leadSchema>
