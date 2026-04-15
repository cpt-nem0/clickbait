# In-Game Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser-default `cursor-crosshair` (plus sign) inside the game play area with a custom brutalist corner-bracket cursor that swaps to a "pressed" variant on mouse-down.

**Architecture:** Two static SVG files in `packages/client/public/` referenced by a new `.game-cursor` CSS class. The `:active` pseudo-class swaps the cursor URL at the browser level — no JavaScript, no render loop, zero added input latency. One className swap in `GameScreen.tsx` applies the new cursor only inside the game area; site-wide arrow is untouched.

**Tech Stack:** SVG, Tailwind CSS 3.4, plain CSS (via index.css), React 19 / TypeScript 5.7, Vite 6 dev server.

**Spec:** `docs/superpowers/specs/2026-04-16-in-game-cursor-design.md`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `packages/client/public/cursor-game.svg` (new) | Default cursor state — brackets at outer corners, cyan dot centered at (10,10) |
| `packages/client/public/cursor-game-pressed.svg` (new) | Pressed state — brackets snapped 3px inward, cyan dot unchanged |
| `packages/client/src/index.css` (modify) | Add `.game-cursor` rule and its `:active` variant under `@layer components` |
| `packages/client/src/components/game/GameScreen.tsx:135` (modify) | Swap `cursor-crosshair` for `game-cursor` in the game-area container className |

---

### Task 1: Create default cursor SVG

**Files:**
- Create: `packages/client/public/cursor-game.svg`

- [ ] **Step 1: Create `cursor-game.svg` with the default-state geometry**

Path: `packages/client/public/cursor-game.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <!-- Pink shadow brackets, offset +2,+2 from lime (bottom-right extends past viewBox on purpose) -->
  <g fill="#ff51fa" opacity="0.7">
    <polygon points="3,3 9,3 9,5 5,5 5,9 3,9"/>
    <polygon points="15,3 21,3 21,9 19,9 19,5 15,5"/>
    <polygon points="3,15 5,15 5,19 9,19 9,21 3,21"/>
    <polygon points="19,15 21,15 21,21 15,21 15,19 19,19"/>
  </g>
  <!-- Lime brackets with 1px black outline -->
  <g fill="#cafd00" stroke="#0e0e12" stroke-width="1">
    <polygon points="1,1 7,1 7,3 3,3 3,7 1,7"/>
    <polygon points="13,1 19,1 19,7 17,7 17,3 13,3"/>
    <polygon points="1,13 3,13 3,17 7,17 7,19 1,19"/>
    <polygon points="13,17 13,19 19,19 19,13 17,13 17,17"/>
  </g>
  <!-- Cyan center dot, centered on (10,10) -->
  <rect x="9" y="9" width="2" height="2" fill="#00ffff"/>
</svg>
```

- [ ] **Step 2: Verify the SVG renders by opening it directly**

Run: `open packages/client/public/cursor-game.svg`
Expected: four lime L-brackets in the corners of a small square, pink offset shadow to the bottom-right, a tiny cyan square in the center. No rendering errors in the browser.

- [ ] **Step 3: Commit**

```bash
git add packages/client/public/cursor-game.svg
git commit -m "feat(cursor): add default corner-bracket game cursor SVG"
```

---

### Task 2: Create pressed-state cursor SVG

**Files:**
- Create: `packages/client/public/cursor-game-pressed.svg`

The pressed variant is identical to Task 1 except each bracket is shifted 3px toward the center (10, 10). Outer corners move: TL (1,1)→(4,4), TR (19,1)→(16,4), BL (1,19)→(4,16), BR (19,19)→(16,16). Cyan dot and shadow offset are unchanged.

- [ ] **Step 1: Create `cursor-game-pressed.svg`**

Path: `packages/client/public/cursor-game-pressed.svg`

Every bracket is the same 6×6 L-shape as the default SVG, just translated 3px toward center: TL by (+3,+3), TR by (-3,+3), BL by (+3,-3), BR by (-3,-3). Shadow brackets receive the same translation (the +2,+2 shadow offset is already baked into their default position). The cyan dot and the black outline stroke are unchanged.

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <!-- Pink shadow brackets, same 6x6 L-shape translated 3px toward center -->
  <g fill="#ff51fa" opacity="0.7">
    <polygon points="6,6 12,6 12,8 8,8 8,12 6,12"/>
    <polygon points="12,6 18,6 18,12 16,12 16,8 12,8"/>
    <polygon points="6,12 8,12 8,16 12,16 12,18 6,18"/>
    <polygon points="16,12 18,12 18,18 12,18 12,16 16,16"/>
  </g>
  <!-- Lime brackets, translated 3px toward center -->
  <g fill="#cafd00" stroke="#0e0e12" stroke-width="1">
    <polygon points="4,4 10,4 10,6 6,6 6,10 4,10"/>
    <polygon points="10,4 16,4 16,10 14,10 14,6 10,6"/>
    <polygon points="4,10 6,10 6,14 10,14 10,16 4,16"/>
    <polygon points="10,14 10,16 16,16 16,10 14,10 14,14"/>
  </g>
  <!-- Cyan center dot stays at (10,10) -->
  <rect x="9" y="9" width="2" height="2" fill="#00ffff"/>
</svg>
```

- [ ] **Step 2: Verify the SVG renders by opening it directly**

Run: `open packages/client/public/cursor-game-pressed.svg`
Expected: brackets visibly closer to the center compared to `cursor-game.svg`, forming a tighter clamp around the cyan dot. Same color palette. No rendering errors.

- [ ] **Step 3: Open both SVGs side by side and diff visually**

Run: `open packages/client/public/cursor-game.svg packages/client/public/cursor-game-pressed.svg`
Expected: the pressed version's brackets are clearly inset from the default version's brackets. The cyan dot sits at the same position in both.

- [ ] **Step 4: Commit**

```bash
git add packages/client/public/cursor-game-pressed.svg
git commit -m "feat(cursor): add pressed-state game cursor SVG"
```

---

### Task 3: Add `.game-cursor` CSS rule

**Files:**
- Modify: `packages/client/src/index.css` (append a block to the existing `@layer components` section)

- [ ] **Step 1: Add the `.game-cursor` rule inside the `@layer components` block**

Open `packages/client/src/index.css`. The file has a `@layer components` block starting on line 26. Add the following rule at the end of that block (before its closing `}`):

```css
  .game-cursor {
    cursor: url('/cursor-game.svg') 10 10, crosshair;
  }

  .game-cursor:active {
    cursor: url('/cursor-game-pressed.svg') 10 10, crosshair;
  }
```

The hotspot (`10 10`) corresponds to the center of the cyan dot. `crosshair` is the fallback in case the SVG fails to load — preserves current behavior.

- [ ] **Step 2: Run type-check and build to make sure nothing is syntactically broken**

Run: `npm run build --workspace=packages/client`
Expected: build completes successfully; no CSS-parse errors logged by PostCSS / Tailwind.

- [ ] **Step 3: Commit**

```bash
git add packages/client/src/index.css
git commit -m "feat(cursor): add .game-cursor class with :active pressed variant"
```

---

### Task 4: Apply `.game-cursor` to the game container

**Files:**
- Modify: `packages/client/src/components/game/GameScreen.tsx:135`

- [ ] **Step 1: Replace `cursor-crosshair` with `game-cursor` in the container className**

File: `packages/client/src/components/game/GameScreen.tsx`
Line 135 currently reads:

```tsx
className="flex-1 relative bg-surface overflow-hidden cursor-crosshair select-none"
```

Change to:

```tsx
className="flex-1 relative bg-surface overflow-hidden game-cursor select-none"
```

- [ ] **Step 2: Run type-check to confirm nothing else broke**

Run: `npm run build --workspace=packages/client`
Expected: build succeeds. No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add packages/client/src/components/game/GameScreen.tsx
git commit -m "feat(cursor): use game-cursor class on game container"
```

---

### Task 5: End-to-end visual verification

No automated tests — this is a pure visual change. Verify manually in a running dev server.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev:client`
Expected: Vite starts on http://localhost:5173 with no errors.

- [ ] **Step 2: Navigate to the app and start a game (any difficulty)**

Open http://localhost:5173 in a browser. Click through the difficulty picker and start a round.

- [ ] **Step 3: Verify the default cursor**

Hover the cursor over the game play area (not the header).
Expected: cursor is four small lime L-brackets framing an open center, with a pink offset shadow to the bottom-right and a single cyan pixel dot at the exact center. It should be clearly distinct from the browser's generic crosshair.

- [ ] **Step 4: Verify the click-snap**

Press and hold the left mouse button anywhere inside the game area.
Expected: the four brackets instantly "snap" inward toward the center dot. Release: they snap back.

- [ ] **Step 5: Verify targeting against small/shrinking targets**

Play a round of **hard** difficulty (shrinking targets). Watch what happens when a target shrinks toward the minimum (~30px) with the cursor hovered on it.
Expected: the target is still clearly visible through the open center of the cursor. The cursor does not occlude the target at any point.

- [ ] **Step 6: Verify scope boundary**

Move the cursor out of the game play area (onto the header, pause menu, or game-over screen when it appears).
Expected: cursor reverts to the site-wide lime arrow (`/cursor.svg`) — the corner-bracket cursor only appears inside the game area.

- [ ] **Step 7: Verify fallback behavior (optional spot-check)**

Using browser devtools, temporarily block `cursor-game.svg` (Network tab → right-click → Block request URL). Reload and re-enter the game.
Expected: cursor falls back to `crosshair` (the CSS fallback), not to `auto`. Unblock when done.

- [ ] **Step 8: Stop the dev server**

Kill the dev server (Ctrl+C).

- [ ] **Step 9: Final production build sanity check**

Run: `npm run build --workspace=packages/client`
Expected: build succeeds. `dist/` contains both `cursor-game.svg` and `cursor-game-pressed.svg` (Vite auto-copies `public/`).

Run: `ls packages/client/dist/cursor-game*.svg`
Expected: both files listed.

- [ ] **Step 10: No commit needed for verification** (all code changes were committed in prior tasks)

---

## Out of scope (from spec)

- Hover-on-target detection
- Per-difficulty cursor tinting
- Animated transitions between default and pressed states
- Replacement of the site-wide arrow
- Custom cursor on menu/leaderboard buttons
- Mobile touch behavior (mobile is already gated)
