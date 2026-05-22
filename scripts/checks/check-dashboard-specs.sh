#!/bin/bash
set -e
echo "Validating dashboard specs & state gates..."

if [ ! -f ".cursor/state/dashboard_health.yaml" ]; then
  echo "FAIL: dashboard_health.yaml missing"
  exit 1
fi

if grep -r "#[0-9a-fA-F]\{6\}" docs/plans/05-design/DASHBOARD_* 2>/dev/null; then
  echo "FAIL: Hardcoded hex values in dashboard specs"
  exit 1
fi

if [ -f "scripts/checks/token-drift.js" ]; then
  node scripts/checks/token-drift.js --strict
fi

pnpm ai:check
echo "Dashboard spec validation passed"
