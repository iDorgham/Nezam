# Cursor Prompt — Design Wireframe Selector
# Paste into Cursor chat (Cmd+L) to start the interactive design selection flow.

---

## ACTIVATE DESIGN SELECTION (after PRD is locked)

```prompt
/PLAN design wireframes

Read docs/core/required/PRD.md to detect my product type.
Then run the design-selector skill from .cursor/skills/design/design-selector/SKILL.md.

Rules:
- Show ONE element at a time, never all at once
- Show ASCII wireframe options with labels and best-for descriptions
- Wait for my number before showing the next element
- After all elements: show a confirmation summary
- On YES: write docs/workspace/plans/04-design/DESIGN_CHOICES.md then generate docs/workspace/plans/04-design/DESIGN.md
- On CHANGE [element]: show that element's options again

Start now. Detect my product type and show Element 1.
```

---

## IF PRODUCT TYPE IS AMBIGUOUS

```prompt
My project is a [website / web app / SaaS / mobile app].
Run /PLAN design wireframes using that type.
Start with Element 1 of the correct sequence.
```

---

## RESUME A PARTIAL SELECTION

```prompt
/PLAN design wireframes resume

Read docs/workspace/plans/04-design/DESIGN_CHOICES.md.
Show me which elements are already chosen and which are missing.
Continue from the first missing element.
```

---

## CHANGE ONE ELEMENT AFTER CONFIRMATION

```prompt
/PLAN design wireframes
CHANGE [header | grid | project_page | footer | contact | app_navigation | dashboard | data_table | empty_state | navigation_pattern | home_screen | detail_screen | onboarding]

Show me the options for that element again.
After I pick, update DESIGN_CHOICES.md and regenerate DESIGN.md.
```

---

## REGENERATE DESIGN.MD FROM EXISTING CHOICES

```prompt
Read docs/workspace/plans/04-design/DESIGN_CHOICES.md.
Regenerate docs/workspace/plans/04-design/DESIGN.md from the confirmed choices.
Do not ask questions — generate it directly from the YAML.
```

---

## WHAT EACH ELEMENT CONTROLS

### Website Projects
| Element | Controls |
|---|---|
| Header / Nav | Logo position, nav link layout, CTA placement, sticky behavior |
| Portfolio Grid | How work is displayed: 3-col / masonry / featured / list / bento |
| Project Page | Individual case study or project detail layout |
| Footer | Links, newsletter, social, copyright arrangement |
| Contact | Form style, channels shown, split vs full-width |

### Web App / SaaS Projects
| Element | Controls |
|---|---|
| App Navigation | Sidebar / top nav / icon rail / no nav — affects all screens |
| Dashboard Layout | KPI cards, chart placement, table, activity feed arrangement |
| Data Table / List | How collections of items are displayed and acted on |
| Empty State | What new users see before they have data |

### Mobile Projects
| Element | Controls |
|---|---|
| Navigation Pattern | Bottom tabs / top nav / drawer / gesture-only |
| Home Screen | Feed / grid / sectioned list |
| Detail Screen | Hero image + content vs clean text |
| Onboarding | Slides / permission cards / sign-up first |

---

## OUTPUT FILE LOCATIONS

| File | Path |
|---|---|
| Choices (YAML) | `docs/workspace/plans/04-design/DESIGN_CHOICES.md` |
| Design Contract | `docs/workspace/plans/04-design/DESIGN.md` |

Both must exist before `/PLAN scaffold` can run.

---

## FULL DESIGN PIPELINE ORDER

```
/PLAN idea          → PRD locked
/PLAN seo           → Keywords + URL slugs (website only — before IA)
/PLAN ia            → Pages, navigation, URL map
/PLAN design wireframes  → User picks layouts → DESIGN_CHOICES.md → DESIGN.md
/PLAN content       → Page copy, hero, microcopy
/PLAN arch          → Tech stack, data model (webapp/saas: run BEFORE design)
/PLAN scaffold      → Full file tree + scaffold.sh script
```
