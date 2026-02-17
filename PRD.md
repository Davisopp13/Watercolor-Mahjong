# Watercolor Mahjong — Final Polish PRD

> **Deadline:** February 17, 2026 (Jennifer's 60th birthday — TODAY)
> **Live:** https://watercolor-mahjong.vercel.app/
> **Stack:** Vite + React + Tailwind CSS → Vercel

---

## Context

Watercolor Mahjong is a personalized mahjong solitaire game featuring Jennifer's watercolor paintings on every tile. It's her 60th birthday gift. The core game is fully functional — tile redesign with paintings, matching logic, hint/undo/shuffle, win celebration, birthday dedication, progress bar, all working and deployed.

**Remaining issues:**
1. PWA icon has a harsh white background — needs warm cream to match the game aesthetic
2. Mobile board is zoomed out so far that tiles are tiny and untappable
3. Hard to tell which tiles are playable vs blocked
4. Audio uses synthesized Web Audio API tones that sound like buzzing instead of real music

---

## Tasks

### [x] Task 1: PWA Icon — Warm Cream Background

**Goal:** Replace the harsh white background on the PWA/home screen icon with a warm cream color that matches the game's aesthetic, so the icon looks intentional and cohesive when installed on a phone's home screen.

**Requirements:**
- Change the icon background color from pure white (#FFFFFF) to warm cream (#FDF8F0) — this is the same off-white/cream used on the game's landing page and board background.
- The hydrangea tile artwork stays centered and unchanged — only the background behind it changes.
- Regenerate all PWA icon sizes with the new background:
  - 192×192 (standard PWA icon)
  - 512×512 (PWA splash / large icon)
  - apple-touch-icon (180×180 for iOS home screen)
  - favicon if applicable
- Update the web app manifest (`manifest.json` or `manifest.webmanifest`):
  - Set `"background_color": "#FDF8F0"`
  - Set `"theme_color": "#FDF8F0"` (or keep the existing purple `#9B8BB8` if it looks better for the status bar — use your judgment)
- Update the `<meta name="theme-color">` tag in `index.html` to match the manifest.
- If the icon source is an SVG or a large PNG, edit the background fill directly. If it's a generated asset, update the generation config/script.

**Acceptance criteria:**
- Home screen icon shows the hydrangea tile on a warm cream background instead of white.
- No white border or white square visible around the icon when installed on iOS or Android.
- Manifest background_color matches so the PWA splash screen is consistent.
- Icon looks good at all sizes (check 192 and 512 at minimum).

---

### [x] Task 2: Mobile Board — Zoomed-In Scrollable View

**Goal:** On mobile viewports (under 768px wide), show the board zoomed in so tiles are large and tappable, with the ability to scroll/pan to see the full board. Do NOT shrink the entire board to fit the screen — that makes tiles too small.

**The problem right now:**
The board scales down to fit the full 144-tile layout into a ~375px wide viewport. This makes each tile roughly 25-30px wide — far too small to see the paintings, read the numbers, or tap accurately. The game is effectively unplayable on phone.

**Reference behavior:**
Mahjong Club on mobile shows tiles at a large, comfortable size (~60-70px wide). The full board does not fit on screen at once. The player sees a focused portion of the board and scrolls/pans to navigate. Tiles are big enough to clearly see the artwork, easily tap, and distinguish open from blocked.

**Implementation — scrollable container approach:**

On viewports under 768px:
1. Remove any `transform: scale()` or viewport-fitting logic that shrinks the board to fit the screen width.
2. Render the board at its natural/desktop size (or a minimum where tiles are ~55-65px wide — large enough to see paintings clearly and tap accurately).
3. Wrap the board in a scrollable container:
   - `overflow: auto` (allows both horizontal and vertical scrolling)
   - `-webkit-overflow-scrolling: touch` (smooth momentum scrolling on iOS)
   - The container should fill the available viewport height between the header and the bottom controls.
4. On initial load, auto-scroll to center the board so the player sees the middle/top of the pyramid first (the most actionable area).

**Touch interaction:**
- Single tap selects a tile (existing behavior — keep this).
- Dragging/swiping scrolls the board (native scroll behavior — this should work automatically with the overflow container).
- Make sure tile taps and scroll gestures don't conflict. The browser's native scroll handling should distinguish between a tap (no movement) and a drag (movement). If there are issues, add a small touch-move threshold (~10px) before treating a gesture as a scroll vs a tap.

**Fixed header and controls:**
- The title "Watercolor Mahjong" and the progress bar / control buttons at the bottom should remain fixed and always visible — NOT scroll with the board.
- Layout structure on mobile:
  ```
  ┌─────────────────────────┐
  │ Watercolor Mahjong      │  ← fixed header
  ├─────────────────────────┤
  │                         │
  │   (scrollable board)    │  ← overflow: auto, fills remaining height
  │                         │
  ├─────────────────────────┤
  │ 72 pairs left ━━━━━━━━  │  ← fixed progress bar
  │  ⟳  ✕  💡  ↩  🔇      │  ← fixed control buttons
  └─────────────────────────┘
  ```
- Use a flex layout with `flex: 1` on the scrollable area and fixed heights on header/footer.

**Tile size on mobile:**
- Minimum tile width: 50px (absolute floor — paintings must be recognizable).
- Target tile width: 55-65px (comfortable for tapping and viewing).
- If the current desktop tile size is too small, scale the board UP on mobile so tiles hit the 55-65px range. Use CSS `transform: scale()` on the board to enlarge it within the scrollable container.
- All tap targets must be at least 44×44px (Apple HIG standard).

**Desktop (768px+) — no changes:**
- Keep the current desktop behavior where the full board fits in the viewport without scrolling.

**Acceptance criteria:**
- On a 375px wide viewport (iPhone SE/standard), tiles are large enough to clearly see the watercolor paintings and read the variant numbers.
- Tiles are at least 50px wide on mobile, ideally 55-65px.
- The board scrolls smoothly in both directions with touch momentum.
- Header and bottom controls remain fixed and visible at all times while the board scrolls.
- Tapping a tile works reliably without accidentally scrolling.
- Board is auto-centered on load so the player sees the pyramid center first.
- Desktop layout is unchanged.
- Game is fully playable end-to-end on mobile.

---

### [x] Task 3: Playable vs Blocked Tile Contrast

**Goal:** Make the visual difference between open/playable tiles and blocked tiles dramatically obvious at a glance. A player should never need to click a tile to find out if it's interactive.

**Open (playable) tiles — alive and lifted:**
- `opacity: 1`
- `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)`
- `transform: translateY(-1px)`
- `cursor: pointer`
- On hover (desktop only — wrap in `@media (hover: hover)`):
  - `transform: translateY(-3px) scale(1.02)`
  - `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)`
  - `outline: 2px solid rgba(155, 139, 184, 0.5)` (soft purple glow)
  - `transition: all 0.2s ease`

**Blocked (not playable) tiles — receded and inert:**
- `opacity: 0.45`
- `filter: grayscale(30%) brightness(0.9)`
- `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)` (nearly flat)
- No transform offset — sits flat against the board
- `cursor: default`
- On hover: NO visual change whatsoever. No lift, no glow, no scale.
- On click: quick shake animation (200ms, ±3px horizontal oscillation):
  ```css
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  ```

**State transition animation:**
When a tile becomes unblocked (because tiles above/beside it were removed), animate smoothly from blocked styling to open styling over ~300ms using CSS transitions. This creates a satisfying "tiles waking up" effect as the board is cleared.

**The squint test:** If you squint at the board, open tiles should visually pop out while blocked tiles fade into the background. The difference should be stark and immediate.

**Acceptance criteria:**
- At a glance, any player can immediately identify which tiles are playable without clicking.
- Blocked tiles are visually distinct: dimmer, flatter, slightly desaturated.
- Open tiles feel lively: full color, lifted, responsive to hover.
- The blocked → open transition is animated smoothly when tiles become unblocked.
- Hover effects only fire on open tiles on hover-capable devices.
- Blocked tile click triggers shake feedback.

---

### [x] Task 4: Replace Synthesized Audio with Real Music Files

**Goal:** Replace ALL Web Audio API generated/synthesized tones with real mp3 files. The current synthesized audio sounds like buzzing and is not pleasant. Real recorded audio files have been placed in `public/audio/`.

**IMPORTANT:** Davis will manually download and place the following royalty-free mp3 files in `public/audio/` BEFORE this task runs:
- `public/audio/background.mp3` — calm ambient piano loop (~2-3 min)
- `public/audio/select.mp3` — soft click/wood tap (~100-200ms)
- `public/audio/match.mp3` — gentle chime/bell (~300-500ms)
- `public/audio/mismatch.mp3` — subtle low tone (~200-300ms)
- `public/audio/win.mp3` — celebration music box/wind chimes (~3-5 sec)

**Requirements:**
- Remove ALL Web Audio API oscillator, tone generation, and synthesized audio code. Delete it entirely — no fallbacks to generated tones.
- Load all audio files using `new Audio()` or HTML5 `<audio>` elements.
- Preload all sound effect files on game load so there's no delay on first trigger.

**Audio configuration:**
- `background.mp3`: Loop continuously (`audio.loop = true`). Volume: 0.3.
- `select.mp3`: Fire-and-forget on tile selection. Volume: 0.5.
- `match.mp3`: Fire-and-forget on successful pair match. Volume: 0.5.
- `mismatch.mp3`: Fire-and-forget on failed match attempt. Volume: 0.5.
- `win.mp3`: Play once when the win celebration overlay appears. Volume: 0.6. Fade out background music over ~1 second before playing, or layer on top.
- All sound effects should allow overlapping playback (if matches happen rapidly, multiple chimes can play simultaneously).

**Mute toggle (keep existing behavior):**
- Mute/unmute toggle button remains in the controls.
- Default state: MUTED on first visit.
- Unmuting starts background music and enables sound effects.
- Muting pauses background music and disables sound effects.
- Persist mute preference in localStorage (use whatever key is already in the codebase).

**iOS Safari considerations:**
- Audio won't play until after a user interaction. The "Begin Journey" or "Start Playing" button clicks satisfy this requirement. Create/resume the audio context on one of those clicks.
- If audio fails to load (file not found), fail silently — don't break the game. Log a console warning.

**If the audio files are not found in `public/audio/`:**
- Do NOT fall back to synthesized audio.
- Simply have no audio — the game should work perfectly fine in silence.
- Log a console warning: "Audio files not found in public/audio/. Game will run without sound."

**Acceptance criteria:**
- Zero synthesized/oscillator audio code remains in the codebase.
- All audio playback uses the real mp3 files from `public/audio/`.
- Background music loops seamlessly at low volume.
- Each sound effect fires at the correct moment without lag.
- Mute toggle works correctly, defaults to muted, persists preference.
- Game works perfectly with or without audio files present.
- No audio pops, clicks, or buzzing sounds.

---

### [x] Task 5: Final Mobile QA Pass

**Goal:** End-to-end verification that the complete game works on mobile. Simulate a full playthrough on a 375px viewport.

**Checklist to verify:**
- Landing page ("Begin Journey") renders correctly and button is tappable
- Birthday dedication screen displays and "Start Playing" works
- Board loads at playable tile size (50px+ wide)
- Board scrolls smoothly with touch in both directions
- Tapping a tile selects it reliably (no conflict with scroll)
- Matching two tiles removes them with animation
- Open tiles are visually distinct from blocked tiles
- Hint button highlights a valid pair
- Undo restores the last pair
- Shuffle rearranges remaining tiles
- New Game resets everything
- Progress bar updates correctly
- Stuck detection fires when no moves remain
- Win celebration overlay appears on completion with birthday message
- Mute/unmute toggle works
- All buttons have minimum 44×44px tap targets
- No horizontal overflow causing unwanted page-level scrolling (only the board container should scroll)
- No elements overlap or get cut off
- PWA icon shows correctly with cream background when installed

**If any issue is found**, fix it. If everything passes, mark complete.

**Acceptance criteria:**
- Every feature works correctly on a 375px mobile viewport.
- The game is fully playable end-to-end on mobile without any UX issues.

---

## Scope: What's OUT

- Additional board layouts
- Difficulty levels
- Score tracking / leaderboards
- Tutorial / how-to-play overlay
- Share button
- Multiple music tracks or music selection
- Volume slider (just mute/unmute toggle)
- Separate music vs SFX controls
- Any new game mechanics
- Tile art changes (paintings are final)

---

## Technical Notes

- **Mobile breakpoint:** 768px. Below = mobile with scrollable board. Above = desktop (unchanged).
- **iOS Safari:** `-webkit-overflow-scrolling: touch` for smooth scrolling. Audio autoplay requires prior user interaction.
- **Viewport meta** already set: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`.
- **Theme color:** Currently `#9B8BB8` (purple). Icon background uses `#FDF8F0` (cream).
- **CSS-only approach preferred** for all visual changes. No new JS libraries.
- **Audio files:** Must be placed manually by Davis in `public/audio/` before Task 4 runs. Ralph should not attempt to download files from the internet.
