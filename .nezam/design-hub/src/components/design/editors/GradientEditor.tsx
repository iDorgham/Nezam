'use client'

import { useHub } from '@/store/hub.store'
import { Blend, Sparkles, Paintbrush, Eye } from 'lucide-react'

const GRADIENT_PRESETS = [
  { name: 'Sunset Bloom', brand: 'linear-gradient(135deg, #f093fb, #f5576c)', accent: 'linear-gradient(135deg, #4facfe, #00f2fe)', surface: 'linear-gradient(180deg, #fdfbfb, #ebedee)', mesh: { color1: '#f093fb', color2: '#f5576c', color3: '#4facfe', color4: '#00f2fe' } },
  { name: 'Emerald Forest', brand: 'linear-gradient(135deg, #11998e, #38ef7d)', accent: 'linear-gradient(135deg, #3e5151, #dec236)', surface: 'linear-gradient(180deg, #e0eafc, #cfdef3)', mesh: { color1: '#11998e', color2: '#38ef7d', color3: '#3e5151', color4: '#dec236' } },
  { name: 'Deep Midnight', brand: 'linear-gradient(135deg, #0c0c1d, #1a1a3e)', accent: 'linear-gradient(135deg, #667eea, #764ba2)', surface: 'linear-gradient(180deg, #1a1a2e, #16213e)', mesh: { color1: '#0c0c1d', color2: '#1a1a3e', color3: '#667eea', color4: '#764ba2' } },
  { name: 'Solar Flare', brand: 'linear-gradient(135deg, #f7971e, #ffd200)', accent: 'linear-gradient(135deg, #e65c00, #f9d423)', surface: 'linear-gradient(180deg, #f5f7fa, #c3cfe2)', mesh: { color1: '#f7971e', color2: '#ffd200', color3: '#e65c00', color4: '#f9d423' } },
]

const MESH_KEYS = ['color1', 'color2', 'color3', 'color4'] as const

export function GradientEditor() {
  const gradients = useHub((s) => s.design.tokens.gradients)
  const setToken = useHub((s) => s.designSetToken)

  function applyPreset(p: typeof GRADIENT_PRESETS[number]) {
    setToken('gradients.brand', p.brand)
    setToken('gradients.accent', p.accent)
    setToken('gradients.surface', p.surface)
    setToken('gradients.mesh.color1', p.mesh.color1)
    setToken('gradients.mesh.color2', p.mesh.color2)
    setToken('gradients.mesh.color3', p.mesh.color3)
    setToken('gradients.mesh.color4', p.mesh.color4)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Blend className="h-5 w-5 text-app-accent" />
            Brand Gradients & Mesh Seeds
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Define gradient presets and generative mesh seeds to create luxurious glowing backdrops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: Gradients Config */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-1 flex items-center gap-1.5">
              <Paintbrush className="h-4 w-4 text-app-accent" />
              Custom CSS Gradients
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal">
              Enter custom standard linear or radial gradient properties.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {([
              { key: 'brand', label: 'Primary Brand Gradient' },
              { key: 'accent', label: 'Secondary Accent Gradient' },
              { key: 'surface', label: 'Ambient Surface Gradient' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-app-border/60 bg-app-elevated/40">
                <div className="flex items-center gap-3 mr-4">
                  <div
                    className="h-9 w-14 rounded-lg border border-app-border shrink-0"
                    style={{ background: gradients[key] }}
                  />
                  <span className="text-xs font-bold text-app-text">{label}</span>
                </div>
                <input
                  type="text"
                  value={gradients[key]}
                  onChange={(e) => setToken(`gradients.${key}`, e.target.value)}
                  className="w-64 h-8 rounded-lg border border-app-border bg-app-inset px-2.5 text-xs font-mono text-app-accent focus:outline-none focus:border-app-accent"
                />
              </div>
            ))}
          </div>

          {/* Mesh Seeds */}
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-app-accent" />
              Generative Mesh Gradient Seeds
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {MESH_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-1.5 p-2 rounded-lg border border-app-border/40 bg-app-elevated/40 items-center">
                  <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">{key}</span>
                  <input
                    type="color"
                    value={gradients.mesh[key]}
                    onChange={(e) => setToken(`gradients.mesh.${key}`, e.target.value)}
                    className="h-8 w-full cursor-pointer rounded border border-app-border bg-transparent mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Preview & Presets */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Mesh Backdrop Presets
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Apply beautifully configured seeds and gradient combinations instantly.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {GRADIENT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="flex flex-col gap-1.5 p-2 rounded-xl border border-app-border/70 bg-app-elevated hover:border-app-accent hover:shadow-sm transition-all text-left"
                >
                  <div className="h-8 w-full rounded-lg" style={{ background: p.brand }} />
                  <span className="text-[9px] font-bold text-app-text leading-tight block">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end min-h-[140px] rounded-xl overflow-hidden relative p-4 shadow-sm">
            {/* Mesh gradient mock layer */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: `radial-gradient(circle at 0% 0%, ${gradients.mesh.color1} 0%, transparent 50%),
                             radial-gradient(circle at 100% 0%, ${gradients.mesh.color2} 0%, transparent 50%),
                             radial-gradient(circle at 100% 100%, ${gradients.mesh.color3} 0%, transparent 50%),
                             radial-gradient(circle at 0% 100%, ${gradients.mesh.color4} 0%, transparent 50%)`,
                backgroundColor: gradients.mesh.color1,
              }}
            />
            {/* Frosted badge on top */}
            <div className="relative z-10 p-3 rounded-lg bg-black/20 border border-white/10 backdrop-blur-md text-white flex flex-col">
              <span className="text-[10px] font-bold tracking-wider uppercase">Active Mesh Preview</span>
              <span className="text-[8px] opacity-75 mt-0.5 font-mono leading-none truncate">
                {gradients.mesh.color1} • {gradients.mesh.color2} • {gradients.mesh.color3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
