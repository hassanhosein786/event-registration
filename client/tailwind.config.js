/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 60px rgba(15, 23, 42, 0.12)"
      },
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d7ebff",
          200: "#b3d7ff",
          300: "#7cb6ff",
          400: "#4f94ff",
          500: "#2c6cf0",
          600: "#1f56cc",
          700: "#1f45a6",
          800: "#1e3b84",
          900: "#183063"
        }
      }
    }
  },
  plugins: []
};
