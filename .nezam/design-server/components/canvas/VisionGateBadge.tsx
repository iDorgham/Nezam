import type { AttachmentPayload } from '@/src/store/canvas-graph.store'

// SPEC-DS-CANVAS-001 §8.2 — Vision Gate UI states.
// pending → gray spinner, valid → green ✓, rejected → red ✗ with reason tooltip.

interface VisionGateBadgeProps {
  status:  AttachmentPayload['visionStatus']
  reason?: string
  size?:   'sm' | 'md'
}

const SIZE_CLASS = {
  sm: 'w-3 h-3 text-[8px]',
  md: 'w-4 h-4 text-[10px]',
} as const

export default function VisionGateBadge({ status, reason, size = 'sm' }: VisionGateBadgeProps) {
  const sizeClass = SIZE_CLASS[size]

  if (status === 'valid') {
    return (
      <span
        role="status"
        aria-label="Vision Gate passed"
        title="Vision Gate passed"
        className={`inline-flex items-center justify-center rounded-full bg-ds-success text-ds-success-foreground font-bold ${sizeClass}`}
      >
        ✓
      </span>
    )
  }

  if (status === 'rejected') {
    return (
      <span
        role="status"
        aria-label={reason ? `Vision Gate rejected: ${reason}` : 'Vision Gate rejected'}
        title={reason || 'Non-compliant: text detected in artwork (Zero-Text Policy)'}
        className={`inline-flex items-center justify-center rounded-full bg-ds-destructive text-ds-destructive-foreground font-bold ${sizeClass}`}
      >
        ✗
      </span>
    )
  }

  return (
    <span
      role="status"
      aria-label="Vision Gate scanning"
      title="Scanning…"
      className={`inline-flex items-center justify-center rounded-full bg-ds-warning text-ds-warning-foreground font-bold animate-pulse motion-reduce:animate-none ${sizeClass}`}
    >
      …
    </span>
  )
}
