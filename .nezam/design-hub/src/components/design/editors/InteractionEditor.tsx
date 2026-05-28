'use client'

import { useHub } from '@/store/hub.store'

export function InteractionEditor() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const inter    = tokens.interaction

  const rows = [
    {
      key:   'interaction.focusRing',
      label: 'Focus Ring',
      desc:  'Keyboard focus outline color',
      value: inter.focusRing,
      type:  'color' as const,
    },
    {
      key:   'interaction.hover',
      label: 'Hover Overlay',
      desc:  'Semi-transparent hover state overlay (rgba)',
      value: inter.hover,
      type:  'text' as const,
    },
    {
      key:   'interaction.pressed',
      label: 'Pressed Overlay',
      desc:  'Active/pressed state overlay (rgba)',
      value: inter.pressed,
      type:  'text' as const,
    },
    {
      key:   'interaction.selected',
      label: 'Selected Background',
      desc:  'Background for selected/active items',
      value: inter.selected,
      type:  'text' as const,
    },
    {
      key:   'interaction.disabled',
      label: 'Disabled Opacity',
      desc:  'Opacity multiplier for disabled elements (e.g. "0.4")',
      value: inter.disabled,
      type:  'text' as const,
    },
  ] as const

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-app-text">Interaction</h2>
        <p className="mt-1 text-xs text-app-subtle leading-relaxed">
          State tokens for interactive elements — focus, hover, pressed, selected, and disabled states.
          These ensure accessible and consistent feedback across all interactive components.
        </p>
      </div>

      {/* Token rows */}
      <section className="flex flex-col gap-4">
        {rows.map(({ key, label, desc, value, type }) => (
          <div key={key} className="flex items-center gap-4">
            {/* Swatch */}
            <div
              className="h-10 w-16 shrink-0 rounded-app-md border border-app-border"
              style={{ backgroundColor: value }}
            />
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-app-text">{label}</p>
              <p className="text-[11px] text-app-subtle mt-0.5">{desc}</p>
            </div>
            {/* Input */}
            <input
              type={type === 'color' ? 'text' : 'text'}
              className="w-44 h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              value={value}
              onChange={(e) => setToken(key, e.target.value)}
            />
          </div>
        ))}
      </section>

      {/* Live preview */}
      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted">
          Live Preview
        </p>
        <div className="flex flex-col gap-3 rounded-app-lg border border-app-border bg-app-surface p-4">
          {/* Focus ring demo */}
          <div>
            <p className="text-[11px] text-app-subtle mb-1.5">Focus ring</p>
            <button
              className="px-4 py-2 rounded-app-sm text-xs font-medium border border-app-border text-app-text"
              style={{
                outline: `2px solid ${inter.focusRing}`,
                outlineOffset: '2px',
              }}
            >
              Focused button
            </button>
          </div>

          {/* Hover overlay demo */}
          <div>
            <p className="text-[11px] text-app-subtle mb-1.5">Hover / pressed / selected</p>
            <div className="flex gap-2">
              {[
                { label: 'Hover',    bg: inter.hover },
                { label: 'Pressed',  bg: inter.pressed },
                { label: 'Selected', bg: inter.selected },
              ].map(({ label, bg }) => (
                <div
                  key={label}
                  className="px-3 py-2 rounded-app-sm text-xs text-app-text border border-app-border"
                  style={{ backgroundColor: bg }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Disabled demo */}
          <div>
            <p className="text-[11px] text-app-subtle mb-1.5">Disabled ({inter.disabled} opacity)</p>
            <button
              className="px-4 py-2 rounded-app-sm text-xs font-medium bg-app-elevated border border-app-border text-app-text"
              style={{ opacity: parseFloat(inter.disabled) || 0.4 }}
              disabled
            >
              Disabled button
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
