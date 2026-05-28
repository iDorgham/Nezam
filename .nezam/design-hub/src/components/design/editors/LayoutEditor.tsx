'use client'

import type { DesignTokens } from '@/types/design'
import { useHub } from '@/store/hub.store'
import { getLayoutPresets } from '@/lib/design/catalog'

const DEFAULT_LAYOUT: DesignTokens['layout'] = {
  maxWidth: '1200px',
  containerPadding: '16px',
  gutter: '24px',
  headerHeight: '64px',
  footerHeight: '80px',
  sidebarWidth: '240px',
}

const LAYOUT_KEYS = [
  { key: 'maxWidth', label: 'Max Content Width', desc: 'Maximum width for content containers' },
  { key: 'containerPadding', label: 'Container Padding', desc: 'Horizontal padding for containers' },
  { key: 'gutter', label: 'Gutter', desc: 'Spacing between columns' },
  { key: 'headerHeight', label: 'Header Height', desc: 'Application header height' },
  { key: 'footerHeight', label: 'Footer Height', desc: 'Application footer height' },
  { key: 'sidebarWidth', label: 'Sidebar Width', desc: 'Navigation sidebar width' },
] as const

export function LayoutEditor() {
  const layoutPresets = getLayoutPresets()
  const layout   = useHub((s) => s.design.tokens.layout ?? DEFAULT_LAYOUT)
  const setToken = useHub((s) => s.designSetToken)
  const applyPreset = (preset: DesignTokens['layout']) => {
    ;(Object.entries(preset) as Array<[keyof DesignTokens['layout'], string]>).forEach(([key, value]) => {
      setToken(`layout.${key}`, value)
    })
  }

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-app-text">Layout</h2>
        <p className="mt-1 text-xs text-app-subtle leading-relaxed">
          Layout dimensions for containers, spacing, and structural components.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-medium text-app-muted">Layout Presets</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layoutPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="rounded-app-md border border-app-border bg-app-elevated p-3 text-left hover:border-app-accent transition"
              onClick={() => applyPreset(preset.layout)}
            >
              <p className="text-xs font-semibold text-app-text">{preset.label}</p>
              <p className="mt-1 text-[11px] text-app-subtle leading-relaxed">{preset.description}</p>
              <p className="mt-2 text-[10px] text-app-muted">
                Title: {preset.title.scale} · Buttons: {preset.buttons.primaryVariant} /{' '}
                {preset.buttons.secondaryVariant}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {LAYOUT_KEYS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-app-text">{label}</p>
              <p className="text-[11px] text-app-subtle">{desc}</p>
            </div>
            <input
              type="text"
              className="w-24 h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent text-center"
              value={layout[key]}
              onChange={(e) => setToken(`layout.${key}`, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Layout preview visualization */}
      <div>
        <p className="text-[11px] font-medium text-app-muted mb-3">Layout Preview</p>
        <div className="relative h-60 bg-app-elevated rounded-app-md border border-app-border overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 bg-app-accent/20 border-b border-app-border flex items-center justify-center">
            <span className="text-[10px] text-app-muted">{layout.headerHeight} — Header</span>
          </div>
          <div className="absolute top-8 bottom-8 left-0 w-12 bg-app-accent/10 border-r border-app-border flex items-center justify-center">
            <span className="text-[9px] text-app-muted rotate-90 whitespace-nowrap">{layout.sidebarWidth}</span>
          </div>
          <div className="absolute top-8 bottom-8 left-12 right-0 bg-app-accent/5 flex items-center justify-center">
            <span className="text-[10px] text-app-muted">{layout.maxWidth} — Content</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-app-accent/15 border-t border-app-border flex items-center justify-center">
            <span className="text-[10px] text-app-muted">{layout.footerHeight} — Footer</span>
          </div>
        </div>
      </div>
    </div>
  )
}