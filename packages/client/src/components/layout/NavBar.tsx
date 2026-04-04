import { useState } from "react";

interface NavBarProps {
  currentView: "arcade" | "leaderboard";
  onNavigate: (view: "arcade" | "leaderboard") => void;
  onLogoClick: () => void;
  showNav?: boolean;
}

type HelpLine =
  | { type: "heading"; text: string }
  | { type: "step"; num: number; text: string }
  | { type: "divider" }
  | { type: "subheading"; text: string }
  | { type: "q"; text: string }
  | { type: "a"; text: string }
  | { type: "outro"; text: string };

const HELP_CONTENT: HelpLine[] = [
  { type: "heading", text: "WHY DO YOU NEED HELP? IT'S CLICKING. YOU CLICK THINGS." },
  { type: "divider" },
  { type: "step", num: 1, text: "SEE GREEN BOX." },
  { type: "step", num: 2, text: "CLICK GREEN BOX." },
  { type: "step", num: 3, text: "REPEAT UNTIL TIME RUNS OUT." },
  { type: "step", num: 4, text: "QUESTION YOUR LIFE CHOICES." },
  { type: "divider" },
  { type: "subheading", text: "STILL CONFUSED? HERE'S MORE:" },
  { type: "divider" },
  { type: "q", text: "HOW DO I WIN?" },
  { type: "a", text: "CLICK FASTER THAN EVERYONE ELSE. IT'S NOT ROCKET SCIENCE." },
  { type: "divider" },
  { type: "q", text: "WHAT'S IMPOSSIBLE MODE?" },
  { type: "a", text: "THE BOX RUNS AWAY FROM YOUR CURSOR. YES, REALLY. NO, WE'RE NOT SORRY." },
  { type: "divider" },
  { type: "q", text: "MY SCORE DIDN'T SAVE!" },
  { type: "a", text: "DID YOU CLICK SUBMIT? IT'S A GAME ABOUT CLICKING AND YOU FORGOT TO CLICK." },
  { type: "divider" },
  { type: "q", text: "IS THIS GAME RIGGED?" },
  { type: "a", text: "NO. YOU'RE JUST SLOW. (KIDDING. MAYBE.)" },
  { type: "divider" },
  { type: "q", text: "I FOUND A BUG." },
  { type: "a", text: "IT'S A FEATURE. BUT FINE, EMAIL US." },
  { type: "divider" },
  { type: "outro", text: "NOW CLOSE THIS AND GO CLICK SOMETHING." },
];

export default function NavBar({ currentView, onNavigate, onLogoClick, showNav = false }: NavBarProps) {
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
          {showNav && (
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
          )}
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
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sticker -top-3 -right-3 bg-tertiary-container text-black z-10">
              SERIOUSLY?
            </span>
            <div className="bg-surface-container border-[3px] border-tertiary neon-glow-cyan p-8 max-h-[80vh] overflow-auto">

            <h2 className="font-display text-display-sm font-bold text-tertiary text-glow-cyan uppercase mb-6">
              HELP_CENTER
            </h2>

            <div className="space-y-2">
              {HELP_CONTENT.map((line, i) => {
                switch (line.type) {
                  case "heading":
                    return (
                      <p key={i} className="font-display text-lg font-bold text-secondary text-glow-pink uppercase">
                        {line.text}
                      </p>
                    );
                  case "step":
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center bg-primary-container text-black font-display text-xs font-bold shrink-0">
                          {line.num}
                        </span>
                        <span className="font-display text-sm font-bold text-on-surface uppercase">
                          {line.text}
                        </span>
                      </div>
                    );
                  case "divider":
                    return <div key={i} className="h-2" />;
                  case "subheading":
                    return (
                      <p key={i} className="font-display text-sm font-bold text-tertiary uppercase">
                        {line.text}
                      </p>
                    );
                  case "q":
                    return (
                      <p key={i} className="font-display text-sm font-bold text-primary-container uppercase">
                        Q: {line.text}
                      </p>
                    );
                  case "a":
                    return (
                      <p key={i} className="font-body text-sm text-on-surface-variant pl-4 border-l-2 border-outline-variant">
                        {line.text}
                      </p>
                    );
                  case "outro":
                    return (
                      <p key={i} className="font-display text-base font-bold text-error uppercase mt-2">
                        {line.text}
                      </p>
                    );
                }
              })}
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="btn-primary w-full text-center mt-8"
            >
              OK I GET IT. LET ME CLICK.
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
