#!/bin/bash
# created: 2026-05-10
# version: 1.0.0
# owner: PM-01
# NEZAM: Check all SPEC.md files have required version fields
echo "Checking spec version compliance..."
FAIL=0

workspace_paths_file=".nezam/workspace.paths.yaml"
if [[ -f "$workspace_paths_file" ]]; then
  plans_root="$(grep -E "^[[:space:]]*plan_folder:" "$workspace_paths_file" | head -n 1 | cut -d':' -f2- | cut -d'#' -f1 | tr -d ' "' | tr -d "'")"
fi
if [[ -z "${plans_root:-}" ]]; then
  plans_root=".nezam/core/plans"
fi

while IFS= read -r spec; do
  if ! rg -q "spec_version:" "$spec"; then
    echo "❌ Missing spec_version: $spec"
    FAIL=1
  fi
  if ! rg -q "spec_id:" "$spec"; then
    echo "❌ Missing spec_id: $spec"
    FAIL=1
  fi
  if ! rg -q "status:" "$spec"; then
    echo "❌ Missing status: $spec"
    FAIL=1
  fi
done < <(rg --files "$plans_root" -g "SPEC.md")
if [ $FAIL -eq 0 ]; then
  echo "✅ All specs have version fields."
fi
exit $FAIL

