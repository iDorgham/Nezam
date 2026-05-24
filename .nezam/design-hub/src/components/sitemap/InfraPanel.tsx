'use client'

import { forwardRef, useState } from 'react'
import {
  Github, GitlabIcon, ChevronDown, ChevronRight,
  Database, Server, FileText, Link,
  CheckCircle2, Circle,
} from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import { cn } from '@/lib/cn'
import type { GitProvider, DbProvider, CloudProvider, SitemapBuilderInfra } from '@/types'

// ── Provider options ──────────────────────────────────────────────────────────

const GIT_PROVIDERS: { id: GitProvider; label: string; color: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'github',    label: 'GitHub',    color: 'text-white',        Icon: Github },
  { id: 'gitlab',    label: 'GitLab',    color: 'text-orange-400',   Icon: GitlabIcon },
  { id: 'bitbucket', label: 'Bitbucket', color: 'text-blue-400',     Icon: Server },
]

const DB_PROVIDERS: { id: DbProvider; label: string; color: string }[] = [
  { id: 'supabase',    label: 'Supabase',    color: 'text-emerald-400' },
  { id: 'neon',        label: 'Neon',        color: 'text-green-400' },
  { id: 'planetscale', label: 'PlanetScale', color: 'text-purple-400' },
  { id: 'mongodb',     label: 'MongoDB',     color: 'text-green-500' },
  { id: 'firebase',    label: 'Firebase',    color: 'text-yellow-400' },
  { id: 'turso',       label: 'Turso',       color: 'text-cyan-400' },
  { id: 'postgres',    label: 'Postgres',    color: 'text-blue-400' },
  { id: 'mysql',       label: 'MySQL',       color: 'text-orange-400' },
  { id: 'custom',      label: 'Custom',      color: 'text-app-muted' },
]

const CLOUD_PROVIDERS: { id: CloudProvider; label: string; color: string }[] = [
  { id: 'vercel',   label: 'Vercel',   color: 'text-white' },
  { id: 'netlify',  label: 'Netlify',  color: 'text-teal-400' },
  { id: 'railway',  label: 'Railway',  color: 'text-violet-400' },
  { id: 'flyio',    label: 'Fly.io',   color: 'text-purple-400' },
  { id: 'render',   label: 'Render',   color: 'text-blue-400' },
  { id: 'aws',      label: 'AWS',      color: 'text-orange-400' },
  { id: 'gcp',      label: 'GCP',      color: 'text-blue-500' },
  { id: 'azure',    label: 'Azure',    color: 'text-sky-400' },
  { id: 'custom',   label: 'Custom',   color: 'text-app-muted' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function ProviderBadge({ label, color, active, onClick }: {
  label: string; color: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-all',
        active
          ? `border-current bg-current/10 ${color}`
          : 'border-app-border text-app-subtle hover:border-app-border-strong',
      )}
    >
      {label}
    </button>
  )
}

function FieldInput({ label, value, onChange, placeholder, mono = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; mono?: boolean
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-app-subtle">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-app-border bg-app-inset px-2 py-1.5 text-[11px] text-app-text outline-none placeholder:text-app-subtle/60 focus:border-app-accent',
          mono && 'font-mono text-[10px]',
        )}
      />
    </div>
  )
}

function InfraSection({
  sectionKey, title, subtitle, color, icon: Icon, configured, children, wireRef,
}: {
  sectionKey?: string
  title: string
  subtitle: string
  color: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  configured: boolean
  children: React.ReactNode
  wireRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      ref={wireRef}
      data-infra-wire
      data-infra-section={sectionKey}
      className={cn(
        'overflow-hidden rounded-xl border transition-colors',
        configured ? 'border-app-border' : 'border-app-border/60',
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2.5 px-3 py-2.5 text-left',
          configured ? 'bg-app-surface' : 'bg-app-inset/40',
        )}
      >
        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', `bg-current/10 ${color}`)}>
          <Icon size={13} className={color} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-app-text">{title}</span>
            {configured
              ? <CheckCircle2 size={11} className="text-emerald-400" />
              : <Circle size={11} className="text-app-subtle/40" />
            }
          </div>
          <div className="text-[10px] text-app-subtle">{subtitle}</div>
        </div>
        {open ? <ChevronDown size={12} className="text-app-subtle" /> : <ChevronRight size={12} className="text-app-subtle" />}
      </button>
      {open && (
        <div className="border-t border-app-border/60 px-3 pb-3 pt-3 space-y-2.5">
          {children}
        </div>
      )}
    </div>
  )
}

// ── InfraPanel ────────────────────────────────────────────────────────────────

export const InfraPanel = forwardRef<HTMLDivElement, Record<string, never>>(
  function InfraPanel(_, ref) {
    const infra = useSitemapBuilder((s) => s.infra)
    const updateInfra = useSitemapBuilder((s) => s.updateInfra)

    const { git, database, platform, prd } = infra

    return (
      <div ref={ref} data-infra-panel className="flex flex-col gap-2">
        <div className="mb-0.5 px-1 text-[9px] font-bold uppercase tracking-widest text-app-subtle">
          Infrastructure
        </div>

        {/* ── Git Provider ───────────────────────────────────────────── */}
        <InfraSection
          sectionKey="git"
          title="Git Provider"
          subtitle={git.provider ? `${git.repoUrl || 'No repo URL'}` : 'Not configured'}
          color="text-emerald-400"
          icon={Github}
          configured={!!git.provider}
        >
          <div>
            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-app-subtle">Provider</label>
            <div className="flex gap-1 flex-wrap">
              {GIT_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateInfra({ git: { ...git, provider: git.provider === p.id ? null : p.id } })}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all',
                    git.provider === p.id
                      ? `border-current/40 bg-current/10 ${p.color}`
                      : 'border-app-border text-app-subtle hover:border-app-border-strong',
                  )}
                >
                  <p.Icon size={12} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <FieldInput
            label="Repository URL"
            value={git.repoUrl}
            onChange={(v) => updateInfra({ git: { ...git, repoUrl: v } })}
            placeholder="https://github.com/org/repo"
            mono
          />
          <FieldInput
            label="Default branch"
            value={git.branch}
            onChange={(v) => updateInfra({ git: { ...git, branch: v } })}
            placeholder="main"
            mono
          />
        </InfraSection>

        {/* ── Database ────────────────────────────────────────────────── */}
        <InfraSection
          sectionKey="database"
          title="Database"
          subtitle={database.provider ?? 'Not configured'}
          color="text-blue-400"
          icon={Database}
          configured={!!database.provider}
        >
          <div>
            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-app-subtle">Provider</label>
            <div className="flex flex-wrap gap-1">
              {DB_PROVIDERS.map((p) => (
                <ProviderBadge
                  key={p.id}
                  label={p.label}
                  color={p.color}
                  active={database.provider === p.id}
                  onClick={() => updateInfra({ database: { ...database, provider: database.provider === p.id ? null : p.id } })}
                />
              ))}
            </div>
          </div>
          <FieldInput
            label="Connection string"
            value={database.connectionString}
            onChange={(v) => updateInfra({ database: { ...database, connectionString: v } })}
            placeholder="postgresql://user:pass@host/db"
            mono
          />
          {database.notes !== undefined && (
            <FieldInput
              label="Notes"
              value={database.notes}
              onChange={(v) => updateInfra({ database: { ...database, notes: v } })}
              placeholder="Database notes…"
            />
          )}
        </InfraSection>

        {/* ── Cloud Platform ──────────────────────────────────────────── */}
        <InfraSection
          sectionKey="platform"
          title="Cloud Platform"
          subtitle={platform.provider ? `${platform.projectName || platform.provider}` : 'Not configured'}
          color="text-violet-400"
          icon={Server}
          configured={!!platform.provider}
        >
          <div>
            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-app-subtle">Platform</label>
            <div className="flex flex-wrap gap-1">
              {CLOUD_PROVIDERS.map((p) => (
                <ProviderBadge
                  key={p.id}
                  label={p.label}
                  color={p.color}
                  active={platform.provider === p.id}
                  onClick={() => updateInfra({ platform: { ...platform, provider: platform.provider === p.id ? null : p.id } })}
                />
              ))}
            </div>
          </div>
          <FieldInput
            label="Project name"
            value={platform.projectName}
            onChange={(v) => updateInfra({ platform: { ...platform, projectName: v } })}
            placeholder="my-project"
            mono
          />
          <FieldInput
            label="Deploy URL"
            value={platform.deployUrl}
            onChange={(v) => updateInfra({ platform: { ...platform, deployUrl: v } })}
            placeholder="https://my-project.vercel.app"
            mono
          />
        </InfraSection>

        {/* ── PRD ─────────────────────────────────────────────────────── */}
        <InfraSection
          title="PRD"
          subtitle={prd.title || 'Product Requirements Document'}
          color="text-amber-400"
          icon={FileText}
          configured={!!(prd.title || prd.url)}
        >
          <FieldInput
            label="Document title"
            value={prd.title}
            onChange={(v) => updateInfra({ prd: { ...prd, title: v } })}
            placeholder="Product Requirements Document"
          />
          <FieldInput
            label="Document URL"
            value={prd.url}
            onChange={(v) => updateInfra({ prd: { ...prd, url: v } })}
            placeholder="https://notion.so/prd or Google Doc URL"
            mono
          />
          <div>
            <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-app-subtle">Description</label>
            <textarea
              value={prd.description}
              onChange={(e) => updateInfra({ prd: { ...prd, description: e.target.value } })}
              placeholder="Brief description of the PRD…"
              rows={2}
              className="w-full resize-none rounded-lg border border-app-border bg-app-inset px-2 py-1.5 text-[11px] text-app-text outline-none placeholder:text-app-subtle/60 focus:border-app-accent"
            />
          </div>
          {prd.url && (
            <a
              href={prd.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-app-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Link size={10} /> Open PRD ↗
            </a>
          )}
        </InfraSection>
      </div>
    )
  }
)
