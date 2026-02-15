// Classic "Turtle" Mahjong Solitaire layout — exactly 144 tile positions.
//
// Coordinate system:
//   x = column position, y = row position, z = layer (0 = bottom)
//   Each tile occupies a 1×1 cell in the grid.
//   Upper layers offset by +0.5 in x and y so each tile sits centered
//   over four tiles in the layer below.
//
// Free-tile rules (from PRD):
//   A tile is "free" (playable) when:
//   1. Nothing overlaps it on a higher layer
//   2. At least one side (left OR right) is open

function row(z, y, xStart, xEnd) {
  const out = []
  for (let x = xStart; x <= xEnd; x++) out.push({ x, y, z })
  return out
}

function buildLayout() {
  const p = []

  // ── Layer 0 (bottom) — 87 tiles ──
  // Classic turtle body with left & right wing stubs
  //
  //  Row 0:  cols 1–12  (12)
  //  Row 1:  cols 3–10  ( 8)
  //  Row 2:  cols 2–11  (10)
  //  Row 3:  cols 1–12  (12)
  //  Row 4:  cols 1–12  (12)
  //  Row 5:  cols 2–11  (10)
  //  Row 6:  cols 3–10  ( 8)
  //  Row 7:  cols 1–12  (12)
  //  Wings:  (-1, 3.5)  (0, 3.5)  (13, 3.5)   — 3 tiles
  //  Subtotal: 12+8+10+12+12+10+8+12 + 3 = 87

  p.push(...row(0, 0, 1, 12))
  p.push(...row(0, 1, 3, 10))
  p.push(...row(0, 2, 2, 11))
  p.push(...row(0, 3, 1, 12))
  p.push(...row(0, 4, 1, 12))
  p.push(...row(0, 5, 2, 11))
  p.push(...row(0, 6, 3, 10))
  p.push(...row(0, 7, 1, 12))
  // Wings (half-row between rows 3 and 4)
  p.push({ x: -1, y: 3.5, z: 0 })
  p.push({ x: 0, y: 3.5, z: 0 })
  p.push({ x: 13, y: 3.5, z: 0 })

  // ── Layer 1 — 40 tiles ──
  // Offset +0.5 in x/y from layer 0 coordinates
  //  Row 0: cols 3–8   (6)
  //  Row 1: cols 3–8   (6)
  //  Row 2: cols 2–9   (8)
  //  Row 3: cols 2–9   (8)
  //  Row 4: cols 3–8   (6)
  //  Row 5: cols 3–8   (6)
  //  Subtotal: 6+6+8+8+6+6 = 40
  const l1Offset = 0.5
  const l1Rows = [
    [3, 8, 0],
    [3, 8, 1],
    [2, 9, 2],
    [2, 9, 3],
    [3, 8, 4],
    [3, 8, 5],
  ]
  for (const [xs, xe, r] of l1Rows) {
    for (let x = xs; x <= xe; x++) {
      p.push({ x: x + l1Offset, y: r + l1Offset, z: 1 })
    }
  }

  // ── Layer 2 — 14 tiles ──
  // Offset +1 in x, +1 in y from layer 0
  //  Row 0: cols 4–7   (4)
  //  Row 1: cols 3–8   (6)
  //  Row 2: cols 4–7   (4)
  //  Subtotal: 4+6+4 = 14
  const l2Rows = [
    [4, 7, 1],
    [3, 8, 2],
    [4, 7, 3],
  ]
  for (const [xs, xe, r] of l2Rows) {
    for (let x = xs; x <= xe; x++) {
      p.push({ x: x + 1, y: r + 1, z: 2 })
    }
  }

  // ── Layer 3 — 2 tiles ──
  p.push({ x: 6, y: 3, z: 3 })
  p.push({ x: 7, y: 3, z: 3 })

  // ── Layer 4 — Peak (1 tile) ──
  p.push({ x: 6.5, y: 3, z: 4 })

  return p // 87 + 40 + 14 + 2 + 1 = 144
}

export const TURTLE_LAYOUT = buildLayout()

// ═══════════════════════════════════════════════
// FREE TILE DETECTION
// ═══════════════════════════════════════════════

const OVERLAP = 0.99 // overlap threshold (< 1 tile width)

export function isTileFree(tile, allTiles) {
  const active = allTiles.filter(t => !t.removed && t.id !== tile.id)

  // 1. Blocked from above: any active tile on a higher layer whose
  //    footprint overlaps this tile (within 1 unit in x and y).
  const blocked_above = active.some(t =>
    t.z > tile.z &&
    Math.abs(t.x - tile.x) < OVERLAP &&
    Math.abs(t.y - tile.y) < OVERLAP
  )
  if (blocked_above) return false

  // 2. Blocked on both sides: tiles immediately left AND right on same z
  //    (x offset ~1, y overlaps within 1 unit)
  const hasLeft = active.some(t =>
    t.z === tile.z &&
    Math.abs((tile.x - 1) - t.x) < 0.01 &&
    Math.abs(t.y - tile.y) < OVERLAP
  )
  const hasRight = active.some(t =>
    t.z === tile.z &&
    Math.abs((tile.x + 1) - t.x) < 0.01 &&
    Math.abs(t.y - tile.y) < OVERLAP
  )

  return !hasLeft || !hasRight
}

// ═══════════════════════════════════════════════
// LAYOUT BOUNDS (for centering / scaling)
// ═══════════════════════════════════════════════

export function getLayoutBounds() {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  let maxZ = 0

  for (const pos of TURTLE_LAYOUT) {
    if (pos.x < minX) minX = pos.x
    if (pos.x > maxX) maxX = pos.x
    if (pos.y < minY) minY = pos.y
    if (pos.y > maxY) maxY = pos.y
    if (pos.z > maxZ) maxZ = pos.z
  }

  return {
    minX, maxX, minY, maxY, maxZ,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    layers: maxZ + 1,
  }
}
