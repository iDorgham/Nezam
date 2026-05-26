'use client'

import { Network, Palette, Eye, ArrowUpRight, RotateCcw } from 'lucide-react'
import { useHub, type HubSection } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const SECTIONS: { id: HubSection; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'architecture', label: 'Architecture',  Icon: Network },
  { id: 'design',       label: 'Design System', Icon: Palette },
  { id: 'preview',      label: 'Preview',       Icon: Eye },
]

export function TopBar() {
  const section         = useHub((s) => s.section)
  const setSection      = useHub((s) => s.setSection)
  const onboardingReset = useHub((s) => s.onboardingReset)

  return (
    <header className="shrink-0 border-b border-app-border bg-app-surface">
      <div className="flex h-11 items-center px-4 gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-2 select-none shrink-0">
          <span className="text-sm font-bold text-app-text tracking-tight">Design Hub</span>
          <span className="text-[9.5px] font-semibold text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full tracking-wide">
            v7
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-app-border" />

        {/* Section tabs */}
        <nav className="flex items-center gap-0.5 h-11">
          {SECTIONS.map(({ id, label, Icon }) => {
            const active = section === id
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  'relative flex items-center gap-1.5 h-full px-3 text-[11px] font-medium transition-colors duration-100 select-none',
                  active ? 'text-app-text' : 'text-app-muted hover:text-app-text',
                )}
              >
                <Icon size={13} className={active ? 'text-app-accent' : ''} />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-app-accent" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onboardingReset}
            title="Re-run onboarding"
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            <RotateCcw size={11} />
          </button>
          <button
            onClick={() => setSection('preview')}
            className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none"
          >
            <ArrowUpRight size={12} />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}
