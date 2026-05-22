'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, Plus, RefreshCw } from 'lucide-react'
import type { DesignPreset } from '@/src/types/tokens.types'
import { useTokenStore } from '@/src/store/tokens.store'
import { useSessionStore } from '@/lib/store/session.store'
import ProfileCard from './ProfileCard'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfileSelectorProps {
  onSaveNew?: () => void
  onEditPreset?: (preset: DesignPreset) => void
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-x-3 px-3 py-2.5 rounded-ds-md border border-ds-border bg-ds-surface animate-pulse"
    >
      <span className="flex gap-x-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-3 h-3 rounded-full bg-ds-border" />
        ))}
      </span>
      <span className="flex-1 h-3 rounded-ds-sm bg-ds-border" />
      <span className="w-12 h-5 rounded-ds-sm bg-ds-border" />
    </div>
  )
}

function SectionSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      {Array.from({ length: count }, (_, i) => <SkeletonRow key={i} />)}
    </div>
  )
}

// ── Collapsible section ───────────────────────────────────────────────────────

interface SectionProps {
  label: string
  count: number
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ label, count, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'w-full flex items-center justify-between',
          'px-1 py-1.5 rounded-ds-sm',
          'text-ds-xs font-semibold uppercase tracking-wide text-ds-text-muted',
          'hover:text-ds-text-primary hover:bg-ds-surface-elevated',
          'transition-colors duration-ds-fast',
          'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
        ].join(' ')}
        aria-expanded={open}
      >
        <span>
          {label}
          {count > 0 && (
            <span className="ms-1.5 text-ds-text-muted font-normal normal-case tracking-normal">
              ({count})
            </span>
          )}
        </span>
        {open
          ? <ChevronUp size={12} aria-hidden="true" />
          : <ChevronDown size={12} aria-hidden="true" />
        }
      </button>

      {open && (
        <div className="mt-1.5 flex flex-col gap-y-1.5">
          {children}
        </div>
      )}
    </section>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyCustomPresets({
  t,
  onSaveNew,
}: {
  t: (en: string, ar: string) => string
  onSaveNew?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-y-2 py-4 px-3 text-center rounded-ds-md border border-dashed border-ds-border">
      <p className="text-ds-xs text-ds-text-muted">
        {t('No custom presets yet', 'لا توجد أنماط مخصصة بعد')}
      </p>
      {onSaveNew && (
        <button
          type="button"
          onClick={onSaveNew}
          className={[
            'inline-flex items-center gap-x-1 text-ds-xs font-medium',
            'text-ds-primary hover:underline',
            'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <Plus size={11} aria-hidden="true" />
          {t('Save current as preset', 'حفظ الحالي كنمط')}
        </button>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProfileSelector({ onSaveNew, onEditPreset }: ProfileSelectorProps) {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const activePresetId = useTokenStore((s) => s.activePresetId)
  const loadPreset     = useTokenStore((s) => s.loadPreset)
  const loadPresets    = useTokenStore((s) => s.loadPresets)

  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [systemPresets, setSystemPresets] = useState<DesignPreset[]>([])
  const [customPresets, setCustomPresets] = useState<DesignPreset[]>([])

  const fetchPresets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/presets')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: DesignPreset[] = await res.json()
      const system = data.filter((p) => p.isSystem)
      const custom = data.filter((p) => !p.isSystem)
      setSystemPresets(system)
      setCustomPresets(custom)
      loadPresets(data)
    } catch {
      setError(t('Failed to load presets', 'تعذّر تحميل الأنماط'))
    } finally {
      setLoading(false)
    }
  }, [loadPresets, isRTL]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPresets()
  }, [fetchPresets])

  const handleApply = useCallback((id: string) => {
    setApplyingId(id)
    try {
      loadPreset(id)
    } finally {
      setApplyingId(null)
    }
  }, [loadPreset])

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-ds-sm font-semibold text-ds-text-primary">
          {t('Design Presets', 'أنماط التصميم')}
        </h2>
        <button
          type="button"
          onClick={fetchPresets}
          disabled={loading}
          aria-label={t('Refresh presets', 'تحديث الأنماط')}
          className={[
            'p-1 rounded-ds-sm text-ds-text-muted',
            'hover:text-ds-text-primary hover:bg-ds-surface-elevated',
            'transition-colors duration-ds-fast',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
        </button>
      </div>

      {/* Error state */}
      {error && (
        <p
          role="alert"
          className="text-ds-xs text-ds-destructive bg-ds-destructive/10 rounded-ds-sm px-3 py-2"
        >
          {error}
        </p>
      )}

      {/* Custom presets section */}
      <CollapsibleSection
        label={t('Custom', 'مخصصة')}
        count={customPresets.length}
        defaultOpen
      >
        {loading ? (
          <SectionSkeleton count={2} />
        ) : customPresets.length === 0 ? (
          <EmptyCustomPresets t={t} onSaveNew={onSaveNew} />
        ) : (
          customPresets.map((preset) => (
            <ProfileCard
              key={preset.id}
              preset={preset}
              isActive={preset.id === activePresetId}
              isApplying={applyingId === preset.id}
              onApply={handleApply}
              onEdit={onEditPreset}
            />
          ))
        )}
      </CollapsibleSection>

      {/* System presets section */}
      <CollapsibleSection
        label={t('System', 'نظام')}
        count={systemPresets.length}
        defaultOpen={customPresets.length === 0}
      >
        {loading ? (
          <SectionSkeleton count={5} />
        ) : (
          systemPresets.map((preset) => (
            <ProfileCard
              key={preset.id}
              preset={preset}
              isActive={preset.id === activePresetId}
              isApplying={applyingId === preset.id}
              onApply={handleApply}
            />
          ))
        )}
      </CollapsibleSection>

      {/* Save new preset action */}
      {onSaveNew && (
        <button
          type="button"
          onClick={onSaveNew}
          className={[
            'w-full inline-flex items-center justify-center gap-x-1.5',
            'text-ds-xs font-medium px-3 py-2 rounded-ds-md',
            'border border-dashed border-ds-border',
            'text-ds-text-muted hover:text-ds-text-primary hover:border-ds-border-hover',
            'transition-colors duration-ds-fast',
            'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <Plus size={12} aria-hidden="true" />
          {t('Save current as preset', 'حفظ الحالي كنمط')}
        </button>
      )}
    </div>
  )
}
