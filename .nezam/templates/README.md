# NEZAM Template Library

> Canonical location for all workspace-generated artifact templates.
> Edit files here to permanently change what every `/plan`, `/start`, and agent output produces.

---

## Categories

| Folder | Purpose | Used by |
|--------|---------|---------|
| `ai-client/` | AI tool config templates (CLAUDE.md, AGENTS.md, SKILL.md…) | `pnpm ai:sync` |
| `plan/` | Phase planning templates (gates, prompts, specs, tasks) | `/plan`, agents |
| `sdd/` | SDD pipeline templates (PRD, feature spec, design sprint) | `/start prd`, `/plan` |
| `specs/` | Specification templates (changelog, constitution, progress report) | `/plan`, `/check` |
| `ui-ux/` | UI/UX templates (tokens, components, swarm handoffs) | design agents |
| `swarm/` | Swarm coordination templates (decision records, handoff packets) | swarm agents |
| `research-design/` | Research & design document templates | `/plan design` |

---

## How to Customise

**Edit a template directly:**
```
.nezam/templates/<category>/<TEMPLATE_NAME>.md
```
All future outputs generated from that template will use your version.

**Interactive editing via command:**
```
/nezam templates edit <template-name>
```

**Reset to NEZAM default:**
```
/nezam templates reset <template-name>
```
(Restores from the reference copy in `.nezam/workspace/templates/` if it exists.)

---

## Template Variables

Templates use `{{VARIABLE_NAME}}` placeholders. Common variables:

| Variable | Replaced with |
|----------|--------------|
| `{{PROJECT_NAME}}` | Value from `workspace.settings.yaml → project.name` |
| `{{DATE}}` | Current date (YYYY-MM-DD) |
| `{{OWNER}}` | Project owner |
| `{{VERSION}}` | Current semver from VERSIONING.md |
| `{{PHASE}}` | Active SDD phase |

---

## After Editing

Always run after any template change:
```bash
pnpm ai:sync    # propagate changes to all AI clients
pnpm ai:check   # verify no drift
```

Or use the shortcut:
```
/nezam sync
```

---

## Rules

- **Never** edit template files during active project work — use `/nezam templates`
- Templates are synced by `pnpm ai:sync` to mirrored AI client directories
- Do not delete this README — it is used by `/nezam templates` as the category index
