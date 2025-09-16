/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["system-ui", "Arial", "sans-serif"],
      mono: ["ui-monospace", "SFMono-Regular", "monospace"],
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4ecdc4",
          dark: "#16213e",
        },
      },
    },
  },
  plugins: [],
};
