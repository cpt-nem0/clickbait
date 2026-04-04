import { SKINS, TargetSkin, getUnlockedSkins } from "@/lib/skins";

interface SkinSelectorProps {
  highScore: number;
  activeSkin: TargetSkin;
  onSelect: (skin: TargetSkin) => void;
}

export default function SkinSelector({ highScore, activeSkin, onSelect }: SkinSelectorProps) {
  const unlocked = getUnlockedSkins(highScore);

  return (
    <div className="bg-surface-container border-[3px] border-outline-variant p-4">
      <h3 className="font-display text-sm font-bold text-primary-container uppercase mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-base">palette</span>
        TARGET_SKINS
      </h3>

      <div className="space-y-2">
        {SKINS.map((skin) => {
          const isUnlocked = unlocked.some((u) => u.id === skin.id);
          const isActive = activeSkin.id === skin.id;

          return (
            <button
              key={skin.id}
              onClick={() => isUnlocked && onSelect(skin)}
              className={`w-full flex items-center gap-3 p-2 transition-all ${
                isActive
                  ? "bg-surface-container-highest border-[2px] border-primary-container"
                  : isUnlocked
                  ? "bg-surface-container-high hover:bg-surface-container-highest border-[2px] border-transparent"
                  : "opacity-40 cursor-not-allowed border-[2px] border-transparent"
              }`}
            >
              <div className={`w-8 h-8 ${skin.cssClass} shrink-0 flex items-center justify-center`}>
                {!isUnlocked && (
                  <span className="material-symbols-outlined text-white text-sm">lock</span>
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`font-display text-xs font-bold uppercase ${
                  isActive ? "text-primary-container" : "text-on-surface"
                }`}>
                  {skin.name}
                </p>
                <p className="font-body text-[10px] text-on-surface-variant truncate">
                  {isUnlocked ? skin.label : `UNLOCK AT ${skin.unlockScore.toLocaleString()} PTS`}
                </p>
              </div>
              {isActive && (
                <span className="font-display text-[10px] text-primary-container font-bold">ON</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
