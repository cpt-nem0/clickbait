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
  const maxPointsPerHit = 100 + 50 * 50;
  return maxHits * maxPointsPerHit;
}

export function validateDifficulty(difficulty: unknown): string | null {
  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty as string)) {
    return "Invalid difficulty";
  }
  return null;
}

export function validateSubmission(body: Record<string, unknown>): string | null {
  const { username, difficulty, score, avgReactionTime, accuracy } = body;

  if (!username || !difficulty || score == null) {
    return "Missing required fields";
  }

  const diffErr = validateDifficulty(difficulty);
  if (diffErr) return diffErr;

  if (typeof username !== "string") return "Invalid username";
  const trimmed = username.trim();
  if (trimmed.length < 1 || trimmed.length > 16) return "Username must be 1-16 characters";
  if (!USERNAME_RE.test(trimmed)) return "Username contains invalid characters (A-Z, 0-9, _ - . only)";

  if (
    typeof score !== "number" ||
    !Number.isFinite(score) ||
    score < 0 ||
    score > Math.min(MAX_SCORE, maxPossibleScore(difficulty as string))
  ) {
    return "Invalid score";
  }

  if (
    typeof avgReactionTime !== "number" ||
    !Number.isFinite(avgReactionTime) ||
    avgReactionTime < MIN_REACTION_TIME
  ) {
    return "Invalid or suspicious reaction time";
  }

  if (
    typeof accuracy !== "number" ||
    !Number.isFinite(accuracy) ||
    accuracy < 0 ||
    accuracy > 100
  ) {
    return "Invalid accuracy";
  }

  return null;
}
