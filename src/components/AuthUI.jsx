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
          className="organic-outline-button !py-1 !px-3 !text-xs"
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
        className="organic-outline-button whitespace-nowrap"
        style={{ borderRadius: '30% 70% 70% 30% / 50% 40% 60% 50%' }}
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
          className="organic-outline-button !py-1 !px-3 !text-xs"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        className="text-sm px-3 py-1.5 rounded-full outline-none border min-w-0"
        style={{
          backgroundColor: 'var(--color-cream)',
          borderColor: 'var(--color-tan)',
          color: 'var(--color-charcoal)',
          width: '180px',
          maxWidth: '40vw',
        }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="organic-button !py-1.5 !px-4 !text-sm !font-bold"
        style={{
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? 'Sending...' : 'Send Link'}
      </button>
      <button
        type="button"
        onClick={() => { setExpanded(false); setEmail('') }}
        className="text-sm opacity-60 hover:opacity-100 cursor-pointer underline decoration-tan/50 underline-offset-4 hover:decoration-lavender transition-all"
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
