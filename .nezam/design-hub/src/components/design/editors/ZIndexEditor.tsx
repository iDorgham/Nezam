'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Layers, CircleHelp, CircleCheck, Info } from 'lucide-react'

const ZINDEX_KEYS = [
  { key: 'hide', label: 'Hide (-1)', desc: 'Completely hidden from view', color: 'bg-red-500/10 border-red-500/30' },
  { key: 'auto', label: 'Auto (0)', desc: 'Natural document flow', color: 'bg-zinc-500/10 border-zinc-500/30' },
  { key: 'base', label: 'Base (1)', desc: 'Default layer (most content)', color: 'bg-slate-500/10 border-slate-500/30' },
  { key: 'dropdown', label: 'Dropdown (1000)', desc: 'Dropdowns, tooltips', color: 'bg-amber-500/10 border-amber-500/30' },
  { key: 'sticky', label: 'Sticky (1100)', desc: 'Sticky headers, footers', color: 'bg-orange-500/10 border-orange-500/30' },
  { key: 'fixed', label: 'Fixed (1200)', desc: 'Fixed position elements', color: 'bg-sky-500/10 border-sky-500/30' },
  { key: 'modal', label: 'Modal (1300)', desc: 'Modals, dialogs', color: 'bg-purple-500/10 border-purple-500/30' },
  { key: 'toast', label: 'Toast (1400)', desc: 'Toast notifications', color: 'bg-rose-500/10 border-rose-500/30' },
  { key: 'tooltip', label: 'Tooltip (1500)', desc: 'Tooltips, popovers', color: 'bg-indigo-500/10 border-indigo-500/30' },
] as const

export function ZIndexEditor() {
  const zIndex   = useHub((s) => s.design.tokens.zIndex)
  const setToken = useHub((s) => s.designSetToken)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  // Sort keys by actual z-index value for visual stack order
  const sortedStack = [...ZINDEX_KEYS].sort((a, b) => {
    const valA = Number(zIndex[a.key]) || 0
    const valB = Number(zIndex[b.key]) || 0
    return valA - valB
  })

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-app-accent" />
            Z-Index & Stacking
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Coordinate layer ordering to prevent overlapping bugs across dropdowns, sticky components, and modals</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: 3D Stacking Diagram */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-app-accent" />
              3D Interactive Layers
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Visualizing the relative order. Higher elements render on top. Hover to identify steps.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Isometric preview</span>

            {/* 3D Isometric Stack */}
            <div className="relative w-44 h-48 transform -rotate-x-30 rotate-z-45 flex flex-col-reverse items-center justify-center">
              {sortedStack.map((item, index) => {
                const val = Number(zIndex[item.key]) || 0
                const isHovered = hoveredKey === item.key
                const offset = index * 12
                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => setHoveredKey(item.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`absolute w-36 h-10 border rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm cursor-pointer ${
                      isHovered ? 'scale-105 border-app-accent/80' : 'border-app-border/80'
                    } ${item.color}`}
                    style={{
                      transform: `translateY(-${offset}px) translateZ(${offset}px)`,
                      zIndex: index
                    }}
                  >
                    <span className="text-[9px] font-bold font-mono text-app-text capitalize">
                      {item.key}: {val}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Step Editors */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
          <h3 className="text-xs font-semibold text-app-text mb-4">Precision Index Matrix</h3>
          <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 app-scroll">
            {ZINDEX_KEYS.map(({ key, label, desc }) => {
              const isHovered = hoveredKey === key
              return (
                <div 
                  key={key}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isHovered 
                      ? 'bg-app-elevated border-app-accent/30 shadow-sm' 
                      : 'bg-app-elevated/40 border-app-border/60'
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold text-app-text capitalize block">{label}</span>
                    <span className="text-[10px] text-app-muted leading-tight block mt-0.5">{desc}</span>
                  </div>
                  <input
                    type="number"
                    className="w-16 h-7 rounded-lg border border-app-border bg-app-inset px-2.5 text-center text-xs font-mono font-bold text-app-accent focus:outline-none focus:border-app-accent"
                    value={zIndex[key] ?? 0}
                    onChange={(e) => setToken(`zIndex.${key}`, parseInt(e.target.value) || 0)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}