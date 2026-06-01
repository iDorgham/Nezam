# Masri Design Assets — Reference Manifest

> **Read-only mirror.** Do not edit assets here directly. Source of truth lives in the linked archive paths below. To extend, copy a sanitized snapshot here and document the provenance.

## Purpose

Egyptian-Arabic ("Masri") visual culture pack used as design-time reference by:

- `.cursor/skills/design/typeui-masri-wireframe-typography/SKILL.md`
- `.cursor/skills/design/token-matched-dummy-renderer/SKILL.md`
- `.cursor/agents/masri-wireframe-specialist.md`
- `.cursor/agents/masri-content-specialist.md`

## Asset Categories

| Category | Description | Source location |
|---|---|---|
| `calligraphy/` | Display-grade Arabic letterforms, kufic + ruq'ah samples for hero/title slots | `.nezam/design-hub/_archive/v1/design/masri/design.md` (catalog references) |
| `colors/` | Cairo-coded palette tokens (Nile blue, desert sand, hibiscus) — mapped to `--ds-accent-*` semantic tokens | inline in `design.md` |
| `dummy-content/` | Realistic Masri names, places, phrases, prices in EGP, dates in Hijri/Gregorian dual format | inline in `design.md` |
| `iconography/` | Cultural glyph references (crescent, lotus, geometric) for empty states & decorative slots | TBD — pending swarm-leader curation |

## Provenance

- **v1 archive:** `.nezam/design-hub/_archive/v1/design/masri/design.md` — last touched 2025 cycle, contains profile-frontmatter token set + dummy content tables
- **v3 contract:** root `DESIGN.md` §10 (Sources of Truth) references this folder as the canonical Masri pointer

## RTL Expansion Rule

Arabic text reflow requires **+30% horizontal space** vs. Latin equivalents at the same point size. Any wireframe block that references this folder must include an RTL preview in the dummy-renderer output (see `token-matched-dummy-renderer` skill).

## Usage

```ts
// In wireframe block authoring
import { masriDummy } from '@nezam/design-hub/dummy-content/masri'
// All copy MUST pull from this set when locale = 'ar-EG'
```

## Next Curation Tasks (tracked in roadmap Phase 03)

- [ ] Extract calligraphy SVG primitives from v1 archive into `calligraphy/primitives.svg`
- [ ] Promote color palette into `--ds-masri-*` semantic token layer (requires Design Hub lock)
- [ ] Generate 50+ row Masri dummy-content TSV (names, addresses, phrases) for renderer

---

**Lock status:** Manifest only — actual asset payload pending Phase 03 curation pass.
