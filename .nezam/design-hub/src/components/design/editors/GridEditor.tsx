'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { LayoutGrid, Eye, Columns, Sparkles } from 'lucide-react'

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

export function GridEditor() {
  const grid = useHub((s) => s.design.tokens.grid)
  const setToken = useHub((s) => s.designSetToken)
  const [activePreviewBp, setActivePreviewBp] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg')

  const colsCount = grid.columns[activePreviewBp] || 12

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-app-accent" />
            Responsive Grid System
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Configure column counts, responsive grid behaviors, gutters, and structural outer margins.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Side: Geometry Controls */}
        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-1 flex items-center gap-1.5">
              <Columns className="h-4 w-4 text-app-accent" />
              Column Counts by Breakpoint
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal">
              Adjust maximum responsive columns for layout grids.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {BREAKPOINTS.map((bp) => {
              const isActive = activePreviewBp === bp
              return (
                <div
                  key={bp}
                  onClick={() => setActivePreviewBp(bp)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-app-elevated border-app-accent shadow-sm'
                      : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border'
                  }`}
                >
                  <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">{bp}</span>
                  <input
                    type="number"
                    value={grid.columns[bp]}
                    min={1}
                    max={24}
                    step={1}
                    onChange={(e) => setToken(`grid.columns.${bp}`, parseInt(e.target.value) || 1)}
                    onClick={(e) => e.stopPropagation()} // Prevent focus select trigger
                    className="w-10 h-6 rounded border border-app-border bg-app-inset text-center text-xs font-mono font-bold text-app-accent focus:outline-none"
                  />
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Column Gutter Space</span>
              <input
                type="text"
                value={grid.gutter}
                onChange={(e) => setToken('grid.gutter', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono font-bold text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Outer Page Margin</span>
              <input
                type="text"
                value={grid.margin}
                onChange={(e) => setToken('grid.margin', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono font-bold text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
          </div>
        </div>

        {/* Bottom Side: Interactive Sandbox Grid View */}
        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Grid Canvas Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Real-time rendering of columns in <strong className="uppercase text-app-accent">{activePreviewBp} view</strong> ({colsCount} columns).
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center bg-app-elevated border border-app-border/50 rounded-xl p-4 overflow-hidden relative min-h-[160px]">
            <div
              className="w-full flex h-24 rounded border border-app-border/40 bg-app-inset transition-all duration-300"
              style={{
                paddingLeft: grid.margin,
                paddingRight: grid.margin,
                gap: grid.gutter,
              }}
            >
              {Array.from({ length: colsCount }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-full bg-app-accent/10 border-l border-r border-app-accent/20 flex items-center justify-center text-[8px] font-mono font-bold text-app-accent"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
