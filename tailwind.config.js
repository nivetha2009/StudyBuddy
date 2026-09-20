/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        pen: 'var(--pen)',
        'pen-soft': 'var(--pen-soft)',
        highlight: 'var(--highlight)',
        coral: 'var(--coral)',
        mint: 'var(--mint)',
        'mint-tint': 'var(--mint-tint)',
        'coral-tint': 'var(--coral-tint)'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        card: '18px',
        pill: '999px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,43,.05), 0 12px 28px -18px rgba(20,20,43,.35)',
        lift: '0 2px 4px rgba(20,20,43,.06), 0 24px 44px -24px rgba(20,20,43,.45)'
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' }
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '.35' },
          '50%': { opacity: '1' }
        },
        'draw-line': {
          from: { 'stroke-dashoffset': '420' },
          to: { 'stroke-dashoffset': '0' }
        }
      },
      animation: {
        'rise-in': 'rise-in .4s cubic-bezier(.22,.8,.3,1) both',
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        'draw-line': 'draw-line 1.1s ease-out .25s both'
      }
    }
  },
  plugins: []
};
