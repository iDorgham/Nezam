'use client'

import React from 'react'
import { useWireframeStore } from '@/lib/store/wireframe.store'
import { useSessionStore } from '@/lib/store/session.store'
import { getBlockById } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import {
  Sliders,
  Info,
  Tag,
  CheckSquare,
  Layers,
  Lock,
  Download,
  FileText,
  Plus,
  ChevronRight,
  Map,
} from 'lucide-react'

interface Props {
  pageId: string
}

// ─── Block inspector ──────────────────────────────────────────────────────────

function BlockInspector({ pageId, instanceId }: { pageId: string; instanceId: string }) {
  const { pages, updateSlotVariant, updateSlotNotes, toggleSlotApproval } = useWireframeStore()
  const page = pages[pageId]
  const slot = page?.slots.find(s => s.instanceId === instanceId)

  if (!slot) return null

  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const block = getBlockById(slot.blockId)
  if (!block) {
    return (
      <div className="p-4 text-xs text-ds-text-muted text-center">
        {t('Block definition not found.', 'تعريف المكون غير موجود.')}
      </div>
    )
  }

  const svgContent = getBlockSvg(block.svgCategory, slot.variantId)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Block header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-ds-text-primary">{block.name}</span>
          {slot.approved && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-ds-success/10 text-ds-success font-medium">
              {t('Approved', 'تمت الموافقة')}
            </span>
          )}
        </div>
        <div className="text-[10px] text-ds-text-muted">{block.description}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-ds-surface-hover text-ds-text-muted uppercase font-semibold">
            {block.category}
          </span>
          <span className="text-[9px] text-ds-text-muted">
            {slot.variantId} · {block.defaultHeight}px {t('height', 'ارتفاع')}
          </span>
        </div>
      </div>

      {/* SVG preview */}
      <div className="rounded-xl overflow-hidden border border-ds-border bg-ds-background">
        <div
          className="w-full h-28 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Variant picker */}
      <div>
        <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">
          {t('Variant', 'النوع')}
        </label>
        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
          {block.variants.map(v => (
            <button
              key={v.id}
              onClick={() => updateSlotVariant(pageId, instanceId, v.id)}
              className={`px-3 py-2 rounded-lg text-start text-xs transition-all border ${
                slot.variantId === v.id
                  ? 'border-ds-primary bg-ds-primary/10 text-ds-text-primary'
                  : 'border-ds-border bg-ds-surface text-ds-text-muted hover:border-ds-border hover:text-ds-text-primary'
              }`}
            >
              <div className="font-medium">{v.label}</div>
              {v.description && (
                <div className="text-[9px] text-ds-text-muted mt-0.5">{v.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">
          {t('Notes', 'ملاحظات')}
        </label>
        <textarea
          value={slot.notes}
          onChange={e => updateSlotNotes(pageId, instanceId, e.target.value)}
          placeholder={t('Add implementation notes…', 'أضف ملاحظات التنفيذ...')}
          className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-muted placeholder-ds-text-muted/40 focus:outline-none focus:border-ds-primary/50 resize-none"
          rows={3}
        />
      </div>

      {/* Tags */}
      {block.tags.length > 0 && (
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">
            {t('Tags', 'الوسوم')}
          </label>
          <div className="flex flex-wrap gap-1">
            {block.tags.map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-ds-surface-hover text-ds-text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Approve toggle */}
      <button
        onClick={() => toggleSlotApproval(pageId, instanceId)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
          slot.approved
            ? 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 border border-[#10b981]/20'
            : 'bg-ds-surface-hover text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary border border-ds-border'
        }`}
      >
        <CheckSquare size={13} />
        {slot.approved ? t('Approved', 'تمت الموافقة') : t('Mark as Approved', 'تحديد كموافق عليه')}
      </button>
    </div>
  )
}

// ─── Page summary ─────────────────────────────────────────────────────────────

function PageSummary({ pageId }: { pageId: string }) {
  const { pages, lockPage } = useWireframeStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const page = pages[pageId]

  if (!page) return null

  const total = page.slots.length
  const approved = page.slots.filter(s => s.approved).length
  const locked = !!page.lockedAt

  const byCategory: Record<string, number> = {}
  page.slots.forEach(slot => {
    const block = getBlockById(slot.blockId)
    if (block) byCategory[block.category] = (byCategory[block.category] ?? 0) + 1
  })

  const handleExportPage = () => {
    const data = JSON.stringify(page, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wireframe-${pageId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-xs font-semibold text-ds-text-primary mb-1">{page.pageTitle}</div>
        {locked && (
          <div className="flex items-center gap-1 text-[10px] text-ds-success">
            <Lock size={10} />
            {t('Locked', 'مغلق')} {new Date(page.lockedAt!).toLocaleDateString(lang)}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: t('Total Blocks', 'إجمالي المكونات'), value: total },
          { label: t('Approved', 'تمت الموافقة'), value: approved },
          { label: t('Pending', 'قيد الانتظار'), value: total - approved },
          { label: t('Progress', 'التقدم'), value: total > 0 ? `${Math.round(approved / total * 100)}%` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-ds-surface border border-ds-border rounded-xl p-3">
            <div className="text-[10px] text-ds-text-muted mb-1">{label}</div>
            <div className="text-base font-bold text-ds-text-primary">{value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-ds-text-muted mb-1">
            <span>{t('Approval progress', 'تقدم الموافقة')}</span>
            <span>{approved}/{total}</span>
          </div>
          <div className="h-1.5 bg-ds-surface-hover rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${lang === 'ar' ? 'from-ds-success to-ds-primary' : 'from-ds-primary to-ds-success'} rounded-full transition-all`}
              style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">{t('By Category', 'حسب الفئة')}</div>
          <div className="space-y-1">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-[10px] text-ds-text-muted capitalize flex-1">{cat}</span>
                <div className="flex-1 h-1 bg-ds-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ds-primary/50 rounded-full"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-ds-text-muted w-4 text-end tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block sequence */}
      {page.slots.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">{t('Block Sequence', 'تسلسل المكونات')}</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {page.slots.map((slot, i) => (
              <div key={slot.instanceId} className="flex items-center gap-2 py-1">
                <span className="text-[10px] text-ds-text-muted tabular-nums w-4">{i + 1}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${slot.approved ? 'bg-ds-success' : 'bg-ds-surface-hover'}`} />
                <span className="text-[10px] text-ds-text-muted truncate flex-1">{slot.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {!locked && total > 0 && (
          <button
            onClick={() => lockPage(pageId)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-ds-success/10 text-ds-success hover:bg-ds-success/20 border border-ds-success/20 transition-all"
          >
            <Lock size={13} />
            {t('Lock Page', 'قفل الصفحة')}
          </button>
        )}
        <button
          onClick={handleExportPage}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-ds-surface-hover text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary border border-ds-border transition-all"
        >
          <Download size={13} />
          {t('Export Page JSON', 'تصدير JSON للصفحة')}
        </button>
      </div>
    </div>
  )
}

// ─── Pages tab ────────────────────────────────────────────────────────────────

function PagesTab() {
  const { sitemap, lang, openTab } = useSessionStore()
  const {
    pages,
    activePageId,
    initPage,
    setActivePage,
    exportToJson,
  } = useWireframeStore()
  const [saving, setSaving] = React.useState(false)

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const handleSelectPage = (pageId: string, pageTitle: string) => {
    initPage(pageId, pageTitle)
    setActivePage(pageId)
  }

  const handleExport = async () => {
    setSaving(true)
    try {
      const json = exportToJson()
      await fetch('/api/export-wireframes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      })
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setSaving(false)
    }
  }

  const sitemapGroups: Record<string, typeof sitemap> = {
    public: sitemap.filter(p => p.type === 'public'),
    auth:   sitemap.filter(p => p.type === 'auth'),
    admin:  sitemap.filter(p => p.type === 'admin'),
    modal:  sitemap.filter(p => p.type === 'modal'),
    embed:  sitemap.filter(p => p.type === 'embed'),
  }

  const groupLabels: Record<string, string> = {
    public: t('Public', 'العامة'),
    auth:   t('Auth', 'المصادقة'),
    admin:  t('Admin', 'الإدارة'),
    modal:  t('Modals', 'النوافذ'),
    embed:  t('Embed', 'المضمّنة'),
  }

  const getSlotCount = (pageId: string) => pages[pageId]?.slots.length ?? 0
  const isLocked = (pageId: string) => !!pages[pageId]?.lockedAt
  const approvalPct = (pageId: string) => {
    const p = pages[pageId]
    if (!p || p.slots.length === 0) return 0
    return Math.round(p.slots.filter(s => s.approved).length / p.slots.length * 100)
  }

  const totalPages = sitemap.length
  const wireframedPages = sitemap.filter(p => (pages[p.id]?.slots.length ?? 0) > 0).length

  return (
    <div className="flex flex-col h-full">
      {/* Summary strip */}
      <div className="px-4 py-3 border-b border-ds-border bg-ds-surface-hover/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">
            {t('Project Pages', 'صفحات المشروع')}
          </span>
          <button
            onClick={() => openTab({ id: 'sitemap', title: t('Sitemap', 'خريطة الموقع'), type: 'sitemap' })}
            className="p-1 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-primary transition-colors"
            title={t('Open Sitemap', 'فتح خريطة الموقع')}
          >
            <Plus size={13} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-ds-text-muted">
          <span className="text-ds-text-primary font-semibold">{wireframedPages}</span>
          <span>/ {totalPages} {t('wireframed', 'مخطط')}</span>
        </div>
        {totalPages > 0 && (
          <div className="mt-2 h-1 bg-ds-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-primary rounded-full transition-all"
              style={{ width: `${totalPages > 0 ? (wireframedPages / totalPages) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Page list */}
      <div className="flex-1 overflow-y-auto py-1">
        {sitemap.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Map size={22} className="mx-auto text-ds-text-muted/20 mb-2" />
            <p className="text-xs text-ds-text-muted mb-3">{t('No pages in sitemap', 'لا توجد صفحات')}</p>
            <button
              onClick={() => openTab({ id: 'sitemap', title: 'Sitemap', type: 'sitemap' })}
              className="text-xs text-ds-primary hover:underline"
            >
              {t('Open Sitemap →', 'افتح خريطة الموقع →')}
            </button>
          </div>
        ) : (
          Object.entries(sitemapGroups).map(([groupKey, groupPages]) => {
            if (groupPages.length === 0) return null
            return (
              <div key={groupKey} className="mb-1">
                <div className="px-4 py-1.5 text-[10px] font-semibold text-ds-text-muted uppercase tracking-widest flex items-center justify-between">
                  <span>{groupLabels[groupKey]}</span>
                  <span className="text-[#2A2E3F]">{groupPages.length}</span>
                </div>
                {groupPages.map(page => {
                  const isActive = activePageId === page.id
                  const slotCount = getSlotCount(page.id)
                  const locked = isLocked(page.id)
                  const pct = approvalPct(page.id)

                  return (
                    <button
                      key={page.id}
                      onClick={() => handleSelectPage(page.id, page.title)}
                      className={`w-full px-3 py-2.5 flex items-start gap-2 text-start transition-colors group ${
                        isActive
                          ? 'bg-ds-primary/10 text-ds-text-primary'
                          : 'text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary'
                      }`}
                    >
                      {/* Active indicator */}
                      <div className={`w-0.5 rounded-full self-stretch flex-shrink-0 ${isActive ? 'bg-ds-primary' : 'bg-transparent'}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs truncate flex-1">{page.title}</span>
                          {locked && <Lock size={9} className="flex-shrink-0 text-ds-success" />}
                        </div>

                        {slotCount > 0 ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex-1 h-0.5 bg-ds-surface-hover rounded-full overflow-hidden">
                              <div
                                className="h-full bg-ds-success rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-ds-text-muted tabular-nums flex-shrink-0">
                              {slotCount} {t('blocks', 'مكونات')}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[9px] text-ds-text-muted mt-0.5">{t('No blocks yet', 'لا توجد مكونات بعد')}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          })
        )}
      </div>

      {/* Export footer */}
      <div className="px-3 py-3 border-t border-ds-border">
        <button
          onClick={handleExport}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-ds-primary/10 text-ds-primary hover:bg-ds-primary/20 transition-colors text-xs font-medium disabled:opacity-50"
        >
          <Download size={12} />
          {saving ? t('Saving…', 'جاري الحفظ...') : t('Export All', 'تصدير الكل')}
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function InspectorEmpty() {
  const { lang } = useSessionStore()
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
      <Sliders size={24} className="text-ds-text-muted/20 mb-2" />
      <p className="text-xs text-ds-text-muted">{lang === 'ar' ? 'اختر مكوناً لفحصه' : 'Select a block to inspect'}</p>
    </div>
  )
}

// ─── Main inspector ───────────────────────────────────────────────────────────

export default function WireframeInspector({ pageId }: Props) {
  const { activeSlotInstanceId } = useWireframeStore()
  const [tab, setTab] = React.useState<'block' | 'page' | 'pages'>('pages')

  // Auto-switch to block tab when a slot is selected
  React.useEffect(() => {
    if (activeSlotInstanceId) setTab('block')
  }, [activeSlotInstanceId])

  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const tabs = [
    { id: 'pages' as const, icon: Map,    label: t('Pages', 'الصفحات') },
    { id: 'block' as const, icon: Layers, label: t('Block', 'المكون') },
    { id: 'page'  as const, icon: Info,   label: t('Page', 'الصفحة')  },
  ]

  return (
    <div className="w-[260px] min-w-[260px] bg-ds-surface border-s border-ds-border flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-ds-border flex-shrink-0">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
              tab === id
                ? 'text-ds-text-primary border-b-2 border-ds-primary'
                : 'text-ds-text-muted hover:text-ds-text-muted'
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === 'pages' && <PagesTab />}
        {tab === 'block' && (
          activeSlotInstanceId
            ? <BlockInspector pageId={pageId} instanceId={activeSlotInstanceId} />
            : <InspectorEmpty />
        )}
        {tab === 'page' && <PageSummary pageId={pageId} />}
      </div>
    </div>
  )
}
