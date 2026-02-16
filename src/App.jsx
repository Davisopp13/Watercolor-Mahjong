import React, { useState, useMemo, useCallback, useEffect, useRef, useId } from 'react'
import Board from './components/Board.jsx'
import GameControls from './components/GameControls.jsx'
import TitleScreen from './components/TitleScreen.jsx'
import DedicationScreen from './components/DedicationScreen.jsx'
import WinScreen from './components/WinScreen.jsx'
import StuckScreen from './components/StuckScreen.jsx'
import AuthUI from './components/AuthUI.jsx'
import SyncIndicator from './components/SyncIndicator.jsx'
import useAuth from './hooks/useAuth.js'
import useCloudSync from './hooks/useCloudSync.js'
import useAudio from './hooks/useAudio.js'
import { generateTileSet, tilesMatch } from './data/tiles.js'
import { TURTLE_LAYOUT, isTileFree } from './data/layout.js'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Create a new game: shuffle tiles and assign to layout positions
function createGame() {
  const tileDefs = shuffle(generateTileSet())
  return tileDefs.map((def, i) => ({
    ...def,
    id: i,
    x: TURTLE_LAYOUT[i].x,
    y: TURTLE_LAYOUT[i].y,
    z: TURTLE_LAYOUT[i].z,
    removed: false,
  }))
}

export default function App() {
  const [tiles, setTiles] = useState(() => createGame())
  const [selectedId, setSelectedId] = useState(null)
  const [showTitle, setShowTitle] = useState(true)
  const [showDedication, setShowDedication] = useState(false)
  const [hintIds, setHintIds] = useState(null) // [id1, id2] or null
  const [moveHistory, setMoveHistory] = useState([]) // stack of {tileA, tileB} move records
  const [removingIds, setRemovingIds] = useState(null) // [id1, id2] during dissolve animation
  const [mismatchIds, setMismatchIds] = useState(null) // [id1, id2] during mismatch flash
  const [shakingId, setShakingId] = useState(null) // tile id during blocked shake

  const { muted, toggleMute, playSelect, playMatchSound, playMismatchSound, playWinSound } = useAudio()

  const { user, loading: authLoading, error: authError, magicLinkSent, signInWithMagicLink, signOut } = useAuth()
  const { saveGame, loadGame, syncStatus } = useCloudSync(user)

  // Track removed count to auto-save on match
  const prevRemovedCount = useRef(tiles.filter(t => t.removed).length)

  // Load saved game on sign-in
  useEffect(() => {
    if (!user) return
    let cancelled = false
    loadGame().then(savedTiles => {
      if (cancelled || !savedTiles) return
      // Re-hydrate: map saved tile data back onto layout positions
      const hydrated = savedTiles.map(saved => ({
        ...saved,
        x: TURTLE_LAYOUT[saved.id].x,
        y: TURTLE_LAYOUT[saved.id].y,
        z: TURTLE_LAYOUT[saved.id].z,
      }))
      setTiles(hydrated)
      // If game is in progress, skip title screen
      if (hydrated.some(t => t.removed) && !hydrated.every(t => t.removed)) {
        setShowTitle(false)
      }
      setSelectedId(null)
    })
    return () => { cancelled = true }
  }, [user, loadGame])

  // Auto-save when tiles are removed (match made)
  useEffect(() => {
    const removedCount = tiles.filter(t => t.removed).length
    if (removedCount > prevRemovedCount.current) {
      saveGame(tiles)
    }
    prevRemovedCount.current = removedCount
  }, [tiles, saveGame])

  // Save on page exit / background
  useEffect(() => {
    if (!user) return
    const tilesRef = () => tiles
    const save = () => saveGame(tilesRef())
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') save()
    }
    window.addEventListener('beforeunload', save)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('beforeunload', save)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user, tiles, saveGame])

  // Compute which tiles are free
  const freeTileIds = useMemo(() => {
    const active = tiles.filter(t => !t.removed)
    return active.filter(t => isTileFree(t, tiles)).map(t => t.id)
  }, [tiles])

  // Pairs remaining (72 total pairs, each match removes 1 pair)
  const pairsRemaining = useMemo(() => {
    const removedCount = tiles.filter(t => t.removed).length
    return 72 - removedCount / 2
  }, [tiles])

  // Win detection: all tiles removed
  const gameWon = useMemo(() => tiles.every(t => t.removed), [tiles])

  // Stuck detection: no valid matching pair among free tiles
  const gameStuck = useMemo(() => {
    if (gameWon) return false
    const freeTiles = tiles.filter(t => !t.removed && freeTileIds.includes(t.id))
    for (let i = 0; i < freeTiles.length; i++) {
      for (let j = i + 1; j < freeTiles.length; j++) {
        if (tilesMatch(freeTiles[i], freeTiles[j])) return false
      }
    }
    return freeTiles.length > 0
  }, [tiles, freeTileIds, gameWon])

  const handleNewGame = useCallback(() => {
    const newTiles = createGame()
    setTiles(newTiles)
    setSelectedId(null)
    setHintIds(null)
    setMoveHistory([])
    setRemovingIds(null)
    setMismatchIds(null)
    setShakingId(null)
    saveGame(newTiles)
  }, [saveGame])

  const handleShuffle = useCallback(() => {
    let shuffledTiles
    setTiles(current => {
      const remaining = current.filter(t => !t.removed)
      const removedTiles = current.filter(t => t.removed)
      // Shuffle the tile faces among remaining positions
      const faces = shuffle(remaining.map(t => ({ suit: t.suit, value: t.value, copy: t.copy })))
      const shuffled = remaining.map((t, i) => ({
        ...t,
        suit: faces[i].suit,
        value: faces[i].value,
        copy: faces[i].copy,
      }))
      shuffledTiles = [...shuffled, ...removedTiles].sort((a, b) => a.id - b.id)
      return shuffledTiles
    })
    setSelectedId(null)
    setHintIds(null)
    setMoveHistory([])
    setRemovingIds(null)
    setMismatchIds(null)
    setShakingId(null)
    // Save after state update is queued (shuffledTiles captured from updater)
    if (shuffledTiles) saveGame(shuffledTiles)
  }, [saveGame])

  // Auto-dismiss hint after 3 seconds
  useEffect(() => {
    if (!hintIds) return
    const timer = setTimeout(() => setHintIds(null), 3000)
    return () => clearTimeout(timer)
  }, [hintIds])

  const handleHint = useCallback(() => {
    // Clear any current selection
    setSelectedId(null)
    // Find a valid matching pair among free tiles
    const freeTiles = tiles.filter(t => !t.removed && freeTileIds.includes(t.id))
    for (let i = 0; i < freeTiles.length; i++) {
      for (let j = i + 1; j < freeTiles.length; j++) {
        if (tilesMatch(freeTiles[i], freeTiles[j])) {
          setHintIds([freeTiles[i].id, freeTiles[j].id])
          return
        }
      }
    }
    // No pairs found — stuck detection modal will handle this
    setHintIds(null)
  }, [tiles, freeTileIds])

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return
    const lastMove = moveHistory[moveHistory.length - 1]
    // Restore the two removed tiles
    setTiles(current =>
      current.map(t => {
        if (t.id === lastMove.tileA.id || t.id === lastMove.tileB.id) {
          return { ...t, removed: false }
        }
        return t
      })
    )
    setMoveHistory(prev => prev.slice(0, -1))
    setSelectedId(null)
    setHintIds(null)
  }, [moveHistory])

  const handleTileClick = useCallback((id) => {
    // Dismiss hint on any tile click
    setHintIds(null)
    setSelectedId(prev => {
      // Clicking already-selected tile → deselect
      if (prev === id) return null

      // No tile selected yet → select this one
      if (prev === null) {
        playSelect()
        return id
      }

      // Second tile clicked → check for match
      const tileA = tiles.find(t => t.id === prev)
      const tileB = tiles.find(t => t.id === id)

      if (tileA && tileB && !tileA.removed && !tileB.removed && tilesMatch(tileA, tileB)) {
        // Match! Play match sound
        playMatchSound()
        // Record move in history
        setMoveHistory(h => [...h, {
          tileA: { id: tileA.id, suit: tileA.suit, value: tileA.value, copy: tileA.copy, x: tileA.x, y: tileA.y, z: tileA.z },
          tileB: { id: tileB.id, suit: tileB.suit, value: tileB.value, copy: tileB.copy, x: tileB.x, y: tileB.y, z: tileB.z },
        }])
        // Start dissolve animation
        setRemovingIds([tileA.id, tileB.id])
        // After animation completes, actually remove tiles
        setTimeout(() => {
          setTiles(current =>
            current.map(t =>
              t.id === tileA.id || t.id === tileB.id
                ? { ...t, removed: true }
                : t
            )
          )
          setRemovingIds(null)
        }, 600)
        return null // Clear selection
      }

      // No match → flash mismatch on both tiles, play mismatch sound
      playMismatchSound()
      setMismatchIds([prev, id])
      setTimeout(() => setMismatchIds(null), 400)
      return null // Clear selection
    })
  }, [tiles, playSelect, playMatchSound, playMismatchSound])

  // Play win sound when game is won
  useEffect(() => {
    if (gameWon) playWinSound()
  }, [gameWon, playWinSound])

  // Blocked tile shake handler
  const handleBlockedClick = useCallback((id) => {
    setShakingId(id)
    setTimeout(() => setShakingId(null), 300)
  }, [])

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Global SVG Filters for Watercolor Effects */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="watercolor-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
        </filter>
        <filter id="watercolor-text-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>

      {/* Global Decorative Background Artwork */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/assets/watercolors/tiles_2.png"
          alt=""
          className="absolute -top-10 -left-10 w-64 sm:w-96 opacity-10 blur-[1px] rotate-[-15deg] animate-pulse-slow"
        />
        <img
          src="/assets/watercolors/tiles_6.png"
          alt=""
          className="absolute -bottom-20 -right-20 w-[20rem] sm:w-[30rem] opacity-10 blur-[1px] rotate-[10deg] animate-pulse-slow-reverse"
        />
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1) rotate(-15deg); }
          50% { opacity: 0.15; transform: scale(1.05) rotate(-12deg); }
        }
        @keyframes pulse-slow-reverse {
          0%, 100% { opacity: 0.1; transform: scale(1) rotate(10deg); }
          50% { opacity: 0.15; transform: scale(1.05) rotate(13deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 15s ease-in-out infinite;
        }
      `}</style>
      {/* Header — compact on mobile, more spacious on desktop */}
      {!showTitle && !showDedication && (
        <header className="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4 lg:py-6 overflow-visible">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <h1
                className="text-lg sm:text-3xl lg:text-4xl watercolor-title truncate"
                style={{
                  paddingBottom: '0.2em',
                  margin: 0
                }}
              >
                Watercolor Mahjong
              </h1>
              {/* Progress indicator — pairs remaining (desktop only, mobile shows in bottom bar) */}
              <div className="hidden sm:flex flex-col items-start gap-1 pt-1">
                <span
                  className="text-xs sm:text-sm font-medium whitespace-nowrap"
                  style={{ color: 'var(--color-lavender)' }}
                >
                  {pairsRemaining} {pairsRemaining === 1 ? 'pair' : 'pairs'} remaining
                </span>
                {/* Thin progress bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{
                    height: '3px',
                    backgroundColor: 'rgba(212, 184, 150, 0.3)',
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((72 - pairsRemaining) / 72) * 100}%`,
                      background: 'linear-gradient(90deg, var(--color-lavender), var(--color-rose))',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Desktop controls — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4 overflow-visible">
              <SyncIndicator syncStatus={syncStatus} user={user} />
              <AuthUI
                user={user}
                loading={authLoading}
                error={authError}
                magicLinkSent={magicLinkSent}
                onSignIn={signInWithMagicLink}
                onSignOut={signOut}
              />
              <GameControls onNewGame={handleNewGame} onShuffle={handleShuffle} onHint={handleHint} onUndo={handleUndo} canUndo={moveHistory.length > 0} muted={muted} onToggleMute={toggleMute} />
            </div>
          </div>
        </header>
      )}

      {/* Board — fills remaining space, board auto-scales to fit */}
      <main className="flex-1 min-h-0 pb-14 sm:pb-0">
        {!showTitle && !showDedication && (
          <Board
            tiles={tiles}
            selectedId={selectedId}
            freeTileIds={freeTileIds}
            hintIds={hintIds}
            removingIds={removingIds}
            mismatchIds={mismatchIds}
            shakingId={shakingId}
            onTileClick={handleTileClick}
            onBlockedClick={handleBlockedClick}
          />
        )}
      </main>

      {/* Mobile controls — fixed bottom bar, hidden on desktop */}
      {!showTitle && !showDedication && (
        <div
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40"
          style={{ backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-tan)' }}
        >
          {/* Mobile progress bar — thin, full-width */}
          <div className="px-3 pt-1.5 pb-0.5">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-medium whitespace-nowrap"
                style={{ color: 'var(--color-lavender)' }}
              >
                {pairsRemaining} {pairsRemaining === 1 ? 'pair' : 'pairs'} left
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{
                  height: '3px',
                  backgroundColor: 'rgba(212, 184, 150, 0.3)',
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((72 - pairsRemaining) / 72) * 100}%`,
                    background: 'linear-gradient(90deg, var(--color-lavender), var(--color-rose))',
                  }}
                />
              </div>
              <SyncIndicator syncStatus={syncStatus} user={user} />
              <AuthUI
                user={user}
                loading={authLoading}
                error={authError}
                magicLinkSent={magicLinkSent}
                onSignIn={signInWithMagicLink}
                onSignOut={signOut}
              />
            </div>
          </div>
          <GameControls onNewGame={handleNewGame} onShuffle={handleShuffle} onHint={handleHint} onUndo={handleUndo} canUndo={moveHistory.length > 0} muted={muted} onToggleMute={toggleMute} />
        </div>
      )}

      {/* Win screen overlay */}
      {gameWon && <WinScreen onNewGame={handleNewGame} />}

      {/* Stuck screen overlay */}
      {gameStuck && <StuckScreen onShuffle={handleShuffle} onNewGame={handleNewGame} />}

      {/* Dedication screen overlay — shown between title and game */}
      {showDedication && (
        <DedicationScreen onStartPlaying={() => setShowDedication(false)} />
      )}

      {/* Title screen overlay */}
      {showTitle && (
        <TitleScreen onPlay={() => {
          setShowTitle(false)
          setShowDedication(true)
        }} />
      )}
    </div>
  )
}
