#!/bin/bash
set -e
echo "Running Design Excellence checks..."

if [ ! -f ".cursor/state/design_health.yaml" ]; then
  echo "FAIL: design_health.yaml missing"
  exit 1
fi

if grep -r "#[0-9a-fA-F]\{6\}" docs/plans/05-design/ 2>/dev/null; then
  echo "FAIL: Hardcoded hex values found in design specs"
  exit 1
fi

pnpm ai:check

if [ -d "tests/visual/rtl" ]; then
  npx playwright test visual-rtl --reporter=list
fi

if grep -q "target_market.*MENA" docs/prd/PRD.md 2>/dev/null; then
  if [ -f "scripts/checks/validate-cultural-design.js" ]; then
    node scripts/checks/validate-cultural-design.js
  fi
fi

echo "Design Excellence checks passed"
