export const businessConfig = {
  name: 'StrengthRX',
  tagline: 'Optimize Your Health & Performance',

  phone: {
    display: '657-338-6004',
    href: 'tel:657-338-6004',
    international: '+1-657-338-6004',
  },

  email: {
    display: 'info@yourstrengthrx.com',
    href: 'mailto:info@yourstrengthrx.com',
  },

  location: {
    city: 'Phoenix',
    state: 'Arizona',
    display: 'Phoenix, Arizona',
  },

  /**
   * HIPAA requires a designated Privacy Officer (45 CFR 164.530(a)(1)), and the
   * Notice of Privacy Practices has to name a contact for rights requests and
   * complaints. Rendered on /notice-of-privacy-practices.
   *
   * The general inbox is deliberate for now, not an oversight. A records-access
   * request carries a 30-day clock, so whoever works this mailbox has to be able
   * to recognize one and route it to Bobby. Move to a dedicated address if that
   * stops being reliable.
   */
  privacyOfficer: {
    name: 'Bobby Wolfe',
    email: 'info@yourstrengthrx.com',
    href: 'mailto:info@yourstrengthrx.com',
  },

  social: {
    instagram: '',
    facebook: '',
    twitter: '',
  },

  urls: {
    website: 'https://www.yourstrengthrx.com',
    /**
     * Kendon Hatch's Google appointment schedule. The `gv=true` flag is what
     * makes it embeddable rather than a standalone booking page.
     *
     * Interim only: /book prefers the GoHighLevel calendar whenever
     * NEXT_PUBLIC_GHL_CALENDAR_ID is set. Google has no completion redirect,
     * so bookings made here cannot fire a Schedule conversion.
     */
    booking:
      'https://calendar.google.com/calendar/appointments/schedules/AcZssZ27vS2exHF_EnBY-IPJQSiN8q6f24Pl_yBYZGjGg986c7mNX1qV0N60TLYNJndsclHEDKq_Rzvw?gv=true',
  },
} as const

export type BusinessConfig = typeof businessConfig
