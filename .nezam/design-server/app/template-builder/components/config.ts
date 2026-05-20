import React from 'react'

// ── Font options with actual stack values ────────────────────────────────────
export const fontOptions = [
  { value: 'inter',     label: 'Inter',          stack: '"Inter", system-ui, sans-serif',           specimen: 'The quick brown fox' },
  { value: 'outfit',    label: 'Outfit',          stack: '"Outfit", "Inter", sans-serif',            specimen: 'The quick brown fox' },
  { value: 'geist',     label: 'Geist',           stack: '"Geist", "Inter", sans-serif',             specimen: 'The quick brown fox' },
  { value: 'plus',      label: 'Plus Jakarta',    stack: '"Plus Jakarta Sans", sans-serif',          specimen: 'The quick brown fox' },
  { value: 'dm',        label: 'DM Sans',         stack: '"DM Sans", sans-serif',                   specimen: 'The quick brown fox' },
  { value: 'playfair',  label: 'Playfair Display',stack: '"Playfair Display", Georgia, serif',      specimen: 'The quick brown fox' },
  { value: 'lora',      label: 'Lora',            stack: '"Lora", Georgia, serif',                  specimen: 'The quick brown fox' },
  { value: 'mono',      label: 'JetBrains Mono',  stack: '"JetBrains Mono", monospace',             specimen: 'The quick brown fox' },
]

// ── Color palette options ────────────────────────────────────────────────────
export const colorPaletteOptions = [
  { value: 'orange',   label: 'Sahel Orange',   primary: '#F97316', bg: '#09090B', surface: '#18181B' },
  { value: 'cyan',     label: 'Electric Cyan',  primary: '#06B6D4', bg: '#09090B', surface: '#18181B' },
  { value: 'violet',   label: 'Deep Violet',    primary: '#8B5CF6', bg: '#0A0614', surface: '#1A1126' },
  { value: 'emerald',  label: 'Sahel Green',    primary: '#10B981', bg: '#031209', surface: '#0D2218' },
  { value: 'rose',     label: 'Desert Rose',    primary: '#F43F5E', bg: '#0D0407', surface: '#1E0A12' },
  { value: 'amber',    label: 'Golden Amber',   primary: '#F59E0B', bg: '#0C0900', surface: '#1C1600' },
  { value: 'slate',    label: 'Neutral Slate',  primary: '#94A3B8', bg: '#020617', surface: '#0F172A' },
  { value: 'white',    label: 'Light Mode',     primary: '#F97316', bg: '#FFFFFF', surface: '#F8FAFC' },
]

// ── Button style options ─────────────────────────────────────────────────────
export const buttonStyleOptions = [
  { value: 'solid',    label: 'Solid Fill',   desc: 'Filled background, high contrast' },
  { value: 'outline',  label: 'Outlined',     desc: 'Border only, transparent bg' },
  { value: 'ghost',    label: 'Ghost',        desc: 'No border, subtle hover bg' },
  { value: 'soft',     label: 'Soft Tint',    desc: 'Light tinted background' },
]

// ── Button weight ────────────────────────────────────────────────────────────
export const buttonWeightOptions = [
  { value: 'normal',   label: 'Normal',   cls: 'font-normal' },
  { value: 'medium',   label: 'Medium',   cls: 'font-medium' },
  { value: 'semibold', label: 'Semibold', cls: 'font-semibold' },
  { value: 'bold',     label: 'Bold',     cls: 'font-bold' },
  { value: 'black',    label: 'Black',    cls: 'font-black' },
]

// ── Form input variant options ───────────────────────────────────────────────
export const inputVariantOptions = [
  { value: 'outlined',  label: 'Outlined',   desc: 'Full border around input' },
  { value: 'underline', label: 'Underline',  desc: 'Bottom border only' },
  { value: 'filled',    label: 'Filled',     desc: 'Filled background, no border' },
  { value: 'soft',      label: 'Soft',       desc: 'Soft fill with subtle border' },
]

// ── Input size options ───────────────────────────────────────────────────────
export const inputSizeOptions = [
  { value: 'sm',  label: 'Small',  py: 'py-1' },
  { value: 'md',  label: 'Medium', py: 'py-2' },
  { value: 'lg',  label: 'Large',  py: 'py-3' },
]

// ── Header / nav ─────────────────────────────────────────────────────────────
export const headerStyleOptions = [
  { value: 'minimal',  label: 'Minimal',   desc: 'Logo + nav links + CTA' },
  { value: 'classic',  label: 'Classic',   desc: 'Full-width bar with extras' },
  { value: 'mega',     label: 'Mega Menu', desc: 'Dropdown with rich columns' },
  { value: 'sidebar',  label: 'Sidebar',   desc: 'Left-side vertical nav' },
]

export const menuModeOptions = [
  { value: 'topbar',  label: 'Horizontal Bar' },
  { value: 'sidebar', label: 'Side Drawer' },
]

export const positionOptions = [
  { value: 'left',   label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right',  label: 'Right' },
]

// ── Footer ───────────────────────────────────────────────────────────────────
export const footerStyleOptions = [
  { value: 'simple', label: 'Simple Row',   desc: 'Single row — copyright & links' },
  { value: 'big',    label: 'Multi-Column', desc: '3–5 organized link columns' },
]

export const footerColumnOptions = [
  { value: 3, label: '3 Columns' },
  { value: 4, label: '4 Columns' },
  { value: 5, label: '5 Columns' },
]

// ── Hero layout ──────────────────────────────────────────────────────────────
export const heroStyleOptions = [
  { value: 'centered', label: 'Centered',      desc: 'Headline & CTA in the middle' },
  { value: 'split',    label: 'Split Screen',  desc: 'Text left, visual right' },
  { value: 'video',    label: 'Video Backdrop',desc: 'Fullscreen video/ambient bg' },
]

// ── Density ──────────────────────────────────────────────────────────────────
export const spacingOptions = [
  { value: 'compact',  label: 'Compact',  desc: 'Tight padding and gutters' },
  { value: 'balanced', label: 'Balanced', desc: 'Standard 8px grid spacing' },
  { value: 'spacious', label: 'Spacious', desc: 'Generous breathing room' },
]

// ── Border radius ─────────────────────────────────────────────────────────────
export const radiusOptions = [
  { value: 'none', label: 'None',   px: 0,   cls: 'rounded-none' },
  { value: 'sm',   label: 'Small',  px: 4,   cls: 'rounded' },
  { value: 'md',   label: 'Medium', px: 8,   cls: 'rounded-lg' },
  { value: 'lg',   label: 'Large',  px: 16,  cls: 'rounded-2xl' },
  { value: 'full', label: 'Pill',   px: 999, cls: 'rounded-full' },
]

// ── Top bar ───────────────────────────────────────────────────────────────────
export const topBarThemeOptions = [
  { value: 'orange', label: 'Brand',   bg: '#F97316', text: '#fff' },
  { value: 'slate',  label: 'Dark',    bg: '#0F172A', text: '#CBD5E1' },
  { value: 'cyan',   label: 'Cyan',    bg: '#06B6D4', text: '#fff' },
]

// ── Industry preview types ────────────────────────────────────────────────────
export const websiteTypeOptions = [
  { value: 'saas',       label: 'SaaS Platform',   labelAr: 'منصة ساس' },
  { value: 'ecommerce',  label: 'E-Commerce',      labelAr: 'متجر إلكتروني' },
  { value: 'agency',     label: 'Creative Agency', labelAr: 'وكالة إبداعية' },
  { value: 'realestate', label: 'Real Estate',     labelAr: 'عقارات' },
]

// ── Types ─────────────────────────────────────────────────────────────────────
export type WebsiteType  = 'saas' | 'ecommerce' | 'agency' | 'realestate'
export type RadiusScale  = 'none' | 'sm' | 'md' | 'lg' | 'full'
export type TopBarTheme  = 'orange' | 'slate' | 'cyan'
export type ButtonStyle  = 'solid' | 'outline' | 'ghost' | 'soft'
export type InputVariant = 'outlined' | 'underline' | 'filled' | 'soft'
export type FontValue    = 'inter' | 'outfit' | 'geist' | 'plus' | 'dm' | 'playfair' | 'lora' | 'mono'
export type ColorPalette = 'orange' | 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate' | 'white'

export const radiusClassMap: Record<RadiusScale, string> = {
  none: 'rounded-none',
  sm:   'rounded',
  md:   'rounded-lg',
  lg:   'rounded-2xl',
  full: 'rounded-full',
}

export type ContentMap = {
  tag: string; tagAr: string
  title: string; titleAr: string
  desc: string; descAr: string
  cta: string; ctaAr: string
  announcement: string; announcementAr: string
  nav: string[]; navAr: string[]
}

export const websiteContent: Record<WebsiteType, ContentMap> = {
  saas: {
    tag: 'Node Infrastructure Platform', tagAr: 'منصة العقد السحابية',
    title: 'Build Your Enterprise Design Studio', titleAr: 'أنشئ استوديو التصميم المؤسسي',
    desc: 'Pre-engineered UI patterns, automated preset syncing, and infinite visual workflow builder.', descAr: 'أنماط واجهات جاهزة ومزامنة آلية ولوحة عمل غير محدودة.',
    cta: 'Start Free Trial', ctaAr: 'ابدأ تجربتك مجاناً',
    announcement: 'New: AI-powered design token sync is now live — 14-day free trial', announcementAr: 'جديد: مزامنة رموز التصميم بالذكاء الاصطناعي — تجربة 14 يوم مجاناً',
    nav: ['Products', 'Solutions', 'Pricing', 'Docs'], navAr: ['المنتجات', 'الحلول', 'الأسعار', 'التوثيق'],
  },
  ecommerce: {
    tag: 'Sahel Summer Collection', tagAr: 'مجموعة الساحل الصيفية',
    title: 'Organic Egyptian Cotton & Artisan Ceramics', titleAr: 'قطن مصري عضوي وخزف يدوي أصيل',
    desc: 'Premium curated products manufactured locally in Egypt. Fast delivery across Cairo and Sahel.', descAr: 'منتجات محلية فاخرة مع توصيل سريع للقاهرة والساحل.',
    cta: 'Shop Summer Catalog', ctaAr: 'تصفح الكتالوج الصيفي',
    announcement: 'FREE DELIVERY on orders above 1500 EGP — Cairo, Sahel & Giza', announcementAr: 'توصيل مجاني للطلبات فوق 1500 جنيه — القاهرة، الساحل، الجيزة',
    nav: ['Shop', 'Collections', 'Offers', 'Track Order'], navAr: ['تسوق', 'المجموعات', 'العروض', 'تتبع طلبك'],
  },
  agency: {
    tag: 'Cairo Creative Studio', tagAr: 'استوديو القاهرة الإبداعي',
    title: 'We Craft Premium Digital Identities', titleAr: 'نبني هويات رقمية استثنائية',
    desc: 'Blending Egyptian heritage with modern design systems to build state-of-the-art experiences.', descAr: 'نمزج التراث المصري بأنظمة تصميم حديثة لبناء تجارب استثنائية.',
    cta: 'View Our Portfolio', ctaAr: 'شاهد أعمالنا',
    announcement: 'Winner: Best Creative Agency in MENA 2026 — Sahel Design Awards', announcementAr: 'الفائز بجائزة أفضل وكالة إبداعية في الشرق الأوسط 2026',
    nav: ['Work', 'Services', 'About', 'Contact'], navAr: ['الأعمال', 'الخدمات', 'عن الوكالة', 'تواصل'],
  },
  realestate: {
    tag: 'North Coast Luxury Properties', tagAr: 'عقارات الساحل الشمالي الفاخرة',
    title: 'Find Your Sea-View Summer Residence', titleAr: 'اعثر على بيت مصيفك بإطلالة بحرية',
    desc: 'Hundreds of verified luxury chalets and villas on Sahel North Coast. Payment plans up to 8 years.', descAr: 'مئات الشاليهات والفيلات المعتمدة على الساحل. خطط سداد تصل لـ8 سنوات.',
    cta: 'Book Private Tour', ctaAr: 'احجز جولة للمعاينة',
    announcement: 'EXCLUSIVE: Beachfront chalets in Sidi Abd El Rahman from 7.5M EGP', announcementAr: 'حصري: شاليهات صف أول في سيدي عبد الرحمن من 7.5 مليون جنيه',
    nav: ['Buy', 'Rent', 'Projects', 'Agents'], navAr: ['شراء', 'إيجار', 'المشاريع', 'الوكلاء'],
  },
}
