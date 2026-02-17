// Tile definitions for Watercolor Mahjong Solitaire
// 8 paintings × 4 variants × copiesPerVariant
// Desktop: 8 × 4 × 4 = 128 tiles
// Mobile:  8 × 4 × 2 = 64 tiles
// Two tiles match when they share the same painting AND variant number.

// 8 watercolor paintings mapped to image files
export const PAINTINGS = [
  { id: 0, src: '/assets/watercolors/tiles_1.png', name: 'Peony' },
  { id: 1, src: '/assets/watercolors/tiles_2.png', name: 'Hydrangea' },
  { id: 2, src: '/assets/watercolors/tiles_3.png', name: 'Sunflower' },
  { id: 3, src: '/assets/watercolors/tiles_4.jpg', name: 'Mixed Bouquet' },
  { id: 4, src: '/assets/watercolors/tiles_5.jpg', name: 'Daisies' },
  { id: 5, src: '/assets/watercolors/tiles_6.png', name: 'Wildflowers' },
  { id: 6, src: '/assets/watercolors/tiles_7.jpg', name: 'Yellow Tulips' },
  { id: 7, src: '/assets/watercolors/tiles_8.png', name: 'Pink Rose' },
]

// Check if two tiles match (same painting + same variant)
export function tilesMatch(tileA, tileB) {
  if (tileA.id === tileB.id) return false
  return tileA.suit === tileB.suit && tileA.value === tileB.value
}

// Generate a tile set (without positions)
// suit = painting index (0-7), value = variant number (1-4), copy = copy index
// copiesPerVariant=4 → 128 tiles (desktop), copiesPerVariant=2 → 64 tiles (mobile)
export function generateTileSet(copiesPerVariant = 4) {
  const tiles = []
  let id = 0

  for (let painting = 0; painting < 8; painting++) {
    for (let variant = 1; variant <= 4; variant++) {
      for (let copy = 0; copy < copiesPerVariant; copy++) {
        tiles.push({ id: id++, suit: painting, value: variant, copy })
      }
    }
  }

  return tiles // 8 × 4 × copiesPerVariant
}
