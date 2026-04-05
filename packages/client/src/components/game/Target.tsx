import { TARGET_SIZE } from "@/lib/difficulty";
import { Difficulty } from "@/types";
import { TargetSkin } from "@/lib/skins";

interface TargetProps {
  x: number;
  y: number;
  difficulty: Difficulty;
  skin: TargetSkin;
  onClick: (e: React.MouseEvent) => void;
}

export default function Target({ x, y, difficulty, skin, onClick }: TargetProps) {
  return (
    <button
      onClick={onClick}
      className="absolute animate-elastic-in select-none z-20"
      style={{
        left: x - TARGET_SIZE / 2,
        top: y - TARGET_SIZE / 2,
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        willChange: "transform",
        cursor: "url('/cursor.svg') 1 1, pointer",
      }}
    >
      <div className={`w-full h-full ${skin.cssClass} flex flex-col items-center justify-center relative`}>
        <span className={`font-display text-lg font-bold ${skin.text} uppercase leading-none relative z-10`}>
          CLICK
        </span>
        <span className={`font-display text-2xl font-bold ${skin.text} uppercase leading-none relative z-10`}>
          ME!
        </span>
        <span className={`absolute bottom-1 font-display text-[9px] font-bold ${skin.text} opacity-40 uppercase z-10`}>
          {difficulty}
        </span>
      </div>
    </button>
  );
}
