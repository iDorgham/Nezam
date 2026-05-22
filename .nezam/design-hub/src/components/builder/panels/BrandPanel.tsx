'use client'

import { Palette } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { contrastRatio } from '@/lib/tokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { ColorField } from '@/components/ui/ColorField'
import type { ColorTokenKey } from '@/types'

const FONT_OPTIONS = [
  { label: 'Geist', value: "'Geist', 'Inter', system-ui, sans-serif" },
  { label: 'Inter', value: "'Inter', system-ui, sans-serif" },
  { label: 'Sora', value: "'Sora', 'Inter', sans-serif" },
  { label: 'Manrope', value: "'Manrope', 'Inter', sans-serif" },
  { label: 'IBM Plex', value: "'IBM Plex Sans', system-ui, sans-serif" },
  { label: 'Cairo', value: "'Cairo', 'IBM Plex Sans Arabic', sans-serif" },
]

/** Brand mode — the identity layer: brand color, accents, semantics, type. */
export function BrandPanel() {
  const tokens = useTokens()
  const setToken = useHub((s) => s.setToken)
  const selection = useHub((s) => s.selection)

  const color = (key: ColorTokenKey, label: string, hint?: string) => (
    <ColorField
      label={label}
      hint={hint}
      value={tokens[key]}
      onChange={(v) => setToken(key, v)}
    />
  )

  const brandContrast = contrastRatio(tokens.brand, tokens.onBrand)
  const textContrast = contrastRatio(tokens.text, tokens.bg)

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<Palette size={15} />}
        title="Brand"
        subtitle="Identity, accents, and voice"
      />
      <PanelBody>
        {selection && (
          <div className="mb-5 rounded-app border border-app-accent/40 bg-app-accent-subtle px-3 py-2 text-[11px] text-app-text">
            Context — <span className="font-semibold">{selection.label}</span> is selected.
          </div>
        )}

        <Section label="Primary brand">
          {color('brand', 'Brand', 'Primary actions & focus')}
          {color('brandHover', 'Brand hover')}
          {color('brandSubtle', 'Brand subtle', 'Tinted backgrounds')}
          {color('onBrand', 'On brand', 'Text over the brand color')}
          <ControlCard className="mt-1">
            <ContrastRow label="On-brand legibility" ratio={brandContrast} target={4.5} />
          </ControlCard>
        </Section>

        <Section label="Accent">{color('accent', 'Accent', 'Highlights & links')}</Section>

        <Section label="Semantic" hint="Status colors used for feedback states.">
          {color('success', 'Success')}
          {color('warning', 'Warning')}
          {color('danger', 'Danger')}
          {color('info', 'Info')}
        </Section>

        <Section label="Text">
          {color('text', 'Text')}
          {color('textMuted', 'Text muted')}
          {color('textSubtle', 'Text subtle')}
          <ControlCard className="mt-1">
            <ContrastRow label="Body text legibility" ratio={textContrast} target={4.5} />
          </ControlCard>
        </Section>

        <Section label="Typeface" hint="Display font drives headings; UI font drives the rest.">
          <FontRow
            label="Display"
            value={tokens.fontDisplay}
            onChange={(v) => setToken('fontDisplay', v)}
          />
          <FontRow
            label="UI / Body"
            value={tokens.fontSans}
            onChange={(v) => setToken('fontSans', v)}
          />
        </Section>
      </PanelBody>
    </div>
  )
}

function ContrastRow({ label, ratio, target }: { label: string; ratio: number; target: number }) {
  const pass = ratio >= target
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-app-muted">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] text-app-text">{ratio.toFixed(2)}:1</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{
            background: pass ? 'rgba(34,197,94,0.16)' : 'rgba(248,113,113,0.16)',
            color: pass ? '#4ade80' : '#f87171',
          }}
        >
          {pass ? 'AA' : 'low'}
        </span>
      </span>
    </div>
  )
}

function FontRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-medium text-app-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {FONT_OPTIONS.map((f) => {
          const active = f.value === value
          return (
            <button
              key={f.label}
              onClick={() => onChange(f.value)}
              style={{ fontFamily: f.value }}
              className={
                'focus-ring rounded-app-sm border px-2.5 py-1.5 text-[12px] transition-colors ' +
                (active
                  ? 'border-app-accent bg-app-accent-subtle text-app-text'
                  : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text')
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
