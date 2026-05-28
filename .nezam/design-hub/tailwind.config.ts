import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

/**
 * NEZAM Design Hub v2 — Tailwind config.
 * The app chrome uses fixed `--app-*` graphite tokens.
 * The live preview uses `--n-*` design tokens applied per-scope at runtime.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--app-bg)',
          surface: 'var(--app-surface)',
          elevated: 'var(--app-elevated)',
          inset: 'var(--app-inset)',
          deep: 'var(--app-deep)',
          border: 'var(--app-border)',
          'border-strong': 'var(--app-border-strong)',
          text: 'var(--app-text)',
          muted: 'var(--app-muted)',
          subtle: 'var(--app-subtle)',
          accent: 'var(--app-accent)',
          'accent-hover': 'var(--app-accent-hover)',
          'accent-active': 'var(--app-accent-active)',
          'accent-subtle': 'var(--app-accent-subtle)',
          'on-accent': 'var(--app-on-accent)',
          danger: 'var(--app-danger)',
          warning: 'var(--app-warning)',
          success: 'var(--app-success)',
        },
        n: {
          brand: 'var(--n-brand)',
          'brand-hover': 'var(--n-brand-hover)',
          'brand-subtle': 'var(--n-brand-subtle)',
          'on-brand': 'var(--n-on-brand)',
          accent: 'var(--n-accent)',
          bg: 'var(--n-bg)',
          surface: 'var(--n-surface)',
          elevated: 'var(--n-elevated)',
          text: 'var(--n-text)',
          'text-muted': 'var(--n-text-muted)',
          'text-subtle': 'var(--n-text-subtle)',
          border: 'var(--n-border)',
          'border-strong': 'var(--n-border-strong)',
          success: 'var(--n-success)',
          warning: 'var(--n-warning)',
          danger: 'var(--n-danger)',
          info: 'var(--n-info)',
        },
      },
      fontFamily: {
        sans: ['var(--app-font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--app-font-mono)', 'ui-monospace', 'monospace'],
      },
      accentColor: {
        'app-accent': 'var(--app-accent)',
      },
      borderRadius: {
        'app-sm': '6px',
        app: '10px',
        'app-lg': '14px',
        'app-xl': '20px',
      },
      boxShadow: {
        'app-sm': '0 1px 2px rgba(0,0,0,0.4)',
        app: '0 4px 16px -2px rgba(0,0,0,0.45)',
        'app-lg': '0 18px 48px -12px rgba(0,0,0,0.65)',
        'app-glow': '0 0 0 1px var(--app-accent-subtle), 0 8px 28px -8px var(--app-accent-subtle)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.32, 0.72, 0, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease both',
        'rise-in': 'rise-in 0.4s cubic-bezier(0.32,0.72,0,1) both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
