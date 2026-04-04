export default function PromoCard() {
  return (
    <div className="relative bg-surface-container border-[3px] border-tertiary-container p-4 neon-glow-cyan">
      <span className="sticker -top-2 -left-2">HOT</span>
      <h3 className="font-display text-sm font-bold text-tertiary-container uppercase mb-1">
        WIN REAL CREDITS
      </h3>
      <p className="font-body text-xs text-on-surface-variant">
        Top the leaderboard each week. Bragging rights included.<span className="text-primary-container font-bold">*</span>
      </p>
    </div>
  );
}
