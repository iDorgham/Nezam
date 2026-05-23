'use client'

import { useState } from 'react'
import { Settings, Sparkles, Check, SlidersHorizontal, LayoutGrid, Palette, Type, FolderOpen, Image } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { contrastRatio } from '@/lib/tokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { ColorField } from '@/components/ui/ColorField'
import { Slider } from '@/components/ui/Slider'
import { Segmented } from '@/components/ui/Segmented'
import { ProfileGallery } from '@/components/sidebar/ProfileGallery'
import { cn } from '@/lib/cn'
import type { ColorTokenKey, Density, ShadowStyle } from '@/types'

const LOGO_OPTIONS = [
  { label: 'Minimalist (ن)', value: 'ن' },
  { label: 'Modern (N)', value: 'N' },
  { label: 'Diamond (◆)', value: '◆' },
  { label: 'Globe (🌐)', value: '🌐' },
]

export function SettingsPanel() {
  const siteSettings = useHub((s) => s.siteSettings)
  const updateSiteSettings = useHub((s) => s.updateSiteSettings)
  const tokens = useTokens()
  const setToken = useHub((s) => s.setToken)
  const blocks = useHub((s) => s.blocks)
  const updateBlockContent = useHub((s) => s.updateBlockContent)

  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'profile' | 'brand' | 'layout' | 'components'>('meta')

  const brandContrast = contrastRatio(tokens.brand, tokens.onBrand)
  const textContrast = contrastRatio(tokens.text, tokens.bg)

  // Find active header/hero/footer variants if present in blocks
  const headerBlock = blocks.find((b) => b.kind === 'nav')
  const heroBlock = blocks.find((b) => b.kind === 'hero')
  const footerBlock = blocks.find((b) => b.kind === 'footer')

  const headerVariant = (headerBlock?.content?.variant as string) || 'minimal'
  const heroVariant = (heroBlock?.content?.variant as string) || 'saas'
  const footerVariant = (footerBlock?.content?.variant as string) || 'minimal'

  return (
    <div className="flex h-full min-w-0 flex-col select-none">
      <PanelHeader
        icon={<Settings size={15} />}
        title="Settings"
        subtitle="Site details, branding, & components"
      />

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1.5 border-b border-app-border bg-app-inset px-3 py-2 text-[10.5px]">
        <button
          onClick={() => setActiveSubTab('meta')}
          className={cn(
            'focus-ring rounded-app-sm px-2 py-0.5 transition-colors',
            activeSubTab === 'meta' ? 'bg-app-accent text-app-on-accent font-semibold' : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
          )}
        >
          General
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={cn(
            'focus-ring rounded-app-sm px-2 py-0.5 transition-colors',
            activeSubTab === 'profile' ? 'bg-app-accent text-app-on-accent font-semibold' : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSubTab('brand')}
          className={cn(
            'focus-ring rounded-app-sm px-2 py-0.5 transition-colors',
            activeSubTab === 'brand' ? 'bg-app-accent text-app-on-accent font-semibold' : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
          )}
        >
          Branding
        </button>
        <button
          onClick={() => setActiveSubTab('layout')}
          className={cn(
            'focus-ring rounded-app-sm px-2 py-0.5 transition-colors',
            activeSubTab === 'layout' ? 'bg-app-accent text-app-on-accent font-semibold' : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
          )}
        >
          Layout
        </button>
        <button
          onClick={() => setActiveSubTab('components')}
          className={cn(
            'focus-ring rounded-app-sm px-2 py-0.5 transition-colors',
            activeSubTab === 'components' ? 'bg-app-accent text-app-on-accent font-semibold' : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
          )}
        >
          Chrome
        </button>
      </div>

      <PanelBody className="p-3">
        {/* site metadata settings */}
        {activeSubTab === 'meta' && (
          <div className="space-y-4">
            <Section label="Site configuration" hint="General metadata settings for the project.">
              <ControlCard className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-app-subtle uppercase tracking-wide mb-1">Site Name</label>
                  <input
                    value={siteSettings.name}
                    onChange={(e) => updateSiteSettings({ name: e.target.value })}
                    className="focus-ring h-8 w-full rounded-md border border-app-border bg-app-inset px-2.5 text-xs text-app-text focus:border-app-accent focus:outline-none"
                    placeholder="e.g. Nezam Studio"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-app-subtle uppercase tracking-wide mb-1">SEO Title</label>
                  <input
                    value={siteSettings.title}
                    onChange={(e) => updateSiteSettings({ title: e.target.value })}
                    className="focus-ring h-8 w-full rounded-md border border-app-border bg-app-inset px-2.5 text-xs text-app-text focus:border-app-accent focus:outline-none"
                    placeholder="SEO title tag"
                  />
                </div>
              </ControlCard>
            </Section>

            <Section label="Logo selection" hint="Pick a wordmark emblem symbol displayed in the header.">
              <Segmented<string>
                value={siteSettings.logo || 'ن'}
                onChange={(v) => {
                  updateSiteSettings({ logo: v })
                  // Update Nav block brand wordmark content immediately
                  updateBlockContent('nav', { brand: v })
                }}
                className="w-full [&>button]:flex-1"
                options={LOGO_OPTIONS}
              />
            </Section>
          </div>
        )}

        {/* profile options */}
        {activeSubTab === 'profile' && <ProfileGallery />}

        {/* Brand details */}
        {activeSubTab === 'brand' && (
          <div className="space-y-4">
            <Section label="Primary brand">
              <ColorField
                label="Brand Color"
                value={tokens.brand}
                onChange={(v) => setToken('brand', v)}
              />
              <ColorField
                label="Brand subtle"
                value={tokens.brandSubtle}
                onChange={(v) => setToken('brandSubtle', v)}
              />
              <ColorField
                label="On brand text"
                value={tokens.onBrand}
                onChange={(v) => setToken('onBrand', v)}
              />
              <ControlCard className="mt-2.5">
                <ContrastRow label="On-brand legibility" ratio={brandContrast} target={4.5} />
              </ControlCard>
            </Section>

            <Section label="Accents & Status">
              <ColorField
                label="Accent Highlight"
                value={tokens.accent}
                onChange={(v) => setToken('accent', v)}
              />
              <ColorField
                label="Success"
                value={tokens.success}
                onChange={(v) => setToken('success', v)}
              />
              <ColorField
                label="Danger alert"
                value={tokens.danger}
                onChange={(v) => setToken('danger', v)}
              />
            </Section>

            <Section label="Typography text colours">
              <ColorField
                label="Primary text"
                value={tokens.text}
                onChange={(v) => setToken('text', v)}
              />
              <ColorField
                label="Muted text"
                value={tokens.textMuted}
                onChange={(v) => setToken('textMuted', v)}
              />
              <ControlCard className="mt-2.5">
                <ContrastRow label="Body text legibility" ratio={textContrast} target={4.5} />
              </ControlCard>
            </Section>
          </div>
        )}

        {/* Layout details */}
        {activeSubTab === 'layout' && (
          <div className="space-y-4">
            <Section label="Rhythmic density scale">
              <Segmented<Density>
                value={tokens.density}
                onChange={(v) => setToken('density', v)}
                className="w-full [&>button]:flex-1"
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'cozy', label: 'Cozy' },
                  { value: 'spacious', label: 'Spacious' },
                ]}
              />
            </Section>

            <Section label="Corner shaping & elevation">
              <ControlCard className="space-y-4">
                <Slider
                  label="Corner Radius"
                  min={0}
                  max={28}
                  value={tokens.radius}
                  onChange={(v) => setToken('radius', v)}
                  format={(v) => `${v}px`}
                />

                <div className="pt-2 border-t border-app-border/40">
                  <label className="block text-[10px] font-semibold text-app-subtle uppercase tracking-wide mb-1.5">Shadow elevation</label>
                  <Segmented<ShadowStyle>
                    value={tokens.shadow}
                    onChange={(v) => setToken('shadow', v)}
                    className="w-full [&>button]:flex-1"
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'soft', label: 'Soft' },
                      { value: 'crisp', label: 'Crisp' },
                      { value: 'dramatic', label: 'Bold' },
                    ]}
                  />
                </div>
              </ControlCard>
            </Section>

            <Section label="System surfaces">
              <ColorField label="Site Background" value={tokens.bg} onChange={(v) => setToken('bg', v)} />
              <ColorField label="Surface cards" value={tokens.surface} onChange={(v) => setToken('surface', v)} />
              <ColorField label="Elevated dialogs" value={tokens.elevated} onChange={(v) => setToken('elevated', v)} />
            </Section>
          </div>
        )}

        {/* Component dedicated styles */}
        {activeSubTab === 'components' && (
          <div className="space-y-4">
            {/* Header section styles */}
            <Section
              label="Header style variant"
              hint="Pick a visual layout template style for the active navigation bar."
            >
              {headerBlock ? (
                <div className="space-y-2">
                  <Segmented<string>
                    value={headerVariant}
                    onChange={(v) => updateBlockContent('nav', { variant: v })}
                    className="w-full [&>button]:flex-1"
                    options={[
                      { value: 'minimal', label: 'Minimal' },
                      { value: 'centered', label: 'Centered' },
                      { value: 'sticky', label: 'Glass' },
                      { value: 'split', label: 'Split' },
                    ]}
                  />
                  <ControlCard className="space-y-3">
                    <Slider
                      label="Header Padding"
                      min={8}
                      max={32}
                      value={(headerBlock.content?.padding as number) || 12}
                      onChange={(v) => updateBlockContent('nav', { padding: v })}
                      format={(v) => `${v}px`}
                    />
                  </ControlCard>
                </div>
              ) : (
                <div className="text-[11px] text-app-subtle italic">No navigation header block on this page.</div>
              )}
            </Section>

            {/* Hero section styles */}
            <Section
              label="Hero layout variant"
              hint="Choose how the introductory banner is arranged."
            >
              {heroBlock ? (
                <div className="space-y-2">
                  <Segmented<string>
                    value={heroVariant}
                    onChange={(v) => updateBlockContent('hero', { variant: v })}
                    className="w-full [&>button]:flex-1 shadow-sm"
                    options={[
                      { value: 'saas', label: 'SaaS App' },
                      { value: 'split', label: 'Split Screen' },
                      { value: 'glassmorphic', label: 'Futuristic' },
                    ]}
                  />
                  <ControlCard className="space-y-3">
                    <Slider
                      label="Hero Spacing / Gap"
                      min={12}
                      max={48}
                      value={(heroBlock.content?.gap as number) || 24}
                      onChange={(v) => updateBlockContent('hero', { gap: v })}
                      format={(v) => `${v}px`}
                    />
                  </ControlCard>
                </div>
              ) : (
                <div className="text-[11px] text-app-subtle italic">No hero section block on this page.</div>
              )}
            </Section>

            {/* Footer section styles */}
            <Section
              label="Footer layout variant"
              hint="Adjust how the page bottom credentials and navigation columns display."
            >
              {footerBlock ? (
                <div className="space-y-2">
                  <Segmented<string>
                    value={footerVariant}
                    onChange={(v) => updateBlockContent('footer', { variant: v })}
                    className="w-full [&>button]:flex-1"
                    options={[
                      { value: 'minimal', label: 'Minimal Line' },
                      { value: 'multicolumn', label: 'Multi-Col' },
                      { value: 'centered', label: 'Centered' },
                    ]}
                  />
                  <ControlCard className="space-y-3">
                    <Slider
                      label="Footer Padding"
                      min={16}
                      max={64}
                      value={(footerBlock.content?.padding as number) || 24}
                      onChange={(v) => updateBlockContent('footer', { padding: v })}
                      format={(v) => `${v}px`}
                    />
                  </ControlCard>
                </div>
              ) : (
                <div className="text-[11px] text-app-subtle italic">No footer block on this page.</div>
              )}
            </Section>
          </div>
        )}
      </PanelBody>
    </div>
  )
}

function ContrastRow({ label, ratio, target }: { label: string; ratio: number; target: number }) {
  const pass = ratio >= target
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-app-muted">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] text-app-text">{ratio.toFixed(2)}:1</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{
            background: pass ? 'rgba(34,197,94,0.16)' : 'rgba(248,113,113,0.16)',
            color: pass ? '#4ade80' : '#f87171',
          }}
        >
          {pass ? 'AA' : 'low'}
        </span>
      </span>
    </div>
  )
}
