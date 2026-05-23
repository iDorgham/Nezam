'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import type { SitemapBuilderPage, SitemapBuilderSection } from '@/types'

const uid = () => Math.random().toString(36).slice(2, 9)

function makeSection(name = 'New Section'): SitemapBuilderSection {
  return { id: uid(), name, description: '' }
}

function makePage(name = 'New Page'): SitemapBuilderPage {
  return { id: uid(), name, sections: [], collapsed: false }
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

  exportJSON: () => string
}

export const useSitemapBuilder = create<SitemapBuilderStore>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,

      addPage: () =>
        set((s) => ({ pages: [...s.pages, makePage()] })),

      deletePage: (pageId) => {
        const page = get().pages.find((p) => p.id === pageId)
        if (!page || page.sections.length > 0) return false
        set((s) => ({ pages: s.pages.filter((p) => p.id !== pageId) }))
        return true
      },

      renamePage: (pageId, name) =>
        set((s) => ({
          pages: s.pages.map((p) => (p.id === pageId ? { ...p, name } : p)),
        })),

      toggleCollapsed: (pageId) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId ? { ...p, collapsed: !p.collapsed } : p,
          ),
        })),

      addSection: (pageId) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId
              ? { ...p, collapsed: false, sections: [...p.sections, makeSection()] }
              : p,
          ),
        })),

      deleteSection: (pageId, sectionId) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.filter((sec) => sec.id !== sectionId) }
              : p,
          ),
        })),

      renameSection: (pageId, sectionId, name) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  sections: p.sections.map((sec) =>
                    sec.id === sectionId ? { ...sec, name } : sec,
                  ),
                }
              : p,
          ),
        })),

      updateDescription: (pageId, sectionId, description) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  sections: p.sections.map((sec) =>
                    sec.id === sectionId ? { ...sec, description } : sec,
                  ),
                }
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

      exportJSON: () => {
        const payload = {
          $schema: 'https://nezam.design/schema/sitemap-v1.json',
          exportedAt: new Date().toISOString(),
          pages: get().pages.map((p) => ({
            id: p.id,
            name: p.name,
            sections: p.sections.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
            })),
          })),
        }
        return JSON.stringify(payload, null, 2)
      },
    }),
    { name: 'nezam-sitemap-builder-v1' },
  ),
)
