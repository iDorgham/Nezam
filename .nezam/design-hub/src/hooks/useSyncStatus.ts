'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useTokenStore, type SyncStatus } from '../store/tokens.store'

const SYNC_DEBOUNCE_MS = 100

interface UseSyncStatusResult {
  status:  SyncStatus
  error:   string | null
  retry:   () => void
}

// useSyncStatus drives the CSS sync state machine for F-002:
//   • Listens to navigator online/offline → store('offline' | 'synchronized').
//   • Debounces the 'syncing' → 'synchronized' transition by 100ms whenever
//     setToken pushes the store into 'syncing'.
//   • Exposes a retry handler that re-triggers the in-browser sync (token
//     re-injection happens in setToken; this hook only flips the state pill).
export function useSyncStatus(): UseSyncStatusResult {
  const status        = useTokenStore((s) => s.syncStatus)
  const error         = useTokenStore((s) => s.syncError)
  const setSyncStatus = useTokenStore((s) => s.setSyncStatus)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Online/offline listeners. SSR-safe.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOffline = () => setSyncStatus('offline')
    const handleOnline  = () => {
      // Only flip back to synchronized if we were the ones who set offline.
      if (useTokenStore.getState().syncStatus === 'offline') {
        setSyncStatus('synchronized')
      }
    }

    if (!window.navigator.onLine) handleOffline()

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [setSyncStatus])

  // Debounce 'syncing' → 'synchronized'. The CSS injection itself is already
  // < 16ms, so the 100ms is purely visual feedback that an edit landed.
  useEffect(() => {
    if (status !== 'syncing') return

    timerRef.current = setTimeout(() => {
      // Re-read at fire time so we don't stomp on a meanwhile 'offline' or
      // 'failed' transition.
      if (useTokenStore.getState().syncStatus === 'syncing') {
        setSyncStatus('synchronized')
      }
    }, SYNC_DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [status, setSyncStatus])

  const retry = useCallback(() => {
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setSyncStatus('offline')
      return
    }
    setSyncStatus('syncing')
  }, [setSyncStatus])

  return { status, error, retry }
}
