import { Difficulty, LeaderboardEntry } from "@/types";
import { DIFFICULTIES } from "@/lib/difficulty";

interface HallOfFameProps {
  entries: LeaderboardEntry[];
  currentFilter: Difficulty | "all";
  onFilterChange: (filter: Difficulty | "all") => void;
  currentUsername?: string;
}

export default function HallOfFame({
  entries,
  currentFilter,
  onFilterChange,
  currentUsername,
}: HallOfFameProps) {
  const filters: (Difficulty | "all")[] = ["all", "easy", "medium", "hard", "impossible"];

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-6 border-b-[3px] border-outline-variant pb-4">
          <h2 className="font-display text-display-sm font-bold text-on-surface uppercase">
            HALL_OF_FAME
          </h2>
          <span className="font-display text-xs text-on-surface-variant uppercase">
            GLOBAL_RANKINGS
          </span>
        </div>

        <div className="flex gap-1 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-4 py-2 font-display text-xs font-bold uppercase transition-colors ${
                currentFilter === f
                  ? "bg-primary-container text-black"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface border-[2px] border-outline-variant"
              }`}
            >
              {f === "all" ? "ALL" : DIFFICULTIES[f].label}
            </button>
          ))}
        </div>

        <div className="bg-surface-container border-[3px] border-outline-variant">
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b-[3px] border-outline-variant">
            <span className="w-12 font-display text-xs font-bold text-on-surface-variant uppercase">
              #
            </span>
            <span className="flex-1 font-display text-xs font-bold text-on-surface-variant uppercase">
              PLAYER_ID
            </span>
            <span className="w-24 text-right font-display text-xs font-bold text-on-surface-variant uppercase">
              DIFFICULTY
            </span>
            <span className="w-24 text-right font-display text-xs font-bold text-on-surface-variant uppercase">
              REACTION
            </span>
            <span className="w-20 text-right font-display text-xs font-bold text-on-surface-variant uppercase">
              ACCURACY
            </span>
            <span className="w-28 text-right font-display text-xs font-bold text-on-surface-variant uppercase">
              SCORE
            </span>
          </div>

          {/* Rows */}
          {entries.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="font-display text-sm text-on-surface-variant">NO_DATA_FOUND</p>
            </div>
          )}
          {entries.map((entry, i) => {
            const isCurrentUser =
              currentUsername &&
              entry.username.toLowerCase() === currentUsername.toLowerCase();
            const rankColor =
              i === 0
                ? "text-primary-container font-bold"
                : i === 1
                ? "text-secondary font-bold"
                : i === 2
                ? "text-tertiary font-bold"
                : "text-on-surface-variant";

            return (
              <div
                key={`${entry.username}-${entry.created_at}`}
                className={`flex items-center px-4 py-3 ${
                  isCurrentUser
                    ? "bg-primary-container/10 border-l-[3px] border-l-primary-container"
                    : i % 2 === 0
                    ? "bg-surface-container"
                    : "bg-surface-container-high"
                }`}
              >
                <span className={`w-12 font-display text-sm ${rankColor}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-sm text-on-surface flex items-center gap-2">
                  {isCurrentUser && (
                    <span className="text-[10px] bg-primary-container text-black px-1.5 py-0.5 font-bold">
                      YOU
                    </span>
                  )}
                  {entry.username}
                </span>
                <span className={`w-24 text-right font-display text-xs font-bold uppercase ${
                  entry.difficulty === "impossible" ? "text-secondary" :
                  entry.difficulty === "hard" ? "text-error" :
                  "text-on-surface-variant"
                }`}>
                  {entry.difficulty}
                </span>
                <span className="w-24 text-right font-body text-sm text-on-surface-variant">
                  {entry.avg_reaction_time}ms
                </span>
                <span className="w-20 text-right font-body text-sm text-on-surface-variant">
                  {entry.accuracy}%
                </span>
                <span
                  className={`w-28 text-right font-display text-sm font-bold ${
                    i < 3 ? "text-primary-container" : "text-on-surface"
                  }`}
                >
                  {entry.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
