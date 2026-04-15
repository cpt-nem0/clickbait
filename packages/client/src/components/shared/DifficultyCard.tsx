import { Difficulty, DifficultyConfig } from "@/types";

interface DifficultyCardProps {
  difficulty: Difficulty;
  config: DifficultyConfig;
  onSelect: (difficulty: Difficulty) => void;
}

const accentMap: Record<Difficulty, string> = {
  easy: "border-outline hover:border-primary-container",
  medium: "border-outline hover:border-primary-container",
  hard: "border-outline hover:border-primary-container",
  impossible: "border-primary-container hover:skew-y-1",
};

const labelColorMap: Record<Difficulty, string> = {
  easy: "text-on-surface",
  medium: "text-on-surface",
  hard: "text-on-surface",
  impossible: "text-primary-container italic",
};

const badgeColorMap: Record<Difficulty, string> = {
  easy: "bg-primary-container text-black",
  medium: "bg-secondary text-black",
  hard: "bg-error text-black",
  impossible: "bg-white text-black",
};

const ctaColorMap: Record<Difficulty, string> = {
  easy: "text-primary-container",
  medium: "text-secondary",
  hard: "text-error",
  impossible: "text-primary-container",
};

const mechanicLabel: Record<Difficulty, string> = {
  easy: "LINEAR",
  medium: "STATIC",
  hard: "SHRINK",
  impossible: "EVADE",
};

function PreviewContent({ difficulty }: { difficulty: Difficulty }) {
  switch (difficulty) {
    case "easy":
      return (
        <>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
            <line
              x1="10"
              y1="45"
              x2="90"
              y2="15"
              stroke="#cafd00"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />
          </svg>
          <div className="w-8 h-8 bg-primary-container preview-linear-slide" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: LINEAR_PATH</span>
        </>
      );
    case "medium":
      return (
        <>
          <div className="w-8 h-8 bg-secondary preview-static-popup" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: STATIC_SPAWN</span>
        </>
      );
    case "hard":
      return (
        <>
          <div className="bg-error preview-shrinking" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: SHRINKING_TARGET</span>
        </>
      );
    case "impossible":
      return (
        <>
          <div className="w-8 h-8 bg-primary-container preview-evading" />
          <span className="absolute bottom-2 left-2 text-[10px] text-primary-container/50 font-display">PREVIEW: EVASION</span>
        </>
      );
  }
}

export default function DifficultyCard({
  difficulty,
  config,
  onSelect,
}: DifficultyCardProps) {
  const isImpossible = difficulty === "impossible";

  return (
    <button
      onClick={() => onSelect(difficulty)}
      className={`relative min-w-0 ${isImpossible ? "bg-black" : "bg-surface-container-high"} p-5 border-4 ${accentMap[difficulty]} transition-all group text-left flex flex-col`}
    >
      {isImpossible && (
        <>
          <span className="sticker -top-2 -right-2">DANGER</span>
          <div className="vibration-overlay absolute inset-0 opacity-20 pointer-events-none overflow-hidden" />
        </>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`font-display text-2xl font-black ${labelColorMap[difficulty]}`}>
          {config.label}
        </h3>
        <span className={`${badgeColorMap[difficulty]} font-display text-[10px] font-bold px-2 py-1 uppercase whitespace-nowrap shrink-0`}>
          {mechanicLabel[difficulty]}
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center relative overflow-hidden z-10">
        <PreviewContent difficulty={difficulty} />
      </div>

      <p className="mt-3 font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-widest relative z-10">
        {config.description}
      </p>

      <div className="mt-3 flex justify-between items-center relative z-10">
        <span className={`${ctaColorMap[difficulty]} font-display font-black`}>
          {isImpossible ? "START_DEATH_VOYAGE" : "START_"}
        </span>
        <span className={`material-symbols-outlined ${isImpossible ? "text-primary-container" : ""} group-hover:translate-x-2 transition-transform`}>
          {isImpossible ? "warning" : "arrow_forward"}
        </span>
      </div>
    </button>
  );
}
