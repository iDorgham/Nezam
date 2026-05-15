'use client'

import React, { useState } from 'react'
import {
  PAGE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type PageTemplate,
} from '@/lib/wireframe-library/page-templates'
import { getBlockById } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { X, Check, ChevronRight, LayoutTemplate } from 'lucide-react'

interface Props {
  pageId: string
  pageTitle: string
  onApply: (template: PageTemplate) => void
  onClose: () => void
}

// Category colors
const CAT_COLORS: Record<string, string> = {
  marketing: '#FF5701',
  content:   '#6366f1',
  ecommerce: '#10b981',
  app:       '#3b82f6',
  personal:  '#f59e0b',
}

const CAT_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  content:   'Content',
  ecommerce: 'Ecommerce',
  app:       'App',
  personal:  'Personal',
}

// ─── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onApply }: { template: PageTemplate; onApply: () => void }) {
  const [hovering, setHovering] = useState(false)
  const color = CAT_COLORS[template.category] ?? '#6B7280'

  // Show a mini preview of first 3 slots
  const previewSlots = template.slots.slice(0, 4)

  return (
    <div
      className="group relative rounded-xl border border-ds-border bg-ds-surface overflow-hidden hover:border-ds-border transition-all cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onApply}
    >
      {/* Mini page preview */}
      <div className="relative h-36 bg-[#080A12] overflow-hidden">
        {/* Stacked block thumbnails */}
        <div className="flex flex-col h-full w-full overflow-hidden">
          {previewSlots.map((slot, i) => {
            const block = getBlockById(slot.blockId)
            if (!block) return null
            const svg = getBlockSvg(block.svgCategory, slot.variantId)
            const heightFraction = 1 / previewSlots.length
            return (
              <div
                key={i}
                className="overflow-hidden flex-shrink-0"
                style={{
                  height: `${heightFraction * 100}%`,
                  opacity: 1 - i * 0.08,
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )
          })}
        </div>

        {/* Category badge */}
        <div
          className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: color + 'cc' }}
        >
          {CAT_LABELS[template.category]}
        </div>

        {/* Slot count */}
        <div className="absolute top-2 end-2 px-2 py-0.5 rounded-full text-[9px] font-mono text-ds-text-muted bg-ds-surface/80 border border-ds-border">
          {template.slots.length} blocks
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-ds-primary/10 flex items-center justify-center transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="px-4 py-2 rounded-lg bg-ds-primary text-white text-xs font-semibold flex items-center gap-1.5">
            <Check size={13} />
            Use Template
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-lg">{template.icon}</span>
              <span className="text-sm font-semibold text-white">{template.name}</span>
            </div>
            <p className="text-[10px] text-ds-text-muted leading-relaxed">{template.description}</p>
          </div>
          <ChevronRight size={14} className="text-[#2A2E3F] group-hover:text-ds-primary flex-shrink-0 mt-0.5 transition-colors" />
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {template.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-ds-surface-hover text-ds-text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main gallery ─────────────────────────────────────────────────────────────

export default function WireframeTemplateGallery({ pageId, pageTitle, onApply, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = PAGE_TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory
    const matchSearch = !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="absolute inset-0 z-40 bg-ds-surface/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-ds-border flex-shrink-0">
        <LayoutTemplate size={18} className="text-ds-primary" />
        <div className="flex-1">
          <h2 className="text-base font-semibold text-white">Page Templates</h2>
          <p className="text-xs text-ds-text-muted">
            Apply to <span className="text-ds-text-muted font-medium">{pageTitle}</span>
            {' '}— existing blocks will be replaced
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search templates…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-ds-surface border border-ds-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#3A3E4F] w-52 focus:outline-none focus:border-ds-primary/50"
        />

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-ds-surface-hover text-ds-text-muted hover:text-white hover:bg-ds-surface-hover transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-ds-border flex-shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeCategory === 'all'
              ? 'bg-ds-primary text-white'
              : 'bg-ds-surface-hover text-ds-text-muted hover:text-white hover:bg-ds-surface-hover'
          }`}
        >
          All ({PAGE_TEMPLATES.length})
        </button>
        {TEMPLATE_CATEGORIES.map(cat => {
          const count = PAGE_TEMPLATES.filter(t => t.category === cat.id).length
          const color = CAT_COLORS[cat.id] ?? '#6B7280'
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'bg-ds-surface-hover text-ds-text-muted hover:text-white hover:bg-ds-surface-hover'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: color } : {}}
            >
              {cat.label}
              <span className={`text-[9px] ${activeCategory === cat.id ? 'text-white/70' : 'text-ds-text-muted'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <LayoutTemplate size={32} className="text-[#2A2E3F] mb-3" />
            <p className="text-sm text-ds-text-muted">No templates match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onApply={() => onApply(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
