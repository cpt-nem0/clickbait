import { useState, useCallback, useRef, useEffect } from "react";
import { Difficulty, GameState, GameStats, GameTarget } from "@/types";
import { DIFFICULTIES, GAME_DURATION } from "@/lib/difficulty";
import {
  calculateScore,
  createTargetForDifficulty,
  nextMigrationCycle,
  updateLinearPosition,
  updateShrinkingSize,
} from "@/lib/target-logic";
import { useTimer } from "./useTimer";
import { sfx, startMusic, stopMusic } from "@/lib/audio";
import { createBehaviorTracker } from "@/lib/anticheat";

const initialStats: GameStats = {
  score: 0,
  clicks: 0,
  hits: 0,
  reactionTimes: [],
  avgReactionTime: 0,
  accuracy: 0,
};

export function useGameState(containerSize: { width: number; height: number }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [target, setTarget] = useState<GameTarget | null>(null);
  const [combo, setCombo] = useState(0);
  const [showScorePop, setShowScorePop] = useState<{ x: number; y: number; value: number } | null>(null);

  const targetRef = useRef<GameTarget | null>(null);
  const despawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aborted = useRef(false);
  const rafId = useRef<number>(0);
  const behaviorTracker = useRef(createBehaviorTracker());
  const difficultyRef = useRef<Difficulty>("easy");
  const containerSizeRef = useRef(containerSize);

  useEffect(() => {
    containerSizeRef.current = containerSize;
  }, [containerSize]);

  const updateTarget = useCallback((next: GameTarget | null) => {
    targetRef.current = next;
    setTarget(next);
  }, []);

  const endGame = useCallback(() => {
    if (aborted.current) return;
    setGameState("gameOver");
    updateTarget(null);
    if (despawnTimer.current) clearTimeout(despawnTimer.current);
    cancelAnimationFrame(rafId.current);
    stopMusic();
    sfx.gameOver();
  }, [updateTarget]);

  const { timeLeft, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer(
    GAME_DURATION,
    endGame
  );

  const spawnNewTarget = useCallback(() => {
    if (aborted.current) return;
    if (despawnTimer.current) clearTimeout(despawnTimer.current);

    const { width, height } = containerSizeRef.current;
    const diff = difficultyRef.current;
    const newTarget = createTargetForDifficulty(diff, width, height);
    updateTarget(newTarget);
    sfx.spawn();

    const config = DIFFICULTIES[diff];
    // Only static + evasion use timeouts. Linear/shrinking expire via rAF.
    if (config.mechanic === "static" || config.mechanic === "evasion") {
      despawnTimer.current = setTimeout(() => {
        if (aborted.current) return;
        setCombo(0);
        spawnNewTarget();
      }, config.timeout);
    }
  }, [updateTarget]);

  const startAnimationLoop = useCallback(() => {
    cancelAnimationFrame(rafId.current);

    const tick = () => {
      if (aborted.current) return;
      const current = targetRef.current;
      if (!current) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();

      if (current.motion) {
        const { x, y, phase } = updateLinearPosition(current.motion, now);
        if (phase === "complete") {
          // Migration cycle done — start a new one from current end to a new random position
          const { width, height } = containerSizeRef.current;
          const newMotion = nextMigrationCycle(current.motion, width, height, current.dimensions);
          const next = { ...current, x: newMotion.startX, y: newMotion.startY, motion: newMotion };
          targetRef.current = next;
          setTarget(next);
        } else {
          const next = { ...current, x, y };
          targetRef.current = next;
          setTarget(next);
        }
      } else if (current.currentSize !== undefined) {
        const config = DIFFICULTIES[difficultyRef.current];
        const { size, expired } = updateShrinkingSize(current.spawnTime, now, config.timeout);
        if (expired) {
          setCombo(0);
          spawnNewTarget();
        } else {
          const next = { ...current, currentSize: size };
          targetRef.current = next;
          setTarget(next);
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  }, [spawnNewTarget]);

  const startGame = useCallback(
    (diff: Difficulty) => {
      aborted.current = false;
      difficultyRef.current = diff;
      setDifficulty(diff);
      setStats(initialStats);
      setCombo(0);
      setGameState("playing");
      behaviorTracker.current = createBehaviorTracker();
      startTimer();
      sfx.gameStart();
      startMusic();

      const mechanic = DIFFICULTIES[diff].mechanic;
      if (mechanic === "linear" || mechanic === "shrinking") {
        startAnimationLoop();
      }

      setTimeout(() => {
        if (aborted.current) return;
        spawnNewTarget();
      }, 100);
    },
    [startTimer, spawnNewTarget, startAnimationLoop]
  );

  const handleTargetClick = useCallback(
    (clickX: number, clickY: number) => {
      if (gameState !== "playing") return;
      const current = targetRef.current;
      if (!current) return;

      const now = performance.now();
      const reactionTime = now - current.spawnTime;
      behaviorTracker.current.trackClick(clickX, clickY, current.x, current.y, reactionTime);

      const scoreGain = calculateScore(current, combo, difficultyRef.current, now);

      setStats((prev) => {
        const newReactionTimes = [...prev.reactionTimes, reactionTime];
        const newHits = prev.hits + 1;
        const newClicks = prev.clicks + 1;
        const avgRT =
          newReactionTimes.reduce((a, b) => a + b, 0) / newReactionTimes.length;

        return {
          score: prev.score + scoreGain,
          clicks: newClicks,
          hits: newHits,
          reactionTimes: newReactionTimes,
          avgReactionTime: Math.round(avgRT),
          accuracy: Math.round((newHits / newClicks) * 1000) / 10,
        };
      });

      const newCombo = combo + 1;
      setCombo(newCombo);
      setShowScorePop({ x: clickX, y: clickY, value: scoreGain });
      setTimeout(() => setShowScorePop(null), 600);

      if (newCombo >= 3) {
        sfx.combo(newCombo);
      } else {
        sfx.hit();
      }

      spawnNewTarget();
    },
    [gameState, combo, spawnNewTarget]
  );

  const handleMiss = useCallback(() => {
    if (gameState !== "playing") return;
    sfx.miss();
    setStats((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
      accuracy:
        prev.clicks + 1 > 0
          ? Math.round((prev.hits / (prev.clicks + 1)) * 1000) / 10
          : 0,
    }));
    setCombo(0);
  }, [gameState]);

  const resetGame = useCallback(() => {
    aborted.current = true;
    stopMusic();
    stopTimer();
    resetTimer();
    setGameState("idle");
    updateTarget(null);
    setStats(initialStats);
    setCombo(0);
    cancelAnimationFrame(rafId.current);
    if (despawnTimer.current) clearTimeout(despawnTimer.current);
  }, [stopTimer, resetTimer, updateTarget]);

  useEffect(() => {
    return () => {
      aborted.current = true;
      cancelAnimationFrame(rafId.current);
      if (despawnTimer.current) {
        clearTimeout(despawnTimer.current);
        despawnTimer.current = null;
      }
      stopMusic();
    };
  }, []);

  return {
    gameState,
    difficulty,
    stats,
    target,
    combo,
    timeLeft,
    showScorePop,
    startGame,
    handleTargetClick,
    handleMiss,
    resetGame,
    setTarget: updateTarget,
    trackMouseMove: () => behaviorTracker.current.trackMouseMove(),
    getBehaviorSignals: () => behaviorTracker.current.getSignals(),
  };
}
