export interface Testimonial {
  id: string
  name: string
  initials: string
  location?: string
  quote: string
  rating?: number
}

export const testimonials: Testimonial[] = [
  {
    id: 'john-m',
    name: 'John M.',
    initials: 'JM',
    location: 'Phoenix, AZ',
    quote:
      "After 3 months with StrengthRX, my energy levels are through the roof. I feel like I'm in my 20s again. The telehealth approach made everything so convenient.",
    rating: 5,
  },
  {
    id: 'sarah-k',
    name: 'Sarah K.',
    initials: 'SK',
    location: 'Denver, CO',
    quote:
      "The peptide therapy has completely transformed my recovery time. I'm seeing gains in the gym I haven't experienced in years. Professional team, excellent results.",
    rating: 5,
  },
  {
    id: 'mike-r',
    name: 'Mike R.',
    initials: 'MR',
    location: 'Salt Lake City, UT',
    quote:
      'StrengthRX took a comprehensive approach to my health. The regular monitoring and adjustments have been key to my success. Highly recommend their services.',
    rating: 5,
  },
  {
    id: 'david-l',
    name: 'David L.',
    initials: 'DL',
    location: 'Boise, ID',
    quote:
      "Lost 30 pounds with their weight loss program. The GLP-1 medications combined with their guidance made it sustainable. Best investment I've made in my health.",
    rating: 5,
  },
  {
    id: 'chris-w',
    name: 'Chris W.',
    initials: 'CW',
    location: 'Las Vegas, NV',
    quote:
      'The convenience of telehealth combined with their expertise is unmatched. My sleep, mood, and performance have all dramatically improved.',
    rating: 5,
  },
  {
    id: 'robert-j',
    name: 'Robert J.',
    initials: 'RJ',
    location: 'Albuquerque, NM',
    quote:
      'Finally found a team that understands optimization, not just treatment. The detailed lab work and personalized protocols set them apart.',
    rating: 5,
  },
]
