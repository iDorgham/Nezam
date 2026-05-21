'use client'

import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react'
import {
  RADIUS_BUCKETS,
  MIN_RADIUS_PX,
  MAX_RADIUS_PX,
  bucketForValue,
  clampRadius,
  parseRadiusInput,
  type RadiusBucketId,
} from '@/src/lib/border-radius'
import { useTokenStore } from '@/src/store/tokens.store'
import { useSessionStore } from '@/lib/store/session.store'
import type { DesignTokens } from '@/src/types/tokens.types'

// Per-token defaults used when no preset is active and no override has been
// recorded yet. These match the values in app/globals.css.
const FALLBACK_PX: Record<RadiusBucketId, number> = {
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl': 24,
}

function readPx(tokens: Partial<DesignTokens>, key: keyof DesignTokens, fallback: number): number {
  const raw = tokens[key]
  if (typeof raw !== 'string') return fallback
  const parsed = parseRadiusInput(raw)
  return parsed.ok ? parsed.value : fallback
}

export default function BorderRadiusEditor() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const setToken    = useTokenStore((s) => s.setToken)
  // Subscribe to overrides + active preset so the editor reflects external
  // resets (e.g. switching presets via the sidebar).
  const activeTokens = useTokenStore((s) => s.getActiveTokens())

  const [activeBucketId, setActiveBucketId] = useState<RadiusBucketId>('md')
  const activeBucket = RADIUS_BUCKETS.find((b) => b.id === activeBucketId) ?? RADIUS_BUCKETS[2]

  const externalValue = readPx(activeTokens, activeBucket.tokenKey, FALLBACK_PX[activeBucketId])
  const [value, setValue]         = useState(externalValue)
  const [inputText, setInputText] = useState(String(externalValue))
  const [inputError, setInputError] = useState<string | null>(null)

  // Sync local state when the active bucket changes (or when external state
  // resets, e.g. a preset is applied).
  useEffect(() => {
    setValue(externalValue)
    setInputText(String(externalValue))
    setInputError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBucketId, externalValue])

  const commit = useCallback(
    (next: number) => {
      const clamped = clampRadius(next)
      setValue(clamped)
      setInputText(String(clamped))
      setInputError(null)
      setToken(activeBucket.tokenKey, `${clamped}px`)
    },
    [setToken, activeBucket.tokenKey],
  )

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commit(Number(e.target.value))
  }

  // Shift+Arrow → ±4px. Native range input already handles plain arrows (±1
  // because step=1), so we only intercept the shifted variants.
  const handleSliderKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!e.shiftKey) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      commit(value + 4)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      commit(value - 4)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
    if (inputError) setInputError(null)
  }

  // Commit on Enter, blur, or Tab.
  const handleInputCommit = () => {
    const parsed = parseRadiusInput(inputText)
    if (!parsed.ok) {
      if (parsed.reason === 'empty') {
        // Empty input → revert silently to the current value.
        setInputText(String(value))
        return
      }
      setInputError(t('Invalid unit', 'وحدة غير صالحة'))
      setInputText(String(value)) // AC-003: revert to previous
      return
    }
    commit(parsed.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleInputCommit()
    }
  }

  const sliderId       = useId()
  const inputId        = useId()
  const inputErrorId   = useId()
  const cssVarName     = `--ds-radius-${activeBucket.id === '2xl' ? '2xl' : activeBucket.id}`

  // Memoize preview style so we don't allocate per render.
  const previewStyle = useMemo(
    () => ({ borderRadius: `var(${cssVarName})` }),
    [cssVarName],
  )

  return (
    <section
      aria-labelledby={`${sliderId}-label`}
      className="bg-ds-surface border border-ds-border rounded-ds-lg p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-x-3">
        <h2
          id={`${sliderId}-label`}
          className="text-ds-sm font-semibold text-ds-text-primary"
        >
          {t('Border Radius', 'انحناء الحواف')}
        </h2>
        <span className="text-ds-xs font-mono text-ds-text-muted">
          {value}px <span className="text-ds-text-disabled">·</span>{' '}
          <span className="text-ds-text-primary">{cssVarName}</span>
        </span>
      </div>

      {/* Bucket selector */}
      <div
        role="radiogroup"
        aria-label={t('Token to edit', 'الرمز قيد التعديل')}
        className="flex flex-wrap gap-1.5"
      >
        {RADIUS_BUCKETS.map((b) => {
          const isActive = b.id === activeBucketId
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActiveBucketId(b.id)}
              className={[
                'px-2.5 py-1 rounded-ds-sm text-ds-xs font-medium border',
                'transition-colors duration-ds-fast motion-reduce:transition-none',
                'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
                isActive
                  ? 'border-ds-primary bg-ds-primary-subtle text-ds-primary'
                  : 'border-ds-border text-ds-text-muted hover:border-ds-border-hover hover:text-ds-text-primary',
              ].join(' ')}
            >
              {b.label}
            </button>
          )
        })}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          id={sliderId}
          type="range"
          min={MIN_RADIUS_PX}
          max={MAX_RADIUS_PX}
          step={1}
          value={value}
          aria-valuemin={MIN_RADIUS_PX}
          aria-valuemax={MAX_RADIUS_PX}
          aria-valuenow={value}
          aria-valuetext={`${value} pixels, ${activeBucket.label}`}
          onChange={handleSliderChange}
          onKeyDown={handleSliderKeyDown}
          className="w-full accent-ds-primary"
        />
        <div className="flex items-center justify-between text-ds-xs text-ds-text-muted">
          <span>{t('Sharp', 'حاد')} · {MIN_RADIUS_PX}px</span>
          <span>{MAX_RADIUS_PX}px · {t('Soft', 'ناعم')}</span>
        </div>
      </div>

      {/* Numeric input + unit label */}
      <div className="flex items-end gap-x-2">
        <div className="flex-1 space-y-1">
          <label htmlFor={inputId} className="text-ds-xs font-medium text-ds-text-muted">
            {t('Value', 'القيمة')}
          </label>
          <div className="flex items-center gap-x-2">
            <input
              id={inputId}
              type="text"
              inputMode="numeric"
              value={inputText}
              onChange={handleInputChange}
              onBlur={handleInputCommit}
              onKeyDown={handleInputKeyDown}
              aria-invalid={inputError ? 'true' : undefined}
              aria-describedby={inputError ? inputErrorId : undefined}
              className={[
                'w-20 px-2.5 py-1.5 rounded-ds-sm text-ds-sm font-mono',
                'bg-ds-surface-elevated border text-ds-text-primary',
                'focus:outline-none focus:border-ds-primary',
                inputError ? 'border-ds-destructive' : 'border-ds-border',
              ].join(' ')}
            />
            <span className="text-ds-xs text-ds-text-muted">px</span>
          </div>
          {inputError && (
            <p id={inputErrorId} role="alert" className="text-ds-xs text-ds-destructive">
              {inputError}
            </p>
          )}
        </div>
      </div>

      {/* Live preview — Button, Card, Input, Dialog stubs */}
      <div className="space-y-2">
        <span className="text-ds-xs font-semibold uppercase tracking-wide text-ds-text-muted">
          {t('Preview', 'معاينة')}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Button stub */}
          <div
            aria-hidden="true"
            style={previewStyle}
            className="h-10 flex items-center justify-center bg-ds-primary text-ds-primary-foreground text-ds-xs font-medium border border-ds-primary motion-reduce:transition-none"
          >
            Button
          </div>
          {/* Card stub */}
          <div
            aria-hidden="true"
            style={previewStyle}
            className="h-10 flex items-center justify-center bg-ds-surface-elevated border border-ds-border text-ds-xs text-ds-text-primary motion-reduce:transition-none"
          >
            Card
          </div>
          {/* Input stub */}
          <div
            aria-hidden="true"
            style={previewStyle}
            className="h-10 flex items-center px-3 bg-ds-surface-elevated border border-ds-border text-ds-xs text-ds-text-muted motion-reduce:transition-none"
          >
            <span>{t('Type here…', 'اكتب هنا…')}</span>
          </div>
          {/* Dialog stub */}
          <div
            aria-hidden="true"
            style={previewStyle}
            className="h-10 flex items-center justify-center bg-ds-surface border border-ds-border-strong shadow-sm text-ds-xs text-ds-text-primary motion-reduce:transition-none"
          >
            Dialog
          </div>
        </div>
      </div>
    </section>
  )
}
