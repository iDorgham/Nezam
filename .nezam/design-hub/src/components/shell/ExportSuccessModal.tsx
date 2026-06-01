'use client'

import { useEffect, useRef, useState } from 'react'
import {
  X, CheckCircle2, ArrowRight, Terminal, FileCode2,
  Layers, Sparkles, Copy, Download, FileText, LayoutGrid, Cpu
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import { EXPORT_FORMATS, generateExportContent, type ExportFormatId } from '@/lib/export-formats'
import { buildLockPayload } from '@/lib/locking/build-lock-payload'

// ─── NEZAM next-step commands ─────────────────────────────────────────────────

const NEXT_STEPS = [
  {
    step: 1,
    title: 'Lock your wireframes',
    desc: 'Commits your sitemap and design decisions so agents can start development.',
    command: '/start wireframe',
    icon: Layers,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    step: 2,
    title: 'Start development',
    desc: 'Launches the SDD pipeline — front-end scaffold, component generation, and theming.',
    command: '/develop',
    icon: Terminal,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    step: 3,
    title: 'Run a design audit',
    desc: 'Agents audit your tokens, components, and contrast ratios against WCAG.',
    command: '/scan design',
    icon: FileCode2,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    step: 4,
    title: 'Apply the design profile',
    desc: 'Writes your exported tokens to the project DESIGN.md and syncs all agents.',
    command: 'pnpm run design:apply',
    icon: Sparkles,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
]

const QUICK_COMMANDS = [
  { label: 'Full SDD flow',      cmd: '/start design' },
  { label: 'Architecture agent', cmd: '/DESIGN sitemap' },
  { label: 'Token audit',        cmd: '/DESIGN tokens' },
  { label: 'Component builder',  cmd: '/DESIGN components' },
  { label: 'Deploy',             cmd: '/deploy' },
  { label: 'Check status',       cmd: '/check' },
]

export function ExportSuccessModal() {
  const open    = useHub((s) => s.exportModalOpen)
  const setOpen = useHub((s) => s.setExportModalOpen)
  const overlayRef = useRef<HTMLDivElement>(null)

  const tokens = useHub((s) => s.design.tokens)
  const arch = useHub((s) => s.arch)
  const activeProfileId = useHub((s) => s.design.activeProfileId)
  const setLockedAt = useHub((s) => s.setLockedAt)
  const setExportPanelOpen = useHub((s) => s.setExportPanelOpen)
  const previewRtl = useHub((s) => s.preview.rtl)
  const [format, setFormat] = useState<ExportFormatId>('css')
  const [copied, setCopied] = useState(false)
  const [lockBusy, setLockBusy] = useState(false)
  const [lockError, setLockError] = useState<string | null>(null)
  const [lockSuccess, setLockSuccess] = useState<{
    designPath: string
    wireframesPath: string
    pages: number
    blocks: number
    profile: string
  } | null>(null)

  const content = generateExportContent(format, arch.pages, tokens)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLock() {
    if (lockBusy) return
    setLockBusy(true)
    setLockError(null)
    setLockSuccess(null)

    try {
      const payload = buildLockPayload({
        tokens,
        archPages: arch.pages,
        profileName: activeProfileId ?? undefined,
        rtl: previewRtl,
        canvasMode: 'saas-dashboard',
      })

      if (payload.sitemap.length === 0) {
        setLockError('No pages found in the Architecture tree (need at least one Page/Sub-page node).')
        return
      }

      const res = await fetch('/api/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 422) {
          const details = Array.isArray(data?.errors) ? data.errors.join('\n') : null
          setLockError(data?.error ? `${data.error}${details ? `\n${details}` : ''}` : 'Lock validation failed.')
          return
        }
        setLockError(data?.error ? String(data.error) : 'Lock failed.')
        return
      }

      setLockedAt(new Date().toISOString())
      setLockSuccess({
        designPath: data?.artifacts?.designPath ?? 'DESIGN.md',
        wireframesPath: data?.artifacts?.wireframesPath ?? 'wireframes_locked.json',
        pages: data?.summary?.pages ?? payload.sitemap.length,
        blocks: data?.summary?.blocks ?? 0,
        profile: data?.summary?.profile ?? (activeProfileId ?? 'custom'),
      })
      setExportPanelOpen(true)
    } catch (e: any) {
      setLockError(e?.message ? String(e.message) : 'Unexpected lock error.')
    } finally {
      setLockBusy(false)
    }
  }

  const pageCount = Object.keys(arch.pages).length
  const colorsCount = Object.keys(tokens.colors.brand).length * 3
  const activeServices = Object.values(arch.pages).reduce((acc, p) => {
    if (p.services) p.services.forEach(s => acc.add(s))
    return acc
  }, new Set<string>()).size

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === overlayRef.current) setOpen(false)
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!open) return null

  async function copyCmd(cmd: string) {
    await navigator.clipboard.writeText(cmd).catch(() => {})
  }

  const activeSpec = EXPORT_FORMATS.find(f => f.id === format)

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto app-scroll rounded-2xl shadow-2xl flex flex-col select-none"
        style={{
          background: 'linear-gradient(160deg, #0d0f17 0%, #06070a 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex flex-col items-center gap-2.5 text-center shrink-0 border-b border-white/5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #0065ff18 0%, #7c3aed18 100%)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <CheckCircle2 size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">12-Format Export Library</h2>
            <p className="text-xs text-white/45 mt-0.5 max-w-md mx-auto leading-relaxed">
              Synthesized and formatted all sitemaps, theme presets, design tokens, and CI matrices.
            </p>
          </div>
        </div>

        {/* Side-by-Side Exporter Section */}
        <div className="flex flex-1 min-h-[440px] border-b border-white/5 overflow-hidden">
          
          {/* LEFT: 12 Export Formats List */}
          <div className="w-[300px] border-r border-white/5 bg-black/15 overflow-y-auto app-scroll p-3 flex flex-col gap-1 shrink-0">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.12em] px-2 mb-2">
              Select Output Format
            </p>
            {EXPORT_FORMATS.map((f) => {
              const isActive = format === f.id
              return (
                <div
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    'flex flex-col gap-0.5 rounded-xl p-2.5 cursor-pointer text-left transition-all duration-100 border select-none',
                    isActive
                      ? 'bg-white/5 border-app-accent shadow-sm'
                      : 'border-transparent hover:bg-white/3'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-white">{f.label}</span>
                    <span className="text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                      .{f.extension}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/35 leading-snug mt-0.5">{f.description}</p>
                </div>
              )
            })}
          </div>

          {/* RIGHT: Export Code Preview Area */}
          <div className="flex-1 flex flex-col bg-black/5 overflow-hidden">
            {/* Format info bar */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/10 select-none">
              <div>
                <p className="text-[11px] font-bold text-white/80">{activeSpec?.label}</p>
                <p className="text-[9.5px] text-white/40 mt-0.5">Format: `.{activeSpec?.extension}`</p>
              </div>
              
              {/* Metrics */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1"><LayoutGrid size={10} />{pageCount} nodes</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Cpu size={10} />{activeServices} wires</span>
              </div>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-auto app-scroll p-4 shrink-0 max-h-[300px]">
              <pre className="text-[10px] font-mono text-white/70 leading-relaxed whitespace-pre font-medium bg-black/40 p-3 rounded-lg border border-white/5 select-text overflow-x-auto">
                {content}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-white/5 bg-black/20 shrink-0 flex items-center justify-between gap-4">
              <span className="text-[10.5px] text-white/40">
                Variables & sitemap configurations updated dynamically.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLock}
                  disabled={lockBusy}
                  className={cn(
                    'h-8 px-5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.99] border flex items-center gap-1.5 shadow-md',
                    lockBusy
                      ? 'bg-white/5 text-white/40 border-white/10 cursor-not-allowed'
                      : 'bg-blue-500/20 text-blue-200 border-blue-500/20 hover:bg-blue-500/25'
                  )}
                  title="Writes DESIGN.md + wireframes_locked.json to the repo root"
                >
                  {lockBusy ? (
                    'Locking…'
                  ) : (
                    <>
                      <FileText size={11} />
                      Lock & sync to repo
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className={cn(
                    'h-8 px-5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.99] border flex items-center gap-1.5 shadow-md',
                    copied
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-app-accent text-white border-transparent hover:bg-app-accent-hover'
                  )}
                >
                  <Copy size={11} />
                  {copied ? '✓ Export Copied!' : `Copy Output`}
                </button>
              </div>
            </div>

            {/* Lock feedback */}
            {lockError ? (
              <div className="px-4 py-3 border-t border-white/5 bg-red-500/10">
                <p className="text-[10.5px] font-semibold text-red-200">Lock failed</p>
                <p className="mt-1 text-[10px] text-red-200/90 whitespace-pre-line">{lockError}</p>
              </div>
            ) : null}
            {lockSuccess ? (
              <div className="px-4 py-3 border-t border-white/5 bg-green-500/10">
                <p className="text-[10.5px] font-semibold text-green-200">Lock succeeded</p>
                <p className="mt-1 text-[10px] text-green-200/90">
                  Wrote <span className="font-mono">{lockSuccess.designPath}</span> and{' '}
                  <span className="font-mono">{lockSuccess.wireframesPath}</span>.
                </p>
                <p className="mt-1 text-[10px] text-green-200/90">
                  {lockSuccess.pages} pages, {lockSuccess.blocks} blocks (profile: {lockSuccess.profile}).
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Next steps */}
        <div className="px-8 py-5 flex flex-col gap-3">
          <p className="text-[9.5px] font-bold text-white/30 uppercase tracking-[0.12em] mb-1">
            Next pipeline steps
          </p>
          <div className="grid grid-cols-2 gap-3">
            {NEXT_STEPS.map(({ step, title, desc, command, icon: Icon, color, bg }) => (
              <div
                key={step}
                className="group flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-all duration-150 hover:bg-white/4 bg-white/2 border border-white/5"
                onClick={() => copyCmd(command)}
                title="Click to copy command"
              >
                <div className="relative shrink-0 mt-0.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: bg }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8.5px] font-bold text-white" style={{ background: color }}>
                    {step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-bold text-white/90">{title}</p>
                  <p className="text-[10px] text-white/40 leading-relaxed mt-0.5">{desc}</p>
                  <code className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-mono border border-white/5 bg-white/5 text-blue-300">
                    {command}
                  </code>
                </div>
                <Copy size={11} className="shrink-0 text-white/10 group-hover:text-white/45 transition-colors mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick commands & Footer */}
        <div className="px-8 pb-8 pt-2 flex flex-col gap-4">
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1">
              {QUICK_COMMANDS.map(({ label, cmd }) => (
                <button
                  key={cmd}
                  onClick={() => copyCmd(cmd)}
                  title={`Copy: ${cmd}`}
                  className="rounded px-2.5 py-1 text-[10px] font-mono border border-white/5 bg-white/2 hover:bg-white/6 text-white/45 hover:text-white/70 transition-all select-none"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 h-8 px-5 rounded-full text-xs font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all shrink-0 active:scale-[0.98]"
            >
              Continue editing sitemap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
