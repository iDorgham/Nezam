import React from 'react'

// ── Font options with actual stack values ────────────────────────────────────
export const fontOptions = [
  { value: 'inter',     label: 'Inter',           stack: '"Inter", system-ui, sans-serif',           specimen: 'The quick brown fox jumps over the lazy dog.' },
  { value: 'outfit',    label: 'Outfit',           stack: '"Outfit", "Inter", sans-serif',            specimen: 'Optimized typography for modern landing pages.' },
  { value: 'geist',     label: 'Geist',            stack: '"Geist", "Inter", sans-serif',             specimen: 'Sleek geometric design language & aesthetics.' },
  { value: 'plus',      label: 'Plus Jakarta',     stack: '"Plus Jakarta Sans", sans-serif',          specimen: 'Vibrant layout typography with balanced weight.' },
  { value: 'dm',        label: 'DM Sans',          stack: '"DM Sans", sans-serif',                    specimen: 'Clean and highly readable body font.' },
  { value: 'playfair',  label: 'Playfair Display', stack: '"Playfair Display", Georgia, serif',       specimen: 'Classic luxury editorial serif header.' },
  { value: 'lora',      label: 'Lora',             stack: '"Lora", Georgia, serif',                   specimen: 'Warm contemporary body text serif.' },
  { value: 'mono',      label: 'JetBrains Mono',   stack: '"JetBrains Mono", monospace',              specimen: 'Egypt Cairo latency speed: 14.05ms.' },
  { value: 'cabinet',   label: 'Cabinet Grotesk',  stack: '"Cabinet Grotesk", "Outfit", sans-serif',  specimen: 'Bold, expressive premium branding.' },
  { value: 'space',     label: 'Space Grotesk',    stack: '"Space Grotesk", system-ui, sans-serif',   specimen: 'High tech geometric accent.' },
  { value: 'cairo',     label: 'Cairo (EG)',       stack: '"Cairo", sans-serif',                      specimen: 'أنظمة تصميم مبتكرة لتمكين الشركات الرقمية.' },
  { value: 'tajawal',   label: 'Tajawal (EG)',     stack: '"Tajawal", sans-serif',                    specimen: 'نص عربي متناسق يناسب جميع أحجام الشاشات.' },
  { value: 'amiri',     label: 'Amiri (Classic)',  stack: '"Amiri", serif',                           specimen: 'تراث خط النسخ العربي الكلاسيكي الأصيل.' },
  { value: 'reem',      label: 'Reem Kufi',        stack: '"Reem Kufi", sans-serif',                  specimen: 'هوية بصرية معاصرة مستوحاة من الخط الكوفي الهندسي.' },
  { value: 'alexandria',label: 'Alexandria',       stack: '"Alexandria", sans-serif',                 specimen: 'حروف هندسية مصممة للواجهات الرقمية الحديثة.' },
  { value: 'elmessiri', label: 'El Messiri (EG)',  stack: '"El Messiri", sans-serif',                 specimen: 'تطوير حلول برمجية ذكية للمستقبل الرقمي المصري.' },
  { value: 'marhey',    label: 'Marhey (Playful)', stack: '"Marhey", sans-serif',                    specimen: 'مظهر حيوي وممتع يضفي طابعاً مصرياً أصيلاً.' },
  { value: 'lalezar',   label: 'Lalezar (Retro)',  stack: '"Lalezar", sans-serif',                    specimen: 'هوية مستوحاة من السينما المصرية الكلاسيكية.' },
  { value: 'ibmplexarabic', label: 'IBM Plex Arabic', stack: '"IBM Plex Sans Arabic", sans-serif',    specimen: 'خط تقني متكامل ملائم للمنصات الرقمية المعاصرة.' },
  { value: 'mada',      label: 'Mada (Tech)',      stack: '"Mada", sans-serif',                       specimen: 'خط ناصع ومقروء بوضوح في أحجام الشاشات الصغيرة.' },
  { value: 'harmattan', label: 'Harmattan',        stack: '"Harmattan", sans-serif',                  specimen: 'طابع دافئ مستوحى من بلاد النوبة والنيل.' },
  { value: 'syne',      label: 'Syne (Art)',       stack: '"Syne", sans-serif',                       specimen: 'Highly aesthetic artistic typeface.' },
  { value: 'clash',     label: 'Clash Display',    stack: '"Clash Display", sans-serif',              specimen: 'High-contrast branding display sans.' },
]

// ── Color palette options ────────────────────────────────────────────────────
export const colorPaletteOptions = [
  { value: 'orange',   label: 'Sahel Orange',    primary: '#F97316', bg: '#09090B', surface: '#18181B' },
  { value: 'cyan',     label: 'Electric Cyan',   primary: '#06B6D4', bg: '#09090B', surface: '#18181B' },
  { value: 'violet',   label: 'Deep Violet',     primary: '#8B5CF6', bg: '#0A0614', surface: '#1A1126' },
  { value: 'emerald',  label: 'Sahel Green',     primary: '#10B981', bg: '#031209', surface: '#0D2218' },
  { value: 'rose',     label: 'Desert Rose',     primary: '#F43F5E', bg: '#0D0407', surface: '#1E0A12' },
  { value: 'amber',    label: 'Golden Amber',    primary: '#F59E0B', bg: '#0C0900', surface: '#1C1600' },
  { value: 'slate',    label: 'Neutral Slate',   primary: '#94A3B8', bg: '#020617', surface: '#0F172A' },
  { value: 'white',    label: 'Light Mode',      primary: '#F97316', bg: '#FFFFFF', surface: '#F8FAFC' },
  { value: 'indigo',   label: 'Nile Indigo',     primary: '#6366F1', bg: '#02021A', surface: '#0A0A2E' },
  { value: 'fuchsia',  label: 'Urban Fuchsia',   primary: '#D946EF', bg: '#0E020F', surface: '#1A0620' },
  { value: 'teal',     label: 'Coastal Teal',    primary: '#14B8A6', bg: '#001A18', surface: '#052E2A' },
  { value: 'lime',     label: 'Fresh Lime',      primary: '#84CC16', bg: '#060A00', surface: '#0F1800' },
]

// ── Button style options ─────────────────────────────────────────────────────
export const buttonStyleOptions = [
  { value: 'solid',   label: 'Solid Fill',  desc: 'Filled background, high contrast' },
  { value: 'outline', label: 'Outlined',    desc: 'Border only, transparent bg' },
  { value: 'ghost',   label: 'Ghost',       desc: 'No border, subtle hover bg' },
  { value: 'soft',    label: 'Soft Tint',   desc: 'Light tinted background' },
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
  { value: 'outlined',  label: 'Outlined',  desc: 'Full border around input' },
  { value: 'underline', label: 'Underline', desc: 'Bottom border only' },
  { value: 'filled',    label: 'Filled',    desc: 'Filled background, no border' },
  { value: 'soft',      label: 'Soft',      desc: 'Soft fill with subtle border' },
]

// ── Input size options ───────────────────────────────────────────────────────
export const inputSizeOptions = [
  { value: 'sm', label: 'Small',  py: 'py-1' },
  { value: 'md', label: 'Medium', py: 'py-2' },
  { value: 'lg', label: 'Large',  py: 'py-3' },
]

// ── Header / nav ─────────────────────────────────────────────────────────────
export const headerStyleOptions = [
  { value: 'minimal', label: 'Minimal',   desc: 'Logo + nav links + CTA' },
  { value: 'classic', label: 'Classic',   desc: 'Full-width bar with extras' },
  { value: 'mega',    label: 'Mega Menu', desc: 'Dropdown with rich columns' },
  { value: 'sidebar', label: 'Sidebar',   desc: 'Left-side vertical nav' },
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
  { value: 'centered', label: 'Centered',       desc: 'Headline & CTA in the middle' },
  { value: 'split',    label: 'Split Screen',   desc: 'Text left, visual right' },
  { value: 'video',    label: 'Video Backdrop', desc: 'Fullscreen video/ambient bg' },
  { value: 'showcase', label: 'Product Showcase', desc: 'Large image hero with overlays' },
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
  { value: 'orange', label: 'Brand', bg: '#F97316', text: '#fff' },
  { value: 'slate',  label: 'Dark',  bg: '#0F172A', text: '#CBD5E1' },
  { value: 'cyan',   label: 'Cyan',  bg: '#06B6D4', text: '#fff' },
  { value: 'violet', label: 'Violet',bg: '#7C3AED', text: '#fff' },
]

// ── Animation / Motion ────────────────────────────────────────────────────────
export const animationOptions = [
  { value: 'none',          label: 'None',          desc: 'No entrance animations' },
  { value: 'fade',          label: 'Fade In',       desc: 'Elements fade in on load' },
  { value: 'slide',         label: 'Slide Up',      desc: 'Sections slide up from below' },
  { value: 'spring',        label: 'Spring',        desc: 'Bouncy spring-based motion' },
  { value: 'zoom',          label: 'Zoom In',       desc: 'Smooth zoom scaling entrance' },
  { value: 'bounce',        label: 'Bounce',        desc: 'Elastic drop down bounce' },
  { value: 'pulse',         label: 'Pulse (Loop)',  desc: 'Pulsing ambient focus glow' },
  { value: 'float',         label: 'Float (Loop)',  desc: 'Subtle vertical floating' },
  { value: 'glitch',        label: 'Cyber Glitch',  desc: 'Vibrant futuristic text noise' },
  { value: 'reveal-left',   label: 'Reveal Left',   desc: 'Slide and reveal from the left' },
  { value: 'reveal-right',  label: 'Reveal Right',  desc: 'Slide and reveal from the right' },
  { value: 'flip-3d',       label: '3D Card Flip',  desc: 'Spectacular 3D spin on load' },
  { value: 'shimmer',       label: 'Shimmer Sweep', desc: 'Premium elegant sweeping metallic gradient shine' },
  { value: 'blur-reveal',   label: 'Blur Reveal',   desc: 'Cinematic deep blur to crisp focus entrance' },
  { value: 'cosmic-spin',   label: 'Cosmic Spin',   desc: 'Ultra-slow infinite backdrop rotation' },
  { value: 'elastic-boing', label: 'Elastic Boing', desc: 'Playful spring overshoot settlement on load' },
  { value: 'rgb-jitter',    label: 'RGB Cyber Jitter', desc: 'Futuristic hyper-fast RGB chromatic aberration split' },
  { value: 'slide-fade-left', label: 'Slide Fade Left', desc: 'Premium fade-in + slide-in from the left' },
  { value: 'slide-fade-right', label: 'Slide Fade Right', desc: 'Premium fade-in + slide-in from the right' },
]

export const transitionSpeedOptions = [
  { value: 'fast',   label: 'Fast',   ms: 150 },
  { value: 'normal', label: 'Normal', ms: 250 },
  { value: 'slow',   label: 'Slow',   ms: 400 },
]

// ── Industry preview types ────────────────────────────────────────────────────
export const websiteTypeOptions = [
  { value: 'saas',        label: 'SaaS Platform',     labelAr: 'منصة ساس',           emoji: '🚀', category: 'product' },
  { value: 'ecommerce',   label: 'E-Commerce',        labelAr: 'متجر إلكتروني',       emoji: '🛍️', category: 'commerce' },
  { value: 'agency',      label: 'Creative Agency',   labelAr: 'وكالة إبداعية',       emoji: '🎨', category: 'creative' },
  { value: 'realestate',  label: 'Real Estate',       labelAr: 'عقارات',              emoji: '🏡', category: 'service' },
  { value: 'portfolio',   label: 'Portfolio / CV',    labelAr: 'بورتفوليو',           emoji: '💼', category: 'creative' },
  { value: 'dashboard',   label: 'Admin Dashboard',   labelAr: 'لوحة تحكم',          emoji: '📊', category: 'product' },
  { value: 'ai',          label: 'AI Service',        labelAr: 'خدمة ذكاء اصطناعي',  emoji: '🤖', category: 'product' },
  { value: 'photography', label: 'Photographer',      labelAr: 'مصور فوتوغرافي',     emoji: '📷', category: 'creative' },
  { value: 'news',        label: 'News / Magazine',   labelAr: 'أخبار ومجلة',         emoji: '📰', category: 'media' },
  { value: 'restaurant',  label: 'Restaurant / Food', labelAr: 'مطعم وطعام',          emoji: '🍽️', category: 'service' },
  { value: 'startup',     label: 'Startup / Landing', labelAr: 'ستارت أب',            emoji: '⚡', category: 'product' },
  { value: 'marketing',   label: 'Marketing Website', labelAr: 'موقع تسويقي',         emoji: '📣', category: 'commerce' },
]

// ── Types ─────────────────────────────────────────────────────────────────────
export type WebsiteType  = 'saas' | 'ecommerce' | 'agency' | 'realestate' | 'portfolio' | 'dashboard' | 'ai' | 'photography' | 'news' | 'restaurant' | 'startup' | 'marketing'
export type RadiusScale  = 'none' | 'sm' | 'md' | 'lg' | 'full'
export type TopBarTheme  = 'orange' | 'slate' | 'cyan' | 'violet'
export type ButtonStyle  = 'solid' | 'outline' | 'ghost' | 'soft'
export type InputVariant = 'outlined' | 'underline' | 'filled' | 'soft'
export type FontValue    = 'inter' | 'outfit' | 'geist' | 'plus' | 'dm' | 'playfair' | 'lora' | 'mono' | 'cabinet' | 'space' | 'cairo' | 'tajawal' | 'amiri' | 'reem' | 'alexandria' | 'elmessiri' | 'marhey' | 'lalezar' | 'ibmplexarabic' | 'mada' | 'harmattan' | 'syne' | 'clash'
export type ColorPalette = 'orange' | 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate' | 'white' | 'indigo' | 'fuchsia' | 'teal' | 'lime'
export type AnimationStyle = 'none' | 'fade' | 'slide' | 'spring' | 'zoom' | 'bounce' | 'pulse' | 'float' | 'glitch' | 'reveal-left' | 'reveal-right' | 'flip-3d' | 'shimmer' | 'blur-reveal' | 'cosmic-spin' | 'elastic-boing' | 'rgb-jitter' | 'slide-fade-left' | 'slide-fade-right'
export type TransitionSpeed = 'fast' | 'normal' | 'slow'

export const radiusClassMap: Record<RadiusScale, string> = {
  none: 'rounded-none',
  sm:   'rounded',
  md:   'rounded-lg',
  lg:   'rounded-2xl',
  full: 'rounded-full',
}

// ── Palette → CSS variable values ─────────────────────────────────────────────
export const paletteTokens: Record<ColorPalette, { primary: string; bg: string; surface: string; surfaceElevated: string }> = {
  orange:  { primary: '#F97316', bg: '#09090B', surface: '#18181B', surfaceElevated: '#27272A' },
  cyan:    { primary: '#06B6D4', bg: '#09090B', surface: '#18181B', surfaceElevated: '#27272A' },
  violet:  { primary: '#8B5CF6', bg: '#0A0614', surface: '#1A1126', surfaceElevated: '#2D1B44' },
  emerald: { primary: '#10B981', bg: '#031209', surface: '#0D2218', surfaceElevated: '#14342A' },
  rose:    { primary: '#F43F5E', bg: '#0D0407', surface: '#1E0A12', surfaceElevated: '#2E0F1C' },
  amber:   { primary: '#F59E0B', bg: '#0C0900', surface: '#1C1600', surfaceElevated: '#2C2200' },
  slate:   { primary: '#94A3B8', bg: '#020617', surface: '#0F172A', surfaceElevated: '#1E293B' },
  white:   { primary: '#F97316', bg: '#FFFFFF', surface: '#F8FAFC', surfaceElevated: '#F1F5F9' },
  indigo:  { primary: '#6366F1', bg: '#02021A', surface: '#0A0A2E', surfaceElevated: '#12124A' },
  fuchsia: { primary: '#D946EF', bg: '#0E020F', surface: '#1A0620', surfaceElevated: '#2A0A34' },
  teal:    { primary: '#14B8A6', bg: '#001A18', surface: '#052E2A', surfaceElevated: '#084440' },
  lime:    { primary: '#84CC16', bg: '#060A00', surface: '#0F1800', surfaceElevated: '#192600' },
}

// ── Website content per type ──────────────────────────────────────────────────
export type ContentMap = {
  tag: string; tagAr: string
  title: string; titleAr: string
  desc: string; descAr: string
  cta: string; ctaAr: string
  announcement: string; announcementAr: string
  nav: string[]; navAr: string[]
  features: { icon: string; label: string; desc: string }[]
}

export const websiteContent: Record<WebsiteType, ContentMap> = {
  saas: {
    tag: 'Node Infrastructure Platform', tagAr: 'منصة العقد السحابية',
    title: 'Build Your Enterprise Design Studio', titleAr: 'أنشئ استوديو التصميم المؤسسي',
    desc: 'Pre-engineered UI patterns, automated preset syncing, and infinite visual workflow builder.', descAr: 'أنماط واجهات جاهزة ومزامنة آلية ولوحة عمل غير محدودة.',
    cta: 'Start Free Trial', ctaAr: 'ابدأ تجربتك مجاناً',
    announcement: 'New: AI-powered design token sync is now live — 14-day free trial', announcementAr: 'جديد: مزامنة رموز التصميم بالذكاء الاصطناعي — تجربة 14 يوم مجاناً',
    nav: ['Products', 'Solutions', 'Pricing', 'Docs'], navAr: ['المنتجات', 'الحلول', 'الأسعار', 'التوثيق'],
    features: [
      { icon: '⚡', label: 'AI Automation', desc: 'Intelligent workflow orchestration at scale' },
      { icon: '🔒', label: 'Enterprise Security', desc: 'SOC2-ready with end-to-end encryption' },
      { icon: '🌐', label: 'Global CDN', desc: 'Sub-50ms response times worldwide' },
    ],
  },
  ecommerce: {
    tag: 'Sahel Summer Collection', tagAr: 'مجموعة الساحل الصيفية',
    title: 'Organic Egyptian Cotton & Artisan Ceramics', titleAr: 'قطن مصري عضوي وخزف يدوي أصيل',
    desc: 'Premium curated products manufactured locally in Egypt. Fast delivery across Cairo and Sahel.', descAr: 'منتجات محلية فاخرة مع توصيل سريع للقاهرة والساحل.',
    cta: 'Shop Summer Catalog', ctaAr: 'تصفح الكتالوج الصيفي',
    announcement: 'FREE DELIVERY on orders above 1500 EGP — Cairo, Sahel & Giza', announcementAr: 'توصيل مجاني للطلبات فوق 1500 جنيه — القاهرة، الساحل، الجيزة',
    nav: ['Shop', 'Collections', 'Offers', 'Track Order'], navAr: ['تسوق', 'المجموعات', 'العروض', 'تتبع طلبك'],
    features: [
      { icon: '🚀', label: 'Fast Checkout', desc: 'One-click purchase with saved payment methods' },
      { icon: '📦', label: 'Inventory Sync', desc: 'Real-time stock tracking and alerts' },
      { icon: '🛡️', label: 'Buyer Protection', desc: '30-day no-questions return policy' },
    ],
  },
  agency: {
    tag: 'Cairo Creative Studio', tagAr: 'استوديو القاهرة الإبداعي',
    title: 'We Craft Premium Digital Identities', titleAr: 'نبني هويات رقمية استثنائية',
    desc: 'Blending Egyptian heritage with modern design systems to build state-of-the-art experiences.', descAr: 'نمزج التراث المصري بأنظمة تصميم حديثة لبناء تجارب استثنائية.',
    cta: 'View Our Portfolio', ctaAr: 'شاهد أعمالنا',
    announcement: 'Winner: Best Creative Agency in MENA 2026 — Sahel Design Awards', announcementAr: 'الفائز بجائزة أفضل وكالة إبداعية في الشرق الأوسط 2026',
    nav: ['Work', 'Services', 'About', 'Contact'], navAr: ['الأعمال', 'الخدمات', 'عن الوكالة', 'تواصل'],
    features: [
      { icon: '🎨', label: 'Brand Identity', desc: 'Full brand systems from strategy to execution' },
      { icon: '💻', label: 'Web Development', desc: 'High-performance Next.js & React applications' },
      { icon: '📈', label: 'Growth Marketing', desc: 'Data-driven campaigns that convert' },
    ],
  },
  realestate: {
    tag: 'North Coast Luxury Properties', tagAr: 'عقارات الساحل الشمالي الفاخرة',
    title: 'Find Your Sea-View Summer Residence', titleAr: 'اعثر على بيت مصيفك بإطلالة بحرية',
    desc: 'Hundreds of verified luxury chalets and villas on Sahel North Coast. Payment plans up to 8 years.', descAr: 'مئات الشاليهات والفيلات المعتمدة على الساحل. خطط سداد تصل لـ8 سنوات.',
    cta: 'Book Private Tour', ctaAr: 'احجز جولة للمعاينة',
    announcement: 'EXCLUSIVE: Beachfront chalets in Sidi Abd El Rahman from 7.5M EGP', announcementAr: 'حصري: شاليهات صف أول في سيدي عبد الرحمن من 7.5 مليون جنيه',
    nav: ['Buy', 'Rent', 'Projects', 'Agents'], navAr: ['شراء', 'إيجار', 'المشاريع', 'الوكلاء'],
    features: [
      { icon: '🏖️', label: 'Prime Locations', desc: 'Verified beachfront and sea-view units' },
      { icon: '💰', label: 'Flexible Plans', desc: 'Payment plans from 3 to 8 years' },
      { icon: '✅', label: 'Fully Vetted', desc: 'Legal documentation review included' },
    ],
  },
  portfolio: {
    tag: 'Creative & Product Designer', tagAr: 'مصمم إبداعي ومنتجات',
    title: 'Turning Complex Problems Into Elegant Products', titleAr: 'تحويل المشكلات المعقدة لتجارب أنيقة',
    desc: 'Product designer with 8 years crafting B2B SaaS, fintech, and e-commerce experiences.', descAr: 'مصمم منتجات بخبرة 8 سنوات في SaaS وفينتك والتجارة الإلكترونية.',
    cta: 'View Case Studies', ctaAr: 'شاهد الحالات الدراسية',
    announcement: 'Available for freelance projects — MENA & Europe', announcementAr: 'متاح للمشاريع المستقلة — الشرق الأوسط وأوروبا',
    nav: ['Work', 'About', 'Process', 'Contact'], navAr: ['الأعمال', 'من أنا', 'المنهجية', 'تواصل'],
    features: [
      { icon: '💼', label: 'Case Studies', desc: '15+ in-depth product design breakdowns' },
      { icon: '🔬', label: 'UX Research', desc: 'User interviews, A/B testing, usability audits' },
      { icon: '🖥️', label: 'Design Systems', desc: 'Scalable token-based component libraries' },
    ],
  },
  dashboard: {
    tag: 'Analytics & Operations Platform', tagAr: 'منصة التحليلات والعمليات',
    title: 'Real-Time Insights at Enterprise Scale', titleAr: 'رؤى فورية على نطاق المؤسسات',
    desc: 'Monitor KPIs, automate reports, and orchestrate multi-team workflows in one unified platform.', descAr: 'راقب المؤشرات وأتمت التقارير ونسّق فرق العمل في منصة واحدة.',
    cta: 'Open Dashboard', ctaAr: 'افتح لوحة التحكم',
    announcement: 'New: Swarm Team analytics now supports real-time streaming data', announcementAr: 'جديد: تحليلات الفريق تدعم الآن البيانات الحية',
    nav: ['Overview', 'Reports', 'Teams', 'Settings'], navAr: ['نظرة عامة', 'التقارير', 'الفرق', 'الإعدادات'],
    features: [
      { icon: '📊', label: 'Live Metrics', desc: 'Real-time KPI tracking with custom alerts' },
      { icon: '🤝', label: 'Team Views', desc: 'Per-team and role-based dashboards' },
      { icon: '🔄', label: 'Auto Reports', desc: 'Scheduled PDF/CSV export workflows' },
    ],
  },
  ai: {
    tag: 'AI-Powered Intelligence Layer', tagAr: 'طبقة ذكاء اصطناعي متقدمة',
    title: 'Deploy AI Agents That Actually Work', titleAr: 'نشر وكلاء ذكاء اصطناعي فعّالين',
    desc: 'Production-grade AI orchestration with built-in memory, tool use, and human-in-the-loop controls.', descAr: 'تنسيق ذكاء اصطناعي للإنتاج مع ذاكرة وأدوات وتحكم بشري.',
    cta: 'Start Building', ctaAr: 'ابدأ البناء',
    announcement: 'NEZAM AI: Multi-agent swarms now available for enterprise teams', announcementAr: 'NEZAM AI: أسراب متعددة الوكلاء متاحة الآن للفرق المؤسسية',
    nav: ['Features', 'Models', 'API', 'Pricing'], navAr: ['الميزات', 'النماذج', 'واجهة برمجية', 'الأسعار'],
    features: [
      { icon: '🤖', label: 'Swarm Teams', desc: 'Multi-agent orchestration with role assignment' },
      { icon: '🧠', label: 'Long Memory', desc: 'Persistent context across thousands of turns' },
      { icon: '🔌', label: 'Tool Use', desc: 'Connect to 500+ APIs and data sources' },
    ],
  },
  photography: {
    tag: 'Fine Art & Commercial Photography', tagAr: 'تصوير فني وتجاري',
    title: 'Light Is My Canvas, Moments My Medium', titleAr: 'الضوء لوحتي واللحظات وسيلتي',
    desc: 'Available for editorial, brand campaigns, and private commissions across Cairo, Sahel, and Dubai.', descAr: 'متاح للمشاريع التحريرية وحملات العلامات التجارية وسهرات البورتريه.',
    cta: 'Book a Session', ctaAr: 'احجز جلسة',
    announcement: 'Sahel Summer 2026 bookings open — limited slots', announcementAr: 'حجوزات صيف الساحل 2026 مفتوحة — مقاعد محدودة',
    nav: ['Gallery', 'Services', 'Behind Lens', 'Book'], navAr: ['المعرض', 'الخدمات', 'خلف الكاميرا', 'احجز'],
    features: [
      { icon: '📷', label: 'Editorial', desc: 'Magazine-quality lifestyle and portrait shoots' },
      { icon: '🎬', label: 'Brand Films', desc: 'Cinematic commercial video production' },
      { icon: '🏖️', label: 'Events', desc: 'Weddings, corporate, and private events' },
    ],
  },
  news: {
    tag: 'NEZAM Times — Cairo Edition', tagAr: 'نيظام تايمز — نسخة القاهرة',
    title: 'The Stories That Define Tomorrow', titleAr: 'القصص التي تصنع الغد',
    desc: 'Award-winning journalism covering MENA business, technology, and culture — in Arabic and English.', descAr: 'صحافة حائزة على جوائز تغطي أعمال وتكنولوجيا وثقافة الشرق الأوسط.',
    cta: 'Read Latest', ctaAr: 'اقرأ الأحدث',
    announcement: 'Subscribe to our weekly digest — free for the first 3 months', announcementAr: 'اشترك في نشرتنا الأسبوعية — مجاناً لأول 3 أشهر',
    nav: ['Top Stories', 'Business', 'Tech', 'Culture'], navAr: ['أبرز الأخبار', 'أعمال', 'تكنولوجيا', 'ثقافة'],
    features: [
      { icon: '📰', label: 'Breaking News', desc: '24/7 coverage across MENA markets' },
      { icon: '🎙️', label: 'Podcasts', desc: 'Weekly audio deep-dives from our editors' },
      { icon: '📧', label: 'Newsletters', desc: 'Curated morning and evening briefings' },
    ],
  },
  restaurant: {
    tag: 'Koshary El Tahrir — Cairo Original', tagAr: 'كشري التحرير — الأصل القاهري',
    title: 'A Taste That Transcends Generations', titleAr: 'طعم يتجاوز الأجيال',
    desc: 'Serving authentic Egyptian street food since 1960. Dine-in, delivery, and catering across Cairo.', descAr: 'نقدم الطعام المصري الأصيل منذ 1960. أكل وتوصيل وتموين في القاهرة.',
    cta: 'Order Online', ctaAr: 'اطلب أونلاين',
    announcement: 'NEW: Catering packages for 10 to 500 guests — book 48hrs in advance', announcementAr: 'جديد: حزم تموين لـ10 حتى 500 شخص — احجز قبل 48 ساعة',
    nav: ['Menu', 'Locations', 'Catering', 'Our Story'], navAr: ['القائمة', 'الفروع', 'التموين', 'قصتنا'],
    features: [
      { icon: '🍽️', label: 'Full Menu', desc: 'Traditional Egyptian recipes, unchanged for 60+ years' },
      { icon: '🛵', label: 'Fast Delivery', desc: 'Hot food delivered in under 30 minutes' },
      { icon: '🎉', label: 'Catering', desc: 'Corporate events, weddings, and private parties' },
    ],
  },
  startup: {
    tag: 'MENA\'s Fastest Growing Startup', tagAr: 'أسرع شركة ناشئة في الشرق الأوسط',
    title: 'We Are Reinventing How Businesses Scale', titleAr: 'نعيد اختراع طريقة نمو الأعمال',
    desc: 'From Cairo to the world — building the infrastructure layer for MENA\'s digital economy.', descAr: 'من القاهرة إلى العالم — نبني البنية التحتية للاقتصاد الرقمي في المنطقة.',
    cta: 'Join Waitlist', ctaAr: 'انضم لقائمة الانتظار',
    announcement: 'Seed round closed — $3.2M led by MENA Ventures. We\'re hiring.', announcementAr: 'جولة أولى مغلقة — 3.2 مليون دولار. نحن نوظّف.',
    nav: ['Product', 'Investors', 'Careers', 'Blog'], navAr: ['المنتج', 'المستثمرون', 'وظائف', 'المدونة'],
    features: [
      { icon: '⚡', label: 'Ship Fast', desc: 'From idea to production in under 2 weeks' },
      { icon: '🌍', label: 'MENA First', desc: 'Built for Arabic markets from day one' },
      { icon: '💸', label: 'Investor Ready', desc: 'Clear metrics, clean cap table, solid ARR' },
    ],
  },
  marketing: {
    tag: 'Digital Growth & Performance', tagAr: 'النمو الرقمي والأداء',
    title: 'We Scale Brands Across MENA Markets', titleAr: 'نوسّع العلامات التجارية عبر أسواق الشرق الأوسط',
    desc: 'Full-funnel digital marketing: paid, organic, social, email, and conversion rate optimization.', descAr: 'تسويق رقمي متكامل: مدفوع، عضوي، اجتماعي، بريد إلكتروني وتحسين معدل التحويل.',
    cta: 'Get Free Audit', ctaAr: 'احصل على تدقيق مجاني',
    announcement: '2026 Q1 Benchmark Report is live — 500+ brands analyzed', announcementAr: 'تقرير المقارنة لربع 2026 الأول متاح الآن — تحليل 500+ علامة',
    nav: ['Services', 'Case Studies', 'Pricing', 'Blog'], navAr: ['الخدمات', 'حالات دراسية', 'الأسعار', 'المدونة'],
    features: [
      { icon: '📣', label: 'Paid Ads', desc: 'Google, Meta, TikTok campaigns that convert' },
      { icon: '🔍', label: 'SEO & Content', desc: 'Rank on Arabic and English search results' },
      { icon: '📈', label: 'CRO', desc: 'Data-backed landing page optimization' },
    ],
  },
}
