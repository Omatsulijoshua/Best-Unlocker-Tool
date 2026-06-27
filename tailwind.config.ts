import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        panel: "#0d1220",
        line: "#202842",
        cyan: "#31d7ff",
        violet: "#8b5cf6"
      },
      boxShadow: {
        glow: "0 0 40px rgba(49, 215, 255, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
