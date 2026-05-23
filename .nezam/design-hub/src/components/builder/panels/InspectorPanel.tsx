'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Focus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Square,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Eye,
  EyeOff,
  Layers as LayersIcon,
  Underline,
  SlidersHorizontal,
  Lock,
  LockOpen,
  Trash2,
  Edit2,
  Menu,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { contrastRatio } from '@/lib/tokens'
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
  Block,
  ShadowStyle,
} from '@/types'
import { cn } from '@/lib/cn'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const FONT_OPTIONS = [
  { label: 'Geist', value: "'Geist', 'Inter', sans-serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Sora', value: "'Sora', sans-serif" },
  { label: 'Cairo', value: "'Cairo', sans-serif" },
]

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

export function InspectorPanel() {
  const selection = useHub((s) => s.selection)
  const selectScope = useHub((s) => s.selectScope)
  const select = useHub((s) => s.select)
  const blocks = useHub((s) => s.blocks)

  const [activeTab, setActiveTab] = useState<'properties' | 'styles' | 'layers'>('properties')

  const block = selection?.blockId ? blocks.find((b) => b.id === selection.blockId) : null

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col select-none">
      <PanelHeader
        icon={<Focus size={15} />}
        title="Inspector"
        subtitle={
          selection?.scope === 'page'
            ? 'Page settings'
            : selection?.scope === 'section'
              ? `Section · ${block?.label ?? selection.label}`
              : selection?.label ?? 'Design specifications'
        }
      />

      {/* Sub-tab selection */}
      <div className="flex items-center border-b border-app-border bg-app-inset/30 px-3 py-1">
        <button
          onClick={() => setActiveTab('properties')}
          className={cn(
            'flex-1 text-center py-1.5 text-[10.5px] font-semibold border-b-2 transition-all duration-200 outline-none',
            activeTab === 'properties'
              ? 'border-app-accent text-app-text font-bold'
              : 'border-transparent text-app-muted hover:text-app-text'
          )}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={cn(
            'flex-1 text-center py-1.5 text-[10.5px] font-semibold border-b-2 transition-all duration-200 outline-none',
            activeTab === 'styles'
              ? 'border-app-accent text-app-text font-bold'
              : 'border-transparent text-app-muted hover:text-app-text'
          )}
        >
          Styles
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={cn(
            'flex-1 text-center py-1.5 text-[10.5px] font-semibold border-b-2 transition-all duration-200 outline-none',
            activeTab === 'layers'
              ? 'border-app-accent text-app-text font-bold'
              : 'border-transparent text-app-muted hover:text-app-text'
          )}
        >
          Layers
        </button>
      </div>

      {activeTab === 'properties' && (
        <div className="flex h-full min-w-0 flex-col">
          {selection && (
            <div className="flex items-center gap-1 border-b border-app-border bg-app-inset/60 px-3 py-1.5 text-[10.5px]">
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
          )}

          <PanelBody className="p-3">
            {!selection ? (
              <PageSettings />
            ) : (
              <>
                {selection.scope === 'page' && <PageSettings />}
                {selection.scope === 'section' && selection.blockId && (
                  <SectionSettings selection={selection} />
                )}
                {selection.scope === 'element' && selection.nodeId && (
                  <ElementSettings selection={selection} />
                )}
              </>
            )}
          </PanelBody>
        </div>
      )}

      {activeTab === 'styles' && (
        <PanelBody className="p-3">
          <GlobalStylesPanel />
        </PanelBody>
      )}

      {activeTab === 'layers' && <LayersTabPanel />}
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
          : 'text-app-muted hover:bg-app-elevated hover:text-app-text'
      )}
    >
      {label}
    </button>
  )
}

/* ── Properties Sub-Panel: Page settings ────────────────── */
function PageSettings() {
  const pageStyle = useHub((s) => s.pageStyle)
  const setPageStyle = useHub((s) => s.setPageStyle)
  const tokens = useTokens()

  return (
    <div className="space-y-4">
      <Section label="Canvas sizing">
        <ControlCard>
          <Slider
            label="Content max-width"
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
      <Section label="Background fill">
        <ColorField
          label="Page background"
          value={pageStyle.bg ?? tokens.bg}
          onChange={(v) => setPageStyle({ bg: v })}
        />
      </Section>
      <Section label="Reset settings">
        <button
          onClick={() => setPageStyle({ width: 1080, padding: 0, bg: undefined })}
          className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-app border border-app-border py-2 text-[11px] font-medium text-app-muted hover:text-app-text active:scale-95 transition-all"
        >
          <RotateCcw size={11} />
          Reset page defaults
        </button>
      </Section>
    </div>
  )
}

/* ── Properties Sub-Panel: Section settings ─────────────── */
function SectionSettings({ selection }: { selection: Selection }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(selection.blockId)
  const tokens = useTokens()
  const fill: BgFill = style.bgFill ?? 'solid'
  const scroll: BgScroll = style.bgScroll ?? 'normal'

  return (
    <div className="space-y-4">
      {edited && <ResetRow onReset={reset} />}
      <AiAdjust kind="section" onApply={set} />

      <Section label="Background fill">
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
            className="focus-ring h-8 w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 text-[11px] text-app-text focus:border-app-accent focus:outline-none"
          />
        )}
      </Section>

      <Section label="Background drift scroll">
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

      <Section label="Layout metrics">
        <ControlCard>
          <Slider
            label="Spacing padding"
            min={0}
            max={80}
            value={style.padding ?? 24}
            onChange={(v) => set({ padding: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Margin vertical"
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

      <Section label="Grid columns structure">
        <ColumnsPicker value={style.columns ?? 3} onChange={(v) => set({ columns: v })} />
      </Section>

      <Section label="Section corner shaping">
        <ControlCard>
          <Slider
            label="Radius curve"
            min={0}
            max={48}
            value={style.radius ?? tokens.radius}
            onChange={(v) => set({ radius: v })}
            format={(v) => `${v}px`}
          />
          <div className="mt-3">
            <Slider
              label="Border thickness"
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
    </div>
  )
}

/* ── Properties Sub-Panel: Element settings ─────────────── */
function ElementSettings({ selection }: { selection: Selection }) {
  if (selection.role === 'text') return <TextElementSettings nodeId={selection.nodeId!} />
  if (selection.role === 'card') return <CardElementSettings nodeId={selection.nodeId!} />
  return <BoxElementSettings nodeId={selection.nodeId!} />
}

function TextElementSettings({ nodeId }: { nodeId: string }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(nodeId)
  const tokens = useTokens()
  const content = useHub((s) => s.contentOverrides[nodeId] ?? '')
  const setContent = useHub((s) => s.setContent)

  return (
    <div className="space-y-4">
      {edited && <ResetRow onReset={reset} />}

      <Section label="Content edit" hint="Modify text node value here or double click in preview.">
        <textarea
          value={content}
          onChange={(e) => setContent(nodeId, e.target.value)}
          rows={3}
          placeholder="(default content)"
          className="focus-ring w-full resize-none rounded-app-sm border border-app-border bg-app-inset px-2.5 py-2 text-[12px] leading-relaxed text-app-text focus:border-app-accent focus:outline-none"
        />
      </Section>

      <AiAdjust kind="text" onApply={set} />

      <Section label="Font family">
        <FontRow value={style.fontFamily ?? tokens.fontSans} onChange={(v) => set({ fontFamily: v })} />
      </Section>

      <Section label="Size and scale details">
        <ControlCard className="space-y-3">
          <Slider
            label="Size scale"
            min={0.55}
            max={2.2}
            step={0.05}
            value={style.fontScale ?? 1}
            onChange={(v) => set({ fontScale: v })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Slider
            label="Line height"
            min={0.9}
            max={2.6}
            step={0.05}
            value={style.lineHeight ?? 1.5}
            onChange={(v) => set({ lineHeight: v })}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            label="Letter spacing"
            min={-0.08}
            max={0.4}
            step={0.005}
            value={style.letterSpacing ?? 0}
            onChange={(v) => set({ letterSpacing: v })}
            format={(v) => `${v.toFixed(3)}em`}
          />
        </ControlCard>
      </Section>

      <Section label="Weight & Alignment">
        <div className="space-y-2">
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
            ]}
          />
          <Segmented<TextAlign>
            value={style.align ?? 'start'}
            onChange={(v) => set({ align: v })}
            className="w-full [&>button]:flex-1"
            options={[
              { value: 'start', label: <AlignLeft size={13} />, tooltip: 'Left' },
              { value: 'center', label: <AlignCenter size={13} />, tooltip: 'Center' },
              { value: 'end', label: <AlignRight size={13} />, tooltip: 'Right' },
              { value: 'justify', label: <AlignJustify size={13} />, tooltip: 'Justify' },
            ]}
          />
        </div>
      </Section>

      <Section label="Typography colour">
        <ColorField
          label="Text color"
          value={style.textColor ?? tokens.text}
          onChange={(v) => set({ textColor: v })}
        />
      </Section>

      <Section label="Styling Transform & Decor">
        <div className="grid grid-cols-2 gap-2">
          <Segmented<TextTransform>
            value={style.textTransform ?? 'none'}
            onChange={(v) => set({ textTransform: v })}
            className="[&>button]:flex-1"
            options={[
              { value: 'none', label: 'Aa', tooltip: 'None' },
              { value: 'uppercase', label: 'AA', tooltip: 'Uppercase' },
              { value: 'capitalize', label: 'Aa', tooltip: 'Capitalize' },
            ]}
          />
          <Segmented<TextDecoration>
            value={style.textDecoration ?? 'none'}
            onChange={(v) => set({ textDecoration: v })}
            className="[&>button]:flex-1"
            options={[
              { value: 'none', label: '—', tooltip: 'None' },
              { value: 'underline', label: <Underline size={11} />, tooltip: 'Underline' },
            ]}
          />
        </div>
      </Section>

      <RawCssSection css={style.css ?? {}} onChange={setCss} />
    </div>
  )
}

function CardElementSettings({ nodeId }: { nodeId: string }) {
  const CARD_PARTS = [
    { id: 'icon', label: 'Icon', icon: Square },
    { id: 'title', label: 'Title', icon: Type },
    { id: 'desc', label: 'Desc', icon: AlignLeft },
    { id: 'container', label: 'Card', icon: LayersIcon },
  ] as const
  type CardPart = (typeof CARD_PARTS)[number]['id']

  const [part, setPart] = useState<CardPart>('container')
  const targetId = part === 'container' ? nodeId : `${nodeId}:${part}`
  const isText = part === 'title' || part === 'desc'

  return (
    <div className="space-y-4">
      <Section label="Card Sub-element" hint="Edit parameters of specific card parts.">
        <div className="grid grid-cols-4 gap-1">
          {CARD_PARTS.map((p) => {
            const Icon = p.icon
            const active = p.id === part
            return (
              <button
                key={p.id}
                onClick={() => setPart(p.id)}
                className={cn(
                  'focus-ring flex flex-col items-center gap-1 rounded-app-sm border py-2 transition-colors active:scale-95 duration-150',
                  active
                    ? 'border-app-accent bg-app-accent-subtle/50 text-app-text font-bold'
                    : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text bg-app-surface'
                )}
              >
                <Icon size={12} />
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
    </div>
  )
}

function BoxElementSettings({ nodeId }: { nodeId: string }) {
  const { style, set, reset, setCss, edited } = useNodeStyle(nodeId)
  const tokens = useTokens()
  const fill: BgFill = style.bgFill ?? 'solid'

  return (
    <div className="space-y-4">
      {edited && <ResetRow onReset={reset} />}
      <AiAdjust kind="section" onApply={set} />

      <Section label="Card Spacing & curve">
        <ControlCard className="space-y-3">
          <Slider
            label="Internal padding"
            min={0}
            max={64}
            value={style.padding ?? 16}
            onChange={(v) => set({ padding: v })}
            format={(v) => `${v}px`}
          />
          <Slider
            label="Corner curve radius"
            min={0}
            max={32}
            value={style.radius ?? 8}
            onChange={(v) => set({ radius: v })}
            format={(v) => `${v}px`}
          />
        </ControlCard>
      </Section>

      <Section label="Card background fill">
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
            label="Background Color"
            value={style.bg ?? tokens.surface}
            onChange={(v) => set({ bg: v })}
          />
        )}
        {fill === 'image' && (
          <input
            value={style.bgImage ?? ''}
            onChange={(e) => set({ bgImage: e.target.value })}
            placeholder="https://image-url.jpg"
            className="focus-ring h-8 w-full rounded bg-app-inset border border-app-border px-2 text-xs focus:outline-none focus:border-app-accent"
          />
        )}
      </Section>

      <Section label="Border outline">
        <ColorField
          label="Border line colour"
          value={style.borderColor ?? tokens.border}
          onChange={(v) => set({ borderColor: v })}
        />
      </Section>

      <RawCssSection css={style.css ?? {}} onChange={setCss} />
    </div>
  )
}

/* ── Global Styles Tab panel (from old StylesPanel.tsx) ──── */
function GlobalStylesPanel() {
  const tokens = useTokens()
  const setToken = useHub((s) => s.setToken)
  const overrides = useHub((s) => s.overrides)
  const resetOverrides = useHub((s) => s.resetOverrides)

  const edited = Object.keys(overrides).length > 0

  return (
    <div className="space-y-4">
      {edited && (
        <div className="flex items-center justify-between border border-app-border bg-app-inset/60 rounded-app px-3 py-2">
          <span className="text-[11px] text-app-muted">Custom tokens applied</span>
          <button
            onClick={resetOverrides}
            className="focus-ring flex items-center gap-1 rounded border border-app-border px-2 py-1 text-[10px] font-bold text-app-muted hover:text-app-text hover:bg-app-surface active:scale-95 duration-100"
          >
            <RotateCcw size={11} />
            Reset all
          </button>
        </div>
      )}

      <Section label="Corner curve rounding">
        <ControlCard className="space-y-3">
          <Slider
            label="Global radius"
            min={0}
            max={28}
            value={tokens.radius}
            onChange={(v) => setToken('radius', v)}
            format={(v) => `${v}px`}
          />
          <div className="flex items-end gap-2 pt-2 border-t border-app-border/40">
            {[0.4, 0.7, 1, 1.6].map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="h-8 w-full border border-app-border-strong bg-app-elevated"
                  style={{ borderRadius: tokens.radius * m }}
                />
                <span className="font-mono text-[9px] text-app-subtle">
                  {Math.round(tokens.radius * m)}
                </span>
              </div>
            ))}
          </div>
        </ControlCard>
      </Section>

      <Section label="Elevation level">
        <Segmented<ShadowStyle>
          value={tokens.shadow}
          onChange={(v) => setToken('shadow', v)}
          className="w-full [&>button]:flex-1"
          options={[
            { value: 'none', label: 'None' },
            { value: 'soft', label: 'Soft' },
            { value: 'crisp', label: 'Crisp' },
            { value: 'dramatic', label: 'Bold' },
          ]}
        />
      </Section>

      <Section label="Global surfaces">
        <ColorField label="Background" value={tokens.bg} onChange={(v) => setToken('bg', v)} />
        <ColorField label="Surface cards" value={tokens.surface} onChange={(v) => setToken('surface', v)} />
        <ColorField label="Elevated popovers" value={tokens.elevated} onChange={(v) => setToken('elevated', v)} />
      </Section>
    </div>
  )
}

/* ── Layers Tab Panel: sortable blocks (from old LayersPanel.tsx) ─ */
function LayersTabPanel() {
  const blocks = useHub((s) => s.blocks)
  const reorderBlocks = useHub((s) => s.reorderBlocks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      reorderBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  return (
    <PanelBody className="p-3">
      <Section label="Blocks hierarchy" hint="Drag to reorder sections. Toggle lock or device visibility.">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {blocks.map((b) => (
                <SortableLayerRow key={b.id} block={b} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Section>
    </PanelBody>
  )
}

function SortableLayerRow({ block }: { block: Block }) {
  const meta = useHub((s) => s.getBlockMeta(block.id))
  const toggleLock = useHub((s) => s.toggleBlockLock)
  const toggleVisible = useHub((s) => s.toggleBlockVisible)
  const removeBlock = useHub((s) => s.removeBlock)
  const renameBlockLabel = useHub((s) => s.renameBlockLabel)
  const select = useHub((s) => s.select)

  const [renaming, setRenaming] = useState(false)
  const [val, setVal] = useState(block.label)
  const inputRef = useRef<HTMLInputElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: renaming,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 40 : 1,
  }

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renaming])

  const finishRename = () => {
    if (val.trim()) {
      renameBlockLabel(block.id, val.trim())
    }
    setRenaming(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 rounded-app border px-2.5 py-1.5 transition-all duration-200 select-none cursor-default',
        meta.locked ? 'border-app-accent/40 bg-app-accent-subtle/20' : 'border-app-border bg-app-inset/60 hover:bg-app-surface'
      )}
    >
      {/* Drag Handle icon */}
      <div {...attributes} {...listeners} className="cursor-grab text-app-subtle hover:text-app-text p-0.5">
        <Menu size={11} />
      </div>

      {/* Rename vs Label */}
      {renaming ? (
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={finishRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') finishRename()
            if (e.key === 'Escape') setRenaming(false)
          }}
          className="flex-1 bg-app-inset border border-app-accent rounded px-1.5 py-0.5 text-xs text-app-text focus:outline-none"
        />
      ) : (
        <button
          onClick={() =>
            select({
              scope: 'section',
              blockId: block.id,
              nodeId: block.id,
              label: block.label,
              role: 'box',
            })
          }
          className={cn(
            'min-w-0 flex-1 truncate text-left text-xs',
            meta.desktop || meta.mobile ? 'text-app-text font-medium' : 'text-app-subtle line-through'
          )}
        >
          {block.label}
        </button>
      )}

      {/* Layer action tools */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
        {!renaming && (
          <button
            onClick={() => {
              setRenaming(true)
              setVal(block.label)
            }}
            className="grid h-5.5 w-5.5 place-items-center rounded-sm text-app-subtle hover:bg-app-elevated hover:text-app-text"
            title="Rename"
          >
            <Edit2 size={10} />
          </button>
        )}

        <button
          onClick={() => toggleLock(block.id)}
          className={cn(
            'grid h-5.5 w-5.5 place-items-center rounded-sm transition-colors',
            meta.locked ? 'text-app-accent' : 'text-app-subtle hover:bg-app-elevated hover:text-app-text'
          )}
          title={meta.locked ? 'Unlock layer' : 'Lock layer'}
        >
          {meta.locked ? <Lock size={10} /> : <LockOpen size={10} />}
        </button>

        <button
          onClick={() => toggleVisible(block.id, 'desktop')}
          className={cn(
            'grid h-5.5 w-5.5 place-items-center rounded-sm transition-colors',
            meta.desktop ? 'text-app-text' : 'text-app-subtle/40 hover:bg-app-elevated hover:text-app-text'
          )}
          title={meta.desktop ? 'Hide on desktop' : 'Show on desktop'}
        >
          {meta.desktop ? <Eye size={10} /> : <EyeOff size={10} />}
        </button>

        <button
          onClick={() => removeBlock(block.id)}
          className="grid h-5.5 w-5.5 place-items-center rounded-sm text-app-subtle hover:bg-app-elevated hover:text-app-danger"
          title="Delete Section"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  )
}

/* ── helpers & sub components ───────────────────────────── */
function ResetRow({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-app border border-app-border bg-app-inset/60 px-3 py-1.5 mb-2">
      <span className="text-[10.5px] text-app-muted">Custom styles applied</span>
      <button
        onClick={onReset}
        className="focus-ring flex items-center gap-1 rounded border border-app-border px-2 py-0.5 text-[10px] font-bold text-app-muted hover:text-app-text hover:bg-app-surface active:scale-95 duration-100"
      >
        <RotateCcw size={10} />
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
              'focus-ring rounded-app-sm border px-2.5 py-1 text-[11px] transition-colors',
              active
                ? 'border-app-accent bg-app-accent-subtle text-app-text font-semibold'
                : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text bg-app-surface'
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
              'focus-ring flex h-10 flex-1 flex-col items-center justify-center rounded border transition-all duration-150 active:scale-95',
              active ? 'border-app-accent bg-app-accent-subtle/50' : 'border-app-border hover:border-app-border-strong bg-app-surface'
            )}
          >
            <span className="flex gap-0.5">
              {Array.from({ length: n }).map((_, i) => (
                <span
                  key={i}
                  className={cn('h-3 w-0.5 rounded-sm', active ? 'bg-app-accent' : 'bg-app-border-strong')}
                />
              ))}
            </span>
            <span className="text-[9px] font-semibold text-app-muted mt-0.5">{n}</span>
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
      label="Raw CSS Escape"
      hint="Advanced — inline styling overrides."
      action={
        <button
          onClick={() => setOpen((o) => !o)}
          className="focus-ring rounded-app-sm border border-app-border px-1.5 py-0.5 text-[9px] font-bold text-app-muted hover:text-app-text hover:bg-app-surface active:scale-95 transition-all"
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
    if (Object.keys(patch).length) {
      onApply(patch as Partial<NodeStyle>)
      setNote(summary)
    } else {
      setNote('e.g. big, bold, centered, blue, radius-lg...')
    }
    setPrompt('')
    setTimeout(() => setNote(null), 3000)
  }

  return (
    <Section label="AI Adjuster" hint="Instruct changes using plain language.">
      <div className="rounded-app-sm border border-app-border bg-app-inset/40 p-2 space-y-1.5">
        <div className="flex gap-1.5">
          <input
            placeholder="e.g. make text blue, add padding..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="flex-1 bg-app-inset border border-app-border rounded px-2 py-1 text-xs text-app-text focus:outline-none"
          />
          <button
            onClick={apply}
            className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded bg-app-elevated text-app-text hover:bg-app-border"
          >
            <Sparkles size={12} />
          </button>
        </div>
        {note && <div className="text-[10px] text-app-accent leading-tight font-medium animate-pulse">{note}</div>}
      </div>
    </Section>
  )
}
