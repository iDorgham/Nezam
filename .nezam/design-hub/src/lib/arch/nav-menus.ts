import type { ArchPage, NavSlot } from '@/types/arch'
import { getSortedChildren } from '@/lib/arch/page-tree'

export type ResolvedNavItem = {
  page: ArchPage
  children: ResolvedNavItem[]
}

function isNavPageType(type: ArchPage['type']): boolean {
  return type === 'page' || type === 'subpage' || type === 'section' || type === 'group'
}

function belongsToMenuSubtree(
  page: ArchPage,
  menuId: string,
  pages: Record<string, ArchPage>,
): boolean {
  let cur: ArchPage | undefined = page
  while (cur) {
    if (cur.id === menuId) return true
    if (!cur.parentId) return false
    cur = pages[cur.parentId]
  }
  return false
}

function matchesNavSlot(page: ArchPage, slot: NavSlot): boolean {
  return page.navSlot === slot
}

/** Walk up from a page to the owning app/group root. */
export function findAppRootForPage(
  page: ArchPage,
  pages: Record<string, ArchPage>,
): ArchPage | null {
  let cur: ArchPage | undefined = page
  while (cur) {
    if (cur.parentId === null && (cur.type === 'app' || cur.type === 'group')) return cur
    if (!cur.parentId) return null
    cur = pages[cur.parentId]
  }
  return null
}

export function findMenuByPlacement(
  appRootId: string,
  pages: Record<string, ArchPage>,
  placement: ArchPage['menuPlacement'],
): ArchPage | null {
  return (
    getSortedChildren(appRootId, pages).find(
      (p) => p.type === 'navmenu' && (p.menuPlacement ?? 'main') === placement,
    ) ?? null
  )
}

export function getMainMenu(
  appRootId: string,
  pages: Record<string, ArchPage>,
): ArchPage | null {
  return findMenuByPlacement(appRootId, pages, 'main')
}

export function getFooterMenu(
  appRootId: string,
  pages: Record<string, ArchPage>,
): ArchPage | null {
  return findMenuByPlacement(appRootId, pages, 'footer')
}

export function getMainMenuForPage(
  currentPage: ArchPage,
  pages: Record<string, ArchPage>,
): ArchPage | null {
  const app = findAppRootForPage(currentPage, pages)
  if (!app) return null
  return getMainMenu(app.id, pages)
}

function collectDescendants(
  rootId: string,
  pages: Record<string, ArchPage>,
): ArchPage[] {
  const out: ArchPage[] = []
  const stack = getSortedChildren(rootId, pages)
  while (stack.length > 0) {
    const node = stack.shift()!
    if (isNavPageType(node.type)) out.push(node)
    stack.push(...getSortedChildren(node.id, pages))
  }
  return out
}

function filterByNavSlot(pages: ArchPage[], slot: NavSlot): ArchPage[] {
  return pages.filter((p) => matchesNavSlot(p, slot))
}

/** Build a tree of nav pages under a menu, filtered by navSlot, preserving parentId hierarchy. */
export function buildMenuNavTree(
  menuId: string,
  pages: Record<string, ArchPage>,
  navSlot: NavSlot,
): ResolvedNavItem[] {
  const all = collectDescendants(menuId, pages).filter((p) =>
    belongsToMenuSubtree(p, menuId, pages),
  )
  const visible = filterByNavSlot(all, navSlot)
  const visibleIds = new Set(visible.map((p) => p.id))

  const roots = visible.filter((p) => {
    if (!p.parentId || p.parentId === menuId) return true
    return !visibleIds.has(p.parentId)
  })

  function toNode(page: ArchPage): ResolvedNavItem {
    const children = visible
      .filter((c) => c.parentId === page.id)
      .sort((a, b) => a.order - b.order)
      .map(toNode)
    return { page, children }
  }

  return roots.sort((a, b) => a.order - b.order).map(toNode)
}

export function getTopNavTreeForPage(
  currentPage: ArchPage,
  pages: Record<string, ArchPage>,
): ResolvedNavItem[] {
  const app = findAppRootForPage(currentPage, pages)
  if (!app) return []
  const main = getMainMenu(app.id, pages)
  if (!main) return []
  return buildMenuNavTree(main.id, pages, 'topnav')
}

export function getSidebarNavTreeForPage(
  currentPage: ArchPage,
  pages: Record<string, ArchPage>,
): ResolvedNavItem[] {
  const app = findAppRootForPage(currentPage, pages)
  if (!app) return []
  const main = getMainMenu(app.id, pages)
  if (!main) return []
  return buildMenuNavTree(main.id, pages, 'sidebar')
}

export function getFooterNavTreeForPage(
  currentPage: ArchPage,
  pages: Record<string, ArchPage>,
): ResolvedNavItem[] {
  const app = findAppRootForPage(currentPage, pages)
  if (!app) return []
  const footer = getFooterMenu(app.id, pages)
  if (!footer) return []
  return buildMenuNavTree(footer.id, pages, 'footer')
}

/** Flat top-level links for header dropdown (direct children of main menu with topnav slot). */
export function getTopNavDropdownItems(
  currentPage: ArchPage,
  pages: Record<string, ArchPage>,
): ArchPage[] {
  const tree = getTopNavTreeForPage(currentPage, pages)
  return tree.map((n) => n.page)
}

export function isNavItemActive(
  item: ArchPage,
  activePage: ArchPage,
  pages: Record<string, ArchPage>,
): boolean {
  if (item.id === activePage.id) return true
  let cur: ArchPage | undefined = activePage
  while (cur?.parentId) {
    if (cur.parentId === item.id) return true
    cur = pages[cur.parentId]
  }
  return false
}
