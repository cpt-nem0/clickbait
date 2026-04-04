import { Difficulty, LeaderboardEntry, ScoreSubmission } from "@/types";

const API_BASE = "/api";

export async function getLeaderboard(
  difficulty?: Difficulty,
  limit = 10
): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams();
  if (difficulty) params.set("difficulty", difficulty);
  params.set("limit", String(limit));

  const res = await fetch(`${API_BASE}/leaderboard?${params}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function submitScore(
  submission: ScoreSubmission
): Promise<LeaderboardEntry> {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Submission failed" }));
    throw new Error(err.error);
  }
  return res.json();
}
