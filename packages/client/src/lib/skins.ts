export interface TargetSkin {
  id: string;
  name: string;
  unlockScore: number;
  cssClass: string;
  text: string;
  label: string;
}

export const SKINS: TargetSkin[] = [
  {
    id: "classic",
    name: "CLASSIC",
    unlockScore: 0,
    cssClass: "skin-classic",
    text: "text-black",
    label: "THE OG. WHERE IT ALL BEGAN.",
  },
  {
    id: "neon",
    name: "NEON",
    unlockScore: 3000,
    cssClass: "skin-neon",
    text: "text-primary-container",
    label: "OUTLINE ONLY. LESS IS MORE.",
  },
  {
    id: "fire",
    name: "FIRE",
    unlockScore: 8000,
    cssClass: "skin-fire",
    text: "text-black",
    label: "HOT. LITERALLY.",
  },
  {
    id: "holo",
    name: "HOLOGRAPHIC",
    unlockScore: 15000,
    cssClass: "skin-holo-diamond",
    text: "text-black",
    label: "SHINY. RARE. FLEXABLE.",
  },
  {
    id: "void",
    name: "VOID",
    unlockScore: 25000,
    cssClass: "skin-void",
    text: "text-secondary",
    label: "STARE INTO THE ABYSS.",
  },
  {
    id: "glitch",
    name: "GLITCH",
    unlockScore: 50000,
    cssClass: "skin-glitch",
    text: "text-primary-container",
    label: "REALITY IS BROKEN.",
  },
  {
    id: "chrome",
    name: "CHROME",
    unlockScore: 75000,
    cssClass: "skin-chrome",
    text: "text-black",
    label: "LIQUID METAL. YOU EARNED THIS.",
  },
];

export function getUnlockedSkins(highScore: number): TargetSkin[] {
  return SKINS.filter((s) => highScore >= s.unlockScore);
}

export function getSelectedSkin(): string {
  return localStorage.getItem("clickbait_skin") || "classic";
}

export function setSelectedSkin(id: string) {
  localStorage.setItem("clickbait_skin", id);
}

export function getSkinById(id: string): TargetSkin {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}
