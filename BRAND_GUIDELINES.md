# Watercolor Mahjong — Brand Guidelines

---

## Brand Essence

**What it is:** A personalized Mahjong Solitaire game featuring original watercolor artwork by Jen.

**What it feels like:** Handmade, warm, elegant, personal. Like receiving a handwritten letter instead of an email.

**Core idea:** "A game wrapped in Mama's art."

---

## Name & Tagline

**Primary name:** Watercolor Mahjong

**Tagline options:**
- "Painted with love"
- "A game as unique as you"
- "Featuring original artwork by Jen"

**Usage:** Always "Watercolor Mahjong" — not "Watercolour" (American spelling), not "WaterColor" (no camel case), not "Watercolor Mah Jong" (one word).

---

## Color Palette

### Primary Colors (from Mama's paintings)

| Name | Hex | CSS Variable | Use |
|------|-----|--------------|-----|
| Lavender Mist | `#B8A5D0` | `--color-lavender` | Primary accent, buttons, highlights |
| Hydrangea Blue | `#7BA3D4` | `--color-blue` | Secondary accent, links |
| Warm Cream | `#FDF8F0` | `--color-cream` | Backgrounds, tile base |
| Soft Rose | `#E87B98` | `--color-rose` | Alerts, selected states |
| Garden Green | `#7BC47B` | `--color-green` | Success states, wins |

### Supporting Colors

| Name | Hex | CSS Variable | Use |
|------|-----|--------------|-----|
| Sunflower Gold | `#F5C842` | `--color-gold` | Warm accents |
| Aqua Glass | `#6ECFCF` | `--color-aqua` | Cool accents |
| Paper Tan | `#D4B896` | `--color-tan` | Borders, shadows |
| Soft Charcoal | `#4A4A4A` | `--color-charcoal` | Primary text |

### CSS Variables

```css
:root {
  /* Primary */
  --color-lavender: #B8A5D0;
  --color-blue: #7BA3D4;
  --color-cream: #FDF8F0;
  --color-rose: #E87B98;
  --color-green: #7BC47B;
  
  /* Supporting */
  --color-gold: #F5C842;
  --color-aqua: #6ECFCF;
  --color-tan: #D4B896;
  --color-charcoal: #4A4A4A;
  
  /* Semantic */
  --color-background: var(--color-cream);
  --color-text: var(--color-charcoal);
  --color-primary: var(--color-lavender);
  --color-success: var(--color-green);
  --color-selected: var(--color-rose);
}
```

### Color Principles

- Always feel soft, never harsh
- Pastels dominate; bold colors are accents only
- White space is warm cream, not stark white
- Shadows are soft and diffused, not sharp

---

## Typography

### Font Stack

**Primary font (body):** Clean, slightly warm sans-serif
```css
font-family: 'Inter', 'Nunito', 'Quicksand', system-ui, sans-serif;
```

**Display font (titles):** Elegant serif or script
```css
font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
/* Or for script: */
font-family: 'Dancing Script', cursive;
```

### Type Scale

| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| Game title | 3rem (48px) | 1.75rem (28px) | 600 or script |
| Section headers | 1.5rem (24px) | 1.25rem (20px) | 600 |
| Body text | 1rem (16px) | 1rem (16px) | 400 |
| Button text | 0.875rem (14px) | 0.875rem (14px) | 500 |
| Tile symbols | 1.25rem (20px) | 0.875rem (14px) | 700 |

### Type Principles

- Generous line height (1.5+)
- Never all caps except single-word buttons ("SHUFFLE")
- Text should feel breathable, not cramped

---

## Imagery

### Source

All decorative imagery comes from Jen's watercolor paintings. No stock photos, no generic illustrations.

### Hero Images

| Painting | Use |
|----------|-----|
| Hydrangea | Title screen, app icon |
| Mixed Bouquet | Win celebration |
| Individual flowers | Flower/Season tiles |

### Treatment

- Full paintings for feature moments (title, win)
- Cropped sections for tile backgrounds
- Low opacity (15-30%) for subtle textures
- Never distort, stretch, or heavily filter

### Tile Design

- Watercolor as background texture, not foreground
- Symbols must be high-contrast and readable
- Cream/white base with soft watercolor wash
- Subtle shadow for 3D stacking effect

---

## Iconography

**Style:** Simple, rounded, line-based icons. Should feel hand-drawn but clean.

**Stroke:** 2px, rounded caps and joins

**Color:** Soft Charcoal (`#4A4A4A`) or Lavender Mist (`#B8A5D0`)

### Icons Needed

| Icon | Purpose | Suggested |
|------|---------|-----------|
| Shuffle | Rearrange tiles | Two curved arrows |
| New Game | Start fresh | Plus or refresh circle |
| Settings | Options (if needed) | Gear |
| Close | Dismiss modal | X |
| Checkmark | Win confirmation | Check |

---

## UI Components

### Buttons

```css
.button {
  background: var(--color-lavender);
  color: white;
  border: none;
  border-radius: 8px; /* 8-12px */
  padding: 12px 24px;
  font-weight: 500;
  transition: background 200ms ease-out;
}

.button:hover {
  background: #9B8BB8; /* Slightly darker lavender */
}

.button--success {
  background: var(--color-green);
}
```

### Cards/Panels

```css
.card {
  background: rgba(255, 255, 255, 0.5); /* Or var(--color-cream) */
  border: 1px solid var(--color-tan); /* Or none */
  border-radius: 12px; /* 12-16px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
```

### Tiles

```css
.tile {
  background: var(--color-cream);
  border: 1px solid var(--color-tan);
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.tile--selected {
  border: 3px solid var(--color-lavender);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tile--blocked {
  filter: saturate(0.7);
  opacity: 0.8;
}
```

### Modals

```css
.modal {
  background: var(--color-cream);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 32px;
}

.modal-backdrop {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px); /* If supported */
}
```

---

## Motion & Animation

### Principles

- Gentle, not bouncy
- Purposeful, not decorative
- Fast enough to not frustrate (150-300ms)

### Specific Animations

| Action | Animation | Duration |
|--------|-----------|----------|
| Tile select | Subtle lift + border glow | 150ms |
| Tile match | Fade out + slight scale down | 250ms |
| Tile invalid | Gentle shake (2-3 oscillations) | 300ms |
| Win screen | Fade in with soft scale | 400ms |
| Screen transitions | Fade | 200ms |

### Easing

```css
/* Standard easing */
transition-timing-function: ease-out;

/* Or for more control */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

Never use `linear` or aggressive spring/bounce effects.

---

## Voice & Tone

### Personality

Warm, encouraging, personal. Like a note from a friend.

### Do Say

- "You did it!"
- "No matches left — would you like to shuffle?"
- "New game"
- "Well played!"

### Don't Say

- "CONGRATULATIONS!!!"
- "Game Over. You lose."
- "Error: Invalid move"
- "EPIC WIN!!!"

### Principles

- First person plural ("Let's play") or second person ("Your turn")
- Gentle with failures — offer solutions, not blame
- Celebrate wins without being over-the-top
- No exclamation point overload

---

## App Icon

### Primary Design

Cropped hydrangea bloom in a rounded square

### Elements

- Blue/purple hydrangea petals
- Warm cream or white background
- No text (too small to read at icon size)
- Soft edge, not hard crop

### Sizes Needed

| Size | Purpose |
|------|---------|
| 512×512 | PWA (large) |
| 192×192 | PWA (standard) |
| 180×180 | Apple touch icon |
| 32×32 | Favicon |
| 16×16 | Favicon (small) |

---

## Credits & Attribution

### Short Form

> "Artwork by Jen"

### Long Form (About Screen)

> "Watercolor Mahjong features original paintings by Jen. Created with love for her 60th birthday by her son Davis."

---

## Quick Reference

| Element | Value |
|---------|-------|
| Primary color | `#B8A5D0` (Lavender Mist) |
| Background | `#FDF8F0` (Warm Cream) |
| Text color | `#4A4A4A` (Soft Charcoal) |
| Success color | `#7BC47B` (Garden Green) |
| Font (body) | Inter, Nunito, or system sans |
| Font (display) | Playfair Display or script |
| Border radius (buttons) | 8-12px |
| Border radius (cards) | 12-16px |
| Shadow (standard) | `0 4px 12px rgba(0,0,0,0.08)` |
| Animation duration | 150-300ms |
| Animation easing | ease-out |

---

## File Checklist

Before development, ensure you have:

- [ ] Watercolor images (see ASSET_GUIDE.md)
- [ ] App icons (192, 512, 180, 32, 16)
- [ ] Fonts loaded (Inter or Nunito + Playfair Display)
- [ ] CSS variables defined
- [ ] Favicon generated
