import React, { useEffect, useState, useMemo } from 'react'

// Watercolor paintings to show floating before text
const PAINTINGS = [
  '/assets/watercolors/tiles_2.png',
  '/assets/watercolors/tiles_4.jpg',
  '/assets/watercolors/tiles_3.png',
  '/assets/watercolors/tiles_6.png',
]

// Confetti particle colors — watercolor palette
const PARTICLE_COLORS = [
  '#E8B4C8', // pink
  '#B8A5D0', // lavender
  '#98D98C', // green
  '#F5D76E', // gold
  '#A8C8E8', // blue
  '#E87B98', // rose
  '#D4B896', // tan
  '#C9A5E0', // purple
]

// Generate confetti particles with random properties
function generateParticles(count) {
  const particles = []
  for (let i = 0; i < count; i++) {
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
    const size = 6 + Math.random() * 14 // 6-20px
    const isCircle = Math.random() > 0.4
    const left = Math.random() * 100 // 0-100%
    const delay = Math.random() * 4 // 0-4s
    const duration = 6 + Math.random() * 6 // 6-12s
    const swayAmount = -30 + Math.random() * 60 // -30 to 30px horizontal drift
    const opacity = 0.3 + Math.random() * 0.5 // 0.3-0.8
    const rotation = Math.random() * 360

    particles.push({
      id: i,
      color,
      size,
      isCircle,
      left,
      delay,
      duration,
      swayAmount,
      opacity,
      rotation,
    })
  }
  return particles
}

export default function WinScreen({ onNewGame }) {
  const [visible, setVisible] = useState(false)
  const [showLine1, setShowLine1] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showLine3, setShowLine3] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [showPaintings, setShowPaintings] = useState(true)

  const particles = useMemo(() => generateParticles(40), [])

  useEffect(() => {
    // Fade in overlay
    const t0 = requestAnimationFrame(() => setVisible(true))

    // Show floating paintings first, then fade them out and show text
    const t1 = setTimeout(() => setShowPaintings(false), 2500)
    const t2 = setTimeout(() => setShowLine1(true), 3000) // "Happy 60th Birthday, Mama!"
    const t3 = setTimeout(() => setShowLine2(true), 3500) // artwork line
    const t4 = setTimeout(() => setShowLine3(true), 4000) // "Love, Davis"
    const t5 = setTimeout(() => setShowButton(true), 4500) // Play Again

    return () => {
      cancelAnimationFrame(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: visible
          ? 'linear-gradient(160deg, rgba(253,248,240,0.95) 0%, rgba(240,230,245,0.95) 40%, rgba(248,220,230,0.95) 100%)'
          : 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1000ms ease-in, background 1000ms ease-in',
      }}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="confetti-particle"
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: '-20px',
              width: `${p.size}px`,
              height: p.isCircle ? `${p.size}px` : `${p.size * 0.6}px`,
              backgroundColor: p.color,
              borderRadius: p.isCircle ? '50%' : '40% 60% 50% 50%',
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg)`,
              animationName: 'confettiFall',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              '--sway': `${p.swayAmount}px`,
            }}
          />
        ))}
      </div>

      {/* Floating paintings — shown briefly before text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: showPaintings ? 1 : 0,
          transition: 'opacity 800ms ease-out',
        }}
      >
        {PAINTINGS.map((src, i) => (
          <div
            key={i}
            className="painting-float"
            style={{
              position: 'absolute',
              animationDelay: `${i * 0.4}s`,
              '--float-x': `${(i % 2 === 0 ? -1 : 1) * (40 + i * 20)}px`,
              '--float-y': `${(i < 2 ? -1 : 1) * (30 + i * 15)}px`,
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                width: 'clamp(80px, 18vw, 140px)',
                height: 'clamp(80px, 18vw, 140px)',
                border: '4px solid rgba(255,255,255,0.8)',
                boxShadow: '0 8px 30px rgba(184, 165, 208, 0.3)',
              }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Birthday text — appears sequentially after paintings fade */}
      <div className="text-center px-6 z-10 max-w-2xl">
        {/* Line 1: Happy 60th Birthday, Mama! */}
        <h1
          className="font-serif font-bold mb-4 sm:mb-6"
          style={{
            fontSize: 'clamp(2rem, 7vw, 3.5rem)',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-rose) 50%, #a394c4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: showLine1 ? 1 : 0,
            transform: showLine1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            filter: "url('#watercolor-text-filter')",
            paddingBottom: '0.2em',
          }}
        >
          Happy 60th Birthday, Mama!
        </h1>

        {/* Line 2: artwork acknowledgment */}
        <p
          className="font-serif italic mb-3 sm:mb-4"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            color: 'var(--color-charcoal)',
            opacity: showLine2 ? 0.8 : 0,
            transform: showLine2 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          Your beautiful artwork made this game possible
        </p>

        {/* Line 3: personal sign-off */}
        <p
          className="mb-8 sm:mb-10"
          style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
            color: 'var(--color-charcoal)',
            opacity: showLine3 ? 0.7 : 0,
            transform: showLine3 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          Love, Davis ❤️
        </p>

        {/* Play Again button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms ease-out, transform 500ms ease-out',
          }}
        >
          <button
            onClick={onNewGame}
            className="organic-button text-base sm:text-xl px-8 sm:px-12 py-4 min-h-[44px]"
          >
            Play Again
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) translateX(var(--sway)) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes paintingFloat {
          0% {
            opacity: 0;
            transform: translate(0, 30px) scale(0.8) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(var(--float-x), var(--float-y)) scale(1) rotate(-3deg);
          }
          40% {
            transform: translate(var(--float-x), calc(var(--float-y) - 10px)) scale(1) rotate(2deg);
          }
          60% {
            transform: translate(var(--float-x), var(--float-y)) scale(1) rotate(-1deg);
          }
          80% {
            opacity: 1;
            transform: translate(var(--float-x), calc(var(--float-y) - 5px)) scale(1) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: translate(var(--float-x), var(--float-y)) scale(1) rotate(0deg);
          }
        }

        .painting-float {
          animation: paintingFloat 3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
