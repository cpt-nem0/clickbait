export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-2 bg-surface-container-lowest border-t-[3px] border-outline-variant">
      <span className="font-display text-xs text-on-surface-variant uppercase">
        CLICKBAIT_v2.0.4
      </span>
      <div className="flex items-center gap-6">
        <span className="font-body text-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
          PRIVACY_POLICY
        </span>
        <span className="font-body text-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
          TERMS_OF_SERVICE
        </span>
        <span className="font-body text-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
          SUPPORT
        </span>
      </div>
      <div className="flex gap-2">
        <span className="w-7 h-7 flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-tertiary-container cursor-pointer border border-outline-variant">
          <span className="material-symbols-outlined text-sm">share</span>
        </span>
        <span className="w-7 h-7 flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-secondary cursor-pointer border border-outline-variant">
          <span className="material-symbols-outlined text-sm">favorite</span>
        </span>
      </div>
    </footer>
  );
}
