'use client'

import { useHub } from '@/store/hub.store'

const POPULAR_FONTS = [
  'Inter', 'Geist', 'Manrope', 'Sora', 'Plus Jakarta Sans',
  'IBM Plex Sans', 'DM Sans', 'Outfit', 'Nunito', 'Lato',
  'Roboto', 'Open Sans', 'Source Sans 3', 'Figtree', 'Raleway',
]

const DISPLAY_FONTS = [
  'Sora', 'Cabinet Grotesk', 'Clash Display', 'Satoshi', 'General Sans',
  'Playfair Display', 'Cormorant', 'DM Serif Display', 'Fraunces',
]

const MONO_FONTS = [
  'JetBrains Mono', 'Geist Mono', 'Fira Code', 'Cascadia Code', 'IBM Plex Mono', 'Roboto Mono',
]

const SCALE_STEPS = ['xs','sm','base','lg','xl','2xl','3xl','4xl'] as const

function FontSelector({ label, value, options, path }: {
  label: string; value: string; options: string[]; path: string
}) {
  const setToken = useHub((s) => s.designSetToken)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map((font) => (
          <button
            key={font}
            onClick={() => setToken(path, font + ', system-ui, sans-serif')}
            className={[
              'h-7 px-2.5 rounded-app-sm border text-xs transition-all',
              value.startsWith(font)
                ? 'border-app-accent bg-app-accent-subtle text-app-text font-medium'
                : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
            ].join(' ')}
            style={{ fontFamily: font }}
          >
            {font}
          </button>
        ))}
      </div>
      {/* Preview */}
      <div
        className="mt-1 rounded-app-sm bg-app-inset border border-app-border p-3"
        style={{ fontFamily: value }}
      >
        <p className="text-lg font-bold text-app-text">The quick brown fox jumps</p>
        <p className="text-sm text-app-muted mt-1">0123456789 AaBbCcDd @#$%</p>
      </div>
    </div>
  )
}

function TypeScalePreview() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const { scale, sans } = tokens.typography

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-app-text">Type Scale</h3>
      <div className="rounded-app-sm border border-app-border overflow-hidden">
        <div className="grid grid-cols-[60px_60px_1fr] text-[10px] text-app-muted font-medium uppercase tracking-wide px-3 py-1.5 border-b border-app-border bg-app-elevated">
          <span>Step</span>
          <span>Size</span>
          <span>Preview</span>
        </div>
        {SCALE_STEPS.map((step) => {
          const s = scale[step]
          return (
            <div key={step} className="grid grid-cols-[60px_60px_1fr] items-center px-3 py-2 border-b border-app-border last:border-0 hover:bg-app-inset transition-colors">
              <span className="text-[11px] font-mono text-app-muted">{step}</span>
              <input
                type="text"
                value={s.size}
                onChange={(e) => setToken(`typography.scale.${step}.size`, e.target.value)}
                className="w-14 h-5 bg-app-inset rounded border border-transparent hover:border-app-border focus:border-app-accent focus:outline-none text-[11px] font-mono text-app-text px-1"
              />
              <span
                className="text-app-text truncate leading-tight"
                style={{ fontSize: s.size, fontFamily: sans, lineHeight: s.lineHeight }}
              >
                Heading Text
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
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-app-text">Weights</h3>
      <div className="grid grid-cols-4 gap-3">
        {weights.map((w) => (
          <div key={w} className="rounded-app-sm border border-app-border p-2 text-center">
            <p
              className="text-xl text-app-text"
              style={{ fontFamily: sans, fontWeight: w }}
            >
              Aa
            </p>
            <p className="text-[10px] text-app-subtle mt-1 font-mono">{w}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TypographyEditor() {
  const tokens = useHub((s) => s.design.tokens)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Typography</h2>
        <p className="text-xs text-app-subtle mt-0.5">Font families, type scale, and weights</p>
      </div>

      <FontSelector
        label="Sans-serif (body)"
        value={tokens.typography.sans}
        options={POPULAR_FONTS}
        path="typography.sans"
      />

      <FontSelector
        label="Display (headings)"
        value={tokens.typography.display}
        options={DISPLAY_FONTS}
        path="typography.display"
      />

      <FontSelector
        label="Monospace (code)"
        value={tokens.typography.mono}
        options={MONO_FONTS}
        path="typography.mono"
      />

      <div className="h-px bg-app-border" />
      <TypeScalePreview />

      <div className="h-px bg-app-border" />
      <WeightsPreview />
    </div>
  )
}
