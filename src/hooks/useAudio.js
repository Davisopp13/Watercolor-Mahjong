import { useRef, useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'watercolor-mahjong-muted'

function getStoredMute() {
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    // Default to muted on first visit
    return val === null ? true : val === 'true'
  } catch {
    return true
  }
}

// Preload an audio file. Returns the Audio element or null if loading fails.
function preloadAudio(src) {
  try {
    const audio = new Audio(src)
    audio.preload = 'auto'
    // Start loading
    audio.load()
    return audio
  } catch (e) {
    console.warn(`Audio file not found or failed to load: ${src}. Game will run without sound.`)
    return null
  }
}

// Play a sound effect (fire-and-forget, allows overlapping playback)
function playSfx(audio, volume = 0.5) {
  if (!audio) return
  try {
    // Clone the audio node so overlapping plays are possible
    const clone = audio.cloneNode()
    clone.volume = volume
    clone.play().catch(() => {
      // Silently ignore play failures (e.g. before user interaction on iOS)
    })
  } catch {
    // Fail silently
  }
}

export default function useAudio() {
  const [muted, setMuted] = useState(getStoredMute)
  const bgMusicRef = useRef(null)
  const audioLoadedRef = useRef(false)
  const sfxRef = useRef({
    select: null,
    match: null,
    mismatch: null,
    win: null,
  })

  // Preload all audio files on mount
  useEffect(() => {
    const bg = preloadAudio('/audio/background.mp3')
    if (bg) {
      bg.loop = true
      bg.volume = 0.3
      // Listen for error to detect missing files
      bg.addEventListener('error', () => {
        console.warn('Audio files not found in public/audio/. Game will run without sound.')
        bgMusicRef.current = null
        audioLoadedRef.current = false
      })
    }
    bgMusicRef.current = bg

    sfxRef.current.select = preloadAudio('/audio/select.mp3')
    sfxRef.current.match = preloadAudio('/audio/match.mp3')
    sfxRef.current.mismatch = preloadAudio('/audio/mismatch.mp3')
    sfxRef.current.win = preloadAudio('/audio/win.mp3')

    audioLoadedRef.current = true

    return () => {
      // Cleanup: pause background music on unmount
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
    }
  }, [])

  // Start/stop background music based on mute state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(muted))
    } catch { /* ignore */ }

    const bg = bgMusicRef.current
    if (!bg) return

    if (!muted) {
      bg.play().catch(() => {
        // iOS Safari: play will fail until user interacts — that's OK
      })
    } else {
      bg.pause()
    }
  }, [muted])

  const toggleMute = useCallback(() => {
    setMuted(m => !m)
  }, [])

  const playSelect = useCallback(() => {
    if (muted) return
    playSfx(sfxRef.current.select, 0.5)
  }, [muted])

  const playMatchSound = useCallback(() => {
    if (muted) return
    playSfx(sfxRef.current.match, 0.5)
  }, [muted])

  const playMismatchSound = useCallback(() => {
    if (muted) return
    playSfx(sfxRef.current.mismatch, 0.5)
  }, [muted])

  const playWinSound = useCallback(() => {
    if (muted) return
    // Fade out background music over ~1 second, then play win
    const bg = bgMusicRef.current
    if (bg && !bg.paused) {
      const fadeInterval = setInterval(() => {
        if (bg.volume > 0.05) {
          bg.volume = Math.max(0, bg.volume - 0.03)
        } else {
          clearInterval(fadeInterval)
          bg.pause()
          bg.volume = 0.3 // Reset for next time
        }
      }, 100) // 10 steps over ~1 second
    }
    playSfx(sfxRef.current.win, 0.6)
  }, [muted])

  return {
    muted,
    toggleMute,
    playSelect,
    playMatchSound,
    playMismatchSound,
    playWinSound,
  }
}
