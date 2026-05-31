import type { ArchPage, MenuPlacement } from '@/types/arch'

const LEGACY_MAIN_NAMES = new Set(['top navigation', 'sidebar navigation'])
const LEGACY_MAIN_ROUTES = new Set([
  '/topnav-menu',
  '/top-nav',
  '/topnav',
  '/sidebar-menu',
  '/sidebar-nav',
])

function isAppRoot(page: ArchPage): boolean {
  return page.parentId === null && (page.type === 'app' || page.type === 'group')
}

function isCanonicalMainMenu(page: ArchPage): boolean {
  return (
    page.type === 'navmenu' &&
    page.name === 'Main Navigation' &&
    (page.menuPlacement ?? 'main') === 'main'
  )
}

/** Legacy split top/sidebar menu nodes under an application. */
export function isLegacyMainNavMenu(page: ArchPage): boolean {
  if (page.type !== 'navmenu') return false
  if (isCanonicalMainMenu(page)) return false
  if (page.menuPlacement === 'footer' || page.menuPlacement === 'widget') {
    return false
  }
  const name = page.name.trim().toLowerCase()
  const route = page.route.trim().toLowerCase()
  return LEGACY_MAIN_NAMES.has(name) || LEGACY_MAIN_ROUTES.has(route)
}

function normalizeMainMenu(page: ArchPage): ArchPage {
  return {
    ...page,
    type: 'navmenu',
    name: 'Main Navigation',
    route: '/main-nav',
    navSlot: 'hidden',
    menuPlacement: 'main',
    menuHasIcons: page.menuHasIcons ?? true,
    menuPresentation: page.menuPresentation ?? 'dropdown',
    menuSidebarPresentation: page.menuSidebarPresentation ?? 'tree',
  }
}

function reparentChildren(
  pages: Record<string, ArchPage>,
  fromId: string,
  toId: string,
): boolean {
  let changed = false
  for (const pg of Object.values(pages)) {
    if (pg.parentId === fromId) {
      pages[pg.id] = { ...pg, parentId: toId }
      changed = true
    }
  }
  return changed
}

/**
 * Merge persisted "Top Navigation" + "Sidebar Navigation" navmenu nodes into a single
 * Main Navigation per application. Returns true if any page record changed.
 */
export function migrateLegacyNavMenus(pages: Record<string, ArchPage>): boolean {
  let changed = false
  const appRoots = Object.values(pages).filter(isAppRoot)

  for (const app of appRoots) {
    const children = Object.values(pages).filter((p) => p.parentId === app.id)
    const legacyMenus = children.filter(isLegacyMainNavMenu)
    let mainMenu =
      children.find(isCanonicalMainMenu) ??
      legacyMenus[0] ??
      children.find(
        (p) => p.type === 'navmenu' && (p.menuPlacement ?? 'main') === 'main',
      )

    if (!mainMenu && legacyMenus.length === 0) continue

    if (!mainMenu && legacyMenus.length > 0) {
      mainMenu = legacyMenus[0]
    }
    if (!mainMenu) continue

    const normalized = normalizeMainMenu(mainMenu)
    if (
      normalized.name !== mainMenu.name ||
      normalized.route !== mainMenu.route ||
      normalized.menuPlacement !== mainMenu.menuPlacement
    ) {
      pages[mainMenu.id] = normalized
      mainMenu = pages[mainMenu.id]
      changed = true
    }

    const mergeSources = [
      ...legacyMenus.filter((m) => m.id !== mainMenu!.id),
      ...children.filter(
        (p) =>
          p.type === 'navmenu' &&
          p.id !== mainMenu!.id &&
          (p.menuPlacement ?? 'main') === 'main' &&
          !isCanonicalMainMenu(p) &&
          !isLegacyMainNavMenu(p),
      ),
    ]

    for (const legacy of mergeSources) {
      if (reparentChildren(pages, legacy.id, mainMenu.id)) changed = true
      if (pages[legacy.id]) {
        delete pages[legacy.id]
        changed = true
      }
    }
  }

  return changed
}

export function menuPlacementLabel(placement: MenuPlacement | undefined): string {
  if (placement === 'footer') return 'Footer Nav'
  if (placement === 'widget') return 'Widget Nav'
  return 'Main Nav'
}
