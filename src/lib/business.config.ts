export const businessConfig = {
  name: 'StrengthRX',
  tagline: 'Optimize Your Health & Performance',

  phone: {
    display: '602-708-6487',
    href: 'tel:602-708-6487',
    international: '+1-602-708-6487',
  },

  email: {
    display: 'Yourstrengthrx@gmail.com',
    href: 'mailto:Yourstrengthrx@gmail.com',
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
