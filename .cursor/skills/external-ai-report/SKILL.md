---
name: external-ai-report
description: Generate concise progress reports for browser-based AI companions (Grok/Qwen/Gemini) with upload reminders.
paths:
  - "docs/reports/**"
  - "docs/external-ai/**"
---

# External companion progress report

Use with `/SAVE report` or end-of-milestone dev updates.

## Target file

`docs/reports/PROGRESS_REPORT.latest.md` — short, factual, timestamped. Older snapshots optional in `docs/reports/history/`.

## Required sections

1. **Project snapshot** — purpose, current phase, active branch, last tag.
2. **Done since last report** — bullet list tied to spec IDs / PR titles.
3. **In flight** — tasks with blockers.
4. **Risks & unknowns** — explicit questions for companion reasoning.
5. **Prompts that worked** — reusable prompt snippets (labelled).
6. **Next 3 actions** — ordered.
7. **Attachments hint** — paths to read next (`DESIGN.md`, `SPEC.md`, `SEO_RESEARCH.md`).

Remind user in closing lines: “Upload this file to your external AI project knowledge / chat.”
