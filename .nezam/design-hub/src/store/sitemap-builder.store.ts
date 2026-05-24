'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import type {
  AppKind, ArchetypeApp, ArchetypeNavMenu,
  MenuViewMode, NavMenuKind, NoteItem, PageStatus, ServiceKind,
  SitemapBuilderApp, SitemapBuilderInfra, SitemapBuilderNavMenu,
  SitemapBuilderPage, SitemapBuilderSection,
  SitemapBuilderService, SitemapNode,
} from '@/types'

const uid = () => Math.random().toString(36).slice(2, 9)

// ── Factory helpers ────────────────────────────────────────────────────────────

function makeNote(title = 'Note'): NoteItem {
  return { id: uid(), title, body: '' }
}

function makeSection(name = 'New Section'): SitemapBuilderSection {
  return { id: uid(), name, description: '', notes: [] }
}

function makeService(kind: ServiceKind = 'custom'): SitemapBuilderService {
  return { id: uid(), name: 'New Service', kind, description: '', notes: [], connectedPageIds: [] }
}

function makePage(name = 'New Page'): SitemapBuilderPage {
  return { id: uid(), name, sections: [], notes: [], collapsed: false }
}

function makeNavMenu(name = 'New Menu', kind: NavMenuKind = 'custom'): SitemapBuilderNavMenu {
  return {
    id: uid(), name, kind, pages: [], collapsed: false, notes: [],
    viewMode: kind === 'main' ? 'full' : 'compact',
  }
}

function makeApp(name = 'New App', kind: AppKind = 'custom'): SitemapBuilderApp {
  return { id: uid(), name, kind, navMenus: [], collapsed: false, notes: [] }
}

const INITIAL_INFRA: SitemapBuilderInfra = {
  git:      { provider: null, repoUrl: '', branch: 'main' },
  database: { provider: null, connectionString: '', notes: '' },
  platform: { provider: null, deployUrl: '', projectName: '', notes: '' },
  prd:      { title: '', url: '', description: '' },
}

// ── Archetype → builder converters ────────────────────────────────────────────

function nodeToPage(node: SitemapNode): SitemapBuilderPage {
  return {
    id: uid(),
    name: node.name,
    sections: (node.sectionNames ?? []).map((n) => makeSection(n)),
    notes: [],
    collapsed: false,
    subPages: node.children?.map(nodeToPage),
  }
}

function archetypeMenuToMenu(m: ArchetypeNavMenu): SitemapBuilderNavMenu {
  return {
    id: uid(), name: m.name, kind: m.kind,
    pages: m.pages.map(nodeToPage),
    collapsed: false, notes: [],
    viewMode: m.kind === 'main' ? 'full' : 'compact',
  }
}

function archetypeAppToApp(a: ArchetypeApp): SitemapBuilderApp {
  return {
    id: uid(), name: a.name, kind: a.kind,
    navMenus: a.navMenus.map(archetypeMenuToMenu),
    collapsed: false, notes: [],
  }
}

// ── Tree helpers ───────────────────────────────────────────────────────────────

function mapApp(
  apps: SitemapBuilderApp[], appId: string,
  fn: (a: SitemapBuilderApp) => SitemapBuilderApp,
): SitemapBuilderApp[] {
  return apps.map((a) => a.id === appId ? fn(a) : a)
}

function mapMenu(
  apps: SitemapBuilderApp[], appId: string, menuId: string,
  fn: (m: SitemapBuilderNavMenu) => SitemapBuilderNavMenu,
): SitemapBuilderApp[] {
  return mapApp(apps, appId, (a) => ({
    ...a,
    navMenus: a.navMenus.map((m) => m.id === menuId ? fn(m) : m),
  }))
}

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

function insertSubPage(
  pages: SitemapBuilderPage[], parentId: string, newPage: SitemapBuilderPage,
): SitemapBuilderPage[] {
  return pages.map((p) => {
    if (p.id === parentId) return { ...p, collapsed: false, subPages: [...(p.subPages ?? []), newPage] }
    if (p.subPages) return { ...p, subPages: insertSubPage(p.subPages, parentId, newPage) }
    return p
  })
}

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
    id: uid(), name: 'Marketing', kind: 'marketing', collapsed: false, notes: [],
    navMenus: [
      {
        id: uid(), name: 'Main Navigation', kind: 'main', collapsed: false, notes: [], viewMode: 'full',
        pages: [
          {
            id: uid(), name: 'Home', collapsed: false, notes: [],
            sections: [
              { id: uid(), name: 'Hero',     description: 'Primary value proposition', notes: [] },
              { id: uid(), name: 'Features', description: 'Key product capabilities',  notes: [] },
              { id: uid(), name: 'CTA',      description: 'Primary call to action',    notes: [] },
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
  infra: SitemapBuilderInfra

  /* App -------------------------------------------------------------------- */
  addApp: (kind?: AppKind) => void
  deleteApp: (appId: string) => void
  renameApp: (appId: string, name: string) => void
  toggleAppCollapsed: (appId: string) => void
  reorderApps: (fromIdx: number, toIdx: number) => void
  addAppNote: (appId: string) => void
  updateAppNote: (appId: string, noteId: string, patch: Partial<Omit<NoteItem, 'id'>>) => void
  deleteAppNote: (appId: string, noteId: string) => void

  /* NavMenu ---------------------------------------------------------------- */
  addNavMenu: (appId: string, kind?: NavMenuKind) => void
  deleteNavMenu: (appId: string, menuId: string) => void
  renameNavMenu: (appId: string, menuId: string, name: string) => void
  toggleMenuCollapsed: (appId: string, menuId: string) => void
  setMenuViewMode: (appId: string, menuId: string, mode: MenuViewMode) => void
  reorderNavMenus: (appId: string, fromIdx: number, toIdx: number) => void

  /* Page (globally scoped by pageId) --------------------------------------- */
  addPage: (appId: string, menuId: string) => void
  deletePage: (pageId: string) => boolean
  renamePage: (pageId: string, name: string) => void
  togglePageCollapsed: (pageId: string) => void
  addSubPage: (parentPageId: string) => void
  setPageStatus: (pageId: string, status: PageStatus | undefined) => void
  setPageUrl: (pageId: string, url: string) => void
  addPageNote: (pageId: string) => void
  updatePageNote: (pageId: string, noteId: string, patch: Partial<Omit<NoteItem, 'id'>>) => void
  deletePageNote: (pageId: string, noteId: string) => void
  reorderPages: (appId: string, menuId: string, fromIdx: number, toIdx: number) => void

  /* NavMenu notes ---------------------------------------------------------- */
  addMenuNote: (appId: string, menuId: string) => void
  updateMenuNote: (appId: string, menuId: string, noteId: string, patch: Partial<Omit<NoteItem, 'id'>>) => void
  deleteMenuNote: (appId: string, menuId: string, noteId: string) => void

  /* Section (scoped by pageId) --------------------------------------------- */
  addSection: (pageId: string) => void
  deleteSection: (pageId: string, sectionId: string) => void
  renameSection: (pageId: string, sectionId: string, name: string) => void
  updateDescription: (pageId: string, sectionId: string, desc: string) => void
  reorderSections: (pageId: string, fromIdx: number, toIdx: number) => void
  moveSectionToPage: (sectionId: string, fromPageId: string, toPageId: string, atIdx: number) => void

  /* Services --------------------------------------------------------------- */
  addService: (kind?: ServiceKind) => void
  deleteService: (serviceId: string) => void
  updateService: (serviceId: string, patch: Partial<Omit<SitemapBuilderService, 'id'>>) => void
  toggleServiceConnection: (serviceId: string, pageId: string) => void
  addServiceNote: (serviceId: string) => void
  updateServiceNote: (serviceId: string, noteId: string, patch: Partial<Omit<NoteItem, 'id'>>) => void
  deleteServiceNote: (serviceId: string, noteId: string) => void

  /* Infrastructure --------------------------------------------------------- */
  updateInfra: (patch: Partial<SitemapBuilderInfra>) => void

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
      infra: INITIAL_INFRA,

      /* ── App ────────────────────────────────────────────────────────────── */

      addApp: (kind = 'custom') =>
        set((s) => ({ apps: [...s.apps, makeApp('New App', kind)] })),

      deleteApp: (appId) =>
        set((s) => ({ apps: s.apps.filter((a) => a.id !== appId) })),

      renameApp: (appId, name) =>
        set((s) => ({ apps: mapApp(s.apps, appId, (a) => ({ ...a, name })) })),

      toggleAppCollapsed: (appId) =>
        set((s) => ({ apps: mapApp(s.apps, appId, (a) => ({ ...a, collapsed: !a.collapsed })) })),

      reorderApps: (fromIdx, toIdx) =>
        set((s) => ({ apps: arrayMove(s.apps, fromIdx, toIdx) })),

      addAppNote: (appId) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({ ...a, notes: [...a.notes, makeNote()] })),
        })),

      updateAppNote: (appId, noteId, patch) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a,
            notes: a.notes.map((n) => n.id === noteId ? { ...n, ...patch } : n),
          })),
        })),

      deleteAppNote: (appId, noteId) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a, notes: a.notes.filter((n) => n.id !== noteId),
          })),
        })),

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

      setMenuViewMode: (appId, menuId, mode) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({ ...m, viewMode: mode })),
        })),

      reorderNavMenus: (appId, fromIdx, toIdx) =>
        set((s) => ({
          apps: mapApp(s.apps, appId, (a) => ({
            ...a, navMenus: arrayMove(a.navMenus, fromIdx, toIdx),
          })),
        })),

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
              ...m, pages: insertSubPage(m.pages, parentPageId, newPage),
            })),
          })),
        }))
      },

      setPageStatus: (pageId, status) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, status })) })),

      setPageUrl: (pageId, url) =>
        set((s) => ({ apps: mapPageGlobal(s.apps, pageId, (p) => ({ ...p, url })) })),

      addPageNote: (pageId) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p, notes: [...p.notes, makeNote()],
          })),
        })),

      updatePageNote: (pageId, noteId, patch) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p,
            notes: p.notes.map((n) => n.id === noteId ? { ...n, ...patch } : n),
          })),
        })),

      deletePageNote: (pageId, noteId) =>
        set((s) => ({
          apps: mapPageGlobal(s.apps, pageId, (p) => ({
            ...p, notes: p.notes.filter((n) => n.id !== noteId),
          })),
        })),

      reorderPages: (appId, menuId, fromIdx, toIdx) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({
            ...m, pages: arrayMove(m.pages, fromIdx, toIdx),
          })),
        })),

      /* ── NavMenu notes ──────────────────────────────────────────────────── */

      addMenuNote: (appId, menuId) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({ ...m, notes: [...m.notes, makeNote()] })),
        })),

      updateMenuNote: (appId, menuId, noteId, patch) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({
            ...m, notes: m.notes.map((n) => n.id === noteId ? { ...n, ...patch } : n),
          })),
        })),

      deleteMenuNote: (appId, menuId, noteId) =>
        set((s) => ({
          apps: mapMenu(s.apps, appId, menuId, (m) => ({
            ...m, notes: m.notes.filter((n) => n.id !== noteId),
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

      addServiceNote: (serviceId) =>
        set((s) => ({
          services: s.services.map((sv) =>
            sv.id === serviceId ? { ...sv, notes: [...sv.notes, makeNote()] } : sv,
          ),
        })),

      updateServiceNote: (serviceId, noteId, patch) =>
        set((s) => ({
          services: s.services.map((sv) =>
            sv.id === serviceId
              ? { ...sv, notes: sv.notes.map((n) => n.id === noteId ? { ...n, ...patch } : n) }
              : sv,
          ),
        })),

      deleteServiceNote: (serviceId, noteId) =>
        set((s) => ({
          services: s.services.map((sv) =>
            sv.id === serviceId
              ? { ...sv, notes: sv.notes.filter((n) => n.id !== noteId) }
              : sv,
          ),
        })),

      /* ── Infrastructure ─────────────────────────────────────────────────── */

      updateInfra: (patch) =>
        set((s) => ({ infra: { ...s.infra, ...patch } })),

      /* ── Archetype ──────────────────────────────────────────────────────── */

      loadFromArchetype: (apps) =>
        set({ apps: apps.map(archetypeAppToApp), services: [], infra: INITIAL_INFRA }),

      /* ── Export ─────────────────────────────────────────────────────────── */

      exportJSON: () => {
        function serializePage(p: SitemapBuilderPage): object {
          return {
            id: p.id, name: p.name, url: p.url,
            status: p.status, notes: p.notes,
            sections: p.sections.map((s) => ({ id: s.id, name: s.name, description: s.description })),
            subPages: p.subPages?.map(serializePage),
          }
        }
        const { apps, services, infra } = get()
        return JSON.stringify({
          $schema: 'https://nezam.design/schema/sitemap-v3.json',
          exportedAt: new Date().toISOString(),
          infra,
          apps: apps.map((a) => ({
            id: a.id, name: a.name, kind: a.kind, notes: a.notes,
            navMenus: a.navMenus.map((m) => ({
              id: m.id, name: m.name, kind: m.kind,
              pages: m.pages.map(serializePage),
            })),
          })),
          services: services.map((sv) => ({
            id: sv.id, name: sv.name, kind: sv.kind,
            description: sv.description, endpoint: sv.endpoint, connectedPageIds: sv.connectedPageIds,
          })),
        }, null, 2)
      },
    }),
    { name: 'nezam-sitemap-builder-v3' },
  ),
)
