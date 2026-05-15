'use client'

/**
 * BlockLibraryPanel — legacy panel used inside the old WireframeEditor flow.
 * Now powered by WIREFRAME_LIBRARY instead of the old BlockDefinition registry.
 */

import React, { useState, useMemo } from 'react'
import { WIREFRAME_LIBRARY, WIREFRAME_CATEGORIES, searchBlocks } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { Plus, Search, ChevronDown, ChevronRight } from 'lucide-react'

interface BlockLibraryPanelProps {
  onAddBlock: (type: string, name: string) => void
  // Legacy prop — kept for compatibility but not used for filtering
  availableBlocks?: unknown[]
  canvasMode?: string
}

export default function BlockLibraryPanel({ onAddBlock }: BlockLibraryPanelProps) {
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
    <div className="bg-[#0A0C14] border border-[#1E2130] rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#1E2130]">
        <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Block Library</h2>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#3A3E4F]" />
          <input
            type="text"
            placeholder="Search blocks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0D0F18] border border-[#1E2130] rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-[#3A3E4F] focus:outline-none focus:border-[#FF5701]/50"
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
                  className="w-full rounded-lg overflow-hidden border border-[#1E2130] hover:border-[#FF5701]/50 transition-all group bg-[#0D0F18]"
                >
                  <div className="h-12 overflow-hidden" dangerouslySetInnerHTML={{ __html: preview }} />
                  <div className="px-2 py-1 flex items-center justify-between">
                    <span className="text-[11px] text-[#9CA3AF] group-hover:text-white transition-colors truncate">{block.name}</span>
                    <Plus size={11} className="text-[#FF5701] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              )
            })}
            {results.length === 0 && (
              <div className="text-center py-8 text-[10px] text-[#3A3E4F]">No blocks found.</div>
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
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-[#6B7280] hover:text-[#9CA3AF] uppercase tracking-wider transition-colors"
                >
                  {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <span className="flex-1 text-left">{cat.label}</span>
                  <span className="text-[9px] text-[#3A3E4F]">{catBlocks.length}</span>
                </button>
                {isOpen && (
                  <div className="px-2 space-y-1 pb-1">
                    {catBlocks.map(block => {
                      const preview = getBlockSvg(block.svgCategory, block.variants[0]?.id ?? '')
                      return (
                        <button
                          key={block.id}
                          onClick={() => onAddBlock(block.id, block.name)}
                          className="w-full rounded-lg overflow-hidden border border-[#1E2130] hover:border-[#FF5701]/50 transition-all group bg-[#0D0F18] text-left"
                        >
                          <div className="h-10 overflow-hidden" dangerouslySetInnerHTML={{ __html: preview }} />
                          <div className="px-2 py-1 flex items-center justify-between">
                            <span className="text-[11px] text-[#9CA3AF] group-hover:text-white transition-colors truncate">
                              {block.name}
                            </span>
                            <Plus size={10} className="text-[#FF5701] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      <div className="px-3 py-2 border-t border-[#1E2130] text-[9px] text-[#3A3E4F] text-center">
        {WIREFRAME_LIBRARY.length} blocks · {WIREFRAME_CATEGORIES.length} categories
      </div>
    </div>
  )
}
