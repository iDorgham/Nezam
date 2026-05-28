'use client'

import { useHub } from '@/store/hub.store'
import { Square, Sparkles, Sliders, CheckCircle, Target, Layers } from 'lucide-react'

export function BorderEditor() {
  const borders  = useHub((s) => s.design.tokens.borders)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])
  const radius   = useHub((s) => s.design.tokens.radius)
  const setToken = useHub((s) => s.designSetToken)

  const WIDTHS = ['1px', '1.5px', '2px', '3px'] as const
  const STYLES = [
    { value: 'solid', label: 'Solid Line' },
    { value: 'dashed', label: 'Dashed - -' }
  ] as const

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Square className="h-5 w-5 text-app-accent" />
            Borders & Dividers
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Configure line styles, card boundaries, focus states, and vertical/horizontal dividers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Width */}
        <div className="rounded-app-lg border border-app-border bg-app-surface p-5">
          <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-app-accent" />
            Border Width
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setToken('borders.width', w)}
                type="button"
                className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border transition-all ${
                  borders.width === w
                    ? 'bg-app-elevated border-app-accent shadow-sm'
                    : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
                }`}
              >
                <div
                  className="h-8 w-full border-app-border/40"
                  style={{
                    borderWidth: w,
                    borderStyle: borders.style,
                    borderColor: brand500,
                    borderRadius: radius.md,
                  }}
                />
                <span className="text-[11px] font-bold font-mono text-app-text">{w}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="rounded-app-lg border border-app-border bg-app-surface p-5">
          <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-app-accent" />
            Border Style
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setToken('borders.style', s.value)}
                type="button"
                className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border transition-all ${
                  borders.style === s.value
                    ? 'bg-app-elevated border-app-accent shadow-sm'
                    : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
                }`}
              >
                <div
                  className="h-8 w-full border-app-border/40"
                  style={{
                    borderWidth: borders.width,
                    borderStyle: s.value,
                    borderColor: brand500,
                    borderRadius: radius.md,
                  }}
                />
                <span className="text-[11px] font-bold text-app-text">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Focus & Divider Configurations */}
      {borders.focus && (
        <div className="grid grid-cols-2 gap-6 rounded-app-lg border border-app-border bg-app-surface p-5">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-app-text flex items-center gap-1.5">
              <Target className="h-4 w-4 text-app-accent" />
              Focus Ring Outlines
            </h3>
            <div className="flex flex-col gap-2.5 rounded-app-md border border-app-border bg-app-elevated p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono text-app-muted">Focus Color:</span>
                <input
                  type="color"
                  value={borders.focus.color}
                  onChange={(e) => setToken('borders.focus.color', e.target.value)}
                  className="h-6 w-10 cursor-pointer rounded border border-app-border bg-transparent p-0.5"
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-app-muted">Visual Demo:</span>
                <button 
                  type="button"
                  className="px-4 py-1.5 rounded bg-app-inset border border-app-border text-[11px] font-semibold text-app-text transition-all focus:outline-none"
                  style={{
                    boxShadow: `0 0 0 ${borders.focus.width} ${borders.focus.color}`
                  }}
                >
                  Focused Element
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-app-text flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-app-accent" />
              Divider Rhythms
            </h3>
            <div className="flex flex-col gap-2.5 rounded-app-md border border-app-border bg-app-elevated p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono text-app-muted">Divider Width:</span>
                <input
                  type="text"
                  value={borders.divider.width}
                  onChange={(e) => setToken('borders.divider.width', e.target.value)}
                  className="w-16 h-6 rounded border border-app-border bg-app-inset text-center font-mono text-[10px] focus:outline-none"
                />
              </div>
              <div className="h-px w-full bg-app-border/40 mt-3" style={{ borderTop: `${borders.divider.width} ${borders.divider.style} ${borders.divider.color}` }} />
              <span className="text-[9px] text-app-muted font-mono text-center block">Horizontal Divider Line</span>
            </div>
          </div>
        </div>
      )}

      {/* Live demo */}
      <div className="rounded-app-lg border border-app-border bg-app-surface p-5">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          Proportional Border Radii Preview
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {(['sm','md','lg','full'] as const).map((r) => (
            <div
              key={r}
              className="relative h-20 overflow-hidden rounded-app-md border border-app-border bg-app-elevated transition-all hover:scale-[1.02] flex flex-col items-center justify-center"
              style={{
                borderWidth: borders.width,
                borderStyle: borders.style,
                borderColor: brand500 + '50',
                borderRadius: radius[r],
              }}
            >
              <span className="text-xs font-bold text-app-text capitalize">{r}</span>
              <span className="text-[9px] font-mono text-app-muted mt-0.5">{radius[r]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

