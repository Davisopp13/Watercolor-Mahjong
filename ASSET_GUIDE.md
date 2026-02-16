# Watercolor Mahjong - Asset Guide

## Overview

This guide documents Mama's watercolor paintings and how they'll be used in the game. All artwork is original, painted by Jen (Mama).

---

## The Collection

### Painting Inventory

| ID | File | Subject | Primary Colors | Dimensions/Notes |
|----|------|---------|----------------|------------------|
| 1 | `tiles.jpg` | Hydrangea | Blue, purple, green | Hero piece, scanned |
| 2 | `tiles_1.jpg` | Peony in brown bottle | Soft pink, brown, green | Vintage vibe |
| 3 | `tiles_2.jpg` | Lilac with basil/herbs | Purple, bright green | Vertical composition |
| 4 | `tiles_3.jpg` | Sunflower | Yellow, orange, green | Bold, high contrast |
| 5 | `tiles_4.jpg` | Mixed bouquet with bow | Multi-color (orange, yellow, pink, purple) | Most colorful |
| 6 | `tiles_5.jpg` | Daisies in yellow pitcher | Green, white, yellow | Warm, homey |
| 7 | `tiles_6.jpg` | Wildflowers in blue bottle | Aqua, white, purple | Delicate, airy |
| 8 | `tiles_8.jpg` | Pink rose | Coral pink, green | Bold, classic |
| 9 | `tiles_7.jpg` | Yellow tulips in vase | Yellow, green, terracotta | Clean, springy |

**Also available:**
- `tile-hydrangea.png` — High-quality scan of hydrangea (use this version)

---

## Asset Mapping

### Title Screen

**Primary:** Mixed Bouquet (`tiles_4.jpg`)
- Colorful, celebratory, sets the tone for the game
- Position: Centered, perhaps with slight transparency or overlay
- Text overlay: "Watercolor Mahjong" in elegant serif or script font

**Alternative:** Hydrangea (`tile-hydrangea.png`)
- More subdued, elegant option
- Matches the existing lavender UI palette

### Flower Tiles (8 tiles in American Mahjong set)

Each flower tile gets a unique painting:

| Flower Tile # | Painting | File | Crop Notes |
|---------------|----------|------|------------|
| Flower 1 | Hydrangea | `tile-hydrangea.png` | Crop to bloom only, or use full |
| Flower 2 | Sunflower | `tiles_3.jpg` | Crop to flower head |
| Flower 3 | Pink Rose | `tiles_8.jpg` | Crop to bloom + few leaves |
| Flower 4 | Yellow Tulips | `tiles_7.jpg` | Crop to single tulip or cluster |
| Flower 5 | Lilac | `tiles_2.jpg` | Crop to purple bloom section |
| Flower 6 | Daisies | `tiles_5.jpg` | Crop to flower cluster (exclude pitcher) |
| Flower 7 | Peony | `tiles_1.jpg` | Crop to pink bloom (exclude bottle) |
| Flower 8 | Wildflowers | `tiles_6.jpg` | Crop to flower tops |

**Tile treatment:**
- Paintings as background at 20-40% opacity
- High-contrast flower number overlay (1-8)
- White or cream tile base
- Subtle border

### Win/Celebration Screen

**Primary:** Mixed Bouquet (`tiles_4.jpg`)
- Full painting displayed prominently
- "Mahjong!" text overlay
- Confetti or sparkle effect optional (v2)

**Alternative:** Rotate through all paintings randomly on each win

### Game Board Background

**Option A: Single painting**
- Hydrangea bloom cropped and tiled subtly
- Very low opacity (10-15%) as texture

**Option B: Subtle paper texture**
- Extract the cream/white background from any scan
- Apply as paper grain texture
- Warm, natural feel

**Option C: Color wash**
- Soft gradient using palette colors
- Watercolor edge effect at borders

**Recommendation:** Start with Option C (simplest), enhance with Option A or B if time permits.

### Player Hand Rail

- Soft watercolor wash in lavender/blue tones
- Could use cropped edge of hydrangea painting
- Creates visual separation between "your space" and the table

### UI Accents

| Element | Treatment |
|---------|-----------|
| Buttons | Subtle watercolor texture on hover |
| Modal backgrounds | Paper texture from scans |
| Dividers | Painted brush stroke effect |
| Card/hand display border | Soft watercolor edge |

---

## Color Palette

### Primary Colors (from paintings)

```css
:root {
  /* Blues */
  --watercolor-blue-light: #A8C8E8;
  --watercolor-blue-medium: #7BA3D4;
  --watercolor-aqua: #6ECFCF;
  
  /* Purples */
  --watercolor-purple-light: #B8A5D0;
  --watercolor-purple-medium: #9B8BB8;
  
  /* Greens */
  --watercolor-green-light: #98D98C;
  --watercolor-green-medium: #7BC47B;
  
  /* Yellows/Oranges */
  --watercolor-yellow: #F5C842;
  --watercolor-orange: #E8A832;
  
  /* Pinks */
  --watercolor-pink-light: #F5B8C8;
  --watercolor-pink-medium: #E87B98;
  
  /* Warm Neutrals */
  --watercolor-cream: #FDF8F0;
  --watercolor-tan: #D4B896;
  --watercolor-brown: #C4A882;
}
```

### UI Application

| Element | Color | Variable |
|---------|-------|----------|
| Page background | Warm cream | `--watercolor-cream` |
| Primary accent | Soft purple | `--watercolor-purple-light` |
| Secondary accent | Soft blue | `--watercolor-blue-light` |
| Player hand rail | Light purple wash | `--watercolor-purple-light` @ 30% |
| Buttons (default) | Medium blue | `--watercolor-blue-medium` |
| Buttons (hover) | Medium purple | `--watercolor-purple-medium` |
| Success/Win | Green | `--watercolor-green-medium` |
| Warning/Alert | Orange | `--watercolor-orange` |
| Text (dark) | Brown | `--watercolor-brown` or `#4A4A4A` |

### Tile Colors by Suit

To maintain readability while honoring the watercolor aesthetic:

| Suit | Symbol Color | Background Tint |
|------|--------------|-----------------|
| Dots | `#2B5797` (deep blue) | `--watercolor-blue-light` @ 15% |
| Bams | `#2D7D46` (forest green) | `--watercolor-green-light` @ 15% |
| Craks | `#C41E3A` (crimson) | `--watercolor-pink-light` @ 15% |
| Winds | `#4A4A4A` (charcoal) | `--watercolor-cream` |
| Dragons | Varies (Red/Green/White) | `--watercolor-cream` |
| Flowers | Full color paintings | See flower tile mapping |
| Jokers | `#7B3F9E` (purple) | `--watercolor-purple-light` @ 20% |

---

## Implementation Notes

### File Preparation

Before integrating, prepare each painting:

1. **Crop** — Remove excess white space, center the subject
2. **Resize** — Create multiple sizes:
   - `*-full.jpg` — Original resolution for title/win screens
   - `*-tile.jpg` — ~200x300px for flower tiles
   - `*-thumb.jpg` — ~100x150px for smaller displays
3. **Optimize** — Compress for web (aim for <100KB per tile image)

### Suggested Directory Structure

```
/public
  /assets
    /watercolors
      /full
        hydrangea.png
        sunflower.jpg
        rose.jpg
        ...
      /tiles
        flower-1.jpg
        flower-2.jpg
        ...
      /textures
        paper-grain.jpg
        wash-purple.png
        wash-blue.png
```

### CSS Implementation Examples

**Tile with watercolor background:**
```css
.tile-flower-1 {
  background-image: url('/assets/watercolors/tiles/flower-1.jpg');
  background-size: cover;
  background-position: center;
}

.tile-flower-1::after {
  content: '1';
  /* High contrast overlay for number */
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4A4A4A;
  text-shadow: 0 0 4px white;
}
```

**Paper texture background:**
```css
.game-board {
  background-color: var(--watercolor-cream);
  background-image: url('/assets/watercolors/textures/paper-grain.jpg');
  background-blend-mode: multiply;
  background-size: cover;
}
```

**Watercolor wash effect:**
```css
.player-hand-rail {
  background: linear-gradient(
    135deg,
    rgba(184, 165, 208, 0.3) 0%,
    rgba(168, 200, 232, 0.2) 100%
  );
  border-top: 3px solid var(--watercolor-purple-light);
}
```

---

## Accessibility Considerations

- **Contrast:** All tile symbols must meet WCAG AA contrast ratios against watercolor backgrounds
- **Fallback:** If images fail to load, show solid color tile with clear symbol
- **Opacity:** Keep watercolor backgrounds subtle (15-30% opacity) to not interfere with gameplay
- **Testing:** Test with Mama to ensure she can easily distinguish all tiles

---

## Credits

All watercolor artwork by **Jen** (Mama)

Consider adding a credits screen or "About" section in the game:

> *"Artwork featured in this game was painted by Jen. Watercolor Mahjong was created with love for her 60th birthday by her son Davis."*

---

## Quick Reference

### What goes where:

| Game Element | Asset |
|--------------|-------|
| Title screen | Mixed bouquet (`tiles_4.jpg`) |
| Flower tile 1 | Hydrangea |
| Flower tile 2 | Sunflower |
| Flower tile 3 | Pink rose |
| Flower tile 4 | Yellow tulips |
| Flower tile 5 | Lilac |
| Flower tile 6 | Daisies |
| Flower tile 7 | Peony |
| Flower tile 8 | Wildflowers |
| Win screen | Mixed bouquet or random rotation |
| Board background | Paper texture + color wash |
| Player rail | Purple/blue gradient wash |
