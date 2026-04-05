export default function PromoCard() {
  return (
    <div className="relative bg-secondary-container border-4 border-black overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-tertiary/20 group-hover:scale-110 transition-transform duration-700" />
      <div className="relative z-10 p-4">
        <span className="bg-black text-secondary font-display font-black px-2 py-1 text-xs uppercase mb-2 inline-block">UNLOCKED_VAULT</span>
        <h3 className="font-display text-2xl font-black text-on-secondary-container uppercase leading-none mb-2">
          WIN REAL<br />CREDITS
        </h3>
        <p className="font-body text-xs font-bold uppercase text-on-secondary-container/70">
          Top the leaderboard each week. Bragging rights included.<span className="text-primary-container font-bold">*</span>
        </p>
      </div>
    </div>
  );
}
