import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import Tile from './Tile.jsx'
import { getLayoutBounds } from '../data/layout.js'

// 3D layer offsets as fraction of tile width/height
const LAYER_OFFSET_X_RATIO = -2 / 60  // ~-0.033 of tileW
const LAYER_OFFSET_Y_RATIO = -4 / 80  // ~-0.05 of tileH

// Tile aspect ratio (width:height = 3:4)
const TILE_ASPECT = 60 / 80

// Tile size clamps
const MAX_TILE_W = 60
const MIN_TILE_W = 20
const MIN_MOBILE_TILE_W = 45

const MOBILE_BREAKPOINT = 768

export default function Board({ layout, tiles, selectedId, freeTileIds, hintIds, removingIds, mismatchIds, shakingId, onTileClick, onBlockedClick }) {
  const bounds = useMemo(() => getLayoutBounds(layout), [layout])
  const containerRef = useRef(null)
  const [tileW, setTileW] = useState(40)

  // Calculate tile size to fit the board within the container
  const computeTileSize = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT

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

    // Clamp to appropriate bounds
    const minW = isMobile ? MIN_MOBILE_TILE_W : MIN_TILE_W
    tw = Math.max(minW, Math.min(MAX_TILE_W, tw))

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
  const hintSet = useMemo(() => new Set(hintIds || []), [hintIds])
  const removingSet = useMemo(() => new Set(removingIds || []), [removingIds])
  const mismatchSet = useMemo(() => new Set(mismatchIds || []), [mismatchIds])

  const tileElements = sortedTiles.map(tile => {
    if (tile.removed && !removingSet.has(tile.id)) return null

    // Convert grid position to pixel position
    const px = (tile.x - bounds.minX) * tileW + tile.z * layerOffX
    const py = (tile.y - bounds.minY) * tileH + tile.z * layerOffY
    const isFree = freeSet.has(tile.id)

    return (
      <div
        key={tile.id}
        className={removingSet.has(tile.id) ? 'tile-removing' : ''}
        style={{
          position: 'absolute',
          left: px,
          top: py,
          zIndex: tile.z * 100 + Math.round(tile.y * 10),
        }}
      >
        <Tile
          tile={tile}
          selected={tile.id === selectedId}
          free={isFree}
          hinted={hintSet.has(tile.id)}
          mismatch={mismatchSet.has(tile.id)}
          shaking={tile.id === shakingId}
          onClick={isFree ? () => onTileClick(tile.id) : () => onBlockedClick(tile.id)}
          tileWidth={tileW}
          tileHeight={tileH}
        />
      </div>
    )
  })

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden"
    >
      <div
        className="relative flex-shrink-0 z-10"
        style={{
          width: boardW,
          height: boardH,
        }}
      >
        {tileElements}
      </div>
    </div>
  )
}
