import type {
  AddableArchType,
  ArchPage,
  ArchPageType,
  AppLayoutKind,
  NavSlot,
} from '@/types/arch'

export function addableToArchType(kind: AddableArchType): ArchPageType {
  switch (kind) {
    case 'application':
      return 'app'
    case 'menu':
      return 'navmenu'
    case 'page':
      return 'page'
    case 'service':
      return 'service'
  }
}

export function validateArchParentChild(
  parent: ArchPage | null,
  childType: ArchPageType,
): { ok: true } | { ok: false; reason: string } {
  if (childType === 'service') {
    if (parent !== null) {
      return { ok: false, reason: 'Services must live in the Micro Services rack (root level).' }
    }
    return { ok: true }
  }

  if (parent === null) {
    if (childType === 'app') return { ok: true }
    return { ok: false, reason: 'Only applications can be added at the root. Use + Add → Application.' }
  }

  switch (parent.type) {
    case 'app':
      if (childType === 'navmenu') return { ok: true }
      return { ok: false, reason: 'Under an application, add a Menu first.' }
    case 'navmenu':
      if (childType === 'page') return { ok: true }
      return { ok: false, reason: 'Under a menu, add a Page.' }
    case 'page':
      if (childType === 'subpage' || childType === 'section') return { ok: true }
      return { ok: false, reason: 'Under a page, add a Sub-page or Section.' }
    case 'subpage':
      if (childType === 'section') return { ok: true }
      return { ok: false, reason: 'Under a sub-page, add a Section only.' }
    default:
      return { ok: false, reason: 'Cannot add children under this node type.' }
  }
}

export function defaultNameForType(type: ArchPageType): string {
  switch (type) {
    case 'app':
      return 'New Application'
    case 'navmenu':
      return 'New Menu'
    case 'page':
      return 'New Page'
    case 'subpage':
      return 'New Sub-page'
    case 'section':
      return 'New Section'
    case 'service':
      return 'New Service'
    default:
      return 'New Node'
  }
}

export function defaultIconForType(type: ArchPageType): string {
  switch (type) {
    case 'app':
      return 'Layers'
    case 'navmenu':
      return 'Menu'
    case 'page':
      return 'FileText'
    case 'subpage':
      return 'CornerDownRight'
    case 'section':
      return 'LayoutGrid'
    case 'service':
      return 'Server'
    default:
      return 'FileText'
  }
}

export function defaultNavSlotForType(type: ArchPageType, parent: ArchPage | null): NavSlot {
  if (type === 'app' || type === 'navmenu' || type === 'service') return 'hidden'
  if (type === 'section') return 'hidden'
  if (parent?.type === 'navmenu') return 'sidebar'
  return 'sidebar'
}

export function defaultRouteForType(type: ArchPageType): string {
  switch (type) {
    case 'app':
      return '/'
    case 'service':
      return '/api/service'
    default:
      return '/new-page'
  }
}

export function createArchPageDefaults(
  id: string,
  type: ArchPageType,
  parentId: string | null,
  order: number,
  parent: ArchPage | null,
): ArchPage {
  const base: ArchPage = {
    id,
    name: defaultNameForType(type),
    route: defaultRouteForType(type),
    parentId,
    order,
    type,
    navSlot: defaultNavSlotForType(type, parent),
    icon: defaultIconForType(type),
    description: '',
    services: [],
    wiredServiceIds: [],
    layout: 'standard',
    layoutWidth: 'boxed',
  }

  if (type === 'app') {
    return {
      ...base,
      domain: '',
      hasAuth: false,
      stackKind: 'fullstack',
      hasAi: false,
      hasBilling: false,
      microservicesEnabled: true,
    }
  }

  if (type === 'navmenu') {
    return {
      ...base,
      menuPlacement: 'main',
      menuHasIcons: true,
      menuPresentation: 'dropdown',
      menuSidebarPresentation: 'tree',
    }
  }

  if (type === 'service') {
    return {
      ...base,
      serviceKind: 'api',
      serviceEndpoint: '',
    }
  }

  return base
}

export function inferChildTypeFromParent(parent: ArchPage | null): ArchPageType {
  if (!parent) return 'app'
  if (parent.type === 'app') return 'navmenu'
  if (parent.type === 'navmenu') return 'page'
  if (parent.type === 'page') return 'subpage'
  if (parent.type === 'subpage') return 'section'
  return 'page'
}

export function layoutKindLabel(layout?: AppLayoutKind): string {
  switch (layout) {
    case 'sidebar':
      return 'Sidebar shell'
    case 'blank':
      return 'Blank canvas'
    case 'tabs':
      return 'Tabbed shell'
    default:
      return 'Standard shell'
  }
}
