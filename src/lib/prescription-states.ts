import config from '@payload-config'
import { getPayload } from 'payload'

export interface PrescriptionState {
  code: string
  name: string
  description: string
}

// Default states used as fallback if the CMS has no data yet
const defaultStates: PrescriptionState[] = [
  { code: 'AZ', name: 'Arizona', description: 'Phoenix and statewide coverage' },
  { code: 'ID', name: 'Idaho', description: 'Boise and statewide coverage' },
  { code: 'WY', name: 'Wyoming', description: 'Cheyenne and statewide coverage' },
  { code: 'IA', name: 'Iowa', description: 'Des Moines and statewide coverage' },
  { code: 'UT', name: 'Utah', description: 'Salt Lake City and statewide coverage' },
  { code: 'NM', name: 'New Mexico', description: 'Albuquerque and statewide coverage' },
  { code: 'NV', name: 'Nevada', description: 'Las Vegas and statewide coverage' },
  { code: 'CO', name: 'Colorado', description: 'Denver and statewide coverage' },
  { code: 'WA', name: 'Washington', description: 'Seattle and statewide coverage' },
  { code: 'VA', name: 'Virginia', description: 'Richmond and statewide coverage' },
  { code: 'NE', name: 'Nebraska', description: 'Omaha and statewide coverage' },
  { code: 'FL', name: 'Florida', description: 'Miami and statewide coverage' },
]

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

    return defaultStates
  } catch {
    return defaultStates
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
