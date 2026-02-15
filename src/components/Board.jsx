import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import Tile from './Tile.jsx'
import { getLayoutBounds } from '../data/layout.js'

// 3D layer offsets as fraction of tile width/height
const LAYER_OFFSET_X_RATIO = -2 / 60  // ~-0.033 of tileW
const LAYER_OFFSET_Y_RATIO = -4 / 80  // ~-0.05 of tileH

// Tile aspect ratio (width:height = 3:4)
const TILE_ASPECT = 60 / 80

// Max tile sizes (desktop cap)
const MAX_TILE_W = 60
const MAX_TILE_H = 80

// Min tile width to ensure tappable touch targets (44px minimum)
const MIN_TILE_W = 32

export default function Board({ tiles, selectedId, freeTileIds, onTileClick }) {
  const bounds = useMemo(() => getLayoutBounds(), [])
  const containerRef = useRef(null)
  const [tileW, setTileW] = useState(40)

  // Calculate tile size to fit the board within the container
  const computeTileSize = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    // Get content area (clientWidth/Height minus padding)
    const style = getComputedStyle(el)
    const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
    const availW = el.clientWidth - padX
    const availH = el.clientHeight - padY

    // How many tile-widths needed for board width/height
    const gridW = bounds.width + bounds.layers * Math.abs(LAYER_OFFSET_X_RATIO)
    const gridH = bounds.height / TILE_ASPECT + bounds.layers * Math.abs(LAYER_OFFSET_Y_RATIO) / TILE_ASPECT

    // Compute tile width that fits in each dimension
    const fitByWidth = availW / gridW
    const fitByHeight = availH / gridH

    // Use the smaller to ensure both dimensions fit
    let tw = Math.floor(Math.min(fitByWidth, fitByHeight))

    // Clamp to min/max
    tw = Math.max(MIN_TILE_W, Math.min(MAX_TILE_W, tw))

    setTileW(tw)
  }, [bounds])

  useEffect(() => {
    computeTileSize()
    const onResize = () => computeTileSize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [computeTileSize])

  const tileH = Math.round(tileW / TILE_ASPECT)
  const layerOffX = Math.round(tileW * LAYER_OFFSET_X_RATIO)
  const layerOffY = Math.round(tileH * LAYER_OFFSET_Y_RATIO)

  // Board pixel dimensions
  const boardW = bounds.width * tileW + bounds.layers * Math.abs(layerOffX)
  const boardH = bounds.height * tileH + bounds.layers * Math.abs(layerOffY)

  // Sort tiles by z so higher layers render on top (painter's algorithm)
  const sortedTiles = useMemo(() =>
    [...tiles].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x),
    [tiles]
  )

  const freeSet = useMemo(() => new Set(freeTileIds), [freeTileIds])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Subtle watercolor background element */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <img
          src="/assets/watercolors/tiles_2.png"
          alt=""
          className="w-full max-w-2xl h-auto object-contain blur-[2px]"
        />
      </div>

      <div
        className="relative flex-shrink-0 z-10"
        style={{ width: boardW, height: boardH }}
      >
        {sortedTiles.map(tile => {
          if (tile.removed) return null

          // Convert grid position to pixel position
          const px = (tile.x - bounds.minX) * tileW + tile.z * layerOffX
          const py = (tile.y - bounds.minY) * tileH + tile.z * layerOffY

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
    </div>
  )
}
