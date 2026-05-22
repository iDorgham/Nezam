'use client'

import { useState } from 'react'
import {
  ChevronRight,
  FileText,
  Folder,
  Check,
  Globe,
  Boxes,
  PenTool,
  ShoppingBag,
  BookOpen,
  Newspaper,
  Store,
  Layers as LayersIcon,
  LayoutDashboard,
  Briefcase,
} from 'lucide-react'
import { ARCHETYPES } from '@/data/archetypes'
import { useHub } from '@/store/hub.store'
import type { Archetype, ArchetypeKind, SitemapNode } from '@/types'
import { cn } from '@/lib/cn'

const ICONS: Record<ArchetypeKind, typeof Globe> = {
  landing: Globe,
  saas: Boxes,
  'micro-saas': PenTool,
  'saas-xplatform': LayersIcon,
  blog: Newspaper,
  cms: BookOpen,
  store: ShoppingBag,
  multivendor: Store,
  portfolio: Briefcase,
  'dashboard-app': LayoutDashboard,
}

/** Archetype picker + the chosen archetype's page tree. */
export function SitemapPanel() {
  const dir = useHub((s) => s.dir)
  const archetypeId = useHub((s) => s.archetypeId)
  const setArchetype = useHub((s) => s.setArchetype)
  const rtl = dir === 'rtl'
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0]

  return (
    <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
      <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
        Project archetype
      </div>
      <div className="space-y-1.5">
        {ARCHETYPES.map((a) => (
          <ArchetypeCard
            key={a.id}
            archetype={a}
            active={a.id === archetypeId}
            rtl={rtl}
            onClick={() => setArchetype(a.id)}
          />
        ))}
      </div>

      <div className="mt-5 mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
          Pages
        </span>
        <span className="text-[10px] text-app-subtle">{archetype.pages.length}</span>
      </div>
      <div className="space-y-0.5">
        {archetype.pages.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} rtl={rtl} />
        ))}
      </div>
    </div>
  )
}

function ArchetypeCard({
  archetype,
  active,
  rtl,
  onClick,
}: {
  archetype: Archetype
  active: boolean
  rtl: boolean
  onClick: () => void
}) {
  const Icon = ICONS[archetype.id]
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'focus-ring group flex w-full items-center gap-2.5 rounded-app border px-2.5 py-2 text-left transition-all duration-150',
        active
          ? 'border-app-accent bg-app-accent-subtle'
          : 'border-app-border bg-app-inset/60 hover:border-app-border-strong hover:-translate-y-px',
      )}
    >
      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-app-sm transition-colors',
          active
            ? 'bg-app-accent text-app-on-accent'
            : 'bg-app-elevated text-app-muted group-hover:text-app-text',
        )}
      >
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate text-xs font-semibold text-app-text">
            {rtl ? archetype.arabicName : archetype.name}
          </span>
          {active && <Check size={11} className="text-app-accent" />}
        </div>
        <div className="truncate text-[10px] text-app-subtle">{archetype.description}</div>
      </div>
    </button>
  )
}

function TreeNode({ node, depth, rtl }: { node: SitemapNode; depth: number; rtl: boolean }) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = !!node.children?.length
  const label = rtl ? node.arabicName : node.name

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded-app-sm py-1.5 pr-2 text-left transition-colors hover:bg-app-elevated"
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        {hasChildren ? (
          <ChevronRight
            size={13}
            className={cn('shrink-0 text-app-subtle transition-transform', open && 'rotate-90')}
          />
        ) : (
          <span className="w-[13px] shrink-0" />
        )}
        {hasChildren ? (
          <Folder size={13} className="shrink-0 text-app-accent" />
        ) : (
          <FileText size={13} className="shrink-0 text-app-subtle" />
        )}
        <span className="truncate text-[11px] font-medium text-app-text">{label}</span>
      </button>
      {open &&
        node.children?.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} rtl={rtl} />
        ))}
    </div>
  )
}
