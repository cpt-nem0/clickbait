import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getTopScores, insertScore } from "./lib/db";
import { validateDifficulty, validateSubmission } from "./lib/validate";

// Simple in-memory rate limit (per serverless instance — not perfect, but adds friction)
const recentPosts = new Map<string, number>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const difficulty = req.query.difficulty as string | undefined;
      if (difficulty) {
        const err = validateDifficulty(difficulty);
        if (err) return res.status(400).json({ error: err });
      }

      const rawLimit = Number(req.query.limit);
      const limit =
        Number.isInteger(rawLimit) && rawLimit > 0
          ? Math.min(rawLimit, 50)
          : 10;

      const entries = await getTopScores(difficulty, limit);
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      // Rate limit: 1 per 5s per IP
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
      const lastPost = recentPosts.get(ip) || 0;
      if (Date.now() - lastPost < 5000) {
        return res.status(429).json({ error: "Too many submissions, try again later" });
      }
      recentPosts.set(ip, Date.now());
      // Prevent unbounded growth
      if (recentPosts.size > 10000) recentPosts.clear();

      const err = validateSubmission(req.body);
      if (err) return res.status(400).json({ error: err });

      const { username, difficulty, score, avgReactionTime, accuracy } = req.body;

      const entry = await insertScore(
        (username as string).trim(),
        difficulty,
        Math.round(score),
        Math.round(avgReactionTime),
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
