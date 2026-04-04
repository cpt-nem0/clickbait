import { TARGET_SIZE } from "@/lib/difficulty";
import { Difficulty } from "@/types";

interface TargetProps {
  x: number;
  y: number;
  difficulty: Difficulty;
  onClick: (e: React.MouseEvent) => void;
}

const targetStyle: Record<Difficulty, { bg: string; glow: string }> = {
  easy: { bg: "bg-primary-container", glow: "neon-glow-yellow" },
  medium: { bg: "bg-primary-container", glow: "neon-glow-yellow" },
  hard: { bg: "bg-error", glow: "neon-glow-pink" },
  impossible: { bg: "bg-secondary", glow: "neon-glow-pink" },
};

export default function Target({ x, y, difficulty, onClick }: TargetProps) {
  return (
    <button
      onClick={onClick}
      className="absolute animate-elastic-in cursor-pointer select-none"
      style={{
        left: x - TARGET_SIZE / 2,
        top: y - TARGET_SIZE / 2,
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        willChange: "transform",
      }}
    >
      <div className={`w-full h-full ${targetStyle[difficulty].bg} hard-shadow flex flex-col items-center justify-center relative ${targetStyle[difficulty].glow} hover:scale-105 transition-transform duration-75`}>
        <span className="font-display text-lg font-bold text-black uppercase leading-none">
          CLICK
        </span>
        <span className="font-display text-2xl font-bold text-black uppercase leading-none">
          ME!
        </span>
        <span className="absolute bottom-1 font-display text-[9px] font-bold text-black/40 uppercase">
          {difficulty}
        </span>
      </div>
    </button>
  );
}
