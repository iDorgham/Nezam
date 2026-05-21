'use client'

import type { DesignPreset } from '@/src/types/tokens.types'
import { useSessionStore } from '@/lib/store/session.store'
import { Lock, User, Check, Pencil, Loader2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfileCardProps {
  preset:     DesignPreset
  isActive:   boolean
  isApplying?: boolean
  onApply:    (id: string) => void
  onEdit?:    (preset: DesignPreset) => void
}

// ── Color swatch helpers ──────────────────────────────────────────────────────

function SwatchDot({ color }: { color: string | undefined }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-3 h-3 rounded-full border border-ds-border shrink-0"
      style={color ? { backgroundColor: color } : undefined}
    />
  )
}

function ColorSwatches({ tokens }: { tokens: DesignPreset['tokens'] }) {
  const colors = [tokens.primary, tokens.background, tokens.surface]
  const hasColors = colors.some(Boolean)

  if (!hasColors) {
    return (
      <span className="flex gap-x-1 items-center opacity-40" aria-hidden="true">
        <SwatchDot color={undefined} />
        <SwatchDot color={undefined} />
        <SwatchDot color={undefined} />
      </span>
    )
  }

  return (
    <span className="flex gap-x-1 items-center" aria-hidden="true">
      {colors.map((c, i) => <SwatchDot key={i} color={c} />)}
    </span>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function PresetBadge({ isSystem }: { isSystem: boolean }) {
  if (isSystem) {
    return (
      <span className="inline-flex items-center gap-x-1 text-ds-text-muted text-ds-xs px-2 py-0.5 rounded-ds-sm bg-ds-border select-none">
        <Lock size={10} aria-hidden="true" />
        System
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-x-1 text-ds-primary text-ds-xs px-2 py-0.5 rounded-ds-sm bg-ds-primary-subtle select-none">
      <User size={10} aria-hidden="true" />
      Custom
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProfileCard({ preset, isActive, isApplying, onApply, onEdit }: ProfileCardProps) {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const handleApply = () => {
    if (!isActive && !isApplying) onApply(preset.id)
  }

  return (
    <article
      aria-label={preset.name}
      aria-current={isActive ? 'true' : undefined}
      className={[
        'flex items-center gap-x-3 px-3 py-2.5',
        'rounded-ds-md border transition-colors duration-ds-fast',
        'bg-ds-surface',
        isActive
          ? 'border-ds-primary'
          : 'border-ds-border hover:border-ds-border-hover',
      ].join(' ')}
    >
      {/* Color preview */}
      <ColorSwatches tokens={preset.tokens} />

      {/* Name + badge */}
      <div className="flex-1 min-w-0 flex flex-col gap-y-0.5">
        <span
          className="text-ds-sm font-medium text-ds-text-primary truncate leading-tight"
          title={preset.name}
        >
          {preset.name}
        </span>
        <PresetBadge isSystem={preset.isSystem} />
      </div>

      {/* Active indicator */}
      {isActive && (
        <span
          aria-label={t('Applied', 'مُطبَّق')}
          className="shrink-0 text-ds-primary"
        >
          <Check size={14} strokeWidth={2.5} aria-hidden="true" />
        </span>
      )}

      {/* Apply button */}
      <button
        type="button"
        disabled={isActive || isApplying}
        onClick={handleApply}
        aria-pressed={isActive}
        aria-label={
          isActive
            ? t('Preset applied', 'تم تطبيق النمط')
            : t(`Apply preset: ${preset.name}`, `تطبيق النمط: ${preset.name}`)
        }
        className={[
          'shrink-0 text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm',
          'transition-colors duration-ds-fast',
          'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          isActive
            ? 'bg-ds-border text-ds-text-muted cursor-default'
            : 'bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary-hover',
        ].join(' ')}
      >
        {isApplying && !isActive ? (
          <Loader2 size={12} className="animate-spin" aria-hidden="true" />
        ) : (
          t(isActive ? 'Applied' : 'Apply', isActive ? 'مُطبَّق' : 'تطبيق')
        )}
      </button>

      {/* Edit button — custom presets only */}
      {!preset.isSystem && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(preset)}
          aria-label={t(`Edit preset: ${preset.name}`, `تعديل النمط: ${preset.name}`)}
          className={[
            'shrink-0 p-1.5 rounded-ds-sm text-ds-text-muted',
            'hover:text-ds-text-primary hover:bg-ds-surface-elevated',
            'transition-colors duration-ds-fast',
            'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <Pencil size={12} aria-hidden="true" />
        </button>
      )}
    </article>
  )
}
