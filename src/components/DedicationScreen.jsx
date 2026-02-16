import React, { useEffect, useState } from 'react'

export default function DedicationScreen({ onStartPlaying }) {
  const [visible, setVisible] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showLine3, setShowLine3] = useState(false)
  const [showLine4, setShowLine4] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const t0 = requestAnimationFrame(() => setVisible(true))
    const t1 = setTimeout(() => setShowText(true), 400)
    const t2 = setTimeout(() => setShowLine2(true), 900)
    const t3 = setTimeout(() => setShowLine3(true), 1400)
    const t4 = setTimeout(() => setShowLine4(true), 1900)
    const t5 = setTimeout(() => setShowButton(true), 2400)

    return () => {
      cancelAnimationFrame(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  const handleStartPlaying = () => {
    setFadeOut(true)
    setTimeout(() => onStartPlaying(), 500)
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center px-6"
      style={{
        opacity: fadeOut ? 0 : visible ? 1 : 0,
        transition: fadeOut ? 'opacity 500ms ease-out' : 'opacity 600ms ease-in',
      }}
    >
      <div className="text-center max-w-xl">
        {/* Line 1: Happy 60th Birthday, Mom */}
        <h1
          className="font-serif font-bold mb-6 sm:mb-8"
          style={{
            fontSize: 'clamp(2rem, 7vw, 3.5rem)',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-rose) 50%, #a394c4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            filter: "url('#watercolor-text-filter')",
            paddingBottom: '0.2em',
          }}
        >
          Happy 60th Birthday, Mom
        </h1>

        {/* Line 2: tile artwork explanation */}
        <p
          className="font-serif italic mb-3 sm:mb-4"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: 'var(--color-charcoal)',
            opacity: showLine2 ? 0.8 : 0,
            transform: showLine2 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          This game features your beautiful watercolor paintings as the tiles.
        </p>

        {/* Line 3: celebration of art */}
        <p
          className="font-serif italic mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: 'var(--color-charcoal)',
            opacity: showLine3 ? 0.8 : 0,
            transform: showLine3 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          Each match you make is a little celebration of your art.
        </p>

        {/* Line 4: personal sign-off */}
        <p
          className="mb-8 sm:mb-10"
          style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
            color: 'var(--color-charcoal)',
            opacity: showLine4 ? 0.7 : 0,
            transform: showLine4 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          With love, Davis ❤️
        </p>

        {/* Start Playing button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms ease-out, transform 500ms ease-out',
          }}
        >
          <button
            onClick={handleStartPlaying}
            className="organic-button text-lg sm:text-2xl min-h-[44px]"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  )
}
