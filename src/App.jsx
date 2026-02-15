import React from 'react'

export default function App() {
  return (
    <div className="flex items-center justify-center w-full h-full"
         style={{ backgroundColor: 'var(--color-background)' }}>
      <h1
        className="text-4xl font-semibold"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--color-charcoal)'
        }}
      >
        Watercolor Mahjong
      </h1>
    </div>
  )
}
