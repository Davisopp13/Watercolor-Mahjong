import React, { useEffect, useState } from 'react'

export default function TitleScreen({ onPlay }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-in',
      }}
    >


      {/* Watercolor hero logo */}
      <div
        className="relative z-10 w-40 h-56 sm:w-56 sm:h-[280px] mb-4 sm:mb-6 animate-float"
      >
        <img
          src="/icons/logo_tile_icon.png"
          alt="Watercolor logo tile"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8 z-10 px-8">
        <h1
          className="text-5xl sm:text-6xl lg:text-8xl tracking-tighter watercolor-title"
          style={{ paddingBottom: '0.3em' }}
        >
          Watercolor Mahjong
        </h1>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-8 sm:w-16 bg-tan/40"></div>
          <p
            className="text-xs sm:text-sm lg:text-base text-decorative text-tan"
          >
            A Meditative Journey
          </p>
          <div className="h-px w-8 sm:w-16 bg-tan/40"></div>
        </div>
        <p
          className="text-base sm:text-lg lg:text-xl italic font-serif"
          style={{
            color: 'var(--color-charcoal)',
            opacity: 0.7,
            marginTop: '0.25rem'
          }}
        >
          Featuring original artwork by Jen
        </p>
      </div>

      {/* Play button */}
      <div className="z-10">
        <button
          onClick={onPlay}
          className="organic-button text-xl sm:text-2xl"
        >
          Begin Journey
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 12s ease-in-out infinite; }
        .animate-pulse-slow-reverse { animation: pulse-slow 15s ease-in-out infinite reverse; }
      `}</style>
    </div>
  )
}
