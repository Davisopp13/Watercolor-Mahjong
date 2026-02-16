# Watercolor Mahjong — Final Polish PRD

## One-Liner

Final refinements to make Watercolor Mahjong feel like a personal, polished birthday gift — putting Jen's paintings front and center, making gameplay crystal clear, and adding ambient audio.

---

## The Problem

**Who has this problem?**
Jennifer (Davis's mom) — turning 60 tomorrow (February 17, 2026). She's receiving this custom mahjong solitaire game featuring her own watercolor paintings as a birthday gift.

**What's painful about the current situation?**
Ralph built out the core game overnight and it's close to ready. Three issues remain: (1) The tiles still show traditional Chinese mahjong symbols overlaying the watercolor art — the paintings are buried as backgrounds when they should BE the game. (2) It's hard to tell which tiles are playable vs blocked — they all look roughly the same. (3) The game is silent, which makes it feel less alive and polished than the mahjong apps she's used to.

**Why does this matter enough to build something?**
This is tomorrow. These three fixes turn "neat prototype" into "thoughtful, polished gift she'll show everyone at the party."

---

## Current State (What Ralph Already Built)

Ralph completed the initial PRD tasks overnight. The game now has:

- ✅ Proper 4-5 layer Turtle layout with visual depth
- ✅ Stuck detection and no-moves handling
- ✅ Win celebration with birthday message
- ✅ Hint system
- ✅ Undo system
- ✅ Progress indicator
- ✅ Match removal animations
- ✅ Birthday dedication screen
- ✅ Mobile responsiveness
- ✅ Landing page, PWA support, Vercel deployment

**What remains:** Tile redesign, playable tile clarity, and audio.

---

## The Solution

**Core user loop (unchanged):**
1. Jennifer opens the link on her birthday → sees a personal dedication
2. She plays mahjong solitaire matching her own watercolor paintings, with clear visual guidance on which tiles are playable
3. She clears the board → birthday celebration surprises her

---

## Success Metrics

**How will we know if this works?**
- Primary: Jennifer can look at the board and immediately identify matching tiles by the paintings without needing to decode symbols
- Secondary: She never clicks a blocked tile wondering why nothing happened
- Secondary: The audio makes her smile (or at least doesn't blast her in front of family)

**What does success look like tomorrow?**
She opens it, instantly understands "oh I'm matching my paintings!", plays through a game with assists, and hits the birthday celebration screen. Zero confusion about what's clickable.

---

## Scope: What's IN

### [x] Task 1 — Tile Redesign: Paintings First, Symbols Gone

**Context:** The current tiles show traditional mahjong symbols (large Chinese characters and numbers) overlaid on top of the watercolor paintings. The paintings — which are the entire emotional hook of this gift — are reduced to faded backgrounds. Jennifer shouldn't need to know what 八萬 means to play a game featuring her own art. The paintings should be the primary visual element players scan and match on.

**Tile math:**
- 9 unique watercolor paintings (suits)
- Each painting has 4 numbered variants (1, 2, 3, 4)
- 9 paintings × 4 variants = 36 unique tile types
- Each tile type appears exactly 4 times on the board
- 36 × 4 = 144 tiles total (standard mahjong solitaire board)

**Tile face layout:**
- The watercolor painting fills the entire tile face — edge to edge, no margin, no border inset. The painting IS the tile. It should be displayed at maximum size within the tile bounds, maintaining aspect ratio and using `object-fit: cover` or `background-size: cover` to fill without distortion.
- Remove ALL Chinese characters (萬, 筒, 索, 龍, 風, etc.) from the tile face entirely. No traditional mahjong symbols anywhere.
- Remove the large colored numbers that currently overlay the art.
- Add a small variant number (1, 2, 3, or 4) in the **bottom-right corner** of the tile. This number differentiates variants within the same painting.
  - Style: ~10-12px font size, semi-bold weight.
  - Place it inside a small semi-transparent white pill/badge (`background: rgba(255, 255, 255, 0.75)`, `border-radius: 8px`, `padding: 1px 5px`).
  - This makes the number readable over any painting color without competing for attention.
  - The number is a secondary confirmation — players primarily match by recognizing the painting, then glance at the corner number to confirm.

**Matching rules:**
- Two tiles match if and only if they share the **same painting AND the same variant number**.
- Example: "Hydrangea 3" matches with the other "Hydrangea 3" — NOT with "Hydrangea 2" or "Sunflower 3."
- Each tile type has exactly 4 copies on the board, forming 2 matchable pairs (same as standard mahjong: you can match either copy with either other copy of the same type).

**Painting assignment:**
- Map each of the 9 watercolor image assets to a suit number (0-8).
- Within each suit, assign variant numbers 1-4 to the four tiles, then duplicate each variant once more to get 4 copies per variant... 

Actually, let me correct the math to match standard mahjong tile distribution:

**Corrected tile math (standard mahjong solitaire distribution):**

In traditional mahjong solitaire, there are 144 tiles:
- 3 suits (Dots, Bamboo, Characters) × 9 ranks × 4 copies = 108 tiles
- 4 Winds × 4 copies = 16 tiles
- 3 Dragons × 4 copies = 12 tiles
- 4 Flowers (1 copy each) = 4 tiles (match any flower to any flower)
- 4 Seasons (1 copy each) = 4 tiles (match any season to any season)
- Total: 108 + 16 + 12 + 4 + 4 = 144

**Simplified model using 9 paintings:**
- 9 paintings, each with 4 variants = 36 unique tile types
- Each unique tile type appears exactly **4 times** on the board
- 36 × 4 = 144 tiles
- Two tiles match when they have the **same painting + same variant number**
- This gives 72 pairs total (144 ÷ 2), which is standard

**Image assets:**
- The 9 watercolor painting images should already exist in the `/assets/` or public directory (or will be added by Davis before this task runs).
- Name them consistently: `painting-1.webp` through `painting-9.webp` (or whatever the existing naming convention is in the project).
- If the current project already maps tile types to background images, update that mapping to use the 9 paintings instead of the traditional mahjong symbol set.

**Acceptance criteria:**
- Every tile on the board prominently shows one of Jennifer's watercolor paintings as the full tile face.
- No Chinese characters or traditional mahjong symbols appear anywhere on any tile.
- A small variant number (1-4) appears in the bottom-right corner inside a subtle white pill badge.
- Tiles are easily distinguishable: different paintings look different, and the variant number is legible.
- Matching logic works correctly: only tiles with same painting + same number can be matched.
- All 144 tiles are accounted for: 9 paintings × 4 variants × 4 copies.

---

### [x] Task 2 — Playable Tile Visibility

**Context:** It's hard to tell which tiles are currently open/playable and which are blocked. The visual difference between the two states needs to be dramatic enough to read instantly at a glance, especially for someone who might not know mahjong rules intuitively. This is the difference between "fun puzzle" and "frustrating guessing game."

**Requirements for OPEN (playable) tiles:**
- Full opacity (`opacity: 1`).
- A subtle warm drop shadow to make them feel "lifted" off the board: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)`.
- Slight upward offset: `transform: translateY(-1px)`.
- On hover (desktop only — gate with `@media (hover: hover)`):
  - Slight additional lift: `transform: translateY(-3px) scale(1.02)`.
  - Enhanced shadow: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)`.
  - A subtle bright border or soft glow to confirm "yes, you can click this": `outline: 2px solid rgba(155, 139, 184, 0.5)` (using the existing purple theme color).
  - Smooth transition: `transition: all 0.2s ease`.
- Cursor: `pointer`.

**Requirements for BLOCKED (not playable) tiles:**
- Reduced opacity: `opacity: 0.5`.
- Apply a slight desaturation: `filter: grayscale(30%)`.
- Flatten the shadow to almost nothing: `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)`.
- No transform offset (they sit flat against the board).
- On hover: **no visual change**. No lift, no glow, no scale. Completely inert.
- Cursor: `default` (not pointer — signals non-interactive).
- If clicked: subtle shake animation (the one Ralph may have already added from the original PRD). Quick horizontal oscillation, ~200ms: `@keyframes shake { 0%, 100% { translateX(0) } 25% { translateX(-3px) } 75% { translateX(3px) } }`.

**The contrast must be obvious.** If you squint at the board, the playable tiles should visually "pop" out of the pile while blocked tiles fade into the background. Think of it like open tiles are on a lit stage and blocked tiles are in the dim audience.

**Transition between states:**
- When a tile becomes unblocked (because tiles above it or beside it were removed), it should transition smoothly from blocked to open styling over ~300ms. This creates a satisfying "tiles waking up" effect as the player clears the board.

**Acceptance criteria:**
- At a glance, any player can immediately identify which tiles are playable without clicking.
- Blocked tiles are visually distinct: dimmer, flatter, desaturated.
- Open tiles feel lively: full color, lifted, responsive to hover.
- Transition from blocked → open is animated smoothly.
- Hover effects only apply to open tiles on devices with hover capability.
- Blocked tiles show no hover response and use default cursor.

---

### [ ] Task 3 — Music and Sound Effects

**Context:** Every polished mahjong app has ambient audio. The game currently plays in complete silence, which makes it feel less like a relaxing experience and more like staring at a static webpage. Gentle audio transforms the feel from "web page" to "gift experience." This is nice-to-have, but it elevates the whole thing.

**Audio assets to source:**
Find and download royalty-free audio files. Suggested sources: pixabay.com/music, freesound.org, or use Web Audio API to generate simple tones. All audio must be royalty-free / Creative Commons.

Required sounds:
1. **Ambient background loop** — Gentle, relaxing music. Soft piano, acoustic guitar, or nature sounds (light rain, garden birds). Should feel meditative and warm, matching the "Meditative Journey" tagline. Duration: 1-3 minutes, seamless loop. Format: mp3, compressed to keep file size small (<500KB if possible).
2. **Tile select** — A soft, short click or tap. Think wooden tile being picked up. Duration: ~100-200ms.
3. **Successful match** — A gentle chime, soft bell, or pleasant two-note ascending tone. Warm and rewarding. Duration: ~300-500ms.
4. **Mismatch** — A subtle low tone or soft "nope" sound. Not harsh or punishing. Duration: ~200-300ms.
5. **Win celebration** — A longer celebratory sound. Gentle music box melody, wind chime cascade, or ascending chord progression. Warm and emotional, not generic party horn. Duration: ~3-5 seconds. This plays when the birthday celebration overlay appears.

**Implementation:**

Audio engine:
- Use the Web Audio API or simple HTML5 `<Audio>` elements. No heavy audio libraries.
- Preload all sound effect files on game load so there's no delay on first trigger.
- Background music should use a looping `<Audio>` element with `loop: true`.
- Sound effects should be fire-and-forget (can overlap if matches happen rapidly).

Mute/unmute toggle:
- Add a small speaker icon button in the top-right corner of the game header (or near the existing control buttons).
- Icon states: 🔊 (unmuted) / 🔇 (muted). Use simple SVG icons or unicode characters.
- Clicking toggles ALL audio on/off (background music + sound effects together).
- **Default state: MUTED.** This is critical — she will likely open the link around family or in a quiet setting. Audio should be opt-in, not surprise-blast.
- Persist the mute preference in `localStorage` so it survives page refreshes. Key: `watercolor-mahjong-muted`, value: `true` / `false`.

Trigger points:
- Background music: starts playing when the game board first renders (respecting mute state). If muted, music is loaded but paused — it begins when the user unmutes.
- Tile select sound: plays when a playable tile is clicked/tapped (first selection).
- Match sound: plays when two tiles are successfully matched (at the moment of the match animation starting).
- Mismatch sound: plays when a second selected tile doesn't match the first.
- Win sound: plays when the celebration overlay appears, instead of (or layered on top of) the background music. Fade out background music over ~1 second, then play win sound.
- No sound on: clicking blocked tiles (the shake animation is sufficient feedback), using Hint, using Undo, using Shuffle, opening menus/modals.

Volume levels:
- Background music: 0.3 (30% volume) — subtle, not dominant.
- Sound effects: 0.5 (50% volume) — noticeable but not loud.
- Win celebration: 0.6 (60% volume) — slightly more prominent for the special moment.

**Acceptance criteria:**
- Mute toggle is visible and functional with correct icon states.
- Game defaults to muted on first visit.
- Unmuting starts background music and enables sound effects.
- Each trigger point plays the correct sound at the right moment.
- Audio doesn't lag or pop on first play.
- Background music loops seamlessly.
- Mute preference persists across page refreshes.
- All audio files are royalty-free.

---

## Scope: What's OUT

**Explicitly NOT building:**
- Volume slider (just mute/unmute toggle)
- Separate music vs SFX controls
- Multiple music tracks / music selection
- Spatial audio or panning effects
- Additional board layouts
- Timer or scoring changes
- Any new game mechanics
- Tutorial / how-to-play
- Share button

**Why not?** Ship day is tomorrow. These three tasks are all that stand between the current build and a polished gift.

---

## Technical Approach

**Stack (unchanged):**
- Vite + React
- Tailwind CSS
- Vercel deployment

**Key decisions:**
- Tile redesign is a data mapping change + CSS update. The tile component structure (button with child divs) stays the same — we're just changing what renders inside.
- Playable tile visibility is pure CSS. No logic changes needed — the `blocked` class already exists, we're just making the visual difference more dramatic.
- Audio uses native Web Audio API / HTML5 Audio. No libraries. Keep total audio asset size under 2MB.
- All audio files go in the `/public/audio/` directory so they're served statically.

**What could go wrong:**
1. The 9th painting asset might not be in the repo yet. Davis will add it before running Task 1. If it's missing, Ralph should use 8 paintings and adjust tile count to 128 (32 unique types × 4 copies), which still works with a slightly smaller board layout.
2. iOS Safari has autoplay restrictions on audio. Background music won't start until the user interacts with the page. Since the game requires clicking "Begin Journey" → "Start Playing" before gameplay, the user will have interacted before music needs to play. Ensure the audio context is created/resumed on one of those button clicks.

---

## Open Questions

- [x] Paintings only or keep symbols? **Decision: Paintings only. Ditch all Chinese characters and traditional symbols.**
- [x] How many paintings needed? **Decision: 9 paintings × 4 variants × 4 copies = 144 tiles.**
- [x] Audio default state? **Decision: Muted by default. Opt-in.**

---

## Timeline

**Hard deadline: Monday, February 17, 2026 (tomorrow)**

- **Task 1:** Tile redesign — paintings first, remove symbols. **PRIORITY 1** (this changes how the game feels most dramatically).
- **Task 2:** Playable tile visibility — open vs blocked contrast. **PRIORITY 2** (critical gameplay clarity).
- **Task 3:** Music and sound effects. **PRIORITY 3** (nice-to-have polish, do if time allows after 1 and 2 are solid).

**Minimum shippable:** Tasks 1 + 2. If Task 3 doesn't make it in time, the game is still a great gift. Audio is the cherry on top, not the cake.

---

## Launch Plan

**Initial user:** Jennifer — tomorrow, February 17, 2026, her 60th birthday.

**How to share:** Direct link via birthday text or card: https://watercolor-mahjong.vercel.app/

**First feedback loop:** Watch her play at the birthday gathering. Does she immediately recognize the paintings? Does she understand which tiles to click? Does she smile?

---

## V2 Backlog

- Additional board layouts (Butterfly, Pyramid, Simple)
- Difficulty levels (fewer tiles for easy, more layers for hard)
- Multiple music tracks / ambient sound selection
- Volume slider (separate music and SFX controls)
- How-to-play tutorial overlay
- More of Jennifer's artwork as she paints new pieces
- Seasonal themes (spring, autumn, holiday variants)
- Score tracking / personal bests
- Daily puzzle mode
- Share button for results

**Remember:** These stay here until Jennifer proves we need them.
