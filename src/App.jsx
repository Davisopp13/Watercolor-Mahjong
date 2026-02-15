import React from 'react'
import Tile from './components/Tile.jsx'
import { generateTileSet } from './data/tiles.js'

// Show one tile per unique type for verification
function getUniqueTiles() {
  const tiles = generateTileSet()
  const seen = new Set()
  return tiles.filter((t) => {
    const key = `${t.suit}-${t.value}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function App() {
  const uniqueTiles = getUniqueTiles()

  return (
    <div
      className="flex flex-col items-center w-full min-h-full py-8 px-4"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <h1
        className="text-3xl font-semibold mb-6"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)',
        }}
      >
        Watercolor Mahjong
      </h1>
      <div
        className="flex flex-wrap gap-2 justify-center"
        style={{ maxWidth: 800 }}
      >
        {uniqueTiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            selected={false}
            free={true}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
