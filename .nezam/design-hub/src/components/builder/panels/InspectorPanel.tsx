'use client'

import { useState } from 'react'
import {
  Focus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Square,
  Sparkles,
  Wand2,
  RotateCcw,
  ChevronRight,
  Image as ImageIcon,
  Eye,
  Layers as LayersIcon,
  CaseUpper,
  Underline,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelHeader, PanelBody, Section, ControlCard } from '@/components/ui/Panel'
import { Slider } from '@/components/ui/Slider'
import { Segmented } from '@/components/ui/Segmented'
import { ColorField } from '@/components/ui/ColorField'
import { CssEditor } from '@/components/ui/CssEditor'
import { parseAdjust } from '@/lib/adjust'
import type {
  BgFill,
  BgScroll,
  NodeStyle,
  Selection,
  TextAlign,
  TextDecoration,
  TextTransform,
} from '@/types'
import { cn } from '@/lib/cn'

const FONT_OPTIONS = [
  { label: 'Geist', value: "'Geist', 'Inter', sans-serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Sora', value: "'Sora', sans-serif" },
  { label: 'Manrope', value: "'Manrope', sans-serif" },
  { label: 'Plex', value: "'IBM Plex Sans', sans-serif" },
  { label: 'Cairo', value: "'Cairo', sans-serif" },
]

/** Hook-style accessor for a node's style + setter. */
function useNodeStyle(nodeId: string | undefined) {
  const style = useHub((s) => (nodeId ? s.nodeStyles[nodeId] : undefined))
  const setNodeStyle = useHub((s) => s.setNodeStyle)
  const resetNodeStyle = useHub((s) => s.resetNodeStyle)
  const setRawCss = useHub((s) => s.setRawCss)
  return {
    style: style ?? {},
    set: (patch: Partial<NodeStyle>) => nodeId && setNodeStyle(nodeId, patch),
    reset: () => nodeId && resetNodeStyle(nodeId),
    setCss: (css: Record<string, string>) => nodeId && setRawCss(nodeId, css),
    edited: !!style && Object.keys(style).length > 0,
  }
}

/* ── Inspector root ─────────────────────────────────────────── */

export function InspectorPanel() {
  const selection = useHub((s) => s.selection)
  const selectScope = useHub((s) => s.selectScope)
  const select = useHub((s) => s.select)
  const blocks = useHub((s) => s.blocks)

  if (!selection) return <EmptyInspector />

  const block = selection.blockId ? blocks.find((b) => b.id === selection.blockId) : null

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<Focus size={15} />}
        title="Inspector"
        subtitle={
          selection.scope === 'page'
            ? 'Page settings'
            : selection.scope === 'section'
              ? `Section · ${block?.label ?? selection.label}`
              : selection.label
        }
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 border-b border-app-border bg-app-inset px-3 py-2 text-[10.5px]">
        <Crumb
          label="Page"
          active={selection.scope === 'page'}
          onClick={() => selectScope('page')}
        />
        {block && (
          <>
            <ChevronRight size={11} className="text-app-subtle" />
            <Crumb
              label={block.label}
              active={selection.scope === 'section'}
              onClick={() => selectScope('section')}
            />
          </>
        )}
        {selection.scope === 'element' && selection.nodeId && (
          <>
            <ChevronRight size={11} className="text-app-subtle" />
            <Crumb label={selection.label} active onClick={() => selectScope('element')} />
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => select(null)}
          className="focus-ring rounded-app-sm px-1.5 py-0.5 text-[10px] text-app-subtle hover:text-app-text"
        >
          Clear
        </button>
      </div>

      <PanelBody>
        {selection.scope === 'page' && <PageSettings />}
        {selection.scope === 'section' && selection.blockId && (
          <SectionSettings selection={selection} />
        )}
        {selection.scope === 'element' && selection.nodeId && (
          <ElementSettings selection={selection} />
        )}
      </PanelBody>
    </div>
  )
}

function Crumb({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'focus-ring max-w-[120px] truncate rounded-app-sm px-1.5 py-0.5 transition-colors',
        active
          ? 'bg-app-accent-subtle font-semibold text-app-text'
          : 'text-app-muted hover:bg-app-elevated hover:text-app-text',
      )}
    >
      {label}
    </button>
  )
}

function EmptyInspector() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<Focus size={15} />} title="Inspector" subtitle="Context-aware editing" />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-app-lg border border-app-border bg-app-inset text-app-subtle">
          <Focus size={20} />
        </div>
        <div className="text-xs font-semibold text-app-text">Nothing selected</div>
        <p className="mt-1 text-[11px] leading-relaxed text-app-subtle">
          Click any element in the preview — text, a card, a section. The Inspector adapts to it.
        </p>
      </div>
    </div>
  )
}

/* ── Page settings ──────────────────────────────────────────── */

function PageSettings() {
  const pageStyle = useHub((s) => s.pageStyle)
  const setPageStyle = useHub((s) => s.setPageStyle)
  const tokens = useTokens()

  return (
    <>
      <Section label="Canvas" hint="Page-level rhythm and surface.">
        <ControlCard>
          <Slider
            label="Content width"
            min={520}
            max={1440}
            step={20}
            value={pageStyle.width}
            onChange={(v) => setPageStyle({ width: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Page padding"
              min={0}
              max={80}
              value={pageStyle.padding}
              onChange={(v) => setPageStyle({ padding: v })}
              format={(v) => `${v}px`}
            />
          </div>
        </ControlCard>
      </Section>
      <Section label="Background">
        <ColorField
          label="Page background"
          value={pageStyle.bg ?? tokens.bg}
          onChange={(v) => setPageStyle({ bg: v })}
        />
      </Section>
      <Section label="Reset">
        <button
          onClick={() => setPageStyle({ width: 1080, padding: 0, bg: undefined })}
          className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-app border border-app-border py-2 text-[11px] font-medium text-app-muted hover:text-app-text"
        >
          <RotateCcw size={11} />
          Reset to defaults
        </button>
      </Section>
    </>
  )
}

/* ── Section settings ───────────────────────────────────────── */

function SectionSettings({ selection }: { selection: Selection }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(selection.blockId)
  const tokens = useTokens()
  const fill: BgFill = style.bgFill ?? 'solid'
  const scroll: BgScroll = style.bgScroll ?? 'normal'

  return (
    <>
      {edited && (
        <ResetRow onReset={reset} />
      )}
      <AiAdjust kind="section" onApply={set} />

      <Section label="Background">
        <Segmented<BgFill>
          value={fill}
          onChange={(v) => set({ bgFill: v })}
          className="mb-2.5 w-full [&>button]:flex-1"
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'image', label: 'Image' },
          ]}
        />
        {fill !== 'image' && (
          <ColorField
            label={fill === 'gradient' ? 'Gradient start' : 'Fill color'}
            value={style.bg ?? tokens.surface}
            onChange={(v) => set({ bg: v })}
          />
        )}
        {fill === 'gradient' && (
          <ColorField
            label="Gradient end"
            value={style.bgTo ?? tokens.brand}
            onChange={(v) => set({ bgTo: v })}
          />
        )}
        {fill === 'image' && (
          <input
            value={style.bgImage ?? ''}
            onChange={(e) => set({ bgImage: e.target.value })}
            placeholder="https://image-url.jpg"
            className="focus-ring h-8 w-full rounded-app-sm border border-app-border bg-app-inset px-2 text-[11px] text-app-text"
          />
        )}
      </Section>

      <Section
        label="Background scroll"
        hint={
          scroll === 'parallax'
            ? 'The background drifts as the page scrolls.'
            : scroll === 'fixed'
              ? 'The background stays pinned to the viewport.'
              : 'The background scrolls with the page.'
        }
      >
        <Segmented<BgScroll>
          value={scroll}
          onChange={(v) => set({ bgScroll: v })}
          className="w-full [&>button]:flex-1"
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'parallax', label: 'Parallax' },
          ]}
        />
      </Section>

      <Section label="Layout">
        <ControlCard>
          <Slider
            label="Padding"
            min={0}
            max={80}
            value={style.padding ?? 24}
            onChange={(v) => set({ padding: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Margin"
              min={0}
              max={80}
              value={style.margin ?? 0}
              onChange={(v) => set({ margin: v })}
              format={(v) => `${v}px`}
            />
          </div>
          <div className="mt-3">
            <Slider
              label="Min height"
              min={0}
              max={600}
              value={style.minHeight ?? 0}
              onChange={(v) => set({ minHeight: v })}
              format={(v) => (v === 0 ? 'auto' : `${v}px`)}
            />
          </div>
        </ControlCard>
      </Section>

      <Section label="Columns" hint="Split this section into 1–5 equal columns.">
        <ColumnsPicker
          value={style.columns ?? 3}
          onChange={(v) => set({ columns: v })}
        />
      </Section>

      <Section label="Shape">
        <ControlCard>
          <Slider
            label="Radius"
            min={0}
            max={48}
            value={style.radius ?? tokens.radius}
            onChange={(v) => set({ radius: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Border"
              min={0}
              max={6}
              value={style.borderWidth ?? 1}
              onChange={(v) => set({ borderWidth: v })}
              format={(v) => `${v}px`}
            />
          </div>
        </ControlCard>
      </Section>

      <RawCssSection css={style.css ?? {}} onChange={setCss} />
    </>
  )
}

/* ── Element settings (role-based) ──────────────────────────── */

function ElementSettings({ selection }: { selection: Selection }) {
  if (selection.role === 'text') return <TextElementSettings nodeId={selection.nodeId!} />
  if (selection.role === 'card') return <CardElementSettings nodeId={selection.nodeId!} />
  return <BoxElementSettings nodeId={selection.nodeId!} />
}

/* ── Text element — Figma-style editor ──────────────────────── */

function TextElementSettings({ nodeId }: { nodeId: string }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(nodeId)
  const tokens = useTokens()
  const content = useHub((s) => s.contentOverrides[nodeId] ?? '')
  const setContent = useHub((s) => s.setContent)

  return (
    <>
      {edited && <ResetRow onReset={reset} />}

      <Section label="Content" hint="Edit the text here or double-click on the canvas.">
        <textarea
          value={content}
          onChange={(e) => setContent(nodeId, e.target.value)}
          rows={3}
          placeholder="(unchanged default text)"
          className="focus-ring w-full resize-none rounded-app-sm border border-app-border bg-app-inset px-2.5 py-2 text-[12px] leading-relaxed text-app-text"
        />
      </Section>

      <AiAdjust kind="text" onApply={set} />

      <Section label="Typeface">
        <FontRow value={style.fontFamily ?? tokens.fontSans} onChange={(v) => set({ fontFamily: v })} />
      </Section>

      <Section label="Size & spacing">
        <ControlCard>
          <Slider
            label="Size"
            min={0.55}
            max={2.2}
            step={0.05}
            value={style.fontScale ?? 1}
            onChange={(v) => set({ fontScale: v })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <div className="mt-3">
            <Slider
              label="Line height"
              min={0.9}
              max={2.6}
              step={0.05}
              value={style.lineHeight ?? 1.5}
              onChange={(v) => set({ lineHeight: v })}
              format={(v) => v.toFixed(2)}
            />
          </div>
          <div className="mt-3">
            <Slider
              label="Letter spacing"
              min={-0.08}
              max={0.4}
              step={0.005}
              value={style.letterSpacing ?? 0}
              onChange={(v) => set({ letterSpacing: v })}
              format={(v) => `${v.toFixed(3)}em`}
            />
          </div>
          <div className="mt-3">
            <Slider
              label="Paragraph spacing"
              min={0}
              max={48}
              value={style.paragraphSpacing ?? 0}
              onChange={(v) => set({ paragraphSpacing: v })}
              format={(v) => `${v}px`}
            />
          </div>
        </ControlCard>
      </Section>

      <Section label="Weight">
        <Segmented<string>
          value={String(style.weight ?? 600)}
          onChange={(v) => set({ weight: Number(v) })}
          className="w-full [&>button]:flex-1"
          options={[
            { value: '300', label: 'Light' },
            { value: '400', label: 'Reg' },
            { value: '500', label: 'Med' },
            { value: '600', label: 'Semi' },
            { value: '700', label: 'Bold' },
            { value: '800', label: 'Black' },
          ]}
        />
      </Section>

      <Section label="Alignment">
        <Segmented<TextAlign>
          value={style.align ?? 'start'}
          onChange={(v) => set({ align: v })}
          className="w-full [&>button]:flex-1"
          options={[
            { value: 'start', label: <AlignLeft size={14} />, tooltip: 'Start' },
            { value: 'center', label: <AlignCenter size={14} />, tooltip: 'Center' },
            { value: 'end', label: <AlignRight size={14} />, tooltip: 'End' },
            { value: 'justify', label: <AlignJustify size={14} />, tooltip: 'Justify' },
          ]}
        />
      </Section>

      <Section label="Colour">
        <ColorField
          label="Text colour"
          value={style.textColor ?? tokens.text}
          onChange={(v) => set({ textColor: v })}
        />
      </Section>

      <Section label="Transform & decoration">
        <div className="grid grid-cols-2 gap-2">
          <Segmented<TextTransform>
            value={style.textTransform ?? 'none'}
            onChange={(v) => set({ textTransform: v })}
            className="[&>button]:flex-1"
            options={[
              { value: 'none', label: 'Aa', tooltip: 'None' },
              { value: 'uppercase', label: 'AA', tooltip: 'Uppercase' },
              { value: 'capitalize', label: 'Aa', tooltip: 'Capitalize' },
              { value: 'lowercase', label: 'aa', tooltip: 'lowercase' },
            ]}
          />
          <Segmented<TextDecoration>
            value={style.textDecoration ?? 'none'}
            onChange={(v) => set({ textDecoration: v })}
            className="[&>button]:flex-1"
            options={[
              { value: 'none', label: '—', tooltip: 'None' },
              { value: 'underline', label: <Underline size={12} />, tooltip: 'Underline' },
            ]}
          />
        </div>
      </Section>

      <RawCssSection css={style.css ?? {}} onChange={setCss} />
    </>
  )
}

/* ── Card element — sub-part inspector ──────────────────────── */

const CARD_PARTS = [
  { id: 'icon', label: 'Icon', icon: Square },
  { id: 'title', label: 'Title', icon: Type },
  { id: 'desc', label: 'Description', icon: AlignLeft },
  { id: 'button', label: 'Button', icon: Sparkles },
  { id: 'container', label: 'Card', icon: LayersIcon },
] as const
type CardPart = (typeof CARD_PARTS)[number]['id']

function CardElementSettings({ nodeId }: { nodeId: string }) {
  const [part, setPart] = useState<CardPart>('container')
  const targetId = part === 'container' ? nodeId : `${nodeId}:${part}`
  const isText = part === 'title' || part === 'desc' || part === 'button'

  return (
    <>
      <Section label="Part of the card" hint="Each part has its own typography and surface.">
        <div className="grid grid-cols-5 gap-1">
          {CARD_PARTS.map((p) => {
            const Icon = p.icon
            const active = p.id === part
            return (
              <button
                key={p.id}
                onClick={() => setPart(p.id)}
                className={cn(
                  'focus-ring flex flex-col items-center gap-1 rounded-app-sm border py-2 transition-colors',
                  active
                    ? 'border-app-accent bg-app-accent-subtle text-app-text'
                    : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
                )}
              >
                <Icon size={13} />
                <span className="text-[9.5px] font-medium">{p.label}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {isText ? (
        <TextElementSettings nodeId={targetId} />
      ) : (
        <BoxElementSettings nodeId={targetId} />
      )}
    </>
  )
}

/* ── Generic box element ────────────────────────────────────── */

function BoxElementSettings({ nodeId }: { nodeId: string }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(nodeId)
  const tokens = useTokens()
  const fill: BgFill = style.bgFill ?? 'solid'

  return (
    <>
      {edited && <ResetRow onReset={reset} />}
      <AiAdjust kind="section" onApply={set} />

      <Section label="Fill">
        <Segmented<BgFill>
          value={fill}
          onChange={(v) => set({ bgFill: v })}
          className="mb-2.5 w-full [&>button]:flex-1"
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'image', label: 'Image' },
          ]}
        />
        {fill !== 'image' && (
          <ColorField
            label={fill === 'gradient' ? 'Gradient start' : 'Fill colour'}
            value={style.bg ?? tokens.elevated}
            onChange={(v) => set({ bg: v })}
          />
        )}
        {fill === 'gradient' && (
          <ColorField
            label="Gradient end"
            value={style.bgTo ?? tokens.brand}
            onChange={(v) => set({ bgTo: v })}
          />
        )}
        {fill === 'image' && (
          <input
            value={style.bgImage ?? ''}
            onChange={(e) => set({ bgImage: e.target.value })}
            placeholder="https://image-url.jpg"
            className="focus-ring h-8 w-full rounded-app-sm border border-app-border bg-app-inset px-2 text-[11px] text-app-text"
          />
        )}
      </Section>

      <Section label="Spacing & size">
        <ControlCard>
          <Slider
            label="Padding"
            min={0}
            max={64}
            value={style.padding ?? 0}
            onChange={(v) => set({ padding: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Margin"
              min={0}
              max={64}
              value={style.margin ?? 0}
              onChange={(v) => set({ margin: v })}
              format={(v) => `${v}px`}
            />
          </div>
          <div className="mt-3">
            <Slider
              label="Radius"
              min={0}
              max={48}
              value={style.radius ?? 0}
              onChange={(v) => set({ radius: v })}
              format={(v) => `${v}px`}
            />
          </div>
          <div className="mt-3">
            <Slider
              label="Opacity"
              min={0}
              max={1}
              step={0.05}
              value={style.opacity ?? 1}
              onChange={(v) => set({ opacity: v })}
              format={(v) => `${Math.round(v * 100)}%`}
            />
          </div>
        </ControlCard>
      </Section>

      <Section label="Border">
        <ColorField
          label="Border colour"
          value={style.borderColor ?? tokens.border}
          onChange={(v) => set({ borderColor: v })}
        />
      </Section>

      <RawCssSection css={style.css ?? {}} onChange={setCss} />
    </>
  )
}

/* ── Shared bits ────────────────────────────────────────────── */

function ResetRow({ onReset }: { onReset: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-app border border-app-border bg-app-inset/60 px-3 py-2">
      <span className="text-[11px] text-app-muted">Custom styles applied.</span>
      <button
        onClick={onReset}
        className="focus-ring flex items-center gap-1 rounded-app-sm border border-app-border px-2 py-1 text-[10px] font-medium text-app-muted hover:text-app-text"
      >
        <RotateCcw size={11} />
        Reset
      </button>
    </div>
  )
}

function FontRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FONT_OPTIONS.map((f) => {
        const active = f.value === value
        return (
          <button
            key={f.label}
            onClick={() => onChange(f.value)}
            style={{ fontFamily: f.value }}
            className={cn(
              'focus-ring rounded-app-sm border px-2.5 py-1.5 text-[12px] transition-colors',
              active
                ? 'border-app-accent bg-app-accent-subtle text-app-text'
                : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

function ColumnsPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n === value
        return (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              'focus-ring flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-app border transition-all',
              active
                ? 'border-app-accent bg-app-accent-subtle'
                : 'border-app-border hover:border-app-border-strong',
            )}
          >
            <span className="flex gap-0.5">
              {Array.from({ length: n }).map((_, i) => (
                <span
                  key={i}
                  className={cn('h-4 w-1 rounded-sm', active ? 'bg-app-accent' : 'bg-app-border-strong')}
                />
              ))}
            </span>
            <span className="text-[10px] font-medium text-app-muted">{n}</span>
          </button>
        )
      })}
    </div>
  )
}

function RawCssSection({
  css,
  onChange,
}: {
  css: Record<string, string>
  onChange: (next: Record<string, string>) => void
}) {
  const [open, setOpen] = useState(Object.keys(css).length > 0)
  return (
    <Section
      label="Raw CSS"
      hint="Advanced — overrides curated controls."
      action={
        <button
          onClick={() => setOpen((o) => !o)}
          className="focus-ring rounded-app-sm border border-app-border px-2 py-0.5 text-[10px] font-medium text-app-muted hover:text-app-text"
        >
          {open ? 'Hide' : 'Show'}
        </button>
      }
    >
      {open && <CssEditor value={css} onChange={onChange} />}
    </Section>
  )
}

function AiAdjust({
  kind,
  onApply,
}: {
  kind: 'text' | 'section'
  onApply: (patch: Partial<NodeStyle>) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [note, setNote] = useState<string | null>(null)

  const apply = () => {
    const { patch, summary } = parseAdjust(prompt, kind)
    // The legacy `parseAdjust` returns ElementStyle-shaped keys (same names map
    // cleanly onto NodeStyle), so we can apply the patch as-is.
    if (Object.keys(patch).length) {
      onApply(patch as Partial<NodeStyle>)
      setNote(summary)
    } else {
      setNote('Try: bigger, bolder, centered, more padding, gradient, blue…')
    }
    setPrompt('')
    setTimeout(() => setNote(null), 3000)
  }

  return (
    <Section label="AI adjust" hint="Describe a change in plain words.">
      <div className="rounded-app-sm border border-app-border bg-app-inset/60 p-2">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="shrink-0 text-app-accent" />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={kind === 'text' ? 'make it bolder and centered' : 'gradient background, more padding'}
            className="h-7 w-full bg-transparent text-[12px] text-app-text placeholder:text-app-subtle focus:outline-none"
          />
          <button
            onClick={apply}
            className="focus-ring inline-flex h-7 items-center gap-1 rounded-app-sm bg-app-accent px-2.5 text-[11px] font-semibold text-app-on-accent active:scale-95"
          >
            <Wand2 size={12} />
            Apply
          </button>
        </div>
        {note && <p className="mt-1.5 text-[10px] text-app-accent">{note}</p>}
      </div>
    </Section>
  )
}
