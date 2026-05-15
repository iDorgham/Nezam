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

  const block = getBlockById(slot.blockId)
  if (!block) {
    return (
      <div className="p-4 text-xs text-[#6B7280] text-center">
        Block definition not found.
      </div>
    )
  }

  const svgContent = getBlockSvg(block.svgCategory, slot.variantId)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Block header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white">{block.name}</span>
          {slot.approved && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#10b981]/10 text-[#10b981] font-medium">
              Approved
            </span>
          )}
        </div>
        <div className="text-[10px] text-[#6B7280]">{block.description}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1E2130] text-[#6B7280] uppercase font-semibold">
            {block.category}
          </span>
          <span className="text-[9px] text-[#3A3E4F]">{block.defaultHeight}px default height</span>
        </div>
      </div>

      {/* SVG preview */}
      <div className="rounded-xl overflow-hidden border border-[#1E2130] bg-[#080A12]">
        <div
          className="w-full h-28 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Variant picker */}
      <div>
        <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Variant
        </label>
        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
          {block.variants.map(v => (
            <button
              key={v.id}
              onClick={() => updateSlotVariant(pageId, instanceId, v.id)}
              className={`px-3 py-2 rounded-lg text-left text-xs transition-all border ${
                slot.variantId === v.id
                  ? 'border-[#FF5701] bg-[#FF5701]/10 text-white'
                  : 'border-[#1E2130] bg-[#0D0F18] text-[#9CA3AF] hover:border-[#2A2E3F] hover:text-white'
              }`}
            >
              <div className="font-medium">{v.label}</div>
              {v.description && (
                <div className="text-[9px] text-[#6B7280] mt-0.5">{v.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Notes
        </label>
        <textarea
          value={slot.notes}
          onChange={e => updateSlotNotes(pageId, instanceId, e.target.value)}
          placeholder="Add implementation notes…"
          className="w-full bg-[#0D0F18] border border-[#1E2130] rounded-lg px-3 py-2 text-xs text-[#9CA3AF] placeholder-[#3A3E4F] focus:outline-none focus:border-[#FF5701]/50 resize-none"
          rows={3}
        />
      </div>

      {/* Tags */}
      {block.tags.length > 0 && (
        <div>
          <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-1">
            {block.tags.map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#1E2130] text-[#6B7280]">
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
            : 'bg-[#1E2130] text-[#9CA3AF] hover:bg-[#2A2E3F] hover:text-white border border-[#2A2E3F]'
        }`}
      >
        <CheckSquare size={13} />
        {slot.approved ? 'Approved' : 'Mark as Approved'}
      </button>
    </div>
  )
}

// ─── Page summary ─────────────────────────────────────────────────────────────

function PageSummary({ pageId }: { pageId: string }) {
  const { pages, lockPage } = useWireframeStore()
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
        <div className="text-xs font-semibold text-white mb-1">{page.pageTitle}</div>
        {locked && (
          <div className="flex items-center gap-1 text-[10px] text-[#10b981]">
            <Lock size={10} />
            Locked {new Date(page.lockedAt!).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Total Blocks', value: total },
          { label: 'Approved', value: approved },
          { label: 'Pending', value: total - approved },
          { label: 'Progress', value: total > 0 ? `${Math.round(approved / total * 100)}%` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0D0F18] border border-[#1E2130] rounded-xl p-3">
            <div className="text-[10px] text-[#6B7280] mb-1">{label}</div>
            <div className="text-base font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-[#6B7280] mb-1">
            <span>Approval progress</span>
            <span>{approved}/{total}</span>
          </div>
          <div className="h-1.5 bg-[#1E2130] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5701] to-[#10b981] rounded-full transition-all"
              style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">By Category</div>
          <div className="space-y-1">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF] capitalize flex-1">{cat}</span>
                <div className="flex-1 h-1 bg-[#1E2130] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5701]/50 rounded-full"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#6B7280] w-4 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block sequence */}
      {page.slots.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Block Sequence</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {page.slots.map((slot, i) => (
              <div key={slot.instanceId} className="flex items-center gap-2 py-1">
                <span className="text-[10px] text-[#3A3E4F] tabular-nums w-4">{i + 1}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${slot.approved ? 'bg-[#10b981]' : 'bg-[#2A2E3F]'}`} />
                <span className="text-[10px] text-[#9CA3AF] truncate flex-1">{slot.label}</span>
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
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 border border-[#10b981]/20 transition-all"
          >
            <Lock size={13} />
            Lock Page
          </button>
        )}
        <button
          onClick={handleExportPage}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-[#1E2130] text-[#9CA3AF] hover:bg-[#2A2E3F] hover:text-white border border-[#2A2E3F] transition-all"
        >
          <Download size={13} />
          Export Page JSON
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
      <div className="px-4 py-3 border-b border-[#1E2130] bg-[#080A12]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
            {t('Project Pages', 'صفحات المشروع')}
          </span>
          <button
            onClick={() => openTab({ id: 'sitemap', title: t('Sitemap', 'خريطة الموقع'), type: 'sitemap' })}
            className="p-1 rounded hover:bg-[#1E2130] text-[#6B7280] hover:text-[#FF5701] transition-colors"
            title={t('Open Sitemap', 'فتح خريطة الموقع')}
          >
            <Plus size={13} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
          <span className="text-white font-semibold">{wireframedPages}</span>
          <span>/ {totalPages} wireframed</span>
        </div>
        {totalPages > 0 && (
          <div className="mt-2 h-1 bg-[#1E2130] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5701] rounded-full transition-all"
              style={{ width: `${totalPages > 0 ? (wireframedPages / totalPages) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Page list */}
      <div className="flex-1 overflow-y-auto py-1">
        {sitemap.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Map size={22} className="mx-auto text-[#2A2E3F] mb-2" />
            <p className="text-xs text-[#6B7280] mb-3">{t('No pages in sitemap', 'لا توجد صفحات')}</p>
            <button
              onClick={() => openTab({ id: 'sitemap', title: 'Sitemap', type: 'sitemap' })}
              className="text-xs text-[#FF5701] hover:underline"
            >
              {t('Open Sitemap →', 'افتح خريطة الموقع →')}
            </button>
          </div>
        ) : (
          Object.entries(sitemapGroups).map(([groupKey, groupPages]) => {
            if (groupPages.length === 0) return null
            return (
              <div key={groupKey} className="mb-1">
                <div className="px-4 py-1.5 text-[10px] font-semibold text-[#3A3E4F] uppercase tracking-widest flex items-center justify-between">
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
                      className={`w-full px-3 py-2.5 flex items-start gap-2 text-left transition-colors group ${
                        isActive
                          ? 'bg-[#FF5701]/10 text-white'
                          : 'text-[#9CA3AF] hover:bg-[#1E2130] hover:text-white'
                      }`}
                    >
                      {/* Active indicator */}
                      <div className={`w-0.5 rounded-full self-stretch flex-shrink-0 ${isActive ? 'bg-[#FF5701]' : 'bg-transparent'}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs truncate flex-1">{page.title}</span>
                          {locked && <Lock size={9} className="flex-shrink-0 text-[#10b981]" />}
                        </div>

                        {slotCount > 0 ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex-1 h-0.5 bg-[#1E2130] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#10b981] rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-[#6B7280] tabular-nums flex-shrink-0">
                              {slotCount} block{slotCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[9px] text-[#3A3E4F] mt-0.5">No blocks yet</div>
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
      <div className="px-3 py-3 border-t border-[#1E2130]">
        <button
          onClick={handleExport}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FF5701]/10 text-[#FF5701] hover:bg-[#FF5701]/20 transition-colors text-xs font-medium disabled:opacity-50"
        >
          <Download size={12} />
          {saving ? 'Saving…' : 'Export All'}
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function InspectorEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
      <Sliders size={24} className="text-[#2A2E3F] mb-2" />
      <p className="text-xs text-[#3A3E4F]">Select a block to inspect</p>
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

  const tabs = [
    { id: 'pages' as const, icon: Map,    label: 'Pages' },
    { id: 'block' as const, icon: Layers, label: 'Block' },
    { id: 'page'  as const, icon: Info,   label: 'Page'  },
  ]

  return (
    <div className="w-[260px] min-w-[260px] bg-[#0A0C14] border-l border-[#1E2130] flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-[#1E2130] flex-shrink-0">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
              tab === id
                ? 'text-white border-b-2 border-[#FF5701]'
                : 'text-[#6B7280] hover:text-[#9CA3AF]'
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
