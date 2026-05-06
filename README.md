# COIA — Cursor workspace orchestration kit

Composable **slash commands**, **skills**, **rules**, and **templates** for Specification-Driven Development with SEO-first wording, prototype-first `DESIGN.md`, disciplined Git versioning, and browser-based “outside brain” assistants (example: **Grok** spelled “GORK” below as a mnemonic — replace with **Qwen**, **Gemini**, etc.).

## Quick orientation

| Command | Role |
|---------|------|
| `/START` | Onboarding: clone/link repo, scaffold PRD/Prompt/`DESIGN.md`, external-AI briefing |
| `/PLAN` | SDD: roadmap→phases→specs→docs; SEO→IA→content; release/version/tag plan |
| `/DEVELOP` | Implement from approved specs/design prototypes |
| `/DEPLOY` | Release mechanics, tagging, deployment checklist |
| `/CREATE` | Instantiate templates/doc shells |
| `/SCAN` | Security/perf/accessibility/content/SEO-AEO-GEO auditing |
| `/FIX` | Triage findings and produce minimal safe patches |
| `/SAVE` | Git hygiene: branching, commits, checkpoints, versioning alignment |
| `/GUIDE` | “Best friend”: where am I, what next, unblock copy-pastes |

Skills hold long procedures (`/.cursor/skills/<name>/SKILL.md`). Rules inject short guardrails (`/.cursor/rules/*.mdc`).

## Trusted external lists (skills & agents)

- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — curated Cursor rules ecosystem
- [spencerpauly/awesome-cursor-skills](https://github.com/spencerpauly/awesome-cursor-skills) — `SKILL.md` patterns
- [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) — large multi-tool skill collections (Cursor + others)
- [babysor/awesome-agent-skills](https://github.com/babysor/awesome-agent-skills) — vendor + community skill index

Bring in third-party snippets deliberately: review licensing, shrink to project needs, cite sources in commit messages.

## Minimum manual setup

1. `git init` (or clone) → open folder in Cursor
2. Run `/START init` conversation path
3. Fill `docs/specs/prd/` + `prompts/` from `templates/`
4. Run `/PLAN sdd seo ia content design versioning`
5. After `DESIGN.md` sign-off analog in docs, `/DEVELOP feature ...`
