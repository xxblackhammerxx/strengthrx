/**
 * The states StrengthRX is licensed to deliver prescription care in.
 *
 * THIS IS THE ONLY LIST. Before this file existed the codebase published four
 * different answers — /about said 8 states, /locations said 12, the FAQ said 8
 * in prose, /contact's dropdown offered its own 8, and the JSON-LD schema said
 * 12 — while the site meta description claimed all 50. A state board reads the
 * public site, not the source of truth we meant to have.
 *
 * Deliberately dependency-free so client components (/contact's dropdown), edge
 * code (lib/ghl/leads.ts's licensure gate) and ad landing pages can all import
 * it. lib/prescription-states.ts wraps this with the CMS-backed lookup for
 * server components; import from there when you need the CMS to be able to
 * override, and from here when you need a plain array.
 *
 * ── Changing this list ──────────────────────────────────────────────────────
 * Only add a state once the provider's active license for it has been verified
 * against the certificate. Advertising or accepting patients in a state the
 * prescriber is not licensed in is a board matter and a disclosure line does
 * not cure it. Adding a state here also requires a redeploy to reach the
 * landing pages, which render statically on purpose.
 */

export interface PrescriptionState {
  code: string
  name: string
  description: string
}

export const LICENSED_STATES: PrescriptionState[] = [
  { code: 'AZ', name: 'Arizona', description: 'Phoenix and statewide coverage' },
  { code: 'ID', name: 'Idaho', description: 'Boise and statewide coverage' },
  { code: 'WY', name: 'Wyoming', description: 'Cheyenne and statewide coverage' },
  { code: 'IA', name: 'Iowa', description: 'Des Moines and statewide coverage' },
  { code: 'UT', name: 'Utah', description: 'Salt Lake City and statewide coverage' },
  { code: 'NM', name: 'New Mexico', description: 'Albuquerque and statewide coverage' },
  { code: 'NV', name: 'Nevada', description: 'Las Vegas and statewide coverage' },
  { code: 'CO', name: 'Colorado', description: 'Denver and statewide coverage' },
]

export const LICENSED_STATE_CODES: string[] = LICENSED_STATES.map((s) => s.code)

/** True when prescription services may be offered to a resident of `code`. */
export function isLicensedState(code: string | null | undefined): boolean {
  return Boolean(code) && LICENSED_STATES.some((s) => s.code === code)
}

/** "AZ, ID, WY, IA, UT, NM, NV, CO" */
export function formatStateCodes(states: PrescriptionState[] = LICENSED_STATES): string {
  return states.map((s) => s.code).join(', ')
}

/** "Arizona, Idaho, Wyoming, Iowa, Utah, New Mexico, Nevada, and Colorado" */
export function formatStateNames(states: PrescriptionState[] = LICENSED_STATES): string {
  const names = states.map((s) => s.name)
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}
