'use client'

import { useHub } from '@/store/hub.store'

export function BorderEditor() {
  const borders  = useHub((s) => s.design.tokens.borders)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])
  const radius   = useHub((s) => s.design.tokens.radius)
  const setToken = useHub((s) => s.designSetToken)

  const WIDTHS = ['1px', '1.5px', '2px', '3px']
  const STYLES = [{ value: 'solid', label: 'Solid ——' }, { value: 'dashed', label: 'Dashed - -' }]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Borders</h2>
        <p className="text-xs text-app-subtle mt-0.5">Default border width and style</p>
      </div>

      {/* Width */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Border Width</h3>
        <div className="flex gap-2">
          {WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setToken('borders.width', w)}
              className={[
                'flex flex-col items-center gap-2 rounded-app-sm border p-3 flex-1 transition-all',
                borders.width === w
                  ? 'border-app-accent bg-app-accent-subtle text-app-text'
                  : 'border-app-border bg-app-elevated text-app-muted hover:border-app-border-strong',
              ].join(' ')}
            >
              <div
                className="h-8 w-full rounded"
                style={{
                  border: `${w} ${borders.style} ${brand500}80`,
                  borderRadius: radius.md,
                }}
              />
              <span className="text-[11px] font-mono">{w}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Border Style</h3>
        <div className="flex gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setToken('borders.style', s.value)}
              className={[
                'flex flex-col items-center gap-2 rounded-app-sm border p-3 flex-1 transition-all',
                borders.style === s.value
                  ? 'border-app-accent bg-app-accent-subtle text-app-text'
                  : 'border-app-border bg-app-elevated text-app-muted hover:border-app-border-strong',
              ].join(' ')}
            >
              <div
                className="h-8 w-full"
                style={{
                  border: `${borders.width} ${s.value} ${brand500}80`,
                  borderRadius: radius.md,
                }}
              />
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live demo */}
      <div className="rounded-app-sm border border-app-border bg-app-elevated p-4">
        <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide mb-3">Preview</p>
        <div className="flex gap-4 flex-wrap">
          {(['sm','md','lg','full'] as const).map((r) => (
            <div
              key={r}
              className="h-14 w-20 flex items-center justify-center text-[10px] text-app-muted"
              style={{
                border: `${borders.width} ${borders.style} ${brand500}60`,
                borderRadius: radius[r],
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
