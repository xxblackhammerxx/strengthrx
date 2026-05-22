'use client'

import { useState } from 'react'
import styles from './styles.module.css'

export function PasswordGate() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/meal-planner/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Incorrect password.')
        setSubmitting(false)
        return
      }
      window.location.reload()
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.gateForm} onSubmit={handleSubmit}>
      <div className={styles.hero}>
        <h2>Protected Feature</h2>
        <p>Enter the access password to use the StrengthRx AI Meal Planner.</p>
      </div>
      <label htmlFor="meal-planner-password">Access Password</label>
      <input
        id="meal-planner-password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className={styles.gateError}>{error}</div>}
      <button
        type="submit"
        className={styles.generateBtn}
        disabled={submitting || !password}
        style={{ marginTop: '1rem' }}
      >
        {submitting ? (
          <>
            <span className={styles.spinner}></span>Unlocking…
          </>
        ) : (
          'Unlock'
        )}
      </button>
    </form>
  )
}
