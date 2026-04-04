import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0e0e12",
          dim: "#0e0e12",
          bright: "#2c2b32",
          container: {
            DEFAULT: "#19191e",
            low: "#131318",
            lowest: "#000000",
            high: "#1f1f25",
            highest: "#25252b",
          },
          variant: "#25252b",
        },
        primary: {
          DEFAULT: "#f3ffca",
          container: "#cafd00",
          dim: "#beee00",
          on: "#516700",
          "on-container": "#4a5e00",
        },
        secondary: {
          DEFAULT: "#ff51fa",
          container: "#a900a9",
          dim: "#ff51fa",
          on: "#400040",
          "on-container": "#fff5f9",
        },
        tertiary: {
          DEFAULT: "#c1fffe",
          container: "#00ffff",
          dim: "#00e6e6",
          on: "#006767",
          "on-container": "#005d5d",
        },
        error: {
          DEFAULT: "#ff7351",
          container: "#b92902",
          dim: "#d53d18",
          on: "#450900",
          "on-container": "#ffd2c8",
        },
        "on-surface": {
          DEFAULT: "#f3eff6",
          variant: "#acaab0",
        },
        outline: {
          DEFAULT: "#76757a",
          variant: "#48474c",
        },
        inverse: {
          surface: "#fcf8fe",
          "on-surface": "#55545a",
          primary: "#516700",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        none: "0px",
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #000000",
        "hard-sm": "2px 2px 0px 0px #000000",
        "neon-pink": "0 0 20px rgba(255, 81, 250, 0.3)",
        "neon-cyan": "0 0 20px rgba(0, 255, 255, 0.3)",
        "neon-yellow": "0 0 20px rgba(202, 253, 0, 0.3)",
      },
      animation: {
        "glitch-x": "glitch-x 0.3s ease-in-out",
        "elastic-in": "elastic-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "score-pop": "score-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "sticker-in": "sticker-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        pulse: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "glitch-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "50%": { transform: "translateX(2px)" },
          "75%": { transform: "translateX(-1px)" },
        },
        "elastic-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "score-pop": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-40px) scale(1.3)", opacity: "0" },
        },
        "sticker-in": {
          "0%": { transform: "rotate(45deg) scale(0)", opacity: "0" },
          "100%": { transform: "rotate(-3deg) scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
