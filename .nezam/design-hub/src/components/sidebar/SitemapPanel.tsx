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
  Navigation2,
  PanelBottom,
  PanelLeft,
  Settings2,
  Menu as MenuIcon,
  Shield,
  Smartphone,
  Monitor,
  Zap,
  Box,
} from 'lucide-react'
import { ARCHETYPES } from '@/data/archetypes'
import { useHub } from '@/store/hub.store'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import type { Archetype, ArchetypeApp, ArchetypeKind, AppKind, NavMenuKind, SitemapNode } from '@/types'
import { cn } from '@/lib/cn'

const ARCHETYPE_ICONS: Record<ArchetypeKind, typeof Globe> = {
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

const APP_KIND_COLORS: Record<AppKind, string> = {
  marketing:          'text-blue-400',
  'dashboard-client': 'text-emerald-400',
  'dashboard-admin':  'text-orange-400',
  mobile:             'text-violet-400',
  desktop:            'text-cyan-400',
  api:                'text-yellow-400',
  custom:             'text-app-muted',
}
const APP_KIND_ICONS: Record<AppKind, typeof Globe> = {
  marketing: Globe,
  'dashboard-client': LayoutDashboard,
  'dashboard-admin': Shield,
  mobile: Smartphone,
  desktop: Monitor,
  api: Zap,
  custom: Box,
}
const MENU_KIND_ICONS: Record<NavMenuKind, typeof Navigation2> = {
  main: Navigation2,
  footer: PanelBottom,
  sidebar: PanelLeft,
  utility: Settings2,
  custom: MenuIcon,
}

/** Archetype picker + the chosen archetype's app/menu/page tree. */
export function SitemapPanel() {
  const dir = useHub((s) => s.dir)
  const archetypeId = useHub((s) => s.archetypeId)
  const setArchetype = useHub((s) => s.setArchetype)
  const loadFromArchetype = useSitemapBuilder((s) => s.loadFromArchetype)
  const rtl = dir === 'rtl'
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0]

  const handleSelectArchetype = (id: ArchetypeKind) => {
    setArchetype(id)
    const a = ARCHETYPES.find((x) => x.id === id)
    if (a) loadFromArchetype(a.apps)
  }

  // Count total pages across all apps
  const totalApps = archetype.apps.length
  const totalPages = archetype.apps.reduce((n, a) =>
    n + a.navMenus.reduce((m, menu) =>
      m + menu.pages.reduce((p, pg) => p + 1 + (pg.children?.length ?? 0), 0), 0), 0)

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
            onClick={() => handleSelectArchetype(a.id)}
          />
        ))}
      </div>

      <div className="mt-5 mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
          Structure
        </span>
        <span className="text-[10px] text-app-subtle">
          {totalApps} app{totalApps !== 1 ? 's' : ''} · {totalPages} pages
        </span>
      </div>
      <div className="space-y-1">
        {archetype.apps.map((a) => (
          <AppNode key={a.name} app={a} rtl={rtl} />
        ))}
      </div>
    </div>
  )
}

function ArchetypeCard({
  archetype, active, rtl, onClick,
}: {
  archetype: Archetype; active: boolean; rtl: boolean; onClick: () => void
}) {
  const Icon = ARCHETYPE_ICONS[archetype.id]
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
      <span className={cn(
        'grid h-8 w-8 shrink-0 place-items-center rounded-app-sm transition-colors',
        active ? 'bg-app-accent text-app-on-accent' : 'bg-app-elevated text-app-muted group-hover:text-app-text',
      )}>
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

function AppNode({ app, rtl }: { app: ArchetypeApp; rtl: boolean }) {
  const [open, setOpen] = useState(true)
  const AppIcon = APP_KIND_ICONS[app.kind]
  const color = APP_KIND_COLORS[app.kind]
  const label = rtl ? app.arabicName : app.name
  const totalMenus = app.navMenus.length

  return (
    <div className="overflow-hidden rounded-lg border border-app-border/60">
      {/* App header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left bg-app-elevated/50 hover:bg-app-elevated"
      >
        <AppIcon size={12} className={cn('shrink-0', color)} />
        <span className="flex-1 truncate text-[11px] font-semibold text-app-text">{label}</span>
        <span className="text-[9px] text-app-subtle">{totalMenus} menu{totalMenus !== 1 ? 's' : ''}</span>
        <ChevronRight size={12} className={cn('text-app-subtle transition-transform', open && 'rotate-90')} />
      </button>

      {/* Nav menus */}
      {open && app.navMenus.map((menu) => {
        const MenuIcon = MENU_KIND_ICONS[menu.kind]
        return (
          <MenuNode key={menu.name} menu={menu} rtl={rtl} />
        )
      })}
    </div>
  )
}

function MenuNode({ menu, rtl }: { menu: ArchetypeApp['navMenus'][number]; rtl: boolean }) {
  const [open, setOpen] = useState(true)
  const MenuIcon = MENU_KIND_ICONS[menu.kind]
  const label = rtl ? menu.arabicName : menu.name

  return (
    <div className="border-t border-app-border/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-app-elevated/60"
      >
        <MenuIcon size={10} className="shrink-0 text-app-subtle" />
        <span className="flex-1 truncate text-[10px] font-medium text-app-text/80">{label}</span>
        <ChevronRight size={10} className={cn('text-app-subtle transition-transform', open && 'rotate-90')} />
      </button>
      {open && menu.pages.map((page) => (
        <TreeNode key={page.id} node={page} depth={0} rtl={rtl} />
      ))}
    </div>
  )
}

function TreeNode({ node, depth, rtl }: { node: SitemapNode; depth: number; rtl: boolean }) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = !!node.children?.length
  const label = rtl ? node.arabicName : node.name
  const hasSections = !!node.sectionNames?.length

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 py-1.5 pr-2 text-left transition-colors hover:bg-app-elevated"
        style={{ paddingLeft: 20 + depth * 12 }}
      >
        {hasChildren ? (
          <ChevronRight size={11} className={cn('shrink-0 text-app-subtle transition-transform', open && 'rotate-90')} />
        ) : (
          <span className="w-[11px] shrink-0" />
        )}
        {hasChildren ? (
          <Folder size={11} className="shrink-0 text-app-accent" />
        ) : (
          <FileText size={11} className="shrink-0 text-app-subtle" />
        )}
        <span className="truncate text-[11px] font-medium text-app-text">{label}</span>
        {hasSections && (
          <span className="ml-auto shrink-0 text-[9px] text-app-subtle/60">
            {node.sectionNames!.length}§
          </span>
        )}
      </button>
      {open && node.children?.map((child) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} rtl={rtl} />
      ))}
    </div>
  )
}
