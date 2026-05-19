'use client'

import { useEffect, useId, useState } from 'react'
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TYPOGRAPHY_SCALE,
  computeStepPx,
  isFluidExpression,
  type FontFamilyId,
  type FontWeightId,
  type ScaleStep,
} from '@/src/lib/typography-scale'
import { useSessionStore } from '@/lib/store/session.store'

// Track the live viewport width so the rendered px column updates on resize
// (AC-002 implies live recompute; tooltip in AC-003 always shows breakdown).
function useViewportWidth(): number {
  const [w, setW] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

interface RowProps {
  step:          ScaleStep
  fontStack:     string
  weight:        FontWeightId
  arabicPreview: boolean
  viewportPx:    number
  t:             (en: string, ar: string) => string
}

function ScaleRow({ step, fontStack, weight, arabicPreview, viewportPx, t }: RowProps) {
  const tooltipId = useId()
  const fluid     = isFluidExpression(step.expression)
  const computed  = computeStepPx(step, viewportPx)

  return (
    <li
      role="row"
      aria-describedby={tooltipId}
      className="group relative flex flex-col gap-y-1.5 py-3 border-b border-ds-border last:border-b-0"
    >
      {/* Meta row: label · formula · computed · non-fluid badge */}
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-ds-xs">
        <span role="cell" className="w-12 font-mono font-semibold text-ds-text-primary uppercase">
          {step.label}
        </span>
        <code role="cell" className="font-mono text-ds-text-muted truncate" title={step.expression}>
          {step.expression}
        </code>
        <span role="cell" className="ms-auto font-mono text-ds-text-primary">
          → {computed}px
        </span>
        {!fluid && (
          <span
            role="status"
            className="px-1.5 py-0.5 rounded-ds-sm bg-ds-destructive/10 text-ds-destructive border border-ds-destructive/30 font-medium uppercase tracking-wide"
          >
            {t('Non-fluid', 'غير مرن')}
          </span>
        )}
      </div>

      {/* Live preview text */}
      <p
        role="cell"
        dir={arabicPreview ? 'rtl' : 'ltr'}
        style={{
          fontSize:   step.expression,
          fontFamily: fontStack,
          fontWeight: weight,
          lineHeight: arabicPreview ? 'var(--ds-leading-arabic, 1.7)' : undefined,
        }}
        className="text-ds-text-secondary"
      >
        {arabicPreview ? step.sampleAr : step.sampleEn}
      </p>

      {/* Tooltip — visible on group-hover / focus-within (AC-003) */}
      <div
        id={tooltipId}
        role="tooltip"
        className={[
          'pointer-events-none absolute z-10 end-2 top-2',
          'rounded-ds-sm border border-ds-border bg-ds-surface-elevated',
          'px-3 py-2 text-ds-xs font-mono text-ds-text-primary shadow-ds-sm',
          'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          'transition-opacity duration-ds-fast motion-reduce:transition-none',
        ].join(' ')}
      >
        <div className="flex flex-col gap-y-0.5">
          <span className="text-ds-text-muted">{t('Token', 'الرمز')}: <span className="text-ds-text-primary">{step.id}</span></span>
          <span className="text-ds-text-muted">{t('Min', 'الحد الأدنى')}: <span className="text-ds-text-primary">{step.minPx}px</span></span>
          <span className="text-ds-text-muted">{t('Preferred', 'المفضل')}: <span className="text-ds-text-primary">{step.preferredVw}vw</span></span>
          <span className="text-ds-text-muted">{t('Max', 'الحد الأقصى')}: <span className="text-ds-text-primary">{step.maxPx}px</span></span>
        </div>
      </div>
    </li>
  )
}

export default function TypographyScaleGrid() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const viewportPx = useViewportWidth()
  const [familyId, setFamilyId]     = useState<FontFamilyId>('sans')
  const [weight, setWeight]         = useState<FontWeightId>(400)
  const [arabicPreview, setArabic]  = useState(false)

  const family = FONT_FAMILIES.find((f) => f.id === familyId) ?? FONT_FAMILIES[0]

  return (
    <section
      aria-labelledby="typo-scale-heading"
      className="bg-ds-surface border border-ds-border rounded-ds-lg p-5 space-y-4"
    >
      {/* Header + controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 id="typo-scale-heading" className="text-ds-sm font-semibold text-ds-text-primary">
          {t('Typography Scale', 'مقياس الطباعة')}
        </h2>

        <div className="flex items-center flex-wrap gap-2">
          <label className="text-ds-xs text-ds-text-muted">
            {t('Font', 'الخط')}
            <select
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value as FontFamilyId)}
              className="ms-1.5 bg-ds-surface-elevated border border-ds-border rounded-ds-sm text-ds-text-primary text-ds-xs px-2 py-1 focus:outline-none focus:border-ds-primary"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </label>

          <label className="text-ds-xs text-ds-text-muted">
            {t('Weight', 'الوزن')}
            <select
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) as FontWeightId)}
              className="ms-1.5 bg-ds-surface-elevated border border-ds-border rounded-ds-sm text-ds-text-primary text-ds-xs px-2 py-1 focus:outline-none focus:border-ds-primary"
            >
              {FONT_WEIGHTS.map((w) => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setArabic((v) => !v)}
            aria-pressed={arabicPreview}
            className={[
              'text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm border',
              'transition-colors duration-ds-fast motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
              arabicPreview
                ? 'border-ds-primary bg-ds-primary-subtle text-ds-primary'
                : 'border-ds-border text-ds-text-muted hover:border-ds-border-hover hover:text-ds-text-primary',
            ].join(' ')}
          >
            {t('AR Preview', 'معاينة عربية')}
          </button>
        </div>
      </div>

      {/* Scale list — aria role=table for AT, role=row per step */}
      <ul role="table" aria-label={t('Scale steps', 'درجات المقياس')} className="flex flex-col">
        {TYPOGRAPHY_SCALE.map((step) => (
          <ScaleRow
            key={step.id}
            step={step}
            fontStack={family.stack}
            weight={weight}
            arabicPreview={arabicPreview}
            viewportPx={viewportPx}
            t={t}
          />
        ))}
      </ul>
    </section>
  )
}
