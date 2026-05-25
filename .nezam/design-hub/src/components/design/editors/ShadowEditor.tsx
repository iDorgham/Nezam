'use client'

import { useHub } from '@/store/hub.store'

const SHADOW_STEPS = ['none','sm','md','lg','xl'] as const

export function ShadowEditor() {
  const shadows  = useHub((s) => s.design.tokens.shadows)
  const setToken = useHub((s) => s.designSetToken)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Shadows</h2>
        <p className="text-xs text-app-subtle mt-0.5">Elevation scale for surfaces and components</p>
      </div>

      <div className="flex flex-col gap-4">
        {SHADOW_STEPS.map((step) => {
          const val = shadows[step]
          return (
            <div key={step} className="flex items-start gap-4">
              {/* Demo box */}
              <div
                className="h-16 w-20 shrink-0 rounded-app bg-app-surface border border-app-border/50 flex items-center justify-center"
                style={{ boxShadow: step === 'none' ? 'none' : val }}
              >
                <span className="text-[10px] text-app-muted font-medium">{step}</span>
              </div>

              {/* Value editor */}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs font-medium text-app-text capitalize">{step === 'none' ? 'No shadow' : step}</p>
                {step !== 'none' ? (
                  <textarea
                    value={val}
                    onChange={(e) => setToken(`shadows.${step}`, e.target.value)}
                    className="w-full h-12 rounded-app-sm border border-app-border bg-app-inset px-2 py-1.5 text-[11px] font-mono text-app-text resize-none focus:outline-none focus:border-app-accent"
                    placeholder="0 4px 12px rgba(0,0,0,0.1)"
                  />
                ) : (
                  <p className="text-[11px] font-mono text-app-subtle">none</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Live demo */}
      <div className="rounded-app-sm border border-app-border bg-app-elevated p-4">
        <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide mb-3">Live Preview</p>
        <div className="flex gap-6 flex-wrap">
          {(['sm','md','lg','xl'] as const).map((step) => (
            <div
              key={step}
              className="h-12 w-12 rounded-app bg-app-surface border border-app-border/30 flex items-center justify-center"
              style={{ boxShadow: shadows[step] }}
            >
              <span className="text-[9px] text-app-muted">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
