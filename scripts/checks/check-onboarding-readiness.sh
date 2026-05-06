#!/usr/bin/env bash
# Planning readiness for CI. Constitution (`docs/CONSTITUTION.md`) is intentionally optional —
# scaffold with `/CREATE constitution` when invariants matter; do not gate `/PLAN` on it here.
set -euo pipefail

required_files=(
  "docs/specs/prd/PRD.md"
  "docs/prompts/PROJECT_PROMPT.md"
)

missing=0

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required onboarding artifact: $file"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  echo
  echo "Planning readiness check failed."
  echo "Required order:"
  echo "1. /START repo"
  echo "2. /CREATE prd"
  echo "3. /CREATE prompt"
  echo "4. /START gates"
  exit 1
fi

echo "Planning readiness check passed."
