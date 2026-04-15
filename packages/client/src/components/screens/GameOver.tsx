import { useMemo, useState } from "react";
import { Difficulty, LeaderboardEntry } from "@/types";

interface GameOverProps {
  score: number;
  avgReactionTime: number;
  accuracy: number;
  difficulty: Difficulty;
  isHighScore: boolean;
  currentUsername: string;
  leaderboard: LeaderboardEntry[];
  onSubmitScore: (username: string) => void;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

type RowEntry =
  | { kind: "real"; entry: LeaderboardEntry; rank: number }
  | { kind: "you"; score: number; avgReactionTime: number; rank: number; username: string };

export default function GameOver({
  score,
  avgReactionTime,
  accuracy,
  isHighScore,
  currentUsername,
  leaderboard,
  onSubmitScore,
  onPlayAgain,
  onChangeDifficulty,
}: GameOverProps) {
  const [username, setUsername] = useState(currentUsername);

  // Build rows: real entries + an injected "YOU" row if current score isn't already in the list.
  const rows = useMemo<RowEntry[]>(() => {
    const real: RowEntry[] = leaderboard.map((entry, i) => ({
      kind: "real",
      entry,
      rank: i + 1,
    }));

    const alreadySubmitted = currentUsername
      ? leaderboard.some(
          (e) =>
            e.username.toLowerCase() === currentUsername.toLowerCase() &&
            e.score === score
        )
      : false;

    if (alreadySubmitted) return real;

    // Find the rank slot for the current score.
    const insertAt = leaderboard.findIndex((e) => score > e.score);
    const youRank = insertAt === -1 ? leaderboard.length + 1 : insertAt + 1;
    const youRow: RowEntry = {
      kind: "you",
      score,
      avgReactionTime,
      rank: youRank,
      username: currentUsername || "PENDING...",
    };

    // Insert and re-rank
    const merged = [...real];
    merged.splice(youRank - 1, 0, youRow);
    return merged.map((r, i) => ({ ...r, rank: i + 1 })).slice(0, 10);
  }, [leaderboard, score, avgReactionTime, currentUsername]);

  const top3Border = (rank: number) =>
    rank === 1 ? "border-l-secondary" : rank === 2 ? "border-l-tertiary" : "border-l-primary-container";

  const top3RankColor = (rank: number) =>
    rank === 1 ? "text-secondary" : rank === 2 ? "text-tertiary" : "text-primary-container";

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top row — Score + Submit */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-stretch mb-12">
          {/* GAME_OVER score panel */}
          <section className="flex-1 bg-surface-container-highest border-4 border-primary-container p-8 relative overflow-hidden flex flex-col justify-center items-center">
            <div className="absolute inset-0 scanline-overlay pointer-events-none z-0" />
            {isHighScore && (
              <div className="absolute top-6 -right-6 bg-error text-on-error px-6 py-2 font-display font-black uppercase tracking-tighter rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 text-sm">
                NEW HIGH SCORE!
              </div>
            )}
            <h2 className="relative z-10 font-display font-black text-2xl uppercase tracking-widest text-secondary mb-2 italic text-glow-pink">
              GAME_OVER
            </h2>
            <div className="relative z-10 font-display font-black text-[8rem] md:text-[12rem] leading-none text-primary-container italic tracking-tighter score-crt-glow mb-4">
              {score.toLocaleString()}
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-black border-2 border-tertiary p-4 flex flex-col items-center justify-center">
                <span className="font-display text-xs uppercase text-tertiary-dim tracking-widest">
                  AVG_REACTION
                </span>
                <span className="font-display font-bold text-2xl text-tertiary">
                  {avgReactionTime}ms
                </span>
              </div>
              <div className="bg-black border-2 border-secondary p-4 flex flex-col items-center justify-center">
                <span className="font-display text-xs uppercase text-secondary-dim tracking-widest">
                  ACCURACY
                </span>
                <span className="font-display font-bold text-2xl text-secondary">
                  {accuracy}%
                </span>
              </div>
            </div>
          </section>

          {/* Submit + actions */}
          <aside className="w-full md:w-96 flex flex-col gap-4">
            <div className="bg-secondary p-6 border-4 border-black shadow-[4px_4px_0px_0px_#cafd00] flex-1 flex flex-col justify-center">
              <h3 className="font-display font-black text-2xl uppercase italic mb-4 text-black">
                CLAIM_YOUR_SPOT
              </h3>
              <p className="font-body text-black text-sm mb-6 leading-tight font-bold">
                YOU REACHED THE TOP 10! ENTER YOUR HANDLE TO BECOME IMMORTAL.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase().slice(0, 16))}
                  placeholder="ENTER_NAME"
                  maxLength={16}
                  className="w-full bg-surface-container-lowest border-4 border-black p-4 font-display font-bold text-primary-container focus:ring-0 focus:border-primary-container outline-none placeholder:text-stone-700 uppercase"
                />
                <button
                  onClick={() => username && onSubmitScore(username)}
                  disabled={!username}
                  className="w-full bg-black text-primary-container font-display font-black text-xl py-4 border-4 border-primary-container hover:bg-primary-container hover:text-black transition-all active:translate-y-1 uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  SUBMIT_SCORE
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onPlayAgain}
                className="flex-1 bg-primary-container text-black font-display font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:skew-x-2 transition-all uppercase"
              >
                PLAY_AGAIN
              </button>
              <button
                onClick={onChangeDifficulty}
                className="flex-1 bg-surface-container-highest text-on-surface font-display font-black py-4 border-4 border-outline hover:bg-outline hover:text-black transition-all uppercase"
              >
                DIFFICULTY
              </button>
            </div>
          </aside>
        </div>

        {/* HALL_OF_FAME */}
        <section className="w-full">
          <div className="flex items-end gap-4 mb-6">
            <h3 className="font-display font-black text-5xl uppercase italic text-primary-container tracking-tighter">
              HALL_OF_FAME
            </h3>
            <div className="h-1 flex-1 bg-primary-container mb-2" />
            <div className="bg-primary-container text-black font-display font-bold px-4 py-1 uppercase text-sm mb-1">
              GLOBAL_RANKINGS
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Header row */}
            <div className="grid grid-cols-12 bg-primary-container text-black font-display font-black text-sm p-4 uppercase tracking-widest border-l-8 border-black">
              <div className="col-span-1">#</div>
              <div className="col-span-6">PLAYER_ID</div>
              <div className="col-span-3 text-right">REACTION</div>
              <div className="col-span-2 text-right">SCORE</div>
            </div>

            {rows.length === 0 && (
              <div className="bg-surface-container-high p-8 text-center border-l-8 border-outline font-display text-on-surface-variant uppercase">
                NO_DATA_FOUND
              </div>
            )}

            {rows.map((row) => {
              const stripe = row.rank % 2 === 1 ? "bg-surface-container-high" : "bg-surface-container-low";

              if (row.kind === "you") {
                return (
                  <div
                    key="you-row"
                    className="grid grid-cols-12 bg-surface-container-highest p-4 border-l-8 border-white border-dashed opacity-90 font-display group hover:bg-white transition-colors cursor-default"
                  >
                    <div className="col-span-1 font-black text-white group-hover:text-black italic">
                      YOU
                    </div>
                    <div className="col-span-6 font-black italic group-hover:text-black">
                      {row.username}
                    </div>
                    <div className="col-span-3 text-right text-on-surface-variant group-hover:text-black italic">
                      {row.avgReactionTime}ms
                    </div>
                    <div className="col-span-2 text-right font-black text-primary-container group-hover:text-black italic">
                      {row.score.toLocaleString()}
                    </div>
                  </div>
                );
              }

              const e = row.entry;
              const isTop3 = row.rank <= 3;
              const isCurrentUser =
                currentUsername &&
                e.username.toLowerCase() === currentUsername.toLowerCase();

              // Top 3 special styling
              if (isTop3) {
                const hoverBg =
                  row.rank === 1
                    ? "hover:bg-secondary-container"
                    : row.rank === 2
                    ? "hover:bg-tertiary-container"
                    : "hover:bg-primary-container";
                const hoverText =
                  row.rank === 1 ? "group-hover:text-white" : "group-hover:text-black";
                const scoreColor = row.rank === 3 ? "text-black" : "text-primary-container";

                return (
                  <div
                    key={`${e.username}-${e.created_at}`}
                    className={`grid grid-cols-12 ${stripe} p-4 border-l-8 ${top3Border(row.rank)} font-display group ${hoverBg} transition-colors cursor-default`}
                  >
                    <div className={`col-span-1 font-black ${top3RankColor(row.rank)} ${hoverText}`}>
                      {String(row.rank).padStart(2, "0")}
                    </div>
                    <div className={`col-span-6 font-bold flex items-center gap-2 ${hoverText}`}>
                      {row.rank === 1 && (
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      )}
                      {e.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-[10px] bg-black text-primary-container px-1.5 py-0.5 font-bold not-italic">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className={`col-span-3 text-right text-on-surface-variant ${hoverText}`}>
                      {e.avg_reaction_time}ms
                    </div>
                    <div className={`col-span-2 text-right font-black ${scoreColor} ${hoverText}`}>
                      {e.score.toLocaleString()}
                    </div>
                  </div>
                );
              }

              // Regular rows 4+
              return (
                <div
                  key={`${e.username}-${e.created_at}`}
                  className={`grid grid-cols-12 ${stripe} p-4 border-l-8 border-outline font-display group hover:bg-surface-container-highest transition-colors cursor-default`}
                >
                  <div className="col-span-1 font-black text-on-surface-variant">
                    {String(row.rank).padStart(2, "0")}
                  </div>
                  <div className="col-span-6 font-bold flex items-center gap-2">
                    {e.username}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] bg-primary-container text-black px-1.5 py-0.5 font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-right text-on-surface-variant">
                    {e.avg_reaction_time}ms
                  </div>
                  <div className="col-span-2 text-right font-black text-primary-container">
                    {e.score.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
