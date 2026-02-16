import React from 'react'

export default function GameControls({ onNewGame, onShuffle }) {
  return (
    <div className="flex items-center justify-center gap-4 px-2 py-2 overflow-visible">
      <div className="flex-shrink-0">
        <button
          onClick={onNewGame}
          className="organic-button text-xs sm:text-sm font-bold scale-[0.8] sm:scale-100 origin-right transition-all flex items-center gap-2"
          aria-label="Start a new game"
          style={{ padding: '1rem 2.5rem' }}
        >
          <svg className="transition-transform group-hover:rotate-180 duration-700" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1v5h5" />
            <path d="M2.5 10A6 6 0 1 0 3.8 4L1 6" />
          </svg>
          New Game
        </button>
      </div>
      <button
        onClick={onShuffle}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-400 cursor-pointer border-2 group hover:bg-lavender/5 whitespace-nowrap"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--color-charcoal)',
          borderColor: 'var(--color-tan)',
          borderRadius: '40% 60% 70% 30% / 50% 60% 30% 60%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-lavender)'
          e.currentTarget.style.color = 'var(--color-lavender)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-tan)'
          e.currentTarget.style.color = 'var(--color-charcoal)'
        }}
        aria-label="Shuffle remaining tiles"
      >
        <svg className="transition-transform group-hover:scale-125 duration-300 opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h5v5" />
          <path d="M4 20L21 3" />
          <path d="M21 16v5h-5" />
          <path d="M15 15l6 6" />
          <path d="M4 4l5 5" />
        </svg>
        Shuffle
      </button>
    </div>
  )
}
