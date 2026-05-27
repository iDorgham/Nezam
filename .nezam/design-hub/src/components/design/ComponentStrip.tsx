'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import type { DesignTokens } from '@/types/design'

// ─── Dark override palette (used when previewDark is forced) ──────────────────

const DARK: Record<string, string> = {
  '--p-bg':      '#111112',
  '--p-panel':   '#1c1c1e',
  '--p-border':  '#2e2e30',
  '--p-text':    '#f0f0f0',
  '--p-text-2':  '#a3a3a3',
  '--p-muted':   '#6a6a6a',
  '--p-neu-200': '#242426',
  '--p-neu-300': '#313133',
}

const LIGHT: Record<string, string> = {} // uses token values

// ─── CSS vars builder ─────────────────────────────────────────────────────────

function buildVars(tokens: DesignTokens, dark: boolean): React.CSSProperties {
  const t = tokens
  const b = t.colors.brand
  const s = t.colors.surface
  const tx = t.colors.text
  const n = t.colors.neutral

  const surface = dark ? DARK : {
    '--p-bg':      s.bg,
    '--p-panel':   s.panel,
    '--p-border':  s.border,
    '--p-text':    tx.primary,
    '--p-text-2':  tx.secondary,
    '--p-muted':   tx.muted,
    '--p-neu-200': n['200'],
    '--p-neu-300': n['300'],
  }

  return {
    ...surface,
    '--p-brand':     b['500'],
    '--p-brand-h':   b['400'],
    '--p-brand-s':   b['100'],
    '--p-brand-600': b['600'],
    '--p-radius-sm': t.radius.sm,
    '--p-radius-md': t.radius.md,
    '--p-radius-lg': t.radius.lg,
    '--p-radius-f':  t.radius.full,
    '--p-shadow-sm': t.shadows.sm,
    '--p-shadow-md': t.shadows.md,
    '--p-font-sans': t.typography.sans,
    '--p-font-dis':  t.typography.display,
    '--p-dur':       t.motion.duration.base,
    '--p-ease':      t.motion.easing.default,
    '--p-success':   t.colors.semantic.success,
    '--p-warn':      t.colors.semantic.warning,
    '--p-error':     t.colors.semantic.error,
    '--p-b-w':       t.borders.width,
    '--p-b-s':       t.borders.style,
  } as React.CSSProperties
}

// ─── Root component ───────────────────────────────────────────────────────────

export function ComponentStrip() {
  const tokens = useHub((s) => s.design.tokens)
  const [dark, setDark] = useState(tokens.colors.mode === 'dark')
  const vars = useMemo(() => buildVars(tokens, dark), [tokens, dark])
  const [panelWidth, setPanelWidth] = useState(420)
  const dragRef = useRef<{ startX: number; startW: number } | null>(null)

  const bg     = dark ? DARK['--p-bg']!    : tokens.colors.surface.bg
  const panel  = dark ? DARK['--p-panel']! : tokens.colors.surface.panel
  const border = dark ? DARK['--p-border']!: tokens.colors.surface.border

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startW: panelWidth }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const delta = dragRef.current.startX - ev.clientX // drag left = wider
      const next = Math.min(800, Math.max(280, dragRef.current.startW + delta))
      setPanelWidth(next)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [panelWidth])

  return (
    <aside
      style={{
        width: `${panelWidth}px`,
        minWidth: '280px',
        maxWidth: '800px',
        ...vars,
        borderLeft: `1px solid ${border}`,
        backgroundColor: bg,
        fontFamily: tokens.typography.sans,
        position: 'relative',
      }}
      className="shrink-0 flex flex-col overflow-hidden"
    >
      {/* ── Drag resize handle (left edge) ──── */}
      <div
        onMouseDown={startDrag}
        className="absolute left-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent z-50 transition-colors"
        title="Drag to resize component preview"
      />
      {/* ── Sticky header ─────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 flex shrink-0 items-center gap-3 px-4 py-2.5"
        style={{ backgroundColor: panel, borderBottom: `1px solid ${border}` }}
      >
        <span
          className="flex-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: 'var(--p-muted)' }}
        >
          Component Preview
        </span>

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDark((v) => !v)}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all duration-150"
          style={{
            backgroundColor: dark ? '#2a2a2c' : `${tokens.colors.brand['500']}18`,
            color: dark ? '#a3a3a3' : tokens.colors.brand['500'],
            border: `1px solid ${dark ? '#3a3a3c' : `${tokens.colors.brand['500']}35`}`,
          }}
        >
          {dark ? <Moon size={10} /> : <Sun size={10} />}
          {dark ? 'Dark' : 'Light'}
        </button>
      </div>

      {/* ── Scrollable content ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto app-scroll" style={{ backgroundColor: bg }}>

        <Sec label="Typography">
          <PreviewTypography tokens={tokens} />
        </Sec>

        <Sec label="Buttons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Btn v="primary">Primary</Btn>
            <Btn v="secondary">Secondary</Btn>
            <Btn v="ghost">Ghost</Btn>
            <Btn v="danger">Danger</Btn>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            <Btn v="primary" sz="sm">Small</Btn>
            <Btn v="primary" sz="lg">Large</Btn>
            <Btn v="primary" disabled>Disabled</Btn>
          </div>
        </Sec>

        <Sec label="Inputs">
          <PInput placeholder="Search…" />
          <PInput placeholder="Email address" type="email" />
          <PSelect />
        </Sec>

        <Sec label="Selection">
          <PreviewCheckbox />
          <div style={{ marginTop: '10px' }}>
            <PreviewToggle />
          </div>
        </Sec>

        <Sec label="Avatar & Badges">
          <PreviewAvatar />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
            <Badge col="var(--p-brand)"   bg="var(--p-brand-s)">Active</Badge>
            <Badge col="var(--p-success)" bg="var(--p-success)20">Success</Badge>
            <Badge col="var(--p-warn)"    bg="var(--p-warn)20">Warning</Badge>
            <Badge col="var(--p-error)"   bg="var(--p-error)20">Error</Badge>
            <Badge col="var(--p-muted)"   bg="var(--p-neu-200)">Neutral</Badge>
          </div>
        </Sec>

        <Sec label="Card">
          <PreviewCard />
        </Sec>

        <Sec label="Tabs">
          <PreviewTabs />
        </Sec>

        <Sec label="Navigation">
          <PreviewNav />
          <div style={{ marginTop: '10px' }}>
            <PreviewBreadcrumbs />
          </div>
        </Sec>

        <Sec label="Progress">
          <PreviewProgress />
        </Sec>

        <Sec label="Loading">
          <PreviewLoading />
        </Sec>

        <Sec label="Opacity">
          <OpacityPreview />
        </Sec>

        <Sec label="Alerts">
          <PreviewAlerts />
        </Sec>

        <Sec label="Pagination">
          <PreviewPagination />
        </Sec>

        <Sec label="Tooltips">
          <PreviewTooltip />
        </Sec>

        <Sec label="Form">
          <PreviewForm />
        </Sec>

        <Sec label="Table">
          <PreviewTable />
        </Sec>

        <Sec label="Dialog">
          <PreviewDialog />
        </Sec>

        <Sec label="Dropdown">
          <PreviewDropdown />
        </Sec>

        <Sec label="Toast">
          <PreviewToast />
        </Sec>

        <Sec label="Sidebar">
          <PreviewSidebar />
        </Sec>

        <Sec label="DataTable">
          <PreviewDataTable />
        </Sec>

        <Sec label="Stepper">
          <PreviewStepper />
        </Sec>

        <Sec label="Slider">
          <PreviewSlider />
        </Sec>

        <Sec label="Tags">
          <PreviewTags />
        </Sec>

      </div>
    </aside>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Sec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid var(--p-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--p-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--p-border)' }} />
      </div>
      {children}
    </div>
  )
}

// ─── Opacity Demo ────────────────────────────────────────────────────────────

function OpacityPreview() {
  const opacity = useHub((s) => s.design.tokens.opacity)
  const tokens = useHub((s) => s.design.tokens)
  const brand = tokens.colors.brand['500']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[
        { label: 'Disabled', value: opacity.disabled },
        { label: 'Overlay', value: opacity.overlay },
        { label: 'Hover', value: opacity.hover },
        { label: 'Focus', value: opacity.focus },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--p-muted)', width: '50px' }}>{label}</span>
          <div
            style={{
              flex: 1,
              height: '24px',
              backgroundColor: brand,
              borderRadius: 'var(--p-radius-sm)',
              opacity: Number(value),
            }}
          />
          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--p-text-2)', width: '32px' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

function Btn({
  v, sz, disabled, children,
}: {
  v: 'primary' | 'secondary' | 'ghost' | 'danger'
  sz?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { backgroundColor: 'var(--p-brand)',   color: '#fff',              border: 'none' },
    secondary: { backgroundColor: 'var(--p-panel)',   color: 'var(--p-text)',     border: 'var(--p-b-w) var(--p-b-s) var(--p-border)' },
    ghost:     { backgroundColor: 'transparent',      color: 'var(--p-muted)',    border: 'none' },
    danger:    { backgroundColor: 'rgba(239,68,68,.12)', color: '#ef4444',        border: '1px solid rgba(239,68,68,.25)' },
  }
  const h  = { sm: '26px', md: '32px', lg: '38px' }
  const px = { sm: '10px', md: '14px', lg: '18px' }
  const fs = { sm: '11px', md: '12px', lg: '13px' }
  const s  = sz ?? 'md'

  return (
    <button
      disabled={disabled}
      style={{
        ...styles[v],
        height: h[s], padding: `0 ${px[s]}`,
        borderRadius: 'var(--p-radius-md)',
        fontSize: fs[s], fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        transition: `opacity 0.15s`,
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontFamily: 'var(--p-font-sans)',
      }}
    >
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

function PInput({ placeholder, type }: { placeholder?: string; type?: string }) {
  return (
    <input
      type={type ?? 'text'}
      placeholder={placeholder}
      readOnly
      style={{
        width: '100%', height: '32px',
        padding: '0 11px',
        borderRadius: 'var(--p-radius-md)',
        border: 'var(--p-b-w) var(--p-b-s) var(--p-border)',
        backgroundColor: 'var(--p-panel)',
        color: 'var(--p-text-2)',
        fontSize: '12px',
        outline: 'none',
        fontFamily: 'var(--p-font-sans)',
      }}
    />
  )
}

function PSelect() {
  return (
    <select
      style={{
        width: '100%', height: '32px',
        padding: '0 11px',
        borderRadius: 'var(--p-radius-md)',
        border: 'var(--p-b-w) var(--p-b-s) var(--p-border)',
        backgroundColor: 'var(--p-panel)',
        color: 'var(--p-text-2)',
        fontSize: '12px',
        cursor: 'pointer',
        fontFamily: 'var(--p-font-sans)',
      }}
    >
      <option>Select an option</option>
      <option>Option A</option>
    </select>
  )
}

// ─── Checkbox & Radio ─────────────────────────────────────────────────────────

function PreviewCheckbox() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {[{ checked: true, label: 'Checked' }, { checked: false, label: 'Unchecked' }].map(({ checked, label }) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '15px', width: '15px', borderRadius: '4px',
              border: `1.5px solid ${checked ? 'var(--p-brand)' : 'var(--p-border)'}`,
              backgroundColor: checked ? 'var(--p-brand)' : 'transparent',
              flexShrink: 0,
            }}>
              {checked && (
                <svg viewBox="0 0 10 8" style={{ width: '8px', height: '6px', fill: 'none', stroke: 'white', strokeWidth: 2 }}>
                  <path d="M1 4l3 3 5-6" />
                </svg>
              )}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--p-text)' }}>{label}</span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {[{ sel: true, label: 'Option A' }, { sel: false, label: 'Option B' }].map(({ sel, label }) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '15px', width: '15px', borderRadius: '50%',
              border: `1.5px solid ${sel ? 'var(--p-brand)' : 'var(--p-border)'}`,
              flexShrink: 0,
            }}>
              {sel && <span style={{ height: '7px', width: '7px', borderRadius: '50%', backgroundColor: 'var(--p-brand)' }} />}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--p-text)' }}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function PreviewToggle() {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      {([true, false] as const).map((on) => (
        <div key={String(on)} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{
            height: '18px', width: '32px', borderRadius: '9px',
            backgroundColor: on ? 'var(--p-brand)' : 'var(--p-neu-300)',
            display: 'flex', alignItems: 'center',
            padding: '2px', cursor: 'pointer',
          }}>
            <div style={{
              height: '14px', width: '14px', borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,.35)',
              transform: on ? 'translateX(14px)' : 'translateX(0)',
              transition: '0.12s ease',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--p-muted)' }}>{on ? 'On' : 'Off'}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function PreviewAvatar() {
  const users = [
    { i: 'YD', c: '#3b82f6' }, { i: 'AB', c: '#10b981' },
    { i: 'CX', c: '#8b5cf6' }, { i: 'DM', c: '#f59e0b' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Stacked group */}
      <div style={{ display: 'flex' }}>
        {users.map(({ i, c }, idx) => (
          <div key={idx} style={{
            height: '28px', width: '28px', borderRadius: '50%',
            backgroundColor: c,
            border: '2px solid var(--p-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: '#fff',
            marginLeft: idx > 0 ? '-8px' : 0,
            zIndex: users.length - idx,
          }}>{i}</div>
        ))}
        <div style={{
          height: '28px', width: '28px', borderRadius: '50%',
          backgroundColor: 'var(--p-neu-200)',
          border: '2px solid var(--p-bg)',
          marginLeft: '-8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', fontWeight: 600, color: 'var(--p-muted)',
        }}>+3</div>
      </div>
      {/* Solo sizes */}
      {[36, 28, 20].map((sz) => (
        <div key={sz} style={{
          height: `${sz}px`, width: `${sz}px`, borderRadius: '50%',
          backgroundColor: 'var(--p-brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: `${Math.round(sz * 0.3)}px`, fontWeight: 700, color: '#fff',
        }}>YD</div>
      ))}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ children, col, bg }: { children: React.ReactNode; col: string; bg: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px',
      borderRadius: 'var(--p-radius-f)',
      fontSize: '10px', fontWeight: 600,
      color: col, backgroundColor: bg,
      fontFamily: 'var(--p-font-sans)',
    }}>
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function PreviewCard() {
  return (
    <div style={{
      backgroundColor: 'var(--p-panel)',
      border: 'var(--p-b-w) var(--p-b-s) var(--p-border)',
      borderRadius: 'var(--p-radius-lg)',
      boxShadow: 'var(--p-shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Hero banner */}
      <div style={{
        height: '76px',
        background: `linear-gradient(135deg, var(--p-brand-s), ${`var(--p-brand)`}25)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--p-brand)', opacity: 0.2 }} />
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--p-brand)', opacity: 0.4, position: 'absolute', right: '28px', top: '12px' }} />
      </div>
      <div style={{ padding: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--p-text)', marginBottom: '5px', fontFamily: 'var(--p-font-dis)' }}>Card Title</p>
        <p style={{ fontSize: '11px', color: 'var(--p-muted)', lineHeight: 1.55, marginBottom: '12px' }}>
          A brief description of the card content goes here in two lines.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn v="primary" sz="sm">Action</Btn>
          <Btn v="ghost" sz="sm">Dismiss</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function PreviewTabs() {
  const tabs = ['Overview', 'Details', 'History']
  return (
    <div style={{ border: 'var(--p-b-w) var(--p-b-s) var(--p-border)', borderRadius: 'var(--p-radius-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--p-border)', backgroundColor: 'var(--p-panel)' }}>
        {tabs.map((tab, i) => (
          <button key={tab} style={{
            padding: '8px 13px', fontSize: '11px', fontWeight: i === 0 ? 600 : 400,
            color: i === 0 ? 'var(--p-brand)' : 'var(--p-muted)',
            borderBottom: `2px solid ${i === 0 ? 'var(--p-brand)' : 'transparent'}`,
            backgroundColor: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--p-font-sans)', marginBottom: '-1px',
          }}>{tab}</button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--p-muted)' }}>
        Tab content area
      </div>
    </div>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function PreviewNav() {
  const items = ['Home', 'Features', 'Pricing', 'Docs']
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '2px',
      padding: '4px', borderRadius: 'var(--p-radius-lg)',
      backgroundColor: 'var(--p-panel)',
      border: 'var(--p-b-w) var(--p-b-s) var(--p-border)',
    }}>
      {items.map((item, i) => (
        <span key={item} style={{
          padding: '5px 11px', borderRadius: 'var(--p-radius-md)',
          fontSize: '11px', fontWeight: i === 0 ? 600 : 400,
          color: i === 0 ? 'var(--p-brand)' : 'var(--p-muted)',
          backgroundColor: i === 0 ? 'var(--p-brand-s)' : 'transparent',
          fontFamily: 'var(--p-font-sans)',
        }}>{item}</span>
      ))}
    </div>
  )
}

function PreviewBreadcrumbs() {
  const crumbs = ['Home', 'Products', 'Category']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {crumbs.map((c, i) => (
        <span key={c} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {i > 0 && <span style={{ color: 'var(--p-muted)', fontSize: '10px' }}>/</span>}
          <span style={{
            fontSize: '11px',
            color: i === crumbs.length - 1 ? 'var(--p-text)' : 'var(--p-brand)',
            fontWeight: i === crumbs.length - 1 ? 500 : 400,
          }}>{c}</span>
        </span>
      ))}
    </div>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────

function PreviewProgress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
      {[28, 62, 88].map((pct) => (
        <div key={pct}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--p-muted)' }}>Progress</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--p-text-2)' }}>{pct}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--p-neu-200)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', backgroundColor: 'var(--p-brand)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function PreviewLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {[14, 20, 28].map((sz) => (
          <div key={sz} className="animate-spin" style={{
            width: `${sz}px`, height: `${sz}px`, borderRadius: '50%',
            border: `2px solid var(--p-neu-300)`,
            borderTopColor: 'var(--p-brand)',
          }} />
        ))}
        <span style={{ fontSize: '11px', color: 'var(--p-muted)' }}>Spinners</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[85, 60, 72].map((w, i) => (
          <div key={i} className="animate-pulse" style={{
            height: '9px', width: `${w}%`,
            borderRadius: '5px', backgroundColor: 'var(--p-neu-200)',
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function PreviewPagination() {
  const tokens = useHub((s) => s.design.tokens)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={{
        height: '28px', minWidth: '28px', padding: '0 8px',
        borderRadius: 'var(--p-radius-md)',
        border: '1px solid var(--p-border)',
        backgroundColor: 'var(--p-panel)',
        color: 'var(--p-muted)', fontSize: '11px',
      }}>‹</button>
      {[1, 2, 3].map((p) => (
        <button key={p} style={{
          height: '28px', minWidth: '28px', padding: '0 8px',
          borderRadius: 'var(--p-radius-md)',
          border: 'none',
          backgroundColor: p === 1 ? tokens.colors.brand['500'] : 'var(--p-panel)',
          color: p === 1 ? '#fff' : 'var(--p-text)',
          fontSize: '11px', fontWeight: p === 1 ? 600 : 400,
        }}>{p}</button>
      ))}
      <button style={{
        height: '28px', minWidth: '28px', padding: '0 8px',
        borderRadius: 'var(--p-radius-md)',
        border: '1px solid var(--p-border)',
        backgroundColor: 'var(--p-panel)',
        color: 'var(--p-muted)', fontSize: '11px',
      }}>›</button>
    </div>
  )
}

// ─── Tooltips ───────────────────────────────────────────────────────────────────

function PreviewTooltip() {
  const tokens = useHub((s) => s.design.tokens)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{
        fontSize: '11px', color: 'var(--p-muted)', cursor: 'pointer',
        borderBottom: '1px dotted var(--p-brand)',
      }}>Hover for tooltip</span>
      <div style={{
        position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)',
        padding: '6px 10px', borderRadius: 'var(--p-radius-sm)',
        backgroundColor: tokens.colors.brand['500'], color: '#fff',
        fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap',
        boxShadow: 'var(--p-shadow-md)',
      }}>
        Tooltip text
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          width: '0', height: '0', borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent', borderTop: `6px solid ${tokens.colors.brand['500']}`,
        }} />
      </div>
    </div>
  )
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

function PreviewAlerts() {
  const alerts = [
    { label: 'Info',    color: 'var(--p-brand)',   bg: 'var(--p-brand-s)', dot: '#3b82f6' },
    { label: 'Success', color: 'var(--p-success)', bg: 'var(--p-success)1a', dot: '#10b981' },
    { label: 'Warning', color: 'var(--p-warn)',    bg: 'var(--p-warn)1a',   dot: '#f59e0b' },
    { label: 'Error',   color: 'var(--p-error)',   bg: 'var(--p-error)1a',  dot: '#ef4444' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {alerts.map(({ label, color, bg }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 11px',
          borderRadius: 'var(--p-radius-md)',
          backgroundColor: bg,
          border: `1px solid ${color}2a`,
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color, fontWeight: 500 }}>{label} message</span>
        </div>
      ))}
    </div>
  )
}

// ─── Typography ───────────────────────────────────────────────────────────────

function PreviewTypography({ tokens }: { tokens: DesignTokens }) {
  const steps = [
    { label: '4xl', size: tokens.typography.scale['4xl'].size, weight: 700 },
    { label: '2xl', size: tokens.typography.scale['2xl'].size, weight: 600 },
    { label: 'lg',  size: tokens.typography.scale.lg.size,     weight: 400 },
    { label: 'sm',  size: tokens.typography.scale.sm.size,     weight: 400 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {steps.map((s) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--p-muted)', width: '22px', flexShrink: 0, textTransform: 'uppercase' }}>
            {s.label}
          </span>
          <p style={{
            fontSize: s.size, fontWeight: s.weight, lineHeight: 1.25,
            fontFamily: s.weight >= 600 ? tokens.typography.display : tokens.typography.sans,
            color: 'var(--p-text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            The quick brown fox
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function PreviewForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
      {[['Full Name', 'John Doe'], ['Email', 'john@example.com']].map(([label, ph]) => (
        <div key={label}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--p-text-2)', marginBottom: '5px' }}>{label}</p>
          <PInput placeholder={ph} />
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Btn v="ghost" sz="sm">Cancel</Btn>
        <Btn v="primary" sz="sm">Submit</Btn>
      </div>
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────

function PreviewTable() {
  const rows = [
    { name: 'Alice',   role: 'Admin',  status: 'Active',  s: true },
    { name: 'Bob',     role: 'Member', status: 'Active',  s: true },
    { name: 'Charlie', role: 'Guest',  status: 'Pending', s: false },
  ]
  return (
    <div style={{ border: 'var(--p-b-w) var(--p-b-s) var(--p-border)', borderRadius: 'var(--p-radius-md)', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 64px 64px',
        padding: '7px 12px', backgroundColor: 'var(--p-panel)',
        borderBottom: '1px solid var(--p-border)',
      }}>
        {['Name', 'Role', 'Status'].map((h) => (
          <span key={h} style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={row.name} style={{
          display: 'grid', gridTemplateColumns: '1fr 64px 64px',
          padding: '7px 12px',
          borderBottom: i < rows.length - 1 ? '1px solid var(--p-border)' : 'none',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--p-text)', fontWeight: 500 }}>{row.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--p-muted)' }}>{row.role}</span>
          <Badge
            col={row.s ? 'var(--p-success)' : 'var(--p-warn)'}
            bg={row.s ? 'var(--p-success)1a' : 'var(--p-warn)1a'}
          >{row.status}</Badge>
        </div>
      ))}
    </div>
  )
}

function PreviewDialog() {
  return (
    <div style={{ padding: '12px', border: 'var(--p-b-w) var(--p-b-s) var(--p-border)', borderRadius: 'var(--p-radius-md)', backgroundColor: 'var(--p-panel)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--p-text)' }}>Confirm Workspace Deploy</p>
        <p style={{ fontSize: '10px', color: 'var(--p-muted)', marginTop: '3px' }}>Are you sure you want to broadcast active tokens to production?</p>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Btn v="ghost" sz="sm">Cancel</Btn>
        <Btn v="primary" sz="sm">Deploy</Btn>
      </div>
    </div>
  )
}

function PreviewDropdown() {
  return (
    <div style={{ border: 'var(--p-b-w) var(--p-b-s) var(--p-border)', borderRadius: 'var(--p-radius-md)', overflow: 'hidden', backgroundColor: 'var(--p-panel)' }}>
      {['Edit Settings', 'Share Workspace', 'Delete Instance'].map((item, idx) => (
        <div key={item} style={{
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 500,
          color: idx === 2 ? '#ef4444' : 'var(--p-text-2)',
          cursor: 'pointer',
          borderBottom: idx < 2 ? '1px solid var(--p-border)' : 'none',
        }}>
          {item}
        </div>
      ))}
    </div>
  )
}

function PreviewToast() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      borderRadius: 'var(--p-radius-md)',
      backgroundColor: 'var(--p-brand)',
      color: '#fff',
      boxShadow: 'var(--p-shadow-md)',
    }}>
      <span style={{ fontSize: '11px', fontWeight: 600, flex: 1 }}>Tokens saved to cloud!</span>
      <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', opacity: 0.8 }}>Dismiss</span>
    </div>
  )
}

function PreviewSidebar() {
  return (
    <div style={{ display: 'flex', border: 'var(--p-b-w) var(--p-b-s) var(--p-border)', borderRadius: 'var(--p-radius-md)', overflow: 'hidden', height: '80px' }}>
      <div style={{ width: '56px', backgroundColor: 'var(--p-panel)', borderRight: '1px solid var(--p-border)', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: '14px', borderRadius: 'var(--p-radius-sm)', backgroundColor: i === 1 ? 'var(--p-brand)' : 'var(--p-neu-300)' }} />
        ))}
      </div>
      <div style={{ flex: 1, backgroundColor: 'var(--p-bg)', padding: '8px' }}>
        <div style={{ height: '8px', width: '40px', backgroundColor: 'var(--p-neu-200)', borderRadius: '4px', marginBottom: '6px' }} />
        <div style={{ height: '6px', width: '80px', backgroundColor: 'var(--p-neu-200)', borderRadius: '4px' }} />
      </div>
    </div>
  )
}

function PreviewDataTable() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <PreviewTable />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--p-muted)' }}>
        <span>Showing 1-3 of 42 entries</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Btn v="secondary" sz="sm">Prev</Btn>
          <Btn v="secondary" sz="sm">Next</Btn>
        </div>
      </div>
    </div>
  )
}

function PreviewStepper() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
      {['Scope', 'Design', 'Deploy'].map((step, idx) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%',
            backgroundColor: idx === 0 ? 'var(--p-brand)' : 'var(--p-neu-300)',
            color: '#fff', fontSize: '9px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {idx + 1}
          </div>
          <span style={{ fontSize: '10px', fontWeight: 600, color: idx === 0 ? 'var(--p-text)' : 'var(--p-muted)' }}>{step}</span>
          {idx < 2 && <div style={{ flex: 1, height: '1.5px', backgroundColor: 'var(--p-border)' }} />}
        </div>
      ))}
    </div>
  )
}

function PreviewSlider() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--p-muted)', fontWeight: 600 }}>
        <span>Brightness Scale</span>
        <span>65%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--p-neu-200)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '65%', backgroundColor: 'var(--p-brand)', borderRadius: '999px' }} />
        <div style={{
          position: 'absolute', left: '65%', top: '50%', transform: 'translate(-50%, -50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          backgroundColor: '#fff', border: '2px solid var(--p-brand)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  )
}

function PreviewTags() {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {['SaaS', 'Nezaam', 'Cairo', 'Sahel', 'Responsive'].map((tag) => (
        <span key={tag} style={{
          fontSize: '9px', fontWeight: 700, padding: '3px 8px',
          borderRadius: 'var(--p-radius-sm)',
          backgroundColor: 'var(--p-brand-s)',
          color: 'var(--p-brand-600)',
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}
