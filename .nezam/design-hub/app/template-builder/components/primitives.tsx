'use client'
import React, { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'

// ── Shared card ───────────────────────────────────────────────────────────────
export function Card({ children, className = '', noPad }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div className={`bg-ds-surface border border-ds-border rounded-xl shadow-sm ${noPad ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  )
}

// ── Card header ───────────────────────────────────────────────────────────────
export function CardHeader({ title, description, icon, action }: {
  title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode
}) {
  return (
    <div className={`flex items-start justify-between gap-3 ${description ? 'mb-4' : 'mb-3'}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-ds-text-muted shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ds-text-primary">{title}</h2>
          {description && <p className="text-xs text-ds-text-muted mt-0.5 leading-relaxed">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ── Section (wraps Card + CardHeader for legacy LeftPanel compat) ─────────────
export function Section({ title, description, icon, children }: {
  title: string; description?: string; icon?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader title={title} description={description} icon={icon} />
      {children}
    </Card>
  )
}

// ── Color swatch (legacy) ─────────────────────────────────────────────────────
export function ColorSwatch({ color, active, onClick }: { color: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-6 h-6 rounded-md shadow-sm border-2 transition-all ${active ? 'border-ds-primary scale-110' : 'border-transparent hover:scale-105'}`}
      style={{ background: color }} />
  )
}

// ── Field label ───────────────────────────────────────────────────────────────
export function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-ds-text-muted">{children}</label>
      {hint && <span className="text-[10px] text-ds-text-muted">{hint}</span>}
    </div>
  )
}

// ── Segment control ───────────────────────────────────────────────────────────
export function SegmentControl({ value, onChange, options }: {
  value: string | number
  onChange: (v: string) => void
  options: { value: string | number; label: string }[]
}) {
  return (
    <div className="flex bg-ds-background border border-ds-border rounded-lg p-0.5 gap-0.5">
      {options.map(opt => {
        const active = String(value) === String(opt.value)
        return (
          <button key={String(opt.value)} onClick={() => onChange(String(opt.value))}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
              active ? 'bg-ds-surface-elevated text-ds-text-primary shadow-sm' : 'text-ds-text-muted hover:text-ds-text-primary'
            }`}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Option card ───────────────────────────────────────────────────────────────
export function OptionCard({ active, onClick, label, description, preview }: {
  active: boolean; onClick: () => void; label: string; description?: string; preview?: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-start rounded-lg border p-3 transition-all duration-150 relative ${
        active ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' : 'border-ds-border hover:border-ds-border-hover bg-ds-background hover:bg-ds-surface'
      }`}>
      {preview && <div className="mb-2.5">{preview}</div>}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`text-xs font-semibold leading-none ${active ? 'text-ds-primary' : 'text-ds-text-primary'}`}>{label}</div>
          {description && <div className="text-[10px] text-ds-text-muted mt-1 leading-relaxed">{description}</div>}
        </div>
        {active && (
          <span className="shrink-0 w-4 h-4 rounded-full bg-ds-primary flex items-center justify-center">
            <Check size={9} className="text-white" strokeWidth={3} />
          </span>
        )}
      </div>
    </button>
  )
}

// ── Toggle row ────────────────────────────────────────────────────────────────
export function ToggleRow({ active, onClick, label, description, icon }: {
  active: boolean; onClick: () => void; label: string; description?: string; icon?: React.ReactNode
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2.5">
        {icon && <span className={`${active ? 'text-ds-primary' : 'text-ds-text-muted'} transition-colors`}>{icon}</span>}
        <div className="text-start">
          <div className="text-xs font-medium text-ds-text-primary">{label}</div>
          {description && <div className="text-[10px] text-ds-text-muted mt-0.5">{description}</div>}
        </div>
      </div>
      <div className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${active ? 'bg-ds-primary' : 'bg-ds-border'}`}>
        <div className={`absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-all duration-200 ${active ? 'left-[18px]' : 'left-[3px]'}`} />
      </div>
    </button>
  )
}

// ── Side-by-side Property Row (Blender Property Layout) ──────────────────────
export function PropertyRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-[22px] py-1 border-b border-white/[0.02] select-none text-[10px]">
      <div className="w-[42%] shrink-0 text-start flex items-center gap-1">
        <span className="text-[10px] text-[#a1a1aa] font-medium font-sans truncate" title={label}>
          {label}
        </span>
        {hint && <span className="text-[8px] text-[#71717a] font-mono">({hint})</span>}
      </div>
      <div className="w-[58%] flex items-center justify-end">
        {children}
      </div>
    </div>
  )
}

// ── Native select (Compact Blender Style) ────────────────────────────────────
export function Select({ value, onChange, options }: {
  value: string | number; onChange: (v: string) => void; options: { value: string | number; label: string }[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-[#202021] border border-[#2e2e30] rounded px-1.5 py-0.5 h-[22px] text-[10px] font-medium text-[#e1e1e6] focus:outline-none focus:border-ds-primary transition-colors appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', paddingRight: '18px' }}>
      {options.map(o => <option key={String(o.value)} value={String(o.value)} className="bg-[#202021] text-[#e1e1e6]">{o.label}</option>)}
    </select>
  )
}

// ── Text input (Compact Blender Style) ────────────────────────────────────────
export function Input({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#202021] border border-[#2e2e30] rounded px-1.5 py-0.5 h-[22px] text-[10px] text-[#e1e1e6] placeholder-[#555557] focus:outline-none focus:border-ds-primary transition-colors" />
  )
}

// ── Divider with optional label ───────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="border-t border-[#252527] my-2" />
  return (
    <div className="flex items-center gap-1.5 my-2">
      <div className="flex-1 border-t border-[#252527]" />
      <span className="text-[8px] font-bold uppercase tracking-widest text-[#71717a] px-1">{label}</span>
      <div className="flex-1 border-t border-[#252527]" />
    </div>
  )
}

// ── Disclosure Triangle Icon ──────────────────────────────────────────────────
export function DisclosureTriangle({ open }: { open: boolean }) {
  return (
    <svg width="5" height="5" viewBox="0 0 24 24" fill="currentColor"
      className={`text-[#8e8e93] transition-transform duration-100 ${open ? 'rotate-90' : ''}`}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

// ── Collapsible section (Blender Accordion Style) ────────────────────────────
export function CollapsibleSection({
  title, description, icon, children, defaultOpen = true, action,
}: {
  title: string; description?: string; icon?: React.ReactNode
  children: React.ReactNode; defaultOpen?: boolean; action?: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#28282c] rounded bg-[#181819] overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-start bg-[#232324] hover:bg-[#2b2b2c] border-b border-[#181819]/50 transition-colors group"
      >
        <DisclosureTriangle open={open} />
        {icon && <span className="text-[#8e8e93] shrink-0 group-hover:text-ds-primary transition-colors">{icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-[#e1e1e6] uppercase tracking-wider leading-tight">{title}</div>
          {description && <div className="text-[8px] text-[#71717a] mt-0.5 truncate">{description}</div>}
        </div>
        {action && <div className="shrink-0" onClick={e => e.stopPropagation()}>{action}</div>}
      </button>
      {open && (
        <div className="p-2 space-y-2 border-t border-[#202022] animate-in fade-in duration-75">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Stepper / number input (Compact Blender Style) ────────────────────────────
export function Stepper({ value, onChange, min = 0, max = 100, step = 1, label, suffix = '' }: {
  value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number; label?: string; suffix?: string
}) {
  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-[10px] text-[#a1a1aa] flex-1 truncate">{label}</span>}
      <div className="flex items-center border border-[#2e2e30] rounded overflow-hidden bg-[#202021] h-[22px]">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="px-1.5 h-full text-[#8e8e93] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] transition-colors text-[10px] font-bold"
        >−</button>
        <span className="px-1 text-[9px] font-mono font-bold text-[#e1e1e6] min-w-[2.2rem] text-center">
          {value}{suffix}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="px-1.5 h-full text-[#8e8e93] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] transition-colors text-[10px] font-bold"
        >+</button>
      </div>
    </div>
  )
}

// ── Mini Toggle switch for side-by-side rows ──────────────────────────────────
export function MiniToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative w-7 h-4 rounded-full transition-colors duration-150 cursor-pointer"
      style={{ backgroundColor: active ? 'var(--ds-primary)' : '#2e2e30' }}>
      <div className="absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all duration-150"
        style={{ left: active ? '13px' : '2px' }} />
    </button>
  )
}

// ── Color dot (compact swatch for inline use) ─────────────────────────────────
export function ColorDot({ color, active, label, onClick }: {
  color: string; active?: boolean; label?: string; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative group rounded-full transition-all duration-150 ${
        active ? 'ring-1.5 ring-ds-primary ring-offset-1 ring-offset-[#181819] scale-105' : 'hover:scale-105'
      }`}
      style={{ width: 14, height: 14, background: color, boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      {active && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check size={8} className="text-white drop-shadow" strokeWidth={3.5} />
        </span>
      )}
    </button>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
export function Badge({ children, color = 'muted' }: { children: React.ReactNode; color?: 'muted' | 'primary' | 'success' | 'alert' }) {
  const cls = {
    muted:   'bg-[#202021] border-[#2e2e30] text-[#8e8e93]',
    primary: 'bg-ds-primary/10 border-ds-primary/20 text-ds-primary',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    alert:   'bg-ds-alert/10 border-ds-alert/20 text-ds-alert',
  }[color]
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider ${cls}`}>{children}</span>
  )
}
