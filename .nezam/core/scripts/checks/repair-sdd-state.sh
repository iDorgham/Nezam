#!/usr/bin/env bash
# .nezam/scripts/checks/repair-sdd-state.sh
# Restores missing state files from schemas in .cursor/state/schemas/

set -euo pipefail

echo "Running SDD State Repair (/FIX gates)..."

STATE_DIR=".cursor/state"
SCHEMA_DIR="$STATE_DIR/schemas"

if [[ ! -d "$SCHEMA_DIR" ]]; then
  echo "❌ Schema directory $SCHEMA_DIR not found. Cannot repair."
  exit 1
fi

mkdir -p "$STATE_DIR"

# List of required state files
STATE_FILES=(
  "onboarding.yaml"
  "plan_progress.yaml"
  "develop_phases.yaml"
  "agent-bus.yaml"
  "agent-status.yaml"
  "HANDOFF_QUEUE.yaml"
)

REPAIRED=0

for state_file in "${STATE_FILES[@]}"; do
  file_path="$STATE_DIR/$state_file"
  # Schema file replaces .yaml with .schema.yaml
  schema_file="$SCHEMA_DIR/${state_file%.yaml}.schema.yaml"
  
  if [[ ! -f "$file_path" ]]; then
    if [[ -f "$schema_file" ]]; then
      echo "⚠️  Missing $state_file. Restoring from schema defaults..."
      if [[ "$state_file" == "develop_phases.yaml" ]]; then
        cat << 'EOF' > "$file_path"
---
phase_1:
  status: "unlocked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
phase_2:
  status: "locked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
phase_3:
  status: "locked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
phase_4:
  status: "locked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
phase_5:
  status: "locked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
phase_6:
  status: "locked"
  testing_passed: false
  depends_on: null
  unlocked_at: ""
  completed_at: ""
EOF
      else
        echo "---" > "$file_path"
        awk '/^defaults:/{flag=1; next} /^fields:/{flag=0} flag {print}' "$schema_file" | sed 's/^  //' >> "$file_path"
      fi
      REPAIRED=1
    else
      echo "❌ Schema $schema_file not found for $state_file."
    fi
  else
    echo "✅ $state_file exists."
  fi
done

if [[ $REPAIRED -eq 1 ]]; then
  echo "✅ SDD State repaired from schemas."
else
  echo "✅ No repair needed."
fi
