import { Difficulty, LeaderboardEntry } from "@/types";
import { DIFFICULTIES } from "@/lib/difficulty";
import { TargetSkin } from "@/lib/skins";
import DifficultyCard from "@/components/shared/DifficultyCard";
import GlobalRankings from "@/components/shared/GlobalRankings";
import PromoCard from "@/components/shared/PromoCard";
import SkinSelector from "@/components/shared/SkinSelector";

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
  leaderboard: LeaderboardEntry[];
  currentUsername?: string;
  highScore: number;
  activeSkin: TargetSkin;
  onSkinSelect: (skin: TargetSkin) => void;
}

export default function DifficultySelect({ onSelect, leaderboard, currentUsername, highScore, activeSkin, onSkinSelect }: DifficultySelectProps) {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Floating clickbait text watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-12 rotate-[-15deg] scale-125 z-0 overflow-hidden">
        {["99% FAIL!", "SHOCKING TRUTH", "WATCH TILL END", "SECRET REVEALED", "GONE WRONG", "YOU WON'T BELIEVE", "IMPOSSIBLE CHALLENGE", "COPS CALLED"].map((text, i) => (
          <span key={i} className="text-6xl font-black font-display whitespace-nowrap">{text}</span>
        ))}
      </div>

      <div className="flex-1 p-6 relative z-10 flex flex-col min-h-0">
        <div className="mb-4">
          <h1 className="font-display text-6xl font-black text-primary-container text-glow-yellow leading-none uppercase tracking-tighter relative inline-block">
            CLICK
            <br />
            BAIT
            <div className="absolute -top-5 right-[-3.5rem] bg-error text-white font-display font-black px-3 py-1 rotate-12 text-lg border-4 border-black hard-shadow uppercase z-10">
              NEW!
            </div>
          </h1>
          <p className="font-display text-sm font-bold text-tertiary mt-3 bg-surface-container-highest p-2 border-l-8 border-primary-container uppercase block">
            TEST YOUR NERVES. BREAK THE INTERNET. 0.001% REACTION SPEED REQUIRED.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          {(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES.easy][]).map(
            ([key, config]) => (
              <DifficultyCard
                key={key}
                difficulty={key}
                config={config}
                onSelect={onSelect}
              />
            )
          )}
        </div>
      </div>

      <div className="w-72 p-4 space-y-4 border-l-[3px] border-outline-variant relative z-10">
        <SkinSelector highScore={highScore} activeSkin={activeSkin} onSelect={onSkinSelect} />
        <GlobalRankings entries={leaderboard} currentUsername={currentUsername} />
        <PromoCard />
      </div>
    </div>
  );
}
