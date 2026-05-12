#!/usr/bin/env bash
# Enforce docs layout policy:
#   - Forbid legacy top-level doc trees
#   - docs/reports/ must contain only recognised category sub-folders (no loose files, no README)
#   - docs/prd/ must contain only PRD.md (no extra loose files)
#   - docs/plans/ must be empty or contain only .gitkeep
set -euo pipefail

fail=0

# Forbidden legacy roots.
for legacy in docs/context docs/plan docs/required docs/core docs/reference docs/workspace; do
  if [[ -e "$legacy" ]]; then
    echo "FAIL: legacy path must not exist: $legacy"
    fail=1
  fi
done

# Reports at wrong location.
for bad in docs/TEST_MATRIX.md docs/PROGRESS_REPORT.latest.md; do
  if [[ -f "$bad" ]]; then
    echo "FAIL: report must not live at $bad (use docs/reports/<category>/)"
    fail=1
  fi
done

# docs/reports/ — only recognised category sub-folders, no loose files at root.
if [[ -d docs/reports ]]; then
  for entry in docs/reports/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    if [[ -f "$entry" ]]; then
      echo "FAIL: docs/reports must not contain loose files (move under a category/): $base"
      fail=1
      continue
    fi
    case "$base" in
      a11y|audits|coverage|html|lighthouse|perf|progress|security|tests) ;;
      *)
        echo "FAIL: unknown docs/reports category: $base (allowed: a11y audits coverage html lighthouse perf progress security tests)"
        fail=1
        ;;
    esac
  done
fi

# docs/plans/ — must be empty or contain only .gitkeep / sub-phase directories.
if [[ -d docs/plans ]]; then
  for entry in docs/plans/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    if [[ -f "$entry" && "$base" != ".gitkeep" ]]; then
      echo "FAIL: docs/plans must not contain loose files (found: $base). Plans are scaffolded by /plan."
      fail=1
    fi
  done
fi

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "Docs layout policy failed."
  exit 1
fi

echo "Docs layout policy passed."
