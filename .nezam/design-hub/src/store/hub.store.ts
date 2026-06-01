'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { uid, setByPath } from '@/lib/utils'
import type { AddableArchType, ArchPage, ArchProfileId } from '@/types/arch'
import {
  addableToArchType,
  createArchPageDefaults,
  inferChildTypeFromParent,
  validateArchParentChild,
} from '@/lib/arch/arch-node'
import type { DesignTokens, TokenCategory, DesignProfileId } from '@/types/design'
import type { ComponentGroup } from '@/data/components-library'
import {
  COMP_CARD_SCALE_DEFAULT,
  COMP_GRID_COLUMNS_DEFAULT,
  clampCardScale,
  clampGridColumns,
} from '@/store/comp-grid'
import { ARCH_PROFILES_MAP } from '@/data/arch-profiles'
import { getCatalogProvider } from '@/lib/arch/service-catalog'
import { migrateLegacyNavMenus } from '@/lib/arch/migrate-legacy-nav-menus'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  buildPreviewOverrideFromSnapshot,
  buildThemeEditorSnapshot,
  type ThemeEditorSnapshot,
} from '@/lib/design-to-theme'
import { applyThemeVarsToTokens } from '@/lib/theme-bridge-map'
import {
  diffFlatTokens,
  flattenTokens,
  type TokenDiff,
} from '@/lib/design/token-flattener'

export type { ThemeEditorSnapshot } from '@/lib/design-to-theme'
export type { TokenDiff } from '@/lib/design/token-flattener'

// ─── Version ─────────────────────────────────────────────────────────────────

/** Single source of truth for the hub version badge. */
export const HUB_VERSION = 'v8'

const SIDEBAR_MIN = 200
const SIDEBAR_MAX = 450

// ─── Hub section ─────────────────────────────────────────────────────────────

export type HubSection =
  | 'architecture'
  | 'wireframes'
  | 'design'
  | 'components'
  | 'theming'
  | 'preview'

/** Sub-tabs nested under the Design System section. */
export type DesignSubTab = 'tokens'

export type PreviewSubTab = 'preview' | 'sections'

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
  /** Selected rack service instance (mutually exclusive with selectedPageId). */
  selectedServiceId: string | null
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
  /** Theme editor UI + preview, synced from onboarding / Design profile apply. */
  editorSnapshot: ThemeEditorSnapshot | null
}

// ─── Preview state ────────────────────────────────────────────────────────────

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

export interface CommentPin {
  id: string
  pageId: string
  x: number // percentage
  y: number // percentage
  author: string
  text: string
  createdAt: number
}

export interface PreviewLayerState {
  order: string[]
  hidden: string[]
  locked: string[]
}

interface PreviewState {
  selectedPageId: string | null
  device: PreviewDevice
  /** Preview-only text direction for the rendered page. */
  rtl: boolean
  comments: CommentPin[]
  isAddingComment: boolean
  subTab: PreviewSubTab
  layerStateByPage: Record<string, PreviewLayerState>
}

// ─── Components state ─────────────────────────────────────────────────────────

interface CompState {
  /** Currently selected component group filter, null = show all. */
  selectedGroup: ComponentGroup | null
  /** Search query string. */
  query: string
  /** Fixed column count for the component catalog grid (2–6). */
  gridColumns: number
  /** Preview/card scale multiplier (0.75–1.35). */
  cardScale: number
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
  /** ISO timestamp when the user last clicked "Lock & Export" in the hub. */
  lockedAt: string | null
  /** Sections the user has visited at least once — drives tab underline styling. */
  visitedSections: HubSection[]
  /** Sections that met completion criteria — drives progress ratio. */
  completedSections: HubSection[]
  /** Non-persisted diff after applying a design profile. */
  tokenDiff: TokenDiff | null
  /** ISO timestamp of last successful Figma variable sync. */
  figmaSyncedAt: string | null

  // ── Section ──
  setSection(s: HubSection): void
  markSectionComplete(section: HubSection): void
  clearTokenDiff(): void

  // ── Architecture actions ──
  archAddNode(kind: AddableArchType, parentId: string | null): { ok: true; id: string } | { ok: false; reason: string }
  archAddPage(parentId: string | null): void
  archDeletePage(id: string): void
  archUpdatePage(id: string, patch: Partial<ArchPage>): void
  archSelectPage(id: string | null): void
  archSelectService(id: string | null): void
  archAddServiceFromCatalog(providerId: string): { ok: true; id: string } | { ok: false; reason: string }
  archTogglePageServiceWire(pageId: string, serviceInstanceId: string): void
  archApplyProfile(profileId: ArchProfileId, selectedPageIds?: string[]): void
  /** Append pages from a template under an optional parent. Returns the new IDs. */
  archAppendPages(pages: Array<{ name: string; route: string; icon?: string }>, parentId?: string | null): void
  /** Bulk hydrate pages from `project_context.json` (Phase 3). */
  archHydratePages(pages: ArchPage[]): void

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
  previewSetRtl(rtl: boolean): void
  previewAddComment(pageId: string, x: number, y: number, text: string, author: string): void
  previewDeleteComment(id: string): void
  previewSetIsAddingComment(isAdding: boolean): void
  previewSetSubTab(tab: PreviewSubTab): void
  previewSetLayerOrder(pageId: string, order: string[]): void
  previewToggleLayerHidden(pageId: string, layerId: string): void
  previewToggleLayerLocked(pageId: string, layerId: string): void

  // ── Components actions ──
  compSetGroup(group: ComponentGroup | null): void
  compSetQuery(query: string): void
  compSetGridColumns(columns: number): void
  compSetCardScale(scale: number): void

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
  exportPanelOpen: boolean
  setExportPanelOpen(open: boolean): void

  // ── Sections filter ──
  sectionsCategory: string | null
  sectionsQuery: string
  setSectionsCategory(cat: string | null): void
  setSectionsQuery(q: string): void

  // ── Resizable Sidebar ──
  sidebarWidth?: number
  setSidebarWidth(width: number): void

  // ── Lock / export state ──────────────────────────────────────────────────
  setLockedAt(ts: string | null): void
  setFigmaSyncedAt(iso: string | null): void
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

function markSectionComplete(state: { completedSections: HubSection[] }, section: HubSection) {
  if (!state.completedSections.includes(section)) {
    state.completedSections.push(section)
  }
}

function maybeCompleteArchitecture(state: { arch: ArchState; completedSections: HubSection[] }) {
  if (Object.keys(state.arch.pages).length > 0) {
    markSectionComplete(state, 'architecture')
  }
}

// ─── Store definition ─────────────────────────────────────────────────────────

export const useHub = create<HubStore>()(
  persist(
    immer((set, get) => ({
      section: 'architecture' as HubSection,
      visitedSections: ['architecture'] as HubSection[],
      completedSections: [] as HubSection[],
      tokenDiff: null as TokenDiff | null,
      figmaSyncedAt: null as string | null,
      hubTheme: 'dark' as 'light' | 'dark',
      archPast: [] as Record<string, ArchPage>[],
      archFuture: [] as Record<string, ArchPage>[],
      exportModalOpen: false,
      exportPanelOpen: false,
      sectionsCategory: null as string | null,
      sidebarWidth: 240,
      sectionsQuery: '',

      onboarding: {
        completed: false,
        step: 0,
      },

      lockedAt: null,

      arch: {
        pages: {},
        selectedPageId: null,
        selectedServiceId: null,
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
        editorSnapshot: null,
      },

      preview: {
        selectedPageId: null,
        device: 'desktop',
        rtl: false,
        comments: [] as CommentPin[],
        isAddingComment: false,
        subTab: 'preview' as PreviewSubTab,
        layerStateByPage: {},
      },

      comp: {
        selectedGroup: null,
        query: '',
        gridColumns: COMP_GRID_COLUMNS_DEFAULT,
        cardScale: COMP_CARD_SCALE_DEFAULT,
      },

      // ── Section ──────────────────────────────────────────────────────────────
      setSection: (s) =>
        set((state) => {
          state.section = s
          if (!state.visitedSections.includes(s)) {
            state.visitedSections.push(s)
          }
          if (s === 'components') {
            markSectionComplete(state, 'components')
          }
          if (s === 'preview') {
            state.preview.subTab = 'preview'
          }
        }),

      markSectionComplete: (section) =>
        set((state) => {
          markSectionComplete(state, section)
        }),

      clearTokenDiff: () =>
        set((state) => {
          state.tokenDiff = null
        }),

      setFigmaSyncedAt: (iso) =>
        set((state) => {
          state.figmaSyncedAt = iso
        }),

      // ── Architecture ─────────────────────────────────────────────────────────
      archAddNode: (kind, parentId) => {
        const pages = get().arch.pages
        const childType = addableToArchType(kind)
        const resolvedParentId =
          kind === 'service' || kind === 'application' ? null : parentId
        const parent =
          resolvedParentId && pages[resolvedParentId]
            ? pages[resolvedParentId]
            : null
        const validation = validateArchParentChild(
          kind === 'service' || kind === 'application' ? null : parent,
          childType,
        )
        if (!validation.ok) return validation

        const id = uid('pg')
        set((state) => {
          recordHistory(state)
          const order = nextOrder(state.arch.pages, resolvedParentId)
          state.arch.pages[id] = createArchPageDefaults(
            id,
            childType,
            resolvedParentId,
            order,
            parent,
          )
          state.arch.selectedPageId = id
          state.arch.selectedServiceId = null
          maybeCompleteArchitecture(state)
        })
        return { ok: true as const, id }
      },

      archAddServiceFromCatalog: (providerId) => {
        const provider = getCatalogProvider(providerId)
        if (!provider) {
          return { ok: false as const, reason: 'Unknown service provider.' }
        }
        const id = uid('pg')
        set((state) => {
          recordHistory(state)
          const order = nextOrder(state.arch.pages, null)
          const page = createArchPageDefaults(id, 'service', null, order, null)
          page.name = provider.name
          page.icon = 'Server'
          page.route = `/api/${provider.id}`
          page.serviceKind = provider.serviceKind
          page.serviceProviderId = provider.id
          page.description = provider.description
          state.arch.pages[id] = page
          state.arch.selectedServiceId = id
          state.arch.selectedPageId = null
          maybeCompleteArchitecture(state)
        })
        return { ok: true as const, id }
      },

      archAddPage: (parentId) =>
        set((state) => {
          recordHistory(state)
          const parent =
            parentId && state.arch.pages[parentId]
              ? state.arch.pages[parentId]
              : null
          const childType = inferChildTypeFromParent(parent)
          const validation = validateArchParentChild(parent, childType)
          if (!validation.ok) return

          const id = uid('pg')
          const order = nextOrder(state.arch.pages, parentId)
          state.arch.pages[id] = createArchPageDefaults(
            id,
            childType,
            parentId,
            order,
            parent,
          )
          state.arch.selectedPageId = id
          maybeCompleteArchitecture(state)
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
          if (state.arch.selectedServiceId && toDelete.includes(state.arch.selectedServiceId)) {
            state.arch.selectedServiceId = null
          }
          // Remove deleted service instances from page wires
          Object.values(state.arch.pages).forEach((p) => {
            if (p.wiredServiceIds?.length) {
              p.wiredServiceIds = p.wiredServiceIds.filter((sid) => !toDelete.includes(sid))
            }
          })
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
          if (id) state.arch.selectedServiceId = null
        }),

      archSelectService: (id) =>
        set((state) => {
          state.arch.selectedServiceId = id
          if (id) state.arch.selectedPageId = null
        }),

      archTogglePageServiceWire: (pageId, serviceInstanceId) =>
        set((state) => {
          const page = state.arch.pages[pageId]
          const svc = state.arch.pages[serviceInstanceId]
          if (!page || page.type === 'service' || !svc || svc.type !== 'service') return
          recordHistory(state)
          const current = page.wiredServiceIds ?? []
          const has = current.includes(serviceInstanceId)
          page.wiredServiceIds = has
            ? current.filter((x) => x !== serviceInstanceId)
            : [...current, serviceInstanceId]
          page.services = undefined
        }),

      archApplyProfile: (profileId, selectedPageIds) =>
        set((state) => {
          recordHistory(state)
          const profile = ARCH_PROFILES_MAP[profileId]
          if (!profile) return
          state.arch.pages = {}
          profile.pages.forEach((pg) => {
            if (!selectedPageIds || selectedPageIds.includes(pg.id)) {
              // Backward compatibility mapping for old fields to new 5-level hierarchy
              let mappedType = pg.type
              let services = pg.services || []
              
              if (pg.type === 'group') {
                if (!pg.parentId) {
                  mappedType = 'app'
                } else {
                  mappedType = 'navmenu'
                }
              } else if (pg.type === 'page') {
                if (pg.parentId) {
                  const parent = profile.pages.find(p => p.id === pg.parentId)
                  if (parent && parent.type === 'group' && parent.parentId) {
                    mappedType = 'page'
                  } else if (parent && parent.type === 'page') {
                    mappedType = 'subpage'
                  }
                }
              }
              
              state.arch.pages[pg.id] = {
                ...pg,
                type: mappedType,
                services,
              }
            }
          })
          state.arch.activeProfileId = profileId
          state.arch.selectedPageId = null
          state.arch.selectedServiceId = null
          maybeCompleteArchitecture(state)
        }),

      archAppendPages: (pages, parentId = null) =>
        set((state) => {
          recordHistory(state)
          let base = nextOrder(state.arch.pages, parentId)
          pages.forEach((pg, i) => {
            const id = uid('pg')
            let level: any = 'page'
            let navSlot: any = 'sidebar'
            let icon = pg.icon ?? 'FileText'

            if (!parentId) {
              level = 'app'
              navSlot = 'hidden'
              icon = pg.icon ?? 'Layers'
            } else {
              const parent = state.arch.pages[parentId]
              if (parent) {
                if (parent.type === 'app') {
                  level = 'navmenu'
                  navSlot = 'hidden'
                  icon = pg.icon ?? 'Menu'
                } else if (parent.type === 'navmenu') {
                  level = 'page'
                  navSlot = 'sidebar'
                  icon = pg.icon ?? 'FileText'
                } else if (parent.type === 'page') {
                  level = 'subpage'
                  navSlot = 'sidebar'
                  icon = pg.icon ?? 'CornerDownRight'
                } else if (parent.type === 'subpage') {
                  level = 'section'
                  navSlot = 'hidden'
                  icon = pg.icon ?? 'LayoutGrid'
                }
              }
            }

            state.arch.pages[id] = {
              id,
              name: pg.name,
              route: pg.route,
              parentId,
              order: base + i,
              type: level,
              navSlot,
              icon,
              description: '',
              services: [],
            }
          })
          maybeCompleteArchitecture(state)
        }),

      // ── Project context hydration (Phase 3) ───────────────────────────────
      archHydratePages: (pages) =>
        set((state) => {
          recordHistory(state)
          state.arch.pages = Object.fromEntries(pages.map((p) => [p.id, p]))
          state.arch.activeProfileId = null
          state.arch.selectedPageId = null
          maybeCompleteArchitecture(state)
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
          const beforeFlat = flattenTokens(state.design.tokens)
          state.design.tokens = profile.tokens
          state.design.activeProfileId = profileId
          state.tokenDiff = diffFlatTokens(beforeFlat, flattenTokens(profile.tokens))
          markSectionComplete(state, 'design')

          const snapshot = buildThemeEditorSnapshot(
            profile.tokens,
            profileId,
            profile.name,
          )
          state.theme.editorSnapshot = snapshot
          state.theme.previewOverride = buildPreviewOverrideFromSnapshot(snapshot)
          state.hubTheme = snapshot.defaultMode
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
          const mode = override.mode
          const vars = override[mode]
          if (vars) {
            applyThemeVarsToTokens(state.design.tokens, vars, mode)
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
          markSectionComplete(state, 'theming')
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
          markSectionComplete(state, 'preview')
        }),

      previewSetRtl: (rtl) =>
        set((state) => {
          state.preview.rtl = rtl
        }),

      previewAddComment: (pageId, x, y, text, author) =>
        set((state) => {
          const id = uid('comment')
          if (!state.preview.comments) {
            state.preview.comments = []
          }
          state.preview.comments.push({
            id,
            pageId,
            x,
            y,
            text,
            author: author.trim() || 'Anonymous',
            createdAt: Date.now(),
          })
          state.preview.isAddingComment = false
        }),

      previewDeleteComment: (id) =>
        set((state) => {
          if (state.preview.comments) {
            state.preview.comments = state.preview.comments.filter((c) => c.id !== id)
          }
        }),

      previewSetIsAddingComment: (isAdding) =>
        set((state) => {
          state.preview.isAddingComment = isAdding
        }),

      previewSetSubTab: (tab) =>
        set((state) => {
          state.preview.subTab = tab
        }),

      previewSetLayerOrder: (pageId, order) =>
        set((state) => {
          if (!state.preview.layerStateByPage) state.preview.layerStateByPage = {}
          const current = state.preview.layerStateByPage[pageId] ?? {
            order: [],
            hidden: [],
            locked: [],
          }
          state.preview.layerStateByPage[pageId] = {
            ...current,
            order: [...order],
          }
        }),

      previewToggleLayerHidden: (pageId, layerId) =>
        set((state) => {
          if (!state.preview.layerStateByPage) state.preview.layerStateByPage = {}
          const current = state.preview.layerStateByPage[pageId] ?? {
            order: [],
            hidden: [],
            locked: [],
          }
          const hidden = current.hidden.includes(layerId)
            ? current.hidden.filter((id) => id !== layerId)
            : [...current.hidden, layerId]
          state.preview.layerStateByPage[pageId] = { ...current, hidden }
        }),

      previewToggleLayerLocked: (pageId, layerId) =>
        set((state) => {
          if (!state.preview.layerStateByPage) state.preview.layerStateByPage = {}
          const current = state.preview.layerStateByPage[pageId] ?? {
            order: [],
            hidden: [],
            locked: [],
          }
          const locked = current.locked.includes(layerId)
            ? current.locked.filter((id) => id !== layerId)
            : [...current.locked, layerId]
          state.preview.layerStateByPage[pageId] = { ...current, locked }
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

      compSetGridColumns: (columns) =>
        set((state) => {
          state.comp.gridColumns = clampGridColumns(columns)
        }),

      compSetCardScale: (scale) =>
        set((state) => {
          state.comp.cardScale = clampCardScale(scale)
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

      setExportPanelOpen: (open) =>
        set((state) => {
          state.exportPanelOpen = open
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

      // ── Resizable Sidebar ──
      setSidebarWidth: (width) =>
        set((state) => {
          state.sidebarWidth = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, width))
        }),

      // ── Lock / export state ──
      setLockedAt: (ts) =>
        set((state) => {
          state.lockedAt = ts
          if (ts) markSectionComplete(state, 'wireframes')
        }),
    })),
    {
      name: 'nezam-design-hub-v7',
      version: 6,
      partialize: (s) => ({
        section: s.section,
        arch: s.arch,
        design: s.design,
        theme: s.theme,
        preview: s.preview,
        comp: { gridColumns: s.comp.gridColumns, cardScale: s.comp.cardScale },
        onboarding: s.onboarding,
        visitedSections: s.visitedSections,
        completedSections: s.completedSections,
        hubTheme: s.hubTheme,
        sidebarWidth: s.sidebarWidth,
        lockedAt: s.lockedAt,
        figmaSyncedAt: s.figmaSyncedAt,
      }),
      migrate: (persisted: any, version: number) => {
        // v0 = pre-v7 (no version field), v1 = v7 initial, v2 = v8 expansion
        if (version < 2 && persisted?.design?.tokens) {
          const defaults = DESIGN_PROFILES_MAP['minimal'].tokens
          const tokens = persisted.design.tokens
          for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
            if (!(key in tokens)) {
              tokens[key] = defaults[key]
            }
          }
          // Deep-merge nested fields that were expanded
          if (tokens.shadows) {
            if (!('inner' in tokens.shadows)) tokens.shadows.inner = defaults.shadows.inner
            if (!('glow' in tokens.shadows)) tokens.shadows.glow = defaults.shadows.glow
          }
          if (tokens.motion) {
            if (!('transition' in tokens.motion)) tokens.motion.transition = defaults.motion.transition
            if (!('spring' in tokens.motion)) tokens.motion.spring = defaults.motion.spring
            if (tokens.motion.duration && !('instant' in tokens.motion.duration)) {
              tokens.motion.duration.instant = defaults.motion.duration.instant
              tokens.motion.duration.slower = defaults.motion.duration.slower
            }
            if (tokens.motion.easing && !('easeIn' in tokens.motion.easing)) {
              tokens.motion.easing.easeIn = defaults.motion.easing.easeIn
              tokens.motion.easing.easeOut = defaults.motion.easing.easeOut
              tokens.motion.easing.spring = defaults.motion.easing.spring
            }
          }
          if (tokens.borders) {
            if (!('widthScale' in tokens.borders)) tokens.borders.widthScale = defaults.borders.widthScale
            if (!('divider' in tokens.borders)) tokens.borders.divider = defaults.borders.divider
            if (!('focus' in tokens.borders)) tokens.borders.focus = defaults.borders.focus
          }
          if (tokens.colors) {
            if (!('successScale' in tokens.colors)) tokens.colors.successScale = defaults.colors.successScale
            if (!('warningScale' in tokens.colors)) tokens.colors.warningScale = defaults.colors.warningScale
            if (!('errorScale' in tokens.colors)) tokens.colors.errorScale = defaults.colors.errorScale
            if (!('infoScale' in tokens.colors)) tokens.colors.infoScale = defaults.colors.infoScale
            if (!('darkSurface' in tokens.colors)) tokens.colors.darkSurface = defaults.colors.darkSurface
            if (!('darkText' in tokens.colors)) tokens.colors.darkText = defaults.colors.darkText
          }
        }
        // v3: catalog-backed services — selectedServiceId + wiredServiceIds
        if (version < 3 && persisted?.arch?.pages) {
          if (persisted.arch.selectedServiceId === undefined) {
            persisted.arch.selectedServiceId = null
          }
          const allPages = Object.values(persisted.arch.pages) as ArchPage[]
          for (const pg of allPages) {
            if (pg.type === 'service' && !pg.serviceProviderId) {
              pg.serviceProviderId = `legacy-${pg.serviceKind ?? 'api'}`
            }
            if (pg.type !== 'service' && pg.services?.length) {
              const wired: string[] = [...(pg.wiredServiceIds ?? [])]
              for (const kind of pg.services) {
                const match = allPages.find(
                  (p) => p.type === 'service' && (p.serviceKind ?? 'api') === kind,
                )
                if (match && !wired.includes(match.id)) wired.push(match.id)
              }
              pg.wiredServiceIds = wired
              pg.services = undefined
            }
            if (!pg.wiredServiceIds) pg.wiredServiceIds = []
          }
        }
        // Preview-only migration: ensure rtl exists for older persisted stores.
        if (persisted?.preview && typeof persisted.preview.rtl !== 'boolean') {
          persisted.preview.rtl = false
        }
        if (persisted?.preview?.subTab === 'components') {
          persisted.preview.subTab = 'sections'
          persisted.section = 'components'
          if (!Array.isArray(persisted.visitedSections)) {
            persisted.visitedSections = ['architecture']
          }
          if (!persisted.visitedSections.includes('components')) {
            persisted.visitedSections.push('components')
          }
        }
        // v4: sync theme editor + preview from onboarding design profile
        if (version < 4) {
          if (!persisted.theme) persisted.theme = {}
          if (persisted.theme.editorSnapshot === undefined) {
            persisted.theme.editorSnapshot = null
          }
          const profileId = persisted.design?.activeProfileId as DesignProfileId | undefined
          if (!persisted.theme.editorSnapshot && profileId && DESIGN_PROFILES_MAP[profileId]) {
            const profile = DESIGN_PROFILES_MAP[profileId]
            const snapshot = buildThemeEditorSnapshot(
              profile.tokens,
              profileId,
              profile.name,
            )
            persisted.theme.editorSnapshot = snapshot
            persisted.theme.previewOverride = buildPreviewOverrideFromSnapshot(snapshot)
            if (profile.tokens.colors.mode === 'dark' || profile.tokens.colors.mode === 'light') {
              persisted.hubTheme = profile.tokens.colors.mode
            }
          }
        }
        // v5: merge legacy Top/Sidebar navmenu nodes into Main Navigation per app
        if (version < 5 && persisted?.arch?.pages) {
          migrateLegacyNavMenus(persisted.arch.pages)
        }
        // v6: persist component grid prefs + completion / Figma sync metadata
        if (version < 6) {
          if (!persisted.comp) {
            persisted.comp = {
              gridColumns: COMP_GRID_COLUMNS_DEFAULT,
              cardScale: COMP_CARD_SCALE_DEFAULT,
            }
          }
          if (!Array.isArray(persisted.completedSections)) {
            persisted.completedSections = []
          }
          if (persisted.figmaSyncedAt === undefined) {
            persisted.figmaSyncedAt = null
          }
        }
        return persisted
      },
    },
  ),
)
