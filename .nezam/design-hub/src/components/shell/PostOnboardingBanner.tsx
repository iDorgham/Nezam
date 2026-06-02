'use client'
import { useCallback, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useSession } from '@/store/session.store'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function PostOnboardingBanner() {
  const visible = useHub((s) => s.postOnboardingBannerVisible)
  const setVisible = useHub((s) => s.setPostOnboardingBannerVisible)
  const dismissSpotlight = useSession((s) => s.dismissSpotlight)
  const prefersReducedMotion = useReducedMotion()
  const [exiting, setExiting] = useState(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    dismissSpotlight('post-onboarding-banner')
    if (prefersReducedMotion) { setVisible(false); return }
    setExiting(true)
    exitTimerRef.current = setTimeout(() => setVisible(false), 100)
  }, [dismissSpotlight, prefersReducedMotion, setVisible])

  if (!visible) return null

  const enterAnim = prefersReducedMotion
    ? 'post-onboarding-fade 160ms ease-out both'
    : 'post-onboarding-enter 160ms cubic-bezier(0.23,1,0.32,1) both'

  const exitAnim = 'post-onboarding-exit 100ms ease-out both'

  return (
    <div
      className="flex h-8 shrink-0 items-center justify-between px-4 border-b border-b-app-accent/20 bg-app-accent/[0.08]"
      style={{ animation: exiting ? exitAnim : enterAnim }}
    >
      <style>{`
        @keyframes post-onboarding-enter {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes post-onboarding-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes post-onboarding-exit {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
      <span className="text-[11px] text-app-subtle flex items-center gap-2">
        <span className="text-emerald-400 text-[14px] leading-none">✓</span>
        Setup complete — start in Architecture, then Wireframes, then lock to preview.
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="flex items-center justify-center w-5 h-5 text-app-muted hover:text-app-text transition-colors rounded"
      >
        <X size={11} />
      </button>
    </div>
  )
}
