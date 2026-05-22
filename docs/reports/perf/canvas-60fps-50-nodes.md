# Canvas Performance — 60fps @ 50 Nodes

> **Task:** T-F005-017
> **Spec:** SPEC-DS-CANVAS-001 §3 Success Metrics — AC-001
> **Target metric:** 60fps p95 @ 50 nodes, sustained during viewport pan
> **Tool:** `src/lib/raf-profiler.ts` (vanilla RAF frame timer)
> **Status:** Methodology ready; awaiting first browser capture in CI/local.

## Methodology

`createProfiler()` samples per-frame deltas via `requestAnimationFrame`
between `start()` and `stop()`. From the raw deltas it computes:

| Metric | Definition |
|---|---|
| `avg`     | Mean FPS across all frames in the window |
| `p50`     | Median FPS — most-frequent frame cadence |
| `p95`     | 95th percentile FPS — the "bad 5% of frames" threshold |
| `p99`     | 99th percentile FPS — worst-case jank |
| `dropped` | Count of frames below the target FPS |

The 60fps invariant is **`p95 ≥ 60`** — at least 95% of frames must
hit 16.67ms or better during the interaction window. p50 alone is too
forgiving; p99 is too sensitive to one-off GC pauses.

## Test Scenario

| Variable | Value |
|---|---|
| Node count | 50 |
| Node LOD | full (viewport scale ≥ 0.4) |
| Wire count | ~25 (≈ 0.5× nodes; mixed wire types) |
| Browser | Chrome stable, recent |
| Throttling | None (clean run); also captured at 4× CPU throttling |
| Interaction | 5s of continuous viewport pan + 2s of zoom |
| Sample window | The full 7s interaction window |

## How to Run Locally

1. Start the design server: `pnpm dev`.
2. Open the canvas with the perf harness preset:
   `http://localhost:4000/canvas?perf=50`
3. In DevTools console:

   ```js
   import('/src/lib/raf-profiler').then(({ createProfiler }) => {
     const p = createProfiler({ targetFps: 60 })
     p.start()
     setTimeout(() => {
       const r = p.stop()
       console.table({
         avg: r.fps.avg.toFixed(1),
         p50: r.fps.p50.toFixed(1),
         p95: r.fps.p95.toFixed(1),
         p99: r.fps.p99.toFixed(1),
         dropped: r.dropped,
         frames: r.frames,
       })
     }, 7000)
   })
   ```

4. While the profiler is running, drag the canvas (`Space` + drag) and
   scroll-wheel zoom across the 50-node grid.
5. Paste the resulting table into the **Results** section below.

## Pass / Fail Criteria

| Result | Interpretation |
|---|---|
| `p95 ≥ 60` and `dropped < frames × 0.05` | ✅ Pass — ship as-is |
| `p95 ∈ [45, 60)` | ⚠ Investigate — likely needs RAF-batched node re-render |
| `p95 < 45` | ❌ Fail — LOD culling (T-F005-005) is not engaging or React is rerendering per pan tick |

## Results

| Run | Hardware | CPU throttle | avg | p50 | p95 | p99 | dropped | frames | verdict |
|---|---|---|---|---|---|---|---|---|---|
| _pending_ | _e.g. M2 MacBook Air_ | 1×    | — | — | — | — | — | — | — |
| _pending_ | _e.g. M2 MacBook Air_ | 4×    | — | — | — | — | — | — | — |

> First measurement to be captured by `qa-test-lead` against the
> current `design-server` branch. Update the table inline rather than
> appending a new report file.

## Related

- Unit tests for the profiler math: `src/lib/raf-profiler.test.ts`
- LOD ladder: `src/lib/canvas-math.ts` (`lodForScale`)
- LOD task: T-F005-005 (dot LOD at scale < 0.1)
