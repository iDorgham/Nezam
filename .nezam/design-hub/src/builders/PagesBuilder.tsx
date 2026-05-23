'use client'

/**
 * SPEC-DS-VISUAL-001 — Multi-page section configurator.
 * Manages pages list, per-page sections, transitions, and SEO fields.
 */

import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { BlockKind } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

type PageTransition = 'fade' | 'slide' | 'scale' | 'none'
type NavPosition    = 'header' | 'sidebar' | 'bottom' | 'none'

export interface ManagedPage {
  id: string
  name: string
  slug: string
  sections: BlockKind[]
  isHome: boolean
  protected: boolean
  expanded: boolean
}

export interface PagesConfig {
  transition: PageTransition
  navPosition: NavPosition
  showBreadcrumb: boolean
  showPageTitle: boolean
  pages: ManagedPage[]
}

const uid = () => Math.random().toString(36).slice(2, 8)

const SECTION_OPTIONS: BlockKind[] = [
  'nav', 'hero', 'featureGrid', 'stats', 'pricing', 'cta', 'footer',
  'productGrid', 'articleList', 'dashboard',
]

const DEFAULT_PAGES: ManagedPage[] = [
  { id: uid(), name: 'Home',    slug: '/',        sections: ['nav', 'hero', 'featureGrid', 'cta', 'footer'], isHome: true,  protected: false, expanded: true },
  { id: uid(), name: 'Pricing', slug: '/pricing', sections: ['nav', 'pricing', 'footer'],                    isHome: false, protected: false, expanded: false },
  { id: uid(), name: 'Blog',    slug: '/blog',    sections: ['nav', 'articleList', 'footer'],                isHome: false, protected: false, expanded: false },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-app-subtle">{label}</p>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-xs text-app-text">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-4 w-7 rounded-full transition-colors', checked ? 'bg-app-brand' : 'bg-app-border')}
      >
        <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </button>
    </label>
  )
}

function Chip<T extends string>({
  value, current, onChange, label,
}: { value: T; current: T; onChange: (v: T) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] transition-colors',
        current === value ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
      )}
    >
      {label}
    </button>
  )
}

// ── Page row ──────────────────────────────────────────────────────────────────

function PageRow({
  page, onUpdate, onRemove,
}: {
  page: ManagedPage
  onUpdate: (patch: Partial<ManagedPage>) => void
  onRemove: () => void
}) {
  const toggleSection = (kind: BlockKind) => {
    const has = page.sections.includes(kind)
    onUpdate({ sections: has ? page.sections.filter((s) => s !== kind) : [...page.sections, kind] })
  }

  return (
    <div className="rounded-md border border-app-border bg-app-surface">
      {/* Header row */}
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          onClick={() => onUpdate({ expanded: !page.expanded })}
          className="text-app-subtle hover:text-app-text"
        >
          {page.expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        {/* Page name */}
        <input
          value={page.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-xs font-medium text-app-text focus:outline-none"
          placeholder="Page name"
        />

        {/* Slug */}
        <input
          value={page.slug}
          onChange={(e) => onUpdate({ slug: e.target.value })}
          className="w-24 rounded border border-app-border bg-transparent px-1.5 py-0.5 text-[10px] text-app-subtle focus:outline-none focus:ring-1 focus:ring-app-brand"
          placeholder="/slug"
        />

        {/* Home badge */}
        <button
          onClick={() => onUpdate({ isHome: !page.isHome })}
          className={cn(
            'rounded px-1.5 py-0.5 text-[9px] font-semibold transition-colors',
            page.isHome ? 'bg-app-brand/15 text-app-brand' : 'text-app-subtle hover:text-app-text',
          )}
          title="Set as home"
        >
          HOME
        </button>

        {/* Protected */}
        <button
          onClick={() => onUpdate({ protected: !page.protected })}
          className={cn(
            'rounded px-1.5 py-0.5 text-[9px] transition-colors',
            page.protected ? 'bg-app-warning/15 text-app-warning' : 'text-app-subtle hover:text-app-text',
          )}
          title="Protected page"
        >
          🔒
        </button>

        <button
          onClick={onRemove}
          disabled={page.isHome}
          className={cn(
            'text-app-subtle transition-colors hover:text-app-danger',
            page.isHome && 'pointer-events-none opacity-30',
          )}
          aria-label="Delete page"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Sections picker */}
      {page.expanded && (
        <div className="border-t border-app-border px-3 py-2">
          <p className="mb-1.5 text-[10px] text-app-subtle">Sections</p>
          <div className="flex flex-wrap gap-1">
            {SECTION_OPTIONS.map((kind) => (
              <button
                key={kind}
                onClick={() => toggleSection(kind)}
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] transition-colors',
                  page.sections.includes(kind)
                    ? 'bg-app-brand text-app-on-brand'
                    : 'bg-app-elevated text-app-subtle hover:text-app-text',
                )}
              >
                {kind}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface PagesBuilderProps {
  value?: Partial<PagesConfig>
  onChange?: (cfg: PagesConfig) => void
}

export function PagesBuilder({ value, onChange }: PagesBuilderProps) {
  const [cfg, setCfg] = useState<PagesConfig>({
    transition: 'fade',
    navPosition: 'header',
    showBreadcrumb: false,
    showPageTitle: true,
    pages: DEFAULT_PAGES,
    ...value,
  })

  const update = <K extends keyof PagesConfig>(key: K, val: PagesConfig[K]) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    onChange?.(next)
  }

  const updatePage = (id: string, patch: Partial<ManagedPage>) => {
    update('pages', cfg.pages.map((p) => p.id === id ? { ...p, ...patch } : p))
  }

  const removePage = (id: string) => {
    update('pages', cfg.pages.filter((p) => p.id !== id))
  }

  const addPage = () => {
    update('pages', [
      ...cfg.pages,
      { id: uid(), name: 'New Page', slug: '/new-page', sections: ['nav', 'footer'], isHome: false, protected: false, expanded: true },
    ])
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Global config */}
      <Section label="Navigation">
        <div className="flex flex-wrap gap-1">
          {(['header', 'sidebar', 'bottom', 'none'] as NavPosition[]).map((n) => (
            <Chip key={n} value={n} current={cfg.navPosition} onChange={(v) => update('navPosition', v)} label={n} />
          ))}
        </div>
      </Section>

      <Section label="Transition">
        <div className="flex gap-1">
          {(['fade', 'slide', 'scale', 'none'] as PageTransition[]).map((t) => (
            <Chip key={t} value={t} current={cfg.transition} onChange={(v) => update('transition', v)} label={t} />
          ))}
        </div>
      </Section>

      <Section label="Options">
        <div className="flex flex-col gap-2.5">
          <Toggle checked={cfg.showBreadcrumb} onChange={(v) => update('showBreadcrumb', v)} label="Breadcrumb" />
          <Toggle checked={cfg.showPageTitle} onChange={(v) => update('showPageTitle', v)} label="Page title" />
        </div>
      </Section>

      {/* Pages */}
      <Section label={`Pages (${cfg.pages.length})`}>
        <div className="flex flex-col gap-2">
          {cfg.pages.map((page) => (
            <PageRow
              key={page.id}
              page={page}
              onUpdate={(patch) => updatePage(page.id, patch)}
              onRemove={() => removePage(page.id)}
            />
          ))}
        </div>
        <button
          onClick={addPage}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-app-border px-3 py-1.5 text-[11px] text-app-subtle transition-colors hover:border-app-border-strong hover:text-app-text"
        >
          <Plus size={12} /> Add page
        </button>
      </Section>
    </div>
  )
}
