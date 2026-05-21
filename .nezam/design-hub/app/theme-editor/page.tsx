'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Check, Save, RotateCcw } from 'lucide-react'

export default function ThemeEditorPage() {
  const { lang, templateConfig, updateTemplateConfig, addLog } = useSessionStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const colors = [
    { name: t('Primary', 'الأساسي'), key: 'primary', value: '#3B82F6' },
    { name: t('Success', 'النجاح'), key: 'success', value: '#10B981' },
    { name: t('Warning', 'التحذير'), key: 'warning', value: '#F59E0B' },
    { name: t('Error', 'الخطأ'), key: 'error', value: '#EF4444' },
  ]

  const fonts = [
    { name: 'Inter', value: 'inter' },
    { name: 'Cairo', value: 'cairo' },
    { name: 'IBM Plex Sans Arabic', value: 'ibm' },
    { name: 'Roboto', value: 'roboto' },
  ]

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      addLog(t('Design tokens updated and saved.', 'تم تحديث وحفظ رموز التصميم.'))
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }

  return (
    <div className="h-full flex flex-col bg-ds-background text-ds-text-primary p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold">{t('Theme Editor', 'محرر الألوان')}</h1>
          <p className="text-xs text-ds-text-muted mt-1">
            {t('Customize your global design tokens and brand personality.', 'خصص رموز التصميم العالمية وشخصية العلامة التجارية.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover rounded-lg transition-colors border border-ds-border">
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded text-xs font-medium transition-all flex items-center gap-2 ${
              saved 
                ? 'bg-ds-success text-white' 
                : 'bg-ds-primary text-white hover:opacity-90 active:scale-95'
            }`}
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}
            {saved ? t('Saved!', 'تم الحفظ!') : t('Save Changes', 'حفظ التغييرات')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Palette */}
        <div className="p-6 bg-ds-surface border border-ds-border rounded-xl space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold">{t('Color Palette', 'لوحة الألوان')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {colors.map((color) => (
              <div key={color.key} className="space-y-2">
                <label className="text-[10px] text-ds-text-muted uppercase tracking-wider">{color.name}</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg border border-ds-border shadow-inner cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color.value }}
                  />
                  <input 
                    type="text" 
                    defaultValue={color.value}
                    className="flex-1 bg-ds-background border border-ds-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-ds-primary/50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="p-6 bg-ds-surface border border-ds-border rounded-xl space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold">{t('Typography', 'الخطوط')}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-ds-text-muted uppercase tracking-wider block mb-2">{t('Main Font Family', 'نوع الخط الأساسي')}</label>
              <select className="w-full bg-ds-background border border-ds-border rounded px-3 py-2 text-xs focus:outline-none focus:border-ds-primary transition-colors">
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
            <div className="p-4 bg-ds-background rounded-lg border border-ds-border">
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Inter' }}>The quick brown fox jumps over the lazy dog.</p>
              <p className="text-xl mt-2 font-cairo leading-relaxed">الثعلب البني السريع يقفز فوق الكلب الكسول.</p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-6 bg-ds-surface border border-ds-border rounded-xl space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold">{t('Appearance', 'المظهر')}</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => updateTemplateConfig({ colorProfile: 'light' })}
              className={`flex-1 p-4 rounded-lg border transition-all text-center group ${
                templateConfig.colorProfile === 'light' 
                  ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' 
                  : 'border-ds-border bg-ds-background hover:border-ds-border/80'
              }`}
            >
              <div className="w-full h-12 bg-white rounded border border-gray-200 mb-2 shadow-sm" />
              <span className="text-xs font-medium">{t('Light Mode', 'الوضع الفاتح')}</span>
            </button>
            <button 
              onClick={() => updateTemplateConfig({ colorProfile: 'dark' })}
              className={`flex-1 p-4 rounded-lg border transition-all text-center group ${
                templateConfig.colorProfile === 'dark' 
                  ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' 
                  : 'border-ds-border bg-ds-background hover:border-ds-border/80'
              }`}
            >
              <div className="w-full h-12 bg-gray-900 rounded border border-gray-800 mb-2 shadow-sm" />
              <span className="text-xs font-medium">{t('Dark Mode', 'الوضع الداكن')}</span>
            </button>
          </div>
        </div>

        {/* Border Radius */}
        <div className="p-6 bg-ds-surface border border-ds-border rounded-xl space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold">{t('Global Shapes', 'الأشكال العامة')}</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] text-ds-text-muted uppercase tracking-wider">{t('Corner Roundness', 'استدارة الزوايا')}</label>
                <span className="text-[10px] font-mono text-ds-primary bg-ds-primary/10 px-1.5 rounded">8px</span>
              </div>
              <input type="range" className="w-full accent-ds-primary cursor-pointer" min="0" max="24" defaultValue="8" />
              <div className="flex justify-between text-[10px] text-ds-text-muted mt-2">
                <span>{t('Sharp', 'حادة')}</span>
                <span>{t('Rounded', 'مستديرة')}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center items-center py-2 bg-ds-background rounded-lg border border-ds-border/50">
              <div className="w-8 h-8 bg-ds-primary rounded-none shadow-sm" />
              <div className="w-8 h-8 bg-ds-primary rounded shadow-sm" />
              <div className="w-8 h-8 bg-ds-primary rounded-lg shadow-sm" />
              <div className="w-8 h-8 bg-ds-primary rounded-2xl shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
