'use client'
// Shared panel design primitives — used across ALL side panel pages
// for visual consistency: spacing, typography, colors, borders
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// ── Token constants ───────────────────────────────────────────────────────────
export const PT = {
  bg:           'var(--pt-bg, #181819)',
  bgElevated:   'var(--pt-bg-elevated, #1e1e1f)',
  bgHover:      'var(--pt-bg-hover, #232324)',
  surface:      'var(--pt-surface, #232324)',
  border:       'var(--pt-border, #2a2a2c)',
  borderHover:  'var(--pt-border-hover, #3a3a3c)',
  primary:      'var(--ds-primary, #06b6d4)',
  textPrimary:  'var(--pt-text-primary, #e8e8ed)',
  textSecondary:'var(--pt-text-secondary, #8e8e93)',
  textMuted:    'var(--pt-text-muted, #48484a)',
  textLabel:    'var(--pt-text-label, #636366)',
  radius:       '8px',
  radiusSm:     '6px',
  radiusLg:     '10px',
}

// ── PanelHeader ───────────────────────────────────────────────────────────────
export function PanelHeader({
  icon, title, subtitle, actions,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="shrink-0 px-3 py-2.5 border-b flex items-center gap-2.5" style={{ borderColor: PT.border }}>
      <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
        style={{ background: 'var(--ds-primary-subtle, rgba(6,182,212,0.12))', color: PT.primary }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold leading-tight" style={{ color: PT.textPrimary }}>{title}</div>
        {subtitle && <div className="text-[9px] mt-0.5" style={{ color: PT.textMuted }}>{subtitle}</div>}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-1">{actions}</div>}
    </div>
  )
}

// ── PanelSection ──────────────────────────────────────────────────────────────
export function PanelSection({
  title, children, defaultOpen = true, badge,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: PT.border }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest flex-1 text-start" style={{ color: PT.textLabel }}>
          {title}
        </span>
        {badge !== undefined && (
          <span className="text-[8px] font-bold px-1.5 py-px rounded-full" style={{ background: 'var(--ds-primary-subtle, rgba(6,182,212,0.12))', color: PT.primary }}>
            {badge}
          </span>
        )}
        {open ? <ChevronUp size={10} style={{ color: PT.textMuted }} /> : <ChevronDown size={10} style={{ color: PT.textMuted }} />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  )
}

// ── PanelField ────────────────────────────────────────────────────────────────
export function PanelField({
  label, hint, children, row = false,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
  row?: boolean
}) {
  return (
    <div className={`space-y-1 ${row ? 'flex items-center gap-2' : ''}`}>
      <div className={`flex items-center ${row ? 'w-24 shrink-0' : 'justify-between'}`}>
        <label className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: PT.textLabel }}>{label}</label>
        {hint && <span className="text-[8px]" style={{ color: PT.textMuted }}>{hint}</span>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ── PanelInput ────────────────────────────────────────────────────────────────
export function PanelInput({ value, onChange, placeholder, type = 'text', mono = false }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  mono?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2.5 py-1.5 text-[10px] rounded-md border outline-none transition-all"
      style={{
        background: PT.bgElevated,
        borderColor: PT.border,
        color: PT.textPrimary,
        fontFamily: mono ? 'ui-monospace, monospace' : undefined,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = PT.primary)}
      onBlur={e => (e.currentTarget.style.borderColor = PT.border)}
    />
  )
}

// ── PanelTextarea ─────────────────────────────────────────────────────────────
export function PanelTextarea({ value, onChange, placeholder, rows = 2 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-2.5 py-1.5 text-[10px] rounded-md border outline-none transition-all resize-none"
      style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
      onFocus={e => (e.currentTarget.style.borderColor = PT.primary)}
      onBlur={e => (e.currentTarget.style.borderColor = PT.border)}
    />
  )
}

// ── PanelToggle ───────────────────────────────────────────────────────────────
export function PanelToggle({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 py-0.5">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium leading-tight" style={{ color: PT.textPrimary }}>{label}</p>
        {desc && <p className="text-[8px] mt-0.5 leading-relaxed" style={{ color: PT.textMuted }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 32, height: 18, borderRadius: 9, position: 'relative', flexShrink: 0,
          background: checked ? PT.primary : PT.border, transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, width: 14, height: 14, borderRadius: '50%',
          background: '#fff', transition: 'all 0.2s',
          [checked ? 'right' : 'left']: 2,
        }} />
      </button>
    </div>
  )
}

// ── PanelSelect ───────────────────────────────────────────────────────────────
export function PanelSelect({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 text-[10px] rounded-md border outline-none appearance-none"
      style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary, cursor: 'pointer' }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ── PanelBadge ────────────────────────────────────────────────────────────────
export function PanelBadge({ children, color = 'default' }: {
  children: React.ReactNode
  color?: 'default' | 'green' | 'amber' | 'red' | 'primary'
}) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    default: { bg: 'var(--pt-surface, #232324)', text: 'var(--pt-text-secondary, #8e8e93)', border: 'var(--pt-border, #2a2a2c)' },
    green:   { bg: '#052e1c', text: '#22c55e', border: '#064e2c' },
    amber:   { bg: '#2d1a00', text: '#f59e0b', border: '#4d2a00' },
    red:     { bg: '#2d0a0a', text: '#ef4444', border: '#4d1010' },
    primary: { bg: 'rgba(6,182,212,0.08)', text: 'var(--ds-primary, #06b6d4)', border: 'rgba(6,182,212,0.2)' },
  }
  const s = styles[color] ?? styles.default
  return (
    <span className="inline-flex items-center text-[8px] font-bold px-1.5 py-px rounded border tracking-wide uppercase"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}>
      {children}
    </span>
  )
}

// ── PanelButton ───────────────────────────────────────────────────────────────
export function PanelButton({ children, onClick, variant = 'default', size = 'sm', fullWidth = false, icon }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  size?: 'xs' | 'sm'
  fullWidth?: boolean
  icon?: React.ReactNode
}) {
  const styles: Record<string, string> = {
    default: 'border text-[color:var(--pt-text-secondary,#8e8e93)] hover:text-[color:var(--pt-text-primary,#e8e8ed)]',
    primary: 'bg-ds-primary text-white hover:opacity-90 border border-transparent',
    danger:  'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
    ghost:   'text-[color:var(--pt-text-label,#636366)] hover:text-[color:var(--pt-text-primary,#e8e8ed)] hover:bg-white/[0.04] border border-transparent',
  }
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-1.5 rounded-md font-medium transition-all ${
        size === 'xs' ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]'
      } ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: {
  icon: React.ReactNode; title: string; desc?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
      <div className="w-10 h-10 rounded-xl border border-dashed flex items-center justify-center"
        style={{ borderColor: PT.border, color: PT.textMuted }}>{icon}</div>
      <div>
        <p className="text-[10px] font-semibold" style={{ color: PT.textSecondary }}>{title}</p>
        {desc && <p className="text-[9px] mt-1 leading-relaxed" style={{ color: PT.textMuted }}>{desc}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function PanelDivider({ label }: { label?: string }) {
  if (!label) return <div className="h-px mx-3 my-1" style={{ background: PT.border }} />
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <div className="flex-1 h-px" style={{ background: PT.border }} />
      <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: PT.textMuted }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: PT.border }} />
    </div>
  )
}
