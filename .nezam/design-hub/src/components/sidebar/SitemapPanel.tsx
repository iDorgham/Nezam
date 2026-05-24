'use client'

import { useState, useRef } from 'react'
import {
  ChevronRight,
  FileText,
  Folder,
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
  AlertTriangle,
  Upload,
  ChevronDown,
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

// ── Reset confirmation dialog ─────────────────────────────────────────────────

type ResetAction = 'continue' | 'export-then-continue' | 'cancel'

function ResetDialog({
  onAction,
}: {
  onAction: (action: ResetAction) => void
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-80 overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-app-xl">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-app-text">Reset sitemap?</div>
            <p className="mt-1 text-[11px] text-app-subtle leading-relaxed">
              Switching archetype will replace the current sitemap. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-app-border p-4">
          <button
            onClick={() => onAction('export-then-continue')}
            className="w-full rounded-xl border border-app-border bg-app-elevated px-3 py-2 text-left text-[11px] font-medium text-app-text hover:border-app-border-strong"
          >
            Export current, then reset
          </button>
          <button
            onClick={() => onAction('continue')}
            className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-left text-[11px] font-semibold text-red-400 hover:bg-red-500/15"
          >
            Reset — I don't need the current sitemap
          </button>
          <button
            onClick={() => onAction('cancel')}
            className="w-full rounded-xl px-3 py-2 text-left text-[11px] text-app-subtle hover:bg-app-elevated"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/** Archetype picker + the chosen archetype's app/menu/page tree. */
export function SitemapPanel() {
  const dir = useHub((s) => s.dir)
  const archetypeId  = useHub((s) => s.archetypeId)
  const setArchetype = useHub((s) => s.setArchetype)
  const loadFromArchetype = useSitemapBuilder((s) => s.loadFromArchetype)
  const exportJSON   = useSitemapBuilder((s) => s.exportJSON)
  const rtl          = dir === 'rtl'
  const archetype    = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0]

  // Pending selection state — chosen but not yet applied
  const [pending, setPending] = useState<ArchetypeKind>(archetypeId)
  const [showReset, setShowReset] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const handleApply = () => {
    if (pending === archetypeId) return
    setShowReset(true)
  }

  const doApply = (newId: ArchetypeKind) => {
    setArchetype(newId)
    const a = ARCHETYPES.find((x) => x.id === newId)
    if (a) loadFromArchetype(a.apps)
  }

  const handleResetAction = (action: ResetAction) => {
    setShowReset(false)
    if (action === 'cancel') { setPending(archetypeId); return }
    if (action === 'export-then-continue') {
      const json = exportJSON()
      const blob = new Blob([json], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const el   = document.createElement('a')
      el.href = url; el.download = 'sitemap-backup.json'; el.click()
      URL.revokeObjectURL(url)
    }
    doApply(pending)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data?.apps && Array.isArray(data.apps)) {
          // Load raw builder format directly
          useSitemapBuilder.setState({ apps: data.apps, services: data.services ?? [] })
        } else {
          alert('Invalid sitemap file. Expected a file exported from NEZAM Design Hub.')
        }
      } catch {
        alert('Could not parse the file. Make sure it is a valid JSON sitemap export.')
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be re-imported
    e.target.value = ''
  }

  // Count total pages across all apps
  const totalApps  = archetype.apps.length
  const totalPages = archetype.apps.reduce((n, a) =>
    n + a.navMenus.reduce((m, menu) =>
      m + menu.pages.reduce((p, pg) => p + 1 + (pg.children?.length ?? 0), 0), 0), 0)

  const hasPendingChange = pending !== archetypeId

  return (
    <>
      {showReset && <ResetDialog onAction={handleResetAction} />}

      <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">

        {/* ── Archetype dropdown ─────────────────────────────────────────── */}
        <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
          Project archetype
        </div>

        <div className="space-y-2">
          {/* Dropdown selector */}
          <div className="relative">
            <select
              value={pending}
              onChange={(e) => setPending(e.target.value as ArchetypeKind)}
              className="w-full appearance-none rounded-app border border-app-border bg-app-inset py-2 pl-3 pr-8 text-[12px] font-medium text-app-text outline-none focus:border-app-accent"
            >
              {ARCHETYPES.map((a) => (
                <option key={a.id} value={a.id}>
                  {rtl ? a.arabicName : a.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-app-subtle" />
          </div>

          {/* Apply + description */}
          {(() => {
            const sel = ARCHETYPES.find((a) => a.id === pending)!
            const Icon = ARCHETYPE_ICONS[pending]
            return (
              <div className={cn(
                'rounded-app border px-2.5 py-2 transition-all',
                hasPendingChange
                  ? 'border-app-accent/40 bg-app-accent-subtle'
                  : 'border-app-border/50 bg-app-inset/40',
              )}>
                <div className="flex items-center gap-2">
                  <Icon size={13} className={hasPendingChange ? 'text-app-accent' : 'text-app-muted'} />
                  <span className="flex-1 text-[11px] font-medium text-app-text">{sel.description}</span>
                </div>
                {hasPendingChange && (
                  <button
                    onClick={handleApply}
                    className="mt-2 w-full rounded-lg bg-app-accent py-1.5 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
                  >
                    Apply archetype
                  </button>
                )}
              </div>
            )
          })()}

          {/* Import button */}
          <button
            onClick={() => importRef.current?.click()}
            className="flex w-full items-center gap-2 rounded-app border border-dashed border-app-border px-3 py-2 text-[11px] text-app-subtle transition-colors hover:border-app-border-strong hover:text-app-muted"
          >
            <Upload size={11} />
            Import saved project (.json)
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* ── Structure tree ─────────────────────────────────────────────── */}
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
    </>
  )
}

function AppNode({ app, rtl }: { app: ArchetypeApp; rtl: boolean }) {
  const [open, setOpen] = useState(true)
  const AppIcon = APP_KIND_ICONS[app.kind]
  const color   = APP_KIND_COLORS[app.kind]
  const label   = rtl ? app.arabicName : app.name
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
      {open && app.navMenus.map((menu) => (
        <MenuNode key={menu.name} menu={menu} rtl={rtl} />
      ))}
    </div>
  )
}

function MenuNode({ menu, rtl }: { menu: ArchetypeApp['navMenus'][number]; rtl: boolean }) {
  const [open, setOpen] = useState(true)
  const MenuIcon = MENU_KIND_ICONS[menu.kind]
  const label    = rtl ? menu.arabicName : menu.name

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
