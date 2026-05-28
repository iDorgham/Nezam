import type { ArchPage, ArchProfileId } from '@/types/arch'
import { inferCanvasMode } from '@/lib/wireframe/canvas-mode'

export type SeedBlockType =
  | 'Nav_TopBar'
  | 'Nav_Sidebar'
  | 'Nav_Mobile'
  | 'Nav_Footer'
  | 'Hero_Simple'
  | 'Hero_Centered'
  | 'Hero_Split'
  | 'Content_Text'
  | 'Content_Card'
  | 'Content_Features'
  | 'Content_Pricing'
  | 'Content_FAQ'
  | 'Content_CTA'
  | 'Content_Stats'
  | 'Content_Testimonials'
  | 'Content_Logos'
  | 'Form_Login'
  | 'Form_Contact'
  | 'Form_Newsletter'
  | 'Form_Signup'
  | 'Content_BlogGrid'
  | 'Layout_EmptyState'
  | 'Data_KPI_Row'
  | 'Data_Table'
  | 'Data_Chart'
  | 'Layout_PageHeader'
  | 'Layout_TwoColumn'
  | 'Layout_AuthSplit'
  | 'Art_Hero_Cinematic'
  | 'Art_Hero_Bento'
  | 'Art_Hero_StatsFloat'
  | 'Art_BentoGrid_4'
  | 'Art_BentoGrid_6'
  | 'Art_Feature_Zigzag'
  | 'Art_Feature_IconMatrix'
  | 'Art_Pricing_Spotlight'
  | 'Art_Testimonial_Spotlight'
  | 'Art_Testimonial_Masonry'
  | 'Art_Logos_Marquee'
  | 'Art_Stats_BigNumber'
  | 'Art_Team_Portraits'
  | 'Art_CaseStudy_Row'
  | 'Art_Gallery_Masonry'
  | 'Art_Media_SplitCinematic'
  | 'Art_Comparison_Matrix'
  | 'Art_CTA_Band'
  | 'Art_Newsletter_Card'
  | 'Art_FAQ_Split'
  | 'Art_Blog_Featured'
  | 'Art_Integrations_Wall'
  | 'Art_Process_Timeline'
  | 'Art_Product_Highlight'
  | 'Art_AppPreview_Frame'

export type SeedPageSessionSection = {
  section_id: string
  block_type: SeedBlockType
  order: number
  approved: boolean
  locked_props: Record<string, unknown>
  flexible_props: Record<string, unknown>
  content_slots: Record<string, unknown>
  states: Record<string, unknown>
}

function buildStack(params: {
  page: ArchPage
  profileId: ArchProfileId | null
}): SeedBlockType[] {
  const { page, profileId } = params
  const mode = inferCanvasMode(profileId)
  const route = page.route.toLowerCase()
  const name = page.name.toLowerCase()
  const isHome = route === '/' || route === '/home' || name.includes('home')
  const isPricing = route.includes('pricing') || name.includes('pricing')
  const isLogin =
    route.includes('login') ||
    route.includes('forgot') ||
    name.includes('login')
  const isSignup =
    route.includes('signup') ||
    route.includes('sign-up') ||
    route.includes('register') ||
    name.includes('sign up') ||
    name.includes('signup')
  const isContact = route.includes('contact') || name.includes('contact')
  const isDocs = route.includes('docs') || route.includes('guide') || name.includes('docs')
  const isBlog = route.includes('blog') || route.includes('post') || name.includes('blog')
  const isArticle = route.includes('article') || route.includes('[slug]') || name.includes('article')
  const isCheckout = route.includes('checkout') || name.includes('checkout')
  const isCart = route.includes('cart') || route.includes('basket') || name.includes('cart')
  const isOrderSuccess = route.includes('success') || route.includes('thank') || name.includes('success')
  const isApi = route.includes('api') || name.includes('api')
  const isMedia = route.includes('media') || name.includes('media') || route.includes('assets')
  const isNotifications = route.includes('notification') || name.includes('notification') || route.includes('inbox')
  const isTeam = route.includes('team') || name.includes('team')
  const isProfile = route.includes('profile') || name.includes('profile')
  const isOnboarding = route.includes('onboarding') || name.includes('onboarding') || name.includes('welcome')
  const isErrorPage = route.includes('404') || route.includes('not-found') || name.includes('404')
  const isProductList = route.includes('shop') || route.includes('catalog') || name.includes('product list')
  const isProductDetail =
    (route.includes('product') || route.includes('/item')) &&
    !isProductList
  const isDashboard =
    route.includes('dashboard') ||
    route.includes('/app') ||
    name.includes('dashboard') ||
    name.includes('overview') ||
    name.includes('analytics')
  const sidebarLayout = page.layout === 'sidebar'

  if (mode === 'mobile') {
    return ['Nav_Mobile', 'Layout_PageHeader', 'Content_Text', 'Content_CTA']
  }

  if (isLogin || isSignup) {
    return ['Layout_AuthSplit']
  }

  if (isContact) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Form_Contact', 'Content_Text', 'Nav_Footer']
  }

  if (isDocs) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Layout_TwoColumn', 'Content_Text', 'Data_Table', 'Content_FAQ']
  }

  if (isArticle) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Text', 'Content_CTA', 'Nav_Footer']
  }

  if (isBlog) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_BlogGrid', 'Content_CTA', 'Nav_Footer']
  }

  if (isCheckout) {
    return ['Layout_PageHeader', 'Form_Contact', 'Data_Table', 'Content_CTA']
  }

  if (isCart) {
    return ['Nav_TopBar', 'Data_Table', 'Content_Stats', 'Content_CTA', 'Nav_Footer']
  }

  if (isOrderSuccess) {
    return ['Layout_PageHeader', 'Content_Text', 'Content_CTA', 'Nav_Footer']
  }

  if (isApi) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Data_Table', 'Data_Chart']
  }

  if (isMedia) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Card', 'Layout_TwoColumn']
  }

  if (isNotifications) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Data_Table', 'Content_Stats']
  }

  if (isTeam) {
    return [
      'Nav_TopBar',
      'Art_Hero_Cinematic',
      'Art_Team_Portraits',
      'Art_Testimonial_Spotlight',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isProfile) {
    return ['Nav_TopBar', 'Hero_Split', 'Content_Card', 'Content_Stats', 'Nav_Footer']
  }

  if (isOnboarding) {
    return ['Layout_PageHeader', 'Content_Text', 'Form_Signup', 'Content_CTA']
  }

  if (isErrorPage) {
    return ['Layout_EmptyState', 'Content_CTA']
  }

  if (isProductDetail) {
    return ['Nav_TopBar', 'Layout_TwoColumn', 'Content_Text', 'Content_CTA', 'Nav_Footer']
  }

  if (isProductList) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Card', 'Content_Pricing', 'Nav_Footer']
  }

  if (sidebarLayout || (mode === 'saas' && isDashboard)) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_KPI_Row', 'Data_Table', 'Data_Chart']
  }

  if (isHome) {
    return [
      'Nav_TopBar',
      'Art_Hero_Bento',
      'Art_Logos_Marquee',
      'Art_Feature_IconMatrix',
      'Art_Stats_BigNumber',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isPricing) {
    return [
      'Nav_TopBar',
      'Art_Hero_StatsFloat',
      'Art_Pricing_Spotlight',
      'Art_Comparison_Matrix',
      'Art_FAQ_Split',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isDashboard) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_KPI_Row', 'Data_Chart', 'Data_Table']
  }

  return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Text', 'Nav_Footer']
}

function createSection(block_type: SeedBlockType, order: number): SeedPageSessionSection {
  return {
    section_id: `seed-${block_type}-${order + 1}`,
    block_type,
    order,
    approved: true,
    locked_props: {},
    flexible_props: {},
    content_slots: {},
    states: {},
  }
}

export function buildSeedPageSections(params: {
  page: ArchPage
  profileId: ArchProfileId | null
}): SeedPageSessionSection[] {
  const stack = buildStack(params)
  return stack.map((blockType, idx) => createSection(blockType, idx))
}
