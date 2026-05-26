'use client'

import { Eye, Layers, FileText, ChevronRight, ChevronDown, Search, MessageSquare, Plus, Trash, Sparkles } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useHub, type CommentPin } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { BrowserPreview } from './BrowserPreview'
import { cn } from '@/lib/utils'
import { useSidebarResize } from '@/lib/useSidebarResize'
import type { ArchPage } from '@/types/arch'
import dynamic from 'next/dynamic'
import { PreviewSubTabs } from './PreviewSubTabs'

const ComponentsSection = dynamic(
  () => import('@/components/comp/ComponentsSection').then(m => ({ default: m.ComponentsSection })),
  { ssr: false },
)
const SectionsSection = dynamic(
  () => import('@/components/design/SectionsSection').then(m => ({ default: m.SectionsSection })),
  { ssr: false },
)

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
  const isGroup = page.type === 'group'
  const template = detectTemplate(page)
  const info = TEMPLATE_INFO[template]

  if (isGroup) {
    return (
      <div
        className="relative flex w-full items-center gap-2 h-7 pr-2 text-[10px] text-app-subtle font-semibold uppercase tracking-wider select-none mb-0.5 mt-2"
        style={{ paddingLeft: `${10 + depth * 14}px` }}
      >
        {depth > 0 && (
          <span
            className="absolute left-0 top-0 bottom-0 pointer-events-none"
            style={{ left: `${(depth - 1) * 14 + 14}px`, width: '1px', background: 'var(--app-border)', opacity: 0.5 }}
          />
        )}
        <IconRenderer name="FolderOpen" size={10} className="shrink-0 text-app-accent opacity-80" />
        <span className="truncate flex-1 text-left leading-none">{page.name}</span>
      </div>
    )
  }

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

const EMPTY_COMMENTS: CommentPin[] = []

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
  const { width, startResize } = useSidebarResize()
  const [activeTab, setActiveTab] = useState<'pages' | 'comments'>('pages')
  const [search, setSearch] = useState('')
  
  const comments        = useHub((s) => s.preview.comments) || EMPTY_COMMENTS
  const isAddingComment = useHub((s) => s.preview.isAddingComment)
  const deleteComment   = useHub((s) => s.previewDeleteComment)
  const setIsAdding     = useHub((s) => s.previewSetIsAddingComment)

  const flat = flattenPages(pages)
  const count = flat.length

  const filteredFlat = useMemo(() => {
    if (!search) return flat
    const q = search.toLowerCase()
    return flat.filter(({ page }) => page.name.toLowerCase().includes(q) || (page.route ?? '').toLowerCase().includes(q))
  }, [flat, search])

  const resolvedSelectedId = (selectedPageId && pages[selectedPageId] && pages[selectedPageId].type === 'page')
    ? selectedPageId
    : flat.find(({ page }) => page.type === 'page')?.page.id ?? null

  const pageComments = useMemo(() => {
    return comments.filter((c) => c.pageId === resolvedSelectedId)
  }, [comments, resolvedSelectedId])

  const filteredComments = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return pageComments
    return pageComments.filter((c) => c.text.toLowerCase().includes(q) || c.author.toLowerCase().includes(q))
  }, [pageComments, search])

  return (
    <aside 
      style={{ width }}
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
    >

      {/* Tab bar */}
      <div className="shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-app-border bg-app-bg">
        <PanelTabBtn
          label="Pages"
          Icon={FileText}
          active={activeTab === 'pages'}
          onClick={() => {
            setActiveTab('pages')
            setSearch('')
          }}
        />
        <PanelTabBtn
          label="Comments"
          Icon={MessageSquare}
          active={activeTab === 'comments'}
          onClick={() => {
            setActiveTab('comments')
            setSearch('')
          }}
        />
      </div>

      {/* Search Input */}
      <div className="px-2 pb-2 pt-1 border-b border-app-border shrink-0">
        <div className="relative flex items-center h-7 bg-app-elevated border border-app-border rounded px-2">
          <Search size={11} className="text-app-subtle mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder={activeTab === 'pages' ? "Search preview pages..." : "Search comments..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[11px] text-app-text outline-none placeholder:text-app-subtle"
          />
        </div>
      </div>

      {/* ── Pages list ── */}
      {activeTab === 'pages' && (
        <div className="flex-1 overflow-y-auto app-scroll py-1">
          {filteredFlat.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[11px] text-app-subtle">No pages found.</p>
            </div>
          ) : (
            filteredFlat.map(({ page, depth }) => (
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
      )}

      {/* ── Comments panel ── */}
      {activeTab === 'comments' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Add pin toggle */}
          <div className="p-2 border-b border-app-border shrink-0 bg-app-surface/50">
            <button
              onClick={() => setIsAdding(!isAddingComment)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 h-7 rounded-app-sm text-[11px] font-semibold transition-all duration-100',
                isAddingComment
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-app-accent text-white hover:bg-app-accent-hover active:scale-[0.98]'
              )}
            >
              <Plus size={12} />
              {isAddingComment ? 'Click canvas to drop pin...' : 'Add Pin Comment'}
            </button>
          </div>

          {/* List of comments */}
          <div className="flex-1 overflow-y-auto app-scroll p-2.5 flex flex-col gap-2 min-h-0">
            {filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-3 text-center gap-2 animate-in fade-in duration-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-accent/8 border border-app-accent/15 opacity-50">
                  <MessageSquare size={16} className="text-app-accent" />
                </div>
                <p className="text-[11px] text-app-subtle font-semibold">No comments yet</p>
                <p className="text-[10px] text-app-subtle leading-relaxed opacity-80 max-w-[180px]">
                  Click "Add Pin Comment" and click anywhere on the viewport to leave feedback.
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group/comment p-2.5 rounded-app-sm border border-app-border bg-app-elevated/40 hover:bg-app-elevated/80 transition-colors flex flex-col gap-1.5 relative select-text animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-app-accent text-white text-[10px] font-bold">
                      {pageComments.indexOf(comment) + 1}
                    </span>
                    <span className="text-[11px] font-bold text-app-text truncate">{comment.author}</span>
                    <span className="text-[9px] text-app-subtle ml-auto font-mono shrink-0">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-app-muted leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="absolute top-2.5 right-2 h-5 w-5 rounded items-center justify-center hidden group-hover/comment:flex hover:bg-red-500/15 text-app-subtle hover:text-red-400 transition-colors"
                    title="Delete comment"
                  >
                    <Trash size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Resizer Handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
      />
    </aside>
  )
}

export function PreviewSection() {
  const pages          = useHub((s) => s.arch.pages)
  const selectedPageId = useHub((s) => s.preview.selectedPageId)
  const selectPage     = useHub((s) => s.previewSelectPage)
  const subTab         = useHub((s) => s.preview.subTab)

  const sortedPages = Object.values(pages).sort((a, b) => a.order - b.order)
  const selectedPage = (selectedPageId && pages[selectedPageId] && pages[selectedPageId].type === 'page')
    ? pages[selectedPageId]
    : sortedPages.find((p) => p.type === 'page') ?? null

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left panel: Pages + Layers (only shown in preview/pages subtab) */}
      {subTab === 'preview' && (
        <PagesLayersPanel
          pages={pages}
          selectedPageId={selectedPageId}
          onSelectPage={selectPage}
        />
      )}

      {/* Main panel with persistent PreviewSubTabs at the top and subtab content below */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          {subTab === 'preview' && (
            <>
              <PreviewSubTabs />
              {selectedPage ? (
                <BrowserPreview page={selectedPage} />
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center h-full">
                  <Eye size={40} className="text-app-border" />
                  <p className="text-sm font-medium text-app-text">Select a page to preview</p>
                  <p className="text-xs text-app-subtle">
                    Add pages in the Architecture section first.
                  </p>
                </div>
              )}
            </>
          )}
          {subTab === 'components' && <ComponentsSection />}
          {subTab === 'sections'   && <SectionsSection />}
        </div>
      </main>
    </div>
  )
}

function PanelTabBtn({ label, Icon, active, onClick }: {
  label: string
  Icon: React.FC<{ size?: number; className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 h-7 rounded-app-sm text-[11px] font-medium transition-colors duration-100',
        active
          ? 'bg-app-surface text-app-text border border-app-border'
          : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40',
      )}
    >
      <Icon size={11} className={active ? 'text-app-accent' : ''} />
      {label}
    </button>
  )
}
