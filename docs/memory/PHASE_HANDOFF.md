# PHASE_HANDOFF — shared context packet (canonical)

**Purpose:** Single cross-agent handoff surface at SDD **phase boundaries** and before **MODE B/C** work so SEO, IA, content, design, and engineering do not drift in isolation.

**Rules:** Update this file at **every phase gate transition** (or when materially changing locked decisions).  
**Controller rule:** No cross-domain agent work may start without reading this file — see `.cursor/agents/subagent-controller.md`.

---

## Packet metadata

| Field | Value |
|-------|-------|
| **Product type** | (`website` \| `webapp` \| `saas` \| `mobile`) |
| **Phase** | (e.g. `01-research`, `02-ia`, …) |
| **Last updated (UTC)** | YYYY-MM-DDTHH:MMZ |
| **Owner (PM-01)** | name or @ |

---

## Shared context JSON (copy into handoff bundles as needed)

Minimal machine-friendly shape; keep values short and link to real docs.

```json
{
  "active_keywords": [],
  "keyword_to_page_or_intent": [],
  "locked_urls": [],
  "nav_labels_locked": true,
  "design_token_decisions": [],
  "content_decisions_locked": [],
  "open_questions": []
}
```

---

## Field guide (human-readable)

### `active_keywords`

Primary and secondary keyword clusters **locked for this phase** — titles, H1s, and nav must trace here. Link to `SEO_RESEARCH.md` or equivalent.

### `locked_urls`

Slug + canonical path map. Any change **triggers partial rollback** of IA (see `.cursor/rules/workspace-orchestration.mdc`).

### `design_token_decisions`

Pointers to `DESIGN.md` sections: palette roles, type scale, spacing, motion budget. No raw hex in app code — token sources only.

### `content_decisions_locked`

Voice/tone, mandatory claims, legal disclaimers, CTA inventory — link `CONTENT_MAP.md`, `VOICE_TONE.md`, locale notes.

### `open_questions`

Unresolved cross-domain items **blocking** next gate; each line: owner + target date + escalation path.

---

## Sign-off (phase exit)

| Domain | Agent lens | Status (`pending` / `done`) | Notes |
|--------|------------|---------------------------|-------|
| SEO / research | `seo-specialist` | | |
| IA | `content-strategist` / `lead-uiux-designer` | | |
| Content | `content-strategist` | | |
| Design | `design-lead` / `lead-uiux-designer` | | |
| Architecture | `project-architect` / `lead-solution-architect` | | |

---

## Top cross-domain junctions (SDD)

1. **Keywords → IA labels + URL slugs** — bad lock poisons SEO, nav, and routing.
2. **IA / routes → design section IDs + component names** — mismatch breaks analytics and deep links.
3. **Design tokens + motion → content fit** — overflow and truncation drive copy rewrites.

When any of the three moves, **update this packet** before the next specialist starts.
