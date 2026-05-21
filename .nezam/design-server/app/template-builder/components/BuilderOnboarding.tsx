'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, X, Sparkles, Palette, Layers, Pen,
  LayoutTemplate, Monitor, Zap, Check, ChevronRight,
} from 'lucide-react'

interface OnboardingStep {
  id: string
  icon: React.ReactNode
  emoji: string
  title: string
  titleAr: string
  desc: string
  descAr: string
  hint?: string
  hintAr?: string
  targetSelector?: string
  highlightSide?: 'right' | 'left' | 'top' | 'none'
  color: string
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    emoji: '✨',
    icon: <Sparkles size={20} />,
    title: 'Welcome to NEZAM Builder',
    titleAr: 'مرحباً في محرر نيظام',
    desc: 'Your all-in-one visual website builder — powered by AI, designed for Egypt and the MENA region.',
    descAr: 'محررك المرئي الشامل — مدعوم بالذكاء الاصطناعي، مصمم لمصر ومنطقة الشرق الأوسط.',
    highlightSide: 'none',
    color: '#8B5CF6',
  },
  {
    id: 'canvas',
    emoji: '🖥️',
    icon: <Monitor size={20} />,
    title: 'Live Preview Canvas',
    titleAr: 'لوحة المعاينة المباشرة',
    desc: 'This is your canvas. Every change you make in the side panel is reflected here in real time. Switch between Desktop, Tablet, and Mobile views at any time.',
    descAr: 'هذه لوحتك. كل تغيير تقوم به في اللوحة الجانبية ينعكس هنا في الوقت الفعلي. يمكنك التبديل بين عرض سطح المكتب والجهاز اللوحي والهاتف.',
    hint: 'Try the viewport buttons in the toolbar → ',
    hintAr: 'جرب أزرار الشاشة في شريط الأدوات ←',
    highlightSide: 'none',
    color: '#06B6D4',
  },
  {
    id: 'panel',
    emoji: '🎨',
    icon: <Palette size={20} />,
    title: 'Design Control Panel',
    titleAr: 'لوحة التحكم في التصميم',
    desc: 'The right panel is your command center. Use the icon rail to switch between Settings, Style, Structure, Layers, Categories, and more.',
    descAr: 'اللوحة اليمنى هي مركز تحكمك. استخدم قضيب الأيقونات للتبديل بين الإعدادات والأسلوب والهيكل والطبقات والفئات وغيرها.',
    hint: 'The icons are grouped by Design / Content / System',
    hintAr: 'الأيقونات مجمعة حسب التصميم / المحتوى / النظام',
    highlightSide: 'right',
    color: '#F97316',
  },
  {
    id: 'layers',
    emoji: '⬛',
    icon: <Layers size={20} />,
    title: 'Layers & Section Order',
    titleAr: 'الطبقات وترتيب الأقسام',
    desc: 'Click the Layers tab to see all sections stacked in order. Drag to reorder, toggle visibility, or add new sections from the Categories library.',
    descAr: 'انقر على تبويب الطبقات لرؤية جميع الأقسام مرتبة. اسحب لإعادة الترتيب، أو أخفِ قسمًا، أو أضف أقسامًا جديدة من مكتبة الفئات.',
    highlightSide: 'right',
    color: '#10B981',
  },
  {
    id: 'editmode',
    emoji: '✏️',
    icon: <Pen size={20} />,
    title: 'Direct Text Editing',
    titleAr: 'تعديل النص المباشر',
    desc: 'Press E or click the pencil icon in the toolbar to enter Edit Mode. Then click any text in the canvas to edit it directly — no code needed.',
    descAr: 'اضغط E أو انقر على أيقونة القلم في شريط الأدوات للدخول في وضع التعديل. ثم انقر على أي نص في اللوحة لتحريره مباشرةً.',
    hint: 'Amber outline = editable. Blur to save.',
    hintAr: 'الإطار الذهبي = قابل للتعديل. انقر خارجه للحفظ.',
    highlightSide: 'none',
    color: '#F59E0B',
  },
  {
    id: 'done',
    emoji: '🚀',
    icon: <Zap size={20} />,
    title: "You're Ready to Build!",
    titleAr: 'أنت مستعد للبناء!',
    desc: 'Explore the panels, add sections, style your brand. Use ⌘Z to undo, E for edit mode, and ` for full-screen preview. Let\'s create something great.',
    descAr: 'استكشف اللوحات، أضف أقسامًا، وصمّم علامتك التجارية. استخدم ⌘Z للتراجع، وE لوضع التعديل. لنبنِ شيئًا رائعًا.',
    highlightSide: 'none',
    color: '#8B5CF6',
  },
]

const STORAGE_KEY = 'nezam.builder.onboarding-complete'

interface BuilderOnboardingProps {
  lang: string
  t: (en: string, ar: string) => string
}

export default function BuilderOnboarding({ lang, t }: BuilderOnboardingProps) {
  const [visible,  setVisible]  = useState(false)
  const [step,     setStep]     = useState(0)
  const [closing,  setClosing]  = useState(false)
  const [entering, setEntering] = useState(false)

  const isAr  = lang === 'ar'
  const cur   = STEPS[step]
  const isLast = step === STEPS.length - 1

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      setTimeout(() => { setVisible(true); setEntering(true) }, 800)
    }
  }, [])

  const dismiss = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 320)
  }

  const next = () => {
    if (isLast) { dismiss(); return }
    setEntering(false)
    setTimeout(() => { setStep(s => s + 1); setEntering(true) }, 200)
  }

  const prev = () => {
    if (step === 0) return
    setEntering(false)
    setTimeout(() => { setStep(s => s - 1); setEntering(true) }, 200)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.32s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) dismiss() }}
    >
      {/* Card */}
      <div
        className="relative flex flex-col"
        style={{
          width: 460,
          maxWidth: 'calc(100vw - 32px)',
          background: '#151516',
          border: `1px solid ${cur.color}30`,
          borderRadius: 20,
          boxShadow: `0 32px 80px -20px ${cur.color}30, 0 0 0 1px rgba(255,255,255,0.04)`,
          transform: entering ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          opacity: entering ? 1 : 0,
          transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease',
          direction: isAr ? 'rtl' : 'ltr',
        }}
      >
        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="absolute top-3.5 end-3.5 w-7 h-7 flex items-center justify-center rounded-full transition-all hover:bg-white/10 z-10"
          style={{ color: '#636366' }}
        >
          <X size={14} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 px-6 pt-5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 6,
                background: i === step ? cur.color : i < step ? cur.color + '60' : '#2a2a2c',
              }}
            />
          ))}
        </div>

        {/* Icon + emoji */}
        <div className="px-6 pt-5 pb-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: cur.color + '18', color: cur.color, border: `1px solid ${cur.color}30` }}
            >
              {cur.icon}
            </div>
            <span className="text-3xl select-none">{cur.emoji}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black leading-tight mb-3" style={{ color: '#f0f0f5' }}>
            {isAr ? cur.titleAr : cur.title}
          </h2>

          {/* Description */}
          <p className="text-[12px] leading-[1.7] mb-4" style={{ color: '#8e8e93' }}>
            {isAr ? cur.descAr : cur.desc}
          </p>

          {/* Hint chip */}
          {(isAr ? cur.hintAr : cur.hint) && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium mb-2"
              style={{ background: cur.color + '10', color: cur.color, border: `1px solid ${cur.color}20` }}
            >
              <Sparkles size={10} />
              {isAr ? cur.hintAr : cur.hint}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex items-center gap-2">

          {step > 0 && (
            <button
              onClick={prev}
              className="px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all hover:bg-white/5"
              style={{ color: '#636366' }}
            >
              {t('Back', 'رجوع')}
            </button>
          )}

          <div className="flex-1" />

          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-90 shadow-lg"
            style={{ background: cur.color, color: '#fff', boxShadow: `0 8px 24px -6px ${cur.color}60` }}
          >
            {isLast ? (
              <>
                <Check size={14} />
                {t("Let's Build!", 'لنبدأ!')}
              </>
            ) : (
              <>
                {t('Next', 'التالي')}
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Step counter */}
        <div className="pb-4 text-center">
          <span className="text-[9px] font-semibold" style={{ color: '#3a3a3c' }}>
            {step + 1} {t('of', 'من')} {STEPS.length}
          </span>
        </div>
      </div>

      {/* Feature highlight pills — floating below card */}
      {step === 0 && (
        <div
          className="absolute bottom-8 flex flex-wrap justify-center gap-2 px-6"
          style={{
            opacity: entering ? 1 : 0,
            transform: entering ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.4s 0.2s ease',
          }}
        >
          {[
            { icon: '🎨', label: t('Visual Design', 'تصميم مرئي') },
            { icon: '🤖', label: t('AI Powered', 'مدعوم بالذكاء') },
            { icon: '📱', label: t('Responsive', 'متجاوب') },
            { icon: '🇪🇬', label: t('Egypt-First', 'مصر أولاً') },
            { icon: '✏️', label: t('Inline Edit', 'تعديل مباشر') },
          ].map(chip => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#8e8e93' }}
            >
              <span>{chip.icon}</span>
              {chip.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Restart trigger (exported for use in help button) ─────────────────────────
export function restartBuilderOnboarding() {
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
