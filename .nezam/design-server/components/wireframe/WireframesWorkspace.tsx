'use client'

import React, { useEffect, useCallback } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { useWireframeStore } from '@/lib/store/wireframe.store'

import WireframePageEditor from './WireframePageEditor'
import WireframeBlockLibrary from './WireframeBlockLibrary'
import WireframeTemplateGallery from './WireframeTemplateGallery'
import WireframeInspector from './WireframeInspector'
import {
  LayoutGrid,
  FileText,
  Lock,
  Layers,
  PanelLeft,
  Monitor,
  Tablet,
  Smartphone,
  LayoutList,
  LayoutTemplate,
  Grid3X3,
  X,
} from 'lucide-react'

// ─── Sub-component: Toolbar ────────────────────────────────────────────────

function EditorToolbar({ pageTitle }: { pageTitle: string }) {
  const {
    breakpoint, setBreakpoint,
    viewMode, setViewMode,
    showLibrary, setShowLibrary,
    showTemplates, setShowTemplates,
    activePageId, lockPage, clearPage, pages
  } = useWireframeStore()

  const locked = activePageId ? !!pages[activePageId]?.lockedAt : false
  const slotCount = activePageId ? (pages[activePageId]?.slots.length ?? 0) : 0
  const approvedCount = activePageId ? (pages[activePageId]?.slots.filter(s => s.approved).length ?? 0) : 0

  const bpOptions = [
    { key: 'desktop', icon: Monitor, label: '1280px' },
    { key: 'tablet',  icon: Tablet,  label: '768px'  },
    { key: 'mobile',  icon: Smartphone, label: '375px' },
  ] as const

  const viewOptions = [
    { key: 'canvas', icon: LayoutTemplate, label: 'Canvas' },
    { key: 'grid',   icon: Grid3X3,        label: 'Grid'   },
    { key: 'list',   icon: LayoutList,     label: 'List'   },
  ] as const

  return (
    <div className="h-12 border-b border-[#1E2130] bg-[#0D0F18] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Page title */}
      <div className="flex items-center gap-2 mr-2">
        <FileText size={14} className="text-[#FF5701]" />
        <span className="text-sm font-medium text-white">{pageTitle}</span>
        {locked && <Lock size={12} className="text-[#10b981]" />}
      </div>

      <div className="w-px h-5 bg-[#1E2130]" />

      {/* Approval progress */}
      {slotCount > 0 && (
        <>
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-[#1E2130] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10b981] rounded-full transition-all"
                style={{ width: `${(approvedCount / slotCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[#6B7280] tabular-nums">
              {approvedCount}/{slotCount}
            </span>
          </div>
          <div className="w-px h-5 bg-[#1E2130]" />
        </>
      )}

      {/* Breakpoint */}
      <div className="flex items-center bg-[#0A0C14] border border-[#1E2130] rounded-lg p-0.5 gap-0.5">
        {bpOptions.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setBreakpoint(key)}
            title={label}
            className={`p-1.5 rounded-md transition-colors ${
              breakpoint === key
                ? 'bg-[#FF5701] text-white'
                : 'text-[#6B7280] hover:text-white hover:bg-[#1E2130]'
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* View mode */}
      <div className="flex items-center bg-[#0A0C14] border border-[#1E2130] rounded-lg p-0.5 gap-0.5">
        {viewOptions.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            title={label}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === key
                ? 'bg-[#1E2130] text-white'
                : 'text-[#6B7280] hover:text-white'
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Template gallery toggle */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          showTemplates
            ? 'bg-[#FF5701]/20 text-[#FF5701]'
            : 'bg-[#1E2130] text-[#9CA3AF] hover:text-white hover:bg-[#2A2E3F]'
        }`}
      >
        <LayoutGrid size={13} />
        Templates
      </button>

      {/* Lock page */}
      {activePageId && !locked && slotCount > 0 && (
        <button
          onClick={() => lockPage(activePageId)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 transition-colors"
        >
          <Lock size={13} />
          Lock Page
        </button>
      )}

      {/* Clear page */}
      {activePageId && slotCount > 0 && (
        <button
          onClick={() => clearPage(activePageId)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1E2130] text-[#6B7280] hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
        >
          <X size={13} />
          Clear
        </button>
      )}

      {/* Library panel toggle */}
      <button
        onClick={() => setShowLibrary(!showLibrary)}
        className={`p-1.5 rounded-lg transition-colors ${
          showLibrary ? 'text-white bg-[#1E2130]' : 'text-[#6B7280] hover:text-white hover:bg-[#1E2130]'
        }`}
        title="Toggle block library"
      >
        <PanelLeft size={16} />
      </button>
    </div>
  )
}

// ─── Sub-component: Empty state ───────────────────────────────────────────────

function NoPageSelected() {
  const { sitemap } = useSessionStore()
  const { setActivePage, initPage } = useWireframeStore()

  const quickStartPages = sitemap.slice(0, 6)

  return (
    <div className="flex-1 flex items-center justify-center bg-[#090A0F]">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#0D0F18] border border-[#1E2130] flex items-center justify-center mx-auto mb-4">
          <Layers size={28} className="text-[#FF5701]" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Wireframe Builder</h2>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          Select a page from the <strong className="text-[#9CA3AF]">Pages</strong> tab in the right panel to start building your wireframe.
          Each page holds an ordered sequence of blocks with SVG previews.
        </p>

        {quickStartPages.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-left">
            {quickStartPages.map(page => (
              <button
                key={page.id}
                onClick={() => {
                  initPage(page.id, page.title)
                  setActivePage(page.id)
                }}
                className="p-3 bg-[#0D0F18] border border-[#1E2130] rounded-xl hover:border-[#FF5701]/50 transition-colors text-left group"
              >
                <div className="text-sm font-medium text-white group-hover:text-[#FF5701] transition-colors">
                  {page.title}
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5 uppercase">{page.type}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Root workspace ───────────────────────────────────────────────────────────

export default function WireframesWorkspace() {
  const { sitemap } = useSessionStore()
  const {
    activePageId,
    pages,
    showLibrary,
    showTemplates,
    setShowTemplates,
    addSlotsFromTemplate,
    initPage,
  } = useWireframeStore()

  // Ensure active page is initialized
  useEffect(() => {
    if (activePageId) {
      const sitemapPage = sitemap.find(p => p.id === activePageId)
      if (sitemapPage) initPage(activePageId, sitemapPage.title)
    }
  }, [activePageId, sitemap, initPage])

  const activePage = activePageId ? pages[activePageId] : null

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#090A0F]">
      {/* Full-width editor area (pages list moved to right inspector "Pages" tab) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activePage ? (
          <>
            {/* Toolbar */}
            <EditorToolbar pageTitle={activePage.pageTitle} />

            {/* Template gallery overlay */}
            {showTemplates && (
              <WireframeTemplateGallery
                pageId={activePageId!}
                pageTitle={activePage.pageTitle}
                onApply={(template) => {
                  addSlotsFromTemplate(activePageId!, activePage.pageTitle, template)
                }}
                onClose={() => setShowTemplates(false)}
              />
            )}

            {/* Main editor row */}
            <div className="flex-1 flex overflow-hidden">
              {/* Block library panel */}
              {showLibrary && (
                <WireframeBlockLibrary pageId={activePageId!} />
              )}

              {/* Canvas */}
              <div className="flex-1 overflow-hidden">
                <WireframePageEditor pageId={activePageId!} />
              </div>

              {/* Inspector */}
              <WireframeInspector pageId={activePageId!} />
            </div>
          </>
        ) : (
          <NoPageSelected />
        )}
      </div>
    </div>
  )
}
