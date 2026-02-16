import { useRef, useCallback, useEffect, useState } from 'react'

// All sounds synthesized with Web Audio API — no external files needed.
// Warm, meditative tones that match the watercolor aesthetic.

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

// Create a warm, reverberant note
function playNote(ctx, freq, startTime, duration, gain = 0.3, type = 'sine') {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  g.gain.setValueAtTime(0, startTime)
  g.gain.linearRampToValueAtTime(gain, startTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// Tile select: soft wooden "click" — short noise burst with bandpass
function playTileSelect(ctx) {
  const t = ctx.currentTime
  const bufferSize = ctx.sampleRate * 0.08
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15))
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.setValueAtTime(800, t)
  bandpass.Q.setValueAtTime(2, t)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.25, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  source.connect(bandpass)
  bandpass.connect(g)
  g.connect(ctx.destination)
  source.start(t)
}

// Match: gentle ascending two-note chime (warm bell)
function playMatch(ctx) {
  const t = ctx.currentTime
  // Note 1: C5
  playNote(ctx, 523.25, t, 0.4, 0.2, 'sine')
  playNote(ctx, 523.25 * 2, t, 0.3, 0.08, 'sine') // harmonic
  // Note 2: E5 (major third up, warm and happy)
  playNote(ctx, 659.25, t + 0.15, 0.45, 0.2, 'sine')
  playNote(ctx, 659.25 * 2, t + 0.15, 0.35, 0.08, 'sine') // harmonic
}

// Mismatch: soft low tone, not punishing
function playMismatch(ctx) {
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(220, t)
  osc.frequency.linearRampToValueAtTime(180, t + 0.2)
  g.gain.setValueAtTime(0.15, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.25)
}

// Win celebration: ascending music-box melody with shimmer
function playWin(ctx) {
  const t = ctx.currentTime
  // Ascending major pentatonic melody — warm and celebratory
  const notes = [
    { freq: 523.25, time: 0, dur: 0.5 },    // C5
    { freq: 587.33, time: 0.2, dur: 0.5 },   // D5
    { freq: 659.25, time: 0.4, dur: 0.5 },   // E5
    { freq: 783.99, time: 0.65, dur: 0.6 },  // G5
    { freq: 880.00, time: 0.9, dur: 0.7 },   // A5
    { freq: 1046.50, time: 1.2, dur: 1.2 },  // C6 — resolve
  ]
  notes.forEach(n => {
    playNote(ctx, n.freq, t + n.time, n.dur, 0.18, 'sine')
    // Soft harmonic overtone for shimmer
    playNote(ctx, n.freq * 2, t + n.time, n.dur * 0.6, 0.05, 'sine')
  })

  // Final sustained chord: C major (C5 + E5 + G5)
  const chordStart = t + 2.0
  playNote(ctx, 523.25, chordStart, 2.5, 0.12, 'sine')
  playNote(ctx, 659.25, chordStart, 2.5, 0.10, 'sine')
  playNote(ctx, 783.99, chordStart, 2.5, 0.10, 'sine')
  playNote(ctx, 1046.50, chordStart, 2.5, 0.06, 'sine')
}

// Ambient background: slow evolving pad using layered oscillators
// Returns a stop function
function startAmbient(ctx) {
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2) // fade in over 2s
  masterGain.connect(ctx.destination)

  const oscillators = []

  // Layer 1: Low drone (C3)
  const makeOsc = (freq, type, detune, gain) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.detune.setValueAtTime(detune, ctx.currentTime)
    g.gain.setValueAtTime(gain, ctx.currentTime)
    osc.connect(g)
    g.connect(masterGain)
    osc.start()
    oscillators.push(osc)
    return osc
  }

  // Warm pad: detuned sines for thickness
  makeOsc(130.81, 'sine', 0, 0.4)     // C3
  makeOsc(130.81, 'sine', 8, 0.3)     // C3 slightly detuned
  makeOsc(196.00, 'sine', -5, 0.2)    // G3 (fifth)
  makeOsc(261.63, 'sine', 3, 0.15)    // C4 (octave)
  makeOsc(329.63, 'sine', -3, 0.08)   // E4 (major third — warmth)

  // Slow LFO on master volume for breathing feel
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.type = 'sine'
  lfo.frequency.setValueAtTime(0.08, ctx.currentTime) // Very slow: ~5 seconds per cycle
  lfoGain.gain.setValueAtTime(0.03, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(masterGain.gain)
  lfo.start()
  oscillators.push(lfo)

  return {
    stop: () => {
      // Fade out over 1 second
      const now = ctx.currentTime
      masterGain.gain.cancelScheduledValues(now)
      masterGain.gain.setValueAtTime(masterGain.gain.value, now)
      masterGain.gain.linearRampToValueAtTime(0, now + 1)
      setTimeout(() => {
        oscillators.forEach(o => {
          try { o.stop() } catch (e) { /* already stopped */ }
        })
      }, 1200)
    },
    masterGain,
  }
}

export default function useAudio() {
  const [muted, setMuted] = useState(getStoredMute)
  const ctxRef = useRef(null)
  const ambientRef = useRef(null)

  // Lazily create AudioContext on first user interaction
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (iOS Safari autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // Start/stop ambient based on mute state
  const startAmbientMusic = useCallback(() => {
    const ctx = getCtx()
    if (ambientRef.current) return // already running
    ambientRef.current = startAmbient(ctx)
  }, [getCtx])

  const stopAmbientMusic = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.stop()
      ambientRef.current = null
    }
  }, [])

  // When mute changes, start/stop ambient and persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(muted))
    } catch { /* ignore */ }

    if (!muted) {
      startAmbientMusic()
    } else {
      stopAmbientMusic()
    }
  }, [muted, startAmbientMusic, stopAmbientMusic])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic()
      if (ctxRef.current) {
        ctxRef.current.close()
        ctxRef.current = null
      }
    }
  }, [stopAmbientMusic])

  const toggleMute = useCallback(() => {
    // Ensure AudioContext is created on user gesture
    getCtx()
    setMuted(m => !m)
  }, [getCtx])

  const playSelect = useCallback(() => {
    if (muted) return
    playTileSelect(getCtx())
  }, [muted, getCtx])

  const playMatchSound = useCallback(() => {
    if (muted) return
    playMatch(getCtx())
  }, [muted, getCtx])

  const playMismatchSound = useCallback(() => {
    if (muted) return
    playMismatch(getCtx())
  }, [muted, getCtx])

  const playWinSound = useCallback(() => {
    if (muted) return
    // Fade out ambient, then play win melody
    stopAmbientMusic()
    playWin(getCtx())
  }, [muted, getCtx, stopAmbientMusic])

  return {
    muted,
    toggleMute,
    playSelect,
    playMatchSound,
    playMismatchSound,
    playWinSound,
  }
}
