import React, { useState, useMemo, useCallback } from 'react'
import Board from './components/Board.jsx'
import GameControls from './components/GameControls.jsx'
import TitleScreen from './components/TitleScreen.jsx'
import WinScreen from './components/WinScreen.jsx'
import StuckScreen from './components/StuckScreen.jsx'
import { generateTileSet, tilesMatch } from './data/tiles.js'
import { TURTLE_LAYOUT, isTileFree } from './data/layout.js'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Create a new game: shuffle tiles and assign to layout positions
function createGame() {
  const tileDefs = shuffle(generateTileSet())
  return tileDefs.map((def, i) => ({
    ...def,
    id: i,
    x: TURTLE_LAYOUT[i].x,
    y: TURTLE_LAYOUT[i].y,
    z: TURTLE_LAYOUT[i].z,
    removed: false,
  }))
}

export default function App() {
  const [tiles, setTiles] = useState(() => createGame())
  const [selectedId, setSelectedId] = useState(null)
  const [showTitle, setShowTitle] = useState(true)

  // Compute which tiles are free
  const freeTileIds = useMemo(() => {
    const active = tiles.filter(t => !t.removed)
    return active.filter(t => isTileFree(t, tiles)).map(t => t.id)
  }, [tiles])

  // Win detection: all tiles removed
  const gameWon = useMemo(() => tiles.every(t => t.removed), [tiles])

  // Stuck detection: no valid matching pair among free tiles
  const gameStuck = useMemo(() => {
    if (gameWon) return false
    const freeTiles = tiles.filter(t => !t.removed && freeTileIds.includes(t.id))
    for (let i = 0; i < freeTiles.length; i++) {
      for (let j = i + 1; j < freeTiles.length; j++) {
        if (tilesMatch(freeTiles[i], freeTiles[j])) return false
      }
    }
    return freeTiles.length > 0
  }, [tiles, freeTileIds, gameWon])

  const handleNewGame = useCallback(() => {
    setTiles(createGame())
    setSelectedId(null)
  }, [])

  const handleShuffle = useCallback(() => {
    setTiles(current => {
      const remaining = current.filter(t => !t.removed)
      const removedTiles = current.filter(t => t.removed)
      // Shuffle the tile faces among remaining positions
      const faces = shuffle(remaining.map(t => ({ suit: t.suit, value: t.value, copy: t.copy })))
      const shuffled = remaining.map((t, i) => ({
        ...t,
        suit: faces[i].suit,
        value: faces[i].value,
        copy: faces[i].copy,
      }))
      return [...shuffled, ...removedTiles].sort((a, b) => a.id - b.id)
    })
    setSelectedId(null)
  }, [])

  const handleTileClick = useCallback((id) => {
    setSelectedId(prev => {
      // Clicking already-selected tile → deselect
      if (prev === id) return null

      // No tile selected yet → select this one
      if (prev === null) return id

      // Second tile clicked → check for match
      const tileA = tiles.find(t => t.id === prev)
      const tileB = tiles.find(t => t.id === id)

      if (tileA && tileB && !tileA.removed && !tileB.removed && tilesMatch(tileA, tileB)) {
        // Match! Remove both tiles
        setTiles(current =>
          current.map(t =>
            t.id === tileA.id || t.id === tileB.id
              ? { ...t, removed: true }
              : t
          )
        )
        return null // Clear selection
      }

      // No match → select the new tile instead
      return id
    })
  }, [tiles])

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Global SVG Filters for Watercolor Effects */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="watercolor-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
        </filter>
        <filter id="watercolor-text-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>

      {/* Global Decorative Background Artwork */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/assets/watercolors/tiles_2.png"
          alt=""
          className="absolute -top-10 -left-10 w-64 sm:w-96 opacity-10 blur-[1px] rotate-[-15deg] animate-pulse-slow"
        />
        <img
          src="/assets/watercolors/tiles_6.png"
          alt=""
          className="absolute -bottom-20 -right-20 w-[20rem] sm:w-[30rem] opacity-10 blur-[1px] rotate-[10deg] animate-pulse-slow-reverse"
        />
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1) rotate(-15deg); }
          50% { opacity: 0.15; transform: scale(1.05) rotate(-12deg); }
        }
        @keyframes pulse-slow-reverse {
          0%, 100% { opacity: 0.1; transform: scale(1) rotate(10deg); }
          50% { opacity: 0.15; transform: scale(1.05) rotate(13deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 15s ease-in-out infinite;
        }
      `}</style>
      {/* Header — compact on mobile, more spacious on desktop */}
      {!showTitle && (
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 lg:py-6 overflow-visible">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl watercolor-title"
            style={{
              paddingBottom: '0.2em',
              margin: 0
            }}
          >
            Watercolor Mahjong
          </h1>
          {/* Desktop controls — hidden on mobile */}
          <div className="hidden sm:block overflow-visible">
            <GameControls onNewGame={handleNewGame} onShuffle={handleShuffle} />
          </div>
        </header>
      )}

      {/* Board — fills remaining space, board auto-scales to fit */}
      <main className="flex-1 min-h-0 pb-14 sm:pb-0">
        {!showTitle && (
          <Board
            tiles={tiles}
            selectedId={selectedId}
            freeTileIds={freeTileIds}
            onTileClick={handleTileClick}
          />
        )}
      </main>

      {/* Mobile controls — fixed bottom bar, hidden on desktop */}
      {!showTitle && (
        <div
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40"
          style={{ backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-tan)' }}
        >
          <GameControls onNewGame={handleNewGame} onShuffle={handleShuffle} />
        </div>
      )}

      {/* Win screen overlay */}
      {gameWon && <WinScreen onNewGame={handleNewGame} />}

      {/* Stuck screen overlay */}
      {gameStuck && <StuckScreen onShuffle={handleShuffle} onNewGame={handleNewGame} />}

      {/* Title screen overlay */}
      {showTitle && <TitleScreen onPlay={() => setShowTitle(false)} />}
    </div>
  )
}
