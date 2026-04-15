import {
  Difficulty,
  GameTarget,
  LinearMotion,
  TargetPosition,
  TargetSize,
} from "@/types";
import {
  DIFFICULTIES,
  EASY_TRAVEL_BONUS_MULTIPLIER,
  EASY_TRAVEL_DURATION_MS,
  EVASION_THRESHOLD,
  SHRINKING_MAX_SIZE,
  SHRINKING_MIN_SIZE,
  rollTargetSize,
} from "./difficulty";

function randomPosition(
  containerWidth: number,
  containerHeight: number,
  dimensions: number
): TargetPosition {
  const padding = dimensions;
  return {
    x: padding + Math.random() * (containerWidth - padding * 2),
    y: padding + Math.random() * (containerHeight - padding * 2),
  };
}

const FIXED_TARGET_SIZE = 80;

function fixedTarget(): Pick<GameTarget, "id" | "size" | "dimensions" | "spawnTime"> {
  return {
    id: Date.now() + Math.random(),
    size: "medium",
    dimensions: FIXED_TARGET_SIZE,
    spawnTime: performance.now(),
  };
}

export function createStaticTarget(
  containerWidth: number,
  containerHeight: number
): GameTarget {
  const pos = randomPosition(containerWidth, containerHeight, FIXED_TARGET_SIZE);
  return { ...fixedTarget(), x: pos.x, y: pos.y };
}

export function createEvadingTarget(
  containerWidth: number,
  containerHeight: number
): GameTarget {
  return createStaticTarget(containerWidth, containerHeight);
}

export function createLinearTarget(
  containerWidth: number,
  containerHeight: number,
  stationaryDurationMs: number
): GameTarget {
  const start = randomPosition(containerWidth, containerHeight, FIXED_TARGET_SIZE);
  const end = randomPosition(containerWidth, containerHeight, FIXED_TARGET_SIZE);

  const motion: LinearMotion = {
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y,
    cycleStartTime: performance.now(),
    stationaryDurationMs,
    travelDurationMs: EASY_TRAVEL_DURATION_MS,
  };

  return { ...fixedTarget(), x: start.x, y: start.y, motion };
}

export function createShrinkingTarget(
  containerWidth: number,
  containerHeight: number
): GameTarget {
  const pos = randomPosition(containerWidth, containerHeight, SHRINKING_MAX_SIZE);
  return {
    id: Date.now() + Math.random(),
    size: "medium",
    spawnTime: performance.now(),
    x: pos.x,
    y: pos.y,
    dimensions: SHRINKING_MAX_SIZE,
    currentSize: SHRINKING_MAX_SIZE,
  };
}

export function createTargetForDifficulty(
  difficulty: Difficulty,
  containerWidth: number,
  containerHeight: number
): GameTarget {
  const config = DIFFICULTIES[difficulty];
  switch (config.mechanic) {
    case "linear":
      return createLinearTarget(containerWidth, containerHeight, config.timeout);
    case "shrinking":
      return createShrinkingTarget(containerWidth, containerHeight);
    case "evasion":
      return createEvadingTarget(containerWidth, containerHeight);
    case "static":
    default:
      return createStaticTarget(containerWidth, containerHeight);
  }
}

export type LinearPhase = "stationary" | "traveling" | "complete";

export function updateLinearPosition(
  motion: LinearMotion,
  now: number
): { x: number; y: number; phase: LinearPhase } {
  const elapsed = now - motion.cycleStartTime;
  const { stationaryDurationMs, travelDurationMs } = motion;

  if (elapsed < stationaryDurationMs) {
    return { x: motion.startX, y: motion.startY, phase: "stationary" };
  }

  const travelElapsed = elapsed - stationaryDurationMs;
  if (travelElapsed < travelDurationMs) {
    const t = travelElapsed / travelDurationMs;
    return {
      x: motion.startX + (motion.endX - motion.startX) * t,
      y: motion.startY + (motion.endY - motion.startY) * t,
      phase: "traveling",
    };
  }

  return { x: motion.endX, y: motion.endY, phase: "complete" };
}

export function nextMigrationCycle(
  motion: LinearMotion,
  containerWidth: number,
  containerHeight: number,
  dimensions: number
): LinearMotion {
  const nextEnd = randomPosition(containerWidth, containerHeight, dimensions);
  return {
    startX: motion.endX,
    startY: motion.endY,
    endX: nextEnd.x,
    endY: nextEnd.y,
    cycleStartTime: performance.now(),
    stationaryDurationMs: motion.stationaryDurationMs,
    travelDurationMs: motion.travelDurationMs,
  };
}

export function isTargetTraveling(target: GameTarget, now: number): boolean {
  if (!target.motion) return false;
  const elapsed = now - target.motion.cycleStartTime;
  return (
    elapsed >= target.motion.stationaryDurationMs &&
    elapsed < target.motion.stationaryDurationMs + target.motion.travelDurationMs
  );
}

export { EASY_TRAVEL_BONUS_MULTIPLIER };

export function updateShrinkingSize(
  spawnTime: number,
  now: number,
  durationMs: number
): { size: number; expired: boolean } {
  const t = Math.min(1, (now - spawnTime) / durationMs);
  return {
    size: SHRINKING_MAX_SIZE + (SHRINKING_MIN_SIZE - SHRINKING_MAX_SIZE) * t,
    expired: t >= 1,
  };
}

const BASE_POINTS_PER_DIFFICULTY: Record<Difficulty, number> = {
  easy: 100,
  medium: 100,
  hard: 100, // overridden by shrinking formula
  impossible: 100,
};

export function calculateScore(
  target: GameTarget,
  combo: number,
  difficulty: Difficulty,
  now: number = performance.now()
): number {
  let base: number;
  if (difficulty === "hard" && target.currentSize !== undefined) {
    base = Math.max(65, Math.round(200 - target.currentSize * 1.5));
  } else {
    base = BASE_POINTS_PER_DIFFICULTY[difficulty];
  }

  if (difficulty === "easy" && isTargetTraveling(target, now)) {
    base = Math.round(base * EASY_TRAVEL_BONUS_MULTIPLIER);
  }

  return base + combo * 50;
}

export function shouldEvade(
  targetX: number,
  targetY: number,
  cursorX: number,
  cursorY: number
): boolean {
  const dx = targetX - cursorX;
  const dy = targetY - cursorY;
  return Math.sqrt(dx * dx + dy * dy) < EVASION_THRESHOLD;
}

export function getEvasionPosition(
  targetX: number,
  targetY: number,
  cursorX: number,
  cursorY: number,
  containerWidth: number,
  containerHeight: number,
  dimensions: number = SHRINKING_MAX_SIZE
): TargetPosition {
  const dx = targetX - cursorX;
  const dy = targetY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const moveDistance = EVASION_THRESHOLD * 1.5;
  const newX = targetX + (dx / distance) * moveDistance;
  const newY = targetY + (dy / distance) * moveDistance;

  const padding = dimensions;
  if (
    newX < padding ||
    newX > containerWidth - padding ||
    newY < padding ||
    newY > containerHeight - padding
  ) {
    return randomPosition(containerWidth, containerHeight, dimensions);
  }
  return { x: newX, y: newY };
}

// Legacy alias for backward compat
export function spawnTarget(containerWidth: number, containerHeight: number): TargetPosition {
  const pos = randomPosition(containerWidth, containerHeight, SHRINKING_MAX_SIZE);
  return pos;
}
