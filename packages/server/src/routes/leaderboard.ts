import { Router, Request, Response } from "express";
import { getTopScores, insertScore } from "../db.js";

const router = Router();

const VALID_DIFFICULTIES = ["easy", "medium", "hard", "impossible"];
const USERNAME_RE = /^[A-Z0-9_\-. ]+$/;
const MIN_REACTION_TIME = 80;
const MAX_SCORE = 500_000;
const GAME_DURATION_S = 30;

const DIFFICULTY_MIN_TIMEOUT: Record<string, number> = {
  easy: 1500,
  medium: 800,
  hard: 450,
  impossible: 300,
};

function maxPossibleScore(difficulty: string): number {
  const minInterval = DIFFICULTY_MIN_TIMEOUT[difficulty];
  const maxHits = Math.ceil((GAME_DURATION_S * 1000) / minInterval);
  const maxPointsPerHit = 100 + 50 * 50; // generous combo ceiling
  return maxHits * maxPointsPerHit;
}

router.get("/", (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;

    if (difficulty && !VALID_DIFFICULTIES.includes(difficulty as string)) {
      res.status(400).json({ error: "Invalid difficulty" });
      return;
    }

    const rawLimit = Number(req.query.limit);
    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, 50)
        : 10;

    const entries = getTopScores(difficulty as string | undefined, limit);
    res.json(entries);
  } catch {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const { username, difficulty, score, avgReactionTime, accuracy } = req.body;

    // Required fields
    if (!username || !difficulty || score == null) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Difficulty
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      res.status(400).json({ error: "Invalid difficulty" });
      return;
    }

    // Username — allowlist: uppercase alphanumeric + _ - . space
    if (typeof username !== "string") {
      res.status(400).json({ error: "Invalid username" });
      return;
    }
    const trimmedName = username.trim();
    if (trimmedName.length < 1 || trimmedName.length > 16) {
      res.status(400).json({ error: "Username must be 1-16 characters" });
      return;
    }
    if (!USERNAME_RE.test(trimmedName)) {
      res.status(400).json({ error: "Username contains invalid characters (A-Z, 0-9, _ - . only)" });
      return;
    }

    // Score — finite positive integer within plausible range
    if (
      typeof score !== "number" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > Math.min(MAX_SCORE, maxPossibleScore(difficulty))
    ) {
      res.status(400).json({ error: "Invalid score" });
      return;
    }

    // Reaction time — finite, above human minimum
    if (
      typeof avgReactionTime !== "number" ||
      !Number.isFinite(avgReactionTime) ||
      avgReactionTime < MIN_REACTION_TIME
    ) {
      res.status(400).json({ error: "Invalid or suspicious reaction time" });
      return;
    }

    // Accuracy — 0-100
    if (
      typeof accuracy !== "number" ||
      !Number.isFinite(accuracy) ||
      accuracy < 0 ||
      accuracy > 100
    ) {
      res.status(400).json({ error: "Invalid accuracy" });
      return;
    }

    const entry = insertScore(
      trimmedName,
      difficulty,
      Math.round(score),
      Math.round(avgReactionTime),
      Math.round(accuracy * 10) / 10
    );

    res.status(201).json(entry);
  } catch {
    res.status(500).json({ error: "Failed to save score" });
  }
});

export default router;
