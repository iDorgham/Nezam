'use client'

import { Palette } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { contrastRatio } from '@/lib/tokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { ColorField } from '@/components/ui/ColorField'
import type { ColorTokenKey } from '@/types'

/** Brand / Colors mode — identity layer: brand, accents, semantics, text. */
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
    <div className="flex h-full flex-col" id="ds-section-colors">
      <PanelHeader
        icon={<Palette size={15} />}
        title="Colors"
        subtitle="Brand, accents, semantics & text"
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

