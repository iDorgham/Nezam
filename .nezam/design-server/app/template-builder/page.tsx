'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Check, Images, Phone, Save, Share2, Sparkles } from 'lucide-react'

const options = {
  headerStyle: [
    { value: 'simple', labelEn: 'Simple Bar', labelAr: 'بار بسيط', descEn: 'Clean layout with logo and links', descAr: 'تخطيط نظيف مع شعار وروابط' },
    { value: 'mega', labelEn: 'Mega Menu', labelAr: 'قائمة ضخمة', descEn: 'Wide dropdowns for complex navigation', descAr: 'قوائم منسدلة واسعة للتنقل المعقد' },
    { value: 'sidebar', labelEn: 'Sidebar', labelAr: 'شريط جانبي', descEn: 'Left vertical navigation', descAr: 'تنقل رأسي يساري' }
  ],
  footerStyle: [
    { value: 'simple', labelEn: 'Simple Footer', labelAr: 'فوتر بسيط', descEn: 'Compact footer with a few support links', descAr: 'فوتر صغير بروابط أساسية' },
    { value: 'big', labelEn: 'Big Footer', labelAr: 'فوتر كبير', descEn: 'Large footer with 3 to 5 organized columns', descAr: 'فوتر كبير من 3 إلى 5 أعمدة' }
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

const positionOptions = [
  { value: 'left', labelEn: 'Left', labelAr: 'شمال' },
  { value: 'center', labelEn: 'Center', labelAr: 'منتصف' },
  { value: 'right', labelEn: 'Right', labelAr: 'يمين' },
]

const footerColumnOptions = [
  { value: 3, labelEn: '3 Columns', labelAr: '3 أعمدة' },
  { value: 4, labelEn: '4 Columns', labelAr: '4 أعمدة' },
  { value: 5, labelEn: '5 Columns', labelAr: '5 أعمدة' },
]

function ToggleCard({
  active,
  label,
  description,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-3 text-start transition-colors ${
        active
          ? 'border-ds-primary bg-ds-primary/8'
          : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
      }`}
    >
      <div className={`mt-0.5 rounded-lg p-2 ${active ? 'bg-ds-primary/15 text-ds-primary' : 'bg-ds-background text-ds-text-muted'}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-ds-text-primary">{label}</div>
        <div className="mt-1 text-[11px] text-ds-text-muted">{description}</div>
      </div>
    </button>
  )
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
  const { templateConfig, updateTemplateConfig, profiles, fetchProfiles, lang, addLog, openAssetManager } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [currentPage, setCurrentPage] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const itemsPerPage = 8
  const startIndex = currentPage * itemsPerPage
  const visibleProfiles = profiles.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(profiles.length / itemsPerPage)
  const storageKey = 'nezam.design-server.template-config'

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return

    try {
      updateTemplateConfig(JSON.parse(raw))
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [updateTemplateConfig])

  const handleSelect = (category: string, value: string) => {
    updateTemplateConfig({ [category]: value })
  }

  const selectedProfileName = useMemo(() => templateConfig.colorProfile, [templateConfig.colorProfile])

  const handleSave = () => {
    setSaving(true)
    localStorage.setItem(storageKey, JSON.stringify(templateConfig))
    window.setTimeout(() => {
      setSaving(false)
      setSaved(true)
      addLog(t('Template Builder settings saved locally.', 'تم حفظ إعدادات باني القوالب محلياً.'))
      window.setTimeout(() => setSaved(false), 1800)
    }, 400)
  }

  return (
    <div className="p-4 w-full space-y-6 text-ds-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">{t('Template Builder', 'باني القوالب')}</h1>
          <p className="text-ds-text-muted text-xs mt-0.5">{t('Configure the global style and layout defaults for your project.', 'قم بتكوين النمط العام والافتراضيات للتخطيط لمشروعك.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAssetManager}
            className="inline-flex items-center gap-2 rounded-lg border border-ds-border bg-ds-surface px-3 py-2 text-xs font-medium text-ds-text-primary transition-colors hover:bg-ds-surface-hover"
          >
            <Images size={14} />
            <span>{t('Open Assets', 'افتح الأصول')}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity ${
              saved ? 'bg-ds-success' : 'bg-ds-primary hover:opacity-90'
            }`}
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            <span>
              {saving
                ? t('Saving…', 'جاري الحفظ…')
                : saved
                  ? t('Saved', 'تم الحفظ')
                  : t('Save Template', 'حفظ القالب')}
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ds-border bg-ds-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-ds-text-primary">{t('Current Theme Snapshot', 'لقطة سريعة للقالب')}</h2>
            <p className="mt-1 text-xs text-ds-text-muted">
              {t('Use this quick summary before saving or switching between light and dark.', 'استعمل الملخص السريع ده قبل الحفظ أو التبديل بين الفاتح والغامق.')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full bg-ds-background px-2.5 py-1 text-ds-text-muted">{t('Profile', 'البروفايل')}: {selectedProfileName}</span>
            <span className="rounded-full bg-ds-background px-2.5 py-1 text-ds-text-muted">{t('Hero', 'الهيرو')}: {templateConfig.heroStyle}</span>
            <span className="rounded-full bg-ds-background px-2.5 py-1 text-ds-text-muted">{t('Forms', 'الفورمز')}: {templateConfig.formStyle}</span>
            <span className="rounded-full bg-ds-background px-2.5 py-1 text-ds-text-muted">{t('Header', 'الهيدر')}: {templateConfig.headerStyle}</span>
            <span className="rounded-full bg-ds-background px-2.5 py-1 text-ds-text-muted">{t('Footer', 'الفوتر')}: {templateConfig.footerStyle}</span>
          </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-2xl border border-ds-border bg-ds-surface p-4">
          <div>
            <h2 className="text-sm font-semibold text-ds-text-primary">{t('Header Structure', 'هيكل الهيدر')}</h2>
            <p className="mt-1 text-xs text-ds-text-muted">
              {t('Choose logo position, menu position, and the extra items you want in the header.', 'اختار مكان اللوجو والقائمة والإضافات اللي تحب تظهر في الهيدر.')}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Main Menu Mode', 'شكل القائمة الأساسية')}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'topbar', labelEn: 'Top Bar', labelAr: 'شريط علوي', descEn: 'Classic header navigation', descAr: 'تنقل كلاسيكي في الهيدر' },
                { value: 'sidebar', labelEn: 'Side Panel', labelAr: 'شريط جانبي', descEn: 'Main menu lives in a side panel', descAr: 'القائمة الأساسية تبقى في سايد بار' },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => updateTemplateConfig({ headerMenuMode: option.value as 'topbar' | 'sidebar' })}
                  className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                    templateConfig.headerMenuMode === option.value
                      ? 'border-ds-primary bg-ds-primary/8'
                      : 'border-ds-border hover:border-ds-border-hover'
                  }`}
                >
                  <div className="text-xs font-semibold text-ds-text-primary">{t(option.labelEn, option.labelAr)}</div>
                  <div className="mt-1 text-[11px] text-ds-text-muted">{t(option.descEn, option.descAr)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Logo Position', 'مكان اللوجو')}</label>
              <div className="grid grid-cols-3 gap-2">
                {positionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateTemplateConfig({ headerLogoPosition: option.value as 'left' | 'center' | 'right' })}
                    className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
                      templateConfig.headerLogoPosition === option.value
                        ? 'border-ds-primary bg-ds-primary/10 text-ds-primary'
                        : 'border-ds-border text-ds-text-muted'
                    }`}
                  >
                    {t(option.labelEn, option.labelAr)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Menu Position', 'مكان القائمة')}</label>
              <div className="grid grid-cols-3 gap-2">
                {positionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateTemplateConfig({ headerMenuPosition: option.value as 'left' | 'center' | 'right' })}
                    className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
                      templateConfig.headerMenuPosition === option.value
                        ? 'border-ds-primary bg-ds-primary/10 text-ds-primary'
                        : 'border-ds-border text-ds-text-muted'
                    }`}
                  >
                    {t(option.labelEn, option.labelAr)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Header Extras', 'إضافات الهيدر')}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ToggleCard
                active={templateConfig.headerShowCta}
                label={t('CTA Button', 'زرار CTA')}
                description={t('Show a strong call-to-action button.', 'أظهر زرار رئيسي واضح للتحويل.')}
                icon={<Sparkles size={14} />}
                onClick={() => updateTemplateConfig({ headerShowCta: !templateConfig.headerShowCta })}
              />
              <ToggleCard
                active={templateConfig.headerShowSocials}
                label={t('Social Icons', 'أيقونات السوشيال')}
                description={t('Add quick social links inside the header.', 'أضف روابط سوشيال سريعة داخل الهيدر.')}
                icon={<Share2 size={14} />}
                onClick={() => updateTemplateConfig({ headerShowSocials: !templateConfig.headerShowSocials })}
              />
              <ToggleCard
                active={templateConfig.headerShowPhone}
                label={t('Phone Number', 'رقم التليفون')}
                description={t('Keep a direct phone contact in the header.', 'أظهر وسيلة تواصل مباشرة في الهيدر.')}
                icon={<Phone size={14} />}
                onClick={() => updateTemplateConfig({ headerShowPhone: !templateConfig.headerShowPhone })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-ds-border bg-ds-surface p-4">
          <div>
            <h2 className="text-sm font-semibold text-ds-text-primary">{t('Footer Structure', 'هيكل الفوتر')}</h2>
            <p className="mt-1 text-xs text-ds-text-muted">
              {t('Choose a simple footer or a big multi-column footer, then tune the content blocks.', 'اختار فوتر بسيط أو فوتر كبير متعدد الأعمدة، وبعدها ظبط المحتوى.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'simple', labelEn: 'Simple Footer', labelAr: 'فوتر بسيط', descEn: 'Single row with copyright and a few actions.', descAr: 'صف واحد بحقوق وروابط خفيفة.' },
              { value: 'big', labelEn: 'Big Footer', labelAr: 'فوتر كبير', descEn: 'Navigation-heavy footer with 3 to 5 columns.', descAr: 'فوتر كبير بروابط كثيرة من 3 إلى 5 أعمدة.' },
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => updateTemplateConfig({ footerStyle: option.value })}
                className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                  templateConfig.footerStyle === option.value
                    ? 'border-ds-primary bg-ds-primary/8'
                    : 'border-ds-border hover:border-ds-border-hover'
                }`}
              >
                <div className="text-xs font-semibold text-ds-text-primary">{t(option.labelEn, option.labelAr)}</div>
                <div className="mt-1 text-[11px] text-ds-text-muted">{t(option.descEn, option.descAr)}</div>
              </div>
            ))}
          </div>

          {templateConfig.footerStyle === 'big' && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Footer Columns', 'عدد أعمدة الفوتر')}</label>
              <div className="grid grid-cols-3 gap-2">
                {footerColumnOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateTemplateConfig({ footerColumns: option.value as 3 | 4 | 5 })}
                    className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
                      templateConfig.footerColumns === option.value
                        ? 'border-ds-primary bg-ds-primary/10 text-ds-primary'
                        : 'border-ds-border text-ds-text-muted'
                    }`}
                  >
                    {t(option.labelEn, option.labelAr)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ToggleCard
              active={templateConfig.footerShowSocials}
              label={t('Footer Socials', 'سوشيال الفوتر')}
              description={t('Show social icons in the footer area.', 'أظهر أيقونات السوشيال في الفوتر.')}
              icon={<Share2 size={14} />}
              onClick={() => updateTemplateConfig({ footerShowSocials: !templateConfig.footerShowSocials })}
            />
            <ToggleCard
              active={templateConfig.footerShowPhone}
              label={t('Footer Phone', 'تليفون في الفوتر')}
              description={t('Add a direct phone/contact line in the footer.', 'أضف رقم مباشر أو خط تواصل في الفوتر.')}
              icon={<Phone size={14} />}
              onClick={() => updateTemplateConfig({ footerShowPhone: !templateConfig.footerShowPhone })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
