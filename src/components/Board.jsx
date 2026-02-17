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

// Min tile width for desktop — fit board in viewport
const MIN_TILE_W = 20

// Mobile: minimum tile width for tappable, visible tiles
const MOBILE_TILE_W = 55
const MOBILE_BREAKPOINT = 768

export default function Board({ tiles, selectedId, freeTileIds, hintIds, removingIds, mismatchIds, shakingId, onTileClick, onBlockedClick }) {
  const bounds = useMemo(() => getLayoutBounds(), [])
  const containerRef = useRef(null)
  const [tileW, setTileW] = useState(40)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const hasCentered = useRef(false)

  // Calculate tile size to fit the board within the container
  const computeTileSize = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const mobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(mobile)

    if (mobile) {
      // On mobile, use fixed large tile size for tappability
      setTileW(MOBILE_TILE_W)
      return
    }

    // Desktop: fit board within container
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

  // Auto-center the scrollable board on mobile after first render
  useEffect(() => {
    if (!isMobile || hasCentered.current) return
    const el = containerRef.current
    if (!el || boardW === 0 || boardH === 0) return

    // Wait a frame for layout to settle
    requestAnimationFrame(() => {
      const scrollLeft = (el.scrollWidth - el.clientWidth) / 2
      const scrollTop = (el.scrollHeight - el.clientHeight) / 2
      el.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'instant' })
      hasCentered.current = true
    })
  }, [isMobile, boardW, boardH])

  // Reset centering flag when tiles change (new game)
  useEffect(() => {
    hasCentered.current = false
  }, [tiles.length])

  const freeSet = useMemo(() => new Set(freeTileIds), [freeTileIds])
  const hintSet = useMemo(() => new Set(hintIds || []), [hintIds])
  const removingSet = useMemo(() => new Set(removingIds || []), [removingIds])
  const mismatchSet = useMemo(() => new Set(mismatchIds || []), [mismatchIds])

  // Mobile: scrollable container. Desktop: fit-to-viewport centered.
  const containerClasses = isMobile
    ? "w-full h-full p-2 relative overflow-auto mobile-board-scroll"
    : "w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden"

  return (
    <div ref={containerRef} className={containerClasses}>
      <div
        className="relative flex-shrink-0 z-10"
        style={{
          width: boardW,
          height: boardH,
          // On mobile, add margin so user can scroll to edges comfortably
          margin: isMobile ? '20px' : undefined,
        }}
      >
        {sortedTiles.map(tile => {
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
        })}
      </div>
    </div>
  )
}
