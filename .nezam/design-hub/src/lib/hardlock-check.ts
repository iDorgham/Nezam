/**
 * Hardlock / SDD gate check (T-Q-009).
 *
 * Pure, dependency-free validation of the SDD development hardlock. Given a
 * parsed `wireframes_locked.json` payload and the planning-complete flag, it
 * decides whether a `/develop` transition is permitted. Mirrors the semantics
 * of `.nezam/core/scripts/checks/check-wireframes-lock.js` but in a form that
 * can be unit-tested in happy-dom/node without filesystem access.
 */

export interface WireframeLockLike {
  blocks?: unknown
  pages?: unknown
  locked_at?: unknown
  meta?: { locked_at?: unknown } | null
  design_decisions?: Record<string, unknown> | null
}

export interface HardlockInput {
  /** Parsed lock payload, or null if the file is missing / unparseable. */
  lock: WireframeLockLike | null
  /** `planning_complete` flag from plan_progress state. */
  planningComplete: boolean
}

export interface HardlockResult {
  ok: boolean
  violations: string[]
}

function isNonEmptyArray(v: unknown): boolean {
  return Array.isArray(v) && v.length > 0
}

function hasLockedAt(lock: WireframeLockLike): boolean {
  const top = typeof lock.locked_at === 'string' && lock.locked_at.length > 0
  const meta =
    !!lock.meta &&
    typeof lock.meta.locked_at === 'string' &&
    (lock.meta.locked_at as string).length > 0
  return top || meta
}

/**
 * Returns `{ ok, violations }`. `ok` is true only when planning is complete and
 * the lock payload is structurally valid (blocks, pages, locked_at present).
 * Fails closed: a null/empty lock always blocks.
 */
export function checkHardlock(input: HardlockInput): HardlockResult {
  const violations: string[] = []

  if (!input.planningComplete) {
    violations.push('planning_incomplete')
  }

  const { lock } = input
  if (!lock || typeof lock !== 'object') {
    violations.push('missing_wireframes_lock')
    return { ok: false, violations }
  }

  if (!isNonEmptyArray(lock.blocks)) violations.push('no_blocks')
  if (!isNonEmptyArray(lock.pages)) violations.push('no_pages')
  if (!hasLockedAt(lock)) violations.push('not_locked')

  return { ok: violations.length === 0, violations }
}

/** Convenience guard: true only when the transition is permitted. */
export function isDevelopUnlocked(input: HardlockInput): boolean {
  return checkHardlock(input).ok
}
