'use client'

import React, { useState, useMemo } from 'react'
import { Search, Plus, ChevronDown, ChevronRight, Package2 } from 'lucide-react'
import { COMPONENT_LIBRARY, CATEGORIES } from '@/lib/layout-designer/component-library'
import type { LibraryBlock, BlockCategory } from '@/lib/layout-designer/types'

interface LibraryPanelProps {
  onAddBlock: (blockId: string, variantId: string) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  all: '◻',
  navigation: '↗',
  hero: '✦',
  content: '▤',
  data: '⊞',
  forms: '▦',
  media: '▣',
  commerce: '◈',
  layout: '⊟',
  feedback: '◎',
  overlay: '◉',
}

export default function LibraryPanel({ onAddBlock }: LibraryPanelProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null)
  const [dragBlockId, setDragBlockId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return COMPONENT_LIBRARY.filter(b => {
      const matchesCategory = activeCategory === 'all' || b.category === activeCategory
      const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.tags.some(t => t.includes(q)) || b.description.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  function handleDragStart(e: React.DragEvent, block: LibraryBlock) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ blockId: block.id, variantId: block.variants[0].id }))
    setDragBlockId(block.id)
  }

  return (
    <div className="flex flex-col h-full bg-ds-surface border-e border-ds-border select-none">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-ds-border">
        <div className="text-[11px] font-semibold text-ds-text-muted uppercase tracking-wider mb-2">
          Component Library
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted w-3 h-3" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-ds-border rounded ps-7 pe-2 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary/60"
          />
        </div>
      </div>

      {/* Category Tabs — horizontal scroll */}
      <div className="flex gap-1 px-2 py-2 overflow-x-auto border-b border-ds-border shrink-0 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeCategory === cat.id
                ? 'bg-ds-primary text-white'
                : 'bg-white/[0.04] text-ds-text-muted hover:text-ds-text-primary hover:bg-white/[0.07]'
            }`}
          >
            <span>{CATEGORY_ICONS[cat.id]}</span>
            {cat.label}
            <span className={`text-[9px] ${activeCategory === cat.id ? 'text-white/70' : 'text-ds-text-muted'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-ds-text-muted">
            <Package2 className="w-6 h-6 mb-2 opacity-40" />
            <div className="text-[11px]">No components found</div>
          </div>
        ) : (
          filtered.map(block => (
            <div
              key={block.id}
              draggable
              onDragStart={e => handleDragStart(e, block)}
              onDragEnd={() => setDragBlockId(null)}
              className={`rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                expandedBlock === block.id
                  ? 'border-ds-primary/40 bg-white/[0.04]'
                  : 'border-ds-border bg-white/[0.02] hover:border-ds-primary/30 hover:bg-white/[0.03]'
              } ${dragBlockId === block.id ? 'opacity-50' : ''}`}
            >
              {/* Block Header */}
              <div
                className="flex items-center justify-between px-2.5 py-2 gap-2"
                onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-ds-text-primary truncate">{block.name}</div>
                  <div className="text-[10px] text-ds-text-muted truncate">{block.description}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {block.supportsRTL && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-ds-primary/10 text-ds-primary font-medium">RTL</span>
                  )}
                  {expandedBlock === block.id ? (
                    <ChevronDown className="w-3 h-3 text-ds-text-muted" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-ds-text-muted" />
                  )}
                </div>
              </div>

              {/* Expanded Variants */}
              {expandedBlock === block.id && (
                <div className="px-2 pb-2 space-y-1 border-t border-ds-border/60 pt-1.5">
                  {/* Shadcn badges */}
                  <div className="flex flex-wrap gap-1 pb-1.5">
                    {block.shadcnComponents.slice(0, 4).map(c => (
                      <span key={c} className="text-[8px] px-1 py-0.5 rounded bg-white/[0.05] text-ds-text-muted font-mono">
                        {c}
                      </span>
                    ))}
                    {block.shadcnComponents.length > 4 && (
                      <span className="text-[8px] px-1 py-0.5 rounded bg-white/[0.05] text-ds-text-muted">
                        +{block.shadcnComponents.length - 4}
                      </span>
                    )}
                  </div>
                  {/* Variants */}
                  {block.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={(e) => { e.stopPropagation(); onAddBlock(block.id, variant.id) }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-black/20 hover:bg-ds-primary/10 border border-transparent hover:border-ds-primary/30 transition-colors group"
                    >
                      <div className="text-start">
                        <div className="text-[10px] font-medium text-ds-text-primary group-hover:text-ds-primary transition-colors">
                          {variant.label}
                        </div>
                        {variant.description && (
                          <div className="text-[9px] text-ds-text-muted">{variant.description}</div>
                        )}
                      </div>
                      <Plus className="w-3 h-3 text-ds-text-muted group-hover:text-ds-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-ds-border">
        <div className="text-[10px] text-ds-text-muted">
          {filtered.length} components · drag to canvas or click variant
        </div>
      </div>
    </div>
  )
}
