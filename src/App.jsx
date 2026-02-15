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
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header — compact on mobile, more spacious on desktop */}
      {!showTitle && (
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-2 lg:py-3">
          <h1
            className="text-lg sm:text-xl lg:text-3xl font-semibold"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'var(--color-charcoal)',
            }}
          >
            Watercolor Mahjong
          </h1>
          {/* Desktop controls — hidden on mobile */}
          <div className="hidden sm:block">
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
