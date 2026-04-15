import { useRef, useEffect, useState, useCallback } from "react";
import { Difficulty } from "@/types";
import { useGameState } from "@/hooks/useGameState";
import { useMousePosition } from "@/hooks/useMousePosition";
import { shouldEvade, getEvasionPosition } from "@/lib/target-logic";
import { DIFFICULTIES } from "@/lib/difficulty";
import { sfx } from "@/lib/audio";
import { TargetSkin } from "@/lib/skins";
import { BehaviorSignals } from "@/lib/anticheat";
import HUD from "./HUD";
import Target from "./Target";
import StickerOverlay from "./StickerOverlay";

interface GameScreenProps {
  difficulty: Difficulty;
  highScore: number;
  skin: TargetSkin;
  onGameOver: (stats: { score: number; avgReactionTime: number; accuracy: number; behaviorSignals: BehaviorSignals }) => void;
  onBack: () => void;
}

export default function GameScreen({ difficulty, highScore, skin, onGameOver }: GameScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
  const mousePos = useMousePosition(containerRef);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const {
    gameState,
    stats,
    target,
    combo,
    timeLeft,
    showScorePop,
    startGame,
    handleTargetClick,
    handleMiss,
    setTarget,
    trackMouseMove,
    getBehaviorSignals,
  } = useGameState(containerSize);

  useEffect(() => {
    if (gameState === "idle") {
      startGame(difficulty);
    }
  }, [difficulty, gameState, startGame]);

  useEffect(() => {
    if (gameState === "gameOver") {
      onGameOver({
        score: stats.score,
        avgReactionTime: stats.avgReactionTime,
        accuracy: stats.accuracy,
        behaviorSignals: getBehaviorSignals(),
      });
    }
  }, [gameState, stats, onGameOver]);

  // Impossible mode evasion
  useEffect(() => {
    if (
      gameState !== "playing" ||
      !DIFFICULTIES[difficulty].evasion ||
      !target
    )
      return;

    if (shouldEvade(target.x, target.y, mousePos.x, mousePos.y)) {
      const newPos = getEvasionPosition(
        target.x,
        target.y,
        mousePos.x,
        mousePos.y,
        containerSize.width,
        containerSize.height,
        target.dimensions
      );
      setTarget({ ...target, x: newPos.x, y: newPos.y });
      sfx.dodge();
    }
  }, [mousePos, target, difficulty, gameState, containerSize, setTarget]);

  // Timer warning ticks
  const lastTickSecond = useRef(-1);
  useEffect(() => {
    if (gameState !== "playing") return;
    const sec = Math.ceil(timeLeft);
    if (sec === lastTickSecond.current) return;
    lastTickSecond.current = sec;
    if (sec <= 3 && sec > 0) sfx.tickUrgent();
    else if (sec <= 5 && sec > 0) sfx.tick();
  }, [timeLeft, gameState]);

  const onTargetClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!target) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      handleTargetClick(e.clientX - rect.left, e.clientY - rect.top);
    },
    [target, handleTargetClick]
  );

  const onContainerClick = useCallback(() => {
    handleMiss();
  }, [handleMiss]);

  return (
    <div className="flex flex-col flex-1 relative">
      <HUD
        score={stats.score}
        timeLeft={timeLeft}
        highScore={highScore}
        combo={combo}
        difficulty={difficulty}
      />

      <div
        ref={containerRef}
        onClick={onContainerClick}
        onMouseMove={trackMouseMove}
        className="flex-1 relative bg-surface overflow-hidden game-cursor select-none"
      >
        <div className="noise-overlay" style={{ position: "absolute" }} />

        {target && (
          <Target
            target={target}
            skin={skin}
            onClick={onTargetClick}
          />
        )}

        <StickerOverlay
          combo={combo}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
        />

        {showScorePop && (
          <div
            className="absolute pointer-events-none animate-score-pop z-20"
            style={{ left: showScorePop.x, top: showScorePop.y }}
          >
            <span className="font-display text-xl font-bold text-primary-container text-glow-yellow">
              +{showScorePop.value}
            </span>
          </div>
        )}

        {gameState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display text-xl text-on-surface-variant animate-pulse uppercase">
              GET READY...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
