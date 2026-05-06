#!/usr/bin/env python3
"""
Refresh auto-managed sections in docs/context/workspace.md and project.md.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys

AUTO_BEGIN = "AUTO-MANAGED:BEGIN"
AUTO_END = "AUTO-MANAGED:END"


@dataclass
class DocState:
    branch: str
    last_commit: str
    last_tag: str
    has_origin: bool
    phase: str
    has_prd: bool
    has_prompt: bool
    has_seo: bool
    has_design: bool
    has_report: bool
    has_roadmap: bool
    has_versioning: bool


def run_git(repo: Path, args: list[str]) -> str:
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=repo,
            check=True,
            capture_output=True,
            text=True,
        )
        return result.stdout.strip()
    except Exception:
        return "unknown"


def file_exists(repo: Path, rel_path: str) -> bool:
    return (repo / rel_path).is_file()


def compute_phase(state: DocState) -> str:
    if not state.has_prd or not state.has_prompt:
        return "Onboarding"
    if not state.has_seo:
        return "SEO"
    if not state.has_design:
        return "UI/Design"
    return "Development"


def block_status(path: str, exists: bool) -> str:
    return f"- {path} ({'present' if exists else 'missing'})"


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


def render_workspace(now_iso: str, state: DocState) -> str:
    next_cmd = "/START all" if state.phase == "Onboarding" else "/PLAN all"
    reason = (
        "onboarding gates are incomplete"
        if state.phase == "Onboarding"
        else "continue phase progression with dependency checks"
    )
    return "\n".join(
        [
            "## Auto-Managed Runtime Snapshot",
            "",
            f"- Last updated UTC: {now_iso}",
            f"- Current git branch: {state.branch}",
            f"- Last commit: {state.last_commit}",
            f"- Last tag: {state.last_tag}",
            f"- Repo has remote origin: {'yes' if state.has_origin else 'no'}",
            f"- Current phase guess: {state.phase}",
            "",
            "## Auto-Managed Artifact Status",
            "",
            block_status("PRD: `docs/specs/prd/PRD.md`", state.has_prd),
            block_status("Project prompt: `docs/prompts/PROJECT_PROMPT.md`", state.has_prompt),
            block_status("SEO research: `docs/specs/sdd/SEO_RESEARCH.md`", state.has_seo),
            block_status("Design prototype: `DESIGN.md`", state.has_design),
            block_status(
                "Progress report: `docs/reports/PROGRESS_REPORT.latest.md`", state.has_report
            ),
            "",
            "## Auto-Managed Next Checkpoint",
            "",
            f"- Suggested next command: `{next_cmd}`",
            f"- Reason: {reason}",
        ]
    )


def render_project(now_iso: str, state: DocState) -> str:
    return "\n".join(
        [
            "## Auto-Managed Progress Index",
            "",
            f"- Last updated UTC: {now_iso}",
            f"- Active branch: {state.branch}",
            f"- Latest tracked phase: {state.phase}",
            "",
            "## Auto-Managed Artifact Links",
            "",
            block_status("PRD: `docs/specs/prd/PRD.md`", state.has_prd),
            block_status("Roadmap: `docs/specs/sdd/ROADMAP.md`", state.has_roadmap),
            block_status("Versioning: `docs/specs/sdd/VERSIONING.md`", state.has_versioning),
            block_status("SEO research: `docs/specs/sdd/SEO_RESEARCH.md`", state.has_seo),
            block_status("Design doc: `DESIGN.md`", state.has_design),
            block_status("Latest report: `docs/reports/PROGRESS_REPORT.latest.md`", state.has_report),
            "",
            "## Auto-Managed Prompt Snippets",
            "",
            "```prompt",
            "Upload docs/reports/PROGRESS_REPORT.latest.md + key docs (DESIGN.md, SEO_RESEARCH.md, active SPEC) and critique gaps by phase.",
            "```",
        ]
    )


def main() -> int:
    repo = Path(__file__).resolve().parents[2]
    workspace_doc = repo / "docs/context/workspace.md"
    project_doc = repo / "docs/context/project.md"

    if not workspace_doc.is_file() or not project_doc.is_file():
        print("Context docs missing. Skipping update.", file=sys.stderr)
        return 0

    state = DocState(
        branch=run_git(repo, ["rev-parse", "--abbrev-ref", "HEAD"]),
        last_commit=run_git(repo, ["log", "-1", "--pretty=%h %s"]),
        last_tag=run_git(repo, ["describe", "--tags", "--abbrev=0"]),
        has_origin=run_git(repo, ["remote", "get-url", "origin"]) != "unknown",
        phase="",
        has_prd=file_exists(repo, "docs/specs/prd/PRD.md"),
        has_prompt=file_exists(repo, "docs/prompts/PROJECT_PROMPT.md"),
        has_seo=file_exists(repo, "docs/specs/sdd/SEO_RESEARCH.md"),
        has_design=file_exists(repo, "DESIGN.md"),
        has_report=file_exists(repo, "docs/reports/PROGRESS_REPORT.latest.md"),
        has_roadmap=file_exists(repo, "docs/specs/sdd/ROADMAP.md"),
        has_versioning=file_exists(repo, "docs/specs/sdd/VERSIONING.md"),
    )
    state.phase = compute_phase(state)

    now_iso = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    replace_auto_block(workspace_doc, render_workspace(now_iso, state))
    replace_auto_block(project_doc, render_project(now_iso, state))
    print("Updated docs/context/workspace.md and docs/context/project.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
