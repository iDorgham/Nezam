'use client'

/**
 * VisualCSSEditor — click-and-drag scrubbers mapped strictly to the
 * active design token matrix. Raw CSS overrides are blocked at input time.
 * Follows SPEC-DS-VISUAL-001 token-first and RTL parity rules.
 */

import { useRef, useCallback, useState } from 'react'
import {
  Type, AlignLeft, Maximize2, Square, Move, Layers,
  Eye, EyeOff, Lock, LockOpen, ChevronDown, ChevronRight,
  RotateCcw, Copy,
} from 'lucide-react'
import { useCanvasStore, SCRUBBER_PROPERTIES, type ScrubberProperty } from '@/state/canvas.store'
import type { NodeStyle, TextAlign, BgFill, ShadowStyle } from '@/types'
import { cn } from '@/lib/cn'

// ─── Scrubber ─────────────────────────────────────────────────────────────────

interface ScrubberProps {
  label: string
  value: number
  property: ScrubberProperty
  onChange: (v: number) => void
  disabled?: boolean
}

function Scrubber({ label, value, property, onChange, disabled }: ScrubberProps) {
  const meta = SCRUBBER_PROPERTIES[property]
  const startY = useRef<number>(0)
  const startVal = useRef<number>(value)
  const dragging = useRef(false)
  const [active, setActive] = useState(false)

  const clamp = (v: number) => Math.round(Math.min(meta.max, Math.max(meta.min, v)) / meta.step) * meta.step

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    dragging.current = true
    startY.current = e.clientY
    startVal.current = value
    setActive(true)

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      // Drag UP increases value
      const delta = (startY.current - ev.clientY) * meta.step
      onChange(clamp(startVal.current + delta))
    }

    const onUp = () => {
      dragging.current = false
      setActive(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [disabled, value, onChange, meta])

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const commitEdit = () => {
    const n = parseFloat(draft)
    if (!isNaN(n)) onChange(clamp(n))
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-[72px] shrink-0 text-[10px] text-app-subtle truncate">{label}</span>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false) }}
          className="h-6 w-full rounded border border-app-accent bg-app-inset px-1.5 text-[11px] text-app-text outline-none"
        />
      ) : (
        <div
          onMouseDown={onMouseDown}
          onDoubleClick={() => { setDraft(String(value)); setEditing(true) }}
          title={`${label}: drag to adjust, double-click to type`}
          className={cn(
            'group flex h-6 flex-1 cursor-ns-resize select-none items-center justify-between rounded border px-2 text-[11px] transition-colors',
            disabled
              ? 'cursor-not-allowed border-app-border/30 bg-app-inset/30 text-app-subtle/40'
              : active
              ? 'border-app-accent bg-app-accent-subtle text-app-text'
              : 'border-app-border bg-app-inset text-app-text hover:border-app-border-strong',
          )}
        >
          <span className="font-mono tabular-nums">{value}</span>
          <span className="text-[9px] text-app-subtle/60">{meta.unit}</span>
        </div>
      )}
    </div>
  )
}

// ─── Token picker (color / shadow / font) ─────────────────────────────────────

const COLOR_TOKENS = [
  { key: 'var(--app-bg)',           label: 'Background',    swatch: 'bg-app-bg' },
  { key: 'var(--app-surface)',      label: 'Surface',       swatch: 'bg-app-surface' },
  { key: 'var(--app-elevated)',     label: 'Elevated',      swatch: 'bg-app-elevated' },
  { key: 'var(--app-accent)',       label: 'Accent',        swatch: 'bg-app-accent' },
  { key: 'var(--app-accent-subtle)',label: 'Accent Subtle', swatch: 'bg-app-accent-subtle' },
  { key: 'var(--app-text)',         label: 'Text',          swatch: 'bg-app-text' },
  { key: 'var(--app-subtle)',       label: 'Text Subtle',   swatch: 'bg-app-subtle' },
  { key: 'var(--app-border)',       label: 'Border',        swatch: 'bg-app-border' },
  { key: 'transparent',             label: 'Transparent',   swatch: 'bg-transparent border border-dashed border-app-border' },
]

const SHADOW_TOKENS: { value: ShadowStyle; label: string }[] = [
  { value: 'none',     label: 'None' },
  { value: 'soft',     label: 'Soft' },
  { value: 'crisp',    label: 'Crisp' },
  { value: 'dramatic', label: 'Dramatic' },
]

const FONT_TOKENS = [
  { value: 'var(--font-sans)',    label: 'Sans (UI)' },
  { value: 'var(--font-display)', label: 'Display' },
  { value: 'var(--font-mono)',    label: 'Mono' },
]

function TokenColorPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const current = COLOR_TOKENS.find((t) => t.key === value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-6 w-full items-center gap-2 rounded border border-app-border bg-app-inset px-2 text-[11px] text-app-text transition-colors hover:border-app-border-strong"
      >
        <span className={cn('h-3 w-3 shrink-0 rounded-sm', current?.swatch ?? 'bg-app-border')} />
        <span className="flex-1 truncate text-left">{current?.label ?? value ?? 'Choose token…'}</span>
        <ChevronDown size={10} className="text-app-subtle" />
      </button>
      {open && (
        <div className="absolute left-0 top-7 z-50 min-w-[180px] rounded-app border border-app-border bg-app-surface shadow-app-lg">
          {COLOR_TOKENS.map((t) => (
            <button
              key={t.key}
              onClick={() => { onChange(t.key); setOpen(false) }}
              className="flex w-full items-center gap-2 px-2.5 py-1.5 text-[11px] text-app-text transition-colors hover:bg-app-elevated"
            >
              <span className={cn('h-3 w-3 shrink-0 rounded-sm', t.swatch)} />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section groupings ────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string
  icon: typeof Type
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-app-border/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <Icon size={12} className="text-app-subtle" />
        <span className="flex-1 text-[11px] font-semibold text-app-text">{title}</span>
        {open ? <ChevronDown size={11} className="text-app-subtle" /> : <ChevronRight size={11} className="text-app-subtle" />}
      </button>
      {open && <div className="flex flex-col gap-2 px-3 pb-3">{children}</div>}
    </div>
  )
}

// ─── Align row ────────────────────────────────────────────────────────────────

const ALIGNS: { value: TextAlign; label: string; glyph: string }[] = [
  { value: 'start',   label: 'Start',   glyph: '⫷' },
  { value: 'center',  label: 'Center',  glyph: '≡' },
  { value: 'end',     label: 'End',     glyph: '⫸' },
  { value: 'justify', label: 'Justify', glyph: '☰' },
]

function AlignRow({ value, onChange }: { value?: TextAlign; onChange: (v: TextAlign) => void }) {
  return (
    <div className="flex gap-1">
      {ALIGNS.map((a) => (
        <button
          key={a.value}
          onClick={() => onChange(a.value)}
          title={a.label}
          className={cn(
            'flex h-6 flex-1 items-center justify-center rounded border text-[13px] transition-colors',
            value === a.value
              ? 'border-app-accent bg-app-accent text-app-on-accent'
              : 'border-app-border text-app-subtle hover:border-app-border-strong hover:text-app-text',
          )}
        >
          {a.glyph}
        </button>
      ))}
    </div>
  )
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export function VisualCSSEditor() {
  const selectedId = useCanvasStore((s) => s.selectedTreeId)
  const updateStyle = useCanvasStore((s) => s.updateTreeStyle)
  const updateProps = useCanvasStore((s) => s.updateTreeProps)
  const toggleLock = useCanvasStore((s) => s.toggleTreeLock)
  const toggleVisible = useCanvasStore((s) => s.toggleTreeVisible)
  const duplicate = useCanvasStore((s) => s.duplicateTreeNode)
  const copyNode = useCanvasStore((s) => s.copyTreeNode)
  const rejection = useCanvasStore((s) => s.lastRejection)

  // Find selected node in tree
  const tree = useCanvasStore((s) => s.tree)
  const [selectedNode] = (() => {
    if (!selectedId) return [null]
    function find(nodes: typeof tree): typeof tree[0] | null {
      for (const n of nodes) {
        if (n.id === selectedId) return n
        const f = find(n.children)
        if (f) return f
      }
      return null
    }
    return [find(tree)]
  })()

  if (!selectedId || !selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
        <Square size={28} className="text-app-subtle/40" />
        <p className="text-[11px] text-app-subtle">Select a node on the canvas to edit its properties</p>
      </div>
    )
  }

  const style = selectedNode.style
  const locked = selectedNode.locked

  const patch = (p: Partial<NodeStyle>) => updateStyle(selectedId, p)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-app-border px-3 py-2">
        <span className="flex-1 truncate text-[12px] font-semibold text-app-text">{selectedNode.label}</span>
        <span className="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide bg-app-elevated text-app-subtle">{selectedNode.type}</span>

        <button onClick={() => toggleLock(selectedId)} title={locked ? 'Unlock' : 'Lock'}
          className={cn('grid h-5 w-5 place-items-center rounded transition-colors',
            locked ? 'bg-app-accent text-app-on-accent' : 'text-app-subtle hover:bg-app-elevated'
          )}>
          {locked ? <Lock size={10} /> : <LockOpen size={10} />}
        </button>
        <button onClick={() => toggleVisible(selectedId, 'desktop')} title="Toggle desktop"
          className={cn('grid h-5 w-5 place-items-center rounded text-app-subtle transition-colors hover:bg-app-elevated',
            !selectedNode.visible.desktop && 'text-app-subtle/40'
          )}>
          {selectedNode.visible.desktop ? <Eye size={10} /> : <EyeOff size={10} />}
        </button>
        <button onClick={() => duplicate(selectedId)} title="Duplicate"
          className="grid h-5 w-5 place-items-center rounded text-app-subtle transition-colors hover:bg-app-elevated">
          <Copy size={10} />
        </button>
        <button onClick={() => patch({})} title="Reset styles"
          className="grid h-5 w-5 place-items-center rounded text-app-subtle transition-colors hover:bg-app-elevated hover:text-red-500">
          <RotateCcw size={10} />
        </button>
      </div>

      {/* Token policy violation alert */}
      {rejection && (
        <div className="border-b border-red-500/30 bg-red-500/10 px-3 py-2 text-[10px] leading-snug text-red-500">
          {rejection}
        </div>
      )}

      {/* Typography */}
      <Section title="Typography" icon={Type}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Font</span>
            <select
              value={style.fontFamily ?? ''}
              onChange={(e) => patch({ fontFamily: e.target.value || undefined })}
              disabled={locked}
              className="h-6 flex-1 rounded border border-app-border bg-app-inset px-1.5 text-[11px] text-app-text outline-none disabled:opacity-40"
            >
              <option value="">— inherit —</option>
              {FONT_TOKENS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <Scrubber label="Scale" property="fontScale" value={style.fontScale ?? 1} onChange={(v) => patch({ fontScale: v })} disabled={locked} />
          <Scrubber label="Letter sp." property="letterSpacing" value={style.letterSpacing ?? 0} onChange={(v) => patch({ letterSpacing: v })} disabled={locked} />
          <Scrubber label="Line height" property="lineHeight" value={style.lineHeight ?? 1.5} onChange={(v) => patch({ lineHeight: v })} disabled={locked} />
          <div className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Align</span>
            <div className="flex-1">
              <AlignRow value={style.align} onChange={(v) => patch({ align: v })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Color</span>
            <div className="flex-1">
              <TokenColorPicker value={style.textColor} onChange={(v) => patch({ textColor: v })} />
            </div>
          </div>
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing" icon={Maximize2}>
        <div className="flex flex-col gap-1.5">
          <Scrubber label="Padding" property="padding"   value={style.padding ?? 0}   onChange={(v) => patch({ padding: v })}   disabled={locked} />
          <Scrubber label="Margin"  property="margin"    value={style.margin ?? 0}    onChange={(v) => patch({ margin: v })}    disabled={locked} />
          <Scrubber label="Gap"     property="gap"       value={style.gap ?? 0}       onChange={(v) => patch({ gap: v })}       disabled={locked} />
          <Scrubber label="Min H"   property="minHeight" value={style.minHeight ?? 0} onChange={(v) => patch({ minHeight: v })} disabled={locked} />
          <Scrubber label="Columns" property="columns"   value={style.columns ?? 1}   onChange={(v) => patch({ columns: v })}   disabled={locked} />
        </div>
      </Section>

      {/* Background */}
      <Section title="Background" icon={Square}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Fill type</span>
            <div className="flex flex-1 gap-1">
              {(['solid', 'gradient', 'image'] as BgFill[]).map((f) => (
                <button key={f} onClick={() => patch({ bgFill: f })} disabled={locked}
                  className={cn('flex-1 rounded border py-0.5 text-[10px] capitalize transition-colors',
                    style.bgFill === f ? 'border-app-accent bg-app-accent text-app-on-accent' : 'border-app-border text-app-subtle hover:border-app-border-strong'
                  )}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Color</span>
            <div className="flex-1">
              <TokenColorPicker value={style.bg} onChange={(v) => patch({ bg: v })} />
            </div>
          </div>
          {style.bgFill === 'gradient' && (
            <div className="flex items-center gap-2">
              <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">To color</span>
              <div className="flex-1">
                <TokenColorPicker value={style.bgTo} onChange={(v) => patch({ bgTo: v })} />
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Box model */}
      <Section title="Box" icon={Move}>
        <div className="flex flex-col gap-1.5">
          <Scrubber label="Radius"  property="radius"      value={style.radius ?? 0}      onChange={(v) => patch({ radius: v })}      disabled={locked} />
          <Scrubber label="Border"  property="borderWidth" value={style.borderWidth ?? 0} onChange={(v) => patch({ borderWidth: v })} disabled={locked} />
          {(style.borderWidth ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-[72px] shrink-0 text-[10px] text-app-subtle">Border</span>
              <div className="flex-1">
                <TokenColorPicker value={style.borderColor} onChange={(v) => patch({ borderColor: v })} />
              </div>
            </div>
          )}
          <Scrubber label="Opacity" property="opacity" value={style.opacity ?? 1} onChange={(v) => patch({ opacity: v })} disabled={locked} />
        </div>
      </Section>

      {/* Shadow */}
      <Section title="Elevation" icon={Layers} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-1">
          {SHADOW_TOKENS.map((s) => (
            <button key={s.value} onClick={() => patch({ shadow: s.value })} disabled={locked}
              className={cn('rounded border py-1 text-[10px] transition-colors',
                style.shadow === s.value ? 'border-app-accent bg-app-accent text-app-on-accent' : 'border-app-border text-app-subtle hover:border-app-border-strong'
              )}>
              {s.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
