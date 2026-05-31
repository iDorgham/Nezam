'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { HUB_SECTION_SHORTCUTS } from '@/lib/design-hub/keyboard'

type ShortcutRow = { keys: string; description: string; section?: string }

const GLOBAL_ROWS: ShortcutRow[] = [
  { keys: '⌘1 … ⌘6', description: 'Switch hub section (Architecture → Preview)' },
  { keys: '?', description: 'Show this shortcuts reference' },
  { keys: '⌘E', description: 'Open lock & export' },
]

const ARCH_ROWS: ShortcutRow[] = [
  { keys: '⌘Z', description: 'Undo', section: 'Architecture' },
  { keys: '⌘⇧Z / ⌘Y', description: 'Redo', section: 'Architecture' },
  { keys: 'N', description: 'Add child page under selection (or root)', section: 'Architecture' },
  { keys: 'Delete', description: 'Delete selected page', section: 'Architecture' },
  { keys: '/', description: 'Focus architecture search', section: 'Architecture' },
  { keys: 'Right-click', description: 'Page context menu (add, rename, wireframes, delete)', section: 'Architecture' },
  { keys: '⌘ + scroll', description: 'Zoom canvas', section: 'Architecture' },
]

function ShortcutTable({ title, rows }: { title: string; rows: ShortcutRow[] }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-app-subtle">{title}</h3>
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.keys}-${row.description}`} className="border-t border-app-border/60 first:border-t-0">
              <td className="py-2 pr-4 font-mono text-[11px] text-app-text whitespace-nowrap">{row.keys}</td>
              <td className="py-2 text-app-subtle">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto app-scroll">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            On Windows/Linux, use Ctrl instead of ⌘. Shortcuts are disabled while typing in inputs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <ShortcutTable title="Global" rows={GLOBAL_ROWS} />
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-app-subtle">
              Sections
            </h3>
            <ul className="space-y-1 text-xs text-app-subtle">
              {HUB_SECTION_SHORTCUTS.map((s) => (
                <li key={s.id} className="flex justify-between gap-4">
                  <span className="font-mono text-app-text">⌘{s.index}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <ShortcutTable title="Architecture canvas" rows={ARCH_ROWS} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
