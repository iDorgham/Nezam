'use client'

import React, { useState } from 'react'
import { Code2, Monitor, Tablet, Smartphone, RotateCcw, RotateCw } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField } from './panel-primitives'

type Breakpoint = 'desktop' | 'tablet' | 'mobile'

interface CssState {
  marginTop: number; marginRight: number; marginBottom: number; marginLeft: number
  paddingTop: number; paddingRight: number; paddingBottom: number; paddingLeft: number
  width: string; height: string
  fontSize: number; lineHeight: number; letterSpacing: number; fontWeight: number
  bgColor: string; bgImage: string
  borderRadius: number; borderWidth: number; borderStyle: string; borderColor: string
  shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string
}

const DEFAULT_STATE: CssState = {
  marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
  paddingTop: 16, paddingRight: 24, paddingBottom: 16, paddingLeft: 24,
  width: 'auto', height: 'auto',
  fontSize: 16, lineHeight: 150, letterSpacing: 0, fontWeight: 400,
  bgColor: '#ffffff', bgImage: '',
  borderRadius: 8, borderWidth: 0, borderStyle: 'solid', borderColor: '#cccccc',
  shadowX: 0, shadowY: 4, shadowBlur: 12, shadowSpread: 0, shadowColor: 'rgba(0,0,0,0.1)',
}

function Stepper({ value, onChange, min = 0, max = 999, unit = 'px', label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string; label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[8px]" style={{ color: PT.textLabel }}>{label}</span>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-4 h-4 flex items-center justify-center rounded text-[10px] transition-colors hover:bg-white/[0.06]"
          style={{ color: PT.textMuted, border: `1px solid ${PT.border}`, background: PT.surface }}
          aria-label={`Decrease ${label}`}
        >−</button>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
          className="w-8 text-center text-[9px] rounded border outline-none"
          style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary, padding: '1px 2px' }}
          aria-label={label}
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-4 h-4 flex items-center justify-center rounded text-[10px] transition-colors hover:bg-white/[0.06]"
          style={{ color: PT.textMuted, border: `1px solid ${PT.border}`, background: PT.surface }}
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
      <span className="text-[7px]" style={{ color: PT.textMuted }}>{unit}</span>
    </div>
  )
}

const BORDER_STYLES = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'none', label: 'None' },
]

const BP_ICONS: Record<Breakpoint, React.ReactNode> = {
  desktop: <Monitor size={11} />,
  tablet:  <Tablet size={11} />,
  mobile:  <Smartphone size={11} />,
}

const MAX_HISTORY = 20

export default function CssVisualEditorPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  const [bp, setBp] = useState<Breakpoint>('desktop')
  const [css, setCss] = useState<CssState>(DEFAULT_STATE)
  const [history, setHistory] = useState<CssState[]>([DEFAULT_STATE])
  const [histIdx, setHistIdx] = useState(0)

  function update<K extends keyof CssState>(key: K, value: CssState[K]) {
    const next = { ...css, [key]: value }
    setCss(next)
    const trimmed = history.slice(0, histIdx + 1)
    const newHist = [...trimmed, next].slice(-MAX_HISTORY)
    setHistory(newHist)
    setHistIdx(newHist.length - 1)
  }

  function undo() {
    if (histIdx > 0) { setHistIdx(i => i - 1); setCss(history[histIdx - 1]) }
  }
  function redo() {
    if (histIdx < history.length - 1) { setHistIdx(i => i + 1); setCss(history[histIdx + 1]) }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<Code2 size={12} />}
        title={t('CSS Visual Editor', 'محرر CSS المرئي')}
        subtitle={t('Box · Type · Background', 'مربع · نص · خلفية')}
        actions={
          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={histIdx === 0} title={t('Undo', 'تراجع')} aria-label={t('Undo', 'تراجع')}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors disabled:opacity-30"
              style={{ color: PT.textMuted }}>
              <RotateCcw size={9} />
            </button>
            <button onClick={redo} disabled={histIdx === history.length - 1} title={t('Redo', 'إعادة')} aria-label={t('Redo', 'إعادة')}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors disabled:opacity-30"
              style={{ color: PT.textMuted }}>
              <RotateCw size={9} />
            </button>
          </div>
        }
      />

      {/* Breakpoint switcher */}
      <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 border-b" style={{ borderColor: PT.border }}>
        {(['desktop', 'tablet', 'mobile'] as Breakpoint[]).map(b => (
          <button
            key={b}
            onClick={() => setBp(b)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium transition-all capitalize"
            style={{
              background: bp === b ? 'rgba(6,182,212,0.12)' : 'transparent',
              color: bp === b ? 'var(--ds-primary)' : PT.textMuted,
              border: `1px solid ${bp === b ? 'var(--ds-primary)' : 'transparent'}`,
            }}
            aria-pressed={bp === b}
          >
            {BP_ICONS[b]}
            <span className="hidden sm:inline">{t(b.charAt(0).toUpperCase() + b.slice(1), b)}</span>
          </button>
        ))}
        <span className="text-[8px] ms-auto" style={{ color: PT.textMuted }}>
          {bp === 'desktop' ? '>1024px' : bp === 'tablet' ? '768px' : '<480px'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Box Model */}
        <PanelSection title={t('Box Model', 'نموذج الصندوق')} defaultOpen>
          <div className="space-y-3">
            {/* Margin */}
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: PT.textLabel }}>
                {t('Margin', 'هامش خارجي')}
              </div>
              <div className="grid grid-cols-4 gap-1">
                <Stepper label="T" value={css.marginTop} onChange={v => update('marginTop', v)} />
                <Stepper label="R" value={css.marginRight} onChange={v => update('marginRight', v)} />
                <Stepper label="B" value={css.marginBottom} onChange={v => update('marginBottom', v)} />
                <Stepper label="L" value={css.marginLeft} onChange={v => update('marginLeft', v)} />
              </div>
            </div>
            {/* Padding */}
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: PT.textLabel }}>
                {t('Padding', 'حشو داخلي')}
              </div>
              <div className="grid grid-cols-4 gap-1">
                <Stepper label="T" value={css.paddingTop} onChange={v => update('paddingTop', v)} />
                <Stepper label="R" value={css.paddingRight} onChange={v => update('paddingRight', v)} />
                <Stepper label="B" value={css.paddingBottom} onChange={v => update('paddingBottom', v)} />
                <Stepper label="L" value={css.paddingLeft} onChange={v => update('paddingLeft', v)} />
              </div>
            </div>
            {/* Size */}
            <div className="grid grid-cols-2 gap-2">
              <PanelField label={t('Width', 'العرض')} row={false}>
                <input value={css.width} onChange={e => update('width', e.target.value)}
                  className="w-full px-2 py-1 text-[9px] rounded border outline-none"
                  style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
                  title={t('Width value', 'قيمة العرض')} />
              </PanelField>
              <PanelField label={t('Height', 'الارتفاع')} row={false}>
                <input value={css.height} onChange={e => update('height', e.target.value)}
                  className="w-full px-2 py-1 text-[9px] rounded border outline-none"
                  style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
                  title={t('Height value', 'قيمة الارتفاع')} />
              </PanelField>
            </div>
          </div>
        </PanelSection>

        {/* Typography */}
        <PanelSection title={t('Typography', 'الطباعة')} defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            <Stepper label={t('Size', 'الحجم')} value={css.fontSize} onChange={v => update('fontSize', v)} min={8} max={144} />
            <Stepper label={t('Height', 'الارتفاع')} value={css.lineHeight} onChange={v => update('lineHeight', v)} min={100} max={300} unit="%" />
            <Stepper label={t('Spacing', 'التباعد')} value={css.letterSpacing} onChange={v => update('letterSpacing', v)} min={-10} max={30} />
            <Stepper label={t('Weight', 'الوزن')} value={css.fontWeight} onChange={v => update('fontWeight', Math.round(v / 100) * 100)} min={100} max={900} unit="" />
          </div>
        </PanelSection>

        {/* Background */}
        <PanelSection title={t('Background', 'الخلفية')} defaultOpen={false}>
          <PanelField label={t('Color', 'اللون')} row>
            <div className="flex items-center gap-1.5">
              <input type="color" value={css.bgColor} onChange={e => update('bgColor', e.target.value)}
                className="w-6 h-6 rounded border cursor-pointer"
                style={{ borderColor: PT.border }}
                title={t('Background color', 'لون الخلفية')} aria-label={t('Background color', 'لون الخلفية')} />
              <input value={css.bgColor} onChange={e => update('bgColor', e.target.value)}
                className="flex-1 px-2 py-1 text-[9px] rounded border outline-none font-mono"
                style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
                title={t('Background color hex', 'قيمة لون الخلفية')} />
            </div>
          </PanelField>
          <PanelField label={t('Image URL', 'رابط الصورة')} row={false}>
            <input value={css.bgImage} onChange={e => update('bgImage', e.target.value)}
              placeholder="https://…/image.jpg"
              className="w-full px-2.5 py-1.5 text-[9px] rounded border outline-none"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
              title={t('Background image URL', 'رابط صورة الخلفية')} />
          </PanelField>
        </PanelSection>

        {/* Borders */}
        <PanelSection title={t('Borders', 'الحدود')} defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            <Stepper label={t('Radius', 'الانحناء')} value={css.borderRadius} onChange={v => update('borderRadius', v)} />
            <Stepper label={t('Width', 'العرض')} value={css.borderWidth} onChange={v => update('borderWidth', v)} />
          </div>
          <PanelField label={t('Style', 'النمط')} row={false}>
            <div className="flex gap-1">
              {BORDER_STYLES.map(s => (
                <button key={s.value} onClick={() => update('borderStyle', s.value)}
                  className="flex-1 py-1 text-[8px] rounded border transition-colors"
                  style={{
                    background: css.borderStyle === s.value ? 'rgba(6,182,212,0.12)' : PT.surface,
                    borderColor: css.borderStyle === s.value ? 'var(--ds-primary)' : PT.border,
                    color: css.borderStyle === s.value ? 'var(--ds-primary)' : PT.textMuted,
                  }}
                  aria-pressed={css.borderStyle === s.value}>
                  {s.label}
                </button>
              ))}
            </div>
          </PanelField>
        </PanelSection>

        {/* Shadows */}
        <PanelSection title={t('Shadows', 'الظلال')} defaultOpen={false}>
          <div className="grid grid-cols-4 gap-1">
            <Stepper label="X" value={css.shadowX} onChange={v => update('shadowX', v)} min={-50} max={50} />
            <Stepper label="Y" value={css.shadowY} onChange={v => update('shadowY', v)} min={-50} max={50} />
            <Stepper label={t('Blur', 'ضبابية')} value={css.shadowBlur} onChange={v => update('shadowBlur', v)} />
            <Stepper label={t('Spread', 'انتشار')} value={css.shadowSpread} onChange={v => update('shadowSpread', v)} min={-50} max={50} />
          </div>
        </PanelSection>
      </div>
    </div>
  )
}
