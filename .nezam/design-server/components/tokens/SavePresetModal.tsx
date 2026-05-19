'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Save, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useTokenStore } from '@/src/store/tokens.store'
import { useSessionStore } from '@/lib/store/session.store'
import type { DesignPreset } from '@/src/types/tokens.types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SavePresetModalProps {
  isOpen:    boolean
  onClose:   () => void
  onSaved?:  (preset: DesignPreset) => void
}

type SubmitPhase = 'idle' | 'saving' | 'syncing' | 'done' | 'error'

interface CollisionInfo {
  slug:    string
  message: string
}

// ── Slug preview ──────────────────────────────────────────────────────────────

function toPreviewSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SavePresetModal({ isOpen, onClose, onSaved }: SavePresetModalProps) {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const { presets, getActiveTokens, loadPresets, setSyncStatus } = useTokenStore()

  const [name, setName]             = useState('')
  const [nameError, setNameError]   = useState<string | null>(null)
  const [collision, setCollision]   = useState<CollisionInfo | null>(null)
  const [phase, setPhase]           = useState<SubmitPhase>('idle')
  const [syncError, setSyncError]   = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)

  // Reset and focus on open
  useEffect(() => {
    if (isOpen) {
      setName('')
      setNameError(null)
      setCollision(null)
      setPhase('idle')
      setSyncError(null)
      requestAnimationFrame(() => nameRef.current?.focus())
    }
  }, [isOpen])

  // Escape key closes (unless we're mid-save)
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'idle') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, phase, onClose])

  const handleNameChange = (value: string) => {
    setName(value)
    if (nameError) setNameError(null)
    if (collision)  setCollision(null)
  }

  const submit = useCallback(async (force = false) => {
    // AC-005: client-side empty check first — no API round-trip
    if (!name.trim()) {
      setNameError(t('Preset name is required', 'اسم النمط مطلوب'))
      nameRef.current?.focus()
      return
    }

    setPhase('saving')
    setNameError(null)
    setSyncError(null)

    const tokens       = getActiveTokens()
    const existingSlugs = presets
      .map((p) => p.slug)
      // When force-overwriting, exclude the colliding slug so the server allows it
      .filter((s) => force ? s !== toPreviewSlug(name) : true)

    let serverPreset: DesignPreset

    try {
      const res = await fetch('/api/presets/save', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), tokens, existingSlugs, force }),
      })

      const data = await res.json()

      if (res.status === 400 && data.error === 'EMPTY_NAME') {
        setNameError(t('Preset name is required', 'اسم النمط مطلوب'))
        setPhase('idle')
        nameRef.current?.focus()
        return
      }

      if (res.status === 409 && data.error === 'COLLISION') {
        // AC-006: show inline overwrite warning
        setCollision({ slug: data.slug, message: data.message })
        setPhase('idle')
        return
      }

      if (!res.ok) {
        throw new Error(data.message ?? `HTTP ${res.status}`)
      }

      serverPreset = data.preset as DesignPreset
    } catch (err: unknown) {
      setPhase('error')
      setSyncError(err instanceof Error ? err.message : t('Save failed', 'فشل الحفظ'))
      return
    }

    // AC-002: update localStorage store immediately (< 200ms from here)
    const filtered = presets.filter((p) => p.slug !== serverPreset.slug)
    loadPresets([...filtered, serverPreset])

    // AC-004: sync to disk — target < 3s
    setPhase('syncing')
    setSyncStatus('syncing')
    try {
      const syncRes = await fetch('/api/presets/sync-to-disk', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ preset: serverPreset }),
      })

      if (!syncRes.ok) {
        const syncData = await syncRes.json()
        const msg = syncData.message ?? t('Disk sync failed', 'فشلت مزامنة القرص')
        // Non-fatal: preset is already in store; surface the warning
        setSyncError(msg)
        setSyncStatus('failed', msg)
      } else {
        setSyncStatus('synchronized')
      }
    } catch {
      const msg = t('Could not reach sync endpoint', 'تعذر الوصول إلى نقطة المزامنة')
      setSyncError(msg)
      setSyncStatus('failed', msg)
    }

    setPhase('done')
    onSaved?.(serverPreset)

    // Auto-close after 1.2s so user sees the success state
    setTimeout(() => {
      onClose()
      setPhase('idle')
      setSyncError(null)
    }, 1200)
  }, [name, presets, getActiveTokens, loadPresets, onSaved, onClose, isRTL]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const slugPreview = toPreviewSlug(name)
  const isBusy = phase === 'saving' || phase === 'syncing'

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('Save design preset', 'حفظ نمط التصميم')}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !isBusy) onClose() }}
    >
      {/* Panel */}
      <div
        className={[
          'relative w-full max-w-sm rounded-ds-lg border bg-ds-surface shadow-ds-lg',
          'border-ds-border',
        ].join(' ')}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-ds-border">
          <h2 className="text-ds-sm font-semibold text-ds-text-primary">
            {t('Save as Preset', 'حفظ كنمط')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label={t('Close', 'إغلاق')}
            className={[
              'p-1 rounded-ds-sm text-ds-text-muted',
              'hover:text-ds-text-primary hover:bg-ds-surface-elevated',
              'transition-colors duration-ds-fast',
              'disabled:opacity-40',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
            ].join(' ')}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          {/* Done state */}
          {phase === 'done' && (
            <div className="flex items-center gap-x-2 text-ds-success text-ds-xs bg-ds-success/10 border border-ds-success/20 rounded-ds-sm px-3 py-2">
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>
                {syncError
                  ? t('Saved to memory (disk sync failed)', 'تم الحفظ في الذاكرة (فشل مزامنة القرص)')
                  : t('Preset saved successfully', 'تم حفظ النمط بنجاح')}
              </span>
            </div>
          )}

          {/* Name input */}
          <div className="space-y-1.5">
            <label
              htmlFor="preset-name"
              className="text-ds-xs font-medium text-ds-text-primary"
            >
              {t('Preset name', 'اسم النمط')}
            </label>
            <input
              id="preset-name"
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isBusy) submit() }}
              disabled={isBusy || phase === 'done'}
              placeholder={t('e.g. Warm Terracotta', 'مثلاً: ترابي دافئ')}
              aria-invalid={nameError ? 'true' : undefined}
              aria-describedby={nameError ? 'preset-name-error' : undefined}
              className={[
                'w-full px-3 py-2 rounded-ds-sm text-ds-sm text-ds-text-primary',
                'bg-ds-surface-elevated border transition-colors duration-ds-fast',
                'placeholder:text-ds-text-disabled',
                'focus:outline-none focus:border-ds-primary',
                'disabled:opacity-40',
                nameError ? 'border-ds-destructive' : 'border-ds-border hover:border-ds-border-hover',
              ].join(' ')}
            />

            {/* AC-005 inline error */}
            {nameError && (
              <p id="preset-name-error" role="alert" className="text-ds-xs text-ds-destructive">
                {nameError}
              </p>
            )}

            {/* Live slug preview */}
            {slugPreview && !nameError && (
              <p className="text-ds-xs text-ds-text-muted font-mono">
                slug:{' '}
                <span className="text-ds-text-primary">{slugPreview}</span>
              </p>
            )}
          </div>

          {/* AC-006 collision warning */}
          {collision && (
            <div className="rounded-ds-sm border border-ds-warning/30 bg-ds-warning/10 px-3 py-3 space-y-2">
              <div className="flex items-start gap-x-2">
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-ds-warning" aria-hidden="true" />
                <p className="text-ds-xs text-ds-text-primary">
                  {collision.message}
                </p>
              </div>
              <div className="flex gap-x-2">
                <button
                  type="button"
                  onClick={() => submit(true)}
                  disabled={isBusy}
                  className={[
                    'text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm',
                    'bg-ds-warning text-ds-background',
                    'hover:bg-ds-warning/90 transition-colors duration-ds-fast',
                    'disabled:opacity-40',
                    'focus-visible:outline-2 focus-visible:outline-ds-warning focus-visible:outline-offset-2',
                  ].join(' ')}
                >
                  {t('Overwrite', 'استبدال')}
                </button>
                <button
                  type="button"
                  onClick={() => { setCollision(null); nameRef.current?.focus() }}
                  disabled={isBusy}
                  className={[
                    'text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm',
                    'text-ds-text-muted hover:text-ds-text-primary',
                    'hover:bg-ds-surface-elevated transition-colors duration-ds-fast',
                    'disabled:opacity-40',
                    'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
                  ].join(' ')}
                >
                  {t('Keep Both', 'احتفظ بالاثنين')}
                </button>
              </div>
            </div>
          )}

          {/* Generic error */}
          {phase === 'error' && syncError && (
            <p role="alert" className="text-ds-xs text-ds-destructive">
              {syncError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-x-2 px-5 pb-5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={[
              'text-ds-xs font-medium px-3 py-1.5 rounded-ds-sm',
              'text-ds-text-muted hover:text-ds-text-primary',
              'hover:bg-ds-surface-elevated transition-colors duration-ds-fast',
              'disabled:opacity-40',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
            ].join(' ')}
          >
            {t('Cancel', 'إلغاء')}
          </button>

          <button
            type="button"
            onClick={() => submit()}
            disabled={isBusy || phase === 'done'}
            aria-busy={isBusy}
            className={[
              'inline-flex items-center gap-x-1.5 text-ds-xs font-medium',
              'px-3 py-1.5 rounded-ds-sm',
              'bg-ds-primary text-ds-primary-foreground',
              'hover:bg-ds-primary-hover transition-colors duration-ds-fast',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
            ].join(' ')}
          >
            {phase === 'saving' ? (
              <>
                <Loader2 size={11} className="animate-spin" aria-hidden="true" />
                {t('Saving…', 'جاري الحفظ…')}
              </>
            ) : phase === 'syncing' ? (
              <>
                <Loader2 size={11} className="animate-spin" aria-hidden="true" />
                {t('Syncing…', 'جاري المزامنة…')}
              </>
            ) : (
              <>
                <Save size={11} aria-hidden="true" />
                {t('Save', 'حفظ')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
