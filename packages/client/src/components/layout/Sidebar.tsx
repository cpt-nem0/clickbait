interface SidebarProps {
  username: string;
  highScore: number;
  currentView: "arcade" | "leaderboard";
  onNavigate: (view: "arcade" | "leaderboard") => void;
}

export default function Sidebar({ username, highScore, currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "arcade" as const, label: "ARCADE", icon: "sports_esports" },
    { id: "leaderboard" as const, label: "LEADERBOARD", icon: "leaderboard" },
  ];

  return (
    <aside className="w-56 bg-surface-container-low border-r-[3px] border-outline-variant flex flex-col">
      <div className="p-4 border-b-[3px] border-outline-variant">
        <div className="bg-surface-container-high p-3">
          <p className="font-display text-xs text-on-surface-variant uppercase">PLAYER_1</p>
          <p className="font-display text-sm font-bold text-primary truncate">{username || "ANON_USER"}</p>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            HIGH: <span className="text-primary-container font-bold">{highScore.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 font-display text-sm font-bold uppercase sidebar-nav-item ${
              currentView === item.id
                ? "bg-primary-container text-black italic translate-x-1"
                : "text-on-surface-variant hover:text-primary-container hover:italic hover:translate-x-1 transition-all duration-75"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="bg-error/10 border-[3px] border-error p-3">
          <p className="font-display text-xs font-bold text-error uppercase">PRO TIP</p>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            Click targets faster to build combos and multiply your score.
          </p>
        </div>
      </div>
    </aside>
  );
}
