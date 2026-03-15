/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff', // Violet 50
          100: '#ede9fe', // Violet 100
          500: '#8b5cf6', // Violet 500 (Purple Main)
          600: '#7c3aed', // Violet 600
          900: '#4c1d95', // Violet 900
        },
        dark: {
          bg: '#0f172a',    // Tailwind slate-900
          paper: '#1e293b', // Tailwind slate-800
          text: '#f8fafc',
          muted: '#94a3b8',
        },
        light: {
          bg: '#f8fafc',    // Tailwind slate-50
          paper: '#ffffff',
          text: '#0f172a',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
