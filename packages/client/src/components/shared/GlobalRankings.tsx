import { LeaderboardEntry } from "@/types";

interface GlobalRankingsProps {
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

export default function GlobalRankings({ entries, currentUsername }: GlobalRankingsProps) {
  const top5 = entries.slice(0, 5);

  return (
    <div className="bg-surface-container border-[3px] border-outline-variant p-4">
      <h3 className="font-display text-sm font-bold text-tertiary uppercase mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-base">trophy</span>
        GLOBAL_RANKINGS
      </h3>

      <div className="space-y-2">
        {top5.length === 0 && (
          <p className="font-body text-xs text-on-surface-variant">No scores yet.</p>
        )}
        {top5.map((entry, i) => (
          <div
            key={`${entry.username}-${entry.created_at}`}
            className="flex items-center justify-between py-1.5 px-2 bg-surface-container-high"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-display text-xs font-bold w-5 ${
                  i === 0
                    ? "text-primary-container"
                    : i === 1
                    ? "text-secondary"
                    : i === 2
                    ? "text-tertiary"
                    : "text-on-surface-variant"
                }`}
              >
                #{i + 1}
              </span>
              <span className="font-display text-xs text-on-surface truncate max-w-[80px]">
                {entry.username}
                {currentUsername && entry.username.toLowerCase() === currentUsername.toLowerCase() && (
                  <span className="text-primary-container ml-0.5">*</span>
                )}
              </span>
            </div>
            <span className="font-display text-xs font-bold text-primary-container">
              {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
