'use client'

import { useEffect, useState } from 'react'
import { X, Keyboard } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

type Shortcut = { keys: string[]; desc: string; descAr: string }

const SHORTCUTS: Shortcut[] = [
  { keys: ['?'],          desc: 'Show this help',            descAr: 'عرض المساعدة' },
  { keys: ['W'],          desc: 'Toggle wiring mode',        descAr: 'تبديل وضع الأسلاك' },
  { keys: ['L'],          desc: 'Toggle widget panel',       descAr: 'تبديل لوحة الأدوات' },
  { keys: ['R'],          desc: 'Toggle inspector panel',    descAr: 'تبديل لوحة الفحص' },
  { keys: ['F'],          desc: 'Full screen preview',       descAr: 'معاينة كاملة الشاشة' },
  { keys: ['`'],          desc: 'Zen mode (hide all UI)',    descAr: 'وضع التركيز (إخفاء كل الواجهة)' },
  { keys: ['⌘', 'K'],    desc: 'Open AI command bar',       descAr: 'فتح شريط أوامر الذكاء الاصطناعي' },
  { keys: ['Esc'],        desc: 'Cancel / restore panels',  descAr: 'إلغاء / استعادة اللوحات' },
  { keys: ['Scroll'],     desc: 'Zoom in / out',            descAr: 'تكبير / تصغير' },
  { keys: ['Drag'],       desc: 'Pan canvas',               descAr: 'تحريك اللوحة' },
  { keys: ['Drag widget'], desc: 'Drop widget on canvas',   descAr: 'إسقاط أداة على اللوحة' },
]

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false)
  const lang   = useSessionStore((s) => s.lang)
  const isRTL  = lang === 'ar'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return
      if (e.key === '?') { e.preventDefault(); setOpen((v) => !v) }
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRTL ? 'اختصارات لوحة المفاتيح' : 'Keyboard shortcuts'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div className="relative w-full max-w-md mx-4 rounded-ds-lg border border-ds-border bg-ds-surface shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ds-border">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-ds-primary" />
            <span className="text-ds-sm font-semibold text-ds-text-primary">
              {isRTL ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ds-text-muted hover:text-ds-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-1 max-h-96 overflow-y-auto">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys.join('+')}
              className="flex items-center justify-between gap-4 px-2 py-1.5 rounded-ds-sm hover:bg-ds-surface-hover transition-colors"
            >
              <span className="text-ds-sm text-ds-text-secondary">
                {isRTL ? s.descAr : s.desc}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-1.5 py-0.5 text-[11px] font-mono font-medium rounded border border-ds-border bg-ds-background text-ds-text-primary"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-ds-border text-ds-xs text-ds-text-muted">
          {isRTL ? 'اضغط ? أو Esc للإغلاق' : 'Press ? or Esc to close'}
        </div>
      </div>
    </div>
  )
}
