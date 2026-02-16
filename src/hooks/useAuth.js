import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!supabase)
  const [error, setError] = useState(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setMagicLinkSent(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithMagicLink = useCallback(async (email) => {
    if (!supabase) return
    setError(null)
    setMagicLinkSent(false)
    const { error: err } = await supabase.auth.signInWithOtp({ email })
    if (err) {
      setError(err.message)
    } else {
      setMagicLinkSent(true)
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setMagicLinkSent(false)
    setError(null)
  }, [])

  return { user, loading, error, magicLinkSent, signInWithMagicLink, signOut }
}
