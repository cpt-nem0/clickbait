import { Difficulty, DifficultyConfig, TargetSize, TargetSizeConfig } from "@/types";

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "EASY",
    mechanic: "linear",
    timeout: 1500, // stationary duration (then brief migration)
    evasion: false,
    description: "Target stays, then migrates. Catch it mid-move for bonus.",
  },
  medium: {
    label: "MEDIUM",
    mechanic: "static",
    timeout: 800,
    evasion: false,
    description: "Target pops up at random spots. React fast.",
  },
  hard: {
    label: "HARD",
    mechanic: "shrinking",
    timeout: 600, // shrink duration
    evasion: false,
    description: "Target shrinks fast. Smaller = more points.",
  },
  impossible: {
    label: "IMPOSSIBLE",
    mechanic: "evasion",
    timeout: 300,
    evasion: true,
    description: "Target evades your cursor. Good luck.",
  },
};

export const TARGET_SIZES: Record<TargetSize, TargetSizeConfig> = {
  large: { dimensions: 90, basePoints: 80, weight: 50 },
  medium: { dimensions: 65, basePoints: 120, weight: 35 },
  small: { dimensions: 45, basePoints: 200, weight: 15 },
};

export const GAME_DURATION = 30;
export const SHRINKING_MIN_SIZE = 30;
export const SHRINKING_MAX_SIZE = 90;
export const EVASION_THRESHOLD = 90;
export const MIN_REACTION_TIME = 80;
export const EASY_TRAVEL_DURATION_MS = 150;
export const EASY_TRAVEL_BONUS_MULTIPLIER = 1.5;

export function rollTargetSize(): TargetSize {
  const totalWeight = Object.values(TARGET_SIZES).reduce((s, c) => s + c.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [size, cfg] of Object.entries(TARGET_SIZES) as [TargetSize, TargetSizeConfig][]) {
    roll -= cfg.weight;
    if (roll <= 0) return size;
  }
  return "large";
}
