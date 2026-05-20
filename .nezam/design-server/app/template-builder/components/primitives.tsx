'use client'
import React from 'react'
import { Check } from 'lucide-react'

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

// ── Native select ─────────────────────────────────────────────────────────────
export function Select({ value, onChange, options }: {
  value: string | number; onChange: (v: string) => void; options: { value: string | number; label: string }[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-xs font-medium text-ds-text-primary focus:outline-none focus:border-ds-primary transition-colors appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}>
      {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
    </select>
  )
}

// ── Text input ────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary transition-colors" />
  )
}

// ── Divider with optional label ───────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="border-t border-ds-border my-3" />
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 border-t border-ds-border" />
      <span className="text-[9px] font-semibold uppercase tracking-wider text-ds-text-muted px-1">{label}</span>
      <div className="flex-1 border-t border-ds-border" />
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
export function Badge({ children, color = 'muted' }: { children: React.ReactNode; color?: 'muted' | 'primary' | 'success' | 'alert' }) {
  const cls = {
    muted:   'bg-ds-surface border-ds-border text-ds-text-muted',
    primary: 'bg-ds-primary/10 border-ds-primary/30 text-ds-primary',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    alert:   'bg-ds-alert/10 border-ds-alert/30 text-ds-alert',
  }[color]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold ${cls}`}>{children}</span>
  )
}
