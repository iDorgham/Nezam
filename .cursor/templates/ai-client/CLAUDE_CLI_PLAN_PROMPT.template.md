# Workspace — Claude CLI mission (paste into Claude CLI)

**Project:** {{PROJECT_NAME}}

Work **in this repository root** (ensure `pwd` is the git checkout). You have full read access to the tree.

## Before you write anything new

Read end-to-end:

1. `docs/specs/prd/PRD.md`
2. `docs/prd/PROJECT_PROMPT.md`
3. `docs/workspace/context/CONTEXT.md`
4. `docs/workspace/context/CONTEXT.md`
5. `docs/workspace/context/CONTEXT.md`

Do **not** contradict committed specs without adding a dated **Decision Log** note in the relevant SDD or feature spec.

## Mission

Produce **Specification-Driven Development** planning artifacts aligned with the workspace pipeline — equivalent intent to Cursor slash **`/PLAN all`** and skill **`plan-full`**.

### Strict planning order (dependencies)

Execute in order; later steps may revise earlier ones if gaps appear.

1. **SEO research** — Create or refresh `docs/specs/SEO_RESEARCH.md` (keywords/clusters, intents, snippets, FAQ seeds, slug rules).
2. **Information architecture** — Only after SEO exists: menus, URL map, breadcrumbs, naming driven by SEO tables; document under `docs/specs/` (extend README or add `IA.md` if no dedicated file yet).
3. **Content** — Only after IA is documented: voice/tone, page inventory, hero/sections outlines, UI microcopy tables under SDD docs.
4. **Design brief** — Only after content outlines exist: create or refresh root **`docs/DESIGN.md`** with layout paradigm (one-page, blog, corporate, portfolio, gallery, storefront; scroll paradigm), palette, typography, motion, accessibility notes, **textual example screens** developers can mirror.
5. **Versioning** — Fill or refresh `docs/specs/VERSIONING.md` (semver, changelog policy, tags `vMAJOR.MINOR.PATCH`, Conventional Commits, release branches).
6. **Roadmap / phases / architecture / data** — Under `docs/specs/` create or evolve:
   - `ROADMAP.md`
   - `PHASES.md`
   - `ARCHITECTURE.md`
   - `DATA_MODEL.md` (when applicable)
7. **Feature specs** — For each epic/feature area, ensure `docs/specs/features/<id>-<slug>/` contains `SPEC.md` (+ stubs for `API.md` or `INTEGRATIONS.md`, `TEST_PLAN.md` as needed) with acceptance criteria and a **Decision Log** appendix.

Link SEO work to nav labels and metadata tasks explicitly.

## CLI usage note

From this repo root, start the terminal CLI with `claude` (see [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview) for install). Non-interactive one-shot prompts use `claude -p "..."` per the [CLI reference](https://docs.anthropic.com/en/cli-reference); flags evolve — verify there before scripting.

## Completion

When finished, summarize for the human:

- Which files you created or updated (paths).
- Recommended next step in Cursor: **`/PLAN all`** or targeted **`/PLAN seo`** ... for refinement, then **`/DEVELOP`** after `docs/DESIGN.md` sign-off analog.
