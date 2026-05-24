'use client'

import { useState, useRef } from 'react'
import {
  ChevronRight, ChevronDown,
  FileText, Folder,
  Globe, LayoutDashboard, Shield, Smartphone, Monitor, Zap, Box,
  Navigation2, PanelBottom, PanelLeft, Settings2, Menu as MenuIcon,
  Plus, Trash2, AlertTriangle, Upload,
  Boxes, PenTool, Layers as LayersIcon, Newspaper, BookOpen,
  ShoppingBag, Store, Briefcase,
} from 'lucide-react'
import { ARCHETYPES } from '@/data/archetypes'
import { useHub } from '@/store/hub.store'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import type {
  ArchetypeKind, AppKind, NavMenuKind,
  SitemapBuilderApp, SitemapBuilderNavMenu, SitemapBuilderPage,
} from '@/types'
import { cn } from '@/lib/cn'

// ── Icons ─────────────────────────────────────────────────────────────────────

const ARCHETYPE_ICONS: Record<ArchetypeKind, typeof Globe> = {
  landing:          Globe,
  saas:             Boxes,
  'micro-saas':     PenTool,
  'saas-xplatform': LayersIcon,
  blog:             Newspaper,
  cms:              BookOpen,
  store:            ShoppingBag,
  multivendor:      Store,
  portfolio:        Briefcase,
  'dashboard-app':  LayoutDashboard,
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
  marketing:          Globe,
  'dashboard-client': LayoutDashboard,
  'dashboard-admin':  Shield,
  mobile:             Smartphone,
  desktop:            Monitor,
  api:                Zap,
  custom:             Box,
}
const MENU_KIND_ICONS: Record<NavMenuKind, typeof Navigation2> = {
  main:    Navigation2,
  footer:  PanelBottom,
  sidebar: PanelLeft,
  utility: Settings2,
  custom:  MenuIcon,
}

const APP_KIND_OPTIONS: { kind: AppKind; label: string }[] = [
  { kind: 'marketing',        label: 'Marketing' },
  { kind: 'dashboard-client', label: 'Client App' },
  { kind: 'dashboard-admin',  label: 'Admin' },
  { kind: 'mobile',           label: 'Mobile' },
  { kind: 'desktop',          label: 'Desktop' },
  { kind: 'api',              label: 'API' },
  { kind: 'custom',           label: 'Custom' },
]
const MENU_KIND_OPTIONS: { kind: NavMenuKind; label: string }[] = [
  { kind: 'main',    label: 'Main Nav' },
  { kind: 'footer',  label: 'Footer' },
  { kind: 'sidebar', label: 'Sidebar' },
  { kind: 'utility', label: 'Utility' },
  { kind: 'custom',  label: 'Custom' },
]

// ── Reset dialog ──────────────────────────────────────────────────────────────

type ResetAction = 'continue' | 'export-then-continue' | 'cancel'

function ResetDialog({ onAction }: { onAction: (a: ResetAction) => void }) {
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
            Reset — I don&apos;t need the current sitemap
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

// ── Inline rename ─────────────────────────────────────────────────────────────

function InlineRename({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const commit = () => {
    setEditing(false)
    const t = draft.trim()
    if (t && t !== value) onSave(t)
    else setDraft(value)
  }
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-app-text outline-none border-b border-app-accent"
        onClick={(e) => e.stopPropagation()}
      />
    )
  }
  return (
    <span
      className="flex-1 truncate text-[11px] font-medium text-app-text cursor-text"
      onDoubleClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true) }}
      title="Double-click to rename"
    >
      {value}
    </span>
  )
}

// ── Page tree item ─────────────────────────────────────────────────────────────

function PageItem({ page, appId, menuId, depth = 0 }: {
  page: SitemapBuilderPage; appId: string; menuId: string; depth?: number
}) {
  const renamePage  = useSitemapBuilder((s) => s.renamePage)
  const deletePage  = useSitemapBuilder((s) => s.deletePage)
  const addSubPage  = useSitemapBuilder((s) => s.addSubPage)
  const [open, setOpen] = useState(depth === 0)
  const [blocked, setBlocked] = useState(false)
  const hasChildren = (page.subPages?.length ?? 0) > 0

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!deletePage(page.id)) { setBlocked(true); setTimeout(() => setBlocked(false), 2000) }
  }

  return (
    <div>
      <div
        className="group flex items-center gap-1.5 rounded-md py-1 pr-1 transition-colors hover:bg-app-elevated"
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        {hasChildren ? (
          <button onClick={() => setOpen((o) => !o)} className="shrink-0">
            <ChevronRight size={11} className={cn('text-app-subtle transition-transform', open && 'rotate-90')} />
          </button>
        ) : (
          <span className="w-[11px] shrink-0" />
        )}
        {hasChildren
          ? <Folder size={11} className="shrink-0 text-app-accent" />
          : <FileText size={11} className="shrink-0 text-app-subtle/60" />
        }
        <InlineRename value={page.name} onSave={(v) => renamePage(page.id, v)} />
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); addSubPage(page.id) }}
            className="flex h-4 w-4 items-center justify-center rounded text-app-subtle hover:text-app-accent"
            title="Add sub-page"
          ><Plus size={9} /></button>
          {blocked
            ? <AlertTriangle size={10} className="text-red-400" />
            : (
              <button
                onClick={handleDelete}
                className="flex h-4 w-4 items-center justify-center rounded text-app-subtle hover:text-red-400"
                title="Delete page"
              ><Trash2 size={9} /></button>
            )
          }
        </div>
      </div>
      {open && page.subPages?.map((child) => (
        <PageItem key={child.id} page={child} appId={appId} menuId={menuId} depth={depth + 1} />
      ))}
    </div>
  )
}

// ── Menu tree item ─────────────────────────────────────────────────────────────

function MenuItemPanel({ menu, appId }: { menu: SitemapBuilderNavMenu; appId: string }) {
  const addPage       = useSitemapBuilder((s) => s.addPage)
  const renameNavMenu = useSitemapBuilder((s) => s.renameNavMenu)
  const deleteNavMenu = useSitemapBuilder((s) => s.deleteNavMenu)
  const [open, setOpen] = useState(true)
  const MenuIconComp = MENU_KIND_ICONS[menu.kind]

  return (
    <div className="border-t border-app-border/40">
      <div className="group flex items-center gap-1.5 px-3 py-1.5 transition-colors hover:bg-app-elevated/60">
        <button onClick={() => setOpen((o) => !o)} className="shrink-0">
          <ChevronRight size={10} className={cn('text-app-subtle transition-transform', open && 'rotate-90')} />
        </button>
        <MenuIconComp size={10} className="shrink-0 text-app-subtle" />
        <InlineRename value={menu.name} onSave={(v) => renameNavMenu(appId, menu.id, v)} />
        <span className="shrink-0 text-[9px] text-app-subtle">{menu.pages.length}</span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); addPage(appId, menu.id) }}
            className="flex h-4 w-4 items-center justify-center rounded text-app-subtle hover:text-app-accent"
            title="Add page"
          ><Plus size={9} /></button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteNavMenu(appId, menu.id) }}
            className="flex h-4 w-4 items-center justify-center rounded text-app-subtle hover:text-red-400"
            title="Delete menu"
          ><Trash2 size={9} /></button>
        </div>
      </div>
      {open && menu.pages.map((page) => (
        <PageItem key={page.id} page={page} appId={appId} menuId={menu.id} depth={0} />
      ))}
    </div>
  )
}

// ── App tree item ──────────────────────────────────────────────────────────────

function AppItemPanel({ app }: { app: SitemapBuilderApp }) {
  const renameApp  = useSitemapBuilder((s) => s.renameApp)
  const deleteApp  = useSitemapBuilder((s) => s.deleteApp)
  const addNavMenu = useSitemapBuilder((s) => s.addNavMenu)
  const [open, setOpen] = useState(true)
  const [menuPickerOpen, setMenuPickerOpen] = useState(false)
  const AppIcon = APP_KIND_ICONS[app.kind]
  const color   = APP_KIND_COLORS[app.kind]

  return (
    <div className="overflow-hidden rounded-lg border border-app-border/60">
      {/* App header */}
      <div className="group flex items-center gap-2 bg-app-elevated/50 px-2.5 py-2 transition-colors hover:bg-app-elevated">
        <button onClick={() => setOpen((o) => !o)} className="shrink-0">
          <ChevronRight size={12} className={cn('text-app-subtle transition-transform', open && 'rotate-90')} />
        </button>
        <AppIcon size={12} className={cn('shrink-0', color)} />
        <InlineRename value={app.name} onSave={(v) => renameApp(app.id, v)} />
        <span className="shrink-0 text-[9px] text-app-subtle">
          {app.navMenus.length}m
        </span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {/* + Menu picker */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuPickerOpen((v) => !v) }}
              className="flex h-5 w-5 items-center justify-center rounded text-app-subtle hover:text-app-accent"
              title="Add menu"
            ><Plus size={10} /></button>
            {menuPickerOpen && (
              <div className="absolute left-0 top-full z-50 mt-0.5 overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-app-lg" style={{ minWidth: 120 }}>
                {MENU_KIND_OPTIONS.map((o) => (
                  <button
                    key={o.kind}
                    onClick={(e) => { e.stopPropagation(); addNavMenu(app.id, o.kind); setMenuPickerOpen(false) }}
                    className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[11px] text-app-text hover:bg-app-elevated"
                  >
                    {(() => { const MI = MENU_KIND_ICONS[o.kind]; return <MI size={10} className="text-app-subtle" /> })()}
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); deleteApp(app.id) }}
            className="flex h-5 w-5 items-center justify-center rounded text-app-subtle hover:text-red-400"
            title="Delete app"
          ><Trash2 size={10} /></button>
        </div>
      </div>

      {/* Menus */}
      {open && app.navMenus.map((menu) => (
        <MenuItemPanel key={menu.id} menu={menu} appId={app.id} />
      ))}
    </div>
  )
}

// ── SitemapPanel ───────────────────────────────────────────────────────────────

export function SitemapPanel() {
  const dir          = useHub((s) => s.dir)
  const archetypeId  = useHub((s) => s.archetypeId)
  const setArchetype = useHub((s) => s.setArchetype)
  const apps         = useSitemapBuilder((s) => s.apps)
  const addApp       = useSitemapBuilder((s) => s.addApp)
  const loadFromArchetype = useSitemapBuilder((s) => s.loadFromArchetype)
  const exportJSON   = useSitemapBuilder((s) => s.exportJSON)
  const rtl          = dir === 'rtl'

  const [pending, setPending]       = useState<ArchetypeKind>(archetypeId)
  const [showReset, setShowReset]   = useState(false)
  const [appPickerOpen, setAppPickerOpen] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const handleApply = () => { if (pending !== archetypeId) setShowReset(true) }

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
          useSitemapBuilder.setState({ apps: data.apps, services: data.services ?? [] })
        } else {
          alert('Invalid sitemap file.')
        }
      } catch { alert('Could not parse the file.') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const hasPendingChange = pending !== archetypeId
  const totalMenus  = apps.reduce((n, a) => n + a.navMenus.length, 0)
  const totalPages  = apps.reduce((n, a) =>
    a.navMenus.reduce((m, menu) => m + menu.pages.reduce((p, pg) => p + 1 + (pg.subPages?.length ?? 0), 0), n), 0)

  return (
    <>
      {showReset && <ResetDialog onAction={handleResetAction} />}

      <div className="app-scroll flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0">

        {/* ══ STRUCTURE (live, top) ════════════════════════════════════════ */}
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
            Structure
          </span>
          <span className="text-[9px] text-app-subtle">
            {apps.length}a · {totalMenus}m · {totalPages}p
          </span>
        </div>

        {/* App list */}
        <div className="space-y-1 mb-3">
          {apps.length === 0 ? (
            <p className="px-1 py-2 text-[11px] text-app-subtle">
              No apps yet. Add one below or apply an archetype.
            </p>
          ) : (
            apps.map((a) => <AppItemPanel key={a.id} app={a} />)
          )}
        </div>

        {/* Add app button */}
        <div className="relative mb-5">
          <button
            onClick={() => setAppPickerOpen((v) => !v)}
            className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-app-border px-3 py-2 text-[11px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
          >
            <Plus size={11} /> Add App
          </button>
          {appPickerOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl">
              {APP_KIND_OPTIONS.map((o) => {
                const c = APP_KIND_ICONS[o.kind]
                const Icon = c
                return (
                  <button
                    key={o.kind}
                    onClick={() => { addApp(o.kind); setAppPickerOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-app-text hover:bg-app-elevated"
                  >
                    <Icon size={12} className={APP_KIND_COLORS[o.kind]} />
                    {o.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ══ DIVIDER ═══════════════════════════════════════════════════════ */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-app-border/60" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-app-subtle/60">Archetype</span>
          <div className="flex-1 h-px bg-app-border/60" />
        </div>

        {/* ══ ARCHETYPE PICKER (bottom) ═════════════════════════════════════ */}
        <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
          Project template
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

          {/* Description + apply */}
          {(() => {
            const sel  = ARCHETYPES.find((a) => a.id === pending)!
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
      </div>
    </>
  )
}
