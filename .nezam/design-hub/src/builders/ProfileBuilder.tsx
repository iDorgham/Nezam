'use client'

/**
 * SPEC-DS-VISUAL-001 — User profile section builder.
 * Avatar shape, info fields, social links, card layout.
 */

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type AvatarShape = 'circle' | 'rounded' | 'square'
type AvatarSize  = 'sm' | 'md' | 'lg' | 'xl'
type CardLayout  = 'vertical' | 'horizontal' | 'minimal' | 'banner'
type BadgeStyle  = 'dot' | 'ring' | 'tag' | 'none'

type SocialPlatform = 'twitter' | 'linkedin' | 'github' | 'instagram' | 'website' | 'youtube'

export interface SocialLink {
  id: string
  platform: SocialPlatform
  url: string
}

export interface ProfileConfig {
  layout: CardLayout
  avatarShape: AvatarShape
  avatarSize: AvatarSize
  showName: boolean
  showRole: boolean
  showBio: boolean
  showStats: boolean
  showSocial: boolean
  socialLinks: SocialLink[]
  showBadge: boolean
  badgeStyle: BadgeStyle
  showFollowButton: boolean
}

const uid = () => Math.random().toString(36).slice(2, 8)

const DEFAULT_CONFIG: ProfileConfig = {
  layout: 'vertical',
  avatarShape: 'circle',
  avatarSize: 'md',
  showName: true,
  showRole: true,
  showBio: true,
  showStats: false,
  showSocial: true,
  socialLinks: [
    { id: uid(), platform: 'twitter', url: '' },
    { id: uid(), platform: 'linkedin', url: '' },
  ],
  showBadge: false,
  badgeStyle: 'dot',
  showFollowButton: true,
}

// ── Avatar shape preview ──────────────────────────────────────────────────────

function AvatarPreview({ shape, size }: { shape: AvatarShape; size: AvatarSize }) {
  const sizes: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 48, xl: 64 }
  const px = sizes[size]
  const rx = shape === 'circle' ? px / 2 : shape === 'rounded' ? 8 : 2

  return (
    <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`}>
      <rect x="0" y="0" width={px} height={px} rx={rx} fill="currentColor" opacity=".15" />
      <circle cx={px * 0.5} cy={px * 0.38} r={px * 0.18} fill="currentColor" opacity=".3" />
      <path
        d={`M${px * 0.1},${px} Q${px * 0.5},${px * 0.55} ${px * 0.9},${px}`}
        fill="currentColor"
        opacity=".2"
      />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-app-subtle">{label}</p>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-xs text-app-text">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-4 w-7 rounded-full transition-colors', checked ? 'bg-app-brand' : 'bg-app-border')}
      >
        <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </button>
    </label>
  )
}

function Chip<T extends string>({
  value, current, onChange, label,
}: { value: T; current: T; onChange: (v: T) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] transition-colors',
        current === value ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
      )}
    >
      {label}
    </button>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface ProfileBuilderProps {
  value?: Partial<ProfileConfig>
  onChange?: (cfg: ProfileConfig) => void
}

export function ProfileBuilder({ value, onChange }: ProfileBuilderProps) {
  const [cfg, setCfg] = useState<ProfileConfig>({ ...DEFAULT_CONFIG, ...value })

  const update = <K extends keyof ProfileConfig>(key: K, val: ProfileConfig[K]) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    onChange?.(next)
  }

  const updateLink = (id: string, patch: Partial<SocialLink>) => {
    update('socialLinks', cfg.socialLinks.map((l) => l.id === id ? { ...l, ...patch } : l))
  }

  const removeLink = (id: string) => {
    update('socialLinks', cfg.socialLinks.filter((l) => l.id !== id))
  }

  const addLink = () => {
    update('socialLinks', [...cfg.socialLinks, { id: uid(), platform: 'website', url: '' }])
  }

  const PLATFORMS: SocialPlatform[] = ['twitter', 'linkedin', 'github', 'instagram', 'website', 'youtube']

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Card layout */}
      <Section label="Card layout">
        <div className="flex gap-1">
          {(['vertical', 'horizontal', 'minimal', 'banner'] as CardLayout[]).map((l) => (
            <Chip key={l} value={l} current={cfg.layout} onChange={(v) => update('layout', v)} label={l} />
          ))}
        </div>
      </Section>

      {/* Avatar */}
      <Section label="Avatar">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(['circle', 'rounded', 'square'] as AvatarShape[]).map((s) => (
              <button
                key={s}
                onClick={() => update('avatarShape', s)}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] transition-colors',
                  cfg.avatarShape === s ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-app-text">
            <AvatarPreview shape={cfg.avatarShape} size={cfg.avatarSize} />
          </div>
        </div>
        <div className="flex gap-1">
          {(['sm', 'md', 'lg', 'xl'] as AvatarSize[]).map((s) => (
            <Chip key={s} value={s} current={cfg.avatarSize} onChange={(v) => update('avatarSize', v)} label={s} />
          ))}
        </div>
      </Section>

      {/* Info fields */}
      <Section label="Info fields">
        <div className="flex flex-col gap-2.5">
          <Toggle checked={cfg.showName} onChange={(v) => update('showName', v)} label="Name" />
          <Toggle checked={cfg.showRole} onChange={(v) => update('showRole', v)} label="Role / title" />
          <Toggle checked={cfg.showBio} onChange={(v) => update('showBio', v)} label="Bio" />
          <Toggle checked={cfg.showStats} onChange={(v) => update('showStats', v)} label="Stats (posts / followers)" />
        </div>
      </Section>

      {/* Social links */}
      <Section label="Social links">
        <Toggle checked={cfg.showSocial} onChange={(v) => update('showSocial', v)} label="Show social links" />
        {cfg.showSocial && (
          <div className="flex flex-col gap-1.5 pt-1">
            {cfg.socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateLink(link.id, { platform: e.target.value as SocialPlatform })}
                  className="rounded border border-app-border bg-transparent px-1 py-0.5 text-[11px] text-app-text focus:outline-none"
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  placeholder="https://…"
                  className="min-w-0 flex-1 rounded-md border border-app-border bg-app-surface px-2 py-0.5 text-xs text-app-text placeholder:text-app-subtle focus:outline-none focus:ring-1 focus:ring-app-brand"
                />
                <button onClick={() => removeLink(link.id)} className="text-app-subtle hover:text-app-danger">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={addLink}
              className="flex items-center gap-1 text-[11px] text-app-subtle hover:text-app-text"
            >
              <Plus size={12} /> Add link
            </button>
          </div>
        )}
      </Section>

      {/* Badge */}
      <Section label="Badge">
        <Toggle checked={cfg.showBadge} onChange={(v) => update('showBadge', v)} label="Show badge" />
        {cfg.showBadge && (
          <div className="flex gap-1 pt-1">
            {(['dot', 'ring', 'tag', 'none'] as BadgeStyle[]).map((s) => (
              <Chip key={s} value={s} current={cfg.badgeStyle} onChange={(v) => update('badgeStyle', v)} label={s} />
            ))}
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section label="CTA">
        <Toggle checked={cfg.showFollowButton} onChange={(v) => update('showFollowButton', v)} label="Follow / connect button" />
      </Section>
    </div>
  )
}
