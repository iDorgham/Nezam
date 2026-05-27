'use client'

import { useHub } from '@/store/hub.store'
import { Sliders, Eye, Sparkles, HelpCircle } from 'lucide-react'

const WIDTHS = ['4px', '6px', '8px', '10px', '12px', '14px']

export function ScrollbarEditor() {
  const scrollbar = useHub((s) => s.design.tokens.scrollbar)
  const setToken = useHub((s) => s.designSetToken)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Sliders className="h-5 w-5 text-app-accent" />
            Scrollbar Styles
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Customize system scrollbars for consistent branding across multi-column dashboards and text logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: Geometry Controls */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-1 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-app-accent" />
              Scrollbar Geometry
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal">
              Adjust size, roundness, and scrollbar tray footprint values.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Scrollbar Width</span>
            <div className="flex gap-1.5">
              {WIDTHS.map((w) => (
                <button
                  key={w}
                  onClick={() => setToken('scrollbar.width', w)}
                  className={`flex-1 h-8 rounded-lg border text-xs font-mono font-bold transition-all ${
                    scrollbar.width === w
                      ? 'border-app-accent bg-app-accent/15 text-app-accent font-semibold shadow-sm'
                      : 'border-app-border bg-app-elevated/40 text-app-muted hover:border-app-border hover:bg-app-elevated'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {([
              { key: 'trackColor', label: 'Track Background' },
              { key: 'thumbColor', label: 'Thumb Default' },
              { key: 'thumbHoverColor', label: 'Thumb Hover' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">{label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={scrollbar[key]}
                    onChange={(e) => setToken(`scrollbar.${key}`, e.target.value)}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded border border-app-border bg-transparent"
                  />
                  <input
                    type="text"
                    value={scrollbar[key]}
                    onChange={(e) => setToken(`scrollbar.${key}`, e.target.value)}
                    className="flex-1 h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
                  />
                </div>
              </div>
            ))}
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Thumb Radius</span>
              <input
                type="text"
                value={scrollbar.thumbRadius}
                onChange={(e) => setToken('scrollbar.thumbRadius', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Scroll View */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Scroll Sandbox Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Hover over and scroll this container to test custom width, color, and thumb hover adjustments.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center bg-app-elevated border border-app-border/50 rounded-xl p-4 overflow-hidden relative">
            <style>{`
              .scrollbar-custom-preview::-webkit-scrollbar {
                width: ${scrollbar.width};
              }
              .scrollbar-custom-preview::-webkit-scrollbar-track {
                background: ${scrollbar.trackColor};
                border-radius: ${scrollbar.thumbRadius};
              }
              .scrollbar-custom-preview::-webkit-scrollbar-thumb {
                background: ${scrollbar.thumbColor};
                border-radius: ${scrollbar.thumbRadius};
              }
              .scrollbar-custom-preview::-webkit-scrollbar-thumb:hover {
                background: ${scrollbar.thumbHoverColor};
              }
            `}</style>
            <div className="scrollbar-custom-preview overflow-y-auto h-32 rounded bg-app-inset p-3 border border-app-border/40 flex flex-col gap-1">
              {Array.from({ length: 15 }, (_, i) => (
                <span key={i} className="text-[10px] font-mono text-app-subtle leading-snug">
                  Line item #{i + 1} — Nezam scrolling test well
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
