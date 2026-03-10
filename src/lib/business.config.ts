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

  social: {
    instagram: '',
    facebook: '',
    twitter: '',
  },

  urls: {
    website: 'https://www.yourstrengthrx.com',
    booking:
      'https://calendar.google.com/calendar/appointments/schedules/AcZssZ27vS2exHF_EnBY-IPJQSiN8q6f24Pl_yBYZGjGg986c7mNX1qV0N60TLYNJndsclHEDKq_Rzvw?gv=true',
  },
} as const

export type BusinessConfig = typeof businessConfig
