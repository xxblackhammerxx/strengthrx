import config from '@payload-config'
import { getPayload } from 'payload'
import { LICENSED_STATES, type PrescriptionState } from '@/lib/licensed-states'

export type { PrescriptionState }

/**
 * Fallback when the CMS has no data yet.
 *
 * The ad landing pages render this directly rather than awaiting the CMS: a
 * paid-traffic destination that 500s while spend keeps flowing is far more
 * expensive than a stale dropdown.
 *
 * The list itself lives in lib/licensed-states.ts — edit it there, not here,
 * and read the warning in that file before adding a state.
 */
export const DEFAULT_PRESCRIPTION_STATES: PrescriptionState[] = LICENSED_STATES

export async function getPrescriptionStates(): Promise<PrescriptionState[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'prescription-states' })

    if (data?.states && data.states.length > 0) {
      return data.states.map((s: { code: string; name: string; description: string }) => ({
        code: s.code,
        name: s.name,
        description: s.description,
      }))
    }

    return DEFAULT_PRESCRIPTION_STATES
  } catch {
    return DEFAULT_PRESCRIPTION_STATES
  }
}

/** Returns just the state codes, e.g. ['AZ', 'ID', ...] */
export async function getPrescriptionStateCodes(): Promise<string[]> {
  const states = await getPrescriptionStates()
  return states.map((s) => s.code)
}

/** Returns a formatted string like "AZ, ID, WY, IA, UT, NM, NV, CO, WA, VA, NE, FL" */
export async function getPrescriptionStatesList(): Promise<string> {
  const codes = await getPrescriptionStateCodes()
  return codes.join(', ')
}
