import React from 'react'
import {
  TILE_LABELS,
  SUIT_LABELS,
  SUIT_COLORS,
  FLOWER_IMAGES,
  SEASON_IMAGES,
  SUITS,
} from '../data/tiles.js'

export default function Tile({
  tile,
  selected = false,
  free = true,
  onClick,
  tileWidth = 60,
  tileHeight = 80,
}) {
  const { suit, value } = tile
  const colors = SUIT_COLORS[suit]
  const label = TILE_LABELS[suit]?.[value] ?? ''
  const suitLabel = SUIT_LABELS[suit] ?? ''

  const isFlower = suit === SUITS.FLOWERS
  const isSeason = suit === SUITS.SEASONS
  const hasImage = isFlower || isSeason
  const imageSrc = isFlower
    ? FLOWER_IMAGES[value]
    : isSeason
      ? SEASON_IMAGES[value]
      : null

  // Scale border width proportionally — thicker when selected for visibility
  const borderWidth = selected ? Math.max(2, Math.round(3 * (tileWidth / 60))) : 1

  return (
    <button
      onClick={free ? onClick : undefined}
      disabled={!free}
      aria-label={`${suit} ${value}${selected ? ' (selected)' : ''}${free ? '' : ' (blocked)'}`}
      className={`tile${free ? ' tile-free' : ''}${selected ? ' tile-selected' : ''}`}
      style={{
        width: tileWidth,
        height: tileHeight,
        position: 'relative',
        borderRadius: Math.max(3, Math.round(4 * (tileWidth / 60))),
        border: selected
          ? `${borderWidth}px solid var(--color-rose)`
          : '1px solid var(--color-tan)',
        backgroundColor: hasImage ? 'var(--color-cream)' : colors.bg,
        boxShadow: selected
          ? `0 0 ${Math.max(4, Math.round(6 * (tileWidth / 60)))}px rgba(232, 123, 152, 0.5), 0 4px 8px rgba(0,0,0,0.15)`
          : '2px 2px 4px rgba(0,0,0,0.10)',
        transform: selected ? 'translateY(-2px)' : 'none',
        transition: 'transform 150ms ease-out, box-shadow 150ms ease-out, border 150ms ease-out',
        cursor: free ? 'pointer' : 'default',
        opacity: free ? 1 : 0.75,
        filter: free ? 'none' : 'saturate(0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        outline: 'none',
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Watercolor background image for flower/season tiles */}
      {hasImage && imageSrc && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            borderRadius: Math.max(2, Math.round(3 * (tileWidth / 60))),
          }}
        />
      )}

      {/* Main symbol / number */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: Math.round((isFlower || isSeason ? 14 : 22) * (tileWidth / 60)),
          fontWeight: 700,
          color: colors.symbol,
          lineHeight: 1,
          textShadow: hasImage ? '0 0 4px rgba(255,255,255,0.9)' : 'none',
        }}
      >
        {label}
      </span>

      {/* Suit indicator (small text at bottom) */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: Math.max(8, Math.round(10 * (tileWidth / 60))),
          fontWeight: 500,
          color: colors.symbol,
          opacity: 0.7,
          lineHeight: 1,
          marginTop: Math.max(1, Math.round(2 * (tileWidth / 60))),
          textShadow: hasImage ? '0 0 3px rgba(255,255,255,0.9)' : 'none',
        }}
      >
        {suitLabel}
      </span>
    </button>
  )
}
