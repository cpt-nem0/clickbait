# CLAUDE.md

## Project Overview

Clickbait — a brutalist reaction speed game. React + TypeScript + Vite frontend, Express + SQLite local backend, Vercel serverless + Supabase (Postgres) for production.

## Monorepo Structure

```
api/                    → Vercel serverless functions (leaderboard, health)
packages/client/        → React 19 + Vite + Tailwind (port 5173)
packages/server/        → Express + SQLite local dev server (port 3001)
```

## Commands

```bash
npm run dev             # Run client + server concurrently
npm run dev:client      # Vite dev server only
npm run dev:server      # Express dev server only
```

## Build & Deploy

```bash
npm run build --workspace=packages/client   # Vite production build
vercel deploy --prod                         # Deploy to Vercel
```

Vercel config is in `vercel.json`. Output directory: `packages/client/dist`. Serverless functions auto-detected from `api/`.

## Tech Stack

- **Frontend**: React 19, TypeScript 5.7, Vite 6, Tailwind CSS 3.4
- **Local Backend**: Express 4, better-sqlite3, helmet, express-rate-limit
- **Production API**: Vercel serverless functions + `pg` (Postgres)
- **Database**: Supabase (Postgres) — table: `clickbait_scores`
- **Fonts**: Space Grotesk (display), Plus Jakarta Sans (body)

## Code Conventions

- **Types**: Union types over enums (`type Difficulty = "easy" | "medium" | "hard" | "impossible"`)
- **Components**: Feature folders — `layout/`, `game/`, `screens/`, `shared/`
- **Hooks**: Custom hooks in `src/hooks/` (useGameState, useTimer, useMousePosition)
- **Lib**: Utility modules in `src/lib/` (difficulty, target-logic, audio, api, skins, anticheat)
- **Styling**: Tailwind utility classes + custom CSS classes in `index.css` (skin animations, scanlines, glitch effects)
- **Path alias**: `@/` maps to `src/`
- **No rounded corners**: `border-radius: 0px` everywhere (brutalist design rule)
- **Design tokens**: All colors from Stitch design system in `tailwind.config.ts`

## Design System — Stitch Reference

**Stitch Project ID**: `14236962200832414213` (project name: "Clickbait")
**Theme**: "Hyper-Attention Brutalism" — Y2K internet maximalism, intentional chaos, sharp-edged geometry.

### Stitch Screens

| Screen | ID | Purpose |
|--------|-----|---------|
| Difficulty Selection | `1cb944ee6e92` | Landing page, 2x2 difficulty grid, sidebar |
| Main Game | `16da89088ccc` | Game container, target, HUD, stickers |
| Game Over & Leaderboard | `e2f71212175` | Score display, submit form, hall of fame table |

### Colors (from Stitch)

| Role | Token | Hex |
|------|-------|-----|
| Background | `surface` | `#0e0e12` |
| Primary (lime) | `primary_container` | `#cafd00` |
| Secondary (pink) | `secondary` | `#ff51fa` |
| Tertiary (cyan) | `tertiary_container` | `#00ffff` |
| Error (orange) | `error` | `#ff7351` |
| Text on dark | `on_surface` | `#f3eff6` |
| Borders | `outline` | `#76757a` |

### Design Rules (MUST FOLLOW)

1. **0px border radius everywhere** — no rounded corners, ever
2. **Hard shadows**: 4px solid black offset (bottom-right) on interactive elements
3. **No 1px dividers** — use tonal shifts (surface_container tiers) or 8px gaps
4. **Structural borders**: 3-4px solid using `outline` or `primary` tokens
5. **Neon ambient glows**: large-spread, low-opacity shadows tinted pink or cyan
6. **Sticker overlays**: small labels ("NEW!", "X10 COMBO") at angles using `error` palette
7. **Noise grain texture** over surface backgrounds
8. **Animations**: use "Back" or "Elastic" easing — no standard easing
9. **All headers**: uppercase, Space Grotesk, letter-spacing: -0.02em
10. **Difficulty colors**: easy/medium = green (primary), hard = orange (error), impossible = pink (secondary)

## Key Architecture

- **Game state machine**: `idle → playing → gameOver` in `useGameState` hook
- **Audio**: All sounds synthesized via Web Audio API in `lib/audio.ts` — no audio files
- **Anti-cheat**: Behavioral analysis in `lib/anticheat.ts` — tracks click patterns, reaction time variance, mouse movement
- **Skins**: Unlockable target skins in `lib/skins.ts` — score-gated, CSS-animated
- **Leaderboard**: Shows latest score per user per difficulty (all scores kept in DB for future history)

## Environment Variables (Production)

- `POSTGRES_URL` — auto-injected by Vercel Supabase integration
- `ALLOWED_ORIGINS` — set manually to deployed domain

## Database

Table `clickbait_scores` in Supabase with RLS enabled, no policies (API uses direct Postgres connection). Auto-prune keeps max 500 rows per difficulty.

## Git Workflow

- Always ask before committing
- No Co-Authored-By in commit messages
- Push triggers Vercel auto-deploy
