import React from 'react'

export default function GameControls({ onNewGame, onShuffle }) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2">
      <button
        onClick={onNewGame}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: 'var(--color-lavender)',
          color: 'white',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#9B8BB8' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-lavender)' }}
        aria-label="Start a new game"
      >
        {/* Refresh icon — simple circular arrow */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1v5h5" />
          <path d="M2.5 10A6 6 0 1 0 3.8 4L1 6" />
        </svg>
        New Game
      </button>
      <button
        onClick={onShuffle}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--color-charcoal)',
          border: '1.5px solid var(--color-tan)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--color-lavender)'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.borderColor = 'var(--color-lavender)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--color-charcoal)'
          e.currentTarget.style.borderColor = 'var(--color-tan)'
        }}
        aria-label="Shuffle remaining tiles"
      >
        {/* Shuffle icon — two curved arrows */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4h3.5a4 4 0 0 1 3.18 1.57L9.32 8" />
          <path d="M1 12h3.5a4 4 0 0 0 3.18-1.57L9.32 8" />
          <path d="M12 3l3 3-3 3" />
          <path d="M9.32 8l1.18 1.43A4 4 0 0 0 13.68 11H15" />
          <path d="M9.32 8L10.5 6.57A4 4 0 0 1 13.68 5H15" />
        </svg>
        Shuffle
      </button>
    </div>
  )
}
