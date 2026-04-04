import { useEffect, useState } from "react";
import { sfx } from "@/lib/audio";

interface Sticker {
  id: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
}

const STICKER_LABELS = [
  "X10 COMBO",
  "HYPER_MODE",
  "UNSTOPPABLE",
  "ON_FIRE",
  "SPEED_DEMON",
  "MAX_STREAK",
  "CLICK_LORD",
  "HTML_ONLY_COMBO",
];

interface StickerOverlayProps {
  combo: number;
  containerWidth: number;
  containerHeight: number;
}

export default function StickerOverlay({ combo, containerWidth, containerHeight }: StickerOverlayProps) {
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    if (combo > 0 && combo % 5 === 0) {
      const label = STICKER_LABELS[Math.floor(Math.random() * STICKER_LABELS.length)];
      const newSticker: Sticker = {
        id: Date.now(),
        label,
        x: 40 + Math.random() * (containerWidth - 200),
        y: 40 + Math.random() * (containerHeight - 100),
        rotation: -5 + Math.random() * 10,
      };
      setStickers((prev) => [...prev.slice(-4), newSticker]);
      sfx.sticker();
    }
  }, [combo, containerWidth, containerHeight]);

  return (
    <>
      {stickers.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none animate-sticker-in z-10"
          style={{
            left: s.x,
            top: s.y,
            transform: `rotate(${s.rotation}deg)`,
          }}
        >
          <span className="inline-block bg-error text-error-on font-display text-xs font-bold uppercase px-3 py-1.5 hard-shadow-sm">
            {s.label}
          </span>
        </div>
      ))}
    </>
  );
}
