import { GameTarget } from "@/types";
import { TargetSkin } from "@/lib/skins";

interface TargetProps {
  target: GameTarget;
  skin: TargetSkin;
  onClick: (e: React.MouseEvent) => void;
}

export default function Target({ target, skin, onClick }: TargetProps) {
  const size = target.currentSize ?? target.dimensions;

  return (
    <button
      onClick={onClick}
      className="absolute animate-elastic-in select-none z-20"
      style={{
        left: target.x - size / 2,
        top: target.y - size / 2,
        width: size,
        height: size,
        willChange: "transform",
      }}
    >
      <div className={`w-full h-full ${skin.cssClass}`} />
    </button>
  );
}
