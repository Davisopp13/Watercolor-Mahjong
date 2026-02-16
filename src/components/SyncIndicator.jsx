import React, { useState, useEffect } from 'react'

export default function SyncIndicator({ syncStatus, user }) {
  const [visible, setVisible] = useState(false)
  const [displayStatus, setDisplayStatus] = useState(syncStatus)

  useEffect(() => {
    if (!user) return
    if (syncStatus === 'idle') return

    setDisplayStatus(syncStatus)
    setVisible(true)

    if (syncStatus === 'saved' || syncStatus === 'error') {
      const timer = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [syncStatus, user])

  if (!user || !visible) return null

  const labels = {
    saving: 'Saving...',
    saved: 'Saved',
    loading: 'Loading...',
    error: 'Offline',
  }

  const colors = {
    saving: 'var(--color-lavender)',
    saved: 'var(--color-green)',
    loading: 'var(--color-lavender)',
    error: 'var(--color-rose)',
  }

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full transition-opacity duration-300"
      style={{
        color: colors[displayStatus],
        backgroundColor: `color-mix(in srgb, ${colors[displayStatus]} 12%, transparent)`,
        opacity: visible ? 1 : 0,
      }}
    >
      {labels[displayStatus]}
    </span>
  )
}
