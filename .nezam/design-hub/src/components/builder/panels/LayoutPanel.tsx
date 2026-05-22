'use client'

import { LayoutGrid } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { Segmented } from '@/components/ui/Segmented'
import type { Density } from '@/types'

const DENSITY_NOTE: Record<Density, string> = {
  compact: 'Tight rhythm — dashboards and data-dense screens.',
  cozy: 'Balanced rhythm — the dependable default.',
  spacious: 'Generous rhythm — calm marketing and editorial layouts.',
}

const DENSITY_UNIT: Record<Density, number> = { compact: 3, cozy: 4, spacious: 6 }

/** Layout mode — spacing rhythm and structural density. */
export function LayoutPanel() {
  const tokens = useTokens()
  const setToken = useHub((s) => s.setToken)
  const selection = useHub((s) => s.selection)
  const unit = DENSITY_UNIT[tokens.density]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<LayoutGrid size={15} />}
        title="Layout"
        subtitle="Spacing rhythm & density"
      />
      <PanelBody>
        {selection && (
          <div className="mb-5 rounded-app border border-app-accent/40 bg-app-accent-subtle px-3 py-2 text-[11px] text-app-text">
            <span className="font-semibold">{selection.label}</span> inherits the system spacing
            scale below.
          </div>
        )}

        <Section label="Density" hint={DENSITY_NOTE[tokens.density]}>
          <Segmented<Density>
            value={tokens.density}
            onChange={(v) => setToken('density', v)}
            className="w-full [&>button]:flex-1"
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'cozy', label: 'Cozy' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
        </Section>

        <Section label="Spacing scale" hint="Every gap and pad derives from one base unit.">
          <ControlCard>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[11px] text-app-muted">Base unit</span>
              <span className="font-mono text-[11px] text-app-text">{unit}px</span>
            </div>
            <div className="space-y-1.5">
              {[1, 2, 3, 4, 6, 8].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="w-7 shrink-0 font-mono text-[10px] text-app-subtle">
                    {step}×
                  </span>
                  <div
                    className="h-3 rounded-[3px] bg-app-accent transition-all duration-300 ease-smooth"
                    style={{ width: unit * step * 3 }}
                  />
                  <span className="font-mono text-[10px] text-app-subtle">{unit * step}px</span>
                </div>
              ))}
            </div>
          </ControlCard>
        </Section>

        <Section label="Container">
          <ControlCard>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-app-muted">Preview frame</span>
              <span className="font-mono text-app-text">390 / 834 / 1280</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-app-subtle">
              Switch device sizes from the canvas toolbar to test every breakpoint against the
              current spacing rhythm.
            </p>
          </ControlCard>
        </Section>
      </PanelBody>
    </div>
  )
}
