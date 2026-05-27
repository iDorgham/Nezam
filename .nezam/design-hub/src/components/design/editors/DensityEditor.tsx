'use client'

import { useHub } from '@/store/hub.store'
import { SlidersHorizontal, Eye, Sparkles } from 'lucide-react'

const MODES = ['compact', 'comfortable', 'spacious'] as const

const MODE_META: Record<string, { label: string; desc: string }> = {
  compact: { label: 'Compact', desc: 'Space-efficient layout' },
  comfortable: { label: 'Comfortable', desc: 'Balanced default details' },
  spacious: { label: 'Spacious', desc: 'Breathing margin room' },
}

const MULTIPLIER_FIELDS = [
  { key: 'spacingMultiplier', label: 'Spacing Multiplier', min: 0.5, max: 2, step: 0.05 },
  { key: 'fontMultiplier', label: 'Font Size Scale', min: 0.5, max: 2, step: 0.05 },
  { key: 'paddingMultiplier', label: 'Padding Multiplier', min: 0.5, max: 2, step: 0.05 },
  { key: 'gapMultiplier', label: 'Layout Gap Multiplier', min: 0.5, max: 2, step: 0.05 },
] as const

export function DensityEditor() {
  const density = useHub((s) => s.design.tokens.density)
  const setToken = useHub((s) => s.designSetToken)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-app-accent" />
            UI Information Density
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Manage spacing, line margins, interactive button sizing, and touch-target footprints globally.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: Density Mode & Multipliers */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3">Density Mode</h3>
            <div className="flex gap-2.5">
              {MODES.map((m) => {
                const isActive = density.mode === m
                return (
                  <button
                    key={m}
                    onClick={() => {
                      setToken('density.mode', m)
                      // Automatically set multipliers on mode change for seamless experience
                      const mult = m === 'compact' ? 0.75 : m === 'comfortable' ? 1.0 : 1.25
                      setToken('density.spacingMultiplier', mult)
                      setToken('density.fontMultiplier', mult)
                      setToken('density.paddingMultiplier', mult)
                      setToken('density.gapMultiplier', mult)
                    }}
                    className={`flex-1 flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all ${
                      isActive
                        ? 'border-app-accent bg-app-accent/15 shadow-sm'
                        : 'border-app-border bg-app-elevated/40 hover:border-app-border'
                    }`}
                  >
                    <span className="text-xs font-bold text-app-text block">{MODE_META[m].label}</span>
                    <span className="text-[9px] text-app-muted leading-tight block mt-0.5">{MODE_META[m].desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-app-text mb-4">Precision Density Multipliers</h3>
            <div className="flex flex-col gap-4">
              {MULTIPLIER_FIELDS.map(({ key, label, min, max, step }) => (
                <div key={key} className="flex items-center gap-4 bg-app-elevated/40 p-2.5 rounded-xl border border-app-border/60">
                  <span className="text-xs font-bold text-app-text w-32 shrink-0">{label}</span>
                  <input
                    type="range"
                    value={density[key]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => setToken(`density.${key}`, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 accent-app-accent cursor-pointer rounded-full bg-app-inset border border-app-border/40"
                  />
                  <span className="w-14 text-xs font-mono font-bold text-app-accent text-right">{density[key].toFixed(2)}x</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-app-text">Minimum Interactive Touch Target</h3>
              <span className="text-xs font-mono font-bold text-app-accent">{density.minTouchTarget}px</span>
            </div>
            <div className="flex items-center gap-4 bg-app-elevated/40 p-2.5 rounded-xl border border-app-border/60">
              <input
                type="range"
                value={density.minTouchTarget}
                min={24}
                max={64}
                step={2}
                onChange={(e) => setToken('density.minTouchTarget', parseInt(e.target.value))}
                className="flex-1 h-1.5 accent-app-accent cursor-pointer rounded-full bg-app-inset border border-app-border/40"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Real-time Button Preview */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Density Canvas Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Real-time rendering layout showing component scaling based on active spacing multipliers.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center bg-app-elevated border border-app-border/50 rounded-xl p-4 overflow-hidden relative min-h-[180px]">
            <div className="flex flex-col gap-3 justify-center items-center">
              {/* Dynamic preview block */}
              <div
                className="rounded-xl border border-app-border bg-app-inset flex items-center shadow-inner transition-all duration-300"
                style={{
                  padding: `${12 * density.paddingMultiplier}px ${16 * density.paddingMultiplier}px`,
                  gap: `${8 * density.gapMultiplier}px`,
                }}
              >
                <div
                  className="rounded-full bg-app-accent/80 shrink-0 transition-all duration-300"
                  style={{
                    width: `${16 * density.fontMultiplier}px`,
                    height: `${16 * density.fontMultiplier}px`,
                  }}
                />
                <div className="flex flex-col">
                  <span
                    className="font-bold text-app-text transition-all duration-300 block"
                    style={{ fontSize: `${12 * density.fontMultiplier}px` }}
                  >
                    Nezam Component
                  </span>
                  <span
                    className="text-app-muted transition-all duration-300 block mt-0.5"
                    style={{ fontSize: `${9 * density.fontMultiplier}px` }}
                  >
                    Egypt-Sahel Layout
                  </span>
                </div>
              </div>

              {/* Touch target footprint indicator */}
              <div className="flex flex-col items-center mt-3 pt-3 border-t border-app-border/30 w-full">
                <span className="text-[8px] uppercase tracking-wider font-mono text-app-muted mb-1.5">Touch target footprint</span>
                <div
                  className="border border-dashed border-app-accent/50 rounded-lg bg-app-accent/5 flex items-center justify-center text-[9px] font-mono font-bold text-app-accent transition-all duration-300"
                  style={{
                    width: `${density.minTouchTarget}px`,
                    height: `${density.minTouchTarget}px`,
                  }}
                >
                  {density.minTouchTarget}px
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
