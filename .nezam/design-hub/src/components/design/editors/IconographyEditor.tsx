'use client'

import { useMemo } from 'react'
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

// Lucide-style SVG path data
// duotonePaths rendered as accent color in duotone mode (when present); all paths used for outline/filled
interface IconDef {
  name: string
  paths: string[]
  duotonePaths?: string[]
}

const PREVIEW_ICONS: IconDef[] = [
  { name: 'home',     paths: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
    duotonePaths: ['M9 22V12h6v10'] },
  { name: 'menu',     paths: ['M4 6h16', 'M4 12h16', 'M4 18h16'] },
  { name: 'search',   paths: ['M11 17a6 6 0 100-12 6 6 0 000 12z', 'M21 21l-4.35-4.35'],
    duotonePaths: ['M11 17a6 6 0 100-12 6 6 0 000 12z'] },
  { name: 'user',     paths: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'],
    duotonePaths: ['M12 11a4 4 0 100-8 4 4 0 000 8z'] },
  { name: 'star',     paths: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'] },
  { name: 'heart',    paths: ['M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'] },
  { name: 'bell',     paths: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
    duotonePaths: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9'] },
  { name: 'settings', paths: ['M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
    duotonePaths: ['M12 9a3 3 0 100 6 3 3 0 000-6z'] },
  { name: 'mail',     paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
    duotonePaths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'] },
  { name: 'message',  paths: ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'] },
  { name: 'plus',     paths: ['M12 5v14', 'M5 12h14'] },
  { name: 'x',        paths: ['M18 6L6 18', 'M6 6l12 12'] },
  { name: 'edit',     paths: ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7', 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'],
    duotonePaths: ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7'] },
  { name: 'trash',    paths: ['M3 6h18', 'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2', 'M10 11v6', 'M14 11v6'],
    duotonePaths: ['M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6'] },
  { name: 'download', paths: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
    duotonePaths: ['M7 10l5 5 5-5', 'M12 15V3'] },
  { name: 'upload',   paths: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
    duotonePaths: ['M17 8l-5-5-5 5', 'M12 3v12'] },
  { name: 'play',     paths: ['M5 3l14 9-14 9V3z'] },
  { name: 'pause',    paths: ['M6 4h4v16H6z', 'M14 4h4v16h-4z'] },
  { name: 'camera',   paths: ['M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z', 'M12 11a3 3 0 100 6 3 3 0 000-6z'],
    duotonePaths: ['M12 11a3 3 0 100 6 3 3 0 000-6z'] },
  { name: 'image',    paths: ['M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14z', 'M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M21 15l-5-5L5 21'],
    duotonePaths: ['M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14z'] },
  { name: 'video',    paths: ['M22 8l-6 4 6 4V8z', 'M2 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'],
    duotonePaths: ['M2 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'] },
  { name: 'music',    paths: ['M9 18V5l12-2v13', 'M9 18a3 3 0 100 6 3 3 0 000-6z', 'M21 16a3 3 0 100 6 3 3 0 000-6z'],
    duotonePaths: ['M9 18V5l12-2v13'] },
  { name: 'file',     paths: ['M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z', 'M13 2v7h7'],
    duotonePaths: ['M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z'] },
  { name: 'folder',   paths: ['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z'],
    duotonePaths: ['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z'] },
  { name: 'calendar', paths: ['M3 9h18M3 15h18M9 3v18M15 3v18', 'M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v4z'],
    duotonePaths: ['M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v4z'] },
  { name: 'clock',    paths: ['M12 2a10 10 0 100 20 10 10 0 000-20z', 'M12 6v6l4 2'],
    duotonePaths: ['M12 2a10 10 0 100 20 10 10 0 000-20z'] },
  { name: 'shield',   paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
    duotonePaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
  { name: 'globe',    paths: ['M3 12a9 9 0 1018 0 9 9 0 00-18 0z', 'M3.6 9h16.8', 'M3.6 15h16.8', 'M12 3a15.3 15.3 0 010 18 15.3 15.3 0 010-18z'],
    duotonePaths: ['M3 12a9 9 0 1018 0 9 9 0 00-18 0z'] },
  { name: 'lock',     paths: ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 0110 0v4'],
    duotonePaths: ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z'] },
  { name: 'share',    paths: ['M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8', 'M16 6l-4-4-4 4', 'M12 2v13'],
    duotonePaths: ['M16 6l-4-4-4 4', 'M12 2v13'] },
  { name: 'external-link', paths: ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3'] },
  { name: 'link',     paths: ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'] },
  { name: 'info',     paths: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 16v-4', 'M12 8h.01'],
    duotonePaths: ['M12 22a10 10 0 100-20 10 10 0 000 20z'] },
  { name: 'alert-circle', paths: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 8v4', 'M12 16h.01'],
    duotonePaths: ['M12 22a10 10 0 100-20 10 10 0 000 20z'] },
  { name: 'check',    paths: ['M20 6L9 17l-5-5'] },
  { name: 'check-circle', paths: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M9 12l2 2 4-4'],
    duotonePaths: ['M12 22a10 10 0 100-20 10 10 0 000 20z'] },
  { name: 'x-circle', paths: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M15 9l-6 6', 'M9 9l6 6'],
    duotonePaths: ['M12 22a10 10 0 100-20 10 10 0 000 20z'] },
  { name: 'chevron-down', paths: ['M6 9l6 6 6-6'] },
  { name: 'chevron-up',   paths: ['M18 15l-6-6-6 6'] },
  { name: 'chevron-left', paths: ['M15 18l-6-6 6-6'] },
  { name: 'chevron-right',paths: ['M9 18l6-6-6-6'] },
  { name: 'arrow-left',   paths: ['M19 12H5', 'M12 5l-7 7 7 7'] },
  { name: 'arrow-right',  paths: ['M5 12h14', 'M12 5l7 7-7 7'] },
  { name: 'arrow-up',     paths: ['M12 5v14', 'M5 12l7-7 7 7'] },
  { name: 'arrow-down',   paths: ['M12 19V5', 'M5 12l7 7 7-7'] },
  { name: 'code',     paths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'] },
  { name: 'terminal', paths: ['M4 17l6-6-6-6', 'M12 19h8'] },
  { name: 'copy',     paths: ['M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2', 'M16 10h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2'],
    duotonePaths: ['M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2'] },
  { name: 'database', paths: ['M12 2a8 8 0 00-8 8c0 3.31 1.79 6.31 4 8 2.21 1.69 4 2 8 2s5.79-.31 8-2c2.21-1.69 4-4.69 4-8 0-4.42-3.58-8-8-8z', 'M4 10c0 2.21 1.79 4 4 4s4-1.79 4-4', 'M12 10c0 2.21 1.79 4 4 4s4-1.79 4-4', 'M4 10v4', 'M20 10v4'],
    duotonePaths: ['M12 2a8 8 0 00-8 8c0 3.31 1.79 6.31 4 8 2.21 1.69 4 2 8 2s5.79-.31 8-2c2.21-1.69 4-4.69 4-8 0-4.42-3.58-8-8-8z'] },
  { name: 'server',   paths: ['M20 4H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z', 'M4 14h16', 'M4 18h16'],
    duotonePaths: ['M20 4H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z'] },
  { name: 'cpu',      paths: ['M8 3v4', 'M12 3v4', 'M16 3v4', 'M3 8h4', 'M3 12h4', 'M3 16h4', 'M17 8h4', 'M17 12h4', 'M17 16h4', 'M8 17v4', 'M12 17v4', 'M16 17v4', 'M7 7h10v10H7z'] },
  { name: 'map-pin',  paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 7a3 3 0 100 6 3 3 0 000-6z'],
    duotonePaths: ['M12 7a3 3 0 100 6 3 3 0 000-6z'] },
  { name: 'book',     paths: ['M4 19.5A2.5 2.5 0 016.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'],
    duotonePaths: ['M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'] },
  { name: 'flag',     paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'] },
  { name: 'tag',      paths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
    duotonePaths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z'] },
  { name: 'wifi',     paths: ['M5 12.55a11 11 0 0114.08 0', 'M1.42 9a16 16 0 0121.16 0', 'M8.53 16.11a6 6 0 016.95 0', 'M12 20h.01'] },
]

export function IconographyEditor() {
  const ico        = useHub((s) => s.design.tokens.iconography)
  const brand500   = useHub((s) => s.design.tokens.colors.brand['500'])
  const accent400  = useHub((s) => s.design.tokens.colors.accent['400'])
  const neutral300 = useHub((s) => s.design.tokens.colors.neutral['300'])
  const setToken   = useHub((s) => s.designSetToken)

  const duotoneAccent = useMemo(() => {
    const c = ico.style === 'duotone' ? accent400 : undefined
    return c && c !== '#000000' ? c : neutral300
  }, [ico.style, accent400, neutral300])

  const libraryStyle = useMemo(() => {
    switch (ico.library) {
      case 'heroicons':
        return { strokeLinecap: 'square' as const, strokeLinejoin: 'miter' as const, label: 'Heroicons' }
      case 'phosphor':
        return { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, label: 'Phosphor' }
      case 'tabler':
        return { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, label: 'Tabler' }
      default:
        return { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, label: 'Lucide' }
    }
  }, [ico.library])

  function iconAttrs() {
    if (ico.style === 'filled') {
      return { fill: brand500, fillOpacity: '0.18', stroke: brand500 }
    }
    return { fill: 'none', stroke: brand500 }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Iconography</h2>
        <p className="text-xs text-app-subtle mt-0.5">Choose your icon library and style</p>
      </div>

      {/* Icon preview grid — moved to top */}
      <div className="rounded-app-sm border border-app-border bg-app-elevated p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide">
            Preview — {ico.library} / {ico.style}
          </p>
          <span className="text-[10px] font-mono text-app-subtle">{PREVIEW_ICONS.length} icons</span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 min-h-[380px]">
          {PREVIEW_ICONS.map((icon) => {
            const attrs = iconAttrs()
            return (
              <div
                key={icon.name}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-app-surface transition-colors"
                title={icon.name}
              >
                <svg
                  width={ico.size}
                  height={ico.size}
                  viewBox="0 0 24 24"
                  fill={attrs.fill}
                  stroke={attrs.stroke}
                  strokeWidth={ico.strokeWidth}
                  strokeLinecap={libraryStyle.strokeLinecap}
                  strokeLinejoin={libraryStyle.strokeLinejoin}
                >
                  {icon.paths.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                  {ico.style === 'duotone' && icon.duotonePaths?.map((d, i) => (
                    <path key={`dt-${i}`} d={d} stroke={duotoneAccent} fill="none" />
                  ))}
                </svg>
                <span className="text-[9px] text-app-muted truncate w-full text-center">{icon.name}</span>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-app-subtle mt-3">
          {PREVIEW_ICONS.length} {libraryStyle.label}-style icons shown. Actual {ico.library} icons render after npm install.
        </p>
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
    </div>
  )
}
