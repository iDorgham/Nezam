'use client'

import { useState } from 'react'
import {
  Plus, Trash2, ChevronDown, ChevronRight,
  Database, Shield, CreditCard, Server,
  HardDrive, Mail, BarChart2, Search,
  Zap, Globe, Bot, Box,
} from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import { NotesEditor } from './NotesEditor'
import { cn } from '@/lib/cn'
import type { ServiceKind, SitemapBuilderService } from '@/types'

// ── Service kind config ───────────────────────────────────────────────────────

const SERVICE_CFG: Record<ServiceKind, {
  label: string
  color: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
  api:       { label: 'API',       color: 'text-yellow-400',  Icon: Zap },
  auth:      { label: 'Auth',      color: 'text-violet-400',  Icon: Shield },
  payment:   { label: 'Payment',   color: 'text-emerald-400', Icon: CreditCard },
  database:  { label: 'Database',  color: 'text-blue-400',    Icon: Database },
  storage:   { label: 'Storage',   color: 'text-cyan-400',    Icon: HardDrive },
  email:     { label: 'Email',     color: 'text-pink-400',    Icon: Mail },
  analytics: { label: 'Analytics', color: 'text-orange-400',  Icon: BarChart2 },
  search:    { label: 'Search',    color: 'text-sky-400',     Icon: Search },
  cache:     { label: 'Cache',     color: 'text-amber-400',   Icon: Server },
  cdn:       { label: 'CDN',       color: 'text-teal-400',    Icon: Globe },
  ai:        { label: 'AI',        color: 'text-purple-400',  Icon: Bot },
  custom:    { label: 'Custom',    color: 'text-app-muted',   Icon: Box },
}

const SERVICE_KINDS: ServiceKind[] = [
  'api', 'auth', 'payment', 'database', 'storage',
  'email', 'analytics', 'search', 'cache', 'cdn', 'ai', 'custom',
]

// ── Service card ──────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: SitemapBuilderService }) {
  const updateService      = useSitemapBuilder((s) => s.updateService)
  const deleteService      = useSitemapBuilder((s) => s.deleteService)
  const addServiceNote     = useSitemapBuilder((s) => s.addServiceNote)
  const updateServiceNote  = useSitemapBuilder((s) => s.updateServiceNote)
  const deleteServiceNote  = useSitemapBuilder((s) => s.deleteServiceNote)

  const [open, setOpen] = useState(false)
  const cfg = SERVICE_CFG[service.kind]
  const { Icon } = cfg

  return (
    <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Icon size={13} className={cn('shrink-0', cfg.color)} />
        <span className={cn('shrink-0 text-[9px] font-bold tracking-widest uppercase', cfg.color)}>
          {cfg.label}
        </span>
        <input
          value={service.name}
          onChange={(e) => updateService(service.id, { name: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-app-text outline-none placeholder:text-app-subtle"
          placeholder="Service name"
        />
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-5 w-5 items-center justify-center rounded text-app-subtle hover:text-app-text"
        >
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </button>
        <button
          onClick={() => deleteService(service.id)}
          className="flex h-5 w-5 items-center justify-center rounded text-app-subtle hover:text-red-400"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Expanded fields */}
      {open && (
        <div className="border-t border-app-border/60 px-3 pb-2 pt-2 space-y-2">
          {/* Endpoint */}
          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-widest text-app-subtle mb-1">Endpoint</label>
            <input
              value={service.endpoint ?? ''}
              onChange={(e) => updateService(service.id, { endpoint: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="w-full rounded-lg border border-app-border bg-app-inset px-2 py-1.5 font-mono text-[11px] text-app-text outline-none placeholder:text-app-subtle/60 focus:border-app-accent"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-widest text-app-subtle mb-1">Description</label>
            <textarea
              value={service.description}
              onChange={(e) => updateService(service.id, { description: e.target.value })}
              placeholder="What this service does…"
              rows={2}
              className="w-full resize-none rounded-lg border border-app-border bg-app-inset px-2 py-1.5 text-[11px] text-app-text outline-none placeholder:text-app-subtle/60 focus:border-app-accent"
            />
          </div>
          {/* Kind picker */}
          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-widest text-app-subtle mb-1">Kind</label>
            <div className="flex flex-wrap gap-1">
              {SERVICE_KINDS.map((k) => (
                <button
                  key={k}
                  onClick={() => updateService(service.id, { kind: k })}
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-colors',
                    service.kind === k
                      ? 'border-app-accent bg-app-accent/10 text-app-accent'
                      : 'border-app-border text-app-subtle hover:border-app-border-strong',
                  )}
                >
                  {SERVICE_CFG[k].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <NotesEditor
        notes={service.notes}
        onAdd={() => addServiceNote(service.id)}
        onUpdate={(noteId, patch) => updateServiceNote(service.id, noteId, patch)}
        onDelete={(noteId) => deleteServiceNote(service.id, noteId)}
      />
    </div>
  )
}

// ── Services Panel ────────────────────────────────────────────────────────────

export function ServicesPanel() {
  const services   = useSitemapBuilder((s) => s.services)
  const addService = useSitemapBuilder((s) => s.addService)
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div
      className="flex flex-col gap-3 rounded-3xl border-2 border-app-border/60 bg-app-surface p-4"
      style={{ minWidth: 300 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Server size={14} className="text-app-subtle" />
        <span className="flex-1 text-[12px] font-bold text-app-text">Other Services</span>
        {services.length > 0 && (
          <span className="text-[10px] text-app-subtle">
            {services.length} service{services.length !== 1 ? 's' : ''}
          </span>
        )}
        {/* + Add service */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex h-7 items-center gap-1 rounded-lg border border-app-border/50 bg-app-elevated px-2 text-[10px] font-medium text-app-text hover:bg-app-surface"
          >
            <Plus size={11} /> Add
          </button>
          {pickerOpen && (
            <div
              className="absolute top-full right-0 mt-1 z-50 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl"
              style={{ minWidth: 150 }}
            >
              {SERVICE_KINDS.map((k) => {
                const c = SERVICE_CFG[k]
                const KIcon = c.Icon
                return (
                  <button
                    key={k}
                    onClick={() => { addService(k); setPickerOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-app-text hover:bg-app-elevated"
                  >
                    <KIcon size={12} className={c.color} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {services.length === 0 ? (
        <p className="py-3 text-center text-[11px] text-app-subtle">
          No services yet — click <strong>Add</strong>
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {services.map((sv) => <ServiceCard key={sv.id} service={sv} />)}
        </div>
      )}
    </div>
  )
}
