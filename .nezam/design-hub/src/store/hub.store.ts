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
} from '@/types'
import { PROFILES, DEFAULT_PROFILE_ID } from '@/data/profiles'
import { ARCHETYPES, DEFAULT_ARCHETYPE_ID, buildBlocks, makeBlock } from '@/data/archetypes'
import { resolveTokens } from '@/lib/tokens'
import { generateProfile } from '@/lib/ai'

const uid = () => Math.random().toString(36).slice(2, 9)

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

  /* interaction */
  selection: Selection | null
  builderMode: BuilderMode
  activeTool: Tool
  editingNodeId: string | null
  activePage: string | null
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
  setActivePage: (id: string | null) => void
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

      archetypeId: DEFAULT_ARCHETYPE_ID,
      blocks: buildBlocks(DEFAULT_ARCHETYPE_ID),
      blockMeta: {},
      nodeStyles: {},
      contentOverrides: {},
      pageStyle: { width: 1080, padding: 0 },

      selection: null,
      builderMode: 'brand',
      activeTool: 'select',
      editingNodeId: null,
      activePage: null,
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
      setActivePage: (id) => set({ activePage: id }),
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

      /* ── structure ─────────────────────────────────────────── */
      setArchetype: (id) => {
        if (id === get().archetypeId) return
        set({
          archetypeId: id,
          blocks: buildBlocks(id),
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
        set({
          blocks: [...blocks, block],
          selection: { scope: 'section', blockId: block.id, nodeId: block.id, label: block.label, role: 'box' },
          builderMode: 'inspector',
          pulse: get().pulse + 1,
        })
      },
      removeBlock: (id) => {
        const sel = get().selection
        set({
          blocks: get().blocks.filter((b) => b.id !== id),
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
      // Prevent SSR/client mismatch: server always renders initial state;
      // DesignHub calls rehydrate() in useEffect so localStorage loads after mount.
      skipHydration: true,
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
