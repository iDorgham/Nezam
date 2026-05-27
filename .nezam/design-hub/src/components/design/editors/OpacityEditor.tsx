'use client'

import { useHub } from '@/store/hub.store'

const OPACITY_KEYS = [
  { key: 'disabled', label: 'Disabled', desc: 'Disabled elements transparency' },
  { key: 'overlay', label: 'Overlay', desc: 'Overlay backgrounds (dropdowns, tooltips)' },
  { key: 'hover', label: 'Hover', desc: 'Hover state overlays' },
  { key: 'focus', label: 'Focus', desc: 'Focus state overlays' },
] as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted">{children}</p>
  )
}

export function OpacityEditor() {
  const opacity  = useHub((s) => s.design.tokens.opacity)
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const brand    = tokens.colors.brand['500']

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-app-text">Opacity</h2>
        <p className="mt-1 text-xs text-app-subtle leading-relaxed">
          Semantic opacity tokens for consistent transparency across UI states.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {OPACITY_KEYS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-xs font-medium text-app-text">{label}</p>
              <p className="text-[11px] text-app-subtle">{desc}</p>
            </div>
            <div className="w-32">
              <input
                type="text"
                className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                value={opacity[key]}
                onChange={(e) => setToken(`opacity.${key}`, e.target.value)}
              />
            </div>
            <div
              className="h-10 w-10 shrink-0 rounded border border-app-border flex items-center justify-center text-[10px] font-medium"
              style={{ backgroundColor: brand, opacity: Number(opacity[key]) }}
            >
              {opacity[key]}
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="rounded-app-md border border-app-border bg-app-elevated p-4">
        <SectionTitle>Preview</SectionTitle>
        <div className="flex flex-col gap-3">
          <p style={{ fontSize: '12px', opacity: Number(opacity.disabled) }}>Disabled text with low opacity</p>
          <div style={{
            padding: '8px 12px',
            backgroundColor: brand,
            borderRadius: '6px',
            fontSize: '11px',
            color: '#fff',
            opacity: Number(opacity.overlay),
          }}>
            Overlay element
          </div>
        </div>
      </div>
    </div>
  )
}