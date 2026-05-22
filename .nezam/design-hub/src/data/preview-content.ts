import type { SitemapNode } from '@/types'

/** Bilingual demo copy rendered in the live preview. */
export const COPY = {
  brandName: { en: 'Nezam', ar: 'نظام' },
  navItems: {
    en: ['Overview', 'Projects', 'Insights', 'Team'],
    ar: ['نظرة عامة', 'المشاريع', 'التحليلات', 'الفريق'],
  },
  heroTitle: {
    en: 'Design systems that feel inevitable.',
    ar: 'أنظمة تصميم تبدو وكأنها قُدِّر لها أن تكون.',
  },
  heroBody: {
    en: 'Compose tokens, preview every state, and ship a contract your team can trust.',
    ar: 'صمّم الرموز، عاين كل حالة، وسلّم عقداً يثق به فريقك بالكامل.',
  },
  primaryCta: { en: 'Start designing', ar: 'ابدأ التصميم' },
  ghostCta: { en: 'View docs', ar: 'استعرض التوثيق' },
  stats: {
    en: [
      { label: 'Active tokens', value: '128' },
      { label: 'Components', value: '46' },
      { label: 'Contrast pass', value: '100%' },
    ],
    ar: [
      { label: 'الرموز النشطة', value: '١٢٨' },
      { label: 'المكوّنات', value: '٤٦' },
      { label: 'نجاح التباين', value: '٪١٠٠' },
    ],
  },
  cards: {
    en: [
      { title: 'Token Studio', body: 'Every color, radius, and shadow in one calm surface.' },
      { title: 'Live Preview', body: 'See changes land the instant you make them.' },
      { title: 'Motion Lab', body: 'Author timelines, then export production GSAP.' },
    ],
    ar: [
      { title: 'استوديو الرموز', body: 'كل لون ونصف قطر وظل في سطح واحد هادئ.' },
      { title: 'معاينة حية', body: 'شاهد التغييرات تظهر في اللحظة التي تصنعها.' },
      { title: 'مختبر الحركة', body: 'صمّم المخطط الزمني ثم صدّره كود GSAP جاهز.' },
    ],
  },
  badge: { en: 'New', ar: 'جديد' },
  inputLabel: { en: 'Project name', ar: 'اسم المشروع' },
  inputPlaceholder: { en: 'Acme design system', ar: 'نظام تصميم أكمي' },
  arabicSample: {
    title: 'الخط العربي يستحق عناية استثنائية',
    body: 'النصّ العربي يتنفّس بمساحات أوسع وارتفاع أسطر أكرم. هنا نعرض كيف تنساب الحروف حين تُمنح الإيقاع الصحيح والاتجاه السليم من اليمين إلى اليسار.',
    caption: 'عيّنة طباعة — وزن متوسط، ارتفاع سطر ١٫٧',
  },
  chartLabel: { en: 'Weekly activity', ar: 'النشاط الأسبوعي' },
}

/** Demo chart series — purely decorative. */
export const CHART_SERIES = [42, 58, 36, 71, 64, 88, 76]

/** Default project sitemap shown in the left panel. */
export const SITEMAP: SitemapNode[] = [
  {
    id: 'home',
    name: 'Home',
    arabicName: 'الرئيسية',
    children: [
      { id: 'hero', name: 'Hero', arabicName: 'الواجهة' },
      { id: 'features', name: 'Features', arabicName: 'المزايا' },
      { id: 'pricing', name: 'Pricing', arabicName: 'الأسعار' },
    ],
  },
  {
    id: 'app',
    name: 'Workspace',
    arabicName: 'مساحة العمل',
    children: [
      { id: 'dashboard', name: 'Dashboard', arabicName: 'لوحة التحكم' },
      { id: 'projects', name: 'Projects', arabicName: 'المشاريع' },
      { id: 'settings', name: 'Settings', arabicName: 'الإعدادات' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    arabicName: 'التسويق',
    children: [
      { id: 'blog', name: 'Blog', arabicName: 'المدونة' },
      { id: 'about', name: 'About', arabicName: 'من نحن' },
    ],
  },
]
