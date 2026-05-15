'use client'

import { useSessionStore } from '@/lib/store/session.store'

export default function SettingsPage() {
  const { lang, setLang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 text-ds-text-primary">
      <div>
        <h1 className="text-2xl font-semibold">{t('Settings', 'الإعدادات')}</h1>
        <p className="text-sm text-[#8a8f98]">{t('Manage your workspace preferences here.', 'إدارة تفضيلات مساحة العمل بتاعتك هنا.')}</p>
      </div>
      
      <div className="bg-ds-surface border border-ds-border rounded-xl p-6 space-y-6">
        {/* Language Setting */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">{t('Language', 'اللغة')}</h3>
            <p className="text-xs text-[#8a8f98]">{t('Select your preferred language.', 'اختر لغتك المفضلة.')}</p>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'en' | 'ar')}
            className="bg-ds-background border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-[#FF5701]/50"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Masri)</option>
          </select>
        </div>

        <div className="border-t border-ds-border pt-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">{t('Theme Mode', 'وضع السمة')}</h3>
            <p className="text-xs text-[#8a8f98]">{t('Toggle between light and dark mode.', 'بدل بين الوضع الفاتح والغامق.')}</p>
          </div>
          <div className="text-xs text-[#8a8f98]">
            {t('Controlled via header toggle.', 'بيتم التحكم فيها من فوق.')}
          </div>
        </div>
      </div>
    </div>
  )
}
