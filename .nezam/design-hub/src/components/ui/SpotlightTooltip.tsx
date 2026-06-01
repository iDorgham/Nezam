'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useRTL } from '@/hooks/useRTL'
import { useReducedMotion } from '@/hooks/useReducedMotion'

let lastDismissedAt = 0

export interface SpotlightTooltipProps {
  id: string
  title: string
  body: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  cta?: { label: string; onClick(): void }
  step?: number
  total?: number
  delayMs?: number
  onDismiss(): void
  onNext?(): void
}

export function SpotlightTooltip({ id, title, body, side = 'bottom', cta, step, total, delayMs = 700, onDismiss, onNext }: SpotlightTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)
  const xButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<Element | null>(null)
  const isRTL = useRTL()
  const prefersReducedMotion = useReducedMotion()

  const skipAnimation = Date.now() - lastDismissedAt < 500

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const target = document.querySelector(`[data-spotlight="${id}"]`)
    if (!target) return
    triggerRef.current = target

    const updateRect = () => setTargetRect(target.getBoundingClientRect())
    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    const timer = setTimeout(() => setVisible(true), skipAnimation ? 0 : delayMs)

    const handleTargetClick = () => { lastDismissedAt = Date.now(); onDismiss() }
    target.addEventListener('click', handleTargetClick)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
      target.removeEventListener('click', handleTargetClick)
    }
  }, [mounted, id, delayMs, skipAnimation, onDismiss])

  useEffect(() => {
    if (visible) {
      xButtonRef.current?.focus()
    }
  }, [visible])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        lastDismissedAt = Date.now()
        onDismiss()
        if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [visible, onDismiss])

  if (!mounted || !targetRect) return null

  const effectiveSide = isRTL
    ? side === 'left' ? 'right' : side === 'right' ? 'left' : side
    : side

  const GAP = 10
  let top = 0, left = 0

  if (effectiveSide === 'bottom') {
    top = targetRect.bottom + GAP
    left = targetRect.left + targetRect.width / 2
  } else if (effectiveSide === 'top') {
    top = targetRect.top - GAP
    left = targetRect.left + targetRect.width / 2
  } else if (effectiveSide === 'right') {
    top = targetRect.top + targetRect.height / 2
    left = targetRect.right + GAP
  } else {
    top = targetRect.top + targetRect.height / 2
    left = targetRect.left - GAP
  }

  const arrowClass: Record<string, string> = {
    bottom: 'absolute -top-[6px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-app-elevated',
    top: 'absolute -bottom-[6px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-app-elevated',
    right: 'absolute top-1/2 -translate-y-1/2 -left-[6px] border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-app-elevated',
    left: 'absolute top-1/2 -translate-y-1/2 -right-[6px] border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-app-elevated',
  }

  const transformOrigin: Record<string, string> = {
    bottom: 'top center',
    top: 'bottom center',
    right: 'center left',
    left: 'center right',
  }

  const sideTransform: Record<string, string> = {
    bottom: 'translateX(-50%)',
    top: 'translateX(-50%) translateY(-100%)',
    right: 'translateY(-50%)',
    left: 'translateX(-100%) translateY(-50%)',
  }

  const animDuration = skipAnimation || prefersReducedMotion ? '0ms' : '160ms'
  const animEasing = 'cubic-bezier(0.23, 1, 0.32, 1)'

  const positionStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1250,
    top,
    left,
    transform: sideTransform[effectiveSide],
  }

  return createPortal(
    <>
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            zIndex: 1249,
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: 8,
            border: '1.5px solid var(--app-accent)',
            animation: 'spotlight-pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {visible && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            ...positionStyle,
            transformOrigin: transformOrigin[effectiveSide],
            animation: `spotlight-enter ${animDuration} ${animEasing} both`,
          }}
          className="w-[260px] rounded-app border border-app-border-strong bg-app-elevated p-3 shadow-app-lg"
        >
          <div aria-hidden="true" className={arrowClass[effectiveSide]} />

          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-[12px] font-bold text-app-text leading-tight">{title}</span>
            <button
              ref={xButtonRef}
              onClick={() => { lastDismissedAt = Date.now(); onDismiss() }}
              aria-label="Dismiss tip"
              className="shrink-0 flex items-center justify-center w-5 h-5 rounded text-app-muted hover:text-app-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-app-accent"
            >
              <X size={11} />
            </button>
          </div>

          <p className="text-[11px] text-app-subtle leading-relaxed">{body}</p>

          {(step != null && total != null || cta) && (
            <div className="flex items-center justify-between mt-2.5">
              {step != null && total != null ? (
                <span className="text-[9.5px] font-bold text-app-muted">{step} of {total}</span>
              ) : <span />}
              {cta && (
                <button
                  onClick={cta.onClick}
                  className="h-6 px-3 rounded-full text-[11px] font-bold bg-app-accent text-app-on-accent hover:bg-app-accent-hover transition-colors"
                >
                  {cta.label}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spotlight-enter {
          from { opacity: 0; transform: scale(0.95) ${sideTransform[effectiveSide]}; }
          to   { opacity: 1; transform: scale(1) ${sideTransform[effectiveSide]}; }
        }
        @keyframes spotlight-pulse {
          0%   { opacity: 0.5; transform: scale(1); }
          50%  { opacity: 0.15; transform: scale(1.06); }
          100% { opacity: 0; transform: scale(1.12); }
        }
      `}</style>
    </>,
    document.body
  )
}
