'use client'

import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { ColorField } from '@/components/ui/ColorField'
import { Slider } from '@/components/ui/Slider'
import { Segmented } from '@/components/ui/Segmented'
import type { ShadowStyle } from '@/types'

/** Styles mode — surfaces, radius, and elevation. */
export function StylesPanel() {
  const tokens = useTokens()
  const setToken = useHub((s) => s.setToken)
  const overrides = useHub((s) => s.overrides)
  const resetOverrides = useHub((s) => s.resetOverrides)
  const selection = useHub((s) => s.selection)

  const edited = Object.keys(overrides).length > 0

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<SlidersHorizontal size={15} />}
        title="Styles"
        subtitle="Surfaces, shape, and elevation"
        action={
          edited && (
            <button
              onClick={resetOverrides}
              className="focus-ring flex items-center gap-1 rounded-app-sm border border-app-border px-2 py-1 text-[10px] font-medium text-app-muted hover:text-app-text"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )
        }
      />
      <PanelBody>
        {selection && (
          <div className="mb-5 rounded-app border border-app-accent/40 bg-app-accent-subtle px-3 py-2 text-[11px] text-app-text">
            Shaping <span className="font-semibold">{selection.label}</span> — radius & elevation
            apply across the system.
          </div>
        )}

        <Section label="Corner radius" hint="The base radius scales every rounded surface.">
          <ControlCard>
            <Slider
              label="Radius"
              min={0}
              max={28}
              value={tokens.radius}
              onChange={(v) => setToken('radius', v)}
              format={(v) => `${v}px`}
            />
            <div className="mt-3 flex items-end gap-2">
              {[0.4, 0.7, 1, 1.6].map((m, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="h-10 w-full border"
                    style={{
                      background: 'var(--app-elevated)',
                      borderColor: 'var(--app-border-strong)',
                      borderRadius: tokens.radius * m,
                    }}
                  />
                  <span className="font-mono text-[9px] text-app-subtle">
                    {Math.round(tokens.radius * m)}
                  </span>
                </div>
              ))}
            </div>
          </ControlCard>
        </Section>

        <Section label="Elevation">
          <Segmented<ShadowStyle>
            value={tokens.shadow}
            onChange={(v) => setToken('shadow', v)}
            className="w-full [&>button]:flex-1"
            options={[
              { value: 'none', label: 'None' },
              { value: 'soft', label: 'Soft' },
              { value: 'crisp', label: 'Crisp' },
              { value: 'dramatic', label: 'Bold' },
            ]}
          />
        </Section>

        <Section label="Surfaces">
          <ColorField label="Background" value={tokens.bg} onChange={(v) => setToken('bg', v)} />
          <ColorField label="Surface" value={tokens.surface} onChange={(v) => setToken('surface', v)} />
          <ColorField
            label="Elevated"
            value={tokens.elevated}
            hint="Cards & popovers"
            onChange={(v) => setToken('elevated', v)}
          />
        </Section>

        <Section label="Borders">
          <ColorField label="Border" value={tokens.border} onChange={(v) => setToken('border', v)} />
          <ColorField
            label="Border strong"
            value={tokens.borderStrong}
            onChange={(v) => setToken('borderStrong', v)}
          />
        </Section>
      </PanelBody>
    </div>
  )
}
