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
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(253, 248, 240, 0.85)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 800ms ease-in',
      }}
    >
      {/* Watercolor image */}
      <div
        className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden mb-10 sm:mb-14 animate-float"
        style={{
          boxShadow: '0 25px 60px rgba(184, 165, 208, 0.4), 0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '10px solid white',
        }}
      >
        <img
          src="/assets/watercolors/tiles_2.png"
          alt="Watercolor hydrangea"
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* You Win text */}
      <div className="text-center mb-10 z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-lavender/40"></div>
          <p className="text-sm sm:text-base text-decorative text-lavender font-bold">Discovery</p>
          <div className="h-px w-10 bg-lavender/40"></div>
        </div>
        <h1
          className="text-6xl sm:text-7xl lg:text-9xl font-bold mb-4 tracking-tighter watercolor-gradient-text"
        >
          Magnificent
        </h1>
        <p
          className="text-xl sm:text-2xl lg:text-3xl italic font-serif"
          style={{
            color: 'var(--color-charcoal)',
            opacity: 0.7,
          }}
        >
          All tiles cleared — a masterpiece completed.
        </p>
      </div>

      {/* Play Again button */}
      <button
        onClick={onNewGame}
        className="organic-button text-xl sm:text-2xl px-16 py-5 z-10"
      >
        Begin Anew
      </button>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
