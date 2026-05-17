import { create } from 'zustand'
import type { ProjectContext } from '../parsers/context.parser'
import { type ParsedProfile, profileToTokens } from '../parsers/profile.parser'
import { useTokensStore } from './tokens.store'

export interface Page {
  id: string
  title: string
  route: string
  type: 'public' | 'auth' | 'admin' | 'modal' | 'embed'
  navLabel?: string
  navIcon?: string
  navPosition?: number
  showInNav?: boolean
  parentId?: string
  linkedPageIds?: string[]
}

export interface TemplateConfig {
  headerStyle: string
  footerStyle: string
  heroStyle: string
  colorProfile: string
  typography: string
  spacing: string
  formStyle: string
  headerLogoPosition: 'left' | 'center' | 'right'
  headerMenuPosition: 'left' | 'center' | 'right'
  headerMenuMode: 'topbar' | 'sidebar'
  headerShowCta: boolean
  headerShowSocials: boolean
  headerShowPhone: boolean
  footerColumns: 1 | 3 | 4 | 5
  footerShowSocials: boolean
  footerShowPhone: boolean
}

export interface Tab {
  id: string
  title: string
  type: 'dashboard' | 'sitemap' | 'template' | 'wireframe' | 'menus' | 'canvas' | 'profiles' | 'profile-editor' | 'settings' | 'ai' | 'layout-designer' | 'theme-editor' | 'asset-manager' | 'export' | 'review' | 'tokens' | 'wireframes'
  contentId?: string
}

interface SessionState {
  projectContext: ProjectContext | null
  sitemap: Page[]
  profiles: ParsedProfile[]
  tabs: Tab[]
  activeTabId: string | null
  selectedProfile: string | null
  selectedPageId: string | null
  templateConfig: TemplateConfig
  logs: string[]
  isLoading: boolean
  error: string | null
  lang: string
  theme: 'light' | 'dark'
  isAssetManagerOpen: boolean
  fetchContext: () => Promise<void>
  fetchProfiles: () => Promise<void>
  setSitemap: (sitemap: Page[]) => void
  setSelectedPageId: (id: string | null) => void
  setSelectedProfile: (name: string | null) => void
  updatePage: (id: string, updates: Partial<Page>) => void
  updateTemplateConfig: (updates: Partial<TemplateConfig>) => void
  addLog: (log: string) => void
  openTab: (tab: Tab) => void
  closeTab: (id: string) => void
  setActiveTabId: (id: string) => void
  setLang: (lang: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  hydratePreferences: () => void
  openAssetManager: () => void
  closeAssetManager: () => void
  toggleAssetManager: () => void
  applyProfileToTokens: (name: string) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  projectContext: null,
  sitemap: [],
  profiles: [],
  tabs: [{ id: 'dashboard', title: 'Dashboard', type: 'dashboard' }],
  activeTabId: 'dashboard',
  selectedProfile: null,
  selectedPageId: null,
  templateConfig: {
    headerStyle: 'simple',
    footerStyle: 'simple',
    heroStyle: 'centered',
    colorProfile: 'dark',
    typography: 'modern',
    spacing: 'compact',
    formStyle: 'minimal',
    headerLogoPosition: 'left',
    headerMenuPosition: 'right',
    headerMenuMode: 'topbar',
    headerShowCta: true,
    headerShowSocials: false,
    headerShowPhone: false,
    footerColumns: 3,
    footerShowSocials: true,
    footerShowPhone: false,
  },
  logs: [],
  isLoading: false,
  error: null,
  lang: 'en',
  theme: 'dark',
  isAssetManagerOpen: false,
  fetchContext: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/context')
      if (!res.ok) throw new Error('Failed to fetch context')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      const context = data.data || { pages: [], sections: [], design_tokens: {}, sitemap: [] }
      set({ 
        projectContext: context, 
        sitemap: context.pages || [],
        isLoading: false 
      })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },
  fetchProfiles: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/profiles')
      if (!res.ok) throw new Error('Failed to fetch profiles')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      set({ profiles: data.profiles || [], isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },
  setSitemap: (sitemap) => set({ sitemap }),
  setSelectedPageId: (selectedPageId) => set({ selectedPageId }),
  setSelectedProfile: (selectedProfile) => set((state) => {
    if (selectedProfile) {
      setTimeout(() => {
        state.applyProfileToTokens(selectedProfile)
      }, 0)
    }
    return { selectedProfile }
  }),
  updatePage: (id, updates) => set((state) => ({
    sitemap: state.sitemap.map((page) => 
      page.id === id ? { ...page, ...updates } : page
    )
  })),
  updateTemplateConfig: (updates) => set((state) => ({
    templateConfig: { ...state.templateConfig, ...updates }
  })),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  openTab: (tab) => set((state) => {
    const exists = state.tabs.find((t) => t.id === tab.id)
    if (exists) {
      return { activeTabId: tab.id }
    }
    return { tabs: [...state.tabs, tab], activeTabId: tab.id }
  }),
  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter((t) => t.id !== id)
    let newActiveId = state.activeTabId
    if (state.activeTabId === id) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
    }
    return { tabs: newTabs, activeTabId: newActiveId }
  }),
  setActiveTabId: (activeTabId) => set({ activeTabId }),
  setLang: (lang) => set({ lang }),
  setTheme: (theme) => set({ theme }),
  hydratePreferences: () => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme')
    const savedLang = localStorage.getItem('lang')
    const theme = savedTheme === 'light' ? 'light' : 'dark'
    const lang = savedLang === 'ar' ? 'ar' : 'en'

    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')

    set({ theme, lang })
  },
  openAssetManager: () => set({ isAssetManagerOpen: true }),
  closeAssetManager: () => set({ isAssetManagerOpen: false }),
  toggleAssetManager: () => set((state) => ({ isAssetManagerOpen: !state.isAssetManagerOpen })),
  applyProfileToTokens: (name) => {
    const state = useSessionStore.getState()
    const profile = state.profiles.find(p => p.name === name)
    if (!profile) return

    const newTokens = profileToTokens(profile)
    const currentTokens = useTokensStore.getState().tokens

    useTokensStore.getState().setTokens({
      ...currentTokens,
      colors: {
        ...currentTokens.colors,
        ...(newTokens.colors || {})
      },
      typography: {
        ...currentTokens.typography,
        ...(newTokens.typography || {})
      },
      spacing: {
        ...currentTokens.spacing,
        ...(newTokens.spacing || {})
      },
      radius: {
        ...currentTokens.radius,
        ...(newTokens.radius || {})
      },
      motion: {
        ...currentTokens.motion,
        ...(newTokens.motion || {})
      }
    })
  }
}))
