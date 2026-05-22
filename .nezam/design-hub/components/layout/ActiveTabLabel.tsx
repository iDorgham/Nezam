'use client'

import { useSessionStore } from '@/lib/store/session.store'

const LABEL_MAP: Record<string, { en: string; ar: string }> = {
  dashboard:       { en: 'Dashboard', ar: 'لوحة التحكم' },
  sitemap:         { en: 'Sitemap', ar: 'خريطة الموقع' },
  menus:           { en: 'Menus', ar: 'القوائم' },
  canvas:          { en: 'Canvas', ar: 'الكانفاس' },
  template:        { en: 'Template Builder', ar: 'باني القوالب' },
  wireframes:      { en: 'Wireframes', ar: 'هياكل العمل' },
  'layout-designer': { en: 'Layout Designer', ar: 'محرر الهيكل' },
  'theme-editor':  { en: 'Theme Editor', ar: 'محرر الألوان' },
  'asset-manager': { en: 'Asset Manager', ar: 'مدير الملفات' },
  'profile-editor': { en: 'Profile Editor', ar: 'محرر البروفايلات' },
  profiles:        { en: 'Design Profiles', ar: 'ملفات التصميم' },
  tokens:          { en: 'Token Studio', ar: 'استوديو التوكنز' },
  settings:        { en: 'Settings', ar: 'الإعدادات' },
  ai:              { en: 'AI Assistant', ar: 'مساعد الذكاء الاصطناعي' },
  export:          { en: 'Export', ar: 'تصدير' },
  review:          { en: 'Review', ar: 'مراجعة' },
}

export default function ActiveTabLabel() {
  const { activeTabId, lang } = useSessionStore()
  const data = activeTabId ? LABEL_MAP[activeTabId] : null
  const label = data ? (lang === 'ar' ? data.ar : data.en) : (lang === 'ar' ? 'سيرفر التصميم' : 'Design Server')

  return (
    <span className="text-ds-text-primary font-medium">{label}</span>
  )
}
