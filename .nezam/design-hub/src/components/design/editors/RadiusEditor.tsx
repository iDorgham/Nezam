'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import {
  Circle,
  Sparkles,
  Layers,
  Settings2,
  SlidersHorizontal,
  CircleCheck,
  AlertTriangle,
  Info,
  Maximize2
} from 'lucide-react'

const RADIUS_STEPS = ['none','sm','md','lg','xl','full'] as const

const PRESETS = [
  { name: 'Sharp',    values: { none:'0px', sm:'2px',   md:'4px',   lg:'6px',   xl:'8px',   full:'9999px' } },
  { name: 'Rounded',  values: { none:'0px', sm:'4px',   md:'8px',   lg:'12px',  xl:'16px',  full:'9999px' } },
  { name: 'Soft',     values: { none:'0px', sm:'6px',   md:'12px',  lg:'18px',  xl:'24px',  full:'9999px' } },
  { name: 'Pill',     values: { none:'0px', sm:'8px',   md:'16px',  lg:'24px',  xl:'32px',  full:'9999px' } },
] as const

const DEMO_TEXT: Record<typeof RADIUS_STEPS[number], string> = {
  none: 'None (0px)',
  sm:   'Small (sm)',
  md:   'Medium (md)',
  lg:   'Large (lg)',
  xl:   'X-Large (xl)',
  full: 'Full Pill (full)',
}

export function RadiusEditor() {
  const radius   = useHub((s) => s.design.tokens.radius)
  const setToken = useHub((s) => s.designSetToken)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])

  const [activePreset, setActivePreset] = useState<string>('Rounded')
  const [selectedCorner, setSelectedCorner] = useState<typeof RADIUS_STEPS[number]>('md')

  function applyPreset(preset: typeof PRESETS[number]) {
    setActivePreset(preset.name)
    Object.entries(preset.values).forEach(([key, val]) => {
      setToken(`radius.${key}`, val)
    })
  }

  // Parse radius value to number for slider (extract digits)
  const currentVal = radius[selectedCorner]
  const parsedNum = parseInt(currentVal) || 0

  function handleSliderChange(val: number) {
    if (selectedCorner === 'none' || selectedCorner === 'full') return
    setToken(`radius.${selectedCorner}`, `${val}px`)
    setActivePreset('Custom')
  }

  // Hierarchical Radius check: Parent vs Child roundness
  const parentRadius = parseInt(radius.lg) || 12
  const expectedChildRadius = Math.max(0, parentRadius - 8)
  const actualChildRadius = parseInt(radius.sm) || 4
  const nestingPass = actualChildRadius <= expectedChildRadius

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Circle className="h-5 w-5 text-app-accent" />
            Border Radius Studio
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Control container roundness, button pill shapes, and interactive card geometry</p>
        </div>
      </div>

      {/* Presets */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">Aesthetic presets</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border transition-all group ${
                activePreset === preset.name
                  ? 'bg-app-elevated border-app-accent shadow-sm ring-1 ring-app-accent/10'
                  : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
              }`}
            >
              <div
                className="h-10 w-10 border-2 border-app-border-strong transition-colors"
                style={{
                  borderRadius: preset.values.md,
                  backgroundColor: brand500 + '15',
                  borderColor: activePreset === preset.name ? brand500 : undefined,
                }}
              />
              <div className="text-center">
                <span className="text-[11px] font-bold text-app-text block">{preset.name}</span>
                <span className="text-[9px] font-mono text-app-muted mt-0.5 block">md: {preset.values.md}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Corners Sandbox */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="h-4 w-4 text-app-accent" />
            <h3 className="text-xs font-semibold text-app-text">Interactive Corners Sandbox</h3>
          </div>
          <p className="text-[11px] text-app-subtle leading-relaxed mb-4">
            Select any scale step to adjust and preview. Premium squircles adapt smoothly to parent layout containers.
          </p>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden min-h-[160px]">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Visual preview canvas</span>
            
            {/* Roundness visualizer */}
            <div 
              className="w-40 h-24 border-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
              style={{
                borderRadius: radius[selectedCorner] === 'full' ? '9999px' : radius[selectedCorner],
                backgroundColor: brand500 + '15',
                borderColor: brand500,
                boxShadow: `0 8px 30px ${brand500}0a`
              }}
            >
              <span className="text-[10px] font-bold text-app-accent font-mono uppercase tracking-wider">
                {selectedCorner}: {radius[selectedCorner]}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-app-accent" />
              <h3 className="text-xs font-semibold text-app-text">Precision Sliders</h3>
            </div>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Fine-tune the selected token step. Pixels will render smoothly across subpixels.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 p-2 bg-app-elevated border border-app-border/60 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted">Selected Step:</span>
              <select
                value={selectedCorner}
                onChange={(e) => setSelectedCorner(e.target.value as typeof RADIUS_STEPS[number])}
                className="w-full h-7 rounded-lg border border-app-border bg-app-inset text-xs px-2 cursor-pointer focus:outline-none focus:border-app-accent font-semibold"
              >
                {RADIUS_STEPS.map(step => (
                  <option key={step} value={step}>{DEMO_TEXT[step]}</option>
                ))}
              </select>
            </div>

            {selectedCorner !== 'none' && selectedCorner !== 'full' ? (
              <div className="flex flex-col gap-1.5 p-2 bg-app-elevated border border-app-border/60 rounded-xl">
                <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted">Adjust Roundness:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={parsedNum}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg bg-app-inset cursor-pointer accent-app-accent"
                  />
                  <span className="text-xs font-mono font-bold text-app-text w-8">{radius[selectedCorner]}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 text-[10px] text-app-muted rounded-xl bg-app-elevated/40 border border-dashed border-app-border text-center font-medium">
                Step '{selectedCorner}' uses a static variable value: <span className="font-mono text-app-accent font-semibold">{radius[selectedCorner]}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Individual Corner Cards */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-app-accent" />
          Proportional corners scale
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {RADIUS_STEPS.map((step) => {
            const val = radius[step]
            const isSel = selectedCorner === step
            return (
              <button
                key={step}
                onClick={() => setSelectedCorner(step)}
                className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSel
                    ? 'bg-app-elevated border-app-accent/30 shadow-sm'
                    : 'bg-app-elevated/40 border-app-border/50 hover:border-app-border'
                }`}
              >
                {/* Visual demo */}
                <div className="flex justify-center py-2">
                  <div
                    className="h-10 w-16 shadow-inner border border-black/5"
                    style={{
                      borderRadius: step === 'full' ? '9999px' : val,
                      backgroundColor: brand500 + '15',
                      border: `1.5px solid ${brand500}50`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between w-full mt-1.5">
                  <span className="text-[11px] font-bold text-app-text capitalize">{step}</span>
                  <span className="text-[10px] font-mono text-app-accent font-semibold">{val}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Nesting radius audit */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          {nestingPass ? (
            <CircleCheck className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <h3 className="text-xs font-semibold text-app-text">Nesting Radius Proportional Audit</h3>
        </div>
        <div className="grid grid-cols-3 gap-6 items-center">
          <div className="col-span-2">
            <p className="text-[11px] text-app-subtle leading-relaxed">
              Design Law: <em>Parent containers must be rounder than nested child components</em> (ideal difference: child radius ≤ parent radius - padding). Current parent (<span className="font-mono font-bold">lg: {radius.lg}</span>) vs child (<span className="font-mono font-bold">sm: {radius.sm}</span>).
            </p>
            <div className="flex gap-2 items-center mt-2.5">
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                nestingPass 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {nestingPass ? 'Audit Pass' : 'Nesting Alert'}
              </span>
              <span className="text-[9px] text-app-muted font-medium">Child has correct proportional margins</span>
            </div>
          </div>
          <div className="flex justify-center p-3 rounded-xl bg-app-elevated border border-app-border/60">
            {/* Nesting demo box */}
            <div 
              className="h-16 w-24 bg-app-inset border border-app-border/80 flex items-center justify-center p-2"
              style={{ borderRadius: radius.lg }}
            >
              <div 
                className="h-full w-full bg-app-accent/20 border border-app-accent/30 flex items-center justify-center"
                style={{ borderRadius: radius.sm }}
              >
                <span className="text-[8px] font-mono text-app-accent font-bold">Child</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

