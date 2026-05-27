'use client'

import { useHub } from '@/store/hub.store'

const CHART_KEYS = ['primary', 'secondary', 'tertiary', 'quaternary'] as const

export function UtilityEditor() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const util     = tokens.utility

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-app-text">Utility</h2>
        <p className="mt-1 text-xs text-app-subtle leading-relaxed">
          Utility tokens for specific UI scenarios — modal blankets, loading skeletons, and chart color palettes.
        </p>
      </div>

      {/* Blanket */}
      <section>
        <SectionTitle>Blanket</SectionTitle>
        <p className="text-[11px] text-app-subtle mb-3">
          Semi-transparent overlay covering the page behind modals and drawers.
        </p>
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-32 shrink-0 rounded-app-md border border-app-border flex items-center justify-center text-[10px] text-white font-medium"
            style={{ backgroundColor: util.blanket }}
          >
            Blanket
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-app-text mb-1">Modal blanket color</p>
            <input
              type="text"
              className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              value={util.blanket}
              onChange={(e) => setToken('utility.blanket', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Skeleton */}
      <section>
        <SectionTitle>Skeleton</SectionTitle>
        <p className="text-[11px] text-app-subtle mb-3">
          Colors used to render skeleton loading placeholders with a shimmer animation.
        </p>
        <div className="flex flex-col gap-3">
          {[
            { key: 'utility.skeleton.base',    label: 'Base',    desc: 'Base skeleton color', value: util.skeleton.base },
            { key: 'utility.skeleton.shimmer', label: 'Shimmer', desc: 'Shimmer highlight color', value: util.skeleton.shimmer },
          ].map(({ key, label, desc, value }) => (
            <div key={key} className="flex items-center gap-4">
              <div
                className="h-8 w-24 shrink-0 rounded-app-sm border border-app-border"
                style={{ backgroundColor: value }}
              />
              <div className="flex-1">
                <p className="text-xs font-medium text-app-text">{label}</p>
                <p className="text-[11px] text-app-subtle">{desc}</p>
              </div>
              <input
                type="text"
                className="w-36 h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                value={value}
                onChange={(e) => setToken(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Skeleton preview */}
        <div className="mt-4 p-3 rounded-app-md border border-app-border bg-app-surface">
          <p className="text-[10px] text-app-subtle mb-2">Skeleton preview</p>
          <div className="flex flex-col gap-2">
            <div
              className="h-3 rounded-full w-3/4"
              style={{ backgroundColor: util.skeleton.base }}
            />
            <div
              className="h-3 rounded-full w-1/2"
              style={{ backgroundColor: util.skeleton.base }}
            />
            <div
              className="h-3 rounded-full w-5/6"
              style={{ backgroundColor: util.skeleton.base }}
            />
          </div>
        </div>
      </section>

      {/* Chart palette */}
      <section>
        <SectionTitle>Chart Color Palette</SectionTitle>
        <p className="text-[11px] text-app-subtle mb-3">
          Categorical and diverging colors for data visualizations.
        </p>

        {/* Categorical colors */}
        <div className="flex gap-2 mb-4">
          {CHART_KEYS.map((k) => (
            <div key={k} className="flex flex-col gap-1 flex-1">
              <div
                className="h-12 rounded-app-md border border-app-border"
                style={{ backgroundColor: util.chart[k] }}
              />
              <p className="text-[10px] text-app-subtle capitalize">{k}</p>
              <input
                type="text"
                className="w-full h-6 rounded-app-sm border border-app-border bg-app-elevated px-1.5 text-[10px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                value={util.chart[k]}
                onChange={(e) => setToken(`utility.chart.${k}`, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Divergent */}
        <p className="text-[11px] font-medium text-app-muted mb-2">Divergent Scale</p>
        <div className="flex gap-3">
          {[
            { key: 'utility.chart.divergent.low',  label: 'Low',  value: util.chart.divergent.low },
            { key: 'utility.chart.divergent.high', label: 'High', value: util.chart.divergent.high },
          ].map(({ key, label, value }) => (
            <div key={key} className="flex-1 flex flex-col gap-1">
              <div
                className="h-10 rounded-app-md border border-app-border"
                style={{ backgroundColor: value }}
              />
              <p className="text-[10px] text-app-subtle">{label}</p>
              <input
                type="text"
                className="w-full h-6 rounded-app-sm border border-app-border bg-app-elevated px-1.5 text-[10px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                value={value}
                onChange={(e) => setToken(key, e.target.value)}
              />
            </div>
          ))}
          {/* Gradient preview */}
          <div className="flex-1 flex flex-col gap-1">
            <div
              className="h-10 rounded-app-md border border-app-border"
              style={{
                background: `linear-gradient(to right, ${util.chart.divergent.low}, ${util.chart.divergent.high})`,
              }}
            />
            <p className="text-[10px] text-app-subtle">Gradient</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted">{children}</p>
  )
}
