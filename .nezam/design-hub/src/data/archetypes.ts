import type { Archetype, ArchetypeKind, Block, BlockKind, SitemapNode } from '@/types'

/**
 * Project archetypes. Each defines an ordered set of section blocks and a
 * sitemap. Picking an archetype reshapes the live preview.
 */

const LABELS: Record<BlockKind, { en: string; ar: string }> = {
  nav: { en: 'Navigation', ar: 'الشريط' },
  hero: { en: 'Hero', ar: 'الواجهة' },
  featureGrid: { en: 'Feature grid', ar: 'شبكة المزايا' },
  stats: { en: 'Stats', ar: 'الإحصائيات' },
  productGrid: { en: 'Product grid', ar: 'شبكة المنتجات' },
  articleList: { en: 'Article list', ar: 'قائمة المقالات' },
  pricing: { en: 'Pricing', ar: 'الأسعار' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  vendorGrid: { en: 'Vendors', ar: 'البائعون' },
  cta: { en: 'Call to action', ar: 'دعوة لإجراء' },
  footer: { en: 'Footer', ar: 'التذييل' },
  arabic: { en: 'Arabic type', ar: 'الخط العربي' },
  text: { en: 'Heading', ar: 'عنوان' },
  paragraph: { en: 'Paragraph', ar: 'فقرة' },
  image: { en: 'Image', ar: 'صورة' },
  icon: { en: 'Icon', ar: 'أيقونة' },
  section: { en: 'Section', ar: 'قسم' },
}

/** Default, kind-specific content for a block. */
export function defaultContent(kind: BlockKind): Record<string, unknown> {
  switch (kind) {
    case 'nav':
      return { brand: 'Nezam', links: ['Overview', 'Features', 'Pricing', 'Docs'], cta: 'Sign in' }
    case 'hero':
      return {
        badge: 'Now in beta',
        title: 'Design systems that feel inevitable.',
        subtitle:
          'Compose tokens, preview every state, and ship a contract your whole team can trust.',
        primary: 'Start designing',
        secondary: 'View docs',
      }
    case 'featureGrid':
      return {
        title: 'Everything in one calm surface',
        items: [
          { icon: 'layers', title: 'Token Studio', desc: 'Every colour, radius and shadow, unified.' },
          { icon: 'zap', title: 'Live Preview', desc: 'See changes land the instant you make them.' },
          { icon: 'play', title: 'Motion Lab', desc: 'Author timelines, export production GSAP.' },
        ],
      }
    case 'stats':
      return {
        items: [
          { value: '128', label: 'Active tokens' },
          { value: '46', label: 'Components' },
          { value: '100%', label: 'Contrast pass' },
        ],
      }
    case 'productGrid':
      return {
        title: 'Featured products',
        items: [
          { name: 'Aurora Lamp', price: '$148', tag: 'New' },
          { name: 'Quartz Chair', price: '$390', tag: '' },
          { name: 'Tidal Rug', price: '$210', tag: 'Sale' },
          { name: 'Ember Vase', price: '$64', tag: '' },
        ],
      }
    case 'articleList':
      return {
        title: 'Latest writing',
        items: [
          { title: 'Designing for trust at scale', excerpt: 'How systems earn confidence over time.', meta: '8 min · Design' },
          { title: 'The quiet power of constraints', excerpt: 'Why fewer choices ship better products.', meta: '5 min · Process' },
          { title: 'Tokens as a shared language', excerpt: 'Bridging design and engineering for good.', meta: '6 min · Systems' },
        ],
      }
    case 'pricing':
      return {
        title: 'Simple, honest pricing',
        tiers: [
          { name: 'Starter', price: '$0', features: ['1 project', 'Community support'], featured: false },
          { name: 'Pro', price: '$24', features: ['Unlimited projects', 'AI co-pilot', 'Priority support'], featured: true },
          { name: 'Team', price: '$80', features: ['Everything in Pro', 'Shared libraries', 'SSO'], featured: false },
        ],
      }
    case 'dashboard':
      return {
        title: 'Workspace overview',
        metrics: [
          { label: 'Revenue', value: '$48.2k', delta: '+12%' },
          { label: 'Active users', value: '3,910', delta: '+8%' },
          { label: 'Churn', value: '1.4%', delta: '-0.3%' },
        ],
        chart: [42, 58, 36, 71, 64, 88, 76],
      }
    case 'vendorGrid':
      return {
        title: 'Trusted vendors',
        items: [
          { name: 'Northwind Co.', category: 'Home', rating: '4.9' },
          { name: 'Saffron Studio', category: 'Apparel', rating: '4.7' },
          { name: 'Halcyon Goods', category: 'Lifestyle', rating: '4.8' },
        ],
      }
    case 'cta':
      return {
        title: 'Ready to ship something beautiful?',
        subtitle: 'Lock your design contract and let the team build with confidence.',
        button: 'Get started',
      }
    case 'footer':
      return {
        brand: 'Nezam',
        columns: [
          { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms'] },
        ],
      }
    case 'arabic':
      return {
        title: 'الخط العربي يستحق عناية استثنائية',
        body: 'النصّ العربي يتنفّس بمساحات أوسع وارتفاع أسطر أكرم. هنا نعرض كيف تنساب الحروف حين تُمنح الإيقاع الصحيح والاتجاه السليم من اليمين إلى اليسار.',
        caption: 'عيّنة طباعة — وزن متوسط، ارتفاع سطر ١٫٧',
      }
    case 'text':
      return { text: 'A bold new heading' }
    case 'paragraph':
      return {
        text: 'A fresh paragraph of body copy — double-click on the canvas to rewrite it in place.',
      }
    case 'image':
      return { caption: 'Image placeholder' }
    case 'icon':
      return { label: 'Icon block' }
    case 'section':
      return { label: 'Empty section' }
  }
}

const ARCHETYPE_BLOCKS: Record<ArchetypeKind, BlockKind[]> = {
  landing: ['nav', 'hero', 'stats', 'featureGrid', 'cta', 'footer'],
  saas: ['nav', 'hero', 'dashboard', 'featureGrid', 'pricing', 'cta', 'footer'],
  'micro-saas': ['nav', 'hero', 'featureGrid', 'pricing', 'footer'],
  'saas-xplatform': ['nav', 'hero', 'dashboard', 'featureGrid', 'cta', 'footer'],
  blog: ['nav', 'hero', 'articleList', 'footer'],
  cms: ['nav', 'hero', 'articleList', 'featureGrid', 'footer'],
  store: ['nav', 'hero', 'productGrid', 'cta', 'footer'],
  multivendor: ['nav', 'hero', 'vendorGrid', 'productGrid', 'footer'],
  portfolio: ['nav', 'hero', 'featureGrid', 'arabic', 'footer'],
  'dashboard-app': ['nav', 'dashboard', 'stats', 'footer'],
}

function page(id: string, name: string, arabicName: string, children?: SitemapNode[]): SitemapNode {
  return { id, name, arabicName, children }
}

const ARCHETYPE_PAGES: Record<ArchetypeKind, SitemapNode[]> = {
  landing: [
    page('home', 'Home', 'الرئيسية', [
      page('hero', 'Hero', 'الواجهة'),
      page('features', 'Features', 'المزايا'),
      page('cta', 'Call to action', 'دعوة'),
    ]),
    page('contact', 'Contact', 'تواصل'),
  ],
  saas: [
    page('marketing', 'Marketing', 'التسويق', [
      page('home', 'Home', 'الرئيسية'),
      page('pricing', 'Pricing', 'الأسعار'),
    ]),
    page('app', 'Application', 'التطبيق', [
      page('dashboard', 'Dashboard', 'لوحة التحكم'),
      page('settings', 'Settings', 'الإعدادات'),
    ]),
  ],
  'micro-saas': [
    page('home', 'Home', 'الرئيسية'),
    page('pricing', 'Pricing', 'الأسعار'),
    page('app', 'App', 'التطبيق'),
  ],
  'saas-xplatform': [
    page('web', 'Web app', 'تطبيق الويب'),
    page('mobile', 'Mobile app', 'تطبيق الجوال'),
    page('desktop', 'Desktop app', 'تطبيق سطح المكتب'),
  ],
  blog: [
    page('home', 'Home', 'الرئيسية'),
    page('posts', 'Posts', 'المقالات', [
      page('article', 'Article', 'مقال'),
      page('category', 'Category', 'تصنيف'),
    ]),
    page('about', 'About', 'من نحن'),
  ],
  cms: [
    page('site', 'Site', 'الموقع', [
      page('home', 'Home', 'الرئيسية'),
      page('pages', 'Pages', 'الصفحات'),
      page('articles', 'Articles', 'المقالات'),
    ]),
    page('admin', 'Admin', 'الإدارة'),
  ],
  store: [
    page('shop', 'Shop', 'المتجر', [
      page('home', 'Home', 'الرئيسية'),
      page('catalog', 'Catalog', 'الكتالوج'),
      page('product', 'Product', 'منتج'),
      page('cart', 'Cart', 'السلة'),
    ]),
    page('checkout', 'Checkout', 'الدفع'),
  ],
  multivendor: [
    page('market', 'Marketplace', 'السوق', [
      page('home', 'Home', 'الرئيسية'),
      page('vendors', 'Vendors', 'البائعون'),
      page('product', 'Product', 'منتج'),
    ]),
    page('account', 'Account', 'الحساب'),
  ],
  portfolio: [
    page('home', 'Home', 'الرئيسية'),
    page('work', 'Work', 'الأعمال'),
    page('about', 'About', 'نبذة'),
    page('contact', 'Contact', 'تواصل'),
  ],
  'dashboard-app': [
    page('dashboard', 'Dashboard', 'لوحة التحكم'),
    page('reports', 'Reports', 'التقارير'),
    page('team', 'Team', 'الفريق'),
    page('settings', 'Settings', 'الإعدادات'),
  ],
}

const ARCHETYPE_META: Record<ArchetypeKind, { name: string; arabicName: string; description: string }> = {
  landing: { name: 'Landing Page', arabicName: 'صفحة هبوط', description: 'A single focused marketing page.' },
  saas: { name: 'SaaS Platform', arabicName: 'منصة SaaS', description: 'Marketing + product dashboard.' },
  'micro-saas': { name: 'Micro-SaaS', arabicName: 'مايكرو SaaS', description: 'A lean, single-purpose product.' },
  'saas-xplatform': { name: 'SaaS Cross-platform', arabicName: 'SaaS متعدد المنصات', description: 'Web, mobile and desktop in one system.' },
  blog: { name: 'Blog', arabicName: 'مدونة', description: 'Editorial writing and articles.' },
  cms: { name: 'CMS', arabicName: 'نظام إدارة محتوى', description: 'Content-managed multi-page site.' },
  store: { name: 'Store', arabicName: 'متجر', description: 'A focused e-commerce storefront.' },
  multivendor: { name: 'Multi-vendor Store', arabicName: 'متجر متعدد البائعين', description: 'A marketplace of many sellers.' },
  portfolio: { name: 'Portfolio', arabicName: 'معرض أعمال', description: 'Showcase work with character.' },
  'dashboard-app': { name: 'Dashboard App', arabicName: 'تطبيق لوحة تحكم', description: 'A data-dense internal tool.' },
}

export const ARCHETYPES: Archetype[] = (Object.keys(ARCHETYPE_BLOCKS) as ArchetypeKind[]).map(
  (id) => ({
    id,
    ...ARCHETYPE_META[id],
    blocks: ARCHETYPE_BLOCKS[id],
    pages: ARCHETYPE_PAGES[id],
  }),
)

export const DEFAULT_ARCHETYPE_ID: ArchetypeKind = 'landing'

export function getArchetype(id: ArchetypeKind): Archetype {
  return ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0]
}

/** Build the ordered, content-filled block list for an archetype. */
export function buildBlocks(id: ArchetypeKind): Block[] {
  const archetype = getArchetype(id)
  const seen: Record<string, number> = {}
  return archetype.blocks.map((kind) => {
    const n = (seen[kind] = (seen[kind] ?? 0) + 1)
    const blockId = n > 1 ? `${kind}-${n}` : kind
    return {
      id: blockId,
      kind,
      label: LABELS[kind].en,
      arabicLabel: LABELS[kind].ar,
      content: defaultContent(kind),
    }
  })
}

/** A single new block, for left-toolbar inserts. */
export function makeBlock(kind: BlockKind, index: number): Block {
  return {
    id: `${kind}-${Date.now().toString(36)}-${index}`,
    kind,
    label: LABELS[kind].en,
    arabicLabel: LABELS[kind].ar,
    content: defaultContent(kind),
  }
}
