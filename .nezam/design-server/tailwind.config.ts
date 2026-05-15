import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // All design system colors are driven by CSS custom properties (--ds-*)
      // Tailwind utilities reference those vars so the token studio updates
      // everything in real time without a rebuild.
      colors: {
        ds: {
          primary: 'var(--ds-primary)',
          'primary-hover': 'var(--ds-primary-hover)',
          secondary: 'var(--ds-secondary)',
          accent: 'var(--ds-accent)',
          interactive: 'var(--ds-interactive)',
          destructive: 'var(--ds-destructive)',
          success: 'var(--ds-success)',
          warning: 'var(--ds-warning)',
          info: 'var(--ds-info)',
          background: 'var(--ds-background)',
          surface: 'var(--ds-surface)',
          'surface-elevated': 'var(--ds-surface-elevated)',
          overlay: 'var(--ds-overlay)',
          'text-primary': 'var(--ds-text-primary)',
          'text-secondary': 'var(--ds-text-secondary)',
          'text-muted': 'var(--ds-text-muted)',
          'text-disabled': 'var(--ds-text-disabled)',
          'text-inverse': 'var(--ds-text-inverse)',
          border: 'var(--ds-border)',
          'border-strong': 'var(--ds-border-strong)',
          'border-focus': 'var(--ds-border-focus)',
        },
        // shadcn/ui semantic tokens (mapped to ds vars)
        background: 'var(--ds-background)',
        foreground: 'var(--ds-text-primary)',
        border: 'var(--ds-border)',
        ring: 'var(--ds-primary)',
        primary: {
          DEFAULT: 'var(--ds-primary)',
          foreground: 'var(--ds-text-inverse)',
        },
        muted: {
          DEFAULT: 'var(--ds-surface)',
          foreground: 'var(--ds-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--ds-accent)',
          foreground: 'var(--ds-text-inverse)',
        },
        destructive: {
          DEFAULT: 'var(--ds-destructive)',
          foreground: 'var(--ds-text-inverse)',
        },
      },
      fontFamily: {
        heading: 'var(--ds-font-heading)',
        body: 'var(--ds-font-body)',
        mono: 'var(--ds-font-mono)',
      },
      fontSize: {
        'ds-xs': 'var(--ds-text-xs)',
        'ds-sm': 'var(--ds-text-sm)',
        'ds-md': 'var(--ds-text-md)',
        'ds-lg': 'var(--ds-text-lg)',
        'ds-xl': 'var(--ds-text-xl)',
        'ds-2xl': 'var(--ds-text-2xl)',
        'ds-3xl': 'var(--ds-text-3xl)',
        'ds-4xl': 'var(--ds-text-4xl)',
      },
      borderRadius: {
        none: 'var(--ds-radius-none)',
        sm: 'var(--ds-radius-sm)',
        md: 'var(--ds-radius-md)',
        lg: 'var(--ds-radius-lg)',
        xl: 'var(--ds-radius-xl)',
        full: 'var(--ds-radius-full)',
      },
      boxShadow: {
        none: 'var(--ds-elevation-none)',
        sm: 'var(--ds-elevation-sm)',
        md: 'var(--ds-elevation-md)',
        lg: 'var(--ds-elevation-lg)',
        xl: 'var(--ds-elevation-xl)',
      },
      spacing: {
        'ds-xs': 'var(--ds-spacing-xs)',
        'ds-sm': 'var(--ds-spacing-sm)',
        'ds-md': 'var(--ds-spacing-md)',
        'ds-lg': 'var(--ds-spacing-lg)',
        'ds-xl': 'var(--ds-spacing-xl)',
        'ds-2xl': 'var(--ds-spacing-2xl)',
        'ds-3xl': 'var(--ds-spacing-3xl)',
        'ds-4xl': 'var(--ds-spacing-4xl)',
      },
      transitionDuration: {
        fast: 'var(--ds-duration-fast)',
        normal: 'var(--ds-duration-normal)',
        slow: 'var(--ds-duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--ds-easing-default)',
        spring: 'var(--ds-easing-spring)',
      },
      zIndex: {
        base: 'var(--ds-z-base)',
        dropdown: 'var(--ds-z-dropdown)',
        sticky: 'var(--ds-z-sticky)',
        overlay: 'var(--ds-z-overlay)',
        modal: 'var(--ds-z-modal)',
        toast: 'var(--ds-z-toast)',
      }
    },
  },
  plugins: [],
}

export default config
