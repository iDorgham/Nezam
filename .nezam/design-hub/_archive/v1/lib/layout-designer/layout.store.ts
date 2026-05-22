// ─────────────────────────────────────────────────────────────────────────────
// NEZAM Layout Designer — Zustand Store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
const nanoid = (n = 8) => Math.random().toString(36).substring(2, 2 + n)
import type {
  LayoutDesignerState,
  PageLayout,
  LayoutSlot,
  Breakpoint,
  WireframeExport,
  SpacingKey,
  GridCols,
  AlignItems,
  JustifyContent,
  FlexDirection,
  DisplayMode,
} from './types'
import { COMPONENT_LIBRARY } from './component-library'
import { useSessionStore } from '@/lib/store/session.store'
import { useTokensStore } from '@/lib/store/tokens.store'

// ── Default slot values ───────────────────────────────────────────────────────

function makeDefaultSlot(blockId: string, variantId: string, order: number): LayoutSlot {
  const block = COMPONENT_LIBRARY.find(b => b.id === blockId)
  return {
    id: nanoid(8),
    blockId,
    variantId,
    order,
    label: block?.name || blockId,
    colSpan: 12,
    offsetCols: 0,
    paddingTop: 'lg',
    paddingBottom: 'lg',
    paddingX: 'md',
    display: 'block',
    flexDir: 'column',
    alignItems: 'start',
    justifyContent: 'start',
    gap: 'md',
    breakpoints: {
      mobile: { colSpan: 12, display: 'block' },
      tablet: { colSpan: 12 },
      desktop: {},
    },
    locked: false,
    approved: false,
    notes: '',
  }
}

function makeDefaultPage(sitePage: { id: string; title: string; route: string }): PageLayout {
  return {
    pageId: sitePage.id,
    pageName: sitePage.title,
    pageRoute: sitePage.route,
    gridCols: 12,
    containerMaxWidth: '1280px',
    containerPadding: 'md',
    rowGap: 'none',
    colGap: 'md',
    slots: [],
    lockedAt: null,
    exportedAt: null,
  }
}

// ── Store shape ───────────────────────────────────────────────────────────────

interface LayoutStore extends LayoutDesignerState {
  // Sync with session
  syncFromSession: () => void

  // Page management
  getActivePage: () => PageLayout | null
  setActivePage: (pageId: string) => void
  updatePageConfig: (pageId: string, updates: Partial<PageLayout>) => void

  // Slot management
  addSlot: (pageId: string, blockId: string, variantId: string) => void
  removeSlot: (pageId: string, slotId: string) => void
  updateSlot: (pageId: string, slotId: string, updates: Partial<LayoutSlot>) => void
  moveSlotUp: (pageId: string, slotId: string) => void
  moveSlotDown: (pageId: string, slotId: string) => void
  duplicateSlot: (pageId: string, slotId: string) => void
  reorderSlots: (pageId: string, fromIndex: number, toIndex: number) => void
  selectSlot: (slotId: string | null) => void

  // Canvas controls
  setBreakpoint: (bp: Breakpoint) => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleLabels: () => void

  // Lock / approve
  lockPage: (pageId: string) => void
  unlockPage: (pageId: string) => void
  approveSlot: (pageId: string, slotId: string) => void
  unapproveSlot: (pageId: string, slotId: string) => void

  // Export
  exportWireframes: () => WireframeExport
  exportDesignMdSection: () => string
}

// ── Spacing token map ─────────────────────────────────────────────────────────

const SPACING_VALUES: Record<SpacingKey, string> = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  pages: [],
  activePageId: null,
  selectedSlotId: null,
  activeBreakpoint: 'desktop',
  canvasZoom: 1,
  showGrid: true,
  showLabels: true,
  panelWidth: 280,
  inspectorWidth: 300,

  syncFromSession: () => {
    const sitemap = useSessionStore.getState().sitemap
    if (!sitemap.length) return

    set((state) => {
      const existingIds = new Set(state.pages.map(p => p.pageId))
      const newPages = sitemap
        .filter(p => !existingIds.has(p.id))
        .map(p => makeDefaultPage({ id: p.id, title: p.title, route: p.route }))

      const activePageId = state.activePageId ?? (sitemap[0]?.id || null)

      return {
        pages: [...state.pages, ...newPages],
        activePageId,
      }
    })
  },

  getActivePage: () => {
    const { pages, activePageId } = get()
    return pages.find(p => p.pageId === activePageId) ?? null
  },

  setActivePage: (pageId) => set({ activePageId: pageId, selectedSlotId: null }),

  updatePageConfig: (pageId, updates) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId ? { ...p, ...updates } : p
    ),
  })),

  addSlot: (pageId, blockId, variantId) => set((state) => {
    const page = state.pages.find(p => p.pageId === pageId)
    if (!page) return state
    const order = page.slots.length
    const slot = makeDefaultSlot(blockId, variantId, order)
    return {
      pages: state.pages.map(p =>
        p.pageId === pageId
          ? { ...p, slots: [...p.slots, slot] }
          : p
      ),
      selectedSlotId: slot.id,
    }
  }),

  removeSlot: (pageId, slotId) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId
        ? { ...p, slots: p.slots.filter(s => s.id !== slotId).map((s, i) => ({ ...s, order: i })) }
        : p
    ),
    selectedSlotId: state.selectedSlotId === slotId ? null : state.selectedSlotId,
  })),

  updateSlot: (pageId, slotId, updates) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId
        ? { ...p, slots: p.slots.map(s => s.id === slotId ? { ...s, ...updates } : s) }
        : p
    ),
  })),

  moveSlotUp: (pageId, slotId) => {
    const page = get().pages.find(p => p.pageId === pageId)
    if (!page) return
    const idx = page.slots.findIndex(s => s.id === slotId)
    if (idx <= 0) return
    get().reorderSlots(pageId, idx, idx - 1)
  },

  moveSlotDown: (pageId, slotId) => {
    const page = get().pages.find(p => p.pageId === pageId)
    if (!page) return
    const idx = page.slots.findIndex(s => s.id === slotId)
    if (idx >= page.slots.length - 1) return
    get().reorderSlots(pageId, idx, idx + 1)
  },

  duplicateSlot: (pageId, slotId) => set((state) => {
    const page = state.pages.find(p => p.pageId === pageId)
    if (!page) return state
    const slot = page.slots.find(s => s.id === slotId)
    if (!slot) return state
    const idx = page.slots.findIndex(s => s.id === slotId)
    const newSlot: LayoutSlot = { ...slot, id: nanoid(8), order: idx + 1 }
    const newSlots = [...page.slots]
    newSlots.splice(idx + 1, 0, newSlot)
    return {
      pages: state.pages.map(p =>
        p.pageId === pageId
          ? { ...p, slots: newSlots.map((s, i) => ({ ...s, order: i })) }
          : p
      ),
      selectedSlotId: newSlot.id,
    }
  }),

  reorderSlots: (pageId, fromIndex, toIndex) => set((state) => {
    const page = state.pages.find(p => p.pageId === pageId)
    if (!page) return state
    const slots = [...page.slots]
    const [moved] = slots.splice(fromIndex, 1)
    slots.splice(toIndex, 0, moved)
    return {
      pages: state.pages.map(p =>
        p.pageId === pageId
          ? { ...p, slots: slots.map((s, i) => ({ ...s, order: i })) }
          : p
      ),
    }
  }),

  selectSlot: (slotId) => set({ selectedSlotId: slotId }),

  setBreakpoint: (activeBreakpoint) => set({ activeBreakpoint }),

  setZoom: (canvasZoom) => set({ canvasZoom: Math.min(1.5, Math.max(0.4, canvasZoom)) }),

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),

  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),

  lockPage: (pageId) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId ? { ...p, lockedAt: new Date().toISOString() } : p
    ),
  })),

  unlockPage: (pageId) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId ? { ...p, lockedAt: null } : p
    ),
  })),

  approveSlot: (pageId, slotId) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId
        ? { ...p, slots: p.slots.map(s => s.id === slotId ? { ...s, approved: true } : s) }
        : p
    ),
  })),

  unapproveSlot: (pageId, slotId) => set((state) => ({
    pages: state.pages.map(p =>
      p.pageId === pageId
        ? { ...p, slots: p.slots.map(s => s.id === slotId ? { ...s, approved: false } : s) }
        : p
    ),
  })),

  exportWireframes: (): WireframeExport => {
    const { pages } = get()
    return {
      $schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      pages: pages.map(page => ({
        pageId: page.pageId,
        pageName: page.pageName,
        route: page.pageRoute,
        grid: {
          cols: page.gridCols,
          containerMaxWidth: page.containerMaxWidth,
          padding: SPACING_VALUES[page.containerPadding],
          rowGap: SPACING_VALUES[page.rowGap],
          colGap: SPACING_VALUES[page.colGap],
        },
        blocks: page.slots.map(slot => {
          const block = COMPONENT_LIBRARY.find(b => b.id === slot.blockId)
          const variant = block?.variants.find(v => v.id === slot.variantId)
          return {
            id: slot.id,
            block: slot.blockId,
            variant: slot.variantId,
            variantLabel: variant?.label || slot.variantId,
            blockName: block?.name || slot.blockId,
            order: slot.order,
            colSpan: slot.colSpan,
            offset: slot.offsetCols,
            spacing: {
              top: SPACING_VALUES[slot.paddingTop],
              bottom: SPACING_VALUES[slot.paddingBottom],
              x: SPACING_VALUES[slot.paddingX],
            },
            layout: {
              display: slot.display,
              flexDir: slot.flexDir,
              align: slot.alignItems,
              justify: slot.justifyContent,
              gap: SPACING_VALUES[slot.gap],
            },
            shadcnComponents: block?.shadcnComponents || [],
            radixPrimitives: block?.radixPrimitives || [],
            breakpoints: slot.breakpoints,
            locked: slot.locked,
            approved: slot.approved,
            notes: slot.notes,
          }
        }),
      })),
    }
  },

  exportDesignMdSection: (): string => {
    const { pages } = get()
    const tokens = useTokensStore.getState().tokens

    const lines: string[] = [
      '## Layout System',
      '',
      '### Grid',
      '',
      '```',
      `base-grid: 12 columns`,
      `container-max-width: 1280px`,
      `container-padding: ${SPACING_VALUES['md']}`,
      '```',
      '',
      '### Spacing Scale',
      '',
      '```',
      ...Object.entries(tokens.spacing).filter(([k]) => k !== 'baseUnit').map(([k, v]) => `spacing-${k}: ${v}`),
      '```',
      '',
      '### Page Layouts',
      '',
    ]

    pages.forEach(page => {
      lines.push(`#### ${page.pageName} (\`${page.pageRoute}\`)`)
      lines.push('')
      lines.push(`| # | Block | Variant | ColSpan | Padding T/B |`)
      lines.push(`|---|-------|---------|---------|-------------|`)
      page.slots.forEach((slot, i) => {
        const block = COMPONENT_LIBRARY.find(b => b.id === slot.blockId)
        lines.push(`| ${i + 1} | ${block?.name || slot.blockId} | ${slot.variantId} | ${slot.colSpan}/12 | ${slot.paddingTop} / ${slot.paddingBottom} |`)
      })
      lines.push('')
      lines.push(`Status: ${page.lockedAt ? `🔒 Locked at ${new Date(page.lockedAt).toLocaleDateString()}` : '⏳ In progress'}`)
      lines.push('')
    })

    return lines.join('\n')
  },
}))
