/** Design System section types — tokens, scales, profiles. */

export type TokenCategory =
  // ── Core Visual Foundations ──
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadows'
  | 'motion'
  | 'borders'
  | 'iconography'
  // ── Semantic Tokens ──
  | 'elevation'
  | 'font'
  | 'interaction'
  | 'utility'
  // ── Layout & Sizing ──
  | 'opacity'
  | 'z-index'
  | 'breakpoints'
  | 'layout'
  // ── New: Advanced Categories ──
  | 'cursor'
  | 'scrollbar'
  | 'glass'
  | 'gradients'
  | 'grid'
  | 'content'
  | 'density'

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
  | 'supabase'
  | 'raycast'
  | 'resend'

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
    /** Dedicated secondary color scale. */
    secondary?: ColorScale
    /** Accent color scale. */
    accent: ColorScale
    /** Neutral gray scale. */
    neutral: ColorScale
    semantic: {
      success: string
      warning: string
      error: string
      info: string
    }
    /** Full semantic color scales (11-step) for rich feedback UI. */
    successScale: ColorScale
    warningScale: ColorScale
    errorScale: ColorScale
    infoScale: ColorScale
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
    /** Dark mode surface/text overrides. */
    darkSurface: {
      bg: string
      panel: string
      overlay: string
      border: string
    }
    darkText: {
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
    /** Inset shadows for inputs, wells. */
    inner: string
    /** Brand-colored glow shadow. */
    glow: string
  }
  motion: {
    duration: {
      instant: string
      fast: string
      base: string
      slow: string
      slower: string
    }
    easing: {
      default: string
      bounce: string
      smooth: string
      /** Ease in for exits. */
      easeIn: string
      /** Ease out for entrances. */
      easeOut: string
      /** Spring-like overshoot. */
      spring: string
    }
    /** Named transition presets for common property groups. */
    transition: {
      colors: string
      transform: string
      opacity: string
      all: string
    }
    /** Spring physics config for natural animations. */
    spring: {
      stiffness: number
      damping: number
      mass: number
    }
  }
  borders: {
    width: string
    style: 'solid' | 'dashed'
    /** Named border width scale (0-4). */
    widthScale: {
      '0': string
      '1': string
      '2': string
      '3': string
      '4': string
    }
    /** Divider (horizontal rule) styling. */
    divider: {
      width: string
      style: 'solid' | 'dashed' | 'dotted'
      color: string
    }
    /** Focus-visible border config. */
    focus: {
      width: string
      color: string
      offset: string
    }
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

  // ─── Semantic Tokens ──────────────────────────────────────────────────────

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

  // ─── Layout & Sizing ──────────────────────────────────────────────────────

  /** Opacity — semantic opacity tokens for consistent transparency. */
  opacity: {
    /** Disabled elements. */
    disabled: string
    /** Overlay backgrounds (e.g., dropdowns, tooltips). */
    overlay: string
    /** Hover state overlays. */
    hover: string
    /** Focus state overlays. */
    focus: string
  }
  /** Z-index — layer ordering for UI components. */
  zIndex: {
    /** Hide — completely hidden from view. */
    hide: number
    /** Auto — element appears in natural document flow. */
    auto: number
    /** Base — default layer (most content). */
    base: number
    /** Dropdown — dropdowns, tooltips. */
    dropdown: number
    /** Sticky — sticky headers, footers. */
    sticky: number
    /** Fixed — fixed position elements. */
    fixed: number
    /** Modal — modals, dialogs. */
    modal: number
    /** Toast — toast notifications. */
    toast: number
    /** Tooltip — tooltips, popovers. */
    tooltip: number
  }
  /** Breakpoints — responsive design breakpoints. */
  breakpoints: {
    /** Extra small (mobile). */
    xs: string
    /** Small (tablet portrait). */
    sm: string
    /** Medium (tablet landscape). */
    md: string
    /** Large (desktop). */
    lg: string
    /** Extra large (wide desktop). */
    xl: string
    /** Extra extra large (ultrawide). */
    '2xl': string
  }
  /** Layout — spacing and sizing for layout containers. */
  layout: {
    /** Maximum content width. */
    maxWidth: string
    /** Container padding. */
    containerPadding: string
    /** Gutter spacing between columns. */
    gutter: string
    /** Header height. */
    headerHeight: string
    /** Footer height. */
    footerHeight: string
    /** Sidebar width. */
    sidebarWidth: string
  }

  // ─── New Advanced Categories ──────────────────────────────────────────────

  /** Cursor & Focus — focus ring, cursor types per element. */
  cursor: {
    /** Focus ring width. */
    focusRingWidth: string
    /** Focus ring offset from element. */
    focusRingOffset: string
    /** Focus ring style. */
    focusRingStyle: 'solid' | 'dashed' | 'dotted' | 'double'
    /** Focus ring color. */
    focusRingColor: string
    /** Cursor for interactive elements. */
    interactive: 'pointer' | 'default'
    /** Cursor for text elements. */
    text: 'text' | 'default'
    /** Cursor for disabled elements. */
    disabled: 'not-allowed' | 'default'
    /** Cursor for draggable elements. */
    drag: 'grab' | 'move'
  }

  /** Scrollbar — custom scrollbar appearance. */
  scrollbar: {
    /** Scrollbar width. */
    width: string
    /** Thumb color. */
    thumbColor: string
    /** Thumb hover color. */
    thumbHoverColor: string
    /** Track color. */
    trackColor: string
    /** Thumb border radius. */
    thumbRadius: string
  }

  /** Glass — backdrop-filter blur + frosted effects. */
  glass: {
    blur: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    /** Frosted overlay tint (rgba). */
    tint: string
    /** Glass border opacity (0-1 as string). */
    borderOpacity: string
    /** Glass shadow. */
    shadow: string
  }

  /** Gradients — named gradient presets. */
  gradients: {
    /** Brand gradient (primary → accent). */
    brand: string
    /** Accent gradient. */
    accent: string
    /** Surface gradient (subtle bg gradient). */
    surface: string
    /** Mesh gradient seed colors (for generative gradients). */
    mesh: {
      color1: string
      color2: string
      color3: string
      color4: string
    }
  }

  /** Grid — responsive column grid system. */
  grid: {
    columns: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      '2xl': number
    }
    /** Gutter between columns. */
    gutter: string
    /** Outer margin for grid container. */
    margin: string
  }

  /** Content — prose/reading optimized tokens. */
  content: {
    /** Maximum line length for readability. */
    maxWidth: string
    /** Optimal line length (characters). */
    lineLength: string
    /** Paragraph spacing. */
    paragraphSpacing: string
    /** Heading margin spacing. */
    headingSpacing: string
    /** List item indent. */
    listIndent: string
    /** Blockquote border width. */
    blockquoteBorder: string
  }

  /** Density — compact/comfortable/spacious multiplier. */
  density: {
    /** Current density mode. */
    mode: 'compact' | 'comfortable' | 'spacious'
    /** Spacing multiplier (0.75 for compact, 1.0 for comfortable, 1.25 for spacious). */
    spacingMultiplier: number
    /** Font size multiplier. */
    fontMultiplier: number
    /** Padding multiplier for interactive elements. */
    paddingMultiplier: number
    /** Gap multiplier for flex/grid layouts. */
    gapMultiplier: number
    /** Min touch target size in px. */
    minTouchTarget: number
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
  motion:       'Motion & Animation',
  borders:      'Borders & Dividers',
  iconography:  'Iconography',
  elevation:    'Elevation',
  font:         'Semantic Typography',
  interaction:  'Interaction States',
  utility:      'Utility',
  opacity:      'Opacity',
  'z-index':    'Z-Index Layers',
  breakpoints:  'Breakpoints',
  layout:       'Layout',
  cursor:       'Cursor & Focus',
  scrollbar:    'Scrollbar',
  glass:        'Glass & Blur',
  gradients:    'Gradients',
  grid:         'Grid System',
  content:      'Content & Prose',
  density:      'Density',
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
  opacity:      'Opacity',
  'z-index':    'Layers',
  breakpoints:  'ScreenShare',
  layout:       'Layout',
  cursor:       'Crosshair',
  scrollbar:    'ScrollText',
  glass:        'Sparkles',
  gradients:    'Blend',
  grid:         'LayoutGrid',
  content:      'BookOpen',
  density:      'SlidersHorizontal',
}

/** Logical groups for the token nav sidebar. */
export const TOKEN_CATEGORY_GROUPS: Array<{ label: string; categories: TokenCategory[] }> = [
  {
    label: 'Color & Surface',
    categories: ['colors', 'elevation', 'gradients', 'glass'],
  },
  {
    label: 'Typography',
    categories: ['typography', 'font', 'content'],
  },
  {
    label: 'Geometry & Space',
    categories: ['spacing', 'radius', 'borders', 'density'],
  },
  {
    label: 'Effects & Motion',
    categories: ['shadows', 'motion', 'opacity'],
  },
  {
    label: 'Interaction & A11y',
    categories: ['interaction', 'cursor', 'scrollbar'],
  },
  {
    label: 'Layout & System',
    categories: ['iconography', 'utility', 'z-index', 'breakpoints', 'layout', 'grid'],
  },
]
