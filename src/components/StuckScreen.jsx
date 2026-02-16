import React, { useEffect, useState } from 'react'

export default function StuckScreen({ onShuffle, onNewGame }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(253, 248, 240, 0.85)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-in',
      }}
    >
      {/* You Stuck text */}
      <div className="text-center mb-10 z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-tan/40"></div>
          <p className="text-sm sm:text-base text-decorative text-tan font-bold">Reflection</p>
          <div className="h-px w-10 bg-tan/40"></div>
        </div>
        <h2
          className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-4 tracking-tight watercolor-gradient-text"
        >
          A Quiet Moment
        </h2>
        <p
          className="text-xl sm:text-2xl lg:text-3xl italic font-serif"
          style={{
            color: 'var(--color-charcoal)',
            opacity: 0.7,
          }}
        >
          No further moves found. Shall we rearrange the scene?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 z-10">
        <button
          onClick={onShuffle}
          className="organic-button text-lg sm:text-xl px-12 py-5"
        >
          Shuffle Scene
        </button>

        <button
          onClick={onNewGame}
          className="px-12 py-5 rounded-full text-lg sm:text-xl font-semibold transition-all duration-400 transform hover:scale-105 active:scale-95 border-2 group"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-charcoal)',
            borderColor: 'var(--color-tan)',
            borderRadius: '70% 30% 60% 40% / 40% 60% 40% 60%',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(212, 184, 150, 0.1)'
            e.currentTarget.style.borderColor = 'var(--color-lavender)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'var(--color-tan)'
          }}
        >
          New Game
        </button>
      </div>
    </div>
  )
}
