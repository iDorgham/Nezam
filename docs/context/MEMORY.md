# Durable project memory (hand-written summary)

Maintain short, factual bullets the agent should reload when threads reset.

See also **[MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md)** for the four-layer model (session → project → team → org).

## Decisions

- 2026-05-06 - **Design catalog relocation:** moved full brand tree from `docs/reference/design/` to **`.cursor/design/<brand>/design.md`** (folder name = brand). Stub redirect at [`docs/reference/design/README.md`](../reference/design/README.md). Updated [`DESIGN.md`](../DESIGN.md), [`TEST_MATRIX.md`](../TEST_MATRIX.md), [`docs/context/project.md`](project.md).
- 2026-05-06 - **Reference skills ingest policy:** no bulk copy of ~1.7k `docs/reference/skills/**` files; Tier A provenance notes added to [`design-md`](../.cursor/skills/design-md/SKILL.md) and [`seo-ia-content`](../.cursor/skills/seo-ia-content/SKILL.md); promoted/adapted [`guide-instructor-domains`](../.cursor/skills/guide-instructor-domains/SKILL.md); Nexu Open Design remains a **library** until milestone-driven promotion ([`docs/reference/INGEST_QUEUE.md`](../reference/INGEST_QUEUE.md)).
- 2026-05-06 - **Reference agents:** upstream charters under [`docs/reference/agents/`](../reference/agents/) are mostly placeholder “omega” stubs—mapped to COIA personas in [`.cursor/agents/README.md`](../.cursor/agents/README.md) for traceability rather than merged verbatim.
- 2026-05-06 - **Reference rules:** copied scoped [`workspace-client-onboarding-gate.mdc`](../.cursor/rules/workspace-client-onboarding-gate.mdc) (`workspaces/clients/**`); Antigravity guide footer rules left **inactive globally**—documented under compatibility in [`workspace-orchestration.mdc`](../.cursor/rules/workspace-orchestration.mdc).
- 2026-05-06 - Added root `plan/` execution scaffold with five sequential phases:
  - `01-content-foundation` -> `02-design-system` -> `03-build` -> `04-harden` -> `05-ship`
  - Each phase/sub-phase uses `TASKS.md` gate mechanics and standardized PT-ID patterns.
- 2026-05-06 - Introduced plan governance files:
  - `plan/MASTER_TASKS.md` (master outcomes)
  - `plan/INDEX.md` (MT/PT traceability)
  - `plan/commit-conventions.md` (phase-aligned prefixes)
  - `plan/tag-version-plan.md` (SemVer + tag triggers)

## Accepted tradeoffs

- The `plan/` tree is intentionally template-like with placeholder content so teams can scope quickly without blocking on implementation details.
- Gate text is standardized and repetitive to keep machine parsing and human review predictable across phases.

## Naming glossary

- `MT-ID`: master task identifier at portfolio/pipeline level (format: `MT-###`).
- `PT-ID`: phase task identifier (format: `PT-<phase>-<subphase>-<sequence>` or gate variants).
- `Phase Gate`: final readiness control (`PT-XX-GATE`) required before moving to next phase.

## Release posture

- Planned version trajectory:
  - After design pages complete: `v0.1.0-alpha`
  - After build release prep complete: `v0.1.0`
  - After ship complete: `v1.0.0`

## External companion notes

Link or paste synopsis of evolving strategy threads when relevant.