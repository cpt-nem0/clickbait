export type Difficulty = "easy" | "medium" | "hard" | "impossible";

export type GameState = "idle" | "playing" | "gameOver";

export type TargetSize = "small" | "medium" | "large";

export type MechanicType = "linear" | "static" | "shrinking" | "evasion";

export interface TargetSizeConfig {
  dimensions: number;
  basePoints: number;
  weight: number;
}

export interface DifficultyConfig {
  label: string;
  mechanic: MechanicType;
  timeout: number;
  evasion: boolean;
  description: string;
}

export interface TargetPosition {
  x: number;
  y: number;
}

export interface LinearMotion {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cycleStartTime: number;
  stationaryDurationMs: number;
  travelDurationMs: number;
}

export interface GameTarget {
  id: number;
  x: number;
  y: number;
  size: TargetSize;
  dimensions: number;
  spawnTime: number;
  motion?: LinearMotion;
  currentSize?: number;
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
