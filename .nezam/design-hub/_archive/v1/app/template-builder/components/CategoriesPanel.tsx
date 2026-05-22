'use client'
import React, { useState } from 'react'
import {
  Tag, Layout, AlignLeft, MessageSquare, DollarSign,
  Users, BarChart3, Mail, HelpCircle, Megaphone,
  Image, Star, ChevronRight, Plus, Zap, Globe,
  ShoppingCart, Newspaper, Video, Map, Clock,
} from 'lucide-react'

interface SectionTemplate {
  id: string
  label: string
  labelAr: string
  icon: React.ReactNode
  tags: string[]
  complexity: 'simple' | 'medium' | 'complex'
}

interface Category {
  id: string
  label: string
  labelAr: string
  icon: React.ReactNode
  color: string
  sections: SectionTemplate[]
}

const CATEGORIES: Category[] = [
  {
    id: 'hero',
    label: 'Hero / Landing',
    labelAr: 'صفحة البداية',
    icon: <Megaphone size={13} />,
    color: '#8B5CF6',
    sections: [
      { id: 'hero-centered', label: 'Centered Hero', labelAr: 'هيرو مركزي', icon: <Layout size={11}/>, tags: ['minimal', 'clean'], complexity: 'simple' },
      { id: 'hero-split',    label: 'Split Hero',    labelAr: 'هيرو مقسوم',  icon: <Layout size={11}/>, tags: ['media', 'modern'], complexity: 'medium' },
      { id: 'hero-showcase', label: 'App Showcase',  labelAr: 'عرض التطبيق', icon: <Layout size={11}/>, tags: ['saas', 'app'],    complexity: 'complex' },
      { id: 'hero-video',    label: 'Video Hero',    labelAr: 'هيرو فيديو',  icon: <Video  size={11}/>, tags: ['media', 'bold'],  complexity: 'complex' },
    ],
  },
  {
    id: 'features',
    label: 'Features & Benefits',
    labelAr: 'الميزات والفوائد',
    icon: <Zap size={13} />,
    color: '#F97316',
    sections: [
      { id: 'feat-grid',   label: '3-Col Grid',    labelAr: 'شبكة 3 أعمدة', icon: <Layout size={11}/>, tags: ['grid', 'icons'], complexity: 'simple' },
      { id: 'feat-cards',  label: 'Feature Cards', labelAr: 'بطاقات الميزات', icon: <Layout size={11}/>, tags: ['cards'],        complexity: 'medium' },
      { id: 'feat-list',   label: 'Feature List',  labelAr: 'قائمة الميزات', icon: <AlignLeft size={11}/>, tags: ['list'],      complexity: 'simple' },
      { id: 'feat-compare',label: 'Comparison',    labelAr: 'المقارنة',      icon: <BarChart3 size={11}/>, tags: ['table'],     complexity: 'medium' },
    ],
  },
  {
    id: 'social',
    label: 'Social Proof',
    labelAr: 'الدليل الاجتماعي',
    icon: <Star size={13} />,
    color: '#F59E0B',
    sections: [
      { id: 'test-cards', label: 'Review Cards',  labelAr: 'بطاقات التقييمات', icon: <MessageSquare size={11}/>, tags: ['reviews'], complexity: 'medium' },
      { id: 'test-logos', label: 'Client Logos',  labelAr: 'شعارات العملاء',  icon: <Image size={11}/>, tags: ['brands'],           complexity: 'simple' },
      { id: 'test-stats', label: 'Trust Stats',   labelAr: 'إحصائيات الثقة',  icon: <BarChart3 size={11}/>, tags: ['numbers'],     complexity: 'simple' },
      { id: 'team-grid',  label: 'Team Grid',     labelAr: 'شبكة الفريق',    icon: <Users size={11}/>, tags: ['people', 'about'],  complexity: 'medium' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    labelAr: 'الأسعار',
    icon: <DollarSign size={13} />,
    color: '#10B981',
    sections: [
      { id: 'price-3col', label: '3-Tier Plans',  labelAr: 'ثلاث خطط',      icon: <Layout size={11}/>, tags: ['saas', 'plans'], complexity: 'complex' },
      { id: 'price-toggle',label: 'Monthly/Annual',labelAr: 'شهري/سنوي',    icon: <Layout size={11}/>, tags: ['toggle'],        complexity: 'complex' },
      { id: 'price-simple',label: 'Simple CTA',   labelAr: 'سعر واحد',      icon: <Megaphone size={11}/>, tags: ['minimal'],   complexity: 'simple' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact & Forms',
    labelAr: 'التواصل والنماذج',
    icon: <Mail size={13} />,
    color: '#06B6D4',
    sections: [
      { id: 'form-basic',   label: 'Contact Form',  labelAr: 'نموذج التواصل', icon: <Mail size={11}/>, tags: ['form'],          complexity: 'simple' },
      { id: 'form-map',     label: 'Form + Map',    labelAr: 'نموذج + خريطة', icon: <Map size={11}/>, tags: ['location'],       complexity: 'medium' },
      { id: 'form-booking', label: 'Booking Form',  labelAr: 'نموذج الحجز',   icon: <Clock size={11}/>, tags: ['calendar'],    complexity: 'complex' },
      { id: 'newsletter',   label: 'Newsletter CTA',labelAr: 'نشرة إخبارية',  icon: <Newspaper size={11}/>, tags: ['email'],  complexity: 'simple' },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    labelAr: 'التجارة الإلكترونية',
    icon: <ShoppingCart size={13} />,
    color: '#F43F5E',
    sections: [
      { id: 'product-grid', label: 'Product Grid', labelAr: 'شبكة المنتجات', icon: <Layout size={11}/>, tags: ['shop', 'grid'], complexity: 'medium' },
      { id: 'product-feat', label: 'Featured Product', labelAr: 'منتج مميز', icon: <Star size={11}/>, tags: ['hero', 'product'], complexity: 'medium' },
      { id: 'cart-cta',     label: 'Cart CTA',     labelAr: 'دعوة للشراء',  icon: <ShoppingCart size={11}/>, tags: ['cta'],    complexity: 'simple' },
    ],
  },
  {
    id: 'content',
    label: 'Content Blocks',
    labelAr: 'كتل المحتوى',
    icon: <Newspaper size={13} />,
    color: '#94A3B8',
    sections: [
      { id: 'blog-grid',  label: 'Blog Grid',    labelAr: 'شبكة المدونة',    icon: <Newspaper size={11}/>, tags: ['blog'],     complexity: 'medium' },
      { id: 'faq',        label: 'FAQ Accordion', labelAr: 'الأسئلة الشائعة', icon: <HelpCircle size={11}/>, tags: ['accordion'], complexity: 'medium' },
      { id: 'timeline',   label: 'Timeline',     labelAr: 'الجدول الزمني',   icon: <Clock size={11}/>, tags: ['history'],     complexity: 'medium' },
      { id: 'cta-banner', label: 'CTA Banner',   labelAr: 'بانر الإجراء',   icon: <Megaphone size={11}/>, tags: ['cta'],      complexity: 'simple' },
      { id: 'globe',      label: 'World Map',    labelAr: 'خريطة العالم',    icon: <Globe size={11}/>, tags: ['global'],      complexity: 'complex' },
    ],
  },
]

const complexityColor: Record<string, string> = {
  simple:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  complex: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
}

interface CategoriesPanelProps {
  lang: string
  t: (en: string, ar: string) => string
  onAddSection?: (sectionId: string) => void
}

export default function CategoriesPanel({ lang, t, onAddSection }: CategoriesPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)

  const filteredSections = search.trim()
    ? CATEGORIES.flatMap(c => c.sections.filter(s =>
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.labelAr.includes(search) ||
        s.tags.some(tag => tag.includes(search.toLowerCase()))
      ))
    : []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
        <Tag size={11} className="text-ds-primary" />
        <span className="text-[10px] font-semibold text-[#a1a1a6]">{t('Section Library', 'مكتبة الأقسام')}</span>
        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="ms-auto text-[9px] text-[#636366] hover:text-[#e1e1e6] transition-colors flex items-center gap-0.5"
          >
            ← {t('Back', 'رجوع')}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-2 pt-2 pb-1 shrink-0">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('Search sections…', 'بحث عن قسم…')}
          className="w-full bg-[#1c1c1e] border border-[#2e2e30] rounded-lg px-3 py-1.5 text-[10px] text-[#e1e1e6] placeholder:text-[#48484a] focus:outline-none focus:border-[#636366] transition-colors"
        />
      </div>

      {/* Search results */}
      {search.trim() && (
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {filteredSections.length === 0 ? (
            <p className="text-center text-[9px] text-[#48484a] py-8">{t('No sections found', 'لا توجد أقسام')}</p>
          ) : filteredSections.map(sec => (
            <SectionCard key={sec.id} section={sec} t={t} onAdd={onAddSection} />
          ))}
        </div>
      )}

      {/* Categories grid */}
      {!search.trim() && !activeCategory && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-start gap-2 p-2.5 rounded-lg border border-[#2e2e30] bg-[#131314] hover:border-[#3a3a3c] hover:bg-[#1a1a1b] transition-all group text-start"
              >
                <div className="p-1.5 rounded-md" style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#e1e1e6] leading-tight">{t(cat.label, cat.labelAr)}</div>
                  <div className="text-[8px] text-[#636366] mt-0.5">{cat.sections.length} {t('templates', 'قوالب')}</div>
                </div>
                <ChevronRight size={10} className="self-end text-[#3a3a3c] group-hover:text-[#636366] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category sections */}
      {!search.trim() && activeCat && (
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5">
          <div className="py-2 flex items-center gap-2">
            <div className="p-1 rounded" style={{ background: `${activeCat.color}18`, color: activeCat.color }}>
              {activeCat.icon}
            </div>
            <span className="text-[10px] font-semibold text-[#e1e1e6]">{t(activeCat.label, activeCat.labelAr)}</span>
          </div>
          {activeCat.sections.map(sec => (
            <SectionCard key={sec.id} section={sec} t={t} onAdd={onAddSection} />
          ))}
        </div>
      )}
    </div>
  )
}

function SectionCard({
  section, t, onAdd
}: {
  section: SectionTemplate
  t: (en: string, ar: string) => string
  onAdd?: (id: string) => void
}) {
  return (
    <div className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-[#2e2e30] bg-[#131314] hover:border-[#3a3a3c] hover:bg-[#1a1a1b] transition-all">
      {/* Preview thumbnail */}
      <div className="w-12 h-8 rounded border border-[#2e2e30] bg-[#0f0f10] shrink-0 flex items-center justify-center text-[#48484a]">
        {section.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-[#e1e1e6] truncate">{t(section.label, section.labelAr)}</div>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {section.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[7px] font-bold px-1 py-px rounded bg-[#1c1c1e] text-[#636366] border border-[#2e2e30]">{tag}</span>
          ))}
          <span className={`text-[7px] font-bold px-1 py-px rounded border ${complexityColor[section.complexity]}`}>
            {section.complexity}
          </span>
        </div>
      </div>

      <button
        onClick={() => onAdd?.(section.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md bg-ds-primary text-white hover:opacity-90 transition-all"
      >
        <Plus size={10} />
      </button>
    </div>
  )
}
