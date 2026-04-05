import { useEffect } from "react";
import { sfx } from "@/lib/audio";

interface BotShameProps {
  reasons: string[];
  score: number;
  onDismiss: () => void;
}

const ROAST_MAP: Record<string, string> = {
  REACTION_TIME_TOO_CONSISTENT:
    "YOUR REACTION TIMES ARE SUSPICIOUSLY CONSISTENT. HUMANS ARE MESSY AND CHAOTIC. YOU CLICKED LIKE A METRONOME. BEEP BOOP.",
  SUPERHUMAN_REACTION_TIME:
    "SUB-100ms AVERAGE REACTION TIME? THE FASTEST HUMAN EVER RECORDED IS 120ms AND HE WAS ON A LOT OF COFFEE. YOU'RE NOT EVEN TRYING TO HIDE IT.",
  AIMBOT_PRECISION:
    "YOU CLICKED THE EXACT CENTER OF THE TARGET EVERY. SINGLE. TIME. NOT EVEN SURGEONS HAVE THAT PRECISION. YOUR MOUSE IS SUS.",
  NO_MOUSE_MOVEMENT:
    "YOUR CURSOR TELEPORTED TO EACH TARGET WITHOUT MOVING. LAST WE CHECKED, MICE NEED TO PHYSICALLY TRAVEL ACROSS A SURFACE. YOURS APPARENTLY HAS WARP DRIVE.",
  CLICK_POSITION_TOO_PRECISE:
    "EVERY CLICK LANDED IN THE EXACT SAME SPOT RELATIVE TO THE TARGET. THE STATISTICAL PROBABILITY OF THAT HAPPENING NATURALLY IS ROUGHLY THE SAME AS WINNING THE LOTTERY. TWICE. ON THE SAME DAY.",
};

const SHAME_HEADERS = [
  "CAUGHT IN 4K",
  "IMAGINE CHEATING AT A CLICKING GAME",
  "THIS IS EMBARRASSING",
  "YOUR BOT IS SHOWING",
  "WE SEE YOU",
];

export default function BotShame({ reasons, score, onDismiss }: BotShameProps) {
  const header = SHAME_HEADERS[Math.floor(Math.random() * SHAME_HEADERS.length)];

  useEffect(() => {
    sfx.busted();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="scanline" />
      <div className="relative w-full max-w-lg">
        <span className="sticker -top-3 -left-3 bg-error z-10">BUSTED</span>
        <span className="sticker -top-3 -right-3 bg-secondary text-white z-10">LMAO</span>
        <div className="bg-surface-container border-[3px] border-error p-8 max-h-[90vh] overflow-auto">

        <h1 className="font-display text-display-sm font-bold text-error uppercase mb-2 text-glow-pink">
          {header}
        </h1>

        <p className="font-display text-sm text-on-surface-variant uppercase mb-6">
          YOUR SCORE OF <span className="text-primary-container font-bold">{score.toLocaleString()}</span> HAS
          BEEN FLAGGED AND WILL NOT BE SUBMITTED.
        </p>

        <div className="space-y-4 mb-6">
          <p className="font-display text-xs text-tertiary uppercase">
            EVIDENCE AGAINST YOU:
          </p>
          {reasons.map((reason) => (
            <div
              key={reason}
              className="bg-surface-container-high border-l-[3px] border-l-error p-4"
            >
              <p className="font-display text-xs text-error font-bold uppercase mb-1">
                {reason.replace(/_/g, " ")}
              </p>
              <p className="font-body text-sm text-on-surface-variant">
                {ROAST_MAP[reason] || "SOMETHING ABOUT YOUR GAMEPLAY WAS... NOT HUMAN."}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-high border-[3px] border-outline-variant p-4 mb-6">
          <p className="font-display text-xs text-on-surface-variant uppercase mb-2">
            A MESSAGE FROM THE DEVELOPERS:
          </p>
          <p className="font-body text-sm text-on-surface-variant">
            LISTEN. IT'S A FREE BROWSER GAME ABOUT CLICKING BOXES. THE LEADERBOARD MEANS LITERALLY NOTHING.
            THE FACT THAT YOU WROTE A SCRIPT TO CHEAT AT THIS IS GENUINELY THE SADDEST THING WE'VE SEEN ALL WEEK.
            AND WE'VE SEEN A LOT.
          </p>
          <p className="font-body text-sm text-on-surface-variant mt-2">
            WE'RE NOT EVEN MAD. WE'RE JUST DISAPPOINTED.
          </p>
          <p className="font-body text-sm text-on-surface-variant mt-2">
            ACTUALLY NO, WE'RE A LITTLE MAD.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="btn-outline w-full text-center"
        >
          I'LL DO BETTER (DOUBT IT)
        </button>

        <p className="font-display text-[10px] text-on-surface-variant/30 uppercase text-center mt-4">
          THIS INCIDENT HAS BEEN LOGGED. NOT REALLY. BUT IT FELT RIGHT TO SAY THAT.
        </p>
        </div>
      </div>
    </div>
  );
}
