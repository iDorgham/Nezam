'use client'

import React, { useState, useMemo } from 'react'
import { useWireframeStore } from '@/lib/store/wireframe.store'
import {
  WIREFRAME_LIBRARY,
  WIREFRAME_CATEGORIES,
  searchBlocks,
  type WireframeBlock,
  type WireframeCategory,
} from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  pageId: string
}

// ─── Category icons mapping ───────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  elements: '⬡',
  navigation: '≡',
  hero: '◆',
  content: '¶',
  cards: '▭',
  menus: '☰',
  grids: '⊞',
  forms: '⊟',
  media: '▶',
  data: '◉',
  commerce: '◈',
  team: '◎',
  blog: '✎',
  feedback: '◍',
  layout: '⬕',
}

// ─── Block card ───────────────────────────────────────────────────────────────

function BlockCard({ block, pageId }: { block: WireframeBlock; pageId: string }) {
  const { addSlot } = useWireframeStore()
  const [hovered, setHovered] = useState(false)

  const defaultVariant = block.variants[0]
  const svgContent = getBlockSvg(block.svgCategory, defaultVariant.id)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addSlot(pageId, block.id, defaultVariant.id, block.name)
  }

  return (
    <div
      className="group relative cursor-pointer rounded-xl overflow-hidden border border-[#1E2130] hover:border-[#FF5701]/50 transition-all duration-200 bg-[#0D0F18]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleAdd}
      title={`Add ${block.name}`}
    >
      {/* SVG preview */}
      <div
        className="w-full overflow-hidden"
        style={{ height: Math.min(block.defaultHeight / 4, 80) }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Label */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-[#9CA3AF] truncate group-hover:text-white transition-colors">
            {block.name}
          </div>
          <div className="text-[9px] text-[#3A3E4F] uppercase tracking-wider">
            {block.variants.length} variants
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex-shrink-0 w-5 h-5 rounded-md bg-[#FF5701]/0 group-hover:bg-[#FF5701] flex items-center justify-center transition-all"
        >
          <Plus size={10} className="text-[#FF5701] group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  )
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({ category, blocks, pageId }: {
  category: { id: WireframeCategory; label: string; count: number }
  blocks: WireframeBlock[]
  pageId: string
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="mb-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#1E2130]/50 rounded-lg transition-colors group"
      >
        <span className="text-sm">{CATEGORY_ICONS[category.id] ?? '•'}</span>
        <span className="flex-1 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider group-hover:text-[#9CA3AF] transition-colors">
          {category.label}
        </span>
        <span className="text-[10px] text-[#3A3E4F] tabular-nums">{blocks.length}</span>
        {collapsed
          ? <ChevronRight size={12} className="text-[#3A3E4F]" />
          : <ChevronDown size={12} className="text-[#3A3E4F]" />
        }
      </button>

      {!collapsed && (
        <div className="grid grid-cols-2 gap-1.5 px-2 mt-1">
          {blocks.map(block => (
            <BlockCard key={block.id} block={block} pageId={pageId} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function WireframeBlockLibrary({ pageId }: Props) {
  const { searchQuery, setSearch, activeCategory, setCategory } = useWireframeStore()

  const filteredBlocks = useMemo(() => {
    if (searchQuery.trim()) return searchBlocks(searchQuery)
    if (activeCategory !== 'all') return WIREFRAME_LIBRARY.filter(b => b.category === activeCategory)
    return WIREFRAME_LIBRARY
  }, [searchQuery, activeCategory])

  const blocksByCategory = useMemo(() => {
    const map: Record<string, WireframeBlock[]> = {}
    for (const block of filteredBlocks) {
      if (!map[block.category]) map[block.category] = []
      map[block.category].push(block)
    }
    return map
  }, [filteredBlocks])

  const isSearching = searchQuery.trim().length > 0
  const isFiltered = activeCategory !== 'all'

  return (
    <div className="w-[240px] min-w-[240px] bg-[#0A0C14] border-r border-[#1E2130] flex flex-col h-full">
      {/* Search */}
      <div className="px-3 py-3 border-b border-[#1E2130]">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#3A3E4F]" />
          <input
            type="text"
            placeholder="Search blocks…"
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0D0F18] border border-[#1E2130] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#3A3E4F] focus:outline-none focus:border-[#FF5701]/50 transition-colors"
          />
        </div>
      </div>

      {/* Category filter pills */}
      {!isSearching && (
        <div className="flex gap-1 px-3 py-2 overflow-x-auto scrollbar-none border-b border-[#1E2130] flex-shrink-0">
          <button
            onClick={() => setCategory('all')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#FF5701] text-white'
                : 'bg-[#1E2130] text-[#6B7280] hover:text-white hover:bg-[#2A2E3F]'
            }`}
          >
            All
          </button>
          {WIREFRAME_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#FF5701] text-white'
                  : 'bg-[#1E2130] text-[#6B7280] hover:text-white hover:bg-[#2A2E3F]'
              }`}
            >
              {CATEGORY_ICONS[cat.id]} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Block list */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {isSearching || isFiltered ? (
          // Flat list when searching or filtering
          <div className="grid grid-cols-2 gap-1.5 px-2">
            {filteredBlocks.map(block => (
              <BlockCard key={block.id} block={block} pageId={pageId} />
            ))}
            {filteredBlocks.length === 0 && (
              <div className="col-span-2 text-center py-8 text-xs text-[#3A3E4F]">
                No blocks match your search.
              </div>
            )}
          </div>
        ) : (
          // Grouped by category
          WIREFRAME_CATEGORIES.map(cat => {
            const catBlocks = blocksByCategory[cat.id] || []
            if (catBlocks.length === 0) return null
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                blocks={catBlocks}
                pageId={pageId}
              />
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[#1E2130] text-[10px] text-[#3A3E4F] text-center">
        {WIREFRAME_LIBRARY.length} blocks · {WIREFRAME_CATEGORIES.length} categories
      </div>
    </div>
  )
}
