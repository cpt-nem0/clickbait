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
  onTestBotShame?: () => void;
}

export default function DifficultySelect({ onSelect, leaderboard, currentUsername, highScore, activeSkin, onSkinSelect, onTestBotShame }: DifficultySelectProps) {
  return (
    <div className="flex flex-1 overflow-auto">
      <div className="flex-1 p-8">
        <div className="relative mb-8">
          <span className="sticker top-0 right-0">NEW</span>
          <h1 className="font-display text-display-lg font-bold text-primary-container text-glow-yellow leading-none uppercase">
            CLICK
            <br />
            BAIT
          </h1>
          <p className="font-display text-sm text-on-surface-variant uppercase mt-4 tracking-wide">
            TEST YOUR NERVES. BREAK THE INTERNET. 0.00%
            <br />
            REACTION SPEED REQUIRED.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
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

        <button
          onClick={() => {
            const modes: Difficulty[] = ["easy", "medium", "hard", "impossible"];
            onSelect(modes[Math.floor(Math.random() * modes.length)]);
          }}
          className="btn-primary w-full text-center text-lg py-4"
        >
          START_GAME_HYPAA
        </button>
      </div>

      <div className="w-72 p-4 space-y-4 border-l-[3px] border-outline-variant">
        <SkinSelector highScore={highScore} activeSkin={activeSkin} onSelect={onSkinSelect} />
        <GlobalRankings entries={leaderboard} currentUsername={currentUsername} />
        <PromoCard />
        {onTestBotShame && (
          <button onClick={onTestBotShame} className="w-full text-center font-display text-[10px] text-on-surface-variant/30 uppercase hover:text-error transition-colors py-2">
            // TEST_BOT_DETECTION
          </button>
        )}
      </div>
    </div>
  );
}
