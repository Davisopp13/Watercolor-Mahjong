import React, { useMemo } from 'react'
import Tile from './Tile.jsx'
import { getLayoutBounds } from '../data/layout.js'

// Tile pixel sizes per breakpoint (matches PRD)
const TILE_SIZES = {
  desktop: { w: 60, h: 80 },
  tablet:  { w: 50, h: 66 },
  mobile:  { w: 36, h: 48 },
}

// 3D layer offsets (pixels) — gives the stacking illusion
const LAYER_OFFSET_X = -2
const LAYER_OFFSET_Y = -4

export default function Board({ tiles, selectedId, freeTileIds, onTileClick }) {
  const bounds = useMemo(() => getLayoutBounds(), [])

  // Determine tile size from viewport (we read once on mount and on resize)
  const [tileSize, setTileSize] = React.useState(() => getTileSize())

  React.useEffect(() => {
    const onResize = () => setTileSize(getTileSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { w: tileW, h: tileH } = tileSize

  // Board pixel dimensions (account for layer offsets)
  const boardW = bounds.width * tileW + bounds.layers * Math.abs(LAYER_OFFSET_X)
  const boardH = bounds.height * tileH + bounds.layers * Math.abs(LAYER_OFFSET_Y)

  // Sort tiles by z so higher layers render on top (painter's algorithm)
  const sortedTiles = useMemo(() =>
    [...tiles].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x),
    [tiles]
  )

  const freeSet = useMemo(() => new Set(freeTileIds), [freeTileIds])

  return (
    <div
      className="relative mx-auto"
      style={{ width: boardW, height: boardH }}
    >
      {sortedTiles.map(tile => {
        if (tile.removed) return null

        // Convert grid position to pixel position
        const px = (tile.x - bounds.minX) * tileW + tile.z * LAYER_OFFSET_X
        const py = (tile.y - bounds.minY) * tileH + tile.z * LAYER_OFFSET_Y

        return (
          <div
            key={tile.id}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              zIndex: tile.z * 100 + Math.round(tile.y * 10),
              transition: 'opacity 300ms ease-out',
            }}
          >
            <Tile
              tile={tile}
              selected={tile.id === selectedId}
              free={freeSet.has(tile.id)}
              onClick={() => onTileClick(tile.id)}
              tileWidth={tileW}
              tileHeight={tileH}
            />
          </div>
        )
      })}
    </div>
  )
}

function getTileSize() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  if (vw >= 1024) return TILE_SIZES.desktop
  if (vw >= 768) return TILE_SIZES.tablet
  return TILE_SIZES.mobile
}
