'use client'

import { CheckCircle2, Loader2, RotateCcw, WifiOff, XCircle } from 'lucide-react'
import { useSyncStatus } from '@/src/hooks/useSyncStatus'
import { useSessionStore } from '@/lib/store/session.store'

// Container styling per state. All colors come from design tokens — no
// hardcoded hex. Transitions are disabled via media query in globals.css
// (prefers-reduced-motion: reduce) so we don't gate them in JS.
const STYLES = {
  synchronized: {
    container: 'border-ds-success/30 bg-ds-success/10 text-ds-success',
  },
  syncing: {
    container: 'border-ds-warning/30 bg-ds-warning/10 text-ds-warning',
  },
  failed: {
    container: 'border-ds-destructive/30 bg-ds-destructive/10 text-ds-destructive',
  },
  offline: {
    container: 'border-ds-border bg-ds-surface-elevated text-ds-text-muted',
  },
} as const

export default function SyncStatusPill() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const { status, error, retry } = useSyncStatus()

  const label = (() => {
    switch (status) {
      case 'synchronized': return t('CSS Synchronized', 'تم مزامنة CSS')
      case 'syncing':      return t('Syncing…',         'جارٍ المزامنة…')
      case 'failed':       return t('Sync Failed',      'فشلت المزامنة')
      case 'offline':      return t('Offline',          'غير متصل')
    }
  })()

  const Icon = (() => {
    switch (status) {
      case 'synchronized': return CheckCircle2
      case 'syncing':      return Loader2
      case 'failed':       return XCircle
      case 'offline':      return WifiOff
    }
  })()

  const styles = STYLES[status]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={
        status === 'failed' && error
          ? t(`Sync failed: ${error}`, `فشلت المزامنة: ${error}`)
          : label
      }
      title={status === 'failed' && error ? error : undefined}
      className={[
        'inline-flex items-center gap-x-1.5 select-none',
        'px-3 py-1 rounded-ds-full border',
        'text-ds-xs font-medium',
        'transition-colors duration-ds-fast motion-reduce:transition-none',
        styles.container,
      ].join(' ')}
    >
      <Icon
        size={12}
        aria-hidden="true"
        className={[
          'shrink-0',
          status === 'syncing'
            ? 'animate-spin motion-reduce:animate-none'
            : '',
        ].join(' ')}
      />
      <span>{label}</span>

      {status === 'failed' && (
        <button
          type="button"
          onClick={retry}
          aria-label={t('Retry sync', 'إعادة محاولة المزامنة')}
          className={[
            'shrink-0 ms-1 p-0.5 rounded-ds-sm',
            'text-ds-destructive hover:bg-ds-destructive/20',
            'transition-colors duration-ds-fast motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-ds-destructive focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <RotateCcw size={11} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
