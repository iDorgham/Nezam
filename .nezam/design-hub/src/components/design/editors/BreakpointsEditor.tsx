'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Monitor, Tablet, Smartphone, Sparkles, CircleCheck, Eye, Settings2 } from 'lucide-react'

const BREAKPOINT_KEYS = [
  { key: 'xs', label: 'Extra Small (xs)', desc: 'Mobile phones portrait', width: '320px', icon: Smartphone },
  { key: 'sm', label: 'Small (sm)', desc: 'Tablets portrait', width: '640px', icon: Tablet },
  { key: 'md', label: 'Medium (md)', desc: 'Tablets landscape', width: '768px', icon: Tablet },
  { key: 'lg', label: 'Large (lg)', desc: 'Standard laptops', width: '1024px', icon: Monitor },
  { key: 'xl', label: 'Extra Large (xl)', desc: 'Wide desktop screens', width: '1280px', icon: Monitor },
  { key: '2xl', label: '2XL (2xl)', desc: 'Ultrawide displays', width: '1536px', icon: Monitor },
] as const

export function BreakpointsEditor() {
  const breakpoints = useHub((s) => s.design.tokens.breakpoints)
  const setToken    = useHub((s) => s.designSetToken)
  const [hoveredBp, setHoveredBp] = useState<string | null>(null)
  const [activeTestBp, setActiveTestBp] = useState<string>('md')

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Monitor className="h-5 w-5 text-app-accent" />
            Responsive Breakpoints
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Define layout cutoffs for consistent CSS media queries across views</p>
        </div>
      </div>

      {/* Interactive Responsive Ruler Sandbox */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Interactive Viewport Ruler
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Click on any breakpoint step to simulate responsive layouts. Container bounds adjust dynamically.
            </p>
          </div>

          {/* Interactive responsive mockup box */}
          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Viewport Simulation</span>

            {/* Simulated frame resizing */}
            <div 
              className="border-2 border-app-accent/30 rounded-xl bg-app-inset p-4 flex flex-col justify-between items-center transition-all duration-500 shadow-sm relative overflow-hidden"
              style={{
                width: activeTestBp === 'xs' ? '140px' 
                     : activeTestBp === 'sm' ? '220px'
                     : activeTestBp === 'md' ? '260px'
                     : activeTestBp === 'lg' ? '340px'
                     : activeTestBp === 'xl' ? '400px'
                     : '460px',
                minHeight: '110px'
              }}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-bold text-app-text uppercase tracking-wider">{activeTestBp} View</span>
                <span className="text-[9px] font-mono text-app-accent font-semibold">{breakpoints[activeTestBp as keyof typeof breakpoints]}</span>
              </div>
              <div className="w-full flex flex-col gap-1.5 mt-2">
                <div className="h-2 w-full bg-app-muted/20 rounded" />
                <div className="h-2 w-2/3 bg-app-muted/20 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Precision inputs */}
        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
          <h3 className="text-xs font-semibold text-app-text mb-4">Responsive Breakpoints</h3>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 app-scroll">
            {BREAKPOINT_KEYS.map(({ key, label, desc, icon: IconComponent }) => {
              const isActive = activeTestBp === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTestBp(key)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                    isActive 
                      ? 'bg-app-elevated border-app-accent/30 shadow-sm' 
                      : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-app-accent' : 'text-app-muted'}`} />
                    <div>
                      <span className="text-[11px] font-bold text-app-text block">{label}</span>
                      <span className="text-[9px] text-app-muted leading-tight block mt-0.5">{desc}</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="w-16 h-6 rounded-lg border border-app-border bg-app-inset px-2 text-center text-[10px] font-mono font-bold text-app-accent focus:outline-none"
                    value={breakpoints[key]}
                    onChange={(e) => setToken(`breakpoints.${key}`, e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent select trigger
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Visual Ruler Scale */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-app-accent" />
          Proportional Rulers
        </h3>
        <div className="relative h-14 bg-app-elevated rounded-xl border border-app-border overflow-hidden p-3 flex items-end justify-between shadow-inner">
          {BREAKPOINT_KEYS.map((bp, i) => {
            const isActive = activeTestBp === bp.key
            return (
              <button 
                key={bp.key} 
                onClick={() => setActiveTestBp(bp.key)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className="w-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    height: `${Math.max(10, (i + 1) * 4.5)}px`,
                    backgroundColor: isActive ? 'var(--app-accent, #3b82f6)' : 'rgba(156,163,175,0.3)' 
                  }}
                />
                <span className={`text-[9px] font-bold mt-1.5 font-mono ${isActive ? 'text-app-accent' : 'text-app-muted'}`}>
                  {bp.key}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}