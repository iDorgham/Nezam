'use client'

import React from 'react'
import { Settings2, Info, Smartphone, Tablet, Monitor, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import { useLayoutStore } from '@/lib/layout-designer/layout.store'
import { useSessionStore } from '@/lib/store/session.store'
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
      className="w-full bg-ds-background border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary focus:outline-none focus:border-ds-primary/60 appearance-none"
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
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

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
    { value: 1, label: t('1 col (1/12)', 'عمود 1 (1/12)') },
    { value: 2, label: t('2 col (2/12)', 'عمودين (2/12)') },
    { value: 3, label: t('3 col (1/4)', '3 أعمدة (1/4)') },
    { value: 4, label: t('4 col (1/3)', '4 أعمدة (1/3)') },
    { value: 6, label: t('6 col (1/2)', '6 أعمدة (1/2)') },
    { value: 12, label: t('12 col (full)', '12 عمود (كامل)') },
  ]

  const displayOptions: Array<{ value: DisplayMode; label: string }> = [
    { value: 'block', label: t('Block', 'كتلة (Block)') },
    { value: 'flex', label: t('Flex', 'مرن (Flex)') },
    { value: 'grid', label: t('Grid', 'شبكة (Grid)') },
    { value: 'hidden', label: t('Hidden', 'مخفي (Hidden)') },
  ]

  const flexDirOptions: Array<{ value: FlexDirection; label: string }> = [
    { value: 'row', label: t('Row →', 'أفقي (يمين) ←') },
    { value: 'column', label: t('Column ↓', 'رأسي (تحت) ↓') },
    { value: 'row-reverse', label: t('Row ← (reverse)', 'أفقي (يسار) ←') },
    { value: 'column-reverse', label: t('Column ↑ (reverse)', 'رأسي (فوق) ↑') },
  ]

  const alignOptions: Array<{ value: AlignItems; label: string }> = [
    { value: 'start', label: t('Start', 'البداية') },
    { value: 'center', label: t('Center', 'المنتصف') },
    { value: 'end', label: t('End', 'النهاية') },
    { value: 'stretch', label: t('Stretch', 'تمدد') },
  ]

  const justifyOptions: Array<{ value: JustifyContent; label: string }> = [
    { value: 'start', label: t('Start', 'البداية') },
    { value: 'center', label: t('Center', 'المنتصف') },
    { value: 'end', label: t('End', 'النهاية') },
    { value: 'between', label: t('Space Between', 'توزيع متساوي') },
    { value: 'around', label: t('Space Around', 'توزيع مع هوامش') },
    { value: 'evenly', label: t('Space Evenly', 'توزيع دقيق') },
  ]

  const effectiveColSpan = (isDesktop ? slot.colSpan : (bpOverrides.colSpan ?? slot.colSpan)) as GridCols
  const effectiveDisplay = (isDesktop ? slot.display : (bpOverrides.display ?? slot.display)) as DisplayMode

  return (
    <div className="space-y-4">
      {/* Block info */}
      <div className="p-2 rounded-lg bg-ds-surface-hover border border-ds-border">
        <div className="text-[11px] font-semibold text-ds-text-primary mb-0.5">{lang === 'ar' && block?.nameAr ? block.nameAr : (block?.name || slot.blockId)}</div>
        <div className="text-[10px] text-ds-text-muted">{lang === 'ar' && block?.descriptionAr ? block.descriptionAr : block?.description}</div>
        {block && (
          <div className="flex flex-wrap gap-1 mt-2">
            {block.shadcnComponents.slice(0, 5).map(c => (
              <span key={c} className="text-[9px] px-1 py-0.5 rounded bg-ds-surface-subtle text-ds-text-muted font-mono">{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <InspField label={t('Label', 'التسمية')}>
        <input
          value={slot.label}
          onChange={e => update({ label: e.target.value })}
          className="w-full bg-ds-background border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary focus:outline-none focus:border-ds-primary/60"
          placeholder={t('Block label...', 'اسم البلوك...')}
        />
      </InspField>

      {/* Variant */}
      <InspField label={t('Variant', 'النوع')}>
        <InspSelect
          value={slot.variantId}
          onChange={v => update({ variantId: v })}
          options={(block?.variants || []).map(v => ({ 
            value: v.id, 
            label: lang === 'ar' && v.labelAr ? v.labelAr : v.label 
          }))}
        />
      </InspField>

      {/* Breakpoint notice */}
      {!isDesktop && (
        <div className="text-[10px] text-ds-warning bg-ds-warning/10 border border-ds-warning/20 rounded px-2 py-1.5">
          {t(`Editing ${activeBreakpoint} overrides. Desktop values are the base.`, `بتعدل خصائص الـ ${activeBreakpoint}. قيم الكمبيوتر هي الأساس.`)}
        </div>
      )}

      {/* Column span */}
      <InspField label={`${t('Column Span', 'عرض الأعمدة')} ${!isDesktop ? `(${activeBreakpoint})` : ''}`}>
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
              className={`h-1 flex-1 rounded-sm ${i < effectiveColSpan ? 'bg-ds-primary' : 'bg-ds-surface-subtle'}`}
            />
          ))}
        </div>
      </InspField>

      <InspField label={`${t('Display', 'طريقة العرض')} ${!isDesktop ? `(${activeBreakpoint})` : ''}`}>
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
          <InspField label={t('Flex Direction', 'اتجاه العناصر')}>
            <InspSelect<FlexDirection>
              value={slot.flexDir}
              onChange={v => update({ flexDir: v })}
              options={flexDirOptions}
            />
          </InspField>
          <InspField label={t('Align Items', 'محاذاة العناصر')}>
            <InspSelect<AlignItems>
              value={slot.alignItems}
              onChange={v => update({ alignItems: v })}
              options={alignOptions}
            />
          </InspField>
          <InspField label={t('Justify Content', 'توزيع المحتوى')}>
            <InspSelect<JustifyContent>
              value={slot.justifyContent}
              onChange={v => update({ justifyContent: v })}
              options={justifyOptions}
            />
          </InspField>
          <InspField label={t('Gap', 'المسافة بين العناصر')}>
            <SpacingSelect value={slot.gap} onChange={v => update({ gap: v })} />
          </InspField>
        </>
      )}

      {/* Spacing */}
      <div className="space-y-2">
        <div className="text-[10px] text-ds-text-muted uppercase tracking-wide font-medium">{t('Spacing', 'المسافات')}</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9px] text-ds-text-muted mb-1">{t('Padding Top', 'هوامش فوق')}</div>
            <SpacingSelect value={slot.paddingTop} onChange={v => update({ paddingTop: v })} />
          </div>
          <div>
            <div className="text-[9px] text-ds-text-muted mb-1">{t('Padding Bottom', 'هوامش تحت')}</div>
            <SpacingSelect value={slot.paddingBottom} onChange={v => update({ paddingBottom: v })} />
          </div>
          <div className="col-span-2">
            <div className="text-[9px] text-ds-text-muted mb-1">{t('Horizontal Padding', 'هوامش جنبية')}</div>
            <SpacingSelect value={slot.paddingX} onChange={v => update({ paddingX: v })} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <InspField label={t('Notes', 'ملاحظات')}>
        <textarea
          value={slot.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="w-full bg-ds-background border border-ds-border rounded px-2 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary/60 resize-none"
          placeholder={t('Notes for the AI swarm...', 'ملاحظات لفريق الذكاء الاصطناعي...')}
        />
      </InspField>
    </div>
  )
}

// ── Page Inspector ────────────────────────────────────────────────────────────

function PageInspector({ page }: { page: PageLayout }) {
  const { updatePageConfig } = useLayoutStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const update = (updates: Partial<PageLayout>) => updatePageConfig(page.pageId, updates)

  const colOptions: Array<{ value: GridCols; label: string }> = [
    { value: 1, label: t('1 column', 'عمود واحد') },
    { value: 2, label: t('2 columns', 'عمودين') },
    { value: 3, label: t('3 columns', '3 أعمدة') },
    { value: 4, label: t('4 columns', '4 أعمدة') },
    { value: 6, label: t('6 columns', '6 أعمدة') },
    { value: 12, label: t('12 columns (standard)', '12 عمود (قياسي)') },
  ]

  const maxWidthOptions = [
    { value: '640px', label: '640px (sm)' },
    { value: '768px', label: '768px (md)' },
    { value: '1024px', label: '1024px (lg)' },
    { value: '1280px', label: `${t('1280px (xl) — recommended', '1280 بكسل (xl) — مقترح')}` },
    { value: '1440px', label: '1440px (2xl)' },
    { value: '100%', label: t('100% (full fluid)', '100% (كامل العرض)') },
  ]

  return (
    <div className="space-y-4">
      <div className="p-2 rounded-lg bg-ds-surface-hover border border-ds-border">
        <div className="text-[11px] font-semibold text-ds-text-primary mb-0.5">{page.pageName}</div>
        <div className="text-[10px] text-ds-text-muted font-mono">{page.pageRoute}</div>
      </div>

      <InspField label={t('Container Max Width', 'أقصى عرض للحاوية')}>
        <InspSelect
          value={page.containerMaxWidth}
          onChange={v => update({ containerMaxWidth: v })}
          options={maxWidthOptions}
        />
      </InspField>

      <InspField label={t('Grid Columns', 'أعمدة الشبكة')}>
        <InspSelect<GridCols>
          value={page.gridCols}
          onChange={v => update({ gridCols: Number(v) as GridCols })}
          options={colOptions}
        />
      </InspField>

      <InspField label={t('Container Padding (X)', 'هوامش الحاوية')}>
        <SpacingSelect value={page.containerPadding} onChange={v => update({ containerPadding: v })} />
      </InspField>

      <InspField label={t('Row Gap', 'المسافة بين الصفوف')}>
        <SpacingSelect value={page.rowGap} onChange={v => update({ rowGap: v })} />
      </InspField>

      <InspField label={t('Column Gap', 'المسافة بين الأعمدة')}>
        <SpacingSelect value={page.colGap} onChange={v => update({ colGap: v })} />
      </InspField>
    </div>
  )
}

// ── Inspector Panel ───────────────────────────────────────────────────────────

export default function InspectorPanel() {
  const { selectedSlotId, getActivePage } = useLayoutStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
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
            {selectedSlot ? t('Block Inspector', 'خصائص البلوك') : t('Page Config', 'إعدادات الصفحة')}
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
            <div className="text-xs">{t('No page selected', 'مفيش صفحة مختارة')}</div>
          </div>
        )}
      </div>
    </div>
  )
}
