# CLICKBAIT

A brutalist reaction speed game with leaderboards. Test your nerves. Break the internet.

Built with React, TypeScript, Tailwind CSS, and deployed on Vercel with Supabase (Postgres).

## Game Modes

| Mode | Target Timeout | Evasion |
|------|---------------|---------|
| Easy | 1500ms | No |
| Medium | 800ms | No |
| Hard | 450ms | No |
| Impossible | 300ms | Yes — target dodges your cursor |

- 30-second rounds
- Combo system: consecutive hits multiply your score
- Synthesized chiptune soundtrack and SFX via Web Audio API
- Global leaderboard with anti-cheat validation

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **API**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (Postgres)
- **Local Dev**: Express + SQLite (packages/server)
- **Design System**: "Hyper-Attention Brutalism" — 0px radii, hard shadows, neon glows, scanline overlays

## Project Structure

```
project_clickbait/
├── api/                     # Vercel serverless functions
│   ├── leaderboard.ts       # GET/POST /api/leaderboard
│   ├── health.ts            # GET /api/health
│   └── lib/
│       ├── db.ts            # Postgres (Supabase) queries
│       └── validate.ts      # Input validation + anti-cheat
├── packages/
│   ├── client/              # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/  # UI components (layout, game, screens, shared)
│   │   │   ├── hooks/       # useGameState, useTimer, useMousePosition
│   │   │   └── lib/         # difficulty configs, target logic, audio, api client
│   │   └── public/
│   │       └── og.png       # Open Graph image
│   └── server/              # Local dev Express + SQLite server
├── vercel.json              # Vercel deployment config
└── .env.example             # Required environment variables
```

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
```

### Run (local SQLite — no Supabase needed)

```bash
# Terminal 1 — Express API on :3001
npm run dev:server

# Terminal 2 — Vite dev server on :5173
npm run dev:client
```

Open http://localhost:5173

### Run with Vercel CLI (uses Supabase)

```bash
vercel env pull .env.local
vercel dev
```

## Deployment

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/project-clickbait.git
git push -u origin main
```

### 2. Import to Vercel

- Import the repo at [vercel.com/new](https://vercel.com/new)
- Framework: Vite
- Build command and output directory are configured in `vercel.json`

### 3. Add Supabase Integration

- Go to your Vercel project → Integrations → Add Supabase
- Link your Supabase project — env vars are injected automatically

### 4. Supabase Table Setup

Run in the Supabase SQL Editor:

```sql
CREATE TABLE clickbait_scores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score INTEGER NOT NULL,
  avg_reaction_time REAL,
  accuracy REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clickbait_scores_diff_score ON clickbait_scores(difficulty, score DESC);
CREATE INDEX idx_clickbait_scores_user_diff ON clickbait_scores(username, difficulty, created_at DESC);

ALTER TABLE clickbait_scores ENABLE ROW LEVEL SECURITY;
```

### 5. Set Environment Variable

In Vercel project settings, add:

```
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

### 6. Deploy

```bash
vercel deploy --prod
```

## Environment Variables

| Variable | Source | Required |
|----------|--------|----------|
| `POSTGRES_URL` | Supabase integration (auto-injected) | Yes (production) |
| `ALLOWED_ORIGINS` | Manual — your deployed domain | Yes (production) |

## Security

- Helmet security headers
- CORS allowlist (env-driven)
- Rate limiting: 2 submissions/10s per IP, 60 req/min global
- Username allowlist: `A-Z 0-9 _ - .` only
- Score plausibility checks (max score per difficulty)
- Reaction time bot detection (rejects < 80ms)
- Row Level Security enabled on Supabase
- Auto-pruning: max 500 rows per difficulty

## License

MIT
