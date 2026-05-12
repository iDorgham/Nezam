#!/bin/bash
# created: 2026-05-10
# version: 1.0.0
# owner: PM-01
# NEZAM: Check all SPEC.md files have required version fields
echo "Checking spec version compliance..."
FAIL=0
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
done < <(rg --files ".nezam/workspace/plans" -g "SPEC.md")
if [ $FAIL -eq 0 ]; then
  echo "✅ All specs have version fields."
fi
exit $FAIL
