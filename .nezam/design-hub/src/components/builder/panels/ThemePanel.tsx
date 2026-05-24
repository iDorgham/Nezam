'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Sub-tab definitions ────────────────────────────────────────────────────────

type ThemeTab = 'header' | 'footer' | 'pages' | 'blog' | 'portfolio' | 'casestudies'

const THEME_TABS: { id: ThemeTab; label: string }[] = [
  { id: 'header',      label: 'Header' },
  { id: 'footer',      label: 'Footer' },
  { id: 'pages',       label: 'Page Layouts' },
  { id: 'blog',        label: 'Blog' },
  { id: 'portfolio',   label: 'Portfolio' },
  { id: 'casestudies', label: 'Case Studies' },
]

// ── Generic style picker ──────────────────────────────────────────────────────

function StyleCard({
  label,
  description,
  preview,
  active,
  onClick,
}: {
  label: string
  description: string
  preview: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full overflow-hidden rounded-xl border p-0 text-left transition-all',
        active ? 'border-app-accent shadow-app-sm' : 'border-app-border hover:border-app-border-strong',
      )}
    >
      {/* Preview area */}
      <div className="flex h-24 items-center justify-center bg-app-inset px-3">
        {preview}
      </div>
      {/* Label */}
      <div className="flex items-center gap-2 border-t border-app-border/60 px-3 py-2">
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-app-text">{label}</p>
          <p className="text-[10px] text-app-subtle">{description}</p>
        </div>
        {active && <Check size={12} className="shrink-0 text-app-accent" />}
      </div>
    </button>
  )
}

// ── Header styles ─────────────────────────────────────────────────────────────

const HEADER_STYLES = [
  {
    id: 'fixed-solid',
    label: 'Fixed Solid',
    description: 'Always visible, opaque background',
    preview: (
      <div className="w-full max-w-48">
        <div className="flex h-7 items-center justify-between rounded-lg bg-app-surface px-3 shadow-sm">
          <div className="h-2 w-12 rounded-full bg-app-brand/60" />
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => <div key={i} className="h-1.5 w-6 rounded-full bg-app-border-strong" />)}
          </div>
          <div className="h-5 w-12 rounded-md bg-app-brand/70" />
        </div>
        <div className="mt-2 h-12 rounded-lg bg-app-elevated/60" />
      </div>
    ),
  },
  {
    id: 'fixed-blur',
    label: 'Fixed Blur',
    description: 'Frosted glass effect on scroll',
    preview: (
      <div className="w-full max-w-48">
        <div className="flex h-7 items-center justify-between rounded-lg border border-app-border/40 bg-app-surface/50 px-3 backdrop-blur-sm">
          <div className="h-2 w-12 rounded-full bg-app-brand/60" />
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => <div key={i} className="h-1.5 w-6 rounded-full bg-app-border-strong" />)}
          </div>
          <div className="h-5 w-12 rounded-md bg-app-brand/70" />
        </div>
        <div className="mt-2 h-12 rounded-lg bg-app-elevated/60" />
      </div>
    ),
  },
  {
    id: 'transparent',
    label: 'Transparent Hero',
    description: 'Transparent over hero, solid on scroll',
    preview: (
      <div className="w-full max-w-48">
        <div className="relative h-16 overflow-hidden rounded-lg bg-gradient-to-br from-app-brand/30 to-app-accent/20">
          <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between px-3">
            <div className="h-2 w-12 rounded-full bg-white/60" />
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => <div key={i} className="h-1.5 w-6 rounded-full bg-white/40" />)}
            </div>
            <div className="h-5 w-12 rounded-md bg-white/30" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sidebar',
    label: 'Sidebar Nav',
    description: 'Vertical navigation on the side',
    preview: (
      <div className="flex h-16 w-full max-w-48 gap-2">
        <div className="flex w-14 flex-col gap-1.5 rounded-lg bg-app-surface p-2">
          <div className="h-2 w-full rounded bg-app-brand/60" />
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-1.5 w-full rounded bg-app-border-strong" />)}
        </div>
        <div className="flex-1 rounded-lg bg-app-elevated/60" />
      </div>
    ),
  },
]

function HeaderStyles() {
  const [selected, setSelected] = useState('fixed-blur')
  return (
    <div className="grid grid-cols-2 gap-2">
      {HEADER_STYLES.map((s) => (
        <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
      ))}
    </div>
  )
}

// ── Footer styles ─────────────────────────────────────────────────────────────

const FOOTER_STYLES = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Logo + copyright only',
    preview: (
      <div className="w-full max-w-48">
        <div className="flex h-10 items-center justify-between rounded-lg bg-app-surface px-3">
          <div className="h-2 w-12 rounded-full bg-app-brand/50" />
          <div className="h-1.5 w-24 rounded-full bg-app-border-strong" />
        </div>
      </div>
    ),
  },
  {
    id: 'columns',
    label: 'Multi-column',
    description: 'Logo, links, and contact info',
    preview: (
      <div className="w-full max-w-48 rounded-lg bg-app-surface p-3">
        <div className="mb-2 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col gap-1">
              <div className="h-1.5 rounded bg-app-brand/50" />
              {[0, 1, 2].map((r) => <div key={r} className="h-1 rounded bg-app-border-strong" />)}
            </div>
          ))}
        </div>
        <div className="h-px bg-app-border/60" />
      </div>
    ),
  },
  {
    id: 'centered',
    label: 'Centered',
    description: 'Logo centered, links below',
    preview: (
      <div className="w-full max-w-48 rounded-lg bg-app-surface p-3 text-center">
        <div className="mx-auto mb-2 h-2 w-16 rounded-full bg-app-brand/50" />
        <div className="mx-auto flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-1.5 w-8 rounded bg-app-border-strong" />)}
        </div>
        <div className="mx-auto mt-2 h-1 w-24 rounded bg-app-border/60" />
      </div>
    ),
  },
  {
    id: 'dark-full',
    label: 'Dark Full-width',
    description: 'Dark band, full-width layout',
    preview: (
      <div className="w-full max-w-48 rounded-lg bg-app-deep p-3">
        <div className="mb-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex flex-col gap-1">
              <div className="h-1.5 rounded bg-white/20" />
              {[0, 1].map((r) => <div key={r} className="h-1 rounded bg-white/10" />)}
            </div>
          ))}
        </div>
        <div className="h-px bg-white/10" />
      </div>
    ),
  },
]

function FooterStyles() {
  const [selected, setSelected] = useState('columns')
  return (
    <div className="grid grid-cols-2 gap-2">
      {FOOTER_STYLES.map((s) => (
        <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
      ))}
    </div>
  )
}

// ── Page layouts ──────────────────────────────────────────────────────────────

const PAGE_LAYOUTS = [
  {
    id: 'full-width',
    label: 'Full Width',
    description: 'Content spans the full viewport',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        <div className="h-3 w-full rounded bg-app-brand/40" />
        <div className="h-8 w-full rounded bg-app-elevated" />
        <div className="h-3 w-full rounded bg-app-elevated" />
      </div>
    ),
  },
  {
    id: 'centered',
    label: 'Centered',
    description: 'Max-width container, centered',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        <div className="h-3 w-full rounded bg-app-brand/40" />
        <div className="mx-4 h-8 rounded bg-app-elevated" />
        <div className="mx-4 h-3 rounded bg-app-elevated" />
      </div>
    ),
  },
  {
    id: 'sidebar-left',
    label: 'Left Sidebar',
    description: 'Fixed sidebar, scrollable content',
    preview: (
      <div className="flex w-full max-w-48 gap-1.5">
        <div className="w-12 space-y-1">
          <div className="h-3 rounded bg-app-brand/30" />
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-2 rounded bg-app-elevated" />)}
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="h-3 rounded bg-app-brand/40" />
          <div className="h-8 rounded bg-app-elevated" />
        </div>
      </div>
    ),
  },
  {
    id: 'two-col',
    label: 'Two Column',
    description: 'Main content + aside',
    preview: (
      <div className="flex w-full max-w-48 gap-1.5">
        <div className="flex-1 space-y-1.5">
          <div className="h-3 rounded bg-app-brand/40" />
          <div className="h-10 rounded bg-app-elevated" />
        </div>
        <div className="w-14 space-y-1.5">
          <div className="h-3 rounded bg-app-elevated" />
          <div className="h-10 rounded bg-app-inset" />
        </div>
      </div>
    ),
  },
]

function PageLayouts() {
  const [selected, setSelected] = useState('centered')
  return (
    <div className="grid grid-cols-2 gap-2">
      {PAGE_LAYOUTS.map((s) => (
        <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
      ))}
    </div>
  )
}

// ── Blog layouts ──────────────────────────────────────────────────────────────

const BLOG_LAYOUTS = [
  {
    id: 'masonry',
    label: 'Masonry Grid',
    description: 'Variable height card grid',
    preview: (
      <div className="grid w-full max-w-48 grid-cols-2 gap-1.5">
        {[36, 28, 24, 40, 32, 28].map((h, i) => (
          <div key={i} className="rounded-md bg-app-elevated" style={{ height: h }} />
        ))}
      </div>
    ),
  },
  {
    id: 'list',
    label: 'List',
    description: 'Full-width article rows',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-2 rounded-md bg-app-elevated p-1.5">
            <div className="h-8 w-8 shrink-0 rounded bg-app-border-strong" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 rounded bg-app-border-strong/80" />
              <div className="h-1 w-3/4 rounded bg-app-border" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'magazine',
    label: 'Magazine',
    description: 'Hero post + smaller cards',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        <div className="h-14 rounded-md bg-app-brand/20" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded-md bg-app-elevated" />
          <div className="h-8 rounded-md bg-app-elevated" />
        </div>
      </div>
    ),
  },
]

function BlogLayouts() {
  const [selected, setSelected] = useState('magazine')
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-app-subtle">Choose a default layout for blog index and category pages.</p>
      <div className="grid grid-cols-2 gap-2">
        {BLOG_LAYOUTS.map((s) => (
          <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
        ))}
      </div>
    </div>
  )
}

// ── Portfolio layouts ─────────────────────────────────────────────────────────

const PORTFOLIO_LAYOUTS = [
  {
    id: 'grid',
    label: 'Grid',
    description: 'Equal-size project cards',
    preview: (
      <div className="grid w-full max-w-48 grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-app-elevated" />
        ))}
      </div>
    ),
  },
  {
    id: 'horizontal-scroll',
    label: 'Horizontal Scroll',
    description: 'Scrollable project strip',
    preview: (
      <div className="flex w-full max-w-48 gap-1.5 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-16 shrink-0 rounded-md bg-app-elevated" />
        ))}
      </div>
    ),
  },
  {
    id: 'case-list',
    label: 'Narrative List',
    description: 'Featured project with details',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-md bg-app-elevated px-2 py-1.5">
            <div className="h-8 w-12 shrink-0 rounded bg-app-border-strong" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 rounded bg-app-border-strong/80" />
              <div className="h-1 w-2/3 rounded bg-app-border" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

function PortfolioLayouts() {
  const [selected, setSelected] = useState('grid')
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-app-subtle">Default layout for the portfolio or works index page.</p>
      <div className="grid grid-cols-2 gap-2">
        {PORTFOLIO_LAYOUTS.map((s) => (
          <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
        ))}
      </div>
    </div>
  )
}

// ── Case Studies ──────────────────────────────────────────────────────────────

const CASESTUDY_LAYOUTS = [
  {
    id: 'narrative',
    label: 'Narrative',
    description: 'Long-form scroll with hero',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        <div className="h-10 rounded-md bg-app-brand/20" />
        <div className="mx-4 space-y-1">
          <div className="h-1.5 rounded bg-app-border-strong" />
          <div className="h-1 rounded bg-app-border" />
          <div className="h-1 w-3/4 rounded bg-app-border" />
        </div>
        <div className="h-8 rounded-md bg-app-elevated" />
      </div>
    ),
  },
  {
    id: 'stats-led',
    label: 'Stats-Led',
    description: 'KPI callouts front and center',
    preview: (
      <div className="w-full max-w-48 space-y-1.5">
        <div className="h-6 rounded-md bg-app-brand/20" />
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 rounded-md bg-app-elevated py-1.5">
              <div className="h-2 w-8 rounded bg-app-accent/50" />
              <div className="h-1 w-6 rounded bg-app-border" />
            </div>
          ))}
        </div>
        <div className="h-6 rounded-md bg-app-elevated" />
      </div>
    ),
  },
  {
    id: 'two-col-narrative',
    label: 'Two-column',
    description: 'Text left, visuals right',
    preview: (
      <div className="flex w-full max-w-48 gap-1.5">
        <div className="flex-1 space-y-1">
          <div className="h-2 rounded bg-app-border-strong" />
          <div className="h-1 rounded bg-app-border" />
          <div className="h-1 w-3/4 rounded bg-app-border" />
          <div className="h-6 rounded bg-app-elevated" />
        </div>
        <div className="w-16 rounded-md bg-app-brand/20" />
      </div>
    ),
  },
]

function CaseStudyLayouts() {
  const [selected, setSelected] = useState('narrative')
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-app-subtle">Default layout for individual case study pages.</p>
      <div className="grid grid-cols-2 gap-2">
        {CASESTUDY_LAYOUTS.map((s) => (
          <StyleCard key={s.id} {...s} active={selected === s.id} onClick={() => setSelected(s.id)} />
        ))}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function ThemePanel() {
  const [activeTab, setActiveTab] = useState<ThemeTab>('header')

  const content: Record<ThemeTab, React.ReactNode> = {
    header:      <HeaderStyles />,
    footer:      <FooterStyles />,
    pages:       <PageLayouts />,
    blog:        <BlogLayouts />,
    portfolio:   <PortfolioLayouts />,
    casestudies: <CaseStudyLayouts />,
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sub-tab strip */}
      <div className="app-scroll flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-app-border bg-app-surface px-2 py-1.5">
        {THEME_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-app-elevated text-app-text shadow-sm'
                : 'text-app-subtle hover:text-app-muted',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
        {content[activeTab]}
      </div>
    </div>
  )
}
