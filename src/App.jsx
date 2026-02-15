import React, { useState, useMemo, useCallback } from 'react'
import Board from './components/Board.jsx'
import { generateTileSet } from './data/tiles.js'
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

  // Compute which tiles are free
  const freeTileIds = useMemo(() => {
    const active = tiles.filter(t => !t.removed)
    return active.filter(t => isTileFree(t, tiles)).map(t => t.id)
  }, [tiles])

  const handleTileClick = useCallback((id) => {
    // For now just toggle selection (match logic comes in a later task)
    setSelectedId(prev => (prev === id ? null : id))
  }, [])

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header — compact on mobile, more spacious on desktop */}
      <header className="flex-shrink-0 flex items-center justify-center py-2 lg:py-3">
        <h1
          className="text-lg sm:text-xl lg:text-3xl font-semibold"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--color-charcoal)',
          }}
        >
          Watercolor Mahjong
        </h1>
      </header>

      {/* Board — fills remaining space, board auto-scales to fit */}
      <main className="flex-1 min-h-0">
        <Board
          tiles={tiles}
          selectedId={selectedId}
          freeTileIds={freeTileIds}
          onTileClick={handleTileClick}
        />
      </main>
    </div>
  )
}
