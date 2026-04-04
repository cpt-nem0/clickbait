import { TARGET_SIZE } from "@/lib/difficulty";

interface TargetProps {
  x: number;
  y: number;
  difficulty: string;
  onClick: (e: React.MouseEvent) => void;
}

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
      <div className="w-full h-full bg-primary-container hard-shadow flex flex-col items-center justify-center relative neon-glow-yellow hover:scale-105 transition-transform duration-75">
        <span className="font-display text-lg font-bold text-black uppercase leading-none">
          CLICK
        </span>
        <span className="font-display text-2xl font-bold text-black uppercase leading-none">
          ME!
        </span>
        <span className="absolute bottom-1 font-display text-[9px] font-bold text-primary-on uppercase opacity-60">
          {difficulty}
        </span>
      </div>
    </button>
  );
}
