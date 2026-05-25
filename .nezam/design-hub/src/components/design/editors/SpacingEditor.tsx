'use client'

import { useHub } from '@/store/hub.store'

const SPACING_STEPS = [
  { name: '1',  mult: 1  },
  { name: '2',  mult: 2  },
  { name: '3',  mult: 3  },
  { name: '4',  mult: 4  },
  { name: '5',  mult: 5  },
  { name: '6',  mult: 6  },
  { name: '8',  mult: 8  },
  { name: '10', mult: 10 },
  { name: '12', mult: 12 },
  { name: '16', mult: 16 },
  { name: '20', mult: 20 },
  { name: '24', mult: 24 },
  { name: '32', mult: 32 },
]

export function SpacingEditor() {
  const base     = useHub((s) => s.design.tokens.spacing.base)
  const setToken = useHub((s) => s.designSetToken)

  const maxPx = Math.max(...SPACING_STEPS.map((s) => s.mult * base))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Spacing</h2>
        <p className="text-xs text-app-subtle mt-0.5">All spacing values are multiples of the base unit</p>
      </div>

      {/* Base unit */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-app-text">Base Unit</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-app-muted">1 unit =</span>
            <input
              type="number"
              value={base}
              min={2}
              max={8}
              step={1}
              onChange={(e) => setToken('spacing.base', Number(e.target.value))}
              className="w-14 h-7 rounded-app-sm border border-app-border bg-app-inset px-2 text-xs text-app-text focus:outline-none focus:border-app-accent"
            />
            <span className="text-xs text-app-muted">px</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[2, 4, 8].map((b) => (
              <button
                key={b}
                onClick={() => setToken('spacing.base', b)}
                className={[
                  'h-7 px-2.5 rounded-app-sm border text-xs transition-all',
                  base === b
                    ? 'border-app-accent bg-app-accent-subtle text-app-text font-medium'
                    : 'border-app-border text-app-muted hover:border-app-border-strong',
                ].join(' ')}
              >
                {b}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Scale</h3>
        <div className="flex flex-col">
          {SPACING_STEPS.map(({ name, mult }) => {
            const px = mult * base
            const barW = Math.round((px / maxPx) * 100)
            return (
              <div key={name} className="flex items-center gap-3 py-2 border-b border-app-border/50 last:border-0">
                <span className="w-6 shrink-0 text-[11px] font-mono text-app-muted text-right">{name}</span>
                <span className="w-12 shrink-0 text-[11px] font-mono text-app-subtle">{px}px</span>
                <div className="flex-1 h-3 bg-app-inset rounded-full overflow-hidden">
                  <div
                    className="h-full bg-app-accent/70 rounded-full"
                    style={{ width: `${barW}%` }}
                  />
                </div>
                <div
                  className="shrink-0 h-3 bg-app-accent/30 border border-app-accent/40 rounded-sm"
                  style={{ width: `${Math.min(px, 128)}px` }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Usage example */}
      <div className="rounded-app-sm border border-app-border bg-app-elevated p-4 flex flex-col gap-2">
        <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide">Usage Example</p>
        <div className="flex items-start gap-2 text-xs text-app-muted font-mono">
          <span className="text-app-subtle">padding:</span>
          <div className="flex gap-1 flex-wrap">
            {[2,4,6,8,10,12].map((mult) => (
              <span
                key={mult}
                className="text-app-accent bg-app-accent-subtle px-1 rounded"
              >
                {mult * base}px
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
