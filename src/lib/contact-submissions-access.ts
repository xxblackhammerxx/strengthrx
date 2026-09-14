type PayloadUserRecord = Record<string, unknown>

function isRecord(value: unknown): value is PayloadUserRecord {
  return typeof value === 'object' && value !== null
}

/**
 * Contact submissions contain lead PII. Only Payload admin users and the
 * site admin/staff portal roles may list or manage stored submissions.
 */
export function canManageContactSubmissions(user: unknown): boolean {
  if (!isRecord(user)) return false

  if (user.collection === 'users') return true

  if (user.collection === 'admins') {
    return user.role === 'owner' || user.role === 'staff'
  }

  return false
}
