'use client'

import React from 'react'
import { Settings2, Info, Smartphone, Tablet, Monitor, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import { useLayoutStore } from '@/lib/layout-designer/layout.store'
import { COMPONENT_LIBRARY } from '@/lib/layout-designer/component-library'
import type { SpacingKey, GridCols, AlignItems, JustifyContent, FlexDirection, DisplayMode, Breakpoint, LayoutSlot, PageLayout } from '@/lib/layout-designer/types'

// ── Select component ──────────────────────────────────────────────────────────

function InspField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] text-ds-text-muted uppercase tracking-wide font-medium">{label}</div>
      {children}
    </div>
  )
}

function InspSelect<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <select
      value={String(value)}
      onChange={e => onChange(e.target.value as T)}
      className="w-full bg-black/30 border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary focus:outline-none focus:border-ds-primary/60 appearance-none"
    >
      {options.map(o => (
        <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
      ))}
    </select>
  )
}

function SpacingSelect({ value, onChange }: { value: SpacingKey; onChange: (v: SpacingKey) => void }) {
  const opts: SpacingKey[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
  const pxMap: Record<SpacingKey, string> = {
    none: '0', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px', '4xl': '96px'
  }
  return (
    <InspSelect
      value={value}
      onChange={onChange}
      options={opts.map(v => ({ value: v, label: `${v} — ${pxMap[v]}` }))}
    />
  )
}

// ── Slot Inspector ────────────────────────────────────────────────────────────

function SlotInspector({ slot, page }: { slot: LayoutSlot; page: PageLayout }) {
  const { updateSlot, activeBreakpoint } = useLayoutStore()
  const block = COMPONENT_LIBRARY.find(b => b.id === slot.blockId)

  const update = (updates: Partial<LayoutSlot>) => updateSlot(page.pageId, slot.id, updates)

  const bpOverrides = slot.breakpoints[activeBreakpoint] || {}

  const updateBreakpoint = (key: string, value: unknown) => {
    update({
      breakpoints: {
        ...slot.breakpoints,
        [activeBreakpoint]: {
          ...(slot.breakpoints[activeBreakpoint] || {}),
          [key]: value,
        },
      },
    })
  }

  const isDesktop = activeBreakpoint === 'desktop'

  const colOptions: Array<{ value: GridCols; label: string }> = [
    { value: 1, label: '1 col (1/12)' },
    { value: 2, label: '2 col (2/12)' },
    { value: 3, label: '3 col (1/4)' },
    { value: 4, label: '4 col (1/3)' },
    { value: 6, label: '6 col (1/2)' },
    { value: 12, label: '12 col (full)' },
  ]

  const displayOptions: Array<{ value: DisplayMode; label: string }> = [
    { value: 'block', label: 'Block' },
    { value: 'flex', label: 'Flex' },
    { value: 'grid', label: 'Grid' },
    { value: 'hidden', label: 'Hidden' },
  ]

  const flexDirOptions: Array<{ value: FlexDirection; label: string }> = [
    { value: 'row', label: 'Row →' },
    { value: 'column', label: 'Column ↓' },
    { value: 'row-reverse', label: 'Row ← (reverse)' },
    { value: 'column-reverse', label: 'Column ↑ (reverse)' },
  ]

  const alignOptions: Array<{ value: AlignItems; label: string }> = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
    { value: 'stretch', label: 'Stretch' },
  ]

  const justifyOptions: Array<{ value: JustifyContent; label: string }> = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
    { value: 'between', label: 'Space Between' },
    { value: 'around', label: 'Space Around' },
    { value: 'evenly', label: 'Space Evenly' },
  ]

  const effectiveColSpan = (isDesktop ? slot.colSpan : (bpOverrides.colSpan ?? slot.colSpan)) as GridCols
  const effectiveDisplay = (isDesktop ? slot.display : (bpOverrides.display ?? slot.display)) as DisplayMode

  return (
    <div className="space-y-4">
      {/* Block info */}
      <div className="p-2 rounded-lg bg-white/[0.03] border border-ds-border">
        <div className="text-[11px] font-semibold text-ds-text-primary mb-0.5">{block?.name || slot.blockId}</div>
        <div className="text-[10px] text-ds-text-muted">{block?.description}</div>
        {block && (
          <div className="flex flex-wrap gap-1 mt-2">
            {block.shadcnComponents.slice(0, 5).map(c => (
              <span key={c} className="text-[9px] px-1 py-0.5 rounded bg-white/[0.05] text-ds-text-muted font-mono">{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <InspField label="Label">
        <input
          value={slot.label}
          onChange={e => update({ label: e.target.value })}
          className="w-full bg-black/30 border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary focus:outline-none focus:border-ds-primary/60"
          placeholder="Block label..."
        />
      </InspField>

      {/* Variant */}
      <InspField label="Variant">
        <InspSelect
          value={slot.variantId}
          onChange={v => update({ variantId: v })}
          options={(block?.variants || []).map(v => ({ value: v.id, label: v.label }))}
        />
      </InspField>

      {/* Breakpoint notice */}
      {!isDesktop && (
        <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1.5">
          Editing {activeBreakpoint} overrides. Desktop values are the base.
        </div>
      )}

      {/* Column span */}
      <InspField label={`Column Span ${!isDesktop ? `(${activeBreakpoint})` : ''}`}>
        {isDesktop ? (
          <InspSelect<GridCols>
            value={slot.colSpan}
            onChange={v => update({ colSpan: Number(v) as GridCols })}
            options={colOptions}
          />
        ) : (
          <InspSelect<GridCols>
            value={effectiveColSpan}
            onChange={v => updateBreakpoint('colSpan', Number(v))}
            options={colOptions}
          />
        )}
        {/* Visual column bar */}
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-sm ${i < effectiveColSpan ? 'bg-ds-primary' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </InspField>

      {/* Display */}
      <InspField label={`Display ${!isDesktop ? `(${activeBreakpoint})` : ''}`}>
        {isDesktop ? (
          <InspSelect<DisplayMode>
            value={slot.display}
            onChange={v => update({ display: v })}
            options={displayOptions}
          />
        ) : (
          <InspSelect<DisplayMode>
            value={effectiveDisplay}
            onChange={v => updateBreakpoint('display', v)}
            options={displayOptions}
          />
        )}
      </InspField>

      {/* Flex controls (only when display = flex and on desktop) */}
      {isDesktop && slot.display === 'flex' && (
        <>
          <InspField label="Flex Direction">
            <InspSelect<FlexDirection>
              value={slot.flexDir}
              onChange={v => update({ flexDir: v })}
              options={flexDirOptions}
            />
          </InspField>
          <InspField label="Align Items">
            <InspSelect<AlignItems>
              value={slot.alignItems}
              onChange={v => update({ alignItems: v })}
              options={alignOptions}
            />
          </InspField>
          <InspField label="Justify Content">
            <InspSelect<JustifyContent>
              value={slot.justifyContent}
              onChange={v => update({ justifyContent: v })}
              options={justifyOptions}
            />
          </InspField>
          <InspField label="Gap">
            <SpacingSelect value={slot.gap} onChange={v => update({ gap: v })} />
          </InspField>
        </>
      )}

      {/* Spacing */}
      <div className="space-y-2">
        <div className="text-[10px] text-ds-text-muted uppercase tracking-wide font-medium">Spacing</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9px] text-ds-text-muted mb-1">Padding Top</div>
            <SpacingSelect value={slot.paddingTop} onChange={v => update({ paddingTop: v })} />
          </div>
          <div>
            <div className="text-[9px] text-ds-text-muted mb-1">Padding Bottom</div>
            <SpacingSelect value={slot.paddingBottom} onChange={v => update({ paddingBottom: v })} />
          </div>
          <div className="col-span-2">
            <div className="text-[9px] text-ds-text-muted mb-1">Horizontal Padding</div>
            <SpacingSelect value={slot.paddingX} onChange={v => update({ paddingX: v })} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <InspField label="Notes">
        <textarea
          value={slot.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="w-full bg-black/30 border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary/60 resize-none"
          placeholder="Notes for the AI swarm..."
        />
      </InspField>
    </div>
  )
}

// ── Page Inspector ────────────────────────────────────────────────────────────

function PageInspector({ page }: { page: PageLayout }) {
  const { updatePageConfig } = useLayoutStore()
  const update = (updates: Partial<PageLayout>) => updatePageConfig(page.pageId, updates)

  const colOptions: Array<{ value: GridCols; label: string }> = [
    { value: 1, label: '1 column' },
    { value: 2, label: '2 columns' },
    { value: 3, label: '3 columns' },
    { value: 4, label: '4 columns' },
    { value: 6, label: '6 columns' },
    { value: 12, label: '12 columns (standard)' },
  ]

  const maxWidthOptions = [
    { value: '640px', label: '640px (sm)' },
    { value: '768px', label: '768px (md)' },
    { value: '1024px', label: '1024px (lg)' },
    { value: '1280px', label: '1280px (xl) — recommended' },
    { value: '1440px', label: '1440px (2xl)' },
    { value: '100%', label: '100% (full fluid)' },
  ]

  return (
    <div className="space-y-4">
      <div className="p-2 rounded-lg bg-white/[0.03] border border-ds-border">
        <div className="text-[11px] font-semibold text-ds-text-primary mb-0.5">{page.pageName}</div>
        <div className="text-[10px] text-ds-text-muted font-mono">{page.pageRoute}</div>
      </div>

      <InspField label="Container Max Width">
        <InspSelect
          value={page.containerMaxWidth}
          onChange={v => update({ containerMaxWidth: v })}
          options={maxWidthOptions}
        />
      </InspField>

      <InspField label="Grid Columns">
        <InspSelect<GridCols>
          value={page.gridCols}
          onChange={v => update({ gridCols: Number(v) as GridCols })}
          options={colOptions}
        />
      </InspField>

      <InspField label="Container Padding (X)">
        <SpacingSelect value={page.containerPadding} onChange={v => update({ containerPadding: v })} />
      </InspField>

      <InspField label="Row Gap">
        <SpacingSelect value={page.rowGap} onChange={v => update({ rowGap: v })} />
      </InspField>

      <InspField label="Column Gap">
        <SpacingSelect value={page.colGap} onChange={v => update({ colGap: v })} />
      </InspField>
    </div>
  )
}

// ── Inspector Panel ───────────────────────────────────────────────────────────

export default function InspectorPanel() {
  const { selectedSlotId, getActivePage } = useLayoutStore()
  const page = getActivePage()

  const selectedSlot = page?.slots.find(s => s.id === selectedSlotId) ?? null

  return (
    <div className="flex flex-col h-full bg-ds-surface border-s border-ds-border">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-ds-border shrink-0">
        <div className="flex items-center gap-2">
          {selectedSlot ? (
            <Settings2 className="w-3.5 h-3.5 text-ds-primary" />
          ) : (
            <Info className="w-3.5 h-3.5 text-ds-text-muted" />
          )}
          <div className="text-[11px] font-semibold text-ds-text-muted uppercase tracking-wider">
            {selectedSlot ? 'Block Inspector' : 'Page Config'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {page ? (
          selectedSlot ? (
            <SlotInspector slot={selectedSlot} page={page} />
          ) : (
            <PageInspector page={page} />
          )
        ) : (
          <div className="text-center py-8 text-ds-text-muted">
            <div className="text-xs">No page selected</div>
          </div>
        )}
      </div>
    </div>
  )
}
