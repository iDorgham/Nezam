'use client'

import { useRef, useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Droplet,
  Move,
  Maximize,
  RotateCw,
  X,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTimelinePlayer } from '@/hooks/useTimelinePlayer'
import { IconButton } from '@/components/ui/IconButton'
import type { AnimProperty } from '@/types'
import { cn } from '@/lib/cn'

const PROP_META: Record<AnimProperty, { icon: typeof Eye; label: string; unit: string }> = {
  opacity: { icon: Droplet, label: 'Opacity', unit: '' },
  y: { icon: Move, label: 'Move Y', unit: 'px' },
  x: { icon: Move, label: 'Move X', unit: 'px' },
  scale: { icon: Maximize, label: 'Scale', unit: '' },
  rotate: { icon: RotateCw, label: 'Rotate', unit: '°' },
  blur: { icon: Eye, label: 'Blur', unit: 'px' },
}

const TARGETS: string[] = [
  'all',
  'text',
  'card',
  'box',
  'nav',
  'hero',
  'featureGrid',
  'stats',
  'productGrid',
  'articleList',
  'pricing',
  'dashboard',
  'cta',
  'footer',
  'arabic',
]

/** The horizontal keyframe timeline docked beneath the canvas. */
export function AnimationTimeline() {
  useTimelinePlayer()

  const timeline = useHub((s) => s.timeline)
  const setPlaying = useHub((s) => s.setPlaying)
  const setPlayhead = useHub((s) => s.setPlayhead)
  const addTrack = useHub((s) => s.addTrack)
  const removeTrack = useHub((s) => s.removeTrack)
  const addKeyframe = useHub((s) => s.addKeyframe)
  const updateKeyframe = useHub((s) => s.updateKeyframe)
  const removeKeyframe = useHub((s) => s.removeKeyframe)

  const lanesRef = useRef<HTMLDivElement>(null)
  const [sel, setSel] = useState<{ trackId: string; kfId: string } | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const fracFromEvent = (clientX: number): number => {
    const el = lanesRef.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width))
  }

  const restart = () => {
    setPlayhead(0)
    requestAnimationFrame(() => setPlaying(true))
  }

  const selectedKf = sel
    ? timeline.tracks
        .find((t) => t.id === sel.trackId)
        ?.keyframes.find((k) => k.id === sel.kfId)
    : null

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-app-border px-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-app-muted">
          Animation Timeline
        </span>
        <div className="ml-1 flex items-center gap-0.5">
          <IconButton
            label={timeline.playing ? 'Pause' : 'Play'}
            size="sm"
            tone="accent"
            active={timeline.playing}
            onClick={() => setPlaying(!timeline.playing)}
          >
            {timeline.playing ? <Pause size={14} /> : <Play size={14} />}
          </IconButton>
          <IconButton label="Restart" size="sm" onClick={restart}>
            <RotateCcw size={14} />
          </IconButton>
        </div>

        <div className="font-mono text-[11px] text-app-text">
          {(timeline.playhead * timeline.duration).toFixed(2)}s
          <span className="text-app-subtle"> / {timeline.duration.toFixed(2)}s</span>
        </div>

        {timeline.scrollTrigger && (
          <span className="rounded-app-pill bg-app-accent-subtle px-2 py-0.5 text-[10px] font-semibold text-app-accent">
            ScrollTrigger
          </span>
        )}

        <div className="flex-1" />

        <div className="relative">
          <button
            onClick={() => setAddOpen((o) => !o)}
            className="focus-ring flex h-7 items-center gap-1 rounded-app-sm border border-app-border px-2 text-[11px] font-medium text-app-muted hover:text-app-text"
          >
            <Plus size={13} />
            Track
          </button>
          {addOpen && (
            <div className="absolute bottom-full right-0 z-50 mb-1.5 w-36 animate-rise-in rounded-app border border-app-border-strong bg-app-elevated p-1 shadow-app-lg">
              {TARGETS.map((tg) => (
                <button
                  key={tg}
                  onClick={() => {
                    addTrack(tg)
                    setAddOpen(false)
                  }}
                  className="focus-ring block w-full rounded-app-sm px-2 py-1.5 text-left text-[11px] capitalize text-app-muted hover:bg-app-surface hover:text-app-text"
                >
                  {tg}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ruler + lanes */}
      <div className="flex min-h-0 flex-1">
        {/* Track labels */}
        <div className="w-32 shrink-0 border-r border-app-border">
          <div className="h-6 border-b border-app-border bg-app-inset" />
          <div className="app-scroll max-h-full overflow-y-auto">
            {timeline.tracks.map((track) => (
              <div
                key={track.id}
                className="group flex h-12 items-center gap-1.5 border-b border-app-border px-2.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-app-accent" />
                <span className="flex-1 truncate text-[11px] font-medium text-app-text">
                  {track.label}
                </span>
                <button
                  onClick={() => removeTrack(track.id)}
                  aria-label={`Remove ${track.label} track`}
                  className="opacity-0 transition-opacity hover:text-app-danger group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lanes */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {/* Ruler */}
          <div
            className="relative h-6 cursor-pointer border-b border-app-border bg-app-inset"
            onPointerDown={(e) => {
              ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
              setPlaying(false)
              setPlayhead(fracFromEvent(e.clientX))
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) setPlayhead(fracFromEvent(e.clientX))
            }}
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{ left: `${i * 10}%` }}
              >
                <div className="h-1.5 w-px bg-app-border-strong" />
                {i % 5 === 0 && (
                  <span className="absolute left-1 top-1 font-mono text-[8px] text-app-subtle">
                    {((i / 10) * timeline.duration).toFixed(1)}s
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Lane rows */}
          <div ref={lanesRef} className="app-scroll relative max-h-full overflow-y-auto">
            {timeline.tracks.map((track) => (
              <div
                key={track.id}
                className="relative h-12 border-b border-app-border"
                onDoubleClick={(e) => addKeyframe(track.id, fracFromEvent(e.clientX))}
              >
                {/* connecting line */}
                {track.keyframes.length > 1 && (
                  <div
                    className="absolute top-1/2 h-px bg-app-border-strong"
                    style={{
                      left: `${Math.min(...track.keyframes.map((k) => k.at)) * 100}%`,
                      right: `${(1 - Math.max(...track.keyframes.map((k) => k.at))) * 100}%`,
                    }}
                  />
                )}
                {track.keyframes.map((kf) => {
                  const Icon = PROP_META[kf.property].icon
                  const active = sel?.kfId === kf.id
                  return (
                    <button
                      key={kf.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSel({ trackId: track.id, kfId: kf.id })
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
                      }}
                      onPointerMove={(e) => {
                        if (e.buttons === 1) {
                          updateKeyframe(track.id, kf.id, { at: fracFromEvent(e.clientX) })
                        }
                      }}
                      className={cn(
                        'absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center rounded-[5px] border transition-colors',
                        active
                          ? 'border-app-accent bg-app-accent text-app-on-accent'
                          : 'border-app-border-strong bg-app-elevated text-app-muted hover:border-app-accent',
                      )}
                      style={{ left: `${kf.at * 100}%` }}
                    >
                      <Icon size={11} className="-rotate-45" />
                    </button>
                  )
                })}
              </div>
            ))}
            {timeline.tracks.length === 0 && (
              <div className="grid h-24 place-items-center text-[11px] text-app-subtle">
                Add a track to start animating.
              </div>
            )}

            {/* Playhead */}
            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-px bg-app-accent"
              style={{ left: `${timeline.playhead * 100}%` }}
            >
              <div className="absolute -left-[5px] -top-[1px] h-2.5 w-2.5 rounded-[2px] bg-app-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe editor */}
      {selectedKf && sel && (
        <div className="flex h-12 shrink-0 items-center gap-3 border-t border-app-border bg-app-inset px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-app-subtle">
            Keyframe
          </span>
          <div className="flex items-center gap-0.5">
            {(Object.keys(PROP_META) as AnimProperty[]).map((p) => {
              const Icon = PROP_META[p].icon
              return (
                <IconButton
                  key={p}
                  label={PROP_META[p].label}
                  size="sm"
                  active={selectedKf.property === p}
                  onClick={() => updateKeyframe(sel.trackId, sel.kfId, { property: p })}
                >
                  <Icon size={13} />
                </IconButton>
              )
            })}
          </div>
          <NumField
            label="From"
            value={selectedKf.from}
            onChange={(v) => updateKeyframe(sel.trackId, sel.kfId, { from: v })}
          />
          <NumField
            label="To"
            value={selectedKf.to}
            onChange={(v) => updateKeyframe(sel.trackId, sel.kfId, { to: v })}
          />
          <span className="font-mono text-[10px] text-app-subtle">
            @ {(selectedKf.at * 100).toFixed(0)}%
          </span>
          <div className="flex-1" />
          <button
            onClick={() => {
              removeKeyframe(sel.trackId, sel.kfId)
              setSel(null)
            }}
            className="focus-ring flex h-7 items-center gap-1 rounded-app-sm border border-app-border px-2 text-[10px] font-medium text-app-muted hover:text-app-danger"
          >
            <Trash2 size={11} />
            Delete
          </button>
          <button
            onClick={() => setSel(null)}
            aria-label="Close keyframe editor"
            className="focus-ring grid h-7 w-7 place-items-center rounded-app-sm text-app-subtle hover:text-app-text"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[10px] text-app-subtle">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring h-7 w-16 rounded-app-sm border border-app-border bg-app-bg px-1.5 font-mono text-[11px] text-app-text"
      />
    </label>
  )
}
