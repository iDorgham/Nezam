'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Layers, Eye, ShieldAlert, Sparkles, CircleHelp } from 'lucide-react'

export function ElevationEditor() {
  const tokens = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const elev = tokens.elevation

  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)

  const surfaceRows = [
    { key: 'elevation.surface.base', label: 'Base Background', desc: 'Ground level canvas — standard page base background' },
    { key: 'elevation.surface.raised', label: 'Raised Panel', desc: 'Slightly elevated layer — default for cards, dashboard tiles' },
    { key: 'elevation.surface.overlay', label: 'Overlay Layer', desc: 'Highest floating layer — sheets, modals, dropdown dropdowns' },
    { key: 'elevation.surface.sunken', label: 'Sunken Well', desc: 'Recessed below zero-ground — forms, textareas, sunken cards' },
  ]

  const shadowRows = [
    { key: 'elevation.shadow.card', label: 'Card Shadow', desc: 'Balanced elevation shadow for interactive grids and tiles' },
    { key: 'elevation.shadow.modal', label: 'Modal Shadow', desc: 'Heavy ambient shadow for centering floating screens and alerts' },
    { key: 'elevation.shadow.tooltip', label: 'Tooltip Shadow', desc: 'Sharp high-contrast micro-shadow for precise context indicators' },
    { key: 'elevation.shadow.sticky', label: 'Sticky Header Shadow', desc: 'Linear directional shadow for scroll-locked sticky headers' },
  ]

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-app-accent" />
            Elevation & Surfaces
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Define semantic layering depths and ambient micro-shadows to sculpt three-dimensional workspace clarity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: 3D Layer Stack Sandbox */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Layer Stack Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-6">
              Interactive 3D structural layers. Hover over components to illuminate spatial depth and visual boundaries.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Isometric Stack</span>

            {/* Isometric Perspective Stack */}
            <div className="relative w-48 h-56 transform -rotate-x-30 rotate-z-45 flex flex-col-reverse items-center justify-center">
              {(['sunken', 'base', 'raised', 'overlay'] as const).map((k, i) => {
                const isHovered = hoveredLayer === `elevation.surface.${k}`
                const offset = i * 20
                return (
                  <div
                    key={k}
                    onMouseEnter={() => setHoveredLayer(`elevation.surface.${k}`)}
                    onMouseLeave={() => setHoveredLayer(null)}
                    className={`absolute w-36 h-20 rounded-xl border transition-all duration-300 flex flex-col justify-between p-2.5 cursor-pointer select-none ${
                      isHovered ? 'scale-105 border-app-accent shadow-lg' : 'border-app-border/70'
                    }`}
                    style={{
                      backgroundColor: elev.surface[k],
                      transform: `translateY(-${offset}px) translateZ(${offset}px)`,
                      zIndex: i + 1,
                      boxShadow: k === 'sunken' ? 'inset 0 2px 4px rgba(0,0,0,0.06)' : elev.shadow.card,
                    }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider text-app-text leading-none opacity-80">
                      {k}
                    </span>
                    <span className="text-[8px] font-mono text-app-muted text-right font-medium truncate block">
                      {elev.surface[k]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Surfaces Editor */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
          <h3 className="text-xs font-semibold text-app-text mb-4">Semantic Surfaces</h3>
          <div className="flex flex-col gap-3">
            {surfaceRows.map(({ key, label, desc }) => {
              const value = key.split('.').reduce((o: any, i) => o[i], tokens) as string
              const isHovered = hoveredLayer === key
              return (
                <div
                  key={key}
                  onMouseEnter={() => setHoveredLayer(key)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isHovered
                      ? 'bg-app-elevated border-app-accent/30 shadow-sm'
                      : 'bg-app-elevated/40 border-app-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg border border-app-border shadow-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: value }}
                    />
                    <div>
                      <span className="text-xs font-bold text-app-text block">{label}</span>
                      <span className="text-[9px] text-app-muted leading-tight block mt-0.5">{desc}</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="w-28 h-7 rounded-lg border border-app-border bg-app-inset px-2.5 text-center text-xs font-mono font-bold text-app-accent focus:outline-none focus:border-app-accent"
                    value={value}
                    onChange={(e) => setToken(key, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Shadow Scale & Presets */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-app-accent" />
          Ambient Ambient Shadows
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {shadowRows.map(({ key, label, desc }) => {
            const value = key.split('.').reduce((o: any, i) => o[i], tokens) as string
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 rounded-xl border border-app-border/60 bg-app-elevated/40 transition-all hover:bg-app-elevated/60"
              >
                <div className="flex items-center gap-4 flex-1 mr-4">
                  <div
                    className="h-10 w-16 rounded-lg bg-app-inset border border-app-border shrink-0"
                    style={{ boxShadow: value }}
                  />
                  <div>
                    <span className="text-xs font-bold text-app-text block">{label}</span>
                    <span className="text-[9px] text-app-muted leading-snug block mt-0.5">{desc}</span>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-48 h-7 rounded-lg border border-app-border bg-app-inset px-2.5 text-left text-xs font-mono text-app-accent focus:outline-none focus:border-app-accent"
                  value={value}
                  onChange={(e) => setToken(key, e.target.value)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
