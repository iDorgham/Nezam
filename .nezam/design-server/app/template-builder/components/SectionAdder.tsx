'use client'

import React, { useState } from 'react'
import {
  Plus, X, LayoutTemplate, AlignLeft, MessageSquare,
  DollarSign, Users, BarChart3, HelpCircle, Mail,
  Zap, ChevronUp, Square, Layers,
} from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface SectionDef {
  id: keyof TemplateConfig | 'empty'
  label: string
  labelAr: string
  icon: React.ReactNode
  description: string
  preview: string // emoji / colour hint
}

const SECTIONS: SectionDef[] = [
  { id: 'empty',          label: 'Empty Section',    labelAr: 'قسم فارغ',        icon: <Square size={16} />,        description: 'Blank canvas section',            preview: '⬜' },
  { id: 'showFeatures',   label: 'Feature Grid',     labelAr: 'شبكة الميزات',    icon: <Zap size={16} />,           description: 'Highlight key features',          preview: '⚡' },
  { id: 'showForm',       label: 'Contact Form',     labelAr: 'نموذج التواصل',   icon: <Mail size={16} />,          description: 'Lead capture / contact',          preview: '📨' },
  { id: 'showTestimonials',label: 'Testimonials',    labelAr: 'آراء العملاء',    icon: <MessageSquare size={16} />, description: 'Social proof & reviews',          preview: '💬' },
  { id: 'showPricing',    label: 'Pricing Table',    labelAr: 'باقات الأسعار',   icon: <DollarSign size={16} />,    description: 'Plans & pricing tiers',           preview: '💰' },
  { id: 'showStats',      label: 'Stats / Numbers',  labelAr: 'إحصائيات',        icon: <BarChart3 size={16} />,     description: 'Key metrics & uptime',            preview: '📊' },
  { id: 'showTeam',       label: 'Team Grid',        labelAr: 'فريق العمل',      icon: <Users size={16} />,         description: 'Team members & roles',            preview: '👥' },
  { id: 'empty',          label: 'FAQ Section',      labelAr: 'الأسئلة الشائعة', icon: <HelpCircle size={16} />,    description: 'Common questions & answers',      preview: '❓' },
  { id: 'empty',          label: 'CTA Banner',       labelAr: 'بانر الإجراء',    icon: <Layers size={16} />,        description: 'Call-to-action with button',       preview: '🎯' },
]

interface SectionAdderProps {
  templateConfig: TemplateConfig
  update: (u: Partial<TemplateConfig>) => void
  lang: string
  t: (en: string, ar: string) => string
}

export default function SectionAdder({ templateConfig, update, lang, t }: SectionAdderProps) {
  const [open, setOpen] = useState(false)

  const toggleSection = (id: keyof TemplateConfig | 'empty') => {
    if (id === 'empty') return // empty section — no-op for now
    update({ [id]: !templateConfig[id as keyof TemplateConfig] } as Partial<TemplateConfig>)
  }

  const isActive = (id: keyof TemplateConfig | 'empty') => {
    if (id === 'empty') return false
    return !!templateConfig[id as keyof TemplateConfig]
  }

  return (
    <>
      {/* Library drawer — slides up from bottom */}
      {open && (
        <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col" style={{ maxHeight: '55%' }}>
          {/* Backdrop blur panel */}
          <div className="flex-1 bg-[#0f0f10]/95 backdrop-blur-xl border-t border-[#2e2e30] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f21] shrink-0">
              <Layers size={13} className="text-ds-primary" />
              <span className="text-[11px] font-semibold text-[#a1a1a6] uppercase tracking-wider">
                {t('Section Library', 'مكتبة الأقسام')}
              </span>
              <span className="text-[9px] text-[#48484a]">{t('Click to toggle visibility', 'انقر لإظهار / إخفاء')}</span>
              <button
                onClick={() => setOpen(false)}
                className="ms-auto w-6 h-6 flex items-center justify-center rounded hover:bg-[#2b2b2c] text-[#636366] hover:text-[#e1e1e6] transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Grid of sections */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-3 gap-2">
                {SECTIONS.map((sec, i) => {
                  const active = isActive(sec.id)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleSection(sec.id)}
                      className={`relative flex flex-col items-start gap-2 p-3 rounded-lg border text-start transition-all group ${
                        active
                          ? 'border-ds-primary/60 bg-ds-primary/8 text-[#e1e1e6]'
                          : 'border-[#2e2e30] bg-[#131314] text-[#8e8e93] hover:border-[#3a3a3c] hover:bg-[#1a1a1b] hover:text-[#e1e1e6]'
                      }`}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute top-2 end-2 w-4 h-4 rounded-full bg-ds-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                      <div className={`p-1.5 rounded-md ${active ? 'text-ds-primary bg-ds-primary/15' : 'text-[#636366] bg-[#1c1c1e] group-hover:text-[#a1a1a6]'}`}>
                        {sec.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold leading-tight">{t(sec.label, sec.labelAr)}</div>
                        <div className="text-[8px] text-[#48484a] mt-0.5 leading-tight">{sec.description}</div>
                      </div>
                      {/* Preview emoji */}
                      <div className="absolute bottom-2 end-2 text-[14px] opacity-30 group-hover:opacity-60 transition-opacity">
                        {sec.preview}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky "Add Section" bar at bottom of preview */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center py-2 px-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none">
        <button
          onClick={() => setOpen(v => !v)}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-semibold shadow-lg transition-all ${
            open
              ? 'bg-ds-primary border-ds-primary text-white shadow-ds-primary/30'
              : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-ds-primary hover:text-ds-primary hover:shadow-xl'
          }`}
        >
          {open ? <ChevronUp size={12} /> : <Plus size={12} />}
          {open ? t('Close Library', 'إغلاق المكتبة') : t('Add Section', 'إضافة قسم')}
        </button>
      </div>
    </>
  )
}
