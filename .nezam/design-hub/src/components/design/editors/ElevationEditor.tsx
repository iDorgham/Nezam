'use client'

import { useHub } from '@/store/hub.store'

export function ElevationEditor() {
  const tokens    = useHub((s) => s.design.tokens)
  const setToken  = useHub((s) => s.designSetToken)
  const elev      = tokens.elevation

  const surfaceRows: { key: string; label: string; desc: string }[] = [
    { key: 'elevation.surface.base',    label: 'Base',    desc: 'Ground level — main background' },
    { key: 'elevation.surface.raised',  label: 'Raised',  desc: 'Elevated above base — cards, panels' },
    { key: 'elevation.surface.overlay', label: 'Overlay', desc: 'Overlay surface — modals, drawers' },
    { key: 'elevation.surface.sunken',  label: 'Sunken',  desc: 'Recessed below base — inputs, wells' },
  ]

  const shadowRows: { key: string; label: string; desc: string }[] = [
    { key: 'elevation.shadow.card',    label: 'Card',    desc: 'Card / tile shadow' },
    { key: 'elevation.shadow.modal',   label: 'Modal',   desc: 'Modal dialog shadow' },
    { key: 'elevation.shadow.tooltip', label: 'Tooltip', desc: 'Tooltip / popover shadow' },
    { key: 'elevation.shadow.sticky',  label: 'Sticky',  desc: 'Sticky header / footer shadow' },
  ]

  const surfaceValues: Record<string, string> = {
    'elevation.surface.base':    elev.surface.base,
    'elevation.surface.raised':  elev.surface.raised,
    'elevation.surface.overlay': elev.surface.overlay,
    'elevation.surface.sunken':  elev.surface.sunken,
  }

  const shadowValues: Record<string, string> = {
    'elevation.shadow.card':    elev.shadow.card,
    'elevation.shadow.modal':   elev.shadow.modal,
    'elevation.shadow.tooltip': elev.shadow.tooltip,
    'elevation.shadow.sticky':  elev.shadow.sticky,
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <EditorHeader
        title="Elevation"
        desc="Surface layering and semantic shadow scale. Use these to establish visual hierarchy across components."
      />

      {/* Surface layers */}
      <section>
        <SectionTitle>Surface Layers</SectionTitle>
        <div className="flex flex-col gap-3">
          {surfaceRows.map(({ key, label, desc }) => {
            const value = surfaceValues[key]
            return (
              <div key={key} className="flex items-center gap-4">
                {/* Visual swatch */}
                <div
                  className="h-12 w-24 shrink-0 rounded-app-md border border-app-border"
                  style={{ backgroundColor: value }}
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-app-text">{label}</p>
                  <p className="text-[11px] text-app-subtle mt-0.5">{desc}</p>
                </div>
                {/* Input */}
                <input
                  type="text"
                  className="w-48 h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                  value={value}
                  onChange={(e) => setToken(key, e.target.value)}
                />
              </div>
            )
          })}
        </div>

        {/* Stacked preview */}
        <div className="mt-4 relative h-24 w-64">
          {(['sunken', 'base', 'raised', 'overlay'] as const).map((k, i) => (
            <div
              key={k}
              className="absolute rounded-app-md border border-app-border"
              style={{
                backgroundColor: elev.surface[k],
                width: `${200 - i * 20}px`,
                height: `${56 - i * 8}px`,
                left: `${i * 10}px`,
                top: `${i * 4}px`,
                boxShadow: elev.shadow.card,
              }}
            />
          ))}
        </div>
      </section>

      {/* Shadow scale */}
      <section>
        <SectionTitle>Shadow Scale</SectionTitle>
        <div className="flex flex-col gap-4">
          {shadowRows.map(({ key, label, desc }) => {
            const value = shadowValues[key]
            return (
              <div key={key} className="flex items-start gap-4">
                {/* Shadow preview box */}
                <div
                  className="h-12 w-20 shrink-0 rounded-app-md bg-app-surface border border-app-border"
                  style={{ boxShadow: value }}
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-app-text">{label}</p>
                  <p className="text-[11px] text-app-subtle mt-0.5">{desc}</p>
                </div>
                {/* Input */}
                <input
                  type="text"
                  className="w-56 h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                  value={value}
                  onChange={(e) => setToken(key, e.target.value)}
                />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function EditorHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-app-text">{title}</h2>
      <p className="mt-1 text-xs text-app-subtle leading-relaxed">{desc}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted">{children}</p>
  )
}
