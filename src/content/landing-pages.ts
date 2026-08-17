/**
 * Ad-destination landing pages.
 *
 * Copy here is constrained by the ad-path compliance vocabulary in
 * `src/lib/compliance.ts` and is verified by
 * `tests/int/landing-compliance.int.spec.ts`. Before editing, read the
 * approved-framing list — a single banned term on one of these pages puts the
 * Meta ad account at risk.
 *
 * Angles are written in first person on purpose. Meta's health rules prohibit
 * copy that implies knowledge about the viewer, so "I assumed this was just
 * what my forties felt like" is compliant where "Feeling run down?" is not.
 */

/**
 * A vertical (9:16) video creative shown on a landing page.
 *
 * `caption` is visible copy and is scanned by the compliance test like
 * anything else, so it must avoid banned vocabulary and viewer-attribute
 * callouts. The burned-in captions inside the video itself are NOT scannable —
 * review those by eye before adding a creative here.
 */
export type LandingVideo = {
  src: string
  poster: string
  title: string
  duration: string
  caption: string
}

export type LandingPage = {
  slug: string
  /** Value of the `assessment_type` custom field in GHL. */
  assessmentType: "Men's Performance" | "Women's Metabolic Reset" | 'Plateau Breaker'
  metaTitle: string
  metaDescription: string
  eyebrow: string
  headline: string
  subhead: string
  /** First-person narrative lead-in. */
  story: string
  bullets: string[]
  ctaLabel: string
  /** Reassurance shown under the form. */
  formFootnote: string
  /** Optional vertical creative. Omit and no player renders. */
  video?: LandingVideo
}

/**
 * MOF3 "convenience" from the 2026-07-10 Meta slate — Bobby walking through how
 * getting started works. Chosen for the landing page because it maps onto the
 * bullets almost line for line and needs no testimonial release.
 *
 * DELIBERATELY NOT ON THE WOMEN'S PAGE. The script closes with "feel like the
 * man you need to become". It is a male-audience creative and would land badly
 * on the metabolic reset page.
 *
 * Captions were reviewed frame by frame: no banned vocabulary, and Bobby is
 * credited on screen as "Nurse Practitioner", never as a physician.
 */
const CONVENIENCE_VIDEO: LandingVideo = {
  src: '/video/mof3-convenience.mp4',
  poster: '/video/mof3-convenience-poster.webp',
  title: 'How getting started actually works',
  duration: '33 sec',
  caption: 'Bobby Wolfe, FNP — how the first few weeks work.',
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: 'mens-performance',
    assessmentType: "Men's Performance",
    metaTitle: "Men's Performance Assessment",
    metaDescription:
      'A clinician-led performance assessment for men. Lab-based care, provider-led, built around your numbers.',
    eyebrow: 'Free Performance Assessment',
    headline: 'Your numbers tell a story your energy already told you.',
    subhead:
      'A 30-minute clinician-led assessment. We look at the data, explain what it means, and lay out your options. No pressure, no commitment.',
    story:
      'For two years I assumed the afternoon crash was just what my forties were supposed to feel like. Work was busy. Sleep was short. Everybody said the same thing. It took one round of lab work to find out how much of that I had simply accepted.',
    bullets: [
      'Licensed provider, fully telehealth — no waiting rooms',
      'Comprehensive lab panel so decisions come from data, not opinions',
      'A clinician walks you through every marker in plain language',
      'Everything shipped directly to your door',
    ],
    ctaLabel: 'Book my assessment',
    formFootnote:
      'Pick your time on the next screen — nothing else to fill out.',
    video: CONVENIENCE_VIDEO,
  },
  {
    slug: 'womens-metabolic-reset',
    assessmentType: "Women's Metabolic Reset",
    metaTitle: "Women's Metabolic Reset Assessment",
    metaDescription:
      'A clinician-led metabolic assessment for women. Lab-based care, provider-led, personalized to your numbers.',
    eyebrow: 'Free Metabolic Assessment',
    headline: 'Doing everything right and the scale still will not move.',
    subhead:
      'A 30-minute clinician-led assessment. We start with comprehensive labs, then build a plan around what your body is actually doing.',
    story:
      'I was training five days a week and tracking every meal. My doctor told me my labs were normal and that I should be patient. A full metabolic panel and an hour with a clinician gave me the first real explanation I had heard in three years.',
    bullets: [
      'Comprehensive metabolic and thyroid marker panel',
      'Provider-led and fully telehealth',
      'Nutrition and supplement guidance built around your results',
      'Monthly clinician check-ins, everything shipped to your door',
    ],
    ctaLabel: 'Book my assessment',
    formFootnote:
      'Pick your time on the next screen — nothing else to fill out.',
  },
  {
    slug: 'plateau-breaker',
    assessmentType: 'Plateau Breaker',
    metaTitle: 'Plateau Breaker Assessment',
    metaDescription:
      'A clinician-led assessment for athletes stuck at a plateau. Lab-based care, provider-led, evidence-backed.',
    eyebrow: 'Free Performance Assessment',
    headline: 'The training is not the problem anymore.',
    subhead:
      'A 30-minute clinician-led assessment for people already doing the work. We find the ceiling in your bloodwork, not in your program.',
    story:
      'I added volume. I deloaded. I fixed my sleep and cleaned up my nutrition. Same numbers for eleven months. The thing that finally moved was something I could not have found without a full panel and someone qualified to read it.',
    bullets: [
      'Full performance and recovery marker panel',
      'Clinician-led review of what is actually limiting output',
      'Evidence-backed protocols, provider-led',
      'Quarterly labs so progress is measured, not assumed',
    ],
    ctaLabel: 'Book my assessment',
    formFootnote:
      'Pick your time on the next screen — nothing else to fill out.',
    video: CONVENIENCE_VIDEO,
  },
  {
    /**
     * The general-audience destination, and the replacement for `/get-started`
     * in paid campaigns.
     *
     * `/get-started` is a four-step account signup ending in a password. That is
     * the right flow for someone who has already decided; as an ad destination it
     * asks for commitment before a first conversation and buries the calendar
     * behind it. This page captures the lead and hands them straight to Kendon's
     * calendar instead.
     */
    slug: 'free-consultation',
    assessmentType: "Men's Performance",
    metaTitle: 'Book a Free Consultation',
    metaDescription:
      'A free 30-minute clinician-led consultation. Lab-based care, provider-led, fully telehealth.',
    eyebrow: 'Free 30-Minute Consultation',
    headline: 'Start with a conversation, not a commitment.',
    subhead:
      'Thirty minutes with a clinician to talk through your goals, what the labs would look at, and what the options are. No account to create, no card, no obligation.',
    story:
      'I put it off for most of a year because I assumed the first step would be complicated. It was a half-hour call. I asked every question I had been sitting on, and I left knowing what I actually wanted to do next.',
    bullets: [
      'Thirty minutes with a clinician — book it in the next two clicks',
      'Provider-led and fully telehealth, no waiting rooms',
      'Comprehensive labs so decisions come from data, not opinions',
      'Everything shipped directly to your door',
    ],
    ctaLabel: 'See available times',
    formFootnote: 'Pick your time on the next screen — nothing else to fill out.',
    video: CONVENIENCE_VIDEO,
  },
]

export const getLandingPage = (slug: string) => LANDING_PAGES.find((page) => page.slug === slug)

export const LANDING_SLUGS = LANDING_PAGES.map((page) => page.slug)
