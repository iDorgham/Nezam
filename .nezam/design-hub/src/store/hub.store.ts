'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { uid, setByPath } from '@/lib/utils'
import type { ArchPage, ArchProfileId } from '@/types/arch'
import type { DesignTokens, TokenCategory, DesignProfileId } from '@/types/design'
import type { ComponentGroup } from '@/data/components-library'
import { ARCH_PROFILES_MAP } from '@/data/arch-profiles'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'

// ─── Hub section ─────────────────────────────────────────────────────────────

export type HubSection = 'architecture' | 'design' | 'preview' | 'components'

// ─── Architecture state ───────────────────────────────────────────────────────

interface ArchState {
  pages: Record<string, ArchPage>
  selectedPageId: string | null
  activeProfileId: ArchProfileId | null
}

// ─── Design state ─────────────────────────────────────────────────────────────

interface DesignState {
  tokens: DesignTokens
  selectedCategory: TokenCategory
  activeProfileId: DesignProfileId | null
  showPreviewStrip: boolean
}

// ─── Preview state ────────────────────────────────────────────────────────────

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

interface PreviewState {
  selectedPageId: string | null
  device: PreviewDevice
}

// ─── Components state ─────────────────────────────────────────────────────────

interface CompState {
  /** Currently selected component group filter, null = show all. */
  selectedGroup: ComponentGroup | null
  /** Search query string. */
  query: string
}

// ─── Onboarding state ─────────────────────────────────────────────────────────

interface OnboardingState {
  completed: boolean
  /** 0 = welcome, 1 = architecture, 2 = design */
  step: number
}

// ─── Root store ───────────────────────────────────────────────────────────────

interface HubStore {
  section: HubSection
  arch: ArchState
  design: DesignState
  preview: PreviewState
  comp: CompState
  onboarding: OnboardingState
  /** Sections the user has visited at least once — drives progress bar. */
  visitedSections: HubSection[]

  // ── Section ──
  setSection(s: HubSection): void

  // ── Architecture actions ──
  archAddPage(parentId: string | null): void
  archDeletePage(id: string): void
  archUpdatePage(id: string, patch: Partial<ArchPage>): void
  archSelectPage(id: string | null): void
  archApplyProfile(profileId: ArchProfileId): void

  // ── Design actions ──
  designSetToken(path: string, value: string | number): void
  designSetCategory(cat: TokenCategory): void
  designApplyProfile(profileId: DesignProfileId): void
  designTogglePreviewStrip(): void

  // ── Preview actions ──
  previewSelectPage(id: string | null): void
  previewSetDevice(device: PreviewDevice): void

  // ── Components actions ──
  compSetGroup(group: ComponentGroup | null): void
  compSetQuery(query: string): void

  // ── Onboarding actions ──
  onboardingSetStep(step: number): void
  onboardingComplete(): void
  onboardingReset(): void
}

// ─── Helper: derive next order among siblings ──────────────────────────────

function nextOrder(pages: Record<string, ArchPage>, parentId: string | null): number {
  return Object.values(pages).filter((p) => p.parentId === parentId).length
}

// ─── Helper: collect ID + all descendants ────────────────────────────────────

function collectDescendants(pages: Record<string, ArchPage>, id: string): string[] {
  const result: string[] = []
  const stack = [id]
  while (stack.length > 0) {
    const cur = stack.pop()!
    result.push(cur)
    Object.values(pages)
      .filter((p) => p.parentId === cur)
      .forEach((p) => stack.push(p.id))
  }
  return result
}

// ─── Store definition ─────────────────────────────────────────────────────────

export const useHub = create<HubStore>()(
  persist(
    immer((set) => ({
      section: 'architecture' as HubSection,
      visitedSections: ['architecture'] as HubSection[],

      onboarding: {
        completed: false,
        step: 0,
      },

      arch: {
        pages: {},
        selectedPageId: null,
        activeProfileId: null,
      },

      design: {
        tokens: DESIGN_PROFILES_MAP['minimal'].tokens,
        selectedCategory: 'colors',
        activeProfileId: 'minimal',
        showPreviewStrip: true,
      },

      preview: {
        selectedPageId: null,
        device: 'desktop',
      },

      comp: {
        selectedGroup: null,
        query: '',
      },

      // ── Section ──────────────────────────────────────────────────────────────
      setSection: (s) =>
        set((state) => {
          state.section = s
          if (!state.visitedSections.includes(s)) {
            state.visitedSections.push(s)
          }
        }),

      // ── Architecture ─────────────────────────────────────────────────────────
      archAddPage: (parentId) =>
        set((state) => {
          const id = uid('pg')
          const order = nextOrder(state.arch.pages, parentId)
          state.arch.pages[id] = {
            id,
            name: 'New Page',
            route: '/new-page',
            parentId,
            order,
            type: 'page',
            navSlot: parentId ? 'sidebar' : 'topnav',
            icon: 'FileText',
            description: '',
          }
          state.arch.selectedPageId = id
        }),

      archDeletePage: (id) =>
        set((state) => {
          const toDelete = collectDescendants(state.arch.pages, id)
          toDelete.forEach((pid) => delete state.arch.pages[pid])
          if (state.arch.selectedPageId && toDelete.includes(state.arch.selectedPageId)) {
            state.arch.selectedPageId = null
          }
        }),

      archUpdatePage: (id, patch) =>
        set((state) => {
          if (state.arch.pages[id]) {
            Object.assign(state.arch.pages[id], patch)
          }
        }),

      archSelectPage: (id) =>
        set((state) => {
          state.arch.selectedPageId = id
        }),

      archApplyProfile: (profileId) =>
        set((state) => {
          const profile = ARCH_PROFILES_MAP[profileId]
          if (!profile) return
          state.arch.pages = {}
          profile.pages.forEach((pg) => {
            state.arch.pages[pg.id] = { ...pg }
          })
          state.arch.activeProfileId = profileId
          state.arch.selectedPageId = null
        }),

      // ── Design ───────────────────────────────────────────────────────────────
      designSetToken: (path, value) =>
        set((state) => {
          setByPath(state.design.tokens as unknown as Record<string, unknown>, path, value)
          state.design.activeProfileId = null
        }),

      designSetCategory: (cat) =>
        set((state) => {
          state.design.selectedCategory = cat
        }),

      designApplyProfile: (profileId) =>
        set((state) => {
          const profile = DESIGN_PROFILES_MAP[profileId]
          if (!profile) return
          state.design.tokens = profile.tokens
          state.design.activeProfileId = profileId
        }),

      designTogglePreviewStrip: () =>
        set((state) => {
          state.design.showPreviewStrip = !state.design.showPreviewStrip
        }),

      // ── Preview ──────────────────────────────────────────────────────────────
      previewSelectPage: (id) =>
        set((state) => {
          state.preview.selectedPageId = id
        }),

      previewSetDevice: (device) =>
        set((state) => {
          state.preview.device = device
        }),

      // ── Components ───────────────────────────────────────────────────────────
      compSetGroup: (group) =>
        set((state) => {
          state.comp.selectedGroup = group
        }),

      compSetQuery: (query) =>
        set((state) => {
          state.comp.query = query
        }),

      // ── Onboarding ───────────────────────────────────────────────────────────
      onboardingSetStep: (step) =>
        set((state) => {
          state.onboarding.step = step
        }),

      onboardingComplete: () =>
        set((state) => {
          state.onboarding.completed = true
        }),

      onboardingReset: () =>
        set((state) => {
          state.onboarding.completed = false
          state.onboarding.step = 0
        }),
    })),
    {
      name: 'nezam-design-hub-v5',
      partialize: (s) => ({
        section: s.section,
        arch: s.arch,
        design: s.design,
        preview: s.preview,
        onboarding: s.onboarding,
        visitedSections: s.visitedSections,
        // comp state is intentionally not persisted (ephemeral UI state)
      }),
    },
  ),
)
