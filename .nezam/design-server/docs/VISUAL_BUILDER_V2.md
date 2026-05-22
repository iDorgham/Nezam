# Visual Builder V2 — ChartWidgetNode Schema

## ChartWidgetNode (Zod)

```typescript
import { z } from 'zod';

const MotionBudgetSchema = z.object({
  entranceMs: z.number().max(600),
  updateMs: z.number().max(200),
  exitMs: z.number().max(150).optional(),
  fallback: z.enum(['instant', 'opacity-crossfade']).default('instant'),
});

const A11ySchema = z.object({
  ariaLabel: z.string().min(1),
  dataTableHtml: z.string().min(1),
});

const RtlMirrorSchema = z.object({
  flipAxes: z.boolean().default(true),
  legendAnchor: z.enum(['left', 'right']).default('right'),
  tooltipAnchor: z.enum(['left', 'right']).default('right'),
});

const EncodingSchema = z.object({
  x: z.string(),
  y: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
});

export const ChartWidgetNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('chart-widget'),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  dataSourceId: z.string(),
  chartType: z.enum(['bar', 'line', 'area', 'scatter', 'pie', 'donut', 'heatmap', 'funnel']),
  encoding: EncodingSchema,
  tokenPalette: z.enum(['categorical', 'sequential', 'diverging']).default('categorical'),
  a11y: A11ySchema,
  rtlMirror: RtlMirrorSchema,
  motionBudget: MotionBudgetSchema,
});

export type ChartWidgetNode = z.infer<typeof ChartWidgetNodeSchema>;
```

## Data Source Binding

Each node binds to a data source by `dataSourceId`. The data source resolves at runtime via the design server's data layer. Nodes are re-rendered when the bound source emits an update event.

Allowed data source types: `static-json`, `api-endpoint`, `supabase-query`, `computed`.

## Rendering

```tsx
// React render — direction-aware
<div dir={isRtl ? 'rtl' : 'ltr'} style={{ contain: 'strict' }}>
  <ChartComponent
    encoding={node.encoding}
    flipAxes={isRtl && node.rtlMirror.flipAxes}
    legendAnchor={isRtl ? node.rtlMirror.legendAnchor : 'left'}
  />
</div>
```

GPU compositing: apply `will-change: transform` + `transform: translateZ(0)` on the chart container.

Entrance animation must respect `motionBudget.entranceMs` and fall back to `motionBudget.fallback` when `prefers-reduced-motion: reduce` is detected.

## Token Consumption Rules

- **Zero hardcoded hex** — all colors via `--token-chart-*` CSS custom properties
- RTL axis flip: x-axis labels mirror, legend moves to opposite anchor, tooltips follow cursor
- Color scale order unchanged for RTL (visual direction only)
- Dark mode: consumed automatically via `prefers-color-scheme` on CSS custom properties
