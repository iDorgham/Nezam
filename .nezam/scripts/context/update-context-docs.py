#!/usr/bin/env python3
"""Refresh auto-managed section in docs/workspace/context/CONTEXT.md."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys

AUTO_BEGIN = "AUTO-MANAGED:BEGIN"
AUTO_END = "AUTO-MANAGED:END"


def run_git(repo: Path, args: list[str]) -> str:
    try:
        result = subprocess.run(["git", *args], cwd=repo, check=True, capture_output=True, text=True)
        return result.stdout.strip()
    except Exception:
        return "unknown"


def file_exists(repo: Path, rel_path: str) -> bool:
    return (repo / rel_path).is_file()


def compute_phase(has_prd: bool, has_prompt: bool, has_seo: bool, has_design: bool) -> str:
    if not has_prd or not has_prompt:
        return "Onboarding"
    if not has_seo:
        return "SEO"
    if not has_design:
        return "UI/Design"
    return "Development"


def replace_auto_block(path: Path, rendered_block: str) -> None:
    content = path.read_text(encoding="utf-8")
    start = content.find(AUTO_BEGIN)
    end = content.find(AUTO_END)
    if start == -1 or end == -1 or end < start:
        raise RuntimeError(f"Missing auto-managed markers in {path}")
    end += len(AUTO_END)
    replacement = f"{AUTO_BEGIN}\n{rendered_block}\n{AUTO_END}"
    updated = content[:start] + replacement + content[end:]
    path.write_text(updated, encoding="utf-8")


def render_context(now_iso: str, branch: str, last_commit: str, phase: str, has_prd: bool, has_design: bool, has_report: bool) -> str:
    return "\n".join([
        "## Auto-Managed Snapshot",
        f"- Last updated UTC: {now_iso}",
        f"- Current git branch: {branch}",
        f"- Last commit: {last_commit}",
        f"- Current phase guess: {phase}",
        f"- PRD present: {'yes' if has_prd else 'no'}",
        f"- Design present: {'yes' if has_design else 'no'}",
        f"- Progress report present: {'yes' if has_report else 'no'}",
    ])


def main() -> int:
    repo = Path(__file__).resolve().parents[2]
    context_doc = repo / "docs/workspace/context/CONTEXT.md"
    if not context_doc.is_file():
        print("docs/workspace/context/CONTEXT.md is missing. Skipping update.", file=sys.stderr)
        return 0

    has_prd = file_exists(repo, ".nezam/workspace/prd/PRD.md")
    has_prompt = file_exists(repo, ".nezam/workspace/prd/PROJECT_PROMPT.md")
    has_seo = file_exists(repo, "docs/plans/04-design/SEO_RESEARCH.md")
    has_design = file_exists(repo, "docs/DESIGN.md")
    has_report = file_exists(repo, "docs/reports/progress/PROGRESS_REPORT.latest.md")
    phase = compute_phase(has_prd, has_prompt, has_seo, has_design)
    branch = run_git(repo, ["rev-parse", "--abbrev-ref", "HEAD"])
    last_commit = run_git(repo, ["log", "-1", "--pretty=%h %s"])
    now_iso = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    rendered = render_context(now_iso, branch, last_commit, phase, has_prd, has_design, has_report)
    replace_auto_block(context_doc, rendered)
    print("Updated docs/workspace/context/CONTEXT.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
