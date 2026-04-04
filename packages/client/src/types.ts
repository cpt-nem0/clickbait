export type Difficulty = "easy" | "medium" | "hard" | "impossible";

export type GameState = "idle" | "playing" | "gameOver";

export interface DifficultyConfig {
  label: string;
  timeout: number;
  evasion: boolean;
  description: string;
}

export interface TargetPosition {
  x: number;
  y: number;
}

export interface GameStats {
  score: number;
  clicks: number;
  hits: number;
  reactionTimes: number[];
  avgReactionTime: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  username: string;
  difficulty: Difficulty;
  score: number;
  avg_reaction_time: number;
  accuracy: number;
  created_at: string;
}

export interface ScoreSubmission {
  username: string;
  difficulty: Difficulty;
  score: number;
  avgReactionTime: number;
  accuracy: number;
}
