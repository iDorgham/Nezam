'use client'

import { Palette, Type, Ruler, BoxSelect, LayoutGrid } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { BrandPanel } from '@/components/builder/panels/BrandPanel'
import { TypographyPanel } from '@/components/builder/panels/TypographyPanel'
import { ProfileGallery } from '@/components/sidebar/ProfileGallery'
import { StylesSections } from '@/components/builder/panels/StylesSections'
import { cn } from '@/lib/cn'

interface DSTab {
  id: string
  label: string
  icon: React.ElementType
}

const DS_TABS: DSTab[] = [
  { id: 'colors',     label: 'Colors',      icon: Palette    },
  { id: 'typography', label: 'Typography',  icon: Type       },
  { id: 'spacing',    label: 'Spacing',     icon: Ruler      },
  { id: 'shape',      label: 'Shape',       icon: BoxSelect  },
  { id: 'profiles',   label: 'Profiles',    icon: LayoutGrid },
]

/**
 * Right-panel editor shown in DESIGN_SYSTEM mode.
 * Horizontal 5-tab strip drives which section is visible.
 */
export function DesignSystemEditorPanel() {
  const dsActiveSection    = useHub((s) => s.dsActiveSection)
  const setDsActiveSection = useHub((s) => s.setDsActiveSection)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky tab strip */}
      <div className="shrink-0 border-b border-app-border bg-app-surface">
        <div className="flex">
          {DS_TABS.map((tab) => {
            const Icon   = tab.icon
            const active = tab.id === dsActiveSection
            return (
              <button
                key={tab.id}
                onClick={() => setDsActiveSection(tab.id)}
                className={cn(
                  'group relative flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[9px] font-semibold uppercase tracking-widest transition-colors',
                  active
                    ? 'text-app-text'
                    : 'text-app-subtle hover:text-app-muted',
                )}
              >
                <Icon size={14} />
                <span className="leading-none">{tab.label}</span>
                {/* Active indicator */}
                {active && (
                  <span className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-app-accent" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Panel content — fills remaining height, scrolls internally */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {dsActiveSection === 'colors'     && <BrandPanel />}
        {dsActiveSection === 'typography' && <TypographyPanel />}
        {dsActiveSection === 'spacing'    && <StylesSections focusSection="spacing" />}
        {dsActiveSection === 'shape'      && <StylesSections focusSection="shape" />}
        {dsActiveSection === 'profiles'   && <ProfileGallery />}
      </div>
    </div>
  )
}
