'use client'

import { useEffect, useRef } from 'react'
import {
  X, CheckCircle2, ArrowRight, Terminal, FileCode2,
  Layers, Sparkles, Copy, ExternalLink,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'

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

// ─── Component ────────────────────────────────────────────────────────────────

export function ExportSuccessModal() {
  const open    = useHub((s) => s.exportModalOpen)
  const setOpen = useHub((s) => s.setExportModalOpen)
  const overlayRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto app-scroll rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #131620 0%, #0d0e13 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #22c55e22 0%, #16a34a22 100%)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckCircle2 size={22} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Design exported! 🎉</h2>
            <p className="text-sm text-white/45 mt-1 leading-relaxed">
              Your tokens and architecture are ready. Here's what to do next.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 h-px bg-white/6" />

        {/* Next steps */}
        <div className="px-8 py-6 flex flex-col gap-3">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-1">
            Next steps
          </p>
          {NEXT_STEPS.map(({ step, title, desc, command, icon: Icon, color, bg }) => (
            <div
              key={step}
              className="group flex items-start gap-3 rounded-xl p-4 cursor-pointer transition-all duration-150 hover:bg-white/4"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => copyCmd(command)}
              title="Click to copy command"
            >
              {/* Step number + icon */}
              <div className="relative shrink-0 mt-0.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: bg }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <span
                  className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                  style={{ background: color }}
                >
                  {step}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white/90">{title}</p>
                <p className="text-[11px] text-white/40 leading-relaxed mt-0.5">{desc}</p>
                <code
                  className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#93c5fd', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {command}
                </code>
              </div>

              {/* Copy icon */}
              <Copy size={12} className="shrink-0 text-white/20 group-hover:text-white/50 transition-colors mt-1" />
            </div>
          ))}
        </div>

        {/* Quick commands */}
        <div className="mx-8 mb-6">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-3">
            Quick commands
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {QUICK_COMMANDS.map(({ label, cmd }) => (
              <button
                key={cmd}
                onClick={() => copyCmd(cmd)}
                title={`Copy: ${cmd}`}
                className={cn(
                  'flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-all duration-100',
                  'hover:bg-white/6 active:scale-[0.98]',
                )}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[11px] font-medium text-white/70">{label}</span>
                <code className="text-[10px] font-mono text-white/35">{cmd}</code>
              </button>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="mx-8 mb-8 flex flex-col items-center gap-3 rounded-xl p-5 text-center"
          style={{ background: 'rgba(38,128,235,0.08)', border: '1px solid rgba(38,128,235,0.18)' }}
        >
          <p className="text-[12px] text-white/60 leading-relaxed">
            Ready to build? Run <code className="px-1 py-0.5 rounded text-[11px] font-mono" style={{ background: 'rgba(255,255,255,0.08)', color: '#93c5fd' }}>/develop</code> in your terminal to start the full SDD pipeline.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              Continue editing
            </button>
            <button
              onClick={() => { copyCmd('/develop'); setOpen(false) }}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #2680eb 0%, #7c3aed 100%)', boxShadow: '0 0 20px rgba(38,128,235,0.3)' }}
            >
              Copy /develop
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
