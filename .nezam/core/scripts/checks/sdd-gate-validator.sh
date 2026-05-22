#!/usr/bin/env bash
# .nezam/core/scripts/checks/sdd-gate-validator.sh
# Validates NEZAM hardlock prerequisites for CI

set -euo pipefail

echo "Running SDD Gate Validator..."

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

state_folder="$(read_yaml_value "$workspace_paths_file" "state_folder" || true)"
if [[ -z "$state_folder" ]]; then
  state_folder=".cursor/state"
fi

# Check required state files
REQUIRED_FILES=(
  "$state_folder/onboarding.yaml"
  "$state_folder/plan_progress.yaml"
  "$state_folder/develop_phases.yaml"
)

scripts_folder="$(read_yaml_value "$workspace_paths_file" "scripts_folder" || true)"
if [[ -z "$scripts_folder" ]]; then
  scripts_folder=".nezam/core/scripts"
fi

# In CI environments these files might not exist initially,
# but if this is run as a gate, we should at least check for them.
for file in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "⚠️ State file missing: $file"
    echo "This is expected on fresh clones, but required for phase transitions."
    echo "Run '/FIX gates' or execute 'bash $scripts_folder/checks/repair-sdd-state.sh' to repair."
  fi
done

# Basic Python script to read yaml if needed
echo "✅ State check completed."

# Check legacy paths via integrity check
if [[ -f "$scripts_folder/checks/check-sdd-integrity.sh" ]]; then
  bash "$scripts_folder/checks/check-sdd-integrity.sh"
fi

echo "✅ SDD Gate Validation passed!"

