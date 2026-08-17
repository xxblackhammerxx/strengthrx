/**
 * Single source of truth for the dollar value attached to Meta events.
 *
 * WHY EXPECTED VALUE, NOT LIST PRICE
 * ----------------------------------
 * It is tempting to stamp a Lead with the full membership LTV. Don't. Meta
 * treats `value` as ground truth for ROAS bidding and reporting, so inflated
 * upper-funnel values teach the algorithm that cheap, low-intent leads are
 * worth as much as paying members — and your reported ROAS becomes fiction.
 *
 * Instead every event carries LTV multiplied by the cumulative probability of
 * reaching a paid membership from that step. A Lead worth $315 and a booked
 * consult worth $772 correctly tells Meta a booking is ~2.5x more valuable.
 *
 * TUNING THIS FILE
 * ----------------
 * The conversion rates below are documented STARTING ASSUMPTIONS, not measured
 * figures. Replace them with real numbers from the Referrals pipeline
 * (lead_created -> consult_booked -> qualified -> converted) as soon as you
 * have a meaningful sample. Everything downstream recomputes automatically.
 */

import { MetaEvent, type MetaEventName } from './events'

export const CURRENCY = 'USD'

export const PRICING = {
  /** All-inclusive membership, billed monthly. */
  membershipMonthly: 350,
  /** Standalone comprehensive panel, no membership required. */
  labPanel: 89,
} as const

/**
 * ASSUMPTION — average months a member stays before churning.
 * Replace with actual retention once you have cohort data. TRT/telehealth
 * programs commonly land between 8 and 14 months.
 */
export const AVG_MEMBERSHIP_MONTHS = 9

/**
 * ASSUMPTION — set to a gross-margin fraction (e.g. 0.55) if you would rather
 * bid on contribution margin than top-line revenue. Meta's ROAS column assumes
 * revenue, so 1 keeps reporting conventional.
 */
export const MARGIN_MULTIPLIER = 1

/** Lifetime value of one converted member. */
export const MEMBER_LTV = Math.round(
  PRICING.membershipMonthly * AVG_MEMBERSHIP_MONTHS * MARGIN_MULTIPLIER,
)

/**
 * ASSUMPTIONS — step-to-step conversion rates through the funnel.
 * These are the three numbers worth measuring first; they move every value
 * in the table below.
 */
export const FUNNEL_RATES = {
  /** Contact-form inquiry -> books a consultation. */
  inquiryToBooking: 0.4,
  /** Books a consultation -> actually shows up. */
  bookingToShow: 0.7,
  /** Attends the consultation -> starts a membership. */
  consultToMember: 0.35,
  /** Creates an account in Get Started -> starts a membership. Higher than a
   *  contact-form inquiry: they chose a password and completed four steps. */
  registrationToMember: 0.3,
} as const

/** Probability a booked consultation ends in a membership. */
const BOOKING_TO_MEMBER = FUNNEL_RATES.bookingToShow * FUNNEL_RATES.consultToMember

/** Probability a raw inquiry ends in a membership. */
const INQUIRY_TO_MEMBER = FUNNEL_RATES.inquiryToBooking * BOOKING_TO_MEMBER

const expected = (probability: number) => Math.round(MEMBER_LTV * probability)

/**
 * Canonical value per event, in USD.
 *
 * `null` means the event is sent with no value at all. ViewContent is
 * deliberately valueless — attaching money to a page view invites Meta to
 * optimize toward cheap traffic that never converts.
 */
export const EVENT_VALUE: Record<MetaEventName, number | null> = {
  [MetaEvent.ViewContent]: null,

  /** A qualified inquiry from any source. */
  [MetaEvent.Lead]: expected(INQUIRY_TO_MEMBER),

  /** Contact form specifically — same funnel position as a generic lead. */
  [MetaEvent.Contact]: expected(INQUIRY_TO_MEMBER),

  /** Consultation on the calendar: the single strongest pre-revenue signal. */
  [MetaEvent.Schedule]: expected(BOOKING_TO_MEMBER),

  /** Account created through Get Started. */
  [MetaEvent.CompleteRegistration]: expected(FUNNEL_RATES.registrationToMember),

  /** Real money: the first membership payment. Pair with predicted_ltv. */
  [MetaEvent.Subscribe]: PRICING.membershipMonthly,

  /** Real money: a standalone lab panel. */
  [MetaEvent.Purchase]: PRICING.labPanel,
}

/**
 * Builds the value fields for an event.
 *
 * Always call this on the server for the CAPI copy and on the client for the
 * pixel copy — both halves of a deduplicated pair must carry identical values
 * or Meta may keep the wrong one.
 */
export function valueParams(eventName: MetaEventName): Record<string, unknown> {
  const value = EVENT_VALUE[eventName]
  if (value == null) return {}
  return { value, currency: CURRENCY }
}

/**
 * Value fields for a started membership, including predicted lifetime value.
 * Call from the billing webhook once payments are collected on-site.
 */
export function membershipValueParams(monthlyPrice = PRICING.membershipMonthly) {
  return {
    value: monthlyPrice,
    currency: CURRENCY,
    predicted_ltv: Math.round(monthlyPrice * AVG_MEMBERSHIP_MONTHS * MARGIN_MULTIPLIER),
  }
}
