#!/usr/bin/env bash
# Enforce docs layout policy dynamically using .nezam/workspace.paths.yaml config:
#   - Forbid legacy top-level doc trees
#   - reports_folder must contain only recognised category sub-folders (no loose files, no README)
#   - plan_folder contains execution plans
set -euo pipefail

workspace_paths_file=".nezam/workspace.paths.yaml"

read_yaml_value() {
  local file="$1"
  local key="$2"
  grep -E "^[[:space:]]*${key}:" "$file" | head -n 1 | cut -d':' -f2- | cut -d'#' -f1 | tr -d ' "' | tr -d "'"
}

if [[ ! -f "$workspace_paths_file" ]]; then
  echo "Missing NEZAM Workspace Paths Configuration: $workspace_paths_file"
  exit 1
fi

docs_folder="$(read_yaml_value "$workspace_paths_file" "docs_folder" || true)"
reports_folder="$(read_yaml_value "$workspace_paths_file" "reports_folder" || true)"
plan_folder="$(read_yaml_value "$workspace_paths_file" "plan_folder" || true)"

if [[ -z "$docs_folder" || -z "$reports_folder" || -z "$plan_folder" ]]; then
  echo "Invalid NEZAM Workspace Paths Configuration: missing required keys."
  exit 1
fi

fail=0

# Forbidden legacy roots.
for legacy in "$docs_folder/context" "$docs_folder/plan" "$docs_folder/required" "$docs_folder/core" "$docs_folder/reference" "$docs_folder/workspace"; do
  if [[ -e "$legacy" ]]; then
    echo "FAIL: legacy path must not exist: $legacy"
    fail=1
  fi
done

# Reports at wrong location.
for bad in "$docs_folder/TEST_MATRIX.md" "$docs_folder/PROGRESS_REPORT.latest.md"; do
  if [[ -f "$bad" ]]; then
    echo "FAIL: report must not live at $bad (use $reports_folder/<category>/)"
    fail=1
  fi
done

# reports_folder — only recognised category sub-folders, no loose files at root.
if [[ -d "$reports_folder" ]]; then
  for entry in "$reports_folder"/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    if [[ -f "$entry" ]]; then
      if [[ "$base" != "README.md" && "$base" != ".gitkeep" ]]; then
        echo "FAIL: $reports_folder must not contain loose files (move under a category/): $base"
        fail=1
      fi
      continue
    fi

    case "$base" in
      a11y|audits|coverage|html|lighthouse|perf|progress|release|security|tests) ;;
      *)
        echo "FAIL: unknown reports category: $base (allowed: a11y audits coverage html lighthouse perf progress release security tests)"
        fail=1
        ;;
    esac
  done
fi

# Legacy docs/plans/ verification if folder still exists
if [[ -d "docs/plans" ]]; then
  for entry in docs/plans/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    if [[ -f "$entry" && "$base" != ".gitkeep" ]]; then
      echo "FAIL: legacy docs/plans must not contain loose files (found: $base). Plans are scaffolded in $plan_folder."
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
