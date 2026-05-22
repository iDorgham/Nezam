import { beforeEach, describe, expect, it } from 'vitest'
import { useMotionStore } from './motion.store'

beforeEach(() => {
  useMotionStore.persist.clearStorage()
  useMotionStore.getState().reset()
})

describe('motion.store · dock collapse', () => {
  it('starts expanded by default', () => {
    expect(useMotionStore.getState().collapsed).toBe(false)
  })

  it('toggleCollapsed flips the boolean', () => {
    useMotionStore.getState().toggleCollapsed()
    expect(useMotionStore.getState().collapsed).toBe(true)
    useMotionStore.getState().toggleCollapsed()
    expect(useMotionStore.getState().collapsed).toBe(false)
  })

  it('setCollapsed sets directly', () => {
    useMotionStore.getState().setCollapsed(true)
    expect(useMotionStore.getState().collapsed).toBe(true)
  })
})

describe('motion.store · transport', () => {
  it('default duration is 2000ms with playhead at 0', () => {
    const state = useMotionStore.getState()
    expect(state.durationMs).toBe(2000)
    expect(state.currentTimeMs).toBe(0)
    expect(state.isPlaying).toBe(false)
  })

  it('togglePlay flips isPlaying', () => {
    useMotionStore.getState().togglePlay()
    expect(useMotionStore.getState().isPlaying).toBe(true)
    useMotionStore.getState().togglePlay()
    expect(useMotionStore.getState().isPlaying).toBe(false)
  })

  it('setCurrentTime clamps to [0, durationMs]', () => {
    useMotionStore.getState().setCurrentTime(-500)
    expect(useMotionStore.getState().currentTimeMs).toBe(0)

    useMotionStore.getState().setCurrentTime(99_999)
    expect(useMotionStore.getState().currentTimeMs).toBe(2000)
  })

  it('setDuration pulls the playhead back if it would overshoot', () => {
    useMotionStore.getState().setCurrentTime(1800)
    useMotionStore.getState().setDuration(1000)
    expect(useMotionStore.getState().durationMs).toBe(1000)
    expect(useMotionStore.getState().currentTimeMs).toBe(1000)
  })

  it('setDuration leaves the playhead alone when it still fits', () => {
    useMotionStore.getState().setCurrentTime(500)
    useMotionStore.getState().setDuration(3000)
    expect(useMotionStore.getState().currentTimeMs).toBe(500)
  })
})

describe('motion.store · keyframes and tracks (T-F006-003)', () => {
  it('starts with four empty built-in tracks', () => {
    const tracks = useMotionStore.getState().tracks
    expect(Object.keys(tracks).sort()).toEqual(['opacity', 'scale', 'stagger', 'translateY'].sort())
    for (const ks of Object.values(tracks)) expect(ks).toEqual([])
  })

  it('addKeyframe inserts and keeps the track sorted by timeMs', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'b', timeMs: 1000, value: 1 })
    useMotionStore.getState().addKeyframe('opacity', { id: 'a', timeMs: 100,  value: 0 })

    const ks = useMotionStore.getState().tracks.opacity
    expect(ks.map((k) => k.id)).toEqual(['a', 'b'])
  })

  it('updateKeyframe edits in place and re-sorts after a time change', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 500,  value: 0 })
    useMotionStore.getState().addKeyframe('opacity', { id: 'k2', timeMs: 1500, value: 1 })

    useMotionStore.getState().updateKeyframe('opacity', 'k1', { timeMs: 1800 })

    const ks = useMotionStore.getState().tracks.opacity
    expect(ks.map((k) => k.id)).toEqual(['k2', 'k1'])
    expect(ks[1].timeMs).toBe(1800)
  })

  it('removeKeyframe drops only the targeted id', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 100, value: 0 })
    useMotionStore.getState().addKeyframe('opacity', { id: 'k2', timeMs: 200, value: 1 })

    useMotionStore.getState().removeKeyframe('opacity', 'k1')

    expect(useMotionStore.getState().tracks.opacity.map((k) => k.id)).toEqual(['k2'])
  })

  it('toggleTrackVisibility toggles membership in hiddenTracks', () => {
    useMotionStore.getState().toggleTrackVisibility('scale')
    expect(useMotionStore.getState().hiddenTracks).toContain('scale')

    useMotionStore.getState().toggleTrackVisibility('scale')
    expect(useMotionStore.getState().hiddenTracks).not.toContain('scale')
  })
})

describe('motion.store · height clamp', () => {
  it('clamps below 120 to 120 (prevents dock collapse-by-resize)', () => {
    useMotionStore.getState().setHeightPx(40)
    expect(useMotionStore.getState().heightPx).toBe(120)
  })

  it('clamps above 600 to 600 (prevents takeover of the viewport)', () => {
    useMotionStore.getState().setHeightPx(2000)
    expect(useMotionStore.getState().heightPx).toBe(600)
  })

  it('accepts values inside the range', () => {
    useMotionStore.getState().setHeightPx(300)
    expect(useMotionStore.getState().heightPx).toBe(300)
  })
})
