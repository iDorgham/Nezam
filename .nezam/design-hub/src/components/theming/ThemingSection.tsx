'use client'

import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react'
import {
  Sun, Moon, Copy, Check, RotateCcw, Sparkles, Palette, Shuffle,
  Wand2, Play, BookmarkPlus, Trash2, SlidersHorizontal, Settings, SlidersVertical,
  Download, Layers, Compass, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeftPanelTabsRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import {
  THEME_PRESETS,
  TOKEN_GROUPS,
  type ThemePreset,
  type ThemeTokens,
} from './theme-presets'
import { ThemingPreview } from './ThemingPreview'
import {
  transformColor,
  isIdentityTransform,
  randomSoftHex,
  generateHarmoniousPalette,
  generateTintedTheme,
  generateSpecificHarmonyTheme,
  hexToHsl,
  hslToHex,
  type ColorTransform,
  type HarmonyType,
} from './color-utils'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  buildThemeEditorSnapshot,
  type ThemeEditorSnapshot,
} from '@/lib/design-to-theme'
import { useHub, type ThemePreviewOverride } from '@/store/hub.store'
import { useSidebarResize } from '@/lib/useSidebarResize'
import { getContrastRatio, meetsWCAG, contrastBadge } from '@/lib/color-a11y'

type Mode = 'light' | 'dark'

export type SurfaceStyle = 'flat' | 'glass' | 'brutalist'
export type ShadowStyle  = 'none' | 'soft' | 'hard' | 'glow' | 'neon'

interface ThemeConfig {
  presetId:     string
  light:        ThemeTokens
  dark:         ThemeTokens
  radius:       number       // rem
  fontSans:     string
  fontMono:     string
  contrast:     number       // 0.8 .. 1.4 — multiplies lightness difference bg↔fg
  transform:    ColorTransform
  surfaceStyle: SurfaceStyle
  shadowStyle:  ShadowStyle
  letterSpacing: number      // em, -0.05..0.15
  borderWidth?:  number      // px, 0..6
  motionStyle?:  'none' | 'smooth' | 'spring' | 'pulsing'
}

// ─── Google Fonts — curated popular families ───────────────────────────────

const SANS_FONTS = [
  { label: 'Inter',          family: 'Inter, system-ui, sans-serif',             google: 'Inter' },
  { label: 'Geist',          family: 'Geist, system-ui, sans-serif',              google: null },
  { label: 'DM Sans',        family: '"DM Sans", system-ui, sans-serif',          google: 'DM+Sans:wght@300;400;500;600;700' },
  { label: 'Plus Jakarta',   family: '"Plus Jakarta Sans", system-ui, sans-serif',google: 'Plus+Jakarta+Sans:wght@300;400;500;600;700' },
  { label: 'Outfit',         family: 'Outfit, system-ui, sans-serif',             google: 'Outfit:wght@300;400;500;600;700' },
  { label: 'Nunito',         family: 'Nunito, system-ui, sans-serif',             google: 'Nunito:wght@300;400;500;600;700' },
  { label: 'Lato',           family: '"Lato", system-ui, sans-serif',             google: 'Lato:wght@300;400;700' },
  { label: 'Open Sans',      family: '"Open Sans", system-ui, sans-serif',        google: 'Open+Sans:wght@300;400;500;600;700' },
  { label: 'Source Sans 3',  family: '"Source Sans 3", system-ui, sans-serif',    google: 'Source+Sans+3:wght@300;400;500;600;700' },
  { label: 'Raleway',        family: 'Raleway, system-ui, sans-serif',            google: 'Raleway:wght@300;400;500;600;700' },
  { label: 'Urbanist',       family: 'Urbanist, system-ui, sans-serif',           google: 'Urbanist:wght@300;400;500;600;700' },
  { label: 'Figtree',        family: 'Figtree, system-ui, sans-serif',            google: 'Figtree:wght@300;400;500;600;700' },
  { label: 'Syne',           family: 'Syne, system-ui, sans-serif',               google: 'Syne:wght@400;500;600;700;800' },
  { label: 'Space Grotesk',  family: '"Space Grotesk", system-ui, sans-serif',    google: 'Space+Grotesk:wght@300;400;500;600;700' },
  { label: 'System UI',      family: 'system-ui, sans-serif',                     google: null },
]

const MONO_FONTS = [
  { label: 'JetBrains Mono', family: '"JetBrains Mono", ui-monospace, monospace', google: 'JetBrains+Mono:wght@400;500;600' },
  { label: 'Geist Mono',     family: '"Geist Mono", ui-monospace, monospace',     google: null },
  { label: 'Fira Code',      family: '"Fira Code", ui-monospace, monospace',      google: 'Fira+Code:wght@400;500;600' },
  { label: 'Source Code Pro',family: '"Source Code Pro", ui-monospace, monospace',google: 'Source+Code+Pro:wght@400;500;600' },
  { label: 'IBM Plex Mono',  family: '"IBM Plex Mono", ui-monospace, monospace',  google: 'IBM+Plex+Mono:wght@400;500;600' },
  { label: 'Space Mono',     family: '"Space Mono", ui-monospace, monospace',     google: 'Space+Mono:wght@400;700' },
  { label: 'Roboto Mono',    family: '"Roboto Mono", ui-monospace, monospace',    google: 'Roboto+Mono:wght@400;500;600' },
  { label: 'Inconsolata',    family: 'Inconsolata, ui-monospace, monospace',      google: 'Inconsolata:wght@400;500;600' },
  { label: 'ui-monospace',   family: 'ui-monospace, monospace',                   google: null },
]

// Load a Google Font dynamically
function loadGoogleFont(entry: typeof SANS_FONTS[number] | undefined) {
  if (!entry?.google) return
  const id = `gf-${entry.google}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id   = id
  link.rel  = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${entry.google}&display=swap`
  document.head.appendChild(link)
}

// ─── Color transform + contrast ───────────────────────────────────────────────

const BG_KEYS = ['background', 'card', 'popover', 'secondary', 'muted', 'border', 'input']
const FG_KEYS = ['foreground', 'cardForeground', 'popoverForeground', 'secondaryForeground', 'mutedForeground']

/** Apply a color transform and contrast scaling to every token. */
function applyTransform(tokens: ThemeTokens, t: ColorTransform, contrast = 1, mode: Mode = 'light'): ThemeTokens {
  const out = { ...tokens }
  ;(Object.keys(out) as Array<keyof ThemeTokens>).forEach((k) => {
    let hex = out[k]
    
    // 1. Apply global hue shift, sat, light transforms
    if (!isIdentityTransform(t)) {
      hex = transformColor(hex, t)
    }
    
    // 2. Apply contrast scaling (WCAG AA compliant lightness separation)
    if (contrast !== 1) {
      const hsl = hexToHsl(hex)
      if (hsl) {
        const isBg = BG_KEYS.includes(k)
        const isFg = FG_KEYS.includes(k)
        
        if (isBg) {
          if (mode === 'light') {
            // Light background gets lighter (closer to 1.0) under high contrast
            hsl.l = 1.0 - (1.0 - hsl.l) / contrast
          } else {
            // Dark background gets darker (closer to 0.0) under high contrast
            hsl.l = hsl.l / contrast
          }
        } else if (isFg) {
          if (mode === 'light') {
            // Light mode text gets darker (closer to 0.0) under high contrast
            hsl.l = hsl.l / contrast
          } else {
            // Dark mode text gets lighter (closer to 1.0) under high contrast
            hsl.l = 1.0 - (1.0 - hsl.l) / contrast
          }
        }
        
        hsl.l = Math.max(0, Math.min(1, hsl.l))
        hex = hslToHex(hsl)
      }
    }
    
    out[k] = hex
  })
  return out
}

function configFromPreset(preset: ThemePreset): ThemeConfig {
  return {
    presetId:     preset.id,
    light:        { ...preset.light },
    dark:         { ...preset.dark },
    radius:       0.5,
    fontSans:     SANS_FONTS[0].family,
    fontMono:     MONO_FONTS[0].family,
    contrast:     1,
    transform:    { hueShift: 0, satScale: 1, lightScale: 1 },
    surfaceStyle: 'flat',
    shadowStyle:  'soft',
    letterSpacing: 0,
    borderWidth:  1,
    motionStyle:  'smooth',
  }
}

function configFromEditorSnapshot(snapshot: ThemeEditorSnapshot): ThemeConfig {
  return {
    presetId: snapshot.presetId,
    light: { ...snapshot.light },
    dark: { ...snapshot.dark },
    radius: snapshot.radius,
    fontSans: snapshot.fontSans,
    fontMono: snapshot.fontMono,
    contrast: 1,
    transform: { hueShift: 0, satScale: 1, lightScale: 1 },
    surfaceStyle: 'flat',
    shadowStyle: 'soft',
    letterSpacing: 0,
    borderWidth: 1,
    motionStyle: 'smooth',
  }
}

function initialThemeFromStore(): { config: ThemeConfig; mode: Mode } {
  const { theme, design } = useHub.getState()
  if (theme.editorSnapshot) {
    return {
      config: configFromEditorSnapshot(theme.editorSnapshot),
      mode: theme.editorSnapshot.defaultMode,
    }
  }
  const profileId = design.activeProfileId
  if (profileId && DESIGN_PROFILES_MAP[profileId]) {
    const profile = DESIGN_PROFILES_MAP[profileId]
    const snapshot = buildThemeEditorSnapshot(profile.tokens, profileId, profile.name)
    return {
      config: configFromEditorSnapshot(snapshot),
      mode: snapshot.defaultMode,
    }
  }
  return { config: configFromPreset(THEME_PRESETS[0]), mode: 'light' }
}

/** Randomize the palette using dynamic brand-tinted HSL color-theory generation. */
function randomizeTokens(base: ThemeTokens, mode: Mode): ThemeTokens {
  const baseHue = Math.random() * 360
  const baseSat = 0.55 + Math.random() * 0.35 // 55% - 90%
  
  return generateTintedTheme(baseHue, baseSat, mode)
}

// ─── Build the ThemePreviewOverride from current config ───────────────────────

function buildOverride(config: ThemeConfig, mode: Mode, presetName: string): ThemePreviewOverride {
  // Apply transform and contrast to light and dark tokens!
  const lightTransformed = applyTransform(config.light, config.transform, config.contrast, 'light')
  const darkTransformed  = applyTransform(config.dark,  config.transform, config.contrast, 'dark')

  const buildVars = (t: ThemeTokens): Record<string, string> => ({
    background:         t.background,
    foreground:         t.foreground,
    card:               t.card,
    'card-foreground':  t.cardForeground,
    popover:            t.popover,
    'popover-foreground': t.popoverForeground,
    primary:            t.primary,
    'primary-foreground': t.primaryForeground,
    secondary:          t.secondary,
    'secondary-foreground': t.secondaryForeground,
    muted:              t.muted,
    'muted-foreground': t.mutedForeground,
    accent:             t.accent,
    'accent-foreground': t.accentForeground,
    destructive:        t.destructive,
    border:             t.border,
    input:              t.input,
    ring:               t.ring,
    radius:             `${config.radius}rem`,
    // Map to NEZAM page-renderer readable vars (aligned with DeviceFrame)
    '--bg-surface':     t.background,
    '--text':           t.foreground,
    '--panel':          t.card,
    '--border':         t.border,
    '--brand':          t.primary,
    '--accent':         t.accent,
    '--text-secondary': t.mutedForeground,
    '--error':          t.destructive,
    '--font-sans':      config.fontSans,
    '--font-mono':      config.fontMono,
  })

  return {
    light:     buildVars(lightTransformed),
    dark:      buildVars(darkTransformed),
    mode,
    fontSans:  config.fontSans,
    fontMono:  config.fontMono,
    radius:    `${config.radius}rem`,
    presetName,
  }
}

// ─── CSS export ───────────────────────────────────────────────────────────────

function buildCss(config: ThemeConfig): string {
  // Apply transform and contrast to light and dark tokens!
  const lightTransformed = applyTransform(config.light, config.transform, config.contrast, 'light')
  const darkTransformed  = applyTransform(config.dark,  config.transform, config.contrast, 'dark')

  const block = (t: ThemeTokens) => [
    `  --background: ${t.background};`,
    `  --foreground: ${t.foreground};`,
    `  --card: ${t.card};`,
    `  --card-foreground: ${t.cardForeground};`,
    `  --popover: ${t.popover};`,
    `  --popover-foreground: ${t.popoverForeground};`,
    `  --primary: ${t.primary};`,
    `  --primary-foreground: ${t.primaryForeground};`,
    `  --secondary: ${t.secondary};`,
    `  --secondary-foreground: ${t.secondaryForeground};`,
    `  --muted: ${t.muted};`,
    `  --muted-foreground: ${t.mutedForeground};`,
    `  --accent: ${t.accent};`,
    `  --accent-foreground: ${t.accentForeground};`,
    `  --destructive: ${t.destructive};`,
    `  --destructive-foreground: ${t.destructiveForeground};`,
    `  --border: ${t.border};`,
    `  --input: ${t.input};`,
    `  --ring: ${t.ring};`,
    `  --chart-1: ${t.chart1};`,
    `  --chart-2: ${t.chart2};`,
    `  --chart-3: ${t.chart3};`,
    `  --chart-4: ${t.chart4};`,
    `  --chart-5: ${t.chart5};`,
  ].join('\n')

  return [
    `:root {`,
    `  --radius: ${config.radius}rem;`,
    `  --font-sans: ${config.fontSans};`,
    `  --font-mono: ${config.fontMono};`,
    block(lightTransformed),
    `}`,
    ``,
    `.dark {`,
    block(darkTransformed),
    `}`,
  ].join('\n')
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ThemingSection() {
  const { width, startResize } = useSidebarResize()
  const initial = useMemo(() => initialThemeFromStore(), [])
  const [config, setConfig] = useState<ThemeConfig>(() => initial.config)
  const hubTheme = useHub((s) => s.hubTheme)
  const setHubTheme = useHub((s) => s.setHubTheme)
  const mode = hubTheme
  const [copied, setCopied] = useState(false)
  const [saveInput, setSaveInput]   = useState('')
  const [showSaveBox, setShowSaveBox] = useState(false)
  const [applied, setApplied] = useState(false)
  const [controlTab, setControlTab] = useState<'presets' | 'styles' | 'colors' | 'export'>('presets')
  const [showWcagAudit, setShowWcagAudit] = useState(false)

  const applyToPreview    = useHub((s) => s.themeApplyToPreview)
  const saveProfile       = useHub((s) => s.themeSaveProfile)
  const deleteProfile     = useHub((s) => s.themeDeleteProfile)
  const savedProfiles     = useHub((s) => s.theme.savedProfiles)
  const previewOverride   = useHub((s) => s.theme.previewOverride)
  const editorSnapshot    = useHub((s) => s.theme.editorSnapshot)
  const syncedProfileRef  = useRef<string | null>(null)

  useEffect(() => {
    if (!editorSnapshot) return
    const key = editorSnapshot.sourceDesignProfileId
    if (syncedProfileRef.current === key) return
    syncedProfileRef.current = key
    setConfig(configFromEditorSnapshot(editorSnapshot))
    setHubTheme(editorSnapshot.defaultMode)
    const sansEntry = SANS_FONTS.find((f) => f.family === editorSnapshot.fontSans)
    const monoEntry = MONO_FONTS.find((f) => f.family === editorSnapshot.fontMono)
    loadGoogleFont(sansEntry)
    loadGoogleFont(monoEntry)
  }, [editorSnapshot])

  const rawTokens = config[mode]
  const tokens    = useMemo(() => applyTransform(rawTokens, config.transform, config.contrast, mode), [rawTokens, config.transform, config.contrast, mode])

  const cssOutput = useMemo(() => buildCss(config), [config])

  function applyPreset(preset: ThemePreset) {
    setConfig((c) => ({
      ...c,
      presetId: preset.id,
      light: { ...preset.light },
      dark:  { ...preset.dark },
    }))
  }

  function applyHarmony(type: HarmonyType) {
    setConfig((c) => ({
      ...c,
      presetId: `harmony-${type}`,
      light: generateSpecificHarmonyTheme(type, 'light'),
      dark:  generateSpecificHarmonyTheme(type, 'dark'),
    }))
  }

  function setToken(key: keyof ThemeTokens, value: string) {
    setConfig((c) => ({
      ...c,
      [mode]: { ...c[mode], [key]: value },
      presetId: 'custom',
    }))
  }

  function resetMode() {
    const preset = THEME_PRESETS.find((p) => p.id === config.presetId) ?? THEME_PRESETS[0]
    setConfig((c) => ({ ...c, [mode]: { ...preset[mode] } }))
  }

  function handleFontChange(kind: 'sans' | 'mono', family: string) {
    const all = kind === 'sans' ? SANS_FONTS : MONO_FONTS
    const entry = all.find((f) => f.family === family)
    loadGoogleFont(entry)
    setConfig((c) => kind === 'sans' ? { ...c, fontSans: family } : { ...c, fontMono: family })
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(cssOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked in preview */ }
  }

  function handleApplyToPreview() {
    const name = config.presetId.startsWith('harmony-') ? `${config.presetId.replace('harmony-', '')} harmony` : (config.presetId === 'custom' ? 'Custom' :
      (THEME_PRESETS.find((p) => p.id === config.presetId)?.name ?? config.presetId))
    applyToPreview(buildOverride(config, mode, name))
    setApplied(true)
    setTimeout(() => setApplied(false), 1800)
  }

  function handleSaveProfile() {
    const name = saveInput.trim() || `Profile ${savedProfiles.length + 1}`
    saveProfile(name, buildOverride(config, mode, name))
    setSaveInput('')
    setShowSaveBox(false)
  }

  function loadSavedProfile(id: string) {
    const profile = savedProfiles.find((p) => p.id === id)
    if (!profile) return
    applyToPreview(profile.override)
    setApplied(true)
    setTimeout(() => setApplied(false), 1800)
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left: controls */}
      <aside
        style={{ width }}
        className="relative shrink-0 flex flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
      >
        <LeftPanelTitleRow
          title={
            <div className="flex items-center gap-2">
              <Palette size={13} className="text-app-accent" />
              <span>Theme editor</span>
            </div>
          }
          rightSlot={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWcagAudit((v) => !v)}
                title="Toggle WCAG contrast audit"
                aria-pressed={showWcagAudit}
                className={cn(
                  'flex h-7 items-center gap-1 rounded-app-sm border px-2 text-[10px] font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg',
                  showWcagAudit
                    ? 'border-app-accent bg-app-accent text-app-on-accent'
                    : 'border-app-border bg-app-surface text-app-subtle hover:border-app-accent/30 hover:text-app-text',
                )}
              >
                <Eye size={10} />
                WCAG
              </button>
            </div>
          }
        />

        {/* Tab row */}
        <LeftPanelTabsRow className="px-2 bg-app-elevated/40" role="tablist" aria-label="Theme editor tabs">
          <ControlTabButton
            id="theme-tab-presets"
            controls="theme-panel-presets"
            active={controlTab === 'presets'}
            onClick={() => setControlTab('presets')}
            Icon={Compass}
            label="Harmony"
          />
          <ControlTabButton
            id="theme-tab-styles"
            controls="theme-panel-styles"
            active={controlTab === 'styles'}
            onClick={() => setControlTab('styles')}
            Icon={SlidersHorizontal}
            label="Geometry"
          />
          <ControlTabButton
            id="theme-tab-colors"
            controls="theme-panel-colors"
            active={controlTab === 'colors'}
            onClick={() => setControlTab('colors')}
            Icon={SlidersHorizontal}
            label="Tokens"
          />
          <ControlTabButton
            id="theme-tab-export"
            controls="theme-panel-export"
            active={controlTab === 'export'}
            onClick={() => setControlTab('export')}
            Icon={Download}
            label="Export"
          />
        </LeftPanelTabsRow>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto app-scroll px-4 py-6 flex flex-col gap-8">
          {/* WCAG Audit Overlay */}
          {showWcagAudit && (
            <WcagAuditPanel tokens={tokens} mode={mode} />
          )}

          {/* TAB 1: PRESETS & HARMONIES */}
          {controlTab === 'presets' && (
            <div id="theme-panel-presets" data-spotlight="theming-presets-panel" role="tabpanel" aria-labelledby="theme-tab-presets" className="flex flex-col gap-10">
              {/* Generator / Randomize */}
              <Group label="AI randomizer" hint="Dynamic brand-tinted HSL generator">
                <button
                  type="button"
                  onClick={() => {
                    setConfig((c) => ({
                      ...c,
                      presetId: 'random',
                      light: randomizeTokens(c.light, 'light'),
                      dark:  randomizeTokens(c.dark,  'dark'),
                    }))
                  }}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-app-sm bg-app-accent text-[11px] font-bold text-app-on-accent shadow-sm transition-colors duration-150 hover:bg-app-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg"
                >
                  <Shuffle size={11} />
                  Randomize Palette
                </button>
              </Group>

              {/* Color theory Harmonies */}
              <Group label="Color harmonies" hint="Mathematical color placement.">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'complementary', label: 'Complementary', desc: 'Stark opposite contrast' },
                    { type: 'triadic', label: 'Triadic', desc: 'Cohesive 120° offsets' },
                    { type: 'analogous', label: 'Analogous', desc: 'Grounded neighboring HSL' },
                    { type: 'split-complementary', label: 'Split-Comp.', desc: 'High-end soft contrast' },
                    { type: 'tetradic', label: 'Tetradic', desc: 'Double complementary grid' },
                    { type: 'monochromatic', label: 'Monochrome Scale', desc: 'Same hue, distinct shading' },
                  ].map(({ type, label, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => applyHarmony(type as HarmonyType)}
                      title={desc}
                      className={cn(
                        'flex flex-col items-start gap-1.5 rounded-app-sm border p-3 text-left transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg',
                        config.presetId === `harmony-${type}`
                          ? 'border-app-accent bg-app-accent-subtle/50'
                          : 'border-app-border bg-app-elevated/20 hover:border-app-accent/40',
                      )}
                    >
                      <span className="text-[10.5px] font-bold text-app-text leading-snug">{label}</span>
                      <span className="text-[9px] text-app-subtle leading-snug">{desc}</span>
                    </button>
                  ))}
                </div>
              </Group>

              {/* Preset catalog */}
              <Group label="Presets" hint="Classic layout profiles.">
                <div className="grid grid-cols-3 gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const active = config.presetId === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        title={preset.description}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-app-sm border p-2 transition-colors duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg',
                          active
                            ? 'border-app-accent bg-app-accent-subtle'
                            : 'border-app-border bg-app-elevated/40 hover:border-app-accent/40',
                        )}
                      >
                        <span className="h-5 w-5 rounded-full ring-1 ring-app-border-strong" style={{ background: preset.swatch }} />
                        <span className="text-[9px] font-bold text-app-text truncate w-full text-center leading-tight">{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </Group>
            </div>
          )}

          {/* TAB 2: GLOBAL STYLES & GEOMETRY */}
          {controlTab === 'styles' && (
            <div id="theme-panel-styles" role="tabpanel" aria-labelledby="theme-tab-styles" className="flex flex-col gap-10">
              <Group label="Surface style" hint="Card borders & treatments.">
                <SegmentPicker value={config.surfaceStyle} options={['flat','glass','brutalist']}
                  onChange={(v) => setConfig((c) => ({ ...c, surfaceStyle: v as SurfaceStyle }))} />
              </Group>

              <Group label="Shadow style" hint="UI container depth controls.">
                <SegmentPicker value={config.shadowStyle} options={['none','soft','hard','glow','neon']}
                  onChange={(v) => setConfig((c) => ({ ...c, shadowStyle: v as ShadowStyle }))} />
              </Group>

              <Group label="Border radius" hint={`${config.radius.toFixed(2)} rem`}>
                <input type="range" min={0} max={1.5} step={0.05} value={config.radius}
                  onChange={(e) => setConfig((c) => ({ ...c, radius: parseFloat(e.target.value) }))}
                  className="w-full accent-app-accent" />
                <div className="flex justify-between text-[9px] text-app-subtle mt-1 font-mono">
                  <span>0px (Sharp)</span><span>0.5rem</span><span>1.5rem (Round)</span>
                </div>
              </Group>

              <Group label="Letter spacing" hint={`${config.letterSpacing.toFixed(3)} em`}>
                <input type="range" min={-0.05} max={0.15} step={0.005} value={config.letterSpacing}
                  onChange={(e) => setConfig((c) => ({ ...c, letterSpacing: parseFloat(e.target.value) }))}
                  className="w-full accent-app-accent" />
                <div className="flex justify-between text-[9px] text-app-subtle mt-1 font-mono">
                  <span>Tight</span><span>0</span><span>Spaced</span>
                </div>
              </Group>

              <Group label="Border width" hint={`${config.borderWidth ?? 1} px`}>
                <input type="range" min={0} max={6} step={1} value={config.borderWidth ?? 1}
                  onChange={(e) => setConfig((c) => ({ ...c, borderWidth: parseInt(e.target.value) }))}
                  className="w-full accent-app-accent" />
                <div className="flex justify-between text-[9px] text-app-subtle mt-1 font-mono">
                  <span>0px (None)</span><span>1px</span><span>6px (Thick)</span>
                </div>
              </Group>

              <Group label="Motion & transitions" hint="Tactile micro-motions.">
                <SegmentPicker value={config.motionStyle ?? 'smooth'} options={['none','smooth','spring','pulsing']}
                  onChange={(v) => setConfig((c) => ({ ...c, motionStyle: v as any }))} />
              </Group>

              <Group label="Typography fonts">
                <div className="flex flex-col gap-3">
                  <FontRow label="Sans" value={config.fontSans} options={SANS_FONTS}
                    onChange={(f) => handleFontChange('sans', f)} />
                  <FontRow label="Mono" value={config.fontMono} options={MONO_FONTS}
                    onChange={(f) => handleFontChange('mono', f)} />
                </div>
              </Group>
            </div>
          )}

          {/* TAB 3: COLOR TOKEN OVERRIDES */}
          {controlTab === 'colors' && (
            <div id="theme-panel-colors" role="tabpanel" aria-labelledby="theme-tab-colors" className="flex flex-col gap-10">
              {/* Calibration */}
              <Group label="Contrast calibration" hint={`${config.contrast.toFixed(2)}× separation`}>
                <input type="range" min={0.7} max={1.4} step={0.01} value={config.contrast}
                  onChange={(e) => setConfig((c) => ({ ...c, contrast: parseFloat(e.target.value) }))}
                  className="w-full accent-app-accent" />
                <div className="flex justify-between text-[9px] text-app-subtle mt-1 font-mono">
                  <span>Soft (0.7)</span><span>Normal (1.0)</span><span>High (1.4)</span>
                </div>
              </Group>

              <Group label="Global HSL shifts">
                <div className="flex flex-col gap-3">
                  <SliderRow label="Hue shift" value={config.transform.hueShift} min={-180} max={180} step={1} unit="°"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, hueShift: v } }))} />
                  <SliderRow label="Saturation" value={config.transform.satScale} min={0} max={2} step={0.05} unit="×"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, satScale: v } }))} />
                  <SliderRow label="Lightness" value={config.transform.lightScale} min={0.5} max={1.5} step={0.05} unit="×"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, lightScale: v } }))} />
                  {!isIdentityTransform(config.transform) && (
                    <button
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, transform: { hueShift: 0, satScale: 1, lightScale: 1 } }))}
                      className="mt-1 flex h-7 items-center justify-center gap-1 rounded-app-sm border border-app-border/40 bg-app-elevated/20 text-[10px] text-app-accent transition-colors duration-150 hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                    >
                      <Wand2 size={10} />
                      Clear HSL transforms
                    </button>
                  )}
                </div>
              </Group>

              {/* Token list */}
              {TOKEN_GROUPS.map((group) => (
                <Group key={group.label} label={group.label} hint={group.description}>
                  <div className="flex flex-col gap-2">
                    {group.tokens.map(({ key, label }) => (
                      <ColorRow key={key} label={label} value={rawTokens[key]}
                        onChange={(v) => setToken(key, v)} />
                    ))}
                  </div>
                </Group>
              ))}
            </div>
          )}

          {/* TAB 4: PROFILE MANAGE & EXPORTS */}
          {controlTab === 'export' && (
            <div id="theme-panel-export" role="tabpanel" aria-labelledby="theme-tab-export" className="flex flex-col gap-10">
              {/* Presets manager */}
              <Group label="Save active profile">
                {showSaveBox ? (
                  <div className="flex flex-col gap-2 p-2 rounded border border-app-border bg-app-elevated/20">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Custom profile name…"
                      value={saveInput}
                      onChange={(e) => setSaveInput(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-app-bg border border-app-accent text-[11px] text-app-text outline-none"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowSaveBox(false)}
                        className="h-7 rounded-app-sm border border-app-border px-2.5 text-[11px] text-app-muted transition-colors duration-150 hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="h-7 rounded-app-sm bg-app-accent px-3 text-[11px] font-bold text-app-on-accent transition-colors duration-150 hover:bg-app-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSaveBox(true)}
                    className="flex h-8 w-full items-center justify-center gap-1.5 rounded-app-sm border border-app-border text-[11px] text-app-muted transition-colors duration-150 hover:bg-app-elevated hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                  >
                    <BookmarkPlus size={11} />
                    Save active setup
                  </button>
                )}
              </Group>

              {/* Saved profiles list */}
              {savedProfiles.length > 0 && (
                <Group label="Saved profiles library">
                  <div className="flex flex-col gap-2">
                    {savedProfiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-1.5 h-7">
                        <button
                          type="button"
                          onClick={() => loadSavedProfile(p.id)}
                          className="flex h-7 flex-1 items-center gap-1.5 truncate rounded-app-sm border border-app-border bg-app-elevated px-2 text-left text-[11px] text-app-text transition-colors duration-150 hover:bg-app-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: p.override[p.override.mode].primary ?? '#888' }} />
                          {p.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProfile(p.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-app-sm border border-app-border text-app-subtle transition-colors duration-150 hover:bg-app-elevated hover:text-app-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                          title="Delete profile"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Group>
              )}

              {/* Code output */}
              <Group label="CSS export" hint="Ready for root DESIGN.md">
                <div className="relative">
                  <pre className="p-2 text-[9px] font-mono rounded bg-app-deep text-app-muted overflow-auto max-h-36 app-scroll border border-app-border">
                    {cssOutput}
                  </pre>
                  <button
                    type="button"
                    onClick={copyCss}
                    className="absolute right-1.5 top-1.5 flex h-7 items-center justify-center rounded-app-sm border border-app-border bg-app-surface/90 px-2 text-[9.5px] font-semibold text-app-text transition-colors duration-150 hover:border-app-accent hover:bg-app-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                  >
                    {copied ? <Check size={9} className="text-app-success mr-1" /> : <Copy size={9} className="mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </Group>

              {/* Reset to Preset */}
              <button
                type="button"
                onClick={resetMode}
                className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-app-sm border border-app-border text-[11px] text-app-muted transition-colors duration-150 hover:bg-app-elevated hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
              >
                <RotateCcw size={11} />
                Reset {mode} mode to preset
              </button>
            </div>
          )}
        </div>

        {/* Footer — Apply / Save / Copy */}
        <div className="shrink-0 px-4 py-4 border-t border-app-border bg-app-bg flex flex-col gap-3">
          {/* Apply to preview */}
          <button
            type="button"
            onClick={handleApplyToPreview}
            className={cn(
              'flex h-9 items-center justify-center gap-2 rounded-app-sm text-[11.5px] font-bold shadow-sm transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg',
              applied
                ? 'bg-app-success text-app-bg'
                : 'bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active',
            )}
          >
            {applied ? <Check size={12} /> : <Play size={12} />}
            {applied ? 'Applied to Preview!' : 'Apply to Preview'}
          </button>
        </div>

        {/* Resizer Handle */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
        />
      </aside>

      {/* Right: live preview */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-6 h-12 border-b border-app-border bg-app-surface">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-app-accent" />
            <p className="text-[12px] font-semibold text-app-text">Live preview</p>
            <span className="text-[10.5px] text-app-subtle">
              · {mode === 'light' ? 'Light' : 'Dark'} mode
            </span>
          </div>
          <div className="flex items-center gap-2">
            {previewOverride && (
              <span className="text-[10px] text-app-accent font-medium">
                ✓ Applied to preview
              </span>
            )}
            <span className="text-[10px] font-mono text-app-subtle">
              {config.presetId === 'custom' ? 'custom' :
                (THEME_PRESETS.find((p) => p.id === config.presetId)?.name ?? config.presetId)}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto app-scroll">
          <ThemingPreview
            tokens={tokens}
            radius={config.radius}
            fontSans={config.fontSans}
            fontMono={config.fontMono}
            mode={mode}
            surfaceStyle={config.surfaceStyle}
            shadowStyle={config.shadowStyle}
            letterSpacing={config.letterSpacing}
            contrast={config.contrast}
            borderWidth={config.borderWidth ?? 1}
            motionStyle={config.motionStyle ?? 'smooth'}
          />
        </div>
      </main>
    </div>
  )
}

// ─── Building blocks ─────────────────────────────────────────────────────────

function Group({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-app-subtle select-none">{label}</p>
        {hint ? <p className="text-[10px] text-app-subtle leading-snug">{hint}</p> : null}
      </div>
      {children}
    </section>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange(v: string): void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 flex-1 text-[11px] text-app-muted font-mono">
        <span className="h-4 w-4 rounded ring-1 ring-app-border-strong shrink-0" style={{ background: value }} />
        {label}
      </label>
      <div className="relative flex items-center gap-1">
        <input type="color" value={normalizeHex(value)} onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 rounded cursor-pointer bg-transparent border border-app-border p-0" style={{ appearance: 'none' }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-20 h-6 px-1.5 rounded-app-sm bg-app-bg border border-app-border text-[10.5px] font-mono text-app-text outline-none focus:border-app-accent" />
      </div>
    </div>
  )
}

function FontRow({ label, value, options, onChange }: {
  label:    string
  value:    string
  options:  { label: string; family: string }[]
  onChange: (family: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[11px] text-app-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-7 px-2 rounded-app-sm bg-app-bg border border-app-border text-[11px] text-app-text outline-none focus:border-app-accent"
      >
        {options.map((f) => (
          <option key={f.family} value={f.family}>{f.label}</option>
        ))}
      </select>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange(v: number): void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-[10.5px]">
        <span className="text-app-muted">{label}</span>
        <span className="font-mono text-app-subtle">{value.toFixed(unit === '°' ? 0 : 2)}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-app-accent" />
    </div>
  )
}

function SegmentPicker({ value, options, onChange }: { value: string; options: readonly string[]; onChange(v: string): void }) {
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-app-sm bg-app-elevated border border-app-border">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'flex-1 h-7 px-2 rounded-app-sm text-[10.5px] font-medium capitalize transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
              active
                ? 'bg-app-surface text-app-text border border-app-border'
                : 'text-app-subtle hover:text-app-text',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ControlTabButton({
  id,
  controls,
  active,
  onClick,
  Icon,
  label,
}: {
  id: string
  controls: string
  active: boolean
  onClick: () => void
  Icon: ComponentType<{ size?: number; className?: string }>
  label: string
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-controls={controls}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1 h-7 rounded-app-sm text-[11px] font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
        active
          ? 'bg-app-surface text-app-text border border-app-border'
          : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40',
      )}
    >
      <Icon size={11} className={active ? 'text-app-accent' : undefined} />
      {label}
    </button>
  )
}

function WcagAuditPanel({ tokens, mode: _mode }: { tokens: ThemeTokens; mode: Mode }) {
  const PAIRS: Array<{ label: string; fg: keyof ThemeTokens; bg: keyof ThemeTokens }> = [
    { label: 'Body text',          fg: 'foreground',        bg: 'background' },
    { label: 'Card text',          fg: 'cardForeground',    bg: 'card' },
    { label: 'Popover text',       fg: 'popoverForeground', bg: 'popover' },
    { label: 'Secondary text',     fg: 'secondaryForeground', bg: 'secondary' },
    { label: 'Muted text',         fg: 'mutedForeground',   bg: 'muted' },
    { label: 'Primary button',     fg: 'primaryForeground', bg: 'primary' },
    { label: 'Accent button',      fg: 'accentForeground',  bg: 'accent' },
    { label: 'Destructive button', fg: 'destructiveForeground', bg: 'destructive' },
    { label: 'Input text',         fg: 'foreground',        bg: 'input' },
  ]

  const allPass = PAIRS.every(({ fg, bg }) => {
    const ratio = getContrastRatio(tokens[fg], tokens[bg])
    return meetsWCAG(ratio, 'AA')
  })

  return (
    <div className={cn(
      'rounded-app-sm border p-4 flex flex-col gap-3',
      allPass ? 'border-app-success/50 bg-app-success/10' : 'border-app-warning/50 bg-app-warning/10',
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold text-app-text">WCAG contrast audit</span>
        <span className={cn(
          'text-[10px] font-bold font-mono',
          allPass ? 'text-app-success' : 'text-app-warning',
        )}>
          {allPass ? 'AA ✓ All pass' : 'FAIL — needs attention'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {PAIRS.map(({ label, fg, bg }) => {
          const ratio = getContrastRatio(tokens[fg], tokens[bg])
          const badge = contrastBadge(ratio)
          return (
            <div key={label} className="flex items-center gap-2 text-[10px]">
              <div className="flex items-center gap-1 w-28 shrink-0">
                <span className="h-2.5 w-2.5 rounded ring-1 ring-black/10 shrink-0" style={{ background: tokens[fg] }} />
                <span className="h-2.5 w-2.5 rounded ring-1 ring-black/10 shrink-0" style={{ background: tokens[bg] }} />
                <span className="text-app-muted ml-0.5 truncate">{label}</span>
              </div>
              <span className="font-mono text-app-subtle w-12 text-right">{ratio.toFixed(2)}:1</span>
              <span className={cn(
                'font-mono w-16 text-center rounded px-1',
                badge.pass ? 'text-app-success bg-app-success/10' : 'text-app-danger bg-app-danger/10 font-bold',
              )}>
                {badge.pass ? 'AA' : 'FAIL'}
              </span>
              <span className={cn(
                'font-mono w-16 text-center rounded px-1',
                meetsWCAG(ratio, 'AAA') ? 'text-app-success bg-app-success/10' : 'text-app-subtle',
              )}>
                {meetsWCAG(ratio, 'AAA') ? 'AAA' : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ModePill({ mode, setMode }: { mode: Mode; setMode(m: Mode): void }) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-app-sm bg-app-elevated border border-app-border">
      <button
        type="button"
        onClick={() => setMode('light')}
        className={cn(
          'flex items-center gap-1 h-7 px-2 rounded-app-sm text-[10px] font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
          mode === 'light' ? 'bg-app-surface text-app-text border border-app-border' : 'text-app-subtle hover:text-app-text',
        )}
      >
        <Sun size={10} /> Light
      </button>
      <button
        type="button"
        onClick={() => setMode('dark')}
        className={cn(
          'flex items-center gap-1 h-7 px-2 rounded-app-sm text-[10px] font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
          mode === 'dark' ? 'bg-app-surface text-app-text border border-app-border' : 'text-app-subtle hover:text-app-text',
        )}
      >
        <Moon size={10} /> Dark
      </button>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeHex(value: string): string {
  const m = value.trim().match(/^#([0-9a-f]{6})$/i)
  return m ? `#${m[1]}` : '#111827'
}
