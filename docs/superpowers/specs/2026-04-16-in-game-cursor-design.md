# In-Game Cursor Design — Corner Brackets

**Date**: 2026-04-16
**Status**: Approved design, ready for implementation plan
**Scope**: Replace the default `cursor-crosshair` (browser plus sign) in the game play area with a custom brutalist targeting cursor.

---

## Problem

The in-game cursor is Tailwind's `cursor-crosshair` — a generic OS-rendered plus. It clashes with the site's brutalist aesthetic (the rest of the site already uses a custom lime-green arrow with pink glitch shadow at `/cursor.svg`) and feels like an unfinished detail in an otherwise heavily-stylized game.

## Goal

Ship a custom in-game cursor that:

1. Matches the brutalist design language (lime / pink / cyan palette, hard shadows, 0px radii, no gradients)
2. Reads instantly at speed without occluding targets — even small (45px) or shrinking (30px) ones
3. Gives tactile feedback on click
4. Adds zero perceptible latency (reaction-speed game, cursor lag is unacceptable)

## Design: Corner Brackets

Four L-shaped corner brackets framing an open center with a single cyan aim-point dot. No center cross — the "plus" is what we're replacing. The open center ensures the cursor never covers the target at the moment of click.

### Visual specification

| Property | Value |
|----------|-------|
| Bounding box | 20×20px |
| Bracket size | ~6×6px each, 2px stroke, L-shape at each corner |
| Bracket color | Lime `#cafd00` (design system `primary`) |
| Hard shadow | Identical brackets in pink `#ff51fa` (`secondary`), offset +2px right / +2px down, behind lime |
| Outline | 1px black `#0e0e12` around lime brackets for contrast against scanlines/noise |
| Center dot | 2×2px cyan square `#00ffff` (`tertiary`) at exact center |
| Hotspot | (10, 10) — dead center on the cyan dot |

All colors taken from the existing Tailwind config (`packages/client/tailwind.config.ts`). No new design tokens.

### Behavior: click snap

- **Default state** (`cursor-game.svg`): brackets at outer corners of the 20×20 box.
- **Pressed state** (`cursor-game-pressed.svg`): brackets translated 3px inward toward center (visually "clamping" on the target). Center dot unchanged.
- **Trigger**: CSS `:active` pseudo-class on the game container — browser-native, zero JS.
- **Transition**: instantaneous state swap. No interpolation. The snap fits the brutalist aesthetic (mechanical, not organic) and is what the OS cursor system supports natively.

### Scope

In-game only. The new cursor applies exclusively inside the `GameScreen` play area. The site-wide arrow at `/cursor.svg` stays — the targeting metaphor would feel wrong on menu buttons, leaderboard rows, and the difficulty picker.

## Technical approach

Use two SVG files swapped via CSS `:active`. No JavaScript. Native cursor rendering means the cursor is hardware-accelerated and has zero added latency compared to the current `cursor-crosshair`.

### Why not a DOM-rendered cursor?

A DOM cursor (hidden native cursor, absolutely-positioned element tracking mouse position via JS) would allow smooth animation between default and pressed states. Rejected because:

1. Reaction-speed game — even one frame of cursor lag is noticeable and unfair.
2. Adds a per-frame rAF loop.
3. The instant snap actually fits the brutalist aesthetic better than an eased spring.

### Why not animated SVG / SMIL?

Browsers only render SVGs as cursor images at a single static frame. Animation inside the SVG is ignored.

## Files changed

1. **`packages/client/public/cursor-game.svg`** — new. Default state (brackets at outer corners).
2. **`packages/client/public/cursor-game-pressed.svg`** — new. Pressed state (brackets 3px inward).
3. **`packages/client/src/index.css`** — add a `.game-cursor` class under the `@layer components` or `@layer utilities` block:
   ```css
   .game-cursor {
     cursor: url('/cursor-game.svg') 10 10, crosshair;
   }
   .game-cursor:active {
     cursor: url('/cursor-game-pressed.svg') 10 10, crosshair;
   }
   ```
   Fallback to `crosshair` (not `auto`) in case the SVG fails to load — preserves the current behavior.
4. **`packages/client/src/components/game/GameScreen.tsx`** — line 135: replace `cursor-crosshair` with `game-cursor` in the container className.

## SVG structure (reference)

Both files share the same 20×20 viewBox. Lime brackets are centered on (10, 10); shadow brackets are the same shapes offset +2px right / +2px down. Exact polygon coordinates are an implementation detail — what matters is: (a) each L is 6×6 with 2px stroke, (b) outer corners touch (1,1), (19,1), (1,19), (19,19), (c) the cyan dot is centered at (10, 10).

```xml
<!-- cursor-game.svg (default) -->
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <!-- Pink shadow brackets (rendered first, offset +2,+2 from lime) -->
  <g fill="#ff51fa" opacity="0.7">
    <polygon points="3,3 9,3 9,5 5,5 5,9 3,9"/>          <!-- TL shadow -->
    <polygon points="15,3 21,3 21,9 19,9 19,5 15,5"/>    <!-- TR shadow (clipped by viewBox) -->
    <polygon points="3,15 5,15 5,19 9,19 9,21 3,21"/>    <!-- BL shadow (clipped) -->
    <polygon points="19,15 21,15 21,21 15,21 15,19 19,19"/> <!-- BR shadow (clipped) -->
  </g>
  <!-- Lime brackets -->
  <g fill="#cafd00" stroke="#0e0e12" stroke-width="1">
    <polygon points="1,1 7,1 7,3 3,3 3,7 1,7"/>          <!-- TL -->
    <polygon points="13,1 19,1 19,7 17,7 17,3 13,3"/>    <!-- TR -->
    <polygon points="1,13 3,13 3,17 7,17 7,19 1,19"/>    <!-- BL -->
    <polygon points="13,17 13,19 19,19 19,13 17,13 17,17"/> <!-- BR -->
  </g>
  <!-- Cyan center dot, centered on (10,10) -->
  <rect x="9" y="9" width="2" height="2" fill="#00ffff"/>
</svg>
```

For the pressed variant, shift each bracket 3px toward center: TL outer corner moves from (1,1) to (4,4), TR from (19,1) to (16,4), etc. Cyan dot stays at (9,9). Shadow offset unchanged.

Note: the bottom-right shadow brackets extend beyond the 20×20 viewBox — that's intended; the viewBox clips them, producing a chunky brutalist edge rather than a pristine bounded shape.

## Testing

Manual verification in browser:

1. Enter the game — cursor is the lime corner brackets with pink shadow.
2. Mousedown anywhere in the game area — cursor snaps to the pressed state.
3. Mouseup — returns to default.
4. Exit game (game-over screen, menus) — reverts to the site-wide arrow.
5. Small target (45px) with cursor centered on it: target clearly visible through the open center.
6. Shrinking target at minimum size (30px): cursor does not visually cover the target.

No automated tests — this is a pure visual change. Type-check and build must pass.

## Out of scope

Deliberately excluded to keep scope tight:

- Hover-on-target detection (brackets react when over a target)
- Per-difficulty cursor tinting
- Animated transitions between states
- Replacement of site-wide arrow
- Custom cursor on menu/leaderboard buttons
- Mobile touch device behavior (mobile block already gates gameplay on mobile; no cursor exists on touch)
