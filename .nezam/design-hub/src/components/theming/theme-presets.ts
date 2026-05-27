/**
 * Theming editor — shadcn-style theme presets.
 * Each preset is a complete set of CSS-variable values for both light and dark.
 * Editor lets users pick a preset, then fine-tune individual tokens.
 */

export interface ThemeTokens {
  background:            string
  foreground:            string
  card:                  string
  cardForeground:        string
  popover:               string
  popoverForeground:     string
  primary:               string
  primaryForeground:     string
  secondary:             string
  secondaryForeground:   string
  muted:                 string
  mutedForeground:       string
  accent:                string
  accentForeground:      string
  destructive:           string
  destructiveForeground: string
  border:                string
  input:                 string
  ring:                  string
  chart1:                string
  chart2:                string
  chart3:                string
  chart4:                string
  chart5:                string
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  swatch: string
  light: ThemeTokens
  dark:  ThemeTokens
}

const DEFAULT_LIGHT: ThemeTokens = {
  background:            '#fbfdff',
  foreground:            '#09090b',
  card:                  '#fbfdff',
  cardForeground:        '#09090b',
  popover:               '#fbfdff',
  popoverForeground:     '#09090b',
  primary:               '#18181b',
  primaryForeground:     '#fafafa',
  secondary:             '#f4f4f5',
  secondaryForeground:   '#18181b',
  muted:                 '#f4f4f5',
  mutedForeground:       '#71717a',
  accent:                '#f4f4f5',
  accentForeground:      '#18181b',
  destructive:           '#ef4444',
  destructiveForeground: '#fafafa',
  border:                '#e4e4e7',
  input:                 '#e4e4e7',
  ring:                  '#18181b',
  chart1:                '#e76f51',
  chart2:                '#2a9d8f',
  chart3:                '#264653',
  chart4:                '#e9c46a',
  chart5:                '#f4a261',
}

const DEFAULT_DARK: ThemeTokens = {
  background:            '#09090b',
  foreground:            '#fafafa',
  card:                  '#09090b',
  cardForeground:        '#fafafa',
  popover:               '#09090b',
  popoverForeground:     '#fafafa',
  primary:               '#fafafa',
  primaryForeground:     '#18181b',
  secondary:             '#27272a',
  secondaryForeground:   '#fafafa',
  muted:                 '#27272a',
  mutedForeground:       '#a1a1aa',
  accent:                '#27272a',
  accentForeground:      '#fafafa',
  destructive:           '#7f1d1d',
  destructiveForeground: '#fafafa',
  border:                '#27272a',
  input:                 '#27272a',
  ring:                  '#d4d4d8',
  chart1:                '#3b82f6',
  chart2:                '#10b981',
  chart3:                '#f59e0b',
  chart4:                '#8b5cf6',
  chart5:                '#ef4444',
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    description: 'shadcn default — clean, neutral, content-first Zinc.',
    swatch: '#18181b',
    light: DEFAULT_LIGHT,
    dark:  DEFAULT_DARK,
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Crisp blue primary with cool slate tinted surfaces.',
    swatch: '#2563eb',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f8fafc', card: '#fbfdff', border: '#e2e8f0', input: '#e2e8f0',
      secondary: '#f1f5f9', secondaryForeground: '#0f172a', muted: '#f1f5f9', mutedForeground: '#64748b',
      accent: '#f1f5f9', accentForeground: '#0f172a', primary: '#2563eb', primaryForeground: '#fbfdff', ring: '#3b82f6'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#020617', card: '#0f172a', border: '#1e293b', input: '#1e293b',
      secondary: '#1e293b', secondaryForeground: '#f8fafc', muted: '#1e293b', mutedForeground: '#94a3b8',
      accent: '#1e293b', accentForeground: '#f8fafc', primary: '#3b82f6', primaryForeground: '#020617', ring: '#60a5fa'
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Royal violet primary with rich, deep amethyst tints.',
    swatch: '#7c3aed',
    light: {
      ...DEFAULT_LIGHT,
      background: '#faf5ff', card: '#fbfdff', border: '#f3e8ff', input: '#f3e8ff',
      secondary: '#f3e8ff', secondaryForeground: '#4c1d95', muted: '#f3e8ff', mutedForeground: '#7c3aed',
      accent: '#f3e8ff', accentForeground: '#4c1d95', primary: '#7c3aed', primaryForeground: '#fbfdff', ring: '#a78bfa'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#090514', card: '#120924', border: '#2e1c4d', input: '#2e1c4d',
      secondary: '#1d1136', secondaryForeground: '#faf5ff', muted: '#1d1136', mutedForeground: '#a78bfa',
      accent: '#1d1136', accentForeground: '#faf5ff', primary: '#8b5cf6', primaryForeground: '#090514', ring: '#c084fc'
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Warm rose primary with soft ruby accents and tinted cards.',
    swatch: '#e11d48',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fff1f2', card: '#fbfdff', border: '#ffe4e6', input: '#ffe4e6',
      secondary: '#ffe4e6', secondaryForeground: '#9f1239', muted: '#ffe4e6', mutedForeground: '#e11d48',
      accent: '#ffe4e6', accentForeground: '#9f1239', primary: '#e11d48', primaryForeground: '#fbfdff', ring: '#fb7185'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0f0205', card: '#1c050d', border: '#3d0f1e', input: '#3d0f1e',
      secondary: '#290a14', secondaryForeground: '#fff1f2', muted: '#290a14', mutedForeground: '#f43f5e',
      accent: '#290a14', accentForeground: '#fff1f2', primary: '#f43f5e', primaryForeground: '#0f0205', ring: '#fda4af'
    },
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Emerald primary with organic mint backgrounds.',
    swatch: '#16a34a',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f0fdf4', card: '#fbfdff', border: '#dcfce7', input: '#dcfce7',
      secondary: '#dcfce7', secondaryForeground: '#14532d', muted: '#dcfce7', mutedForeground: '#16a34a',
      accent: '#dcfce7', accentForeground: '#14532d', primary: '#16a34a', primaryForeground: '#fbfdff', ring: '#22c55e'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#020f06', card: '#051f0d', border: '#103f1d', input: '#103f1d',
      secondary: '#0b2d15', secondaryForeground: '#f0fdf4', muted: '#0b2d15', mutedForeground: '#22c55e',
      accent: '#0b2d15', accentForeground: '#f0fdf4', primary: '#22c55e', primaryForeground: '#020f06', ring: '#4ade80'
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Energetic orange primary with sunset-tinted details.',
    swatch: '#ea580c',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fff7ed', card: '#fbfdff', border: '#ffedd5', input: '#ffedd5',
      secondary: '#ffedd5', secondaryForeground: '#7c2d12', muted: '#ffedd5', mutedForeground: '#ea580c',
      accent: '#ffedd5', accentForeground: '#7c2d12', primary: '#ea580c', primaryForeground: '#fbfdff', ring: '#fb923c'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0f0502', card: '#1f0b03', border: '#471805', input: '#471805',
      secondary: '#301003', secondaryForeground: '#fff7ed', muted: '#301003', mutedForeground: '#f97316',
      accent: '#301003', accentForeground: '#fff7ed', primary: '#f97316', primaryForeground: '#0f0502', ring: '#fdba74'
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Cool enterprise slate primary with solid grayish-blue tints.',
    swatch: '#475569',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f8fafc', card: '#fbfdff', border: '#e2e8f0', input: '#e2e8f0',
      secondary: '#f1f5f9', secondaryForeground: '#1e293b', muted: '#f1f5f9', mutedForeground: '#475569',
      accent: '#f1f5f9', accentForeground: '#1e293b', primary: '#475569', primaryForeground: '#fbfdff', ring: '#64748b'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0b0f19', card: '#151c2c', border: '#2a354f', input: '#2a354f',
      secondary: '#1d273a', secondaryForeground: '#f8fafc', muted: '#1d273a', mutedForeground: '#94a3b8',
      accent: '#1d273a', accentForeground: '#f8fafc', primary: '#94a3b8', primaryForeground: '#0b0f19', ring: '#cbd5e1'
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    description: 'Warm amber primary with cozy ochre-tinted surfaces.',
    swatch: '#d97706',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fffbeb', card: '#fbfdff', border: '#fef3c7', input: '#fef3c7',
      secondary: '#fef3c7', secondaryForeground: '#78350f', muted: '#fef3c7', mutedForeground: '#d97706',
      accent: '#fef3c7', accentForeground: '#78350f', primary: '#d97706', primaryForeground: '#fbfdff', ring: '#f59e0b'
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0f0802', card: '#1f1103', border: '#472705', input: '#472705',
      secondary: '#301a03', secondaryForeground: '#fffbeb', muted: '#301a03', mutedForeground: '#f59e0b',
      accent: '#301a03', accentForeground: '#fffbeb', primary: '#f59e0b', primaryForeground: '#0f0802', ring: '#fcd34d'
    },
  },

  // ── Wild / experimental presets ──
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon magenta + cyan on jet black. Glitchy, electric.',
    swatch: '#ff0080',
    light: {
      ...DEFAULT_LIGHT,
      background: '#0a0014', foreground: '#fff7fb', card: '#16001f', cardForeground: '#fff7fb',
      popover: '#16001f', popoverForeground: '#fff7fb',
      primary: '#ff0080', primaryForeground: '#0a0014',
      secondary: '#1a0033', secondaryForeground: '#00fff0',
      muted: '#1a0033', mutedForeground: '#c4b5fd',
      accent: '#00fff0', accentForeground: '#0a0014',
      destructive: '#ff3864', destructiveForeground: '#0a0014',
      border: '#3d0066', input: '#1a0033', ring: '#ff0080',
      chart1: '#ff0080', chart2: '#00fff0', chart3: '#a855f7', chart4: '#facc15', chart5: '#22d3ee',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0a0014', foreground: '#fff7fb', card: '#16001f', cardForeground: '#fff7fb',
      popover: '#16001f', popoverForeground: '#fff7fb',
      primary: '#ff0080', primaryForeground: '#0a0014',
      secondary: '#1a0033', secondaryForeground: '#00fff0',
      muted: '#1a0033', mutedForeground: '#c4b5fd',
      accent: '#00fff0', accentForeground: '#0a0014',
      destructive: '#ff3864', destructiveForeground: '#0a0014',
      border: '#3d0066', input: '#1a0033', ring: '#ff0080',
      chart1: '#ff0080', chart2: '#00fff0', chart3: '#a855f7', chart4: '#facc15', chart5: '#22d3ee',
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Sunset gradient palette — hot pink, purple, deep blue.',
    swatch: '#ec4899',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fdf2f8', foreground: '#3b0764',
      primary: '#ec4899', primaryForeground: '#fbfdff',
      secondary: '#fae8ff', secondaryForeground: '#86198f',
      muted: '#fae8ff', mutedForeground: '#a21caf',
      accent: '#a855f7', accentForeground: '#fbfdff',
      border: '#f0abfc', input: '#fae8ff', ring: '#d946ef',
      chart1: '#ec4899', chart2: '#a855f7', chart3: '#6366f1', chart4: '#f97316', chart5: '#facc15',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#1a0b2e', foreground: '#fbcfe8', card: '#2d1456', cardForeground: '#fbcfe8',
      popover: '#2d1456', popoverForeground: '#fbcfe8',
      primary: '#ec4899', primaryForeground: '#1a0b2e',
      secondary: '#4c1d95', secondaryForeground: '#fbcfe8',
      muted: '#4c1d95', mutedForeground: '#d8b4fe',
      accent: '#a855f7', accentForeground: '#1a0b2e',
      destructive: '#f43f5e', destructiveForeground: '#1a0b2e',
      border: '#6d28d9', input: '#4c1d95', ring: '#ec4899',
      chart1: '#ec4899', chart2: '#a855f7', chart3: '#6366f1', chart4: '#f97316', chart5: '#facc15',
    },
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Catppuccin-style warm earth. Cozy + readable.',
    swatch: '#dd8a4b',
    light: {
      ...DEFAULT_LIGHT,
      background: '#eff1f5', foreground: '#4c4f69', card: '#e6e9ef', cardForeground: '#4c4f69',
      primary: '#dd8a4b', primaryForeground: '#fbfdff',
      secondary: '#ccd0da', secondaryForeground: '#4c4f69',
      muted: '#ccd0da', mutedForeground: '#6c6f85',
      accent: '#8839ef', accentForeground: '#fbfdff',
      destructive: '#d20f39', destructiveForeground: '#fbfdff',
      border: '#bcc0cc', input: '#ccd0da', ring: '#dd8a4b',
      chart1: '#dd8a4b', chart2: '#40a02b', chart3: '#1e66f5', chart4: '#fe640b', chart5: '#ea76cb',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#1e1e2e', foreground: '#cdd6f4', card: '#181825', cardForeground: '#cdd6f4',
      popover: '#181825', popoverForeground: '#cdd6f4',
      primary: '#fab387', primaryForeground: '#1e1e2e',
      secondary: '#313244', secondaryForeground: '#cdd6f4',
      muted: '#313244', mutedForeground: '#a6adc8',
      accent: '#cba6f7', accentForeground: '#1e1e2e',
      destructive: '#f38ba8', destructiveForeground: '#1e1e2e',
      border: '#45475a', input: '#313244', ring: '#f5c2e7',
      chart1: '#fab387', chart2: '#a6e3a1', chart3: '#89b4fa', chart4: '#f9e2af', chart5: '#f5c2e7',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep evergreen + amber moss. Grounded, organic.',
    swatch: '#15803d',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f7faf6', foreground: '#1a2e1a',
      primary: '#15803d', primaryForeground: '#fbfdff',
      secondary: '#dcfce7', secondaryForeground: '#14532d',
      muted: '#dcfce7', mutedForeground: '#3f6f46',
      accent: '#ca8a04', accentForeground: '#fbfdff',
      border: '#bbf7d0', input: '#dcfce7', ring: '#15803d',
      chart1: '#15803d', chart2: '#65a30d', chart3: '#ca8a04', chart4: '#7c2d12', chart5: '#0e7490',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0c1b0f', foreground: '#d8f3dc', card: '#152917', cardForeground: '#d8f3dc',
      popover: '#152917', popoverForeground: '#d8f3dc',
      primary: '#22c55e', primaryForeground: '#0c1b0f',
      secondary: '#1e3a26', secondaryForeground: '#d8f3dc',
      muted: '#1e3a26', mutedForeground: '#86d094',
      accent: '#eab308', accentForeground: '#0c1b0f',
      border: '#2d5037', input: '#1e3a26', ring: '#4ade80',
      chart1: '#22c55e', chart2: '#84cc16', chart3: '#eab308', chart4: '#d97706', chart5: '#0891b2',
    },
  },
  {
    id: 'iceland',
    name: 'Iceland',
    description: 'Glacier blue + steel grey. Cold and clinical.',
    swatch: '#0ea5e9',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f0f9ff', foreground: '#0c4a6e',
      primary: '#0ea5e9', primaryForeground: '#fbfdff',
      secondary: '#e0f2fe', secondaryForeground: '#0c4a6e',
      muted: '#e0f2fe', mutedForeground: '#0369a1',
      accent: '#6366f1', accentForeground: '#fbfdff',
      border: '#bae6fd', input: '#e0f2fe', ring: '#0ea5e9',
      chart1: '#0ea5e9', chart2: '#06b6d4', chart3: '#6366f1', chart4: '#94a3b8', chart5: '#22d3ee',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#020617', foreground: '#bae6fd', card: '#0c1929', cardForeground: '#bae6fd',
      popover: '#0c1929', popoverForeground: '#bae6fd',
      primary: '#38bdf8', primaryForeground: '#020617',
      secondary: '#1e293b', secondaryForeground: '#bae6fd',
      muted: '#1e293b', mutedForeground: '#7dd3fc',
      accent: '#818cf8', accentForeground: '#020617',
      border: '#1e3a5f', input: '#1e293b', ring: '#38bdf8',
      chart1: '#38bdf8', chart2: '#22d3ee', chart3: '#818cf8', chart4: '#cbd5e1', chart5: '#67e8f9',
    },
  },
  {
    id: 'vapor',
    name: 'Vaporwave',
    description: 'Pastel cyan + magenta on dreamy lavender.',
    swatch: '#67e8f9',
    light: {
      ...DEFAULT_LIGHT,
      background: '#faf5ff', foreground: '#4c1d95',
      primary: '#67e8f9', primaryForeground: '#0e7490',
      secondary: '#fce7f3', secondaryForeground: '#831843',
      muted: '#ede9fe', mutedForeground: '#6d28d9',
      accent: '#f0abfc', accentForeground: '#86198f',
      border: '#e9d5ff', input: '#ede9fe', ring: '#22d3ee',
      chart1: '#67e8f9', chart2: '#f0abfc', chart3: '#a78bfa', chart4: '#fde047', chart5: '#fb7185',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#1e1b4b', foreground: '#e9d5ff', card: '#2e1065', cardForeground: '#e9d5ff',
      popover: '#2e1065', popoverForeground: '#e9d5ff',
      primary: '#67e8f9', primaryForeground: '#1e1b4b',
      secondary: '#4c1d95', secondaryForeground: '#e9d5ff',
      muted: '#4c1d95', mutedForeground: '#c4b5fd',
      accent: '#f0abfc', accentForeground: '#1e1b4b',
      border: '#6d28d9', input: '#4c1d95', ring: '#67e8f9',
      chart1: '#67e8f9', chart2: '#f0abfc', chart3: '#a78bfa', chart4: '#fde047', chart5: '#fb7185',
    },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Stark black/white with one hot accent. Heavy borders.',
    swatch: '#111827',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fafaf9', foreground: '#111827', card: '#fbfdff', cardForeground: '#111827',
      primary: '#111827', primaryForeground: '#fefce8',
      secondary: '#fefce8', secondaryForeground: '#111827',
      muted: '#f5f5f4', mutedForeground: '#1c1917',
      accent: '#facc15', accentForeground: '#111827',
      destructive: '#dc2626', destructiveForeground: '#fbfdff',
      border: '#111827', input: '#fbfdff', ring: '#facc15',
      chart1: '#111827', chart2: '#facc15', chart3: '#dc2626', chart4: '#2563eb', chart5: '#16a34a',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#111827', foreground: '#fafaf9', card: '#0a0a0a', cardForeground: '#fafaf9',
      popover: '#0a0a0a', popoverForeground: '#fafaf9',
      primary: '#facc15', primaryForeground: '#111827',
      secondary: '#1c1917', secondaryForeground: '#fafaf9',
      muted: '#1c1917', mutedForeground: '#fafaf9',
      accent: '#fafaf9', accentForeground: '#111827',
      destructive: '#ef4444', destructiveForeground: '#111827',
      border: '#fafaf9', input: '#1c1917', ring: '#facc15',
      chart1: '#facc15', chart2: '#ef4444', chart3: '#3b82f6', chart4: '#22c55e', chart5: '#a855f7',
    },
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Translucent surfaces, frosted blues. Modern overlay.',
    swatch: '#7dd3fc',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f8fafc', foreground: '#0f172a',
      card: '#fbfdff', cardForeground: '#0f172a',
      primary: '#0284c7', primaryForeground: '#fbfdff',
      secondary: '#e0f2fe', secondaryForeground: '#0c4a6e',
      muted: '#f1f5f9', mutedForeground: '#475569',
      accent: '#7dd3fc', accentForeground: '#0c4a6e',
      border: '#cbd5e1', input: '#f1f5f9', ring: '#38bdf8',
      chart1: '#0284c7', chart2: '#06b6d4', chart3: '#8b5cf6', chart4: '#10b981', chart5: '#f59e0b',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#0f172a', foreground: '#e2e8f0', card: '#1e293b', cardForeground: '#e2e8f0',
      popover: '#1e293b', popoverForeground: '#e2e8f0',
      primary: '#7dd3fc', primaryForeground: '#0f172a',
      secondary: '#334155', secondaryForeground: '#e2e8f0',
      muted: '#334155', mutedForeground: '#cbd5e1',
      accent: '#a5f3fc', accentForeground: '#0f172a',
      border: '#475569', input: '#334155', ring: '#7dd3fc',
      chart1: '#7dd3fc', chart2: '#22d3ee', chart3: '#a78bfa', chart4: '#34d399', chart5: '#fbbf24',
    },
  },
  {
    id: 'mono',
    name: 'Monochrome',
    description: 'Pure grayscale. Lets typography do the talking.',
    swatch: '#404040',
    light: {
      ...DEFAULT_LIGHT,
      primary: '#171717', primaryForeground: '#fafafa',
      accent: '#404040', accentForeground: '#fafafa',
      chart1: '#0a0a0a', chart2: '#404040', chart3: '#737373', chart4: '#a3a3a3', chart5: '#d4d4d4',
    },
    dark: {
      ...DEFAULT_DARK,
      primary: '#fafafa', primaryForeground: '#0a0a0a',
      accent: '#a3a3a3', accentForeground: '#0a0a0a',
      chart1: '#fafafa', chart2: '#d4d4d4', chart3: '#a3a3a3', chart4: '#737373', chart5: '#404040',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft candy hues. Friendly consumer-grade palette.',
    swatch: '#fda4af',
    light: {
      ...DEFAULT_LIGHT,
      background: '#fff5f7', foreground: '#9f1239',
      primary: '#fda4af', primaryForeground: '#881337',
      secondary: '#fae8ff', secondaryForeground: '#86198f',
      muted: '#fef3c7', mutedForeground: '#92400e',
      accent: '#bbf7d0', accentForeground: '#14532d',
      border: '#fecdd3', input: '#fef3c7', ring: '#fda4af',
      chart1: '#fda4af', chart2: '#bbf7d0', chart3: '#bfdbfe', chart4: '#fde68a', chart5: '#e9d5ff',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#1c1917', foreground: '#fed7e2',
      card: '#292524', cardForeground: '#fed7e2', popover: '#292524', popoverForeground: '#fed7e2',
      primary: '#fda4af', primaryForeground: '#1c1917',
      secondary: '#44403c', secondaryForeground: '#fed7e2',
      muted: '#44403c', mutedForeground: '#fbbf24',
      accent: '#a7f3d0', accentForeground: '#1c1917',
      border: '#57534e', input: '#44403c', ring: '#fda4af',
      chart1: '#fda4af', chart2: '#a7f3d0', chart3: '#a5b4fc', chart4: '#fde68a', chart5: '#e9d5ff',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Phosphor green on jet black. Terminal nostalgia.',
    swatch: '#00ff41',
    light: {
      ...DEFAULT_LIGHT,
      background: '#f0fff0', foreground: '#003300',
      primary: '#00aa00', primaryForeground: '#f0fff0',
      secondary: '#dcfce7', secondaryForeground: '#003300',
      muted: '#dcfce7', mutedForeground: '#005500',
      accent: '#16a34a', accentForeground: '#f0fff0',
      border: '#86efac', input: '#dcfce7', ring: '#00aa00',
      chart1: '#00aa00', chart2: '#16a34a', chart3: '#22c55e', chart4: '#65a30d', chart5: '#84cc16',
    },
    dark: {
      ...DEFAULT_DARK,
      background: '#111827', foreground: '#00ff41', card: '#001a00', cardForeground: '#00ff41',
      popover: '#001a00', popoverForeground: '#00ff41',
      primary: '#00ff41', primaryForeground: '#111827',
      secondary: '#003300', secondaryForeground: '#00ff41',
      muted: '#003300', mutedForeground: '#66ff66',
      accent: '#00cc33', accentForeground: '#111827',
      destructive: '#ff0000', destructiveForeground: '#111827',
      border: '#006600', input: '#003300', ring: '#00ff41',
      chart1: '#00ff41', chart2: '#66ff66', chart3: '#00cc33', chart4: '#99ff99', chart5: '#33ff66',
    },
  },
]

export const THEME_PRESET_MAP: Record<string, ThemePreset> = THEME_PRESETS.reduce((acc, p) => {
  acc[p.id] = p
  return acc
}, {} as Record<string, ThemePreset>)

export const TOKEN_GROUPS: Array<{
  label: string
  description?: string
  tokens: Array<{ key: keyof ThemeTokens; label: string; hint?: string }>
}> = [
  {
    label: 'Base',
    description: 'Page backdrop + default text.',
    tokens: [
      { key: 'background', label: 'background' },
      { key: 'foreground', label: 'foreground' },
    ],
  },
  {
    label: 'Surface',
    description: 'Card and popover containers.',
    tokens: [
      { key: 'card',              label: 'card' },
      { key: 'cardForeground',    label: 'card-foreground' },
      { key: 'popover',           label: 'popover' },
      { key: 'popoverForeground', label: 'popover-foreground' },
    ],
  },
  {
    label: 'Primary',
    description: 'Calls-to-action, prominent UI.',
    tokens: [
      { key: 'primary',           label: 'primary' },
      { key: 'primaryForeground', label: 'primary-foreground' },
    ],
  },
  {
    label: 'Secondary',
    description: 'Less-prominent fills.',
    tokens: [
      { key: 'secondary',           label: 'secondary' },
      { key: 'secondaryForeground', label: 'secondary-foreground' },
    ],
  },
  {
    label: 'Muted',
    description: 'Subdued backgrounds + secondary text.',
    tokens: [
      { key: 'muted',           label: 'muted' },
      { key: 'mutedForeground', label: 'muted-foreground' },
    ],
  },
  {
    label: 'Accent',
    description: 'Highlight states and hovers.',
    tokens: [
      { key: 'accent',           label: 'accent' },
      { key: 'accentForeground', label: 'accent-foreground' },
    ],
  },
  {
    label: 'Destructive',
    description: 'Errors, deletes, danger.',
    tokens: [
      { key: 'destructive',           label: 'destructive' },
      { key: 'destructiveForeground', label: 'destructive-foreground' },
    ],
  },
  {
    label: 'Borders & Inputs',
    description: 'Outlines, dividers, focus ring.',
    tokens: [
      { key: 'border', label: 'border' },
      { key: 'input',  label: 'input' },
      { key: 'ring',   label: 'ring' },
    ],
  },
  {
    label: 'Charts',
    description: 'Data viz palette (chart-1 → chart-5).',
    tokens: [
      { key: 'chart1', label: 'chart-1' },
      { key: 'chart2', label: 'chart-2' },
      { key: 'chart3', label: 'chart-3' },
      { key: 'chart4', label: 'chart-4' },
      { key: 'chart5', label: 'chart-5' },
    ],
  },
]

export const FONT_OPTIONS = [
  { id: 'inter',       label: 'Inter',               family: 'Inter, system-ui, sans-serif' },
  { id: 'geist',       label: 'Geist',               family: 'Geist, system-ui, sans-serif' },
  { id: 'system',      label: 'System UI',           family: 'system-ui, -apple-system, sans-serif' },
  { id: 'sf-pro',      label: 'SF Pro',              family: '"SF Pro Display", -apple-system, sans-serif' },
  { id: 'roboto',      label: 'Roboto',              family: 'Roboto, system-ui, sans-serif' },
  { id: 'plex-sans',   label: 'IBM Plex Sans',       family: '"IBM Plex Sans", system-ui, sans-serif' },
  { id: 'manrope',     label: 'Manrope',             family: 'Manrope, system-ui, sans-serif' },
  { id: 'jetbrains',   label: 'JetBrains Mono',      family: '"JetBrains Mono", ui-monospace, monospace' },
  { id: 'plex-mono',   label: 'IBM Plex Mono',       family: '"IBM Plex Mono", ui-monospace, monospace' },
]
