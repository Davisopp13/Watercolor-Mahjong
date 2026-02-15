# Watercolor Mahjong Solitaire - MVP PRD

## Reference Documents

This PRD works alongside two companion documents:

| Document | Purpose |
|----------|---------|
| **ASSET_GUIDE.md** | Watercolor file inventory, tile mapping, color palette CSS variables, implementation examples |
| **BRAND_GUIDELINES.md** | Typography, colors, UI components, voice/tone, icon specs |

Refer to these when implementing visual design and integrating Mom's artwork.

---

## One-Liner

A beautiful tile-matching puzzle game featuring Mom's watercolor flower paintings, built as a 60th birthday gift.

## The Problem

**Who has this problem?**
Mom—she already plays Mahjong Solitaire on her phone and enjoys relaxing puzzle games.

**What's painful about the current situation?**
Generic apps have no personal connection. This is a chance to wrap a game she loves in her own artwork.

**Why does this matter enough to build something?**
Her 60th birthday is in 3 days. A handmade game featuring her watercolors is a gift no store can sell.

## The Solution

**Core user loop:**
1. User sees a pyramid of tiles featuring her artwork
2. Clicks two matching free tiles to remove them
3. Clears all tiles to win

**That's it.** Simple, relaxing, beautiful.

## Success Metrics

**How will we know if this works?**
- Primary: Mom can play a complete game without bugs
- Secondary: She recognizes her watercolors and smiles

**What does success look like on Feb 17?**
- Game launches from desktop shortcut or mobile home screen
- She clears at least one puzzle
- She sees her art on every tile
- Works on her computer AND can show friends on her phone

---

## Scope: What's IN

**MVP Features:**

- [x] **Tile rendering** — Tiles with watercolor backgrounds, clear symbols
- [x] **Classic layout** — Pyramid/turtle formation with 144 tiles
- [x] **Responsive design** — Desktop optimized AND mobile optimized
- [x] **Tile selection** — Click/tap to select, visual highlight
- [x] **Free tile detection** — Only unblocked tiles are clickable
- [x] **Match logic** — Two identical tiles selected → remove both
- [ ] **Win detection** — All tiles cleared → celebration screen
- [ ] **Stuck detection** — No valid moves → offer shuffle or new game
- [ ] **Title screen** — Her art + "Watercolor Mahjong"
- [ ] **New game button** — Restart with fresh shuffle
- [ ] **Shuffle button** — Rearrange remaining tiles
- [ ] **PWA** — Installable, works offline

## Scope: What's OUT

**Not building (yet):**

- Multiple layouts (just one is fine)
- Hint system
- Timer or scoring
- Undo functionality
- Difficulty levels
- Sound effects
- Statistics tracking
- American Mahjong mode (future "Coming Soon")

---

## Game Mechanics

### Mahjong Solitaire Rules

1. **Setup:** 144 tiles arranged in a 3D pyramid formation
2. **Goal:** Remove all tiles by matching pairs
3. **Free tiles:** A tile is "free" (playable) if:
   - Nothing is on top of it AND
   - At least one side (left OR right) is open
4. **Matching:** Click two free tiles with identical faces → both disappear
5. **Win:** All 144 tiles removed
6. **Lose:** No valid matches remain (offer shuffle or new game)

### Tile Set (144 tiles for Solitaire)

| Category | Tiles | Copies | Total |
|----------|-------|--------|-------|
| **Dots** | 1-9 | 4 each | 36 |
| **Bams** | 1-9 | 4 each | 36 |
| **Craks** | 1-9 | 4 each | 36 |
| **Winds** | N, S, E, W | 4 each | 16 |
| **Dragons** | Red, Green, White | 4 each | 12 |
| **Flowers** | 4 unique | 1 each | 4 |
| **Seasons** | 4 unique | 1 each | 4 |

**Total: 144 tiles**

**Special matching rules:**
- Flowers match with any other Flower (not identical, just same category)
- Seasons match with any other Season (same rule)
- All other tiles must be identical to match

---

## Layout: Classic Pyramid ("Turtle")

The classic Mahjong Solitaire layout has 5 layers:

```
Layer 1 (bottom): 12×8 grid with gaps = ~86 tiles
Layer 2: Smaller footprint = ~40 tiles  
Layer 3: Smaller still = ~14 tiles
Layer 4: Even smaller = ~4 tiles
Layer 5 (top): 1 tile (the peak)
```

**Simplified approach for MVP:**

Use a pre-defined layout array where each tile has:
- `x`, `y` position (column, row)
- `z` layer (0 = bottom, higher = on top)

A tile at position (x, y, z) is blocked if:
- Any tile exists at (x, y, z+1) — something on top
- Tiles exist at BOTH (x-1, y, z) AND (x+1, y, z) — blocked both sides

**Layout data structure:**
```javascript
const TURTLE_LAYOUT = [
  // Layer 0 (bottom) - positions as [x, y]
  { layer: 0, positions: [[0,0], [1,0], [2,0], ...] },
  // Layer 1
  { layer: 1, positions: [[1,1], [2,1], ...] },
  // ... etc
];
```

---

## Watercolor Integration

### Tile Design

Each tile has:
1. **Background:** Watercolor texture (cropped from Mom's paintings)
2. **Symbol:** High-contrast icon/number on top
3. **Border:** Subtle shadow for 3D stacking effect

### Art Assignment

| Tile Type | Background Treatment |
|-----------|---------------------|
| **Dots 1-9** | Light blue wash (from hydrangea) |
| **Bams 1-9** | Light green wash (from leaves/stems) |
| **Craks 1-9** | Light pink wash (from rose) |
| **Winds** | Light purple wash (from lilac) |
| **Dragons** | Cream/neutral |
| **Flower 1** | Hydrangea (full) |
| **Flower 2** | Sunflower (full) |
| **Flower 3** | Pink Rose (full) |
| **Flower 4** | Yellow Tulips (full) |
| **Season 1** | Mixed Bouquet |
| **Season 2** | Daisies in pitcher |
| **Season 3** | Peony in bottle |
| **Season 4** | Wildflowers in blue bottle |

### Screens

| Screen | Art |
|--------|-----|
| **Title** | Mixed Bouquet or Hydrangea, centered |
| **Win celebration** | Hydrangea with "You Win!" overlay |
| **Background** | Subtle paper texture, warm cream |

---

## Technical Approach

**Stack:**
- React + Vite
- TailwindCSS
- PWA (Progressive Web App)
- Local only (no backend)

### PWA Requirements

**Why PWA:**
- Installs to desktop with one click
- Works offline (perfect for Mom's computer)
- No app store, no Electron complexity
- Feels like a native app

**PWA Files Needed:**

1. **`manifest.json`** — App metadata
```json
{
  "name": "Watercolor Mahjong",
  "short_name": "Mahjong",
  "description": "A tile-matching puzzle featuring Mom's watercolors",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FDF8F0",
  "theme_color": "#9B8BB8",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Service Worker** — For offline caching
   - Vite has a plugin: `vite-plugin-pwa`
   - Automatically generates service worker
   - Caches all assets for offline use

3. **Icons** — App icons for install
   - 192x192 and 512x512 PNG
   - Could use cropped hydrangea or a simple tile icon

**Vite PWA Setup:**
```bash
npm install vite-plugin-pwa -D
```

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Watercolor Mahjong',
        short_name: 'Mahjong',
        description: 'Tile-matching puzzle with watercolor art',
        theme_color: '#9B8BB8',
        background_color: '#FDF8F0',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}']
      }
    })
  ]
}
```

### Responsive Design

The game must work beautifully on both desktop and mobile.

**Desktop (primary):**
- Tiles larger, more detail visible
- Hover states on tiles
- Comfortable mouse clicking
- Min width: 1024px

**Mobile/Tablet:**
- Tiles scale down but remain tappable (min 44px touch target)
- No hover states (touch-based)
- Pinch-to-zoom disabled
- Board fits in viewport without scrolling
- Portrait and landscape support

**Breakpoints:**
```css
/* Mobile first, then scale up */
@media (min-width: 640px)  { /* sm - large phones */ }
@media (min-width: 768px)  { /* md - tablets */ }
@media (min-width: 1024px) { /* lg - desktop */ }
```

**Tile Sizing Strategy:**
```javascript
// Tile size based on viewport
const getTileSize = () => {
  if (window.innerWidth >= 1024) return { width: 60, height: 80 };  // Desktop
  if (window.innerWidth >= 768) return { width: 50, height: 66 };   // Tablet
  return { width: 36, height: 48 };                                  // Mobile
};
```

**Layout Adjustments:**
| Element | Desktop | Mobile |
|---------|---------|--------|
| Tile size | 60×80px | 36×48px |
| Board padding | 40px | 16px |
| Controls | Top bar | Bottom fixed bar |
| Title text | Large (3rem) | Medium (1.5rem) |

**Touch Considerations:**
- Selected tile highlight must be very visible (thicker border)
- Add slight delay before deselection to prevent mis-taps
- "Matched" animation should be clear on small screens
```
/src
  /components
    Tile.jsx           // Single tile with watercolor background
    Board.jsx          // Renders all tiles in layout
    TitleScreen.jsx    // Welcome screen with her art
    WinScreen.jsx      // Celebration when cleared
    GameControls.jsx   // New Game, Shuffle buttons
  /hooks
    useGameState.js    // Tiles, selection, match logic
  /data
    layout.js          // Turtle layout positions
    tiles.js           // Tile definitions
  /assets
    /watercolors       // Her paintings
  App.jsx              // Main game container
```

**Game state:**
```javascript
{
  tiles: [
    { id, type, suit, value, x, y, z, removed: false }
  ],
  selected: null,        // First selected tile ID
  gameStatus: 'playing' | 'won' | 'stuck',
  showTitle: true        // Show title screen initially
}
```

---

## 3-Day Timeline

### Day 1: Saturday, Feb 14 — Foundation
**Hours:** 1-2

- [x] Project setup (Vite + React + Tailwind + vite-plugin-pwa)
- [x] Tile component with watercolor background
- [ ] Layout data for turtle formation
- [ ] Board renders all 144 tiles in position
- [ ] Basic 3D stacking visual (shadows, overlap)

**End of day:** See all tiles rendered in pyramid shape

### Day 2: Sunday, Feb 15 — Gameplay
**Hours:** 1-2

- [ ] Free tile detection (not blocked)
- [ ] Click to select (highlight free tiles only)
- [ ] Match logic (two identical → remove)
- [ ] Win detection (all removed)
- [ ] Stuck detection (no valid pairs)
- [ ] New Game button
- [ ] Shuffle button

**End of day:** Fully playable game

### Day 3: Monday, Feb 16 — Polish & Ship
**Hours:** 1-2

- [ ] Title screen with watercolor art
- [ ] Win celebration screen
- [ ] Visual polish (hover states, smooth transitions)
- [ ] Add PWA icons (crop from hydrangea)
- [ ] Test full playthrough
- [ ] Deploy to Vercel
- [ ] Install PWA on Mom's computer
- [ ] Test offline functionality

**End of day:** Gift ready, installed on her computer

---

## Installation on Mom's Computer (and Phone!)

### PWA Installation (Recommended)

1. **Deploy to Vercel** (or any static host)
   - Push to GitHub
   - Connect to Vercel
   - Get a URL like `watercolor-mahjong.vercel.app`

2. **On Mom's computer (Chrome/Edge):**
   - Open the URL
   - Click the install icon (⊕) in the address bar
   - Or: Menu → "Install Watercolor Mahjong"
   - Desktop shortcut is created automatically

3. **On Mom's phone (bonus!):**
   - Open the URL in Safari (iOS) or Chrome (Android)
   - iOS: Share → "Add to Home Screen"
   - Android: Menu → "Install app" or "Add to Home Screen"
   - App icon appears on home screen

4. **Works offline** — After first visit, no internet needed

### Alternative: Local PWA

If you want it fully offline without deploying:

1. Build the project: `npm run build`
2. Serve locally: `npx serve dist`
3. Open `localhost:3000` in Chrome
4. Install as PWA from browser
5. Create a startup script to run the local server

**Recommendation:** Deploy to Vercel—it's free, takes 2 minutes, and the PWA install is seamless.

---

## V2 Backlog (After Birthday)

- Multiple layouts (spider, fortress, etc.)
- Hint system (highlight a valid pair)
- Undo last move
- Timer and scoring
- Statistics (games played, best times)
- "Coming Soon: American Mahjong" teaser screen
- Full American Mahjong mode (the original plan)

---

## Claude Code Starter Prompt

```
I need help building Watercolor Mahjong Solitaire - a tile-matching puzzle PWA as a birthday gift for my mom. Her birthday is in 3 days so this needs to be focused and achievable.

## Core Gameplay
1. 144 tiles arranged in a classic pyramid/turtle layout
2. Player clicks two matching "free" tiles to remove them
3. A tile is "free" if nothing is on top AND at least one side is open
4. Goal: Remove all tiles
5. Special: Flowers match any Flower, Seasons match any Season

## Technical Requirements
- React + Vite
- TailwindCSS for styling
- PWA with vite-plugin-pwa (offline support, installable)
- Responsive: desktop AND mobile optimized
- Deploy to Vercel

## Responsive Design Requirements
Desktop (1024px+):
- Larger tiles (~60×80px)
- Hover states on free tiles
- Controls in top bar

Mobile (<768px):
- Smaller tiles (~36×48px) but still tappable (min 44px touch target)
- No hover states, clear tap feedback
- Controls in bottom fixed bar
- Board fits viewport without scrolling
- Portrait and landscape support

Use Tailwind responsive prefixes (sm:, md:, lg:) throughout.

## PWA Setup
- Use vite-plugin-pwa for service worker generation
- manifest.json with app name "Watercolor Mahjong"
- Theme color: #9B8BB8 (purple from her watercolors)
- Background color: #FDF8F0 (warm cream)
- Icons: 192x192 and 512x512 PNG

## Tile System (144 tiles)
- Dots 1-9 (4 copies each) = 36
- Bams 1-9 (4 copies each) = 36  
- Craks 1-9 (4 copies each) = 36
- Winds: N, S, E, W (4 copies each) = 16
- Dragons: Red, Green, White (4 copies each) = 12
- Flowers: 4 unique tiles (match any flower) = 4
- Seasons: 4 unique tiles (match any season) = 4

## Layout
Classic turtle/pyramid with 5 layers. Tiles stack in 3D. Need:
- Position data (x, y, layer) for each of 144 tile slots
- Visual stacking with shadows
- Free tile detection algorithm
- Scales to fit viewport on all screen sizes

## Features to Build (MVP)

1. **Tile component** - Renders tile with background image and symbol, responsive sizing
2. **Board component** - Renders all tiles in pyramid layout, scales to viewport
3. **Free tile detection** - Check if tile is playable
4. **Selection logic** - Click/tap to select, click/tap second to match
5. **Match removal** - Two matching free tiles disappear
6. **Win detection** - All tiles gone = win screen
7. **Stuck detection** - No valid moves = offer shuffle/new game
8. **Title screen** - Welcome with watercolor art
9. **Win screen** - Celebration with watercolor art
10. **New Game / Shuffle buttons** - Responsive placement
11. **PWA manifest and service worker**

## Explicitly NOT Building
- Multiple layouts
- Hints
- Timer/scoring
- Undo
- Sound effects
- Statistics

## Watercolor Assets
I have watercolor images ready to use as tile backgrounds and for title/win screens:
- hydrangea (blue/purple flower) - hero image
- sunflower (yellow)
- rose (pink)
- tulips (yellow)
- bouquet (mixed colors) - good for title screen
- daisies (white/green in yellow pitcher)
- peony (soft pink in brown bottle)
- wildflowers (white/purple in blue bottle)
- lilac (purple)

## Success Criteria
- Can play a complete game from start to finish
- Tiles render with watercolor backgrounds
- Works great on desktop AND mobile
- Free tile detection works correctly
- Win/stuck states are detected
- Installs as PWA on desktop and mobile
- Works offline
- Looks polished enough to be a gift

Please help me build this step by step, starting with the project setup including PWA configuration and responsive foundation, then tile rendering. Focus on getting something working quickly.
```
