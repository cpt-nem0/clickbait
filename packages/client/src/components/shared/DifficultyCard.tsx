import { Difficulty, DifficultyConfig } from "@/types";

interface DifficultyCardProps {
  difficulty: Difficulty;
  config: DifficultyConfig;
  onSelect: (difficulty: Difficulty) => void;
}

const accentMap: Record<Difficulty, string> = {
  easy: "border-primary-container/30 hover:border-primary-container",
  medium: "border-primary-container/30 hover:border-primary-container",
  hard: "border-error/30 hover:border-error",
  impossible: "border-secondary hover:border-secondary neon-glow-pink",
};

const labelColorMap: Record<Difficulty, string> = {
  easy: "text-primary-container",
  medium: "text-primary-container",
  hard: "text-error",
  impossible: "text-secondary",
};

export default function DifficultyCard({
  difficulty,
  config,
  onSelect,
}: DifficultyCardProps) {
  const isImpossible = difficulty === "impossible";

  return (
    <button
      onClick={() => onSelect(difficulty)}
      className={`relative bg-surface-container p-5 border-[3px] ${accentMap[difficulty]} transition-all group text-left ${
        isImpossible ? "glitch-border" : ""
      }`}
    >
      {isImpossible && (
        <span className="sticker -top-2 -right-2">DANGER</span>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-display text-xl font-bold ${labelColorMap[difficulty]}`}>
          {config.label}
        </h3>
        <span className="font-display text-xs text-on-surface-variant bg-surface-container-highest px-2 py-1">
          {config.timeout}ms
        </span>
      </div>

      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
        {config.description}
      </p>

      <div className="mt-4 h-16 bg-surface-container-high flex items-center justify-center relative overflow-hidden">
        <div
          className={`w-8 h-8 ${
            difficulty === "impossible" ? "bg-secondary" :
            difficulty === "hard" ? "bg-error" :
            "bg-primary-container"
          } transition-transform group-hover:scale-110`}
        />
        {config.evasion && (
          <span className="absolute bottom-1 right-1 font-display text-[10px] text-secondary uppercase">
            EVASION_ON
          </span>
        )}
      </div>
    </button>
  );
}
