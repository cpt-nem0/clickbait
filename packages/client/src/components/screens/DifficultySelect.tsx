import { Difficulty, LeaderboardEntry } from "@/types";
import { DIFFICULTIES } from "@/lib/difficulty";
import DifficultyCard from "@/components/shared/DifficultyCard";
import GlobalRankings from "@/components/shared/GlobalRankings";
import PromoCard from "@/components/shared/PromoCard";

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
  leaderboard: LeaderboardEntry[];
  currentUsername?: string;
}

export default function DifficultySelect({ onSelect, leaderboard, currentUsername }: DifficultySelectProps) {
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
        <GlobalRankings entries={leaderboard} currentUsername={currentUsername} />
        <PromoCard />
      </div>
    </div>
  );
}
