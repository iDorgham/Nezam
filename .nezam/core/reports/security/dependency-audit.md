# Dependency Vulnerability Audit — NEZAM

| Field | Value |
|---|---|
| Task | T-P5-002 (SPEC-SEC-002) |
| Date | 2026-06-03 |
| Tool | `npm audit --registry=https://registry.npmjs.org` (root `package-lock.json`) |
| Phase | Phase 5 — Hardening |

> **Registry note:** the workspace's configured registry (`npmmirror.com`) does **not**
> expose an audit endpoint, so `pnpm audit` fails locally. This audit was run with `npm`
> against the public npm registry. The `security:audit` script wires this for CI.

## Findings — 2 moderate

### 1. postcss `<8.5.10` — XSS via unescaped `</style>` (moderate)
- Advisory: [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)
- Path: `node_modules/postcss` (root workspace, transitive via `next`)
- Impact: XSS via unescaped `</style>` in CSS stringify output. Low real-world impact for
  this workspace (postcss runs at build time on trusted CSS), but should be patched.

### 2. next (transitive) — depends on vulnerable postcss (moderate)
- Path: `node_modules/next` → `postcss`
- Resolves once postcss is bumped to `>= 8.5.10`.

## Remediation plan
- **Proposed:** add a resolution override pinning `postcss >= 8.5.10`:
  ```jsonc
  // root package.json
  "pnpm": { "overrides": { "postcss": ">=8.5.10" } }
  ```
- **Not auto-applied** — changing dependency resolution requires `pnpm install` + a full
  build/test pass to verify no regression. The configured mirror + sandbox network make this
  unverifiable locally, so the override must be applied and verified in CI before merge.
- `npm audit fix --force` is **not** recommended (it would downgrade `next` to 9.x — a breaking change).

## CI wiring
- `npm run security:audit` → `npm audit --registry=https://registry.npmjs.org`.
- Recommended gate: fail CI on `--audit-level=high`; treat moderate as warn until the postcss
  override is verified.
