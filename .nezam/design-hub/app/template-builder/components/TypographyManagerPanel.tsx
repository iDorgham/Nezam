'use client'

import React, { useState } from 'react'
import { AlignLeft, Sparkles, GripVertical } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField, PanelSelect, PanelToggle, PanelButton } from './panel-primitives'

type Scope = 'heading' | 'body' | 'code' | 'ui'

const SCOPE_LABELS: Record<Scope, { en: string; ar: string }> = {
  heading: { en: 'Heading', ar: 'العناوين' },
  body:    { en: 'Body', ar: 'النص' },
  code:    { en: 'Code', ar: 'الكود' },
  ui:      { en: 'UI', ar: 'واجهة' },
}

const FONT_OPTIONS = [
  { value: 'Geist',             label: 'Geist' },
  { value: 'Inter',             label: 'Inter' },
  { value: 'IBM Plex Sans',     label: 'IBM Plex Sans' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'JetBrains Mono',    label: 'JetBrains Mono' },
  { value: 'Fira Code',         label: 'Fira Code' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
]

const FONT_DISPLAY_OPTS = [
  { value: 'swap',     label: 'swap' },
  { value: 'block',    label: 'block' },
  { value: 'fallback', label: 'fallback' },
  { value: 'optional', label: 'optional' },
]

interface TypoConfig {
  font: string
  weight: number
  width: number
  slant: number
  fallbacks: string[]
  fontDisplay: string
  foitGuard: boolean
}

const DEFAULT_CONFIGS: Record<Scope, TypoConfig> = {
  heading: { font: 'Geist', weight: 700, width: 100, slant: 0, fallbacks: ['Inter', 'system-ui', 'sans-serif'], fontDisplay: 'swap', foitGuard: true },
  body:    { font: 'IBM Plex Sans', weight: 400, width: 100, slant: 0, fallbacks: ['Inter', 'system-ui', 'sans-serif'], fontDisplay: 'swap', foitGuard: false },
  code:    { font: 'JetBrains Mono', weight: 400, width: 100, slant: 0, fallbacks: ['Fira Code', 'ui-monospace', 'monospace'], fontDisplay: 'block', foitGuard: false },
  ui:      { font: 'Inter', weight: 500, width: 100, slant: 0, fallbacks: ['system-ui', 'sans-serif'], fontDisplay: 'swap', foitGuard: false },
}

const AI_PAIRINGS: Record<Scope, string[]> = {
  heading: ['Plus Jakarta Sans', 'Geist'],
  body:    ['Inter', 'IBM Plex Sans'],
  code:    ['JetBrains Mono', 'Fira Code'],
  ui:      ['Inter', 'Plus Jakarta Sans'],
}

function readabilityScore(font: string, weight: number, width: number): number {
  let score = 70
  if (['IBM Plex Sans', 'Inter'].includes(font)) score += 15
  if (weight >= 300 && weight <= 500) score += 10
  if (width >= 90 && width <= 110) score += 5
  return Math.min(100, score)
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px]" style={{ color: PT.textLabel }}>{label}</span>
        <span className="text-[9px] tabular-nums" style={{ color: PT.textSecondary }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer accent-[var(--ds-primary)]"
        style={{ background: `linear-gradient(to right, var(--ds-primary) ${((value - min) / (max - min)) * 100}%, ${PT.border} 0)` }}
        aria-label={label} />
    </div>
  )
}

export default function TypographyManagerPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  const [scope, setScope] = useState<Scope>('heading')
  const [configs, setConfigs] = useState<Record<Scope, TypoConfig>>(DEFAULT_CONFIGS)
  const [showPairings, setShowPairings] = useState(false)
  const [dragFallbackIdx, setDragFallbackIdx] = useState<number | null>(null)
  const dragOverIdx = React.useRef<number | null>(null)

  const cfg = configs[scope]

  function update<K extends keyof TypoConfig>(key: K, value: TypoConfig[K]) {
    setConfigs(prev => ({ ...prev, [scope]: { ...prev[scope], [key]: value } }))
  }

  function suggestPairings() { setShowPairings(true) }

  const score = readabilityScore(cfg.font, cfg.weight, cfg.width)
  const scoreColor = score >= 85 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444'

  function onFallbackDragStart(idx: number) { setDragFallbackIdx(idx) }
  function onFallbackDragEnter(idx: number) { dragOverIdx.current = idx }
  function onFallbackDragEnd() {
    if (dragFallbackIdx !== null && dragOverIdx.current !== null && dragFallbackIdx !== dragOverIdx.current) {
      const next = [...cfg.fallbacks]
      const [moved] = next.splice(dragFallbackIdx, 1)
      next.splice(dragOverIdx.current, 0, moved)
      update('fallbacks', next)
    }
    setDragFallbackIdx(null)
    dragOverIdx.current = null
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<AlignLeft size={12} />}
        title={t('Typography Manager', 'مدير الطباعة')}
        subtitle={t('Fonts · Variable · Fallbacks', 'الخطوط · المتغيرة · الاحتياطية')}
      />

      {/* Scope tabs */}
      <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: PT.border }}>
        {(['heading', 'body', 'code', 'ui'] as Scope[]).map(s => (
          <button key={s} onClick={() => setScope(s)}
            className="flex-1 py-1 text-[9px] font-medium rounded transition-all"
            style={{
              background: scope === s ? 'rgba(6,182,212,0.12)' : 'transparent',
              color: scope === s ? 'var(--ds-primary)' : PT.textMuted,
              border: `1px solid ${scope === s ? 'var(--ds-primary)' : 'transparent'}`,
            }}
            aria-pressed={scope === s}>
            {t(SCOPE_LABELS[s].en, SCOPE_LABELS[s].ar)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Font picker */}
        <PanelSection title={t('Font Family', 'عائلة الخط')} defaultOpen>
          <PanelField label={t('Font', 'الخط')} row={false}>
            <PanelSelect value={cfg.font} onChange={v => update('font', v)} options={FONT_OPTIONS} />
          </PanelField>

          {/* Preview */}
          <div className="px-2.5 py-2 rounded-md border text-center"
            style={{ background: PT.bgElevated, borderColor: PT.border, fontFamily: cfg.font, fontWeight: cfg.weight }}>
            <div className="text-[13px]" style={{ color: PT.textPrimary }}>
              {t('The quick brown fox', 'السرعة البنية الثعلب')}
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: PT.textMuted }}>
              {cfg.font} · {cfg.weight} · {scope}
            </div>
          </div>

          {/* AI pairing */}
          <PanelButton size="xs" variant="ghost" fullWidth icon={<Sparkles size={9} />} onClick={suggestPairings}>
            {t('AI Pairing Suggestion', 'اقتراح توافق ذكي')}
          </PanelButton>
          {showPairings && (
            <div className="mt-1 space-y-1">
              <div className="text-[8px] font-bold uppercase" style={{ color: PT.textLabel }}>
                {t('Suggested pairings', 'أزواج مقترحة')}
              </div>
              {AI_PAIRINGS[scope].map(f => (
                <button key={f} onClick={() => { update('font', f); setShowPairings(false) }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[9px] hover:bg-white/[0.04] transition-colors"
                  style={{ background: PT.surface, borderColor: PT.border, color: PT.textPrimary }}>
                  <span style={{ fontFamily: f }}>{f}</span>
                  <span style={{ color: PT.textMuted }}>{t('Use', 'استخدام')}</span>
                </button>
              ))}
            </div>
          )}
        </PanelSection>

        {/* Variable font */}
        <PanelSection title={t('Variable Font', 'خط متغير')} defaultOpen={false}>
          <Slider label={t('Weight', 'الوزن')} value={cfg.weight} min={100} max={900} step={100} onChange={v => update('weight', v)} />
          <Slider label={t('Width', 'العرض')} value={cfg.width} min={50} max={200} unit="%" onChange={v => update('width', v)} />
          <Slider label={t('Slant', 'الميل')} value={cfg.slant} min={-15} max={0} onChange={v => update('slant', v)} unit="°" />
        </PanelSection>

        {/* Readability */}
        <PanelSection title={t('Readability', 'قابلية القراءة')} defaultOpen={false}>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px]" style={{ color: PT.textLabel }}>{t('Score', 'النتيجة')}</span>
              <span className="text-[10px] font-bold tabular-nums" style={{ color: scoreColor }}>{score}/100</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: PT.border }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <p className="text-[8px] leading-relaxed" style={{ color: PT.textMuted }}>
              {score >= 85
                ? t('Excellent readability — good for body text.', 'قراءة ممتازة — مناسب للنصوص.')
                : score >= 65
                  ? t('Good readability — may suit headings.', 'قراءة جيدة — مناسب للعناوين.')
                  : t('Low readability — consider a different weight.', 'قراءة منخفضة — جرب وزنًا مختلفًا.')}
            </p>
          </div>
        </PanelSection>

        {/* Fallback stack */}
        <PanelSection title={t('Fallback Stack', 'مكدس الاحتياطي')} defaultOpen={false}>
          <div className="space-y-1">
            {cfg.fallbacks.map((fb, idx) => (
              <div key={idx}
                draggable
                onDragStart={() => onFallbackDragStart(idx)}
                onDragEnter={() => onFallbackDragEnter(idx)}
                onDragEnd={onFallbackDragEnd}
                onDragOver={e => e.preventDefault()}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border cursor-grab active:cursor-grabbing"
                style={{ background: PT.surface, borderColor: dragFallbackIdx === idx ? 'var(--ds-primary)' : PT.border }}>
                <GripVertical size={10} style={{ color: PT.textMuted, flexShrink: 0 }} />
                <span className="flex-1 text-[9px]" style={{ color: PT.textPrimary, fontFamily: fb }}>{fb}</span>
                <span className="text-[7px] tabular-nums" style={{ color: PT.textLabel }}>{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <PanelField label="font-display" row>
              <PanelSelect value={cfg.fontDisplay} onChange={v => update('fontDisplay', v)} options={FONT_DISPLAY_OPTS} />
            </PanelField>
          </div>

          <PanelToggle
            label={t('FOIT Guard', 'حماية FOIT')}
            desc={t('Add font-display: optional for invisible text prevention', 'إضافة font-display: optional لمنع النص الغير مرئي')}
            checked={cfg.foitGuard}
            onChange={v => update('foitGuard', v)}
          />
        </PanelSection>
      </div>
    </div>
  )
}
