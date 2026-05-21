import type { HardlockFailure } from '@/src/store/canvas-graph.store'

// SPEC-DS-CANVAS-001 §8.3 — surfaces RTL / WCAG / Vision Gate failures as a
// chip stack on a node. The orange border itself lives on CanvasNode via
// --dv-node-border-hardlock; this overlay renders the failure chips.

interface HardlockOverlayProps {
  failures: HardlockFailure[]
}

const LABEL: Record<HardlockFailure['type'], string> = {
  rtl:    'RTL parity',
  wcag:   'WCAG AA',
  vision: 'Vision Gate',
}

const ICON: Record<HardlockFailure['type'], string> = {
  rtl:    '⇄',
  wcag:   '⚠',
  vision: '◉',
}

export default function HardlockOverlay({ failures }: HardlockOverlayProps) {
  if (failures.length === 0) return null

  return (
    <ul
      role="list"
      aria-label="Hardlock failures"
      className="flex flex-wrap gap-1"
    >
      {failures.map((failure, i) => (
        <li
          key={`${failure.type}-${i}`}
          role="status"
          title={failure.message}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-ds-sm bg-ds-warning/15 border border-ds-warning text-[9px] font-mono uppercase tracking-wide text-ds-warning-foreground"
        >
          <span aria-hidden="true">{ICON[failure.type]}</span>
          <span>{LABEL[failure.type]}</span>
        </li>
      ))}
    </ul>
  )
}
