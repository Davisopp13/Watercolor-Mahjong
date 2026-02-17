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

// Pinch-to-zoom limits
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5
const BOARD_MARGIN = 20

export default function Board({ tiles, selectedId, freeTileIds, hintIds, removingIds, mismatchIds, shakingId, onTileClick, onBlockedClick }) {
  const bounds = useMemo(() => getLayoutBounds(), [])
  const containerRef = useRef(null)
  const boardRef = useRef(null)
  const zoomWrapperRef = useRef(null)
  const [tileW, setTileW] = useState(40)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const hasCentered = useRef(false)
  const [zoomScale, setZoomScale] = useState(1)
  const gestureRef = useRef({
    scale: 1,
    isPanning: false,
    isPinching: false,
    panStartX: 0,
    panStartY: 0,
    scrollStartX: 0,
    scrollStartY: 0,
    pinchStartDist: 0,
    pinchStartScale: 1,
  })

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

  // Reset centering flag and zoom when tiles change (new game)
  useEffect(() => {
    hasCentered.current = false
    gestureRef.current.scale = 1
    setZoomScale(1)
  }, [tiles.length])

  // Mobile pinch-to-zoom and pan gesture handling
  useEffect(() => {
    if (!isMobile) return
    const container = containerRef.current
    const board = boardRef.current
    const wrapper = zoomWrapperRef.current
    if (!container || !board || !wrapper) return

    const g = gestureRef.current

    const getDistance = (t1, t2) =>
      Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)

    const getMidpoint = (t1, t2) => ({
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    })

    const updateWrapperSize = () => {
      wrapper.style.width = `${boardW * g.scale + BOARD_MARGIN * 2}px`
      wrapper.style.height = `${boardH * g.scale + BOARD_MARGIN * 2}px`
    }

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        g.isPinching = true
        g.isPanning = false
        g.pinchStartDist = getDistance(e.touches[0], e.touches[1])
        g.pinchStartScale = g.scale
        e.preventDefault()
      } else if (e.touches.length === 1) {
        g.isPanning = true
        g.panStartX = e.touches[0].clientX
        g.panStartY = e.touches[0].clientY
        g.scrollStartX = container.scrollLeft
        g.scrollStartY = container.scrollTop
      }
    }

    const handleTouchMove = (e) => {
      if (g.isPinching && e.touches.length === 2) {
        e.preventDefault()
        const dist = getDistance(e.touches[0], e.touches[1])
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM,
          g.pinchStartScale * (dist / g.pinchStartDist)))

        // Keep pinch midpoint stable
        const mid = getMidpoint(e.touches[0], e.touches[1])
        const rect = container.getBoundingClientRect()
        const viewX = mid.x - rect.left
        const viewY = mid.y - rect.top

        // Content point under midpoint (unscaled board coordinates)
        const contentX = (viewX + container.scrollLeft - BOARD_MARGIN) / g.scale
        const contentY = (viewY + container.scrollTop - BOARD_MARGIN) / g.scale

        g.scale = newScale
        board.style.transform = `scale(${newScale})`
        updateWrapperSize()

        // Adjust scroll to keep content under midpoint
        container.scrollLeft = contentX * newScale + BOARD_MARGIN - viewX
        container.scrollTop = contentY * newScale + BOARD_MARGIN - viewY
      } else if (g.isPanning && e.touches.length === 1) {
        e.preventDefault()
        const dx = e.touches[0].clientX - g.panStartX
        const dy = e.touches[0].clientY - g.panStartY
        container.scrollLeft = g.scrollStartX - dx
        container.scrollTop = g.scrollStartY - dy
      }
    }

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2 && g.isPinching) {
        g.isPinching = false
        // Commit final scale to React state for consistency on re-renders
        setZoomScale(g.scale)
      }
      if (e.touches.length === 0) {
        g.isPanning = false
      }
      // Transition from pinch to pan with remaining finger
      if (e.touches.length === 1) {
        g.isPanning = true
        g.panStartX = e.touches[0].clientX
        g.panStartY = e.touches[0].clientY
        g.scrollStartX = container.scrollLeft
        g.scrollStartY = container.scrollTop
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, boardW, boardH])

  const freeSet = useMemo(() => new Set(freeTileIds), [freeTileIds])
  const hintSet = useMemo(() => new Set(hintIds || []), [hintIds])
  const removingSet = useMemo(() => new Set(removingIds || []), [removingIds])
  const mismatchSet = useMemo(() => new Set(mismatchIds || []), [mismatchIds])

  // Mobile: scrollable container. Desktop: fit-to-viewport centered.
  const containerClasses = isMobile
    ? "w-full h-full p-2 relative overflow-auto mobile-board-scroll"
    : "w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden"

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
    <div ref={containerRef} className={containerClasses}>
      {isMobile ? (
        <div
          ref={zoomWrapperRef}
          className="flex-shrink-0"
          style={{
            width: boardW * zoomScale + BOARD_MARGIN * 2,
            height: boardH * zoomScale + BOARD_MARGIN * 2,
          }}
        >
          <div
            ref={boardRef}
            className="relative z-10"
            style={{
              width: boardW,
              height: boardH,
              margin: BOARD_MARGIN,
              transformOrigin: '0 0',
              transform: `scale(${zoomScale})`,
            }}
          >
            {tileElements}
          </div>
        </div>
      ) : (
        <div
          className="relative flex-shrink-0 z-10"
          style={{
            width: boardW,
            height: boardH,
          }}
        >
          {tileElements}
        </div>
      )}
    </div>
  )
}
