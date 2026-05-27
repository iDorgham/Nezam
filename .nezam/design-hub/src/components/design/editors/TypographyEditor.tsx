'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Type, Sparkles, Sliders, CheckCircle, RefreshCw, Layers, AlignLeft, Bold } from 'lucide-react'

const POPULAR_FONTS = [
  'Inter', 'Geist', 'Manrope', 'Sora', 'Plus Jakarta Sans',
  'IBM Plex Sans', 'Outfit', 'Lato',
]

const DISPLAY_FONTS = [
  'Sora', 'Cabinet Grotesk', 'Clash Display', 'Satoshi',
  'Playfair Display', 'Cormorant', 'Fraunces',
]

const MONO_FONTS = [
  'JetBrains Mono', 'Geist Mono', 'Fira Code', 'IBM Plex Mono',
]

const SCALE_STEPS = ['xs','sm','base','lg','xl','2xl','3xl','4xl'] as const

const MODULAR_RATIOS = [
  { value: 1.125, name: 'Major Second (1.125)' },
  { value: 1.200, name: 'Minor Third (1.200)' },
  { value: 1.250, name: 'Major Third (1.250)' },
  { value: 1.333, name: 'Perfect Fourth (1.333)' },
  { value: 1.618, name: 'Golden Ratio (1.618)' },
] as const

function FontSelector({ label, value, options, path }: {
  label: string; value: string; options: string[]; path: string
}) {
  const setToken = useHub((s) => s.designSetToken)
  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <label className="text-[11px] text-app-muted font-bold uppercase tracking-wider block mb-3">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {options.map((font) => (
          <button
            key={font}
            onClick={() => setToken(path, font + ', system-ui, sans-serif')}
            className={`h-7 px-3 rounded-lg border text-xs transition-all font-semibold ${
              value.startsWith(font)
                ? 'border-app-accent bg-app-accent/10 text-app-accent'
                : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text bg-app-elevated/30'
            }`}
            style={{ fontFamily: font }}
          >
            {font}
          </button>
        ))}
      </div>
      {/* Preview */}
      <div
        className="rounded-xl bg-app-elevated border border-app-border/50 p-4 relative overflow-hidden transition-all duration-300"
        style={{ fontFamily: value }}
      >
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Type Preview</span>
        <p className="text-base font-bold text-app-text">المصرية Masri: The quick brown fox jumps.</p>
        <p className="text-xs text-app-muted mt-1 opacity-80">0123456789 AaBbCcDd @#$%</p>
      </div>
    </div>
  )
}

function TypeScalePreview() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const { scale, sans } = tokens.typography

  const [activeRatio, setActiveRatio] = useState<number>(1.250)

  function applyModularScale() {
    let currentBase = 16 // 1rem
    const newScale: Record<string, string> = {}
    
    // Calculate proportions down and up from base
    const xsSize = currentBase / activeRatio
    const smSize = currentBase / Math.sqrt(activeRatio)
    
    setToken('typography.scale.xs.size', `${(xsSize / 16).toFixed(3)}rem`)
    setToken('typography.scale.sm.size', `${(smSize / 16).toFixed(3)}rem`)
    setToken('typography.scale.base.size', '1rem')
    
    let size = currentBase
    ;(['lg','xl','2xl','3xl','4xl'] as const).forEach(step => {
      size = size * activeRatio
      setToken(`typography.scale.${step}.size`, `${(size / 16).toFixed(3)}rem`)
    })
  }

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">Typography Scales Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeRatio}
            onChange={(e) => setActiveRatio(Number(e.target.value))}
            className="h-7 rounded-lg border border-app-border bg-app-elevated text-[11px] text-app-muted px-2 cursor-pointer focus:outline-none focus:border-app-accent font-semibold"
          >
            {MODULAR_RATIOS.map(r => (
              <option key={r.value} value={r.value}>{r.name}</option>
            ))}
          </select>
          <button
            onClick={applyModularScale}
            className="flex items-center gap-1 bg-app-accent hover:bg-app-accent-hover text-white text-xs font-semibold px-3 h-7 rounded-lg shadow-sm active:scale-95 transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Apply Modular Scale
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-app-border bg-app-elevated overflow-hidden shadow-inner">
        <div className="grid grid-cols-[80px_100px_1fr] text-[10px] text-app-muted font-bold uppercase tracking-wider px-4 py-2.5 border-b border-app-border bg-app-elevated/60">
          <span>Step</span>
          <span>FontSize</span>
          <span>Live Proportions Preview</span>
        </div>
        {SCALE_STEPS.map((step) => {
          const s = scale[step]
          return (
            <div key={step} className="grid grid-cols-[80px_100px_1fr] items-center px-4 py-3 border-b border-app-border last:border-0 hover:bg-app-inset/40 transition-colors">
              <span className="text-xs font-bold font-mono text-app-text uppercase">{step}</span>
              <input
                type="text"
                value={s.size}
                onChange={(e) => setToken(`typography.scale.${step}.size`, e.target.value)}
                className="w-16 h-6 bg-app-inset rounded-lg border border-app-border text-center text-xs font-mono text-app-accent focus:outline-none focus:border-app-accent font-semibold"
              />
              <span
                className="text-app-text truncate leading-none ml-2"
                style={{ fontSize: s.size, fontFamily: sans, lineHeight: s.lineHeight }}
              >
                Typography Heading Rhythm
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeightsPreview() {
  const tokens   = useHub((s) => s.design.tokens)
  const { sans } = tokens.typography
  const weights  = [400, 500, 600, 700]

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bold className="h-4 w-4 text-app-accent" />
        <h3 className="text-xs font-semibold text-app-text">Typographic Weights Scale</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {weights.map((w) => (
          <div key={w} className="rounded-xl border border-app-border bg-app-elevated/50 p-4 text-center transition-all hover:scale-[1.02] hover:bg-app-elevated">
            <p
              className="text-2xl text-app-text font-bold"
              style={{ fontFamily: sans, fontWeight: w }}
            >
              Aa
            </p>
            <p className="text-[10px] text-app-subtle mt-2 font-mono font-semibold uppercase tracking-wider">{w} Weight</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TypographyEditor() {
  const tokens = useHub((s) => s.design.tokens)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Type className="h-5 w-5 text-app-accent" />
            Typography Studio
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Fine-tune family definitions, generate modular scale steps, and balance text weight hierarchies</p>
        </div>
      </div>

      <FontSelector
        label="Sans-serif Body Font Family"
        value={tokens.typography.sans}
        options={POPULAR_FONTS}
        path="typography.sans"
      />

      <FontSelector
        label="Display Headings Font Family"
        value={tokens.typography.display}
        options={DISPLAY_FONTS}
        path="typography.display"
      />

      <FontSelector
        label="Monospace Coding Font Family"
        value={tokens.typography.mono}
        options={MONO_FONTS}
        path="typography.mono"
      />

      <div className="h-px bg-app-border/40" />
      <TypeScalePreview />

      <div className="h-px bg-app-border/40" />
      <WeightsPreview />
    </div>
  )
}

