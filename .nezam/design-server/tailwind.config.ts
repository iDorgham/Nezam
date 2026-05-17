import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        'ds-primary': 'var(--ds-primary)',
        'ds-primary-hover': 'var(--ds-primary-hover)',
        'ds-primary-subtle': 'var(--ds-primary-subtle)',
        'ds-primary-foreground': 'var(--ds-primary-foreground)',
        'ds-secondary': 'var(--ds-secondary)',
        'ds-accent': 'var(--ds-accent)',

        // Surfaces
        'ds-background': 'var(--ds-background)',
        'ds-surface': 'var(--ds-surface)',
        'ds-surface-elevated': 'var(--ds-surface-elevated)',
        'ds-surface-hover': 'var(--ds-surface-hover)',
        'ds-surface-subtle': 'var(--ds-surface-subtle)',
        'ds-overlay': 'var(--ds-overlay)',

        // Text
        'ds-text-primary': 'var(--ds-text-primary)',
        'ds-text-secondary': 'var(--ds-text-secondary)',
        'ds-text-muted': 'var(--ds-text-muted)',
        'ds-text-disabled': 'var(--ds-text-disabled)',
        'ds-text-inverse': 'var(--ds-text-inverse)',

        // Borders
        'ds-border': 'var(--ds-border)',
        'ds-border-strong': 'var(--ds-border-strong)',
        'ds-border-subtle': 'var(--ds-border-subtle)',
        'ds-border-hover': 'var(--ds-border-hover)',
        'ds-border-focus': 'var(--ds-border-focus)',

        // Semantic
        'ds-interactive': 'var(--ds-interactive)',
        'ds-destructive': 'var(--ds-destructive)',
        'ds-success': 'var(--ds-success)',
        'ds-warning': 'var(--ds-warning)',
        'ds-error': 'var(--ds-error)',
        'ds-info': 'var(--ds-info)',
      },
      borderRadius: {
        'ds-none': 'var(--ds-radius-none)',
        'ds-sm': 'var(--ds-radius-sm)',
        'ds-md': 'var(--ds-radius-md)',
        'ds-lg': 'var(--ds-radius-lg)',
        'ds-xl': 'var(--ds-radius-xl)',
        'ds-2xl': 'var(--ds-radius-2xl)',
        'ds-full': 'var(--ds-radius-full)',
      },
      boxShadow: {
        'ds-sm': 'var(--ds-elevation-sm)',
        'ds-md': 'var(--ds-elevation-md)',
        'ds-lg': 'var(--ds-elevation-lg)',
        'ds-xl': 'var(--ds-elevation-xl)',
        'ds-2xl': 'var(--ds-elevation-2xl)',
      },
      transitionTimingFunction: {
        'ds-default': 'var(--ds-easing-default)',
        'ds-spring': 'var(--ds-easing-spring)',
      },
      transitionDuration: {
        'ds-fast': '150ms',
        'ds-normal': '300ms',
        'ds-slow': '500ms',
      },
      fontFamily: {
        heading: ['var(--ds-font-heading)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--ds-font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--ds-font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['var(--ds-font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'ds-xs': 'var(--ds-text-xs)',
        'ds-sm': 'var(--ds-text-sm)',
        'ds-base': 'var(--ds-text-base)',
        'ds-lg': 'var(--ds-text-lg)',
        'ds-xl': 'var(--ds-text-xl)',
        'ds-2xl': 'var(--ds-text-2xl)',
        'ds-3xl': 'var(--ds-text-3xl)',
        'ds-4xl': 'var(--ds-text-4xl)',
      },
      zIndex: {
        'ds-below': 'var(--ds-z-below)',
        'ds-base': 'var(--ds-z-base)',
        'ds-above': 'var(--ds-z-above)',
        'ds-dropdown': 'var(--ds-z-dropdown)',
        'ds-sticky': 'var(--ds-z-sticky)',
        'ds-modal': 'var(--ds-z-modal)',
        'ds-toast': 'var(--ds-z-toast)',
      },
    },
  },
  plugins: [],
}
export default config
