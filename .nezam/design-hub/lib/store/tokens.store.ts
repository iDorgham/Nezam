import { create } from 'zustand'

export interface DesignTokens {
  colors: {
    // Brand
    primary: string
    primaryHover: string
    secondary: string
    accent: string
    // Semantic
    interactive: string
    destructive: string
    success: string
    warning: string
    info: string
    // Surface
    background: string
    surface: string
    surfaceElevated: string
    overlay: string
    // Text
    textPrimary: string
    textSecondary: string
    textMuted: string
    textDisabled: string
    textInverse: string
    // Border
    border: string
    borderStrong: string
    borderFocus: string
  }
  typography: {
    fontHeading: string
    fontBody: string
    fontMono: string
    baseSize: number
    scale: number
    // Named type scale (px values derived from baseSize * scale^n)
    sizeXs: string       // clamp(10px, ...)
    sizeSm: string       // clamp(12px, ...)
    sizeMd: string       // clamp(14px, ...)  
    sizeLg: string       // clamp(16px, ...)
    sizeXl: string       // clamp(20px, ...)
    size2xl: string      // clamp(24px, ...)
    size3xl: string      // clamp(30px, ...)
    size4xl: string      // clamp(36px, ...)
    lineHeightTight: string    // '1.2'
    lineHeightNormal: string   // '1.5'
    lineHeightRelaxed: string  // '1.75'
    weightLight: number        // 300
    weightNormal: number       // 400
    weightMedium: number       // 500
    weightSemibold: number     // 600
    weightBold: number         // 700
  }
  spacing: {
    baseUnit: number
    xs: string   // 4px
    sm: string   // 8px
    md: string   // 16px
    lg: string   // 24px
    xl: string   // 32px
    '2xl': string  // 48px
    '3xl': string  // 64px
    '4xl': string  // 96px
  }
  radius: {
    none: string   // '0'
    sm: string     // '4px'
    md: string     // '8px'
    lg: string     // '12px'
    xl: string     // '16px'
    full: string   // '9999px'
  }
  elevation: {
    none: string   // 'none'
    sm: string     // '0 1px 3px rgba(0,0,0,0.12)'
    md: string     // '0 4px 16px rgba(0,0,0,0.16)'
    lg: string     // '0 8px 32px rgba(0,0,0,0.24)'
    xl: string     // '0 16px 64px rgba(0,0,0,0.32)'
  }
  motion: {
    durationFast: string    // '100ms'
    durationNormal: string  // '200ms'
    durationSlow: string    // '400ms'
    easingDefault: string   // 'cubic-bezier(0.4, 0, 0.2, 1)'
    easingSpring: string    // 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
  zIndex: {
    base: number       // 0
    dropdown: number   // 100
    sticky: number     // 200
    overlay: number    // 300
    modal: number      // 400
    toast: number      // 500
  }
}

interface TokensState {
  tokens: DesignTokens
  updateColor: (key: keyof DesignTokens['colors'], value: string) => void
  updateTypography: (key: keyof DesignTokens['typography'], value: string | number) => void
  updateSpacing: (key: keyof DesignTokens['spacing'], value: string | number) => void
  updateRadius: (key: keyof DesignTokens['radius'], value: string) => void
  updateElevation: (key: keyof DesignTokens['elevation'], value: string) => void
  updateMotion: (key: keyof DesignTokens['motion'], value: string) => void
  setTokens: (tokens: DesignTokens) => void
}

export const useTokensStore = create<TokensState>((set) => ({
  tokens: {
    colors: {
      primary: '#FF5701',
      primaryHover: '#e04e00',
      secondary: '#8a8f98',
      accent: '#FF5701',
      interactive: '#FF5701',
      destructive: '#dc2626',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      background: '#090A0F',
      surface: '#0F111A',
      surfaceElevated: '#191a1b',
      overlay: 'rgba(0,0,0,0.5)',
      textPrimary: '#F7F8F8',
      textSecondary: '#d1d5db',
      textMuted: '#8A8F98',
      textDisabled: '#6b7280',
      textInverse: '#08090a',
      border: 'rgba(255, 255, 255, 0.08)',
      borderStrong: 'rgba(255, 255, 255, 0.15)',
      borderFocus: '#FF5701'
    },
    typography: {
      fontHeading: 'system-ui',
      fontBody: 'system-ui',
      fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      baseSize: 16,
      scale: 1.25,
      sizeXs: 'clamp(10px, 1vw, 12px)',
      sizeSm: 'clamp(12px, 1vw, 14px)',
      sizeMd: 'clamp(14px, 1vw, 16px)',
      sizeLg: 'clamp(16px, 1.2vw, 18px)',
      sizeXl: 'clamp(18px, 1.5vw, 20px)',
      size2xl: 'clamp(20px, 2vw, 24px)',
      size3xl: 'clamp(24px, 2.5vw, 30px)',
      size4xl: 'clamp(30px, 3vw, 36px)',
      lineHeightTight: '1.2',
      lineHeightNormal: '1.5',
      lineHeightRelaxed: '1.75',
      weightLight: 300,
      weightNormal: 400,
      weightMedium: 500,
      weightSemibold: 600,
      weightBold: 700
    },
    spacing: {
      baseUnit: 4,
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
      '4xl': '96px'
    },
    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px'
    },
    elevation: {
      none: 'none',
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 16px rgba(0,0,0,0.16)',
      lg: '0 8px 32px rgba(0,0,0,0.24)',
      xl: '0 16px 64px rgba(0,0,0,0.32)'
    },
    motion: {
      durationFast: '100ms',
      durationNormal: '200ms',
      durationSlow: '400ms',
      easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    zIndex: {
      base: 0,
      dropdown: 100,
      sticky: 200,
      overlay: 300,
      modal: 400,
      toast: 500
    }
  },
  updateColor: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      colors: { ...state.tokens.colors, [key]: value }
    }
  })),
  updateTypography: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      typography: { ...state.tokens.typography, [key]: value }
    }
  })),
  updateSpacing: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      spacing: { ...state.tokens.spacing, [key]: value }
    }
  })),
  updateRadius: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      radius: { ...state.tokens.radius, [key]: value }
    }
  })),
  updateElevation: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      elevation: { ...state.tokens.elevation, [key]: value }
    }
  })),
  updateMotion: (key, value) => set((state) => ({
    tokens: {
      ...state.tokens,
      motion: { ...state.tokens.motion, [key]: value }
    }
  })),
  setTokens: (tokens) => set({ tokens }),
}))
