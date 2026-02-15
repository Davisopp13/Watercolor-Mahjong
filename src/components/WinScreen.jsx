import React, { useEffect, useState } from 'react'

export default function WinScreen({ onNewGame }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in after mount
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'rgba(253, 248, 240, 0.92)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 800ms ease-in',
      }}
    >
      {/* Watercolor image */}
      <div
        className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden mb-6 sm:mb-8"
        style={{
          boxShadow: '0 8px 32px rgba(184, 165, 208, 0.4), 0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '4px solid rgba(184, 165, 208, 0.5)',
        }}
      >
        <img
          src="/assets/watercolors/tiles_2.png"
          alt="Watercolor hydrangea"
          className="w-full h-full object-cover"
        />
      </div>

      {/* You Win text */}
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-lavender)',
          textShadow: '0 2px 8px rgba(184, 165, 208, 0.3)',
        }}
      >
        You Win!
      </h1>

      <p
        className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-center px-4"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
          opacity: 0.8,
        }}
      >
        All tiles cleared — beautifully done!
      </p>

      {/* Play Again button */}
      <button
        onClick={onNewGame}
        className="px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold cursor-pointer"
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundColor: 'var(--color-lavender)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(184, 165, 208, 0.4)',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(184, 165, 208, 0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 165, 208, 0.4)'
        }}
      >
        Play Again
      </button>
    </div>
  )
}
