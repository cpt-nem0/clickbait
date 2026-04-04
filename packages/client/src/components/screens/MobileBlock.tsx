export default function MobileBlock() {
  return (
    <div className="h-screen bg-surface flex items-center justify-center p-8">
      <div className="scanline" />
      <div className="relative bg-surface-container border-[3px] border-error p-8 max-w-md text-center">
        <span className="sticker -top-3 -right-3 bg-error">DENIED</span>

        <h1 className="font-display text-display-sm font-bold text-error uppercase mb-4">
          ACCESS
          <br />
          DENIED
        </h1>

        <div className="space-y-4 mb-8">
          <p className="font-display text-sm text-on-surface uppercase">
            NICE TRY. PHONES ARE NOT ALLOWED.
          </p>
          <p className="font-body text-sm text-on-surface-variant">
            USING A TOUCHSCREEN IS BASICALLY CHEATING. YOUR THUMBS ARE TOO POWERFUL. WE CAN'T RISK IT.
          </p>
          <p className="font-body text-sm text-on-surface-variant">
            THIS GAME REQUIRES A MOUSE, A DESK, AND QUESTIONABLE LIFE PRIORITIES.
          </p>
        </div>

        <div className="bg-surface-container-high p-4 border-[3px] border-outline-variant mb-6">
          <p className="font-display text-xs text-tertiary uppercase mb-2">APPROVED DEVICES:</p>
          <div className="space-y-1">
            <p className="font-body text-xs text-on-surface-variant">- DESKTOP COMPUTER</p>
            <p className="font-body text-xs text-on-surface-variant">- LAPTOP</p>
            <p className="font-body text-xs text-on-surface-variant">- THAT OLD PC IN YOUR GARAGE</p>
            <p className="font-body text-xs text-on-surface-variant">- LITERALLY ANYTHING WITH A MOUSE</p>
          </div>
        </div>

        <div className="bg-surface-container-high p-4 border-[3px] border-outline-variant">
          <p className="font-display text-xs text-secondary uppercase mb-2">REJECTED DEVICES:</p>
          <div className="space-y-1">
            <p className="font-body text-xs text-on-surface-variant">- YOUR PHONE (YES, THIS ONE)</p>
            <p className="font-body text-xs text-on-surface-variant">- YOUR TABLET</p>
            <p className="font-body text-xs text-on-surface-variant">- YOUR SMART FRIDGE</p>
            <p className="font-body text-xs text-on-surface-variant">- YOUR TOASTER (WE KNOW YOU TRIED)</p>
          </div>
        </div>

        <p className="font-display text-xs text-on-surface-variant/50 uppercase mt-6">
          GO FIND A REAL COMPUTER. WE'LL WAIT.
        </p>
      </div>
    </div>
  );
}
