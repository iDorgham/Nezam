'use client'

/**
 * BlockLibraryPanel — legacy panel used inside the old WireframeEditor flow.
 * Now powered by WIREFRAME_LIBRARY instead of the old BlockDefinition registry.
 */

import React, { useState, useMemo } from 'react'
import { WIREFRAME_LIBRARY, WIREFRAME_CATEGORIES, searchBlocks } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { Plus, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

interface BlockLibraryPanelProps {
  onAddBlock: (type: string, name: string) => void
  // Legacy prop — kept for compatibility but not used for filtering
  availableBlocks?: unknown[]
  canvasMode?: string
}

export default function BlockLibraryPanel({ onAddBlock }: BlockLibraryPanelProps) {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    hero: true,
    navigation: true,
  })

  const results = useMemo(() => {
    return search.trim() ? searchBlocks(search) : null
  }, [search])

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  const blocksByCategory = useMemo(() => {
    const map: Record<string, typeof WIREFRAME_LIBRARY> = {}
    for (const block of WIREFRAME_LIBRARY) {
      if (!map[block.category]) map[block.category] = []
      map[block.category].push(block)
    }
    return map
  }, [])

  return (
    <div className="bg-ds-surface border border-ds-border rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-ds-border">
        <h2 className="text-xs font-semibold text-ds-text-muted uppercase tracking-wider mb-2">
          {t('Block Library', 'مكتبة البلوكات')}
        </h2>
        <div className="relative">
          <Search size={12} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted" />
          <input
            type="text"
            placeholder={t('Search blocks…', 'بحث عن بلوكات...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-ds-surface border border-ds-border rounded-lg ps-7 pe-3 py-1.5 text-xs text-ds-text-primary placeholder-ds-text-disabled focus:outline-none focus:border-ds-primary/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {results ? (
          // Search results — flat
          <div className="px-2 space-y-1">
            {results.map(block => {
              const preview = getBlockSvg(block.svgCategory, block.variants[0]?.id ?? '')
              return (
                <button
                  key={block.id}
                  onClick={() => onAddBlock(block.id, block.name)}
                  className="w-full rounded-lg overflow-hidden border border-ds-border hover:border-ds-primary/50 transition-all group bg-ds-surface"
                >
                  <div className="h-12 overflow-hidden" dangerouslySetInnerHTML={{ __html: preview }} />
                  <div className="px-2 py-1 flex items-center justify-between">
                    <span className="text-[11px] text-ds-text-muted group-hover:text-ds-text-primary transition-colors truncate">{block.name}</span>
                    <Plus size={11} className="text-ds-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              )
            })}
            {results.length === 0 && (
              <div className="text-center py-8 text-[10px] text-ds-text-muted">
                {t('No blocks found.', 'لم يتم العثور على بلوكات.')}
              </div>
            )}
          </div>
        ) : (
          // Category tree
          WIREFRAME_CATEGORIES.map(cat => {
            const catBlocks = blocksByCategory[cat.id] ?? []
            const isOpen = !!openCategories[cat.id]
            return (
              <div key={cat.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-ds-text-muted hover:text-ds-text-muted uppercase tracking-wider transition-colors"
                >
                  {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <span className="flex-1 text-start">{cat.label}</span>
                  <span className="text-[9px] text-ds-text-muted">{catBlocks.length}</span>
                </button>
                {isOpen && (
                  <div className="px-2 space-y-1 pb-1">
                    {catBlocks.map(block => {
                      const preview = getBlockSvg(block.svgCategory, block.variants[0]?.id ?? '')
                      return (
                        <button
                          key={block.id}
                          onClick={() => onAddBlock(block.id, block.name)}
                          className="w-full rounded-lg overflow-hidden border border-ds-border hover:border-ds-primary/50 transition-all group bg-ds-surface text-start"
                        >
                          <div className="h-10 overflow-hidden" dangerouslySetInnerHTML={{ __html: preview }} />
                          <div className="px-2 py-1 flex items-center justify-between">
                            <span className="text-[11px] text-ds-text-muted group-hover:text-ds-text-primary transition-colors truncate">
                              {block.name}
                            </span>
                            <Plus size={10} className="text-ds-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="px-3 py-2 border-t border-ds-border text-[9px] text-ds-text-muted text-center">
        {t(
          `${WIREFRAME_LIBRARY.length} blocks · ${WIREFRAME_CATEGORIES.length} categories`,
          `${WIREFRAME_LIBRARY.length} بلوك · ${WIREFRAME_CATEGORIES.length} فئات`
        )}
      </div>
    </div>
  )
}

