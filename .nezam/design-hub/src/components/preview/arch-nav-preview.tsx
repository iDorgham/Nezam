'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { IconRenderer } from '@/lib/icons'
import {
  findAppRootForPage,
  getFooterNavTreeForPage,
  getMainMenuForPage,
  getSidebarNavTreeForPage,
  getTopNavTreeForPage,
  isNavItemActive,
  type ResolvedNavItem,
} from '@/lib/arch/nav-menus'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'

function isClickableNavPage(page: ArchPage): boolean {
  return page.type === 'page' || page.type === 'subpage'
}

function flattenSidebarPages(nodes: ResolvedNavItem[]): ArchPage[] {
  const out: ArchPage[] = []
  const walk = (list: ResolvedNavItem[]) => {
    for (const n of list) {
      if (isClickableNavPage(n.page)) out.push(n.page)
      walk(n.children)
    }
  }
  walk(nodes)
  return out
}

function NavIcon({
  page,
  showIcons,
  active,
  size = 16,
}: {
  page: ArchPage
  showIcons: boolean
  active?: boolean
  size?: number
}) {
  if (!showIcons || !page.icon) return null
  return (
    <IconRenderer
      name={page.icon}
      size={size}
      className={cn('shrink-0', active ? 'text-[var(--brand)]' : 'text-app-subtle')}
      aria-hidden
    />
  )
}

function TopNavDropdownPanel({
  item,
  mega,
  activePage,
  pages,
  showIcons,
}: {
  item: ResolvedNavItem
  mega: boolean
  activePage: ArchPage
  pages: Record<string, ArchPage>
  showIcons: boolean
}) {
  const links = item.children.filter((c) => isClickableNavPage(c.page))
  if (links.length === 0) return null

  return (
    <div
      className={cn(
        'absolute left-0 top-full z-20 mt-1 min-w-[12rem] rounded-app-sm border border-app-border bg-app-elevated p-2 shadow-lg',
        mega && 'min-w-[18rem]',
      )}
      role="menu"
    >
      <div className={cn(mega ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-0.5')}>
        {links.map((child) => {
          const active = isNavItemActive(child.page, activePage, pages)
          return (
            <button
              key={child.page.id}
              type="button"
              role="menuitem"
              className={cn(
                'flex w-full items-center gap-2 rounded-app-sm px-2.5 py-2 text-left text-xs transition',
                active
                  ? 'bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] font-semibold text-app-text'
                  : 'text-app-muted hover:bg-app-surface hover:text-app-text',
              )}
            >
              <NavIcon page={child.page} showIcons={showIcons} active={active} size={14} />
              <span>{child.page.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ArchNavTopBar({
  page,
  pages,
}: {
  page: ArchPage
  pages: Record<string, ArchPage>
}) {
  const app = findAppRootForPage(page, pages)
  const mainMenu = getMainMenuForPage(page, pages)
  const topTree = getTopNavTreeForPage(page, pages)
  const presentation = mainMenu?.menuPresentation ?? 'dropdown'
  const mega = presentation === 'mega'
  const showIcons = mainMenu?.menuHasIcons ?? true
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-10 w-full border-b border-app-border bg-app-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div
            className="h-6 w-6 shrink-0 rounded border border-[color-mix(in_srgb,var(--brand)_55%,transparent)]"
            style={{ backgroundColor: 'var(--brand)' }}
            aria-hidden
          />
          <span className="text-sm tracking-tight">{app?.name ?? 'YourApp'}</span>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {topTree.map((item) => {
            const hasFlyout = item.children.some((c) => isClickableNavPage(c.page))
            const active = isNavItemActive(item.page, page, pages)
            const open = openId === item.page.id

            if (hasFlyout) {
              return (
                <div
                  key={item.page.id}
                  className="relative"
                  onMouseEnter={() => setOpenId(item.page.id)}
                  onMouseLeave={() => setOpenId((id) => (id === item.page.id ? null : id))}
                >
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-app-sm px-2.5 py-1.5 text-xs transition',
                      active
                        ? 'font-semibold text-app-text'
                        : 'text-app-muted hover:text-app-text',
                    )}
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : item.page.id)}
                  >
                    <NavIcon page={item.page} showIcons={showIcons} active={active} size={14} />
                    <span>{item.page.name}</span>
                    <ChevronDown
                      size={14}
                      className={cn('opacity-60 transition', open && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                  {open ? (
                    <TopNavDropdownPanel
                      item={item}
                      mega={mega}
                      activePage={page}
                      pages={pages}
                      showIcons={showIcons}
                    />
                  ) : null}
                </div>
              )
            }

            return (
              <button
                key={item.page.id}
                type="button"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-app-sm px-2.5 py-1.5 text-xs transition',
                  active
                    ? 'font-semibold text-app-text'
                    : 'text-app-muted hover:text-app-text',
                )}
              >
                <NavIcon page={item.page} showIcons={showIcons} active={active} size={14} />
                <span>{item.page.name}</span>
              </button>
            )
          })}
        </nav>
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </div>
    </header>
  )
}

function SidebarTreeItem({
  node,
  depth,
  activePage,
  pages,
  showIcons,
  presentation,
}: {
  node: ResolvedNavItem
  depth: number
  activePage: ArchPage
  pages: Record<string, ArchPage>
  showIcons: boolean
  presentation: 'tree' | 'flat'
}) {
  const [expanded, setExpanded] = useState(true)
  const active = isNavItemActive(node.page, activePage, pages)
  const isGroup = node.page.type === 'group' || node.page.type === 'section'
  const hasChildren = node.children.length > 0
  const pad = { paddingLeft: `${8 + depth * 12}px` }

  if (presentation === 'flat' && !isClickableNavPage(node.page)) {
    return (
      <>
        {node.children.map((child) => (
          <SidebarTreeItem
            key={child.page.id}
            node={child}
            depth={depth}
            activePage={activePage}
            pages={pages}
            showIcons={showIcons}
            presentation={presentation}
          />
        ))}
      </>
    )
  }

  if (isGroup && hasChildren && presentation === 'tree') {
    return (
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          style={pad}
          className="flex w-full items-center gap-2 rounded-app-sm px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-app-subtle hover:text-app-text"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <ChevronRight
            size={12}
            className={cn('shrink-0 transition', expanded && 'rotate-90')}
            aria-hidden
          />
          <NavIcon page={node.page} showIcons={showIcons} size={14} />
          <span className="truncate">{node.page.name}</span>
        </button>
        {expanded
          ? node.children.map((child) => (
              <SidebarTreeItem
                key={child.page.id}
                node={child}
                depth={depth + 1}
                activePage={activePage}
                pages={pages}
                showIcons={showIcons}
                presentation={presentation}
              />
            ))
          : null}
      </div>
    )
  }

  if (isClickableNavPage(node.page)) {
    return (
      <button
        type="button"
        style={pad}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-app-sm px-3 py-2.5 text-left text-xs transition block-hover-lift',
          active
            ? 'border border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] font-semibold text-app-text shadow-sm'
            : 'border border-transparent text-app-muted hover:border-app-border hover:bg-app-surface hover:text-app-text',
        )}
      >
        <NavIcon page={node.page} showIcons={showIcons} active={active} />
        <span className="truncate">{node.page.name}</span>
      </button>
    )
  }

  return (
    <>
      {node.children.map((child) => (
        <SidebarTreeItem
          key={child.page.id}
          node={child}
          depth={depth + (presentation === 'tree' ? 1 : 0)}
          activePage={activePage}
          pages={pages}
          showIcons={showIcons}
          presentation={presentation}
        />
      ))}
    </>
  )
}

export function ArchNavSidebar({
  page,
  pages,
}: {
  page: ArchPage
  pages: Record<string, ArchPage>
}) {
  const app = findAppRootForPage(page, pages)
  const mainMenu = getMainMenuForPage(page, pages)
  const sidebarTree = getSidebarNavTreeForPage(page, pages)
  const presentation = mainMenu?.menuSidebarPresentation ?? 'tree'
  const showIcons = mainMenu?.menuHasIcons ?? true

  const flatItems =
    presentation === 'flat' ? flattenSidebarPages(sidebarTree) : []

  return (
    <aside className="flex h-full flex-col border-r border-app-border bg-app-elevated p-4">
      <div className="mb-8 flex items-center gap-3">
        <div
          className="h-8 w-8 shrink-0 rounded-app-sm border border-[color-mix(in_srgb,var(--brand)_55%,transparent)] shadow-sm"
          style={{ backgroundColor: 'var(--brand)' }}
          aria-hidden
        />
        <span className="text-sm font-semibold tracking-tight">{app?.name ?? 'Workspace'}</span>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto app-scroll" aria-label="Sidebar">
        {presentation === 'flat'
          ? flatItems.map((item) => {
              const active = isNavItemActive(item, page, pages)
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-app-sm px-3 py-2.5 text-left text-xs transition block-hover-lift',
                    active
                      ? 'border border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] font-semibold text-app-text shadow-sm'
                      : 'border border-transparent text-app-muted hover:border-app-border hover:bg-app-surface hover:text-app-text',
                  )}
                >
                  <NavIcon page={item} showIcons={showIcons} active={active} />
                  <span className="truncate">{item.name}</span>
                </button>
              )
            })
          : sidebarTree.map((node) => (
              <SidebarTreeItem
                key={node.page.id}
                node={node}
                depth={0}
                activePage={page}
                pages={pages}
                showIcons={showIcons}
                presentation="tree"
              />
            ))}
      </nav>
    </aside>
  )
}

export function ArchNavFooter({
  page,
  pages,
}: {
  page: ArchPage
  pages: Record<string, ArchPage>
}) {
  const footerTree = getFooterNavTreeForPage(page, pages)
  const app = findAppRootForPage(page, pages)

  if (footerTree.length === 0) {
    return (
      <footer className="w-full border-t border-app-border bg-app-elevated">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {['Product', 'Company', 'Resources', 'Legal'].map((c) => (
            <div key={c}>
              <div className="mb-2 text-[11px] font-semibold">{c}</div>
              <div className="space-y-1 text-[11px] text-app-muted">
                <div>Overview</div>
                <div>Pricing</div>
                <div>Contact</div>
              </div>
            </div>
          ))}
        </div>
      </footer>
    )
  }

  return (
    <footer className="w-full border-t border-app-border bg-app-elevated">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center gap-2 font-semibold">
          <div
            className="h-5 w-5 shrink-0 rounded border border-[color-mix(in_srgb,var(--brand)_55%,transparent)]"
            style={{ backgroundColor: 'var(--brand)' }}
            aria-hidden
          />
          <span className="text-sm">{app?.name ?? 'YourApp'}</span>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {footerTree.map((col) => {
            const links = [
              ...(isClickableNavPage(col.page) ? [col.page] : []),
              ...col.children.filter((c) => isClickableNavPage(c.page)).map((c) => c.page),
            ]
            return (
              <div key={col.page.id}>
                <div className="mb-2 text-[11px] font-semibold">{col.page.name}</div>
                <div className="space-y-1 text-[11px] text-app-muted">
                  {links.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      className={cn(
                        'block text-left transition hover:text-app-text',
                        isNavItemActive(link, page, pages) && 'font-medium text-app-text',
                      )}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

export function archNavSignature(
  page: ArchPage,
  pages: Record<string, ArchPage>,
): string {
  const main = getMainMenuForPage(page, pages)
  const top = getTopNavTreeForPage(page, pages)
    .map((n) => n.page.id)
    .join(',')
  const side = getSidebarNavTreeForPage(page, pages)
    .map((n) => n.page.id)
    .join(',')
  const foot = getFooterNavTreeForPage(page, pages)
    .map((n) => n.page.id)
    .join(',')
  return `${top}|${side}|${foot}|${main?.menuPresentation}|${main?.menuSidebarPresentation}|${main?.menuHasIcons}`
}
