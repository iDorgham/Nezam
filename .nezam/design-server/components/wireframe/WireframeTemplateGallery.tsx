'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import {
  PAGE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type PageTemplate,
} from '@/lib/wireframe-library/page-templates'
import { getBlockById } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { X, Check, ChevronRight, LayoutTemplate, Sparkles } from 'lucide-react'

interface Props {
  pageId: string
  pageTitle: string
  onApply: (template: PageTemplate) => void
  onClose: () => void
}

// Category colors
const CAT_THEMES: Record<string, {
  accent: string
  soft: string
  border: string
  glow: string
  gradient: string
}> = {
  marketing: {
    accent: '#FF6A1A',
    soft: '#FFD6BF',
    border: '#FFB38A',
    glow: 'rgba(255, 106, 26, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(255,106,26,0.18), rgba(255,151,74,0.06) 55%, rgba(255,255,255,0) 100%)',
  },
  content: {
    accent: '#7C7BFF',
    soft: '#D6D4FF',
    border: '#A8A5FF',
    glow: 'rgba(124, 123, 255, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(124,123,255,0.18), rgba(166,126,255,0.06) 55%, rgba(255,255,255,0) 100%)',
  },
  ecommerce: {
    accent: '#17C77B',
    soft: '#C8F7E1',
    border: '#7BE7B5',
    glow: 'rgba(23, 199, 123, 0.25)',
    gradient: 'linear-gradient(135deg, rgba(23,199,123,0.18), rgba(108,223,170,0.06) 55%, rgba(255,255,255,0) 100%)',
  },
  app: {
    accent: '#3B82F6',
    soft: '#CFE3FF',
    border: '#93C5FD',
    glow: 'rgba(59, 130, 246, 0.25)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(96,165,250,0.06) 55%, rgba(255,255,255,0) 100%)',
  },
  personal: {
    accent: '#F2B84B',
    soft: '#FFE6B7',
    border: '#F7CF82',
    glow: 'rgba(242, 184, 75, 0.25)',
    gradient: 'linear-gradient(135deg, rgba(242,184,75,0.18), rgba(255,216,128,0.06) 55%, rgba(255,255,255,0) 100%)',
  },
}

const CAT_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  content:   'Content',
  ecommerce: 'Ecommerce',
  app:       'App',
  personal:  'Personal',
}

// ─── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onApply,
  themeMode,
}: {
  template: PageTemplate
  onApply: () => void
  themeMode: 'light' | 'dark'
}) {
  const [hovering, setHovering] = useState(false)
  const theme = CAT_THEMES[template.category] ?? CAT_THEMES.marketing
  const isLight = themeMode === 'light'
  const previewBg = isLight
    ? `radial-gradient(circle at top left, ${theme.accent}22, transparent 40%), linear-gradient(180deg, #FFFFFF 0%, #F4F6FB 100%)`
    : `radial-gradient(circle at top left, ${theme.accent}33, transparent 42%), linear-gradient(180deg, #0D1018 0%, #080A12 100%)`
  const overlayBg = isLight
    ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(15,17,26,0.10))'
    : 'linear-gradient(180deg, rgba(8,10,18,0.08), rgba(8,10,18,0.68))'
  const floatingPillClass = isLight
    ? 'border-black/10 bg-white/88 text-black/65'
    : 'border-white/10 bg-black/35 text-white/75'
  const sparkPillClass = isLight
    ? 'bg-white/88 text-black/70 border border-black/10'
    : 'bg-black/35 text-white/80'

  // Show a mini preview of first 3 slots
  const previewSlots = template.slots.slice(0, 4)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-ds-border bg-ds-surface transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
      style={{
        boxShadow: hovering ? `0 18px 44px -24px ${theme.glow}` : undefined,
        borderColor: hovering ? theme.border : undefined,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onApply}
    >
      <div
        className="absolute inset-0 opacity-100 transition-opacity"
        style={{ background: theme.gradient }}
      />

      {/* Mini page preview */}
      <div
        className="relative h-40 overflow-hidden border-b border-white/5"
        style={{ background: previewBg, borderBottomColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)' }}
      >
        <div className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${isLight ? 'from-black/[0.03]' : 'from-white/[0.06]'} to-transparent`} />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: isLight
              ? 'radial-gradient(rgba(15,17,26,0.08) 1px, transparent 1px)'
              : 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Stacked block thumbnails */}
        <div className="relative flex h-full w-full flex-col overflow-hidden px-2 pt-3 pb-2">
          {previewSlots.map((slot, i) => {
            const block = getBlockById(slot.blockId)
            if (!block) return null
            const svg = getBlockSvg(block.svgCategory, slot.variantId)
            const heightFraction = 1 / previewSlots.length
            return (
              <div
                key={i}
                className="overflow-hidden flex-shrink-0 rounded-lg shadow-sm"
                style={{
                  height: `${heightFraction * 100}%`,
                  opacity: 1 - i * 0.06,
                  marginBottom: i === previewSlots.length - 1 ? 0 : 6,
                  border: isLight ? '1px solid rgba(15,17,26,0.08)' : '1px solid rgba(255,255,255,0.04)',
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )
          })}
        </div>

        {/* Category badge */}
        <div
          className="absolute top-3 start-3 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
          style={{ backgroundColor: theme.accent, color: '#fff', borderColor: theme.border }}
        >
          {CAT_LABELS[template.category]}
        </div>

        {/* Slot count */}
        <div className={`absolute top-3 end-3 rounded-full border px-2.5 py-1 text-[9px] font-mono backdrop-blur-sm ${floatingPillClass}`}>
          {template.slots.length} blocks
        </div>

        <div className={`absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-medium backdrop-blur-sm ${sparkPillClass}`}>
          <Sparkles size={10} style={{ color: theme.soft }} />
          <span>{template.tags.slice(0, 2).join(' / ')}</span>
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`} style={{ background: overlayBg }}>
          <div className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg" style={{ backgroundColor: theme.accent }}>
            <Check size={13} />
            Use Template
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="relative px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg">{template.icon}</span>
              <span className="text-sm font-semibold text-ds-text-primary">{template.name}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-ds-text-muted">{template.description}</p>
          </div>
          <ChevronRight size={14} className="mt-0.5 flex-shrink-0 transition-colors" style={{ color: hovering ? theme.accent : '#485065' }} />
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full border px-2 py-0.5 text-[9px] font-medium"
                style={{ backgroundColor: `${theme.accent}14`, borderColor: `${theme.border}66`, color: hovering ? theme.soft : 'var(--ds-text-muted)' }}
              >
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
  const themeMode = useSessionStore((state) => state.theme)
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
          <h2 className="text-base font-semibold text-ds-text-primary">Page Templates</h2>
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
          className="w-56 rounded-xl border border-ds-border bg-ds-background px-3 py-2 text-xs text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary/50"
        />

        <button
          onClick={onClose}
          className="rounded-xl bg-ds-surface-hover p-2 text-ds-text-muted transition-colors hover:text-ds-text-primary hover:bg-ds-surface-hover"
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
          const theme = CAT_THEMES[cat.id] ?? CAT_THEMES.marketing
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'text-white shadow-sm'
                  : 'bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: theme.accent, boxShadow: `0 8px 22px -14px ${theme.glow}` } : {}}
            >
              {cat.label}
              <span className={`text-[9px] ${activeCategory === cat.id ? 'text-white/75' : 'text-ds-text-muted'}`}>
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
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                themeMode={themeMode}
                onApply={() => onApply(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
