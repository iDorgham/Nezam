'use client'

import { useHub } from '@/store/hub.store'
import type { DesignTokens } from '@/types/design'

type IconLib = DesignTokens['iconography']['library']
type IconStyle = DesignTokens['iconography']['style']

const LIBRARIES: { id: IconLib; name: string; desc: string; count: string }[] = [
  { id: 'lucide',    name: 'Lucide',    desc: 'Clean outline icons. Most popular.',          count: '1500+' },
  { id: 'heroicons', name: 'Heroicons', desc: 'By Tailwind CSS. Solid & outline variants.',  count: '300+' },
  { id: 'phosphor',  name: 'Phosphor',  desc: 'Flexible family. 6 styles.',                 count: '1200+' },
  { id: 'tabler',    name: 'Tabler',    desc: 'Consistent stroke width. Very large set.',   count: '4000+' },
]

const ICON_STYLES: { id: IconStyle; name: string }[] = [
  { id: 'outline', name: 'Outline' },
  { id: 'filled',  name: 'Filled' },
  { id: 'duotone', name: 'Duotone' },
]

// Sample icon SVGs to preview
const SAMPLE_ICONS_OUTLINE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sample-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
`

export function IconographyEditor() {
  const ico      = useHub((s) => s.design.tokens.iconography)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])
  const setToken = useHub((s) => s.designSetToken)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Iconography</h2>
        <p className="text-xs text-app-subtle mt-0.5">Choose your icon library and style</p>
      </div>

      {/* Library picker */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Icon Library</h3>
        <div className="grid grid-cols-2 gap-2">
          {LIBRARIES.map((lib) => (
            <button
              key={lib.id}
              onClick={() => setToken('iconography.library', lib.id)}
              className={[
                'flex flex-col gap-1.5 rounded-app-sm border p-3 text-left transition-all',
                ico.library === lib.id
                  ? 'border-app-accent bg-app-accent-subtle text-app-text'
                  : 'border-app-border bg-app-elevated text-app-muted hover:border-app-border-strong hover:text-app-text',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{lib.name}</span>
                <span className="text-[10px] text-app-subtle">{lib.count}</span>
              </div>
              <p className="text-[11px] text-app-subtle leading-tight">{lib.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Style</h3>
        <div className="flex gap-2">
          {ICON_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setToken('iconography.style', s.id)}
              className={[
                'flex-1 h-8 rounded-app-sm border text-xs transition-all',
                ico.style === s.id
                  ? 'border-app-accent bg-app-accent-subtle text-app-text font-medium'
                  : 'border-app-border text-app-muted hover:border-app-border-strong',
              ].join(' ')}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size + stroke */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide">Size (px)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={14}
              max={32}
              step={2}
              value={ico.size}
              onChange={(e) => setToken('iconography.size', Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-xs font-mono text-app-text text-right">{ico.size}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide">Stroke Width</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.25}
              value={ico.strokeWidth}
              onChange={(e) => setToken('iconography.strokeWidth', Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-xs font-mono text-app-text text-right">{ico.strokeWidth}</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-app-sm border border-app-border bg-app-elevated p-4">
        <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide mb-3">
          Preview — {ico.library} / {ico.style}
        </p>
        <div className="flex gap-4 flex-wrap">
          {['🏠','⚙️','👤','💬','🔍','⭐'].map((emoji, i) => (
            <div key={i} className="flex items-center justify-center" style={{ color: brand500 }}>
              <span
                style={{
                  fontSize: ico.size,
                  display: 'inline-block',
                  lineHeight: 1,
                }}
              >
                {emoji}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-app-subtle mt-3">
          Note: actual {ico.library} icons will render in your project after npm install.
        </p>
      </div>
    </div>
  )
}
