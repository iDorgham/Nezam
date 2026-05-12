# Feature Request: Workspace-Scoped `/.antigravity/commands/` Discovery

**Filed:** 2026-05-12  
**Status:** Draft — pending submission to Antigravity team  
**Priority:** Medium  
**Reported by:** NEZAM Workspace Governance (NEZAM / iDorgham)

---

## Summary

Antigravity should discover and surface commands from a workspace-local `.antigravity/commands/` directory in the `/` command palette, parallel to how Cursor handles `.cursor/commands/`.

---

## Problem Statement

When a user types `/` in the Antigravity chat, only built-in slash commands appear. Custom prompt templates placed in `.antigravity/commands/<name>.md` are **not discoverable or invokable** via the palette.

This creates a first-class interop gap for workspaces (like NEZAM) that use `.antigravity/` as a workspace registry synced from `.cursor/` via tooling (`pnpm ai:sync`). The commands exist on disk but are invisible to the Antigravity runtime.

---

## Current Behaviour

```
User types: /
Result: Only built-in Antigravity commands appear.
Files in .antigravity/commands/*.md → ignored by the command palette.
```

---

## Expected Behaviour

```
User types: /
Result: Built-in commands + workspace-local commands from .antigravity/commands/*.md
         displayed in the palette with their descriptions parsed from file frontmatter.

User types: /plan design
Result: Antigravity loads .antigravity/commands/plan.md, executes the `design` sub-command.
```

---

## Proposed Implementation

### 1. Discovery
On workspace open, walk up from `$PWD` to find the nearest directory containing `.antigravity/commands/`. Register all `*.md` files as workspace-scoped commands.

### 2. Metadata Parsing
Read command name and description from YAML frontmatter or the first `H1 + paragraph` of each file:

```markdown
---
name: plan
description: Full planning pipeline — idea, SEO, IA, content, design, arch
---
```

### 3. Palette Registration
Merge workspace commands into the `/` palette under a **"Workspace"** section, visually separated from built-ins.

### 4. Sub-command Routing
Support `/<command> <subcommand>` syntax — route to the matching section heading inside the `.md` file.

### 5. Conflict Resolution
If a workspace command name collides with a built-in, the built-in takes precedence. Workspace commands should be prefixed (e.g. shown as `[ws] /plan`) or resolved via explicit workspace qualifier.

---

## Precedent

| Tool | Config File | Behaviour |
|---|---|---|
| **Cursor** | `.cursor/commands/*.md` | Full slash-command palette, sub-command routing, frontmatter metadata |
| **Claude (Desktop)** | `.claude/commands/*.md` | Same discovery model |
| **Antigravity** | `.antigravity/commands/*.md` | ❌ Not discovered — this request |

NEZAM already maintains `.antigravity/` as a generated mirror of `.cursor/` via `pnpm ai:sync`. The only missing piece is Antigravity's runtime discovery.

---

## Interim Workaround (active)

A global skill `~/.gemini/antigravity/skills/nezam-commands/SKILL.md` has been installed as a dispatcher that reads workspace-local commands at runtime. This works but requires the user to know the skill exists — it does not surface commands in the `/` palette.

---

## Acceptance Criteria

- [ ] `.antigravity/commands/*.md` files are auto-discovered on workspace open
- [ ] Commands appear in the `/` palette under a "Workspace" section
- [ ] `/<name> <subcommand>` routing works against section headings in the file
- [ ] YAML frontmatter `description` field is shown in palette autocomplete
- [ ] No collision with built-in commands (built-ins win)
- [ ] Works cross-platform (macOS, Linux, Windows)

---

## References

- NEZAM workspace: `iDorgham/Nezam`
- Sync tooling: `pnpm ai:sync` → `scripts/sync-ai-folders.js`
- Cursor commands: `.cursor/commands/`
- Generated mirror: `.antigravity/commands/`
- Multi-tool index: `docs/nezam/memory/MULTI_TOOL_INDEX.md`
