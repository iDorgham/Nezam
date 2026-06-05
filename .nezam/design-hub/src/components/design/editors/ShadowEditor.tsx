'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import {
  Layers,
  Sparkles,
  SlidersHorizontal,
  CircleCheck,
  Eye,
  Zap,
  Info
} from 'lucide-react'

const SHADOW_STEPS = ['none','sm','md','lg','xl'] as const

export function ShadowEditor() {
  const shadows  = useHub((s) => s.design.tokens.shadows)
  const setToken = useHub((s) => s.designSetToken)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])

  const [selectedShadow, setSelectedShadow] = useState<typeof SHADOW_STEPS[number]>('md')
  const [glowIntensity, setGlowIntensity] = useState<number>(30) // percentage

  // Visual helper to parse shadow components roughly
  const currentVal = shadows[selectedShadow]

  function applyBrandGlow() {
    // Generate a beautiful brand colored shadow based on brand500
    const amt = glowIntensity / 100
    const newGlow = `0 0 20px rgba(${parseInt(brand500.slice(1, 3), 16)}, ${parseInt(brand500.slice(3, 5), 16)}, ${parseInt(brand500.slice(5, 7), 16)}, ${amt.toFixed(2)})`
    setToken('shadows.glow', newGlow)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-app-accent" />
            Elevation & Shadows
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Define visual layering, card elevations, inner inset borders, and brand glowing highlights</p>
        </div>
      </div>

      {/* Brand Glow Sandbox */}
      {shadows.glow && (
        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-app-accent" />
            <h3 className="text-xs font-semibold text-app-text">Interactive Brand Glow Generator</h3>
          </div>
          <p className="text-[11px] text-app-subtle leading-relaxed mb-4">
            Create an immersive glowing effect that matches your primary brand accent color. Perfect for highlights, hover rings, or hero buttons.
          </p>
          <div className="flex items-center gap-4 bg-app-elevated p-4 rounded-xl border border-app-border/50">
            <div className="flex-1 flex items-center gap-3">
              <span className="text-[10px] font-mono text-app-muted">Opacity:</span>
              <input
                type="range"
                min="5"
                max="60"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-lg bg-app-inset cursor-pointer accent-app-accent"
              />
              <span className="text-[11px] font-mono font-bold text-app-text w-8">{glowIntensity}%</span>
            </div>
            <button
              onClick={applyBrandGlow}
              className="flex items-center gap-1.5 bg-app-accent hover:bg-app-accent-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm active:scale-95 transition-all"
            >
              <Zap className="h-3.5 w-3.5" />
              Apply Glow Shadow
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Preview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-app-accent" />
            <h3 className="text-xs font-semibold text-app-text">Elevation Sandbox</h3>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden min-h-[180px]">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Interactive Elevation Preview</span>
            
            {/* Elevation Demo Card */}
            <div 
              className="w-44 h-24 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
              style={{ 
                boxShadow: selectedShadow === 'none' ? 'none' : shadows[selectedShadow] 
              }}
            >
              <span className="text-xs font-bold text-app-text capitalize">{selectedShadow} Level</span>
              <span className="text-[9px] font-mono text-app-accent font-semibold mt-1">Elevated Surface</span>
            </div>
          </div>
        </div>

        {/* Precise Editor */}
        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-app-accent" />
              <h3 className="text-xs font-semibold text-app-text">Precision Tokens</h3>
            </div>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Directly edit the visual shadows using CSS Box Shadow rules. Multiple layers supported.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 p-2 bg-app-elevated border border-app-border/60 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted">Select Step:</span>
              <select
                value={selectedShadow}
                onChange={(e) => setSelectedShadow(e.target.value as typeof SHADOW_STEPS[number])}
                className="w-full h-7 rounded-lg border border-app-border bg-app-inset text-xs px-2 cursor-pointer focus:outline-none focus:border-app-accent font-semibold"
              >
                {SHADOW_STEPS.map(step => (
                  <option key={step} value={step}>{step === 'none' ? 'No shadow' : `${step} scale`}</option>
                ))}
              </select>
            </div>

            {selectedShadow !== 'none' ? (
              <div className="flex flex-col gap-1.5 p-2 bg-app-elevated border border-app-border/60 rounded-xl">
                <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted">Shadow CSS Formula:</span>
                <textarea
                  value={shadows[selectedShadow]}
                  onChange={(e) => setToken(`shadows.${selectedShadow}`, e.target.value)}
                  className="w-full h-14 rounded-lg bg-app-inset border border-app-border p-2 text-[10px] font-mono text-app-text resize-none focus:outline-none focus:border-app-accent leading-normal"
                  placeholder="0 4px 12px rgba(0,0,0,0.08)"
                />
              </div>
            ) : (
              <div className="p-3 text-[10px] text-app-muted rounded-xl bg-app-elevated/40 border border-dashed border-app-border text-center font-medium">
                Step 'none' uses standard flat CSS rule: <span className="font-mono text-app-accent font-semibold">none</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Individual Cards Grid */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-app-accent" />
          Proportional elevations scale
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {SHADOW_STEPS.map((step) => {
            const val = shadows[step]
            const isSel = selectedShadow === step
            return (
              <button
                key={step}
                onClick={() => setSelectedShadow(step)}
                className={`flex flex-col gap-3 rounded-xl border p-3 text-left transition-all ${
                  isSel
                    ? 'bg-app-elevated border-app-accent/30 shadow-sm'
                    : 'bg-app-elevated/40 border-app-border/50 hover:border-app-border'
                }`}
              >
                {/* Visual demo */}
                <div className="flex justify-center py-2 bg-app-inset rounded-lg">
                  <div
                    className="h-10 w-10 bg-white/5 border border-white/10"
                    style={{
                      borderRadius: '8px',
                      boxShadow: step === 'none' ? 'none' : val,
                    }}
                  />
                </div>

                <div className="text-center w-full">
                  <span className="text-[11px] font-bold text-app-text capitalize block">{step}</span>
                  <span className="text-[8px] font-mono text-app-muted truncate block mt-0.5">{step === 'none' ? 'flat' : 'shadow'}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

