'use client'

import { Type } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelHeader, PanelBody, Section } from '@/components/ui/Panel'
import { FontPicker } from '@/components/ui/FontPicker'
import { Segmented } from '@/components/ui/Segmented'
import { loadGoogleFont, fontByCssValue } from '@/lib/google-fonts'
import { useEffect } from 'react'
import type { Density } from '@/types'

/** Typography mode — font families (with Google Fonts) and density scale. */
export function TypographyPanel() {
  const tokens   = useTokens()
  const setToken = useHub((s) => s.setToken)

  // On mount: load currently selected fonts so previews render correctly
  useEffect(() => {
    const displayFont = fontByCssValue(tokens.fontDisplay)
    const sansFont    = fontByCssValue(tokens.fontSans)
    if (displayFont) loadGoogleFont(displayFont)
    if (sansFont)    loadGoogleFont(sansFont)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full flex-col" id="ds-section-typography">
      <PanelHeader
        icon={<Type size={15} />}
        title="Typography"
        subtitle="Fonts, weight & density"
      />
      <PanelBody>
        <Section
          label="Display / Heading font"
          hint="Used for page titles, hero headings, and display text."
        >
          <FontPicker
            value={tokens.fontDisplay}
            onChange={(v) => setToken('fontDisplay', v)}
          />
          <div
            style={{ fontFamily: tokens.fontDisplay }}
            className="mt-2.5 rounded-app border border-app-border bg-app-elevated px-3 py-2.5"
          >
            <p className="text-[22px] font-bold leading-tight text-app-text">
              The quick brown fox
            </p>
            <p className="text-[14px] font-medium text-app-muted">
              AaBbCcDdEeFf 0123456789
            </p>
          </div>
        </Section>

        <Section
          label="UI / Body font"
          hint="Used for all interface text, paragraphs, and labels."
        >
          <FontPicker
            value={tokens.fontSans}
            onChange={(v) => setToken('fontSans', v)}
          />
          <div
            style={{ fontFamily: tokens.fontSans }}
            className="mt-2.5 rounded-app border border-app-border bg-app-elevated px-3 py-2.5"
          >
            <p className="text-[14px] leading-relaxed text-app-text">
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-[12px] text-app-muted">
              AaBbCcDdEeFf 0123456789
            </p>
          </div>
        </Section>

        <Section
          label="Density scale"
          hint="Controls spacing multiplier across all components."
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
              const pad = d === 'compact' ? 8 : d === 'cozy' ? 14 : 20
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
      </PanelBody>
    </div>
  )
}
