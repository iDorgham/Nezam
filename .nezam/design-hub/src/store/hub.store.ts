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
import { hexToHsl, hslToHex } from '@/components/theming/color-utils'

// ─── Version ─────────────────────────────────────────────────────────────────

/** Single source of truth for the hub version badge. */
export const HUB_VERSION = 'v7'

// ─── Hub section ─────────────────────────────────────────────────────────────

export type HubSection = 'architecture' | 'design' | 'preview'

/** Sub-tabs nested under the Design System section. */
export type DesignSubTab = 'tokens' | 'components' | 'sections' | 'theming'

/** CSS variable snapshot applied to the live Preview from the Theme editor. */
export interface ThemePreviewOverride {
  /** shadcn-format light-mode CSS vars (--background, --foreground, etc.) */
  light:    Record<string, string>
  /** shadcn-format dark-mode CSS vars */
  dark:     Record<string, string>
  mode:     'light' | 'dark'
  fontSans: string
  fontMono: string
  radius:   string
  presetName: string
}

export interface SavedColorProfile {
  id:       string
  name:     string
  override: ThemePreviewOverride
  createdAt: number
}

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
  /** Active sub-tab under the Design System section. */
  subTab: DesignSubTab
}

// ─── Theme state ─────────────────────────────────────────────────────────────

interface ThemeState {
  previewOverride: ThemePreviewOverride | null
  savedProfiles:   SavedColorProfile[]
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
  theme: ThemeState
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
  /** Append pages from a template under an optional parent. Returns the new IDs. */
  archAppendPages(pages: Array<{ name: string; route: string; icon?: string }>, parentId?: string | null): void

  // ── Design actions ──
  designSetToken(path: string, value: string | number): void
  designSetCategory(cat: TokenCategory): void
  designApplyProfile(profileId: DesignProfileId): void
  designTogglePreviewStrip(): void
  designSetSubTab(tab: DesignSubTab): void

  // ── Theme actions ──
  themeApplyToPreview(override: ThemePreviewOverride): void
  themeClearPreview(): void
  themeSaveProfile(name: string, override: ThemePreviewOverride): void
  themeDeleteProfile(id: string): void

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

  // ── Undo/Redo ──
  archPast: Record<string, ArchPage>[]
  archFuture: Record<string, ArchPage>[]
  archUndo(): void
  archRedo(): void

  // ── Hub UI Theme ──
  hubTheme: 'light' | 'dark'
  setHubTheme(theme: 'light' | 'dark'): void

  // ── Export modal ──
  exportModalOpen: boolean
  setExportModalOpen(open: boolean): void

  // ── Sections filter ──
  sectionsCategory: string | null
  sectionsQuery: string
  setSectionsCategory(cat: string | null): void
  setSectionsQuery(q: string): void
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

// ─── Undo/Redo & Theming-Token Bridge Helpers ───────────────────────────────

function recordHistory(state: any) {
  state.archPast.push(JSON.parse(JSON.stringify(state.arch.pages)))
  state.archFuture = []
  if (state.archPast.length > 50) {
    state.archPast.shift()
  }
}

function generateScaleFromHex(hex: string): any {
  const hsl = hexToHsl(hex)
  if (!hsl) {
    return {
      '50': hex, '100': hex, '200': hex, '300': hex, '400': hex,
      '500': hex, '600': hex, '700': hex, '800': hex, '950': hex,
    }
  }

  const make = (l: number) => hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(0, Math.min(1, l)) })

  return {
    '50':  make(0.97),
    '100': make(0.92),
    '200': make(0.84),
    '300': make(0.74),
    '400': make(0.62),
    '500': hex,
    '600': make(hsl.l * 0.85),
    '700': make(hsl.l * 0.70),
    '800': make(hsl.l * 0.55),
    '900': make(hsl.l * 0.40),
    '950': make(hsl.l * 0.25),
  }
}

// ─── Store definition ─────────────────────────────────────────────────────────

export const useHub = create<HubStore>()(
  persist(
    immer((set) => ({
      section: 'architecture' as HubSection,
      visitedSections: ['architecture'] as HubSection[],
      hubTheme: 'dark' as 'light' | 'dark',
      archPast: [] as Record<string, ArchPage>[],
      archFuture: [] as Record<string, ArchPage>[],
      exportModalOpen: false,
      sectionsCategory: null as string | null,
      sectionsQuery: '',

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
        subTab: 'tokens' as DesignSubTab,
      },

      theme: {
        previewOverride: null,
        savedProfiles:   [],
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
          recordHistory(state)
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
          recordHistory(state)
          const parentId = state.arch.pages[id]?.parentId ?? null
          const toDelete = collectDescendants(state.arch.pages, id)
          toDelete.forEach((pid) => delete state.arch.pages[pid])
          if (state.arch.selectedPageId && toDelete.includes(state.arch.selectedPageId)) {
            state.arch.selectedPageId = null
          }
          // Re-index sibling orders
          const siblings = Object.values(state.arch.pages)
            .filter((p) => p.parentId === parentId)
            .sort((a, b) => a.order - b.order)
          siblings.forEach((p, idx) => {
            p.order = idx
          })
        }),

      archUpdatePage: (id, patch) =>
        set((state) => {
          recordHistory(state)
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
          recordHistory(state)
          const profile = ARCH_PROFILES_MAP[profileId]
          if (!profile) return
          state.arch.pages = {}
          profile.pages.forEach((pg) => {
            state.arch.pages[pg.id] = { ...pg }
          })
          state.arch.activeProfileId = profileId
          state.arch.selectedPageId = null
        }),

      archAppendPages: (pages, parentId = null) =>
        set((state) => {
          recordHistory(state)
          let base = nextOrder(state.arch.pages, parentId)
          pages.forEach((pg, i) => {
            const id = uid('pg')
            state.arch.pages[id] = {
              id,
              name: pg.name,
              route: pg.route,
              parentId,
              order: base + i,
              type: 'page',
              navSlot: parentId ? 'sidebar' : 'topnav',
              icon: pg.icon ?? 'FileText',
              description: '',
            }
          })
        }),

      // ── Undo/Redo actions ──
      archUndo: () =>
        set((state) => {
          if (state.archPast.length === 0) return
          const current = JSON.parse(JSON.stringify(state.arch.pages))
          const prev = state.archPast.pop()!
          state.archFuture.push(current)
          state.arch.pages = prev
          state.arch.selectedPageId = null
        }),

      archRedo: () =>
        set((state) => {
          if (state.archFuture.length === 0) return
          const current = JSON.parse(JSON.stringify(state.arch.pages))
          const next = state.archFuture.pop()!
          state.archPast.push(current)
          state.arch.pages = next
          state.arch.selectedPageId = null
        }),

      // ── Hub UI Theme actions ──
      setHubTheme: (theme) =>
        set((state) => {
          state.hubTheme = theme
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

      designSetSubTab: (tab) =>
        set((state) => {
          state.design.subTab = tab
        }),

      // ── Theme ─────────────────────────────────────────────────────────────────
      themeApplyToPreview: (override) =>
        set((state) => {
          state.theme.previewOverride = override

          // BRIDGE: map HSL theme preset properties back to Design Tokens colors!
          const mode = override.mode
          const vars = override[mode]
          if (vars) {
            const colors = state.design.tokens.colors
            colors.mode = mode

            if (vars.background) {
              colors.surface.bg = vars.background
            }
            if (vars.foreground) {
              colors.text.primary = vars.foreground
            }
            if (vars.primary) {
              colors.brand = generateScaleFromHex(vars.primary)
            }
            if (vars.accent) {
              colors.accent = generateScaleFromHex(vars.accent)
            }
            if (vars.card) {
              colors.surface.panel = vars.card
            }
            if (vars.border) {
              colors.surface.border = vars.border
            }
            if (vars.muted) {
              colors.text.muted = vars.muted
            }
            if (vars['accent-foreground']) {
              colors.text.secondary = vars['accent-foreground']
            }
          }
        }),

      themeClearPreview: () =>
        set((state) => {
          state.theme.previewOverride = null
        }),

      themeSaveProfile: (name, override) =>
        set((state) => {
          const id = uid('profile')
          state.theme.savedProfiles.push({ id, name, override, createdAt: Date.now() })
        }),

      themeDeleteProfile: (id) =>
        set((state) => {
          state.theme.savedProfiles = state.theme.savedProfiles.filter((p) => p.id !== id)
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

      // ── Export modal ─────────────────────────────────────────────────────────
      setExportModalOpen: (open) =>
        set((state) => {
          state.exportModalOpen = open
        }),

      // ── Sections ─────────────────────────────────────────────────────────────
      setSectionsCategory: (cat) =>
        set((state) => {
          state.sectionsCategory = cat
        }),

      setSectionsQuery: (q) =>
        set((state) => {
          state.sectionsQuery = q
        }),
    })),
    {
      name: 'nezam-design-hub-v7',
      partialize: (s) => ({
        section: s.section,
        arch: s.arch,
        design: s.design,
        theme: s.theme,
        preview: s.preview,
        onboarding: s.onboarding,
        visitedSections: s.visitedSections,
        hubTheme: s.hubTheme,
        // comp state & past/future stacks are intentionally not persisted
      }),
    },
  ),
)
