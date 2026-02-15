import React, { useEffect, useState } from 'react'

export default function TitleScreen({ onPlay }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: 'var(--color-background)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-in',
      }}
    >
      {/* Watercolor hero image */}
      <div
        className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden mb-6 sm:mb-8"
        style={{
          boxShadow: '0 8px 32px rgba(184, 165, 208, 0.4), 0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '4px solid rgba(184, 165, 208, 0.5)',
        }}
      >
        <img
          src="/assets/watercolors/tiles_4.jpg"
          alt="Watercolor mixed bouquet by Jen"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h1
        className="text-3xl sm:text-4xl lg:text-6xl font-semibold mb-2 sm:mb-3 text-center"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
          textShadow: '0 2px 8px rgba(184, 165, 208, 0.3)',
        }}
      >
        Watercolor Mahjong
      </h1>

      {/* Tagline */}
      <p
        className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 text-center"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
          opacity: 0.6,
        }}
      >
        Featuring original artwork by Jen
      </p>

      {/* Play button */}
      <button
        onClick={onPlay}
        className="px-10 py-3 sm:px-12 sm:py-4 rounded-full text-lg sm:text-xl font-semibold cursor-pointer"
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
        Play
      </button>
    </div>
  )
}
