'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { Sparkles, Eye, Sun, Moon } from 'lucide-react'

const BLUR_KEYS = ['sm', 'md', 'lg', 'xl'] as const

export function GlassEditor() {
  const glass = useHub((s) => s.design.tokens.glass)
  const setToken = useHub((s) => s.designSetToken)
  const [selectedBlur, setSelectedBlur] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-app-accent" />
            Glass & Blur Effects
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Define frosted backdrop-filters, custom overlays, and glass structural borders to create sleek visual depth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-1">Blur Calibration Scale</h3>
            <p className="text-[10px] text-app-subtle leading-normal">
              Fine-tune backdrop filter blurs in pixel widths.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {BLUR_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider text-center">{key}</span>
                <input
                  type="text"
                  value={glass.blur[key]}
                  onChange={(e) => setToken(`glass.blur.${key}`, e.target.value)}
                  className="h-8 rounded-lg border border-app-border bg-app-elevated px-2 text-xs font-mono font-bold text-app-text text-center focus:outline-none focus:border-app-accent"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Frosted Tint</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={glass.tint}
                  onChange={(e) => setToken('glass.tint', e.target.value)}
                  className="h-8 w-8 shrink-0 cursor-pointer rounded border border-app-border bg-transparent"
                />
                <input
                  type="text"
                  value={glass.tint}
                  onChange={(e) => setToken('glass.tint', e.target.value)}
                  className="flex-1 h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Border Opacity</span>
              <input
                type="text"
                value={glass.borderOpacity}
                onChange={(e) => setToken('glass.borderOpacity', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Glass Shadow Depth</span>
              <input
                type="text"
                value={glass.shadow}
                onChange={(e) => setToken('glass.shadow', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Sandbox */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Glassmorphism Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Select a blur scale to preview rendering over a modern gradient backdrop:
            </p>
            <div className="flex gap-1.5 mb-4">
              {BLUR_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedBlur(k)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                    selectedBlur === k
                      ? 'border-app-accent bg-app-accent/15 text-app-accent'
                      : 'border-app-border bg-app-elevated/40 text-app-muted hover:border-app-border'
                  }`}
                >
                  {k} ({glass.blur[k]})
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex-1 min-h-[160px] rounded-xl overflow-hidden relative flex items-center justify-center p-6"
            style={{
              background: 'radial-gradient(circle at 10% 20%, rgb(255, 197, 120) 0%, rgb(251, 107, 107) 30.7%, rgb(184, 98, 255) 70.1%, rgb(35, 136, 255) 90%)',
            }}
          >
            {/* Frosted Layer Card */}
            <div
              className="w-full h-full max-w-[220px] max-h-[120px] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative border text-white shadow-lg"
              style={{
                backgroundColor: glass.tint,
                backdropFilter: `blur(${glass.blur[selectedBlur]})`,
                WebkitBackdropFilter: `blur(${glass.blur[selectedBlur]})`,
                borderColor: `rgba(255,255,255,${glass.borderOpacity})`,
                boxShadow: glass.shadow,
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">Glass Pane</span>
                <Sparkles className="h-3.5 w-3.5 opacity-80" />
              </div>
              <div className="mt-4">
                <span className="text-[9px] opacity-75 font-mono block">
                  blur({glass.blur[selectedBlur]})
                </span>
                <span className="text-[9px] opacity-75 font-mono block">
                  border-opacity: {glass.borderOpacity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
