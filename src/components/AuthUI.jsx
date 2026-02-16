import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AuthUI({ user, loading, error, magicLinkSent, onSignIn, onSignOut }) {
  const [expanded, setExpanded] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!supabase || loading) return null

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-charcoal)' }}>
        <span className="opacity-70 truncate max-w-[160px]">{user.email}</span>
        <button
          onClick={onSignOut}
          className="underline opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ color: 'var(--color-lavender)' }}
        >
          Sign Out
        </button>
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-sm underline opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        style={{ color: 'var(--color-lavender)' }}
      >
        Sign In to Save
      </button>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    await onSignIn(email.trim())
    setSubmitting(false)
  }

  if (magicLinkSent) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-charcoal)' }}>
        <span style={{ color: 'var(--color-green)' }}>Check your email for the magic link!</span>
        <button
          onClick={() => { setExpanded(false); setEmail('') }}
          className="underline opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ color: 'var(--color-lavender)' }}
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        className="text-sm px-3 py-1.5 rounded-full outline-none border"
        style={{
          backgroundColor: 'var(--color-cream)',
          borderColor: 'var(--color-tan)',
          color: 'var(--color-charcoal)',
          width: '180px',
        }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="text-sm px-3 py-1.5 rounded-full cursor-pointer transition-opacity"
        style={{
          backgroundColor: 'var(--color-lavender)',
          color: 'white',
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? 'Sending...' : 'Send Link'}
      </button>
      <button
        type="button"
        onClick={() => { setExpanded(false); setEmail('') }}
        className="text-sm opacity-50 hover:opacity-100 cursor-pointer"
        style={{ color: 'var(--color-charcoal)' }}
      >
        Cancel
      </button>
      {error && (
        <span className="text-sm" style={{ color: 'var(--color-rose)' }}>{error}</span>
      )}
    </form>
  )
}
