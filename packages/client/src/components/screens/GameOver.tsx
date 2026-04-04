import { useState } from "react";
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

export default function GameOver({
  score,
  avgReactionTime,
  accuracy,
  difficulty,
  isHighScore,
  currentUsername,
  leaderboard,
  onSubmitScore,
  onPlayAgain,
  onChangeDifficulty,
}: GameOverProps) {
  const [username, setUsername] = useState(currentUsername);

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6 mb-8">
          {/* Score Display */}
          <div className="flex-1 relative bg-surface-container border-[3px] border-secondary p-8 neon-glow-pink">
            {isHighScore && (
              <span className="sticker -top-3 -right-3 bg-secondary text-white">
                HIGH_SCORE
              </span>
            )}
            <h2 className="font-display text-sm text-on-surface-variant uppercase mb-2">
              GAME_OVER
            </h2>
            <p className="font-display text-display-lg font-bold text-primary-container text-glow-yellow leading-none">
              {score.toLocaleString()}
            </p>

            <div className="flex gap-4 mt-6">
              <div className="flex-1 bg-surface-container-high p-3 border-[3px] border-outline-variant">
                <p className="font-display text-xs text-on-surface-variant uppercase">
                  AVG_REACTION
                </p>
                <p className="font-display text-xl font-bold text-tertiary">
                  {avgReactionTime}ms
                </p>
              </div>
              <div className="flex-1 bg-surface-container-high p-3 border-[3px] border-outline-variant">
                <p className="font-display text-xs text-on-surface-variant uppercase">
                  ACCURACY
                </p>
                <p className="font-display text-xl font-bold text-tertiary">
                  {accuracy}%
                </p>
              </div>
            </div>
          </div>

          {/* Submit Score */}
          <div className="w-72 bg-surface-container border-[3px] border-outline-variant p-6">
            <h3 className="font-display text-sm font-bold text-on-surface uppercase mb-2">
              CLAIM_YOUR_SPOT
            </h3>
            <p className="font-body text-xs text-on-surface-variant mb-4">
              YOU'VE REACHED THE TOP 10! ENTER YOUR HANDLE TO CLAIM YOUR POSITION.
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase().slice(0, 16))}
              placeholder="ENTER_NAME"
              maxLength={16}
              className="w-full bg-surface-container-highest border-[3px] border-outline-variant focus:border-primary-container focus:shadow-neon-yellow px-3 py-2 font-display text-sm text-on-surface uppercase placeholder:text-on-surface-variant/40 outline-none transition-all mb-4"
            />
            <button
              onClick={() => username && onSubmitScore(username)}
              disabled={!username}
              className="btn-primary w-full text-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              SUBMIT_SCORE
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button onClick={onPlayAgain} className="btn-secondary flex-1 text-center">
            PLAY_AGAIN
          </button>
          <button onClick={onChangeDifficulty} className="btn-outline flex-1 text-center">
            DIFFICULTY
          </button>
        </div>

        {/* Hall of Fame inline */}
        <div className="border-b-[3px] border-outline-variant pb-4 mb-6 flex items-end justify-between">
          <h2 className="font-display text-display-sm font-bold text-on-surface uppercase">
            HALL_OF_FAME
          </h2>
          <span className="font-display text-xs text-on-surface-variant uppercase">
            GLOBAL_RANKINGS
          </span>
        </div>

        <div className="bg-surface-container border-[3px] border-outline-variant">
          <div className="flex items-center px-4 py-3 border-b-[3px] border-outline-variant">
            <span className="w-12 font-display text-xs font-bold text-on-surface-variant uppercase">#</span>
            <span className="flex-1 font-display text-xs font-bold text-on-surface-variant uppercase">PLAYER_ID</span>
            <span className="w-24 text-right font-display text-xs font-bold text-on-surface-variant uppercase">DIFFICULTY</span>
            <span className="w-28 text-right font-display text-xs font-bold text-on-surface-variant uppercase">REACTION</span>
            <span className="w-28 text-right font-display text-xs font-bold text-on-surface-variant uppercase">SCORE</span>
          </div>

          {leaderboard.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="font-display text-sm text-on-surface-variant">NO_DATA_FOUND</p>
            </div>
          )}
          {leaderboard.map((entry, i) => {
            const isYou =
              currentUsername &&
              entry.username.toLowerCase() === currentUsername.toLowerCase();
            const rankColor =
              i === 0 ? "text-primary-container font-bold"
              : i === 1 ? "text-secondary font-bold"
              : i === 2 ? "text-tertiary font-bold"
              : "text-on-surface-variant";

            return (
              <div
                key={`${entry.username}-${entry.created_at}`}
                className={`flex items-center px-4 py-3 ${
                  isYou
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
                  {isYou && (
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
                <span className="w-28 text-right font-body text-sm text-on-surface-variant">
                  {entry.avg_reaction_time}ms
                </span>
                <span className={`w-28 text-right font-display text-sm font-bold ${
                  i < 3 ? "text-primary-container" : "text-on-surface"
                }`}>
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
