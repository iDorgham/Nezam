'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { 
  Layers, 
  Layout, 
  Grid, 
  Settings, 
  Sparkles, 
  Cpu, 
  Palette, 
  Grid2X2, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save 
} from 'lucide-react'

export default function SectionsBuilderWorkspace() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [sections, setSections] = useState([
    { id: 'sec-1', name: t('Grid Features Section', 'قسم شبكة الميزات'), columns: 3, items: 3 },
    { id: 'sec-2', name: t('Split Visual Section', 'قسم المحتوى المنقسم'), columns: 2, items: 2 }
  ])

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('sec-1')

  const handleAddSection = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      name: t('New Custom Section', 'قسم مخصص جديد'),
      columns: 4,
      items: 4
    }
    setSections([...sections, newSec])
    setSelectedSectionId(newSec.id)
  }

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSections(sections.filter(s => s.id !== id))
    if (selectedSectionId === id) setSelectedSectionId(null)
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-ds-background text-ds-text-primary h-full">
      {/* Sidebar: Sections manager */}
      <div className="w-64 border-e border-ds-border bg-ds-surface flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-ds-border flex justify-between items-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ds-text-muted">
            {t('Layout Blocks', 'كتل التخطيط')}
          </h3>
          <button 
            onClick={handleAddSection}
            className="p-1 rounded-md bg-ds-primary/10 text-ds-primary hover:bg-ds-primary hover:text-white transition-all"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="p-3 flex flex-col gap-1 overflow-y-auto flex-1">
          {sections.map(sec => (
            <div
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                selectedSectionId === sec.id 
                  ? 'bg-ds-primary/10 text-ds-text-primary border border-ds-primary/30' 
                  : 'hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layout size={12} className="text-ds-primary flex-shrink-0" />
                <span className="text-xs font-medium truncate">{sec.name}</span>
              </div>
              <button 
                onClick={(e) => handleDeleteSection(sec.id, e)}
                className="p-1 opacity-0 hover:opacity-100 rounded hover:bg-ds-surface-hover hover:text-ds-destructive text-ds-text-muted transition-all"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Center Layout Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-ds-surface-hover/20">
        <div className="h-12 border-b border-ds-border bg-ds-surface flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Layout size={14} className="text-ds-primary" />
            <span className="text-xs font-semibold">
              {selectedSectionId ? sections.find(s => s.id === selectedSectionId)?.name : t('Assemble Layout Blocks', 'تجميع كتل التخطيط')}
            </span>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-primary text-[11px] font-medium text-white shadow-lg hover:shadow-ds-primary/10 transition-all">
            <Save size={12} />
            {t('Save Template', 'حفظ القالب')}
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex justify-center items-center">
          {selectedSectionId ? (() => {
            const sec = sections.find(s => s.id === selectedSectionId)
            if (!sec) return null
            return (
              <div className="w-full max-w-4xl bg-ds-surface border border-ds-border rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-ds-border pb-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{sec.name}</span>
                    <span className="text-[10px] text-ds-text-muted mt-0.5">
                      {t('Grid configuration with fluid columns', 'تكوين شبكي مع أعمدة مرنة')}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono bg-ds-surface-hover text-ds-text-muted px-2.5 py-1 rounded-full">
                    {sec.columns} {t('Columns', 'أعمدة')}
                  </div>
                </div>

                {/* Simulated grid */}
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${sec.columns}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: sec.items }).map((_, i) => (
                    <div key={i} className="border border-dashed border-ds-border bg-ds-surface-hover/30 rounded-xl p-6 flex flex-col gap-2 group hover:border-ds-primary transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-ds-primary/10 text-ds-primary flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </div>
                      <div className="h-3 w-2/3 bg-ds-surface-hover rounded mt-2" />
                      <div className="h-2 w-full bg-ds-surface-hover rounded" />
                      <div className="h-2 w-5/6 bg-ds-surface-hover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )
          })() : (
            <div className="text-center text-ds-text-muted">
              <Grid size={24} className="mx-auto mb-2 text-ds-text-muted animate-spin duration-3000" />
              <p className="text-xs font-semibold">{t('Select a section block from the left panel.', 'اختر كتلة تخطيط من اللوحة اليسرى.')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Customizer Panel */}
      <div className="w-80 border-s border-ds-border bg-ds-surface flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-ds-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ds-text-muted">
            {t('Section Rules', 'قواعد الأقسام')}
          </h3>
        </div>

        {selectedSectionId ? (() => {
          const sec = sections.find(s => s.id === selectedSectionId)
          if (!sec) return null
          return (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Grid Columns', 'أعمدة الشبكة')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(cols => (
                    <button
                      key={cols}
                      onClick={() => {
                        const updated = sections.map(s => s.id === sec.id ? { ...s, columns: cols } : s)
                        setSections(updated)
                      }}
                      className={`text-xs p-2 rounded-lg border font-semibold transition-all ${
                        sec.columns === cols ? 'border-ds-primary bg-ds-primary/5 text-ds-primary' : 'border-ds-border hover:border-ds-primary text-ds-text-muted hover:text-ds-text-primary'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Grid Items count', 'عدد العناصر داخل الشبكة')}
                </label>
                <input 
                  type="number" 
                  min={1}
                  max={12}
                  value={sec.items}
                  onChange={(e) => {
                    const updated = sections.map(s => s.id === sec.id ? { ...s, items: parseInt(e.target.value) || 1 } : s)
                    setSections(updated)
                  }}
                  className="w-full text-xs bg-ds-surface border border-ds-border rounded-lg p-2.5 hover:border-ds-primary focus:border-ds-primary text-ds-text-primary transition-all" 
                />
              </div>

              <div className="h-px bg-ds-border my-2" />

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold text-ds-text-muted uppercase">
                  {t('Design Rules', 'قواعد التصميم')}
                </span>
                <div className="flex items-center justify-between p-2 rounded-lg bg-ds-surface-hover/50 text-xs">
                  <div className="flex items-center gap-2 text-ds-text-primary">
                    <Palette size={12} className="text-ds-primary" />
                    <span>{t('Apply Harmony Color', 'تطبيق تناغم الألوان')}</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-ds-primary" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-ds-surface-hover/50 text-xs">
                  <div className="flex items-center gap-2 text-ds-text-primary">
                    <Cpu size={12} className="text-ds-primary" />
                    <span>{t('Fluid Animations', 'حركات انسيابية')}</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-ds-primary" />
                </div>
              </div>
            </div>
          )
        })() : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-ds-text-muted text-xs">
            {t('Select a section to customize its layout settings.', 'اختر قسماً لتخصيص إعدادات تخطيطه.')}
          </div>
        )}
      </div>
    </div>
  )
}
