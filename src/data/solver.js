// Solvable game generation via reverse construction
//
// Algorithm: Start with all positions filled, repeatedly remove pairs of
// free tiles until the board is empty, then assign matching faces to each
// paired removal. The forward solution is the reverse of this process.
//
// Difficulty heuristic: When picking which two free tiles to pair, prefer
// tiles that are far apart (different layers/regions). This spreads
// matching pairs across the board so players must plan strategically.

import { isTileFree } from './layout.js'

// ═══════════════════════════════════════════════
// SHUFFLE UTILITY
// ═══════════════════════════════════════════════

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ═══════════════════════════════════════════════
// DIFFICULTY HEURISTIC — PAIR SELECTION
// ═══════════════════════════════════════════════

// Pick two free tiles to pair during reverse deconstruction.
// Prefers far-apart tiles so matching pairs are spread across the board.
function pickPair(freeTiles) {
  if (freeTiles.length === 2) return [freeTiles[0], freeTiles[1]]

  // Enumerate all candidate pairs, scored by distance
  const candidates = []
  for (let i = 0; i < freeTiles.length; i++) {
    for (let j = i + 1; j < freeTiles.length; j++) {
      const a = freeTiles[i], b = freeTiles[j]
      // Manhattan distance with layer difference weighted 3x
      const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) * 3
      candidates.push({ a, b, dist })
    }
  }

  // Sort by distance descending (most spread-out pairs first)
  candidates.sort((a, b) => b.dist - a.dist)

  // Pick randomly from the top 40% most-distant pairs
  const topCount = Math.max(1, Math.floor(candidates.length * 0.4))
  const pick = candidates[Math.floor(Math.random() * topCount)]
  return [pick.a, pick.b]
}

// ═══════════════════════════════════════════════
// REVERSE CONSTRUCTION — FIND REMOVAL ORDER
// ═══════════════════════════════════════════════

// Single attempt: simulate removing pairs of free tiles until board is empty.
// Returns array of [posIdA, posIdB] pairs, or null on dead end.
function findRemovalOrder(positionTiles) {
  const tiles = positionTiles.map(t => ({ ...t })) // shallow clone
  const pairs = []

  while (tiles.some(t => !t.removed)) {
    const freeTiles = tiles.filter(t => !t.removed && isTileFree(t, tiles))

    if (freeTiles.length < 2) return null // dead end

    const [a, b] = pickPair(freeTiles)

    // Mark removed on the working copies
    tiles[a.id].removed = true
    tiles[b.id].removed = true
    pairs.push([a.id, b.id])
  }

  return pairs
}

// Retry wrapper — keeps trying with fresh randomization until success.
function findRemovalOrderWithRetry(positionTiles, maxAttempts = 100) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const order = findRemovalOrder(positionTiles)
    if (order !== null) return order
  }
  // Should never happen with well-designed layouts
  throw new Error('Failed to find solvable arrangement after ' + maxAttempts + ' attempts')
}

// ═══════════════════════════════════════════════
// FACE ASSIGNMENT
// ═══════════════════════════════════════════════

function assignFaces(removalOrder, copiesPerVariant) {
  const pairsPerType = copiesPerVariant / 2

  // Generate one entry per pair: 8 suits × 4 values × pairsPerType
  const facePool = []
  for (let suit = 0; suit < 8; suit++) {
    for (let value = 1; value <= 4; value++) {
      for (let p = 0; p < pairsPerType; p++) {
        facePool.push({ suit, value })
      }
    }
  }

  const shuffled = shuffle(facePool)

  // Assign faces to position pairs, tracking copy indices
  const positionToFace = {}
  const copyCounters = {}

  for (let i = 0; i < removalOrder.length; i++) {
    const [idA, idB] = removalOrder[i]
    const face = shuffled[i]
    const key = `${face.suit}-${face.value}`
    if (!(key in copyCounters)) copyCounters[key] = 0

    positionToFace[idA] = { suit: face.suit, value: face.value, copy: copyCounters[key]++ }
    positionToFace[idB] = { suit: face.suit, value: face.value, copy: copyCounters[key]++ }
  }

  return positionToFace
}

// ═══════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════

// Generate a new solvable game for the given layout.
// Returns tile array: [{ id, x, y, z, suit, value, copy, removed }, ...]
export function generateSolvableGame(layout, copiesPerVariant) {
  // Create lightweight position tiles for the solver
  const positionTiles = layout.map((pos, i) => ({
    id: i,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    removed: false,
  }))

  const removalOrder = findRemovalOrderWithRetry(positionTiles)
  const faceMap = assignFaces(removalOrder, copiesPerVariant)

  return layout.map((pos, i) => ({
    id: i,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    suit: faceMap[i].suit,
    value: faceMap[i].value,
    copy: faceMap[i].copy,
    removed: false,
  }))
}

// Redistribute faces among remaining tiles to guarantee solvability.
// Preserves removed tiles unchanged.
export function solvableShuffle(currentTiles) {
  const remaining = currentTiles.filter(t => !t.removed)
  const removed = currentTiles.filter(t => t.removed)

  if (remaining.length === 0 || remaining.length % 2 !== 0) {
    return currentTiles
  }

  // Run reverse deconstruction on remaining positions
  // (tiles already have id, x, y, z, removed — isTileFree works directly)
  const positionTiles = remaining.map(t => ({
    id: t.id,
    x: t.x,
    y: t.y,
    z: t.z,
    removed: false,
  }))

  const removalOrder = findRemovalOrderWithRetry(positionTiles)

  // Group remaining faces into matching pairs by suit+value
  const faceGroups = {}
  for (const t of remaining) {
    const key = `${t.suit}-${t.value}`
    if (!faceGroups[key]) faceGroups[key] = []
    faceGroups[key].push({ suit: t.suit, value: t.value, copy: t.copy })
  }

  const facePairs = []
  for (const key of Object.keys(faceGroups)) {
    const group = faceGroups[key]
    for (let i = 0; i < group.length; i += 2) {
      facePairs.push([group[i], group[i + 1]])
    }
  }

  const shuffledPairs = shuffle(facePairs)

  // Assign face pairs to removal-order pairs
  const faceMap = {}
  for (let i = 0; i < removalOrder.length; i++) {
    const [idA, idB] = removalOrder[i]
    faceMap[idA] = shuffledPairs[i][0]
    faceMap[idB] = shuffledPairs[i][1]
  }

  // Rebuild tile array
  const shuffled = remaining.map(t => ({
    ...t,
    suit: faceMap[t.id].suit,
    value: faceMap[t.id].value,
    copy: faceMap[t.id].copy,
  }))

  return [...shuffled, ...removed].sort((a, b) => a.id - b.id)
}
