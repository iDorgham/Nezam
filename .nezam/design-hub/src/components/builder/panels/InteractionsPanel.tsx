'use client'

import { Film, Play, Pause, RotateCcw, MousePointer2 } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { Slider } from '@/components/ui/Slider'
import { cn } from '@/lib/cn'

const PRESETS = [
  { id: 'fade', name: 'Fade In', desc: 'A soft opacity reveal' },
  { id: 'slide', name: 'Slide Up', desc: 'Rise with a fade' },
  { id: 'pop', name: 'Scale Pop', desc: 'Spring into place' },
  { id: 'stagger', name: 'Stagger Grid', desc: 'Cascade across cards' },
  { id: 'scroll', name: 'Scroll Reveal', desc: 'Triggered on scroll' },
]

/** Interactions mode — motion presets and timeline controls. */
export function InteractionsPanel() {
  const timeline = useHub((s) => s.timeline)
  const applyPreset = useHub((s) => s.applyTimelinePreset)
  const setPlaying = useHub((s) => s.setPlaying)
  const setPlayhead = useHub((s) => s.setPlayhead)
  const setDuration = useHub((s) => s.setDuration)
  const setStagger = useHub((s) => s.setStagger)
  const toggleScroll = useHub((s) => s.toggleScrollTrigger)

  const restart = () => {
    setPlayhead(0)
    setPlaying(true)
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<Film size={15} />} title="Interactions" subtitle="Motion & entrance timelines" />
      <PanelBody>
        <Section label="Playback">
          <ControlCard>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaying(!timeline.playing)}
                className={cn(
                  'focus-ring flex h-9 flex-1 items-center justify-center gap-1.5 rounded-app-sm text-xs font-semibold transition-transform active:scale-95',
                  'bg-gradient-to-r from-app-accent to-[#4f46e5] text-app-on-accent shadow-app-glow',
                )}
              >
                {timeline.playing ? <Pause size={14} /> : <Play size={14} />}
                {timeline.playing ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={restart}
                aria-label="Restart"
                className="focus-ring grid h-9 w-9 place-items-center rounded-app-sm border border-app-border text-app-muted hover:text-app-text"
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-app-subtle">
              The keyframe timeline is docked below the canvas — drag keyframes and scrub the
              playhead directly.
            </p>
          </ControlCard>
        </Section>

        <Section label="Presets" hint="Apply a curated timeline, then fine-tune it below.">
          <div className="grid grid-cols-1 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  applyPreset(p.id)
                  restart()
                }}
                className="focus-ring group flex items-center gap-2.5 rounded-app border border-app-border bg-app-inset/60 px-3 py-2 text-left transition-all hover:border-app-accent hover:bg-app-accent-subtle"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-app-sm bg-app-accent-subtle text-app-accent">
                  <Play size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-app-text">{p.name}</div>
                  <div className="truncate text-[10px] text-app-subtle">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section label="Timing">
          <ControlCard>
            <Slider
              label="Duration"
              min={0.4}
              max={6}
              step={0.1}
              value={timeline.duration}
              onChange={setDuration}
              format={(v) => `${v.toFixed(1)}s`}
            />
            <div className="mt-3">
              <Slider
                label="Stagger"
                min={0}
                max={0.4}
                step={0.01}
                value={timeline.stagger}
                onChange={setStagger}
                format={(v) => `${Math.round(v * 1000)}ms`}
              />
            </div>
          </ControlCard>
        </Section>

        <Section label="Scroll trigger">
          <button
            onClick={toggleScroll}
            className={cn(
              'focus-ring flex w-full items-center gap-2.5 rounded-app border px-3 py-2.5 text-left transition-colors',
              timeline.scrollTrigger
                ? 'border-app-accent bg-app-accent-subtle'
                : 'border-app-border hover:border-app-border-strong',
            )}
          >
            <div
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center rounded-app-sm',
                timeline.scrollTrigger
                  ? 'bg-app-accent text-app-on-accent'
                  : 'bg-app-inset text-app-subtle',
              )}
            >
              <MousePointer2 size={13} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-app-text">ScrollTrigger</div>
              <div className="text-[10px] text-app-subtle">
                {timeline.scrollTrigger ? 'Plays as the section scrolls in' : 'Plays on load'}
              </div>
            </div>
            <span
              className={cn(
                'flex h-4 w-7 items-center rounded-full p-0.5 transition-colors',
                timeline.scrollTrigger ? 'bg-app-accent' : 'bg-app-border-strong',
              )}
            >
              <span
                className={cn(
                  'h-3 w-3 rounded-full bg-white transition-transform',
                  timeline.scrollTrigger && 'translate-x-3',
                )}
              />
            </span>
          </button>
        </Section>
      </PanelBody>
    </div>
  )
}
