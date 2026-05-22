'use client'

import {
  Layers as LayersIcon,
  Lock,
  LockOpen,
  Monitor,
  Smartphone,
  Group,
  Trash2,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelHeader, PanelBody, Section } from '@/components/ui/Panel'
import { Tooltip } from '@/components/ui/Tooltip'
import type { Block } from '@/types'
import { cn } from '@/lib/cn'

/** Layers panel — block groups with lock + per-viewport visibility. */
export function LayersPanel() {
  const blocks = useHub((s) => s.blocks)
  const dir = useHub((s) => s.dir)

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<LayersIcon size={15} />}
        title="Layers"
        subtitle="Section blocks, locks & visibility"
      />
      <PanelBody>
        <Section
          label="Sections"
          hint="Each block of the active archetype is a layer. Lock or hide per device."
        >
          {blocks.map((block) => (
            <LayerRow key={block.id} block={block} rtl={dir === 'rtl'} />
          ))}
        </Section>
      </PanelBody>
    </div>
  )
}

function LayerRow({ block, rtl }: { block: Block; rtl: boolean }) {
  const meta = useHub((s) => s.getBlockMeta(block.id))
  const toggleLock = useHub((s) => s.toggleBlockLock)
  const toggleVisible = useHub((s) => s.toggleBlockVisible)
  const removeBlock = useHub((s) => s.removeBlock)
  const select = useHub((s) => s.select)

  const label = rtl ? block.arabicLabel : block.label

  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-app border px-2.5 py-2 transition-colors',
        meta.locked ? 'border-app-accent/40 bg-app-accent-subtle/40' : 'border-app-border bg-app-inset/60',
      )}
    >
      <Group size={13} className="shrink-0 text-app-subtle" />
      <button
        onClick={() => select({ scope: 'section', blockId: block.id, nodeId: block.id, label: block.label, role: 'box' })}
        className={cn(
          'min-w-0 flex-1 truncate text-left text-[11px] font-medium',
          meta.desktop || meta.mobile ? 'text-app-text' : 'text-app-subtle line-through',
        )}
      >
        {label}
      </button>

      <Tooltip label={meta.locked ? 'Unlock' : 'Lock'}>
        <button
          onClick={() => toggleLock(block.id)}
          aria-pressed={meta.locked}
          className={cn(
            'focus-ring grid h-6 w-6 place-items-center rounded-app-sm transition-colors',
            meta.locked
              ? 'bg-app-accent text-app-on-accent'
              : 'text-app-subtle hover:bg-app-elevated hover:text-app-text',
          )}
        >
          {meta.locked ? <Lock size={12} /> : <LockOpen size={12} />}
        </button>
      </Tooltip>

      <Tooltip label={meta.desktop ? 'Hide on desktop' : 'Show on desktop'}>
        <button
          onClick={() => toggleVisible(block.id, 'desktop')}
          className={cn(
            'focus-ring grid h-6 w-6 place-items-center rounded-app-sm transition-colors',
            meta.desktop
              ? 'text-app-text hover:bg-app-elevated'
              : 'text-app-subtle/50 hover:bg-app-elevated',
          )}
        >
          <Monitor size={12} />
        </button>
      </Tooltip>

      <Tooltip label={meta.mobile ? 'Hide on mobile' : 'Show on mobile'}>
        <button
          onClick={() => toggleVisible(block.id, 'mobile')}
          className={cn(
            'focus-ring grid h-6 w-6 place-items-center rounded-app-sm transition-colors',
            meta.mobile
              ? 'text-app-text hover:bg-app-elevated'
              : 'text-app-subtle/50 hover:bg-app-elevated',
          )}
        >
          <Smartphone size={12} />
        </button>
      </Tooltip>

      <Tooltip label="Remove block">
        <button
          onClick={() => removeBlock(block.id)}
          className="focus-ring grid h-6 w-6 place-items-center rounded-app-sm text-app-subtle opacity-0 transition-opacity hover:bg-app-elevated hover:text-app-danger group-hover:opacity-100"
          aria-label="Remove block"
        >
          <Trash2 size={11} />
        </button>
      </Tooltip>
    </div>
  )
}
