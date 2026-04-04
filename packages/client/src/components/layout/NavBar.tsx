interface NavBarProps {
  currentView: "arcade" | "leaderboard";
  onNavigate: (view: "arcade" | "leaderboard") => void;
  onLogoClick: () => void;
}

export default function NavBar({ currentView, onNavigate, onLogoClick }: NavBarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-surface-container border-b-[3px] border-outline-variant">
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
        <span className="material-symbols-outlined text-on-surface-variant text-xl">
          settings
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-xl">
          help
        </span>
      </div>
    </nav>
  );
}
