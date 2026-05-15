'use client'

/**
 * WireframeEditor — per-page editor used by /pages/[page_id]/page.tsx
 *
 * Connects the WIREFRAME_LIBRARY block catalog with the WireframeCanvas
 * and Inspector. Works standalone (no router.push) via local state,
 * with persistence through the wireframe.store.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useWireframeStore } from '@/lib/store/wireframe.store'
import { WIREFRAME_LIBRARY, WIREFRAME_CATEGORIES, searchBlocks } from '@/lib/wireframe-library/blocks'
import { PAGE_TEMPLATES } from '@/lib/wireframe-library/page-templates'
import { useSessionStore } from '@/lib/store/session.store'
import WireframeCanvas from './WireframeCanvas'
import WireframeInspector from './WireframeInspector'
import {
  Search,
  Monitor,
  Tablet,
  Smartphone,
  LayoutTemplate,
  Lock,
  Download,
  Save,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// ─── Block instance type ──────────────────────────────────────────────────────

interface BlockInstance {
  id: string
  type: string
  name: string
  variantId?: string
  blockId?: string
}

const uid = (n = 8) => Math.random().toString(36).substring(2, 2 + n)

const BP_WIDTHS: Record<string, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
}

// ─── Mini library panel ───────────────────────────────────────────────────────

function MiniLibrary({ onAdd }: { onAdd: (blockId: string, name: string) => void }) {
  const [search, setSearch] = useState('')
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ hero: true, navigation: true })

  const results = search.trim() ? searchBlocks(search) : null

  const toggleCat = (catId: string) => {
    setOpenCats(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  return (
    <div className="w-[220px] min-w-[220px] bg-ds-surface border-e border-ds-border flex flex-col h-full">
      <div className="px-3 py-3 border-b border-ds-border">
        <div className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">Block Library</div>
        <div className="relative">
          <Search size={12} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-ds-surface border border-ds-border rounded-lg ps-7 pe-3 py-1.5 text-[11px] text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute end-2 top-1/2 -translate-y-1/2 text-ds-text-muted hover:text-ds-text-muted">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {results ? (
          // Search results
          <div className="px-2 space-y-0.5">
            {results.slice(0, 40).map(block => (
              <button
                key={block.id}
                onClick={() => onAdd(block.id, block.name)}
                className="w-full px-3 py-2 rounded-lg text-start text-[11px] text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary transition-colors group flex items-center justify-between"
              >
                <span className="truncate">{block.name}</span>
                <Plus size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-ds-primary" />
              </button>
            ))}
            {results.length === 0 && (
              <div className="text-center py-6 text-[10px] text-ds-text-muted">No results</div>
            )}
          </div>
        ) : (
          // Category tree
          WIREFRAME_CATEGORIES.map(cat => {
            const catBlocks = WIREFRAME_LIBRARY.filter(b => b.category === cat.id)
            const isOpen = !!openCats[cat.id]
            return (
              <div key={cat.id}>
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-ds-text-muted hover:text-ds-text-muted font-semibold uppercase tracking-wider transition-colors"
                >
                  {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <span className="flex-1 text-start">{cat.label}</span>
                  <span className="text-[9px] text-ds-text-muted">{catBlocks.length}</span>
                </button>
                {isOpen && (
                  <div className="ps-2 space-y-0.5 pb-1">
                    {catBlocks.map(block => (
                      <button
                        key={block.id}
                        onClick={() => onAdd(block.id, block.name)}
                        className="w-full px-3 py-1.5 rounded-lg text-start text-[11px] text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary transition-colors group flex items-center justify-between"
                      >
                        <span className="truncate">{block.name}</span>
                        <Plus size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-ds-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="px-3 py-2 border-t border-ds-border text-[9px] text-ds-text-muted text-center">
        {WIREFRAME_LIBRARY.length} blocks
      </div>
    </div>
  )
}

// ─── Template picker ──────────────────────────────────────────────────────────

function TemplatePicker({ onApply, onClose }: {
  onApply: (blocks: BlockInstance[]) => void
  onClose: () => void
}) {
  return (
    <div className="absolute inset-0 z-30 bg-ds-surface/95 backdrop-blur-sm flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ds-text-primary">Page Templates</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto flex-1">
        {PAGE_TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => {
              const blocks: BlockInstance[] = template.slots.map(slot => ({
                id: uid(),
                type: slot.blockId,
                name: slot.label,
                blockId: slot.blockId,
                variantId: slot.variantId,
              }))
              onApply(blocks)
              onClose()
            }}
            className="p-3 bg-ds-surface border border-ds-border rounded-xl hover:border-ds-primary/50 text-start transition-all group"
          >
            <div className="text-xl mb-1.5">{template.icon}</div>
            <div className="text-xs font-semibold text-ds-text-primary group-hover:text-ds-primary transition-colors">{template.name}</div>
            <div className="text-[10px] text-ds-text-muted mt-0.5">{template.slots.length} blocks</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main editor ──────────────────────────────────────────────────────────────

interface WireframeEditorProps {
  pageId: string
  pageName?: string
}

export default function WireframeEditor({ pageId, pageName = 'Page' }: WireframeEditorProps) {
  const [blocks, setBlocks] = useState<BlockInstance[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showTemplates, setShowTemplates] = useState(false)
  const [saving, setSaving] = useState(false)

  const { addLog } = useSessionStore()
  const { initPage, addSlot, setActivePage, setActiveSlot } = useWireframeStore()

  // Initialize page in wireframe store
  useEffect(() => {
    initPage(pageId, pageName)
    setActivePage(pageId)
  }, [pageId, pageName, initPage, setActivePage])

  // Sync selected slot to wireframe store inspector
  useEffect(() => {
    setActiveSlot(selectedBlockId)
  }, [selectedBlockId, setActiveSlot])

  const handleAddBlock = useCallback((blockId: string, name: string) => {
    const block = WIREFRAME_LIBRARY.find(b => b.id === blockId)
    const variantId = block?.variants[0]?.id ?? 'default'
    const newBlock: BlockInstance = {
      id: uid(),
      type: blockId,
      name,
      blockId,
      variantId,
    }
    setBlocks(prev => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
    // Also sync into wireframe store
    addSlot(pageId, blockId, variantId, name)
  }, [pageId, addSlot])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks })
      })
      addLog(`Saved ${blocks.length} blocks for page ${pageId}`)
    } catch (e) {
      addLog(`Save failed: ${(e as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  const bpOptions = [
    { key: 'desktop', icon: Monitor, label: '1280' },
    { key: 'tablet',  icon: Tablet,  label: '768'  },
    { key: 'mobile',  icon: Smartphone, label: '375' },
  ] as const

  const bpWidth = BP_WIDTHS[breakpoint]

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-ds-surface">
      {/* Block library */}
      <MiniLibrary onAdd={handleAddBlock} />

      {/* Center area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-11 border-b border-ds-border bg-ds-surface flex items-center px-4 gap-3 flex-shrink-0">
          <div className="text-xs font-medium text-ds-text-primary truncate me-2">{pageName}</div>
          <div className="w-px h-4 bg-ds-surface-hover" />

          {/* Breakpoint */}
          <div className="flex items-center bg-ds-surface border border-ds-border rounded-lg p-0.5 gap-0.5">
            {bpOptions.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setBreakpoint(key)}
                title={`${label}px`}
                className={`p-1.5 rounded-md transition-colors ${
                  breakpoint === key ? 'bg-ds-primary text-ds-text-primary' : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover'
                }`}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Templates */}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover transition-colors"
          >
            <LayoutTemplate size={13} />
            Templates
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-ds-primary text-ds-text-primary hover:bg-ds-primary/90 transition-colors disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* Scrollable canvas */}
        <div className="flex-1 overflow-y-auto p-4">
          <WireframeCanvas
            pageId={pageId}
            blocks={blocks}
            setBlocks={setBlocks}
            selectedBlockId={selectedBlockId}
            setSelectedBlockId={setSelectedBlockId}
            breakpointWidth={bpWidth}
          />
        </div>
      </div>

      {/* Inspector */}
      <WireframeInspector pageId={pageId} />

      {/* Template picker overlay */}
      {showTemplates && (
        <TemplatePicker
          onApply={setBlocks}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
}
