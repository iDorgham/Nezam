'use client'

import { Eye, Layers, FileText, ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { BrowserPreview } from './BrowserPreview'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'

// ─── Template detection (mirrors DeviceFrame logic, lightweight) ───────────────

type PageTemplate =
  | 'marketing' | 'features' | 'pricing' | 'blog-list' | 'article' | 'contact'
  | 'auth-login' | 'auth-signup' | 'auth-forgot'
  | 'dashboard' | 'analytics' | 'settings' | 'profile' | 'team'
  | 'docs' | 'api-explorer' | 'media-library' | 'notifications'
  | 'product-list' | 'product-detail' | 'cart' | 'checkout' | 'order-success'
  | 'onboarding' | 'error-404'

function detectTemplate(page: ArchPage): PageTemplate {
  const name  = page.name.toLowerCase()
  const route = (page.route ?? '').toLowerCase()
  const has = (...terms: string[]) => terms.some((t) => name.includes(t) || route.includes(t))
  const nameWords = new Set(name.split(/[\s\-_/[\].]+/).filter(Boolean))
  const word = (...terms: string[]) => terms.some((t) => nameWords.has(t))

  if (has('login', 'sign-in', 'signin') || word('login'))               return 'auth-login'
  if (has('signup', 'sign-up', 'register') || word('register'))         return 'auth-signup'
  if (has('forgot', 'reset', 'password'))                               return 'auth-forgot'
  if (has('checkout'))                                                   return 'checkout'
  if (has('cart', 'basket'))                                             return 'cart'
  if (has('order', 'success', 'thank') || word('confirm'))               return 'order-success'
  if ((has('product', 'item', '[') || has('detail')) && !has('list', 'catalog')) return 'product-detail'
  if (has('shop', 'store', 'catalog', 'collection', 'wishlist') || (has('product') && has('list'))) return 'product-list'
  if (has('pricing', 'plan', 'price'))                                   return 'pricing'
  if (has('blog', 'news', 'articles', 'posts') || word('post'))          return 'blog-list'
  if (has('article', 'journal', 'story') || word('slug'))                return 'article'
  if (has('contact', 'reach', 'get-in-touch'))                           return 'contact'
  if (has('newsletter'))                                                  return 'blog-list'
  if (has('docs', 'documentation', 'guide', 'reference') || word('doc')) return 'docs'
  if (has('api') && (has('explorer', 'reference', 'docs') || route.includes('/api'))) return 'api-explorer'
  if (has('analytics', 'report', 'chart', 'insight', 'explorer') || word('reports')) return 'analytics'
  if (has('settings', 'preference', 'security', 'privacy', 'billing') || word('account')) return 'settings'
  if (has('notification', 'inbox', 'message') && !has('setting'))         return 'notifications'
  if (has('team', 'member', 'people', 'staff') || word('org'))            return 'team'
  if (has('media', 'library', 'asset', 'upload') || word('files'))        return 'media-library'
  if (has('profile', 'portfolio', 'resume') || word('me', 'about'))       return 'profile'
  if (has('onboarding', 'welcome', 'setup', 'permission') || word('start')) return 'onboarding'
  if (has('feature') || word('features'))                                 return 'features'
  if (has('dashboard', 'overview', 'admin') ||
      route.startsWith('/app') || route.startsWith('/dashboard') || route.startsWith('/admin'))
    return 'dashboard'
  if (route === '/' || word('home', 'landing'))                           return 'marketing'
  if (has('404', 'not-found', 'error'))                                   return 'error-404'
  return 'marketing'
}

// ─── Template metadata ─────────────────────────────────────────────────────────

interface TemplateInfo {
  label: string
  color: string    // tailwind bg
  layers: string[]
}

const TEMPLATE_INFO: Record<PageTemplate, TemplateInfo> = {
  'marketing':      { label: 'Marketing',       color: '#6366f1', layers: ['NavBar', 'Hero Banner', 'Features Strip', 'Testimonials', 'CTA Section', 'Footer'] },
  'features':       { label: 'Features',        color: '#8b5cf6', layers: ['NavBar', 'Hero', 'Features Grid', 'Detail Sections', 'CTA', 'Footer'] },
  'pricing':        { label: 'Pricing',         color: '#a855f7', layers: ['NavBar', 'Hero', 'Pricing Cards', 'FAQ Accordion', 'CTA', 'Footer'] },
  'blog-list':      { label: 'Blog',            color: '#f59e0b', layers: ['NavBar', 'Hero', 'Article Grid', 'Sidebar', 'Pagination', 'Footer'] },
  'article':        { label: 'Article',         color: '#f97316', layers: ['NavBar', 'Breadcrumbs', 'Article Header', 'Body Content', 'Author Bio', 'Related Articles', 'Footer'] },
  'contact':        { label: 'Contact',         color: '#10b981', layers: ['NavBar', 'Hero', 'Contact Form', 'Map / Info', 'Footer'] },
  'auth-login':     { label: 'Login',           color: '#0ea5e9', layers: ['Background', 'Auth Card', 'Logo', 'Form Fields', 'Social Login', 'Footer'] },
  'auth-signup':    { label: 'Sign Up',         color: '#0ea5e9', layers: ['Background', 'Auth Card', 'Logo', 'Form Fields', 'Social Login', 'Footer'] },
  'auth-forgot':    { label: 'Forgot Password', color: '#0ea5e9', layers: ['Background', 'Auth Card', 'Logo', 'Email Field', 'Footer'] },
  'dashboard':      { label: 'Dashboard',       color: '#3b82f6', layers: ['TopBar', 'Sidebar', 'Stats Row', 'Charts Grid', 'Activity Feed', 'Quick Actions'] },
  'analytics':      { label: 'Analytics',       color: '#2563eb', layers: ['TopBar', 'Sidebar', 'Date Filter', 'KPI Cards', 'Charts', 'Data Table'] },
  'settings':       { label: 'Settings',        color: '#64748b', layers: ['TopBar', 'Sidebar', 'Settings Sections', 'Form Groups', 'Save Button'] },
  'profile':        { label: 'Profile',         color: '#ec4899', layers: ['NavBar', 'Cover Photo', 'Avatar & Info', 'Stats', 'Portfolio / Activity', 'Footer'] },
  'team':           { label: 'Team',            color: '#14b8a6', layers: ['TopBar', 'Sidebar', 'Dept Filter Tabs', 'Search Bar', 'Member Grid', 'Actions'] },
  'docs':           { label: 'Docs',            color: '#84cc16', layers: ['NavBar', 'TOC Sidebar', 'Breadcrumbs', 'Article Body', 'Code Blocks', 'On-this-page', 'Prev / Next Nav'] },
  'api-explorer':   { label: 'API Explorer',    color: '#06b6d4', layers: ['NavBar', 'Auth Panel', 'Endpoint List', 'Request Builder', 'Response Viewer'] },
  'media-library':  { label: 'Media Library',   color: '#f472b6', layers: ['TopBar', 'Sidebar', 'Upload Drop Zone', 'Filter Bar', 'File Grid', 'Detail Pane'] },
  'notifications':  { label: 'Notifications',   color: '#fb923c', layers: ['TopBar', 'Sidebar', 'Filter Tabs', 'Notification List', 'Mark-all-read'] },
  'product-list':   { label: 'Product List',    color: '#22c55e', layers: ['NavBar', 'Filter Bar', 'Product Grid', 'Sidebar Filters', 'Pagination', 'Footer'] },
  'product-detail': { label: 'Product Detail',  color: '#16a34a', layers: ['NavBar', 'Breadcrumbs', 'Image Gallery', 'Product Info', 'Reviews', 'Recommendations', 'Footer'] },
  'cart':           { label: 'Cart',            color: '#eab308', layers: ['NavBar', 'Cart Items', 'Order Summary', 'Promo Code', 'Footer'] },
  'checkout':       { label: 'Checkout',        color: '#ca8a04', layers: ['NavBar', 'Progress Steps', 'Shipping Form', 'Payment Form', 'Order Summary'] },
  'order-success':  { label: 'Order Success',   color: '#4ade80', layers: ['NavBar', 'Success Icon', 'Order Details', 'Next Steps', 'Footer'] },
  'onboarding':     { label: 'Onboarding',      color: '#818cf8', layers: ['Step Indicator', 'Illustration', 'Heading & Copy', 'Input Fields', 'Navigation Buttons'] },
  'error-404':      { label: '404 Error',       color: '#f87171', layers: ['NavBar', 'Error Illustration', 'Heading & Copy', 'Back Button', 'Footer'] },
}

// ─── Layer row component ───────────────────────────────────────────────────────

function LayerRow({ label, depth = 0 }: { label: string; depth?: number }) {
  return (
    <div
      className="flex items-center gap-1.5 h-6 text-[11px] text-app-muted hover:text-app-text hover:bg-app-elevated/40 rounded transition-colors cursor-default select-none px-2"
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      <div className="w-3 h-3 rounded-sm border border-app-border/60 shrink-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-[1px] bg-app-border/80" />
      </div>
      <span className="truncate leading-none">{label}</span>
    </div>
  )
}

// ─── Page row component ────────────────────────────────────────────────────────

function PageRow({
  page,
  depth,
  isSelected,
  onSelect,
}: {
  page: ArchPage
  depth: number
  isSelected: boolean
  onSelect: () => void
}) {
  const template = detectTemplate(page)
  const info = TEMPLATE_INFO[template]

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative flex w-full items-center gap-2 h-7 pr-2 text-[11px] transition-colors select-none',
        isSelected
          ? 'bg-app-elevated text-app-text font-medium'
          : 'text-app-muted hover:bg-app-elevated/40 hover:text-app-text',
      )}
      style={{ paddingLeft: `${10 + depth * 14}px` }}
    >
      {/* Connector line for nested pages */}
      {depth > 0 && (
        <span
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ left: `${(depth - 1) * 14 + 14}px`, width: '1px', background: 'var(--app-border)', opacity: 0.5 }}
        />
      )}

      {/* Template color dot */}
      <span
        className="shrink-0 w-2 h-2 rounded-full"
        style={{ backgroundColor: info.color, opacity: isSelected ? 1 : 0.7 }}
      />

      {/* Page icon */}
      <IconRenderer name={page.icon} size={11} className="shrink-0 opacity-70" />

      {/* Page name */}
      <span className="truncate flex-1 text-left leading-none">{page.name}</span>

      {/* Route badge on hover */}
      {page.route && (
        <span className="hidden group-hover:block text-[9px] text-app-subtle font-mono truncate max-w-[60px]">
          {page.route}
        </span>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="ml-auto w-0.5 h-4 rounded-full" style={{ backgroundColor: info.color }} />
      )}
    </button>
  )
}

// ─── Pages tree (flattened with depth) ────────────────────────────────────────

interface FlatPage { page: ArchPage; depth: number }

function flattenPages(pages: Record<string, ArchPage>): FlatPage[] {
  const all = Object.values(pages).sort((a, b) => a.order - b.order)
  const roots = all.filter((p) => !p.parentId)
  const result: FlatPage[] = []

  function addPage(page: ArchPage, depth: number) {
    result.push({ page, depth })
    const children = all.filter((p) => p.parentId === page.id).sort((a, b) => a.order - b.order)
    children.forEach((c) => addPage(c, depth + 1))
  }

  roots.forEach((r) => addPage(r, 0))
  return result
}

// ─── Left panel: Pages + Layers (Figma-style) ─────────────────────────────────

function PagesLayersPanel({
  pages,
  selectedPageId,
  onSelectPage,
}: {
  pages: Record<string, ArchPage>
  selectedPageId: string | null
  onSelectPage: (id: string) => void
}) {
  const [layersOpen, setLayersOpen] = useState(true)
  const flat = flattenPages(pages)
  const count = flat.length

  const resolvedSelectedId = (selectedPageId && pages[selectedPageId])
    ? selectedPageId
    : flat[0]?.page.id ?? null

  const selectedPage = resolvedSelectedId ? pages[resolvedSelectedId] : null
  const template = selectedPage ? detectTemplate(selectedPage) : null
  const templateInfo = template ? TEMPLATE_INFO[template] : null

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden">

      {/* ── PAGES header ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-app-border shrink-0">
        <FileText size={11} className="text-app-subtle shrink-0" />
        <span className="text-[11px] font-semibold text-app-text uppercase tracking-wider flex-1">Pages</span>
        <span className="text-[10px] font-mono text-app-subtle bg-app-elevated px-1.5 py-0.5 rounded">
          {count}
        </span>
      </div>

      {/* ── Pages list ── */}
      <div
        className="overflow-y-auto app-scroll py-1 shrink-0"
        style={{ maxHeight: layersOpen ? '50%' : 'calc(100% - 88px)' }}
      >
        {flat.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-[11px] text-app-subtle">No pages yet.</p>
            <p className="text-[10px] text-app-subtle mt-0.5 opacity-70">Add pages in Architecture.</p>
          </div>
        ) : (
          flat.map(({ page, depth }) => (
            <PageRow
              key={page.id}
              page={page}
              depth={depth}
              isSelected={resolvedSelectedId === page.id}
              onSelect={() => onSelectPage(page.id)}
            />
          ))
        )}
      </div>

      {/* ── LAYERS header ── */}
      <button
        onClick={() => setLayersOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 border-t border-b border-app-border shrink-0 hover:bg-app-elevated/30 transition-colors"
      >
        <Layers size={11} className="text-app-subtle shrink-0" />
        <span className="text-[11px] font-semibold text-app-text uppercase tracking-wider flex-1 text-left">Layers</span>
        {templateInfo && (
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: templateInfo.color + '22',
              color: templateInfo.color,
            }}
          >
            {templateInfo.label}
          </span>
        )}
        {layersOpen
          ? <ChevronDown size={10} className="text-app-subtle shrink-0" />
          : <ChevronRight size={10} className="text-app-subtle shrink-0" />
        }
      </button>

      {/* ── Layers list ── */}
      {layersOpen && (
        <div className="flex-1 overflow-y-auto app-scroll py-1">
          {templateInfo ? (
            templateInfo.layers.map((layer, i) => (
              <LayerRow key={i} label={layer} depth={0} />
            ))
          ) : (
            <div className="px-3 py-3 text-center">
              <p className="text-[10px] text-app-subtle">Select a page to see layers.</p>
            </div>
          )}
        </div>
      )}

    </aside>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PreviewSection() {
  const pages          = useHub((s) => s.arch.pages)
  const selectedPageId = useHub((s) => s.preview.selectedPageId)
  const selectPage     = useHub((s) => s.previewSelectPage)

  const sortedPages = Object.values(pages).sort((a, b) => a.order - b.order)
  const selectedPage = (selectedPageId && pages[selectedPageId])
    ? pages[selectedPageId]
    : sortedPages[0] ?? null

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">

      {/* Left panel: Pages + Layers */}
      <PagesLayersPanel
        pages={pages}
        selectedPageId={selectedPageId}
        onSelectPage={selectPage}
      />

      {/* Main: browser-window preview (chrome + viewport at 100%) */}
      <div className="flex min-w-0 flex-1 overflow-hidden">
        {selectedPage ? (
          <BrowserPreview page={selectedPage} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Eye size={40} className="text-app-border" />
            <p className="text-sm font-medium text-app-text">Select a page to preview</p>
            <p className="text-xs text-app-subtle">
              Add pages in the Architecture section first.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
