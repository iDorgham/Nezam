// Client-safe widget catalog mirroring the block registry categories.
// Used by the widget library panel — no fs access.

export interface WidgetDef {
  type:        string
  name:        string
  nameAr:      string
  category:    string
  description: string
  icon:        string
  defaultSize: { width: number; height: number }
}

export const WIDGET_CATEGORIES = [
  { id: 'navigation', label: 'Navigation', labelAr: 'التنقل',       icon: 'Menu' },
  { id: 'hero',       label: 'Hero',       labelAr: 'البطل',         icon: 'Layers' },
  { id: 'sections',   label: 'Sections',   labelAr: 'الأقسام',       icon: 'LayoutGrid' },
  { id: 'forms',      label: 'Forms',      labelAr: 'النماذج',       icon: 'FormInput' },
  { id: 'content',    label: 'Content',    labelAr: 'المحتوى',       icon: 'Type' },
  { id: 'footer',     label: 'Footer',     labelAr: 'التذييل',       icon: 'AlignBottom' },
] as const

export type WidgetCategory = typeof WIDGET_CATEGORIES[number]['id']

export const WIDGETS: WidgetDef[] = [
  // Navigation
  { type: 'Nav_TopBar',     name: 'Top Nav Bar',    nameAr: 'شريط التنقل العلوي', category: 'navigation', description: 'Horizontal nav with logo & CTA',  icon: 'Menu',          defaultSize: { width: 300, height: 60 } },
  { type: 'Nav_Sidebar',    name: 'Sidebar Nav',    nameAr: 'تنقل جانبي',          category: 'navigation', description: 'Collapsible vertical nav',        icon: 'PanelLeft',     defaultSize: { width: 200, height: 200 } },
  { type: 'Nav_BottomTab',  name: 'Bottom Tabs',    nameAr: 'تبويبات سفلية',        category: 'navigation', description: 'Mobile tab bar',                  icon: 'LayoutList',    defaultSize: { width: 320, height: 56 } },
  { type: 'Nav_Drawer',     name: 'Drawer Menu',    nameAr: 'قائمة منسدلة',         category: 'navigation', description: 'Slide-out drawer',                icon: 'SidebarOpen',   defaultSize: { width: 280, height: 400 } },
  // Hero
  { type: 'Hero_Simple',    name: 'Hero Simple',    nameAr: 'بطل بسيط',             category: 'hero',       description: 'Centered headline + CTA',         icon: 'Star',          defaultSize: { width: 400, height: 200 } },
  { type: 'Hero_Split',     name: 'Hero Split',     nameAr: 'بطل مقسّم',            category: 'hero',       description: 'Text left, image right',          icon: 'Columns2',      defaultSize: { width: 400, height: 220 } },
  { type: 'Hero_Video',     name: 'Hero Video',     nameAr: 'بطل فيديو',            category: 'hero',       description: 'Full-bleed video background',     icon: 'Video',         defaultSize: { width: 400, height: 240 } },
  { type: 'Hero_Form',      name: 'Hero + Form',    nameAr: 'بطل مع نموذج',         category: 'hero',       description: 'Headline with inline form',        icon: 'FormInput',     defaultSize: { width: 400, height: 220 } },
  // Sections
  { type: 'Section_Features',     name: 'Features Grid',    nameAr: 'شبكة المزايا',      category: 'sections', description: '3/4-col feature cards',         icon: 'LayoutGrid',   defaultSize: { width: 320, height: 180 } },
  { type: 'Section_Testimonials', name: 'Testimonials',     nameAr: 'آراء العملاء',       category: 'sections', description: 'Customer quote carousel',       icon: 'Quote',        defaultSize: { width: 320, height: 160 } },
  { type: 'Section_Pricing',      name: 'Pricing Table',    nameAr: 'جدول الأسعار',       category: 'sections', description: 'Tiered pricing cards',          icon: 'Tags',         defaultSize: { width: 320, height: 200 } },
  { type: 'Section_CTA',          name: 'CTA Banner',       nameAr: 'بانر الدعوة',        category: 'sections', description: 'Full-width call-to-action',     icon: 'Megaphone',    defaultSize: { width: 320, height: 120 } },
  { type: 'Section_Stats',        name: 'Stats Row',        nameAr: 'صف الإحصائيات',      category: 'sections', description: 'Key metric counters',           icon: 'BarChart2',    defaultSize: { width: 320, height: 100 } },
  { type: 'Section_Team',         name: 'Team Grid',        nameAr: 'شبكة الفريق',        category: 'sections', description: 'Team member cards',             icon: 'Users',        defaultSize: { width: 320, height: 180 } },
  // Forms
  { type: 'Form_Contact',  name: 'Contact Form',   nameAr: 'نموذج التواصل',        category: 'forms', description: 'Name, email, message fields',    icon: 'Mail',        defaultSize: { width: 280, height: 200 } },
  { type: 'Form_Login',    name: 'Login Form',     nameAr: 'نموذج الدخول',          category: 'forms', description: 'Email + password login',          icon: 'LogIn',       defaultSize: { width: 280, height: 180 } },
  { type: 'Form_Register', name: 'Register Form',  nameAr: 'نموذج التسجيل',         category: 'forms', description: 'Multi-field signup form',          icon: 'UserPlus',    defaultSize: { width: 280, height: 240 } },
  { type: 'Form_Search',   name: 'Search Bar',     nameAr: 'شريط البحث',            category: 'forms', description: 'Input + search button',            icon: 'Search',      defaultSize: { width: 280, height: 60 } },
  // Content
  { type: 'Content_Text',  name: 'Rich Text',      nameAr: 'نص غني',                category: 'content', description: 'Heading + body copy block',     icon: 'Type',        defaultSize: { width: 240, height: 120 } },
  { type: 'Content_Card',  name: 'Card',           nameAr: 'بطاقة',                 category: 'content', description: 'Image + title + description',   icon: 'Square',      defaultSize: { width: 200, height: 160 } },
  { type: 'Content_Grid',  name: 'Card Grid',      nameAr: 'شبكة البطاقات',          category: 'content', description: 'Responsive grid of cards',      icon: 'Grid2x2',     defaultSize: { width: 320, height: 200 } },
  { type: 'Content_Table', name: 'Data Table',     nameAr: 'جدول البيانات',           category: 'content', description: 'Sortable / filterable table',   icon: 'Table',       defaultSize: { width: 320, height: 200 } },
  // Footer
  { type: 'Footer_Simple',  name: 'Footer Simple',  nameAr: 'تذييل بسيط',            category: 'footer', description: 'Logo + links + copyright',      icon: 'AlignBottom', defaultSize: { width: 320, height: 120 } },
  { type: 'Footer_Columns', name: 'Footer Columns', nameAr: 'تذييل متعدد الأعمدة',   category: 'footer', description: 'Multi-column link grid',         icon: 'Columns3',    defaultSize: { width: 320, height: 180 } },
]

export function getWidgetsByCategory(cat: WidgetCategory): WidgetDef[] {
  return WIDGETS.filter((w) => w.category === cat)
}
