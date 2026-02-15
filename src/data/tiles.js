// Tile definitions for Mahjong Solitaire (144 tiles)
// Dots 1-9 (x4), Bams 1-9 (x4), Craks 1-9 (x4),
// Winds N/S/E/W (x4), Dragons R/G/W (x4),
// Flowers 1-4 (x1 each), Seasons 1-4 (x1 each)

export const SUITS = {
  DOTS: 'dots',
  BAMS: 'bams',
  CRAKS: 'craks',
  WINDS: 'winds',
  DRAGONS: 'dragons',
  FLOWERS: 'flowers',
  SEASONS: 'seasons',
}

// Symbols for rendering on tiles
export const TILE_SYMBOLS = {
  dots: {
    1: '🀙', 2: '🀚', 3: '🀛', 4: '🀜', 5: '🀝',
    6: '🀞', 7: '🀟', 8: '🀠', 9: '🀡',
  },
  bams: {
    1: '🀐', 2: '🀑', 3: '🀒', 4: '🀓', 5: '🀔',
    6: '🀕', 7: '🀖', 8: '🀗', 9: '🀘',
  },
  craks: {
    1: '🀇', 2: '🀈', 3: '🀉', 4: '🀊', 5: '🀋',
    6: '🀌', 7: '🀍', 8: '🀎', 9: '🀏',
  },
  winds: {
    N: '🀀', S: '🀁', E: '🀂', W: '🀃',
  },
  dragons: {
    R: '🀄', G: '🀅', W: '🀆',
  },
  flowers: {
    1: '🌺', 2: '🌻', 3: '🌹', 4: '🌷',
  },
  seasons: {
    1: '🌸', 2: '🌼', 3: '🌿', 4: '🍂',
  },
}

// Short labels for tiles (shown on the tile face)
export const TILE_LABELS = {
  dots: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9' },
  bams: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9' },
  craks: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9' },
  winds: { N: 'N', S: 'S', E: 'E', W: 'W' },
  dragons: { R: '中', G: '發', W: '白' },
  flowers: { 1: 'F1', 2: 'F2', 3: 'F3', 4: 'F4' },
  seasons: { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4' },
}

// Suit display names (shown as small text on tile)
export const SUIT_LABELS = {
  dots: '筒',
  bams: '索',
  craks: '萬',
  winds: '風',
  dragons: '龍',
  flowers: '花',
  seasons: '季',
}

// Background color tints per suit
export const SUIT_COLORS = {
  dots: { bg: 'rgba(168, 200, 232, 0.20)', symbol: '#2B5797' },
  bams: { bg: 'rgba(152, 217, 140, 0.20)', symbol: '#2D7D46' },
  craks: { bg: 'rgba(245, 184, 200, 0.20)', symbol: '#C41E3A' },
  winds: { bg: 'rgba(253, 248, 240, 1)', symbol: '#4A4A4A' },
  dragons: { bg: 'rgba(253, 248, 240, 1)', symbol: '#4A4A4A' },
  flowers: { bg: 'rgba(184, 165, 208, 0.15)', symbol: '#7B3F9E' },
  seasons: { bg: 'rgba(184, 165, 208, 0.15)', symbol: '#7B3F9E' },
}

// Flower tile image mappings (from ASSET_GUIDE)
export const FLOWER_IMAGES = {
  1: '/assets/watercolors/tiles_1.png',   // Peony -> Flower 1 (Hydrangea in PRD but using peony)
  2: '/assets/watercolors/tiles_3.png',   // Sunflower
  3: '/assets/watercolors/tiles_8.png',   // Pink Rose
  4: '/assets/watercolors/tiles_7.jpg',   // Yellow Tulips
}

// Season tile image mappings
export const SEASON_IMAGES = {
  1: '/assets/watercolors/tiles_4.jpg',   // Mixed Bouquet
  2: '/assets/watercolors/tiles_5.jpg',   // Daisies in pitcher
  3: '/assets/watercolors/tiles_1.png',   // Peony in bottle
  4: '/assets/watercolors/tiles_6.png',   // Wildflowers in blue bottle
}

// Check if two tiles match
export function tilesMatch(tileA, tileB) {
  if (tileA.id === tileB.id) return false
  // Flowers match any other flower
  if (tileA.suit === SUITS.FLOWERS && tileB.suit === SUITS.FLOWERS) return true
  // Seasons match any other season
  if (tileA.suit === SUITS.SEASONS && tileB.suit === SUITS.SEASONS) return true
  // All others must be identical suit + value
  return tileA.suit === tileB.suit && tileA.value === tileB.value
}

// Generate the full set of 144 tile definitions (without positions)
export function generateTileSet() {
  const tiles = []
  let id = 0

  // Dots, Bams, Craks: 1-9, 4 copies each
  for (const suit of [SUITS.DOTS, SUITS.BAMS, SUITS.CRAKS]) {
    for (let value = 1; value <= 9; value++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({ id: id++, suit, value, copy })
      }
    }
  }

  // Winds: N, S, E, W, 4 copies each
  for (const value of ['N', 'S', 'E', 'W']) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({ id: id++, suit: SUITS.WINDS, value, copy })
    }
  }

  // Dragons: R, G, W, 4 copies each
  for (const value of ['R', 'G', 'W']) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({ id: id++, suit: SUITS.DRAGONS, value, copy })
    }
  }

  // Flowers: 4 unique, 1 each
  for (let value = 1; value <= 4; value++) {
    tiles.push({ id: id++, suit: SUITS.FLOWERS, value, copy: 0 })
  }

  // Seasons: 4 unique, 1 each
  for (let value = 1; value <= 4; value++) {
    tiles.push({ id: id++, suit: SUITS.SEASONS, value, copy: 0 })
  }

  return tiles // 144 tiles
}
