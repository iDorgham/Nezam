'use client'

import { useEffect } from 'react'
import { Smartphone, Tablet, Monitor, Sun, Moon, Languages } from 'lucide-react'
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
 * Right side — device viewport selector, theme toggle, RTL/LTR toggle.
 *
 * The active page is synced to hub.store so that double-clicking a page node in
 * the sitemap canvas (`setActivePage`) is reflected here and vice-versa.
 */
export function PageTabsBar() {
  const archetypeId = useHub((s) => s.archetypeId)
  const activePage  = useHub((s) => s.activePage)
  const dir         = useHub((s) => s.dir)
  const setActivePage  = useHub((s) => s.setActivePage)
  const device      = useHub((s) => s.device)
  const setDevice   = useHub((s) => s.setDevice)
  const theme       = useHub((s) => s.theme)
  const toggleTheme = useHub((s) => s.toggleTheme)
  const toggleDir   = useHub((s) => s.toggleDir)

  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0]
  // Flat list of all top-level pages for the tab strip
  const pages = archetype.pages

  // Auto-select first page when archetype changes or on first mount
  useEffect(() => {
    if (pages.length > 0 && (activePage === null || !pages.find((p) => p.id === activePage))) {
      setActivePage(pages[0].id)
    }
  }, [archetypeId, pages, activePage, setActivePage])

  return (
    <div className="flex h-10 shrink-0 items-center border-b border-app-border bg-app-surface">
      {/* ── Page tabs ─────────────────────────────────────── */}
      <div className="app-scroll flex min-w-0 flex-1 items-stretch overflow-x-auto">
        {pages.map((page) => {
          const isActive = page.id === activePage
          const label = dir === 'rtl' ? page.arabicName : page.name
          return (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-1.5 px-4 text-[12px] font-medium transition-colors duration-100',
                'h-full border-e border-app-border/50 focus-ring',
                isActive
                  ? 'bg-app-bg text-app-text'
                  : 'text-app-subtle hover:bg-app-elevated/50 hover:text-app-muted',
              )}
            >
              {label}
              {/* Active indicator — bottom border */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-app-accent" />
              )}
              {/* Unread child-count badge */}
              {page.children && page.children.length > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-app-elevated px-1 text-[9px] font-semibold text-app-muted">
                  {page.children.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Right controls ───────────────────────────────── */}
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
      </div>
    </div>
  )
}
