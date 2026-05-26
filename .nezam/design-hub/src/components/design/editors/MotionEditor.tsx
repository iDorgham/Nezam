'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'

const DURATION_PRESETS = [
  { name: 'Fast',   values: { fast: '80ms',  base: '150ms', slow: '250ms' } },
  { name: 'Normal', values: { fast: '100ms', base: '200ms', slow: '350ms' } },
  { name: 'Slow',   values: { fast: '150ms', base: '300ms', slow: '500ms' } },
]

const EASING_PRESETS = [
  { name: 'Default',  value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Ease in-out' },
  { name: 'Smooth',   value: 'cubic-bezier(0.32, 0.72, 0, 1)', desc: 'Sharp decelerate' },
  { name: 'Bounce',   value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Overshoot spring' },
  { name: 'Linear',   value: 'linear', desc: 'No easing' },
  { name: 'Ease Out', value: 'cubic-bezier(0, 0, 0.2, 1)', desc: 'Quick decelerate' },
]

export function MotionEditor() {
  const motion   = useHub((s) => s.design.tokens.motion)
  const setToken = useHub((s) => s.designSetToken)
  const [playing, setPlaying] = useState<string | null>(null)

  function playDemo(key: string) {
    setPlaying(key)
    setTimeout(() => setPlaying(null), 600)
  }

  function applyDurationPreset(preset: typeof DURATION_PRESETS[number]) {
    Object.entries(preset.values).forEach(([k, v]) => setToken(`motion.duration.${k}`, v))
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Motion</h2>
        <p className="text-xs text-app-subtle mt-0.5">Durations and easing curves for animations</p>
      </div>

      {/* Duration presets */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-app-text">Duration Preset</h3>
        <div className="flex gap-2">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyDurationPreset(preset)}
              className="flex-1 rounded-app-sm border border-app-border bg-app-elevated p-3 text-left hover:border-app-border-strong transition-all"
            >
              <p className="text-xs font-medium text-app-text">{preset.name}</p>
              <div className="mt-2 flex flex-col gap-0.5">
                {Object.entries(preset.values).map(([k, v]) => (
                  <p key={k} className="text-[10px] font-mono text-app-subtle">{k}: {v}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration values */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Duration Values</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['fast','base','slow'] as const).map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide capitalize">{key}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={motion.duration[key]}
                  onChange={(e) => setToken(`motion.duration.${key}`, e.target.value)}
                  className="flex-1 h-7 rounded-app-sm border border-app-border bg-app-inset px-2 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
                />
                {/* Demo button */}
                <button
                  onClick={() => playDemo(key)}
                  className="h-7 w-7 flex items-center justify-center rounded-app-sm border border-app-border bg-app-elevated hover:bg-app-border text-app-subtle text-xs"
                  title="Play"
                >
                  ▶
                </button>
              </div>
              {/* Demo bar */}
              <div className="h-1.5 rounded-full bg-app-border overflow-hidden">
                {playing === key && (
                  <div
                    className="h-full bg-app-accent rounded-full"
                    style={{
                      animation: `motion-demo ${motion.duration[key]} ${motion.easing.default} forwards`,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Easing */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Easing Curves</h3>
        <div className="flex flex-col gap-2">
          {(['default','smooth','bounce'] as const).map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide capitalize">{key}</label>
              </div>
              <div className="flex gap-2">
                {EASING_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setToken(`motion.easing.${key}`, p.value)}
                    className={[
                      'text-[10px] px-2 py-1 rounded border transition-all',
                      motion.easing[key] === p.value
                        ? 'border-app-accent bg-app-accent-subtle text-app-text'
                        : 'border-app-border text-app-subtle hover:border-app-border-strong',
                    ].join(' ')}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={motion.easing[key]}
                onChange={(e) => setToken(`motion.easing.${key}`, e.target.value)}
                className="h-6 rounded-app-sm border border-app-border bg-app-inset px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes motion-demo { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}
