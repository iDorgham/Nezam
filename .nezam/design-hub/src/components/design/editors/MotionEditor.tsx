'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Zap, Play, Sparkles, Sliders, CheckCircle, RefreshCw, Layers } from 'lucide-react'

const DURATION_PRESETS = [
  { name: 'Fast (Mobile First)',   values: { fast: '80ms',  base: '150ms', slow: '250ms' } },
  { name: 'Normal (Standard)',     values: { fast: '100ms', base: '200ms', slow: '350ms' } },
  { name: 'Slower (Editorial)',    values: { fast: '150ms', base: '300ms', slow: '500ms' } },
] as const

const EASING_PRESETS = [
  { name: 'Default',  value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Standard ease-in-out' },
  { name: 'Smooth',   value: 'cubic-bezier(0.32, 0.72, 0, 1)', desc: 'Sharp decelerate' },
  { name: 'Bounce',   value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Spring overshoot' },
  { name: 'Linear',   value: 'linear', desc: 'Flat linear' },
] as const

export function MotionEditor() {
  const motion   = useHub((s) => s.design.tokens.motion)
  const setToken = useHub((s) => s.designSetToken)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])
  
  const [playing, setPlaying] = useState<string | null>(null)
  const [demoType, setDemoType] = useState<'slide' | 'scale' | 'fade'>('slide')

  function triggerDemo(key: string) {
    setPlaying(key)
    setTimeout(() => setPlaying(null), 800)
  }

  function applyDurationPreset(preset: typeof DURATION_PRESETS[number]) {
    Object.entries(preset.values).forEach(([k, v]) => setToken(`motion.duration.${k}`, v))
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-app-accent" />
            Motion & Animation
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">Fine-tune transition easing curves, duration presets, and micro-interaction spring physics</p>
        </div>
      </div>

      {/* Duration presets */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">Duration Presets</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyDurationPreset(preset)}
              className="flex flex-col text-left p-3.5 rounded-xl border transition-all bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80"
            >
              <span className="text-[11px] font-bold text-app-text">{preset.name}</span>
              <div className="mt-2.5 flex flex-col gap-0.5 w-full">
                {Object.entries(preset.values).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[9px] font-mono text-app-muted">
                    <span>{k}:</span>
                    <span className="font-semibold text-app-accent">{v}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Animation Visualizer Playground */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-app-accent" />
              <h3 className="text-xs font-semibold text-app-text">Animation Sandbox Playground</h3>
            </div>
            <div className="flex items-center gap-1 bg-app-elevated border border-app-border/60 rounded-lg p-0.5">
              {(['slide','scale','fade'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setDemoType(type)}
                  className={`h-6 px-2.5 rounded text-[10px] capitalize font-semibold transition-all ${
                    demoType === type ? 'bg-app-inset text-app-text shadow-sm' : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden min-h-[160px]">
            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Live animation sandbox</span>
            
            {/* Interactive Object */}
            <div className="w-full max-w-[240px] flex flex-col items-center justify-center">
              <div 
                className="w-12 h-12 rounded-xl bg-app-accent relative transition-all shadow-md"
                style={{ 
                  backgroundColor: brand500,
                  transform: playing ? (
                    demoType === 'slide' 
                      ? 'translateX(60px)' 
                      : demoType === 'scale' 
                        ? 'scale(1.25)' 
                        : 'none'
                  ) : 'none',
                  opacity: playing && demoType === 'fade' ? 0.2 : 1,
                  transition: playing ? `all ${motion.duration.base} ${motion.easing.default}` : 'none'
                }}
              />
              <span className="text-[9px] font-mono text-app-muted mt-3 uppercase tracking-wide">
                Curve: {motion.easing.default.slice(0, 24)}...
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="h-4 w-4 text-app-accent" />
              <h3 className="text-xs font-semibold text-app-text">Precision Easing</h3>
            </div>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Select or customize standard transition easing cubic-bezier curves.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 p-2 bg-app-elevated border border-app-border/60 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted">Easing Curve Formula:</span>
              <input
                type="text"
                value={motion.easing.default}
                onChange={(e) => setToken('motion.easing.default', e.target.value)}
                className="w-full h-7 rounded-lg border border-app-border bg-app-inset px-2.5 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider font-mono text-app-muted ml-0.5">Presets:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {EASING_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setToken('motion.easing.default', p.value)}
                    className={`h-7 rounded-lg border text-[10px] font-semibold transition-all ${
                      motion.easing.default === p.value
                        ? 'border-app-accent bg-app-accent/10 text-app-accent'
                        : 'border-app-border text-app-muted hover:border-app-border-strong bg-app-elevated/40'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Durations scale list */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-app-accent" />
          Proportional durations scale
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(['fast','base','slow'] as const).map((key) => (
            <div key={key} className="flex flex-col gap-3 p-3.5 rounded-xl bg-app-elevated border border-app-border/50 hover:border-app-border transition-all">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-app-text capitalize">{key} duration</span>
                <span className="text-[10px] font-mono text-app-accent font-semibold">{motion.duration[key]}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={motion.duration[key]}
                  onChange={(e) => setToken(`motion.duration.${key}`, e.target.value)}
                  className="flex-1 h-7 rounded-lg border border-app-border bg-app-inset px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
                />
                <button
                  onClick={() => triggerDemo(key)}
                  className="h-7 px-3 rounded-lg bg-app-inset border border-app-border text-app-text hover:bg-app-elevated active:scale-95 transition-all text-[11px] font-semibold flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

