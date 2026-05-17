'use client'

import * as React from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

export type TourStep = {
  /** CSS selector of the element to highlight. If null, the step renders centered (welcome/finish). */
  target: string | null
  title: string
  titleAr: string
  body: string
  bodyAr: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const STORAGE_KEY = 'nezam-ds:onboarding:completed'

export const defaultTourSteps: TourStep[] = [
  {
    target: null,
    title: 'Welcome to NEZAM Design Server',
    titleAr: 'مرحبًا بك في سيرفر تصميم نظام',
    body: 'A human-in-the-loop design decision engine. Lock your tokens & wireframes, then let the AI swarm build the code.',
    bodyAr: 'محرك قرار التصميم. اقفل الـ tokens والـ wireframes، وخلّي السرب يبني الكود.',
  },
  {
    target: '[data-tour="sidebar-sitemap"]',
    title: 'Step 1 — Sitemap',
    titleAr: 'الخطوة الأولى — خريطة الموقع',
    body: 'Define every page in your product. Drag to reorder, set route, type (public/auth/admin), and nav placement.',
    bodyAr: 'حدّد كل صفحات منتجك، رتّبها بالسحب، اضبط المسار والنوع وموقع التنقّل.',
    side: 'right',
  },
  {
    target: '[data-tour="sidebar-template"]',
    title: 'Step 2 — Template & Tokens',
    titleAr: 'الخطوة الثانية — القالب والـ tokens',
    body: 'Pick a design profile (Linear, Apple, Supabase…) or tune tokens directly. Colors, typography, spacing, motion.',
    bodyAr: 'اختر بروفايل تصميم أو اضبط الـ tokens مباشرة. ألوان وخطوط ومساحات وحركة.',
    side: 'right',
  },
  {
    target: '[data-tour="sidebar-wireframes"]',
    title: 'Step 3 — Wireframes',
    titleAr: 'الخطوة الثالثة — الـ Wireframes',
    body: 'Layout each page with blocks from the registry. The AI Assistant can scaffold sections for you.',
    bodyAr: 'رتّب كل صفحة باستخدام البلوكات الجاهزة، أو خلّي المساعد الذكي يبني لك الأقسام.',
    side: 'right',
  },
  {
    target: '[data-tour="topbar-toggles"]',
    title: 'Theme & Language',
    titleAr: 'الواجهة واللغة',
    body: 'Toggle dark/light and EN/AR anytime — all UI and exports respect your choice.',
    bodyAr: 'بدّل بين الفاتح والداكن، EN/AR في أي وقت — الواجهة والمخرجات تحترم اختيارك.',
    side: 'bottom',
  },
  {
    target: null,
    title: "You're ready",
    titleAr: 'جاهز للانطلاق',
    body: 'Use Settings → Restart tour anytime. Hover any sidebar icon for shortcuts. Happy designing.',
    bodyAr: 'تقدر تعيد الجولة من الإعدادات. مرّر على أي أيقونة للاختصارات. تصميم سعيد.',
  },
]

type Rect = { top: number; left: number; width: number; height: number }

function useTargetRect(selector: string | null): Rect | null {
  const [rect, setRect] = React.useState<Rect | null>(null)
  React.useEffect(() => {
    if (!selector) {
      setRect(null)
      return
    }
    const update = () => {
      const el = document.querySelector<HTMLElement>(selector)
      if (!el) {
        setRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const id = setInterval(update, 250)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      clearInterval(id)
    }
  }, [selector])
  return rect
}

type Props = {
  steps?: TourStep[]
  /** If true, ignore localStorage and force the tour to appear. */
  forceOpen?: boolean
  onClose?: () => void
}

export default function OnboardingTour({ steps = defaultTourSteps, forceOpen, onClose }: Props) {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (forceOpen) {
      setOpen(true)
      setIndex(0)
      return
    }
    if (typeof window === 'undefined') return
    const done = window.localStorage.getItem(STORAGE_KEY)
    if (!done) setOpen(true)
  }, [forceOpen])

  const finish = React.useCallback(() => {
    setOpen(false)
    try { window.localStorage.setItem(STORAGE_KEY, '1') } catch {}
    onClose?.()
  }, [onClose])

  const step = steps[index]
  const rect = useTargetRect(step?.target ?? null)

  if (!open || !step) return null

  const isCenter = step.target === null || rect === null
  const PAD = 8

  // Coachmark positioning
  let cmStyle: React.CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  if (!isCenter && rect) {
    const side = step.side ?? 'bottom'
    if (side === 'right') {
      cmStyle = { left: rect.left + rect.width + 16, top: rect.top + rect.height / 2 - 80 }
    } else if (side === 'left') {
      cmStyle = { left: rect.left - 340, top: rect.top + rect.height / 2 - 80 }
    } else if (side === 'top') {
      cmStyle = { left: rect.left + rect.width / 2 - 170, top: rect.top - 180 }
    } else {
      cmStyle = { left: rect.left + rect.width / 2 - 170, top: rect.top + rect.height + 16 }
    }
  }

  return (
    <div className="fixed inset-0 ds-onboarding-overlay" role="dialog" aria-modal="true" aria-label={t('Onboarding tour', 'جولة تعريفية')}>
      {/* Spotlight cutout */}
      {!isCenter && rect && (
        <div
          aria-hidden
          className="absolute rounded-ds-md pointer-events-none"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.65), 0 0 0 2px var(--ds-primary)',
            transition: 'all var(--ds-duration-normal) var(--ds-easing-default)',
          }}
        />
      )}

      {/* Coachmark card */}
      <div
        className="ds-coachmark absolute w-[340px] max-w-[calc(100vw-2rem)] p-4 rounded-ds-lg bg-ds-surface-elevated border border-ds-border-strong shadow-ds-2xl"
        style={cmStyle}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-ds-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t('Onboarding', 'تعريف')} · {index + 1}/{steps.length}
            </span>
          </div>
          <button
            onClick={finish}
            className="text-ds-text-muted hover:text-ds-text-primary transition-colors"
            aria-label={t('Close tour', 'إغلاق الجولة')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm font-semibold text-ds-text-primary mb-1">
          {t(step.title, step.titleAr)}
        </h3>
        <p className="text-xs text-ds-text-secondary leading-relaxed mb-4">
          {t(step.body, step.bodyAr)}
        </p>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={finish}
            className="text-xs text-ds-text-muted hover:text-ds-text-primary transition-colors"
          >
            {t('Skip tour', 'تخطي الجولة')}
          </button>

          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                className="px-2.5 py-1.5 text-xs rounded-ds-md border border-ds-border hover:bg-ds-surface-hover text-ds-text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
                {t('Back', 'رجوع')}
              </button>
            )}
            {index < steps.length - 1 ? (
              <button
                onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}
                className="px-3 py-1.5 text-xs rounded-ds-md bg-ds-primary text-ds-text-inverse font-medium hover:bg-ds-primary-hover transition-colors flex items-center gap-1"
              >
                {t('Next', 'التالي')}
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-3 py-1.5 text-xs rounded-ds-md bg-ds-primary text-ds-text-inverse font-medium hover:bg-ds-primary-hover transition-colors"
              >
                {t('Got it', 'تمام')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Manually trigger the tour from a button — clears the localStorage gate. */
export function restartOnboarding() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('nezam-ds:restart-tour'))
  } catch {}
}
