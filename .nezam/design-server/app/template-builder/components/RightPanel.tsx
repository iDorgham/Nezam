'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Check, Save, Images, Layers, Palette, Settings2,
  AlignLeft, Globe, LayoutTemplate, Megaphone, MousePointer,
  Share2, ChevronLeft, ChevronRight, Type, Sliders, Zap, Grid3X3,
  Search, X, Square, Move, Film, Layout, Code2, LayoutGrid, Terminal,
  Sun, Moon, Lock, HelpCircle, FileText, Tag, Bot, Layers2,
} from 'lucide-react'
import { restartOnboarding } from '@/components/onboarding/OnboardingTour'
import LayersPanel, { type SectionLayer } from './LayersPanel'
import AutomationPanel from './AutomationPanel'
import CategoriesPanel from './CategoriesPanel'
import GeneralSettingsPanel from './GeneralSettingsPanel'
import PagesPanel from './PagesPanel'
import MenusPanel from './MenusPanel'
import AppSettingsPanel from './AppSettingsPanel'
import {
  Card, CardHeader, FieldLabel, SegmentControl, OptionCard,
  ToggleRow, Select, Input, Divider, Badge, CollapsibleSection,
  ColorDot, PropertyRow, Stepper, MiniToggle
} from './primitives'
import {
  headerStyleOptions, menuModeOptions, positionOptions,
  footerStyleOptions, footerColumnOptions, heroStyleOptions,
  websiteTypeOptions, topBarThemeOptions, colorPaletteOptions,
  fontOptions, buttonStyleOptions, buttonWeightOptions,
  inputVariantOptions, radiusOptions, spacingOptions,
  animationOptions, transitionSpeedOptions,
} from './config'
import { STYLE_ARCHETYPES, nextStyle, getStyle } from './styleRandomizer'
import { useSessionStore } from '@/lib/store/session.store'
import type { TemplateConfig } from '@/lib/store/session.store'
import WidgetLibraryPanel from '@/components/canvas/WidgetLibraryPanel'
import PagesMenuBoard from './PagesMenuBoard'
import type { WebsiteType, RadiusScale, TopBarTheme, ButtonStyle, InputVariant, FontValue } from './config'
import type { DesignSystemState } from './LeftPanel'

type Tab = 'settings' | 'style' | 'structure' | 'components' | 'console' | 'assets' | 'pages' | 'menus' | 'layers' | 'categories' | 'general' | 'automation' | 'appsettings'

const RAIL_TABS: { id: Tab; icon: React.ReactNode; label: string; group?: string }[] = [
  // Design group
  { id: 'settings',   icon: <Settings2  size={12} />, label: 'Settings',   group: 'design'  },
  { id: 'style',      icon: <Palette    size={12} />, label: 'Style',       group: 'design'  },
  { id: 'structure',  icon: <Layers     size={12} />, label: 'Structure',   group: 'design'  },
  { id: 'components', icon: <LayoutGrid size={12} />, label: 'Widgets',     group: 'design'  },
  // Content group
  { id: 'layers',     icon: <Layers2   size={12} />, label: 'Layers',       group: 'content' },
  { id: 'categories', icon: <Tag        size={12} />, label: 'Sections',    group: 'content' },
  { id: 'assets',     icon: <Images     size={12} />, label: 'Assets',      group: 'content' },
  // Site group
  { id: 'pages',      icon: <FileText   size={12} />, label: 'Pages',      group: 'site'    },
  { id: 'menus',      icon: <AlignLeft  size={12} />, label: 'Menus',      group: 'site'    },
  { id: 'general',    icon: <Globe      size={12} />, label: 'SEO/Domain',  group: 'site'    },
  // System group
  { id: 'automation', icon: <Bot        size={12} />, label: 'Automation',  group: 'system'  },
  { id: 'appsettings',icon: <Settings2  size={12} />, label: 'App Config', group: 'system'  },
]

interface Props {
  templateConfig: TemplateConfig
  update: (u: Partial<TemplateConfig>) => void
  profiles: { name: string; category: string }[]
  onProfileClick: (name: string) => void
  lang: string; t: (en: string, ar: string) => string
  saving: boolean; saved: boolean; onSave: () => void
  openAssetManager: () => void
  websiteType: WebsiteType; setWebsiteType: (v: WebsiteType) => void
  showTopBar: boolean; setShowTopBar: (v: boolean) => void
  topBarText: string; setTopBarText: (v: string) => void
  topBarTheme: TopBarTheme; setTopBarTheme: (v: TopBarTheme) => void
  radius: RadiusScale; setRadius: (v: RadiusScale) => void
  ds: DesignSystemState; setDs: React.Dispatch<React.SetStateAction<DesignSystemState>>
  styleName?: string
  animation?: string; setAnimation?: (v: string) => void
  transitionSpeed?: string; setTransitionSpeed?: (v: string) => void

  // Custom advanced animation parameters
  animationDelay: number; setAnimationDelay: (v: number) => void
  animationDuration: number; setAnimationDuration: (v: number) => void
  animationTimingFunction: 'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier'; setAnimationTimingFunction: (v: 'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier') => void
  animationCustomCubic: string; setAnimationCustomCubic: (v: string) => void
  animationIterationCount: 'once' | 'infinite'; setAnimationIterationCount: (v: 'once' | 'infinite') => void

  // Dynamic Google Font parameters
  googleFontName: string; setGoogleFontName: (v: string) => void
  googleFontUrl: string; setGoogleFontUrl: (v: string) => void

  iconPack: 'lucide' | 'material'; setIconPack: (v: 'lucide' | 'material') => void
  animateTrigger: number; setAnimateTrigger: React.Dispatch<React.SetStateAction<number>>
  // Layers
  layers: SectionLayer[]
  setLayers: (layers: SectionLayer[]) => void
  // Theme
  theme: string
  setTheme: (t: string) => void
}


const SEARCH_INDEX = [
  { id: 'template',    label: 'Template Type',     keywords: 'industry website saas ecommerce agency dashboard ai portfolio photography news' },
  { id: 'topbar',      label: 'Announcement Bar',  keywords: 'top bar banner announcement ribbon promo text' },
  { id: 'colors',      label: 'Color Palette',     keywords: 'color colour primary brand palette orange cyan violet emerald rose amber slate' },
  { id: 'typography',  label: 'Typography',        keywords: 'font typeface inter outfit geist playfair lora mono heading body' },
  { id: 'buttons',     label: 'Button System',     keywords: 'button cta solid outline ghost soft weight bold' },
  { id: 'inputs',      label: 'Form Inputs',       keywords: 'input form field outlined underline filled soft variant' },
  { id: 'radius',      label: 'Border Radius',     keywords: 'radius corner rounded pill none sm md lg full' },
  { id: 'spacing',     label: 'Layout Density',    keywords: 'spacing density compact balanced spacious padding gutters' },
  { id: 'animation',   label: 'Motion & Animation',keywords: 'animation motion fade slide spring transition speed' },
  { id: 'header',      label: 'Header Layout',     keywords: 'header navigation navbar topbar menu logo cta phone social mega sidebar' },
  { id: 'hero',        label: 'Hero Section',      keywords: 'hero landing first-fold centered split video showcase' },
  { id: 'footer',      label: 'Footer Structure',  keywords: 'footer columns simple multi social phone copyright' },
]

export default function RightPanel(props: Props) {
  const {
    templateConfig: cfg, update, t, saving, saved, onSave,
    ds, setDs, styleName, lang,
  } = props

  const [tab, setTab] = useState<Tab>('settings')
  const { logs, theme, setTheme, setLang } = useSessionStore()
  const [profilePage, setProfilePage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const PER = 6
  const pages = Math.ceil(props.profiles.length / PER)
  const vis = props.profiles.slice(profilePage * PER, profilePage * PER + PER)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SEARCH_INDEX.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  return (
    <div className="flex h-full border-l border-[#2e2e30] overflow-hidden bg-[#181819] text-[#e1e1e6]">

      {/* ── Icon tab rail ── */}
      <div className="w-10 shrink-0 flex flex-col items-center py-2 gap-0.5 bg-[#1c1c1e] border-r border-[#2a2a2c]">

        {/* Design group */}
        {(['settings','style','structure','components'] as Tab[]).map(id => {
          const rt = RAIL_TABS.find(r => r.id === id)!
          return (
            <button key={id} title={rt.label} onClick={() => setTab(id)}
              style={tab === id ? { background: 'var(--ds-primary)', color: '#fff', boxShadow: '0 2px 8px var(--ds-primary-subtle)' } : {}}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all text-[9px] ${
                tab === id ? '' : 'text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c]'
              }`}>
              {rt.icon}
            </button>
          )
        })}

        <div className="w-5 h-px bg-[#2a2a2c] my-1 shrink-0" />

        {/* Content group */}
        {(['layers','categories','assets'] as Tab[]).map(id => {
          const rt = RAIL_TABS.find(r => r.id === id)!
          return (
            <button key={id} title={rt.label} onClick={() => setTab(id)}
              style={tab === id ? { background: 'var(--ds-primary)', color: '#fff' } : {}}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                tab === id ? '' : 'text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c]'
              }`}>
              {rt.icon}
            </button>
          )
        })}

        <div className="w-5 h-px bg-[#2a2a2c] my-1 shrink-0" />

        {/* Site group */}
        {(['pages','menus','general'] as Tab[]).map(id => {
          const rt = RAIL_TABS.find(r => r.id === id)!
          return (
            <button key={id} title={rt.label} onClick={() => setTab(id)}
              style={tab === id ? { background: 'var(--ds-primary)', color: '#fff' } : {}}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                tab === id ? '' : 'text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c]'
              }`}>
              {rt.icon}
            </button>
          )
        })}

        <div className="w-5 h-px bg-[#2a2a2c] my-1 shrink-0" />

        {/* System group */}
        {(['automation','appsettings'] as Tab[]).map(id => {
          const rt = RAIL_TABS.find(r => r.id === id)!
          return (
            <button key={id} title={rt.label} onClick={() => setTab(id)}
              style={tab === id ? { background: 'var(--ds-primary)', color: '#fff' } : {}}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                tab === id ? '' : 'text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c]'
              }`}>
              {rt.icon}
            </button>
          )
        })}

        <div className="flex-1" />

        {/* Bottom utility buttons */}
        <div className="w-5 h-px bg-[#2a2a2c] mb-1 shrink-0" />

        {/* Console tab */}
        <button title="Console (logs)"
          onClick={() => setTab(tab === 'console' ? 'settings' : 'console')}
          className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
            tab === 'console' ? 'bg-ds-primary text-white' : 'text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c]'
          }`}>
          <Terminal size={11} />
        </button>

        {/* Lang toggle */}
        <button title={lang === 'en' ? 'عربي' : 'English'}
          onClick={toggleLang}
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] transition-all">
          <Globe size={11} />
        </button>

        {/* Theme toggle — colored icon shows current state */}
        <button
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-all hover:bg-[#2b2b2c]"
          style={{ color: theme === 'dark' ? '#f59e0b' : '#636366' }}
        >
          {theme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
        </button>

        {/* Help / restart onboarding */}
        <button title={t('Restart tutorial', 'إعادة تشغيل الدليل')}
          onClick={restartOnboarding}
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] transition-all">
          <HelpCircle size={11} />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Search — always visible at top (hidden for full-page tabs) */}
        {!['components', 'console', 'assets', 'pages', 'layers', 'categories', 'general', 'automation'].includes(tab) && (
          <div className="px-2 pt-2.5 pb-2 border-b border-[#2e2e30] shrink-0">
            <div className="relative">
              <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#636366] pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search properties…', 'بحث في الخصائص…')}
                className="w-full bg-[#232324] border border-[#2e2e30] rounded-lg pl-7 pr-7 py-1.5 text-[10px] text-[#e1e1e6] placeholder:text-[#48484a] focus:outline-none focus:border-[#636366] transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#636366] hover:text-[#e1e1e6] transition-colors">
                  <X size={10} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Components tab — full WidgetLibraryPanel ── */}
        {tab === 'components' && (
          <div className="flex-1 overflow-hidden">
            <WidgetLibraryPanel lang={props.lang} />
          </div>
        )}

        {/* ── Console tab — session log viewer ── */}
        {tab === 'console' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
              <Terminal size={11} className="text-ds-primary" />
              <span className="text-[10px] font-semibold text-[#a1a1a6]">Console</span>
              <span className="ml-auto text-[9px] text-[#48484a]">{logs.length} entries</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {logs.length === 0 ? (
                <p className="text-[9px] text-[#48484a] text-center py-10">
                  No logs yet. Execute an action to see output.
                </p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-[9px] text-[#8e8e93] font-mono px-2 py-1.5 rounded bg-[#202021] border border-[#2e2e30] whitespace-pre-wrap leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Assets tab — inline media/icon library ── */}
        {tab === 'assets' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
              <Images size={11} className="text-ds-primary" />
              <span className="text-[10px] font-semibold text-[#a1a1a6]">Asset Manager</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Unsplash quick search */}
              <div className="space-y-2">
                <div className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider">Stock Photos</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Abstract Tech', 'Egyptian Cairo', 'Business Team', 'Dark UI'].map(label => (
                    <div key={label} className="h-14 rounded border border-[#2e2e30] bg-[#1c1c1e] flex items-center justify-center text-[8px] text-[#48484a] hover:border-ds-primary/40 cursor-pointer transition-all hover:text-[#8e8e93]">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Icon packs */}
              <div className="space-y-2">
                <div className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider">Icon Pack</div>
                <div className="flex gap-1.5">
                  {['lucide', 'material'].map(pack => (
                    <button
                      key={pack}
                      onClick={() => props.setIconPack(pack as any)}
                      className={`flex-1 py-1.5 text-[9px] font-semibold rounded border transition-all ${
                        props.iconPack === pack
                          ? 'border-ds-primary bg-ds-primary/10 text-ds-primary'
                          : 'border-[#2e2e30] bg-[#1c1c1e] text-[#636366] hover:text-[#a1a1a6]'
                      }`}
                    >
                      {pack === 'lucide' ? 'Lucide' : 'Material'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Upload */}
              <div className="space-y-1.5">
                <div className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider">Upload</div>
                <button
                  onClick={props.openAssetManager}
                  className="w-full h-10 rounded border-2 border-dashed border-[#2e2e30] hover:border-ds-primary/50 text-[9px] text-[#48484a] hover:text-[#8e8e93] transition-all flex items-center justify-center gap-1.5"
                >
                  <Images size={10} />
                  Open Full Asset Manager
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ── Layers tab ── */}
        {tab === 'layers' && (
          <div className="flex-1 overflow-hidden">
            <LayersPanel
              layers={props.layers}
              setLayers={props.setLayers}
              lang={props.lang}
              t={props.t}
            />
          </div>
        )}

        {/* ── Categories / Section Library tab ── */}
        {tab === 'categories' && (
          <div className="flex-1 overflow-hidden">
            <CategoriesPanel
              lang={props.lang}
              t={props.t}
              onAddSection={(sectionId) => {
                // Map category template IDs → visible template config keys
                const MAP: Record<string, string> = {
                  'feat-grid': 'showFeatures', 'feat-cards': 'showFeatures', 'feat-list': 'showFeatures',
                  'test-cards': 'showTestimonials', 'test-logos': 'showTestimonials', 'test-stats': 'showStats',
                  'team-grid': 'showTeam',
                  'price-3col': 'showPricing', 'price-toggle': 'showPricing', 'price-simple': 'showPricing',
                  'form-basic': 'showForm', 'form-map': 'showForm', 'newsletter': 'showForm',
                }
                const key = MAP[sectionId]
                if (key) props.update({ [key]: true } as any)
              }}
            />
          </div>
        )}

        {/* ── General Settings tab ── */}
        {tab === 'general' && (
          <div className="flex-1 overflow-hidden">
            <GeneralSettingsPanel lang={props.lang} t={props.t} />
          </div>
        )}

        {/* ── Automation & AI Agent tab ── */}
        {tab === 'automation' && (
          <div className="flex-1 overflow-hidden">
            <AutomationPanel lang={props.lang} t={props.t} />
          </div>
        )}

        {/* ── Pages manager tab ── */}
        {tab === 'pages' && (
          <div className="flex-1 overflow-hidden">
            <PagesPanel lang={props.lang} t={props.t} />
          </div>
        )}

        {/* ── Menus builder tab ── */}
        {tab === 'menus' && (
          <div className="flex-1 overflow-hidden">
            <MenusPanel lang={props.lang} t={props.t} />
          </div>
        )}

        {/* ── App Settings tab ── */}
        {tab === 'appsettings' && (
          <div className="flex-1 overflow-hidden">
            <AppSettingsPanel lang={props.lang} t={props.t} theme={props.theme} setTheme={props.setTheme} />
          </div>
        )}

        {/* Scrollable panel body — hidden when special full-height tabs are active */}
        <div className={`flex-1 overflow-y-auto p-2 space-y-2 select-none ${['components', 'console', 'assets', 'pages', 'menus', 'layers', 'categories', 'general', 'automation', 'appsettings'].includes(tab) ? 'hidden' : ''}`}>


          {/* ── SEARCH RESULTS ── */}
          {isSearching && (
            <div className="space-y-1">
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-[#8e8e93]">No properties found for "{searchQuery}"</div>
              ) : (
                searchResults.map(r => (
                  <button key={r.id}
                    onClick={() => {
                      setSearchQuery('')
                      if (['template', 'topbar'].includes(r.id)) setTab('settings')
                      else if (['colors', 'typography', 'buttons', 'inputs', 'radius', 'spacing', 'animation'].includes(r.id)) setTab('style')
                      else setTab('structure')
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded border border-[#2e2e30] bg-[#202021] hover:border-ds-primary/50 hover:bg-ds-primary/5 transition-all text-start"
                  >
                    <span className="text-[10px] font-bold text-[#e1e1e6] flex-1">{r.label}</span>
                    <ChevronRight size={10} className="text-[#8e8e93]" />
                  </button>
                ))
              )}
            </div>
          )}

          {/* ════════ SETTINGS TAB — Template & Context ════════ */}
          {!isSearching && tab === 'settings' && (
            <>
              {/* Active named style banner */}
              {styleName && (
                <div className="flex items-center gap-2 px-2 py-1.5 bg-ds-primary/5 border border-ds-primary/20 rounded">
                  <Zap size={11} className="text-ds-primary" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-ds-primary truncate">{styleName}</div>
                    <div className="text-[8px] text-[#8e8e93]">Coherent design archetype active</div>
                  </div>
                </div>
              )}

              {/* Template Context */}
              <CollapsibleSection
                title={t('Template Context', 'سياق القالب')}
                description={t('Industry & niche context', 'نوع الموقع والمحتوى المعروض')}
                icon={<Globe size={11} />}
                defaultOpen
              >
                <PropertyRow label={t('Niche Profile', 'تخصص الموقع')}>
                  <Select
                    value={props.websiteType}
                    onChange={v => props.setWebsiteType(v as WebsiteType)}
                    options={websiteTypeOptions.map(opt => ({
                      value: opt.value,
                      label: t(opt.label, opt.labelAr),
                    }))}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Announcement Bar */}
              <CollapsibleSection
                title={t('Announcement Bar', 'شريط الإعلانات')}
                description={t('Promotional banner above header', 'شريط ترويجي أعلى الترويسة')}
                icon={<Megaphone size={11} />}
                defaultOpen={props.showTopBar}
              >
                <PropertyRow label={t('Show Announcement', 'تفعيل الشريط')}>
                  <MiniToggle active={props.showTopBar} onClick={() => props.setShowTopBar(!props.showTopBar)} />
                </PropertyRow>
                
                {props.showTopBar && (
                  <>
                    <PropertyRow label={t('Banner Color', 'لون الشريط')}>
                      <Select
                        value={props.topBarTheme}
                        onChange={v => props.setTopBarTheme(v as TopBarTheme)}
                        options={topBarThemeOptions.map(o => ({ value: o.value, label: o.label }))}
                      />
                    </PropertyRow>
                    <PropertyRow label={t('Promo Text', 'نص الإعلان')}>
                      <Input value={props.topBarText} onChange={props.setTopBarText} placeholder="Enter copy…" />
                    </PropertyRow>
                  </>
                )}
              </CollapsibleSection>

              {/* Trust & Payment Badges */}
              <CollapsibleSection
                title={t('Trust & Payment Badges', 'شارات الدفع والثقة')}
                description={t('Show or hide payment gateway logos and trust indicators', 'إظهار أو إخفاء شارات بوابات الدفع')}
                icon={<Code2 size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('InstaPay Badge', 'شارة انستاباي')}>
                  <MiniToggle
                    active={cfg.showTeam !== false}
                    onClick={() => update({ showTeam: cfg.showTeam === false ? true : false })}
                  />
                </PropertyRow>
                <PropertyRow label={t('Paymob / Fawry', 'فوري وبيموب')}>
                  <MiniToggle
                    active={cfg.showStats !== false}
                    onClick={() => update({ showStats: cfg.showStats === false ? true : false })}
                  />
                </PropertyRow>
              </CollapsibleSection>
            </>
          )}

          {/* ════════ STYLE TAB — Coherent Preset Mixer ════════ */}
          {!isSearching && tab === 'style' && (
            <>
              {/* Coherent Design System & Style Preset Mixer */}
              <CollapsibleSection
                title={t('Style Preset Mixer', 'خلاط الأنماط الذكي')}
                description={t('Coherently blend design properties', 'مزج وتناسق خصائص التصميم')}
                icon={<Zap size={11} />}
                defaultOpen
              >
                <PropertyRow label={t('Design Archetype', 'النمط العام')}>
                  <Select
                    value={styleName || 'Custom'}
                    onChange={v => {
                      if (v !== 'Custom') {
                        props.onProfileClick(v)
                      }
                    }}
                    options={[
                      { value: 'Custom', label: t('Custom (Manual)', 'مخصص (يدوي)') },
                      ...STYLE_ARCHETYPES.map(a => ({ value: a.name, label: a.name }))
                    ]}
                  />
                </PropertyRow>

                {styleName && (
                  <div className="bg-[#202021] border border-[#2e2e30] rounded p-2 text-[9px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ds-primary">{styleName}</span>
                      <Badge color="primary">{t('Coherent Design', 'تصميم متناسق')}</Badge>
                    </div>
                    <p className="text-[8px] text-[#8e8e93] leading-relaxed italic">
                      "{getStyle(styleName)?.tagline || 'Sleek Egyptian tech accent'}"
                    </p>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    onClick={() => {
                      const currentName = styleName || 'Custom'
                      const mixed = nextStyle(currentName, props.websiteType)
                      props.onProfileClick(mixed.name)
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-[22px] rounded bg-ds-primary hover:bg-ds-primary-hover text-white font-bold text-[9px] uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Sliders size={10} />
                    {t('Coherent Random Mixer', 'خلاط الأنماط التلقائي')}
                  </button>
                </div>
              </CollapsibleSection>

              {/* Color Palette */}
              <CollapsibleSection
                title={t('Color Palette', 'لوحة الألوان')}
                description={t('Manual branding colors & schemes', 'الألوان والهوية البصرية')}
                icon={<Palette size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Brand Base', 'اللون الأساسي')}>
                  <Select
                    value={cfg.colorProfile}
                    onChange={v => props.onProfileClick(v)}
                    options={colorPaletteOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>

                <div className="flex flex-wrap gap-1.5 justify-center py-1 bg-[#1c1c1d] rounded border border-[#2e2e30] p-1.5">
                  {colorPaletteOptions.map(o => (
                    <ColorDot
                      key={o.value}
                      color={o.primary}
                      active={cfg.colorProfile === o.value}
                      label={o.label}
                      onClick={() => props.onProfileClick(o.value)}
                    />
                  ))}
                </div>

                {/* Workspace custom profiles if loaded */}
                {props.profiles.length > 0 && (
                  <div className="space-y-1 pt-1.5">
                    <Divider label={t('Saved Brand Profiles', 'الملفات المحفوظة')} />
                    <div className="flex items-center justify-between text-[8px] text-[#8e8e93]">
                      <span>{props.profiles.length} {t('profiles', 'ملفات')}</span>
                      {pages > 1 && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setProfilePage(p => Math.max(0, p - 1))} disabled={profilePage === 0}
                            className="p-0.5 rounded border border-[#2e2e30] disabled:opacity-30">
                            <ChevronLeft size={8} />
                          </button>
                          <span>{profilePage + 1}/{pages}</span>
                          <button onClick={() => setProfilePage(p => Math.min(pages - 1, p + 1))} disabled={profilePage >= pages - 1}
                            className="p-0.5 rounded border border-[#2e2e30] disabled:opacity-30">
                            <ChevronRight size={8} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-16 overflow-y-auto">
                      {vis.map(p => (
                        <button key={p.name} onClick={() => props.onProfileClick(p.name)}
                          className={`p-1 rounded text-start border truncate transition-all ${
                            cfg.colorProfile === p.name
                              ? 'border-ds-primary bg-ds-primary/5 text-ds-primary font-bold'
                              : 'border-[#2e2e30] bg-[#202021] hover:border-[#3a3a3c] text-[#8e8e93]'
                          }`}>
                          <div className="text-[8px] truncate">{p.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleSection>

              {/* Typography & Web Fonts */}
              <CollapsibleSection
                title={t('Typography & Web Fonts', 'الخطوط والمحارف')}
                description={t('Select design system fonts or dynamically load from Google Fonts', 'تحديد الخطوط وتنسيق النصوص وتحميلها ديناميكياً')}
                icon={<Type size={11} />}
                defaultOpen={true}
              >
                {/* System Preset Font */}
                <PropertyRow label={t('Base Preset', 'الخط الافتراضي')}>
                  <Select
                    value={ds.font}
                    onChange={v => {
                      setDs(d => ({ ...d, font: v as FontValue }))
                      props.setGoogleFontName('')
                    }}
                    options={fontOptions.map(f => ({ value: f.value, label: f.label }))}
                  />
                </PropertyRow>

                <Divider label={t('Google Fonts Loader', 'مستورد خطوط جوجل')} />

                {/* Google Fonts Quick Select */}
                <PropertyRow label={t('Google Font', 'خطوط جوجل')}>
                  <Select
                    value={props.googleFontName || 'none'}
                    onChange={v => {
                      if (v === 'none') {
                        props.setGoogleFontName('')
                        props.setGoogleFontUrl('')
                      } else {
                        props.setGoogleFontName(v)
                        props.setGoogleFontUrl(`https://fonts.googleapis.com/css2?family=${v.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`)
                      }
                    }}
                    options={[
                      { value: 'none', label: t('Use System Preset', 'استخدام الخط الافتراضي') },
                      { value: 'Cairo', label: 'Cairo (العربية)' },
                      { value: 'Tajawal', label: 'Tajawal (العربية)' },
                      { value: 'Alexandria', label: 'Alexandria (العربية)' },
                      { value: 'El Messiri', label: 'El Messiri (المسيري)' },
                      { value: 'Marhey', label: 'Marhey (مرحي)' },
                      { value: 'Lalezar', label: 'Lalezar (لاليزار)' },
                      { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Arabic (تقني)' },
                      { value: 'Mada', label: 'Mada (مضى)' },
                      { value: 'Harmattan', label: 'Harmattan (هارماتان)' },
                      { value: 'Amiri', label: 'Amiri (Classic)' },
                      { value: 'Reem Kufi', label: 'Reem Kufi' },
                      { value: 'Outfit', label: 'Outfit (Sleek)' },
                      { value: 'Space Grotesk', label: 'Space Grotesk (Tech)' },
                      { value: 'Syne', label: 'Syne (Artistic)' },
                      { value: 'Plus Jakarta Sans', label: 'Plus Jakarta (Modern)' },
                      { value: 'Cabinet Grotesk', label: 'Cabinet Grotesk' },
                      { value: 'Clash Display', label: 'Clash Display (Pro)' },
                      { value: 'Inter', label: 'Inter (Clean)' },
                    ]}
                  />
                </PropertyRow>

                {/* Custom Google Font input manually */}
                <PropertyRow label={t('Custom Name', 'خط مخصص')}>
                  <Input
                    value={props.googleFontName}
                    onChange={v => {
                      props.setGoogleFontName(v)
                      if (v.trim()) {
                        props.setGoogleFontUrl(`https://fonts.googleapis.com/css2?family=${v.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`)
                      } else {
                        props.setGoogleFontUrl('')
                      }
                    }}
                    placeholder="e.g. Space Grotesk"
                  />
                </PropertyRow>

                {/* Custom Font stylesheet URL view */}
                {props.googleFontUrl && (
                  <div className="bg-[#1c1c1d] border border-[#2e2e30] rounded p-1.5 text-[8px] font-mono text-[#8e8e93] break-all select-all">
                    {props.googleFontUrl}
                  </div>
                )}

                {/* Specimens rendering */}
                <div 
                  className="bg-[#202021] border border-[#2e2e30] rounded p-2 text-center text-xs text-[#e1e1e6] truncate"
                  style={{ fontFamily: props.googleFontName ? `"${props.googleFontName}"` : fontOptions.find(f => f.value === ds.font)?.stack }}
                >
                  {props.googleFontName ? `${props.googleFontName} Specimen` : 'Nezam Egyptian Tech'}
                </div>

                <Divider label={t('Icon Library Settings', 'إعدادات مكتبة الأيقونات')} />
                
                {/* Icons Switcher */}
                <PropertyRow label={t('Active Icons', 'حزمة الأيقونات')}>
                  <Select
                    value={props.iconPack}
                    onChange={v => props.setIconPack(v as any)}
                    options={[
                      { value: 'lucide', label: 'Lucide Icons (Standard)' },
                      { value: 'material', label: 'Material Icons (Google Symbols)' },
                    ]}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Button System */}
              <CollapsibleSection
                title={t('Button System', 'نظام الأزرار')}
                description={t('CTA styles & font weights', 'مظهر ونمط أزرار التفاعل')}
                icon={<MousePointer size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Button Style', 'شكل الزر')}>
                  <Select
                    value={ds.buttonStyle}
                    onChange={v => setDs(d => ({ ...d, buttonStyle: v as ButtonStyle }))}
                    options={buttonStyleOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
                <PropertyRow label={t('Font Weight', 'سمك الخط')}>
                  <Select
                    value={ds.buttonWeight}
                    onChange={v => setDs(d => ({ ...d, buttonWeight: v }))}
                    options={buttonWeightOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Form Inputs */}
              <CollapsibleSection
                title={t('Form Inputs', 'حقول النماذج')}
                description={t('Fields border styles & colors', 'تنسيق حقول الإدخال والمدخلات')}
                icon={<Layout size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Input Style', 'نمط الحقل')}>
                  <Select
                    value={ds.inputVariant}
                    onChange={v => setDs(d => ({ ...d, inputVariant: v as InputVariant }))}
                    options={inputVariantOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
                <PropertyRow label={t('Form Design', 'مظهر النموذج')}>
                  <Select
                    value={cfg.formStyle}
                    onChange={v => update({ formStyle: v })}
                    options={[
                      { value: 'minimal', label: t('Minimalist', 'بسيط ومسطح') },
                      { value: 'outlined', label: t('Outlined', 'محدد الحواف') },
                    ]}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Border Radius */}
              <CollapsibleSection
                title={t('Border Radius', 'انحناء الحواف')}
                description={t('Global component corner rounding', 'انحناء زوايا العناصر والمربعات')}
                icon={<Square size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Radius Scale', 'مقدار الانحناء')}>
                  <Select
                    value={props.radius}
                    onChange={v => props.setRadius(v as RadiusScale)}
                    options={radiusOptions.map(o => ({ value: o.value, label: `${o.label} (${o.px}px)` }))}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Layout Density */}
              <CollapsibleSection
                title={t('Layout Density', 'كثافة التخطيط')}
                description={t('Spacings & vertical paddings', 'المسافات الفاصلة بين الأقسام')}
                icon={<Move size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Spacing Scale', 'حجم المسافات')}>
                  <Select
                    value={cfg.spacing}
                    onChange={v => update({ spacing: v })}
                    options={spacingOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Motion & Animation */}
              <CollapsibleSection
                title={t('Animation Flow System', 'نظام الحركة المتقدم')}
                description={t('Configure professional entrance & interactive micro-animations', 'تأثيرات الحركة التفاعلية وزمن التحول البصري')}
                icon={<Film size={11} />}
                defaultOpen={true}
              >
                {/* Entrance Style */}
                <PropertyRow label={t('Entrance Motion', 'حركة الدخول')}>
                  <Select
                    value={props.animation ?? 'none'}
                    onChange={v => props.setAnimation?.(v)}
                    options={animationOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>

                {/* Animation Duration Slider */}
                <PropertyRow label={t('Duration', 'مدة الحركة')}>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="50"
                      value={props.animationDuration}
                      onChange={e => props.setAnimationDuration(Number(e.target.value))}
                      className="flex-1 accent-ds-primary h-1 bg-[#2c2c2e] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[9px] text-[#8e8e93] w-12 text-end font-mono">{props.animationDuration}ms</span>
                  </div>
                </PropertyRow>

                {/* Animation Delay Slider */}
                <PropertyRow label={t('Delay Offset', 'تأخير البداية')}>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={props.animationDelay}
                      onChange={e => props.setAnimationDelay(Number(e.target.value))}
                      className="flex-1 accent-ds-primary h-1 bg-[#2c2c2e] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[9px] text-[#8e8e93] w-12 text-end font-mono">{props.animationDelay}ms</span>
                  </div>
                </PropertyRow>

                {/* Transition Speed Option */}
                <PropertyRow label={t('Transition', 'سرعة التنقل')}>
                  <Select
                    value={props.transitionSpeed ?? 'normal'}
                    onChange={v => props.setTransitionSpeed?.(v)}
                    options={transitionSpeedOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>

                {/* Timing Function Selection */}
                <PropertyRow label={t('Timing Function', 'دالة التوقيت')}>
                  <Select
                    value={props.animationTimingFunction}
                    onChange={v => props.setAnimationTimingFunction(v as any)}
                    options={[
                      { value: 'ease', label: 'Ease (Standard)' },
                      { value: 'linear', label: 'Linear (Flat)' },
                      { value: 'ease-in-out', label: 'Ease-in-out (Smooth)' },
                      { value: 'cubic-bezier', label: 'Custom Cubic-Bezier' },
                    ]}
                  />
                </PropertyRow>

                {/* Custom Bezier Curve Input */}
                {props.animationTimingFunction === 'cubic-bezier' && (
                  <PropertyRow label={t('Bezier Curve', 'إحداثيات بيزير')}>
                    <Input
                      value={props.animationCustomCubic}
                      onChange={props.setAnimationCustomCubic}
                      placeholder="e.g. 0.4, 0, 0.2, 1"
                    />
                  </PropertyRow>
                )}

                {/* Iterations Selection */}
                <PropertyRow label={t('Iteration Count', 'مرات التكرار')}>
                  <Select
                    value={props.animationIterationCount}
                    onChange={v => props.setAnimationIterationCount(v as any)}
                    options={[
                      { value: 'once', label: t('Play Once', 'مرة واحدة') },
                      { value: 'infinite', label: t('Infinite Loop', 'تكرار مستمر') },
                    ]}
                  />
                </PropertyRow>

                {/* Interactive Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={() => props.setAnimateTrigger(prev => prev + 1)}
                    className="w-full flex items-center justify-center gap-1.5 h-[22px] rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Zap size={10} />
                    {t('Play Micro-Animations', 'تشغيل الحركة التفاعلية')}
                  </button>
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* ════════ STRUCTURE TAB — Page Structure & Sections ════════ */}
          {!isSearching && tab === 'structure' && (
            <>
              {/* Header */}
              <CollapsibleSection
                title={t('Header & Navigation', 'الهيدر والتنقل')}
                description={t('Logo and navigation links settings', 'خيارات شريط التنقل العلوي واللوجو')}
                icon={<AlignLeft size={11} />}
                defaultOpen
              >
                <PropertyRow label={t('Navbar Style', 'نمط الهيدر')}>
                  <Select
                    value={cfg.headerStyle}
                    onChange={v => update({ headerStyle: v })}
                    options={headerStyleOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
                <PropertyRow label={t('Menu Layout', 'طريقة العرض')}>
                  <Select
                    value={cfg.headerMenuMode}
                    onChange={v => update({ headerMenuMode: v as any })}
                    options={menuModeOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
                <PropertyRow label={t('Logo Align', 'موقع اللوجو')}>
                  <Select
                    value={cfg.headerLogoPosition}
                    onChange={v => update({ headerLogoPosition: v as any })}
                    options={positionOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
                <PropertyRow label={t('Menu Align', 'موقع القائمة')}>
                  <Select
                    value={cfg.headerMenuPosition}
                    onChange={v => update({ headerMenuPosition: v as any })}
                    options={positionOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>

                <Divider label={t('Header Elements', 'عناصر الهيدر')} />
                <PropertyRow label={t('Action Button', 'زر الإجراء (CTA)')}>
                  <MiniToggle active={cfg.headerShowCta} onClick={() => update({ headerShowCta: !cfg.headerShowCta })} />
                </PropertyRow>
                <PropertyRow label={t('Social Links', 'أيقونات التواصل')}>
                  <MiniToggle active={cfg.headerShowSocials} onClick={() => update({ headerShowSocials: !cfg.headerShowSocials })} />
                </PropertyRow>
                <PropertyRow label={t('Phone Number', 'رقم الهاتف')}>
                  <MiniToggle active={cfg.headerShowPhone} onClick={() => update({ headerShowPhone: !cfg.headerShowPhone })} />
                </PropertyRow>
              </CollapsibleSection>

              {/* Hero */}
              <CollapsibleSection
                title={t('Hero Layout', 'قسم الترحيب (Hero)')}
                description={t('Landing fold structural layout', 'تنسيق القسم الرئيسي للصفحة')}
                icon={<LayoutTemplate size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Hero Layout', 'شكل الهيرو')}>
                  <Select
                    value={cfg.heroStyle}
                    onChange={v => update({ heroStyle: v })}
                    options={heroStyleOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>
              </CollapsibleSection>

              {/* Page Sections Visibility */}
              <CollapsibleSection
                title={t('Landing Sections', 'أقسام الصفحة')}
                description={t('Show/hide specific wire content blocks', 'إخفاء أو إظهار أقسام المحتوى')}
                icon={<Grid3X3 size={11} />}
                defaultOpen={true}
              >
                <PropertyRow label={t('Feature Strip', 'شريط الميزات')}>
                  <MiniToggle active={cfg.showFeatures !== false} onClick={() => update({ showFeatures: !cfg.showFeatures })} />
                </PropertyRow>
                <PropertyRow label={t('Interactive Form', 'نموذج الاتصال')}>
                  <MiniToggle active={cfg.showForm !== false} onClick={() => update({ showForm: !cfg.showForm })} />
                </PropertyRow>
                <PropertyRow label={t('Testimonial Grid', 'آراء العملاء')}>
                  <MiniToggle active={cfg.showTestimonials !== false} onClick={() => update({ showTestimonials: !cfg.showTestimonials })} />
                </PropertyRow>
                <PropertyRow label={t('Pricing Matrix', 'باقات الأسعار')}>
                  <MiniToggle active={cfg.showPricing === true} onClick={() => update({ showPricing: !cfg.showPricing })} />
                </PropertyRow>
                <PropertyRow label={t('Swarm Uptime Stats', 'شريط الإحصائيات')}>
                  <MiniToggle active={cfg.showStats === true} onClick={() => update({ showStats: !cfg.showStats })} />
                </PropertyRow>
                <PropertyRow label={t('Team Grid', 'فريق العمل')}>
                  <MiniToggle active={cfg.showTeam === true} onClick={() => update({ showTeam: !cfg.showTeam })} />
                </PropertyRow>
              </CollapsibleSection>

              {/* Footer */}
              <CollapsibleSection
                title={t('Footer Structure', 'قسم التذييل (Footer)')}
                description={t('Bottom layout, social buttons, columns', 'خيارات أسفل الصفحة والروابط')}
                icon={<AlignLeft size={11} />}
                defaultOpen={false}
              >
                <PropertyRow label={t('Footer Style', 'نمط الفوتر')}>
                  <Select
                    value={cfg.footerStyle}
                    onChange={v => update({ footerStyle: v })}
                    options={footerStyleOptions.map(o => ({ value: o.value, label: o.label }))}
                  />
                </PropertyRow>

                {cfg.footerStyle === 'big' && (
                  <PropertyRow label={t('Columns Count', 'عدد الأعمدة')}>
                    <Stepper
                      value={cfg.footerColumns || 3}
                      onChange={v => update({ footerColumns: v as any })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </PropertyRow>
                )}

                <Divider label={t('Footer Elements', 'عناصر الفوتر')} />
                <PropertyRow label={t('Social Icons', 'أيقونات التواصل')}>
                  <MiniToggle active={cfg.footerShowSocials} onClick={() => update({ footerShowSocials: !cfg.footerShowSocials })} />
                </PropertyRow>
                <PropertyRow label={t('Phone Info', 'رقم الهاتف')}>
                  <MiniToggle active={cfg.footerShowPhone} onClick={() => update({ footerShowPhone: !cfg.footerShowPhone })} />
                </PropertyRow>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

