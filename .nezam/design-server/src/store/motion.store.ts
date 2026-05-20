import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// F-006 — Motion Studio shared state. Lives outside canvas-graph.store so a
// motion timeline can target the active canvas selection without coupling
// the two domains.

export type MotionTrackProperty = 'opacity' | 'translateY' | 'scale' | 'stagger'

export const MOTION_TRACK_PROPERTIES: ReadonlyArray<MotionTrackProperty> = [
  'opacity',
  'translateY',
  'scale',
  'stagger',
]

export interface MotionKeyframe {
  id:     string
  timeMs: number
  value:  number
  easing?: string
}

interface MotionState {
  /** Bottom dock collapsed (header only) vs expanded (240px default). */
  collapsed:    boolean
  /** Playhead position in milliseconds. */
  currentTimeMs: number
  /** Total composition length in milliseconds. */
  durationMs:   number
  /** Playback transport state. */
  isPlaying:    boolean
  /** Expanded dock height in pixels. Persisted so the user's resize sticks. */
  heightPx:     number
  /** Per-property keyframe lists. Built-in tracks; rows always render. */
  tracks:       Record<MotionTrackProperty, MotionKeyframe[]>
  /** Per-property visibility — hidden tracks dim in the UI, animation skips. */
  hiddenTracks: ReadonlyArray<MotionTrackProperty>
}

interface MotionActions {
  setCollapsed:   (collapsed: boolean) => void
  toggleCollapsed: () => void
  setCurrentTime: (ms: number) => void
  setDuration:    (ms: number) => void
  setIsPlaying:   (playing: boolean) => void
  togglePlay:     () => void
  setHeightPx:    (px: number) => void
  addKeyframe:    (property: MotionTrackProperty, kf: MotionKeyframe) => void
  updateKeyframe: (property: MotionTrackProperty, kfId: string, patch: Partial<MotionKeyframe>) => void
  removeKeyframe: (property: MotionTrackProperty, kfId: string) => void
  toggleTrackVisibility: (property: MotionTrackProperty) => void
  reset:          () => void
}

const DEFAULT_HEIGHT_PX = 240
const DEFAULT_DURATION_MS = 2000

const defaultState: MotionState = {
  collapsed:     false,
  currentTimeMs: 0,
  durationMs:    DEFAULT_DURATION_MS,
  isPlaying:     false,
  heightPx:      DEFAULT_HEIGHT_PX,
  tracks: {
    opacity:    [],
    translateY: [],
    scale:      [],
    stagger:    [],
  },
  hiddenTracks: [],
}

export const useMotionStore = create<MotionState & MotionActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setCollapsed:   (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set({ collapsed: !get().collapsed }),

      setCurrentTime: (ms) => {
        const duration = get().durationMs
        const clamped = Math.max(0, Math.min(ms, duration))
        set({ currentTimeMs: clamped })
      },

      setDuration: (ms) => {
        const next = Math.max(0, ms)
        const currentTime = get().currentTimeMs
        set({
          durationMs:    next,
          // Pull the playhead back inside the new duration if it overshoots.
          currentTimeMs: Math.min(currentTime, next),
        })
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      togglePlay:    () => set({ isPlaying: !get().isPlaying }),

      setHeightPx: (px) => {
        // Clamp to a sensible range so users can't drag the dock to zero or
        // off the bottom of the screen.
        const clamped = Math.max(120, Math.min(px, 600))
        set({ heightPx: clamped })
      },

      addKeyframe: (property, kf) =>
        set((state) => ({
          tracks: {
            ...state.tracks,
            [property]: [...state.tracks[property], kf].sort((a, b) => a.timeMs - b.timeMs),
          },
        })),

      updateKeyframe: (property, kfId, patch) =>
        set((state) => ({
          tracks: {
            ...state.tracks,
            [property]: state.tracks[property]
              .map((k) => (k.id === kfId ? { ...k, ...patch } : k))
              .sort((a, b) => a.timeMs - b.timeMs),
          },
        })),

      removeKeyframe: (property, kfId) =>
        set((state) => ({
          tracks: {
            ...state.tracks,
            [property]: state.tracks[property].filter((k) => k.id !== kfId),
          },
        })),

      toggleTrackVisibility: (property) =>
        set((state) => ({
          hiddenTracks: state.hiddenTracks.includes(property)
            ? state.hiddenTracks.filter((p) => p !== property)
            : [...state.hiddenTracks, property],
        })),

      reset: () => set(defaultState),
    }),
    {
      name: 'nezam-ds:motion',
      partialize: (state) => ({
        collapsed:    state.collapsed,
        heightPx:     state.heightPx,
        durationMs:   state.durationMs,
        tracks:       state.tracks,
        hiddenTracks: state.hiddenTracks,
      }),
    },
  ),
)
