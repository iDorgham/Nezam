import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WireframeBlock, WireframeVariant } from '../wireframe-library/blocks'
import type { PageTemplate, TemplateSlot } from '../wireframe-library/page-templates'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export interface WireframeSlot {
  instanceId: string
  blockId: string
  variantId: string
  label: string
  notes: string
  approved: boolean
  height?: number
}

export interface WireframePage {
  pageId: string          // matches sitemap Page.id
  pageTitle: string
  slots: WireframeSlot[]
  breakpoint: Breakpoint
  lockedAt?: string
}

interface WireframeState {
  // Pages map
  pages: Record<string, WireframePage>

  // Active editing state
  activePageId: string | null
  activeSlotInstanceId: string | null
  breakpoint: Breakpoint
  viewMode: 'canvas' | 'grid' | 'list'
  showTemplates: boolean
  showLibrary: boolean
  searchQuery: string
  activeCategory: string

  // Actions — page management
  initPage: (pageId: string, pageTitle: string) => void
  setActivePage: (pageId: string) => void
  setActiveSlot: (instanceId: string | null) => void
  setBreakpoint: (bp: Breakpoint) => void
  setViewMode: (mode: 'canvas' | 'grid' | 'list') => void
  setShowTemplates: (v: boolean) => void
  setShowLibrary: (v: boolean) => void
  setSearch: (q: string) => void
  setCategory: (cat: string) => void

  // Actions — slot management
  addSlot: (pageId: string, blockId: string, variantId: string, label: string) => void
  addSlotsFromTemplate: (pageId: string, pageTitle: string, template: PageTemplate) => void
  removeSlot: (pageId: string, instanceId: string) => void
  reorderSlots: (pageId: string, fromIndex: number, toIndex: number) => void
  updateSlotVariant: (pageId: string, instanceId: string, variantId: string) => void
  updateSlotNotes: (pageId: string, instanceId: string, notes: string) => void
  toggleSlotApproval: (pageId: string, instanceId: string) => void
  duplicateSlot: (pageId: string, instanceId: string) => void

  // Actions — page-level
  lockPage: (pageId: string) => void
  clearPage: (pageId: string) => void

  // Export
  exportToJson: () => string
}

// ─── ID helper ──────────────────────────────────────────────────────────────

const uid = (n = 8) => Math.random().toString(36).substring(2, 2 + n)

// ─── Store ──────────────────────────────────────────────────────────────────

export const useWireframeStore = create<WireframeState>()(
  persist(
    (set, get) => ({
      pages: {},
      activePageId: null,
      activeSlotInstanceId: null,
      breakpoint: 'desktop',
      viewMode: 'canvas',
      showTemplates: false,
      showLibrary: true,
      searchQuery: '',
      activeCategory: 'all',

      initPage: (pageId, pageTitle) => set((state) => {
        if (state.pages[pageId]) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: { pageId, pageTitle, slots: [], breakpoint: 'desktop' }
          }
        }
      }),

      setActivePage: (pageId) => set({ activePageId: pageId, activeSlotInstanceId: null }),
      setActiveSlot: (instanceId) => set({ activeSlotInstanceId: instanceId }),
      setBreakpoint: (bp) => set({ breakpoint: bp }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setShowTemplates: (v) => set({ showTemplates: v }),
      setShowLibrary: (v) => set({ showLibrary: v }),
      setSearch: (q) => set({ searchQuery: q }),
      setCategory: (cat) => set({ activeCategory: cat }),

      addSlot: (pageId, blockId, variantId, label) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        const newSlot: WireframeSlot = {
          instanceId: uid(),
          blockId,
          variantId,
          label,
          notes: '',
          approved: false,
        }
        return {
          pages: {
            ...state.pages,
            [pageId]: { ...page, slots: [...page.slots, newSlot] }
          },
          activeSlotInstanceId: newSlot.instanceId
        }
      }),

      addSlotsFromTemplate: (pageId, pageTitle, template) => set((state) => {
        const slots: WireframeSlot[] = template.slots.map((s: TemplateSlot) => ({
          instanceId: uid(),
          blockId: s.blockId,
          variantId: s.variantId,
          label: s.label,
          notes: '',
          approved: false,
        }))
        return {
          pages: {
            ...state.pages,
            [pageId]: { pageId, pageTitle, slots, breakpoint: 'desktop' }
          },
          showTemplates: false
        }
      }),

      removeSlot: (pageId, instanceId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: { ...page, slots: page.slots.filter(s => s.instanceId !== instanceId) }
          },
          activeSlotInstanceId: state.activeSlotInstanceId === instanceId ? null : state.activeSlotInstanceId
        }
      }),

      reorderSlots: (pageId, fromIndex, toIndex) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        const slots = [...page.slots]
        const [moved] = slots.splice(fromIndex, 1)
        slots.splice(toIndex, 0, moved)
        return { pages: { ...state.pages, [pageId]: { ...page, slots } } }
      }),

      updateSlotVariant: (pageId, instanceId, variantId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: {
              ...page,
              slots: page.slots.map(s => s.instanceId === instanceId ? { ...s, variantId } : s)
            }
          }
        }
      }),

      updateSlotNotes: (pageId, instanceId, notes) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: {
              ...page,
              slots: page.slots.map(s => s.instanceId === instanceId ? { ...s, notes } : s)
            }
          }
        }
      }),

      toggleSlotApproval: (pageId, instanceId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: {
              ...page,
              slots: page.slots.map(s =>
                s.instanceId === instanceId ? { ...s, approved: !s.approved } : s
              )
            }
          }
        }
      }),

      duplicateSlot: (pageId, instanceId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        const idx = page.slots.findIndex(s => s.instanceId === instanceId)
        if (idx === -1) return state
        const original = page.slots[idx]
        const dupe: WireframeSlot = { ...original, instanceId: uid(), label: `${original.label} (copy)`, approved: false }
        const slots = [...page.slots]
        slots.splice(idx + 1, 0, dupe)
        return { pages: { ...state.pages, [pageId]: { ...page, slots } } }
      }),

      lockPage: (pageId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return {
          pages: {
            ...state.pages,
            [pageId]: { ...page, lockedAt: new Date().toISOString() }
          }
        }
      }),

      clearPage: (pageId) => set((state) => {
        const page = state.pages[pageId]
        if (!page) return state
        return { pages: { ...state.pages, [pageId]: { ...page, slots: [], lockedAt: undefined } } }
      }),

      exportToJson: () => {
        const { pages } = get()
        return JSON.stringify(pages, null, 2)
      }
    }),
    {
      name: 'nezam-wireframes-v2',
      partialize: (state) => ({ pages: state.pages })
    }
  )
)
