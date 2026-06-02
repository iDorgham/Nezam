'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { generateColorScale } from '@/lib/utils'
import type { ColorScale } from '@/types/design'
import {
  getContrastRatio,
  meetsWCAG,
  findNearestCompliant,
  simulateColorBlindness,
  generateAccessibleScale
} from '@/lib/color-a11y'
import { hexToHsl, hslToHex } from '@/components/theming/color-utils'
import {
  Droplets,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings2,
  RefreshCw,
  Palette,
  Check,
  Zap,
  Info
} from 'lucide-react'

const SCALE_STEPS = ['50','100','200','300','400','500','600','700','800','900','950'] as const

// ─── Simple standalone Hex to OKLCH Converter ──────────────────────────────────
function hexToOklch(hex: string): { l: number; c: number; h: number } {
  // 1. Hex to RGB
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  // 2. Linearize sRGB
  const f = (x: number) => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  const rl = f(r)
  const gl = f(g)
  const bl = f(b)

  // 3. To LMS
  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
  const m_ = 0.1167115874 * rl + 0.6805888629 * gl + 0.2027095503 * bl
  const s_ = 0.0188191710 * rl + 0.2811294936 * gl + 0.7000893354 * bl

  // 4. Cube root
  const l_cube = Math.cbrt(l_)
  const m_cube = Math.cbrt(m_)
  const s_cube = Math.cbrt(s_)

  // 5. To Oklab
  const L = 0.2104542553 * l_cube + 0.7936177850 * m_cube - 0.0040720468 * s_cube
  const a = 1.9779984951 * l_cube - 2.4285922050 * m_cube + 0.4505937099 * s_cube
  const b_lab = 0.0259040371 * l_cube + 0.7827717662 * m_cube - 0.8086757660 * s_cube

  // 6. To Oklch
  const C = Math.sqrt(a * a + b_lab * b_lab)
  let h = Math.atan2(b_lab, a) * (180 / Math.PI)
  if (h < 0) h += 360

  return { l: L, c: C, h }
}

function ColorSwatch({
  color,
  label,
  onClick,
  isSelected
}: {
  color: string
  label: string
  onClick: () => void
  isSelected: boolean
}) {
  const oklch = hexToOklch(color)
  const isHighChroma = oklch.c > 0.24 && (oklch.l < 0.2 || oklch.l > 0.85)

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col gap-1 items-start p-1.5 rounded-lg border transition-all ${
        isSelected 
          ? 'bg-app-elevated border-app-accent/40 shadow-sm ring-1 ring-app-accent/20' 
          : 'border-transparent hover:bg-app-elevated/40'
      }`}
      title={`${label}: ${color} (L: ${oklch.l.toFixed(2)}, C: ${oklch.c.toFixed(2)}, H: ${Math.round(oklch.h)}°)`}
    >
      <div
        className="h-9 w-full rounded-md border border-black/10 transition-transform group-hover:scale-[1.03] relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        {isHighChroma && (
          <span className="absolute top-0.5 right-0.5 text-[8px] bg-red-500/90 text-white px-1 rounded" title="High Chroma Extreme">⚠️</span>
        )}
      </div>
      <div className="flex justify-between w-full items-center">
        <span className="text-[10px] font-mono text-app-text font-medium">{label}</span>
        <span className="text-[8px] font-mono text-app-subtle">C:{oklch.c.toFixed(2)}</span>
      </div>
      <span className="text-[9px] font-mono text-app-muted opacity-80">{color}</span>
    </button>
  )
}

function ColorScaleRow({
  title,
  scale,
  path,
  selectedKey,
  setSelectedKey
}: {
  title: string
  scale: ColorScale
  path: string
  selectedKey: string | null
  setSelectedKey: (key: string | null) => void
}) {
  const setToken = useHub((s) => s.designSetToken)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editValue, setEditValue]     = useState('')

  function handleClickSwatch(step: string, current: string) {
    setSelectedKey(`${path}.${step}`)
    setEditingStep(step)
    setEditValue(current)
  }

  function commitEdit() {
    if (editingStep && /^#[0-9a-fA-F]{6}$/.test(editValue)) {
      setToken(`${path}.${editingStep}`, editValue)
    }
    setEditingStep(null)
  }

  function handleRegenerate() {
    const base = scale['500']
    const newScale = generateAccessibleScale(base)
    Object.entries(newScale).forEach(([step, val]) => {
      setToken(`${path}.${step}`, val)
    })
  }

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-app-border/80">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-app-accent" />
          <h3 className="text-xs font-semibold text-app-text">{title}</h3>
        </div>
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-1 text-[10px] text-app-subtle hover:text-app-accent px-2 py-1 rounded bg-app-elevated border border-app-border/60 transition-all active:scale-95"
          title="Auto-generate HSL-balanced accessible scale from 500"
        >
          <RefreshCw className="h-3 w-3" />
          Regen Accessible Scale
        </button>
      </div>

      {/* Scale swatches */}
      <div className="grid grid-cols-11 gap-1.5">
        {SCALE_STEPS.map((step) => (
          <ColorSwatch
            key={step}
            color={scale[step]}
            label={step}
            isSelected={selectedKey === `${path}.${step}`}
            onClick={() => handleClickSwatch(step, scale[step])}
          />
        ))}
      </div>

      {/* Inline editor */}
      {editingStep && (
        <div className="flex items-center gap-3 mt-3.5 p-3 rounded-xl bg-app-elevated border border-app-accent/25 animate-fade-in">
          <div
            className="h-8 w-8 rounded-lg shrink-0 border border-black/10 shadow-sm"
            style={{ backgroundColor: editValue }}
          />
          <input
            type="color"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
          />
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[9px] text-app-muted font-mono uppercase">{path}.{editingStep}</span>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-8 rounded-lg bg-app-inset border border-app-border px-3 text-xs font-mono text-app-text focus:outline-none focus:border-app-accent"
              placeholder="#111827"
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingStep(null) }}
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={commitEdit} 
              className="h-8 px-3 rounded-lg bg-app-accent hover:bg-app-accent-hover text-white text-xs font-medium transition-colors"
            >
              Apply
            </button>
            <button 
              onClick={() => setEditingStep(null)} 
              className="h-8 px-3 rounded-lg bg-app-inset border border-app-border text-app-muted hover:text-app-text text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SemanticRow() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const semantic = tokens.colors.semantic

  const SEMANTICS = [
    { key: 'success', label: 'Success', emoji: '✅', color: '#16a34a' },
    { key: 'warning', label: 'Warning', emoji: '⚠️', color: '#d97706' },
    { key: 'error',   label: 'Error',   emoji: '🔴', color: '#dc2626' },
    { key: 'info',    label: 'Info',    emoji: 'ℹ️', color: '#0284c7' },
  ] as const

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <h3 className="text-xs font-semibold text-app-text mb-4">Semantic Colors</h3>
      <div className="grid grid-cols-4 gap-4">
        {SEMANTICS.map(({ key, label, emoji }) => (
          <div key={key} className="flex flex-col gap-2 p-3.5 rounded-xl bg-app-elevated border border-app-border/60 transition-all hover:border-app-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{emoji}</span>
                <span className="text-[11px] font-semibold text-app-text">{label}</span>
              </div>
              <span className="text-[9px] font-mono text-app-muted">{semantic[key]}</span>
            </div>
            <div
              className="h-12 rounded-lg border border-black/10 shadow-sm relative overflow-hidden"
              style={{ backgroundColor: semantic[key] }}
            />
            <input
              type="color"
              value={semantic[key]}
              onChange={(e) => setToken(`colors.semantic.${key}`, e.target.value)}
              className="w-full h-8 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function WcagBadge({ fg, bg }: { fg: string; bg: string }) {
  const ratio = getContrastRatio(fg, bg)
  const aa    = meetsWCAG(ratio, 'AA')
  const aaa   = meetsWCAG(ratio, 'AAA')
  let label   = `${ratio.toFixed(1)}:1`
  let cls     = 'bg-red-500/10 text-red-500 border-red-500/20'

  if (aaa) { 
    label = `AAA ${ratio.toFixed(1)}:1`
    cls = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
  } else if (aa) { 
    label = `AA ${ratio.toFixed(1)}:1`
    cls = 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
  }

  return (
    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

function SurfaceRow() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const surface  = tokens.colors.surface
  const text     = tokens.colors.text
  const bg       = tokens.colors.surface.bg

  function handleAutoFix(key: string) {
    const compliant = findNearestCompliant(text[key as keyof typeof text], bg)
    if (compliant !== text[key as keyof typeof text]) {
      setToken(`colors.text.${key}`, compliant)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      {/* Surface tokens */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-app-text flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-app-accent" />
          Surface Foundations
        </h3>
        <div className="flex flex-col gap-2">
          {(['bg','panel','overlay','border'] as const).map((key) => (
            <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-app-elevated border border-app-border/50 hover:border-app-border transition-all">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={surface[key]}
                  onChange={(e) => setToken(`colors.surface.${key}`, e.target.value)}
                  className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold capitalize text-app-text">{key}</span>
                  <span className="text-[9px] font-mono text-app-muted">{surface[key]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dark surface tokens */}
        {tokens.colors.darkSurface && (
          <>
            <h3 className="text-xs font-semibold text-app-text mt-3">Dark Surface Overrides</h3>
            <div className="flex flex-col gap-2">
              {(['bg','panel','overlay','border'] as const).map((key) => (
                <div key={`dark-${key}`} className="flex items-center justify-between p-2 rounded-xl bg-app-elevated border border-app-border/50 hover:border-app-border transition-all">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens.colors.darkSurface[key]}
                      onChange={(e) => setToken(`colors.darkSurface.${key}`, e.target.value)}
                      className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold capitalize text-app-text">{key}</span>
                      <span className="text-[9px] font-mono text-app-muted">{tokens.colors.darkSurface[key]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Text tokens */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-app-text flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-app-accent" />
          Text & Contrast Auditing
        </h3>
        <div className="flex flex-col gap-2">
          {(['primary','secondary','muted','disabled'] as const).map((key) => {
            const color = text[key]
            const ratio = getContrastRatio(color, bg)
            const isCompliant = meetsWCAG(ratio, 'AA')
            return (
              <div key={key} className="flex flex-col gap-2 p-2.5 rounded-xl bg-app-elevated border border-app-border/50 hover:border-app-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setToken(`colors.text.${key}`, e.target.value)}
                      className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold capitalize text-app-text">{key}</span>
                      <span className="text-[9px] font-mono text-app-muted">{color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <WcagBadge fg={color} bg={bg} />
                    {!isCompliant && (
                      <button
                        onClick={() => handleAutoFix(key)}
                        className="flex items-center gap-0.5 text-[10px] text-red-500 hover:text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded"
                        title="Auto-fix to meet WCAG AA compliance"
                      >
                        <Zap className="h-2.5 w-2.5" />
                        Fix
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="rounded-lg p-2 flex items-center border border-black/5"
                  style={{ backgroundColor: bg, color }}
                >
                  <span className="text-xs">المصرية Masri: The quick brown fox jumps over the lazy dog.</span>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Dark text tokens */}
        {tokens.colors.darkText && (
          <>
            <h3 className="text-xs font-semibold text-app-text mt-3">Dark Text Overrides</h3>
            <div className="flex flex-col gap-2">
              {(['primary','secondary','muted','disabled'] as const).map((key) => {
                const color = tokens.colors.darkText[key]
                const darkBg = tokens.colors.darkSurface?.bg ?? '#18181b'
                const ratio = getContrastRatio(color, darkBg)
                const isCompliant = meetsWCAG(ratio, 'AA')
                return (
                  <div key={`dark-t-${key}`} className="flex flex-col gap-2 p-2.5 rounded-xl bg-app-elevated border border-app-border/50 hover:border-app-border transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setToken(`colors.darkText.${key}`, e.target.value)}
                          className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border border-app-border bg-transparent p-0.5"
                        />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold capitalize text-app-text">{key}</span>
                          <span className="text-[9px] font-mono text-app-muted">{color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <WcagBadge fg={color} bg={darkBg} />
                        {!isCompliant && (
                          <button
                            onClick={() => {
                              const compliant = findNearestCompliant(color, darkBg)
                              if (compliant !== color) setToken(`colors.darkText.${key}`, compliant)
                            }}
                            className="flex items-center gap-0.5 text-[10px] text-red-500 hover:text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded"
                          >
                            <Zap className="h-2.5 w-2.5" />
                            Fix
                          </button>
                        )}
                      </div>
                    </div>
                    <div
                      className="rounded-lg p-2 flex items-center border border-white/5"
                      style={{ backgroundColor: darkBg, color }}
                    >
                      <span className="text-xs">المصرية Masri: The quick brown fox jumps over the lazy dog.</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ContrastMatrixTable() {
  const tokens = useHub((s) => s.design.tokens)
  const bg = tokens.colors.surface.bg
  const panel = tokens.colors.surface.panel
  const text = tokens.colors.text

  const backgrounds = [
    { label: 'Base Background', color: bg },
    { label: 'Panel Surface', color: panel },
  ]
  const foregrounds = [
    { label: 'Primary Text', color: text.primary },
    { label: 'Secondary Text', color: text.secondary },
    { label: 'Muted Text', color: text.muted },
  ]

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
        Accessibility Contrast Matrix
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-app-border/60">
              <th className="py-2.5 text-[11px] font-semibold text-app-muted">Background \ Text</th>
              {foregrounds.map((fg) => (
                <th key={fg.label} className="py-2.5 px-3 text-[11px] font-semibold text-app-text">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-3.5 rounded border border-black/10" style={{ backgroundColor: fg.color }} />
                    {fg.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backgrounds.map((bgObj) => (
              <tr key={bgObj.label} className="border-b border-app-border/30 last:border-0 hover:bg-app-elevated/20">
                <td className="py-3 text-[11px] font-semibold text-app-text">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-3.5 rounded border border-black/10" style={{ backgroundColor: bgObj.color }} />
                    {bgObj.label}
                  </div>
                </td>
                {foregrounds.map((fg) => {
                  const ratio = getContrastRatio(fg.color, bgObj.color)
                  const aa = meetsWCAG(ratio, 'AA')
                  return (
                    <td key={fg.label} className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-semibold font-mono ${aa ? 'text-emerald-500' : 'text-red-500'}`}>
                          {ratio.toFixed(2)}:1
                        </span>
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border max-w-max ${
                          aa 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {aa ? 'PASS AA' : 'FAIL'}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ColorStrategySection() {
  const tokens = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const [activeStrategy, setActiveStrategy] = useState<'restrained' | 'committed' | 'full' | 'drenched'>('restrained')

  const strategies = [
    {
      id: 'restrained',
      title: 'Restrained (App Default)',
      desc: 'Tinted neutrals carrying 90% of the surface, with exactly one brand accent ≤10%. Ultra premium.',
      accentPct: '10%'
    },
    {
      id: 'committed',
      title: 'Committed (Brand Default)',
      desc: 'One saturated primary color anchors 30–60% of the screen. Bold, expressive, modern.',
      accentPct: '50%'
    },
    {
      id: 'full',
      title: 'Full Palette',
      desc: '3 to 4 distinct semantic roles working dynamically. Ideal for dashboards and visualization.',
      accentPct: 'Varies'
    },
    {
      id: 'drenched',
      title: 'Drenched',
      desc: 'The surface IS the color. Deep immersion, perfect for hero sections or premium landing flows.',
      accentPct: '100%'
    }
  ] as const

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-4 w-4 text-app-accent" />
        <h3 className="text-xs font-semibold text-app-text">Color Strategy Commitments</h3>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        {strategies.map((strat) => (
          <button
            key={strat.id}
            onClick={() => setActiveStrategy(strat.id)}
            className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
              activeStrategy === strat.id
                ? 'bg-app-elevated border-app-accent shadow-sm'
                : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
            }`}
          >
            <span className="text-[11px] font-bold text-app-text">{strat.title}</span>
            <p className="text-[9px] text-app-subtle mt-1 flex-1 leading-normal">{strat.desc}</p>
            <div className="mt-2.5 flex items-center justify-between w-full">
              <span className="text-[8px] font-mono text-app-muted">Accent volume:</span>
              <span className="text-[9px] font-mono font-semibold text-app-accent">{strat.accentPct}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Live Strategy visual mockup */}
      <div className="p-4 rounded-xl bg-app-elevated border border-app-border/80 relative overflow-hidden">
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono text-app-muted">Mockup Preview</span>
        <div className="flex gap-4">
          <div className="w-1/3 flex flex-col gap-2 justify-center">
            <h4 className="text-[11px] font-bold text-app-text">Visual Hierarchy Flow</h4>
            <p className="text-[9px] text-app-subtle leading-relaxed">
              Applying the <strong className="text-app-accent uppercase">{activeStrategy}</strong> strategy balance dynamically.
            </p>
          </div>
          <div className="flex-1 rounded-lg border border-app-border/60 p-4 bg-white/5 backdrop-blur-sm min-h-[90px] flex flex-col justify-between">
            {activeStrategy === 'restrained' && (
              <>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-app-muted/30 rounded" />
                  <div className="h-5 w-12 bg-app-accent text-white rounded text-[8px] flex items-center justify-center font-bold">Accent</div>
                </div>
                <div className="h-10 w-full bg-app-muted/10 rounded border border-app-border/40 mt-2" />
              </>
            )}
            {activeStrategy === 'committed' && (
              <>
                <div className="h-6 w-full bg-app-accent rounded flex items-center px-2 text-[8px] text-white font-bold">Expression Panel</div>
                <div className="h-8 w-full bg-app-muted/10 rounded mt-2 border border-app-border/40" />
              </>
            )}
            {activeStrategy === 'full' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-emerald-500/10 border border-emerald-500/20 rounded flex flex-col items-center justify-center text-emerald-500 font-bold text-[10px]">Success</div>
                <div className="h-12 bg-amber-500/10 border border-amber-500/20 rounded flex flex-col items-center justify-center text-amber-500 font-bold text-[10px]">Warning</div>
                <div className="h-12 bg-red-500/10 border border-red-500/20 rounded flex flex-col items-center justify-center text-red-500 font-bold text-[10px]">Error</div>
              </div>
            )}
            {activeStrategy === 'drenched' && (
              <div className="h-full w-full rounded bg-app-accent flex flex-col justify-between p-3 text-white">
                <div className="text-[12px] font-bold">Dynamic Surface</div>
                <div className="h-5 w-2/3 bg-white/20 rounded" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NeutralTintingEngine() {
  const tokens = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const [tintAmt, setTintAmt] = useState<number>(10) // percentage

  function handleApplyTint() {
    const brand500 = tokens.colors.brand['500']
    const brandHsl = hexToHsl(brand500)
    if (!brandHsl) return

    // Infuse neutral grays with brand hue
    const cleanNeutral = { ...tokens.colors.neutral }
    Object.entries(cleanNeutral).forEach(([step, val]) => {
      const stepHsl = hexToHsl(val)
      if (stepHsl) {
        // Light tint keeps saturation extremely subtle (chroma 0.005–0.01 equivalent)
        const targetS = Math.min(0.08, brandHsl.s * (tintAmt / 100))
        const newHex = hslToHex({
          h: brandHsl.h,
          s: targetS,
          l: stepHsl.l
        })
        setToken(`colors.neutral.${step}`, newHex)
      }
    })
  }

  return (
    <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-app-accent" />
        <h3 className="text-xs font-semibold text-app-text">Neutral Gray Tinting Engine</h3>
      </div>
      <p className="text-[11px] text-app-subtle leading-relaxed mb-4">
        Impeccable law: <em>Never use absolute black or white.</em> Infuse neutrals with the brand's primary hue to create custom warm/cool grays that make your design look incredibly custom.
      </p>
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-[10px] font-mono text-app-muted">Intensity:</span>
          <input
            type="range"
            min="2"
            max="30"
            value={tintAmt}
            onChange={(e) => setTintAmt(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-lg bg-app-elevated border border-app-border cursor-pointer accent-app-accent"
          />
          <span className="text-[11px] font-mono font-bold text-app-text w-8">{tintAmt}%</span>
        </div>
        <button
          onClick={handleApplyTint}
          className="flex items-center gap-1.5 bg-app-accent hover:bg-app-accent-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm active:scale-95 transition-all"
        >
          <Sliders className="h-3.5 w-3.5" />
          Tint Neutral Scales
        </button>
      </div>
    </div>
  )
}

const CB_FILTERS: Record<string, string> = {
  off:       '',
  protanopia: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27cb%27%3E%3CfeColorMatrix values=%270.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0%27/%3E%3C/filter%3E%3C/svg%3E#cb")',
  deuteranopia: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27cb%27%3E%3CfeColorMatrix values=%270.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0%27/%3E%3C/filter%3E%3C/svg%3E#cb")',
  tritanopia:  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27cb%27%3E%3CfeColorMatrix values=%270.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0%27/%3E%3C/filter%3E%3C/svg%3E#cb")',
  grayscale:   'saturate(0%)',
}

export function ColorEditor() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const mode     = tokens.colors.mode
  const [cbMode, setCbMode] = useState<string>('off')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // Resolve or generate a high-quality secondary scale if undefined
  let secondaryScale = tokens.colors.secondary
  if (!secondaryScale) {
    const brandHsl = hexToHsl(tokens.colors.brand['500'])
    if (brandHsl) {
      const secondaryBase = hslToHex({
        h: (brandHsl.h + 200) % 360,
        s: Math.max(0.3, brandHsl.s * 0.85),
        l: Math.max(0.3, Math.min(0.7, brandHsl.l * 0.95))
      })
      secondaryScale = generateAccessibleScale(secondaryBase)
    } else {
      secondaryScale = tokens.colors.accent
    }
  }

  return (
    <div data-spotlight="design-color-editor" className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <Droplets className="h-5 w-5 text-app-accent" />
            Color System & Auditing
          </h2>
          <p className="text-xs text-app-subtle mt-0.5">Advanced OKLCH and WCAG-compliant design system palette studio</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Color blindness simulator */}
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-app-muted" />
            <select
              value={cbMode}
              onChange={(e) => setCbMode(e.target.value)}
              className="h-7 rounded-lg border border-app-border bg-app-elevated text-[11px] text-app-muted px-2.5 cursor-pointer focus:outline-none focus:border-app-accent font-medium shadow-sm"
              title="Simulate color blindness"
            >
              <option value="off">Vision: Normal</option>
              <option value="protanopia">Vision: Protanopia</option>
              <option value="deuteranopia">Vision: Deuteranopia</option>
              <option value="tritanopia">Vision: Tritanopia</option>
              <option value="grayscale">Vision: Grayscale</option>
            </select>
          </div>

          {/* Light/dark mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-app-border p-0.5 bg-app-elevated shadow-sm">
            {(['light','dark'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setToken('colors.mode', m)}
                className={[
                  'flex items-center gap-1.5 h-6 px-3 rounded-md text-[11px] font-semibold transition-all',
                  mode === m ? 'bg-app-inset text-app-text shadow-sm' : 'text-app-subtle hover:text-app-muted',
                ].join(' ')}
              >
                {m === 'light' ? '☀' : '🌙'} <span className="capitalize">{m}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ filter: CB_FILTERS[cbMode] ?? '' }} className="flex flex-col gap-8">
        
        {/* Neutral Tinting Tool */}
        <NeutralTintingEngine />

        {/* Brand scale rows */}
        <ColorScaleRow 
          title="Brand (Primary)" 
          scale={tokens.colors.brand} 
          path="colors.brand" 
          selectedKey={selectedKey} 
          setSelectedKey={setSelectedKey} 
        />
        
        <ColorScaleRow 
          title="Secondary Color" 
          scale={secondaryScale} 
          path="colors.secondary" 
          selectedKey={selectedKey} 
          setSelectedKey={setSelectedKey} 
        />

        <ColorScaleRow 
          title="Accent (Tertiary)" 
          scale={tokens.colors.accent} 
          path="colors.accent" 
          selectedKey={selectedKey} 
          setSelectedKey={setSelectedKey} 
        />
        
        <ColorScaleRow 
          title="Neutral (Grays)" 
          scale={tokens.colors.neutral} 
          path="colors.neutral" 
          selectedKey={selectedKey} 
          setSelectedKey={setSelectedKey} 
        />

        <div className="h-px bg-app-border/40" />
        <SemanticRow />

        {/* Semantic scales */}
        {tokens.colors.successScale && (
          <>
            <div className="h-px bg-app-border/40" />
            <div className="flex flex-col gap-6">
              <ColorScaleRow 
                title="Success Scale" 
                scale={tokens.colors.successScale} 
                path="colors.successScale" 
                selectedKey={selectedKey} 
                setSelectedKey={setSelectedKey} 
              />
              <ColorScaleRow 
                title="Warning Scale" 
                scale={tokens.colors.warningScale} 
                path="colors.warningScale" 
                selectedKey={selectedKey} 
                setSelectedKey={setSelectedKey} 
              />
              <ColorScaleRow 
                title="Error Scale" 
                scale={tokens.colors.errorScale} 
                path="colors.errorScale" 
                selectedKey={selectedKey} 
                setSelectedKey={setSelectedKey} 
              />
              <ColorScaleRow 
                title="Info Scale" 
                scale={tokens.colors.infoScale} 
                path="colors.infoScale" 
                selectedKey={selectedKey} 
                setSelectedKey={setSelectedKey} 
              />
            </div>
          </>
        )}

        <div className="h-px bg-app-border/40" />
        <ColorStrategySection />

        <div className="h-px bg-app-border/40" />
        <ContrastMatrixTable />

        <div className="h-px bg-app-border/40" />
        <SurfaceRow />
      </div>
    </div>
  )
}

