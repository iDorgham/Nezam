'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import {
  ArrowLeftRight,
  Move,
  Settings2,
  RefreshCw,
  Box,
  Hash,
  Layout,
  Layers,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react'

const SPACING_STEPS = [
  { name: '1',  mult: 1  },
  { name: '2',  mult: 2  },
  { name: '3',  mult: 3  },
  { name: '4',  mult: 4  },
  { name: '5',  mult: 5  },
  { name: '6',  mult: 6  },
  { name: '8',  mult: 8  },
  { name: '10', mult: 10 },
  { name: '12', mult: 12 },
  { name: '16', mult: 16 },
  { name: '20', mult: 20 },
  { name: '24', mult: 24 },
  { name: '32', mult: 32 },
] as const

const SCALES = [
  { id: 'linear-4', name: 'Linear 4px', desc: 'Consistent 4px increments for precise layouts.' },
  { id: 'linear-8', name: 'Linear 8px', desc: 'Standard 8px grid system ideal for Enterprise apps.' },
  { id: 'modular-1.25', name: 'Major Third (1.25)', desc: 'Smooth typographic proportions.' },
  { id: 'golden-1.618', name: 'Golden Ratio (1.618)', desc: 'Organic, natural growth scale.' },
] as const

export function SpacingEditor() {
  const base     = useHub((s) => s.design.tokens.spacing.base)
  const setToken = useHub((s) => s.designSetToken)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])

  const [activeScale, setActiveScale] = useState<string>('linear-8')
  const [tapeStep, setTapeStep] = useState<string>('4') // mult=4 default

  const currentMult = SPACING_STEPS.find(s => s.name === tapeStep)?.mult ?? 4
  const currentPx = currentMult * base

  const maxPx = Math.max(...SPACING_STEPS.map((s) => s.mult * base))

  function applyScalePreset(scaleId: string) {
    setActiveScale(scaleId)
    if (scaleId === 'linear-4') {
      setToken('spacing.base', 4)
    } else if (scaleId === 'linear-8') {
      setToken('spacing.base', 8)
    } else if (scaleId === 'modular-1.25') {
      setToken('spacing.base', 5)
    } else if (scaleId === 'golden-1.618') {
      setToken('spacing.base', 6)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-app-accent" />
            Geometry & Space
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Define your base unit, spatial layout scale, and box system rhythms</p>
        </div>
      </div>

      {/* Scale presets */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">Spatial System Scale Presets</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {SCALES.map((scale) => (
            <button
              key={scale.id}
              onClick={() => applyScalePreset(scale.id)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                activeScale === scale.id
                  ? 'bg-app-elevated border-app-accent shadow-sm'
                  : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
              }`}
            >
              <span className="text-[11px] font-bold text-app-text">{scale.name}</span>
              <p className="text-[9px] text-app-subtle mt-1 flex-1 leading-normal">{scale.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Box-Model Tape Measure */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Box className="h-4 w-4 text-app-accent" />
            <h3 className="text-xs font-semibold text-app-text">Interactive Box-Model Tape Measure</h3>
          </div>
          <p className="text-[11px] text-app-subtle leading-relaxed mb-4">
            Select any spatial scale step to simulate how it behaves as a container margin, padding, or gap.
          </p>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden min-h-[180px]">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Real-time box preview</span>
            
            {/* Box simulator */}
            <div 
              className="border border-app-accent/30 rounded-xl bg-app-inset relative transition-all duration-300 flex items-center justify-center"
              style={{ 
                padding: `${currentPx}px`,
                borderColor: brand500 + '30',
                boxShadow: `0 0 20px ${brand500}08`
              }}
            >
              {/* Outer Margin indicator */}
              <div className="absolute inset-0 border border-dashed border-app-accent/20 rounded-xl pointer-events-none" style={{ margin: `-${currentPx}px` }} />
              
              {/* Box Content Card */}
              <div className="rounded-lg bg-app-elevated border border-app-border px-5 py-3 shadow-sm min-w-[140px] text-center relative z-10 transition-colors">
                <span className="text-[10px] font-bold text-app-text block">Content Box</span>
                <span className="text-[9px] font-mono text-app-accent mt-0.5 block">Pad: {currentPx}px</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-4 w-4 text-app-accent" />
              <h3 className="text-xs font-semibold text-app-text">Base Unit Rhythm</h3>
            </div>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              The core spacing multiplier value. All items scale on this base value.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-2 bg-app-elevated border border-app-border/60 rounded-xl">
              <span className="text-[11px] font-medium text-app-muted ml-1">1 spacing unit =</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={base}
                  min={2}
                  max={12}
                  step={1}
                  onChange={(e) => setToken('spacing.base', Number(e.target.value))}
                  className="w-12 h-7 rounded-lg border border-app-border bg-app-inset px-2 text-center text-xs font-mono text-app-text focus:outline-none focus:border-app-accent font-semibold"
                />
                <span className="text-[11px] font-mono text-app-muted mr-1">px</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted ml-0.5">Quick Selectors:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[2, 4, 6, 8].map((b) => (
                  <button
                    key={b}
                    onClick={() => setToken('spacing.base', b)}
                    className={`h-7 rounded-lg border text-[11px] font-semibold transition-all ${
                      base === b
                        ? 'border-app-accent bg-app-accent/10 text-app-accent'
                        : 'border-app-border text-app-muted hover:border-app-border-strong bg-app-elevated/40'
                    }`}
                  >
                    {b}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Steps List */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-app-accent" />
          Proportional Spacing Scale
        </h3>
        <div className="flex flex-col gap-2">
          {SPACING_STEPS.map(({ name, mult }) => {
            const px = mult * base
            const barW = Math.round((px / maxPx) * 100)
            const isTape = tapeStep === name
            return (
              <button
                key={name}
                onClick={() => setTapeStep(name)}
                className={`w-full flex items-center gap-4 py-2 px-3 rounded-xl border transition-all text-left group ${
                  isTape 
                    ? 'bg-app-elevated border-app-accent/30 shadow-sm' 
                    : 'border-transparent hover:bg-app-elevated/40'
                }`}
              >
                <span className="w-8 shrink-0 text-xs font-bold font-mono text-app-text">{name}x</span>
                <span className="w-16 shrink-0 text-xs font-mono text-app-accent font-semibold">{px}px</span>
                <div className="flex-1 h-2 bg-app-inset rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-app-accent rounded-full transition-all duration-300"
                    style={{ 
                      width: `${barW}%`,
                      backgroundColor: isTape ? brand500 : undefined 
                    }}
                  />
                </div>
                {/* Simulated spacing strip */}
                <div
                  className="shrink-0 h-4 bg-app-accent/20 border border-app-accent/30 rounded-md transition-all group-hover:scale-y-105"
                  style={{ 
                    width: `${Math.min(px, 120)}px`,
                    backgroundColor: isTape ? `${brand500}30` : undefined,
                    borderColor: isTape ? `${brand500}50` : undefined
                  }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Box layout guide */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Sparkles className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">Visual spacing and rhythm guidelines</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-app-elevated border border-app-border/50">
            <span className="text-[10px] font-bold text-app-text block mb-1">Padding and Nesting Strategy</span>
            <p className="text-[9px] text-app-subtle leading-normal">
              Always follow proportional hierarchy: Parent padding must be strictly greater than children padding, which must be strictly greater than gap spacing.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-app-elevated border border-app-border/50">
            <span className="text-[10px] font-bold text-app-text block mb-1">CSS Variables Output Snippet</span>
            <div className="flex items-center justify-between bg-app-inset p-2 rounded-lg border border-app-border/40 mt-1.5 font-mono text-[9px] text-app-muted">
              <span>--spacing-base: {base}px;</span>
              <span className="text-app-accent">1 unit = {base}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

