'use client'

import { useEffect, useState } from 'react'
import { Smartphone, Tablet, Monitor, Sun, Moon, Languages, PanelTopClose, PanelTopOpen } from 'lucide-react'
import { ARCHETYPES } from '@/data/archetypes'
import { useHub } from '@/store/hub.store'
import { Segmented } from '@/components/ui/Segmented'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import type { Device } from '@/types'

/**
 * Horizontal strip between the top chrome and the canvas.
 *
 * Left side  — scrollable tabs for every top-level page in the active archetype.
 * Right side — device viewport selector, theme toggle, RTL/LTR toggle,
 *              and a ↕ button to collapse/expand the entire bar.
 */
export function PageTabsBar() {
  const archetypeId   = useHub((s) => s.archetypeId)
  const activePage    = useHub((s) => s.activePage)
  const dir           = useHub((s) => s.dir)
  const setActivePage = useHub((s) => s.setActivePage)
  const device        = useHub((s) => s.device)
  const setDevice     = useHub((s) => s.setDevice)
  const theme         = useHub((s) => s.theme)
  const toggleTheme   = useHub((s) => s.toggleTheme)
  const toggleDir     = useHub((s) => s.toggleDir)

  const [collapsed, setCollapsed] = useState(false)

  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0]

  // Flatten root-level pages from all apps / main-nav menus for the tab strip
  type PageTab = { id: string; name: string; arabicName: string; appName: string; subCount: number }
  const pages: PageTab[] = archetype.apps.flatMap((app) =>
    app.navMenus.flatMap((menu) =>
      menu.pages.map((p) => ({
        id:        p.id,
        name:      p.name,
        arabicName: p.arabicName,
        appName:   app.name,
        subCount:  p.children?.length ?? 0,
      }))
    )
  )

  // Auto-select first page when archetype changes or on first mount
  useEffect(() => {
    if (pages.length > 0 && (activePage === null || !pages.find((p) => p.id === activePage))) {
      setActivePage(pages[0].id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId])

  // ── Collapsed: thin strip with just the controls ──────────────────────────
  if (collapsed) {
    return (
      <div className="flex h-7 shrink-0 items-center justify-between border-b border-app-border bg-app-surface/80 px-2">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 text-[10px] text-app-subtle hover:text-app-text transition-colors"
          title="Show page tabs"
        >
          <PanelTopOpen size={12} />
          <span>Show tabs</span>
        </button>
        {/* Still show device/theme controls when collapsed */}
        <div className="flex items-center gap-0.5">
          <Segmented<Device>
            value={device}
            onChange={setDevice}
            options={[
              { value: 'mobile',  label: <Smartphone size={11} />, tooltip: 'Mobile · 390px'  },
              { value: 'tablet',  label: <Tablet     size={11} />, tooltip: 'Tablet · 834px'  },
              { value: 'desktop', label: <Monitor    size={11} />, tooltip: 'Desktop · 1280px' },
            ]}
          />
          <div className="mx-1 h-3 w-px bg-app-border" />
          <IconButton label={theme === 'light' ? 'Dark mode' : 'Light mode'} size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
          </IconButton>
          <IconButton label={dir === 'ltr' ? 'RTL' : 'LTR'} size="sm" active={dir === 'rtl'} onClick={toggleDir}>
            <Languages size={12} />
          </IconButton>
        </div>
      </div>
    )
  }

  // ── Expanded: full tabs bar ───────────────────────────────────────────────
  return (
    <div className="flex h-10 shrink-0 items-center border-b border-app-border bg-app-surface">
      {/* ── Page tabs ───────────────────────────────────────── */}
      <div className="app-scroll flex min-w-0 flex-1 items-stretch overflow-x-auto">
        {pages.map((page) => {
          const isActive = page.id === activePage
          const label    = dir === 'rtl' ? page.arabicName : page.name
          return (
            <button
              key={`${page.appName}__${page.id}`}
              onClick={() => setActivePage(page.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-1.5 px-4 text-[12px] font-medium transition-colors duration-100',
                'h-full border-e border-app-border/50 focus-ring',
                isActive
                  ? 'bg-app-bg text-app-text'
                  : 'text-app-subtle hover:bg-app-elevated/50 hover:text-app-muted',
              )}
            >
              <span className="text-[9px] text-app-subtle/60 font-normal">{page.appName}</span>
              <span>/</span>
              {label}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-app-accent" />
              )}
              {/* Sub-page count badge */}
              {page.subCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-app-elevated px-1 text-[9px] font-semibold text-app-muted">
                  {page.subCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Right controls ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-0.5 border-s border-app-border px-2">
        <Segmented<Device>
          value={device}
          onChange={setDevice}
          options={[
            { value: 'mobile',  label: <Smartphone size={13} />, tooltip: 'Mobile · 390px'  },
            { value: 'tablet',  label: <Tablet     size={13} />, tooltip: 'Tablet · 834px'  },
            { value: 'desktop', label: <Monitor    size={13} />, tooltip: 'Desktop · 1280px' },
          ]}
        />

        <div className="mx-1 h-4 w-px bg-app-border" />

        <IconButton
          label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          size="sm"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
        </IconButton>

        <IconButton
          label={dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
          size="sm"
          active={dir === 'rtl'}
          onClick={toggleDir}
        >
          <Languages size={14} />
        </IconButton>

        <div className="mx-1 h-4 w-px bg-app-border" />

        {/* Collapse tabs */}
        <IconButton
          label="Collapse page tabs"
          size="sm"
          onClick={() => setCollapsed(true)}
        >
          <PanelTopClose size={13} />
        </IconButton>
      </div>
    </div>
  )
}
