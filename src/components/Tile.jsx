import React from 'react'
import {
  TILE_LABELS,
  SUIT_LABELS,
  SUIT_COLORS,
  FLOWER_IMAGES,
  SEASON_IMAGES,
  SUIT_BACKGROUND_IMAGES,
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
  const hasSpecialImage = isFlower || isSeason

  const specialImageSrc = isFlower
    ? FLOWER_IMAGES[value]
    : isSeason
      ? SEASON_IMAGES[value]
      : null

  const suitBgImage = SUIT_BACKGROUND_IMAGES[suit]

  // Tile appearance constants
  const borderRadius = Math.max(3, Math.round(5 * (tileWidth / 60)))
  const borderWidth = selected ? Math.max(2, Math.round(3 * (tileWidth / 60))) : 1

  return (
    <button
      onClick={free ? onClick : undefined}
      disabled={!free}
      aria-label={`${suit} ${value}${selected ? ' (selected)' : ''}${free ? '' : ' (blocked)'}`}
      className={`tile relative group ${selected ? 'selected' : ''} ${!free ? 'blocked' : ''}`}
      style={{
        width: tileWidth,
        height: tileHeight,
        cursor: free ? 'pointer' : 'default',
      }}
    >
      {/* Background watercolor wash (Prominent for ALL tiles) */}
      {(hasSpecialImage || suitBgImage) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${hasSpecialImage ? specialImageSrc : suitBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: hasSpecialImage ? 0.95 : 0.3,
            transition: 'opacity 300ms ease',
            filter: hasSpecialImage ? 'none' : 'saturate(1.2) contrast(1.1)',
          }}
        />
      )}

      {/* Glossy overlay effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main symbol / number */}
      <div
        className="flex flex-col items-center justify-center relative z-10"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <span
          style={{
            fontSize: Math.round((hasSpecialImage ? 16 : 26) * (tileWidth / 60)),
            fontWeight: 800,
            color: hasSpecialImage ? 'white' : colors.symbol,
            lineHeight: 1,
            textShadow: hasSpecialImage
              ? '0 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.3)'
              : '0 0 8px white, 0 0 4px white',
            fontFamily: hasSpecialImage ? "'Playfair Display', serif" : 'inherit',
          }}
        >
          {label}
        </span>

        {/* Suit indicator (small text at bottom) */}
        {!hasSpecialImage && (
          <span
            style={{
              fontSize: Math.max(9, Math.round(11 * (tileWidth / 60))),
              fontWeight: 700,
              color: colors.symbol,
              lineHeight: 1,
              marginTop: Math.max(1, Math.round(2 * (tileWidth / 60))),
              background: 'rgba(253, 248, 240, 0.6)',
              padding: '0 4px',
              borderRadius: 4,
            }}
          >
            {suitLabel}
          </span>
        )}

        {hasSpecialImage && (
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              fontSize: Math.max(8, Math.round(9 * (tileWidth / 60))),
              fontWeight: 800,
              color: 'white',
              background: 'rgba(0,0,0,0.4)',
              padding: '1px 5px',
              borderRadius: 3,
              textShadow: 'none',
              letterSpacing: '0.05em'
            }}
          >
            {suitLabel}
          </span>
        )}
      </div>
    </button>
  )
}

