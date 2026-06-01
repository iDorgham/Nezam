import { describe, expect, it } from 'vitest'

import {
  logRegeneratePageSessionsResult,
  regeneratePageSessions,
} from '@/lib/wireframe/regenerate-page-sessions'

const shouldRun = process.env.REGENERATE_SESSIONS === '1' || process.env.REGENERATE_SESSIONS === 'true'

describe.runIf(shouldRun)('regenerate page sessions (REGENERATE_SESSIONS=1)', () => {
  it('writes blueprint profile stacks to .session/pages', () => {
    const wipe = process.env.WIPE === '1' || process.env.WIPE === 'true'
    const result = regeneratePageSessions({ wipe })
    logRegeneratePageSessionsResult(result, wipe)
    expect(result.written).toBeGreaterThan(0)
  })
})
