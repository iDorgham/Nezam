import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const REPO_ROOT = path.resolve(__dirname, '../../../..')
const SCRIPT = path.join(REPO_ROOT, '.nezam/design-hub/scripts/emit-tokens.js')
const TOKENS_CSS = path.join(REPO_ROOT, '.nezam/design-hub/src/styles/tokens.css')
const TOKENS_JSON = path.join(REPO_ROOT, '.nezam/design-hub/design/tokens.json')

describe('emit-tokens (T-P1-001)', () => {
  beforeAll(() => {
    execFileSync('node', [SCRIPT], { cwd: REPO_ROOT })
  })

  it('AC-1: script exits 0 and produces tokens.css', () => {
    expect(fs.existsSync(TOKENS_CSS)).toBe(true)
  })

  it('AC-2: tokens.css contains all required --ds-color-* variables', () => {
    const css = fs.readFileSync(TOKENS_CSS, 'utf8')
    const required = [
      '--ds-color-primary',
      '--ds-color-secondary',
      '--ds-color-accent',
      '--ds-color-neutral',
      '--ds-color-success',
      '--ds-color-warning',
      '--ds-color-danger',
      '--ds-color-text',
    ]
    for (const token of required) {
      expect(css, `missing ${token}`).toContain(token)
    }
  })

  it('AC-2: tokens.css contains typography and spacing tokens', () => {
    const css = fs.readFileSync(TOKENS_CSS, 'utf8')
    expect(css).toContain('--ds-font-primary')
    expect(css).toContain('--ds-space-1')
    expect(css).toContain('--ds-space-6')
  })

  it('AC-3: tokens.json is valid JSON with required keys', () => {
    const raw = fs.readFileSync(TOKENS_JSON, 'utf8')
    const json = JSON.parse(raw)
    expect(json).toHaveProperty('color')
    expect(json).toHaveProperty('typography')
    expect(json).toHaveProperty('spacing')
    expect(json.color.primary.value).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('AC-4: script is idempotent — second run produces identical output', () => {
    const cssBefore = fs.readFileSync(TOKENS_CSS, 'utf8')
    const jsonBefore = fs.readFileSync(TOKENS_JSON, 'utf8')
    execFileSync('node', [SCRIPT], { cwd: REPO_ROOT })
    const cssAfter = fs.readFileSync(TOKENS_CSS, 'utf8')
    const jsonAfter = fs.readFileSync(TOKENS_JSON, 'utf8')
    // Exclude generated_at timestamp from JSON comparison
    const normalize = (s: string) => s.replace(/"generated_at":\s*"[^"]*"/, '"generated_at": "<date>"')
    expect(cssAfter).toBe(cssBefore)
    expect(normalize(jsonAfter)).toBe(normalize(jsonBefore))
  })

  it('AC-5: script exits non-zero when NEZAM_ROOT has no DESIGN.md', () => {
    expect(() =>
      execFileSync('node', [SCRIPT], {
        cwd: REPO_ROOT,
        env: { ...process.env, NEZAM_ROOT: '/tmp' },
      })
    ).toThrow()
  })
})
