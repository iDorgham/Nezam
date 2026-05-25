'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { generateColorScale } from '@/lib/utils'
import type { ColorScale } from '@/types/design'

const SCALE_STEPS = ['50','100','200','300','400','500','600','700','800','900','950'] as const

function ColorSwatch({ color, label, onClick }: { color: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-1 items-start"
      title={`${label}: ${color}`}
    >
      <div
        className="h-8 w-full rounded border border-black/10 transition-transform group-hover:scale-[1.04]"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-mono text-app-subtle">{label}</span>
      <span className="text-[10px] font-mono text-app-subtle opacity-70">{color}</span>
    </button>
  )
}

function ColorScaleRow({
  title,
  scale,
  path,
}: {
  title: string
  scale: ColorScale
  path: string
}) {
  const setToken = useHub((s) => s.designSetToken)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editValue, setEditValue]     = useState('')

  function handleClickSwatch(step: string, current: string) {
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
    const newScale = generateColorScale(base)
    Object.entries(newScale).forEach(([step, val]) => {
      setToken(`${path}.${step}`, val)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-app-text">{title}</h3>
        <button
          onClick={handleRegenerate}
          className="text-[10px] text-app-subtle hover:text-app-accent transition-colors"
          title="Auto-generate scale from 500"
        >
          ↻ Regen from 500
        </button>
      </div>

      {/* Scale swatches */}
      <div className="grid grid-cols-11 gap-1">
        {SCALE_STEPS.map((step) => (
          <ColorSwatch
            key={step}
            color={scale[step]}
            label={step}
            onClick={() => handleClickSwatch(step, scale[step])}
          />
        ))}
      </div>

      {/* Inline editor */}
      {editingStep && (
        <div className="flex items-center gap-2 mt-1 p-2 rounded-app-sm bg-app-elevated border border-app-border">
          <div
            className="h-6 w-6 rounded shrink-0 border border-black/10"
            style={{ backgroundColor: editValue }}
          />
          <input
            type="color"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 w-10 cursor-pointer rounded border border-app-border bg-transparent"
          />
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 h-6 rounded bg-app-inset border border-app-border px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
            placeholder="#000000"
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingStep(null) }}
          />
          <button onClick={commitEdit} className="text-[11px] text-app-accent hover:text-app-accent-hover font-medium">Set</button>
          <button onClick={() => setEditingStep(null)} className="text-[11px] text-app-subtle hover:text-app-muted">Cancel</button>
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
    { key: 'success', label: 'Success', emoji: '✅' },
    { key: 'warning', label: 'Warning', emoji: '⚠️' },
    { key: 'error',   label: 'Error',   emoji: '🔴' },
    { key: 'info',    label: 'Info',    emoji: 'ℹ️' },
  ] as const

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-app-text">Semantic Colors</h3>
      <div className="grid grid-cols-4 gap-3">
        {SEMANTICS.map(({ key, label, emoji }) => (
          <div key={key} className="flex flex-col gap-1">
            <div
              className="h-10 rounded-app border border-black/10"
              style={{ backgroundColor: semantic[key] }}
            />
            <div className="flex items-center gap-1">
              <span className="text-xs">{emoji}</span>
              <span className="text-[10px] text-app-muted">{label}</span>
            </div>
            <input
              type="color"
              value={semantic[key]}
              onChange={(e) => setToken(`colors.semantic.${key}`, e.target.value)}
              className="w-full h-5 cursor-pointer rounded border border-app-border bg-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function SurfaceRow() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const surface  = tokens.colors.surface
  const text     = tokens.colors.text

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Surface tokens */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Surface</h3>
        {(['bg','panel','border'] as const).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={surface[key]}
              onChange={(e) => setToken(`colors.surface.${key}`, e.target.value)}
              className="h-6 w-6 shrink-0 cursor-pointer rounded border border-app-border bg-transparent"
            />
            <span className="text-[11px] font-mono text-app-muted w-12">{key}</span>
            <span className="text-[10px] font-mono text-app-subtle">{surface[key]}</span>
          </div>
        ))}
      </div>

      {/* Text tokens */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-app-text">Text</h3>
        {(['primary','secondary','muted','disabled'] as const).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={text[key]}
              onChange={(e) => setToken(`colors.text.${key}`, e.target.value)}
              className="h-6 w-6 shrink-0 cursor-pointer rounded border border-app-border bg-transparent"
            />
            <span className="text-[11px] font-mono text-app-muted w-14">{key}</span>
            <div
              className="flex-1 h-5 rounded px-1.5 flex items-center"
              style={{ backgroundColor: tokens.colors.surface.bg, color: text[key] }}
            >
              <span className="text-[10px]">The quick brown fox</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ColorEditor() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const mode     = tokens.colors.mode

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-app-text">Colors</h2>
          <p className="text-xs text-app-subtle mt-0.5">Define your color scales and semantic palette</p>
        </div>

        {/* Light/dark mode toggle */}
        <div className="flex items-center gap-1 rounded-app-sm border border-app-border p-0.5">
          {(['light','dark'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setToken('colors.mode', m)}
              className={[
                'flex items-center gap-1 h-6 px-2.5 rounded text-[11px] font-medium transition-all',
                mode === m ? 'bg-app-elevated text-app-text' : 'text-app-subtle hover:text-app-muted',
              ].join(' ')}
            >
              {m === 'light' ? '☀' : '🌙'} {m}
            </button>
          ))}
        </div>
      </div>

      <ColorScaleRow title="Brand (Primary)"    scale={tokens.colors.brand}   path="colors.brand" />
      <ColorScaleRow title="Accent (Secondary)" scale={tokens.colors.accent}  path="colors.accent" />
      <ColorScaleRow title="Neutral (Grays)"    scale={tokens.colors.neutral} path="colors.neutral" />

      <div className="h-px bg-app-border" />
      <SemanticRow />

      <div className="h-px bg-app-border" />
      <SurfaceRow />
    </div>
  )
}
