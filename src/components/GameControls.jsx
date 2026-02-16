import React from 'react'

export default function GameControls({ onNewGame, onShuffle, onHint, onUndo, canUndo = false }) {
  const outlinedButtonStyle = {
    backgroundColor: 'transparent',
    color: 'var(--color-charcoal)',
    borderColor: 'var(--color-tan)',
    borderRadius: '40% 60% 70% 30% / 50% 60% 30% 60%',
  }

  const handleHover = (e, enter) => {
    e.currentTarget.style.borderColor = enter ? 'var(--color-lavender)' : 'var(--color-tan)'
    e.currentTarget.style.color = enter ? 'var(--color-lavender)' : 'var(--color-charcoal)'
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 py-2 overflow-visible">
      <div className="flex-shrink-0">
        <button
          onClick={onNewGame}
          className="organic-button text-xs sm:text-sm font-bold transition-all flex items-center gap-1 sm:gap-2"
          aria-label="Start a new game"
          style={{ padding: '0.6rem 1rem', minWidth: 44, minHeight: 44 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1v5h5" />
            <path d="M2.5 10A6 6 0 1 0 3.8 4L1 6" />
          </svg>
          <span className="hidden sm:inline">New Game</span>
        </button>
      </div>
      <button
        onClick={onShuffle}
        className="flex items-center justify-center gap-1 sm:gap-2 min-w-[44px] min-h-[44px] px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-400 cursor-pointer border-2 group hover:bg-lavender/5 whitespace-nowrap"
        style={outlinedButtonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
        aria-label="Shuffle remaining tiles"
      >
        <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h5v5" />
          <path d="M4 20L21 3" />
          <path d="M21 16v5h-5" />
          <path d="M15 15l6 6" />
          <path d="M4 4l5 5" />
        </svg>
        <span className="hidden sm:inline">Shuffle</span>
      </button>
      <button
        onClick={onHint}
        className="flex items-center justify-center gap-1 sm:gap-2 min-w-[44px] min-h-[44px] px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-400 cursor-pointer border-2 group hover:bg-lavender/5 whitespace-nowrap"
        style={{
          ...outlinedButtonStyle,
          borderRadius: '60% 40% 30% 70% / 40% 50% 60% 50%',
        }}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
        aria-label="Show a hint"
      >
        <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
        <span className="hidden sm:inline">Hint</span>
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center justify-center gap-1 sm:gap-2 min-w-[44px] min-h-[44px] px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-400 cursor-pointer border-2 group hover:bg-lavender/5 whitespace-nowrap disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
        style={{
          ...outlinedButtonStyle,
          borderRadius: '50% 60% 40% 70% / 60% 40% 50% 50%',
        }}
        onMouseEnter={e => { if (canUndo) handleHover(e, true) }}
        onMouseLeave={e => handleHover(e, false)}
        aria-label="Undo last move"
      >
        <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M3 13a9 9 0 0 1 15.36-6.36L21 9" />
        </svg>
        <span className="hidden sm:inline">Undo</span>
      </button>
    </div>
  )
}
