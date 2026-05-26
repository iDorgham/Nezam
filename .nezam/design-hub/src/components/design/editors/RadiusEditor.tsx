'use client'

import { useHub } from '@/store/hub.store'

const RADIUS_STEPS = ['none','sm','md','lg','xl','full'] as const

const PRESETS = [
  { name: 'Sharp',    values: { none:'0px', sm:'2px',   md:'4px',   lg:'6px',   xl:'8px',   full:'9999px' } },
  { name: 'Rounded',  values: { none:'0px', sm:'4px',   md:'8px',   lg:'12px',  xl:'16px',  full:'9999px' } },
  { name: 'Soft',     values: { none:'0px', sm:'6px',   md:'12px',  lg:'18px',  xl:'24px',  full:'9999px' } },
  { name: 'Pill',     values: { none:'0px', sm:'8px',   md:'16px',  lg:'24px',  xl:'32px',  full:'9999px' } },
]

const DEMO_TEXT: Record<typeof RADIUS_STEPS[number], string> = {
  none: 'None',
  sm:   'Small',
  md:   'Medium',
  lg:   'Large',
  xl:   'X-Large',
  full: 'Full pill',
}

export function RadiusEditor() {
  const radius   = useHub((s) => s.design.tokens.radius)
  const setToken = useHub((s) => s.designSetToken)
  const brand500 = useHub((s) => s.design.tokens.colors.brand['500'])

  function applyPreset(preset: typeof PRESETS[number]) {
    Object.entries(preset.values).forEach(([key, val]) => {
      setToken(`radius.${key}`, val)
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-app-text">Border Radius</h2>
        <p className="text-xs text-app-subtle mt-0.5">Control the roundness of UI elements</p>
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Presets</h3>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center gap-2 rounded-app-sm border border-app-border bg-app-elevated p-3 hover:border-app-border-strong transition-all group"
            >
              <div
                className="h-10 w-10 border-2 border-app-border-strong group-hover:border-app-accent transition-colors"
                style={{
                  borderRadius: preset.values.md,
                  backgroundColor: brand500 + '20',
                  borderColor: brand500 + '60',
                }}
              />
              <span className="text-[11px] text-app-muted group-hover:text-app-text">{preset.name}</span>
              <span className="text-[10px] font-mono text-app-subtle">{preset.values.md}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Individual steps */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-app-text">Scale</h3>
        <div className="grid grid-cols-3 gap-3">
          {RADIUS_STEPS.map((step) => {
            const val = radius[step]
            return (
              <div key={step} className="flex flex-col gap-2 rounded-app-sm border border-app-border bg-app-elevated p-3">
                {/* Visual demo */}
                <div className="flex justify-center">
                  <div
                    className="h-12 w-16"
                    style={{
                      borderRadius: step === 'full' ? '9999px' : val,
                      backgroundColor: brand500 + '20',
                      border: `2px solid ${brand500}60`,
                    }}
                  />
                </div>

                {/* Step label */}
                <p className="text-[11px] font-medium text-app-text text-center">{DEMO_TEXT[step]}</p>

                {/* Value input */}
                {step !== 'none' && step !== 'full' ? (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setToken(`radius.${step}`, e.target.value)}
                    className="w-full h-6 rounded border border-app-border bg-app-inset px-2 text-[11px] font-mono text-app-text text-center focus:outline-none focus:border-app-accent"
                  />
                ) : (
                  <p className="text-[10px] font-mono text-app-subtle text-center">{val}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
