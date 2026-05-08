#!/usr/bin/env bash
# Enforce docs/core + docs/reports layout; forbid legacy top-level docs trees.
set -euo pipefail

fail=0

for legacy in docs/context docs/plan docs/required docs/templates; do
  if [[ -e "$legacy" ]]; then
    echo "FAIL: legacy path must not exist: $legacy (use docs/core/...)"
    fail=1
  fi
done

for bad in docs/TEST_MATRIX.md docs/PROGRESS_REPORT.latest.md; do
  if [[ -f "$bad" ]]; then
    echo "FAIL: report must not live at $bad (use docs/reports/<category>/)"
    fail=1
  fi
done

if [[ -d docs/reports ]]; then
  for entry in docs/reports/*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    if [[ "$base" == "README.md" ]]; then
      continue
    fi
    case "$base" in
      a11y|audits|coverage|lighthouse|perf|progress|security|tests) ;;
      *)
        echo "FAIL: unknown docs/reports category: $base"
        fail=1
        ;;
    esac
  done
fi

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "Docs layout policy failed. See docs/README.md and docs/reports/README.md."
  exit 1
fi

echo "Docs layout policy passed."
