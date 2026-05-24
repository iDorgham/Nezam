'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import type { SitemapBuilderPage, SitemapBuilderSection, SitemapNode } from '@/types'

const uid = () => Math.random().toString(36).slice(2, 9)

function makeSection(name = 'New Section'): SitemapBuilderSection {
  return { id: uid(), name, description: '' }
}

function makePage(name = 'New Page'): SitemapBuilderPage {
  return { id: uid(), name, sections: [], collapsed: false }
}

function nodeToPage(node: SitemapNode): SitemapBuilderPage {
  return {
    id: uid(),
    name: node.name,
    sections: (node.sectionNames ?? []).map((name) => ({ id: uid(), name, description: '' })),
    collapsed: false,
    children: node.children?.map(nodeToPage),
  }
}

// Recursively find a page anywhere in the tree
function findPage(pages: SitemapBuilderPage[], id: string): SitemapBuilderPage | null {
  for (const p of pages) {
    if (p.id === id) return p
    if (p.children) {
      const found = findPage(p.children, id)
      if (found) return found
    }
  }
  return null
}

// Recursively update page PROPERTIES anywhere in the tree (does not add/remove children).
function mapPages(
  pages: SitemapBuilderPage[],
  fn: (p: SitemapBuilderPage) => SitemapBuilderPage,
): SitemapBuilderPage[] {
  return pages.map((p) => ({
    ...fn(p),
    children: p.children ? mapPages(p.children, fn) : undefined,
  }))
}

// Recursively insert newChildren under parentId (handles pages with no prior children).
function insertChildren(
  pages: SitemapBuilderPage[],
  parentId: string,
  newChildren: SitemapBuilderPage[],
): SitemapBuilderPage[] {
  return pages.map((p) => {
    if (p.id === parentId) {
      return { ...p, collapsed: false, children: [...(p.children ?? []), ...newChildren] }
    }
    if (p.children) {
      return { ...p, children: insertChildren(p.children, parentId, newChildren) }
    }
    return p
  })
}

// Remove a page by id from the tree, returning [updated tree, removed page]
function removePage(
  pages: SitemapBuilderPage[],
  id: string,
): [SitemapBuilderPage[], SitemapBuilderPage | null] {
  let removed: SitemapBuilderPage | null = null
  const next = pages
    .filter((p) => {
      if (p.id === id) { removed = p; return false }
      return true
    })
    .map((p) => {
      if (!p.children) return p
      const [newChildren, found] = removePage(p.children, id)
      if (found) removed = found
      return { ...p, children: newChildren }
    })
  return [next, removed]
}

const INITIAL_PAGES: SitemapBuilderPage[] = [
  {
    id: uid(),
    name: 'Home',
    collapsed: false,
    sections: [
      { id: uid(), name: 'Hero', description: 'Primary value proposition' },
      { id: uid(), name: 'Features', description: 'Key product capabilities' },
      { id: uid(), name: 'CTA', description: 'Primary call to action' },
    ],
  },
]

interface SitemapBuilderStore {
  pages: SitemapBuilderPage[]

  addPage: () => void
  deletePage: (pageId: string) => boolean
  renamePage: (pageId: string, name: string) => void
  toggleCollapsed: (pageId: string) => void

  addSection: (pageId: string) => void
  deleteSection: (pageId: string, sectionId: string) => void
  renameSection: (pageId: string, sectionId: string, name: string) => void
  updateDescription: (pageId: string, sectionId: string, desc: string) => void

  reorderPages: (fromIdx: number, toIdx: number) => void
  reorderSections: (pageId: string, fromIdx: number, toIdx: number) => void
  moveSectionToPage: (sectionId: string, fromPageId: string, toPageId: string, atIdx: number) => void

  /** Load a fresh page tree from an archetype's SitemapNode[] */
  loadFromArchetype: (nodes: SitemapNode[]) => void
  /** Add a child page under parentId, or at root if parentId is null */
  addChildPage: (parentId: string | null) => void
  /** Nest pageId under newParentId (or un-nest if null) */
  nestPage: (pageId: string, newParentId: string | null) => void

  /** Move multiple pages (by id) under newParentId, or to root if null */
  moveMultiplePages: (pageIds: string[], newParentId: string | null) => void

  /** Set the status badge on a page */
  setPageStatus: (pageId: string, status: import('@/types').PageStatus | undefined) => void

  exportJSON: () => string
}

export const useSitemapBuilder = create<SitemapBuilderStore>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,

      addPage: () =>
        set((s) => ({ pages: [...s.pages, makePage()] })),

      deletePage: (pageId) => {
        const page = findPage(get().pages, pageId)
        if (!page || page.sections.length > 0 || (page.children?.length ?? 0) > 0) return false
        const [next] = removePage(get().pages, pageId)
        set({ pages: next })
        return true
      },

      renamePage: (pageId, name) =>
        set((s) => ({ pages: mapPages(s.pages, (p) => (p.id === pageId ? { ...p, name } : p)) })),

      toggleCollapsed: (pageId) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId ? { ...p, collapsed: !p.collapsed } : p,
          ),
        })),

      addSection: (pageId) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId
              ? { ...p, collapsed: false, sections: [...p.sections, makeSection()] }
              : p,
          ),
        })),

      deleteSection: (pageId, sectionId) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.filter((sec) => sec.id !== sectionId) }
              : p,
          ),
        })),

      renameSection: (pageId, sectionId, name) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.map((sec) => sec.id === sectionId ? { ...sec, name } : sec) }
              : p,
          ),
        })),

      updateDescription: (pageId, sectionId, description) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.map((sec) => sec.id === sectionId ? { ...sec, description } : sec) }
              : p,
          ),
        })),

      reorderPages: (fromIdx, toIdx) =>
        set((s) => ({ pages: arrayMove(s.pages, fromIdx, toIdx) })),

      reorderSections: (pageId, fromIdx, toIdx) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId
              ? { ...p, sections: arrayMove(p.sections, fromIdx, toIdx) }
              : p,
          ),
        })),

      moveSectionToPage: (sectionId, fromPageId, toPageId, atIdx) =>
        set((s) => {
          const fromPage = s.pages.find((p) => p.id === fromPageId)
          const section = fromPage?.sections.find((sec) => sec.id === sectionId)
          if (!section) return s

          return {
            pages: s.pages.map((p) => {
              if (p.id === fromPageId) {
                return { ...p, sections: p.sections.filter((sec) => sec.id !== sectionId) }
              }
              if (p.id === toPageId) {
                const next = [...p.sections]
                const insertAt = Math.min(atIdx, next.length)
                next.splice(insertAt, 0, section)
                return { ...p, sections: next }
              }
              return p
            }),
          }
        }),

      loadFromArchetype: (nodes) =>
        set({ pages: nodes.map(nodeToPage) }),

      addChildPage: (parentId) => {
        const newPage = makePage()
        if (!parentId) {
          set((s) => ({ pages: [...s.pages, newPage] }))
          return
        }
        set((s) => ({ pages: insertChildren(s.pages, parentId, [newPage]) }))
      },

      nestPage: (pageId, newParentId) =>
        set((s) => {
          const [withoutPage, page] = removePage(s.pages, pageId)
          if (!page) return s
          if (!newParentId) return { pages: [...withoutPage, page] }
          return { pages: insertChildren(withoutPage, newParentId, [page]) }
        }),

      setPageStatus: (pageId, status) =>
        set((s) => ({
          pages: mapPages(s.pages, (p) =>
            p.id === pageId ? { ...p, status } : p,
          ),
        })),

      moveMultiplePages: (pageIds, newParentId) =>
        set((s) => {
          // Remove all target pages from the tree, collecting them in order
          let tree = s.pages
          const collected: SitemapBuilderPage[] = []
          for (const id of pageIds) {
            const [next, page] = removePage(tree, id)
            if (page) { tree = next; collected.push(page) }
          }
          if (collected.length === 0) return s
          if (!newParentId) return { pages: [...tree, ...collected] }
          return { pages: insertChildren(tree, newParentId, collected) }
        }),

      exportJSON: () => {
        function serializePage(p: SitemapBuilderPage): object {
          return {
            id: p.id,
            name: p.name,
            sections: p.sections.map((s) => ({ id: s.id, name: s.name, description: s.description })),
            children: p.children?.map(serializePage),
          }
        }
        const payload = {
          $schema: 'https://nezam.design/schema/sitemap-v1.json',
          exportedAt: new Date().toISOString(),
          pages: get().pages.map(serializePage),
        }
        return JSON.stringify(payload, null, 2)
      },
    }),
    { name: 'nezam-sitemap-builder-v1' },
  ),
)
