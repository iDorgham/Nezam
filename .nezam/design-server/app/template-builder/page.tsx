'use client'

import React, { useEffect, useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'

const options = {
  headerStyle: [
    { value: 'simple', labelEn: 'Simple Bar', labelAr: 'بار بسيط', descEn: 'Clean layout with logo and links', descAr: 'تخطيط نظيف مع شعار وروابط' },
    { value: 'mega', labelEn: 'Mega Menu', labelAr: 'قائمة ضخمة', descEn: 'Wide dropdowns for complex navigation', descAr: 'قوائم منسدلة واسعة للتنقل المعقد' },
    { value: 'sidebar', labelEn: 'Sidebar', labelAr: 'شريط جانبي', descEn: 'Left vertical navigation', descAr: 'تنقل رأسي يساري' }
  ],
  footerStyle: [
    { value: 'simple', labelEn: 'Simple', labelAr: 'بسيط', descEn: 'Copyright and social links only', descAr: 'حقوق النشر وروابط التواصل فقط' },
    { value: 'multi-col', labelEn: 'Multi-column', labelAr: 'أعمدة متعددة', descEn: 'Links organized by category', descAr: 'روابط منظمة حسب الفئة' }
  ],
  heroStyle: [
    { value: 'centered', labelEn: 'Centered', labelAr: 'متمركز', descEn: 'Headline and CTA in the middle', descAr: 'عنوان وزر اتخاذ إجراء في المنتصف' },
    { value: 'split', labelEn: 'Split Screen', labelAr: 'شاشة مقسومة', descEn: 'Text on left, image on right', descAr: 'نص على الشمال، صورة على اليمين' },
    { value: 'video', labelEn: 'Video BG', labelAr: 'خلفية فيديو', descEn: 'Background video loop', descAr: 'فيديو شغال في الخلفية' }
  ],
  colorProfile: [
    { value: 'dark', labelEn: 'Dark Mode', labelAr: 'وضع غامق', descEn: 'Sleek dark theme', descAr: 'سمة غامقة أنيقة' },
    { value: 'light', labelEn: 'Light Mode', labelAr: 'وضع فاتح', descEn: 'Clean light theme', descAr: 'سمة فاتحة نظيفة' },
    { value: 'neon', labelEn: 'Neon Accent', labelAr: 'نيون مميز', descEn: 'Dark theme with vibrant accents', descAr: 'سمة غامقة مع لمسات حيوية' }
  ],
  typography: [
    { value: 'modern', labelEn: 'Modern Sans', labelAr: 'سانس حديث', descEn: 'Clean and readable', descAr: 'نظيف وسهل القراءة' },
    { value: 'serif', labelEn: 'Classic Serif', labelAr: 'سيريف كلاسيكي', descEn: 'Elegant and traditional', descAr: 'أنيق وتقليدي' }
  ],
  spacing: [
    { value: 'compact', labelEn: 'Compact', labelAr: 'مضغوط', descEn: 'Less padding, more density', descAr: 'حشو أقل، كثافة أكثر' },
    { value: 'spacious', labelEn: 'Spacious', labelAr: 'واسع', descEn: 'Generous padding and margins', descAr: 'حشو وهوامش واسعة' }
  ],
  formStyle: [
    { value: 'minimal', labelEn: 'Minimal', labelAr: 'بسيط جداً', descEn: 'Underline only inputs', descAr: 'حقول بإدخال خط تحتي فقط' },
    { value: 'outlined', labelEn: 'Outlined', labelAr: 'محدد', descEn: 'Boxed inputs with borders', descAr: 'حقول مربعة بحدود' }
  ]
}

const categoryTranslations: Record<string, { en: string, ar: string }> = {
  headerStyle: { en: 'Header Style', ar: 'شكل الهيدر' },
  footerStyle: { en: 'Footer Style', ar: 'شكل الفوتر' },
  heroStyle: { en: 'Hero Style', ar: 'شكل الهيرو' },
  colorProfile: { en: 'Color Profile', ar: 'بروفايل الألوان' },
  typography: { en: 'Typography', ar: 'الخطوط' },
  spacing: { en: 'Spacing', ar: 'المسافات' },
  formStyle: { en: 'Form Style', ar: 'شكل الفورم' }
}

export default function TemplateBuilderPage() {
  const { templateConfig, updateTemplateConfig, profiles, fetchProfiles, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const startIndex = currentPage * itemsPerPage
  const visibleProfiles = profiles.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(profiles.length / itemsPerPage)

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const handleSelect = (category: string, value: string) => {
    updateTemplateConfig({ [category]: value })
  }

  return (
    <div className="p-4 w-full space-y-6 text-ds-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">{t('Template Builder', 'باني القوالب')}</h1>
          <p className="text-ds-text-muted text-xs mt-0.5">{t('Configure the global style and layout defaults for your project.', 'قم بتكوين النمط العام والافتراضيات للتخطيط لمشروعك.')}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium">{t('Base Profile', 'الملف الشخصي الأساسي')}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 text-ds-text-muted hover:text-ds-text-primary disabled:opacity-50"
            >
              ← {t('Prev', 'السابق')}
            </button>
            <span className="text-xs text-ds-text-muted">
              {currentPage + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-1 text-ds-text-muted hover:text-ds-text-primary disabled:opacity-50"
            >
              {t('Next', 'التالي')} →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-ds-surface border border-ds-border rounded p-2">
          {visibleProfiles.map((profile) => {
            const isSelected = templateConfig.colorProfile === profile.name
            return (
              <div
                key={profile.name}
                className={`p-2 bg-ds-surface border ${
                  isSelected ? 'border-ds-primary' : 'border-ds-border'
                } rounded hover:border-ds-border-hover transition-colors cursor-pointer`}
                onClick={() => updateTemplateConfig({ colorProfile: profile.name })}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-xs text-ds-text-primary">{profile.name}</div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 bg-ds-primary rounded-full"></span>
                  )}
                </div>
                <div className="text-[10px] text-ds-text-muted">{profile.category}</div>
              </div>
            )
          })}
          {profiles.length === 0 && (
            <div className="col-span-4 text-center text-ds-text-muted text-xs py-2">
              {t('Loading profiles...', 'جاري تحميل الملفات الشخصية...')}
            </div>
          )}
        </div>
      </div>

      {Object.entries(options).map(([category, categoryOptions]) => (
        <div key={category} className="space-y-2">
          <h2 className="text-sm font-medium capitalize">
            {t(categoryTranslations[category]?.en || category, categoryTranslations[category]?.ar || category)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categoryOptions.map((option) => {
              const isSelected = (templateConfig as any)[category] === option.value
              return (
                <div
                  key={option.value}
                  className={`p-2 bg-ds-surface border ${
                    isSelected ? 'border-ds-primary' : 'border-ds-border'
                  } rounded hover:border-ds-border-hover transition-colors cursor-pointer`}
                  onClick={() => handleSelect(category, option.value)}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-medium text-ds-text-primary text-xs">{t(option.labelEn, option.labelAr)}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 bg-ds-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-[10px] text-ds-text-muted">{t(option.descEn, option.descAr)}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
