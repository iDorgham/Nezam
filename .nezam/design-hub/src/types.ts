/** NEZAM Design Hub — shared types. */

export type ThemeMode = 'light' | 'dark'
export type Direction = 'ltr' | 'rtl'
export type Device = 'mobile' | 'tablet' | 'desktop'
export type Density = 'compact' | 'cozy' | 'spacious'
export type ShadowStyle = 'none' | 'soft' | 'crisp' | 'dramatic'

/** Right-rail tabs. */
export type BuilderMode =
  | 'sitemap'
  | 'profiles'
  | 'brand'
  | 'styles'
  | 'layout'
  | 'inspector'
  | 'layers'
  | 'comments'
  | 'interactions'
  | 'ai'
  | 'saved'
  | 'history'

/** Left toolbar tools (Photoshop-style). */
export type Tool =
  | 'select'
  | 'hand'
  | 'ai'
  | 'comment'
  | 'text'
  | 'paragraph'
  | 'image'
  | 'icon'
  | 'section'

/* ── Design tokens ──────────────────────────────────────────── */

export interface ColorTokens {
  brand: string
  brandHover: string
  brandSubtle: string
  onBrand: string
  accent: string
  bg: string
  surface: string
  elevated: string
  text: string
  textMuted: string
  textSubtle: string
  border: string
  borderStrong: string
  success: string
  warning: string
  danger: string
  info: string
}

export type ColorTokenKey = keyof ColorTokens

export interface Profile {
  id: string
  name: string
  arabicName: string
  personality: string
  tagline: string
  fontSans: string
  fontDisplay: string
  radius: number
  density: Density
  shadow: ShadowStyle
  light: ColorTokens
  dark: ColorTokens
}

export interface ShapeTokens {
  radius: number
  density: Density
  shadow: ShadowStyle
  fontSans: string
  fontDisplay: string
}

export interface ResolvedTokens extends ColorTokens, ShapeTokens {}

/* ── Blocks & archetypes ────────────────────────────────────── */

export type BlockKind =
  | 'nav'
  | 'hero'
  | 'featureGrid'
  | 'stats'
  | 'productGrid'
  | 'articleList'
  | 'pricing'
  | 'dashboard'
  | 'vendorGrid'
  | 'cta'
  | 'footer'
  | 'arabic'
  | 'text'
  | 'paragraph'
  | 'image'
  | 'icon'
  | 'section'

/** A section block in the preview. `content` is kind-specific, loosely typed. */
export interface Block {
  id: string
  kind: BlockKind
  label: string
  arabicLabel: string
  content: Record<string, unknown>
}

export type ArchetypeKind =
  | 'landing'
  | 'saas'
  | 'micro-saas'
  | 'saas-xplatform'
  | 'blog'
  | 'cms'
  | 'store'
  | 'multivendor'
  | 'portfolio'
  | 'dashboard-app'

export interface Archetype {
  id: ArchetypeKind
  name: string
  arabicName: string
  description: string
  /** Ordered block kinds that make up this archetype. */
  blocks: BlockKind[]
  /** Sitemap: apps with nav menus and pages. */
  apps: ArchetypeApp[]
}

/* ── Per-node styling ───────────────────────────────────────── */

export type TextAlign = 'start' | 'center' | 'end' | 'justify'
export type BgFill = 'solid' | 'gradient' | 'image'
export type BgScroll = 'normal' | 'fixed' | 'parallax'
export type TextTransform = 'none' | 'uppercase' | 'capitalize' | 'lowercase'
export type TextDecoration = 'none' | 'underline'

/** Style overrides for a single node (section container or element). */
export interface NodeStyle {
  // typography
  fontFamily?: string
  fontScale?: number
  weight?: number
  align?: TextAlign
  letterSpacing?: number
  lineHeight?: number
  paragraphSpacing?: number
  textColor?: string
  textTransform?: TextTransform
  textDecoration?: TextDecoration
  // fill / background
  bgFill?: BgFill
  bg?: string
  bgTo?: string
  bgImage?: string
  bgScroll?: BgScroll
  // box
  padding?: number
  margin?: number
  gap?: number
  minHeight?: number
  columns?: number
  radius?: number
  borderWidth?: number
  borderColor?: string
  shadow?: ShadowStyle
  opacity?: number
  // raw escape hatch
  css?: Record<string, string>
}

export type NodeStyleKey = keyof NodeStyle

/* ── Selection ──────────────────────────────────────────────── */

export type SelectionScope = 'page' | 'section' | 'element'

/** Whether a node is edited primarily as text, a card, or a generic box. */
export type NodeRole = 'text' | 'card' | 'box'

export interface Selection {
  scope: SelectionScope
  blockId?: string
  nodeId?: string
  label: string
  role: NodeRole
}

/* ── Comments ───────────────────────────────────────────────── */

export interface Comment {
  id: string
  nodeId: string
  blockId: string
  label: string
  text: string
  resolved: boolean
  createdAt: number
}

/* ── Page-level settings ────────────────────────────────────── */

export interface PageStyle {
  width: number
  padding: number
  bg?: string
}

/* ── Saved designs & history ────────────────────────────────── */

export interface SavedDesign {
  id: string
  name: string
  profileId: string
  overrides: Partial<ResolvedTokens>
  archetypeId: ArchetypeKind
  theme: ThemeMode
  createdAt: number
  swatch: [string, string, string]
}

export interface HistoryEntry {
  id: string
  label: string
  at: number
  profileId: string
  overrides: Partial<ResolvedTokens>
}

/* ── Animation timeline ─────────────────────────────────────── */

export type AnimProperty = 'opacity' | 'y' | 'x' | 'scale' | 'rotate' | 'blur'

export interface Keyframe {
  id: string
  at: number
  property: AnimProperty
  from: number
  to: number
}

export interface AnimTrack {
  id: string
  target: string
  label: string
  keyframes: Keyframe[]
}

export interface TimelineState {
  duration: number
  tracks: AnimTrack[]
  playhead: number
  playing: boolean
  stagger: number
  scrollTrigger: boolean
}

/* ── Sitemap ────────────────────────────────────────────────── */

export interface SitemapNode {
  id: string
  name: string
  arabicName: string
  /** Sub-pages nested under this page. */
  children?: SitemapNode[]
  /** Section names pre-populated when loading this node from an archetype. */
  sectionNames?: string[]
}

/* ── Sitemap Builder — 5-level hierarchy ─────────────────────── */
/*   App → NavMenu → Page → Sub-page → Section                    */

export type PageStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'done'
  | 'live'
  | 'attention'

export interface SitemapBuilderSection {
  id: string
  name: string
  description: string
}

export interface SitemapBuilderPage {
  id: string
  name: string
  status?: PageStatus
  sections: SitemapBuilderSection[]
  collapsed: boolean
  /** Sub-pages nested under this page. */
  subPages?: SitemapBuilderPage[]
}

export type NavMenuKind = 'main' | 'footer' | 'sidebar' | 'utility' | 'custom'

export interface SitemapBuilderNavMenu {
  id: string
  name: string
  kind: NavMenuKind
  pages: SitemapBuilderPage[]
  collapsed: boolean
}

export type AppKind =
  | 'marketing'
  | 'dashboard-client'
  | 'dashboard-admin'
  | 'mobile'
  | 'desktop'
  | 'api'
  | 'custom'

export interface SitemapBuilderApp {
  id: string
  name: string
  kind: AppKind
  navMenus: SitemapBuilderNavMenu[]
  collapsed: boolean
}

/* ── Archetype sitemap templates ────────────────────────────── */

export interface ArchetypeNavMenu {
  name: string
  arabicName: string
  kind: NavMenuKind
  /** Pages (and their optional sub-pages / section names). */
  pages: SitemapNode[]
}

export interface ArchetypeApp {
  name: string
  arabicName: string
  kind: AppKind
  navMenus: ArchetypeNavMenu[]
}
