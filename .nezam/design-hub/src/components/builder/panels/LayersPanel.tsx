'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Layers as LayersIcon,
  Lock,
  LockOpen,
  Monitor,
  Smartphone,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  Type,
  AlignLeft,
  Image as ImageIcon,
  LayoutDashboard,
  MousePointer2,
  Link2,
  Star,
  List,
  SquareStack,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelHeader, PanelBody } from '@/components/ui/Panel'
import { Tooltip } from '@/components/ui/Tooltip'
import type { Block, BlockKind } from '@/types'
import { cn } from '@/lib/cn'

// ── Child component definitions per block kind ────────────────────────────────

type ChildKind = 'heading' | 'text' | 'image' | 'card' | 'button' | 'icon' | 'nav' | 'list'

interface BlockChild {
  label: string
  kind: ChildKind
}

const BLOCK_CHILDREN: Partial<Record<BlockKind, BlockChild[]>> = {
  nav: [
    { label: 'Logo', kind: 'image' },
    { label: 'Nav Links', kind: 'nav' },
    { label: 'CTA Button', kind: 'button' },
  ],
  hero: [
    { label: 'Heading', kind: 'heading' },
    { label: 'Subheading', kind: 'text' },
    { label: 'Primary Button', kind: 'button' },
    { label: 'Secondary Button', kind: 'button' },
    { label: 'Hero Image', kind: 'image' },
  ],
  featureGrid: [
    { label: 'Feature Card', kind: 'card' },
    { label: 'Feature Card', kind: 'card' },
    { label: 'Feature Card', kind: 'card' },
  ],
  stats: [
    { label: 'Stat Item', kind: 'text' },
    { label: 'Stat Item', kind: 'text' },
    { label: 'Stat Item', kind: 'text' },
    { label: 'Stat Item', kind: 'text' },
  ],
  productGrid: [
    { label: 'Product Card', kind: 'card' },
    { label: 'Product Card', kind: 'card' },
    { label: 'Product Card', kind: 'card' },
  ],
  articleList: [
    { label: 'Article Card', kind: 'card' },
    { label: 'Article Card', kind: 'card' },
    { label: 'Article Card', kind: 'card' },
  ],
  pricing: [
    { label: 'Starter Card', kind: 'card' },
    { label: 'Pro Card', kind: 'card' },
    { label: 'Enterprise Card', kind: 'card' },
  ],
  dashboard: [
    { label: 'Stats Widget', kind: 'card' },
    { label: 'Chart Widget', kind: 'card' },
    { label: 'Table Widget', kind: 'card' },
  ],
  vendorGrid: [
    { label: 'Vendor Card', kind: 'card' },
    { label: 'Vendor Card', kind: 'card' },
    { label: 'Vendor Card', kind: 'card' },
  ],
  cta: [
    { label: 'Heading', kind: 'heading' },
    { label: 'Description', kind: 'text' },
    { label: 'CTA Button', kind: 'button' },
  ],
  footer: [
    { label: 'Logo', kind: 'image' },
    { label: 'Navigation Links', kind: 'nav' },
    { label: 'Social Icons', kind: 'icon' },
    { label: 'Copyright', kind: 'text' },
  ],
  arabic: [
    { label: 'Arabic Heading', kind: 'heading' },
    { label: 'Arabic Body', kind: 'text' },
  ],
  text: [{ label: 'Heading Text', kind: 'heading' }],
  paragraph: [{ label: 'Paragraph Text', kind: 'text' }],
  image: [{ label: 'Image', kind: 'image' }],
  icon: [{ label: 'Icon', kind: 'icon' }],
  section: [{ label: 'Container', kind: 'card' }],
}

const CHILD_ICONS: Record<ChildKind, typeof Type> = {
  heading: Type,
  text: AlignLeft,
  image: ImageIcon,
  card: LayoutDashboard,
  button: MousePointer2,
  icon: Star,
  nav: List,
  list: List,
}

const CHILD_COLORS: Record<ChildKind, string> = {
  heading: 'text-blue-400',
  text: 'text-app-subtle',
  image: 'text-green-400',
  card: 'text-purple-400',
  button: 'text-app-accent',
  icon: 'text-yellow-400',
  nav: 'text-orange-400',
  list: 'text-app-subtle',
}

// ── Child tree row ────────────────────────────────────────────────────────────

function ChildRow({ child }: { child: BlockChild }) {
  const Icon = CHILD_ICONS[child.kind]
  return (
    <div className="flex items-center gap-1.5 py-[3px] pl-7 pr-2">
      <div className="relative flex items-center">
        {/* Tree connector */}
        <div className="absolute -left-3 top-1/2 h-px w-3 bg-app-border" />
        <Icon size={10} className={cn('shrink-0', CHILD_COLORS[child.kind])} />
      </div>
      <span className="truncate text-[10px] text-app-subtle">{child.label}</span>
      <span className="ml-auto shrink-0 rounded px-1 py-px text-[8px] font-medium uppercase tracking-wide text-app-subtle/60 bg-app-elevated/50">
        {child.kind}
      </span>
    </div>
  )
}

// ── Sortable layer row ────────────────────────────────────────────────────────

function LayerRow({
  block,
  rtl,
  index,
  total,
  isOverlay = false,
}: {
  block: Block
  rtl: boolean
  index: number
  total: number
  isOverlay?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const meta = useHub((s) => s.getBlockMeta(block.id))
  const toggleLock = useHub((s) => s.toggleBlockLock)
  const toggleVisible = useHub((s) => s.toggleBlockVisible)
  const removeBlock = useHub((s) => s.removeBlock)
  const moveBlock = useHub((s) => s.moveBlock)
  const select = useHub((s) => s.select)

  const label = rtl ? block.arabicLabel : block.label
  const children = BLOCK_CHILDREN[block.kind] ?? []
  const hasChildren = children.length > 0

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: isOverlay || meta.locked,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'rounded-app border transition-all duration-100',
        isDragging ? 'opacity-40 border-app-accent/30' : meta.locked ? 'border-app-accent/40 bg-app-accent-subtle/40' : 'border-app-border bg-app-inset/60',
        isOverlay && 'rotate-[0.5deg] scale-[1.01] border-app-accent/50 shadow-app-lg',
      )}
    >
      {/* Main row */}
      <div className="group flex items-center gap-1 px-2 py-1.5">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className={cn(
            'shrink-0 cursor-grab touch-none rounded p-0.5 text-app-subtle transition-opacity active:cursor-grabbing',
            meta.locked ? 'cursor-not-allowed opacity-30' : 'opacity-0 group-hover:opacity-100',
          )}
          aria-label="Drag to reorder"
          disabled={meta.locked}
        >
          <GripVertical size={12} />
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && setExpanded((o) => !o)}
          className={cn(
            'shrink-0 rounded p-0.5 text-app-subtle transition-colors',
            hasChildren ? 'hover:bg-app-elevated hover:text-app-text' : 'cursor-default opacity-0',
          )}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />
          ) : (
            <ChevronRight size={11} />
          )}
        </button>

        {/* Label */}
        <button
          onClick={() => select({ scope: 'section', blockId: block.id, nodeId: block.id, label: block.label, role: 'box' })}
          className={cn(
            'min-w-0 flex-1 truncate text-left text-[11px] font-medium',
            meta.desktop || meta.mobile ? 'text-app-text' : 'text-app-subtle line-through',
          )}
        >
          {label}
        </button>

        {/* Up / Down */}
        <Tooltip label="Move up">
          <button
            onClick={() => moveBlock(block.id, 'up')}
            disabled={index === 0 || meta.locked}
            className="focus-ring grid h-5 w-5 place-items-center rounded text-app-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-app-elevated hover:text-app-text disabled:opacity-20"
            aria-label="Move up"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2L1.5 6.5h7L5 2z" fill="currentColor" />
            </svg>
          </button>
        </Tooltip>
        <Tooltip label="Move down">
          <button
            onClick={() => moveBlock(block.id, 'down')}
            disabled={index === total - 1 || meta.locked}
            className="focus-ring grid h-5 w-5 place-items-center rounded text-app-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-app-elevated hover:text-app-text disabled:opacity-20"
            aria-label="Move down"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 8L8.5 3.5h-7L5 8z" fill="currentColor" />
            </svg>
          </button>
        </Tooltip>

        {/* Lock */}
        <Tooltip label={meta.locked ? 'Unlock' : 'Lock'}>
          <button
            onClick={() => toggleLock(block.id)}
            aria-pressed={meta.locked}
            className={cn(
              'focus-ring grid h-5 w-5 place-items-center rounded transition-colors',
              meta.locked
                ? 'bg-app-accent text-app-on-accent'
                : 'text-app-subtle opacity-0 group-hover:opacity-100 hover:bg-app-elevated hover:text-app-text',
            )}
          >
            {meta.locked ? <Lock size={10} /> : <LockOpen size={10} />}
          </button>
        </Tooltip>

        {/* Desktop visibility */}
        <Tooltip label={meta.desktop ? 'Hide desktop' : 'Show desktop'}>
          <button
            onClick={() => toggleVisible(block.id, 'desktop')}
            className={cn(
              'focus-ring grid h-5 w-5 place-items-center rounded text-app-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-app-elevated',
              !meta.desktop && 'opacity-100 text-app-subtle/40',
            )}
          >
            <Monitor size={10} />
          </button>
        </Tooltip>

        {/* Mobile visibility */}
        <Tooltip label={meta.mobile ? 'Hide mobile' : 'Show mobile'}>
          <button
            onClick={() => toggleVisible(block.id, 'mobile')}
            className={cn(
              'focus-ring grid h-5 w-5 place-items-center rounded text-app-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-app-elevated',
              !meta.mobile && 'opacity-100 text-app-subtle/40',
            )}
          >
            <Smartphone size={10} />
          </button>
        </Tooltip>

        {/* Delete */}
        <Tooltip label="Remove">
          <button
            onClick={() => removeBlock(block.id)}
            className="focus-ring grid h-5 w-5 place-items-center rounded text-app-subtle opacity-0 transition-opacity group-hover:opacity-100 hover:bg-app-elevated hover:text-red-500"
            aria-label="Remove block"
          >
            <Trash2 size={10} />
          </button>
        </Tooltip>
      </div>

      {/* Children tree */}
      {expanded && hasChildren && (
        <div className="relative border-t border-app-border/50 pb-1.5">
          {/* Left trunk line */}
          <div className="absolute bottom-2 left-[28px] top-0 w-px bg-app-border/60" />
          {children.map((child, i) => (
            <ChildRow key={i} child={child} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function LayersPanel() {
  const blocks = useHub((s) => s.blocks)
  const dir = useHub((s) => s.dir)
  const reorderBlocks = useHub((s) => s.reorderBlocks)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeBlock = blocks.find((b) => b.id === activeId) ?? null

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const fromIdx = blocks.findIndex((b) => b.id === active.id)
    const toIdx = blocks.findIndex((b) => b.id === over.id)
    if (fromIdx !== -1 && toIdx !== -1) reorderBlocks(fromIdx, toIdx)
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<LayersIcon size={15} />}
        title="Layers"
        subtitle="Drag to reorder · expand to inspect"
      />
      <PanelBody>
        <DndContext
          id="layers-panel"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1">
              {blocks.map((block, i) => (
                <LayerRow
                  key={block.id}
                  block={block}
                  rtl={dir === 'rtl'}
                  index={i}
                  total={blocks.length}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
            {activeBlock && (
              <LayerRow
                block={activeBlock}
                rtl={dir === 'rtl'}
                index={0}
                total={blocks.length}
                isOverlay
              />
            )}
          </DragOverlay>
        </DndContext>

        {blocks.length === 0 && (
          <p className="py-6 text-center text-[11px] text-app-subtle">
            No sections yet — add blocks from the canvas.
          </p>
        )}
      </PanelBody>
    </div>
  )
}
