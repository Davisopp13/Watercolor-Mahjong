# Watercolor Mahjong — Enhancement PRD

## One-Liner

Transform Watercolor Mahjong from a flat tile-matching prototype into a polished, layered mahjong solitaire game with birthday celebration — ready to gift to Jennifer for her 60th birthday on February 17, 2026.

---

## The Problem

**Who has this problem?**
Jennifer (Davis's mama) — a 60-year-old who loves mahjong solitaire and watercolor painting. She's receiving this game as a personalized birthday gift.

**What's painful about the current situation?**
The game has a beautiful landing page and working match logic, but the actual gameplay falls short of what any mahjong solitaire player would expect. The board is nearly flat (only 2 z-levels instead of the standard 4-5 layer pyramid), there are no player assists (hint, undo), no feedback when she gets stuck, no progress indicator, tiles vanish without animation, and most critically — there's no birthday celebration moment when she wins. The gift has no payoff.

**Why does this matter enough to build something?**
This is a one-of-a-kind birthday present. Jennifer's own watercolor artwork is featured on every tile. The emotional impact of clearing the board and seeing a personal birthday message from her son is the entire point. Without polish, the game feels like a half-finished prototype instead of a thoughtful gift.

---

## Current State (What Already Works)

- Classic Turtle layout with 144 tiles (72 pairs)
- Tile selection with purple highlight border
- Match detection and removal (tiles disappear on valid pair)
- Open/blocked tile logic (left/right/top blocking)
- Jen's watercolor paintings as tile background images
- Traditional mahjong symbols overlaid (numbers + Chinese characters in suit colors)
- New Game and Shuffle buttons
- PWA support (installable, service worker registered)
- Hover animation (watercolor art scales up on hover)
- Beautiful landing page ("Begin Journey" with hydrangea tile + watercolor background)
- Vite + React SPA, Tailwind CSS, deployed on Vercel

### Technical Snapshot

- **Framework:** Vite + React (single bundle at `/assets/index-*.js`)
- **Styling:** Tailwind CSS utility classes
- **Tile structure:** `<button class="tile">` containing 4 child divs:
  1. Overlay div (pointer-events-none)
  2. Watercolor background div (background-image from `/assets/`, hover scale animation)
  3. Gradient overlay div (subtle shine/glass effect)
  4. Content div (number + Chinese character)
- **Tile size:** 46×61px
- **Board:** Absolute-positioned tiles within a container
- **Z-levels:** Currently only 0 and 1 (effectively flat)
- **Blocked state:** `blocked` CSS class on button element
- **Animations:** `pulse-slow` and `pulse-slow-reverse` keyframes exist
- **Images:** Only 2 `<img>` tags (logo area); tile art uses CSS `background-image`
- **Audio:** None
- **PWA:** Service worker registered, `theme-color: #9B8BB8`

---

## The Solution

**Core user loop:**
1. Jennifer opens the link on her birthday → sees a personal dedication
2. She plays mahjong solitaire with her own artwork on the tiles, with hints and undo when she needs help
3. She clears the board → a birthday celebration surprises her with a personal message from Davis

**That's it.** Everything else is v2.

---

## Success Metrics

**How will we know if this works?**
- Primary: Jennifer smiles when she sees the win celebration screen
- Secondary: She can complete at least one game without getting permanently stuck
- Secondary: She replays it at least once

**What does success look like on February 17?**
Jennifer opens the link, plays through a full game with assists available, and is surprised by the birthday message when she wins. She shows it to family at the birthday gathering.

---

## Scope: What's IN

### Task 1 — Proper 4-5 Layer Turtle Layout with Visual Depth [x]

**Context:** The board currently uses only 2 z-levels. Real mahjong solitaire uses 4-5 stacked layers forming a pyramid. This is the core game mechanic — clearing upper tiles to expose lower ones. Without proper depth, the game plays like a flat memory match rather than true mahjong solitaire.

**Requirements:**

Implement the standard Turtle layout with proper layer stacking:
- Layer 0 (ground): The wide base layer forming the classic turtle/cross shape. Approximately 86 tiles spread across 12 columns and varying rows.
- Layer 1: Approximately 40 tiles, centered on top of the base layer, covering a smaller rectangular area.
- Layer 2: Approximately 14 tiles, centered on top of layer 1.
- Layer 3: 4 tiles in a 2×2 square, centered on top of layer 2.
- Layer 4: 1 tile on the very top center.
- PLUS the two "wing" tiles — one on the far left edge and one on the far right edge of the base layer, offset vertically to sit at the midpoint. These are part of the classic Turtle silhouette.

Tile blocking rules (these are the standard mahjong solitaire rules — ensure they are correctly enforced):
- A tile is **open/playable** if: (a) no tile from any higher layer overlaps it from above, AND (b) it does NOT have tiles on BOTH its left AND right sides on the same layer.
- A tile is **blocked** if ANY higher-layer tile sits on top of it, OR if it has neighbors on both left and right.
- Tiles only need ONE side free (left or right) to be playable, as long as nothing is on top.

Visual depth rendering:
- Each successive layer should be offset by approximately 3-4px down and 3-4px to the right to create a 3D stacking illusion.
- Apply progressive drop shadows: tiles on higher layers get sharper, more prominent shadows. Base layer tiles have very subtle or no shadow.
- Blocked tiles should appear slightly dimmed or desaturated (reduce opacity to ~0.7 or apply a subtle gray overlay) compared to open/playable tiles. This gives the player an instant visual cue about what's clickable.
- Tile z-index must correspond to layer number so higher tiles render on top of lower tiles.

Board centering and scaling:
- The board should be centered horizontally and vertically in the viewport.
- Maintain the current tile size (~46×61px) or adjust as needed to fit the full 5-layer pyramid within the viewport without scrolling on desktop (1280px+ wide).
- On smaller viewports, the board container should scale down proportionally.

Solvability:
- When generating a new game, the tile placement algorithm must guarantee the board is solvable. The standard approach: place tiles in REVERSE (simulate solving the board by placing pairs from top to bottom), then shuffle the tile face values, ensuring every layout has at least one valid solution path.

**Acceptance criteria:**
- Board visually looks like a layered mahjong pyramid with clear depth.
- Clicking a blocked tile does nothing (or shows a subtle feedback like a brief shake).
- Removing a top-layer tile correctly unblocks the tile(s) beneath it, updating their visual state from dimmed to active.
- All 144 tiles are present across 5 layers.
- Every new game is solvable.

---

### Task 2 — Stuck Detection and No-Moves Handling [x]

**Context:** If no matching open pairs remain on the board, the player is stuck with zero feedback. She'll sit there scanning tiles indefinitely, not knowing the game is unwinnable. This is the #1 frustration point in mahjong solitaire.

**Requirements:**

After every pair removal, scan all currently open (unblocked) tiles to check whether at least one valid matching pair exists among them.

If no valid pairs exist, display a gentle modal/overlay:
- Title: "No more matches available"
- Body: "Don't worry — you can shuffle the remaining tiles or start fresh."
- Two buttons:
  - "🔀 Shuffle Tiles" — rearranges the face values of all remaining tiles in their current positions. The shuffle must produce a solvable arrangement (at minimum, ensure at least one valid pair exists among open tiles after the shuffle). Do NOT change tile positions/layers, only swap which face value is assigned to which remaining tile slot.
  - "🔄 New Game" — starts a completely new game.
- The modal should have the same soft, watercolor-themed aesthetic as the rest of the game: cream/off-white background, soft purple/pink accents, rounded corners, subtle shadow.

Also check for valid pairs at game start (after initial generation), as a safety net.

**Acceptance criteria:**
- The game never silently dead-ends. Whenever no valid open pairs remain, the player is notified within 1 second.
- Shuffle rearranges tiles and the game continues.
- New Game resets completely.
- Modal styling is consistent with the game's watercolor aesthetic.

---

### Task 3 — Win Celebration with Birthday Message [x]

**Context:** This is the emotional payoff of the entire gift. When Jennifer clears the board, she should feel like she's opening a birthday card from Davis. This moment is the reason the game exists.

**Requirements:**

Detect when all tiles have been cleared (0 tiles remaining on the board).

Trigger a full-screen celebration overlay with the following elements:

Background:
- Semi-transparent overlay that dims the empty board behind it.
- Soft, warm gradient background (cream to light lavender/pink).

Confetti/particle animation:
- Watercolor-themed particles: soft circles and paint-splatter shapes in pinks, purples, greens, golds, and blues (matching the palette of Jen's watercolor paintings).
- Particles should drift downward gently, not explode aggressively. Think "petals falling" not "party popper."
- Use CSS animations or a lightweight canvas animation. No heavy libraries.
- Animation should run continuously while the overlay is visible.

Text content (centered, layered):
- Line 1 (large, decorative): **"Happy 60th Birthday, Mama!"** — Use a warm serif or handwritten-style font. Suggested: the same serif font used in the "Watercolor Mahjong" title on the landing page. Color: the purple-pink gradient used in the landing page title.
- Line 2 (medium, italic): *"Your beautiful artwork made this game possible"*
- Line 3 (smaller, warm): "Love, Davis ❤️"
- Text should fade in sequentially: Line 1 appears first (0-0.5s), Line 2 fades in (0.5-1s), Line 3 fades in (1-1.5s).

Action button:
- "Play Again" button styled like the "Begin Journey" button (watercolor brush-stroke background in soft purple).
- Clicking it starts a new game and dismisses the overlay.

Optional bonus: Before the text appears, briefly show 3-4 of Jennifer's watercolor paintings (pulled from the tile background images) floating/drifting across the screen, then fading to make way for the text. This creates a moment of "look at your art!" before the birthday message.

**Acceptance criteria:**
- Clearing all tiles triggers the celebration immediately.
- The celebration feels warm and personal, not generic/gamey.
- Text is legible and beautifully styled.
- Confetti animation runs smoothly without performance issues.
- "Play Again" works and starts a fresh game.

---

### Task 4 — Hint System [x]

**Context:** Hint is the #1 player assist in every mahjong solitaire game. Without it, casual players get frustrated scanning 100+ tiles looking for matches. Jennifer is not a hardcore gamer — she needs this.

**Requirements:**

Add a "💡 Hint" button to the top control bar, alongside the existing "New Game" and "Shuffle" buttons. Style it consistently (consider a similar pill/button shape).

When clicked:
1. Find one valid matching pair among the currently open (unblocked) tiles.
2. Highlight both tiles with a pulsing glow animation — suggested: a soft gold or purple watercolor glow that pulses 2-3 times over ~2 seconds. Use a CSS `box-shadow` animation or an `outline` with a glow color.
3. The highlight should automatically fade after ~3 seconds, OR dismiss immediately when the player clicks any tile.
4. If no valid pairs exist (edge case — should be caught by Task 2's stuck detection), trigger the stuck detection modal instead.

Hint should be unlimited (no limit on uses). This is a relaxed birthday gift, not a competitive game. No penalty or counter for using hints.

If a tile is already selected (purple border) when the player clicks Hint, deselect it first, then show the hint.

**Acceptance criteria:**
- Hint button appears in the control bar with consistent styling.
- Clicking Hint visually highlights two matching open tiles.
- Highlight is clearly visible but not jarring (watercolor glow aesthetic).
- Hint auto-dismisses after ~3 seconds or on player interaction.
- Works correctly at all stages of the game (full board, nearly empty board).

---

### Task 5 — Undo (Last Move) [x]

**Context:** One wrong match can cascade into an unwinnable board. Undo gives a safety net so Jennifer doesn't have to restart the entire game over a single mistake.

**Requirements:**

Add an "↩ Undo" button to the top control bar.

Maintain a move history stack storing at least the last 5 moves. Each move record should include:
- The two tiles that were removed (their tile type/face value).
- Their exact board positions (column, row, layer).
- Which tiles, if any, became unblocked as a result of the removal (so they can be re-blocked on undo).

When Undo is clicked:
1. Pop the most recent move from the history stack.
2. Restore the two removed tiles to their original positions on the board, with their original face values.
3. Re-block any tiles that were unblocked by the original removal (restore their blocked state).
4. Visually animate the tiles reappearing — a quick fade-in or "pop" back into place (~300ms).
5. Update the remaining tile count (Task 6) accordingly.

The Undo button should be disabled (grayed out or hidden) when the history stack is empty (no moves to undo, i.e., at game start or after a New Game).

Undo should be unlimited (no limit on uses). Undo history should be cleared when starting a New Game or performing a Shuffle.

**Acceptance criteria:**
- Undo button appears in the control bar.
- Clicking Undo restores the last removed pair to the board in the correct position and layer.
- Tiles that were unblocked by the removal become blocked again.
- Undo button is disabled when no moves exist to undo.
- Multiple sequential undos work correctly (undo last 3-5 moves in order).

---

### Task 6 — Progress Indicator [x]

**Context:** With 144 tiles on the board, the player needs feedback about how close she is to winning. Without it, the game feels like an endless scan-and-match with no sense of progress.

**Requirements:**

Display a pairs-remaining counter in the header area, positioned between the title and the control buttons (or below the title, whichever looks cleaner).

Format: **"X pairs remaining"** where X counts down from 72 to 0.

Styling:
- Soft, muted text — not bold or attention-grabbing. Think light gray or muted purple.
- Font size smaller than the title but readable (~14-16px).
- Updates in real-time as pairs are matched.
- Counts back up when Undo is used.

Optional enhancement: a subtle thin progress bar beneath the counter, filling left-to-right as pairs are cleared. Use a watercolor-style gradient fill (soft purple to soft pink). Keep it very thin (~3-4px tall) so it doesn't dominate.

**Acceptance criteria:**
- Pairs remaining count is visible and accurate at all times.
- Count updates immediately on match and on undo.
- Count reads "0 pairs remaining" right before the win celebration triggers.
- Visual style is subtle and doesn't compete with the board.

---

### Task 7 — Match Removal Animation [x]

**Context:** Currently, matched tiles simply vanish from the board. There's no visual satisfaction or feedback that something good happened. Every match should feel like a small reward.

**Requirements:**

When two tiles are matched and about to be removed, play a removal animation before they disappear:

Recommended animation (watercolor dissolve):
1. Both tiles simultaneously receive a brief golden/warm glow (box-shadow pulse, ~200ms).
2. Tiles then fade out while slightly scaling down, as if dissolving into the paper background (~400ms).
3. Use `opacity: 0` + `transform: scale(0.8)` with an ease-out timing function.
4. After the animation completes (~600ms total), remove the tiles from the DOM and update game state (unblock covered tiles, update pairs counter).

The animation should NOT block interaction — once the animation starts, the game state is already updated internally. The animation is purely visual.

If the player rapidly matches pairs (e.g., clicking hint then immediately matching), animations can overlap without issues.

Also add a subtle selection animation for when the FIRST tile is clicked:
- Slight lift effect: `transform: translateY(-2px) scale(1.03)` with a slightly enhanced shadow.
- This replaces or supplements the current purple border to make the selected tile feel "picked up."
- Keep the purple border as well for clarity.

Also add feedback for mismatched second click (clicking a second tile that doesn't match the first):
- Both tiles briefly flash with a subtle red/pink tint (~300ms), then the selection clears.
- This tells the player "those don't match" without being punishing.

Also add feedback for clicking a blocked tile:
- A quick horizontal shake animation (~200ms, 2-3px displacement).
- This tells the player "you can't select this one yet."

**Acceptance criteria:**
- Matched tiles dissolve/fade out smoothly before disappearing.
- Selected tile has a visible lift effect.
- Mismatched pair gives clear but gentle feedback.
- Blocked tile click gives a shake.
- Animations are smooth at 60fps, no jank.
- All animations are CSS-based (no JS animation libraries needed).

---

### Task 8 — Birthday Dedication Screen [x]

**Context:** The landing page is beautiful but generic ("A Meditative Journey"). Between the landing page and the game board, there should be a personal birthday moment that sets up the emotional context before she starts playing.

**Requirements:**

After clicking "Begin Journey" on the landing page, show an intermediate dedication screen (instead of going directly to the game board).

Dedication screen content:
- Soft, warm background consistent with the landing page (cream/off-white with faded watercolor elements).
- Text centered vertically and horizontally:
  - Line 1 (large, decorative): **"Happy 60th Birthday, Mama"** — Same font/styling as landing page title.
  - Line 2 (medium): "This game features your beautiful watercolor paintings as the tiles."
  - Line 3 (medium): "Each match you make is a little celebration of your art."
  - Line 4 (small, warm): "Love, Davis ❤️"
- Button at the bottom: **"Start Playing"** — same watercolor brush-stroke button style as "Begin Journey."
- Text should fade in gently, either all at once or sequentially (lines appearing one after another over ~2 seconds).

Clicking "Start Playing" transitions to the game board (with a smooth fade transition, ~500ms).

**Acceptance criteria:**
- Dedication screen appears between landing page and game.
- Text is personal, warm, and legible.
- "Start Playing" transitions smoothly to the game.
- Screen is centered and looks good on both desktop and mobile viewports.

---

### Task 9 — Mobile Responsiveness Pass [x]

**Context:** Jennifer will likely open this on her phone first (birthday text with a link). The game needs to be playable on mobile.

**Requirements:**

Test and fix layout at these viewport widths:
- 375px (iPhone SE / iPhone standard)
- 390px (iPhone 14/15)
- 768px (iPad portrait)

Board scaling:
- On viewports under 768px, the board should scale down to fit the screen width with small horizontal margins (~8px each side).
- Use CSS `transform: scale()` on the board container to shrink the entire board proportionally, rather than resizing individual tiles (which would break the layout geometry).
- The scale factor should be calculated as: `min(1, (viewportWidth - 16) / boardNativeWidth)`.

Controls:
- Control buttons (New Game, Shuffle, Hint, Undo) should wrap to a second row or become icon-only on small screens.
- Minimum tap target: 44×44px for all interactive elements (Apple HIG standard).

Progress indicator:
- Should remain visible and not overlap with controls on mobile.

Tile interaction:
- Ensure tap works reliably (no hover-dependent interactions blocking touch).
- Remove or reduce hover effects on touch devices (`@media (hover: hover)` for hover styles).

Viewport meta tag is already set correctly: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`.

**Acceptance criteria:**
- Game is fully playable on a 375px wide viewport.
- All tiles are visible without horizontal scrolling.
- All buttons are tappable with a finger.
- No elements overlap or get cut off.
- Board scales smoothly on resize.

---

## Scope: What's OUT

**Explicitly NOT building:**
- Multiple board layouts (stick with Turtle for now)
- Sound effects / audio
- Timer or time-based scoring
- Star rating system
- Leaderboards or score persistence
- User accounts or save/load
- Difficulty levels
- Settings page
- Tile set customization
- Replacing mahjong symbols with watercolor-only matching (requires 36+ unique images)
- Share button / social features
- Tutorial / how-to-play overlay

**Why not?** None of these are needed for Jennifer to play and enjoy the game on her birthday. They can all be added later if Davis wants to keep building.

---

## Technical Approach

**Stack (no changes):**
- Vite + React (existing)
- Tailwind CSS (existing)
- Vercel (existing deployment)
- No database needed
- No new dependencies required (all animations should be CSS-based)

**Key technical decisions:**
- All animations CSS-only (keyframes + transitions). No animation libraries.
- Confetti on win screen: lightweight CSS or canvas-based. If CSS is insufficient, a simple canvas confetti is acceptable but keep it under 100 lines.
- Board solvability: implement reverse-placement algorithm during tile generation.
- State management: React state is sufficient (useState/useReducer). No Redux or external state library.

**What could go wrong:**
1. Stacking depth (Task 1) requires reworking the tile placement algorithm and blocking logic. This is the highest-risk task. If the current layout generation code is deeply coupled to the flat 2-layer approach, it may need significant refactoring.
2. Solvability guarantee may be tricky. Fallback: if solvability can't be guaranteed algorithmically in time, ensure the shuffle function can always produce at least one valid move (weaker but acceptable).

---

## Open Questions

- [x] Should tile art be the matching element instead of symbols? **Decision: No — keep current approach (symbols + art background). Not enough unique images for 36 pairs, and traditional symbols work.**
- [x] Should hints be limited? **Decision: No — unlimited hints. This is a relaxed gift.**
- [x] Should there be a timer? **Decision: No — untimed, zero pressure.**

---

## Timeline

**Hard deadline: Monday, February 17, 2026 (Jennifer's 60th birthday)**

All tasks are designed to be executed sequentially by ralph.sh (Claude Code CLI agent). Each task should be completable in approximately 30-90 minutes of agent time.

- **Task 1:** Proper 4-5 layer Turtle layout with visual depth — CRITICAL, do this first
- **Task 2:** Stuck detection — do immediately after Task 1 since new layout needs validation
- **Task 3:** Win celebration with birthday message — the emotional payoff
- **Task 4:** Hint system
- **Task 5:** Undo system
- **Task 6:** Progress indicator
- **Task 7:** Match removal + interaction animations
- **Task 8:** Birthday dedication screen
- **Task 9:** Mobile responsiveness pass — do last as a final polish sweep

**If running out of time, the minimum shippable set is Tasks 1 + 2 + 3 + 4.** The game needs depth to feel real (1), can't silently dead-end (2), needs the birthday moment (3), and Jennifer needs hints to not get frustrated (4).

---

## Launch Plan

**Initial user:** Jennifer (Davis's mama) — she receives the link on her birthday, February 17.

**How to share:** Direct link via birthday text message or card. URL: https://watercolor-mahjong.vercel.app/

**First feedback loop:** Watch her play at the birthday gathering. Note where she gets confused, stuck, or delighted.

---

## V2 Backlog

- Additional board layouts (Butterfly, Pyramid, Simple)
- Sound effects (tile click, match chime, celebration music) with mute toggle
- Watercolor-only tile matching (remove symbols, match by painting)
- Difficulty levels (Easy = fewer tiles, Medium = standard, Hard = complex layout)
- How-to-play tutorial overlay for first-time players
- Star rating per game (based on hints used / shuffles used)
- Daily or weekly puzzle mode
- Share button (share score to text/social)
- Ambient background music (lo-fi or gentle piano)
- More of Jennifer's artwork (she paints more → more tile varieties)
- Custom themes (seasonal: spring flowers, autumn leaves, holiday)

**Remember:** These stay here until Jennifer proves we need them.
