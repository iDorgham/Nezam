'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AnimProperty,
  ArchetypeKind,
  Block,
  BlockKind,
  BuilderMode,
  Comment,
  Device,
  Direction,
  HistoryEntry,
  Keyframe,
  NodeStyle,
  PageStyle,
  Profile,
  ResolvedTokens,
  SavedDesign,
  Selection,
  SelectionScope,
  ThemeMode,
  TimelineState,
  Tool,
  PageTab,
  SiteSettings,
  SitemapNode,
} from '@/types'
import { PROFILES, DEFAULT_PROFILE_ID } from '@/data/profiles'
import { ARCHETYPES, DEFAULT_ARCHETYPE_ID, buildBlocks, makeBlock, defaultContent } from '@/data/archetypes'
import { resolveTokens } from '@/lib/tokens'
import { generateProfile } from '@/lib/ai'

const uid = () => Math.random().toString(36).slice(2, 9)

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])
  return newArray
}

/** Debounced history commit so a burst of slider drags collapses to one entry. */
let commitTimer: ReturnType<typeof setTimeout> | undefined
function scheduleCommit(commit: (label: string) => void, label: string) {
  clearTimeout(commitTimer)
  commitTimer = setTimeout(() => commit(label), 700)
}

export interface BlockMeta {
  locked: boolean
  desktop: boolean
  mobile: boolean
}
const DEFAULT_META: BlockMeta = { locked: false, desktop: true, mobile: true }

function defaultTimeline(): TimelineState {
  return {
    duration: 2.4,
    playhead: 0,
    playing: false,
    stagger: 0.08,
    scrollTrigger: false,
    tracks: [
      {
        id: uid(),
        target: 'hero',
        label: 'Hero',
        keyframes: [
          { id: uid(), at: 0, property: 'opacity', from: 0, to: 1 },
          { id: uid(), at: 0.15, property: 'y', from: 24, to: 0 },
        ],
      },
      {
        id: uid(),
        target: 'card',
        label: 'Cards',
        keyframes: [
          { id: uid(), at: 0.3, property: 'opacity', from: 0, to: 1 },
          { id: uid(), at: 0.35, property: 'scale', from: 0.92, to: 1 },
        ],
      },
    ],
  }
}

interface HubState {
  /* design */
  profileId: string
  overrides: Partial<ResolvedTokens>
  generated: Profile[]
  theme: ThemeMode
  dir: Direction
  device: Device
  zoom: number

  /* structure */
  archetypeId: ArchetypeKind
  blocks: Block[]
  blockMeta: Record<string, BlockMeta>
  nodeStyles: Record<string, NodeStyle>
  contentOverrides: Record<string, string>
  pageStyle: PageStyle

  /* multi-page, settings and menus */
  siteSettings: SiteSettings
  pages: PageTab[]
  activePageId: string
  menus: { headerLinks: string[]; footerColumns: { title: string; links: string[] }[] }
  copiedStyle: NodeStyle | null

  /* interaction */
  selection: Selection | null
  builderMode: BuilderMode
  activeTool: Tool
  editingNodeId: string | null
  rightW: number
  pulse: number

  /* comments */
  comments: Comment[]

  /* persistence */
  savedDesigns: SavedDesign[]
  history: HistoryEntry[]
  historyIndex: number

  timeline: TimelineState
  aiBusy: boolean
}

interface HubActions {
  getProfile: () => Profile
  getAllProfiles: () => Profile[]
  getTokens: () => ResolvedTokens
  getBlockMeta: (id: string) => BlockMeta
  getContent: (nodeId: string, fallback: string) => string

  setProfile: (id: string) => void
  setToken: <K extends keyof ResolvedTokens>(key: K, value: ResolvedTokens[K]) => void
  resetOverrides: () => void

  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  setDir: (d: Direction) => void
  toggleDir: () => void
  setDevice: (d: Device) => void
  setZoom: (z: number) => void

  select: (sel: Selection | null) => void
  selectScope: (scope: SelectionScope) => void
  setBuilderMode: (m: BuilderMode) => void
  setTool: (t: Tool) => void
  setRightW: (w: number) => void
  firePulse: () => void

  /* node styling */
  setNodeStyle: (nodeId: string, patch: Partial<NodeStyle>) => void
  resetNodeStyle: (nodeId: string) => void
  setRawCss: (nodeId: string, css: Record<string, string>) => void
  setContent: (nodeId: string, text: string) => void
  beginEdit: (nodeId: string) => void
  endEdit: () => void
  setPageStyle: (patch: Partial<PageStyle>) => void

  /* pages, site settings, and menus actions */
  addPage: (name?: string, initialBlocks?: Block[]) => void
  closePage: (id: string) => void
  closeOtherPages: (id: string) => void
  renamePage: (id: string, name: string) => void
  duplicatePage: (id: string) => void
  reorderPages: (pages: PageTab[]) => void
  setActivePage: (id: string) => void
  updateSiteSettings: (patch: Partial<SiteSettings>) => void
  updateMenus: (patch: Partial<{ headerLinks: string[]; footerColumns: { title: string; links: string[] }[] }>) => void
  copyStyle: (nodeId: string) => void
  pasteStyle: (nodeId: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (id: string, direction: 'up' | 'down') => void
  updateBlockContent: (kind: BlockKind, patch: Record<string, any>) => void
  reorderBlocks: (blocks: Block[]) => void
  renameBlockLabel: (id: string, label: string) => void

  /* structure */
  setArchetype: (id: ArchetypeKind) => void
  addBlock: (kind: BlockKind) => void
  removeBlock: (id: string) => void
  toggleBlockLock: (id: string) => void
  toggleBlockVisible: (id: string, viewport: 'desktop' | 'mobile') => void

  /* comments */
  addComment: (nodeId: string, blockId: string, label: string) => string
  updateComment: (id: string, text: string) => void
  toggleResolveComment: (id: string) => void
  removeComment: (id: string) => void
  exportCommentsForAI: () => string

  /* saved + history */
  saveDesign: (name: string) => void
  loadSaved: (id: string) => void
  deleteSaved: (id: string) => void
  commit: (label: string) => void
  undo: () => void
  redo: () => void
  jumpHistory: (index: number) => void
  canUndo: () => boolean
  canRedo: () => boolean

  surpriseMe: () => void
  applyProfile: (p: Profile) => void
  setAiBusy: (b: boolean) => void

  /* timeline */
  addTrack: (target: string) => void
  removeTrack: (id: string) => void
  addKeyframe: (trackId: string, at: number) => void
  updateKeyframe: (trackId: string, kfId: string, patch: Partial<Keyframe>) => void
  removeKeyframe: (trackId: string, kfId: string) => void
  setPlayhead: (t: number) => void
  setPlaying: (p: boolean) => void
  setDuration: (d: number) => void
  setStagger: (s: number) => void
  toggleScrollTrigger: () => void
  applyTimelinePreset: (preset: string) => void
}

type Store = HubState & HubActions

function swatchFor(p: Profile, theme: ThemeMode): [string, string, string] {
  const c = theme === 'dark' ? p.dark : p.light
  return [c.brand, c.accent, c.surface]
}

function buildDefaultPagesForArchetype(archetypeId: ArchetypeKind): PageTab[] {
  const defaultPageBlocks: Record<string, BlockKind[]> = {
    home: ['nav', 'hero', 'stats', 'featureGrid', 'cta', 'footer'],
    marketing: ['nav', 'hero', 'featureGrid', 'cta', 'footer'],
    pricing: ['nav', 'pricing', 'cta', 'footer'],
    dashboard: ['nav', 'dashboard', 'stats', 'footer'],
    settings: ['nav', 'dashboard', 'footer'],
    contact: ['nav', 'hero', 'text', 'paragraph', 'footer'],
    app: ['nav', 'dashboard', 'stats', 'footer'],
    about: ['nav', 'hero', 'text', 'paragraph', 'footer'],
    catalog: ['nav', 'hero', 'productGrid', 'footer'],
    product: ['nav', 'hero', 'productGrid', 'cta', 'footer'],
    cart: ['nav', 'hero', 'cta', 'footer'],
    checkout: ['nav', 'hero', 'cta', 'footer'],
    vendors: ['nav', 'hero', 'vendorGrid', 'footer'],
    account: ['nav', 'hero', 'cta', 'footer'],
    posts: ['nav', 'hero', 'articleList', 'footer'],
    article: ['nav', 'hero', 'articleList', 'footer'],
    work: ['nav', 'hero', 'featureGrid', 'footer'],
  }

  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) || ARCHETYPES[0]
  const flatPages: SitemapNode[] = []
  const flatten = (nodes: SitemapNode[]) => {
    for (const node of nodes) {
      if (node.children) {
        flatten(node.children)
      } else {
        flatPages.push(node)
      }
    }
  }
  flatten(archetype.pages)

  if (flatPages.length === 0) {
    flatPages.push({ id: 'home', name: 'Home', arabicName: 'الرئيسية' })
  }

  return flatPages.map((p) => {
    const kinds = defaultPageBlocks[p.id.toLowerCase()] || archetype.blocks
    const seen: Record<string, number> = {}
    const blocks = kinds.map((kind) => {
      const n = (seen[kind] = (seen[kind] ?? 0) + 1)
      const blockId = `${p.id}-${kind}-${n}`
      return {
        id: blockId,
        kind,
        label: kind[0].toUpperCase() + kind.slice(1),
        arabicLabel: kind,
        content: defaultContent(kind),
      }
    })
    return {
      id: p.id,
      name: p.name,
      blocks,
      isUnsaved: false,
    }
  })
}

export const useHub = create<Store>()(
  persist(
    (set, get) => ({
      profileId: DEFAULT_PROFILE_ID,
      overrides: {},
      generated: [],
      theme: 'light',
      dir: 'ltr',
      device: 'desktop',
      zoom: 1,

      siteSettings: {
        name: 'Nezam Hub',
        title: 'Nezam Modern Figma-like Workspace',
        logo: '',
      },
      pages: buildDefaultPagesForArchetype(DEFAULT_ARCHETYPE_ID),
      activePageId: buildDefaultPagesForArchetype(DEFAULT_ARCHETYPE_ID)[0]?.id ?? 'home',
      menus: {
        headerLinks: ['Overview', 'Features', 'Pricing', 'Docs'],
        footerColumns: [
          { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms'] },
        ],
      },
      copiedStyle: null,

      archetypeId: DEFAULT_ARCHETYPE_ID,
      blocks: buildDefaultPagesForArchetype(DEFAULT_ARCHETYPE_ID)[0]?.blocks ?? buildBlocks(DEFAULT_ARCHETYPE_ID),
      blockMeta: {},
      nodeStyles: {},
      contentOverrides: {},
      pageStyle: { width: 1080, padding: 0 },

      selection: null,
      builderMode: 'inspector',
      activeTool: 'select',
      editingNodeId: null,
      rightW: 432,
      pulse: 0,

      comments: [],

      savedDesigns: [],
      history: [
        { id: uid(), label: 'Initial', at: Date.now(), profileId: DEFAULT_PROFILE_ID, overrides: {} },
      ],
      historyIndex: 0,

      timeline: defaultTimeline(),
      aiBusy: false,

      /* ── selectors ─────────────────────────────────────────── */
      getProfile: () => {
        const { profileId, generated } = get()
        return (
          PROFILES.find((p) => p.id === profileId) ||
          generated.find((p) => p.id === profileId) ||
          PROFILES[0]
        )
      },
      getAllProfiles: () => [...get().generated, ...PROFILES],
      getTokens: () => resolveTokens(get().getProfile(), get().theme, get().overrides),
      getBlockMeta: (id) => get().blockMeta[id] ?? DEFAULT_META,
      getContent: (nodeId, fallback) => get().contentOverrides[nodeId] ?? fallback,

      /* ── tokens ────────────────────────────────────────────── */
      setProfile: (id) => {
        if (id === get().profileId && Object.keys(get().overrides).length === 0) return
        const p = PROFILES.find((x) => x.id === id) || get().generated.find((x) => x.id === id)
        set({ profileId: id, overrides: {}, pulse: get().pulse + 1 })
        get().commit(`Profile → ${p?.name ?? id}`)
      },
      setToken: (key, value) => {
        // No pulse — token tweaks must feel instant, not re-animate the scene.
        set({ overrides: { ...get().overrides, [key]: value } })
        scheduleCommit(get().commit, `Adjusted ${String(key)}`)
      },
      resetOverrides: () => {
        if (Object.keys(get().overrides).length === 0) return
        set({ overrides: {}, pulse: get().pulse + 1 })
        get().commit('Reset to profile defaults')
      },

      setTheme: (t) => set({ theme: t, pulse: get().pulse + 1 }),
      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light', pulse: get().pulse + 1 }),
      setDir: (d) => set({ dir: d }),
      toggleDir: () => set({ dir: get().dir === 'ltr' ? 'rtl' : 'ltr' }),
      setDevice: (d) => set({ device: d }),
      setZoom: (z) => set({ zoom: Math.max(0.3, Math.min(1.6, z)) }),

      /* ── selection ─────────────────────────────────────────── */
      select: (sel) => {
        if (!sel) return set({ selection: null })
        set({ selection: sel, builderMode: 'inspector' })
      },
      selectScope: (scope) => {
        const sel = get().selection
        if (!sel) {
          if (scope === 'page') {
            set({ selection: { scope: 'page', label: 'Page', role: 'box' }, builderMode: 'inspector' })
          }
          return
        }
        set({ selection: { ...sel, scope } })
      },
      setBuilderMode: (m) => set({ builderMode: m }),
      setTool: (t) => set({ activeTool: t }),
      setRightW: (w) => set({ rightW: Math.max(360, Math.min(640, w)) }),
      firePulse: () => set({ pulse: get().pulse + 1 }),

      /* ── node styling (instant — no pulse) ─────────────────── */
      setNodeStyle: (nodeId, patch) => {
        const prev = get().nodeStyles[nodeId] ?? {}
        set({ nodeStyles: { ...get().nodeStyles, [nodeId]: { ...prev, ...patch } } })
        scheduleCommit(get().commit, 'Styled element')
      },
      resetNodeStyle: (nodeId) => {
        const next = { ...get().nodeStyles }
        delete next[nodeId]
        set({ nodeStyles: next })
      },
      setRawCss: (nodeId, css) => {
        const prev = get().nodeStyles[nodeId] ?? {}
        set({ nodeStyles: { ...get().nodeStyles, [nodeId]: { ...prev, css } } })
      },
      setContent: (nodeId, text) =>
        set({ contentOverrides: { ...get().contentOverrides, [nodeId]: text } }),
      beginEdit: (nodeId) => set({ editingNodeId: nodeId }),
      endEdit: () => set({ editingNodeId: null }),
      setPageStyle: (patch) => set({ pageStyle: { ...get().pageStyle, ...patch } }),

      /* ── pages, site settings, and menus actions ───────────── */
      addPage: (name, initialBlocks) => {
        const id = `page-${Date.now().toString(36)}`
        const pageName = name?.trim() || `Page ${get().pages.length + 1}`
        const blocks = initialBlocks || [
          makeBlock('nav', 0),
          makeBlock('hero', 1),
          makeBlock('footer', 2)
        ]
        const newPage: PageTab = { id, name: pageName, blocks, isUnsaved: true }
        set({
          pages: [...get().pages, newPage],
          activePageId: id,
          blocks,
          selection: null,
          pulse: get().pulse + 1,
        })
        get().commit(`Added page "${pageName}"`)
      },
      closePage: (id) => {
        const { pages, activePageId } = get()
        if (pages.length <= 1) return
        const nextPages = pages.filter((p) => p.id !== id)
        let nextActiveId = activePageId
        if (activePageId === id) {
          const idx = pages.findIndex((p) => p.id === id)
          const newIdx = Math.max(0, idx - 1)
          nextActiveId = nextPages[newIdx]?.id ?? 'home'
        }
        const nextActiveBlocks = nextPages.find((p) => p.id === nextActiveId)?.blocks ?? []
        set({
          pages: nextPages,
          activePageId: nextActiveId,
          blocks: nextActiveBlocks,
          selection: null,
          pulse: get().pulse + 1,
        })
      },
      closeOtherPages: (id) => {
        const { pages } = get()
        const targetPage = pages.find((p) => p.id === id)
        if (!targetPage) return
        set({
          pages: [targetPage],
          activePageId: id,
          blocks: targetPage.blocks,
          selection: null,
          pulse: get().pulse + 1,
        })
      },
      renamePage: (id, name) => {
        const nextPages = get().pages.map((p) =>
          p.id === id ? { ...p, name: name.trim() || p.name, isUnsaved: true } : p
        )
        set({ pages: nextPages })
        get().commit(`Renamed page to "${name}"`)
      },
      duplicatePage: (id) => {
        const { pages } = get()
        const target = pages.find((p) => p.id === id)
        if (!target) return
        const newId = `page-copy-${Date.now().toString(36)}`
        const newBlocks = target.blocks.map((b, idx) => ({
          ...b,
          id: `${b.kind}-${Date.now().toString(36)}-${idx}`,
        }))
        const duplicated: PageTab = {
          id: newId,
          name: `${target.name} Copy`,
          blocks: newBlocks,
          isUnsaved: true,
        }
        set({
          pages: [...pages, duplicated],
          activePageId: newId,
          blocks: newBlocks,
          selection: null,
          pulse: get().pulse + 1,
        })
        get().commit(`Duplicated page "${target.name}"`)
      },
      reorderPages: (pages) => {
        set({ pages })
      },
      setActivePage: (id) => {
        const { pages } = get()
        const target = pages.find((p) => p.id === id)
        if (!target) return
        set({
          activePageId: id,
          blocks: target.blocks,
          selection: null,
          pulse: get().pulse + 1,
        })
      },
      updateSiteSettings: (patch) => {
        set({ siteSettings: { ...get().siteSettings, ...patch } })
      },
      updateMenus: (patch) => {
        const nextMenus = { ...get().menus, ...patch }
        set({ menus: nextMenus })
        const updatedBlocks = get().blocks.map((block) => {
          if (block.kind === 'nav') {
            return {
              ...block,
              content: {
                ...block.content,
                links: nextMenus.headerLinks,
              },
            }
          }
          if (block.kind === 'footer' && nextMenus.footerColumns) {
            return {
              ...block,
              content: {
                ...block.content,
                columns: nextMenus.footerColumns,
              },
            }
          }
          return block
        })
        const nextPages = get().pages.map((p) =>
          p.id === get().activePageId ? { ...p, blocks: updatedBlocks } : p
        )
        set({ blocks: updatedBlocks, pages: nextPages })
      },
      copyStyle: (nodeId) => {
        set({ copiedStyle: get().nodeStyles[nodeId] ?? null })
      },
      pasteStyle: (nodeId) => {
        const style = get().copiedStyle
        if (style) {
          get().setNodeStyle(nodeId, style)
        }
      },
      duplicateBlock: (id) => {
        const { blocks, activePageId, pages } = get()
        const idx = blocks.findIndex((b) => b.id === id)
        if (idx === -1) return
        const source = blocks[idx]
        const newBlock = {
          ...source,
          id: `${source.kind}-${Date.now().toString(36)}-dup`,
          label: `${source.label} Copy`,
        }
        const nextBlocks = [...blocks]
        nextBlocks.splice(idx + 1, 0, newBlock)
        const nextPages = pages.map((p) =>
          p.id === activePageId ? { ...p, blocks: nextBlocks, isUnsaved: true } : p
        )
        set({ blocks: nextBlocks, pages: nextPages, pulse: get().pulse + 1 })
        get().commit(`Duplicated section "${source.label}"`)
      },
      moveBlock: (id, direction) => {
        const { blocks, activePageId, pages } = get()
        const idx = blocks.findIndex((b) => b.id === id)
        if (idx === -1) return
        const nextIdx = direction === 'up' ? idx - 1 : idx + 1
        if (nextIdx < 0 || nextIdx >= blocks.length) return
        const nextBlocks = arrayMove(blocks, idx, nextIdx)
        const nextPages = pages.map((p) =>
          p.id === activePageId ? { ...p, blocks: nextBlocks, isUnsaved: true } : p
        )
        set({ blocks: nextBlocks, pages: nextPages, pulse: get().pulse + 1 })
        get().commit(`Moved block ${direction === 'up' ? 'up' : 'down'}`)
      },
      updateBlockContent: (kind, patch) => {
        const { blocks, activePageId, pages } = get()
        const updatedBlocks = blocks.map((b) =>
          b.kind === kind ? { ...b, content: { ...b.content, ...patch } } : b
        )
        const nextPages = pages.map((p) =>
          p.id === activePageId ? { ...p, blocks: updatedBlocks, isUnsaved: true } : p
        )
        set({ blocks: updatedBlocks, pages: nextPages, pulse: get().pulse + 1 })
      },
      reorderBlocks: (blocks) => {
        const { activePageId, pages } = get()
        const nextPages = pages.map((p) =>
          p.id === activePageId ? { ...p, blocks, isUnsaved: true } : p
        )
        set({ blocks, pages: nextPages, pulse: get().pulse + 1 })
        get().commit('Reordered sections')
      },
      renameBlockLabel: (id, label) => {
        const { blocks, activePageId, pages } = get()
        const nextBlocks = blocks.map((b) =>
          b.id === id ? { ...b, label: label.trim() || b.label } : b
        )
        const nextPages = pages.map((p) =>
          p.id === activePageId ? { ...p, blocks: nextBlocks, isUnsaved: true } : p
        )
        set({ blocks: nextBlocks, pages: nextPages })
      },

      /* ── structure ─────────────────────────────────────────── */
      setArchetype: (id) => {
        if (id === get().archetypeId) return
        const archetypePages = buildDefaultPagesForArchetype(id)
        const initialBlocks = archetypePages[0]?.blocks ?? []
        set({
          archetypeId: id,
          pages: archetypePages,
          activePageId: archetypePages[0]?.id ?? 'home',
          blocks: initialBlocks,
          blockMeta: {},
          selection: null,
          pulse: get().pulse + 1,
        })
        const a = ARCHETYPES.find((x) => x.id === id)
        get().commit(`Archetype → ${a?.name ?? id}`)
      },
      addBlock: (kind) => {
        const blocks = get().blocks
        const block = makeBlock(kind, blocks.length)
        const nextBlocks = [...blocks, block]
        const nextPages = get().pages.map((p) =>
          p.id === get().activePageId ? { ...p, blocks: nextBlocks, isUnsaved: true } : p
        )
        set({
          blocks: nextBlocks,
          pages: nextPages,
          selection: { scope: 'section', blockId: block.id, nodeId: block.id, label: block.label, role: 'box' },
          builderMode: 'inspector',
          pulse: get().pulse + 1,
        })
      },
      removeBlock: (id) => {
        const sel = get().selection
        const nextBlocks = get().blocks.filter((b) => b.id !== id)
        const nextPages = get().pages.map((p) =>
          p.id === get().activePageId ? { ...p, blocks: nextBlocks, isUnsaved: true } : p
        )
        set({
          blocks: nextBlocks,
          pages: nextPages,
          selection: sel?.blockId === id ? null : sel,
          pulse: get().pulse + 1,
        })
      },
      toggleBlockLock: (id) => {
        const m = get().getBlockMeta(id)
        set({ blockMeta: { ...get().blockMeta, [id]: { ...m, locked: !m.locked } } })
      },
      toggleBlockVisible: (id, viewport) => {
        const m = get().getBlockMeta(id)
        set({ blockMeta: { ...get().blockMeta, [id]: { ...m, [viewport]: !m[viewport] } } })
      },

      /* ── comments ──────────────────────────────────────────── */
      addComment: (nodeId, blockId, label) => {
        const c: Comment = {
          id: uid(),
          nodeId,
          blockId,
          label,
          text: '',
          resolved: false,
          createdAt: Date.now(),
        }
        set({ comments: [...get().comments, c] })
        return c.id
      },
      updateComment: (id, text) =>
        set({ comments: get().comments.map((c) => (c.id === id ? { ...c, text } : c)) }),
      toggleResolveComment: (id) =>
        set({
          comments: get().comments.map((c) =>
            c.id === id ? { ...c, resolved: !c.resolved } : c,
          ),
        }),
      removeComment: (id) => set({ comments: get().comments.filter((c) => c.id !== id) }),
      exportCommentsForAI: () => {
        const { comments, nodeStyles, archetypeId } = get()
        const payload = {
          $schema: 'https://nezam.design/schema/ai-comments-v1.json',
          archetype: archetypeId,
          generatedAt: new Date().toISOString(),
          tasks: comments.map((c) => ({
            id: c.id,
            target: { nodeId: c.nodeId, blockId: c.blockId, label: c.label },
            instruction: c.text,
            status: c.resolved ? 'resolved' : 'open',
            currentStyle: nodeStyles[c.nodeId] ?? {},
          })),
        }
        return JSON.stringify(payload, null, 2)
      },

      /* ── saved designs ─────────────────────────────────────── */
      saveDesign: (name) => {
        const { profileId, overrides, theme, savedDesigns, archetypeId } = get()
        const p = get().getProfile()
        const design: SavedDesign = {
          id: uid(),
          name: name.trim() || `${p.name} mix`,
          profileId,
          overrides,
          archetypeId,
          theme,
          createdAt: Date.now(),
          swatch: swatchFor(p, theme),
        }
        set({ savedDesigns: [design, ...savedDesigns] })
      },
      loadSaved: (id) => {
        const d = get().savedDesigns.find((x) => x.id === id)
        if (!d) return
        set({
          profileId: d.profileId,
          overrides: d.overrides,
          theme: d.theme,
          archetypeId: d.archetypeId,
          blocks: buildBlocks(d.archetypeId),
          blockMeta: {},
          selection: null,
          pulse: get().pulse + 1,
        })
        get().commit(`Loaded "${d.name}"`)
      },
      deleteSaved: (id) =>
        set({ savedDesigns: get().savedDesigns.filter((x) => x.id !== id) }),

      /* ── history ───────────────────────────────────────────── */
      commit: (label) => {
        const { history, historyIndex, profileId, overrides } = get()
        const entry: HistoryEntry = {
          id: uid(),
          label,
          at: Date.now(),
          profileId,
          overrides: { ...overrides },
        }
        const trimmed = history.slice(0, historyIndex + 1)
        const next = [...trimmed, entry].slice(-60)
        set({ history: next, historyIndex: next.length - 1 })
      },
      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex <= 0) return
        const e = history[historyIndex - 1]
        set({
          historyIndex: historyIndex - 1,
          profileId: e.profileId,
          overrides: { ...e.overrides },
          pulse: get().pulse + 1,
        })
      },
      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex >= history.length - 1) return
        const e = history[historyIndex + 1]
        set({
          historyIndex: historyIndex + 1,
          profileId: e.profileId,
          overrides: { ...e.overrides },
          pulse: get().pulse + 1,
        })
      },
      jumpHistory: (index) => {
        const e = get().history[index]
        if (!e) return
        set({
          historyIndex: index,
          profileId: e.profileId,
          overrides: { ...e.overrides },
          pulse: get().pulse + 1,
        })
      },
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      /* ── ai ────────────────────────────────────────────────── */
      surpriseMe: () => get().applyProfile(generateProfile()),
      applyProfile: (p) => {
        set({
          generated: [p, ...get().generated.filter((x) => x.id !== p.id)].slice(0, 12),
          profileId: p.id,
          overrides: {},
          pulse: get().pulse + 1,
        })
        get().commit(`Generated "${p.name}"`)
      },
      setAiBusy: (b) => set({ aiBusy: b }),

      /* ── timeline ──────────────────────────────────────────── */
      addTrack: (target) => {
        const t = get().timeline
        set({
          timeline: {
            ...t,
            tracks: [
              ...t.tracks,
              {
                id: uid(),
                target,
                label: target === 'all' ? 'All elements' : target[0].toUpperCase() + target.slice(1),
                keyframes: [{ id: uid(), at: 0.2, property: 'opacity', from: 0, to: 1 }],
              },
            ],
          },
        })
      },
      removeTrack: (id) =>
        set({ timeline: { ...get().timeline, tracks: get().timeline.tracks.filter((x) => x.id !== id) } }),
      addKeyframe: (trackId, at) => {
        const t = get().timeline
        set({
          timeline: {
            ...t,
            tracks: t.tracks.map((tr) =>
              tr.id === trackId
                ? { ...tr, keyframes: [...tr.keyframes, { id: uid(), at, property: 'opacity' as AnimProperty, from: 0, to: 1 }] }
                : tr,
            ),
          },
        })
      },
      updateKeyframe: (trackId, kfId, patch) => {
        const t = get().timeline
        set({
          timeline: {
            ...t,
            tracks: t.tracks.map((tr) =>
              tr.id === trackId
                ? { ...tr, keyframes: tr.keyframes.map((k) => (k.id === kfId ? { ...k, ...patch } : k)) }
                : tr,
            ),
          },
        })
      },
      removeKeyframe: (trackId, kfId) => {
        const t = get().timeline
        set({
          timeline: {
            ...t,
            tracks: t.tracks.map((tr) =>
              tr.id === trackId ? { ...tr, keyframes: tr.keyframes.filter((k) => k.id !== kfId) } : tr,
            ),
          },
        })
      },
      setPlayhead: (v) => set({ timeline: { ...get().timeline, playhead: Math.max(0, Math.min(1, v)) } }),
      setPlaying: (p) => set({ timeline: { ...get().timeline, playing: p } }),
      setDuration: (d) => set({ timeline: { ...get().timeline, duration: Math.max(0.4, Math.min(8, d)) } }),
      setStagger: (s) => set({ timeline: { ...get().timeline, stagger: Math.max(0, Math.min(0.5, s)) } }),
      toggleScrollTrigger: () =>
        set({ timeline: { ...get().timeline, scrollTrigger: !get().timeline.scrollTrigger } }),
      applyTimelinePreset: (preset) => {
        set({ timeline: { ...buildPreset(preset), playhead: 0, playing: false } })
      },
    }),
    {
      name: 'nezam-design-hub-v2',
      version: 3,
      partialize: (s) => ({
        profileId: s.profileId,
        overrides: s.overrides,
        generated: s.generated,
        theme: s.theme,
        dir: s.dir,
        device: s.device,
        rightW: s.rightW,
        archetypeId: s.archetypeId,
        blocks: s.blocks,
        blockMeta: s.blockMeta,
        nodeStyles: s.nodeStyles,
        contentOverrides: s.contentOverrides,
        pageStyle: s.pageStyle,
        comments: s.comments,
        savedDesigns: s.savedDesigns,
        timeline: s.timeline,
        siteSettings: s.siteSettings,
        pages: s.pages,
        activePageId: s.activePageId,
        menus: s.menus,
      }),
    },
  ),
)

/* ── Timeline presets ──────────────────────────────────────────── */

function buildPreset(preset: string): TimelineState {
  const base = defaultTimeline()
  const t = (target: string, label: string, kfs: Omit<Keyframe, 'id'>[]) => ({
    id: uid(),
    target,
    label,
    keyframes: kfs.map((k) => ({ ...k, id: uid() })),
  })
  switch (preset) {
    case 'fade':
      return { ...base, duration: 1.4, scrollTrigger: false, tracks: [
        t('all', 'All elements', [{ at: 0, property: 'opacity', from: 0, to: 1 }]),
      ] }
    case 'slide':
      return { ...base, duration: 1.8, scrollTrigger: false, tracks: [
        t('all', 'All elements', [
          { at: 0, property: 'opacity', from: 0, to: 1 },
          { at: 0.1, property: 'y', from: 40, to: 0 },
        ]),
      ] }
    case 'pop':
      return { ...base, duration: 1.6, scrollTrigger: false, tracks: [
        t('all', 'All elements', [
          { at: 0, property: 'opacity', from: 0, to: 1 },
          { at: 0.1, property: 'scale', from: 0.8, to: 1 },
        ]),
      ] }
    case 'stagger':
      return { ...base, duration: 2.6, stagger: 0.12, scrollTrigger: false, tracks: [
        t('card', 'Cards', [
          { at: 0.1, property: 'opacity', from: 0, to: 1 },
          { at: 0.15, property: 'y', from: 30, to: 0 },
        ]),
        t('text', 'Text', [
          { at: 0.3, property: 'opacity', from: 0, to: 1 },
          { at: 0.35, property: 'scale', from: 0.85, to: 1 },
        ]),
      ] }
    case 'scroll':
      return { ...base, duration: 2.4, scrollTrigger: true, tracks: [
        t('hero', 'Hero', [
          { at: 0, property: 'opacity', from: 0, to: 1 },
          { at: 0.2, property: 'y', from: 50, to: 0 },
        ]),
        t('card', 'Cards', [
          { at: 0.4, property: 'opacity', from: 0, to: 1 },
          { at: 0.5, property: 'blur', from: 8, to: 0 },
        ]),
      ] }
    default:
      return base
  }
}
