#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
mode="${1:-}"

health_file="$repo_root/HEALTH.md"
memory_file="$repo_root/docs/memory/MEMORY.md"
context_file="$repo_root/docs/memory/CONTEXT.md"
bundle_file="$repo_root/docs/reports/progress/COMPANION_BUNDLE.md"
post_commit_hook="$repo_root/.githooks/post-commit"

now_utc="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

score_spec_completeness() {
  local files=(
    "$repo_root/docs/core/required/prd/PRD.md"
    "$repo_root/docs/core/required/PROJECT_PROMPT.md"
    "$repo_root/docs/03_architecture/ARCHITECTURE.md"
    "$repo_root/docs/core/VERSIONING.md"
    "$repo_root/CHANGELOG.md"
  )
  local present=0
  local total="${#files[@]}"
  local f
  for f in "${files[@]}"; do
    if [[ -s "$f" ]]; then
      present=$((present + 1))
    fi
  done
  echo $((present * 100 / total))
}

ensure_health_file() {
  if [[ ! -f "$health_file" ]]; then
    cat >"$health_file" <<EOF
# Project Health

Last updated: $now_utc

Overall: 0/100 ❌

| Dimension | Score | Status | Action needed |
| --- | --- | --- | --- |
| Spec completeness | 0 | ❌ Missing | Generate baseline project documents |
| Design contract | 0 | ❌ Missing | Select and copy a design profile |
| Security posture | 0 | ❌ Missing | Run /SCAN security |
| Performance budget | 0 | ❌ Missing | Run /SCAN perf |
| Test coverage | 0 | ❌ Missing | Add baseline tests and scan tests |
| Content quality | 0 | ❌ Missing | Create SEO, IA, and content maps |

To improve: Generate the required project setup docs first.
EOF
  fi
}

update_health_spec_dimension() {
  ensure_health_file
  local spec_score
  spec_score="$(score_spec_completeness)"
  local status="✅ Good"
  local action="—"
  if (( spec_score < 100 )); then
    status="⚠️ Warning"
    action="Complete missing required setup documents"
  fi

  python3 - "$health_file" "$now_utc" "$spec_score" "$status" "$action" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
timestamp = sys.argv[2]
score = sys.argv[3]
status = sys.argv[4]
action = sys.argv[5]

content = path.read_text()
content = re.sub(r"Last updated: .*", f"Last updated: {timestamp}", content, count=1)
content = re.sub(
    r"\| Spec completeness \| .*",
    f"| Spec completeness | {score} | {status} | {action} |",
    content,
    count=1,
)
path.write_text(content)
PY
}

append_memory_commit_entry() {
  local commit_subject files_changed
  commit_subject="$(git -C "$repo_root" log -1 --pretty=%s 2>/dev/null || echo "unknown commit")"
  files_changed="$(git -C "$repo_root" diff-tree --no-commit-id --name-only -r HEAD 2>/dev/null | wc -l | tr -d ' ')"
  {
    echo "- $now_utc — commit: $commit_subject (files changed: $files_changed)"
  } >>"$memory_file"
}

refresh_context_timestamp() {
  python3 - "$context_file" "$now_utc" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
timestamp = sys.argv[2]
content = path.read_text()
content = re.sub(
    r"(- Last updated UTC: ).*",
    rf"\1{timestamp}",
    content,
    count=1,
)
path.write_text(content)
PY
}

install_hook_call() {
  if ! rg -q "auto-memory-hooks.sh --post-commit" "$post_commit_hook"; then
    {
      echo "bash \"\$repo_root/scripts/context/auto-memory-hooks.sh\" --post-commit >/dev/null 2>&1 || true"
    } >>"$post_commit_hook"
  fi
}

build_companion_bundle() {
  local context_path="$repo_root/docs/memory/CONTEXT.md"
  local progress_path="$repo_root/docs/reports/progress/PROGRESS_REPORT.latest.md"
  local health_path="$repo_root/HEALTH.md"

  {
    echo "# Companion Bundle"
    echo
    echo "Generated: $now_utc"
    echo
    echo "## CONTEXT.md"
    echo
    cat "$context_path"
    echo
    echo "## PROGRESS_REPORT.latest.md"
    echo
    cat "$progress_path"
    echo
    echo "## HEALTH.md"
    echo
    cat "$health_path"
  } >"$bundle_file"
}

case "$mode" in
  --install)
    install_hook_call
    chmod +x "$post_commit_hook"
    ;;
  --post-commit)
    append_memory_commit_entry
    update_health_spec_dimension
    refresh_context_timestamp
    ;;
  --bundle-report)
    ensure_health_file
    build_companion_bundle
    ;;
  *)
    echo "Usage: bash scripts/context/auto-memory-hooks.sh --install|--post-commit|--bundle-report"
    exit 1
    ;;
esac
