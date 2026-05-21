'use client'

import React, { useState } from 'react'
import {
  Plus, Globe, Lock, Eye, EyeOff, MoreHorizontal,
  FileText, LayoutDashboard, ShoppingCart, Info,
  ChevronRight, ChevronDown, Link2, ArrowRight,
  Navigation, Menu as MenuIcon, ExternalLink, Hash,
  Search, Layers, Settings2, Trash2, Copy, Edit3,
} from 'lucide-react'

interface Page {
  id: string
  slug: string
  slugAr: string
  title: string
  titleAr: string
  type: 'landing' | 'inner' | 'auth' | 'api'
  status: 'live' | 'draft' | 'hidden'
  children?: Page[]
  menuLabel?: string
  menuLabelAr?: string
  inNavbar?: boolean
  inFooter?: boolean
}

interface MenuLink {
  id: string
  label: string
  labelAr: string
  href: string
  icon?: React.ReactNode
  children?: MenuLink[]
  target?: '_self' | '_blank'
}

const INITIAL_PAGES: Page[] = [
  {
    id: 'home', slug: '/', slugAr: '/', title: 'Home', titleAr: 'الرئيسية',
    type: 'landing', status: 'live', menuLabel: 'Home', menuLabelAr: 'الرئيسية',
    inNavbar: true, inFooter: false,
    children: [
      { id: 'about', slug: '/about', slugAr: '/عن-الشركة', title: 'About', titleAr: 'عن الشركة', type: 'inner', status: 'live', menuLabel: 'About', menuLabelAr: 'من نحن', inNavbar: true, inFooter: true },
      { id: 'pricing', slug: '/pricing', slugAr: '/الأسعار', title: 'Pricing', titleAr: 'الأسعار', type: 'inner', status: 'draft', menuLabel: 'Pricing', menuLabelAr: 'الباقات', inNavbar: true, inFooter: true },
    ],
  },
  {
    id: 'blog', slug: '/blog', slugAr: '/المدونة', title: 'Blog', titleAr: 'المدونة',
    type: 'inner', status: 'live', menuLabel: 'Blog', menuLabelAr: 'المدونة',
    inNavbar: true, inFooter: true,
  },
  {
    id: 'contact', slug: '/contact', slugAr: '/اتصل-بنا', title: 'Contact', titleAr: 'اتصل بنا',
    type: 'inner', status: 'live', menuLabel: 'Contact', menuLabelAr: 'تواصل معنا',
    inNavbar: false, inFooter: true,
  },
  {
    id: 'login', slug: '/login', slugAr: '/تسجيل-الدخول', title: 'Login', titleAr: 'تسجيل الدخول',
    type: 'auth', status: 'live', inNavbar: false, inFooter: false,
  },
]

const TYPE_COLORS: Record<string, string> = {
  landing: 'text-ds-primary bg-ds-primary/10',
  inner: 'text-[#22c55e] bg-[#22c55e]/10',
  auth: 'text-[#f59e0b] bg-[#f59e0b]/10',
  api: 'text-[#8b5cf6] bg-[#8b5cf6]/10',
}

const STATUS_COLORS: Record<string, string> = {
  live: 'text-[#22c55e]',
  draft: 'text-[#f59e0b]',
  hidden: 'text-[#636366]',
}

const STATUS_DOT: Record<string, string> = {
  live: 'bg-[#22c55e]',
  draft: 'bg-[#f59e0b]',
  hidden: 'bg-[#636366]',
}

interface PageRowProps {
  page: Page
  depth?: number
  lang: string
}

function PageRow({ page, depth = 0, lang }: PageRowProps) {
  const [expanded, setExpanded] = useState(true)
  const [hovered, setHovered] = useState(false)
  const hasChildren = page.children && page.children.length > 0
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  return (
    <>
      <tr
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group border-b border-[#1f1f21] hover:bg-[#1d1d1f] transition-colors"
      >
        {/* Page title */}
        <td className="py-1.5 px-3">
          <div className="flex items-center gap-1.5" style={{ paddingLeft: depth * 16 }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(e => !e)} className="text-[#636366] hover:text-ds-primary transition-colors">
                {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            ) : (
              <span className="w-[10px]" />
            )}
            <FileText size={10} className="text-[#636366] shrink-0" />
            <span className="text-[10px] text-[#e1e1e6] font-medium truncate max-w-[120px]">
              {t(page.title, page.titleAr)}
            </span>
          </div>
        </td>
        {/* Slug EN */}
        <td className="py-1.5 px-2">
          <code className="text-[9px] text-[#8e8e93] font-mono bg-[#1c1c1e] px-1.5 py-0.5 rounded border border-[#2e2e30]">
            {page.slug}
          </code>
        </td>
        {/* Slug AR */}
        <td className="py-1.5 px-2">
          <code className="text-[9px] text-[#8e8e93] font-mono bg-[#1c1c1e] px-1.5 py-0.5 rounded border border-[#2e2e30] dir-rtl">
            {page.slugAr}
          </code>
        </td>
        {/* Type */}
        <td className="py-1.5 px-2">
          <span className={`text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${TYPE_COLORS[page.type]}`}>
            {page.type}
          </span>
        </td>
        {/* Status */}
        <td className="py-1.5 px-2">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[page.status]}`} />
            <span className={`text-[9px] font-medium ${STATUS_COLORS[page.status]}`}>{page.status}</span>
          </div>
        </td>
        {/* Navbar */}
        <td className="py-1.5 px-2 text-center">
          <div className={`w-3 h-3 rounded-sm border mx-auto ${page.inNavbar ? 'bg-ds-primary border-ds-primary' : 'border-[#3a3a3c]'}`} />
        </td>
        {/* Footer */}
        <td className="py-1.5 px-2 text-center">
          <div className={`w-3 h-3 rounded-sm border mx-auto ${page.inFooter ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#3a3a3c]'}`} />
        </td>
        {/* Actions */}
        <td className="py-1.5 px-2">
          <div className={`flex items-center gap-0.5 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#2b2b2c] text-[#636366] hover:text-[#e1e1e6] transition-colors">
              <Edit3 size={9} />
            </button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#2b2b2c] text-[#636366] hover:text-[#e1e1e6] transition-colors">
              <Copy size={9} />
            </button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#3a1c1c] text-[#636366] hover:text-[#f87171] transition-colors">
              <Trash2 size={9} />
            </button>
          </div>
        </td>
      </tr>
      {hasChildren && expanded && page.children!.map(child => (
        <PageRow key={child.id} page={child} depth={depth + 1} lang={lang} />
      ))}
    </>
  )
}

interface MenuItemRowProps {
  item: { label: string; labelAr: string; href: string; active: boolean; type: 'navbar' | 'footer' | 'mobile' }
  lang: string
}

function MenuItemRow({ item, lang }: MenuItemRowProps) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded border border-[#2e2e30] bg-[#1c1c1e] hover:border-[#3a3a3c] group transition-all">
      <Link2 size={9} className="text-[#636366] shrink-0" />
      <span className="text-[10px] text-[#e1e1e6] font-medium flex-1 truncate">{t(item.label, item.labelAr)}</span>
      <code className="text-[8px] text-[#636366] font-mono truncate max-w-[100px]">{item.href}</code>
      <span className={`text-[8px] px-1 py-0.5 rounded ${
        item.type === 'navbar' ? 'bg-ds-primary/10 text-ds-primary' :
        item.type === 'footer' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
        'bg-[#8b5cf6]/10 text-[#8b5cf6]'
      }`}>{item.type}</span>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
        <button className="w-4 h-4 flex items-center justify-center rounded hover:bg-[#2b2b2c] text-[#636366] hover:text-[#e1e1e6] transition-colors"><Edit3 size={8} /></button>
        <button className="w-4 h-4 flex items-center justify-center rounded hover:bg-[#3a1c1c] text-[#636366] hover:text-[#f87171] transition-colors"><Trash2 size={8} /></button>
      </div>
    </div>
  )
}

const MENU_ITEMS = [
  { label: 'Home', labelAr: 'الرئيسية', href: '/', active: true, type: 'navbar' as const },
  { label: 'About', labelAr: 'من نحن', href: '/about', active: true, type: 'navbar' as const },
  { label: 'Pricing', labelAr: 'الأسعار', href: '/pricing', active: true, type: 'navbar' as const },
  { label: 'Blog', labelAr: 'المدونة', href: '/blog', active: true, type: 'navbar' as const },
  { label: 'Contact Us', labelAr: 'تواصل معنا', href: '/contact', active: true, type: 'footer' as const },
  { label: 'Privacy Policy', labelAr: 'سياسة الخصوصية', href: '/privacy', active: false, type: 'footer' as const },
  { label: 'Terms', labelAr: 'الشروط والأحكام', href: '/terms', active: false, type: 'footer' as const },
  { label: 'CTA Button', labelAr: 'زر الإجراء', href: '/get-started', active: true, type: 'mobile' as const },
]

interface PagesBoardProps {
  lang: string
}

export default function PagesMenuBoard({ lang }: PagesBoardProps) {
  const [activeSection, setActiveSection] = useState<'pages' | 'menus' | 'routing'>('pages')
  const [searchQ, setSearchQ] = useState('')
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const filteredPages = INITIAL_PAGES // in a real impl, filter by searchQ

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f0f10] text-[#e1e1e6]">

      {/* Board header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1f1f21] shrink-0 bg-[#131314]">
        <Layers size={12} className="text-ds-primary shrink-0" />
        <span className="text-[11px] font-semibold text-[#a1a1a6] tracking-wider uppercase">
          {t('Pages & Menus', 'الصفحات والقوائم')}
        </span>

        {/* Section pills */}
        <div className="flex items-center gap-0.5 bg-[#1c1c1e] border border-[#2e2e30] rounded-lg p-0.5 ms-2">
          {(['pages', 'menus', 'routing'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider rounded-md transition-all ${
                activeSection === s
                  ? 'bg-ds-primary text-white shadow-sm'
                  : 'text-[#636366] hover:text-[#a1a1a6]'
              }`}
            >
              {t(s.charAt(0).toUpperCase() + s.slice(1), s === 'pages' ? 'الصفحات' : s === 'menus' ? 'القوائم' : 'التوجيه')}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#636366] pointer-events-none" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={t('Filter…', 'ابحث…')}
            className="w-36 bg-[#1c1c1e] border border-[#2e2e30] rounded-md pl-6 pr-2 py-1 text-[9px] text-[#e1e1e6] placeholder:text-[#48484a] focus:outline-none focus:border-ds-primary/50 transition-colors"
          />
        </div>

        {/* Add page */}
        <button className="flex items-center gap-1 h-6 px-2.5 rounded-md bg-ds-primary hover:bg-ds-primary-hover text-white text-[9px] font-semibold uppercase tracking-wider transition-colors shadow-sm">
          <Plus size={9} />
          {t('Add Page', 'صفحة جديدة')}
        </button>
      </div>

      {/* Pages section */}
      {activeSection === 'pages' && (
        <div className="flex-1 overflow-auto">
          {/* Summary row */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1f1f21] bg-[#131314] shrink-0">
            {[
              { label: t('Total', 'الكل'), value: '4', color: 'text-[#e1e1e6]' },
              { label: t('Live', 'مفعّل'), value: '3', color: 'text-[#22c55e]' },
              { label: t('Draft', 'مسودة'), value: '1', color: 'text-[#f59e0b]' },
              { label: t('In Navbar', 'في الشريط'), value: '3', color: 'text-ds-primary' },
              { label: t('In Footer', 'في الفوتر'), value: '3', color: 'text-[#22c55e]' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-[9px] text-[#636366]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Pages table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f21] bg-[#131314]">
                {[
                  t('Page', 'الصفحة'), t('EN Slug', 'المسار بالإنجليزية'),
                  t('AR Slug', 'المسار بالعربية'), t('Type', 'النوع'),
                  t('Status', 'الحالة'), 'Nav', 'Footer', '',
                ].map((h, i) => (
                  <th key={i} className="text-start py-1.5 px-3 text-[8px] font-semibold text-[#48484a] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPages.map(page => (
                <PageRow key={page.id} page={page} lang={lang} />
              ))}
            </tbody>
          </table>

          {/* Add row */}
          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[9px] text-[#48484a] hover:text-[#8e8e93] hover:bg-[#131314] border-b border-[#1f1f21] transition-colors">
            <Plus size={9} />
            {t('Add a new page', 'إضافة صفحة جديدة')}
          </button>
        </div>
      )}

      {/* Menus section */}
      {activeSection === 'menus' && (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Navbar menu */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <Navigation size={10} className="text-ds-primary" />
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-wider">{t('Primary Navbar', 'شريط التنقل الرئيسي')}</span>
              <span className="ms-auto text-[8px] text-[#636366]">{MENU_ITEMS.filter(i => i.type === 'navbar').length} {t('links', 'روابط')}</span>
              <button className="h-5 px-1.5 rounded text-[8px] font-medium bg-[#1c1c1e] border border-[#2e2e30] text-[#8e8e93] hover:text-[#e1e1e6] hover:border-[#3a3a3c] transition-colors">
                <Plus size={8} />
              </button>
            </div>
            {MENU_ITEMS.filter(i => i.type === 'navbar').map((item, idx) => (
              <MenuItemRow key={idx} item={item} lang={lang} />
            ))}
          </div>

          {/* Footer links */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={10} className="text-[#22c55e]" />
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-wider">{t('Footer Links', 'روابط الفوتر')}</span>
              <span className="ms-auto text-[8px] text-[#636366]">{MENU_ITEMS.filter(i => i.type === 'footer').length} {t('links', 'روابط')}</span>
              <button className="h-5 px-1.5 rounded text-[8px] font-medium bg-[#1c1c1e] border border-[#2e2e30] text-[#8e8e93] hover:text-[#e1e1e6] hover:border-[#3a3a3c] transition-colors">
                <Plus size={8} />
              </button>
            </div>
            {MENU_ITEMS.filter(i => i.type === 'footer').map((item, idx) => (
              <MenuItemRow key={idx} item={item} lang={lang} />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <MenuIcon size={10} className="text-[#8b5cf6]" />
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-wider">{t('Mobile / CTA', 'موبايل / CTA')}</span>
              <button className="ms-auto h-5 px-1.5 rounded text-[8px] font-medium bg-[#1c1c1e] border border-[#2e2e30] text-[#8e8e93] hover:text-[#e1e1e6] hover:border-[#3a3a3c] transition-colors">
                <Plus size={8} />
              </button>
            </div>
            {MENU_ITEMS.filter(i => i.type === 'mobile').map((item, idx) => (
              <MenuItemRow key={idx} item={item} lang={lang} />
            ))}
          </div>
        </div>
      )}

      {/* Routing section */}
      {activeSection === 'routing' && (
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {/* Route tree */}
            {[
              { path: '/', comp: 'HomePage', bundle: '48 kB', cached: true, latency: '12ms', ar: '/' },
              { path: '/about', comp: 'AboutPage', bundle: '32 kB', cached: true, latency: '9ms', ar: '/عن-الشركة' },
              { path: '/pricing', comp: 'PricingPage', bundle: '56 kB', cached: false, latency: '18ms', ar: '/الأسعار' },
              { path: '/blog', comp: 'BlogListPage', bundle: '64 kB', cached: true, latency: '22ms', ar: '/المدونة' },
              { path: '/blog/[slug]', comp: 'BlogPostPage', bundle: '41 kB', cached: false, latency: '35ms', ar: '/المدونة/[مقال]' },
              { path: '/contact', comp: 'ContactPage', bundle: '29 kB', cached: true, latency: '8ms', ar: '/اتصل-بنا' },
              { path: '/login', comp: 'LoginPage', bundle: '38 kB', cached: false, latency: '11ms', ar: '/تسجيل-الدخول' },
            ].map((route, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded border border-[#1f1f21] bg-[#131314] hover:border-[#2e2e30] group transition-all">
                <ArrowRight size={9} className="text-[#636366] shrink-0" />
                <code className="text-[9px] text-ds-primary font-mono w-32 shrink-0 truncate">{route.path}</code>
                <div className="w-px h-3 bg-[#2e2e30] shrink-0" />
                <code className="text-[9px] text-[#8b5cf6] font-mono flex-1 truncate">{route.comp}</code>
                <div className="flex items-center gap-2 ms-auto">
                  <span className="text-[8px] text-[#636366] font-mono">{route.bundle}</span>
                  <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${route.cached ? 'text-[#22c55e] bg-[#22c55e]/10' : 'text-[#f59e0b] bg-[#f59e0b]/10'}`}>
                    {route.cached ? 'cached' : 'dynamic'}
                  </span>
                  <span className="text-[8px] text-[#636366] font-mono w-10 text-end">{route.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
