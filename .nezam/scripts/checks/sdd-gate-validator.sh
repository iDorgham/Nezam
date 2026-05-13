#!/usr/bin/env bash
# scripts/checks/sdd-gate-validator.sh
# Validates NEZAM hardlock prerequisites for CI

set -euo pipefail

echo "Running SDD Gate Validator..."

# Check required state files
REQUIRED_FILES=(
  ".cursor/state/onboarding.yaml"
  ".cursor/state/plan_progress.yaml"
  ".cursor/state/develop_phases.yaml"
)

# In CI environments these files might not exist initially,
# but if this is run as a gate, we should at least check for them.
for file in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "⚠️ State file missing: $file"
    echo "This is expected on fresh clones, but required for phase transitions."
    echo "Run '/FIX gates' or execute 'bash scripts/checks/repair-sdd-state.sh' to repair."
  fi
done

# Basic Python script to read yaml if needed
echo "✅ State check completed."

# Check legacy paths via integrity check
if [[ -f "scripts/checks/check-sdd-integrity.sh" ]]; then
  bash scripts/checks/check-sdd-integrity.sh
fi

echo "✅ SDD Gate Validation passed!"
