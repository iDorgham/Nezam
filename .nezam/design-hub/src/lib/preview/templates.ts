import type { ArchPage } from '@/types/arch'

export type PageTemplate =
  | 'marketing' | 'features' | 'pricing' | 'blog-list' | 'article' | 'contact'
  | 'auth-login' | 'auth-signup' | 'auth-forgot'
  | 'dashboard' | 'analytics' | 'settings' | 'profile' | 'team'
  | 'docs' | 'api-explorer' | 'media-library' | 'notifications'
  | 'product-list' | 'product-detail' | 'cart' | 'checkout' | 'order-success'
  | 'onboarding' | 'error-404'

export interface TemplateInfo {
  label: string
  color: string
  layers: string[]
}

export const TEMPLATE_INFO: Record<PageTemplate, TemplateInfo> = {
  marketing: { label: 'Marketing', color: '#6366f1', layers: ['Top Navigation', 'Hero', 'Logos Strip', 'Features Grid', 'CTA Banner', 'Footer'] },
  features: { label: 'Features', color: '#8b5cf6', layers: ['Top Navigation', 'Features Detail', 'Logos Strip', 'CTA Banner', 'Footer'] },
  pricing: { label: 'Pricing', color: '#a855f7', layers: ['Top Navigation', 'Pricing Cards', 'Footer'] },
  'blog-list': { label: 'Blog', color: '#f59e0b', layers: ['Top Navigation', 'Category Pills', 'Article Grid', 'Footer'] },
  article: { label: 'Article', color: '#f97316', layers: ['Top Navigation', 'Article Header', 'Body Content', 'Code Snippet', 'Footer'] },
  contact: { label: 'Contact', color: '#10b981', layers: ['Top Navigation', 'Contact Form', 'Contact Cards', 'Footer'] },
  'auth-login': { label: 'Login', color: '#0ea5e9', layers: ['Split Background', 'Auth Card', 'Form Fields', 'Social Login'] },
  'auth-signup': { label: 'Signup', color: '#0ea5e9', layers: ['Split Background', 'Auth Card', 'Form Fields', 'Social Login'] },
  'auth-forgot': { label: 'Forgot Password', color: '#0ea5e9', layers: ['Split Background', 'Auth Card', 'Email Input', 'Primary CTA'] },
  dashboard: { label: 'Dashboard', color: '#3b82f6', layers: ['Sidebar', 'Header Actions', 'Stats Row', 'Chart Panel', 'Recent Users'] },
  analytics: { label: 'Analytics', color: '#2563eb', layers: ['Sidebar', 'Date Filters', 'Traffic Chart', 'Top Pages'] },
  settings: { label: 'Settings', color: '#64748b', layers: ['Sidebar', 'Profile Photo', 'Personal Info Form', 'Danger Zone'] },
  profile: { label: 'Profile', color: '#ec4899', layers: ['Top Navigation', 'Profile Hero', 'Work Grid', 'Footer'] },
  team: { label: 'Team', color: '#14b8a6', layers: ['Top Navigation', 'Team Grid', 'Footer'] },
  docs: { label: 'Docs', color: '#84cc16', layers: ['Docs Sidebar', 'Article Content', 'Checklist Blocks'] },
  'api-explorer': { label: 'API Explorer', color: '#06b6d4', layers: ['Top Navigation', 'Sidebar', 'Endpoint Rows'] },
  'media-library': { label: 'Media Library', color: '#f472b6', layers: ['Top Navigation', 'Toolbar', 'Media Grid'] },
  notifications: { label: 'Notifications', color: '#fb923c', layers: ['Top Navigation', 'Notification Rows'] },
  'product-list': { label: 'Product List', color: '#22c55e', layers: ['Top Navigation', 'Filter Actions', 'Product Grid', 'Footer'] },
  'product-detail': { label: 'Product Detail', color: '#16a34a', layers: ['Top Navigation', 'Gallery', 'Product Info', 'Footer'] },
  cart: { label: 'Cart', color: '#eab308', layers: ['Top Navigation', 'Line Items', 'Order Summary', 'Footer'] },
  checkout: { label: 'Checkout', color: '#ca8a04', layers: ['Checkout Header', 'Progress Steps', 'Form Sections', 'Order Card'] },
  'order-success': { label: 'Order Success', color: '#4ade80', layers: ['Header', 'Success Hero', 'Delivery Card', 'Footer'] },
  onboarding: { label: 'Onboarding', color: '#818cf8', layers: ['Top Navigation', 'Step Indicator', 'Inputs', 'Primary CTA'] },
  'error-404': { label: '404 Error', color: '#f87171', layers: ['Error Icon', 'Error Copy', 'Action Buttons'] },
}

export function resolveTemplateLayerOrder(baseLayers: string[], requestedOrder: string[]): string[] {
  if (!requestedOrder.length) return baseLayers
  const known = new Set(baseLayers)
  const orderedKnown = requestedOrder.filter((id) => known.has(id))
  const missing = baseLayers.filter((id) => !orderedKnown.includes(id))
  return [...orderedKnown, ...missing]
}

export function detectTemplate(page: ArchPage): PageTemplate {
  const name = page.name.toLowerCase()
  const route = (page.route ?? '').toLowerCase()
  const has = (...terms: string[]) => terms.some((t) => name.includes(t) || route.includes(t))
  const words = new Set(name.split(/[\s\-_/[\].]+/).filter(Boolean))
  const word = (...terms: string[]) => terms.some((t) => words.has(t))

  if (has('login', 'sign-in', 'signin') || word('login')) return 'auth-login'
  if (has('signup', 'sign-up', 'register') || word('register')) return 'auth-signup'
  if (has('forgot', 'reset', 'password')) return 'auth-forgot'
  if (has('checkout')) return 'checkout'
  if (has('cart', 'basket')) return 'cart'
  if (has('order', 'success', 'thank') || word('confirm')) return 'order-success'
  if ((has('product', 'item', '[') || has('detail')) && !has('list', 'catalog')) return 'product-detail'
  if (has('shop', 'store', 'catalog', 'collection', 'wishlist') || (has('product') && has('list'))) return 'product-list'
  if (has('pricing', 'plan', 'price')) return 'pricing'
  if (has('blog', 'news', 'articles', 'posts') || word('post')) return 'blog-list'
  if (has('article', 'journal', 'story') || word('slug')) return 'article'
  if (has('contact', 'reach', 'get-in-touch')) return 'contact'
  if (has('docs', 'documentation', 'guide', 'reference') || word('doc')) return 'docs'
  if (has('api') && (has('explorer', 'reference', 'docs') || route.includes('/api'))) return 'api-explorer'
  if (has('analytics', 'report', 'chart', 'insight', 'explorer') || word('reports')) return 'analytics'
  if (has('settings', 'preference', 'security', 'privacy', 'billing') || word('account')) return 'settings'
  if (has('notification', 'inbox', 'message') && !has('setting')) return 'notifications'
  if (has('team', 'member', 'people', 'staff') || word('org')) return 'team'
  if (has('media', 'library', 'asset', 'upload') || word('files')) return 'media-library'
  if (has('profile', 'portfolio', 'resume') || word('me', 'about')) return 'profile'
  if (has('onboarding', 'welcome', 'setup', 'permission') || word('start')) return 'onboarding'
  if (has('feature') || word('features')) return 'features'
  if (has('dashboard', 'overview', 'admin') || route.startsWith('/app') || route.startsWith('/dashboard') || route.startsWith('/admin')) return 'dashboard'
  if (route === '/' || word('home', 'landing')) return 'marketing'
  if (has('404', 'not-found', 'error')) return 'error-404'
  return 'marketing'
}
