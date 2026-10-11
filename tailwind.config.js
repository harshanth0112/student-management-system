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
        background: {
          DEFAULT: 'var(--color-bg)',
          dark: '#141615',
        },
        foreground: {
          DEFAULT: 'var(--color-fg)',
          dark: '#EDEFEA',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          text: 'var(--color-primary-text)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
        },
        accent: {
          coral: 'var(--color-accent-coral)',
          mint: 'var(--color-accent-mint)',
          gold: 'var(--color-accent-gold)',
        },
        status: {
          active: 'var(--color-status-active)',
          invited: 'var(--color-status-invited)',
          'invited-dot': 'var(--color-status-invited-dot)',
          disabled: 'var(--color-status-disabled)',
          'disabled-dot': 'var(--color-status-disabled-dot)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          dot: 'var(--color-danger-dot)',
        },
      },
      fontFamily: {
        sans: ['"General Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'technical': '0.1em',
        'technical-wide': '0.15em',
        'technical-widest': '0.2em',
        'technical-expanded': '0.3em',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        full: '9999px',
      },
      transitionTimingFunction: {
        'snappy': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        'fast': '150ms',
        'normal': '200ms',
      },
    },
  },
  plugins: [],
};
