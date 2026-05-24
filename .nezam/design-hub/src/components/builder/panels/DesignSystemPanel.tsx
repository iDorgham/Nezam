'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

// ── Sub-tab definitions ────────────────────────────────────────────────────────

type DSTab =
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'components'
  | 'motion'
  | 'borders'
  | 'iconography'
  | 'messaging'

const DS_TABS: { id: DSTab; label: string }[] = [
  { id: 'colors',      label: 'Colors' },
  { id: 'typography',  label: 'Typography' },
  { id: 'spacing',     label: 'Spacing' },
  { id: 'components',  label: 'Components' },
  { id: 'motion',      label: 'Motion' },
  { id: 'borders',     label: 'Borders' },
  { id: 'iconography', label: 'Iconography' },
  { id: 'messaging',   label: 'Messaging' },
]

// ── Color anatomy ─────────────────────────────────────────────────────────────

function ColorAnatomy() {
  const groups = [
    {
      label: 'Brand',
      swatches: [
        { name: 'brand', css: 'var(--app-brand)', label: 'Brand' },
        { name: 'brand-hover', css: 'var(--app-brand-hover)', label: 'Brand Hover' },
        { name: 'brand-subtle', css: 'var(--app-brand-subtle)', label: 'Brand Subtle' },
        { name: 'on-brand', css: 'var(--app-on-brand)', label: 'On Brand' },
        { name: 'accent', css: 'var(--app-accent)', label: 'Accent' },
      ],
    },
    {
      label: 'Surface',
      swatches: [
        { name: 'bg', css: 'var(--app-bg)', label: 'Background' },
        { name: 'surface', css: 'var(--app-surface)', label: 'Surface' },
        { name: 'elevated', css: 'var(--app-elevated)', label: 'Elevated' },
        { name: 'inset', css: 'var(--app-inset)', label: 'Inset' },
        { name: 'deep', css: 'var(--app-deep)', label: 'Deep' },
      ],
    },
    {
      label: 'Text',
      swatches: [
        { name: 'text', css: 'var(--app-text)', label: 'Primary' },
        { name: 'muted', css: 'var(--app-muted)', label: 'Muted' },
        { name: 'subtle', css: 'var(--app-subtle)', label: 'Subtle' },
      ],
    },
    {
      label: 'Semantic',
      swatches: [
        { name: 'success', css: 'var(--app-success)', label: 'Success' },
        { name: 'warning', css: 'var(--app-warning)', label: 'Warning' },
        { name: 'danger', css: 'var(--app-danger)', label: 'Danger' },
        { name: 'info', css: 'var(--app-info)', label: 'Info' },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">{group.label}</p>
          <div className="grid grid-cols-5 gap-1.5">
            {group.swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-1">
                <div
                  className="h-10 w-full rounded-lg border border-app-border/60 shadow-sm"
                  style={{ background: s.css }}
                />
                <span className="truncate text-center text-[9px] text-app-subtle">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Typography ────────────────────────────────────────────────────────────────

function Typography() {
  const scales = [
    { label: 'Display',   size: 'text-[32px]', weight: 'font-black', sample: 'Aa' },
    { label: 'H1',        size: 'text-[24px]', weight: 'font-bold',  sample: 'Heading 1' },
    { label: 'H2',        size: 'text-[20px]', weight: 'font-bold',  sample: 'Heading 2' },
    { label: 'H3',        size: 'text-[16px]', weight: 'font-semibold', sample: 'Heading 3' },
    { label: 'Body',      size: 'text-[14px]', weight: 'font-normal', sample: 'Body text for reading' },
    { label: 'Small',     size: 'text-[12px]', weight: 'font-normal', sample: 'Small label or caption' },
    { label: 'Micro',     size: 'text-[10px]', weight: 'font-medium', sample: 'MICRO / EYEBROW TEXT' },
  ]

  return (
    <div className="space-y-1">
      {scales.map((s) => (
        <div key={s.label} className="flex items-baseline gap-3 rounded-lg px-2 py-2 hover:bg-app-elevated/50">
          <span className="w-14 shrink-0 text-[9px] font-bold uppercase tracking-wider text-app-subtle">{s.label}</span>
          <span className={cn(s.size, s.weight, 'flex-1 text-app-text leading-tight')}>{s.sample}</span>
        </div>
      ))}
    </div>
  )
}

// ── Spacing ───────────────────────────────────────────────────────────────────

function Spacing() {
  const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32]
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-app-subtle">Base unit = 4px (0.25rem)</p>
      {steps.map((n) => (
        <div key={n} className="flex items-center gap-3">
          <span className="w-8 shrink-0 text-right text-[10px] font-mono text-app-muted">{n}</span>
          <div className="h-4 rounded-sm bg-app-accent/40" style={{ width: n * 4 }} />
          <span className="text-[10px] text-app-subtle">{n * 4}px / {(n / 4).toFixed(2).replace(/\.?0+$/, '')}rem</span>
        </div>
      ))}
    </div>
  )
}

// ── Motion ────────────────────────────────────────────────────────────────────

function Motion() {
  const curves = [
    { name: 'ease-smooth', css: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Standard transitions' },
    { name: 'ease-in',     css: 'cubic-bezier(0.4, 0, 1, 1)',   desc: 'Exit animations' },
    { name: 'ease-out',    css: 'cubic-bezier(0, 0, 0.2, 1)',   desc: 'Enter animations' },
    { name: 'spring',      css: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Springy bouncy' },
  ]
  const durations = [
    { label: 'Instant',  ms: 80 },
    { label: 'Fast',     ms: 150 },
    { label: 'Normal',   ms: 250 },
    { label: 'Slow',     ms: 400 },
    { label: 'Dramatic', ms: 600 },
  ]
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Easing Curves</p>
        {curves.map((c) => (
          <div key={c.name} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-app-elevated/50">
            <span className="w-28 shrink-0 text-[10px] font-mono font-semibold text-app-text">{c.name}</span>
            <span className="flex-1 text-[10px] text-app-subtle">{c.desc}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Durations</p>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1 rounded-lg border border-app-border bg-app-elevated px-3 py-2">
              <span className="text-[11px] font-semibold text-app-text">{d.ms}ms</span>
              <span className="text-[9px] text-app-subtle">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Borders & Radius ──────────────────────────────────────────────────────────

function Borders() {
  const radii = [
    { name: 'none',  px: 0 },
    { name: 'sm',    px: 4 },
    { name: 'md',    px: 8 },
    { name: 'lg',    px: 12 },
    { name: 'xl',    px: 16 },
    { name: '2xl',   px: 24 },
    { name: '3xl',   px: 32 },
    { name: 'full',  px: 9999 },
  ]
  const widths = [
    { label: 'Hairline', px: 0.5 },
    { label: 'Thin',     px: 1 },
    { label: 'Normal',   px: 1.5 },
    { label: 'Medium',   px: 2 },
    { label: 'Thick',    px: 4 },
  ]
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Radius Scale</p>
        <div className="flex flex-wrap gap-3">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-1.5">
              <div
                className="h-12 w-12 border-2 border-app-accent/50 bg-app-elevated"
                style={{ borderRadius: Math.min(r.px, 24) }}
              />
              <span className="text-[9px] text-app-subtle">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Border Widths</p>
        <div className="space-y-2">
          {widths.map((w) => (
            <div key={w.label} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[10px] text-app-subtle">{w.label}</span>
              <div className="flex-1 border-app-border-strong" style={{ borderTopWidth: w.px, borderTopStyle: 'solid', borderColor: 'var(--app-border-strong)' }} />
              <span className="text-[10px] font-mono text-app-muted">{w.px}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Iconography ───────────────────────────────────────────────────────────────

function Iconography() {
  const sizes = [
    { name: 'XS — 12px', px: 12 },
    { name: 'SM — 14px', px: 14 },
    { name: 'MD — 16px', px: 16 },
    { name: 'LG — 20px', px: 20 },
    { name: 'XL — 24px', px: 24 },
    { name: '2XL — 32px', px: 32 },
  ]
  return (
    <div className="space-y-4">
      <p className="text-[10px] text-app-subtle">Using <strong className="text-app-text">lucide-react</strong> — consistent stroke-weight icon set.</p>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-2 rounded-xl border border-app-border bg-app-elevated p-3">
            <svg width={s.px} height={s.px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-app-text">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span className="text-center text-[9px] text-app-subtle">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-app-border bg-app-elevated p-3">
        <p className="mb-2 text-[10px] font-semibold text-app-text">Usage Guidelines</p>
        <ul className="space-y-1 text-[10px] text-app-subtle">
          <li>• Use 16px (MD) for inline UI icons</li>
          <li>• Use 14px (SM) for dense panels and tables</li>
          <li>• Use 20–24px for section headers or feature illustrations</li>
          <li>• Keep strokeWidth at 1.5 for consistency</li>
          <li>• Never scale icons with CSS — use the size prop</li>
        </ul>
      </div>
    </div>
  )
}

// ── Messaging ─────────────────────────────────────────────────────────────────

function Messaging() {
  const messages = [
    { kind: 'success', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', title: 'Success', body: 'Action completed successfully.' },
    { kind: 'warning', color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/8',   title: 'Warning', body: 'This action requires your attention.' },
    { kind: 'error',   color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/8',     title: 'Error',   body: 'Something went wrong. Please try again.' },
    { kind: 'info',    color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    title: 'Info',    body: 'Here is some useful information.' },
    { kind: 'neutral', color: 'text-app-muted',   border: 'border-app-border',     bg: 'bg-app-elevated',  title: 'Note',    body: 'A neutral contextual message.' },
  ]
  return (
    <div className="space-y-2">
      {messages.map((m) => (
        <div key={m.kind} className={cn('rounded-xl border px-3 py-2.5', m.border, m.bg)}>
          <p className={cn('text-[11px] font-semibold', m.color)}>{m.title}</p>
          <p className="mt-0.5 text-[10px] text-app-muted">{m.body}</p>
        </div>
      ))}
    </div>
  )
}

// ── Components placeholder ────────────────────────────────────────────────────

function Components() {
  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Buttons</p>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-app-brand px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90">Primary</button>
          <button className="rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-[12px] font-medium text-app-text hover:bg-app-elevated">Secondary</button>
          <button className="rounded-lg border border-dashed border-app-border px-3 py-1.5 text-[12px] text-app-subtle hover:border-app-border-strong">Ghost</button>
          <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[12px] font-medium text-red-400 hover:bg-red-500/20">Danger</button>
        </div>
      </div>
      {/* Inputs */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Form Inputs</p>
        <div className="space-y-2">
          <input placeholder="Text input" className="w-full rounded-lg border border-app-border bg-app-inset px-3 py-2 text-[12px] text-app-text outline-none placeholder:text-app-subtle/50 focus:border-app-accent" />
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-[11px] text-app-text">
              <input type="checkbox" className="rounded" defaultChecked /> Checkbox
            </label>
            <label className="flex items-center gap-2 text-[11px] text-app-text">
              <input type="radio" defaultChecked /> Radio
            </label>
          </div>
        </div>
      </div>
      {/* Grid system */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Grid Anatomy</p>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-6 rounded-sm bg-app-accent/20 text-center text-[8px] leading-6 text-app-accent/60">{i + 1}</div>
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-app-subtle">12-column grid · 16px gutter · Breakpoints: 640 / 768 / 1024 / 1280 / 1536px</p>
      </div>
      {/* Layering */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-app-subtle">Layering Model (z-index)</p>
        <div className="space-y-1">
          {[
            { z: 'z-0',   label: 'Base content' },
            { z: 'z-10',  label: 'Sticky headers / toolbars' },
            { z: 'z-20',  label: 'Dropdowns / popovers' },
            { z: 'z-30',  label: 'Drawers / side panels' },
            { z: 'z-40',  label: 'Modals / dialogs' },
            { z: 'z-50',  label: 'Toasts / notifications' },
          ].map((l) => (
            <div key={l.z} className="flex items-center gap-2">
              <code className="w-12 shrink-0 text-[10px] font-mono text-app-accent">{l.z}</code>
              <span className="text-[10px] text-app-subtle">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function DesignSystemPanel() {
  const [activeTab, setActiveTab] = useState<DSTab>('colors')

  const content: Record<DSTab, React.ReactNode> = {
    colors:      <ColorAnatomy />,
    typography:  <Typography />,
    spacing:     <Spacing />,
    components:  <Components />,
    motion:      <Motion />,
    borders:     <Borders />,
    iconography: <Iconography />,
    messaging:   <Messaging />,
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sub-tab strip */}
      <div className="app-scroll flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-app-border bg-app-surface px-2 py-1.5">
        {DS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-app-elevated text-app-text shadow-sm'
                : 'text-app-subtle hover:text-app-muted',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
        {content[activeTab]}
      </div>
    </div>
  )
}
