'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { 
  FileText, 
  Layers, 
  Settings, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Plus, 
  Eye, 
  Save, 
  Code,
  Trash2,
  Move
} from 'lucide-react'

export default function PageBuilderWorkspace() {
  const { selectedPageId, sitemap, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const activePage = sitemap.find(p => p.id === selectedPageId)
  
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  
  const [pageElements, setPageElements] = useState([
    { id: 'el-1', type: 'hero', title: t('Premium Hero Section', 'قسم رئيسي متميز'), desc: t('Unlock your potential with our platform.', 'اكتشف إمكاناتك مع منصتنا الاحترافية.') },
    { id: 'el-2', type: 'features', title: t('Core Features', 'الميزات الأساسية'), desc: t('Speed, security, and elegance guaranteed.', 'السرعة والأمان والأناقة مضمونة.') },
    { id: 'el-3', type: 'cta', title: t('Join Us Today', 'انضم إلينا اليوم'), desc: t('Sign up to experience the future.', 'سجل الآن لتجربة المستقبل الرقمي.') }
  ])

  const libraryItems = [
    { type: 'hero', name: t('Hero Section', 'القسم الرئيسي'), icon: Sparkles },
    { type: 'features', name: t('Feature Grid', 'شبكة الميزات'), icon: Layers },
    { type: 'cta', name: t('Call to Action', 'دعوة للإجراء'), icon: Play },
    { type: 'content', name: t('Content Block', 'كتلة المحتوى'), icon: FileText },
  ]

  const handleAddElement = (type: string) => {
    const newEl = {
      id: `el-${Date.now()}`,
      type,
      title: type.toUpperCase() + ' SECTION',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
    setPageElements([...pageElements, newEl])
  }

  const handleDeleteElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPageElements(pageElements.filter(el => el.id !== id))
    if (selectedElementId === id) setSelectedElementId(null)
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-ds-background text-ds-text-primary h-full">
      {/* Left Panel - Elements Library */}
      <div className="w-64 border-e border-ds-border bg-ds-surface flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-ds-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ds-text-muted">
            {t('Component Library', 'مكتبة المكونات')}
          </h3>
          <p className="text-[10px] text-ds-text-muted mt-1">
            {t('Click components to add them to your page sitemap structure.', 'اضغط على المكونات لإضافتها إلى هيكلية صفحتك.')}
          </p>
        </div>
        
        <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1">
          {libraryItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.type}
                onClick={() => handleAddElement(item.type)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-ds-border bg-ds-surface hover:bg-ds-surface-hover hover:border-ds-primary group transition-all text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ds-primary/10 text-ds-primary group-hover:bg-ds-primary group-hover:text-white transition-colors">
                    <Icon size={14} />
                  </div>
                  <span className="text-xs font-medium text-ds-text-primary">{item.name}</span>
                </div>
                <Plus size={12} className="text-ds-text-muted group-hover:text-ds-primary transition-colors" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Middle Panel - Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-ds-surface-hover/20">
        {/* Canvas Toolbar */}
        <div className="h-12 border-b border-ds-border bg-ds-surface flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-ds-primary/10 text-ds-primary">
              <FileText size={14} />
            </div>
            <span className="text-xs font-semibold">
              {activePage ? activePage.title : t('No Page Selected', 'لم يتم تحديد صفحة')}
            </span>
            {activePage && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-ds-surface-hover text-ds-text-muted">
                {activePage.route}
              </span>
            )}
          </div>

          {/* Viewport size switcher */}
          <div className="flex items-center bg-ds-surface-hover border border-ds-border rounded-lg p-0.5 gap-0.5">
            {[
              { mode: 'desktop', icon: Monitor },
              { mode: 'tablet', icon: Tablet },
              { mode: 'mobile', icon: Smartphone }
            ].map(dev => {
              const Icon = dev.icon
              return (
                <button
                  key={dev.mode}
                  onClick={() => setDeviceMode(dev.mode as any)}
                  className={`p-1.5 rounded-md transition-colors ${
                    deviceMode === dev.mode ? 'bg-ds-surface text-ds-primary shadow-sm' : 'text-ds-text-muted hover:text-ds-text-primary'
                  }`}
                >
                  <Icon size={12} />
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-surface border border-ds-border text-[11px] font-medium text-ds-text-muted hover:text-ds-text-primary transition-all">
              <Eye size={12} />
              {t('Preview', 'معاينة')}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-primary text-[11px] font-medium text-white shadow-lg hover:shadow-ds-primary/10 transition-all">
              <Save size={12} />
              {t('Save Page', 'حفظ الصفحة')}
            </button>
          </div>
        </div>

        {/* Dynamic Frame Wrapper */}
        <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
          <div 
            className={`bg-ds-surface border border-ds-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden min-h-[500px] flex flex-col ${
              deviceMode === 'desktop' ? 'w-full max-w-5xl' : deviceMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            {/* Page Header */}
            <div className="border-b border-ds-border p-4 bg-ds-surface/50 backdrop-blur flex justify-between items-center">
              <div className="font-bold text-sm tracking-wider text-ds-primary">NEZAM</div>
              <div className="flex gap-4 text-xs font-semibold text-ds-text-muted">
                <span>{t('Home', 'الرئيسية')}</span>
                <span>{t('Services', 'الخدمات')}</span>
                <span>{t('About', 'حول')}</span>
              </div>
            </div>

            {/* Elements Canvas */}
            <div className="flex-1 p-4 flex flex-col gap-4 bg-ds-surface-hover/10">
              {pageElements.map((el, idx) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`group relative border rounded-xl p-6 transition-all cursor-pointer ${
                    selectedElementId === el.id 
                      ? 'bg-ds-surface border-ds-primary shadow-xl ring-1 ring-ds-primary/20' 
                      : 'bg-ds-surface/60 border-ds-border hover:bg-ds-surface hover:shadow-md'
                  }`}
                >
                  {/* Floating Action Strip */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button className="p-1 rounded bg-ds-surface-hover border border-ds-border hover:text-ds-primary text-ds-text-muted transition-colors">
                      <Move size={11} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteElement(el.id, e)}
                      className="p-1 rounded bg-ds-surface-hover border border-ds-border hover:text-ds-destructive text-ds-text-muted transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-wider text-ds-primary/80 uppercase">
                      {el.type}
                    </span>
                    <h4 className="text-sm font-semibold text-ds-text-primary">
                      {el.title}
                    </h4>
                    <p className="text-xs text-ds-text-muted">
                      {el.desc}
                    </p>
                  </div>
                </div>
              ))}
              
              {pageElements.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-ds-border rounded-xl">
                  <Layers size={24} className="text-ds-text-muted mb-2 animate-bounce" />
                  <p className="text-xs font-semibold text-ds-text-muted">
                    {t('Sitemap Canvas Empty', 'منطقة التصميم فارغة')}
                  </p>
                  <p className="text-[10px] text-ds-text-muted max-w-[200px] mt-1">
                    {t('Add components from the library to build your page structure.', 'أضف مكونات من المكتبة اليسرى للبدء في بناء صفحتك.')}
                  </p>
                </div>
              )}
            </div>

            {/* Page Footer */}
            <div className="border-t border-ds-border p-4 bg-ds-surface/50 text-center text-[10px] text-ds-text-muted">
              © 2026 NEZAM. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Style & Content Editor */}
      <div className="w-80 border-s border-ds-border bg-ds-surface flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-ds-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ds-text-muted">
            {t('Element Customizer', 'مخصص العناصر')}
          </h3>
        </div>

        {selectedElementId ? (() => {
          const el = pageElements.find(e => e.id === selectedElementId)
          if (!el) return null
          return (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Section Type', 'نوع القسم')}
                </label>
                <input 
                  type="text" 
                  value={el.type.toUpperCase()} 
                  disabled
                  className="w-full text-xs bg-ds-surface-hover border border-ds-border rounded-lg p-2 text-ds-text-muted font-semibold cursor-not-allowed" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Heading Title', 'عنوان القسم الرئيسي')}
                </label>
                <input 
                  type="text" 
                  value={el.title}
                  onChange={(e) => {
                    const updated = pageElements.map(item => item.id === el.id ? { ...item, title: e.target.value } : item)
                    setPageElements(updated)
                  }}
                  className="w-full text-xs bg-ds-surface border border-ds-border rounded-lg p-2.5 hover:border-ds-primary focus:border-ds-primary text-ds-text-primary transition-all" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Description Subtext', 'الوصف الفرعي')}
                </label>
                <textarea 
                  rows={4}
                  value={el.desc}
                  onChange={(e) => {
                    const updated = pageElements.map(item => item.id === el.id ? { ...item, desc: e.target.value } : item)
                    setPageElements(updated)
                  }}
                  className="w-full text-xs bg-ds-surface border border-ds-border rounded-lg p-2.5 hover:border-ds-primary focus:border-ds-primary text-ds-text-primary transition-all resize-none" 
                />
              </div>

              <div className="h-px bg-ds-border my-2" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Layout Customization', 'تخصيص التخطيط')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="text-[11px] p-2.5 rounded-lg border border-ds-primary bg-ds-primary/5 text-ds-primary font-medium hover:bg-ds-primary/10 transition-colors">
                    {t('Centered Content', 'محتوى ممركز')}
                  </button>
                  <button className="text-[11px] p-2.5 rounded-lg border border-ds-border hover:border-ds-primary text-ds-text-muted hover:text-ds-text-primary transition-colors">
                    {t('Left Aligned', 'محاذاة لليسار')}
                  </button>
                </div>
              </div>
            </div>
          )
        })() : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-ds-text-muted">
            <Settings size={20} className="mb-2 animate-spin duration-1000" />
            <p className="text-xs font-semibold">{t('No Element Selected', 'لم يتم اختيار عنصر')}</p>
            <p className="text-[10px] text-ds-text-muted mt-1 max-w-[200px]">
              {t('Click on any section layout inside the page preview canvas to customize its content.', 'اضغط على أي قسم داخل مساحة معاينة الصفحة لتخصيص محتواه.')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
