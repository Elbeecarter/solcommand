/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#080B0F',
          panel: '#0D1117',
          border: '#1A2332',
          amber: '#F59E0B',
          'amber-dim': '#92610A',
          green: '#22C55E',
          red: '#EF4444',
          blue: '#3B82F6',
          muted: '#4B5563',
          text: '#9CA3AF',
          bright: '#E5E7EB',
        }
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        pulse_slow: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
