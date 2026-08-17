/**
 * A2P 10DLC / TCPA consent language.
 *
 * One source of truth. Every form that collects a phone number renders exactly
 * this text, so what a carrier reviews during campaign registration is what a
 * lead actually saw — and so a change to the wording cannot land on one form and
 * miss another.
 *
 * Carriers reject 10DLC campaigns for missing any of these elements, and the
 * rejection reason is rarely specific. All seven are present deliberately:
 *
 *   1. The brand name sending the messages
 *   2. What the messages are about
 *   3. Message frequency
 *   4. "Message and data rates may apply"
 *   5. STOP to opt out, HELP for help
 *   6. Links to the Privacy Policy and the messaging terms
 *   7. Consent is not a condition of purchase
 *
 * Two rules that are not about wording, and matter just as much:
 *
 *   - The checkbox is never pre-checked, and submitting the form is not itself
 *     consent. Opt-in has to be an affirmative act.
 *   - The privacy policy has to state that mobile opt-in data is never shared or
 *     sold. Carriers check the linked page, not just the form.
 */

/**
 * Bump when the wording changes so a stored record can be tied back to what was
 * actually displayed. Carriers and plaintiffs both ask "what did they agree to",
 * and "the current version of the site" is not an answer.
 */
export const SMS_CONSENT_VERSION = '2026-08-07'

export const BRAND_NAME = 'StrengthRX'

/**
 * The opt-in sentence, verbatim.
 *
 * Kept as plain text as well as JSX so it can be logged, stored against the
 * lead record, and submitted to a carrier during campaign registration without
 * anyone transcribing it by hand.
 */
export const SMS_CONSENT_TEXT =
  `I agree to receive text messages from ${BRAND_NAME} at the number provided, ` +
  'including appointment reminders, scheduling help and follow-ups about my consultation. ' +
  'Message frequency varies. Message and data rates may apply. ' +
  'Reply STOP to opt out or HELP for help. ' +
  'Consent is not a condition of purchase.'

/** Shown under the checkbox, linking the pages carriers verify. */
export const SMS_CONSENT_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Messaging Terms', href: '/sms-terms' },
] as const

/**
 * Shown where a form collects a phone number but does NOT ask for messaging
 * consent — currently nowhere, kept so a future form cannot quietly imply
 * consent by omission.
 */
export const PHONE_ONLY_NOTICE =
  `${BRAND_NAME} will use this number to contact you about your inquiry. ` +
  'We will not send you text messages unless you opt in.'
