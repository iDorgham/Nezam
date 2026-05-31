'use client'

import { IconRenderer } from '@/lib/icons'
import {
  CODE_BLOCK_PREVIEW,
  FLOATING_CHROME,
  FLOATING_CHROME_MUTED,
  LOZENGE_NEUTRAL,
  LOZENGE_SUCCESS,
  LOZENGE_WARNING,
  WARNING_BANNER,
  WARNING_BANNER_TEXT,
} from '@/lib/semantic-preview-classes'
import { useDesignPreviewScopeStyle } from '@/lib/use-design-preview-scope'
import { GROUP_ICONS } from '@/data/components-library'
import { StatusBadge } from './StatusBadge'
import type { ComponentDef } from '@/data/components-library'

interface ComponentCardProps {
  component: ComponentDef
  /** Catalog density scale from grid controls (0.75–1.35). */
  scale?: number
}

export function ComponentCard({ component, scale = 1 }: ComponentCardProps) {
  const previewScopeStyle = useDesignPreviewScopeStyle({
    fillHeight: false,
    matchHubChrome: true,
  })

  const iconName = GROUP_ICONS[component.group] ?? 'Box'
  const pad = Math.round(12 * scale)
  const gap = Math.round(10 * scale)
  const iconBox = Math.round(24 * scale)
  const iconSize = Math.max(10, Math.round(12 * scale))
  const titleSize = Math.max(11, Math.round(13 * scale))
  const descSize = Math.max(10, Math.round(11 * scale))
  const previewPad = Math.max(6, Math.round(10 * scale))

  return (
    <div
      className="group flex w-full min-w-0 flex-col rounded-app-lg border border-app-border bg-app-surface hover:border-app-accent/50 hover:shadow-sm transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none"
      style={{ padding: pad, gap }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="shrink-0 rounded-app-sm bg-app-elevated border border-app-border flex items-center justify-center"
            style={{ width: iconBox, height: iconBox }}
          >
            <IconRenderer name={iconName} size={iconSize} className="text-app-muted" />
          </div>
          <p
            className="font-semibold text-app-text truncate leading-tight"
            style={{ fontSize: titleSize }}
          >
            {component.name}
          </p>
        </div>
        <StatusBadge status={component.status} />
      </div>

      {/* Preview stage */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-app-md border border-app-border/60 bg-app-elevated"
        style={{ aspectRatio: '4 / 3' }}
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--app-border) 70%, transparent) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
          style={{ ...previewScopeStyle, padding: previewPad }}
        >
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <ComponentPreview component={component} />
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-app-subtle leading-relaxed line-clamp-2 min-h-[2.5em]"
        style={{ fontSize: descSize }}
      >
        {component.description}
      </p>
    </div>
  )
}

// ─── Compact live previews ────────────────────────────────────────────────────

function ComponentPreview({ component }: { component: ComponentDef }) {
  const previewClass =
    'h-full w-full min-h-0 flex items-center justify-center gap-2 overflow-hidden box-border'

  switch (component.id) {
    case 'button':
      return (
        <div className={previewClass}>
          <button className="px-3 py-1.5 rounded-app-sm text-[11px] font-medium bg-app-accent text-white">
            Button
          </button>
          <button className="px-3 py-1.5 rounded-app-sm text-[11px] font-medium border border-app-border text-app-text">
            Outline
          </button>
        </div>
      )

    case 'input':
      return (
        <div className={previewClass}>
          <input
            readOnly
            className="flex-1 h-7 rounded-app-sm border border-app-border bg-app-surface px-2 text-[11px] text-app-subtle"
            placeholder="Type something…"
          />
        </div>
      )

    case 'checkbox':
      return (
        <div className={previewClass + ' gap-3'}>
          {[true, false].map((checked, i) => (
            <label key={i} className="flex items-center gap-1.5 cursor-pointer">
              <span
                className={`h-3.5 w-3.5 rounded-[3px] border flex items-center justify-center ${
                  checked
                    ? 'bg-app-accent border-app-accent'
                    : 'border-app-border bg-app-surface'
                }`}
              >
                {checked && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </span>
              <span className="text-[11px] text-app-text">{checked ? 'Checked' : 'Unchecked'}</span>
            </label>
          ))}
        </div>
      )

    case 'radio-group':
    case 'field-radio':
      return (
        <div className={previewClass + ' gap-3'}>
          {['Option A', 'Option B'].map((label, i) => (
            <label key={i} className="flex items-center gap-1.5 cursor-pointer">
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${
                  i === 0
                    ? 'border-app-accent'
                    : 'border-app-border'
                }`}
              >
                {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-app-accent" />}
              </span>
              <span className="text-[11px] text-app-text">{label}</span>
            </label>
          ))}
        </div>
      )

    case 'switch':
      return (
        <div className={previewClass + ' gap-4'}>
          {[true, false].map((on, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`h-4 w-7 rounded-full flex items-center px-0.5 transition-colors ${
                  on ? 'bg-app-accent' : 'bg-app-border'
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full bg-white shadow transition-transform ${
                    on ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[11px] text-app-subtle">{on ? 'On' : 'Off'}</span>
            </div>
          ))}
        </div>
      )

    case 'select':
      return (
        <div className={previewClass}>
          <div className="flex-1 h-7 rounded-app-sm border border-app-border bg-app-surface px-2 flex items-center justify-between">
            <span className="text-[11px] text-app-subtle">Choose option…</span>
            <svg viewBox="0 0 10 6" className="w-2.5 h-2 fill-current text-app-muted">
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </div>
        </div>
      )

    case 'range-slider':
      return (
        <div className={previewClass}>
          <div className="flex-1 relative h-1.5 rounded-full bg-app-border">
            <div className="absolute left-0 w-[60%] h-full rounded-full bg-app-accent" />
            <div className="absolute left-[60%] -translate-x-1/2 -translate-y-1/4 h-3.5 w-3.5 rounded-full bg-white border-2 border-app-accent shadow" />
          </div>
        </div>
      )

    case 'avatar':
      return (
        <div className={previewClass + ' gap-2'}>
          <div className="h-7 w-7 rounded-full bg-app-accent flex items-center justify-center text-white text-[10px] font-bold">YD</div>
          <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">AB</div>
          <div className="h-7 w-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">CX</div>
        </div>
      )

    case 'avatar-group':
      return (
        <div className={previewClass}>
          <div className="flex -space-x-2">
            {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'].map((color, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-app-elevated flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="h-7 w-7 rounded-full border-2 border-app-elevated bg-app-border flex items-center justify-center text-[9px] text-app-muted font-medium">
              +3
            </div>
          </div>
        </div>
      )

    case 'badge':
      return (
        <div className={previewClass + ' gap-2'}>
          <span className="px-2 py-0.5 rounded-full bg-app-accent text-white text-[10px] font-medium">12</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-medium">99+</span>
          <span className="px-2 py-0.5 rounded-full bg-app-elevated border border-app-border text-app-muted text-[10px] font-medium">New</span>
        </div>
      )

    case 'lozenge':
      return (
        <div className={previewClass + ' flex-wrap gap-1.5'}>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${LOZENGE_SUCCESS}`}>Done</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${LOZENGE_WARNING}`}>In Progress</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${LOZENGE_NEUTRAL}`}>Backlog</span>
        </div>
      )

    case 'tag':
    case 'tag-group':
      return (
        <div className={previewClass + ' flex-wrap gap-1.5'}>
          {['Design', 'Frontend', 'API'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-app-elevated border border-app-border text-app-muted">
              {t}
              <span className="text-app-muted/60 leading-none">&times;</span>
            </span>
          ))}
        </div>
      )

    case 'tabs':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated flex flex-col overflow-hidden">
          <div className="flex border-b border-app-border">
            {['Overview', 'Details', 'History'].map((t, i) => (
              <button
                key={t}
                className={`px-3 py-1.5 text-[10px] font-medium border-b-2 -mb-px ${
                  i === 0
                    ? 'border-app-accent text-app-accent'
                    : 'border-transparent text-app-subtle hover:text-app-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 px-3 flex items-center">
            <span className="text-[10px] text-app-subtle">Tab content area</span>
          </div>
        </div>
      )

    case 'breadcrumbs':
      return (
        <div className={previewClass}>
          {['Home', 'Products', 'Details'].map((seg, i) => (
            <span key={seg} className="flex items-center gap-1">
              {i > 0 && <span className="text-app-muted text-[11px]">/</span>}
              <span className={`text-[11px] ${i === 2 ? 'text-app-text font-medium' : 'text-app-accent'}`}>{seg}</span>
            </span>
          ))}
        </div>
      )

    case 'pagination':
      return (
        <div className={previewClass + ' gap-0.5'}>
          {['‹', '1', '2', '3', '›'].map((p, i) => (
            <button
              key={i}
              className={`h-6 w-6 rounded text-[11px] flex items-center justify-center ${
                p === '2'
                  ? 'bg-app-accent text-white'
                  : 'text-app-muted hover:bg-app-elevated'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )

    case 'progress-bar':
      return (
        <div className={previewClass + ' flex-col gap-1 py-3'}>
          <div className="w-full h-1.5 rounded-full bg-app-border overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-app-accent" />
          </div>
          <p className="text-[10px] text-app-subtle self-end">67%</p>
        </div>
      )

    case 'spinner':
      return (
        <div className={previewClass + ' gap-3'}>
          {['h-4 w-4', 'h-6 w-6', 'h-8 w-8'].map((sz, i) => (
            <div
              key={i}
              className={`${sz} rounded-full border-2 border-app-border border-t-app-accent animate-spin`}
            />
          ))}
        </div>
      )

    case 'skeleton':
      return (
        <div className={previewClass + ' flex-col gap-1.5 py-2'}>
          <div className="h-2.5 rounded-full bg-app-border w-3/4 animate-pulse" />
          <div className="h-2.5 rounded-full bg-app-border w-1/2 animate-pulse" />
          <div className="h-2.5 rounded-full bg-app-border w-5/6 animate-pulse" />
        </div>
      )

    case 'tooltip':
      return (
        <div className={previewClass}>
          <div className="relative flex flex-col items-center gap-0.5">
            <div className={`${FLOATING_CHROME} text-[10px] px-2 py-1 rounded whitespace-nowrap`}>
              Tooltip text
            </div>
            <div className="w-2 h-1.5 overflow-hidden">
              <div className={`w-2 h-2 ${FLOATING_CHROME} rotate-45 -mt-1 mx-auto`} />
            </div>
            <button className="px-3 py-1 rounded text-[11px] border border-app-border text-app-text bg-app-elevated">
              Hover me
            </button>
          </div>
        </div>
      )

    case 'modal':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden relative bg-app-border/10">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 bg-app-surface rounded-app-sm border border-app-border p-1.5 shadow-md">
            <div className="h-1.5 rounded bg-app-border mb-1 w-3/4" />
            <div className="h-1 rounded bg-app-border/60 mb-2 w-full" />
            <div className="flex gap-1 justify-end">
              <div className="h-3 w-7 rounded bg-app-border" />
              <div className="h-3 w-7 rounded bg-app-accent" />
            </div>
          </div>
        </div>
      )

    case 'drawer':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden relative bg-app-border/10">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-app-surface border-l border-app-border p-2 shadow-lg">
            <div className="h-1.5 rounded bg-app-border mb-1.5 w-3/4" />
            <div className="h-1 rounded bg-app-border/60 w-full mb-1" />
            <div className="h-1 rounded bg-app-border/60 w-5/6" />
          </div>
        </div>
      )

    case 'alert':
    case 'inline-message':
    case 'section-message':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated flex flex-col gap-0.5 justify-center px-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-sky-500 shrink-0" />
            <span className="text-[11px] font-medium text-app-text">Information</span>
          </div>
          <p className="text-[10px] text-app-subtle pl-4.5">This is an informational message.</p>
        </div>
      )

    case 'banner':
      return (
        <div className={`h-full w-full min-h-0 rounded-app-sm flex items-center gap-2 px-3 ${WARNING_BANNER}`}>
          <div className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
          <p className={`text-[11px] font-medium ${WARNING_BANNER_TEXT}`}>System maintenance scheduled</p>
        </div>
      )

    case 'flag':
      return (
        <div className={previewClass}>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-app-sm ${FLOATING_CHROME}`}>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[10px]">Changes saved</span>
            <span className={`${FLOATING_CHROME_MUTED} text-[10px] ml-1`}>&times;</span>
          </div>
        </div>
      )

    case 'empty-state':
      return (
        <div className={previewClass + ' flex-col gap-1'}>
          <div className="h-6 w-6 rounded-full bg-app-border flex items-center justify-center text-app-muted text-[14px]">○</div>
          <p className="text-[10px] text-app-subtle text-center">No items yet</p>
        </div>
      )

    case 'card':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-surface shadow-sm p-2.5 flex flex-col gap-1">
          <div className="h-2 w-2/3 rounded-full bg-app-border" />
          <div className="h-1.5 w-full rounded-full bg-app-border/60" />
          <div className="h-1.5 w-4/5 rounded-full bg-app-border/60" />
        </div>
      )

    case 'data-table':
    case 'table':
    case 'dynamic-table':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden">
          <div className="flex bg-app-elevated border-b border-app-border px-2 py-1 gap-3">
            {['Name', 'Status', 'Date'].map((h) => (
              <span key={h} className="text-[9px] font-semibold text-app-muted flex-1">{h}</span>
            ))}
          </div>
          {[['Row 1', '●', 'Jan'], ['Row 2', '○', 'Feb']].map(([a, b, c], i) => (
            <div key={i} className="flex px-2 py-0.5 gap-3 border-b border-app-border/30 last:border-0">
              <span className="text-[9px] text-app-text flex-1">{a}</span>
              <span className={`text-[9px] flex-1 ${i === 0 ? 'text-emerald-500' : 'text-app-muted'}`}>{b}</span>
              <span className="text-[9px] text-app-subtle flex-1">{c}</span>
            </div>
          ))}
        </div>
      )

    case 'code':
      return (
        <div className={`${previewClass} ${CODE_BLOCK_PREVIEW} border rounded-app-sm px-2`}>
          <code className="text-[10px] font-mono text-green-400">
            {'const x = <Component />'}
          </code>
        </div>
      )

    case 'heading':
    case 'metric-text':
      return (
        <div className={previewClass + ' flex-col gap-0 items-start'}>
          <p className="text-[11px] font-bold text-app-text leading-tight">Page Heading</p>
          <p className="text-[10px] text-app-subtle">Subtitle or description text</p>
        </div>
      )

    case 'progress-indicator':
      return (
        <div className={previewClass + ' gap-1.5'}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                i < 2 ? 'w-5 bg-app-accent' : i === 2 ? 'w-2.5 bg-app-accent/50' : 'w-2.5 bg-app-border'
              }`}
            />
          ))}
        </div>
      )

    case 'steps':
      return (
        <div className={previewClass + ' gap-0'}>
          {['Info', 'Plan', 'Build', 'Ship'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${i < 2 ? 'bg-app-accent text-white' : i === 2 ? 'border-2 border-app-accent text-app-accent' : 'border-2 border-app-border text-app-muted'}`}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <span className="text-[7px] text-app-muted whitespace-nowrap">{step}</span>
              </div>
              {i < 3 && <div className={`h-px w-4 mb-3 ${i < 2 ? 'bg-app-accent' : 'bg-app-border'}`} />}
            </div>
          ))}
        </div>
      )

    // ── Forms (additional) ────────────────────────────────────────────────────

    case 'button-group':
      return (
        <div className={previewClass}>
          <div className="flex rounded-app-sm overflow-hidden border border-app-border divide-x divide-app-border">
            {['Bold', 'Italic', 'Underline'].map((label, i) => (
              <button
                key={label}
                className={`px-3 py-1.5 text-[11px] font-medium ${i === 0 ? 'bg-app-accent text-white' : 'bg-app-elevated text-app-text'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'calendar':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated overflow-hidden px-2 py-1.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-semibold text-app-text">May 2025</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded text-[8px] text-app-muted flex items-center justify-center">‹</div>
              <div className="w-3 h-3 rounded text-[8px] text-app-muted flex items-center justify-center">›</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="text-[7px] text-app-muted text-center">{d}</div>
            ))}
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`text-[7px] text-center rounded ${i === 3 ? 'bg-app-accent text-white' : 'text-app-text'}`}>{i + 19}</div>
            ))}
          </div>
        </div>
      )

    case 'comment-editor':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated overflow-hidden flex flex-col">
          <div className="flex gap-1.5 px-2 py-1 border-b border-app-border/60 bg-app-surface">
            {['B', 'I', 'U', '@', '😊'].map((t) => (
              <span key={t} className="text-[10px] text-app-muted font-medium w-4 text-center">{t}</span>
            ))}
          </div>
          <div className="flex-1 flex items-center px-2">
            <span className="text-[10px] text-app-subtle">Add a comment…</span>
          </div>
        </div>
      )

    case 'date-time-picker':
      return (
        <div className={previewClass + ' gap-1.5'}>
          <div className="flex-1 h-7 rounded-app-sm border border-app-border bg-app-surface px-2 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-app-border flex-shrink-0" />
            <span className="text-[10px] text-app-subtle">Pick a date…</span>
          </div>
          <div className="h-7 px-2 rounded-app-sm border border-app-border bg-app-surface flex items-center gap-1">
            <span className="text-[10px] text-app-text">09:41</span>
            <svg viewBox="0 0 10 6" className="w-2 h-1.5 fill-current text-app-muted"><path d="M0 0l5 6 5-6z" /></svg>
          </div>
        </div>
      )

    case 'dropdown':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated flex flex-col overflow-hidden">
          <button className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-app-text border-b border-app-border/60 bg-app-surface">
            <span className="flex-1 text-left">Actions</span>
            <svg viewBox="0 0 10 6" className="w-2 h-1.5 fill-current text-app-muted"><path d="M0 0l5 6 5-6z" /></svg>
          </button>
          {['Edit', 'Duplicate', 'Delete'].map((item, i) => (
            <div key={item} className={`px-2 py-0.5 text-[10px] flex items-center gap-1.5 ${i === 2 ? 'text-rose-500' : 'text-app-text'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-rose-400' : 'bg-app-border'}`} />
              {item}
            </div>
          ))}
        </div>
      )

    case 'form':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated px-2.5 py-1.5 flex flex-col gap-1.5">
          {['Email address', 'Password'].map((f) => (
            <div key={f} className="flex flex-col gap-0.5">
              <span className="text-[8px] font-medium text-app-muted">{f}</span>
              <div className="h-3.5 rounded border border-app-border bg-app-surface" />
            </div>
          ))}
        </div>
      )

    case 'label':
      return (
        <div className={previewClass + ' flex-col gap-1 items-start'}>
          <span className="text-[10px] font-medium text-app-text">Email address</span>
          <div className="w-full h-6 rounded-app-sm border border-app-border bg-app-surface px-2 flex items-center">
            <span className="text-[10px] text-app-subtle">you@example.com</span>
          </div>
        </div>
      )

    case 'number-input':
      return (
        <div className={previewClass}>
          <div className="flex h-7 rounded-app-sm overflow-hidden border border-app-border">
            <button className="w-6 bg-app-elevated text-app-muted text-sm flex items-center justify-center border-r border-app-border">−</button>
            <div className="flex-1 flex items-center justify-center text-[12px] font-medium text-app-text bg-app-surface">
              42
            </div>
            <button className="w-6 bg-app-elevated text-app-muted text-sm flex items-center justify-center border-l border-app-border">+</button>
          </div>
        </div>
      )

    case 'textarea':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-surface px-2 pt-1.5 pb-1 flex flex-col justify-between">
          <span className="text-[10px] text-app-subtle">Tell us more about your project…</span>
          <div className="self-end text-[9px] text-app-muted">0 / 500</div>
        </div>
      )

    case 'time-picker':
      return (
        <div className={previewClass + ' gap-1'}>
          <div className="flex h-7 rounded-app-sm border border-app-border bg-app-surface overflow-hidden">
            {['09', ':', '41', ' ', 'AM'].map((seg, i) => (
              <div key={i} className={`flex items-center justify-center text-[11px] font-medium ${seg === ':' ? 'text-app-muted px-0.5' : seg === ' ' ? 'w-1' : 'px-1.5 text-app-text'} ${i === 0 || i === 2 ? 'hover:bg-app-elevated cursor-pointer' : ''}`}>
                {seg}
              </div>
            ))}
          </div>
        </div>
      )

    case 'token-field':
      return (
        <div className={previewClass + ' flex-wrap gap-1 py-1.5'}>
          {['Design', 'React'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-app-accent/15 border border-app-accent/30 text-[10px] text-app-accent font-medium">
              {t}
              <span className="text-app-accent/60 text-[10px] leading-none">&times;</span>
            </span>
          ))}
          <div className="flex-1 min-w-12 h-5 flex items-center">
            <span className="text-[10px] text-app-subtle">Add tag…</span>
          </div>
        </div>
      )

    // ── Images ────────────────────────────────────────────────────────────────

    case 'icon':
      return (
        <div className={previewClass + ' gap-3'}>
          {[
            <svg key="s" viewBox="0 0 16 16" className="w-4 h-4 fill-current text-app-accent"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/><path d="M8 4a.75.75 0 0 1 .75.75v3.5h2.5a.75.75 0 0 1 0 1.5h-3.25a.75.75 0 0 1-.75-.75v-4.25A.75.75 0 0 1 8 4z"/></svg>,
            <svg key="h" viewBox="0 0 16 16" className="w-4 h-4 fill-current text-app-muted"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-3.315 0-6 2.686-6 4 0 .552.448 1 1 1h10c.552 0 1-.448 1-1 0-1.314-2.685-4-6-4z"/></svg>,
            <svg key="c" viewBox="0 0 16 16" className="w-4 h-4 fill-current text-emerald-500"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>,
            <svg key="w" viewBox="0 0 16 16" className="w-4 h-4 fill-current text-amber-500"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.25 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>,
          ]}
        </div>
      )

    case 'image':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-app-border/20">
            <div className="w-6 h-5 border border-app-border rounded flex items-end overflow-hidden">
              <div className="w-2 h-2 rounded-sm bg-amber-400 ml-0.5 mb-0.5" />
              <div className="flex-1 h-3 bg-sky-300/60 mt-auto" />
            </div>
            <span className="text-[8px] text-app-muted">image.png</span>
          </div>
        </div>
      )

    case 'logo':
      return (
        <div className={previewClass + ' gap-4'}>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-app-accent flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-sm" />
            </div>
            <span className="text-[13px] font-bold text-app-text tracking-tight">YourApp</span>
          </div>
          <div className="w-5 h-5 rounded bg-app-accent" />
        </div>
      )

    case 'tile':
      return (
        <div className={previewClass + ' gap-2'}>
          {[
            { label: 'Design', active: true },
            { label: 'Develop', active: false },
            { label: 'Deploy', active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 rounded-app-sm border px-2 py-1 text-[10px] cursor-pointer ${active ? 'border-app-accent bg-app-accent/10 text-app-accent' : 'border-app-border text-app-muted'}`}
            >
              <div className={`w-3 h-3 rounded-sm ${active ? 'bg-app-accent' : 'bg-app-border'}`} />
              {label}
            </div>
          ))}
        </div>
      )

    // ── Layout ────────────────────────────────────────────────────────────────

    case 'divider':
      return (
        <div className={previewClass + ' flex-col gap-1.5'}>
          <span className="text-[10px] text-app-text">Section A</span>
          <div className="w-full h-px bg-app-border" />
          <span className="text-[10px] text-app-subtle">Section B</span>
        </div>
      )

    case 'page':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden bg-app-surface flex flex-col">
          <div className="h-4 bg-app-elevated border-b border-app-border flex items-center px-2 gap-1.5">
            <div className="w-10 h-1.5 rounded-full bg-app-border" />
            <div className="flex-1" />
            <div className="w-6 h-1.5 rounded-full bg-app-border" />
          </div>
          <div className="flex flex-1">
            <div className="w-10 bg-app-elevated border-r border-app-border" />
            <div className="flex-1 p-1.5 flex flex-col gap-1">
              <div className="h-1.5 rounded-full bg-app-border w-1/2" />
              <div className="h-1 rounded-full bg-app-border/60 w-full" />
              <div className="h-1 rounded-full bg-app-border/60 w-3/4" />
            </div>
          </div>
        </div>
      )

    case 'page-header':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated px-3 flex items-center gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <div className="h-2 w-24 rounded-full bg-app-text/60" />
            <div className="h-1.5 w-36 rounded-full bg-app-border" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 px-2 rounded bg-app-border flex items-center">
              <div className="h-1.5 w-8 rounded-full bg-app-muted" />
            </div>
            <div className="h-5 px-2 rounded bg-app-accent flex items-center">
              <div className="h-1.5 w-8 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      )

    case 'section-header':
      return (
        <div className={previewClass + ' flex-col gap-1 items-start'}>
          <div className="h-2 w-28 rounded-full bg-app-text/70" />
          <div className="h-1.5 w-48 rounded-full bg-app-border" />
        </div>
      )

    case 'sidebar-layout':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden bg-app-surface flex">
          <div className="w-10 bg-app-elevated border-r border-app-border flex flex-col gap-1 p-1.5">
            <div className="h-1.5 w-full rounded-full bg-app-accent" />
            <div className="h-1.5 w-full rounded-full bg-app-border" />
            <div className="h-1.5 w-full rounded-full bg-app-border" />
          </div>
          <div className="flex-1 p-2 flex flex-col gap-1.5">
            <div className="h-2 w-20 rounded-full bg-app-border" />
            <div className="h-1.5 w-full rounded-full bg-app-border/60" />
            <div className="h-1.5 w-3/4 rounded-full bg-app-border/60" />
          </div>
        </div>
      )

    // ── Messaging ─────────────────────────────────────────────────────────────

    case 'spotlight':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden relative bg-black/5">
          <div className="absolute inset-0 bg-black/30" />
          {/* Spotlight hole */}
          <div className="absolute top-2 right-3 w-8 h-5 rounded bg-app-surface border-2 border-app-accent shadow-lg shadow-app-accent/30" />
          {/* Tooltip */}
          <div className={`absolute bottom-1.5 right-1.5 w-20 rounded p-1 ${FLOATING_CHROME}`}>
            <div className="text-[8px] font-medium mb-0.5">New feature!</div>
            <div className={`text-[7px] ${FLOATING_CHROME_MUTED}`}>Click here to try it</div>
          </div>
        </div>
      )

    // ── Navigation ────────────────────────────────────────────────────────────

    case 'link':
      return (
        <div className={previewClass + ' flex-col gap-1 items-start'}>
          <span className="text-[12px] text-app-text">Read the <span className="text-app-accent underline cursor-pointer">documentation</span> first.</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-app-accent cursor-pointer">
            View all components
            <span className="text-[10px]">→</span>
          </span>
        </div>
      )

    case 'menu':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm bg-app-elevated overflow-hidden py-1">
          {[
            { label: 'Dashboard', active: true },
            { label: 'Settings', active: false },
            { label: 'Help', active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-2.5 py-0.5 text-[10px] ${active ? 'text-app-accent bg-app-accent/10' : 'text-app-text'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-app-accent' : 'bg-app-border'}`} />
              {label}
            </div>
          ))}
        </div>
      )

    case 'nav-system':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden flex flex-col">
          {/* Top nav */}
          <div className="h-7 bg-app-elevated border-b border-app-border flex items-center px-2 gap-2">
            <div className="w-4 h-4 rounded bg-app-accent" />
            <span className="text-[9px] font-bold text-app-text">YourApp</span>
            <div className="flex-1" />
            <div className="flex gap-1.5">
              {['⚙', '?', 'YD'].map((i, idx) => (
                <div key={idx} className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${idx === 2 ? 'bg-app-accent text-white' : 'text-app-muted'}`}>{i}</div>
              ))}
            </div>
          </div>
          {/* Side + content */}
          <div className="flex flex-1">
            <div className="w-8 bg-app-surface border-r border-app-border/60 flex flex-col gap-1 py-1 px-1">
              {[0,1,2].map((i) => <div key={i} className={`h-3 rounded ${i === 0 ? 'bg-app-accent/30' : 'bg-app-border/40'}`} />)}
            </div>
            <div className="flex-1 bg-app-bg" />
          </div>
        </div>
      )

    // ── Overlays ──────────────────────────────────────────────────────────────

    case 'blanket':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden relative">
          {/* Content underneath */}
          <div className="absolute inset-0 bg-app-surface flex flex-col gap-1 p-2">
            <div className="h-1.5 w-3/4 rounded bg-app-border/60" />
            <div className="h-1.5 w-full rounded bg-app-border/40" />
          </div>
          {/* Blanket */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-[9px] text-white/60 font-medium">Blanket overlay</span>
          </div>
        </div>
      )

    case 'inline-dialog':
      return (
        <div className={previewClass}>
          <div className="relative">
            <button className="px-2 py-1 rounded-app-sm text-[11px] border border-app-border text-app-text bg-app-elevated">
              Options
            </button>
            {/* Popup */}
            <div className="absolute left-0 top-full mt-0.5 w-24 bg-app-surface border border-app-border rounded-app-sm shadow-md p-1.5 z-10">
              <div className="text-[9px] font-semibold text-app-muted mb-1 px-1">Confirm</div>
              <p className="text-[8px] text-app-subtle px-1 mb-1.5">Are you sure?</p>
              <div className="flex gap-1">
                <div className="h-4 flex-1 rounded bg-app-border" />
                <div className="h-4 flex-1 rounded bg-app-accent" />
              </div>
            </div>
          </div>
        </div>
      )

    case 'popup':
      return (
        <div className={previewClass}>
          <div className="relative">
            <button className="px-2.5 py-1.5 rounded-app-sm text-[11px] bg-app-accent text-white font-medium">
              Open
            </button>
            <div className="absolute left-full top-0 ml-1 w-24 bg-app-surface border border-app-border rounded-app-sm shadow-lg p-2 z-10">
              <div className="h-1.5 w-12 rounded-full bg-app-border mb-1.5" />
              <div className="h-1 w-full rounded-full bg-app-border/60 mb-1" />
              <div className="h-1 w-3/4 rounded-full bg-app-border/60" />
            </div>
          </div>
        </div>
      )

    // ── Status (additional) ───────────────────────────────────────────────────

    case 'progress-tracker':
      return (
        <div className={previewClass + ' gap-0'}>
          {['Plan', 'Build', 'Review', 'Ship'].map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold ${i < 2 ? 'bg-app-accent text-white' : i === 2 ? 'border-2 border-app-accent text-app-accent' : 'border-2 border-app-border text-app-muted'}`}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <span className="text-[7px] text-app-muted mt-0.5 whitespace-nowrap">{stage}</span>
              </div>
              {i < 3 && (
                <div className={`h-px w-5 mb-3 ${i < 2 ? 'bg-app-accent' : 'bg-app-border'}`} />
              )}
            </div>
          ))}
        </div>
      )

    // ── Text and data (additional) ────────────────────────────────────────────

    case 'inline-edit':
      return (
        <div className={previewClass}>
          <div className="group/ie relative flex-1">
            <div className="px-1.5 py-1 rounded border-2 border-app-accent bg-app-surface flex items-center justify-between">
              <span className="text-[12px] font-medium text-app-text">Editable title</span>
              <span className="text-[9px] text-app-accent opacity-70">editing</span>
            </div>
            <div className="flex gap-1 mt-0.5 justify-end">
              <div className="h-4 px-1.5 rounded bg-app-border text-[9px] text-app-muted flex items-center">✕</div>
              <div className="h-4 px-1.5 rounded bg-app-accent text-[9px] text-white flex items-center">✓</div>
            </div>
          </div>
        </div>
      )

    case 'table-tree':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden">
          <div className="flex bg-app-elevated border-b border-app-border px-2 py-0.5 gap-2">
            <span className="text-[8px] font-semibold text-app-muted flex-1">Name</span>
            <span className="text-[8px] font-semibold text-app-muted w-12">Status</span>
          </div>
          {[
            { indent: 0, name: 'Project', status: '●', color: 'text-emerald-500' },
            { indent: 1, name: '↳ Design', status: '●', color: 'text-emerald-500' },
            { indent: 1, name: '↳ Build', status: '○', color: 'text-amber-500' },
          ].map((row, i) => (
            <div key={i} className="flex items-center px-2 py-0.5 gap-2 border-b border-app-border/30 last:border-0">
              <span className="text-[8px] text-app-text flex-1" style={{ paddingLeft: `${row.indent * 8}px` }}>{row.name}</span>
              <span className={`text-[8px] w-12 ${row.color}`}>{row.status}</span>
            </div>
          ))}
        </div>
      )

    // ── Primitives ────────────────────────────────────────────────────────────

    case 'box':
      return (
        <div className={previewClass + ' gap-2'}>
          <div className="w-10 h-8 rounded-app-sm border-2 border-app-accent/40 bg-app-accent/10 flex items-center justify-center">
            <span className="text-[8px] text-app-accent font-medium">Box</span>
          </div>
          <div className="flex flex-col gap-1 text-[9px] text-app-muted">
            <span>p=space.4</span>
            <span>bg=surface</span>
            <span>r=md</span>
          </div>
        </div>
      )

    case 'flex':
      return (
        <div className={previewClass + ' flex-col gap-1 py-2'}>
          <span className="text-[8px] text-app-muted self-start font-mono">direction=row gap=sm</span>
          <div className="flex gap-1.5">
            {['A', 'B', 'C'].map((l) => (
              <div key={l} className="w-6 h-5 rounded bg-app-accent/20 border border-app-accent/30 flex items-center justify-center text-[9px] text-app-accent font-bold">{l}</div>
            ))}
          </div>
        </div>
      )

    case 'grid':
      return (
        <div className={previewClass + ' flex-col gap-1 py-1.5'}>
          <span className="text-[8px] text-app-muted self-start font-mono">cols=3 gap=xs</span>
          <div className="grid grid-cols-3 gap-1 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 rounded bg-app-accent/20 border border-app-accent/20" />
            ))}
          </div>
        </div>
      )

    case 'inline':
      return (
        <div className={previewClass + ' flex-wrap gap-1.5'}>
          {['Token', 'React', 'Design', 'System', 'API'].map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-app-elevated border border-app-border text-[10px] text-app-text">{t}</span>
          ))}
        </div>
      )

    case 'stack':
      return (
        <div className={previewClass + ' gap-2'}>
          <div className="flex flex-col gap-1">
            {['Header', 'Body', 'Footer'].map((l) => (
              <div key={l} className="h-3 px-2 rounded bg-app-accent/15 border border-app-accent/20 flex items-center">
                <span className="text-[8px] text-app-accent">{l}</span>
              </div>
            ))}
          </div>
          <span className="text-[8px] text-app-muted font-mono">direction=column</span>
        </div>
      )

    case 'pressable':
      return (
        <div className={previewClass + ' gap-3'}>
          <div className="px-3 py-1.5 rounded-app-sm border border-app-border bg-app-elevated text-[11px] text-app-text cursor-pointer active:scale-95 hover:border-app-accent transition-all">
            Press me
          </div>
          <div className="text-[9px] text-app-muted text-center">press, hover,<br/>focus states</div>
        </div>
      )

    case 'anchor':
      return (
        <div className={previewClass + ' flex-col gap-0.5 items-start'}>
          <span className="text-[11px] text-app-accent underline cursor-pointer">anchor-element</span>
          <span className="text-[9px] text-app-muted font-mono">href="/docs"</span>
        </div>
      )

    case 'focusable':
      return (
        <div className={previewClass}>
          <div className="px-3 py-1.5 rounded-app-sm border-2 border-app-accent text-[11px] text-app-text ring-2 ring-app-accent/30 ring-offset-1">
            Focused element
          </div>
        </div>
      )

    case 'responsive':
      return (
        <div className={previewClass + ' gap-2'}>
          {[{ icon: '🖥', label: 'lg: show' }, { icon: '📱', label: 'sm: hide' }].map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-0.5">
              <span className="text-base leading-none">{r.icon}</span>
              <span className="text-[8px] text-app-muted">{r.label}</span>
            </div>
          ))}
        </div>
      )

    case 'bleed':
      return (
        <div className="h-full w-full min-h-0 rounded-app-sm overflow-hidden bg-app-elevated relative">
          {/* Parent box */}
          <div className="absolute inset-2 border border-dashed border-app-border rounded flex items-center justify-center">
            {/* Bleed child breaks out */}
            <div className="absolute -inset-x-2 h-4 bg-app-accent/20 border-y border-app-accent/30 flex items-center justify-center">
              <span className="text-[8px] text-app-accent font-mono">bleed(-x: 2)</span>
            </div>
          </div>
        </div>
      )

    // ── Libraries / Tooling ───────────────────────────────────────────────────

    case 'design-tokens':
      return (
        <div className={previewClass + ' gap-2'}>
          {['--color-brand', '--space-4', '--radius-md'].map((t, i) => (
            <div key={t} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['var(--app-accent)', 'var(--app-border)', 'var(--app-text)'][i] }} />
              <span className="text-[8px] font-mono text-app-muted">{t}</span>
            </div>
          ))}
        </div>
      )

    case 'motion':
      return (
        <div className={previewClass + ' gap-3'}>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-app-muted">duration</span>
            <div className="h-1.5 w-full rounded-full bg-app-border overflow-hidden">
              <div className="h-full w-1/2 bg-app-accent rounded-full" style={{ animation: 'none' }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-app-muted">easing</span>
            <div className="h-5 w-12">
              <svg viewBox="0 0 40 20" className="w-full h-full">
                <path d="M2 18 Q10 18 20 2 Q30 -2 38 2" stroke="var(--app-accent)" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      )

    default:
      // For libraries/tooling/deprecated that genuinely have no visual preview
      return (
        <div className={previewClass}>
          <span className="text-[10px] text-app-muted italic">Preview not available</span>
        </div>
      )
  }
}
