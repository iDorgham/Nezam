'use client'

import { useMemo, useState } from 'react'
import {
  Sun, Moon, Copy, Check, RotateCcw, Sparkles, Palette, Shuffle,
  Wand2, Play, BookmarkPlus, Trash2, Sliders, Settings, SlidersHorizontal,
  Download, Layers, Compass, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
  const [config, setConfig] = useState<ThemeConfig>(() => configFromPreset(THEME_PRESETS[0]))
  const [mode,   setMode]   = useState<Mode>('light')
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
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 h-12 border-b border-app-border">
          <div className="flex items-center gap-2">
            <Palette size={13} className="text-app-accent" />
            <p className="text-[12px] font-semibold text-app-text">Theme Editor</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWcagAudit((v) => !v)}
              className={cn(
                'flex items-center gap-1 h-6 px-2 rounded text-[10px] font-medium transition-colors border',
                showWcagAudit
                  ? 'bg-app-accent text-app-on-accent border-app-accent'
                  : 'text-app-subtle hover:text-app-text border-transparent hover:border-app-border',
              )}
            >
              <Eye size={10} />
              WCAG
            </button>
            <ModePill mode={mode} setMode={setMode} />
          </div>
        </div>

        {/* Tab row */}
        <div className="shrink-0 flex items-center justify-between border-b border-app-border bg-app-elevated/40 p-1 gap-1">
          <button
            onClick={() => setControlTab('presets')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 rounded text-[10px] font-semibold transition-all',
              controlTab === 'presets' ? 'bg-app-surface text-app-accent shadow-sm' : 'text-app-subtle hover:text-app-text'
            )}
          >
            <Compass size={13} className="mb-0.5" />
            Harmony
          </button>
          <button
            onClick={() => setControlTab('styles')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 rounded text-[10px] font-semibold transition-all',
              controlTab === 'styles' ? 'bg-app-surface text-app-accent shadow-sm' : 'text-app-subtle hover:text-app-text'
            )}
          >
            <Sliders size={13} className="mb-0.5" />
            Geometry
          </button>
          <button
            onClick={() => setControlTab('colors')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 rounded text-[10px] font-semibold transition-all',
              controlTab === 'colors' ? 'bg-app-surface text-app-accent shadow-sm' : 'text-app-subtle hover:text-app-text'
            )}
          >
            <SlidersHorizontal size={13} className="mb-0.5" />
            Tokens
          </button>
          <button
            onClick={() => setControlTab('export')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 rounded text-[10px] font-semibold transition-all',
              controlTab === 'export' ? 'bg-app-surface text-app-accent shadow-sm' : 'text-app-subtle hover:text-app-text'
            )}
          >
            <Download size={13} className="mb-0.5" />
            Export
          </button>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto app-scroll p-4 flex flex-col gap-5">
          {/* WCAG Audit Overlay */}
          {showWcagAudit && (
            <WcagAuditPanel tokens={tokens} mode={mode} />
          )}

          {/* TAB 1: PRESETS & HARMONIES */}
          {controlTab === 'presets' && (
            <>
              {/* Generator / Randomize */}
              <Group label="AI Randomizer" hint="Dynamic brand-tinted HSL generator">
                <button
                  onClick={() => {
                    setConfig((c) => ({
                      ...c,
                      presetId: 'random',
                      light: randomizeTokens(c.light, 'light'),
                      dark:  randomizeTokens(c.dark,  'dark'),
                    }))
                  }}
                  className="flex items-center justify-center gap-1.5 w-full h-8 rounded bg-app-accent text-[11px] font-bold text-app-on-accent hover:bg-app-accent-hover transition-colors shadow-sm"
                >
                  <Shuffle size={11} />
                  Randomize Palette
                </button>
              </Group>

              {/* Color theory Harmonies */}
              <Group label="Color theory harmonies" hint="Mathematical color placement.">
                <div className="grid grid-cols-2 gap-2">
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
                      onClick={() => applyHarmony(type as HarmonyType)}
                      title={desc}
                      className={cn(
                        'flex flex-col items-start p-2 rounded border text-left transition-all',
                        config.presetId === `harmony-${type}`
                          ? 'border-app-accent bg-app-accent-subtle/50'
                          : 'border-app-border hover:border-app-border-strong bg-app-elevated/20',
                      )}
                    >
                      <span className="text-[10.5px] font-bold text-app-text">{label}</span>
                      <span className="text-[9px] text-app-subtle mt-0.5 leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </Group>

              {/* Preset catalog */}
              <Group label="Theme Presets" hint="Classic layout profiles.">
                <div className="grid grid-cols-3 gap-1.5">
                  {THEME_PRESETS.map((preset) => {
                    const active = config.presetId === preset.id
                    return (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        title={preset.description}
                        className={cn(
                          'flex flex-col items-center gap-1 p-1.5 rounded border transition-all duration-100',
                          active
                            ? 'border-app-accent bg-app-accent-subtle'
                            : 'border-app-border hover:border-app-border-strong bg-app-elevated/40',
                        )}
                      >
                        <span className="h-4 w-4 rounded-full ring-1 ring-app-border-strong" style={{ background: preset.swatch }} />
                        <span className="text-[9px] font-bold text-app-text truncate w-full text-center">{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </Group>
            </>
          )}

          {/* TAB 2: GLOBAL STYLES & GEOMETRY */}
          {controlTab === 'styles' && (
            <>
              <Group label="Surface style" hint="Card borders & treatments.">
                <SegmentPicker value={config.surfaceStyle} options={['flat','glass','brutalist']}
                  onChange={(v) => setConfig((c) => ({ ...c, surfaceStyle: v as SurfaceStyle }))} />
              </Group>

              <Group label="Shadow style" hint="UI container depth controls.">
                <SegmentPicker value={config.shadowStyle} options={['none','soft','hard','glow','neon']}
                  onChange={(v) => setConfig((c) => ({ ...c, shadowStyle: v as ShadowStyle }))} />
              </Group>

              <Group label="Border Radius" hint={`${config.radius.toFixed(2)} rem`}>
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

              <Group label="Typography Fonts">
                <div className="flex flex-col gap-2">
                  <FontRow label="Sans" value={config.fontSans} options={SANS_FONTS}
                    onChange={(f) => handleFontChange('sans', f)} />
                  <FontRow label="Mono" value={config.fontMono} options={MONO_FONTS}
                    onChange={(f) => handleFontChange('mono', f)} />
                </div>
              </Group>
            </>
          )}

          {/* TAB 3: COLOR TOKEN OVERRIDES */}
          {controlTab === 'colors' && (
            <>
              {/* Calibration */}
              <Group label="Contrast Calibration" hint={`${config.contrast.toFixed(2)}× separation`}>
                <input type="range" min={0.7} max={1.4} step={0.01} value={config.contrast}
                  onChange={(e) => setConfig((c) => ({ ...c, contrast: parseFloat(e.target.value) }))}
                  className="w-full accent-app-accent" />
                <div className="flex justify-between text-[9px] text-app-subtle mt-1 font-mono">
                  <span>Soft (0.7)</span><span>Normal (1.0)</span><span>High (1.4)</span>
                </div>
              </Group>

              <Group label="Global HSL Shifts">
                <div className="flex flex-col gap-2">
                  <SliderRow label="Hue shift" value={config.transform.hueShift} min={-180} max={180} step={1} unit="°"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, hueShift: v } }))} />
                  <SliderRow label="Saturation" value={config.transform.satScale} min={0} max={2} step={0.05} unit="×"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, satScale: v } }))} />
                  <SliderRow label="Lightness" value={config.transform.lightScale} min={0.5} max={1.5} step={0.05} unit="×"
                    onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, lightScale: v } }))} />
                  {!isIdentityTransform(config.transform) && (
                    <button
                      onClick={() => setConfig((c) => ({ ...c, transform: { hueShift: 0, satScale: 1, lightScale: 1 } }))}
                      className="flex items-center justify-center gap-1 h-6 rounded text-[10px] text-app-accent hover:text-app-text transition-colors mt-1 border border-app-border/40 bg-app-elevated/20"
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
                  <div className="flex flex-col gap-1.5">
                    {group.tokens.map(({ key, label }) => (
                      <ColorRow key={key} label={label} value={rawTokens[key]}
                        onChange={(v) => setToken(key, v)} />
                    ))}
                  </div>
                </Group>
              ))}
            </>
          )}

          {/* TAB 4: PROFILE MANAGE & EXPORTS */}
          {controlTab === 'export' && (
            <>
              {/* Presets manager */}
              <Group label="Save Active Profile">
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
                      <button onClick={() => setShowSaveBox(false)}
                        className="h-7 px-2.5 rounded border border-app-border text-[11px] text-app-muted hover:text-app-text transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveProfile}
                        className="h-7 px-3 rounded bg-app-accent text-app-on-accent text-[11px] font-bold hover:bg-app-accent-hover transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSaveBox(true)}
                    className="flex items-center justify-center gap-1.5 w-full h-8 rounded border border-app-border text-[11px] text-app-muted hover:text-app-text hover:bg-app-elevated transition-all"
                  >
                    <BookmarkPlus size={11} />
                    Save active setup
                  </button>
                )}
              </Group>

              {/* Saved profiles list */}
              {savedProfiles.length > 0 && (
                <Group label="Saved profiles library">
                  <div className="flex flex-col gap-1.5">
                    {savedProfiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-1.5 h-7">
                        <button
                          onClick={() => loadSavedProfile(p.id)}
                          className="flex-1 flex items-center gap-1.5 h-7 px-2 rounded text-[11px] text-app-text bg-app-elevated hover:bg-app-surface border border-app-border transition-colors truncate text-left"
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: p.override[p.override.mode].primary ?? '#888' }} />
                          {p.name}
                        </button>
                        <button onClick={() => deleteProfile(p.id)}
                          className="flex items-center justify-center h-7 w-7 rounded text-app-subtle hover:text-app-danger hover:bg-app-elevated border border-app-border transition-colors"
                          title="Delete profile">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Group>
              )}

              {/* Code output */}
              <Group label="CSS Code Export" hint="Ready for root DESIGN.md">
                <div className="relative">
                  <pre className="p-2 text-[9px] font-mono rounded bg-app-deep text-app-muted overflow-auto max-h-36 app-scroll border border-app-border">
                    {cssOutput}
                  </pre>
                  <button
                    onClick={copyCss}
                    className="absolute top-1.5 right-1.5 flex items-center justify-center h-6 px-2 rounded bg-app-surface/90 border border-app-border text-[9.5px] font-semibold text-app-text hover:border-app-accent hover:bg-app-surface transition-all"
                  >
                    {copied ? <Check size={9} className="text-app-success mr-1" /> : <Copy size={9} className="mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </Group>

              {/* Reset to Preset */}
              <button
                onClick={resetMode}
                className="flex items-center justify-center gap-1.5 w-full h-8 rounded border border-app-border text-[11px] text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors mt-2"
              >
                <RotateCcw size={11} />
                Reset {mode} mode to preset
              </button>
            </>
          )}
        </div>

        {/* Footer — Apply / Save / Copy */}
        <div className="shrink-0 p-3 border-t border-app-border bg-app-bg flex flex-col gap-2">
          {/* Apply to preview */}
          <button
            onClick={handleApplyToPreview}
            className={cn(
              'flex items-center justify-center gap-1.5 h-8 rounded text-[11.5px] font-bold transition-all shadow-sm',
              applied
                ? 'bg-app-success text-white'
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

function Group({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[10.5px] font-semibold text-app-text uppercase tracking-wider">{label}</p>
        {hint && <p className="text-[10px] text-app-subtle">{hint}</p>}
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
    <div className="flex flex-col gap-1">
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
    <div className="flex items-center gap-0.5 p-0.5 rounded-app-sm bg-app-elevated border border-app-border">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={cn(
              'flex-1 h-6 px-1.5 rounded text-[10.5px] font-medium capitalize transition-colors duration-100',
              active ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text',
            )}>
            {opt}
          </button>
        )
      })}
    </div>
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
      'rounded border p-3 flex flex-col gap-2',
      allPass ? 'border-green-500/50 bg-green-50/10' : 'border-amber-500/50 bg-amber-50/10',
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold text-app-text">WCAG Contrast Audit</span>
        <span className={cn(
          'text-[10px] font-bold font-mono',
          allPass ? 'text-green-600' : 'text-amber-600',
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
                badge.pass ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10 font-bold',
              )}>
                {badge.pass ? 'AA' : 'FAIL'}
              </span>
              <span className={cn(
                'font-mono w-16 text-center rounded px-1',
                meetsWCAG(ratio, 'AAA') ? 'text-green-600 bg-green-500/10' : 'text-app-subtle',
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
      <button onClick={() => setMode('light')}
        className={cn('flex items-center gap-1 h-5 px-1.5 rounded text-[10px] font-medium transition-colors duration-100',
          mode === 'light' ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text')}>
        <Sun size={10} /> Light
      </button>
      <button onClick={() => setMode('dark')}
        className={cn('flex items-center gap-1 h-5 px-1.5 rounded text-[10px] font-medium transition-colors duration-100',
          mode === 'dark' ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text')}>
        <Moon size={10} /> Dark
      </button>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeHex(value: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(value.trim())
  return m ? `#${m[1]}` : '#111827'
}
