// Tile definitions for Watercolor Mahjong Solitaire (144 tiles)
// 9 paintings × 4 variants × 4 copies = 144 tiles
// Two tiles match when they share the same painting AND variant number.

// 9 watercolor paintings mapped to image files
export const PAINTINGS = [
  { id: 0, src: '/assets/watercolors/tiles_1.png', name: 'Peony' },
  { id: 1, src: '/assets/watercolors/tiles_2.png', name: 'Hydrangea' },
  { id: 2, src: '/assets/watercolors/tiles_3.png', name: 'Sunflower' },
  { id: 3, src: '/assets/watercolors/tiles_4.jpg', name: 'Mixed Bouquet' },
  { id: 4, src: '/assets/watercolors/tiles_5.jpg', name: 'Daisies' },
  { id: 5, src: '/assets/watercolors/tiles_6.png', name: 'Wildflowers' },
  { id: 6, src: '/assets/watercolors/tiles_7.jpg', name: 'Yellow Tulips' },
  { id: 7, src: '/assets/watercolors/tiles_8.png', name: 'Pink Rose' },
  { id: 8, src: '/assets/watercolors/tiles_9.png', name: 'Landscape' },
]

// Check if two tiles match (same painting + same variant)
export function tilesMatch(tileA, tileB) {
  if (tileA.id === tileB.id) return false
  return tileA.suit === tileB.suit && tileA.value === tileB.value
}

// Generate the full set of 144 tile definitions (without positions)
// suit = painting index (0-8), value = variant number (1-4), copy = copy index (0-3)
export function generateTileSet() {
  const tiles = []
  let id = 0

  for (let painting = 0; painting < 9; painting++) {
    for (let variant = 1; variant <= 4; variant++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({ id: id++, suit: painting, value: variant, copy })
      }
    }
  }

  return tiles // 9 × 4 × 4 = 144 tiles
}
