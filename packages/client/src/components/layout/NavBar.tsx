import { useState } from "react";

interface NavBarProps {
  currentView: "arcade" | "leaderboard";
  onNavigate: (view: "arcade" | "leaderboard") => void;
  onLogoClick: () => void;
}

const HELP_LINES = [
  "WHY DO YOU NEED HELP? IT'S CLICKING. YOU CLICK THINGS.",
  "STEP 1: SEE GREEN BOX.",
  "STEP 2: CLICK GREEN BOX.",
  "STEP 3: REPEAT UNTIL TIME RUNS OUT.",
  "STEP 4: QUESTION YOUR LIFE CHOICES.",
  "",
  "STILL CONFUSED? HERE'S MORE:",
  "",
  "Q: HOW DO I WIN?",
  "A: CLICK FASTER THAN EVERYONE ELSE. IT'S NOT ROCKET SCIENCE.",
  "",
  "Q: WHAT'S IMPOSSIBLE MODE?",
  "A: THE BOX RUNS AWAY FROM YOUR CURSOR. YES, REALLY. NO, WE'RE NOT SORRY.",
  "",
  "Q: MY SCORE DIDN'T SAVE!",
  "A: DID YOU CLICK SUBMIT? IT'S A GAME ABOUT CLICKING AND YOU FORGOT TO CLICK.",
  "",
  "Q: IS THIS GAME RIGGED?",
  "A: NO. YOU'RE JUST SLOW. (KIDDING. MAYBE.)",
  "",
  "Q: I FOUND A BUG.",
  "A: IT'S A FEATURE. BUT FINE, EMAIL US.",
  "",
  "NOW CLOSE THIS AND GO CLICK SOMETHING.",
];

export default function NavBar({ currentView, onNavigate, onLogoClick }: NavBarProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-surface-container border-b-[3px] border-outline-variant z-30">
        <div className="flex items-center gap-8">
          <button
            onClick={onLogoClick}
            className="font-display text-xl font-bold text-primary-container tracking-tight hover:text-glow-yellow transition-all"
          >
            CLICKBAIT
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => onNavigate("arcade")}
              className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-tight transition-colors ${
                currentView === "arcade"
                  ? "bg-primary-container text-black"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              ARCADE
            </button>
            <button
              onClick={() => onNavigate("leaderboard")}
              className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-tight transition-colors ${
                currentView === "leaderboard"
                  ? "bg-primary-container text-black"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              LEADERBOARD
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className="material-symbols-outlined text-on-surface-variant text-xl hover:text-tertiary transition-colors"
          >
            help
          </button>
        </div>
      </nav>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative bg-surface-container border-[3px] border-tertiary neon-glow-cyan w-full max-w-lg p-8 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sticker -top-3 -right-3 bg-tertiary-container text-black">
              SERIOUSLY?
            </span>

            <h2 className="font-display text-display-sm font-bold text-tertiary text-glow-cyan uppercase mb-6">
              HELP_CENTER
            </h2>

            <div className="space-y-1">
              {HELP_LINES.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-3" />
                ) : line.startsWith("Q:") ? (
                  <p key={i} className="font-display text-sm font-bold text-primary-container uppercase">
                    {line}
                  </p>
                ) : line.startsWith("A:") ? (
                  <p key={i} className="font-body text-sm text-on-surface-variant">
                    {line}
                  </p>
                ) : (
                  <p key={i} className="font-display text-sm text-on-surface uppercase">
                    {line}
                  </p>
                )
              )}
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="btn-primary w-full text-center mt-8"
            >
              OK I GET IT. LET ME CLICK.
            </button>
          </div>
        </div>
      )}
    </>
  );
}
