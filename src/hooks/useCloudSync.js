import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export default function useCloudSync(user) {
  const [syncStatus, setSyncStatus] = useState('idle')

  const saveGame = useCallback(async (tiles) => {
    if (!supabase || !user) return
    setSyncStatus('saving')
    try {
      const stripped = tiles.map(({ id, suit, value, copy, removed }) => ({
        id, suit, value, copy, removed,
      }))
      const { error } = await supabase
        .from('game_saves')
        .upsert(
          { user_id: user.id, tiles: stripped, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      setSyncStatus(error ? 'error' : 'saved')
    } catch {
      setSyncStatus('error')
    }
  }, [user])

  const loadGame = useCallback(async () => {
    if (!supabase || !user) return null
    setSyncStatus('loading')
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('tiles')
        .eq('user_id', user.id)
        .maybeSingle()
      setSyncStatus(error ? 'error' : 'idle')
      return data?.tiles ?? null
    } catch {
      setSyncStatus('error')
      return null
    }
  }, [user])

  return { saveGame, loadGame, syncStatus }
}
