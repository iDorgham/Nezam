'use client'

import { Check, Sparkles } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { MiniPreview } from './MiniPreview'
import { cn } from '@/lib/cn'
import type { Profile } from '@/types'

/** Scrollable gallery of curated + AI-generated profiles with live previews. */
export function ProfileGallery() {
  const getAllProfiles = useHub((s) => s.getAllProfiles)
  const generated = useHub((s) => s.generated)
  const profileId = useHub((s) => s.profileId)
  const theme = useHub((s) => s.theme)
  const setProfile = useHub((s) => s.setProfile)
  const surpriseMe = useHub((s) => s.surpriseMe)

  const all = getAllProfiles()
  const curated = all.filter((p) => !p.id.startsWith('gen-'))

  return (
    <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
      <button
        onClick={surpriseMe}
        className={cn(
          'group mb-3 flex w-full items-center gap-2.5 rounded-app border border-dashed border-app-border-strong',
          'bg-app-inset/50 px-3 py-2.5 text-left transition-all hover:border-app-accent hover:bg-app-accent-subtle',
        )}
      >
        <div className="grid h-8 w-8 place-items-center rounded-app-sm bg-gradient-to-br from-app-accent to-[#4f46e5] text-app-on-accent">
          <Sparkles size={15} className="transition-transform group-hover:rotate-12" />
        </div>
        <div>
          <div className="text-xs font-semibold text-app-text">Generate a profile</div>
          <div className="text-[10px] text-app-subtle">A fresh harmony, instantly</div>
        </div>
      </button>

      {generated.length > 0 && (
        <GallerySection title="Generated">
          {generated.map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              theme={theme}
              active={p.id === profileId}
              onSelect={() => setProfile(p.id)}
            />
          ))}
        </GallerySection>
      )}

      <GallerySection title="Curated profiles">
        {curated.map((p) => (
          <ProfileCard
            key={p.id}
            profile={p}
            theme={theme}
            active={p.id === profileId}
            onSelect={() => setProfile(p.id)}
          />
        ))}
      </GallerySection>
    </div>
  )
}

function GallerySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-app-subtle">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ProfileCard({
  profile,
  theme,
  active,
  onSelect,
}: {
  profile: Profile
  theme: 'light' | 'dark'
  active: boolean
  onSelect: () => void
}) {
  const colors = theme === 'dark' ? profile.dark : profile.light
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'group block w-full overflow-hidden rounded-app border text-left transition-all duration-200 ease-smooth',
        active
          ? 'border-app-accent shadow-app-glow'
          : 'border-app-border hover:border-app-border-strong hover:-translate-y-0.5',
      )}
    >
      <div className="relative h-[88px]">
        <MiniPreview
          colors={colors}
          radius={profile.radius}
          fontSans={profile.fontSans}
          className="h-full w-full"
        />
        {active && (
          <div className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-app-accent text-app-on-accent shadow-app">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-app-border bg-app-elevated px-2.5 py-2">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-app-text">{profile.name}</div>
          <div className="truncate text-[10px] text-app-subtle">{profile.tagline}</div>
        </div>
        <div className="flex shrink-0 gap-1">
          {[colors.brand, colors.accent].map((c, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full border border-app-border"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </button>
  )
}
