import { useState } from "react";
import { sfx } from "@/lib/audio";

interface RegisterModalProps {
  onRegister: (username: string) => void;
}

export default function RegisterModal({ onRegister }: RegisterModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      sfx.uiClick();
      onRegister(name.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="noise-overlay" style={{ position: "fixed" }} />
      <div className="scanline" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-surface-container border-[3px] border-primary-container neon-glow-yellow w-full max-w-md p-8"
      >
        <span className="sticker -top-3 -right-3">NEW_PLAYER</span>

        <h1 className="font-display text-display-sm font-bold text-primary-container text-glow-yellow uppercase mb-2">
          ENTER_THE
          <br />
          ARENA
        </h1>
        <p className="font-display text-sm text-on-surface-variant uppercase mb-8">
          CHOOSE YOUR HANDLE. THIS IS HOW YOU'LL
          <br />
          APPEAR ON THE LEADERBOARD.
        </p>

        <div className="mb-6">
          <label className="block font-display text-xs text-tertiary uppercase mb-2">
            PLAYER_HANDLE
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            placeholder="TYPE_YOUR_NAME"
            maxLength={16}
            autoFocus
            className="w-full bg-surface-container-highest border-[3px] border-outline-variant focus:border-primary-container focus:shadow-neon-yellow px-4 py-3 font-display text-lg text-on-surface uppercase placeholder:text-on-surface-variant/30 outline-none transition-all"
          />
          <p className="font-body text-xs text-on-surface-variant mt-2">
            {name.length}/16 CHARACTERS
          </p>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="btn-primary w-full text-center text-lg py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          LET'S_GO
        </button>
      </form>
    </div>
  );
}
