import { TargetPosition } from "@/types";
import { TARGET_SIZE, EVASION_THRESHOLD } from "./difficulty";

export function spawnTarget(
  containerWidth: number,
  containerHeight: number
): TargetPosition {
  const padding = TARGET_SIZE;
  const x = padding + Math.random() * (containerWidth - padding * 2);
  const y = padding + Math.random() * (containerHeight - padding * 2);
  return { x, y };
}

export function shouldEvade(
  targetX: number,
  targetY: number,
  cursorX: number,
  cursorY: number
): boolean {
  const dx = targetX - cursorX;
  const dy = targetY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < EVASION_THRESHOLD;
}

export function getEvasionPosition(
  targetX: number,
  targetY: number,
  cursorX: number,
  cursorY: number,
  containerWidth: number,
  containerHeight: number
): TargetPosition {
  const dx = targetX - cursorX;
  const dy = targetY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const moveDistance = EVASION_THRESHOLD * 1.5;
  let newX = targetX + (dx / distance) * moveDistance;
  let newY = targetY + (dy / distance) * moveDistance;

  const padding = TARGET_SIZE;
  if (newX < padding || newX > containerWidth - padding ||
      newY < padding || newY > containerHeight - padding) {
    return spawnTarget(containerWidth, containerHeight);
  }

  return { x: newX, y: newY };
}
