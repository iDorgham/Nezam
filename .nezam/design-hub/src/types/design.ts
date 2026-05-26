/** Design System section types — tokens, scales, profiles. */

export type TokenCategory =
  // Existing
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadows'
  | 'motion'
  | 'borders'
  | 'iconography'
  // New — Atlassian-style expanded taxonomy
  | 'elevation'
  | 'font'
  | 'interaction'
  | 'utility'

export type DesignProfileId =
  // ── Aesthetic styles ──
  | 'minimal'
  | 'vibrant'
  | 'corporate'
  | 'dark-studio'
  | 'warm-earth'
  | 'glass'
  | 'aurora'
  | 'midnight'
  | 'sand'
  | 'nordic'
  | 'neon'
  | 'ocean'
  // ── Brand profiles ──
  | 'apple'
  | 'google'
  | 'spotify'
  | 'github'
  | 'stripe'
  | 'linear'
  | 'notion'
  | 'netflix'
  | 'airbnb'
  | 'vercel'

/** 11-step color scale. */
export interface ColorScale {
  '50': string
  '100': string
  '200': string
  '300': string
  '400': string
  '500': string
  '600': string
  '700': string
  '800': string
  '900': string
  '950': string
}

export interface TypeStep {
  size: string
  lineHeight: string
  letterSpacing?: string
}

export interface DesignTokens {
  colors: {
    /** Primary brand color scale. */
    brand: ColorScale
    /** Secondary/accent color scale. */
    accent: ColorScale
    /** Neutral gray scale. */
    neutral: ColorScale
    semantic: {
      success: string
      warning: string
      error: string
      info: string
    }
    /** Surface/background tokens. */
    surface: {
      bg: string
      panel: string
      overlay: string
      border: string
    }
    /** Text tokens. */
    text: {
      primary: string
      secondary: string
      muted: string
      disabled: string
    }
    /** Mode toggle (affects how surface/text tokens resolve). */
    mode: 'light' | 'dark'
  }
  typography: {
    sans: string
    mono: string
    display: string
    scale: {
      xs: TypeStep
      sm: TypeStep
      base: TypeStep
      lg: TypeStep
      xl: TypeStep
      '2xl': TypeStep
      '3xl': TypeStep
      '4xl': TypeStep
    }
    weights: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  spacing: {
    /** Base unit in px — all spacing is a multiple of this. */
    base: number
  }
  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  motion: {
    duration: {
      fast: string
      base: string
      slow: string
    }
    easing: {
      default: string
      bounce: string
      smooth: string
    }
  }
  borders: {
    width: string
    style: 'solid' | 'dashed'
  }
  iconography: {
    /** Icon library name. */
    library: 'lucide' | 'heroicons' | 'phosphor' | 'tabler'
    /** Icon style variant. */
    style: 'outline' | 'filled' | 'duotone'
    /** Default icon size in px. */
    size: number
    /** Stroke width for outline icons. */
    strokeWidth: number
  }

  // ─── New expanded token categories ───────────────────────────────────────

  /** Elevation — surface layering + semantic shadow scale. */
  elevation: {
    surface: {
      /** Ground level surface (main background). */
      base: string
      /** Elevated above base (cards, panels). */
      raised: string
      /** Overlay surface (modals, drawers). */
      overlay: string
      /** Recessed below base (inputs, wells). */
      sunken: string
    }
    shadow: {
      /** Card / tile shadow. */
      card: string
      /** Modal dialog shadow. */
      modal: string
      /** Tooltip / popover shadow. */
      tooltip: string
      /** Sticky header / footer shadow. */
      sticky: string
    }
  }

  /** Font — semantic type ramp for heading, body, metric, code. */
  font: {
    heading: {
      xxl: TypeStep   // H1
      xl:  TypeStep   // H2
      lg:  TypeStep   // H3
      md:  TypeStep   // H4
      sm:  TypeStep   // H5
      xs:  TypeStep   // H6
    }
    body: {
      lg: TypeStep
      md: TypeStep
      sm: TypeStep
    }
    metric: {
      xl: TypeStep
      lg: TypeStep
      md: TypeStep
    }
    code: {
      lg: TypeStep
      md: TypeStep
      sm: TypeStep
    }
    weight: {
      regular:  number
      medium:   number
      semibold: number
      bold:     number
    }
    family: {
      heading: string
      body:    string
      mono:    string
      display: string
    }
  }

  /** Interaction — state tokens for interactive elements. */
  interaction: {
    /** Focus ring color (outline on focused elements). */
    focusRing: string
    /** Hover overlay color (rgba). */
    hover: string
    /** Active/pressed overlay (rgba). */
    pressed: string
    /** Selected item background. */
    selected: string
    /** Disabled opacity (as string, e.g. "0.4"). */
    disabled: string
  }

  /** Utility — blanket, skeleton, chart palette. */
  utility: {
    /** Modal/drawer backdrop color (rgba). */
    blanket: string
    skeleton: {
      /** Base skeleton color. */
      base: string
      /** Shimmer highlight color. */
      shimmer: string
    }
    chart: {
      primary:    string
      secondary:  string
      tertiary:   string
      quaternary: string
      divergent: {
        low:  string
        high: string
      }
    }
  }
}

export interface DesignProfile {
  id: DesignProfileId
  name: string
  description: string
  emoji: string
  tokens: DesignTokens
}

export const TOKEN_CATEGORY_LABELS: Record<TokenCategory, string> = {
  colors:       'Colors',
  typography:   'Typography Scale',
  spacing:      'Spacing',
  radius:       'Border Radius',
  shadows:      'Shadows',
  motion:       'Motion',
  borders:      'Borders',
  iconography:  'Iconography',
  elevation:    'Elevation',
  font:         'Semantic Typography',
  interaction:  'Interaction',
  utility:      'Utility',
}

/** Lucide icon name strings — render via <IconRenderer name={...} /> */
export const TOKEN_CATEGORY_ICONS: Record<TokenCategory, string> = {
  colors:       'Droplets',
  typography:   'Type',
  spacing:      'ArrowLeftRight',
  radius:       'Circle',
  shadows:      'Layers',
  motion:       'Zap',
  borders:      'Square',
  iconography:  'Shapes',
  elevation:    'Columns',
  font:         'AlignLeft',
  interaction:  'MousePointer',
  utility:      'Grid',
}

/** Logical groups for the token nav sidebar. */
export const TOKEN_CATEGORY_GROUPS: Array<{ label: string; categories: TokenCategory[] }> = [
  {
    label: 'Color',
    categories: ['colors', 'elevation'],
  },
  {
    label: 'Typography',
    categories: ['typography', 'font'],
  },
  {
    label: 'Geometry',
    categories: ['spacing', 'radius', 'borders'],
  },
  {
    label: 'Effects',
    categories: ['shadows', 'motion'],
  },
  {
    label: 'System',
    categories: ['iconography', 'interaction', 'utility'],
  },
]
