/PLAN — Specification-driven planning across all product dimensions

Subcommands (in recommended execution order):
  /PLAN idea        → Guided PRD creation — 7 questions, auto-generates all required planning docs
  /PLAN seo         → Keyword research, search intent mapping, slug rules → SEO_RESEARCH.md
  /PLAN ia          → Information architecture, pages, navigation, URL map → IA_CONTENT.md
  /PLAN content     → Page copy, hero sections, microcopy, voice/tone → CONTENT_MAP.md
  /PLAN design      → Design system contract: tokens, typography, motion, components → DESIGN.md
  /PLAN arch        → System architecture, tech stack decisions, data model → ARCHITECTURE.md
  /PLAN tech        → Technical feasibility, stack evaluation, cost estimate
  /PLAN tasks       → Generate full task breakdown from specs into MASTER_TASKS.md
  /PLAN roadmap     → Milestone timeline, phase dependencies, SemVer bumps
  /PLAN brand       → Brand voice, visual identity direction, tone guidelines
  /PLAN all         → Run complete SDD sequence: seo → ia → content → design → arch → tasks

Aliases: /PLAN menus → /PLAN ia | /PLAN copy → /PLAN content | /PLAN spec → /PLAN arch

Hard block: PRD.md must exist and be non-template before any subcommand runs.
PRD missing → redirect to /PLAN idea
Recommendation footer: required
