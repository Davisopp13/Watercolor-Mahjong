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
      className="flex flex-col items-center w-full min-h-full"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <h1
        className="text-2xl lg:text-3xl font-semibold mt-4 mb-3"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
        }}
      >
        Watercolor Mahjong
      </h1>

      <div className="flex-1 flex items-start justify-center overflow-auto p-2 lg:p-6">
        <Board
          tiles={tiles}
          selectedId={selectedId}
          freeTileIds={freeTileIds}
          onTileClick={handleTileClick}
        />
      </div>
    </div>
  )
}
