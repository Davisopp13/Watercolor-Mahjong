import React from 'react'
import { PAINTINGS } from '../data/tiles.js'

export default function Tile({
  tile,
  selected = false,
  free = true,
  hinted = false,
  mismatch = false,
  shaking = false,
  onClick,
  tileWidth = 60,
  tileHeight = 80,
}) {
  const painting = PAINTINGS[tile.suit]
  const borderRadius = Math.max(3, Math.round(5 * (tileWidth / 60)))

  return (
    <button
      onClick={onClick}
      aria-label={`${painting.name} ${tile.value}${selected ? ' (selected)' : ''}${free ? '' : ' (blocked)'}`}
      className={`tile relative ${selected ? 'selected' : ''} ${!free ? 'blocked' : ''} ${hinted ? 'tile-hinted' : ''} ${mismatch ? 'tile-mismatch' : ''} ${shaking ? 'tile-shake' : ''} transition-all duration-300`}
      style={{
        width: tileWidth,
        height: tileHeight,
        cursor: free ? 'pointer' : 'default',
        borderRadius,
        overflow: 'hidden',
        boxShadow: selected
          ? '0 0 0 3px var(--color-lavender), 0 10px 20px rgba(0,0,0,0.2)'
          : free
            ? '2px 2px 0px var(--color-tan), 4px 4px 8px rgba(0,0,0,0.1)'
            : '1px 1px 0px var(--color-tan), 2px 2px 4px rgba(0,0,0,0.05)',
        transform: selected ? 'translateY(-2px) scale(1.03)' : 'none',
      }}
    >
      {/* Watercolor painting — fills the entire tile face */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${painting.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Subtle glossy overlay for 3D depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* 3D side edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRight: '3px solid rgba(0,0,0,0.06)',
          borderBottom: '3px solid rgba(0,0,0,0.1)',
          borderRadius,
        }}
      />

      {/* Variant number badge — bottom-right corner */}
      <span
        className="absolute pointer-events-none"
        style={{
          bottom: Math.max(2, Math.round(3 * (tileWidth / 60))),
          right: Math.max(2, Math.round(3 * (tileWidth / 60))),
          fontSize: Math.max(8, Math.round(11 * (tileWidth / 60))),
          fontWeight: 600,
          color: '#333',
          background: 'rgba(255, 255, 255, 0.75)',
          borderRadius: 8,
          padding: '1px 5px',
          lineHeight: 1.3,
          zIndex: 10,
        }}
      >
        {tile.value}
      </span>
    </button>
  )
}
