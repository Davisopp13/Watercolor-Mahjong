import React, { useEffect, useState } from 'react'

export default function StuckScreen({ onShuffle, onNewGame }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'rgba(253, 248, 240, 0.92)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-in',
      }}
    >
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
        }}
      >
        No Moves Left
      </h2>

      <p
        className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-center px-4"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
          opacity: 0.7,
        }}
      >
        Don't worry — shuffle the tiles or start fresh!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onShuffle}
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
          Shuffle Tiles
        </button>

        <button
          onClick={onNewGame}
          className="px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold cursor-pointer"
          style={{
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'transparent',
            color: 'var(--color-charcoal)',
            border: '2px solid var(--color-lavender)',
            boxShadow: 'none',
            transition: 'transform 150ms ease, background-color 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.backgroundColor = 'rgba(184, 165, 208, 0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          New Game
        </button>
      </div>
    </div>
  )
}
