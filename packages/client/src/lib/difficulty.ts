import { Difficulty, DifficultyConfig } from "@/types";

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "EASY",
    timeout: 1500,
    evasion: false,
    description: "Target stays for 1.5s. No evasion. Perfect for warmup.",
  },
  medium: {
    label: "MEDIUM",
    timeout: 800,
    evasion: false,
    description: "Target stays for 0.8s. Speed matters now.",
  },
  hard: {
    label: "HARD",
    timeout: 450,
    evasion: false,
    description: "Target stays for 0.45s. Blink and you'll miss it.",
  },
  impossible: {
    label: "IMPOSSIBLE",
    timeout: 300,
    evasion: true,
    description: "0.3s timeout. Target evades your cursor.",
  },
};

export const GAME_DURATION = 30;
export const TARGET_SIZE = 80;
export const EVASION_THRESHOLD = 120;
export const MIN_REACTION_TIME = 80;
