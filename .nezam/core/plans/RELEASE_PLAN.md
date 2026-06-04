# NEZAM Release Plan
**Date:** 2026-06-04  
**Status:** R1 in progress — 1 of 4 blockers resolved

---

## Current State

| Layer | Status |
|---|---|
| Contract layer (`.cursor/`) | ~90% complete — 169 agents, 220 skills, 17 commands, 13 rules |
| Design Hub (`.nezam/design-hub/`) | ✅ All 6 dev phases done (phases 3–6 completed 2026-06-03) |
| CI/CD (12 workflows) | ✅ Healthy |
| Multi-tool sync | ✅ Working (`pnpm ai:sync` / `ai:check`) |
| SDD plan structure | ❌ Path + numbering drift (see C1–C3) |
| Skill hygiene | ❌ 22 duplicate design skill pairs (see C4) |
| Performance | ✅ References tree removed from workspace |

---

## Open Issues

### C1 — Plan-root contradiction (release blocker)

Three roots in active use, only one exists on disk:

| Reference | Files | Status |
|---|---|---|
| `docs/plan/` | `commands/start.md`, `commands/plan.md`, `commands/nezam.md`, `state/schemas/plan_progress.schema.yaml` | ❌ Dir does not exist |
| `docs/plans/` | 8 legacy design skills (unprefixed) | ❌ Dir does not exist; skills scheduled for deletion (C4) |
| `.nezam/core/plans/` | `agents/swarm-leader.md`, `agents/deputy-swarm-leader.md`, `commands/plan.md:629` | ✅ Only path on disk |

**Fix:** global find-replace `docs/plan/` and `docs/plans/` → `.nezam/core/plans/` across `commands/`, `rules/`, `state/`, surviving skills (~41 files after C4 dedup).

---

### C2 — Duplicate phase numbers on disk (release blocker)

Current `.nezam/core/plans/` layout:

```
00-define   01-research   02-ia   03-content   04-arch   04-design   05-harden   07-build
                                               ^^^^^^^^^^^^^^^^^^^               ^^ gap
design/   plans-design/   scaffold/   ← unnumbered orphans
```

Target layout:

```
00-define      PRD, PROJECT_PROMPT, specs/
01-research    SEO / market research
02-ia          information architecture
03-content     copy, content maps
04-architecture  stack, data model, API, auth, billing
05-design      tokens, components, wireframes, DESIGN_CHOICES
06-scaffold    PROJECT_SCAFFOLD
07-build       per-feature/per-page SPEC.md
08-harden      a11y, perf, security, SEO audits
09-ship        deploy checklist, monitoring
```

Migration:

| Current | Action |
|---|---|
| `04-arch/` | rename → `04-architecture/` |
| `04-design/` | rename → `05-design/` |
| `05-harden/` | rename → `08-harden/` |
| `07-build/` | keep as `07-build/` |
| `design/` | merge contents → `05-design/`, delete |
| `plans-design/` | merge contents → `05-design/`, delete |
| `scaffold/` | rename → `06-scaffold/` |
| _(missing)_ | create `09-ship/` placeholder |

---

### C3 — Four conflicting numbering schemes in `sdd-pipeline-v2.mdc` (release blocker)

`sdd-pipeline-v2.mdc` (alwaysApply) defines a different folder number for the same phase depending on product type — `04-architecture` in Website schema vs `02-architecture` in Web App/SaaS/Mobile. The same file also has three different plan roots internally.

**Fix:** replace all four per-type folder trees with the single universal scheme above (target from C2). Keep the four *execution-order* tables (the order phases run still differs by type). Fix all three internal root references to `.nezam/core/plans/`.

---

### C4 — 22 duplicate design skill pairs (release blocker)

Unprefixed versions use `docs/plans/` paths (C1) and will be deleted. `nezam-` versions are the current generation and stay.

Pairs to delete (22 unprefixed skills):

```
accessibility-audit         brand-visual-direction      component-library-api
css-architecture             dashboard-ia-patterns       dashboard-patterns
design-context-init          design-iteration-protocol   design-md
design-selector              design-to-code-handoff      design-tokens
interaction-choreography     micro-interaction-designer  motion-3d
user-flow-mapper             ux-research-protocol        visual-canvas-engine
wireframe-catalog            wireframe-pipeline          wireframe-to-spec
ui-ux-design
```

**Before deleting:** diff each pair to confirm zero unique content in the unprefixed copy.

---

### P2 — Filesystem surface area (performance, non-blocking)

References tree is resolved. Remaining:

- **Unused tool mirrors:** `.codex/`, `.antigravity/`, `.antigravitycli/`, `.kilo/`, `.kilocode/`, `.qwen/`, `.kiro/` — each ~400 files. Remove from `pnpm ai:sync` config if those tools aren't in active use.
- **Design Hub build artifacts:** add `.nezam/design-hub/node_modules`, `.nezam/design-hub/.next`, `tsconfig.tsbuildinfo` to `.vscode/settings.json` → `files.watcherExclude` and `search.exclude`.
- **Verify `AGENT_REGISTRY.yaml` is the only session-start load** — confirm no command force-loads all 169 agent files.

---

### B1 — Branch policy not enforced at hooks/CI (medium)

Policy exists in `skills/external/nezam-git-workflow/SKILL.md` but is not mechanically enforced.

- No `pre-push` hook rejecting non-compliant branch names.
- `/GIT branch` command references conventions without inlining the regex.
- No CI branch-name gate in `nezam-pr-gates.yml`.
- Stray `temp-merge-branch` ref in `.git/logs/refs/heads/`.

Valid branch pattern: `^(main|feature/.+|release/\d+\.\d+\.\d+|hotfix/\d+\.\d+\.\d+)$`

---

## Milestones

### R1 — Foundation (release blocker) 

Do not merge anything else until this is green.

- [ ] **C4** diff 22 pairs, delete unprefixed skills
- [ ] **C1** global find-replace legacy roots → `.nezam/core/plans/` (~41 files post-dedup)
- [ ] **C3** rewrite `sdd-pipeline-v2.mdc`: one universal scheme + fix 3 internal roots
- [ ] **C2** migrate on-disk plan tree (renames + merges above)
- [ ] `pnpm ai:sync && pnpm ai:check` green; `CLAUDE.md` regenerated
- [ ] CI guard in `sync-and-drift-check.yml`: fail on `docs/plans?/` outside `references/`

### R2 — Performance + Policy

- [x] ~~**P1** Move/strip `references/` from workspace~~ ✅ done
- [ ] **P2** Trim unused mirrors; add `watcherExclude` entries
- [ ] **B1** Add `pre-push` branch-name hook; inline regex in `commands/git.md`; add CI gate to `nezam-pr-gates.yml`
- [ ] **B2** Delete `temp-merge-branch`; export `main` branch-protection checklist

### R3 — Release Hardening

- [ ] End-to-end SDD pipeline run on one sample project per type — zero path-reconciliation turns
- [ ] `sdd-gate-enforcement.yml` + `design-gates.yml` + `wireframe-validation.yml` green on sample
- [ ] Tag `v-next` via `/GIT release` → `release.yml`; verify CHANGELOG + release notes
- [ ] `nezam-health-score` run; archive this plan alongside the score

---

## Sequencing

```
R1 (C4 → C1/C3 → C2 → sync) → R2 (can overlap R1 on different files, but ai:sync must run after R1 merges) → R3
```

R1 must merge first so R2's `ai:sync` regenerates from corrected contracts. R3 is the gate to tagging a release.
