/** Architecture section types — pages, routes, menus, sitemap. */

export type ArchPageType =
  | 'app'
  | 'navmenu'
  | 'page'
  | 'subpage'
  | 'section'
  | 'service'
  | 'group'
  | 'modal'
  | 'redirect'

/** Explicit add targets from the Architecture left panel. */
export type AddableArchType = 'application' | 'menu' | 'page' | 'service'

export type NavSlot = 'sidebar' | 'topnav' | 'footer' | 'hidden'
export type ServiceKind = 'api' | 'auth' | 'payment' | 'database'

export type AppStackKind = 'frontend' | 'backend' | 'fullstack'
export type AppLayoutKind = 'standard' | 'sidebar' | 'blank' | 'tabs'
export type MenuPlacement = 'main' | 'footer' | 'widget'
export type MenuPresentation = 'dropdown' | 'mega' | 'tree'
export type MenuSidebarPresentation = 'tree' | 'flat'

export type ArchProfileId =
  | 'cms'
  | 'saas'
  | 'blog'
  | 'portfolio'
  | 'landing-page'
  | 'documentation'
  | 'news-media'
  | 'task-manager'
  | 'analytics'
  | 'mobile-app'
  | 'fintech'
  | 'enterprise'
  | 'social-network'
  | 'ecommerce'
  | 'marketplace'
  | 'booking'
  | 'ai-assistant'
  | 'developer-console'
  | 'events-platform'

export interface ArchPage {
  id: string
  name: string
  route: string
  parentId: string | null
  order: number
  type: ArchPageType
  navSlot: NavSlot
  icon: string
  description: string
  /** @deprecated Legacy kind-based wires — migrated to wiredServiceIds. */
  services?: ServiceKind[]
  /** Catalog provider id when type === 'service'. */
  serviceProviderId?: string
  /** Rack instance ids wired to this page (non-service pages). */
  wiredServiceIds?: string[]
  layout?: AppLayoutKind
  layoutWidth?: 'boxed' | 'fullwidth'
  /** Application-only */
  domain?: string
  hasAuth?: boolean
  stackKind?: AppStackKind
  hasAi?: boolean
  hasBilling?: boolean
  microservicesEnabled?: boolean
  /** Menu-only */
  menuPlacement?: MenuPlacement
  menuHasIcons?: boolean
  /** Header / top bar when menuPlacement is main */
  menuPresentation?: MenuPresentation
  /** Sidebar shell when menuPlacement is main (defaults to tree) */
  menuSidebarPresentation?: MenuSidebarPresentation
  /** Service-only (root rack) */
  serviceKind?: ServiceKind
  serviceEndpoint?: string
}

export interface ArchProfile {
  id: ArchProfileId
  name: string
  description: string
  icon: string
  pages: ArchPage[]
}

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
  app: 'Application',
  navmenu: 'Menu',
  page: 'Page',
  subpage: 'Sub-page',
  section: 'Section',
  service: 'Service',
  group: 'Group (Legacy)',
  modal: 'Modal',
  redirect: 'Redirect',
}

export const PAGE_TYPE_ICONS: Record<ArchPageType, string> = {
  app: 'Layers',
  navmenu: 'Menu',
  page: 'FileText',
  subpage: 'CornerDownRight',
  section: 'LayoutGrid',
  service: 'Server',
  group: 'FolderOpen',
  modal: 'Layers',
  redirect: 'CornerDownRight',
}

export const ADDABLE_TYPE_LABELS: Record<AddableArchType, string> = {
  application: 'Application',
  menu: 'Menu',
  page: 'Page',
  service: 'Service',
}
