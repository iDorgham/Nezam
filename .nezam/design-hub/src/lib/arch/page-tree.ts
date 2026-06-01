import type { ArchPage, MenuPlacement } from '@/types/arch'

const MENU_PLACEMENT_ORDER: Record<MenuPlacement, number> = {
  main: 0,
  footer: 1,
  widget: 2,
}

/** Sort siblings in sitemap tree/canvas: nav menus first (main → footer → widget), then pages. */
export function compareSitemapSiblings(a: ArchPage, b: ArchPage): number {
  if (a.type === 'navmenu' && b.type === 'navmenu') {
    const pa = MENU_PLACEMENT_ORDER[a.menuPlacement ?? 'main']
    const pb = MENU_PLACEMENT_ORDER[b.menuPlacement ?? 'main']
    if (pa !== pb) return pa - pb
    return a.order - b.order
  }
  if (a.type === 'navmenu' && b.type !== 'navmenu') return -1
  if (a.type !== 'navmenu' && b.type === 'navmenu') return 1
  return a.order - b.order
}

/** Root-level applications only (excludes microservices rack). */
export function getTreeRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return getAppRoots(pages)
}

export function getAppRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return Object.values(pages)
    .filter(
      (p) =>
        p.parentId === null && (p.type === 'app' || p.type === 'group'),
    )
    .sort(compareSitemapSiblings)
}

export function getServiceRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return Object.values(pages)
    .filter((p) => p.parentId === null && p.type === 'service')
    .sort(compareSitemapSiblings)
}

export function isSitemapTreeNode(page: ArchPage): boolean {
  return page.type !== 'service'
}

export function matchesArchPageSearch(
  page: ArchPage,
  pages: Record<string, ArchPage>,
  query: string,
): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  if (page.name.toLowerCase().includes(q) || page.route.toLowerCase().includes(q)) {
    return true
  }
  const children = Object.values(pages).filter((p) => p.parentId === page.id)
  return children.some((child) => matchesArchPageSearch(child, pages, query))
}

export function getSortedChildren(
  pageId: string,
  pages: Record<string, ArchPage>,
  searchQuery = '',
): ArchPage[] {
  return Object.values(pages)
    .filter((p) => p.parentId === pageId && isSitemapTreeNode(p))
    .filter((p) => matchesArchPageSearch(p, pages, searchQuery))
    .sort(compareSitemapSiblings)
}
