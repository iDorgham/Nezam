'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import type {
  AppKind, ArchetypeApp, ArchetypeNavMenu,
  NavMenuKind, PageStatus, ServiceKind,
  SitemapBuilderApp, SitemapBuilderNavMenu,
  SitemapBuilderPage, SitemapBuilderSection,
  SitemapBuilderService, SitemapNode,
} from '@/types'

const uid = () => Math.random().toString(36).slice(2, 9)

// ── Factory helpers ────────────────────────────────────────────────────────────

function makeSection(name = 'New Section'): SitemapBuilderSection {
  return { id: uid(), name, description: '', notes: '' }
}

function makeService(kind: ServiceKind = 'custom'): SitemapBuilderService {
  return { id: uid(), name: 'New Service', kind, description: '', notes: '', connectedPageIds: [] }
}

function makePage(name = 'New Page'): SitemapBuilderPage {
  return { id: uid(), name, sections: [], collapsed: false }
}

function makeNavMenu(name = 'New Menu', kind: NavMenuKind = 'custom'): SitemapBuilderNavMenu {
  return { id: uid(), name, kind, pages: [], collapsed: false }
}

function makeApp(name = 'New App', kind: AppKind = 'custom'): SitemapBuilderApp {
  return { id: uid(), name, kind, navMenus: [], collapsed: false }
}

// ── Archetype → builder converters ────────────────────────────────────────────

function nodeToPage(node: SitemapNode): SitemapBuilderPage {
  return {
    id: uid(),
    name: node.name,
    sections: (node.sectionNames ?? []).map((n) => makeSection(n)),
    collapsed: false,
    subPages: node.children?.map(nodeToPage),
  }
}

function archetypeMenuToMenu(m: ArchetypeNavMenu): SitemapBuilderNavMenu {
  return { id: uid(), name: m.name, kind: m.kind, pages: m.pages.map(nodeToPage), collapsed: false }
}

function archetypeAppToApp(a: ArchetypeApp): SitemapBuilderApp {
  return { id: uid(), name: a.name, kind: a.kind, navMenus: a.navMenus.map(archetypeMenuToMenu), collapsed: false }
}

// ── Tree helpers ───────────────────────────────────────────────────────────────

/** Map a specific app. */
function mapApp(
  apps: SitemapBuilderApp[], appId: string,
  fn: (a: SitemapBuilderApp) => SitemapBuilderApp,
): SitemapBuilderApp[] {
  return apps.map((a) => a.id === appId ? fn(a) : a)
}

/** Map a specific navMenu inside a specific app. */
function mapMenu(
  apps: SitemapBuilderApp[], appId: string, menuId: string,
  fn: (m: SitemapBuilderNavMenu) => SitemapBuilderNavMenu,
): SitemapBuilderApp[] {
  return mapApp(apps, appId, (a) => ({
    ...a,
    navMenus: a.navMenus.map((m) => m.id === menuId ? fn(m) : m),
  }))
}

/** Recursively map a page by id anywhere in a page array (including subPages). */
function mapPageInList(
  pages: SitemapBuilderPage[], pageId: string,
  fn: (p: SitemapBuilderPage) => SitemapBuilderPage,
): SitemapBuilderPage[] {
  return pages.map((p) => {
    if (p.id === pageId) return fn(p)
    if (p.subPages) return { ...p, subPages: mapPageInList(p.subPages, pageId, fn) }
    return p
  })
}

/** Apply mapPageInList across ALL apps → menus. */
function mapPageGlobal(
  apps: SitemapBuilderApp[], pageId: string,
  fn: (p: SitemapBuilderPage) => SitemapBuilderPage,
): SitemapBuilderApp[] {
  return apps.map((a) => ({
    ...a,
    navMenus: a.navMenus.map((m) => ({
      ...m,
      pages: mapPageInList(m.pages, pageId, fn),
    })),
  }))
}

/** Find a page by id anywhere in the tree. */
function findPageInList(pages: SitemapBuilderPage[], pageId: string): SitemapBuilderPage | null {
  for (const p of pages) {
    if (p.id === pageId) return p
    if (p.subPages) { const f = findPageInList(p.subPages, pageId); if (f) return f }
  }
  return null
}

function findPageGlobal(apps: SitemapBuilderApp[], pageId: string): SitemapBuilderPage | null {
  for (const a of apps) {
    for (const m of a.navMenus) {
      const f = findPageInList(m.pages, pageId); if (f) return f
    }
  }
  return null
}

/** Insert a new subPage under parentPageId. */
function insertSubPage(
  pages: SitemapBuilderPage[], parentId: string, newPage: SitemapBuilderPage,
): SitemapBuilderPage[] {
  return pages.map((p) => {
    if (p.id === parentId) return { ...p, collapsed: false, subPages: [...(p.subPages ?? []), newPage] }
    if (p.subPages) return { ...p, subPages: insertSubPage(p.subPages, parentId, newPage) }
    return p
  })
}

/** Remove a page (and its whole sub-tree) by id. */
function removePageFromList(
  pages: SitemapBuilderPage[], pageId: string,
): [SitemapBuilderPage[], SitemapBuilderPage | null] {
  let removed: SitemapBuilderPage | null = null
  const next = pages
    .filter((p) => { if (p.id === pageId) { removed = p; return false } return true })
    .map((p) => {
      if (!p.subPages) return p
      const [ns, found] = removePageFromList(p.subPages, pageId)
      if (found) removed = found
      return { ...p, subPages: ns }
    })
  return [next, removed]
}

// ── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_APPS: SitemapBuilderApp[] = [
  {
    id: uid(), name: 'Marketing', kind: 'marketing', collapsed: false,
    navMenus: [
      {
        id: uid(), name: 'Main Navigation', kind: 'main', collapsed: false,
        pages: [
          {
            id: uid(), name: 'Home', collapsed: false,
            sections: [
              { id: uid(), name: 'Hero', description: 'Primary value proposition' },
              { id: uid(), name: 'Features', description: 'Key product capabilities' },
              { id: uid(), name: 'CTA', description: 'Primary call to action' },
            ],
          },
        ],
      },
    ],
  },
]

// ── Store interface ────────────────────────────────────────────────────────────

interface SitemapBuilderStore {
  apps: SitemapBuilderApp[]
  services: SitemapBuilderService[]

  /* App -------------------------------------------------------------------- */
  addApp: (kind?: AppKind) => void
  deleteApp: (appId: string) => void
  renameApp: (appId: string, name: string) => void
  toggleAppCollapsed: (appId: string) => void
  updateAppNotes: (appId: string, notes: string) => void

  /* NavMenu ---------------------------------------------------------------- */
  addNavMenu: (appId: string, kind?: NavMenuKind) => void
  deleteNavMenu: (appId: string, menuId: string) => void
  renameNavMenu: (appId: string, menuId: string, name: string) => void
  toggleMenuCollapsed: (appId: string, menuId: string) => void
  reorderNavMenus: (appId: string, fromIdx: number, toIdx: number) => void
  updateMenuNotes: (appId: string, menuId: string, notes: string) => void

  /* Page (globally scoped by pageId) --------------------------------------- */
  addPage: (appId: string, menuId: string) => void
  deletePage: (pageId: string) => boolean   // false if has sections or subPages
  renamePage: (pageId: string, name: string) => void
  togglePageCollapsed: (pageId: string) => void
  addSubPage: (parentPageId: string) => void
  setPageStatus: (pageId: string, status: PageStatus | undefined) => void
  setPageUrl: (pageId: string, url: string) => void
  updatePageNotes: (pageId: string, notes: string) => void
  reorderPages: (appId: string, menuId: string, fromIdx: number, toIdx: number) => void

  /* Section (scoped by pageId) --------------------------------------------- */
  addSection: (pageId: string) => void
  deleteSection: (pageId: string, sectionId: string) => void
  renameSection: (pageId: string, sectionId: string, name: string) => void
  updateDescription: (pageId: string, sectionId: string, desc: string) => void
  updateSectionNotes: (pageId: string, sectionId: string, notes: string) => void
  reorderSections: (pageId: string, fromIdx: number, toIdx: number) => void
  moveSectionToPage: (sectionId: string, fromPageId: string, toPageId: string, atIdx: number) => void

  /* Services --------------------------------------------------------------- */
  addService: (kind?: ServiceKind) => void
  deleteService: (serviceId: string) => void
  updateService: (serviceId: string, patch: Partial<Omit<SitemapBuilderService, 'id'>>) => void
  toggleServiceConnection: (serviceId: string, pageId: string) => void

  /* Archetype -------------------------------------------------------------- */
  loadFromArchetype: (apps: ArchetypeApp[]) => void

  /* Export ----------------------------------------------------------------- */
  exportJSON: () => string
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSitemapBuilder = create<SitemapBuilderStore>()(
  persist(
    (set, get) => ({
      apps: INITIAL_APPS,
      services: [],

      /* ── App ────────────────────────────────────────────────────────────── */

      addApp: (kind = 'custom') =>
        set((s) => ({ apps: [...s.apps, makeApp('New App', kind)] })),

      deleteApp: (appId) =>
        set((s) => ({ apps: s.apps.filter((a) => a.id !== appId) })),

      renameApp: (appId, name) =>
        set((s) => ({ apps: mapApp(s.apps, appId, (a) => ({ ...a, name })) })),

      toggleAppCollapsed: (appId) =>
        set((s) => ({ apps: mapApp(s.apps, appId, (a) => ({ ...a, collapsed: !a.collapsed })) })),

      updateAppNotes: (appId, notes) =>
        set((s) => ({ apps: mapApp(s.apps, appId, (a) => ({ ...a, notes })) })),

      /* ── NavMenu ────────────────────────────────────────────────────────── */

      addNavMenu: (appId, kind = 'custom') =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a, navMenus: [...a.navMenus, makeNavMenu('New Menu', kind)],
          })),
        })),

      deleteNavMenu: (appId, menuId) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a, navMenus: a.navMenus.filter((m) => m.id !== menuId),
          })),
        })),

      renameNavMenu: (appId, menuId, name) =>
        set((s) => ({ apps: mapMenu(s.apps, appId, menuId, (m) => ({ ...m, name })) })),

      toggleMenuCollapsed: (appId, menuId) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({ ...m, collapsed: !m.collapsed })),
        })),

      reorderNavMenus: (appId, fromIdx, toIdx) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a, navMenus: arrayMove(a.navMenus, fromIdx, toIdx),
          })),
        })),

      updateMenuNotes: (appId, menuId, notes) =>
        set((s) => ({ apps: mapMenu(s.apps, appId, menuId, (m) => ({ ...m, notes })) })),

      /* ── Page ───────────────────────────────────────────────────────────── */

      addPage: (appId, menuId) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({
            ...m, pages: [...m.pages, makePage()],
          })),
        })),

      deletePage: (pageId) => {
        const page = findPageGlobal(get().apps, pageId)
        if (!page) return false
        if (page.sections.length > 0 || (page.subPages?.length ?? 0) > 0) return false
        set((s) => ({
          apps: s.apps.map((a) => ({
            ...a,
            navMenus: a.navMenus.map((m) => {
              const [next] = removePageFromList(m.pages, pageId)
              return { ...m, pages: next }
            }),
          })),
        }))
        return true
      },

      renamePage: (pageId, name) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, name })) })),

      togglePageCollapsed: (pageId) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, collapsed: !p.collapsed })),
        })),

      addSubPage: (parentPageId) => {
        const newPage = makePage()
        set((s) => ({
          apps: s.apps.map((a) => ({
            ...a,
            navMenus: a.navMenus.map((m) => ({
              ...m,
              pages: insertSubPage(m.pages, parentPageId, newPage),
            })),
          })),
        }))
      },

      setPageStatus: (pageId, status) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, status })) })),

      setPageUrl: (pageId, url) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, url })) })),

      updatePageNotes: (pageId, notes) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, notes })) })),

      reorderPages: (appId, menuId, fromIdx, toIdx) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({
            ...m, pages: arrayMove(m.pages, fromIdx, toIdx),
          })),
        })),

      /* ── Section ────────────────────────────────────────────────────────── */

      addSection: (pageId) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p, collapsed: false, sections: [...p.sections, makeSection()],
          })),
        })),

      deleteSection: (pageId, sectionId) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p, sections: p.sections.filter((sec) => sec.id !== sectionId),
          })),
        })),

      renameSection: (pageId, sectionId, name) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p,
            sections: p.sections.map((sec) => sec.id === sectionId ? { ...sec, name } : sec),
          })),
        })),

      updateDescription: (pageId, sectionId, description) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p,
            sections: p.sections.map((sec) => sec.id === sectionId ? { ...sec, description } : sec),
          })),
        })),

      updateSectionNotes: (pageId, sectionId, notes) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p,
            sections: p.sections.map((sec) => sec.id === sectionId ? { ...sec, notes } : sec),
          })),
        })),

      reorderSections: (pageId, fromIdx, toIdx) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p, sections: arrayMove(p.sections, fromIdx, toIdx),
          })),
        })),

      moveSectionToPage: (sectionId, fromPageId, toPageId, atIdx) => {
        const fromPage = findPageGlobal(get().apps, fromPageId)
        const section = fromPage?.sections.find((s) => s.id === sectionId)
        if (!section) return
        set((s) => ({
          apps: s.apps.map((a) => ({
            ...a,
            navMenus: a.navMenus.map((m) => ({
              ...m,
              pages: mapPageInList(mapPageInList(m.pages, fromPageId, (p) => ({
                ...p, sections: p.sections.filter((sec) => sec.id !== sectionId),
              })), toPageId, (p) => {
                const next = [...p.sections]
                next.splice(Math.min(atIdx, next.length), 0, section)
                return { ...p, sections: next }
              }),
            })),
          })),
        }))
      },

      /* ── Services ──────────────────────────────────────────────────────── */

      addService: (kind = 'custom') =>
        set((s) => ({ services: [...s.services, makeService(kind)] })),

      deleteService: (serviceId) =>
        set((s) => ({ services: s.services.filter((sv) => sv.id !== serviceId) })),

      updateService: (serviceId, patch) =>
        set((s) => ({
          services: s.services.map((sv) => sv.id === serviceId ? { ...sv, ...patch } : sv),
        })),

      toggleServiceConnection: (serviceId, pageId) =>
        set((s) => ({
          services: s.services.map((sv) => {
            if (sv.id !== serviceId) return sv
            const has = sv.connectedPageIds.includes(pageId)
            return {
              ...sv,
              connectedPageIds: has
                ? sv.connectedPageIds.filter((id) => id !== pageId)
                : [...sv.connectedPageIds, pageId],
            }
          }),
        })),

      /* ── Archetype ──────────────────────────────────────────────────────── */

      loadFromArchetype: (apps) =>
        set({ apps: apps.map(archetypeAppToApp), services: [] }),

      /* ── Export ─────────────────────────────────────────────────────────── */

      exportJSON: () => {
        function serializePage(p: SitemapBuilderPage): object {
          return {
            id: p.id, name: p.name, url: p.url,
            status: p.status, notes: p.notes,
            sections: p.sections.map((s) => ({ id: s.id, name: s.name, description: s.description, notes: s.notes })),
            subPages: p.subPages?.map(serializePage),
          }
        }
        const { apps, services } = get()
        const payload = {
          $schema: 'https://nezam.design/schema/sitemap-v3.json',
          exportedAt: new Date().toISOString(),
          apps: apps.map((a) => ({
            id: a.id, name: a.name, kind: a.kind, notes: a.notes,
            navMenus: a.navMenus.map((m) => ({
              id: m.id, name: m.name, kind: m.kind, notes: m.notes,
              pages: m.pages.map(serializePage),
            })),
          })),
          services: services.map((sv) => ({
            id: sv.id, name: sv.name, kind: sv.kind,
            description: sv.description, endpoint: sv.endpoint,
            notes: sv.notes, connectedPageIds: sv.connectedPageIds,
          })),
        }
        return JSON.stringify(payload, null, 2)
      },
    }),
    { name: 'nezam-sitemap-builder-v2' },
  ),
)
