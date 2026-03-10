'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Pencil, Check, X, Loader2 } from 'lucide-react'

interface ClientAccountData {
  firstName: string
  lastName: string
  email: string
  memberSince: string
}

export default function ClientAccountContent({ data }: { data: ClientAccountData }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState(data.firstName)
  const [lastName, setLastName] = useState(data.lastName)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Failed to update')
      }

      setEditing(false)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setEditing(false)
    setError(null)
  }

  return (
    <Container className="py-12">
      <Heading as="h1" className="mb-8 text-white">
        Account
      </Heading>
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              Profile updated successfully.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-neutral-500">First Name</p>
              {editing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-white outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20"
                />
              ) : (
                <p className="text-white">{firstName}</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-sm text-neutral-500">Last Name</p>
              {editing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-white outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20"
                />
              ) : (
                <p className="text-white">{lastName}</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-sm text-neutral-500">Email</p>
              <p className="text-white">{data.email}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-neutral-500">Member Since</p>
              <p className="text-white">
                {new Date(data.memberSince).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
