# Durable project memory (hand-written summary)

Maintain short, factual bullets the agent should reload when threads reset.

See also **[MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md)** for the four-layer model (session → project → team → org).

## Decisions

- _(None yet — append dated bullets as you lock decisions.)_

## Accepted tradeoffs

- _(Document intentional compromises here.)_

## Naming glossary

- `MT-ID`: master task identifier at portfolio/pipeline level (format: `MT-###`).
- `PT-ID`: phase task identifier (format: `PT-<phase>-<subphase>-<sequence>` or gate variants).
- `Phase Gate`: final readiness control before moving to the next phase.

## Release posture

- _(Planned version trajectory when known.)_

## Tooling

- **Drift recovery:** after local edits to mirrored AI client folders outside `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check` before commit.
- **Agent eval scorecards:** append Tier‑1 evaluation blocks here per [.cursor/agents/EVAL_FRAMEWORK.md](../../../.cursor/agents/EVAL_FRAMEWORK.md).

## Agent scorecards

```text
_(No Tier‑1 evaluations recorded yet.)_
```

## External companion notes

Link or paste synopsis of evolving strategy threads when relevant.
