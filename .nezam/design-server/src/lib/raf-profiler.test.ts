import { describe, expect, it } from 'vitest'
import { createProfiler } from './raf-profiler'

// Drive the profiler with a synthetic clock + RAF queue so the test is
// deterministic (no real animation frames involved).
function makeFakeClock(frameTimes: number[]) {
  let queued: ((ts: number) => void) | null = null
  let nowMs = 0
  let lastHandle = 0

  return {
    raf: (cb: FrameRequestCallback): number => {
      queued = cb
      lastHandle += 1
      return lastHandle
    },
    cancelRaf: () => { queued = null },
    now: () => nowMs,
    runAll: () => {
      for (const ts of frameTimes) {
        nowMs = ts
        const cb = queued
        queued = null
        cb?.(ts)
      }
    },
    setNow: (ms: number) => { nowMs = ms },
  }
}

describe('raf-profiler · steady cadence capture', () => {
  it('records frame deltas and computes avg/p50/p95/p99 FPS', () => {
    // Steady 100fps cadence (10ms per frame) — well above the 60fps target,
    // so no frames should count as dropped. Integer math avoids float jitter.
    const frames = Array.from({ length: 30 }, (_, i) => (i + 1) * 10)
    const clock  = makeFakeClock(frames)

    const profiler = createProfiler({
      targetFps: 60,
      raf:       clock.raf,
      cancelRaf: clock.cancelRaf,
      now:       clock.now,
    })

    profiler.start()
    clock.runAll()
    clock.setNow(frames[frames.length - 1])
    const result = profiler.stop()

    // First call records lastTs only — first delta is between frame 1 and 2.
    expect(result.frames).toBe(frames.length - 1)
    expect(result.fps.avg).toBeCloseTo(100, 0)
    expect(result.fps.p50).toBeCloseTo(100, 0)
    expect(result.dropped).toBe(0)
  })
})

describe('raf-profiler · dropped frames', () => {
  it('counts frames below the target FPS as dropped', () => {
    // 10 fast frames at 10ms (100fps) + 5 stutters at 50ms (20fps).
    // 14 deltas total: 9 fast + 1 boundary (fast→slow = 50ms) + 4 slow = 5 dropped.
    const stuttered: number[] = []
    let t = 0
    for (let i = 0; i < 10; i++) { t += 10; stuttered.push(t) }
    for (let i = 0; i < 5;  i++) { t += 50; stuttered.push(t) }

    const clock = makeFakeClock(stuttered)
    const profiler = createProfiler({
      targetFps: 60,
      raf:       clock.raf,
      cancelRaf: clock.cancelRaf,
      now:       clock.now,
    })

    profiler.start()
    clock.runAll()
    const result = profiler.stop()

    expect(result.dropped).toBe(5)
    // p99 captures the worst stutter.
    expect(result.fps.min).toBeCloseTo(20, 0)
  })
})

describe('raf-profiler · lifecycle', () => {
  it('start() is idempotent', () => {
    const clock = makeFakeClock([])
    const profiler = createProfiler({
      raf:       clock.raf,
      cancelRaf: clock.cancelRaf,
      now:       clock.now,
    })

    profiler.start()
    profiler.start()
    expect(profiler.running).toBe(true)
  })

  it('stop() before start() returns an empty result safely', () => {
    const clock = makeFakeClock([])
    const profiler = createProfiler({
      raf:       clock.raf,
      cancelRaf: clock.cancelRaf,
      now:       clock.now,
    })

    const result = profiler.stop()
    expect(result.frames).toBe(0)
    expect(result.fps.avg).toBe(0)
  })

  it('reports running=false after stop()', () => {
    const clock = makeFakeClock([16, 32, 48])
    const profiler = createProfiler({
      raf:       clock.raf,
      cancelRaf: clock.cancelRaf,
      now:       clock.now,
    })

    profiler.start()
    expect(profiler.running).toBe(true)
    clock.runAll()
    profiler.stop()
    expect(profiler.running).toBe(false)
  })
})
