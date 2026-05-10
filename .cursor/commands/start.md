/START — Initialize workspace and check readiness

Subcommands:
  /START repo       → Link or initialize your git repository
  /START docs       → Create required folder structure and context files
  /START gates      → Run all prerequisite checks. Shows ✅/❌ per gate in plain language.
  /START design     → Browse `.cursor/design/<brand>/`, pick one, copy to root DESIGN.md (parity: `pnpm run design:apply -- <brand>` in any CLI)
  /START companion  → Generate a briefing you can paste into any external AI (Claude.ai, Gemini, ChatGPT)
  /START continual-learning → **Opt-in:** enable transcript mining / incremental prepare (`pnpm continual-learning:on`). Continual learning stays **off** by default until you run this (or the pnpm script). To clear transcript index state only: `pnpm continual-learning:reset-memory`.
  /START all        → Run repo → docs → gates → design → companion in sequence (recommended for new projects). **Does not** enable continual-learning; use `/START continual-learning` separately when you want transcript mining.
    - **Multi-tool sync sanity (non-Cursor clients)**: After syncing governance, compare the **content** of canonical `.cursor/rules/workspace-orchestration.mdc` against the rules copy in your tool’s mirror root (for example `.claude/rules/workspace-orchestration.mdc`). If they differ, emit: `⚠️ Sync drift detected — run pnpm ai:sync before proceeding.` Optionally run `pnpm ai:status` for a one-line per-tool report.
    - Cursor users: `pnpm ai:status` should show all mirrors `✓ in sync` before high-stakes `/PLAN` or `/DEVELOP` turns.

Aliases: /START check → /START gates

Hard blocks: none (START is always available)
Recommendation footer: required
