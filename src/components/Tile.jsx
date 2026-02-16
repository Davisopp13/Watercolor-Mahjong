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
  hinted = false,
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
      className={`tile relative group ${selected ? 'selected' : ''} ${!free ? 'blocked' : ''} ${hinted ? 'tile-hinted' : ''} transition-all duration-300`}
      style={{
        width: tileWidth,
        height: tileHeight,
        cursor: free ? 'pointer' : 'default',
        /* Enhanced 3D effect */
        boxShadow: selected
          ? '0 0 0 3px var(--color-lavender), 0 10px 20px rgba(0,0,0,0.2)'
          : free
            ? '2px 2px 0px var(--color-tan), 4px 4px 8px rgba(0,0,0,0.1)'
            : '1px 1px 0px var(--color-tan), 2px 2px 4px rgba(0,0,0,0.05)',
        transform: selected ? 'translateY(-4px) scale(1.02)' : 'none',
      }}
    >
      {/* 3D Side Edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRight: '4px solid rgba(0,0,0,0.05)',
          borderBottom: '4px solid rgba(0,0,0,0.1)',
          borderRadius: borderRadius,
        }}
      />

      {/* Background watercolor wash (Prominent for ALL tiles) */}
      {(hasSpecialImage || suitBgImage) && (
        <div
          className="transition-transform duration-500 group-hover:scale-110"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${hasSpecialImage ? specialImageSrc : suitBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: hasSpecialImage ? 0.95 : 0.35,
            transition: 'opacity 300ms ease',
            filter: hasSpecialImage ? 'none' : 'saturate(1.3) contrast(1.1)',
          }}
        />
      )}

      {/* Glossy/Texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Main symbol / number */}
      <div
        className="flex flex-col items-center justify-center relative z-10 p-1"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <span
          className="transition-transform duration-300 group-hover:scale-105"
          style={{
            fontSize: Math.round((hasSpecialImage ? 18 : 28) * (tileWidth / 60)),
            fontWeight: 800,
            color: hasSpecialImage ? 'white' : colors.symbol,
            lineHeight: 1,
            textShadow: hasSpecialImage
              ? '0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.2)'
              : '0 0 12px white, 0 0 6px white',
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
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '1px 5px',
              borderRadius: 4,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
              background: 'rgba(0,0,0,0.5)',
              padding: '1px 6px',
              borderRadius: 4,
              textShadow: 'none',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(2px)',
            }}
          >
            {suitLabel}
          </span>
        )}
      </div>
    </button>
  )
}

