import { beforeEach, describe, expect, it } from 'vitest'
import { useTokenStore } from './tokens.store'
import type { DesignPreset } from '../types/tokens.types'

const ISO = '2026-01-01T00:00:00.000Z'

function makePreset(overrides: Partial<DesignPreset> = {}): DesignPreset {
  return {
    id:        overrides.id        ?? 'system-aurora',
    name:      overrides.name      ?? 'Aurora',
    slug:      overrides.slug      ?? 'aurora',
    isSystem:  overrides.isSystem  ?? true,
    tokens:    overrides.tokens    ?? { primary: '#06b6d4', background: '#0b1220' },
    createdAt: overrides.createdAt ?? ISO,
    updatedAt: overrides.updatedAt ?? ISO,
  }
}

function readCssVar(name: string): string {
  return document.documentElement.style.getPropertyValue(name)
}

beforeEach(() => {
  // Reset persisted + in-memory state so each test starts clean.
  useTokenStore.persist.clearStorage()
  useTokenStore.setState(
    {
      activePresetId: null,
      presets:        [],
      overrides:      {},
      isDirty:        false,
      syncStatus:     'synchronized',
      syncError:      null,
    },
    false,
  )
  // Clear any CSS vars left from previous tests.
  document.documentElement.removeAttribute('style')
})

describe('tokens.store · loadPreset', () => {
  it('returns false and is a no-op when no preset matches the id', () => {
    const aurora = makePreset()
    useTokenStore.setState({ presets: [aurora] })

    const ok = useTokenStore.getState().loadPreset('does-not-exist')

    expect(ok).toBe(false)
    expect(useTokenStore.getState().activePresetId).toBeNull()
    expect(readCssVar('--ds-primary')).toBe('')
  })

  it('returns true, sets activePresetId, and injects tokens when the id matches', () => {
    const aurora = makePreset()
    useTokenStore.setState({ presets: [aurora] })

    const ok = useTokenStore.getState().loadPreset('system-aurora')

    expect(ok).toBe(true)
    expect(useTokenStore.getState().activePresetId).toBe('system-aurora')
    expect(readCssVar('--ds-primary')).toBe('#06b6d4')
    expect(readCssVar('--ds-background')).toBe('#0b1220')
  })

  it('clears any prior overrides when applying a new preset', () => {
    const aurora = makePreset()
    useTokenStore.setState({
      presets:        [aurora],
      activePresetId: 'system-aurora',
      overrides:      { primary: '#ff0000' },
      isDirty:        true,
    })

    useTokenStore.getState().loadPreset('system-aurora')

    expect(useTokenStore.getState().overrides).toEqual({})
    expect(useTokenStore.getState().isDirty).toBe(false)
  })
})

describe('tokens.store · savePreset', () => {
  it('creates a new preset with a slug derived from the name', () => {
    useTokenStore.setState({ overrides: { primary: '#ff8800' } })

    const created = useTokenStore.getState().savePreset('Warm Terracotta')

    expect(created.name).toBe('Warm Terracotta')
    expect(created.slug).toBe('warm-terracotta')
    expect(created.isSystem).toBe(false)
    expect(created.tokens.primary).toBe('#ff8800')
  })

  it('appends the new preset to the array and activates it', () => {
    useTokenStore.setState({ overrides: { primary: '#ff8800' } })

    const created = useTokenStore.getState().savePreset('Warm Terracotta')

    const state = useTokenStore.getState()
    expect(state.presets).toHaveLength(1)
    expect(state.presets[0].id).toBe(created.id)
    expect(state.activePresetId).toBe(created.id)
    expect(state.overrides).toEqual({})
    expect(state.isDirty).toBe(false)
  })

  it('merges current overrides on top of the active preset tokens', () => {
    const aurora = makePreset({ tokens: { primary: '#06b6d4', background: '#0b1220' } })
    useTokenStore.setState({
      presets:        [aurora],
      activePresetId: 'system-aurora',
      overrides:      { primary: '#ff0000' },
    })

    const created = useTokenStore.getState().savePreset('Aurora Red')

    // Override wins over preset, background flows through from preset.
    expect(created.tokens.primary).toBe('#ff0000')
    expect(created.tokens.background).toBe('#0b1220')
  })
})

describe('tokens.store · loadPresets (re-fetch from disk)', () => {
  it('preserves activePresetId and re-injects tokens when the active preset still exists', () => {
    const stale = makePreset({ tokens: { primary: '#000000' } })
    useTokenStore.setState({
      presets:        [stale],
      activePresetId: 'system-aurora',
    })

    const fresh = makePreset({ tokens: { primary: '#06b6d4', background: '#0b1220' } })
    useTokenStore.getState().loadPresets([fresh])

    expect(useTokenStore.getState().activePresetId).toBe('system-aurora')
    // Fresh tokens from the new array must be injected, not the stale ones.
    expect(readCssVar('--ds-primary')).toBe('#06b6d4')
    expect(readCssVar('--ds-background')).toBe('#0b1220')
  })

  it('preserves user overrides when re-applying the active preset', () => {
    const stale = makePreset({ tokens: { primary: '#000000' } })
    useTokenStore.setState({
      presets:        [stale],
      activePresetId: 'system-aurora',
      overrides:      { primary: '#ff0000' },
    })

    const fresh = makePreset({ tokens: { primary: '#06b6d4', background: '#0b1220' } })
    useTokenStore.getState().loadPresets([fresh])

    // Override still wins; preset-only keys come from the fresh preset.
    expect(readCssVar('--ds-primary')).toBe('#ff0000')
    expect(readCssVar('--ds-background')).toBe('#0b1220')
  })

  it('clears activePresetId, overrides, and injected vars when the active preset disappeared', () => {
    const old = makePreset({ id: 'user-ghost' })
    useTokenStore.setState({
      presets:        [old],
      activePresetId: 'user-ghost',
      overrides:      { primary: '#ff0000' },
      isDirty:        true,
    })
    // Pre-inject so we can verify the reset actually clears the var.
    document.documentElement.style.setProperty('--ds-primary', '#ff0000')

    useTokenStore.getState().loadPresets([makePreset()]) // 'user-ghost' not in this list

    const state = useTokenStore.getState()
    expect(state.activePresetId).toBeNull()
    expect(state.overrides).toEqual({})
    expect(state.isDirty).toBe(false)
    expect(readCssVar('--ds-primary')).toBe('')
  })
})

describe('tokens.store · setToken / resetToPreset / getActiveTokens', () => {
  it('setToken records the override, marks dirty, and injects the single CSS var', () => {
    useTokenStore.getState().setToken('primary', '#abcdef')

    const state = useTokenStore.getState()
    expect(state.overrides.primary).toBe('#abcdef')
    expect(state.isDirty).toBe(true)
    expect(readCssVar('--ds-primary')).toBe('#abcdef')
  })

  it('resetToPreset wipes overrides and re-injects the active preset tokens only', () => {
    const aurora = makePreset({ tokens: { primary: '#06b6d4', background: '#0b1220' } })
    useTokenStore.setState({
      presets:        [aurora],
      activePresetId: 'system-aurora',
      overrides:      { primary: '#ff0000' },
      isDirty:        true,
    })
    // Pre-inject the override so the reset has something to undo.
    document.documentElement.style.setProperty('--ds-primary', '#ff0000')

    useTokenStore.getState().resetToPreset()

    expect(useTokenStore.getState().overrides).toEqual({})
    expect(useTokenStore.getState().isDirty).toBe(false)
    expect(readCssVar('--ds-primary')).toBe('#06b6d4')
  })

  it('getActiveTokens merges overrides on top of the active preset tokens', () => {
    const aurora = makePreset({ tokens: { primary: '#06b6d4', background: '#0b1220' } })
    useTokenStore.setState({
      presets:        [aurora],
      activePresetId: 'system-aurora',
      overrides:      { primary: '#ff0000' },
    })

    expect(useTokenStore.getState().getActiveTokens()).toEqual({
      primary:    '#ff0000', // override wins
      background: '#0b1220', // from preset
    })
  })

  it('getActiveTokens returns only overrides when no preset is active', () => {
    useTokenStore.setState({ overrides: { primary: '#abcdef' } })

    expect(useTokenStore.getState().getActiveTokens()).toEqual({ primary: '#abcdef' })
  })
})

describe('tokens.store · syncStatus state machine (F-002)', () => {
  it('defaults to synchronized with no error', () => {
    const state = useTokenStore.getState()
    expect(state.syncStatus).toBe('synchronized')
    expect(state.syncError).toBeNull()
  })

  it('setSyncStatus("syncing") clears any previous error', () => {
    useTokenStore.setState({ syncStatus: 'failed', syncError: 'old error' })

    useTokenStore.getState().setSyncStatus('syncing')

    expect(useTokenStore.getState().syncStatus).toBe('syncing')
    expect(useTokenStore.getState().syncError).toBeNull()
  })

  it('setSyncStatus("failed", msg) stores the error message', () => {
    useTokenStore.getState().setSyncStatus('failed', 'Disk write rejected')

    expect(useTokenStore.getState().syncStatus).toBe('failed')
    expect(useTokenStore.getState().syncError).toBe('Disk write rejected')
  })

  it('setSyncStatus("synchronized") clears any prior error', () => {
    useTokenStore.setState({ syncStatus: 'failed', syncError: 'old error' })

    useTokenStore.getState().setSyncStatus('synchronized')

    expect(useTokenStore.getState().syncStatus).toBe('synchronized')
    expect(useTokenStore.getState().syncError).toBeNull()
  })

  it('setToken transitions syncStatus to "syncing" when online', () => {
    useTokenStore.setState({ syncStatus: 'synchronized' })

    useTokenStore.getState().setToken('primary', '#ff0000')

    expect(useTokenStore.getState().syncStatus).toBe('syncing')
  })

  it('setToken does NOT trample "offline" — pill must persist in offline mode (AC-005)', () => {
    useTokenStore.setState({ syncStatus: 'offline' })

    useTokenStore.getState().setToken('primary', '#ff0000')

    expect(useTokenStore.getState().syncStatus).toBe('offline')
    // Token still records into overrides — only the pill state is sticky.
    expect(useTokenStore.getState().overrides.primary).toBe('#ff0000')
  })

  it('setToken clears any prior failed-sync error when starting a new edit', () => {
    useTokenStore.setState({ syncStatus: 'failed', syncError: 'old error' })

    useTokenStore.getState().setToken('primary', '#00ff00')

    expect(useTokenStore.getState().syncStatus).toBe('syncing')
    expect(useTokenStore.getState().syncError).toBeNull()
  })
})
