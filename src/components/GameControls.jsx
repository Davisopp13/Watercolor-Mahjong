import React from 'react'

export default function GameControls({ onNewGame, onShuffle, onHint, onUndo, canUndo = false, muted = true, onToggleMute }) {

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
        className="organic-outline-button gap-1 sm:gap-2 min-w-[44px] min-h-[44px] !px-3 sm:!px-5 !py-2.5 whitespace-nowrap"
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
        className="organic-outline-button gap-1 sm:gap-2 min-w-[44px] min-h-[44px] !px-3 sm:!px-5 !py-2.5 whitespace-nowrap"
        style={{
          borderRadius: '60% 40% 30% 70% / 40% 50% 60% 50%',
        }}
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
        className="organic-outline-button gap-1 sm:gap-2 min-w-[44px] min-h-[44px] !px-3 sm:!px-5 !py-2.5 whitespace-nowrap"
        style={{
          borderRadius: '50% 60% 40% 70% / 60% 40% 50% 50%',
        }}
        aria-label="Undo last move"
      >
        <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M3 13a9 9 0 0 1 15.36-6.36L21 9" />
        </svg>
        <span className="hidden sm:inline">Undo</span>
      </button>
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="organic-outline-button gap-1 sm:gap-2 min-w-[44px] min-h-[44px] !px-3 sm:!px-5 !py-2.5 whitespace-nowrap"
          style={{
            borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
          }}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        >
          {muted ? (
            <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg className="opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
          <span className="hidden sm:inline">{muted ? 'Unmute' : 'Mute'}</span>
        </button>
      )}
    </div>
  )
}
