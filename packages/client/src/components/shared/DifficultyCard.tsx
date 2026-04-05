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

function PreviewContent({ difficulty }: { difficulty: Difficulty }) {
  switch (difficulty) {
    case "easy":
      return (
        <>
          <div className="w-12 h-12 bg-primary-container animate-ping" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: STATIC_SPAWN</span>
        </>
      );
    case "medium":
      return (
        <>
          <div className="w-12 h-12 bg-secondary animate-bounce" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: LINEAR_PATH</span>
        </>
      );
    case "hard":
      return (
        <>
          <div className="w-8 h-8 bg-error absolute top-4 left-10" />
          <div className="w-8 h-8 bg-error-container absolute bottom-4 right-10" />
          <span className="absolute bottom-2 left-2 text-[10px] text-on-surface-variant/50 font-display">PREVIEW: MULTI_TARGET</span>
        </>
      );
    case "impossible":
      return (
        <>
          <div className="w-16 h-16 border-4 border-primary-container animate-spin" />
          <span className="absolute bottom-2 left-2 text-[10px] text-primary-container/50 font-display">PREVIEW: GHOST_TARGETS</span>
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
      className={`relative ${isImpossible ? "bg-black" : "bg-surface-container-high"} p-5 border-4 ${accentMap[difficulty]} transition-all group text-left flex flex-col`}
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
        <span className={`${badgeColorMap[difficulty]} font-display text-[10px] font-bold px-2 py-1 uppercase`}>
          {isImpossible ? `${(config.timeout / 1000).toFixed(1)}S + EVASION` : `${(config.timeout / 1000).toFixed(1)}S WINDOW`}
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
