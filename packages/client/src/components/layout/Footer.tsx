const TICKER_ITEMS = [
  "BREAKING: LOCAL PLAYER CLAIMS 450ms IS \"BASICALLY PRO\"",
  "SCIENTISTS CONFIRM: CLICKING RELEASES MORE DOPAMINE THAN PIZZA",
  "IMPOSSIBLE MODE DECLARED A HUMAN RIGHTS VIOLATION BY 3 COUNTRIES",
  "FUN FACT: A MANTIS SHRIMP STRIKES IN 3ms. YOU ARE NOT A MANTIS SHRIMP.",
  "STUDY FINDS 97% OF CLICKBAIT PLAYERS LIE ABOUT THEIR HIGH SCORE",
  "YOUR MOUSE HAS FILED A RESTRAINING ORDER",
  "OCTOPUSES HAVE 3 HEARTS. YOU HAVE 0 CHILL.",
  "NASA CONFIRMS: CLICKING HARDER DOES NOT MAKE YOU FASTER",
  "BANANAS ARE TECHNICALLY BERRIES. STRAWBERRIES ARE NOT. YOUR SCORE IS STILL MID.",
  "BREAKING: PLAYER RAGE-QUITS, BLAMES \"LAG\" ON 500MBPS CONNECTION",
  "A COCKROACH CAN LIVE 9 DAYS WITHOUT ITS HEAD. YOU CAN'T LAST 30 SECONDS.",
  "THIS GAME HAS BEEN CLASSIFIED AS A WORKPLACE HAZARD IN 12 STATES",
  "FUN FACT: HONEY NEVER SPOILS. YOUR REACTION TIME HOWEVER...",
  "DOLPHINS SLEEP WITH ONE EYE OPEN. RESPECT THE GRIND.",
  "ALERT: YOUR BOSS IS BEHIND YOU. JUST KIDDING. OR ARE WE?",
  "COWS HAVE BEST FRIENDS. YOUR BEST FRIEND IS THIS LEADERBOARD.",
  "THE EIFFEL TOWER GROWS 6 INCHES IN SUMMER. YOUR SCORE DOES NOT.",
  "BREAKING: EASY MODE PLAYERS DEMAND PARTICIPATION TROPHIES",
  "A GROUP OF FLAMINGOS IS CALLED A \"FLAMBOYANCE\". A GROUP OF CLICKERS IS CALLED \"DESPERATE\".",
  "THERE ARE MORE POSSIBLE CHESS GAMES THAN ATOMS IN THE UNIVERSE. THERE ARE MORE EXCUSES FOR YOUR SCORE.",
  "FUN FACT: YOU BLINK 15-20 TIMES PER MINUTE. EACH ONE IS A MISSED CLICK.",
  "WOMBAT POOP IS CUBE-SHAPED. THIS FACT WILL NOT IMPROVE YOUR SCORE.",
  "SPONSORED BY CARPAL TUNNEL SYNDROME",
  "SLOTHS CAN HOLD THEIR BREATH LONGER THAN DOLPHINS. YOU CAN'T HOLD A COMBO.",
  "BREAKING: HARD MODE PLAYERS 3X MORE LIKELY TO GOOGLE \"HAND STRETCHES\"",
  "THE HUMAN BRAIN USES 20% OF BODY ENERGY. YOURS IS USING 120% RIGHT NOW.",
  "VENDING MACHINES KILL MORE PEOPLE THAN SHARKS. IMPOSSIBLE MODE KILLS MORE THAN BOTH.",
  "0.00% OF PLAYERS HAVE BEATEN THE DEVELOPER'S HIGH SCORE. IT'S RIGGED. (IT'S NOT.)",
  "A JIFFY IS AN ACTUAL UNIT OF TIME: 1/100TH OF A SECOND. YOUR REACTION TIME IS MANY JIFFIES.",
  "FEEDBACK? COMPLAINTS? EXISTENTIAL CRISES? EMAIL US.",
];

const SUPPORT_EMAIL = "support@clickbait.game";

export default function Footer() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <footer className="bg-surface-container-lowest border-t-[3px] border-outline-variant overflow-hidden">
      <div className="flex items-center">
        <div className="ticker-track flex whitespace-nowrap py-2">
          {doubled.map((text, i) => (
            <span key={i} className="inline-flex items-center mx-6 shrink-0">
              <span className="font-display text-xs text-on-surface-variant uppercase">
                {text}
              </span>
              <span className="ml-6 text-secondary text-xs">///</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-1.5 border-t border-outline-variant/30">
        <span className="font-display text-[10px] text-on-surface-variant/50 uppercase">
          CLICKBAIT_v2.0.4
        </span>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-display text-[10px] text-on-surface-variant/50 uppercase hover:text-tertiary transition-colors"
        >
          SUPPORT: {SUPPORT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
