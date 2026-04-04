import { useState, useCallback, useRef, useEffect } from "react";
import { Difficulty, GameState, GameStats, TargetPosition } from "@/types";
import { DIFFICULTIES, GAME_DURATION } from "@/lib/difficulty";
import { spawnTarget } from "@/lib/target-logic";
import { useTimer } from "./useTimer";
import { sfx, startMusic, stopMusic } from "@/lib/audio";

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
  const [target, setTarget] = useState<TargetPosition | null>(null);
  const [combo, setCombo] = useState(0);
  const [showScorePop, setShowScorePop] = useState<{ x: number; y: number; value: number } | null>(null);

  const targetSpawnTime = useRef(0);
  const despawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aborted = useRef(false);

  const endGame = useCallback(() => {
    if (aborted.current) return;
    setGameState("gameOver");
    setTarget(null);
    if (despawnTimer.current) clearTimeout(despawnTimer.current);
    stopMusic();
    sfx.gameOver();
  }, []);

  const { timeLeft, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer(
    GAME_DURATION,
    endGame
  );

  const spawnNewTarget = useCallback(() => {
    if (aborted.current) return;
    if (despawnTimer.current) clearTimeout(despawnTimer.current);

    const pos = spawnTarget(containerSize.width, containerSize.height);
    setTarget(pos);
    targetSpawnTime.current = Date.now();
    sfx.spawn();

    const config = DIFFICULTIES[difficulty];
    despawnTimer.current = setTimeout(() => {
      if (aborted.current) return;
      setCombo(0);
      spawnNewTarget();
    }, config.timeout);
  }, [containerSize, difficulty]);

  const startGame = useCallback(
    (diff: Difficulty) => {
      aborted.current = false;
      setDifficulty(diff);
      setStats(initialStats);
      setCombo(0);
      setGameState("playing");
      startTimer();
      sfx.gameStart();
      startMusic();

      setTimeout(() => {
        if (aborted.current) return;
        spawnNewTarget();
      }, 100);
    },
    [containerSize, startTimer, spawnNewTarget]
  );

  const handleTargetClick = useCallback(
    (clickX: number, clickY: number) => {
      if (gameState !== "playing" || !target) return;

      const reactionTime = Date.now() - targetSpawnTime.current;

      setStats((prev) => {
        const newReactionTimes = [...prev.reactionTimes, reactionTime];
        const newHits = prev.hits + 1;
        const newClicks = prev.clicks + 1;
        const avgRT =
          newReactionTimes.reduce((a, b) => a + b, 0) / newReactionTimes.length;

        return {
          score: prev.score + 100 + combo * 50,
          clicks: newClicks,
          hits: newHits,
          reactionTimes: newReactionTimes,
          avgReactionTime: Math.round(avgRT),
          accuracy: Math.round((newHits / newClicks) * 1000) / 10,
        };
      });

      const newCombo = combo + 1;
      setCombo(newCombo);
      setShowScorePop({ x: clickX, y: clickY, value: 100 + combo * 50 });
      setTimeout(() => setShowScorePop(null), 600);

      if (newCombo >= 3) {
        sfx.combo(newCombo);
      } else {
        sfx.hit();
      }

      spawnNewTarget();
    },
    [gameState, target, combo, spawnNewTarget]
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
    setTarget(null);
    setStats(initialStats);
    setCombo(0);
    if (despawnTimer.current) clearTimeout(despawnTimer.current);
  }, [stopTimer, resetTimer]);

  useEffect(() => {
    return () => {
      aborted.current = true;
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
    setTarget,
  };
}
