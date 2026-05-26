/** Architecture section types — pages, routes, menus, sitemap. */

export type ArchPageType = 'page' | 'group' | 'modal' | 'redirect'
export type NavSlot = 'sidebar' | 'topnav' | 'footer' | 'hidden'
export type ArchProfileId =
  // ── Website / Marketing ──
  | 'cms'
  | 'saas'
  | 'blog'
  | 'portfolio'
  | 'landing-page'
  | 'documentation'
  | 'news-media'
  // ── Application ──
  | 'task-manager'
  | 'analytics'
  | 'mobile-app'
  | 'fintech'
  | 'enterprise'
  | 'social-network'
  // ── Commerce ──
  | 'ecommerce'
  | 'marketplace'
  | 'booking'
  // ── AI / Platform ──
  | 'ai-assistant'
  | 'developer-console'
  | 'events-platform'

export interface ArchPage {
  id: string
  name: string
  route: string
  parentId: string | null
  /** Position among siblings (0-based). */
  order: number
  type: ArchPageType
  navSlot: NavSlot
  /** Lucide icon name string (e.g. 'Home', 'FileText'). */
  icon: string
  description: string
}

export interface ArchProfile {
  id: ArchProfileId
  name: string
  description: string
  /** Lucide icon name string. */
  icon: string
  /** Flat list of pages — order + parentId encode the tree. */
  pages: ArchPage[]
}

/** Derived tree node used for rendering. */
export interface ArchTreeNode {
  page: ArchPage
  children: ArchTreeNode[]
  depth: number
}

export const NAV_SLOT_LABELS: Record<NavSlot, string> = {
  sidebar: 'Sidebar',
  topnav: 'Top Nav',
  footer: 'Footer',
  hidden: 'Hidden',
}

export const PAGE_TYPE_LABELS: Record<ArchPageType, string> = {
  page: 'Page',
  group: 'Group',
  modal: 'Modal',
  redirect: 'Redirect',
}

/** Icon name strings — use with <IconRenderer name={...} /> */
export const PAGE_TYPE_ICONS: Record<ArchPageType, string> = {
  page:     'FileText',
  group:    'FolderOpen',
  modal:    'Layers',
  redirect: 'CornerDownRight',
}
