# ADR-0005 — Wireframe Bridge & Figma MCP Integration (v3.2)

| Field | Value |
|---|---|
| ID | ADR-0005 |
| Status | Accepted |
| Date | 2026-06-05 |
| Deciders | Design Lead, Frontend Lead |
| Supersedes | — |
| Related | ROADMAP_v3.2_HEALTH_100.md §Phase 4.1 |

---

## Context

v3.1 design system health: 80%. The wireframe lock/unlock cycle was implemented but:
- Figma MCP authentication was not provisioned or tested
- Empty blocks issue in `block_registry.json` documented but not resolved
- SCAFFOLD gate did not formally require `wireframes_locked.json`
- No design-to-code workflow documentation existed

## Decision

### Figma MCP integration

The Figma MCP is **optional** — the wireframe system works without it (local ASCII wireframes are the SDD contract). Figma is a **bridge** for design teams who want pixel-level fidelity before implementation.

When Figma MCP is active:
- `FIGMA_ACCESS_TOKEN` stored in `.env.local` (not committed); added to CI secrets for design-gated workflows
- Figma frame IDs mapped in `.nezam/core/plans/04-design/FIGMA_FRAME_MAP.yaml` (new)
- `pnpm design:figma:sync` script (new) pulls frame thumbnails into `.session/figma/`
- No Figma data written to `wireframes_locked.json` — that file remains a NEZAM-native contract

### Wireframe lock contract amendment

`wireframes_locked.json` schema extended:
```json
{
  "locked_at": "<ISO>",
  "version": "2.0",
  "arch_page_id_map": { "<archPageId>": "<sessionFile>" },
  "block_count": 0,
  "figma_synced": false,
  "figma_frame_ids": {}
}
```

`figma_synced: true` when Figma sync has been run; does not affect SCAFFOLD gate (remains `wireframes_locked.json` existence check).

### SCAFFOLD gate enforcement

Gate updated in `.nezam/core/gates/GITHUB_GATE_MATRIX.json`:
- `GATE-WF-01`: `wireframes_locked.json` must exist and have `block_count > 0`
- `GATE-WF-02` (new): `block_registry.json` must have no empty block `properties` arrays

### Empty blocks fix

Empty `properties: []` blocks in `block_registry.json` are filled with a sentinel `{ "key": "_empty", "type": "placeholder" }` entry so validators can distinguish "intentionally empty" from "not yet defined". New validation script: `pnpm design:validate-blocks`.

### Design-to-code workflow

Documented in `.nezam/core/docs/DESIGN_TO_CODE.md`:
1. Complete architecture tree in Design Hub
2. Run wireframe sessions per page → auto-save to `.session/pages/{archPageId}.json`
3. Lock → `wireframes_locked.json` generated
4. Developer reads lock + ASCII wireframes → implements component slots exactly
5. No pixel-guessing; all spacing tokens come from `DESIGN.md`

## Consequences

**Good:**
- Figma MCP is additive, not blocking — teams without Figma can still use full SDD
- Empty blocks fix removes false-negative gate passes
- SCAFFOLD gate now has teeth: no code before lock file is valid

**Bad / mitigated:**
- Figma MCP auth setup requires developer action (token provisioning); documented in runbook
- `figma:sync` is a manual step — not automated in CI (Figma rate limits; design is human-gated by nature)

## Files affected

- `.nezam/core/gates/GITHUB_GATE_MATRIX.json` — add GATE-WF-02
- `wireframes_locked.json` schema — version bump to 2.0
- `.nezam/design-hub/` — `block_registry.json` empty block fix + validation
- `.nezam/core/plans/04-design/FIGMA_FRAME_MAP.yaml` — new (when Figma used)
- `.nezam/core/docs/DESIGN_TO_CODE.md` — new
- `.nezam/core/docs/WIREFRAME_RUNBOOK.md` — new
