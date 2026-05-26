'use client'

import { useMemo, useState } from 'react'
import {
  Sun, Moon, Copy, Check, RotateCcw, Sparkles, Palette, Shuffle,
  Wand2, Play, BookmarkPlus, Trash2, ChevronDown,
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
  type ColorTransform,
} from './color-utils'
import { useHub, type ThemePreviewOverride } from '@/store/hub.store'

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

/** Apply a color transform to every token (no-op if identity). */
function applyTransform(tokens: ThemeTokens, t: ColorTransform): ThemeTokens {
  if (isIdentityTransform(t)) return tokens
  const out = { ...tokens }
  ;(Object.keys(out) as Array<keyof ThemeTokens>).forEach((k) => {
    out[k] = transformColor(out[k], t)
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
  }
}

/** Randomize the palette using real color-theory harmony. */
function randomizeTokens(base: ThemeTokens, mode: Mode): ThemeTokens {
  const palette = generateHarmoniousPalette()
  const isDark  = mode === 'dark'
  return {
    ...base,
    primary:           palette.primary,
    primaryForeground: isDark ? '#0a0a0a' : '#ffffff',
    accent:            palette.accent,
    accentForeground:  isDark ? '#0a0a0a' : '#ffffff',
    secondary:         isDark ? base.secondary : palette.secondary,
    secondaryForeground: base.secondaryForeground,
    ring:    palette.primary,
    chart1:  palette.charts[0],
    chart2:  palette.charts[1],
    chart3:  palette.charts[2],
    chart4:  palette.charts[3],
    chart5:  palette.charts[4],
    muted:   isDark ? base.muted : randomSoftHex(0.96),
  }
}

// ─── Build the ThemePreviewOverride from current config ───────────────────────

function buildOverride(config: ThemeConfig, mode: Mode, presetName: string): ThemePreviewOverride {
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
    light:     buildVars(config.light),
    dark:      buildVars(config.dark),
    mode,
    fontSans:  config.fontSans,
    fontMono:  config.fontMono,
    radius:    `${config.radius}rem`,
    presetName,
  }
}

// ─── CSS export ───────────────────────────────────────────────────────────────

function buildCss(config: ThemeConfig): string {
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
    block(config.light),
    `}`,
    ``,
    `.dark {`,
    block(config.dark),
    `}`,
  ].join('\n')
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ThemingSection() {
  const [config, setConfig] = useState<ThemeConfig>(() => configFromPreset(THEME_PRESETS[0]))
  const [mode,   setMode]   = useState<Mode>('light')
  const [copied, setCopied] = useState(false)
  const [saveInput, setSaveInput]   = useState('')
  const [showSaveBox, setShowSaveBox] = useState(false)
  const [applied, setApplied] = useState(false)

  const applyToPreview    = useHub((s) => s.themeApplyToPreview)
  const saveProfile       = useHub((s) => s.themeSaveProfile)
  const deleteProfile     = useHub((s) => s.themeDeleteProfile)
  const savedProfiles     = useHub((s) => s.theme.savedProfiles)
  const previewOverride   = useHub((s) => s.theme.previewOverride)

  const rawTokens = config[mode]
  const tokens    = useMemo(() => applyTransform(rawTokens, config.transform), [rawTokens, config.transform])

  const cssOutput = useMemo(() => buildCss(config), [config])

  function applyPreset(preset: ThemePreset) {
    setConfig((c) => ({
      ...c,
      presetId: preset.id,
      light: { ...preset.light },
      dark:  { ...preset.dark },
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
    const name = config.presetId === 'custom' ? 'Custom' :
      (THEME_PRESETS.find((p) => p.id === config.presetId)?.name ?? config.presetId)
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
      <aside className="shrink-0 w-[360px] flex flex-col border-r border-app-border bg-app-surface overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 h-12 border-b border-app-border">
          <div className="flex items-center gap-2">
            <Palette size={13} className="text-app-accent" />
            <p className="text-[12px] font-semibold text-app-text">Theme Editor</p>
          </div>
          <ModePill mode={mode} setMode={setMode} />
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto app-scroll p-4 flex flex-col gap-5">

          {/* Presets */}
          <Group label="Presets" hint="Start from a preset, then customize.">
            <div className="grid grid-cols-4 gap-2">
              {THEME_PRESETS.map((preset) => {
                const active = config.presetId === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    title={preset.description}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-app-sm border transition-colors duration-100',
                      active
                        ? 'border-app-accent bg-app-accent-subtle'
                        : 'border-app-border hover:border-app-border-strong bg-app-elevated/40',
                    )}
                  >
                    <span className="h-5 w-5 rounded-full ring-1 ring-app-border-strong" style={{ background: preset.swatch }} />
                    <span className="text-[10px] font-medium text-app-text truncate w-full text-center">{preset.name}</span>
                  </button>
                )
              })}
            </div>
          </Group>

          {/* Radius */}
          <Group label="Radius" hint={`${config.radius.toFixed(2)} rem`}>
            <input type="range" min={0} max={1.5} step={0.05} value={config.radius}
              onChange={(e) => setConfig((c) => ({ ...c, radius: parseFloat(e.target.value) }))}
              className="w-full accent-app-accent" />
            <div className="flex justify-between text-[9.5px] text-app-subtle mt-1 font-mono">
              <span>0</span><span>0.5</span><span>1</span><span>1.5</span>
            </div>
          </Group>

          {/* Contrast */}
          <Group label="Contrast" hint={`${config.contrast.toFixed(2)}×`}>
            <input type="range" min={0.7} max={1.4} step={0.01} value={config.contrast}
              onChange={(e) => setConfig((c) => ({ ...c, contrast: parseFloat(e.target.value) }))}
              className="w-full accent-app-accent" />
            <div className="flex justify-between text-[9.5px] text-app-subtle mt-1 font-mono">
              <span>low</span><span>normal</span><span>high</span>
            </div>
          </Group>

          {/* Fonts */}
          <Group label="Fonts">
            <div className="flex flex-col gap-2">
              <FontRow label="Sans" value={config.fontSans} options={SANS_FONTS}
                onChange={(f) => handleFontChange('sans', f)} />
              <FontRow label="Mono" value={config.fontMono} options={MONO_FONTS}
                onChange={(f) => handleFontChange('mono', f)} />
            </div>
          </Group>

          {/* Generator */}
          <Group label="Generator" hint="Color-theory harmony + global transforms.">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setConfig((c) => ({
                    ...c,
                    presetId: 'random',
                    light: randomizeTokens(c.light, 'light'),
                    dark:  randomizeTokens(c.dark,  'dark'),
                  }))
                }}
                className="flex items-center justify-center gap-1.5 h-8 rounded-app-sm bg-app-elevated border border-app-border text-[11.5px] font-semibold text-app-text hover:border-app-accent transition-colors"
              >
                <Shuffle size={11} />
                Randomize palette
              </button>

              <SliderRow label="Hue shift" value={config.transform.hueShift} min={-180} max={180} step={1} unit="°"
                onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, hueShift: v } }))} />
              <SliderRow label="Saturation" value={config.transform.satScale} min={0} max={2} step={0.05} unit="×"
                onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, satScale: v } }))} />
              <SliderRow label="Lightness" value={config.transform.lightScale} min={0.5} max={1.5} step={0.05} unit="×"
                onChange={(v) => setConfig((c) => ({ ...c, transform: { ...c.transform, lightScale: v } }))} />
              {!isIdentityTransform(config.transform) && (
                <button
                  onClick={() => setConfig((c) => ({ ...c, transform: { hueShift: 0, satScale: 1, lightScale: 1 } }))}
                  className="flex items-center justify-center gap-1 h-6 rounded-app-sm text-[10.5px] text-app-subtle hover:text-app-text transition-colors"
                >
                  <Wand2 size={10} />
                  Clear transforms
                </button>
              )}
            </div>
          </Group>

          {/* Surface + Shadow */}
          <Group label="Surface style" hint="Card backgrounds and borders.">
            <SegmentPicker value={config.surfaceStyle} options={['flat','glass','brutalist']}
              onChange={(v) => setConfig((c) => ({ ...c, surfaceStyle: v as SurfaceStyle }))} />
          </Group>
          <Group label="Shadow style" hint="Card / button elevation feel.">
            <SegmentPicker value={config.shadowStyle} options={['none','soft','hard','glow','neon']}
              onChange={(v) => setConfig((c) => ({ ...c, shadowStyle: v as ShadowStyle }))} />
          </Group>

          <Group label="Letter spacing" hint={`${config.letterSpacing.toFixed(2)} em`}>
            <input type="range" min={-0.05} max={0.15} step={0.005} value={config.letterSpacing}
              onChange={(e) => setConfig((c) => ({ ...c, letterSpacing: parseFloat(e.target.value) }))}
              className="w-full accent-app-accent" />
          </Group>

          {/* Token groups */}
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

          {/* Saved profiles */}
          {savedProfiles.length > 0 && (
            <Group label="Saved profiles">
              <div className="flex flex-col gap-1">
                {savedProfiles.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 h-7">
                    <button
                      onClick={() => loadSavedProfile(p.id)}
                      className="flex-1 flex items-center gap-1.5 h-7 px-2 rounded-app-sm text-[11px] text-app-text bg-app-elevated hover:bg-app-surface border border-app-border transition-colors truncate text-left"
                    >
                      <span className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: p.override[p.override.mode].primary ?? '#888' }} />
                      {p.name}
                    </button>
                    <button onClick={() => deleteProfile(p.id)}
                      className="flex items-center justify-center h-7 w-7 rounded-app-sm text-app-subtle hover:text-app-danger hover:bg-app-elevated border border-app-border transition-colors"
                      title="Delete profile">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </Group>
          )}

          {/* Reset */}
          <button
            onClick={resetMode}
            className="flex items-center justify-center gap-1.5 h-7 rounded-app-sm border border-app-border text-[11px] text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors"
          >
            <RotateCcw size={11} />
            Reset {mode} mode to preset
          </button>
        </div>

        {/* Footer — Apply / Save / Copy */}
        <div className="shrink-0 p-3 border-t border-app-border bg-app-bg flex flex-col gap-2">
          {/* Apply to preview */}
          <button
            onClick={handleApplyToPreview}
            className={cn(
              'flex items-center justify-center gap-1.5 h-8 rounded-app-sm text-[11.5px] font-semibold transition-colors',
              applied
                ? 'bg-app-success text-white'
                : 'bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active',
            )}
          >
            {applied ? <Check size={12} /> : <Play size={12} />}
            {applied ? 'Applied to Preview!' : 'Apply to Preview'}
          </button>

          <div className="flex items-center gap-2">
            {/* Save as color profile */}
            {showSaveBox ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Profile name…"
                  value={saveInput}
                  onChange={(e) => setSaveInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveProfile()
                    if (e.key === 'Escape') setShowSaveBox(false)
                  }}
                  className="flex-1 h-7 px-2 rounded-app-sm bg-app-elevated border border-app-accent text-[11px] text-app-text outline-none"
                />
                <button onClick={handleSaveProfile}
                  className="flex items-center justify-center h-7 px-2 rounded-app-sm bg-app-elevated border border-app-border text-[11px] font-semibold text-app-text hover:bg-app-surface transition-colors">
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveBox(true)}
                className="flex items-center justify-center gap-1.5 flex-1 h-7 rounded-app-sm border border-app-border text-[11px] text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors"
              >
                <BookmarkPlus size={11} />
                Save as color profile
              </button>
            )}

            {/* Copy CSS */}
            <button
              onClick={copyCss}
              title="Copy CSS"
              className="flex items-center justify-center h-7 w-8 rounded-app-sm border border-app-border text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors"
            >
              {copied ? <Check size={12} className="text-app-success" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
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
  return m ? `#${m[1]}` : '#000000'
}
