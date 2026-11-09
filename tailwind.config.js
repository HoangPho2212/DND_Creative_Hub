/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8FAFC",
        slate: {
          text: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
          border: "#E2E8F0",
          card: "#FFFFFF",
        },
        emerald: {
          DEFAULT: "#16A34A",
          dark: "#15803D",
          soft: "#DCFCE7",
          border: "#86EFAC",
          light: "#F0FDF4",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 20px 40px -15px rgba(15, 23, 42, 0.05), 0 0 1px 1px rgba(226, 232, 240, 0.6)',
        'card-glow': '0 25px 50px -12px rgba(22, 163, 74, 0.12), 0 0 1px 1px rgba(22, 163, 74, 0.15)',
        'btn-emerald': '0 10px 25px -5px rgba(22, 163, 74, 0.4), 0 4px 6px -2px rgba(22, 163, 74, 0.2)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
