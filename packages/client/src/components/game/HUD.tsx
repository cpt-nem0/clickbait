import { Difficulty } from "@/types";

interface HUDProps {
  score: number;
  timeLeft: number;
  highScore: number;
  combo: number;
  difficulty: Difficulty;
}

const difficultyColor: Record<Difficulty, string> = {
  easy: "bg-primary-container text-black",
  medium: "bg-primary-container text-black",
  hard: "bg-error text-white",
  impossible: "bg-secondary text-black",
};

export default function HUD({ score, timeLeft, highScore, combo, difficulty }: HUDProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="flex items-stretch justify-between bg-surface-container border-b-[3px] border-outline-variant">
      <div className="flex-1 px-5 py-3 border-r-[3px] border-outline-variant">
        <p className="font-display text-xs text-on-surface-variant uppercase">SCORE</p>
        <p className="font-display text-2xl font-bold text-primary-container text-glow-yellow">
          {score.toLocaleString()}
        </p>
      </div>

      <div className="px-8 py-3 flex flex-col items-center justify-center border-r-[3px] border-outline-variant">
        <span className={`font-display text-[10px] font-bold uppercase px-2 py-0.5 mb-1 ${difficultyColor[difficulty]}`}>
          {difficulty}
        </span>
        <p
          className={`font-display text-2xl font-bold tabular-nums ${
            isWarning ? "text-error animate-pulse" : "text-on-surface"
          }`}
        >
          {timeStr}
        </p>
      </div>

      <div className="flex-1 px-5 py-3 text-right">
        <p className="font-display text-xs text-on-surface-variant uppercase">HIGH_SCORE</p>
        <p className="font-display text-2xl font-bold text-on-surface-variant">
          {highScore.toLocaleString()}
        </p>
      </div>

      {combo >= 3 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-error px-3 py-1 hard-shadow-sm z-20">
          <span className="font-display text-xs font-bold text-error-on uppercase">
            x{combo} COMBO
          </span>
        </div>
      )}
    </div>
  );
}
