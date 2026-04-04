import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

// --- DB ---
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 5,
});

const SELECT_COLS =
  "username, difficulty, score, avg_reaction_time, accuracy, created_at";

async function getTopScores(difficulty?: string, limit = 10) {
  const latestPerUser = `
    SELECT DISTINCT ON (s.username, s.difficulty)
      ${SELECT_COLS}
    FROM clickbait_scores s
    ORDER BY s.username, s.difficulty, s.created_at DESC
  `;

  if (difficulty) {
    const { rows } = await pool.query(
      `SELECT * FROM (${latestPerUser}) sub
       WHERE sub.difficulty = $1
       ORDER BY sub.score DESC
       LIMIT $2`,
      [difficulty, limit]
    );
    return rows;
  }

  const { rows } = await pool.query(
    `SELECT * FROM (${latestPerUser}) sub
     ORDER BY sub.score DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function insertScore(
  username: string,
  difficulty: string,
  score: number,
  avgReactionTime: number,
  accuracy: number
) {
  const { rows } = await pool.query(
    `INSERT INTO clickbait_scores (username, difficulty, score, avg_reaction_time, accuracy)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${SELECT_COLS}`,
    [username, difficulty, score, avgReactionTime, accuracy]
  );

  await pool.query(
    `DELETE FROM clickbait_scores WHERE id IN (
       SELECT id FROM clickbait_scores WHERE difficulty = $1
       ORDER BY score DESC
       OFFSET 500
     )`,
    [difficulty]
  );

  return rows[0];
}

// --- Validation ---
const VALID_DIFFICULTIES = ["easy", "medium", "hard", "impossible"];
const USERNAME_RE = /^[A-Z0-9_\-. ]+$/;
const MIN_REACTION_TIME = 80;
const MAX_SCORE = 500_000;
const GAME_DURATION_S = 30;
const DIFFICULTY_MIN_TIMEOUT: Record<string, number> = {
  easy: 1500, medium: 800, hard: 450, impossible: 300,
};

function maxPossibleScore(difficulty: string): number {
  const minInterval = DIFFICULTY_MIN_TIMEOUT[difficulty];
  const maxHits = Math.ceil((GAME_DURATION_S * 1000) / minInterval);
  return maxHits * (100 + 50 * 50);
}

function validateSubmission(body: Record<string, unknown>): string | null {
  const { username, difficulty, score, avgReactionTime, accuracy } = body;
  if (!username || !difficulty || score == null) return "Missing required fields";
  if (!VALID_DIFFICULTIES.includes(difficulty as string)) return "Invalid difficulty";
  if (typeof username !== "string") return "Invalid username";
  const trimmed = username.trim();
  if (trimmed.length < 1 || trimmed.length > 16) return "Username must be 1-16 characters";
  if (!USERNAME_RE.test(trimmed)) return "Username contains invalid characters";
  if (typeof score !== "number" || !Number.isFinite(score) || score < 0 ||
      score > Math.min(MAX_SCORE, maxPossibleScore(difficulty as string)))
    return "Invalid score";
  if (typeof avgReactionTime !== "number" || !Number.isFinite(avgReactionTime) ||
      avgReactionTime < MIN_REACTION_TIME)
    return "Invalid or suspicious reaction time";
  if (typeof accuracy !== "number" || !Number.isFinite(accuracy) ||
      accuracy < 0 || accuracy > 100)
    return "Invalid accuracy";
  return null;
}

// --- Rate limit ---
const recentPosts = new Map<string, number>();

// --- Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const difficulty = req.query.difficulty as string | undefined;
      if (difficulty && !VALID_DIFFICULTIES.includes(difficulty))
        return res.status(400).json({ error: "Invalid difficulty" });

      const rawLimit = Number(req.query.limit);
      const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;

      const entries = await getTopScores(difficulty, limit);
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
      const lastPost = recentPosts.get(ip) || 0;
      if (Date.now() - lastPost < 5000)
        return res.status(429).json({ error: "Too many submissions, try again later" });
      recentPosts.set(ip, Date.now());
      if (recentPosts.size > 10000) recentPosts.clear();

      const err = validateSubmission(req.body);
      if (err) return res.status(400).json({ error: err });

      const { username, difficulty, score, avgReactionTime, accuracy } = req.body;
      const entry = await insertScore(
        (username as string).trim(), difficulty,
        Math.round(score), Math.round(avgReactionTime),
        Math.round(accuracy * 10) / 10
      );
      return res.status(201).json(entry);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("[leaderboard]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
