'use client'

import { useHub } from '@/store/hub.store'

type HeadingKey = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
type BodyKey    = 'lg' | 'md' | 'sm'
type MetricKey  = 'xl' | 'lg' | 'md'
type CodeKey    = 'lg' | 'md' | 'sm'

const HEADING_KEYS: HeadingKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']
const BODY_KEYS:    BodyKey[]    = ['lg', 'md', 'sm']
const METRIC_KEYS:  MetricKey[]  = ['xl', 'lg', 'md']
const CODE_KEYS:    CodeKey[]    = ['lg', 'md', 'sm']

const HEADING_LABELS: Record<HeadingKey, string> = {
  xxl: 'Display / H1', xl: 'H2', lg: 'H3', md: 'H4', sm: 'H5', xs: 'H6',
}

export function FontEditor() {
  const tokens   = useHub((s) => s.design.tokens)
  const setToken = useHub((s) => s.designSetToken)
  const font     = tokens.font

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-app-text">Font</h2>
        <p className="mt-1 text-xs text-app-subtle leading-relaxed">
          Semantic type ramp split by role — heading, body, metric, and code. These tokens map to specific use cases regardless of base scale.
        </p>
      </div>

      {/* Font families */}
      <section>
        <SectionTitle>Font Families</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: 'font.family.heading', label: 'Heading', value: font.family.heading },
              { key: 'font.family.body',    label: 'Body',    value: font.family.body },
              { key: 'font.family.mono',    label: 'Mono',    value: font.family.mono },
              { key: 'font.family.display', label: 'Display', value: font.family.display },
            ] as const
          ).map(({ key, label, value }) => (
            <div key={key}>
              <p className="text-[11px] text-app-muted font-medium mb-1">{label}</p>
              <input
                type="text"
                className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] font-mono text-app-text focus:outline-none focus:border-app-accent"
                value={value}
                onChange={(e) => setToken(key, e.target.value)}
              />
              <p
                className="mt-1 text-xs truncate"
                style={{ fontFamily: value }}
              >
                Aa Bb Cc 123
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Font weights */}
      <section>
        <SectionTitle>Font Weights</SectionTitle>
        <div className="grid grid-cols-4 gap-3">
          {(
            [
              { key: 'font.weight.regular',  label: 'Regular',  value: font.weight.regular },
              { key: 'font.weight.medium',   label: 'Medium',   value: font.weight.medium },
              { key: 'font.weight.semibold', label: 'Semibold', value: font.weight.semibold },
              { key: 'font.weight.bold',     label: 'Bold',     value: font.weight.bold },
            ] as const
          ).map(({ key, label, value }) => (
            <div key={key}>
              <p className="text-[11px] text-app-muted font-medium mb-1">{label}</p>
              <input
                type="number"
                min={100}
                max={900}
                step={100}
                className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] text-app-text focus:outline-none focus:border-app-accent"
                value={value}
                onChange={(e) => setToken(key, Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-app-muted" style={{ fontWeight: value }}>
                Sample
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Heading scale */}
      <section>
        <SectionTitle>Heading Scale</SectionTitle>
        <TypeRamp
          label="Heading"
          sampleFamily={font.family.heading}
          rows={HEADING_KEYS.map((k) => ({
            key: k,
            roleLabel: HEADING_LABELS[k],
            size: font.heading[k].size,
            lineHeight: font.heading[k].lineHeight,
            sizePath: `font.heading.${k}.size`,
            lhPath: `font.heading.${k}.lineHeight`,
          }))}
          setToken={setToken}
        />
      </section>

      {/* Body scale */}
      <section>
        <SectionTitle>Body Scale</SectionTitle>
        <TypeRamp
          label="Body"
          sampleFamily={font.family.body}
          rows={BODY_KEYS.map((k) => ({
            key: k,
            roleLabel: `Body ${k.toUpperCase()}`,
            size: font.body[k].size,
            lineHeight: font.body[k].lineHeight,
            sizePath: `font.body.${k}.size`,
            lhPath: `font.body.${k}.lineHeight`,
          }))}
          setToken={setToken}
        />
      </section>

      {/* Metric scale */}
      <section>
        <SectionTitle>Metric Scale</SectionTitle>
        <TypeRamp
          label="Metric"
          sampleFamily={font.family.display}
          rows={METRIC_KEYS.map((k) => ({
            key: k,
            roleLabel: `Metric ${k.toUpperCase()}`,
            size: font.metric[k].size,
            lineHeight: font.metric[k].lineHeight,
            sizePath: `font.metric.${k}.size`,
            lhPath: `font.metric.${k}.lineHeight`,
          }))}
          setToken={setToken}
        />
      </section>

      {/* Code scale */}
      <section>
        <SectionTitle>Code Scale</SectionTitle>
        <TypeRamp
          label="Code"
          sampleFamily={font.family.mono}
          rows={CODE_KEYS.map((k) => ({
            key: k,
            roleLabel: `Code ${k.toUpperCase()}`,
            size: font.code[k].size,
            lineHeight: font.code[k].lineHeight,
            sizePath: `font.code.${k}.size`,
            lhPath: `font.code.${k}.lineHeight`,
          }))}
          setToken={setToken}
        />
      </section>
    </div>
  )
}

interface TypeRampRow {
  key: string
  roleLabel: string
  size: string
  lineHeight: string
  sizePath: string
  lhPath: string
}

function TypeRamp({
  sampleFamily,
  rows,
  setToken,
}: {
  label: string
  sampleFamily: string
  rows: TypeRampRow[]
  setToken: (path: string, value: string | number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-4 py-1.5 border-b border-app-border/50 last:border-0">
          {/* Sample text */}
          <div className="w-40 shrink-0 truncate">
            <span
              style={{
                fontFamily: sampleFamily,
                fontSize: row.size,
                lineHeight: row.lineHeight,
              }}
              className="text-app-text"
            >
              {row.roleLabel.replace(' ', ' ')}
            </span>
          </div>
          {/* Role label */}
          <p className="text-[10px] text-app-subtle w-24 shrink-0">{row.roleLabel}</p>
          {/* Size */}
          <div className="flex items-center gap-1 flex-1">
            <span className="text-[10px] text-app-subtle w-8 shrink-0">size</span>
            <input
              type="text"
              className="flex-1 h-6 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[10px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              value={row.size}
              onChange={(e) => setToken(row.sizePath, e.target.value)}
            />
          </div>
          {/* Line height */}
          <div className="flex items-center gap-1 flex-1">
            <span className="text-[10px] text-app-subtle w-7 shrink-0">lh</span>
            <input
              type="text"
              className="flex-1 h-6 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[10px] font-mono text-app-text focus:outline-none focus:border-app-accent"
              value={row.lineHeight}
              onChange={(e) => setToken(row.lhPath, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted">{children}</p>
  )
}
