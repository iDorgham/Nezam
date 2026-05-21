// SPEC-DS-CANVAS-001 §3 Success Metrics — Canvas 60fps @ 50 nodes (AC-001).
// Lightweight RAF-based frame timer. Records per-frame deltas, computes
// percentile FPS, and surfaces drops below a target threshold. Used by the
// /canvas perf harness to validate the 60fps-at-50-nodes invariant.
//
// Why not just `performance.measure`? Because we care about *frame cadence*
// across an interaction window (pan/zoom/drag), not one-off marks.

export interface FrameSample {
  /** ms since the previous frame. ≈ 16.67 when running at 60fps. */
  delta: number
  /** Instantaneous FPS = 1000 / delta. */
  fps:   number
}

export interface ProfilerResult {
  /** Number of frames sampled. */
  frames:    number
  /** Total wall-clock duration of the sampling window, in ms. */
  durationMs: number
  fps: {
    /** Mean FPS across all sampled frames. */
    avg: number
    p50: number
    p95: number
    p99: number
    min: number
    max: number
  }
  /** Frames that fell below the target FPS (default 60). */
  dropped: number
  /** Raw per-frame samples — useful for histograms / flame charts. */
  samples: FrameSample[]
}

export interface ProfilerOptions {
  /** FPS threshold; frames below this count as "dropped". Default 60. */
  targetFps?: number
  /** Optional global to call instead of `window.requestAnimationFrame`. */
  raf?: (cb: FrameRequestCallback) => number
  /** Optional cancel function paired with `raf`. */
  cancelRaf?: (handle: number) => void
  /** Optional high-resolution timestamp source. Default `performance.now()`. */
  now?: () => number
}

export interface Profiler {
  /** Returns true while frames are being sampled. */
  readonly running: boolean
  /** Begin sampling. Idempotent — calling start() twice in a row no-ops. */
  start: () => void
  /** Stop sampling and return the aggregated result. */
  stop:  () => ProfilerResult
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))
  return sorted[idx]
}

function summarize(samples: FrameSample[], targetFps: number, durationMs: number): ProfilerResult {
  if (samples.length === 0) {
    return {
      frames:     0,
      durationMs,
      fps:        { avg: 0, p50: 0, p95: 0, p99: 0, min: 0, max: 0 },
      dropped:    0,
      samples:    [],
    }
  }

  const fps = samples.map((s) => s.fps)
  const sorted = [...fps].sort((a, b) => a - b)
  const avg = fps.reduce((sum, x) => sum + x, 0) / fps.length

  return {
    frames:     samples.length,
    durationMs,
    fps: {
      avg,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
      min: sorted[0],
      max: sorted[sorted.length - 1],
    },
    dropped: samples.filter((s) => s.fps < targetFps).length,
    samples,
  }
}

export function createProfiler(opts: ProfilerOptions = {}): Profiler {
  const targetFps = opts.targetFps ?? 60
  const now = opts.now ?? (() => performance.now())
  const raf = opts.raf ?? ((cb) => {
    if (typeof window === 'undefined') throw new Error('createProfiler: no raf available; pass opts.raf in non-browser contexts')
    return window.requestAnimationFrame(cb)
  })
  const cancelRaf = opts.cancelRaf ?? ((h) => {
    if (typeof window !== 'undefined') window.cancelAnimationFrame(h)
  })

  let running    = false
  let lastTs     = 0
  let startedAt  = 0
  let handle     = 0
  const samples: FrameSample[] = []

  function tick(ts: number) {
    if (!running) return
    if (lastTs > 0) {
      const delta = ts - lastTs
      if (delta > 0) samples.push({ delta, fps: 1000 / delta })
    }
    lastTs = ts
    handle = raf(tick)
  }

  return {
    get running() { return running },
    start() {
      if (running) return
      running   = true
      lastTs    = 0
      startedAt = now()
      samples.length = 0
      handle = raf(tick)
    },
    stop() {
      if (!running) return summarize(samples, targetFps, 0)
      running = false
      cancelRaf(handle)
      const durationMs = now() - startedAt
      return summarize(samples, targetFps, durationMs)
    },
  }
}
