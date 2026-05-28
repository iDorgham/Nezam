import type { ArchPage } from '@/types/arch'

/** Root-level applications only (excludes microservices rack). */
export function getTreeRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return getAppRoots(pages)
}

export function getAppRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return Object.values(pages)
    .filter((p) => p.parentId === null && p.type === 'app')
    .sort((a, b) => a.order - b.order)
}

export function getServiceRoots(pages: Record<string, ArchPage>): ArchPage[] {
  return Object.values(pages)
    .filter((p) => p.parentId === null && p.type === 'service')
    .sort((a, b) => a.order - b.order)
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
    .sort((a, b) => a.order - b.order)
}
