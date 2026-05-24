import type { Archetype, ArchetypeApp, ArchetypeKind, ArchetypeNavMenu, AppKind, Block, BlockKind, NavMenuKind, SitemapNode } from '@/types'

/**
 * Project archetypes. Each defines an ordered set of section blocks and a
 * 5-level sitemap: App → NavMenu → Page → Sub-page → Section.
 * Picking an archetype reshapes the live preview and the sitemap builder.
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

// ── Sitemap builder helpers ───────────────────────────────────────────────────

function page(
  id: string, name: string, arabicName: string,
  opts?: { children?: SitemapNode[]; sections?: string[] },
): SitemapNode {
  return { id, name, arabicName, children: opts?.children, sectionNames: opts?.sections }
}

function menu(
  name: string, arabicName: string, kind: NavMenuKind, pages: SitemapNode[],
): ArchetypeNavMenu {
  return { name, arabicName, kind, pages }
}

function app(
  name: string, arabicName: string, kind: AppKind, navMenus: ArchetypeNavMenu[],
): ArchetypeApp {
  return { name, arabicName, kind, navMenus }
}

// ── Archetype app definitions ─────────────────────────────────────────────────

const ARCHETYPE_APPS: Record<ArchetypeKind, ArchetypeApp[]> = {

  landing: [
    app('Marketing Site', 'الموقع التسويقي', 'marketing', [
      menu('Main Navigation', 'التنقل الرئيسي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Features', 'Stats', 'Call to action', 'Footer'],
        }),
        page('about', 'About', 'من نحن', {
          sections: ['About hero', 'Team', 'Values'],
        }),
        page('contact', 'Contact', 'تواصل', {
          sections: ['Contact form', 'Map', 'Footer'],
        }),
      ]),
      menu('Footer Links', 'روابط التذييل', 'footer', [
        page('legal', 'Legal', 'قانوني'),
        page('privacy', 'Privacy', 'الخصوصية'),
        page('help', 'Help', 'المساعدة'),
        page('support', 'Support', 'الدعم'),
      ]),
    ]),
  ],

  saas: [
    app('Marketing', 'التسويق', 'marketing', [
      menu('Main Navigation', 'التنقل الرئيسي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Features', 'Dashboard preview', 'Pricing', 'CTA'],
        }),
        page('pricing', 'Pricing', 'الأسعار', {
          sections: ['Pricing table', 'FAQ', 'CTA'],
        }),
        page('blog', 'Blog', 'المدونة', {
          sections: ['Article list', 'Featured'],
        }),
      ]),
      menu('Footer', 'التذييل', 'footer', [
        page('legal', 'Legal', 'قانوني'),
        page('privacy', 'Privacy', 'الخصوصية'),
        page('help', 'Help', 'المساعدة'),
        page('status', 'Status', 'الحالة'),
      ]),
    ]),
    app('Client Dashboard', 'لوحة العميل', 'dashboard-client', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('dashboard', 'Dashboard', 'لوحة التحكم', {
          sections: ['Overview', 'Charts', 'Recent activity'],
        }),
        page('projects', 'Projects', 'المشاريع', {
          sections: ['Project list', 'Filters'],
          children: [
            page('project-detail', 'Project Detail', 'تفاصيل المشروع', {
              sections: ['Project header', 'Tasks', 'Team'],
            }),
          ],
        }),
        page('reports', 'Reports', 'التقارير', {
          sections: ['Report list', 'Charts'],
        }),
        page('settings', 'Settings', 'الإعدادات', {
          sections: ['Profile', 'Billing', 'Security', 'Integrations'],
        }),
      ]),
      menu('User Menu', 'قائمة المستخدم', 'utility', [
        page('profile', 'Profile', 'الملف الشخصي'),
        page('billing', 'Billing', 'الفواتير'),
        page('notifications', 'Notifications', 'الإشعارات'),
      ]),
    ]),
    app('Admin Dashboard', 'لوحة الإدارة', 'dashboard-admin', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('users', 'Users', 'المستخدمون', {
          sections: ['User table', 'Filters', 'Bulk actions'],
        }),
        page('analytics', 'Analytics', 'التحليلات', {
          sections: ['KPIs', 'Charts', 'Export'],
        }),
        page('billing', 'Billing', 'الفواتير', {
          sections: ['Subscriptions', 'Invoices'],
        }),
        page('settings', 'Settings', 'الإعدادات'),
      ]),
    ]),
  ],

  'micro-saas': [
    app('Product', 'المنتج', 'marketing', [
      menu('Main Navigation', 'التنقل الرئيسي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Features', 'Pricing', 'CTA'],
        }),
        page('pricing', 'Pricing', 'الأسعار', {
          sections: ['Pricing table', 'FAQ'],
        }),
        page('app', 'App', 'التطبيق', {
          sections: ['Dashboard', 'Settings'],
        }),
      ]),
    ]),
  ],

  'saas-xplatform': [
    app('Web App', 'تطبيق الويب', 'marketing', [
      menu('Main Navigation', 'التنقل', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Dashboard preview', 'Features'],
        }),
        page('dashboard', 'Dashboard', 'لوحة التحكم', {
          sections: ['Overview', 'Charts'],
        }),
        page('settings', 'Settings', 'الإعدادات'),
      ]),
    ]),
    app('Mobile App', 'تطبيق الجوال', 'mobile', [
      menu('Bottom Navigation', 'التنقل السفلي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Feed', 'Quick actions'],
        }),
        page('explore', 'Explore', 'استكشاف', {
          sections: ['Search', 'Categories'],
        }),
        page('profile', 'Profile', 'الملف الشخصي', {
          sections: ['Profile header', 'Activity', 'Settings'],
        }),
      ]),
    ]),
    app('Desktop App', 'تطبيق سطح المكتب', 'desktop', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('dashboard', 'Dashboard', 'لوحة التحكم', {
          sections: ['Overview', 'Charts', 'Activity'],
        }),
        page('workspace', 'Workspace', 'مساحة العمل', {
          sections: ['Canvas', 'Toolbar'],
        }),
        page('settings', 'Settings', 'الإعدادات', {
          sections: ['General', 'Account', 'Shortcuts'],
        }),
      ]),
    ]),
  ],

  blog: [
    app('Blog', 'المدونة', 'marketing', [
      menu('Main Navigation', 'التنقل الرئيسي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Featured post', 'Article list'],
        }),
        page('posts', 'Posts', 'المقالات', {
          sections: ['Article list', 'Filters'],
          children: [
            page('article', 'Article', 'مقال', {
              sections: ['Article header', 'Body', 'Author bio', 'Related'],
            }),
            page('category', 'Category', 'تصنيف', {
              sections: ['Category header', 'Article list'],
            }),
          ],
        }),
        page('about', 'About', 'من نحن', {
          sections: ['Bio', 'Mission', 'Team'],
        }),
      ]),
      menu('Footer', 'التذييل', 'footer', [
        page('archive', 'Archive', 'الأرشيف'),
        page('tags', 'Tags', 'الوسوم'),
        page('rss', 'RSS', 'RSS'),
      ]),
    ]),
  ],

  cms: [
    app('Public Site', 'الموقع العام', 'marketing', [
      menu('Main Navigation', 'التنقل', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Hero', 'Content blocks', 'CTA'],
        }),
        page('pages', 'Pages', 'الصفحات'),
        page('articles', 'Articles', 'المقالات', {
          sections: ['Article list'],
          children: [
            page('article', 'Article', 'مقال', {
              sections: ['Article header', 'Body', 'Related'],
            }),
          ],
        }),
      ]),
    ]),
    app('Admin CMS', 'نظام الإدارة', 'dashboard-admin', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('dashboard', 'Dashboard', 'لوحة التحكم', {
          sections: ['Activity feed', 'Quick actions'],
        }),
        page('pages-editor', 'Pages', 'الصفحات', {
          sections: ['Page list', 'Editor', 'SEO settings'],
        }),
        page('media', 'Media', 'الوسائط', {
          sections: ['Media library', 'Upload', 'Tags'],
        }),
        page('users', 'Users', 'المستخدمون'),
        page('settings', 'Settings', 'الإعدادات'),
      ]),
    ]),
  ],

  store: [
    app('Store', 'المتجر', 'marketing', [
      menu('Main Navigation', 'التنقل', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Featured products', 'Categories', 'CTA'],
        }),
        page('catalog', 'Catalog', 'الكتالوج', {
          sections: ['Filters', 'Product grid', 'Pagination'],
          children: [
            page('product', 'Product', 'منتج', {
              sections: ['Product images', 'Details', 'Add to cart', 'Reviews', 'Related'],
            }),
          ],
        }),
        page('cart', 'Cart', 'السلة', {
          sections: ['Cart items', 'Summary', 'Promo code'],
        }),
      ]),
      menu('Footer', 'التذييل', 'footer', [
        page('help', 'Help Center', 'المساعدة'),
        page('returns', 'Returns', 'الإرجاع'),
        page('shipping', 'Shipping Info', 'معلومات الشحن'),
        page('contact', 'Contact', 'تواصل'),
      ]),
    ]),
    app('Checkout', 'الدفع', 'dashboard-client', [
      menu('Checkout Steps', 'خطوات الدفع', 'main', [
        page('shipping-step', 'Shipping', 'الشحن', {
          sections: ['Address form', 'Delivery options'],
        }),
        page('payment-step', 'Payment', 'الدفع', {
          sections: ['Payment form', 'Order summary'],
        }),
        page('confirmation', 'Confirmation', 'التأكيد', {
          sections: ['Order confirmed', 'Order details', 'Next steps'],
        }),
      ]),
    ]),
  ],

  multivendor: [
    app('Marketplace', 'السوق', 'marketing', [
      menu('Main Navigation', 'التنقل', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Vendor grid', 'Featured products', 'Categories'],
        }),
        page('vendors', 'Vendors', 'البائعون', {
          sections: ['Vendor grid', 'Filters'],
          children: [
            page('vendor-profile', 'Vendor Profile', 'ملف البائع', {
              sections: ['Profile header', 'Products', 'Reviews', 'About'],
            }),
          ],
        }),
        page('catalog', 'Catalog', 'الكتالوج', {
          sections: ['Filters', 'Product grid'],
          children: [
            page('product', 'Product', 'منتج', {
              sections: ['Product images', 'Details', 'Vendor info', 'Reviews'],
            }),
          ],
        }),
      ]),
      menu('Footer', 'التذييل', 'footer', [
        page('become-vendor', 'Become a Vendor', 'كن بائعاً'),
        page('help', 'Help', 'المساعدة'),
        page('legal', 'Legal', 'قانوني'),
      ]),
    ]),
    app('Vendor Portal', 'بوابة البائع', 'dashboard-client', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('overview', 'Overview', 'نظرة عامة', {
          sections: ['Sales stats', 'Recent orders', 'Top products'],
        }),
        page('products', 'Products', 'المنتجات', {
          sections: ['Product list', 'Add product'],
          children: [
            page('edit-product', 'Edit Product', 'تعديل المنتج', {
              sections: ['Product form', 'Images', 'Inventory'],
            }),
          ],
        }),
        page('orders', 'Orders', 'الطلبات', {
          sections: ['Order list', 'Filters'],
        }),
        page('payouts', 'Payouts', 'المدفوعات', {
          sections: ['Balance', 'Payout history'],
        }),
      ]),
    ]),
    app('Admin', 'الإدارة', 'dashboard-admin', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('vendors-admin', 'Vendors', 'البائعون', {
          sections: ['Vendor list', 'Approvals', 'KPIs'],
        }),
        page('products-admin', 'Products', 'المنتجات'),
        page('orders-admin', 'Orders', 'الطلبات'),
        page('reports-admin', 'Reports', 'التقارير', {
          sections: ['Revenue charts', 'Vendor analytics'],
        }),
        page('settings-admin', 'Settings', 'الإعدادات'),
      ]),
    ]),
  ],

  portfolio: [
    app('Portfolio', 'معرض الأعمال', 'marketing', [
      menu('Main Navigation', 'التنقل الرئيسي', 'main', [
        page('home', 'Home', 'الرئيسية', {
          sections: ['Nav', 'Hero', 'Featured work', 'About teaser', 'Arabic type'],
        }),
        page('work', 'Work', 'الأعمال', {
          sections: ['Project grid', 'Filters'],
          children: [
            page('case-study', 'Case Study', 'دراسة حالة', {
              sections: ['Case header', 'Overview', 'Process', 'Outcome', 'Next project'],
            }),
          ],
        }),
        page('about', 'About', 'نبذة', {
          sections: ['Bio', 'Skills', 'Experience', 'Awards'],
        }),
        page('contact', 'Contact', 'تواصل', {
          sections: ['Contact form', 'Social links'],
        }),
      ]),
    ]),
  ],

  'dashboard-app': [
    app('Dashboard', 'لوحة التحكم', 'dashboard-client', [
      menu('Sidebar', 'الشريط الجانبي', 'sidebar', [
        page('dashboard', 'Dashboard', 'لوحة التحكم', {
          sections: ['KPI cards', 'Charts', 'Recent activity'],
        }),
        page('reports', 'Reports', 'التقارير', {
          sections: ['Report list', 'Filters', 'Charts'],
          children: [
            page('report-detail', 'Report Detail', 'تقرير مفصّل', {
              sections: ['Report header', 'Data table', 'Export'],
            }),
          ],
        }),
        page('team', 'Team', 'الفريق', {
          sections: ['Team members', 'Roles', 'Invitations'],
        }),
        page('settings', 'Settings', 'الإعدادات', {
          sections: ['General', 'Security', 'Integrations', 'Billing'],
        }),
      ]),
      menu('User Menu', 'قائمة المستخدم', 'utility', [
        page('profile', 'Profile', 'الملف الشخصي'),
        page('notifications', 'Notifications', 'الإشعارات'),
        page('help', 'Help', 'المساعدة'),
      ]),
    ]),
  ],
}

const ARCHETYPE_META: Record<ArchetypeKind, { name: string; arabicName: string; description: string }> = {
  landing: { name: 'Landing Page', arabicName: 'صفحة هبوط', description: 'A single focused marketing page.' },
  saas: { name: 'SaaS Platform', arabicName: 'منصة SaaS', description: 'Marketing + client + admin.' },
  'micro-saas': { name: 'Micro-SaaS', arabicName: 'مايكرو SaaS', description: 'A lean, single-purpose product.' },
  'saas-xplatform': { name: 'SaaS Cross-platform', arabicName: 'SaaS متعدد المنصات', description: 'Web, mobile and desktop.' },
  blog: { name: 'Blog', arabicName: 'مدونة', description: 'Editorial writing and articles.' },
  cms: { name: 'CMS', arabicName: 'نظام إدارة محتوى', description: 'Public site + admin CMS.' },
  store: { name: 'Store', arabicName: 'متجر', description: 'Store + checkout flow.' },
  multivendor: { name: 'Multi-vendor Store', arabicName: 'متجر متعدد البائعين', description: 'Marketplace + vendor + admin.' },
  portfolio: { name: 'Portfolio', arabicName: 'معرض أعمال', description: 'Showcase work with character.' },
  'dashboard-app': { name: 'Dashboard App', arabicName: 'تطبيق لوحة تحكم', description: 'A data-dense internal tool.' },
}

export const ARCHETYPES: Archetype[] = (Object.keys(ARCHETYPE_BLOCKS) as ArchetypeKind[]).map(
  (id) => ({
    id,
    ...ARCHETYPE_META[id],
    blocks: ARCHETYPE_BLOCKS[id],
    apps: ARCHETYPE_APPS[id],
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
