'use client'

/**
 * Extracted sub-sections from StylesPanel for use in both the DS editor
 * panel (DesignSystemEditorPanel) and the full StylesPanel.
 */

import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { ColorField } from '@/components/ui/ColorField'
import { Slider } from '@/components/ui/Slider'
import { Segmented } from '@/components/ui/Segmented'
import { SlidersHorizontal, BoxSelect } from 'lucide-react'
import { PanelHeader } from '@/components/ui/Panel'
import type { ShadowStyle, Density } from '@/types'

interface StylesSectionsProps {
  /** 'spacing' — density scale section only. 'shape' — radius, shadows, surfaces. 'all' — everything. */
  focusSection?: 'spacing' | 'shape' | 'all'
}

export function StylesSections({ focusSection = 'all' }: StylesSectionsProps) {
  const tokens   = useTokens()
  const setToken = useHub((s) => s.setToken)

  const showSpacing = focusSection === 'spacing' || focusSection === 'all'
  const showShape   = focusSection === 'shape'   || focusSection === 'all'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {focusSection === 'spacing' && (
        <PanelHeader
          icon={<SlidersHorizontal size={15} />}
          title="Spacing"
          subtitle="Density scale & gaps"
        />
      )}
      {focusSection === 'shape' && (
        <PanelHeader
          icon={<BoxSelect size={15} />}
          title="Shape"
          subtitle="Radius, elevation & surfaces"
        />
      )}

      <PanelBody>
        {/* ── Spacing / Density ────────────────────────────── */}
        {showSpacing && (
          <Section
            id="ds-section-spacing"
            label="Density scale"
            hint="Scales padding and gaps across all components."
          >
            <Segmented<Density>
              value={tokens.density}
              onChange={(v) => setToken('density', v)}
              className="w-full [&>button]:flex-1"
              options={[
                { value: 'compact',   label: 'Compact'   },
                { value: 'cozy',      label: 'Cozy'      },
                { value: 'spacious',  label: 'Spacious'  },
              ]}
            />
            <div className="mt-3 flex items-end gap-3">
              {(['compact', 'cozy', 'spacious'] as Density[]).map((d) => {
                const pad    = d === 'compact' ? 8 : d === 'cozy' ? 14 : 20
                const active = d === tokens.density
                return (
                  <button
                    key={d}
                    onClick={() => setToken('density', d)}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-app border transition-colors"
                      style={{
                        padding: pad,
                        background: active ? 'var(--app-accent-subtle)' : 'var(--app-elevated)',
                        borderColor: active ? 'var(--app-accent)' : 'var(--app-border)',
                      }}
                    />
                    <span
                      className="text-[9px] capitalize"
                      style={{ color: active ? 'var(--app-accent)' : 'var(--app-subtle)' }}
                    >
                      {d}
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>
        )}

        {/* ── Shape / Corner radius ────────────────────────── */}
        {showShape && (
          <>
            <Section
              id="ds-section-shape"
              label="Corner radius"
              hint="Base radius that scales every rounded surface."
            >
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
                  { value: 'none',     label: 'None'  },
                  { value: 'soft',     label: 'Soft'  },
                  { value: 'crisp',    label: 'Crisp' },
                  { value: 'dramatic', label: 'Bold'  },
                ]}
              />
            </Section>

            <Section label="Surfaces">
              <ColorField label="Background" value={tokens.bg}       onChange={(v) => setToken('bg', v)} />
              <ColorField label="Surface"    value={tokens.surface}  onChange={(v) => setToken('surface', v)} />
              <ColorField label="Elevated"   value={tokens.elevated} hint="Cards & popovers" onChange={(v) => setToken('elevated', v)} />
            </Section>

            <Section label="Borders">
              <ColorField label="Border"        value={tokens.border}       onChange={(v) => setToken('border', v)} />
              <ColorField label="Border strong" value={tokens.borderStrong} onChange={(v) => setToken('borderStrong', v)} />
            </Section>
          </>
        )}
      </PanelBody>
    </div>
  )
}
