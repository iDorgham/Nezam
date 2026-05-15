'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  Smartphone,
  Tablet,
  Monitor,
  Grid3X3,
  Type,
  ZoomIn,
  ZoomOut,
  Lock,
  Unlock,
  Download,
  CheckSquare,
  RotateCcw,
  FileText,
  LayoutTemplate,
  ChevronDown,
  Layers,
} from 'lucide-react'
import { useLayoutStore } from '@/lib/layout-designer/layout.store'
import { useSessionStore } from '@/lib/store/session.store'
import LibraryPanel from '@/components/layout-designer/LibraryPanel'
import CanvasArea from '@/components/layout-designer/CanvasArea'
import InspectorPanel from '@/components/layout-designer/InspectorPanel'
import type { Breakpoint } from '@/lib/layout-designer/types'

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────────────────────────────────────

function Toolbar() {
  const {
    activeBreakpoint,
    setBreakpoint,
    canvasZoom,
    setZoom,
    showGrid,
    toggleGrid,
    showLabels,
    toggleLabels,
    getActivePage,
    lockPage,
    unlockPage,
    exportWireframes,
    exportDesignMdSection,
    pages,
    activePageId,
    setActivePage,
  } = useLayoutStore()

  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const [exportStatus, setExportStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  const page = getActivePage()
  const isLocked = !!page?.lockedAt

  const breakpoints: Array<{ id: Breakpoint; icon: React.ReactNode; label: string }> = [
    { id: 'mobile', icon: <Smartphone className="w-3.5 h-3.5" />, label: '375px' },
    { id: 'tablet', icon: <Tablet className="w-3.5 h-3.5" />, label: '768px' },
    { id: 'desktop', icon: <Monitor className="w-3.5 h-3.5" />, label: '1280px' },
  ]

  const handleExport = async () => {
    setExportStatus('saving')
    try {
      const wireframeData = exportWireframes()
      const designMdSection = exportDesignMdSection()

      // Write wireframes_locked.json
      const wireRes = await fetch('/api/export-wireframes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: wireframeData }),
      })

      // Write DESIGN.md layout section
      const designRes = await fetch('/api/export-design-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: designMdSection }),
      })

      if (wireRes.ok || designRes.ok) {
        setExportStatus('done')
        setTimeout(() => setExportStatus('idle'), 3000)
      } else {
        throw new Error('Export failed')
      }
    } catch {
      // Fallback: download JSON directly
      const wireframeData = exportWireframes()
      const blob = new Blob([JSON.stringify(wireframeData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wireframes_locked.json'
      a.click()
      URL.revokeObjectURL(url)
      setExportStatus('done')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const handleLockToggle = () => {
    if (!page) return
    if (isLocked) {
      unlockPage(page.pageId)
    } else {
      lockPage(page.pageId)
    }
  }

  return (
    <div className="h-10 border-b border-ds-border bg-ds-surface flex items-center px-3 gap-2 shrink-0">
      {/* Page Selector */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] border border-ds-border hover:border-ds-primary/40 text-[11px] text-ds-text-primary transition-colors">
          <Layers className="w-3 h-3 text-ds-text-muted" />
          <span className="max-w-[120px] truncate">{page?.pageName || t('Select page', 'اختر الصفحة')}</span>
          <ChevronDown className="w-3 h-3 text-ds-text-muted" />
        </button>
        {pages.length > 0 && (
          <div className="absolute top-full start-0 mt-1 z-50 w-48 bg-ds-surface border border-ds-border rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {pages.map(p => (
              <button
                key={p.pageId}
                onClick={() => setActivePage(p.pageId)}
                className={`w-full text-start px-3 py-2 text-[11px] hover:bg-white/[0.05] transition-colors flex items-center justify-between ${
                  p.pageId === activePageId ? 'text-ds-primary' : 'text-ds-text-primary'
                }`}
              >
                <div>
                  <div className="font-medium">{p.pageName}</div>
                  <div className="text-[9px] text-ds-text-muted font-mono">{p.pageRoute}</div>
                </div>
                <div className="flex items-center gap-1">
                  {p.lockedAt && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                  <span className="text-[9px] text-ds-text-muted">{p.slots.length}b</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-ds-border mx-1" />

      {/* Breakpoint switcher */}
      <div className="flex items-center gap-0.5 bg-black/20 border border-ds-border rounded p-0.5">
        {breakpoints.map(bp => (
          <button
            key={bp.id}
            onClick={() => setBreakpoint(bp.id)}
            title={`${bp.id} — ${bp.label}`}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
              activeBreakpoint === bp.id
                ? 'bg-ds-primary text-ds-text-primary'
                : 'text-ds-text-muted hover:text-ds-text-primary'
            }`}
          >
            {bp.icon}
            <span className="hidden sm:inline">{bp.label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-ds-border mx-1" />

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setZoom(canvasZoom - 0.1)}
          className="p-1 text-ds-text-muted hover:text-ds-text-primary transition-colors"
          title={t('Zoom out', 'تصغير')}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] text-ds-text-muted w-10 text-center font-mono">
          {Math.round(canvasZoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(canvasZoom + 0.1)}
          className="p-1 text-ds-text-muted hover:text-ds-text-primary transition-colors"
          title={t('Zoom in', 'تكبير')}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="text-[9px] text-ds-text-muted hover:text-ds-primary transition-colors px-1"
          title={t('Reset zoom', 'إعادة ضبط التكبير')}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="w-px h-5 bg-ds-border mx-1" />

      {/* View toggles */}
      <button
        onClick={toggleGrid}
        title={t('Toggle grid', 'تفعيل الشبكة')}
        className={`p-1.5 rounded transition-colors ${showGrid ? 'text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary'}`}
      >
        <Grid3X3 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={toggleLabels}
        title={t('Toggle labels', 'تفعيل التسميات')}
        className={`p-1.5 rounded transition-colors ${showLabels ? 'text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary'}`}
      >
        <Type className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1" />

      {/* Stats */}
      {page && (
        <div className="flex items-center gap-2 text-[10px] text-ds-text-muted">
          <span>{page.slots.length} {t('blocks', 'بلوكات')}</span>
          <span>·</span>
          <span className="text-green-500">{page.slots.filter(s => s.approved).length} {t('approved', 'معتمد')}</span>
        </div>
      )}

      <div className="w-px h-5 bg-ds-border mx-1" />

      {/* Lock */}
      {page && (
        <button
          onClick={handleLockToggle}
          title={isLocked ? t('Unlock page', 'إلغاء القفل') : t('Lock page layout', 'قفل تصميم الصفحة')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors border ${
            isLocked
              ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
              : 'border-ds-border text-ds-text-muted hover:text-amber-500 hover:border-amber-500/30'
          }`}
        >
          {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {isLocked ? t('Locked', 'مقفل') : t('Lock', 'قفل')}
        </button>
      )}

      {/* Export */}
      <button
        onClick={handleExport}
        disabled={exportStatus === 'saving'}
        className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium transition-colors ${
          exportStatus === 'done'
            ? 'bg-green-600 text-ds-text-primary'
            : exportStatus === 'saving'
            ? 'bg-ds-primary/50 text-ds-text-primary'
            : 'bg-ds-primary text-ds-text-primary hover:opacity-90'
        }`}
      >
        <Download className="w-3 h-3" />
        {exportStatus === 'saving' ? t('Exporting…', 'جاري التصدير...') : exportStatus === 'done' ? t('Exported!', 'تم التصدير!') : t('Export', 'تصدير')}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function LayoutDesignerPage() {
  const { syncFromSession, addSlot, getActivePage, pages, activePageId } = useLayoutStore()
  const { sitemap, fetchContext, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  useEffect(() => {
    if (sitemap.length === 0) fetchContext()
  }, [sitemap.length, fetchContext])

  useEffect(() => {
    if (sitemap.length > 0) syncFromSession()
  }, [sitemap, syncFromSession])

  const page = getActivePage()

  const handleAddBlock = useCallback((blockId: string, variantId: string) => {
    if (!activePageId) return
    addSlot(activePageId, blockId, variantId)
  }, [activePageId, addSlot])

  // No pages in sitemap
  if (sitemap.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ds-background text-ds-text-muted gap-3">
        <LayoutTemplate className="w-8 h-8 opacity-20" />
        <div className="text-sm">{t('No pages in sitemap yet', 'لا توجد صفحات في خريطة الموقع بعد')}</div>
        <div className="text-xs opacity-60 text-center max-w-xs">
          {t('Create your site structure in the Sitemap tab first, then come back here to design each page layout.', 'قم بإنشاء هيكل موقعك في تبويب خريطة الموقع أولاً، ثم عُد إلى هنا لتصميم كل صفحة.')}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-ds-background">
      <Toolbar />

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Library panel */}
        <div className="w-[260px] shrink-0 overflow-hidden flex flex-col">
          <LibraryPanel onAddBlock={handleAddBlock} />
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <CanvasArea
            page={page}
            onDropBlock={handleAddBlock}
          />
        </div>

        {/* Inspector panel */}
        <div className="w-[280px] shrink-0 overflow-hidden flex flex-col">
          <InspectorPanel />
        </div>
      </div>
    </div>
  )
}
